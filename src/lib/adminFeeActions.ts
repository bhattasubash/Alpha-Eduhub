"use server";

import prisma from "@/lib/prisma";
import { getSession, getActiveSchoolId } from "@/lib/getRole";
import { revalidatePath } from "next/cache";

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────
// We store fee data as JSON in PlatformSetting rows, keyed per school.
// Key format: "fees:structures:{schoolId}"    → JSON FeeStructure[]
//             "fees:records:{schoolId}"        → JSON Record<studentId, FeeRecord>

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type FeeStructure = {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  type: "TUITION" | "EXAM" | "TRANSPORT" | "HOSTEL" | "LIBRARY" | "OTHER";
  classIds: string[];   // empty = applies to all classes
  createdAt: string;
};

export type Payment = {
  id: string;
  amount: number;
  method: "CASH" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | "OTHER";
  reference: string;
  paidAt: string;
  notes: string;
};

export type FeeItem = {
  id: string;
  structureId?: string;
  name: string;
  amount: number;
  assignedAt: string;
};

export type FeeRecord = {
  structureId: string;
  structureName: string;
  totalAmount: number;
  paidAmount: number;
  status: "UNPAID" | "PARTIAL" | "PAID" | "WAIVED";
  items?: FeeItem[];
  payments: Payment[];
  assignedAt: string;
  updatedAt: string;
};

// ─── HELPER TO NORMALIZE FEE RECORD FOR MULTI-ITEM SUPPORT ───────────────────

function normalizeFeeRecord(record: FeeRecord): FeeRecord & { items: FeeItem[] } {
  const items: FeeItem[] = Array.isArray(record.items) && record.items.length > 0
    ? record.items
    : [
        {
          id: `legacy_${record.structureId || "fee"}`,
          structureId: record.structureId,
          name: record.structureName || "Standard Fee",
          amount: record.totalAmount,
          assignedAt: record.assignedAt || new Date().toISOString(),
        },
      ];

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const names = items.map((i) => i.name).filter(Boolean);

  return {
    ...record,
    totalAmount,
    items,
    structureName: names.length > 0 ? names.join(", ") : record.structureName || "Fee Plan",
  };
}

// ─── EFFECTIVE SCHOOL ID RESOLVER ─────────────────────────────────────────────

export async function getEffectiveSchoolId(): Promise<string> {
  const session = await getSession();
  if (session?.schoolId) return session.schoolId;

  const activeId = await getActiveSchoolId();
  if (activeId) return activeId;

  const firstSchool = await prisma.school.findFirst({ select: { id: true } });
  if (firstSchool?.id) return firstSchool.id;

  return "default_school";
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.platformSetting.findUnique({ where: { key } });
    if (!row) return fallback;
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, data: T, category = "fees"): Promise<void> {
  const value = JSON.stringify(data);
  await prisma.platformSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value, category },
  });
}

function structuresKey(schoolId: string) { return `fees:structures:${schoolId}`; }
function recordsKey(schoolId: string)    { return `fees:records:${schoolId}`; }
function uid() { return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

// ─── PUBLIC READ FUNCTIONS ────────────────────────────────────────────────────

export async function getFeeStructures(schoolId?: string): Promise<FeeStructure[]> {
  const effectiveId = schoolId || (await getEffectiveSchoolId());
  return readJson<FeeStructure[]>(structuresKey(effectiveId), []);
}

export async function getFeeRecords(schoolId?: string): Promise<Record<string, FeeRecord>> {
  const effectiveId = schoolId || (await getEffectiveSchoolId());
  const raw = await readJson<Record<string, FeeRecord>>(recordsKey(effectiveId), {});
  const normalized: Record<string, FeeRecord> = {};
  for (const [studentId, rec] of Object.entries(raw)) {
    if (rec) {
      normalized[studentId] = normalizeFeeRecord(rec);
    }
  }
  return normalized;
}

// ─── ACTIONS ──────────────────────────────────────────────────────────────────

export async function createFeeStructure(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const schoolId = await getEffectiveSchoolId();

    const name        = (formData.get("name") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const totalAmount = parseFloat(formData.get("totalAmount") as string);
    const type        = (formData.get("type") as FeeStructure["type"]) || "TUITION";
    const classIdsRaw = formData.get("classIds") as string;
    const classIds    = classIdsRaw ? classIdsRaw.split(",").filter(Boolean) : [];

    if (!name) return { success: false, message: "Fee structure name is required." };
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return { success: false, message: "Please enter a valid amount greater than 0." };
    }

    const structures = await getFeeStructures(schoolId);
    const newStructure: FeeStructure = {
      id: uid(),
      name,
      description,
      totalAmount,
      type,
      classIds,
      createdAt: new Date().toISOString(),
    };
    structures.push(newStructure);
    await writeJson(structuresKey(schoolId), structures);

    revalidatePath("/admin/fees");
    return { success: true, message: "Fee structure created successfully." };
  } catch (err) {
    console.error("[createFeeStructure]", err);
    return { success: false, message: "Failed to create fee structure." };
  }
}

export async function updateFeeStructure(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const schoolId = await getEffectiveSchoolId();

    const id          = formData.get("id") as string;
    const name        = (formData.get("name") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const totalAmount = parseFloat(formData.get("totalAmount") as string);
    const type        = (formData.get("type") as FeeStructure["type"]) || "TUITION";
    const classIdsRaw = formData.get("classIds") as string;
    const classIds    = classIdsRaw ? classIdsRaw.split(",").filter(Boolean) : [];

    if (!id) return { success: false, message: "Missing fee structure ID." };
    if (!name) return { success: false, message: "Fee structure name is required." };
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return { success: false, message: "Please enter a valid amount greater than 0." };
    }

    const structures = await getFeeStructures(schoolId);
    const idx = structures.findIndex((s) => s.id === id);
    if (idx === -1) return { success: false, message: "Fee structure not found." };

    structures[idx] = { ...structures[idx], name, description, totalAmount, type, classIds };
    await writeJson(structuresKey(schoolId), structures);

    revalidatePath("/admin/fees");
    return { success: true, message: "Fee structure updated." };
  } catch (err) {
    console.error("[updateFeeStructure]", err);
    return { success: false, message: "Failed to update fee structure." };
  }
}

export async function deleteFeeStructure(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const schoolId = await getEffectiveSchoolId();

    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "Missing structure ID." };

    const structures = await getFeeStructures(schoolId);
    const updated = structures.filter((s) => s.id !== id);
    await writeJson(structuresKey(schoolId), updated);

    revalidatePath("/admin/fees");
    return { success: true, message: "Fee structure deleted." };
  } catch (err) {
    console.error("[deleteFeeStructure]", err);
    return { success: false, message: "Failed to delete fee structure." };
  }
}

export async function assignFeeToStudent(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const schoolId = await getEffectiveSchoolId();

    const studentId       = (formData.get("studentId") as string || "").trim();
    const structureId     = (formData.get("structureId") as string || "").trim();
    const customFeeName   = (formData.get("customFeeName") as string || "").trim();
    const customAmountRaw = formData.get("customAmount") as string | null;
    const mode            = (formData.get("mode") as string || "add").trim(); // "add" or "replace"

    if (!studentId) return { success: false, message: "Student ID is missing." };

    let feeName = "";
    let itemAmount = 0;
    let refStructureId: string | undefined = undefined;

    if (structureId) {
      const structures = await getFeeStructures(schoolId);
      const structure  = structures.find((s) => s.id === structureId);
      if (!structure) {
        return { success: false, message: "Selected fee structure was not found." };
      }
      refStructureId = structure.id;
      feeName = customFeeName || structure.name;
      const parsedCustom = customAmountRaw && customAmountRaw.trim() !== "" ? parseFloat(customAmountRaw) : NaN;
      itemAmount = !isNaN(parsedCustom) && parsedCustom > 0 ? parsedCustom : structure.totalAmount;
    } else if (customFeeName) {
      const parsedCustom = customAmountRaw && customAmountRaw.trim() !== "" ? parseFloat(customAmountRaw) : NaN;
      if (isNaN(parsedCustom) || parsedCustom <= 0) {
        return { success: false, message: "Please enter a valid amount for the fee." };
      }
      feeName = customFeeName;
      itemAmount = parsedCustom;
    } else {
      return { success: false, message: "Please select a fee structure or enter a custom fee name." };
    }

    const records = await getFeeRecords(schoolId);
    const existing = records[studentId];
    const now = new Date().toISOString();

    const newItem: FeeItem = {
      id: uid(),
      structureId: refStructureId,
      name: feeName,
      amount: itemAmount,
      assignedAt: now,
    };

    let items: FeeItem[] = [];
    if (existing && mode === "add") {
      const norm = normalizeFeeRecord(existing);
      items = [...norm.items, newItem];
    } else {
      items = [newItem];
    }

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const paidAmount = existing?.paidAmount ?? 0;
    const isWaived = existing?.status === "WAIVED";

    const newStatus = isWaived ? "WAIVED"
      : paidAmount >= totalAmount ? "PAID"
      : paidAmount > 0           ? "PARTIAL"
      : "UNPAID";

    records[studentId] = {
      structureId: refStructureId || structureId || "custom",
      structureName: items.map((i) => i.name).join(", "),
      totalAmount,
      paidAmount,
      status: newStatus,
      items,
      payments: existing?.payments ?? [],
      assignedAt: existing?.assignedAt ?? now,
      updatedAt: now,
    };

    await writeJson(recordsKey(schoolId), records);
    revalidatePath("/admin/fees");
    return { success: true, message: `Fee "${feeName}" (₹${itemAmount.toLocaleString("en-IN")}) added successfully.` };
  } catch (err) {
    console.error("[assignFeeToStudent]", err);
    return { success: false, message: "Failed to assign fee to student." };
  }
}

export async function assignFeeToClass(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const schoolId = await getEffectiveSchoolId();

    const classIdRaw  = formData.get("classId") as string;
    const structureId = (formData.get("structureId") as string || "").trim();

    const classId = parseInt(classIdRaw);
    if (isNaN(classId)) return { success: false, message: "Invalid class selected." };
    if (!structureId) return { success: false, message: "Please select a fee structure." };

    const structures = await getFeeStructures(schoolId);
    const structure  = structures.find((s) => s.id === structureId);
    if (!structure) {
      return { success: false, message: "Selected fee structure was not found." };
    }

    // Fetch all students in this class
    const students = await prisma.student.findMany({
      where: { classId },
      select: { id: true },
    });

    if (students.length === 0) {
      return { success: false, message: "No students found in this class." };
    }

    const records = await getFeeRecords(schoolId);
    const now = new Date().toISOString();

    for (const student of students) {
      const existing = records[student.id];
      const newItem: FeeItem = {
        id: uid(),
        structureId: structure.id,
        name: structure.name,
        amount: structure.totalAmount,
        assignedAt: now,
      };

      let items: FeeItem[] = [];
      if (existing) {
        const norm = normalizeFeeRecord(existing);
        // Avoid duplicate exact structure assignment if already present
        const alreadyHasStructure = norm.items.some((i) => i.structureId === structure.id);
        if (!alreadyHasStructure) {
          items = [...norm.items, newItem];
        } else {
          items = norm.items;
        }
      } else {
        items = [newItem];
      }

      const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
      const paidAmount = existing?.paidAmount ?? 0;
      const isWaived = existing?.status === "WAIVED";

      records[student.id] = {
        structureId: structure.id,
        structureName: items.map((i) => i.name).join(", "),
        totalAmount,
        paidAmount,
        status: isWaived ? "WAIVED"
              : paidAmount >= totalAmount ? "PAID"
              : paidAmount > 0          ? "PARTIAL"
              : "UNPAID",
        items,
        payments: existing?.payments ?? [],
        assignedAt: existing?.assignedAt ?? now,
        updatedAt: now,
      };
    }

    await writeJson(recordsKey(schoolId), records);
    revalidatePath("/admin/fees");
    return { success: true, message: `Fee "${structure.name}" assigned to ${students.length} students.` };
  } catch (err) {
    console.error("[assignFeeToClass]", err);
    return { success: false, message: "Failed to assign fee to class." };
  }
}

export async function removeFeeFromStudent(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const schoolId = await getEffectiveSchoolId();
    const studentId = (formData.get("studentId") as string || "").trim();
    const itemId    = (formData.get("itemId") as string || "").trim();

    if (!studentId || !itemId) {
      return { success: false, message: "Missing student ID or fee item ID." };
    }

    const records = await getFeeRecords(schoolId);
    const existing = records[studentId];
    if (!existing) return { success: false, message: "No fee record found for student." };

    const norm = normalizeFeeRecord(existing);
    const updatedItems = norm.items.filter((i) => i.id !== itemId);

    if (updatedItems.length === 0) {
      delete records[studentId];
    } else {
      const newTotal = updatedItems.reduce((s, i) => s + i.amount, 0);
      records[studentId] = {
        ...norm,
        items: updatedItems,
        totalAmount: newTotal,
        structureName: updatedItems.map((i) => i.name).join(", "),
        status: norm.status === "WAIVED" ? "WAIVED"
              : norm.paidAmount >= newTotal ? "PAID"
              : norm.paidAmount > 0        ? "PARTIAL"
              : "UNPAID",
        updatedAt: new Date().toISOString(),
      };
    }

    await writeJson(recordsKey(schoolId), records);
    revalidatePath("/admin/fees");
    return { success: true, message: "Fee item removed." };
  } catch (err) {
    console.error("[removeFeeFromStudent]", err);
    return { success: false, message: "Failed to remove fee item." };
  }
}

export async function recordPayment(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const schoolId = await getEffectiveSchoolId();

    const studentId = (formData.get("studentId") as string || "").trim();
    const amount    = parseFloat(formData.get("amount") as string);
    const method    = (formData.get("method") as Payment["method"]) || "CASH";
    const reference = (formData.get("reference") as string || "").trim();
    const notes     = (formData.get("notes") as string || "").trim();

    if (!studentId) return { success: false, message: "Missing student ID." };
    if (isNaN(amount) || amount <= 0) {
      return { success: false, message: "Please enter a valid payment amount." };
    }

    const records = await getFeeRecords(schoolId);
    const record  = records[studentId];
    if (!record) return { success: false, message: "No fee assigned to this student yet." };

    const norm = normalizeFeeRecord(record);

    const payment: Payment = {
      id: uid(),
      amount,
      method,
      reference,
      notes,
      paidAt: new Date().toISOString(),
    };

    norm.payments.push(payment);
    norm.paidAmount += amount;
    norm.updatedAt = new Date().toISOString();
    norm.status = norm.status === "WAIVED" ? "WAIVED"
                : norm.paidAmount >= norm.totalAmount ? "PAID"
                : norm.paidAmount > 0                ? "PARTIAL"
                : "UNPAID";

    records[studentId] = norm;
    await writeJson(recordsKey(schoolId), records);
    revalidatePath("/admin/fees");
    return { success: true, message: "Payment recorded successfully." };
  } catch (err) {
    console.error("[recordPayment]", err);
    return { success: false, message: "Failed to record payment." };
  }
}

export async function waivedFee(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const schoolId = await getEffectiveSchoolId();

    const studentId = (formData.get("studentId") as string || "").trim();
    if (!studentId) return { success: false, message: "Missing student ID." };

    const records = await getFeeRecords(schoolId);
    const record  = records[studentId];
    if (!record) return { success: false, message: "No fee record found for this student." };

    const norm = normalizeFeeRecord(record);
    norm.status = "WAIVED";
    norm.updatedAt = new Date().toISOString();
    records[studentId] = norm;

    await writeJson(recordsKey(schoolId), records);
    revalidatePath("/admin/fees");
    return { success: true, message: "Fee waived successfully." };
  } catch (err) {
    console.error("[waivedFee]", err);
    return { success: false, message: "Failed to waive fee." };
  }
}

