"use client";

import TableSortModal, { SortOption } from "./TableSortModal";

export default function TableSortToggle({
  options,
}: {
  options?: SortOption[];
  sortKey?: string;
  defaultOrder?: "asc" | "desc";
}) {
  return <TableSortModal options={options} />;
}
