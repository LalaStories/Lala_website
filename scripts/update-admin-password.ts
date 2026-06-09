/**
 * One-off script: upsert admin user with new credentials.
 * Usage: npx tsx scripts/update-admin-password.ts
 * Prisma automatically reads .env so no dotenv import needed.
 */
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SECRET =
  process.env.ADMIN_JWT_SECRET ||
  "lala-secret-salt-key-2026-dynamic-token-signing";

function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(password, SECRET, 1000, 64, "sha512")
    .toString("hex");
}

async function main() {
  const username = "admin";
  const password = "admin@123";
  const hashedPassword = hashPassword(password);

  console.log(`Upserting admin user: "${username}" ...`);

  await prisma.admin.upsert({
    where: { username },
    update: {
      password: hashedPassword,
      role: "superadmin",
      name: "Super Admin",
    },
    create: {
      username,
      password: hashedPassword,
      role: "superadmin",
      name: "Super Admin",
    },
  });

  console.log("✅ Admin credentials updated successfully.");
  console.log(`   Username : ${username}`);
  console.log(`   Password : ${password}`);
  console.log(`   Role     : superadmin`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
