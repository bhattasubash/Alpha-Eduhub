import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { getValidRecipients, canSendMessage } from "@/lib/messaging";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession();
    const userId = session.userId;
    const userRole = session.role;
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get("recipientId");

    if (recipientId) {
      // Get conversation with specific recipient
      const messages = await prisma.message.findMany({
        where: {
          schoolId,
          OR: [
            { senderId: userId, receiverId: recipientId },
            { senderId: recipientId, receiverId: userId },
          ],
        },
        orderBy: { createdAt: "asc" },
      });

      // Mark received messages as read
      await prisma.message.updateMany({
        where: {
          receiverId: userId,
          senderId: recipientId,
          schoolId,
          status: "SENT",
        },
        data: {
          status: "READ",
          readAt: new Date(),
        },
      });

      return NextResponse.json(messages);
    } else {
      // Get all conversations (grouped by recipient)
      const sentMessages = await prisma.message.findMany({
        where: {
          senderId: userId,
          schoolId,
        },
        orderBy: { createdAt: "desc" },
      });

      const receivedMessages = await prisma.message.findMany({
        where: {
          receiverId: userId,
          schoolId,
        },
        orderBy: { createdAt: "desc" },
      });

      // Group messages by conversation partner
      const conversations = new Map<string, any>();

      for (const msg of sentMessages) {
        const partnerId = msg.receiverId;
        if (!conversations.has(partnerId)) {
          conversations.set(partnerId, {
            partnerId,
            lastMessage: msg,
            unreadCount: 0,
          });
        }
      }

      for (const msg of receivedMessages) {
        const partnerId = msg.senderId;
        const unreadCount = msg.status === "SENT" ? 1 : 0;
        
        if (conversations.has(partnerId)) {
          const conv = conversations.get(partnerId);
          if (new Date(msg.createdAt) > new Date(conv.lastMessage.createdAt)) {
            conv.lastMessage = msg;
          }
          conv.unreadCount += unreadCount;
        } else {
          conversations.set(partnerId, {
            partnerId,
            lastMessage: msg,
            unreadCount: unreadCount,
          });
        }
      }

      // Get valid recipients to add metadata
      const validRecipients = await getValidRecipients(userId, userRole, schoolId);
      const recipientMap = new Map(validRecipients.map((r) => [r.id, r]));

      const conversationsWithMeta = Array.from(conversations.values()).map((conv) => {
        const recipient = recipientMap.get(conv.partnerId);
        return {
          ...conv,
          recipientName: recipient?.name || "Unknown",
          recipientRole: recipient?.role || "UNKNOWN",
          relatedInfo: recipient?.relatedInfo,
        };
      });

      // Sort by last message time
      conversationsWithMeta.sort((a, b) => 
        new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      );

      return NextResponse.json(conversationsWithMeta);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const userId = session.userId;
    const userRole = session.role;
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { receiverId, content, type = "TEXT", relatedToId, relatedToType } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate permission to send message
    const canSend = await canSendMessage(userId, receiverId, userRole, schoolId);
    if (!canSend) {
      return NextResponse.json(
        { error: "You are not authorized to message this user" },
        { status: 403 }
      );
    }

    // Determine receiver role
    const receiverRole = await determineReceiverRole(receiverId, schoolId);

    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        content,
        type,
        senderType: userRole as UserRole,
        receiverType: receiverRole as UserRole,
        relatedToId,
        relatedToType,
        schoolId,
      },
    });

    // Create notification for receiver
    const { createNotification } = await import("@/lib/messaging");
    await createNotification({
      userId: receiverId,
      userType: receiverRole,
      type: "NEW_MESSAGE",
      title: "New Message",
      message: content.substring(0, 100),
      data: { messageId: message.id },
      actionUrl: "/messages",
      schoolId,
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

async function determineReceiverRole(userId: string, schoolId: string): Promise<string> {
  // Check if teacher
  const teacher = await prisma.teacher.findUnique({
    where: { id: userId },
  });
  if (teacher) return "TEACHER";

  // Check if student
  const student = await prisma.student.findUnique({
    where: { id: userId },
  });
  if (student) return "STUDENT";

  // Check if parent
  const parent = await prisma.parent.findUnique({
    where: { id: userId },
  });
  if (parent) return "PARENT";

  // Check if admin
  const admin = await prisma.admin.findUnique({
    where: { id: userId },
  });
  if (admin) return "ADMIN";

  return "UNKNOWN";
}
