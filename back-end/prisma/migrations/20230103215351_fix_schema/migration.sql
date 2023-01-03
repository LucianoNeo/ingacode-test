/*
  Warnings:

  - You are about to drop the column `taskId` on the `TimeTracker` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_CollaboratorsToTimeTracker" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CollaboratorsToTimeTracker_A_fkey" FOREIGN KEY ("A") REFERENCES "Collaborators" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CollaboratorsToTimeTracker_B_fkey" FOREIGN KEY ("B") REFERENCES "TimeTracker" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TasksToTimeTracker" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TasksToTimeTracker_A_fkey" FOREIGN KEY ("A") REFERENCES "Tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TasksToTimeTracker_B_fkey" FOREIGN KEY ("B") REFERENCES "TimeTracker" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeTracker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "timeZoneId" TEXT NOT NULL,
    "collaboratorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_TimeTracker" ("collaboratorId", "createdAt", "deletedAt", "endDate", "id", "startDate", "timeZoneId", "updatedAt") SELECT "collaboratorId", "createdAt", "deletedAt", "endDate", "id", "startDate", "timeZoneId", "updatedAt" FROM "TimeTracker";
DROP TABLE "TimeTracker";
ALTER TABLE "new_TimeTracker" RENAME TO "TimeTracker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_CollaboratorsToTimeTracker_AB_unique" ON "_CollaboratorsToTimeTracker"("A", "B");

-- CreateIndex
CREATE INDEX "_CollaboratorsToTimeTracker_B_index" ON "_CollaboratorsToTimeTracker"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TasksToTimeTracker_AB_unique" ON "_TasksToTimeTracker"("A", "B");

-- CreateIndex
CREATE INDEX "_TasksToTimeTracker_B_index" ON "_TasksToTimeTracker"("B");
