/*
  Warnings:

  - You are about to drop the `Movements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Movements" DROP CONSTRAINT "Movements_extract_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Movements" DROP CONSTRAINT "Movements_shopping_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Movements" DROP CONSTRAINT "Movements_user_id_fkey";

-- DropTable
DROP TABLE "public"."Movements";

-- CreateTable
CREATE TABLE "public"."movements" (
    "id" TEXT NOT NULL,
    "type" "public"."TypeMovement" NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "deu_date" TIMESTAMP(3) NOT NULL,
    "installment" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "extract_id" TEXT,
    "shopping_id" TEXT,

    CONSTRAINT "movements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."movements" ADD CONSTRAINT "movements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movements" ADD CONSTRAINT "movements_extract_id_fkey" FOREIGN KEY ("extract_id") REFERENCES "public"."extracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movements" ADD CONSTRAINT "movements_shopping_id_fkey" FOREIGN KEY ("shopping_id") REFERENCES "public"."shopping"("id") ON DELETE SET NULL ON UPDATE CASCADE;
