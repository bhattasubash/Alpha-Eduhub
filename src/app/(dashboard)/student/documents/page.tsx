import prisma from "@/lib/prisma";
import { getCurrentUserId, getSession } from "@/lib/getRole";
import { checkStudentAccess } from "@/lib/studentAccess";
import ProfileNavigation from "@/components/student/ProfileNavigation";
import DocumentCard from "@/components/student/DocumentCard";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

const DocumentsPage = async () => {
  const currentUserId = (await getCurrentUserId()) ?? "unknown";
  const session = await getSession();

  // Check access control - documents are sensitive (commented out for development)
  // const access = await checkStudentAccess(currentUserId);
  // if (!access.hasAccess || !access.canViewDocuments) {
  //   redirect("/unauthorized");
  // }

  const canUpload = session?.role === "ADMIN" || session?.role === "TEACHER";

  // Mock document data since there's no document model in the schema
  const documents = [
    {
      id: "1",
      name: "Student ID Card",
      type: "image",
      uploadedDate: new Date().toISOString(),
      size: "245 KB",
      url: "#",
    },
    {
      id: "2",
      name: "Academic Transcript 2024",
      type: "pdf",
      uploadedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      size: "1.2 MB",
      url: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Documents</h1>
          <p className="text-slate-600 dark:text-slate-400">Access your official documents and certificates</p>
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} canUpload={canUpload} />
            ))}
          </div>
        ) : (
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-12 text-center">
              <FolderOpen className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">No documents available</h3>
              <p className="text-slate-600 dark:text-slate-400">Documents will appear here once uploaded by the school.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
