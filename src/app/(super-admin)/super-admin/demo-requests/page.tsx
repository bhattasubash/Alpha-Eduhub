import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/getRole";
import { GraduationCap, Mail, Phone, Building2, User, Users, Calendar, Clock } from "lucide-react";

export default async function DemoRequestsPage() {
  try {
    await requireSession(["SUPER_ADMIN"]);
  } catch {
    redirect("/sign-in");
  }

  // TODO: Uncomment after running `npx prisma generate`
  // const demoRequests = await (prisma as any).demoRequest.findMany({
  //   orderBy: { createdAt: "desc" },
  // });
  const demoRequests: any[] = [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Demo Requests</h1>
        <p className="text-white/40 text-sm mt-0.5">
          Manage and follow up on demo booking requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-purple-500/10 border border-purple-500/20 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">{demoRequests.length}</p>
            <p className="text-white/70 text-sm font-medium">Total Requests</p>
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">{demoRequests.length}</p>
            <p className="text-white/70 text-sm font-medium">Pending Follow-up</p>
          </div>
        </div>
        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">24h</p>
            <p className="text-white/70 text-sm font-medium">Response SLA</p>
          </div>
        </div>
      </div>

      {/* Demo requests table */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white font-semibold">All Demo Requests</h2>
        </div>

        {demoRequests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-white/30 text-sm">No demo requests yet</p>
            <p className="text-white/20 text-xs mt-1">Demo requests will appear here when users submit the form</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-white/60 text-xs font-medium uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-white/60 text-xs font-medium uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-4 text-white/60 text-xs font-medium uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-white/60 text-xs font-medium uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-4 text-white/60 text-xs font-medium uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-4 text-white/60 text-xs font-medium uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoRequests.map((request: any) => (
                  <tr key={request.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-white/40" />
                          <p className="text-white text-sm font-medium">{request.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-white/40" />
                          <p className="text-white/60 text-xs">{request.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-white/40" />
                          <p className="text-white/60 text-xs">{request.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-white/40" />
                        <p className="text-white text-sm">{request.schoolName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                        {request.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-white/40" />
                        <p className="text-white text-sm">{request.students}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white/60 text-sm max-w-xs truncate">
                        {request.message || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <p className="text-white/60 text-xs">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-white/40" />
                        <p className="text-white/40 text-xs">
                          {new Date(request.createdAt).toLocaleTimeString()}
                        </p>
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
