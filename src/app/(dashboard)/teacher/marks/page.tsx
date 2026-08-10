"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Trophy,
  Upload,
  Download,
  Calculator,
  TrendingUp,
  TrendingDown,
  Save,
  FileSpreadsheet,
  Search,
  Filter,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

type Student = {
  id: string;
  name: string;
  surname: string;
  classId: number;
  className: string;
};

type Exam = {
  id: number;
  title: string;
  lessonId: number;
  lessonName: string;
  maxMarks: number;
};

type Assignment = {
  id: number;
  title: string;
  lessonId: number;
  lessonName: string;
  maxMarks: number;
};

type MarkRecord = {
  studentId: string;
  score: number | null;
};

export default function MarksPage() {
  const router = useRouter();
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedType, setSelectedType] = useState<"exam" | "assignment">("exam");
  const [selectedAssessment, setSelectedAssessment] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Analytics states
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
    passRate: 0,
    gradeDistribution: {} as Record<string, number>,
  });

  // Fetch data
  useEffect(() => {
    fetchStudents();
    fetchAssessments();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
      
      const timeout = setTimeout(() => {
        saveMarks(true);
      }, 5000);
      
      autoSaveTimeout.current = timeout;
    }

    return () => {
      if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    };
  }, [marks]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/teacher/students");
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to load students");
    }
  };

  const fetchAssessments = async () => {
    try {
      const [examsRes, assignmentsRes] = await Promise.all([
        fetch("/api/teacher/exams"),
        fetch("/api/teacher/assignments"),
      ]);

      if (examsRes.ok && assignmentsRes.ok) {
        const examsData = await examsRes.json();
        const assignmentsData = await assignmentsRes.json();
        
        setExams(examsData);
        setAssignments(assignmentsData);

        if (examsData.length > 0) {
          setSelectedAssessment(examsData[0].id.toString());
        }
      }
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
      toast.error("Failed to load assessments");
    }
  };

  const calculateGrade = (score: number, maxMarks: number): string => {
    const percentage = (score / maxMarks) * 100;
    
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const calculateGPA = (grade: string): number => {
    const gradeMap: Record<string, number> = {
      "A+": 4.0,
      "A": 4.0,
      "B": 3.0,
      "C": 2.0,
      "D": 1.0,
      "F": 0.0,
    };
    return gradeMap[grade] || 0;
  };

  const calculateAnalytics = () => {
    const currentAssessment = selectedType === "exam" 
      ? exams.find(e => e.id.toString() === selectedAssessment)
      : assignments.find(a => a.id.toString() === selectedAssessment);

    if (!currentAssessment) return;

    const scores = Object.values(marks).filter(s => s !== null && s !== undefined) as number[];
    
    if (scores.length === 0) {
      setAnalytics({
        average: 0,
        highest: 0,
        lowest: 0,
        passRate: 0,
        gradeDistribution: {},
      });
      return;
    }

    const maxMarks = currentAssessment.maxMarks;
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passCount = scores.filter(s => (s / maxMarks) * 100 >= 50).length;
    const passRate = (passCount / scores.length) * 100;

    const gradeDistribution: Record<string, number> = {};
    scores.forEach(score => {
      const grade = calculateGrade(score, maxMarks);
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    });

    setAnalytics({
      average: Math.round(average * 100) / 100,
      highest,
      lowest,
      passRate: Math.round(passRate),
      gradeDistribution,
    });

    setShowAnalytics(true);
  };

  const handleMarkChange = (studentId: string, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    setMarks(prev => ({
      ...prev,
      [studentId]: numValue as number,
    }));
    setHasUnsavedChanges(true);
  };

  const saveMarks = async (isAutoSave = false) => {
    if (!selectedAssessment) {
      toast.error("Please select an assessment first");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/teacher/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          assessmentId: parseInt(selectedAssessment),
          records: Object.entries(marks).map(([studentId, score]) => ({
            studentId,
            score: score === null ? null : score,
          })),
        }),
      });

      if (response.ok) {
        if (!isAutoSave) {
          toast.success("Marks saved successfully!");
        }
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      } else {
        throw new Error("Failed to save marks");
      }
    } catch (error) {
      console.error("Error saving marks:", error);
      if (!isAutoSave) {
        toast.error("Failed to save marks");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const exportToExcel = () => {
    const currentAssessment = selectedType === "exam" 
      ? exams.find(e => e.id.toString() === selectedAssessment)
      : assignments.find(a => a.id.toString() === selectedAssessment);

    if (!currentAssessment) return;

    const csvContent = [
      ["Student Name", "Surname", "Class", "Score", "Grade", "GPA"],
      ...filteredStudents.map(student => {
        const score = marks[student.id];
        const grade = score !== null && score !== undefined 
          ? calculateGrade(score, currentAssessment.maxMarks)
          : "N/A";
        const gpa = score !== null && score !== undefined 
          ? calculateGPA(grade)
          : "N/A";
        return [
          student.name,
          student.surname,
          student.className,
          score ?? "N/A",
          grade,
          gpa,
        ];
      }),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentAssessment.title}_marks.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Marks exported to Excel");
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");
      
      // Skip header row
      const dataLines = lines.slice(1);
      
      const importedMarks: Record<string, number> = {};
      
      dataLines.forEach(line => {
        const columns = line.split(",");
        if (columns.length >= 2) {
          const name = columns[0].trim();
          const score = parseFloat(columns[3]);
          
          const student = students.find(
            s => s.name.toLowerCase() === name.toLowerCase()
          );
          
          if (student && !isNaN(score)) {
            importedMarks[student.id] = score;
          }
        }
      });

      setMarks(prev => ({ ...prev, ...importedMarks }));
      setHasUnsavedChanges(true);
      toast.success(`Imported ${Object.keys(importedMarks).length} marks`);
    };

    reader.readAsText(file);
  };

  const filteredStudents = students.filter((student) => {
    const matchesClass = selectedClass === "all" || student.classId.toString() === selectedClass;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.surname.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const uniqueClasses = Array.from(new Set(students.map((s) => s.className)));

  const currentAssessment = selectedType === "exam" 
    ? exams.find(e => e.id.toString() === selectedAssessment)
    : assignments.find(a => a.id.toString() === selectedAssessment);

  const missingMarksCount = filteredStudents.filter(
    s => marks[s.id] === null || marks[s.id] === undefined
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Upload Marks</h1>
          <p className="text-sm text-gray-500">Quick and easy marks entry with analytics</p>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-gray-400">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Assessment Selection */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as "exam" | "assignment")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="exam">Exam</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedType === "exam" ? "Exam" : "Assignment"}
            </label>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select {selectedType}</option>
              {(selectedType === "exam" ? exams : assignments).map((assessment) => (
                <option key={assessment.id} value={assessment.id.toString()}>
                  {assessment.title} ({assessment.lessonName})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => calculateAnalytics()}
          className="flex items-center justify-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-700">Analytics</span>
        </button>
        <button
          onClick={exportToExcel}
          className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
        >
          <Download className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-700">Export</span>
        </button>
        <label className="flex items-center justify-center gap-2 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
          <Upload className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-700">Import</span>
          <input
            type="file"
            accept=".csv"
            onChange={importFromExcel}
            className="hidden"
          />
        </label>
        <button
          onClick={() => saveMarks(false)}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 p-4 bg-indigo-600 border border-indigo-700 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5 text-white" />
          <span className="font-medium text-white">{isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Performance Analytics</h2>
            <button
              onClick={() => setShowAnalytics(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{analytics.average}</p>
              <p className="text-xs text-blue-600">Class Average</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{analytics.highest}</p>
              <p className="text-xs text-green-600">Highest Score</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{analytics.lowest}</p>
              <p className="text-xs text-red-600">Lowest Score</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">{analytics.passRate}%</p>
              <p className="text-xs text-purple-600">Pass Rate</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Grade Distribution</h3>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(analytics.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="bg-gray-100 rounded-lg px-3 py-2">
                  <p className="text-lg font-bold text-gray-800">{grade}</p>
                  <p className="text-xs text-gray-500">{count} students</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Missing Marks Alert */}
      {missingMarksCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div className="flex-1">
            <p className="font-medium text-yellow-800">
              {missingMarksCount} students have missing marks
            </p>
            <p className="text-sm text-yellow-600">
              Please complete all marks before saving
            </p>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-800">
              Students ({filteredStudents.length})
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredStudents.map((student) => {
            const score = marks[student.id];
            const grade = score !== null && score !== undefined && currentAssessment
              ? calculateGrade(score, currentAssessment.maxMarks)
              : null;
            const gpa = grade ? calculateGPA(grade) : null;

            return (
              <div
                key={student.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-indigo-600">
                        {student.name[0]}{student.surname[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {student.name} {student.surname}
                      </p>
                      <p className="text-sm text-gray-500">{student.className}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={currentAssessment?.maxMarks || 100}
                        value={score ?? ""}
                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500">
                        / {currentAssessment?.maxMarks || 100}
                      </span>
                    </div>

                    {grade && (
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          grade === "A+" || grade === "A" ? "bg-green-100 text-green-700" :
                          grade === "B" ? "bg-blue-100 text-blue-700" :
                          grade === "C" ? "bg-yellow-100 text-yellow-700" :
                          grade === "D" ? "bg-orange-100 text-orange-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {grade}
                        </span>
                        {gpa !== null && (
                          <span className="text-xs text-gray-500">
                            GPA: {gpa.toFixed(1)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No students found matching your criteria
          </div>
        )}
      </div>

      {/* Sticky Save Button (Mobile) */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-40">
        <button
          onClick={() => saveMarks(false)}
          disabled={isSaving}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Marks"}
        </button>
      </div>
    </div>
  );
}
