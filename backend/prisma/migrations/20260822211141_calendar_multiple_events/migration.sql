/*
  Warnings:

  - A unique constraint covering the columns `[userId,provider,providerAccountEmail]` on the table `CalendarConnection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CalendarConnection_userId_provider_key";

-- CreateIndex
CREATE UNIQUE INDEX "CalendarConnection_userId_provider_providerAccountEmail_key" ON "CalendarConnection"("userId", "provider", "providerAccountEmail");
