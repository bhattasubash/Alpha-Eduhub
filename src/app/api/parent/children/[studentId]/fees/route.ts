export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await requireSession(["PARENT"]);
    const parentId = session.userId;
    const schoolId = session.schoolId;
    const { studentId } = params;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    // Verify parent-child relationship
    const parentRelation = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
    });

    if (!parentRelation) {
      return NextResponse.json(
        { error: "Unauthorized: Child not linked to this parent" },
        { status: 403 }
      );
    }

    // Get student fees
    const studentFees = await prisma.studentFee.findMany({
      where: {
        studentId,
        schoolId,
      },
      include: {
        feeStructure: true,
        invoices: {
          include: {
            payments: true,
          },
          orderBy: {
            dueDate: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate totals
    const totalAmount = studentFees.reduce((sum, fee) => sum + Number(fee.totalAmount), 0);
    const totalPaid = studentFees.reduce((sum, fee) => sum + Number(fee.amountPaid), 0);
    const totalPending = totalAmount - totalPaid;

    // Get payment history
    const paymentHistory = await prisma.payment.findMany({
      where: {
        studentFee: {
          studentId,
        },
        schoolId,
      },
      include: {
        invoice: true,
      },
      orderBy: {
        paidAt: "desc",
      },
    });

    // Get upcoming due invoices
    const upcomingInvoices = await prisma.invoice.findMany({
      where: {
        studentFee: {
          studentId,
        },
        schoolId,
        status: "PENDING",
        dueDate: {
          gte: new Date(),
        },
      },
      include: {
        studentFee: {
          include: {
            feeStructure: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    return NextResponse.json({
      summary: {
        totalAmount,
        totalPaid,
        totalPending,
        feeCount: studentFees.length,
      },
      fees: studentFees,
      paymentHistory,
      upcomingInvoices,
    });
  } catch (error) {
    console.error("Error fetching fees:", error);
    return NextResponse.json(
      { error: "Failed to fetch fees" },
      { status: 500 }
    );
  }
}
