/*
  Warnings:

  - Made the column `taskId` on table `TimeTracker` required. This step will fail if there are existing NULL values in that column.

*/
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
INSERT INTO "new_TimeTracker" ("collaboratorId", "createdAt", "deletedAt", "endDate", "id", "startDate", "taskId", "timeZoneId", "updatedAt") SELECT "collaboratorId", "createdAt", "deletedAt", "endDate", "id", "startDate", "taskId", "timeZoneId", "updatedAt" FROM "TimeTracker";
DROP TABLE "TimeTracker";
ALTER TABLE "new_TimeTracker" RENAME TO "TimeTracker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
