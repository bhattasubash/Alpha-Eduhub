import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import StudentFilterModal from "@/components/StudentFilterModal";
import TableSortModal, { SortOption } from "@/components/TableSortModal";
import Image from "next/image";
import Link from "next/link";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole, getCurrentSchoolId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { GraduationCap, MapPin, Phone, Download } from "lucide-react";

export const dynamic = 'force-dynamic';

const studentSortOptions: SortOption[] = [
  { label: "First Name (A to Z)", field: "name",     order: "asc" },
  { label: "First Name (Z to A)", field: "name",     order: "desc" },
  { label: "Last Name (A to Z)",  field: "surname",  order: "asc" },
  { label: "Last Name (Z to A)",  field: "surname",  order: "desc" },
  { label: "Username (A to Z)",   field: "username", order: "asc" },
];

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const [role, schoolId] = await Promise.all([getRole(), getCurrentSchoolId()]);
  const { page, search, class: classFilter, grade: gradeFilter, sex: sexFilter, sortField, sortOrder, sort } = searchParams;
  const p = page ? parseInt(page) : 1;

  const field = sortField || "name";
  const order: "asc" | "desc" = (sortOrder === "desc" || sort === "desc") ? "desc" : "asc";

  let orderBy: Prisma.StudentOrderByWithRelationInput = { name: order };
  if (field === "surname")  orderBy = { surname: order };
  if (field === "username") orderBy = { username: order };

  const where: Prisma.StudentWhereInput = {
    ...(schoolId ? { schoolId } : {}),
    ...(classFilter ? (
      !isNaN(Number(classFilter))
        ? { classId: Number(classFilter) }
        : { class: { name: { equals: classFilter, mode: "insensitive" } } }
    ) : {}),
    ...(gradeFilter ? { gradeId: Number(gradeFilter) } : {}),
    ...(sexFilter && (sexFilter === "MALE" || sexFilter === "FEMALE") ? { sex: sexFilter as "MALE" | "FEMALE" } : {}),
    ...(search ? {
      OR: [
        { name:     { contains: search, mode: "insensitive" } },
        { surname:  { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ],
    } : {}),
  };

  let data: any[] = [];
  let count = 0;
  let classes: any[] = [];
  let grades: any[] = [];

  try {
    [data, count, classes, grades] = await Promise.all([
      prisma.student.findMany({
        where,
        include: { class: { select: { name: true } } },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy,
      }),
      prisma.student.count({ where }),
      prisma.class.findMany({
        where: schoolId ? { schoolId } : {},
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.grade.findMany({
        where: schoolId ? { schoolId } : {},
        select: { id: true, level: true },
        orderBy: { level: "asc" },
      }),
    ]);
  } catch (error) {
    console.error("Database connection failed in StudentListPage:", error);
  }

  const columns = [
    { header: "Info",       accessor: "info" },
    { header: "Student ID", accessor: "studentId", className: "hidden md:table-cell" },
    { header: "Class",      accessor: "class" },
    { header: "Phone",      accessor: "phone",     className: "hidden lg:table-cell" },
    { header: "Address",    accessor: "address",   className: "hidden lg:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  // Desktop Table Row
  const renderRowTable = (item: typeof data[number]) => (
    <tr key={item.id} className="border-b border-gray-100 text-sm hover:bg-slate-50 transition-colors">
      <td className="flex items-center gap-4 p-4">
        <Image src={item.img || "/noAvatar.png"} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800">{item.name} {item.surname}</h3>
          <p className="text-xs text-gray-500">{item.username}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-gray-600">{item.username}</td>
      <td>
        <span className="px-2.5 py-1 rounded-full bg-lamaSky text-blue-800 text-xs font-semibold">
          Class {item.class.name}
        </span>
      </td>
      <td className="hidden md:table-cell text-gray-600">{item.phone   ?? "—"}</td>
      <td className="hidden md:table-cell text-gray-600">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
              <Image src="/view.png" alt="view" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormContainer table="student" type="update" data={item} />
              <FormContainer table="student" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // Mobile Card Row
  const renderRowCard = (item: typeof data[number]) => (
    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col gap-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Image src={item.img || "/noAvatar.png"} alt="" width={48} height={48} className="w-12 h-12 rounded-full object-cover shadow-sm" />
        <div className="flex flex-col flex-1">
          <h3 className="font-bold text-gray-800">{item.name} {item.surname}</h3>
          <p className="text-xs font-medium text-gray-500">{item.username}</p>
          <span className="text-[10px] bg-lamaSky text-blue-800 px-2 py-0.5 rounded-full w-fit mt-1 font-semibold">Class {item.class.name}</span>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link href={`/list/students/${item.id}`} className="w-8 h-8 bg-blue-50 flex items-center justify-center rounded-full text-blue-600">
            <Image src="/view.png" alt="view" width={14} height={14} />
          </Link>
          {role === "admin" && (
            <div className="flex items-center gap-2">
              <FormContainer table="student" type="update" data={item} />
              <FormContainer table="student" type="delete" id={item.id} />
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-50" />

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Phone</span>
            <span className="text-xs text-gray-700">{item.phone || "—"}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Address</span>
            <span className="text-xs text-gray-700 line-clamp-1">{item.address || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F7F8FA] p-4 flex-1 h-full max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Students</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-end">
            <StudentFilterModal classes={classes} grades={grades} />
            <TableSortModal options={studentSortOptions} />
            {role === "admin" && (
              <div className="flex items-center gap-2">
                <a
                  href={`/api/admin/students/download-credentials${classFilter ? `?class=${encodeURIComponent(classFilter)}` : ""}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-colors flex items-center gap-1.5"
                  title="Download student and parent credentials for this section"
                >
                  <Download className="w-4 h-4" />
                  Credentials
                </a>
                <Link href="/admin/students/bulk" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-colors">
                  Bulk Import
                </Link>
                <div className="shadow-sm rounded-full overflow-hidden">
                  <FormContainer table="student" type="create" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {data.length === 0 ? (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
          <GraduationCap className="w-16 h-16 text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">No students found</h2>
          <p className="text-gray-500 mt-2 text-center max-w-md">Get started by importing your students or creating a new student record manually.</p>
          {role === "admin" && (
            <div className="flex gap-3 mt-6">
              <Link href="/admin/students/bulk" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-colors">
                Bulk Import Students
              </Link>
              <div className="shadow-sm rounded-full overflow-hidden">
                <FormContainer table="student" type="create" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 overflow-x-auto">
              <Table columns={columns} renderRow={renderRowTable} data={data} />
            </div>
          </div>
          
          {/* Mobile Cards View */}
          <div className="flex flex-col gap-4 md:hidden mt-6">
            {data.map(item => renderRowCard(item))}
          </div>
        </>
      )}

      {/* PAGINATION */}
      {data.length > 0 && (
        <div className="mt-6">
          <Pagination page={p} count={count} />
        </div>
      )}
    </div>
  );
};

export default StudentListPage;
