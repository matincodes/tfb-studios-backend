/*
  Warnings:

  - The values [PENDING_RENDER,REJECTED] on the enum `DesignStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DesignStatus_new" AS ENUM ('UPLOADED', 'RENDERING', 'RENDERED');
ALTER TABLE "Design" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Design" ALTER COLUMN "status" TYPE "DesignStatus_new" USING ("status"::text::"DesignStatus_new");
ALTER TYPE "DesignStatus" RENAME TO "DesignStatus_old";
ALTER TYPE "DesignStatus_new" RENAME TO "DesignStatus";
DROP TYPE "DesignStatus_old";
ALTER TABLE "Design" ALTER COLUMN "status" SET DEFAULT 'UPLOADED';
COMMIT;

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'SHIPPED';

-- AlterTable
ALTER TABLE "Design" ALTER COLUMN "status" SET DEFAULT 'UPLOADED';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "shippingDate" TIMESTAMP(3),
ADD COLUMN     "trackingNumber" TEXT;
