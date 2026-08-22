import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TableSortModal, { SortOption } from "@/components/TableSortModal";
import ClassFilterPills from "@/components/ClassFilterPills";
import SectionMarksUploadModal from "@/components/forms/SectionMarksUploadModal";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole, getCurrentSchoolId, getCurrentUserId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';

const resultSortOptions: SortOption[] = [
  { label: "Score (Highest first)",  field: "score", order: "desc" },
  { label: "Score (Lowest first)",   field: "score", order: "asc" },
  { label: "Result ID (Newest first)", field: "id",    order: "desc" },
  { label: "Result ID (Oldest first)", field: "id",    order: "asc" },
];

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const [role, schoolId, userId] = await Promise.all([getRole(), getCurrentSchoolId(), getCurrentUserId()]);
  const { page, search, sortField, sortOrder, sort, classId } = searchParams;
  const p = page ? parseInt(page) : 1;

  const field = sortField || "id";
  const order: "asc" | "desc" = (sortOrder === "asc" || sort === "asc") ? "asc" : "desc";

  let orderBy: Prisma.ResultOrderByWithRelationInput = { id: order };
  if (field === "score") orderBy = { score: order };

  const where: Prisma.ResultWhereInput = {
    ...(schoolId ? { schoolId } : {}),
    ...(classId ? {
      OR: [
        { exam: { lesson: { classId: parseInt(classId) } } },
        { assignment: { lesson: { classId: parseInt(classId) } } },
      ],
    } : {}),
    ...(role === "student" && userId ? { studentId: userId } : {}),
    ...(search ? {
      OR: [
        { student: { name:    { contains: search, mode: "insensitive" } } },
        { student: { surname: { contains: search, mode: "insensitive" } } },
        { exam:        { title: { contains: search, mode: "insensitive" } } },
        { assignment:  { title: { contains: search, mode: "insensitive" } } },
      ],
    } : {}),
  };

  let data: any[] = [];
  let count = 0;
  let classList: any[] = [];

  try {
    [data, count, classList] = await Promise.all([
      prisma.result.findMany({
        where,
        include: {
          student:    { select: { name: true, surname: true } },
          exam:       { include: { lesson: { include: { subject: { select: { name: true } }, class: { select: { name: true } }, teacher: { select: { name: true, surname: true } } } } } },
          assignment: { include: { lesson: { include: { subject: { select: { name: true } }, class: { select: { name: true } }, teacher: { select: { name: true, surname: true } } } } } },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy,
      }),
      prisma.result.count({ where }),
      prisma.class.findMany({
        where: schoolId ? { schoolId } : {},
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);
  } catch (error) {
    console.error("Database connection failed in ResultListPage:", error);
  }

  const columns = [
    { header: "Title",   accessor: "title" },
    { header: "Student", accessor: "student" },
    { header: "Score",   accessor: "score",   className: "hidden md:table-cell" },
    { header: "Section", accessor: "class",   className: "hidden md:table-cell" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    ...(role === "admin" || role === "teacher"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item: typeof data[number]) => {
    const source   = item.exam ?? item.assignment;
    const title    = source ? (`${item.exam ? "Exam" : "Assignment"}: ${source.title}`) : "—";
    const lesson   = item.exam?.lesson ?? item.assignment?.lesson;
    const className = lesson?.class?.name  ?? "—";
    const teacher  = lesson?.teacher ? `${lesson.teacher.name} ${lesson.teacher.surname}` : "—";

    return (
      <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4 font-medium">{title}</td>
        <td>{item.student.name} {item.student.surname}</td>
        <td className="hidden md:table-cell">
          <span className={`font-bold ${item.score >= 50 ? "text-green-600" : "text-red-500"}`}>
            {item.score}/100
          </span>
        </td>
        <td className="hidden md:table-cell">
          {className !== "—" ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
              Section {className}
            </span>
          ) : (
            <span className="text-gray-400 text-xs">—</span>
          )}
        </td>
        <td className="hidden md:table-cell">{teacher}</td>
        <td>
          <div className="flex items-center gap-2">
            {(role === "admin" || role === "teacher") && (
              <>
                <FormContainer table="result" type="update" data={item} />
                <FormContainer table="result" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">Section Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end">
            <TableSortModal options={resultSortOptions} />
            {(role === "admin" || role === "teacher") && (
              <>
                <SectionMarksUploadModal classes={classList} />
                <FormContainer table="result" type="create" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <ClassFilterPills classes={classList} selectedClassId={classId} />

      {data.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No results found for the selected section.</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResultListPage;
