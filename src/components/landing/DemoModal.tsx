"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Users,
  MessageSquare,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

const roles = ["Principal / Headmaster", "School Administrator", "Trustee / Board Member", "Teacher", "Other"];
const studentRanges = ["Under 300 Pupils", "300 – 1,000 Pupils", "1,000 – 3,000 Pupils", "3,000+ (Multi-Campus)"];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  schoolName: "",
  role: "",
  students: "",
  message: "",
};

type FormState = typeof initialForm;
type FieldKey = keyof FormState;

function Field({
  icon: Icon,
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  error,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: FieldKey;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 font-sans">
      <label htmlFor={id} className="text-ink-muted text-xs font-semibold">
        {label} {required && <span className="text-alert">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-paper border ${
            error ? "border-alert" : "border-line"
          } rounded pl-9 pr-3.5 py-2 text-xs text-ink placeholder:text-ink-subtle outline-none focus:border-ledger transition-colors`}
        />
      </div>
      {error && <p className="text-alert text-[11px] font-medium">{error}</p>}
    </div>
  );
}

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const set = (key: FieldKey) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.schoolName.trim()) e.schoolName = "School name is required";
    if (!form.role) e.role = "Please select your role";
    if (!form.students) e.students = "Please select student range";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setForm(initialForm);
      setErrors({});
      setStatus("idle");
      setServerError("");
    }, 200);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg pointer-events-auto rounded bg-paper-light border border-line shadow-ledger overflow-hidden text-ink"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4 border-b border-line bg-paper">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-brass-dark font-semibold">
                    Live System Walkthrough
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-ink mt-0.5">
                    Book a School Walkthrough
                  </h2>
                  <p className="text-xs text-ink-muted mt-1">
                    A practical 20-minute consultation with realistic school data.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="p-1.5 rounded hover:bg-paper-dark text-ink-muted hover:text-ink transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto max-h-[calc(100vh-180px)] p-6">
                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-ledger-light border border-ledger/30 flex items-center justify-center text-ledger">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-ink">
                      Walkthrough Scheduled
                    </h3>
                    <p className="text-xs text-ink-muted leading-relaxed max-w-sm">
                      Thank you, <span className="font-semibold text-ink">{form.name}</span>. An education systems engineer will contact you at <span className="font-mono text-ink font-medium">{form.email}</span> within 24 business hours.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-4 px-6 py-2 rounded bg-ledger text-paper text-xs font-semibold hover:bg-ledger-hover transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <Field
                        icon={User}
                        label="Full Name"
                        id="name"
                        placeholder="Dr. Eleanor Vance"
                        value={form.name}
                        onChange={set("name")}
                        required
                        error={errors.name}
                      />
                      <Field
                        icon={Building2}
                        label="Institution Name"
                        id="schoolName"
                        placeholder="St. Jude Academy"
                        value={form.schoolName}
                        onChange={set("schoolName")}
                        required
                        error={errors.schoolName}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <Field
                        icon={Mail}
                        label="Institutional Email"
                        id="email"
                        type="email"
                        placeholder="principal@stjude.edu"
                        value={form.email}
                        onChange={set("email")}
                        required
                        error={errors.email}
                      />
                      <Field
                        icon={Phone}
                        label="Direct Phone"
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={form.phone}
                        onChange={set("phone")}
                        required
                        error={errors.phone}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1.5 font-sans">
                        <label className="text-ink-muted text-xs font-semibold">
                          Your Role <span className="text-alert">*</span>
                        </label>
                        <select
                          value={form.role}
                          onChange={(e) => set("role")(e.target.value)}
                          className={`w-full bg-paper border ${
                            errors.role ? "border-alert" : "border-line"
                          } rounded px-3 py-2 text-xs text-ink outline-none focus:border-ledger transition-colors cursor-pointer`}
                        >
                          <option value="">Select role…</option>
                          {roles.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        {errors.role && <p className="text-alert text-[11px] font-medium">{errors.role}</p>}
                      </div>

                      <div className="flex flex-col gap-1.5 font-sans">
                        <label className="text-ink-muted text-xs font-semibold">
                          Enrolled Pupils <span className="text-alert">*</span>
                        </label>
                        <select
                          value={form.students}
                          onChange={(e) => set("students")(e.target.value)}
                          className={`w-full bg-paper border ${
                            errors.students ? "border-alert" : "border-line"
                          } rounded px-3 py-2 text-xs text-ink outline-none focus:border-ledger transition-colors cursor-pointer`}
                        >
                          <option value="">Select student count…</option>
                          {studentRanges.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        {errors.students && <p className="text-alert text-[11px] font-medium">{errors.students}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 font-sans">
                      <label htmlFor="message" className="text-ink-muted text-xs font-semibold">
                        Specific Questions or Systems to Replace <span className="text-ink-subtle font-normal">(Optional)</span>
                      </label>
                      <textarea
                        id="message"
                        placeholder="e.g. Replacing legacy Excel ledgers and manual Word report cards…"
                        value={form.message}
                        onChange={(e) => set("message")(e.target.value)}
                        rows={2}
                        className="w-full bg-paper border border-line rounded p-2.5 text-xs text-ink placeholder:text-ink-subtle outline-none focus:border-ledger transition-colors resize-none"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-alert text-xs bg-alert/10 border border-alert/20 rounded p-2 font-mono">
                        {serverError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-2.5 rounded bg-ledger hover:bg-ledger-hover text-paper font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Processing…
                        </>
                      ) : (
                        "Confirm Walkthrough Request"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
