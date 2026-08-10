"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { bulkUploadSectionResults } from "@/lib/actions";
import { Plus, Table as TableIcon, Loader2, Check } from "lucide-react";

export default function SectionMarksUploadModal({
  classes,
}: {
  classes: { id: number; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  
  const [loadingData, setLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [studentScores, setStudentScores] = useState<Record<string, string>>({});

  const router = useRouter();
  const [state, formAction] = useFormState(bulkUploadSectionResults, { success: false, error: false });

  // Fetch Section Students & Exams whenever selectedClassId changes
  useEffect(() => {
    if (!selectedClassId) {
      setStudents([]);
      setExams([]);
      setSelectedExamId("");
      setStudentScores({});
      return;
    }

    setLoadingData(true);
    fetch(`/api/admin/sections/${selectedClassId}/students-exams`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        setExams(data.exams || []);
        if (data.exams && data.exams.length > 0) {
          setSelectedExamId(data.exams[0].id.toString());
        } else {
          setSelectedExamId("");
        }
      })
      .catch((err) => {
        console.error("Failed to load section data:", err);
        toast.error("Failed to load section students and exams.");
      })
      .finally(() => setLoadingData(false));
  }, [selectedClassId]);

  // Populate student scores when selectedExamId changes
  useEffect(() => {
    if (!selectedExamId || exams.length === 0) return;
    const currentExam = exams.find((e) => e.id.toString() === selectedExamId);
    if (!currentExam || !currentExam.results) return;

    const scoresMap: Record<string, string> = {};
    currentExam.results.forEach((r: any) => {
      if (r.studentId) {
        scoresMap[r.studentId] = r.score.toString();
      }
    });
    setStudentScores(scoresMap);
  }, [selectedExamId, exams]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Marks uploaded successfully!");
      setOpen(false);
      setIsSubmitting(false);
      router.refresh();
    } else if (state.error) {
      setIsSubmitting(false);
      toast.error(state.message || "Failed to upload marks.");
    }
  }, [state, router]);

  const handleScoreChange = (studentId: string, value: string) => {
    setStudentScores((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const selectedExamObj = exams.find((e) => e.id.toString() === selectedExamId);
  const maxMarks = selectedExamObj?.maxMarks ?? 100;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-md shadow-sm transition-colors cursor-pointer"
      >
        <TableIcon className="w-4 h-4" />
        <span>Section Marks Upload</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Upload Marks by Section</h2>
                <p className="text-xs text-gray-500">Select Section, choose Exam/Subject, and enter marks for all students.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form
              action={(formData) => {
                setIsSubmitting(true);
                formAction(formData);
              }}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-6"
            >
              {/* Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Section / Class Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">1. Select Section / Class *</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="ring-[1.5px] ring-gray-300 p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-purple-500 font-medium"
                    required
                  >
                    <option value="">-- Choose Section / Class --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Section {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exam / Subject Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">2. Select Exam / Subject *</label>
                  <select
                    name="examId"
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    disabled={!selectedClassId || loadingData}
                    className="ring-[1.5px] ring-gray-300 p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-purple-500 font-medium disabled:opacity-50"
                    required
                  >
                    <option value="">-- Choose Exam / Subject --</option>
                    {exams.map((e) => {
                      const subjectName = e.lesson?.subject?.name || e.lessonName || "Subject";
                      return (
                        <option key={e.id} value={e.id}>
                          {subjectName} — {e.title} (Max: {e.maxMarks})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Students Grid */}
              {loadingData ? (
                <div className="flex items-center justify-center py-12 text-gray-500 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <span className="text-sm font-medium">Loading section students...</span>
                </div>
              ) : selectedClassId && students.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">No students enrolled in this section.</p>
              ) : selectedClassId && exams.length === 0 ? (
                <p className="text-center text-amber-600 bg-amber-50 p-4 rounded-lg text-sm font-medium">
                  No exams created for this section yet. Please create an exam for this section first.
                </p>
              ) : selectedClassId && selectedExamId ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-gray-200">
                    <span className="text-xs font-bold text-gray-700">Students ({students.length})</span>
                    <span className="text-xs font-bold text-purple-700">Max Marks: {maxMarks}</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                    {students.map((st) => (
                      <div key={st.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{st.name} {st.surname}</p>
                          <p className="text-[11px] text-gray-400">Roll / Username: {st.username || st.rollNumber || st.id.slice(0, 8)}</p>
                          <input type="hidden" name="studentId" value={st.id} />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            name="score"
                            min={0}
                            max={maxMarks}
                            value={studentScores[st.id] ?? ""}
                            onChange={(e) => handleScoreChange(st.id, e.target.value)}
                            placeholder="Marks"
                            className="w-24 ring-1 ring-gray-300 p-2 rounded-md text-sm text-center font-bold focus:outline-none focus:ring-purple-500"
                          />
                          <span className="text-xs text-gray-400 font-medium">/ {maxMarks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Submit Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedClassId || !selectedExamId || students.length === 0 || isSubmitting}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Marks...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Upload Section Marks</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
