"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  maxMarks: number;
  lesson: {
    subject: {
      name: string;
    };
  };
  submissions: any[];
}

interface AssignmentsData {
  all: Assignment[];
  pending: Assignment[];
  submitted: Assignment[];
  overdue: Assignment[];
  counts: {
    total: number;
    pending: number;
    submitted: number;
    overdue: number;
  };
}

export default function AssignmentsPage({
  params,
}: {
  params: { studentId: string };
}) {
  const [data, setData] = useState<AssignmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchAssignments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.studentId, filter]);

  const fetchAssignments = async () => {
    try {
      const url = filter === "all"
        ? `/api/parent/children/${params.studentId}/assignments`
        : `/api/parent/children/${params.studentId}/assignments?status=${filter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAssignments = () => {
    if (!data) return [];
    switch (filter) {
      case "pending":
        return data.pending;
      case "submitted":
        return data.submitted;
      case "overdue":
        return data.overdue;
      default:
        return data.all;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Failed to load assignments
        </div>
      </div>
    );
  }

  const filteredAssignments = getFilteredAssignments();

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/parent"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600">View assignments and submission status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.counts.total}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.counts.pending}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Submitted</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.counts.submitted}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-600">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.counts.overdue}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          {["all", "pending", "submitted", "overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {filter.charAt(0).toUpperCase() + filter.slice(1)} Assignments
        </h2>
        {filteredAssignments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No assignments found</p>
        ) : (
          <div className="space-y-3">
            {filteredAssignments.map((assignment) => {
              const isOverdue = new Date(assignment.dueDate) < new Date();
              const isSubmitted = assignment.submissions.length > 0;

              return (
                <div
                  key={assignment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {assignment.lesson?.subject?.name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <span>Max Marks: {assignment.maxMarks}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {isSubmitted ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Submitted
                        </div>
                      ) : isOverdue ? (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
                          <AlertCircle className="w-4 h-4" />
                          Overdue
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
                          <Clock className="w-4 h-4" />
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
