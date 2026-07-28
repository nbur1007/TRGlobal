/*
  Warnings:

  - Made the column `imageUrl` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "imageUrl" SET DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSnC-p8pxkiH1VVPzbafjrFEoR8w9_mEA0tG9pzCL3QeRn-8X1Ni-blcs&s=10';
