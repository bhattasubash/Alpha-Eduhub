"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Award } from "lucide-react";
import Link from "next/link";

interface SubjectPerformance {
  subject: string;
  average: number;
  highest: number;
  lowest: number;
  resultsCount: number;
  results: any[];
}

interface AcademicData {
  overall: {
    percentage: number;
    resultsCount: number;
    trend: string;
    personalBest: {
      percentage: number;
      title: string;
      date: string;
    } | null;
  };
  subjects: SubjectPerformance[];
  allResults: any[];
}

export default function AcademicsPage({
  params,
}: {
  params: { studentId: string };
}) {
  const [data, setData] = useState<AcademicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAcademicData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.studentId]);

  const fetchAcademicData = async () => {
    try {
      const response = await fetch(`/api/parent/children/${params.studentId}/academics`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        setError("Failed to load academic data");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "IMPROVING":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "DECLINING":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
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

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || "No academic data available"}
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Academic Performance</h1>
        <p className="text-gray-600">View detailed academic results and performance trends</p>
      </div>

      {/* Overall Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Overall Percentage</p>
            <p className="text-3xl font-bold text-gray-900">{data.overall.percentage}%</p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(data.overall.trend)}
              <span className="text-sm text-gray-600 capitalize">{data.overall.trend.toLowerCase()}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Results</p>
            <p className="text-3xl font-bold text-gray-900">{data.overall.resultsCount}</p>
            <p className="text-sm text-gray-600 mt-2">Assessments completed</p>
          </div>

          {data.overall.personalBest && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-gray-600">Personal Best</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {data.overall.personalBest.percentage}%
              </p>
              <p className="text-sm text-gray-600 mt-2 truncate">
                {data.overall.personalBest.title}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Performance</h2>
        {data.subjects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No subject data available</p>
        ) : (
          <div className="space-y-4">
            {data.subjects.map((subject) => (
              <div
                key={subject.subject}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{subject.subject}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      Average: <span className="font-semibold">{subject.average}%</span>
                    </span>
                    <span className="text-gray-600">
                      Highest: <span className="font-semibold text-green-600">{subject.highest}%</span>
                    </span>
                    <span className="text-gray-600">
                      Lowest: <span className="font-semibold text-red-600">{subject.lowest}%</span>
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${subject.average}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{subject.resultsCount} results</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h2>
        {data.allResults.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No results available</p>
        ) : (
          <div className="space-y-3">
            {data.allResults.slice(0, 10).map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {result.exam?.title || result.assignment?.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {result.exam?.lesson?.subject?.name || result.assignment?.lesson?.subject?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{result.percentage}%</p>
                  <p className="text-xs text-gray-500">
                    {result.submittedAt
                      ? new Date(result.submittedAt).toLocaleDateString()
                      : new Date(result.exam?.startTime || result.assignment?.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
