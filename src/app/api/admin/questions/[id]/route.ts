import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PUT update a question
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const question = await prisma.question.findUnique({
    where: { id: parseInt(id) },
  });

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const updated = await prisma.question.update({
    where: { id: parseInt(id) },
    data: {
      ...(body.key !== undefined && { key: body.key }),
      ...(body.phase !== undefined && { phase: body.phase }),
      ...(body.group !== undefined && { group: body.group }),
      ...(body.text !== undefined && { text: body.text }),
      ...(body.options !== undefined && { options: JSON.stringify(body.options) }),
      ...(body.correctOptionIndex !== undefined && { correctOptionIndex: body.correctOptionIndex }),
      ...(body.reason !== undefined && { reason: body.reason }),
      ...(body.isTrapped !== undefined && { isTrapped: body.isTrapped }),
      ...(body.isBet !== undefined && { isBet: body.isBet }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    },
  });

  return NextResponse.json({ ...updated, options: JSON.parse(updated.options) });
}

// DELETE a question
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id: parseInt(id) },
  });

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  await prisma.question.delete({ where: { id: parseInt(id) } });

  return NextResponse.json({ success: true });
}
