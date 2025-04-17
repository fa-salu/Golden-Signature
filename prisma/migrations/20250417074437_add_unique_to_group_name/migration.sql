/*
  Warnings:

  - A unique constraint covering the columns `[groupName]` on the table `group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "group_groupName_key" ON "group"("groupName");
