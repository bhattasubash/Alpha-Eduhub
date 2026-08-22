import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TableSortModal, { SortOption } from "@/components/TableSortModal";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole, getCurrentSchoolId, getCurrentUserId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';

const lessonSortOptions: SortOption[] = [
  { label: "Lesson Name (A to Z)", field: "name", order: "asc" },
  { label: "Lesson Name (Z to A)", field: "name", order: "desc" },
  { label: "Day of Week",          field: "day",  order: "asc" },
];

const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const [role, schoolId, userId] = await Promise.all([getRole(), getCurrentSchoolId(), getCurrentUserId()]);
  const { page, search, sortField, sortOrder, sort } = searchParams;
  const p = page ? parseInt(page) : 1;

  const field = sortField || "name";
  const order: "asc" | "desc" = (sortOrder === "desc" || sort === "desc") ? "desc" : "asc";

  let orderBy: Prisma.LessonOrderByWithRelationInput = { name: order };
  if (field === "day") orderBy = { day: order };

  const where: Prisma.LessonWhereInput = {
    ...(schoolId ? { schoolId } : {}),
    ...(role === "teacher" && userId ? { teacherId: userId } : {}),
    ...(search ? {
      OR: [
        { name:    { contains: search, mode: "insensitive" } },
        { subject: { name: { contains: search, mode: "insensitive" } } },
      ],
    } : {}),
  };

  let data: any[] = [];
  let count = 0;

  try {
    [data, count] = await Promise.all([
      prisma.lesson.findMany({
        where,
        include: {
          subject: { select: { name: true } },
          class:   { select: { name: true } },
          teacher: { select: { name: true, surname: true } },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy,
      }),
      prisma.lesson.count({ where }),
    ]);
  } catch (error) {
    console.error("Database connection failed in LessonListPage:", error);
  }

  const columns = [
    { header: "Subject",  accessor: "name" },
    { header: "Class",    accessor: "class" },
    { header: "Teacher",  accessor: "teacher",  className: "hidden md:table-cell" },
    { header: "Day",      accessor: "day",      className: "hidden md:table-cell" },
    ...(role === "admin" || role === "teacher"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item: typeof data[number]) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4 font-medium">{item.subject.name} — {item.name}</td>
      <td>{item.class.name}</td>
      <td className="hidden md:table-cell">{item.teacher.name} {item.teacher.surname}</td>
      <td className="hidden md:table-cell capitalize">{item.day.toLowerCase()}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="lesson" type="update" data={item} />
              <FormContainer table="lesson" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end">
            <TableSortModal options={lessonSortOptions} />
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="lesson" type="create" />
            )}
          </div>
        </div>
      </div>
      {data.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No lessons found.</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default LessonListPage;
