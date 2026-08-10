"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  bulkMarkAttendance,
  bulkUploadResults,
  createDiscipline,
  deleteDiscipline,
} from "@/lib/actions";
import {
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  Trophy,
  AlertTriangle,
  Users,
} from "lucide-react";

type Student = { id: string; name: string; surname: string; classId: number };
type Lesson = { id: number; name: string; classId: number; className: string };
type Exam = { id: number; title: string; lessonId: number | null };
type Assignment = { id: number; title: string; lessonId: number | null };
type DisciplineRecord = {
  id: number;
  date: string;
  type: string;
  description: string;
  student: { name: string; surname: string };
};

type Props = {
  students: Student[];
  lessons: Lesson[];
  exams: Exam[];
  assignments: Assignment[];
  disciplineRecords: DisciplineRecord[];
  initialTab?: "attendance" | "marks" | "discipline";
};

const TABS = [
  { id: "attendance" as const, label: "Attendance", icon: ClipboardCheck, color: "text-green-600" },
  { id: "marks" as const, label: "Upload Marks", icon: Trophy, color: "text-orange-600" },
  { id: "discipline" as const, label: "Discipline", icon: AlertTriangle, color: "text-red-600" },
];

const DISCIPLINE_TYPES = [
  { value: "WARNING", label: "Warning", emoji: "⚠️" },
  { value: "DETENTION", label: "Detention", emoji: "⏱️" },
  { value: "SUSPENSION", label: "Suspension", emoji: "🚫" },
  { value: "NOTE", label: "Note", emoji: "📝" },
];

const todayStr = () => new Date().toISOString().split("T")[0];

export default function TeacherWorkspace({
  students,
  lessons,
  exams,
  assignments,
  disciplineRecords,
  initialTab = "attendance",
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState(initialTab);

  // ── Attendance state ──
  const [attLessonId, setAttLessonId] = useState(lessons[0]?.id?.toString() ?? "");
  const [attDate, setAttDate] = useState(todayStr());
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const attStudents = useMemo(() => {
    const lesson = lessons.find((l) => l.id === parseInt(attLessonId));
    if (!lesson) return students;
    return students.filter((s) => s.classId === lesson.classId);
  }, [students, lessons, attLessonId]);

  useEffect(() => {
    const init: Record<string, boolean> = {};
    attStudents.forEach((s) => { init[s.id] = true; });
    setAttendance(init);
  }, [attStudents, attLessonId]);

  const [attState, attAction] = useFormState(bulkMarkAttendance, { success: false, error: false });

  useEffect(() => {
    if (attState.success) {
      toast.success(attState.message ?? "Attendance saved!");
      router.refresh();
    }
    if (attState.error) toast.error(attState.message ?? "Failed to save attendance.");
  }, [attState, router]);

  const submitAttendance = () => {
    if (!attLessonId) { toast.error("Select a lesson first."); return; }
    const records = attStudents.map((s) => ({
      studentId: s.id,
      present: attendance[s.id] ?? true,
    }));
    attAction({ lessonId: parseInt(attLessonId), date: new Date(attDate), records });
  };

  // ── Marks state ──
  const [markType, setMarkType] = useState<"exam" | "assignment">("exam");
  const [markExamId, setMarkExamId] = useState(exams[0]?.id?.toString() ?? "");
  const [markAssignmentId, setMarkAssignmentId] = useState(assignments[0]?.id?.toString() ?? "");
  const [scores, setScores] = useState<Record<string, string>>({});

  const markStudents = useMemo(() => {
    if (markType === "exam") {
      const exam = exams.find((e) => e.id === parseInt(markExamId));
      if (!exam || !exam.lessonId) return [];
      const lesson = lessons.find((l) => l.id === exam.lessonId);
      if (!lesson) return students;
      return students.filter((s) => s.classId === lesson.classId);
    }
    const assignment = assignments.find((a) => a.id === parseInt(markAssignmentId));
    if (!assignment || !assignment.lessonId) return [];
    const lesson = lessons.find((l) => l.id === assignment.lessonId);
    if (!lesson) return students;
    return students.filter((s) => s.classId === lesson.classId);
  }, [markType, markExamId, markAssignmentId, exams, assignments, lessons, students]);

  useEffect(() => {
    const init: Record<string, string> = {};
    markStudents.forEach((s) => { init[s.id] = scores[s.id] ?? ""; });
    setScores(init);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markStudents, markType, markExamId, markAssignmentId]);

  const [markState, markAction] = useFormState(bulkUploadResults, { success: false, error: false });

  useEffect(() => {
    if (markState.success) {
      toast.success(markState.message ?? "Marks saved!");
      router.refresh();
    }
    if (markState.error) toast.error(markState.message ?? "Failed to save marks.");
  }, [markState, router]);

  const submitMarks = () => {
    const records = markStudents
      .filter((s) => scores[s.id] !== "" && scores[s.id] !== undefined)
      .map((s) => ({ studentId: s.id, score: parseInt(scores[s.id]) }));
    if (records.length === 0) { toast.error("Enter at least one score."); return; }
    markAction({
      examId: markType === "exam" && markExamId ? parseInt(markExamId) : null,
      assignmentId: markType === "assignment" && markAssignmentId ? parseInt(markAssignmentId) : null,
      records,
    });
  };

  // ── Discipline state ──
  const [discStudentId, setDiscStudentId] = useState(students[0]?.id ?? "");
  const [discType, setDiscType] = useState("WARNING");
  const [discDesc, setDiscDesc] = useState("");
  const [discDate, setDiscDate] = useState(todayStr());

  const [discState, discAction] = useFormState(createDiscipline, { success: false, error: false });
  const [delState, delAction] = useFormState(deleteDiscipline, { success: false, error: false });

  useEffect(() => {
    if (discState.success) {
      toast.success(discState.message ?? "Discipline record added!");
      setDiscDesc("");
      router.refresh();
    }
    if (discState.error) toast.error(discState.message ?? "Failed to add record.");
  }, [discState, router]);

  useEffect(() => {
    if (delState.success) {
      toast.success("Record deleted.");
      router.refresh();
    }
    if (delState.error) toast.error(delState.message ?? "Failed to delete.");
  }, [delState, router]);

  const submitDiscipline = () => {
    if (!discStudentId || !discDesc.trim()) {
      toast.error("Select a student and enter a description.");
      return;
    }
    discAction({
      studentId: discStudentId,
      type: discType as "WARNING" | "DETENTION" | "SUSPENSION" | "NOTE",
      description: discDesc.trim(),
      date: new Date(discDate),
    });
  };

  const presentCount = attStudents.filter((s) => attendance[s.id]).length;
  const absentCount = attStudents.length - presentCount;

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              tab === t.id
                ? "bg-white shadow-sm border-gray-200 text-gray-800"
                : "bg-gray-50 border-transparent text-gray-500 hover:bg-white hover:border-gray-200"
            }`}
          >
            <t.icon className={`w-4 h-4 ${tab === t.id ? t.color : "text-gray-400"}`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ATTENDANCE TAB ── */}
      {tab === "attendance" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Class Roll Call</h2>
              <p className="text-xs text-gray-500">Mark all students at once — no need to add one by one</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                {presentCount} Present
              </span>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                {absentCount} Absent
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Lesson / Class</label>
              <select
                value={attLessonId}
                onChange={(e) => setAttLessonId(e.target.value)}
                className="ring-[1.5px] ring-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-green-400"
              >
                {lessons.length === 0 && <option value="">No lessons assigned</option>}
                {lessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.className}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Date</label>
              <input
                type="date"
                value={attDate}
                onChange={(e) => setAttDate(e.target.value)}
                className="ring-[1.5px] ring-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-green-400"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const all: Record<string, boolean> = {};
                attStudents.forEach((s) => { all[s.id] = true; });
                setAttendance(all);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => {
                const all: Record<string, boolean> = {};
                attStudents.forEach((s) => { all[s.id] = false; });
                setAttendance(all);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            >
              Mark All Absent
            </button>
          </div>

          {attStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No students found for this lesson.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto rounded-xl border border-gray-100">
              {attStudents.map((s) => {
                const isPresent = attendance[s.id] ?? true;
                return (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">
                      {s.name} {s.surname}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAttendance((prev) => ({ ...prev, [s.id]: !isPresent }))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isPresent
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {isPresent ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Present</>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5" /> Absent</>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={submitAttendance}
            disabled={attStudents.length === 0}
            className="bg-green-600 text-white py-2.5 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 self-start"
          >
            Save Attendance ({attStudents.length} students)
          </button>
        </div>
      )}

      {/* ── MARKS TAB ── */}
      {tab === "marks" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Upload Marks</h2>
            <p className="text-xs text-gray-500">Enter scores for the whole class in one go</p>
          </div>

          <div className="flex gap-2">
            {(["exam", "assignment"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMarkType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                  markType === t
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {t === "exam" ? "Exam" : "Assignment"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">
              {markType === "exam" ? "Select Exam" : "Select Assignment"}
            </label>
            {markType === "exam" ? (
              <select
                value={markExamId}
                onChange={(e) => setMarkExamId(e.target.value)}
                className="ring-[1.5px] ring-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-orange-400"
              >
                {exams.length === 0 && <option value="">No exams found</option>}
                {exams.map((e) => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            ) : (
              <select
                value={markAssignmentId}
                onChange={(e) => setMarkAssignmentId(e.target.value)}
                className="ring-[1.5px] ring-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-orange-400"
              >
                {assignments.length === 0 && <option value="">No assignments found</option>}
                {assignments.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            )}
          </div>

          {markStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <Trophy className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No students found for this {markType}.
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-[1fr_100px] bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
                <span>Student</span>
                <span>Score (0–100)</span>
              </div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {markStudents.map((s) => (
                  <div key={s.id} className="grid grid-cols-[1fr_100px] items-center px-4 py-2.5 hover:bg-gray-50">
                    <span className="text-sm text-gray-700">{s.name} {s.surname}</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="—"
                      value={scores[s.id] ?? ""}
                      onChange={(e) => setScores((prev) => ({ ...prev, [s.id]: e.target.value }))}
                      className="ring-[1.5px] ring-gray-300 p-1.5 rounded-md text-sm text-center focus:outline-none focus:ring-orange-400 w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={submitMarks}
            disabled={markStudents.length === 0}
            className="bg-orange-500 text-white py-2.5 px-6 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 self-start"
          >
            Save Marks
          </button>
        </div>
      )}

      {/* ── DISCIPLINE TAB ── */}
      {tab === "discipline" && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Add Discipline Record</h2>
              <p className="text-xs text-gray-500">Log warnings, detentions, or notes for a student</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs text-gray-500 font-medium">Student</label>
                <select
                  value={discStudentId}
                  onChange={(e) => setDiscStudentId(e.target.value)}
                  className="ring-[1.5px] ring-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-red-400"
                >
                  {students.length === 0 && <option value="">No students found</option>}
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} {s.surname}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Type</label>
                <select
                  value={discType}
                  onChange={(e) => setDiscType(e.target.value)}
                  className="ring-[1.5px] ring-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-red-400"
                >
                  {DISCIPLINE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Date</label>
                <input
                  type="date"
                  value={discDate}
                  onChange={(e) => setDiscDate(e.target.value)}
                  className="ring-[1.5px] ring-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-red-400"
                />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs text-gray-500 font-medium">Description</label>
                <textarea
                  value={discDesc}
                  onChange={(e) => setDiscDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe the incident or reason…"
                  className="ring-[1.5px] ring-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-red-400 resize-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={submitDiscipline}
              className="bg-red-600 text-white py-2.5 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors self-start"
            >
              Add Discipline Record
            </button>
          </div>

          {/* Recent records */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Records</h3>
            {disciplineRecords.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No discipline records yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {disciplineRecords.map((r) => {
                  const typeInfo = DISCIPLINE_TYPES.find((t) => t.value === r.type);
                  return (
                    <div key={r.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-800">
                            {r.student.name} {r.student.surname}
                          </span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                            {typeInfo?.emoji} {typeInfo?.label ?? r.type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(r.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">{r.description}</p>
                      </div>
                      <form action={delAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:text-red-700 font-medium shrink-0"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
