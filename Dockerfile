# Next.js 16 requires Node >= 20.9 — see node_modules/next/package.json engines.
# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
# The postinstall hook runs `prisma generate`, so the schema must be present
# before npm ci — otherwise the install fails with "schema not found".
COPY prisma ./prisma
RUN npm ci

# Stage 2: Rebuild the source code
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# NEXT_PUBLIC_* values are inlined into the client bundle at build time,
# so they must be present here — passing them only at runtime leaves them
# undefined in the browser. On Railway, add this under Build-time Variables.
ARG NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=""
ENV NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=$NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
# Optional override for the site Meta Pixel. Empty (the default) means the
# Lala pixel hardcoded in src/lib/meta-pixel.ts — that file treats "" as unset.
ARG NEXT_PUBLIC_META_PIXEL_ID=""
ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID

# Build Next.js in production standalone mode
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public static files
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built server standalone outputs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# Prisma CLI and engines, so the container can apply migrations on boot
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Baseline if needed, apply pending migrations, then start the server.
# A failed migration stops the boot rather than serving against a
# mismatched schema. See scripts/db-deploy.mjs for the baseline logic.
CMD ["sh", "-c", "node scripts/db-deploy.mjs && node server.js"]
