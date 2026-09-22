-- Programs and background videos were added to the schema but never
-- captured in a migration. On a database that predates migrations these
-- tables already exist, so this migration is baselined rather than run —
-- see scripts/db-deploy.mjs.

-- CreateTable
CREATE TABLE "BgVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BgVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "imageUrl" TEXT,
    "qrImageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "formFields" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramRegistration" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "responses" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramRegistration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProgramRegistration" ADD CONSTRAINT "ProgramRegistration_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
