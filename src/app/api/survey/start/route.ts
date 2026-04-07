import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getQuestionsForParticipant } from "@/lib/questions";
import { Group } from "@/lib/types";

export async function POST() {
  const group: Group = Math.random() < 0.5 ? "TREATMENT" : "CONTROL";

  const participant = await prisma.participant.create({
    data: { group },
  });

  const questions = getQuestionsForParticipant(group);

  return NextResponse.json({
    participantId: participant.id,
    group: participant.group,
    questions,
  });
}
