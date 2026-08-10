import Link from "next/link";

export default function LeavePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/teacher/leave/my-leave"
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">My Leave</h2>
          <p className="text-sm text-gray-500">Apply for and manage your own leave requests</p>
        </Link>
        
        <Link
          href="/teacher/leave/student-leave"
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Student Leave Requests</h2>
          <p className="text-sm text-gray-500">Approve or reject student leave requests from your classes</p>
        </Link>
      </div>
    </div>
  );
}
