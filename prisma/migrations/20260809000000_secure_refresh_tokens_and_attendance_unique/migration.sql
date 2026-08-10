-- Legacy raw-token sessions remain usable once and are upgraded during refresh.
ALTER TABLE "RefreshToken" ALTER COLUMN "token" DROP NOT NULL;
ALTER TABLE "RefreshToken" ADD COLUMN "tokenHash" TEXT;
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX "Attendance_studentId_lessonId_date_key"
  ON "Attendance"("studentId", "lessonId", "date");
CREATE INDEX "Attendance_schoolId_date_idx" ON "Attendance"("schoolId", "date");
