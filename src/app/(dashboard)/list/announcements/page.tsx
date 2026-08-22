import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TableSortModal, { SortOption } from "@/components/TableSortModal";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole, getCurrentSchoolId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';

const announcementSortOptions: SortOption[] = [
  { label: "Date (Newest first)", field: "date",  order: "desc" },
  { label: "Date (Oldest first)", field: "date",  order: "asc" },
  { label: "Title (A to Z)",      field: "title", order: "asc" },
];

const AnnouncementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const [role, schoolId] = await Promise.all([getRole(), getCurrentSchoolId()]);
  const { page, search, sortField, sortOrder, sort } = searchParams;
  const p = page ? parseInt(page) : 1;

  const field = sortField || "date";
  const order: "asc" | "desc" = (sortOrder === "asc" || sort === "asc") ? "asc" : "desc";

  let orderBy: Prisma.AnnouncementOrderByWithRelationInput = { date: order };
  if (field === "title") orderBy = { title: order };

  const where: Prisma.AnnouncementWhereInput = {
    ...(schoolId ? { schoolId } : {}),
    ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
  };

  let data: any[] = [];
  let count = 0;

  try {
    [data, count] = await Promise.all([
      prisma.announcement.findMany({
        where,
        include: { class: { select: { name: true } } },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy,
      }),
      prisma.announcement.count({ where }),
    ]);
  } catch (error) {
    console.error("Database connection failed in AnnouncementListPage:", error);
  }

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Class", accessor: "class" },
    { header: "Date",  accessor: "date",  className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: typeof data[number]) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4 font-medium">{item.title}</td>
      <td>{item.class?.name ?? <span className="text-gray-400 text-xs">All classes</span>}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.date)}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="announcement" type="update" data={item} />
              <FormContainer table="announcement" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">All Announcements</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end">
            <TableSortModal options={announcementSortOptions} />
            {role === "admin" && <FormContainer table="announcement" type="create" />}
          </div>
        </div>
      </div>
      {data.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No announcements found.</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AnnouncementListPage;
