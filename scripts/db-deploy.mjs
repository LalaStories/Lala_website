/**
 * Apply migrations safely on every kind of database.
 *
 * This project's production database was created with `prisma db push`, so
 * it has tables but no _prisma_migrations history. `prisma migrate deploy`
 * refuses to touch such a database (error P3005) — which is exactly what
 * broke the first Vercel build after migrations were introduced.
 *
 * So: if the database already has our tables but no migration history,
 * baseline it first by marking as applied only those migrations whose
 * tables are already present. Everything after that runs normally.
 *
 * Safe to run repeatedly, and on a brand new empty database.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, existsSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

// The Docker runner ships a minimal node_modules with no .bin shims, so
// `npx prisma` is not resolvable there. Call the CLI entrypoint directly
// when it is present and fall back to npx everywhere else.
const PRISMA_CLI = "node_modules/prisma/build/index.js";

/** A table created by each migration — used to detect what already exists. */
const MIGRATION_PROBE_TABLE = {
  "20260606090254_init": "Story",
  "20260606091524_init_admin_models": "Admin",
  "20260922000000_init_postgres": "Program",
  "20260922000100_add_landing_pages": "LandingPage",
  "20260922000200_sync_legacy_tables": "TeamMember",
};

function prisma(...args) {
  if (existsSync(PRISMA_CLI)) {
    execFileSync(process.execPath, [PRISMA_CLI, ...args], { stdio: "inherit" });
  } else {
    execFileSync("npx", ["prisma", ...args], { stdio: "inherit" });
  }
}

async function tableExists(db, name) {
  const rows = await db.$queryRaw`
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = ${name} LIMIT 1
  `;
  return rows.length > 0;
}

async function main() {
  const db = new PrismaClient();

  try {
    const hasHistory = await tableExists(db, "_prisma_migrations");

    if (!hasHistory) {
      // Any of our tables present without history means this database
      // predates migrations and must be baselined before deploying.
      const probes = Object.values(MIGRATION_PROBE_TABLE);
      const present = [];
      for (const t of probes) {
        if (await tableExists(db, t)) present.push(t);
      }

      if (present.length > 0) {
        console.log(
          `Existing database detected without migration history (found: ${present.join(", ")}).`
        );
        console.log("Baselining migrations whose tables already exist…");

        // Migration folder names sort chronologically.
        const names = readdirSync("prisma/migrations", { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .map((d) => d.name)
          .sort();

        for (const name of names) {
          const probe = MIGRATION_PROBE_TABLE[name];
          // Unknown migrations are left for migrate deploy to apply.
          if (!probe) continue;
          if (await tableExists(db, probe)) {
            console.log(`  baseline (already applied): ${name}`);
            prisma("migrate", "resolve", "--applied", name);
          } else {
            console.log(`  will apply: ${name}`);
          }
        }
      } else {
        console.log("Empty database — applying all migrations from scratch.");
      }
    }
  } finally {
    await db.$disconnect();
  }

  prisma("migrate", "deploy");
}

main().catch((err) => {
  console.error("Database deploy failed:", err?.message || err);
  process.exit(1);
});
