"use client";

import { useState } from "react";

type SuggestionPanelProps = {
  suggestedAnswer: string;
  reason: string;
  onReasonOpened: () => void;
};

export default function SuggestionPanel({
  suggestedAnswer,
  reason,
  onReasonOpened,
}: SuggestionPanelProps) {
  const [reasonVisible, setReasonVisible] = useState(false);

  const handleToggleReason = () => {
    if (!reasonVisible) {
      onReasonOpened();
    }
    setReasonVisible(!reasonVisible);
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 h-full">
      <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">
        Suggested Answer
      </h3>
      <p className="text-lg font-medium text-amber-900 mb-4">
        {suggestedAnswer}
      </p>

      <button
        onClick={handleToggleReason}
        className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors"
      >
        <span className={`transition-transform ${reasonVisible ? "rotate-90" : ""}`}>
          &#9654;
        </span>
        {reasonVisible ? "Hide Reason" : "View Reason"}
      </button>

      {reasonVisible && (
        <div className="mt-3 p-3 bg-white rounded border border-amber-200 text-sm text-gray-700">
          {reason}
        </div>
      )}
    </div>
  );
}
