"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Check, SlidersHorizontal, X } from "lucide-react";

export type SortOption = {
  label: string;
  field: string;
  order: "asc" | "desc";
};

export default function TableSortModal({
  options = [
    { label: "Name (A to Z)", field: "name", order: "asc" },
    { label: "Name (Z to A)", field: "name", order: "desc" },
  ],
}: {
  options?: SortOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentField = searchParams.get("sortField") || options[0]?.field || "name";
  const currentOrder = searchParams.get("sortOrder") || searchParams.get("sort") || options[0]?.order || "asc";

  const handleSelect = (option: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortField", option.field);
    params.set("sortOrder", option.order);
    params.set("sort", option.order);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const isOptionActive = (opt: SortOption) => {
    return opt.field === currentField && opt.order === currentOrder;
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm ${
          searchParams.has("sortField") || searchParams.has("sort")
            ? "bg-purple-600 text-white ring-2 ring-purple-300"
            : "bg-lamaPurple hover:bg-purple-300"
        }`}
        title="Sort Options"
        aria-label="Sort Options"
      >
        <Image src="/sort.png" alt="Sort" width={16} height={16} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal / Popover */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
                Sort Options
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {options.map((opt, idx) => {
                const active = isOptionActive(opt);
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      active
                        ? "bg-purple-50 text-purple-700 font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {active && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
