import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/getRole";
import { checkStudentAccess } from "@/lib/studentAccess";
import ProfileNavigation from "@/components/student/ProfileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, CheckCircle2, Clock } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

const FeesPage = async () => {
  const currentUserId = (await getCurrentUserId()) ?? "unknown";

  // Check access control - fees are sensitive (commented out for development)
  // const access = await checkStudentAccess(currentUserId);
  // if (!access.hasAccess || !access.canViewFees) {
  //   redirect("/unauthorized");
  // }

  let studentFees: any[] = [];
  let payments: any[] = [];

  try {
    studentFees = await prisma.studentFee.findMany({
      where: { studentId: currentUserId },
      include: {
        feeStructure: true,
      },
    });

    payments = await prisma.payment.findMany({
      where: { studentFee: { studentId: currentUserId } },
      orderBy: {
        paidAt: 'desc',
      },
    });
  } catch (error) {
    console.error("Error fetching fee data:", error);
  }

  const totalFee = studentFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  const paidAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const pendingAmount = totalFee - paidAmount;
  const nextDueDate = studentFees
    .filter((fee) => fee.status !== "PAID")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]?.dueDate;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Fees</h1>
          <p className="text-slate-600 dark:text-slate-400">View your fee status and payment history</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Fee</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">${totalFee.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Paid</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">${paidAmount.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">${pendingAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Payment Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Payment Status</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {Math.round((paidAmount / totalFee) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
                  style={{ width: `${(paidAmount / totalFee) * 100}%` }}
                />
              </div>
              {nextDueDate && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <Calendar className="h-4 w-4" />
                  <span>Next due: {new Date(nextDueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        {payment.receiptNumber || `Payment #${payment.id}`}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 dark:text-slate-50">
                        ${payment.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">
                        {payment.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No payment history available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeesPage;
