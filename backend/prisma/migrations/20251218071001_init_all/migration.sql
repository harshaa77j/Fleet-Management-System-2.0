-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "KeyStatus" AS ENUM ('ACTIVE','USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "company_id" UUID NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "address" VARCHAR(255),
    "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_admin_id" UUID,
    "activationKeyId" UUID NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "ActivationKey" (
    "key_id" UUID NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "plan" VARCHAR(100),
    "licence_type" VARCHAR(100),
    "start_date" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "status" "KeyStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "ActivationKey_pkey" PRIMARY KEY ("key_id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "manager_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" VARCHAR(255),
    "phone" VARCHAR(20),
    "address" VARCHAR(255),
    "companyId" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("manager_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_activationKeyId_key" ON "Company"("activationKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivationKey_key_key" ON "ActivationKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_created_by_admin_id_fkey" FOREIGN KEY ("created_by_admin_id") REFERENCES "Admin"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_activationKeyId_fkey" FOREIGN KEY ("activationKeyId") REFERENCES "ActivationKey"("key_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;
