"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, DollarSign, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface FeeData {
  summary: {
    totalAmount: number;
    totalPaid: number;
    totalPending: number;
    feeCount: number;
  };
  fees: any[];
  paymentHistory: any[];
  upcomingInvoices: any[];
}

export default function FeesPage({
  params,
}: {
  params: { studentId: string };
}) {
  const [data, setData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.studentId]);

  const fetchFeeData = async () => {
    try {
      const response = await fetch(`/api/parent/children/${params.studentId}/fees`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    } catch (err) {
      console.error("Error fetching fee data:", err);
    } finally {
      setLoading(false);
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
          Failed to load fee data
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
        <h1 className="text-2xl font-bold text-gray-900">Fee Information</h1>
        <p className="text-gray-600">View fee details and payment history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total Amount</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">${data.summary.totalAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">{data.summary.feeCount} fee structures</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Amount Paid</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">${data.summary.totalPaid.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">Paid amount</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">Pending Amount</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">${data.summary.totalPending.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">Due amount</p>
        </div>
      </div>

      {/* Upcoming Invoices */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Invoices</h2>
        {data.upcomingInvoices.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No upcoming invoices</p>
        ) : (
          <div className="space-y-3">
            {data.upcomingInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {invoice.studentFee?.feeStructure?.name || "Fee Payment"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${Number(invoice.amount).toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-amber-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      Pending
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
        {data.paymentHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No payment history available</p>
        ) : (
          <div className="space-y-3">
            {data.paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {payment.paymentMethod}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Paid: {new Date(payment.paidAt).toLocaleDateString()}
                    </p>
                    {payment.notes && (
                      <p className="text-sm text-gray-500 mt-1">{payment.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${Number(payment.amount).toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                      <CheckCircle className="w-4 h-4" />
                      Paid
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
