-- CreateTable
CREATE TABLE "CompanyDetails" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" INTEGER,
    "email" TEXT,
    "CIN" TEXT,
    "IECode" TEXT,
    "GSTIN" TEXT,
    "telephone" INTEGER,

    CONSTRAINT "CompanyDetails_pkey" PRIMARY KEY ("id")
);
