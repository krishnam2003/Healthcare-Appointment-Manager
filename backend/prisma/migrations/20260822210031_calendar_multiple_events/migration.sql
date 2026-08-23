/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId,calendarConnectionId]` on the table `CalendarEvent` will be added. If there are existing duplicate values, this will fail.
  - Made the column `calendarConnectionId` on table `CalendarEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CalendarEvent" DROP CONSTRAINT "CalendarEvent_calendarConnectionId_fkey";

-- DropIndex
DROP INDEX "CalendarEvent_appointmentId_key";

-- AlterTable
ALTER TABLE "CalendarEvent" ALTER COLUMN "calendarConnectionId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "CalendarEvent_appointmentId_idx" ON "CalendarEvent"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEvent_appointmentId_calendarConnectionId_key" ON "CalendarEvent"("appointmentId", "calendarConnectionId");

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_calendarConnectionId_fkey" FOREIGN KEY ("calendarConnectionId") REFERENCES "CalendarConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
