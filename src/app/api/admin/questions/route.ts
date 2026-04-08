import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all questions
export async function GET() {
  const questions = await prisma.question.findMany({
    orderBy: [{ phase: "asc" }, { group: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json(
    questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
    }))
  );
}

// POST create a new question
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { key, phase, group, text, options, correctOptionIndex, reason, isTrapped, isBet, sortOrder } = body;

  if (!key || !text || !options || !Array.isArray(options)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: {
      key,
      phase: phase ?? 1,
      group: group ?? "ALL",
      text,
      options: JSON.stringify(options),
      correctOptionIndex: correctOptionIndex ?? 0,
      reason: reason ?? "",
      isTrapped: isTrapped ?? false,
      isBet: isBet ?? false,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json({ ...question, options: JSON.parse(question.options) }, { status: 201 });
}
