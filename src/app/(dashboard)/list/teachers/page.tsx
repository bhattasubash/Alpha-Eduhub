import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TeacherFilterModal from "@/components/TeacherFilterModal";
import TableSortModal, { SortOption } from "@/components/TableSortModal";
import Image from "next/image";
import Link from "next/link";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole, getCurrentSchoolId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { BookOpen, GraduationCap, MapPin, Phone } from "lucide-react";

export const dynamic = 'force-dynamic';

type TeacherRow = {
  id: string; name: string; surname: string; email: string | null;
  username: string; phone: string | null; address: string;
  img: string | null;
  subjects: { name: string }[];
  classes:  { name: string }[];
};

const teacherSortOptions: SortOption[] = [
  { label: "First Name (A to Z)", field: "name",    order: "asc" },
  { label: "First Name (Z to A)", field: "name",    order: "desc" },
  { label: "Last Name (A to Z)",  field: "surname", order: "asc" },
  { label: "Last Name (Z to A)",  field: "surname", order: "desc" },
  { label: "Email (A to Z)",      field: "email",   order: "asc" },
];

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const [role, schoolId] = await Promise.all([getRole(), getCurrentSchoolId()]);

  const { page, search, class: classFilter, subject: subjectFilter, sortField, sortOrder, sort } = searchParams;
  const p = page ? parseInt(page) : 1;

  const field = sortField || "name";
  const order: "asc" | "desc" = (sortOrder === "desc" || sort === "desc") ? "desc" : "asc";

  let orderBy: Prisma.TeacherOrderByWithRelationInput = { name: order };
  if (field === "surname") orderBy = { surname: order };
  if (field === "email")   orderBy = { email: order };

  const where: Prisma.TeacherWhereInput = {
    ...(schoolId ? { schoolId } : {}),
    ...(subjectFilter ? {
      subjects: {
        some: { name: { equals: subjectFilter, mode: "insensitive" } },
      },
    } : {}),
    ...(classFilter ? {
      classes: {
        some: !isNaN(Number(classFilter))
          ? { id: Number(classFilter) }
          : { name: { equals: classFilter, mode: "insensitive" } },
      },
    } : {}),
    ...(search ? {
      OR: [
        { name:    { contains: search, mode: "insensitive" } },
        { surname: { contains: search, mode: "insensitive" } },
        { email:   { contains: search, mode: "insensitive" } },
        { username:{ contains: search, mode: "insensitive" } },
      ],
    } : {}),
  };

  let data: any[] = [];
  let count = 0;
  let subjects: any[] = [];
  let classes: any[] = [];

  try {
    [data, count, subjects, classes] = await Promise.all([
      prisma.teacher.findMany({
        where,
        include: {
          subjects: { select: { name: true } },
          classes:  { select: { name: true } },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
        orderBy,
      }),
      prisma.teacher.count({ where }),
      prisma.subject.findMany({
        where: schoolId ? { schoolId } : {},
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.class.findMany({
        where: schoolId ? { schoolId } : {},
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);
  } catch (error) {
    console.error("Database connection failed in TeacherListPage:", error);
  }

  const columns = [
    { header: "Info",       accessor: "info" },
    { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
    { header: "Subjects",   accessor: "subjects",  className: "hidden md:table-cell" },
    { header: "Classes",    accessor: "classes",   className: "hidden md:table-cell" },
    { header: "Phone",      accessor: "phone",     className: "hidden lg:table-cell" },
    { header: "Address",    accessor: "address",   className: "hidden lg:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  // Desktop Table Row
  const renderRowTable = (item: TeacherRow) => (
    <tr key={item.id} className="border-b border-gray-100 text-sm hover:bg-slate-50 transition-colors">
      <td className="flex items-center gap-4 p-4">
        <Image src={item.img || "/noAvatar.png"} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800">{item.name} {item.surname}</h3>
          <p className="text-xs text-gray-500">{item.email ?? "—"}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-gray-600">{item.username}</td>
      <td className="hidden md:table-cell text-gray-600">{item.subjects.map((s) => s.name).join(", ") || "—"}</td>
      <td className="hidden md:table-cell text-gray-600">{item.classes.map((c) => c.name).join(", ")  || "—"}</td>
      <td className="hidden md:table-cell text-gray-600">{item.phone   ?? "—"}</td>
      <td className="hidden md:table-cell text-gray-600">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
              <Image src="/view.png" alt="view" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormContainer table="teacher" type="update" data={item} />
              <FormContainer table="teacher" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // Mobile Card Row
  const renderRowCard = (item: TeacherRow) => (
    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col gap-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Image src={item.img || "/noAvatar.png"} alt="" width={48} height={48} className="w-12 h-12 rounded-full object-cover shadow-sm" />
        <div className="flex flex-col flex-1">
          <h3 className="font-bold text-gray-800">{item.name} {item.surname}</h3>
          <p className="text-xs font-medium text-gray-500">{item.email ?? "No Email"}</p>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full w-fit mt-1">{item.username}</span>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link href={`/list/teachers/${item.id}`} className="w-8 h-8 bg-blue-50 flex items-center justify-center rounded-full text-blue-600">
            <Image src="/view.png" alt="view" width={14} height={14} />
          </Link>
          {role === "admin" && (
            <div className="flex items-center gap-2">
              <FormContainer table="teacher" type="update" data={item} />
              <FormContainer table="teacher" type="delete" id={item.id} />
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-50" />

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Subjects</span>
            <span className="text-xs text-gray-700">{item.subjects.map(s => s.name).join(", ") || "—"}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <GraduationCap className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Classes</span>
            <span className="text-xs text-gray-700">{item.classes.map(c => c.name).join(", ") || "—"}</span>
          </div>
        </div>
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
        <h1 className="text-xl font-bold text-gray-800">Teachers</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-end">
            <TeacherFilterModal subjects={subjects} classes={classes} />
            <TableSortModal options={teacherSortOptions} />
            {role === "admin" && (
              <div className="shadow-sm rounded-full overflow-hidden">
                <FormContainer table="teacher" type="create" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {data.length === 0 ? (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
          <GraduationCap className="w-16 h-16 text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">No teachers found</h2>
          <p className="text-gray-500 mt-2 text-center max-w-md">Get started by importing your teachers or creating a new teacher record manually.</p>
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

export default TeacherListPage;
