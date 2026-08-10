import Image from "next/image";
import { Mail, Phone, MessageSquare, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ParentCardProps {
  parent: {
    name: string;
    surname: string;
    relationship: string;
    email?: string | null;
    phone?: string | null;
    img?: string | null;
    accountStatus?: "active" | "inactive";
  };
}

export default function ParentCard({ parent }: ParentCardProps) {
  const displayName = `${parent.name} ${parent.surname}`;
  const initials = `${parent.name[0]}${parent.surname[0]}`.toUpperCase();
  const isActive = parent.accountStatus !== "inactive";

  return (
    <Card className="border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={parent.img || undefined} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                  {displayName}
                </h4>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <User className="h-3.5 w-3.5" />
                  <span>{parent.relationship}</span>
                  {isActive && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Active</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5 mb-4">
              {parent.email && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{parent.email}</span>
                </div>
              )}
              {parent.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{parent.phone}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                <MessageSquare className="h-3.5 w-3.5" />
                Message
              </Button>
              {parent.phone && (
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                  <Phone className="h-3.5 w-3.5" />
                  Call
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
