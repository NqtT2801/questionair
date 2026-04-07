"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to the Survey
        </h1>
        <p className="text-gray-600 mb-8">
          This survey consists of multiple phases with multiple-choice questions.
          Please answer each question carefully. Your responses are anonymous.
        </p>
        <button
          onClick={() => router.push("/survey")}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg
                     hover:bg-blue-700 transition-colors text-lg"
        >
          Start Survey
        </button>
      </div>
    </div>
  );
}
