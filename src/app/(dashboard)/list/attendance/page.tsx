import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TableSortModal, { SortOption } from "@/components/TableSortModal";
import ClassFilterPills from "@/components/ClassFilterPills";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole, getCurrentSchoolId, getCurrentUserId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

const attendanceSortOptions: SortOption[] = [
  { label: "Date (Newest first)", field: "date", order: "desc" },
  { label: "Date (Oldest first)", field: "date", order: "asc" },
];

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const [role, schoolId, userId] = await Promise.all([getRole(), getCurrentSchoolId(), getCurrentUserId()]);
  const { page, search, sortField, sortOrder, sort, classId } = searchParams;
  const p = page ? parseInt(page) : 1;
  const order: "asc" | "desc" = (sortOrder === "asc" || sort === "asc") ? "asc" : "desc";

  const where: Prisma.AttendanceWhereInput = {
    ...(schoolId ? { schoolId } : {}),
    ...(classId ? { lesson: { classId: parseInt(classId) } } : {}),
    ...(role === "student" && userId ? { studentId: userId } : {}),
    ...(role === "teacher" && userId ? { lesson: { teacherId: userId } } : {}),
    ...(search ? {
      student: {
        OR: [
          { name:    { contains: search, mode: "insensitive" } },
          { surname: { contains: search, mode: "insensitive" } },
        ],
      },
    } : {}),
  };

  const [data, count, classList] = await Promise.all([
    prisma.attendance.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, surname: true, img: true } },
        lesson:  { include: { class: { select: { name: true } }, teacher: { select: { name: true, surname: true } } } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { date: order },
    }),
    prisma.attendance.count({ where }),
    prisma.class.findMany({
      where: schoolId ? { schoolId } : {},
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const columns = [
    { header: "Student Name", accessor: "studentName" },
    { header: "Section",      accessor: "class" },
    { header: "Submitted By Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Date",         accessor: "date",   className: "hidden md:table-cell" },
    { header: "Status",       accessor: "status" },
    ...(role === "admin" || role === "teacher"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item: typeof data[number]) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-3 p-4 font-medium">
        <Image
          src={item.student.img || "/noAvatar.png"}
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover"
        />
        <Link
          href={`/list/students/${item.student.id}`}
          className="hover:underline text-blue-600 font-semibold"
        >
          {item.student.name} {item.student.surname}
        </Link>
      </td>
      <td>
        {item.lesson?.class?.name ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            Section {item.lesson.class.name}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>
      <td className="hidden md:table-cell">
        {item.lesson?.teacher ? (
          <span className="text-xs text-gray-700 font-medium">
            {item.lesson.teacher.name} {item.lesson.teacher.surname}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.date)}</td>
      <td>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          item.present ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {item.present ? "Present" : "Absent"}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">Teacher Submitted Attendance</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end">
            <TableSortModal options={attendanceSortOptions} />
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <ClassFilterPills classes={classList} selectedClassId={classId} />

      {data.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No attendance records found for the selected section.</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;
