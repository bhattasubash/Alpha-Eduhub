"use client";

import { useRouter, useSearchParams } from "next/navigation";

type ClassFilterProps = {
  classes?: string[];
  paramName?: string;
  placeholder?: string;
};

const ClassFilter = ({
  classes = ["1A", "2A", "2B", "3A", "3C", "4A", "4B", "5A", "5B", "6A", "6B"],
  paramName = "class",
  placeholder = "Filter by Class",
}: ClassFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedClass = searchParams.get(paramName) || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    params.delete("page"); // Reset pagination on filter change
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedClass}
        onChange={handleChange}
        className="p-2 rounded-md border border-gray-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {classes.map((cls) => (
          <option key={cls} value={cls}>
            Class {cls}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClassFilter;
