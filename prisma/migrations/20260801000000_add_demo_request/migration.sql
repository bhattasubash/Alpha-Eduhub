-- CreateTable
CREATE TABLE "DemoRequest" (
    "id"         SERIAL NOT NULL,
    "name"       TEXT NOT NULL,
    "email"      TEXT NOT NULL,
    "phone"      TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "role"       TEXT NOT NULL,
    "students"   TEXT NOT NULL,
    "message"    TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoRequest_pkey" PRIMARY KEY ("id")
);
