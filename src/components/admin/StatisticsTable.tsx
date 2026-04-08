"use client";

import { ParticipantStats } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type StatisticsTableProps = {
  stats: ParticipantStats[];
};

export default function StatisticsTable({ stats }: StatisticsTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (participantId: string) => {
    if (!confirm("Delete this participant and all their responses?")) return;

    setDeleting(participantId);
    try {
      const res = await fetch(`/api/admin/participants/${participantId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeleting(null);
    }
  };

  const fmt = (n: number) => `${(n * 100).toFixed(1)}%`;
  const fmtTime = (n: number) => `${n.toFixed(1)}s`;

  const handleExport = () => {
    const headers = [
      "Participant ID",
      "Group",
      "P1 Suggested Rate",
      "P1 Avg Time (s)",
      "P2 Suggested Rate",
      "P2 Avg Time (s)",
      "P2 Open Reason Rate",
      "P2 Open+Suggested",
      "P2 Open+Not Suggested",
      "P2 No Open+Suggested",
      "P2 No Open+Not Suggested",
      "Trapped Wrong",
      "Bet",
    ];

    const escape = (v: string | number) => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const rows = stats.map((s) => [
      s.participantId,
      s.group,
      (s.phase1SuggestedRate * 100).toFixed(1) + "%",
      s.phase1AvgTime.toFixed(2),
      (s.phase2SuggestedRate * 100).toFixed(1) + "%",
      s.phase2AvgTime.toFixed(2),
      (s.phase2OpenedReasonRate * 100).toFixed(1) + "%",
      (s.phase2OpenedAndSuggested * 100).toFixed(1) + "%",
      (s.phase2OpenedAndNotSuggested * 100).toFixed(1) + "%",
      (s.phase2NotOpenedAndSuggested * 100).toFixed(1) + "%",
      (s.phase2NotOpenedAndNotSuggested * 100).toFixed(1) + "%",
      s.trappedWrong === null ? "" : s.trappedWrong ? "Yes" : "No",
      s.bet === null ? "" : s.bet ? "Bet" : "No Bet",
    ]);

    const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    // Prepend BOM so Excel detects UTF-8 correctly
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `survey-statistics-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (stats.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No survey submissions yet.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md
                     hover:bg-green-700 transition-colors"
        >
          Export to Excel
        </button>
      </div>
      <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">Participant ID</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Group</th>
            <th className="border border-gray-300 px-3 py-2 text-right">P1 Suggested Rate</th>
            <th className="border border-gray-300 px-3 py-2 text-right">P1 Avg Time</th>
            <th className="border border-gray-300 px-3 py-2 text-right">P2 Suggested Rate</th>
            <th className="border border-gray-300 px-3 py-2 text-right">P2 Avg Time</th>
            <th className="border border-gray-300 px-3 py-2 text-right">P2 Open Reason Rate</th>
            <th className="border border-gray-300 px-3 py-2 text-right">P2 Open+Suggested</th>
            <th className="border border-gray-300 px-3 py-2 text-right">P2 Open+Not Suggested</th>
            <th className="border border-gray-300 px-3 py-2 text-right">P2 No Open+Suggested</th>
            <th className="border border-gray-300 px-3 py-2 text-right">P2 No Open+Not Suggested</th>
            <th className="border border-gray-300 px-3 py-2 text-center">Trapped Wrong</th>
            <th className="border border-gray-300 px-3 py-2 text-center">Bet</th>
            <th className="border border-gray-300 px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => (
            <tr key={s.participantId} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2 font-mono text-xs">
                {s.participantId}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    s.group === "TREATMENT"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {s.group}
                </span>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmt(s.phase1SuggestedRate)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmtTime(s.phase1AvgTime)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmt(s.phase2SuggestedRate)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmtTime(s.phase2AvgTime)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmt(s.phase2OpenedReasonRate)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmt(s.phase2OpenedAndSuggested)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmt(s.phase2OpenedAndNotSuggested)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmt(s.phase2NotOpenedAndSuggested)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmt(s.phase2NotOpenedAndNotSuggested)}</td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                {s.trappedWrong === null ? "—" : s.trappedWrong ? "Yes" : "No"}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                {s.bet === null ? "—" : s.bet ? "Bet" : "No Bet"}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                <button
                  onClick={() => handleDelete(s.participantId)}
                  disabled={deleting === s.participantId}
                  className="text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50"
                >
                  {deleting === s.participantId ? "..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
