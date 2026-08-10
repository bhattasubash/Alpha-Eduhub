import { MessageSquare, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

interface RecentMessagesProps {
  messages: Message[];
}

export default function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <Card className="h-full animate-fade-in hover-lift">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Messages</CardTitle>
          <Button variant="ghost" size="sm" className="text-indigo-600">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No new messages</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover-lift cursor-pointer animate-slide-up",
                  message.unread
                    ? "bg-indigo-50/50 border-indigo-100 hover-glow"
                    : "border-gray-100 hover:bg-gray-50"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Avatar className="h-10 w-10 flex-shrink-0 transition-transform duration-200 hover:scale-110">
                  {message.avatar ? (
                    <div className="relative h-full w-full">
                      <img
                        src={message.avatar}
                        alt={message.sender}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {message.sender.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {message.sender}
                    </h4>
                    {message.unread && (
                      <span className="h-2 w-2 bg-indigo-600 rounded-full flex-shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {message.subject}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {message.preview}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {message.time}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}