/**
 * Create or reset an admin user.
 *
 * Credentials are read from the environment so they are never committed:
 *   ADMIN_USERNAME=admin ADMIN_PASSWORD='your-password' npx tsx scripts/update-admin-password.ts
 *
 * Run this after rotating ADMIN_JWT_SECRET — the secret salts every password
 * hash, so existing passwords stop working the moment it changes.
 *
 * Prisma loads .env automatically, so no dotenv import is needed.
 */
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SECRET = process.env.ADMIN_JWT_SECRET;

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, SECRET as string, 1000, 64, "sha512").toString("hex");
}

async function main() {
  if (!SECRET) {
    throw new Error(
      "ADMIN_JWT_SECRET is not set. It must match the value the app runs with, " +
        "or the new password will not verify at login."
    );
  }

  const username = (process.env.ADMIN_USERNAME || "admin").trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is required.\n" +
        "Usage: ADMIN_PASSWORD='your-password' npx tsx scripts/update-admin-password.ts"
    );
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  await prisma.admin.upsert({
    where: { username },
    update: {
      password: hashPassword(password),
      role: "superadmin",
      name: "Super Admin",
    },
    create: {
      username,
      password: hashPassword(password),
      role: "superadmin",
      name: "Super Admin",
    },
  });

  // The password itself is deliberately not logged.
  console.log("✅ Admin credentials updated.");
  console.log(`   Username : ${username}`);
  console.log(`   Role     : superadmin`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
