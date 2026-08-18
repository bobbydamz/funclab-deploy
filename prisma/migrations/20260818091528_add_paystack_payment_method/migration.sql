-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'PAYSTACK';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paystackReference" TEXT;
