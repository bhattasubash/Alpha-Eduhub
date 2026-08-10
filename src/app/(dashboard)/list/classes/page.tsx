import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TableSortModal, { SortOption } from "@/components/TableSortModal";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole, getCurrentSchoolId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const classSortOptions: SortOption[] = [
  { label: "Class Name (A to Z)",  field: "name",     order: "asc" },
  { label: "Class Name (Z to A)",  field: "name",     order: "desc" },
  { label: "Capacity (Highest)",   field: "capacity", order: "desc" },
  { label: "Capacity (Lowest)",    field: "capacity", order: "asc" },
];

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const [role, schoolId] = await Promise.all([getRole(), getCurrentSchoolId()]);
  const { page, search, sortField, sortOrder, sort } = searchParams;
  const p = page ? parseInt(page) : 1;

  const field = sortField || "name";
  const order: "asc" | "desc" = (sortOrder === "desc" || sort === "desc") ? "desc" : "asc";

  let orderBy: Prisma.ClassOrderByWithRelationInput = { name: order };
  if (field === "capacity") orderBy = { capacity: order };

  const where: Prisma.ClassWhereInput = {
    ...(schoolId ? { schoolId } : {}),
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
  };

  const [data, count] = await Promise.all([
    prisma.class.findMany({
      where,
      include: {
        grade:      { select: { level: true } },
        supervisor: { select: { name: true, surname: true } },
        _count:     { select: { students: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy,
    }),
    prisma.class.count({ where }),
  ]);

  const columns = [
    { header: "Class Name",  accessor: "name" },
    { header: "Capacity",    accessor: "capacity",   className: "hidden md:table-cell" },
    { header: "Students",    accessor: "students",   className: "hidden md:table-cell" },
    { header: "Grade",       accessor: "grade",      className: "hidden md:table-cell" },
    { header: "Supervisor",  accessor: "supervisor", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: typeof data[number]) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4 font-medium">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">
        <span className={`font-medium ${item._count.students >= item.capacity ? "text-red-500" : "text-green-600"}`}>
          {item._count.students}/{item.capacity}
        </span>
      </td>
      <td className="hidden md:table-cell">Grade {item.grade?.level ?? "—"}</td>
      <td className="hidden md:table-cell">
        {item.supervisor ? `${item.supervisor.name} ${item.supervisor.surname}` : "—"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="class" type="update" data={item} />
              <FormContainer table="class" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end">
            <TableSortModal options={classSortOptions} />
            {role === "admin" && <FormContainer table="class" type="create" />}
          </div>
        </div>
      </div>
      {data.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No classes found.</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ClassListPage;
