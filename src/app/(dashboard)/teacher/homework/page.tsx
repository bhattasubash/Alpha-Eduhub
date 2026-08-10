"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  BookOpen,
  Plus,
  FileText,
  Calendar,
  Clock,
  Paperclip,
  Video,
  Image,
  Save,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Copy,
  Trash2,
  Edit,
} from "lucide-react";

type Class = {
  id: number;
  name: string;
};

type Homework = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  lessonId: number;
  lessonName: string;
  classes: string[];
  attachments: {
    type: "pdf" | "image" | "video";
    url: string;
    name: string;
  }[];
  createdAt: string;
};

export default function HomeworkPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [classes, setClasses] = useState<Class[]>([]);
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    lessonId: "",
    selectedClasses: [] as number[],
    attachments: [] as {
      type: "pdf" | "image" | "video";
      url: string;
      name: string;
    }[],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch data
  useEffect(() => {
    fetchClasses();
    fetchHomework();
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

  const fetchHomework = async () => {
    try {
      const response = await fetch("/api/teacher/homework");
      if (response.ok) {
        const data = await response.json();
        setHomeworkList(data);
      }
    } catch (error) {
      console.error("Failed to fetch homework:", error);
      toast.error("Failed to load homework");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        let type: "pdf" | "image" | "video" = "pdf";
        if (file.type.startsWith("image/")) {
          type = "image";
        } else if (file.type.startsWith("video/")) {
          type = "video";
        }

        setFormData((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              type,
              url: result,
              name: file.name,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const addVideoLink = () => {
    const url = prompt("Enter video URL (YouTube, Vimeo, etc.):");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          {
            type: "video",
            url,
            name: "Video Link",
          },
        ],
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const toggleClassSelection = (classId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(classId)
        ? prev.selectedClasses.filter((id) => id !== classId)
        : [...prev.selectedClasses, classId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.dueDate || formData.selectedClasses.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const url = isEditing ? `/api/teacher/homework/${editingId}` : "/api/teacher/homework";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(isEditing ? "Homework updated successfully!" : "Homework created successfully!");
        resetForm();
        fetchHomework();
        setShowCreateForm(false);
      } else {
        throw new Error("Failed to save homework");
      }
    } catch (error) {
      console.error("Error saving homework:", error);
      toast.error("Failed to save homework");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      lessonId: "",
      selectedClasses: [],
      attachments: [],
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (homework: Homework) => {
    setFormData({
      title: homework.title,
      description: homework.description,
      dueDate: homework.dueDate.split("T")[0],
      lessonId: homework.lessonId.toString(),
      selectedClasses: [],
      attachments: homework.attachments,
    });
    setIsEditing(true);
    setEditingId(homework.id);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this homework?")) return;

    try {
      const response = await fetch(`/api/teacher/homework/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Homework deleted successfully");
        fetchHomework();
      } else {
        throw new Error("Failed to delete homework");
      }
    } catch (error) {
      console.error("Error deleting homework:", error);
      toast.error("Failed to delete homework");
    }
  };

  const duplicateHomework = (homework: Homework) => {
    setFormData({
      title: `${homework.title} (Copy)`,
      description: homework.description,
      dueDate: "",
      lessonId: homework.lessonId.toString(),
      selectedClasses: [],
      attachments: homework.attachments,
    });
    setIsEditing(false);
    setEditingId(null);
    setShowCreateForm(true);
    toast.info("Homework duplicated. Edit and save to create.");
  };

  const filteredHomework = homeworkList.filter((homework) => {
    const matchesClass = selectedClass === "all" || homework.classes.includes(selectedClass);
    const matchesSearch =
      homework.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      homework.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const uniqueClasses = Array.from(new Set(homeworkList.flatMap((h) => h.classes)));

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Homework</h1>
          <p className="text-sm text-gray-500">Create and manage homework assignments</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Create Homework</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditing ? "Edit Homework" : "Create New Homework"}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter homework title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Enter homework description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson</label>
                <select
                  value={formData.lessonId}
                  onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select lesson</option>
                  {/* Add lesson options */}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Classes *</label>
              <div className="flex flex-wrap gap-2">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => toggleClassSelection(cls.id)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.selectedClasses.includes(cls.id)
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
              <div className="flex gap-2 mb-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-sm">Upload File</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    multiple
                  />
                </label>
                <button
                  type="button"
                  onClick={addVideoLink}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
                >
                  <Video className="w-4 h-4" />
                  <span className="text-sm">Add Video Link</span>
                </button>
              </div>

              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {attachment.type === "pdf" && <FileText className="w-4 h-4 text-red-500" />}
                        {attachment.type === "image" && <Image className="w-4 h-4 text-blue-500" />}
                        {attachment.type === "video" && <Video className="w-4 h-4 text-purple-500" />}
                        <span className="text-sm text-gray-700">{attachment.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : isEditing ? "Update Homework" : "Create Homework"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search homework..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

      {/* Homework List */}
      <div className="space-y-4">
        {filteredHomework.map((homework) => (
          <div
            key={homework.id}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{homework.title}</h3>
                  {isOverdue(homework.dueDate) && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Overdue</span>
                  )}
                  {isDueSoon(homework.dueDate) && !isOverdue(homework.dueDate) && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">Due Soon</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{homework.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(homework.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{homework.lessonName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Classes: {homework.classes.join(", ")}</span>
                  </div>
                </div>

                {homework.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {homework.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
                      >
                        {attachment.type === "pdf" && <FileText className="w-3 h-3" />}
                        {attachment.type === "image" && <Image className="w-3 h-3" />}
                        {attachment.type === "video" && <Video className="w-3 h-3" />}
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => duplicateHomework(homework)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(homework)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(homework.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredHomework.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No homework found</p>
            <button
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create your first homework
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
