import { prisma } from "@/lib/db";
import { ParticipantStats } from "@/lib/types";
import StatisticsTable from "@/components/admin/StatisticsTable";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStatistics(): Promise<ParticipantStats[]> {
  const participants = await prisma.participant.findMany({
    include: { responses: true },
    orderBy: { createdAt: "desc" },
  });

  return participants.map((p) => {
    const phase1 = p.responses.filter((r) => r.phase === 1);
    const phase2Normal = p.responses.filter(
      (r) => r.phase === 2 && !r.isTrapped
    );
    const trapped = p.responses.find((r) => r.isTrapped);
    const bet = p.responses.find((r) => r.phase === 3);

    const p1Count = phase1.length || 1;
    const p2Count = phase2Normal.length || 1;

    return {
      participantId: p.id,
      group: p.group,
      phase1SuggestedRate:
        phase1.filter((r) => r.isSuggestedAnswer).length / p1Count,
      phase1AvgTime:
        phase1.reduce((sum, r) => sum + r.timeToAnswerSeconds, 0) / p1Count,
      phase2SuggestedRate:
        phase2Normal.filter((r) => r.isSuggestedAnswer).length / p2Count,
      phase2OpenedReasonRate:
        phase2Normal.filter((r) => r.openedReason).length / p2Count,
      phase2OpenedAndSuggested:
        phase2Normal.filter((r) => r.openedReason && r.isSuggestedAnswer)
          .length / p2Count,
      phase2OpenedAndNotSuggested:
        phase2Normal.filter((r) => r.openedReason && !r.isSuggestedAnswer)
          .length / p2Count,
      phase2NotOpenedAndSuggested:
        phase2Normal.filter((r) => !r.openedReason && r.isSuggestedAnswer)
          .length / p2Count,
      phase2NotOpenedAndNotSuggested:
        phase2Normal.filter((r) => !r.openedReason && !r.isSuggestedAnswer)
          .length / p2Count,
      trappedWrong: trapped ? !trapped.isSuggestedAnswer : null,
      bet: bet ? bet.selectedOption === 0 : null,
    };
  });
}

export default async function AdminPage() {
  const stats = await getStatistics();

  const treatmentCount = stats.filter((s) => s.group === "TREATMENT").length;
  const controlCount = stats.filter((s) => s.group === "CONTROL").length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.length} participants — {treatmentCount} Treatment, {controlCount} Control
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Back to Survey
        </Link>
      </div>

      <StatisticsTable stats={stats} />
    </div>
  );
}
