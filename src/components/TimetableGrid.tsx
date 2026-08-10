"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import {
  Plus, X, Check, Settings, Clock, Trash2, Coffee, ChevronDown, ChevronUp,
  Save, RotateCcw, GripVertical,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type Period = {
  uid: string;      // unique ID (stable across edits)
  label: string;    // "Period 1", "Break", etc.
  start: string;    // "HH:MM"
  end: string;      // "HH:MM"
  isBreak: boolean; // true = non-assignable separator row
};

export type Subject  = { id: number; name: string };
export type Teacher  = { id: string; name: string; surname: string };
export type Lesson   = {
  id: number; day: string; startTime: Date;
  subjectId: number; teacherId?: string;
  subject: { name: string };
  teacher: { id?: string; name: string; surname: string };
};

// ─── DEFAULT PERIOD TEMPLATE ─────────────────────────────────────────────────

const DEFAULT_PERIODS: Period[] = [
  { uid: "p1",  label: "Period 1", start: "08:00", end: "08:45", isBreak: false },
  { uid: "p2",  label: "Period 2", start: "08:45", end: "09:30", isBreak: false },
  { uid: "p3",  label: "Period 3", start: "09:30", end: "10:15", isBreak: false },
  { uid: "br1", label: "Break",    start: "10:15", end: "10:30", isBreak: true  },
  { uid: "p4",  label: "Period 4", start: "10:30", end: "11:15", isBreak: false },
  { uid: "p5",  label: "Period 5", start: "11:15", end: "12:00", isBreak: false },
  { uid: "ln1", label: "Lunch",    start: "12:00", end: "12:45", isBreak: true  },
  { uid: "p6",  label: "Period 6", start: "12:45", end: "13:30", isBreak: false },
  { uid: "p7",  label: "Period 7", start: "13:30", end: "14:15", isBreak: false },
  { uid: "p8",  label: "Period 8", start: "14:15", end: "15:00", isBreak: false },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;
export const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu", FRIDAY: "Fri",
};
const DAY_COLORS: Record<string, string> = {
  MONDAY: "bg-blue-500", TUESDAY: "bg-purple-500", WEDNESDAY: "bg-emerald-500",
  THURSDAY: "bg-amber-500", FRIDAY: "bg-rose-500",
};
const DAY_LIGHT: Record<string, string> = {
  MONDAY: "bg-blue-50 border-blue-200 text-blue-700",
  TUESDAY: "bg-purple-50 border-purple-200 text-purple-700",
  WEDNESDAY: "bg-emerald-50 border-emerald-200 text-emerald-700",
  THURSDAY: "bg-amber-50 border-amber-200 text-amber-700",
  FRIDAY: "bg-rose-50 border-rose-200 text-rose-700",
};
const SUBJECT_COLORS = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-amber-100 text-amber-800 border-amber-200",
  "bg-rose-100 text-rose-800 border-rose-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-teal-100 text-teal-800 border-teal-200",
  "bg-orange-100 text-orange-800 border-orange-200",
];

function subjectColor(id: number) { return SUBJECT_COLORS[id % SUBJECT_COLORS.length]; }
function cellKey(day: string, uid: string) { return `${day}__${uid}`; }
function uid() { return Math.random().toString(36).slice(2, 9); }

// ─── PERIOD SETTINGS PANEL ────────────────────────────────────────────────────

function PeriodSettingsPanel({
  periods,
  onChange,
  onClose,
}: {
  periods: Period[];
  onChange: (p: Period[]) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Period[]>(periods);

  const update = (idx: number, patch: Partial<Period>) => {
    setDraft((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const addPeriod = () => {
    // Suggest next time from last period's end
    const last = [...draft].reverse().find((p) => !p.isBreak);
    const start = last?.end ?? "08:00";
    const [h, m] = start.split(":").map(Number);
    const endDate = new Date(2000, 0, 1, h, m + 45);
    const end = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
    const periodNum = draft.filter((p) => !p.isBreak).length + 1;
    setDraft((prev) => [...prev, { uid: uid(), label: `Period ${periodNum}`, start, end, isBreak: false }]);
  };

  const addBreak = () => {
    const last = draft[draft.length - 1];
    const start = last?.end ?? "10:00";
    const [h, m] = start.split(":").map(Number);
    const endDate = new Date(2000, 0, 1, h, m + 20);
    const end = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
    setDraft((prev) => [...prev, { uid: uid(), label: "Break", start, end, isBreak: true }]);
  };

  const remove = (idx: number) => {
    setDraft((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = () => {
    onChange(draft);
    onClose();
  };

  const reset = () => setDraft(DEFAULT_PERIODS);

  return (
    <div className="bg-white rounded-2xl border border-indigo-200 shadow-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-gray-800">Configure Periods &amp; Times</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-[10px] font-semibold text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-100" />Period</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100" />Break / Lunch</span>
      </div>

      {/* Period rows */}
      <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
        {draft.map((period, idx) => (
          <div
            key={period.uid}
            className={`flex items-center gap-2 p-2.5 rounded-xl border ${
              period.isBreak ? "bg-amber-50 border-amber-200" : "bg-indigo-50 border-indigo-100"
            }`}
          >
            {/* Grip — visual only */}
            <GripVertical className="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />

            {/* Label */}
            <input
              type="text"
              value={period.label}
              onChange={(e) => update(idx, { label: e.target.value })}
              className="w-24 text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white"
              placeholder="Label"
            />

            {/* Start time */}
            <div className="flex items-center gap-1 flex-1">
              <label className="text-[10px] text-gray-400 shrink-0">From</label>
              <input
                type="time"
                value={period.start}
                onChange={(e) => update(idx, { start: e.target.value })}
                className="flex-1 min-w-0 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white"
              />
            </div>

            {/* End time */}
            <div className="flex items-center gap-1 flex-1">
              <label className="text-[10px] text-gray-400 shrink-0">To</label>
              <input
                type="time"
                value={period.end}
                onChange={(e) => update(idx, { end: e.target.value })}
                className="flex-1 min-w-0 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white"
              />
            </div>

            {/* Break toggle */}
            <button
              title={period.isBreak ? "Make period" : "Make break"}
              onClick={() => update(idx, { isBreak: !period.isBreak })}
              className={`shrink-0 p-1.5 rounded-lg transition-colors text-[10px] font-bold border ${
                period.isBreak
                  ? "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200"
                  : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              onClick={() => remove(idx)}
              className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add buttons */}
      <div className="flex gap-2">
        <button
          onClick={addPeriod}
          className="flex-1 flex items-center justify-center gap-1.5 border-2 border-dashed border-indigo-300 text-indigo-600 text-xs font-bold py-2 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Period
        </button>
        <button
          onClick={addBreak}
          className="flex-1 flex items-center justify-center gap-1.5 border-2 border-dashed border-amber-300 text-amber-600 text-xs font-bold py-2 rounded-xl hover:bg-amber-50 transition-colors"
        >
          <Coffee className="w-3.5 h-3.5" /> Add Break
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset defaults
        </button>
        <button
          onClick={save}
          className="ml-auto flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-colors"
        >
          <Save className="w-3.5 h-3.5" /> Apply Changes
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface Props {
  classId: number;
  className: string;
  schoolId: string;
  subjects: Subject[];
  teachers: Teacher[];
  lessons: Lesson[];
  saveTimetableAction: (fd: FormData) => Promise<{ success: boolean; message?: string }>;
  deleteLessonAction:  (fd: FormData) => Promise<{ success: boolean; message?: string }>;
}

type CellData = { lessonId?: number; subjectId: number | null; teacherId: string | null };

export default function TimetableGrid({
  classId, className, schoolId,
  subjects, teachers, lessons,
  saveTimetableAction, deleteLessonAction,
}: Props) {

  // ── Load period config from localStorage ──────────────────────────────────
  const storageKey = `timetable_periods_${schoolId}`;

  const [periods, setPeriods] = useState<Period[]>(DEFAULT_PERIODS);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setPeriods(JSON.parse(stored));
    } catch {}
  }, [storageKey]);

  const applyPeriods = useCallback((updated: Period[]) => {
    setPeriods(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  }, [storageKey]);

  // ── Build cell map from existing lessons ──────────────────────────────────
  const buildCells = useCallback((): Record<string, CellData> => {
    const map: Record<string, CellData> = {};
    for (const lesson of lessons) {
      const t = new Date(lesson.startTime).toISOString().slice(11, 16); // "HH:MM" UTC
      const period = periods.find((p) => !p.isBreak && p.start === t);
      if (period) {
        map[cellKey(lesson.day, period.uid)] = {
          lessonId: lesson.id,
          subjectId: lesson.subjectId,
          teacherId: lesson.teacherId ?? null,
        };
      }
    }
    return map;
  }, [lessons, periods]);

  const [cells, setCells] = useState<Record<string, CellData>>(buildCells);

  // Rebuild cells when periods change (in case times shifted)
  useEffect(() => { setCells(buildCells()); }, [buildCells]);

  // ── Cell editor state ─────────────────────────────────────────────────────
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [pendingSubject, setPendingSubject] = useState<number | null>(null);
  const [pendingTeacher, setPendingTeacher] = useState<string | null>(null);
  const [saving, startSave] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const openCell = (key: string) => {
    const existing = cells[key];
    setPendingSubject(existing?.subjectId ?? null);
    setPendingTeacher(existing?.teacherId ?? null);
    setEditingCell(key);
    setStatusMsg(null);
  };

  const closeCell = () => {
    setEditingCell(null);
    setPendingSubject(null);
    setPendingTeacher(null);
  };

  const saveCell = (day: string, period: Period) => {
    const key = cellKey(day, period.uid);
    if (!pendingSubject || !pendingTeacher) {
      setStatusMsg({ type: "err", text: "Select both subject and teacher." });
      return;
    }
    const subject = subjects.find((s) => s.id === pendingSubject);
    if (!subject) return;

    startSave(async () => {
      const fd = new FormData();
      fd.append("classId",    classId.toString());
      fd.append("day",        day);
      fd.append("subjectId",  pendingSubject.toString());
      fd.append("teacherId",  pendingTeacher!);
      fd.append("startTime",  period.start);
      fd.append("endTime",    period.end);
      fd.append("lessonName", `${subject.name} - ${className}`);
      const existing = cells[key];
      if (existing?.lessonId) fd.append("lessonId", existing.lessonId.toString());

      const result = await saveTimetableAction(fd);
      if (result.success) {
        setCells((prev) => ({ ...prev, [key]: { ...prev[key], subjectId: pendingSubject, teacherId: pendingTeacher! } }));
        setStatusMsg({ type: "ok", text: "Saved!" });
        setTimeout(closeCell, 500);
      } else {
        setStatusMsg({ type: "err", text: result.message ?? "Failed to save." });
      }
    });
  };

  const clearCell = (day: string, uid: string) => {
    const key = cellKey(day, uid);
    const existing = cells[key];
    if (!existing?.lessonId) {
      setCells((prev) => { const n = { ...prev }; delete n[key]; return n; });
      return;
    }
    startSave(async () => {
      const fd = new FormData();
      fd.append("id", existing.lessonId!.toString());
      const result = await deleteLessonAction(fd);
      if (result.success) {
        setCells((prev) => { const n = { ...prev }; delete n[key]; return n; });
      } else {
        setStatusMsg({ type: "err", text: result.message ?? "Failed to delete." });
      }
    });
  };

  const activePeriods = periods.filter((p) => !p.isBreak);
  const totalPeriodCount = activePeriods.length;

  return (
    <div className="space-y-4">
      {/* Overlay to close cell editor */}
      {editingCell && <div className="fixed inset-0 z-10" onClick={closeCell} />}

      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Day fill stats */}
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const count = activePeriods.filter((p) => cells[cellKey(day, p.uid)]?.subjectId).length;
            return (
              <div key={day} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${DAY_LIGHT[day]}`}>
                <span className={`w-2 h-2 rounded-full ${DAY_COLORS[day]}`} />
                {DAY_SHORT[day]}: {count}/{totalPeriodCount}
              </div>
            );
          })}
        </div>

        {/* Period Settings button */}
        <button
          onClick={() => setShowSettings((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
            showSettings
              ? "bg-indigo-500 text-white border-indigo-500"
              : "bg-white text-gray-600 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
          }`}
        >
          <Settings className="w-4 h-4" />
          Configure Periods
          {showSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Saved confirmation */}
      {settingsSaved && (
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700">
          <Check className="w-4 h-4" /> Period configuration saved!
        </div>
      )}

      {/* PERIOD SETTINGS PANEL */}
      {showSettings && (
        <PeriodSettingsPanel
          periods={periods}
          onChange={applyPeriods}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* TIMETABLE GRID */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-28 px-3 py-3 text-left text-xs font-bold text-gray-400 uppercase">Period</th>
              {DAYS.map((day) => (
                <th key={day} className="px-2 py-3 text-center">
                  <span className={`inline-flex px-3 py-1.5 rounded-xl text-xs font-bold text-white ${DAY_COLORS[day]}`}>
                    {DAY_SHORT[day]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => {
              if (period.isBreak) {
                return (
                  <tr key={period.uid} className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <td colSpan={6} className="px-3 py-2 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wide">
                        <Coffee className="w-3.5 h-3.5" />
                        {period.label} · {period.start} – {period.end}
                      </span>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={period.uid} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  {/* Period label */}
                  <td className="px-3 py-2">
                    <p className="text-xs font-bold text-gray-700">{period.label}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {period.start} – {period.end}
                    </p>
                  </td>

                  {/* Day cells */}
                  {DAYS.map((day) => {
                    const key = cellKey(day, period.uid);
                    const cell = cells[key];
                    const subject = cell?.subjectId ? subjects.find((s) => s.id === cell.subjectId) : null;
                    const teacher = cell?.teacherId ? teachers.find((t) => t.id === cell.teacherId) : null;
                    const isEditing = editingCell === key;
                    const sColor = subject ? subjectColor(subject.id) : "";

                    return (
                      <td key={day} className="px-2 py-2 relative">
                        {isEditing ? (
                          <div className="relative z-20">
                            <div
                              className="absolute top-0 left-0 w-60 bg-white rounded-2xl border-2 border-indigo-300 shadow-2xl p-4 z-20"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Popover header */}
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="text-xs font-bold text-gray-700">{period.label}</p>
                                  <p className="text-[10px] text-gray-400">{DAY_SHORT[day]} · {period.start}–{period.end}</p>
                                </div>
                                <button onClick={closeCell} className="p-1 hover:bg-gray-100 rounded-lg">
                                  <X className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                              </div>

                              {/* Subject */}
                              <div className="mb-2.5">
                                <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">Subject</label>
                                <select
                                  value={pendingSubject ?? ""}
                                  onChange={(e) => setPendingSubject(e.target.value ? parseInt(e.target.value) : null)}
                                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-gray-50"
                                >
                                  <option value="">— Choose Subject —</option>
                                  {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Teacher */}
                              <div className="mb-3">
                                <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">Teacher</label>
                                <select
                                  value={pendingTeacher ?? ""}
                                  onChange={(e) => setPendingTeacher(e.target.value || null)}
                                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-gray-50"
                                >
                                  <option value="">— Choose Teacher —</option>
                                  {teachers.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name} {t.surname}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Status message */}
                              {statusMsg && (
                                <p className={`text-[10px] mb-2 font-bold ${statusMsg.type === "ok" ? "text-emerald-600" : "text-red-500"}`}>
                                  {statusMsg.type === "ok" ? "✓" : "✗"} {statusMsg.text}
                                </p>
                              )}

                              {/* Save button */}
                              <button
                                onClick={() => saveCell(day, period)}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                {saving ? "Saving…" : "Save Assignment"}
                              </button>
                            </div>
                          </div>
                        ) : subject ? (
                          /* FILLED CELL */
                          <div
                            className={`group relative rounded-xl border px-2 py-2 cursor-pointer hover:shadow-md transition-all ${sColor}`}
                            onClick={() => openCell(key)}
                          >
                            <p className="text-[11px] font-bold truncate leading-tight">{subject.name}</p>
                            {teacher && (
                              <p className="text-[9px] opacity-60 truncate mt-0.5">{teacher.name} {teacher.surname}</p>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); clearCell(day, period.uid); }}
                              className="absolute -top-1.5 -right-1.5 hidden group-hover:flex w-5 h-5 bg-red-500 text-white rounded-full items-center justify-center shadow-md"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          /* EMPTY CELL */
                          <button
                            onClick={() => openCell(key)}
                            className="w-full h-11 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-center group"
                          >
                            <Plus className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Add period row shortcut */}
            <tr className="border-t-2 border-dashed border-gray-100">
              <td colSpan={6} className="px-3 py-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 py-2 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add / Configure Periods
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Click <strong>+</strong> to assign · Click filled cell to edit · Hover to remove · Use <strong>Configure Periods</strong> to add periods &amp; set times
      </p>
    </div>
  );
}
