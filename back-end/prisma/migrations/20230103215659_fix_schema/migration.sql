/*
  Warnings:

  - You are about to drop the `_CollaboratorsToTimeTracker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TasksToTimeTracker` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `taskId` to the `TimeTracker` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_CollaboratorsToTimeTracker_B_index";

-- DropIndex
DROP INDEX "_CollaboratorsToTimeTracker_AB_unique";

-- DropIndex
DROP INDEX "_TasksToTimeTracker_B_index";

-- DropIndex
DROP INDEX "_TasksToTimeTracker_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CollaboratorsToTimeTracker";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_TasksToTimeTracker";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeTracker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "timeZoneId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "collaboratorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "TimeTracker_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeTracker_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborators" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TimeTracker" ("collaboratorId", "createdAt", "deletedAt", "endDate", "id", "startDate", "timeZoneId", "updatedAt") SELECT "collaboratorId", "createdAt", "deletedAt", "endDate", "id", "startDate", "timeZoneId", "updatedAt" FROM "TimeTracker";
DROP TABLE "TimeTracker";
ALTER TABLE "new_TimeTracker" RENAME TO "TimeTracker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
