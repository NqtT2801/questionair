"use client";

type ProgressBarProps = {
  currentIndex: number;
  totalQuestions: number;
  phase: number;
  questionInPhase: number;
  totalInPhase: number;
};

export default function ProgressBar({
  currentIndex,
  totalQuestions,
  phase,
  questionInPhase,
  totalInPhase,
}: ProgressBarProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Phase {phase} — Question {questionInPhase}/{totalInPhase}
        </span>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {totalQuestions} total
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
