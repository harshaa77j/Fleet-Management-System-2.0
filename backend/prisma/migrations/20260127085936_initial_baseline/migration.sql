-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "KeyStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'USED');

-- CreateEnum
CREATE TYPE "WorkerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'HALF_DAY');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ACTIVE', 'IN_MAINTENANCE', 'RETIRED');

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
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- CreateTable
CREATE TABLE "PasswordToken" (
    "token_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "manager_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordToken_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "worker_id" UUID NOT NULL,
    "biometric_id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "address" VARCHAR(255),
    "manager_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "blood_group" TEXT,
    "dependents" INTEGER,
    "dob" TIMESTAMP(3),
    "age" INTEGER,
    "status" "WorkerStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("worker_id")
);

-- CreateTable
CREATE TABLE "WorkerStats" (
    "worker_stats_id" UUID NOT NULL,
    "worker_id" UUID NOT NULL,
    "biometric_id" VARCHAR(100) NOT NULL,
    "attendance_status" "AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "vehicle_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkerStats_pkey" PRIMARY KEY ("worker_stats_id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "vehicle_id" UUID NOT NULL,
    "device_id" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "manufacturer" VARCHAR(100) NOT NULL,
    "battery_capacity_ah" DOUBLE PRECISION,
    "nominal_voltage_v" DOUBLE PRECISION,
    "status" "VehicleStatus" NOT NULL DEFAULT 'ACTIVE',
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("vehicle_id")
);

-- CreateTable
CREATE TABLE "VehicleStats" (
    "vehicle_stats_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "device_id" VARCHAR(100) NOT NULL,
    "recorded_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worker_id" UUID,
    "biometric_id" VARCHAR(100),
    "authenticated" BOOLEAN NOT NULL DEFAULT false,
    "at_rate_time_empty" INTEGER,
    "current_ma" DOUBLE PRECISION,
    "cycle_count" INTEGER,
    "full_charge_capacity_mah" DOUBLE PRECISION,
    "remaining_capacity_mah" DOUBLE PRECISION,
    "soc_percent" DOUBLE PRECISION,
    "soh_percent" DOUBLE PRECISION,
    "standby_time_min" INTEGER,
    "temperature_c" DOUBLE PRECISION,
    "time_to_empty_min" INTEGER,
    "time_to_full_min" INTEGER,
    "voltage_mv" DOUBLE PRECISION,

    CONSTRAINT "VehicleStats_pkey" PRIMARY KEY ("vehicle_stats_id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "maintenance_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "device_id" VARCHAR(100) NOT NULL,
    "maintenance_type" VARCHAR(100) NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "cost" DOUBLE PRECISION,
    "previous_cost" DOUBLE PRECISION,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("maintenance_id")
);

-- CreateTable
CREATE TABLE "DailyVehicleReport" (
    "report_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "device_id" VARCHAR(100) NOT NULL,
    "report_date" DATE NOT NULL,
    "avg_soc_percent" DOUBLE PRECISION,
    "avg_soh_percent" DOUBLE PRECISION,
    "avg_voltage_mv" DOUBLE PRECISION,
    "avg_current_ma" DOUBLE PRECISION,
    "avg_temp_c" DOUBLE PRECISION,
    "min_soc_percent" DOUBLE PRECISION,
    "max_soc_percent" DOUBLE PRECISION,
    "min_voltage_mv" DOUBLE PRECISION,
    "max_voltage_mv" DOUBLE PRECISION,
    "max_temp_c" DOUBLE PRECISION,
    "total_cycle_count" INTEGER,
    "operating_hours" DOUBLE PRECISION,
    "total_charge_time_min" INTEGER,
    "total_runtime_min" INTEGER,
    "primary_worker_id" UUID,
    "primary_biometric_id" VARCHAR(100),
    "authentication_rate" DOUBLE PRECISION,
    "data_points_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyVehicleReport_pkey" PRIMARY KEY ("report_id")
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

-- CreateIndex
CREATE UNIQUE INDEX "PasswordToken_token_hash_key" ON "PasswordToken"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_biometric_id_key" ON "Worker"("biometric_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_device_id_key" ON "Vehicle"("device_id");

-- CreateIndex
CREATE INDEX "VehicleStats_vehicle_id_recorded_at_idx" ON "VehicleStats"("vehicle_id", "recorded_at");

-- CreateIndex
CREATE INDEX "DailyVehicleReport_report_date_idx" ON "DailyVehicleReport"("report_date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyVehicleReport_vehicle_id_report_date_key" ON "DailyVehicleReport"("vehicle_id", "report_date");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_activationKeyId_fkey" FOREIGN KEY ("activationKeyId") REFERENCES "ActivationKey"("key_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_created_by_admin_id_fkey" FOREIGN KEY ("created_by_admin_id") REFERENCES "Admin"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordToken" ADD CONSTRAINT "PasswordToken_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Manager"("manager_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Manager"("manager_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerStats" ADD CONSTRAINT "WorkerStats_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("worker_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleStats" ADD CONSTRAINT "VehicleStats_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleStats" ADD CONSTRAINT "VehicleStats_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("worker_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyVehicleReport" ADD CONSTRAINT "DailyVehicleReport_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyVehicleReport" ADD CONSTRAINT "DailyVehicleReport_primary_worker_id_fkey" FOREIGN KEY ("primary_worker_id") REFERENCES "Worker"("worker_id") ON DELETE SET NULL ON UPDATE CASCADE;
