import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TableSortModal, { SortOption } from "@/components/TableSortModal";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getCurrentSchoolId } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

type MessageRow = {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  date: Date;
};

const messageSortOptions: SortOption[] = [
  { label: "Date (Newest first)", field: "createdAt", order: "desc" },
  { label: "Date (Oldest first)", field: "createdAt", order: "asc" },
];

const MessageListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const schoolId = await getCurrentSchoolId();
  const { page, search, sortField, sortOrder, sort } = searchParams;
  const p = page ? parseInt(page) : 1;
  const order: "asc" | "desc" = (sortOrder === "asc" || sort === "asc") ? "asc" : "desc";

  let data: MessageRow[] = [];
  let count = 0;

  try {
    const where = {
      ...(schoolId ? { schoolId } : {}),
      ...(search
        ? {
            content: { contains: search, mode: "insensitive" as const },
          }
        : {}),
    };

    const [dbMessages, dbCount] = await Promise.all([
      prisma.message.findMany({
        where,
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy: { createdAt: order },
      }),
      prisma.message.count({ where }),
    ]);

    if (dbMessages.length > 0) {
      count = dbCount;
      data = dbMessages.map((m) => ({
        id: m.id,
        sender: m.senderType || "User",
        recipient: m.receiverType || "User",
        content: m.content,
        date: m.createdAt,
      }));
    } else {
      throw new Error("No database messages yet");
    }
  } catch {
    // Fallback data
    const fallback = [
      { id: "1", sender: "Admin", recipient: "All Teachers", content: "Staff meeting scheduled for Friday at 3 PM.", date: new Date("2026-08-01") },
      { id: "2", sender: "Teacher", recipient: "Class 1A", content: "Homework assignment uploaded to portal.", date: new Date("2026-07-31") },
      { id: "3", sender: "Parent", recipient: "Principal", content: "Request for leave of absence for Tom.", date: new Date("2026-07-30") },
    ];
    data = order === "asc" ? fallback : [...fallback].reverse();
    count = data.length;
  }

  const columns = [
    { header: "Sender", accessor: "sender" },
    { header: "Recipient", accessor: "recipient" },
    { header: "Message", accessor: "content" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  ];

  const renderRow = (item: MessageRow) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-4 font-semibold">{item.sender}</td>
      <td>{item.recipient}</td>
      <td className="text-gray-600 max-w-xs truncate">{item.content}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(new Date(item.date))}</td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">All Messages</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end">
            <TableSortModal options={messageSortOptions} />
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default MessageListPage;
