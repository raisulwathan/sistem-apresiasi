-- CreateTable
CREATE TABLE "Ttd" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Ttd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ttd_id_key" ON "Ttd"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ttd_userId_key" ON "Ttd"("userId");

-- AddForeignKey
ALTER TABLE "Ttd" ADD CONSTRAINT "Ttd_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
