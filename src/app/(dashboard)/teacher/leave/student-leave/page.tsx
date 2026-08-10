import StudentLeaveApproval from "@/components/teacher/StudentLeaveApproval";

export default function StudentLeavePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Leave Requests</h1>
        <p className="text-sm text-gray-500">Approve or reject leave requests from students in your assigned classes</p>
      </div>
      <StudentLeaveApproval />
    </div>
  );
}
