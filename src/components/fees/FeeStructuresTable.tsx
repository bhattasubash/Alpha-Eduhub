"use client";

import type { FeeStructure } from "@prisma/client";
import Table from "@/components/Table";
import Image from "next/image";

type FeeStructuresTableProps = {
  data: FeeStructure[];
};

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Total Amount", accessor: "totalAmount", className: "hidden md:table-cell" },
  { header: "Description", accessor: "description", className: "hidden lg:table-cell" },
];

export function FeeStructuresTable({ data }: FeeStructuresTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-md mt-4">
        <h2 className="text-xl font-semibold mb-2">No Fee Structures Found</h2>
        <p className="text-gray-500">Create your first fee structure to get started.</p>
      </div>
    );
  }

  const renderRow = (item: FeeStructure) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-4 font-medium">{item.name}</td>
      <td className="hidden md:table-cell p-4">₹{Number(item.totalAmount).toLocaleString()}</td>
      <td className="hidden lg:table-cell p-4 text-gray-500">{item.description}</td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md mt-4">
      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
}
