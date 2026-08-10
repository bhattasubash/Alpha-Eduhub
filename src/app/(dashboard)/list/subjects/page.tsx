import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TableSortModal, { SortOption } from "@/components/TableSortModal";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole, getCurrentSchoolId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const subjectSortOptions: SortOption[] = [
  { label: "Subject Name (A to Z)", field: "name", order: "asc" },
  { label: "Subject Name (Z to A)", field: "name", order: "desc" },
];

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const [role, schoolId] = await Promise.all([getRole(), getCurrentSchoolId()]);
  const { page, search, sortField, sortOrder, sort } = searchParams;
  const p = page ? parseInt(page) : 1;

  const order: "asc" | "desc" = (sortOrder === "desc" || sort === "desc") ? "desc" : "asc";

  const where: Prisma.SubjectWhereInput = {
    ...(schoolId ? { schoolId } : {}),
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
  };

  const [data, count] = await Promise.all([
    prisma.subject.findMany({
      where,
      include: { teachers: { select: { name: true, surname: true } } },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { name: order },
    }),
    prisma.subject.count({ where }),
  ]);

  const columns = [
    { header: "Subject Name", accessor: "name" },
    { header: "Teachers",     accessor: "teachers", className: "hidden md:table-cell" },
    { header: "Actions",      accessor: "action" },
  ];

  const renderRow = (item: typeof data[number]) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4 font-medium">{item.name}</td>
      <td className="hidden md:table-cell">
        {item.teachers.map((t) => `${t.name} ${t.surname}`).join(", ") || "—"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="subject" type="update" data={item} />
              <FormContainer table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end">
            <TableSortModal options={subjectSortOptions} />
            {role === "admin" && <FormContainer table="subject" type="create" />}
          </div>
        </div>
      </div>
      {data.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No subjects found.</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default SubjectListPage;
