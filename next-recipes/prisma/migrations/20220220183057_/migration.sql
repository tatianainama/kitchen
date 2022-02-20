-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('MASS', 'VOL');

-- CreateEnum
CREATE TYPE "UnitName" AS ENUM ('CUP', 'TBSP', 'TSP', 'STICK', 'G', 'ML', 'L', 'OZ', 'LB', 'PINT', 'GAL', 'UNIT', 'PINCH', 'TO_TASTE', 'CLOVES');

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "summary" TEXT,
    "url" TEXT,
    "video" TEXT,
    "prepTime" TEXT NOT NULL,
    "cookTime" TEXT NOT NULL,
    "totalTime" TEXT,
    "yields" TEXT NOT NULL,
    "tags" TEXT[],
    "course" TEXT[],
    "authorId" INTEGER,
    "instructions" TEXT[],

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "ingredient" TEXT NOT NULL,
    "quantity" TEXT,
    "unit" TEXT,
    "note" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "original" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IngredientToRecipe" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_slug_key" ON "Recipe"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_name_authorId_key" ON "Recipe"("name", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Author_website_key" ON "Author"("website");

-- CreateIndex
CREATE UNIQUE INDEX "_IngredientToRecipe_AB_unique" ON "_IngredientToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_IngredientToRecipe_B_index" ON "_IngredientToRecipe"("B");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientToRecipe" ADD FOREIGN KEY ("A") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientToRecipe" ADD FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
