"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [showPrompt, setShowPrompt] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "master") {
      router.push("/admin");
    } else {
      setError("Invalid access code");
    }
  };

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

        <div className="mt-8">
          {!showPrompt ? (
            <button
              onClick={() => setShowPrompt(true)}
              className="text-sm text-gray-500 hover:text-blue-600 underline"
            >
              Admin access
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
              <input
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                placeholder="Enter access code"
                autoFocus
                className="px-3 py-2 border border-gray-300 rounded-md text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md
                             hover:bg-gray-900 transition-colors"
                >
                  Enter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPrompt(false);
                    setCode("");
                    setError("");
                  }}
                  className="px-4 py-2 text-gray-600 text-sm rounded-md
                             hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
