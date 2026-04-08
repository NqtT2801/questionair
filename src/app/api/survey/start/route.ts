import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Group, QuestionDef } from "@/lib/types";

export async function POST() {
  const group: Group = Math.random() < 0.5 ? "TREATMENT" : "CONTROL";

  const participant = await prisma.participant.create({
    data: { group },
  });

  // Phase 1: group-specific questions
  const phase1 = await prisma.question.findMany({
    where: { phase: 1, group },
    orderBy: { sortOrder: "asc" },
  });

  // Phase 2: shared questions (including trapped)
  const phase2 = await prisma.question.findMany({
    where: { phase: 2 },
    orderBy: { sortOrder: "asc" },
  });

  // Phase 3: bet question
  const phase3 = await prisma.question.findMany({
    where: { phase: 3 },
    orderBy: { sortOrder: "asc" },
  });

  const allDbQuestions = [...phase1, ...phase2, ...phase3];

  const questions: QuestionDef[] = allDbQuestions.map((q) => ({
    key: q.key,
    phase: q.phase as 1 | 2 | 3,
    group: q.group as Group | "ALL",
    text: q.text,
    options: JSON.parse(q.options),
    correctOptionIndex: q.correctOptionIndex,
    reason: q.reason,
    isTrapped: q.isTrapped,
    isBet: q.isBet,
  }));

  return NextResponse.json({
    participantId: participant.id,
    group: participant.group,
    questions,
  });
}
