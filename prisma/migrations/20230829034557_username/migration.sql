/*
  Warnings:

  - Added the required column `username` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "firstVisited" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "terminatedStatus" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Account" ("firstVisited", "id", "name", "terminatedStatus") SELECT "firstVisited", "id", "name", "terminatedStatus" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
