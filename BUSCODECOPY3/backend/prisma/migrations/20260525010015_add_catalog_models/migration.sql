-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyUserId" TEXT NOT NULL,
    "companySlug" TEXT NOT NULL,
    "departureCity" TEXT NOT NULL,
    "arrivalCity" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME NOT NULL,
    "price" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "busType" TEXT NOT NULL DEFAULT 'Standard',
    "gares" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Trip_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SpecialOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyUserId" TEXT,
    "companySlug" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discountCode" TEXT,
    "discountPercentage" INTEGER,
    "lineName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SpecialOffer_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JobOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyUserId" TEXT,
    "companySlug" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JobOffer_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "companySlug" TEXT,
    "companyName" TEXT,
    "address" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "rating" REAL NOT NULL DEFAULT 4,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("address", "companyName", "companySlug", "createdAt", "description", "email", "firstName", "id", "lastName", "password", "phone", "role", "updatedAt") SELECT "address", "companyName", "companySlug", "createdAt", "description", "email", "firstName", "id", "lastName", "password", "phone", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_companySlug_key" ON "User"("companySlug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Trip_companySlug_idx" ON "Trip"("companySlug");

-- CreateIndex
CREATE INDEX "Trip_departureCity_arrivalCity_idx" ON "Trip"("departureCity", "arrivalCity");
