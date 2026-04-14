"use client";

import { useState, useEffect } from "react";

type SuggestionPanelProps = {
  suggestedAnswer: string;
  reason: string;
  phase: number;
  onReasonOpened: () => void;
};

export default function SuggestionPanel({
  suggestedAnswer,
  reason,
  phase,
  onReasonOpened,
}: SuggestionPanelProps) {
  const [revealed, setRevealed] = useState(phase === 1);

  useEffect(() => {
    if (phase === 1) {
      onReasonOpened();
    }
  }, [phase, onReasonOpened]);

  const handleClick = () => {
    if (!revealed) {
      onReasonOpened();
      setRevealed(true);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 h-full">
      <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">
        Suggested Answer
      </h3>
      <p className="text-lg font-medium text-amber-900 mb-4">
        {suggestedAnswer}
      </p>

      <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-2">
        Reason
      </h4>
      {revealed ? (
        <div className="p-3 bg-white rounded border border-amber-200 text-sm text-gray-700">
          {reason}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full p-3 bg-white rounded border border-dashed border-amber-300 text-sm text-amber-700 cursor-pointer hover:bg-amber-100 hover:border-amber-400 transition-colors text-left"
        >
          Click to reveal reason
        </button>
      )}
    </div>
  );
}
