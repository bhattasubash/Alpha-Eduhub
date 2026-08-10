"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FileText,
  BookOpen,
  AlertTriangle,
  Plus,
  Save,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Users,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Class = {
  id: number;
  name: string;
};

type DiaryEntry = {
  id: number;
  date: string;
  classId: number;
  className: string;
  topicsCovered: string;
  homeworkGiven: string;
  studentBehaviour: string;
  specialNotes: string;
  createdAt: string;
};

export default function ClassDiaryPage() {
  const router = useRouter();

  // States
  const [classes, setClasses] = useState<Class[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set());

  // Form states
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    classId: "",
    topicsCovered: "",
    homeworkGiven: "",
    studentBehaviour: "",
    specialNotes: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch data
  useEffect(() => {
    fetchClasses();
    fetchDiaryEntries();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/teacher/classes");
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      toast.error("Failed to load classes");
    }
  };

  const fetchDiaryEntries = async () => {
    try {
      const response = await fetch("/api/teacher/diary");
      if (response.ok) {
        const data = await response.json();
        setDiaryEntries(data);
      }
    } catch (error) {
      console.error("Failed to fetch diary entries:", error);
      toast.error("Failed to load diary entries");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.classId || !formData.topicsCovered.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSaving(true);
    try {
      const url = isEditing ? `/api/teacher/diary/${editingId}` : "/api/teacher/diary";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(isEditing ? "Diary entry updated!" : "Diary entry created!");
        resetForm();
        fetchDiaryEntries();
        setShowCreateForm(false);
      } else {
        throw new Error("Failed to save diary entry");
      }
    } catch (error) {
      console.error("Error saving diary entry:", error);
      toast.error("Failed to save diary entry");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      classId: "",
      topicsCovered: "",
      homeworkGiven: "",
      studentBehaviour: "",
      specialNotes: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (entry: DiaryEntry) => {
    setFormData({
      date: entry.date.split("T")[0],
      classId: entry.classId.toString(),
      topicsCovered: entry.topicsCovered,
      homeworkGiven: entry.homeworkGiven,
      studentBehaviour: entry.studentBehaviour,
      specialNotes: entry.specialNotes,
    });
    setIsEditing(true);
    setEditingId(entry.id);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this diary entry?")) return;

    try {
      const response = await fetch(`/api/teacher/diary/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Diary entry deleted");
        fetchDiaryEntries();
      } else {
        throw new Error("Failed to delete diary entry");
      }
    } catch (error) {
      console.error("Error deleting diary entry:", error);
      toast.error("Failed to delete diary entry");
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredEntries = diaryEntries.filter((entry) => {
    const matchesClass = selectedClass === "all" || entry.className === selectedClass;
    const matchesDate = !selectedDate || entry.date.startsWith(selectedDate);
    const matchesSearch =
      entry.topicsCovered.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.homeworkGiven.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.specialNotes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesDate && matchesSearch;
  });

  const uniqueClasses = Array.from(new Set(diaryEntries.map((e) => e.className)));

  const isToday = (date: string) => {
    return date.split("T")[0] === new Date().toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Class Diary</h1>
          <p className="text-sm text-gray-500">Daily teaching notes and class records</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Entry</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditing ? "Edit Diary Entry" : "New Diary Entry"}
            </h2>
            <button
              onClick={() => {
                setShowCreateForm(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topics Covered *</label>
              <textarea
                value={formData.topicsCovered}
                onChange={(e) => setFormData({ ...formData, topicsCovered: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Enter topics covered in class"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Homework Given</label>
              <textarea
                value={formData.homeworkGiven}
                onChange={(e) => setFormData({ ...formData, homeworkGiven: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
                placeholder="Enter homework assigned"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Behaviour</label>
              <textarea
                value={formData.studentBehaviour}
                onChange={(e) => setFormData({ ...formData, studentBehaviour: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
                placeholder="Notes on student behaviour"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
              <textarea
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
                placeholder="Any special notes or observations"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : isEditing ? "Update Entry" : "Save Entry"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
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
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Diary Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => {
          const isExpanded = expandedEntries.has(entry.id);
          
          return (
            <div
              key={entry.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{entry.className}</h3>
                      {isToday(entry.date) && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Today</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{entry.topicsCovered}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {entry.homeworkGiven && (
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Homework Given</p>
                          <p className="text-sm text-gray-600">{entry.homeworkGiven}</p>
                        </div>
                      </div>
                    )}
                    {entry.studentBehaviour && (
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Student Behaviour</p>
                          <p className="text-sm text-gray-600">{entry.studentBehaviour}</p>
                        </div>
                      </div>
                    )}
                    {entry.specialNotes && (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Special Notes</p>
                          <p className="text-sm text-gray-600">{entry.specialNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No diary entries found</p>
            <button
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create your first entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
