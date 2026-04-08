"use client";

type QuestionCardProps = {
  text: string;
  options: string[];
  selectedOption: number | null;
  onSelect: (index: number) => void;
  onNext: () => void;
  questionNumber: number;
  isTrapped?: boolean;
};

export default function QuestionCard({
  text,
  options,
  selectedOption,
  onSelect,
  onNext,
  questionNumber,
  isTrapped,
}: QuestionCardProps) {
  return (
    <div className="flex flex-col h-full">
      {isTrapped && (
        <span className="inline-block mb-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full w-fit">
          Attention Question
        </span>
      )}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        <span className="text-blue-600">Q{questionNumber}.</span> {text}
      </h2>

      <div className="space-y-3 flex-1">
        {options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === index
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="question-option"
              checked={selectedOption === index}
              onChange={() => onSelect(index)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-3 text-gray-800">{option}</span>
          </label>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={selectedOption === null}
        className="mt-6 w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   hover:bg-blue-700 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
