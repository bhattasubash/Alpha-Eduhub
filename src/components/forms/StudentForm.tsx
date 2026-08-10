"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  studentSchema,
  StudentSchema,
  bulkStudentSchema,
  BulkStudentSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import {
  createStudent,
  createMultipleStudents,
  updateStudent,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash2, UserPlus, Users, FileText, UserCheck, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";

type BulkRow = {
  name: string;
  surname: string;
  sex: "MALE" | "FEMALE";
  phone: string;
};

const StudentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const [mode, setMode] = useState<"single" | "bulk">("single");

  // Single Form Setup
  const {
    register: registerSingle,
    handleSubmit: handleSubmitSingle,
    watch: watchSingle,
    setValue: setValueSingle,
    formState: { errors: errorsSingle },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      schoolName: "dps",
      parentMode: "existing",
    },
  });

  const [img, setImg] = useState<any>();

  const [singleState, singleFormAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
    { success: false, error: false }
  );

  const onSubmitSingle = handleSubmitSingle((formData) => {
    singleFormAction({ ...formData, img: img?.secure_url });
  });

  // Bulk Form Setup
  const grades = relatedData?.grades || [];
  const classes = relatedData?.classes || [];
  const parents = relatedData?.parents || [];

  const [bulkGradeId, setBulkGradeId] = useState<string>(grades[0]?.id?.toString() || "");
  const [bulkClassId, setBulkClassId] = useState<string>(classes[0]?.id?.toString() || "");
  const [bulkCommonPassword, setBulkCommonPassword] = useState<string>("Student@123");

  const [parentMode, setParentMode] = useState<"existing" | "new">("existing");
  const [bulkParentId, setBulkParentId] = useState<string>(parents[0]?.id || "");
  const [newParentName, setNewParentName] = useState("");
  const [newParentSurname, setNewParentSurname] = useState("");
  const [newParentPhone, setNewParentPhone] = useState("");
  const [newParentPassword, setNewParentPassword] = useState("Student@123");

  const [bulkRows, setBulkRows] = useState<BulkRow[]>([
    { name: "", surname: "", sex: "MALE", phone: "" },
    { name: "", surname: "", sex: "MALE", phone: "" },
  ]);

  const [pasteText, setPasteText] = useState("");
  const [showPaste, setShowPaste] = useState(false);

  const [bulkState, bulkFormAction] = useFormState(createMultipleStudents, {
    success: false,
    error: false,
  });

  const router = useRouter();

  // Single form watched fields
  const singleSchoolName = watchSingle("schoolName") || "dps";
  const singleParentMode = watchSingle("parentMode") || "existing";

  // Clean school prefix preview
  const cleanSchoolPrefix = (name: string) =>
    (name || "school").toLowerCase().replace(/[^a-z0-9]/g, "");

  // Toast and refresh handling
  useEffect(() => {
    if (singleState.success) {
      toast.success(singleState.message || `Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [singleState, router, type, setOpen]);

  useEffect(() => {
    if (bulkState.success) {
      toast.success(bulkState.message || "Bulk students added successfully!");
      // Show credentials if returned
      if (bulkState.data) {
        const creds = bulkState.data as Array<{ name: string; login: string; password: string; admissionNumber: string }>;
        creds.forEach((c) => {
          toast.info(`${c.name}: Login: ${c.login} | Pwd: ${c.password}`, { autoClose: false });
        });
      }
      setOpen(false);
      router.refresh();
    }
  }, [bulkState, router, setOpen]);

  // Bulk Row Handlers
  const addBulkRow = () => {
    setBulkRows((prev) => [
      ...prev,
      { name: "", surname: "", sex: "MALE", phone: "" },
    ]);
  };

  const removeBulkRow = (index: number) => {
    setBulkRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBulkRow = (index: number, field: string, value: string) => {
    setBulkRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleParsePaste = () => {
    if (!pasteText.trim()) return;
    const lines = pasteText.split("\n").filter((l) => l.trim() !== "");
    const parsed: BulkRow[] = lines.map((line, idx) => {
      const parts = line.split(",").map((p) => p.trim());
      const name = parts[0] || `Student${idx + 1}`;
      const surname = parts[1] || "Surname";
      const sex = parts[2]?.toUpperCase() === "FEMALE" ? "FEMALE" : "MALE";
      const phone = parts[3] || "";
      return { name, surname, sex, phone };
    });

    if (parsed.length > 0) {
      setBulkRows(parsed);
      setPasteText("");
      setShowPaste(false);
      toast.info("Parsed " + parsed.length + " student rows.");
    }
  };

  const onSubmitBulk = (e: React.FormEvent) => {
    e.preventDefault();
    const validStudents = bulkRows.filter(
      (r) => r.name.trim() !== "" && r.surname.trim() !== ""
    );

    if (validStudents.length === 0) {
      toast.error("Please enter at least one student with First Name and Last Name.");
      return;
    }

    if (parentMode === "new" && !newParentPhone.trim()) {
      toast.error("Parent phone number is required to create a parent account for login.");
      return;
    }

    const payload: BulkStudentSchema = {
      gradeId: parseInt(bulkGradeId || grades[0]?.id?.toString() || "1"),
      classId: parseInt(bulkClassId || classes[0]?.id?.toString() || "1"),
      parentId: parentMode === "existing" ? bulkParentId : undefined,
      parentMode,
      defaultPassword: bulkCommonPassword.trim() || undefined,
      newParentName: parentMode === "new" ? newParentName : undefined,
      newParentSurname: parentMode === "new" ? newParentSurname : undefined,
      newParentPhone: parentMode === "new" ? newParentPhone : undefined,
      newParentPassword: parentMode === "new" ? newParentPassword : undefined,
      students: validStudents.map((s) => ({
        name: s.name.trim(),
        surname: s.surname.trim(),
        sex: s.sex,
        phone: s.phone.trim() || undefined,
      })),
    };

    bulkFormAction(payload);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode Switcher */}
      {type === "create" && (
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === "single"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Single Student
          </button>
          <button
            type="button"
            onClick={() => setMode("bulk")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === "bulk"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4" />
            Bulk Add (Manual)
          </button>
          <Link
            href="/admin/students/bulk"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 transition-all"
          >
            <FileText className="w-4 h-4" />
            Bulk Import (Excel)
          </Link>
        </div>
      )}

      {/* ── BULK ADD MANUAL FORM ── */}
      {mode === "bulk" && (
        <form className="flex flex-col gap-6" onSubmit={onSubmitBulk}>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-gray-800">Bulk Add Students to Section</h1>
            <p className="text-xs text-gray-500">
              Add multiple students at once to a section. All students will use the same default password.
            </p>
          </div>

          {/* Section Config */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-blue-900">Target Section / Class *</label>
              <select
                className="p-2 border border-blue-300 rounded-lg text-sm bg-white font-medium"
                value={bulkClassId}
                onChange={(e) => setBulkClassId(e.target.value)}
              >
                {classes.map((c: any) => {
                  const rawName = c.name || "";
                  const formattedName = rawName.toLowerCase().startsWith("class") ? rawName : `Class ${rawName}`;
                  const count = c._count?.students ?? 0;
                  const capacity = c.capacity ?? 0;
                  return (
                    <option value={c.id} key={c.id}>
                      {formattedName} ({count}/{capacity} Capacity)
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-blue-900">Grade Level *</label>
              <select
                className="p-2 border border-blue-300 rounded-lg text-sm bg-white font-medium"
                value={bulkGradeId}
                onChange={(e) => setBulkGradeId(e.target.value)}
              >
                {grades.map((g: any) => (
                  <option value={g.id} key={g.id}>
                    Grade {g.level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-blue-900">Common Password (Optional)</label>
              <input
                type="text"
                placeholder="Assigns to all"
                value={bulkCommonPassword}
                onChange={(e) => setBulkCommonPassword(e.target.value)}
                className="p-2 border border-blue-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800 font-medium">
              ✓ School name, unique admission number, login email, and password will be <strong>auto-generated</strong> for each student based on your school settings.
            </p>
          </div>

          {/* Mandatory Parent Assignment Section */}
          <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-800">Parent / Guardian Assignment (Mandatory)</h3>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="radio"
                  name="bulkParentMode"
                  value="existing"
                  checked={parentMode === "existing"}
                  onChange={() => setParentMode("existing")}
                  className="w-4 h-4 text-blue-600"
                />
                Select Existing Parent
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="radio"
                  name="bulkParentMode"
                  value="new"
                  checked={parentMode === "new"}
                  onChange={() => setParentMode("new")}
                  className="w-4 h-4 text-blue-600"
                />
                Create New Parent (Login via Phone)
              </label>
            </div>

            {parentMode === "existing" ? (
              <div className="flex flex-col gap-1 w-full md:w-1/2">
                <label className="text-xs font-semibold text-gray-600">Select Parent *</label>
                {parents.length > 0 ? (
                  <select
                    className="p-2 border border-gray-300 rounded-lg text-sm bg-white font-medium"
                    value={bulkParentId}
                    onChange={(e) => setBulkParentId(e.target.value)}
                  >
                    {parents.map((p: any) => (
                      <option value={p.id} key={p.id}>
                        {p.name} {p.surname} (Phone: {p.phone || p.username})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-amber-600 font-medium bg-amber-50 p-2 rounded border border-amber-200">
                    No parents registered yet. Switch to &quot;Create New Parent&quot; above!
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Parent First Name</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg text-xs"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    placeholder="Parent Name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Parent Last Name</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg text-xs"
                    value={newParentSurname}
                    onChange={(e) => setNewParentSurname(e.target.value)}
                    placeholder="Guardian"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Parent Phone *</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg text-xs"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    placeholder="9876543210"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Parent Password *</label>
                <input
                  type="password"
                  className="p-2 border border-gray-300 rounded-lg text-xs"
                  value={newParentPassword}
                  onChange={(e) => setNewParentPassword(e.target.value)}
                  placeholder="Parent@123"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* CSV Quick Paste Area Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            Student List ({bulkRows.length} Students)
          </span>
          <button
            type="button"
            onClick={() => setShowPaste(!showPaste)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            {showPaste ? "Hide Paste Area" : "Paste CSV / Bulk Text"}
          </button>
        </div>

        {showPaste && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-blue-900">
                Paste CSV or Bulk Text (Format: Name,Surname,Sex,Phone)
              </label>
              <textarea
                className="p-3 border border-blue-300 rounded-lg text-sm bg-white min-h-[100px]"
                placeholder="John,Doe,MALE,9876543210&#10;Jane,Smith,FEMALE,9876543211"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleParsePaste}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Parse & Add Students
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasteText("");
                  setShowPaste(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Student Rows Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 text-left font-semibold text-gray-700">First Name</th>
                <th className="p-2 text-left font-semibold text-gray-700">Last Name</th>
                <th className="p-2 text-left font-semibold text-gray-700">Sex</th>
                <th className="p-2 text-left font-semibold text-gray-700">Phone</th>
                <th className="p-2 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {bulkRows.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      value={row.name}
                    onChange={(e) => updateBulkRow(index, "name", e.target.value)}
                    placeholder="First Name"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full p-1 border border-gray-300 rounded text-xs"
                    value={row.surname}
                    onChange={(e) => updateBulkRow(index, "surname", e.target.value)}
                    placeholder="Last Name"
                  />
                </td>
                <td className="p-2">
                  <select
                    className="w-full p-1 border border-gray-300 rounded text-xs"
                    value={row.sex}
                    onChange={(e) => updateBulkRow(index, "sex", e.target.value as "MALE" | "FEMALE")}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="tel"
                    className="w-full p-1 border border-gray-300 rounded text-xs"
                    value={row.phone}
                    onChange={(e) => updateBulkRow(index, "phone", e.target.value)}
                    placeholder="Phone"
                  />
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => removeBulkRow(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addBulkRow}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
          <button
            type="button"
            onClick={() =>
              setBulkRows([
                { name: "", surname: "", sex: "MALE", phone: "" },
              ])
            }
            className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-2"
          >
            Clear All
          </button>
        </div>

        {bulkState.error && (
          <span className="text-red-500 text-xs font-medium">{bulkState.message}</span>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md w-full sm:w-auto"
        >
          Add {bulkRows.filter((r) => r.name.trim() && r.surname.trim()).length} Students to Section
        </button>
      </div>
    </form>
  )}

      {/* ── SINGLE STUDENT FORM ── */}
      {mode === "single" && (
        <form className="flex flex-col gap-6" onSubmit={onSubmitSingle}>
          <h1 className="text-xl font-bold text-gray-800">
            {type === "create" ? "Create a New Student" : "Update Student Profile"}
          </h1>

          {/* School Name & Email Format Preview */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 w-full sm:w-1/2">
              <label className="text-xs font-bold text-blue-900">School Name Prefix *</label>
              <input
                type="text"
                className="p-2 border border-blue-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. dps, greenwood"
                {...registerSingle("schoolName")}
              />
              <span className="text-[10px] text-blue-700 font-medium">Used for unique student email generation</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm text-xs font-semibold text-blue-800">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Auto Email: <strong className="text-blue-900 font-mono">{cleanSchoolPrefix(singleSchoolName)}_1001@gmail.com</strong></span>
            </div>
          </div>

          <span className="text-xs text-gray-400 font-medium">Authentication & Basic Information</span>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="First Name"
              name="name"
              defaultValue={data?.name}
              register={registerSingle}
              error={errorsSingle.name}
            />
            <InputField
              label="Last Name"
              name="surname"
              defaultValue={data?.surname}
              register={registerSingle}
              error={errorsSingle.surname}
            />
            <InputField
              label="Student Password"
              name="password"
              type="password"
              defaultValue="Student@123"
              register={registerSingle}
              error={errorsSingle?.password}
            />
          </div>

          {/* Mandatory Parent Assignment Section */}
          <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-800">Parent / Guardian Assignment (Mandatory)</h3>
            </div>

            {/* Parent Mode Radio Buttons */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="radio"
                  value="existing"
                  checked={singleParentMode === "existing"}
                  onChange={() => setValueSingle("parentMode", "existing")}
                  className="w-4 h-4 text-blue-600"
                />
                Select Existing Parent
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="radio"
                  value="new"
                  checked={singleParentMode === "new"}
                  onChange={() => setValueSingle("parentMode", "new")}
                  className="w-4 h-4 text-blue-600"
                />
                Create New Parent (Login via Phone)
              </label>
            </div>

            {singleParentMode === "existing" ? (
              <div className="flex flex-col gap-1 w-full md:w-1/2">
                <label className="text-xs font-semibold text-gray-600">Select Parent *</label>
                {parents.length > 0 ? (
                  <select
                    className="p-2 border border-gray-300 rounded-lg text-sm bg-white font-medium"
                    {...registerSingle("parentId")}
                    defaultValue={data?.parentId || parents[0]?.id}
                  >
                    {parents.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.surname} (Phone: {p.phone || p.username})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-amber-600 font-medium bg-amber-50 p-2 rounded border border-amber-200">
                    No parents registered yet. Switch to &quot;Create New Parent&quot; above!
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Parent First Name</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg text-xs"
                    {...registerSingle("newParentName")}
                    placeholder="Parent Name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Parent Last Name</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg text-xs"
                    {...registerSingle("newParentSurname")}
                    placeholder="Guardian"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Parent Phone *</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg text-xs"
                    {...registerSingle("newParentPhone")}
                    placeholder="9876543210"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Parent Password *</label>
                  <input
                    type="password"
                    className="p-2 border border-gray-300 rounded-lg text-xs"
                    {...registerSingle("newParentPassword")}
                    defaultValue="Student@123"
                    placeholder="Student@123"
                  />
                </div>
              </div>
            )}
          </div>

          <span className="text-xs text-gray-400 font-medium">Personal Information</span>
          <div className="flex justify-between flex-wrap gap-4">
            {type === "update" && (
              <>
                <InputField
                  label="Username"
                  name="username"
                  defaultValue={data?.username}
                  register={registerSingle}
                  error={errorsSingle.username}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue={data?.email}
                  register={registerSingle}
                  error={errorsSingle.email}
                />
              </>
            )}
            <InputField
              label="Phone"
              name="phone"
              defaultValue={data?.phone}
              register={registerSingle}
              error={errorsSingle.phone}
            />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <label className="text-xs font-semibold text-gray-600">Profile Picture</label>
            <CldUploadWidget
              uploadPreset="school_management"
              onSuccess={(result: any) => setImg(result.info)}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="p-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 w-full"
                >
                  {img ? (
                    <Image
                      src={img?.secure_url}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-lg">
                      <span className="text-xs text-gray-500">Upload</span>
                    </div>
                  )}
                </button>
              )}
            </CldUploadWidget>
          </div>

          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="Birthday"
              name="birthday"
              defaultValue={
                data?.birthday
                  ? new Date(data.birthday).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              register={registerSingle}
              error={errorsSingle.birthday}
              type="date"
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500 font-semibold">Sex</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white"
                {...registerSingle("sex")}
                defaultValue={data?.sex || "MALE"}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500 font-semibold">Grade Level *</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white"
                {...registerSingle("gradeId")}
                defaultValue={data?.gradeId}
              >
                {grades.map((grade: { id: number; level: number }) => (
                  <option value={grade.id} key={grade.id}>
                    Grade {grade.level}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500 font-semibold">Section / Class *</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white"
                {...registerSingle("classId")}
                defaultValue={data?.classId}
              >
                {classes.map(
                  (classItem: {
                    id: number;
                    name: string;
                    capacity: number;
                    _count?: { students: number };
                  }) => {
                    const rawName = classItem.name || "";
                    const formattedName = rawName.toLowerCase().startsWith("class") ? rawName : `Class ${rawName}`;
                    const count = classItem._count?.students ?? 0;
                    const capacity = classItem.capacity ?? 0;
                    return (
                      <option value={classItem.id} key={classItem.id}>
                        {formattedName} ({count}/{capacity} Capacity)
                      </option>
                    );
                  }
                )}
              </select>
            </div>
          </div>

          {singleState.error && (
            <span className="text-red-500 font-medium">
              {singleState.message || "Something went wrong!"}
            </span>
          )}

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold transition-all shadow-md">
            {type === "create" ? "Create Student" : "Update Student"}
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentForm;