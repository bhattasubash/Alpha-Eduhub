export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}