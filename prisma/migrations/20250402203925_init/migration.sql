-- CreateEnum
CREATE TYPE "Status" AS ENUM ('FIELD', 'BENCH');

-- CreateTable
CREATE TABLE "Puppy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "breedId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'BENCH',
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Puppy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breed" (
    "id" SERIAL NOT NULL,
    "breed" TEXT NOT NULL,

    CONSTRAINT "Breed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Puppy" ADD CONSTRAINT "Puppy_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
