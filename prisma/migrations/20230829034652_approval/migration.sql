-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Device" (
    "id" TEXT NOT NULL,
    "macAddress" TEXT NOT NULL,
    "firstSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Device_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Device" ("firstSeen", "id", "macAddress", "ownerId") SELECT "firstSeen", "id", "macAddress", "ownerId" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
CREATE UNIQUE INDEX "Device_id_key" ON "Device"("id");
CREATE UNIQUE INDEX "Device_macAddress_key" ON "Device"("macAddress");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
