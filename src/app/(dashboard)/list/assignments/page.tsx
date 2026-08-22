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

export const dynamic = 'force-dynamic';

const assignmentSortOptions: SortOption[] = [
  { label: "Due Date (Soonest first)", field: "dueDate", order: "asc" },
  { label: "Due Date (Latest first)",  field: "dueDate", order: "desc" },
  { label: "Title (A to Z)",           field: "title",   order: "asc" },
];

const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const [role, schoolId, userId] = await Promise.all([getRole(), getCurrentSchoolId(), getCurrentUserId()]);

  const { page, search, sortField, sortOrder, sort, classId } = searchParams;
  const p = page ? parseInt(page) : 1;

  const field = sortField || "dueDate";
  const order: "asc" | "desc" = (sortOrder === "desc" || sort === "desc") ? "desc" : "asc";

  let orderBy: Prisma.AssignmentOrderByWithRelationInput = { dueDate: order };
  if (field === "title") orderBy = { title: order };

  const where: Prisma.AssignmentWhereInput = {
    dueDate: { gte: new Date() },
    ...(schoolId ? { schoolId } : {}),
    ...(classId ? { lesson: { classId: parseInt(classId) } } : {}),
    ...(role === "teacher" && userId ? { lesson: { teacherId: userId } } : {}),
    ...(role === "student" && userId ? { lesson: { class: { students: { some: { id: userId } } } } } : {}),
    ...(search ? {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { lesson: { subject: { name: { contains: search, mode: "insensitive" } } } },
      ],
    } : {}),
  };

  let data: any[] = [];
  let count = 0;
  let classList: any[] = [];

  try {
    [data, count, classList] = await Promise.all([
      prisma.assignment.findMany({
        where,
        include: {
          lesson: {
            include: {
              subject: { select: { name: true } },
              class:   { select: { name: true } },
              teacher: { select: { name: true, surname: true } },
            },
          },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy,
      }),
      prisma.assignment.count({ where }),
      prisma.class.findMany({
        where: schoolId ? { schoolId } : {},
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);
  } catch (error) {
    console.error("Database connection failed in AssignmentListPage:", error);
  }

  const columns = [
    { header: "Subject & Title", accessor: "name" },
    { header: "Section / Class", accessor: "class" },
    { header: "Teacher",         accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Due Date",        accessor: "dueDate", className: "hidden md:table-cell" },
    ...(role === "admin" || role === "teacher"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item: typeof data[number]) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4 font-medium">{item.lesson?.subject.name || item.lessonName || "Subject"} — {item.title}</td>
      <td>
        {item.lesson?.class.name ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            Section {item.lesson.class.name}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>
      <td className="hidden md:table-cell">{item.lesson?.teacher ? `${item.lesson.teacher.name} ${item.lesson.teacher.surname}` : "—"}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.dueDate)}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="assignment" type="update" data={item} />
              <FormContainer table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">Section-wise Assignments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end">
            <TableSortModal options={assignmentSortOptions} />
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="assignment" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <ClassFilterPills classes={classList} selectedClassId={classId} />

      {data.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No assignments found for the selected section.</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AssignmentListPage;
