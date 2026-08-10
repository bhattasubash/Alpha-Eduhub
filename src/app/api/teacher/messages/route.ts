import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { getValidRecipients } from "@/lib/messaging";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
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
            { senderId: teacherId, receiverId: recipientId },
            { senderId: recipientId, receiverId: teacherId },
          ],
        },
        orderBy: { createdAt: "asc" },
      });

      // Mark received messages as read
      await prisma.message.updateMany({
        where: {
          receiverId: teacherId,
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
          senderId: teacherId,
          schoolId,
        },
        orderBy: { createdAt: "desc" },
      });

      const receivedMessages = await prisma.message.findMany({
        where: {
          receiverId: teacherId,
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
      const validRecipients = await getValidRecipients(teacherId, session.role, schoolId);
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
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { parentId, content, type = "TEXT" } = body;

    if (!parentId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine receiver role
    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent not found" },
        { status: 404 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: teacherId,
        receiverId: parentId,
        content,
        type,
        senderType: session.role as UserRole,
        receiverType: "PARENT" as UserRole,
        relatedToId: parentId,
        relatedToType: "parent",
        schoolId,
      },
    });

    // Create notification for parent
    const { createNotification } = await import("@/lib/messaging");
    await createNotification({
      userId: parentId,
      userType: "PARENT",
      type: "NEW_MESSAGE",
      title: "New Message from Teacher",
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
