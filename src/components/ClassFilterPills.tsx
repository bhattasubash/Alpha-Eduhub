"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function ClassFilterPills({
  classes,
  selectedClassId,
}: {
  classes: { id: number; name: string }[];
  selectedClassId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelectClass = (classId?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (classId) {
      params.set("classId", classId.toString());
    } else {
      params.delete("classId");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 my-3 scrollbar-thin">
      <button
        onClick={() => handleSelectClass()}
        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
          !selectedClassId
            ? "bg-purple-600 text-white shadow-sm"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All Sections
      </button>
      {classes.map((c) => {
        const isSelected = selectedClassId === c.id.toString();
        return (
          <button
            key={c.id}
            onClick={() => handleSelectClass(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Section {c.name}
          </button>
        );
      })}
    </div>
  );
}
