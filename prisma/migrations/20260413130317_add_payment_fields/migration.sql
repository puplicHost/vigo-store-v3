-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "isCodEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isStripeEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTestMode" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stripePublicKey" TEXT,
ADD COLUMN     "stripeSecretKey" TEXT;
