"use client";

type BetQuestionProps = {
  selectedOption: number | null;
  onSelect: (index: number) => void;
  onSubmit: () => void;
};

export default function BetQuestion({
  selectedOption,
  onSelect,
  onSubmit,
}: BetQuestionProps) {
  return (
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Do you want to bet?
      </h2>

      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={() => onSelect(0)}
          className={`px-10 py-4 text-lg font-semibold rounded-lg border-2 transition-all ${
            selectedOption === 0
              ? "border-green-600 bg-green-50 text-green-700"
              : "border-gray-200 hover:border-gray-300 text-gray-700"
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onSelect(1)}
          className={`px-10 py-4 text-lg font-semibold rounded-lg border-2 transition-all ${
            selectedOption === 1
              ? "border-red-600 bg-red-50 text-red-700"
              : "border-gray-200 hover:border-gray-300 text-gray-700"
          }`}
        >
          No
        </button>
      </div>

      <button
        onClick={onSubmit}
        disabled={selectedOption === null}
        className="py-3 px-8 bg-blue-600 text-white font-medium rounded-lg
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   hover:bg-blue-700 transition-colors"
      >
        Submit Survey
      </button>
    </div>
  );
}
