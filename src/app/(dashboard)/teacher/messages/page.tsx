"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  Plus,
  MoreVertical,
  User,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  Calendar,
  TrendingUp,
  ClipboardCheck,
  Video,
  Phone,
  Trash2,
  Reply,
  Forward,
  BookOpen,
} from "lucide-react";

type Parent = {
  id: string;
  name: string;
  studentName: string;
  studentId: string;
  className: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
};

type Message = {
  id: number;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: "text" | "homework_reminder" | "attendance_alert" | "performance_alert" | "meeting_request";
  status: "sent" | "delivered" | "read";
  attachments?: {
    type: "image" | "document";
    url: string;
    name: string;
  }[];
};

type Conversation = {
  parent: Parent;
  messages: Message[];
};

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toParent = searchParams.get("to");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // States
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "homework" | "attendance" | "performance" | "meeting">("all");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedParents, setSelectedParents] = useState<string[]>([]);

  // Fetch data
  useEffect(() => {
    fetchConversations();
    if (toParent) {
      // Auto-select conversation with this parent
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/teacher/messages");
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        if (data.length > 0 && !selectedConversation) {
          setSelectedConversation(data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      toast.error("Failed to load conversations");
    }
  };

  const sendMessage = async (type: "text" | "homework_reminder" | "attendance_alert" | "performance_alert" | "meeting_request" = "text") => {
    if (!messageInput.trim() && type === "text") return;
    if (!selectedConversation && type === "text") return;

    setIsSending(true);
    try {
      const response = await fetch("/api/teacher/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentId: selectedConversation?.parent.id,
          content: messageInput,
          type,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        
        if (selectedConversation) {
          setSelectedConversation({
            ...selectedConversation,
            messages: [...selectedConversation.messages, newMessage],
          });
        }
        
        setMessageInput("");
        toast.success("Message sent");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const sendQuickMessage = async (type: "homework_reminder" | "attendance_alert" | "performance_alert" | "meeting_request") => {
    const templates = {
      homework_reminder: "Reminder: Your child has homework due tomorrow. Please ensure they complete it.",
      attendance_alert: "Attendance Alert: Your child was absent from class today. Please provide reason if applicable.",
      performance_alert: "Performance Update: Your child's recent performance shows improvement. Keep up the good work!",
      meeting_request: "I would like to schedule a meeting to discuss your child's progress. Please let me know your availability.",
    };

    setMessageInput(templates[type]);
  };

  const deleteMessage = async (messageId: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(`/api/teacher/messages/${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (selectedConversation) {
          setSelectedConversation({
            ...selectedConversation,
            messages: selectedConversation.messages.filter((m) => m.id !== messageId),
          });
        }
        toast.success("Message deleted");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.parent.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    
    const typeMapping: Record<string, string> = {
      "homework": "homework_reminder",
      "attendance": "attendance_alert", 
      "performance": "performance_alert",
      "meeting": "meeting_request"
    };
    
    const messageType = typeMapping[filterType] || filterType;
    const hasType = conv.messages.some((m) => m.type === messageType);
    return matchesSearch && hasType;
  });

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "homework_reminder": return <BookOpen className="w-4 h-4" />;
      case "attendance_alert": return <ClipboardCheck className="w-4 h-4" />;
      case "performance_alert": return <TrendingUp className="w-4 h-4" />;
      case "meeting_request": return <Calendar className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <Check className="w-4 h-4 text-gray-400" />;
      case "delivered": return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case "read": return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4">
      {/* Conversations List */}
      <div className="w-full md:w-1/3 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Messages</h2>
            <button
              onClick={() => setShowNewMessage(true)}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          {[
            { id: "all", label: "All" },
            { id: "homework", label: "Homework" },
            { id: "attendance", label: "Attendance" },
            { id: "performance", label: "Performance" },
            { id: "meeting", label: "Meetings" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id as any)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                filterType === filter.id
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.parent.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                selectedConversation?.parent.id === conv.parent.id ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800 truncate">{conv.parent.name}</p>
                    {conv.parent.unreadCount && conv.parent.unreadCount > 0 && (
                      <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                        {conv.parent.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{conv.parent.studentName} • {conv.parent.className}</p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conv.parent.lastMessage || "No messages yet"}
                  </p>
                  {conv.parent.lastMessageTime && (
                    <p className="text-xs text-gray-400 mt-1">{conv.parent.lastMessageTime}</p>
                  )}
                </div>
              </div>
            </button>
          ))}

          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedConversation.parent.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.parent.studentName} • {selectedConversation.parent.className}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => {
                const isOwn = message.senderId === "teacher"; // Would check actual teacher ID
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl p-3 ${
                        isOwn
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {getMessageIcon(message.type)}
                        <span className="text-xs opacity-75">
                          {message.type.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isOwn && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => sendQuickMessage("homework_reminder")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 whitespace-nowrap"
                >
                  <BookOpen className="w-3 h-3" />
                  Homework Reminder
                </button>
                <button
                  onClick={() => sendQuickMessage("attendance_alert")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 whitespace-nowrap"
                >
                  <ClipboardCheck className="w-3 h-3" />
                  Attendance Alert
                </button>
                <button
                  onClick={() => sendQuickMessage("performance_alert")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 whitespace-nowrap"
                >
                  <TrendingUp className="w-3 h-3" />
                  Performance
                </button>
                <button
                  onClick={() => sendQuickMessage("meeting_request")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100 whitespace-nowrap"
                >
                  <Calendar className="w-3 h-3" />
                  Meeting Request
                </button>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isSending || !messageInput.trim()}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
