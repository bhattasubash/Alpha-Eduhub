"use client";

import { useState } from "react";
import Image from "next/image";
import { CreateFeeStructureForm } from "./CreateFeeStructureForm";

export function FeeCreateModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
      >
        <Image src="/create.png" alt="" width={16} height={16} />
      </button>

      {open && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Create Fee Structure</h2>
            <p className="text-sm text-gray-500 mb-4">
              Define a new fee template that can be assigned to students.
            </p>
            <CreateFeeStructureForm />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
