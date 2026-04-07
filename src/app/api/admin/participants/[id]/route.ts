import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const participant = await prisma.participant.findUnique({
    where: { id },
  });

  if (!participant) {
    return NextResponse.json(
      { error: "Participant not found" },
      { status: 404 }
    );
  }

  // Cascade delete will remove all responses too
  await prisma.participant.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
