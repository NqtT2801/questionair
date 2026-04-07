import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ResponseData } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { participantId, responses } = body as {
    participantId: string;
    responses: ResponseData[];
  };

  if (!participantId || !responses || !Array.isArray(responses)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
  });

  if (!participant) {
    return NextResponse.json(
      { error: "Participant not found" },
      { status: 404 }
    );
  }

  await prisma.response.createMany({
    data: responses.map((r) => ({
      participantId,
      questionKey: r.questionKey,
      phase: r.phase,
      selectedOption: r.selectedOption,
      isSuggestedAnswer: r.isSuggestedAnswer,
      openedReason: r.openedReason,
      timeToAnswerSeconds: r.timeToAnswerSeconds,
      isTrapped: r.isTrapped,
    })),
  });

  return NextResponse.json({ success: true });
}
