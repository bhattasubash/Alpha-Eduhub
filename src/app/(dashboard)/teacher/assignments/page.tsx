"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  FileText,
  Save,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Modal from "@/components/teacher/Modal";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";

type Assignment = {
  id: number;
  title: string;
  description: string | null;
  lessonId: number | null;
  lessonName: string;
  className: string;
  subjectName: string;
  startDate: string;
  dueDate: string;
  maxMarks: number;
  instructions: string | null;
  status: string;
  submissionsCount: number;
  resultsCount: number;
};

export default function AssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lessonName: "",
    lessonId: "",
    startDate: "",
    dueDate: "",
    maxMarks: "100",
    instructions: "",
  });

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments, searchQuery, selectedClass, selectedSubject, selectedStatus]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/teacher/assignments");
      if (!response.ok) throw new Error("Failed to fetch assignments");
      const data = await response.json();
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assignments");
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...assignments];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(query) ||
          assignment.className.toLowerCase().includes(query) ||
          assignment.subjectName.toLowerCase().includes(query)
      );
    }

    // Class filter
    if (selectedClass !== "all") {
      filtered = filtered.filter((assignment) => assignment.className === selectedClass);
    }

    // Subject filter
    if (selectedSubject !== "all") {
      filtered = filtered.filter((assignment) => assignment.subjectName === selectedSubject);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((assignment) => assignment.status === selectedStatus);
    }

    setFilteredAssignments(filtered);
    setCurrentPage(1);
  };

  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);

  // Get unique values for filters
  const classes = Array.from(new Set(assignments.map((a) => a.className))).sort();
  const subjects = Array.from(new Set(assignments.map((a) => a.subjectName))).sort();

  // Pagination
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create assignment");
      }

      toast.success("Assignment created successfully");
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        description: "",
        lessonName: "",
        lessonId: "",
        startDate: "",
        dueDate: "",
        maxMarks: "100",
        instructions: "",
      });
      fetchAssignments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create assignment");
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const response = await fetch(`/api/teacher/assignments/${assignmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete assignment");

      toast.success("Assignment deleted successfully");
      setOpenDropdown(null);
      fetchAssignments();
    } catch (err) {
      toast.error("Failed to delete assignment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "PUBLISHED":
        return "bg-blue-100 text-blue-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isAssignmentEditable = (assignment: Assignment) => {
    return assignment.status === "DRAFT" || assignment.status === "PUBLISHED";
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAssignments} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Create and manage assignments for your classes</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter((a) => a.status === "ACTIVE").length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.reduce((acc, a) => acc + (a.submissionsCount - a.resultsCount), 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter((a) => isOverdue(a.dueDate) && a.status === "ACTIVE").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
              </select>
              {(selectedClass !== "all" || selectedSubject !== "all" || selectedStatus !== "all" || searchQuery) && (
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchQuery("");
                  setSelectedClass("all");
                  setSelectedSubject("all");
                  setSelectedStatus("all");
                }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No assignments found"
          description={
            searchQuery || selectedClass !== "all" || selectedSubject !== "all"
              ? "Try adjusting your search or filters"
              : "No assignments created yet. Create your first assignment!"
          }
        />
      ) : (
        <>
          <div className="hidden lg:block">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class & Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submissions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                          <div className="text-sm text-gray-500">{assignment.lessonName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{assignment.className}</div>
                          <div className="text-sm text-gray-500">{assignment.subjectName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(assignment.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {assignment.submissionsCount} / ~30
                          </div>
                          <div className="text-sm text-gray-500">
                            {assignment.resultsCount} graded
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                          {isOverdue(assignment.dueDate) && assignment.status === "ACTIVE" && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Overdue
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setOpenDropdown(openDropdown === assignment.id ? null : assignment.id)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </button>
                            {openDropdown === assignment.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                  onClick={() => {
                                    setSelectedAssignment(assignment);
                                    setIsViewModalOpen(true);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => {
                                    toast.info("Submissions feature coming soon");
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Users className="h-4 w-4" />
                                  View Submissions
                                </button>
                                {isAssignmentEditable(assignment) && (
                                  <>
                                    <button
                                      onClick={() => {
                                        toast.info("Edit feature coming soon");
                                        setOpenDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAssignment(assignment.id)}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {paginatedAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-500">{assignment.lessonName}</p>
                    </div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === assignment.id ? null : assignment.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="text-sm font-medium text-gray-900">{assignment.className}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Subject</p>
                      <p className="text-sm font-medium text-gray-900">{assignment.subjectName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Submissions</p>
                      <p className="text-sm font-medium text-gray-900">
                        {assignment.submissionsCount} / ~30
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                    {isOverdue(assignment.dueDate) && assignment.status === "ACTIVE" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                  </div>

                  {openDropdown === assignment.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setIsViewModalOpen(true);
                          setOpenDropdown(null);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          toast.info("Submissions feature coming soon");
                          setOpenDropdown(null);
                        }}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Submissions
                      </Button>
                      {isAssignmentEditable(assignment) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              toast.info("Edit feature coming soon");
                              setOpenDropdown(null);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredAssignments.length)} of{" "}
                {filteredAssignments.length} assignments
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Assignment"
        size="lg"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Chapter 5 Problems"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Brief description of the assignment..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Name</label>
            <input
              type="text"
              required
              value={formData.lessonName}
              onChange={(e) => setFormData({ ...formData, lessonName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Chapter 3: Linear Equations"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Marks</label>
            <input
              type="number"
              required
              min="1"
              value={formData.maxMarks}
              onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add submission guidelines, formatting requirements, etc..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Assignment Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Assignment Details"
        size="lg"
      >
        {selectedAssignment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium text-gray-900">{selectedAssignment.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAssignment.status)}`}>
                  {selectedAssignment.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium text-gray-900">{selectedAssignment.className}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium text-gray-900">{selectedAssignment.subjectName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(selectedAssignment.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Maximum Marks</p>
                <p className="font-medium text-gray-900">{selectedAssignment.maxMarks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submissions</p>
                <p className="font-medium text-gray-900">
                  {selectedAssignment.submissionsCount} submitted ({selectedAssignment.resultsCount} graded)
                </p>
              </div>
            </div>

            {selectedAssignment.description && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedAssignment.description}</p>
              </div>
            )}

            {selectedAssignment.instructions && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Instructions</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedAssignment.instructions}</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
