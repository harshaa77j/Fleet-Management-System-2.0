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

-- CreateIndex
CREATE UNIQUE INDEX "PasswordToken_token_hash_key" ON "PasswordToken"("token_hash");

-- AddForeignKey
ALTER TABLE "PasswordToken" ADD CONSTRAINT "PasswordToken_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Manager"("manager_id") ON DELETE RESTRICT ON UPDATE CASCADE;
