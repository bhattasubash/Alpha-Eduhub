"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import {
  Plus, X, Check, Edit2, Trash2, DollarSign, CreditCard,
  ChevronDown, ChevronUp, Users, Ban, Receipt, Save,
  AlertCircle, CheckCircle2, Clock, Eye,
} from "lucide-react";
import type { FeeStructure, FeeRecord, Payment } from "@/lib/adminFeeActions";
import {
  createFeeStructure, updateFeeStructure, deleteFeeStructure,
  assignFeeToStudent, assignFeeToClass, recordPayment, waivedFee, removeFeeFromStudent,
} from "@/lib/adminFeeActions";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  UNPAID:  "bg-red-100 text-red-700",
  PARTIAL: "bg-amber-100 text-amber-700",
  PAID:    "bg-emerald-100 text-emerald-700",
  WAIVED:  "bg-gray-100 text-gray-500",
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  UNPAID:  <AlertCircle className="w-3.5 h-3.5" />,
  PARTIAL: <Clock className="w-3.5 h-3.5" />,
  PAID:    <CheckCircle2 className="w-3.5 h-3.5" />,
  WAIVED:  <Ban className="w-3.5 h-3.5" />,
};
const FEE_TYPES = ["TUITION","EXAM","TRANSPORT","HOSTEL","LIBRARY","OTHER"] as const;
const PAYMENT_METHODS = ["CASH","UPI","BANK_TRANSFER","CHEQUE","OTHER"] as const;
function fmt(n: number) { return `₹${n.toLocaleString("en-IN")}`; }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

// ─── ACTION BUTTON (wraps a server action + loading/error state) ──────────────

function ActionButton({
  label,
  loadingLabel,
  className: cls,
  action,
  formData,
  icon,
  onSuccess,
}: {
  label: string;
  loadingLabel?: string;
  className?: string;
  action: (p: unknown, fd: FormData) => Promise<{ success: boolean; message: string }>;
  formData: FormData;
  icon?: React.ReactNode;
  onSuccess?: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    setError(null);
    start(async () => {
      const result = await action(null, formData);
      if (result.success) { onSuccess?.(); }
      else { setError(result.message); }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={run}
        disabled={pending}
        className={cls}
      >
        {icon}
        {pending ? (loadingLabel ?? "Loading…") : label}
      </button>
      {error && <p className="text-[10px] text-red-500 font-semibold">✗ {error}</p>}
    </div>
  );
}

// ─── FEE STRUCTURE FORM MODAL ─────────────────────────────────────────────────

function StructureModal({
  initial,
  onClose,
}: {
  initial?: FeeStructure;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      const action = isEdit ? updateFeeStructure : createFeeStructure;
      const result = await action(null, fd);
      if (result.success) { onClose(); }
      else { setError(result.message); }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">
            {isEdit ? "Edit Fee Structure" : "New Fee Structure"}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {initial && <input type="hidden" name="id" value={initial.id} />}

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Fee Name *</label>
            <input
              name="name"
              defaultValue={initial?.name}
              placeholder="e.g. Annual Tuition 2024-25"
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Amount (₹) *</label>
              <input
                name="totalAmount"
                type="number"
                min="1"
                step="1"
                defaultValue={initial?.totalAmount}
                placeholder="50000"
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Fee Type</label>
              <select
                name="type"
                defaultValue={initial?.type ?? "TUITION"}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              >
                {FEE_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={initial?.description}
              placeholder="Optional details..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-lg">✗ {error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {pending ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── ASSIGN FEE MODAL ─────────────────────────────────────────────────────────

function AssignModal({
  studentId,
  studentName,
  classId,
  structures,
  onClose,
  mode,
  hasExistingFees = false,
}: {
  studentId?: string;
  studentName?: string;
  classId?: number;
  structures: FeeStructure[];
  onClose: () => void;
  mode: "student" | "class";
  hasExistingFees?: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [feeTypeMode, setFeeTypeMode] = useState<"structure" | "custom">("structure");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      const action = mode === "student" ? assignFeeToStudent : assignFeeToClass;
      const result = await action(null, fd);
      if (result.success) { onClose(); }
      else { setError(result.message); }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">
              {mode === "student"
                ? hasExistingFees
                  ? `Add Extra Fee — ${studentName}`
                  : `Assign Fee — ${studentName}`
                : "Assign Fee to Entire Class"}
            </h3>
            {mode === "student" && hasExistingFees && (
              <p className="text-[11px] text-blue-600 font-medium">Adds an extra fee item to student&apos;s record.</p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {mode === "student"
            ? <input type="hidden" name="studentId" value={studentId} />
            : <input type="hidden" name="classId" value={classId} />
          }
          <input type="hidden" name="mode" value="add" />

          {mode === "student" && (
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFeeTypeMode("structure")}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  feeTypeMode === "structure" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Fee Structure
              </button>
              <button
                type="button"
                onClick={() => setFeeTypeMode("custom")}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  feeTypeMode === "custom" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Custom Fee Item
              </button>
            </div>
          )}

          {feeTypeMode === "structure" ? (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Fee Structure *</label>
              {structures.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No fee structures yet. Create one first or switch to Custom Fee Item.</p>
              ) : (
                <select
                  name="structureId"
                  required={feeTypeMode === "structure"}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
                >
                  <option value="">— Select Fee Structure —</option>
                  {structures.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({fmt(s.totalAmount)})</option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Fee Name *</label>
              <input
                name="customFeeName"
                required={feeTypeMode === "custom"}
                placeholder="e.g. Transport Fee, Exam Fee, Lab Fine"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              />
            </div>
          )}

          {mode === "student" && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                {feeTypeMode === "custom" ? "Amount (₹) *" : "Custom Amount (₹) — optional"}
              </label>
              <input
                name="customAmount"
                type="number"
                min="1"
                required={feeTypeMode === "custom"}
                placeholder={feeTypeMode === "custom" ? "5000" : "Leave blank to use structure amount"}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              />
            </div>
          )}

          {error && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-lg">✗ {error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending || (feeTypeMode === "structure" && structures.length === 0)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {pending ? "Adding…" : hasExistingFees ? "Add Extra Fee" : "Assign Fee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── ITEMIZED FEE ITEMS MODAL ────────────────────────────────────────────────

function StudentFeeItemsModal({
  studentId,
  studentName,
  record,
  onClose,
  onOpenAddModal,
}: {
  studentId: string;
  studentName: string;
  record: FeeRecord;
  onClose: () => void;
  onOpenAddModal: () => void;
}) {
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const items = record.items || [];
  const balance = record.totalAmount - record.paidAmount;

  const handleRemoveItem = (itemId: string) => {
    setDeletePendingId(itemId);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("studentId", studentId);
      fd.append("itemId", itemId);
      await removeFeeFromStudent(null, fd);
      setDeletePendingId(null);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">Itemized Fee Details</h3>
            <p className="text-xs text-gray-500">{studentName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Summary banner */}
        <div className="bg-gray-50 p-4 grid grid-cols-3 gap-2 text-center border-b border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Total Fee</p>
            <p className="font-bold text-gray-800 text-sm">{fmt(record.totalAmount)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Paid</p>
            <p className="font-bold text-emerald-600 text-sm">{fmt(record.paidAmount)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Balance</p>
            <p className="font-bold text-red-500 text-sm">{fmt(balance)}</p>
          </div>
        </div>

        {/* Itemized list */}
        <div className="p-5 space-y-3 max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 uppercase">Assigned Fee Items ({items.length})</h4>
            <button
              onClick={() => { onClose(); onOpenAddModal(); }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Fee
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-4">No fee items assigned.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="text-xs font-bold text-gray-800">{item.name}</p>
                  <p className="text-[10px] text-gray-400">Assigned: {fmtDate(item.assignedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-gray-800">{fmt(item.amount)}</span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={pending && deletePendingId === item.id}
                    title="Remove this fee item"
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT MODAL ─────────────────────────────────────────────────────────────

function PaymentModal({
  studentId,
  studentName,
  record,
  onClose,
}: {
  studentId: string;
  studentName: string;
  record: FeeRecord;
  onClose: () => void;
}) {
  const balance = record.totalAmount - record.paidAmount;
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      const result = await recordPayment(null, fd);
      if (result.success) { onClose(); }
      else { setError(result.message); }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">Record Payment</h3>
            <p className="text-xs text-gray-500">{studentName} · {record.structureName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Summary row */}
        <div className="p-5 grid grid-cols-3 gap-3 border-b border-gray-50 text-center">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Total</p>
            <p className="font-bold text-gray-800">{fmt(record.totalAmount)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Paid</p>
            <p className="font-bold text-emerald-600">{fmt(record.paidAmount)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Balance</p>
            <p className="font-bold text-red-500">{fmt(balance)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <input type="hidden" name="studentId" value={studentId} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Amount (₹) *</label>
              <input
                name="amount"
                type="number"
                min="1"
                defaultValue={balance > 0 ? balance : ""}
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Method</label>
              <select
                name="method"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m.replace("_"," ")}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Reference / Transaction ID</label>
            <input
              name="reference"
              placeholder="UTR, cheque number, etc."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Notes</label>
            <input
              name="notes"
              placeholder="Optional notes..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-lg">✗ {error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending || balance <= 0}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {pending ? "Saving…" : "Record Payment"}
            </button>
          </div>
        </form>

        {/* Payment History */}
        {record.payments.length > 0 && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-gray-500 hover:bg-gray-50"
            >
              Payment History ({record.payments.length})
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showHistory && (
              <div className="px-5 pb-4 space-y-2 max-h-44 overflow-y-auto">
                {[...record.payments].reverse().map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                    <div>
                      <p className="text-xs font-bold text-gray-700">{fmt(p.amount)}</p>
                      <p className="text-[10px] text-gray-400">{p.method.replace("_"," ")} · {fmtDate(p.paidAt)}</p>
                      {p.reference && <p className="text-[10px] text-gray-400">Ref: {p.reference}</p>}
                      {p.notes && <p className="text-[10px] text-gray-400 italic">{p.notes}</p>}
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Paid</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STUDENT ROW ───────────────────────────────────────────────────────────────

function StudentFeeRow({
  student,
  record,
  structures,
}: {
  student: { id: string; name: string; surname: string; username: string };
  record?: FeeRecord;
  structures: FeeStructure[];
}) {
  const [showAssign, setShowAssign] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [waivePending, startWaive] = useTransition();

  const balance  = record ? record.totalAmount - record.paidAmount : 0;
  const progress = record ? Math.min(100, (record.paidAmount / record.totalAmount) * 100) : 0;
  const items    = record?.items || [];

  return (
    <>
      {showAssign && (
        <AssignModal
          mode="student"
          studentId={student.id}
          studentName={`${student.name} ${student.surname}`}
          structures={structures}
          hasExistingFees={!!record && items.length > 0}
          onClose={() => setShowAssign(false)}
        />
      )}
      {showItemsModal && record && (
        <StudentFeeItemsModal
          studentId={student.id}
          studentName={`${student.name} ${student.surname}`}
          record={record}
          onClose={() => setShowItemsModal(false)}
          onOpenAddModal={() => setShowAssign(true)}
        />
      )}
      {showPayment && record && (
        <PaymentModal
          studentId={student.id}
          studentName={`${student.name} ${student.surname}`}
          record={record}
          onClose={() => setShowPayment(false)}
        />
      )}

      <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
        {/* Student name */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {student.name.charAt(0)}{student.surname.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{student.name} {student.surname}</p>
              <p className="text-[10px] text-gray-400">{student.username}</p>
            </div>
          </div>
        </td>

        {/* Fee plan + progress */}
        <td className="px-4 py-3">
          {record ? (
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">{record.structureName}</p>
                {items.length > 1 && (
                  <button
                    onClick={() => setShowItemsModal(true)}
                    className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-1.5 py-0.5 rounded transition-colors"
                  >
                    {items.length} items
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[10px] text-gray-400">{Math.round(progress)}%</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic">Not assigned</span>
          )}
        </td>

        {/* Amounts */}
        <td className="px-4 py-3">
          {record ? (
            <div>
              <p className="text-xs font-bold text-gray-700">{fmt(record.totalAmount)}</p>
              <p className="text-[10px] text-emerald-600">Paid: {fmt(record.paidAmount)}</p>
              {balance > 0 && <p className="text-[10px] text-red-500">Due: {fmt(balance)}</p>}
            </div>
          ) : <span className="text-xs text-gray-300">—</span>}
        </td>

        {/* Status badge */}
        <td className="px-4 py-3">
          {record ? (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_STYLES[record.status]}`}>
              {STATUS_ICONS[record.status]} {record.status}
            </span>
          ) : <span className="text-xs text-gray-300">—</span>}
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5 justify-end flex-wrap">
            {!record ? (
              <button
                onClick={() => setShowAssign(true)}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3 h-3" /> Assign
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowAssign(true)}
                  title="Add extra fee to student"
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 px-2 py-1 rounded-lg transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Fee
                </button>
                <button
                  onClick={() => setShowItemsModal(true)}
                  title="View itemized fee breakdown"
                  className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                {record.status !== "PAID" && record.status !== "WAIVED" && (
                  <button
                    onClick={() => setShowPayment(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-400 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <CreditCard className="w-3 h-3" /> Pay
                  </button>
                )}
                {record.status !== "WAIVED" && record.status !== "PAID" && (
                  <button
                    onClick={() => {
                      startWaive(async () => {
                        const fd = new FormData();
                        fd.append("studentId", student.id);
                        await waivedFee(null, fd);
                      });
                    }}
                    disabled={waivePending}
                    title="Waive fee"
                    className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface Student { id: string; name: string; surname: string; username: string }

interface Props {
  students: Student[];
  classId: number;
  className: string;
  gradeLevel: number;
  structures: FeeStructure[];
  records: Record<string, FeeRecord>;
}

export default function FeeManager({ students, classId, className, gradeLevel, structures, records }: Props) {
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | undefined>();
  const [showAssignClass, setShowAssignClass] = useState(false);
  const [showStructures, setShowStructures] = useState(structures.length === 0);
  const [deletePending, startDelete] = useTransition();

  // Summary
  const paid    = students.filter((s) => records[s.id]?.status === "PAID").length;
  const partial = students.filter((s) => records[s.id]?.status === "PARTIAL").length;
  const unpaid  = students.filter((s) => !records[s.id] || records[s.id]?.status === "UNPAID").length;
  const collected = students.reduce((n, s) => n + (records[s.id]?.paidAmount ?? 0), 0);
  const pending_amt = students.reduce((n, s) => {
    const r = records[s.id]; return r ? n + (r.totalAmount - r.paidAmount) : n;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Modals */}
      {(showStructureModal || editingStructure) && (
        <StructureModal
          initial={editingStructure}
          onClose={() => { setShowStructureModal(false); setEditingStructure(undefined); }}
        />
      )}
      {showAssignClass && (
        <AssignModal
          mode="class"
          classId={classId}
          structures={structures}
          onClose={() => setShowAssignClass(false)}
        />
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Collected",  value: fmt(collected),   color: "bg-emerald-50 text-emerald-700" },
          { label: "Pending",    value: fmt(pending_amt), color: "bg-red-50 text-red-600" },
          { label: "Fully Paid", value: `${paid}/${students.length}`, color: "bg-blue-50 text-blue-700" },
          { label: "Partial",    value: partial,           color: "bg-amber-50 text-amber-700" },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl p-4 text-center ${c.color}`}>
            <p className="text-lg font-bold">{c.value}</p>
            <p className="text-[10px] font-bold uppercase opacity-70 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Fee Structures panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowStructures((v) => !v)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-gray-700 text-sm">Fee Structures ({structures.length})</span>
            {structures.length === 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Create one first</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); setShowStructureModal(true); }}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Structure
            </span>
            {showStructures ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {showStructures && (
          <div className="border-t border-gray-50 p-4 space-y-2">
            {structures.length === 0 ? (
              <div className="text-center py-6">
                <DollarSign className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No fee structures yet.</p>
                <button onClick={() => setShowStructureModal(true)} className="mt-2 text-xs text-indigo-500 font-semibold hover:underline">
                  + Create your first fee structure →
                </button>
              </div>
            ) : (
              structures.map((s) => (
                <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{s.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {s.type} · {fmt(s.totalAmount)}
                      {s.description ? ` · ${s.description}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingStructure(s)}
                      className="p-1.5 hover:bg-blue-50 hover:text-blue-500 text-gray-400 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => startDelete(async () => {
                        const fd = new FormData(); fd.append("id", s.id);
                        const res = await deleteFeeStructure(null, fd);
                        if (res?.success) {
                          toast.success("Fee structure deleted successfully!");
                        } else {
                          toast.error(res?.message || "Failed to delete fee structure.");
                        }
                      })}
                      disabled={deletePending}
                      className="p-1.5 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Students section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-800">Class {className} — Grade {gradeLevel}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{students.length} students · {paid} paid · {partial} partial · {unpaid} unpaid</p>
          </div>
          <button
            onClick={() => setShowAssignClass(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <Users className="w-4 h-4" />
            Assign Fee to All Students
          </button>
        </div>

        {students.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">No students in this class</p>
            <p className="text-xs text-gray-400 mt-1">Add students to this class first.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[11px] font-bold uppercase tracking-wide">
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Fee Plan</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <StudentFeeRow
                      key={student.id}
                      student={student}
                      record={records[student.id]}
                      structures={structures}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col divide-y divide-gray-50 md:hidden">
              {students.map((student) => {
                const r = records[student.id];
                return (
                  <div key={student.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {student.name.charAt(0)}{student.surname.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800">{student.name} {student.surname}</p>
                        <p className="text-xs text-gray-400">{student.username}</p>
                        {r ? (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 truncate max-w-[150px]">{r.structureName}</span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[r.status]}`}>
                                {r.status}
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, (r.paidAmount / r.totalAmount) * 100)}%` }} />
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>Paid: {fmt(r.paidAmount)}</span>
                              <span>Due: {fmt(r.totalAmount - r.paidAmount)}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1 italic">No fee assigned</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

