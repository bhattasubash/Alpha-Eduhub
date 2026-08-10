import { PrismaClient, UserSex, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database cleanup and re-seeding...");

  // 1. Get main school
  const school = await prisma.school.findFirst();
  if (!school) {
    console.error("No school found in database.");
    return;
  }
  const schoolId = school.id;
  console.log(`Target School ID: ${schoolId} (${school.name})`);

  // 2. Clean up all student and teacher dependent records
  console.log("Deleting existing attendance, results, submissions, student fees...");
  await prisma.submission.deleteMany({ where: { schoolId } });
  await prisma.result.deleteMany({ where: { schoolId } });
  await prisma.attendance.deleteMany({ where: { schoolId } });
  await prisma.studentFee.deleteMany({ where: { schoolId } });
  await prisma.classDiary.deleteMany({ where: { schoolId } });

  // 3. Find and delete all existing student and teacher accounts
  const existingStudents = await prisma.student.findMany({ where: { schoolId }, select: { id: true, username: true, email: true } });
  const existingTeachers = await prisma.teacher.findMany({ where: { schoolId }, select: { id: true, username: true, email: true } });

  const studentUsernames = existingStudents.map((s) => s.username);
  const teacherUsernames = existingTeachers.map((t) => t.username);

  console.log(`Found ${existingStudents.length} students and ${existingTeachers.length} teachers to delete.`);

  // Delete student records
  await prisma.student.deleteMany({ where: { schoolId } });
  await prisma.teacher.deleteMany({ where: { schoolId } });

  // Delete corresponding User login records
  await prisma.user.deleteMany({
    where: {
      OR: [
        { username: { in: [...studentUsernames, ...teacherUsernames] } },
        { role: { in: [UserRole.STUDENT, UserRole.TEACHER] }, schoolId },
      ],
    },
  });

  // Ensure default Grade 1 & 2 exist
  let grade1 = await prisma.grade.findFirst({ where: { schoolId, level: 1 } });
  if (!grade1) {
    grade1 = await prisma.grade.create({ data: { level: 1, schoolId } });
  }

  // 4. Create 5 Teachers
  console.log("Creating 5 new teachers...");
  const defaultPasswordHash = await bcrypt.hash("123456", 10);

  const teacherDataList = [
    { name: "Sarah", surname: "Jenkins", username: "teacher1", email: "teacher1@school.com", phone: "555-0101", dept: "Mathematics" },
    { name: "David", surname: "Miller", username: "teacher2", email: "teacher2@school.com", phone: "555-0102", dept: "Science" },
    { name: "Emily", surname: "Davis", username: "teacher3", email: "teacher3@school.com", phone: "555-0103", dept: "English" },
    { name: "Robert", surname: "Wilson", username: "teacher4", email: "teacher4@school.com", phone: "555-0104", dept: "History" },
    { name: "Amanda", surname: "Taylor", username: "teacher5", email: "teacher5@school.com", phone: "555-0105", dept: "Physics" },
  ];

  const createdTeachers: any[] = [];
  for (let i = 0; i < teacherDataList.length; i++) {
    const t = teacherDataList[i];
    const teacherId = `teacher_id_${i + 1}`;

    // Create User login
    await prisma.user.upsert({
      where: { username: t.username },
      update: { passwordHash: defaultPasswordHash, schoolId },
      create: {
        username: t.username,
        email: t.email,
        passwordHash: defaultPasswordHash,
        role: UserRole.TEACHER,
        schoolId,
      },
    });

    // Create Teacher profile
    const teacher = await prisma.teacher.create({
      data: {
        id: teacherId,
        username: t.username,
        name: t.name,
        surname: t.surname,
        email: t.email,
        phone: t.phone,
        address: "123 School Avenue",
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.FEMALE : UserSex.MALE,
        birthday: new Date("1988-06-15"),
        department: t.dept,
        designation: "Senior Faculty",
        schoolId,
      },
    });
    createdTeachers.push(teacher);
  }

  // 5. Create Classes / Sections supervised by Teacher 1 & Teacher 2
  console.log("Setting up classes/sections...");
  // Clear old classes or reuse
  const existingClasses = await prisma.class.findMany({ where: { schoolId } });
  
  let class1 = existingClasses.find((c) => c.name === "1A");
  if (!class1) {
    class1 = await prisma.class.create({
      data: {
        name: "1A",
        capacity: 150,
        supervisorId: createdTeachers[0].id, // Teacher 1
        gradeId: grade1.id,
        schoolId,
      },
    });
  } else {
    class1 = await prisma.class.update({
      where: { id: class1.id },
      data: { supervisorId: createdTeachers[0].id, capacity: 150 },
    });
  }

  let class2 = existingClasses.find((c) => c.name === "1B");
  if (!class2) {
    class2 = await prisma.class.create({
      data: {
        name: "1B",
        capacity: 150,
        supervisorId: createdTeachers[1].id, // Teacher 2
        gradeId: grade1.id,
        schoolId,
      },
    });
  } else {
    class2 = await prisma.class.update({
      where: { id: class2.id },
      data: { supervisorId: createdTeachers[1].id, capacity: 150 },
    });
  }

  // 6. Create 200 Students (100 for Teacher 1's section 1A, 100 for Teacher 2's section 1B)
  console.log("Creating 200 students (100 assigned to Teacher 1, 100 assigned to Teacher 2)...");

  const firstNamesMale = ["Alex", "Benjamin", "Charles", "Daniel", "Ethan", "Frank", "George", "Henry", "Ian", "Jack", "Kevin", "Liam", "Michael", "Noah", "Oliver", "Peter", "Ryan", "Samuel", "Thomas", "William"];
  const firstNamesFemale = ["Abigail", "Emma", "Grace", "Hannah", "Isla", "Julia", "Katherine", "Lily", "Mia", "Nora", "Olivia", "Penelope", "Rose", "Sophia", "Victoria", "Zoe", "Chloe", "Ella", "Harper", "Maya"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

  const studentsToCreate: any[] = [];
  const usersToCreate: any[] = [];

  for (let i = 1; i <= 200; i++) {
    const isTeacher1Group = i <= 100;
    const targetClassId = isTeacher1Group ? class1.id : class2.id;
    const targetSection = isTeacher1Group ? "1A" : "1B";
    const isMale = i % 2 === 0;

    const fnList = isMale ? firstNamesMale : firstNamesFemale;
    const firstName = fnList[(i - 1) % fnList.length];
    const lastName = lastNames[(i - 1) % lastNames.length];
    const username = `std_${i.toString().padStart(3, "0")}`;
    const studentId = `student_id_${i}`;
    const email = `student${i}@school.com`;
    const rollNum = `R-${1000 + i}`;
    const admNum = `ADM-${202600 + i}`;

    usersToCreate.push({
      username,
      email,
      passwordHash: defaultPasswordHash,
      role: UserRole.STUDENT,
      schoolId,
    });

    studentsToCreate.push({
      id: studentId,
      username,
      name: firstName,
      surname: lastName,
      email,
      phone: `555-${(2000 + i).toString()}`,
      address: `${i} Student Street, City`,
      bloodType: i % 4 === 0 ? "A+" : i % 4 === 1 ? "B+" : i % 4 === 2 ? "O+" : "AB+",
      sex: isMale ? UserSex.MALE : UserSex.FEMALE,
      birthday: new Date("2009-03-20"),
      classId: targetClassId,
      gradeId: grade1.id,
      schoolId,
      section: targetSection,
      rollNumber: rollNum,
      admissionNumber: admNum,
      tempPassword: "123456",
      forcePasswordChange: false,
    });
  }

  // Execute bulk user inserts
  console.log("Writing student accounts to database...");
  for (const user of usersToCreate) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: { passwordHash: user.passwordHash, schoolId: user.schoolId },
      create: user,
    });
  }

  // Execute student profile inserts
  for (const student of studentsToCreate) {
    await prisma.student.create({
      data: student,
    });
  }

  console.log("Successfully created 5 Teachers and 200 Students!");
  console.log(" - Teacher 1 (Sarah Jenkins) assigned 100 students in Section 1A.");
  console.log(" - Teacher 2 (David Miller) assigned 100 students in Section 1B.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
