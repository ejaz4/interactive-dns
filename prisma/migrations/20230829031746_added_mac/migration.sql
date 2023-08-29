/*
  Warnings:

  - Added the required column `macAddress` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Device" (
    "id" TEXT NOT NULL,
    "macAddress" TEXT NOT NULL,
    "firstSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Device_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Device" ("firstSeen", "id", "ownerId") SELECT "firstSeen", "id", "ownerId" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
CREATE UNIQUE INDEX "Device_id_key" ON "Device"("id");
CREATE UNIQUE INDEX "Device_macAddress_key" ON "Device"("macAddress");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
