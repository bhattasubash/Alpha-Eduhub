import { FileText, Download, Eye, Calendar, HardDrive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  document: {
    id: string;
    name: string;
    type: string;
    uploadedDate: string;
    size: string;
    url?: string;
  };
  canUpload?: boolean;
}

export default function DocumentCard({ document, canUpload = false }: DocumentCardProps) {
  const getIconForType = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("pdf")) return "📄";
    if (typeLower.includes("image") || typeLower.includes("jpg") || typeLower.includes("png")) return "🖼️";
    if (typeLower.includes("doc")) return "📝";
    if (typeLower.includes("xls") || typeLower.includes("sheet")) return "📊";
    return "📁";
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="text-2xl">{getIconForType(document.type)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-slate-50 text-sm mb-1 truncate">
              {document.name}
            </h4>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500 mb-3">
              <span className="capitalize">{document.type}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                <span>{document.size}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(document.uploadedDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {document.url && (
                <>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs h-8">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs h-8">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </>
              )}
              {canUpload && (
                <Button variant="ghost" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-400">
                  Upload New
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
