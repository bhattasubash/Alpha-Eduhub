import { redirect } from "next/navigation";
import { Receipt, Search, Filter, Download, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  let session;
  try {
    session = await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  const invoices = await prisma.subscriptionInvoice.findMany({
    include: {
      subscription: {
        include: {
          school: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            Billing & Invoices
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage platform subscription invoices</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4 text-white/70" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No Invoices Found</h3>
            <p className="text-white/40 text-sm">There are no subscription invoices generated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Invoice</th>
                  <th className="px-6 py-4 font-medium">School</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Due Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                          <Receipt className="w-5 h-5 text-white/50" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white/90">{inv.invoiceNumber}</p>
                          <p className="text-xs text-white/40 mt-0.5">{new Date(inv.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white/80">{inv.subscription?.school?.name || "Unknown School"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">
                        {inv.currency} {Number(inv.amount).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {inv.status === "PAID" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" /> PENDING
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white/60">
                        {new Date(inv.dueDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors" title="View Details">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
