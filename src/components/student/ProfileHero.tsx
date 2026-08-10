import Image from "next/image";
import { Calendar, MoreVertical, User, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface ProfileHeroProps {
  student: {
    name: string;
    surname: string;
    username: string;
    img?: string | null;
    admissionNumber?: string | null;
    rollNumber?: string | null;
    class?: { name: string } | null;
    grade?: { level: number } | null;
    section?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string;
  };
  school?: {
    academicYear?: string | null;
  } | null;
}

export default function ProfileHero({ student, school }: ProfileHeroProps) {
  const displayName = `${student.name} ${student.surname}`;
  const initials = `${student.name[0]}${student.surname[0]}`.toUpperCase();
  const classInfo = student.class?.name || "Not Assigned";
  const gradeInfo = student.grade ? `Grade ${student.grade.level}` : "";
  const sectionInfo = student.section ? `• ${student.section}` : "";
  const rollInfo = student.rollNumber ? `• Roll: ${student.rollNumber}` : "";
  const academicYear = school?.academicYear || "2024-25";

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-200 to-pink-200 dark:from-amber-900 dark:to-pink-900 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white dark:border-slate-700 shadow-lg">
              <AvatarImage src={student.img || undefined} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-4 border-white dark:border-slate-800" />
          </div>

          {/* Student Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">
                {displayName}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                Active
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {student.admissionNumber || student.username}
              </span>
              <span>•</span>
              <span>{gradeInfo}</span>
              <span>•</span>
              <span>{classInfo}</span>
              {sectionInfo && <span>{sectionInfo}</span>}
              {rollInfo && <span>{rollInfo}</span>}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>Academic Year {academicYear}</span>
            </div>

            {/* Contact Information */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mt-2">
              {student.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{student.phone}</span>
                </div>
              )}
              {student.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{student.email}</span>
                </div>
              )}
              {student.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate max-w-xs">{student.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Link href="/student/profile">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">View Profile</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
