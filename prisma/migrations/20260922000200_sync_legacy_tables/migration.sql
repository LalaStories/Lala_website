-- Columns and tables that already exist in the live database but were
-- never represented in schema.prisma. Declaring them keeps schema and
-- database in sync, so a future migration can never drop them.
--
-- On the live database these already exist and this migration is
-- baselined; on a new database it runs normally. See scripts/db-deploy.mjs.

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "galleryImages" TEXT NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "ProgramApplication" ADD COLUMN "certificateUrl" TEXT;

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "favStory" TEXT NOT NULL DEFAULT '',
    "photoUrl" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorVisionPlate" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT,
    "correctAnswer" TEXT NOT NULL,
    "choices" TEXT NOT NULL,
    "hint" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ColorVisionPlate_pkey" PRIMARY KEY ("id")
);
