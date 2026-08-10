"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "react-toastify";

import { createFeeStructureForSchool } from "@/lib/actions";

const initialState = { success: false, error: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-lamaSky text-white p-2 rounded-md disabled:bg-slate-400">
      {pending ? "Creating..." : "Create Fee Structure"}
    </button>
  );
}

export function CreateFeeStructureForm() {
  const [state, formAction] = useFormState(createFeeStructureForSchool, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Fee structure created successfully!");
    } else if (state.error) {
      toast.error(state.message || "An error occurred.");
    }
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4 py-4">
      <div className="grid gap-2 flex flex-col">
        <label htmlFor="name" className="text-xs text-gray-500">Fee Name</label>
        <input id="name" name="name" placeholder="e.g., Annual Tuition 2024-25" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
      </div>
      <div className="grid gap-2 flex flex-col">
        <label htmlFor="totalAmount" className="text-xs text-gray-500">Total Amount (₹)</label>
        <input id="totalAmount" name="totalAmount" type="number" placeholder="e.g., 50000" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
      </div>
      <div className="grid gap-2 flex flex-col">
        <label htmlFor="description" className="text-xs text-gray-500">Description (Optional)</label>
        <textarea id="description" name="description" placeholder="Describe this fee..." className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" />
      </div>
      <SubmitButton />
    </form>
  );
}
