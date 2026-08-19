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
  GraduationCap,
} from "lucide-react";
import { useState } from "react";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

const roles = ["Principal / Admin", "Teacher", "IT Director", "Parent", "Other"];
const studentRanges = ["< 100", "100 – 500", "500 – 1,500", "1,500 – 5,000", "5,000+"];

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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-white/60 text-xs font-medium">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white/5 border ${
            error ? "border-red-500/50" : "border-white/10"
          } rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all`}
        />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
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
    if (!form.students) e.students = "Please select student count";
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
    // reset after exit animation
    setTimeout(() => {
      setForm(initialForm);
      setErrors({});
      setStatus("idle");
      setServerError("");
    }, 300);
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg pointer-events-auto rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d1030] to-[#080b1e] shadow-2xl shadow-black/60 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Book a Live Demo</h2>
                    <p className="text-white/40 text-xs">We&apos;ll reach out within 24 hours</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto max-h-[calc(100vh-160px)] px-6 pb-6">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-2">
                        Request Received! 🎉
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                        Thanks <span className="text-white font-medium">{form.name}</span>! Our team will contact you at{" "}
                        <span className="text-blue-400">{form.email}</span> within 24 hours to schedule your personalized demo.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        icon={User}
                        label="Full Name"
                        id="name"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={set("name")}
                        required
                        error={errors.name}
                      />
                      <Field
                        icon={Building2}
                        label="School / Institution"
                        id="schoolName"
                        placeholder="Greenwood Academy"
                        value={form.schoolName}
                        onChange={set("schoolName")}
                        required
                        error={errors.schoolName}
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        icon={Mail}
                        label="Work Email"
                        id="email"
                        type="email"
                        placeholder="jane@school.edu"
                        value={form.email}
                        onChange={set("email")}
                        required
                        error={errors.email}
                      />
                      <Field
                        icon={Phone}
                        label="Phone Number"
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={set("phone")}
                        required
                        error={errors.phone}
                      />
                    </div>

                    {/* Role select */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-medium">
                        Your Role <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                        <select
                          value={form.role}
                          onChange={(e) => set("role")(e.target.value)}
                          className={`w-full appearance-none bg-white/5 border ${
                            errors.role ? "border-red-500/50" : "border-white/10"
                          } rounded-xl pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all cursor-pointer`}
                        >
                          <option value="" className="bg-[#0d1030]">Select your role…</option>
                          {roles.map((r) => (
                            <option key={r} value={r} className="bg-[#0d1030]">{r}</option>
                          ))}
                        </select>
                      </div>
                      {errors.role && <p className="text-red-400 text-xs">{errors.role}</p>}
                    </div>

                    {/* Student count select */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-medium">
                        Number of Students <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                        <select
                          value={form.students}
                          onChange={(e) => set("students")(e.target.value)}
                          className={`w-full appearance-none bg-white/5 border ${
                            errors.students ? "border-red-500/50" : "border-white/10"
                          } rounded-xl pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all cursor-pointer`}
                        >
                          <option value="" className="bg-[#0d1030]">Select range…</option>
                          {studentRanges.map((r) => (
                            <option key={r} value={r} className="bg-[#0d1030]">{r}</option>
                          ))}
                        </select>
                      </div>
                      {errors.students && <p className="text-red-400 text-xs">{errors.students}</p>}
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-white/60 text-xs font-medium">
                        Anything specific you&apos;d like to see? <span className="text-white/30">(optional)</span>
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-white/25 pointer-events-none" />
                        <textarea
                          id="message"
                          placeholder="e.g. attendance module, parent app, bulk import…"
                          value={form.message}
                          onChange={(e) => set("message")(e.target.value)}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Server error */}
                    {status === "error" && (
                      <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                        ⚠ {serverError}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2 mt-1"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        "Book My Free Demo →"
                      )}
                    </button>

                    <p className="text-white/25 text-xs text-center">
                      No spam. No credit card. Cancel anytime.
                    </p>
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
