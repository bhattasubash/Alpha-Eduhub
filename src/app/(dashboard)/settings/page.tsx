export const dynamic = 'force-dynamic';

const SettingsPage = () => {
  return (
    <div className="p-4 flex-1 flex flex-col gap-4">
      <div className="bg-white p-6 rounded-md shadow-sm">
        <h1 className="text-xl font-semibold mb-4">System Settings</h1>
        <div className="flex flex-col gap-4 max-w-lg">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <div>
              <p className="font-semibold text-sm">Role-Based Access Control</p>
              <p className="text-xs text-gray-500">
                JWT-based RBAC with roles: provider, admin, teacher, student.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <div>
              <p className="font-semibold text-sm">Multi-Tenant Isolation</p>
              <p className="text-xs text-gray-500">
                All data is scoped to the authenticated user&apos;s school.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
