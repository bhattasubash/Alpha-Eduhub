import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import ParentFilterModal from "@/components/ParentFilterModal";
import TableSortModal, { SortOption } from "@/components/TableSortModal";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole, getCurrentSchoolId } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { MapPin, Phone, Users } from "lucide-react";
import Image from "next/image";

const parentSortOptions: SortOption[] = [
  { label: "First Name (A to Z)", field: "name",    order: "asc" },
  { label: "First Name (Z to A)", field: "name",    order: "desc" },
  { label: "Last Name (A to Z)",  field: "surname", order: "asc" },
  { label: "Last Name (Z to A)",  field: "surname", order: "desc" },
  { label: "Phone Number",        field: "phone",   order: "asc" },
];

const ParentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const [role, schoolId] = await Promise.all([getRole(), getCurrentSchoolId()]);
  const { page, search, class: classFilter, grade: gradeFilter, status: statusFilter, sortField, sortOrder, sort } = searchParams;
  const p = page ? parseInt(page) : 1;

  const field = sortField || "name";
  const order: "asc" | "desc" = (sortOrder === "desc" || sort === "desc") ? "desc" : "asc";

  let orderBy: Prisma.ParentOrderByWithRelationInput = { name: order };
  if (field === "surname") orderBy = { surname: order };
  if (field === "phone")   orderBy = { phone: order };

  const where: Prisma.ParentWhereInput = {
    ...(schoolId ? { schoolId } : {}),
    ...(classFilter ? {
      students: {
        some: {
          class: !isNaN(Number(classFilter))
            ? { id: Number(classFilter) }
            : { name: { equals: classFilter, mode: "insensitive" } },
        },
      },
    } : {}),
    ...(gradeFilter ? {
      students: {
        some: {
          gradeId: Number(gradeFilter),
        },
      },
    } : {}),
    ...(statusFilter === "linked" ? {
      students: {
        some: {},
      },
    } : {}),
    ...(statusFilter === "unlinked" ? {
      students: {
        none: {},
      },
    } : {}),
    ...(search ? {
      OR: [
        { name:    { contains: search, mode: "insensitive" } },
        { surname: { contains: search, mode: "insensitive" } },
        { email:   { contains: search, mode: "insensitive" } },
        { phone:   { contains: search, mode: "insensitive" } },
        { students: { some: { name: { contains: search, mode: "insensitive" } } } },
      ],
    } : {}),
  };

  const [data, count, classes, grades] = await Promise.all([
    prisma.parent.findMany({
      where,
      include: { students: { select: { name: true, surname: true, class: { select: { name: true } } } } },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy,
    }),
    prisma.parent.count({ where }),
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

  const columns = [
    { header: "Info",          accessor: "info" },
    { header: "Student Names", accessor: "students", className: "hidden md:table-cell" },
    { header: "Class",         accessor: "class" },
    { header: "Phone",         accessor: "phone",    className: "hidden lg:table-cell" },
    { header: "Address",       accessor: "address",  className: "hidden lg:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  // Desktop Table Row
  const renderRowTable = (item: typeof data[number]) => (
    <tr key={item.id} className="border-b border-gray-100 text-sm hover:bg-slate-50 transition-colors">
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800">{item.name} {item.surname}</h3>
          <p className="text-xs text-gray-500">{item.email ?? "—"}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-gray-600">
        {item.students.map((s) => `${s.name} ${s.surname}`).join(", ") || "—"}
      </td>
      <td>
        <div className="flex flex-wrap gap-1">
          {item.students.length === 0 ? (
            <span className="text-gray-400 text-xs">—</span>
          ) : (
            item.students.map((s, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-lamaPurple text-purple-800 text-xs font-semibold">
                Class {s.class?.name ?? "—"}
              </span>
            ))
          )}
        </div>
      </td>
      <td className="hidden md:table-cell text-gray-600">{item.phone}</td>
      <td className="hidden md:table-cell text-gray-600">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="parent" type="update" data={item} />
              <FormContainer table="parent" type="delete" id={item.id} />
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col flex-1">
          <h3 className="font-bold text-gray-800 text-lg">{item.name} {item.surname}</h3>
          <p className="text-xs font-medium text-gray-500">{item.email ?? "No Email"}</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          {role === "admin" && (
            <div className="flex items-center gap-2">
              <FormContainer table="parent" type="update" data={item} />
              <FormContainer table="parent" type="delete" id={item.id} />
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-50" />

      {/* Details Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <Users className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Children</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.students.map((s, i) => (
                <span key={i} className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                  {s.name} {s.surname} <span className="text-gray-400">({s.class?.name || "No Class"})</span>
                </span>
              ))}
              {item.students.length === 0 && <span className="text-xs text-gray-400">No children linked</span>}
            </div>
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
            <span className="text-xs text-gray-700">{item.address || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F7F8FA] p-4 flex-1 h-full max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Parents</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-end">
            <ParentFilterModal classes={classes} grades={grades} />
            <TableSortModal options={parentSortOptions} />
            {role === "admin" && (
              <div className="shadow-sm rounded-full overflow-hidden">
                <FormContainer table="parent" type="create" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {data.length === 0 ? (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
          <Users className="w-16 h-16 text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">No parents found</h2>
          <p className="text-gray-500 mt-2 text-center max-w-md">Get started by importing your parents or creating a new parent record manually.</p>
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

export default ParentListPage;
