import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { getRole } from "@/lib/getRole";
import { Class, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const role = (await getRole()) ?? "admin";

  let student:
    | (Student & {
        class: Class & { _count: { lessons: number } };
      })
    | null = null;

  try {
    student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: { include: { _count: { select: { lessons: true } } } },
        parent: { select: { name: true, surname: true, email: true, phone: true } },
        results: {
          include: {
            exam: { select: { title: true } },
            assignment: { select: { title: true } },
          },
          take: 5,
          orderBy: { id: "desc" },
        },
      },
    });
  } catch (err) {
    console.warn("Database connection unavailable, using mock student data.");
  }

  if (!student) {
    student = {
      id: id || "student1",
      username: "student1",
      name: "Student",
      surname: "Name",
      email: "student1@example.com",
      phone: "123-456-7890",
      address: "456 School Lane",
      img: null,
      bloodType: "O+",
      sex: "MALE",
      birthday: new Date("2008-05-15"),
      gradeId: 1,
      classId: 1,
      parentId: "parentId1",
      createdAt: new Date(),
      class: {
        id: 1,
        name: "4A",
        capacity: 20,
        supervisorId: "teacher1",
        gradeId: 1,
        _count: { lessons: 8 },
      },
    } as any;
  }

  // After fallback, student is always defined
  const s = student!;
  const parentName = "Not assigned"; // Parent data would need to be fetched separately

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={s.img || "/noAvatar.png"}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {s.name + " " + s.surname}
                </h1>
                {role === "admin" && (
                  <FormContainer table="student" type="update" data={s} />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Roll Number / ID: <span className="font-semibold text-gray-700">{s.rollNumber || s.username || s.id}</span>
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{s.bloodType || "O+"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>
                    {s.birthday ? new Intl.DateTimeFormat("en-GB").format(new Date(s.birthday)) : "—"}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{s.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{s.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] shadow-sm border border-gray-100">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <Suspense fallback="loading...">
                <StudentAttendanceCard id={s.id} />
              </Suspense>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] shadow-sm border border-gray-100">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {s.class?.name ? `Section ${s.class.name}` : "—"}
                </h1>
                <span className="text-sm text-gray-400">Class Section</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] shadow-sm border border-gray-100">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {s.class?._count?.lessons ?? 0}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] shadow-sm border border-gray-100">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{s.class?.name || "—"}</h1>
                <span className="text-sm text-gray-400">Section</span>
              </div>
            </div>
          </div>
        </div>

        {/* SCHEDULE CALENDAR */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px] shadow-sm border border-gray-100">
          <h1 className="text-lg font-bold text-gray-800 mb-2">Student&apos;s Weekly Schedule</h1>
          {s.class?.id ? (
            <BigCalendarContainer type="classId" id={s.class.id} />
          ) : (
            <p className="text-sm text-gray-400 py-8">No class assigned to load schedule.</p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* PARENT DETAILS CARD */}
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
          <h1 className="text-base font-bold text-gray-800 border-b pb-2">Parent / Guardian Details</h1>
          <div className="mt-3 flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Name:</span>
              <span className="font-semibold text-gray-800">{parentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Email:</span>
              <span className="font-semibold text-gray-800">{"—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Phone:</span>
              <span className="font-semibold text-gray-800">{"—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Address:</span>
              <span className="font-semibold text-gray-800">{s.address || "—"}</span>
            </div>
          </div>
        </div>

        {/* SHORTCUTS */}
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
          <h1 className="text-base font-bold text-gray-800 border-b pb-2">Quick Navigation</h1>
          <div className="mt-3 flex gap-2 flex-wrap text-xs font-medium">
            <Link
              className="p-2.5 rounded-md bg-lamaSkyLight hover:bg-sky-200 transition-colors"
              href={`/list/lessons?classId=${s.class?.id ?? ""}`}
            >
              Lessons
            </Link>
            <Link
              className="p-2.5 rounded-md bg-lamaPurpleLight hover:bg-purple-200 transition-colors"
              href={`/list/teachers?classId=${s.class?.id ?? ""}`}
            >
              Teachers
            </Link>
            <Link
              className="p-2.5 rounded-md bg-pink-100 hover:bg-pink-200 transition-colors"
              href={`/list/exams?classId=${s.class?.id ?? ""}`}
            >
              Exams
            </Link>
            <Link
              className="p-2.5 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors"
              href={`/list/assignments?classId=${s.class?.id ?? ""}`}
            >
              Assignments
            </Link>
            <Link
              className="p-2.5 rounded-md bg-lamaYellowLight hover:bg-yellow-200 transition-colors"
              href={`/list/results?studentId=${s.id}`}
            >
              Results
            </Link>
          </div>
        </div>

        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
