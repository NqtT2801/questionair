"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { QuestionDef, ResponseData, SurveyStartResponse } from "@/lib/types";
import { useQuestionTimer } from "@/hooks/useQuestionTimer";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import SuggestionPanel from "./SuggestionPanel";
import BetQuestion from "./BetQuestion";

type Status = "loading" | "active" | "submitting" | "done" | "error";

export default function SurveyContainer() {
  const [status, setStatus] = useState<Status>("loading");
  const [participantId, setParticipantId] = useState("");
  const [group, setGroup] = useState("");
  const [questions, setQuestions] = useState<QuestionDef[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const reasonOpened = useRef(false);
  const { getElapsedSeconds } = useQuestionTimer(currentIndex);

  // Start the survey
  useEffect(() => {
    fetch("/api/survey/start", { method: "POST" })
      .then((res) => res.json())
      .then((data: SurveyStartResponse) => {
        setParticipantId(data.participantId);
        setGroup(data.group);
        setQuestions(data.questions);
        setStatus("active");
      })
      .catch(() => {
        setErrorMsg("Failed to start survey. Please try again.");
        setStatus("error");
      });
  }, []);

  const currentQuestion: QuestionDef | undefined = questions[currentIndex];

  const handleReasonOpened = useCallback(() => {
    reasonOpened.current = true;
  }, []);

  const recordAndAdvance = useCallback(() => {
    if (selectedOption === null || !currentQuestion) return;

    const response: ResponseData = {
      questionKey: currentQuestion.key,
      phase: currentQuestion.phase,
      selectedOption,
      isSuggestedAnswer: currentQuestion.correctOptionIndex >= 0
        ? selectedOption === currentQuestion.correctOptionIndex
        : false,
      openedReason: reasonOpened.current,
      timeToAnswerSeconds: parseFloat(getElapsedSeconds().toFixed(2)),
      isTrapped: currentQuestion.isTrapped,
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    // Check if this was the last question
    if (currentIndex + 1 >= questions.length) {
      submitSurvey(newResponses);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      reasonOpened.current = false;
    }
  }, [selectedOption, currentQuestion, currentIndex, questions.length, responses, getElapsedSeconds]);

  const submitSurvey = async (allResponses: ResponseData[]) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId,
          responses: allResponses,
        }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setStatus("done");
    } catch {
      setErrorMsg("Failed to submit survey. Please try again.");
      setStatus("error");
    }
  };

  // Get phase info for progress bar
  const getPhaseInfo = () => {
    if (!currentQuestion) return { phase: 1, questionInPhase: 1, totalInPhase: 1 };

    const phase = currentQuestion.phase;
    const phaseQuestions = questions.filter((q) => q.phase === phase);
    const indexInPhase = phaseQuestions.indexOf(currentQuestion) + 1;

    return {
      phase,
      questionInPhase: indexInPhase,
      totalInPhase: phaseQuestions.length,
    };
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Preparing your survey...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (status === "submitting") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Submitting your responses...</p>
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-5xl mb-4">&#10003;</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600">
            Your survey has been submitted successfully.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Participant ID: {participantId} | Group: {group}
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const phaseInfo = getPhaseInfo();
  const isBet = currentQuestion.isBet;

  return (
    <div>
      <ProgressBar
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        phase={phaseInfo.phase}
        questionInPhase={phaseInfo.questionInPhase}
        totalInPhase={phaseInfo.totalInPhase}
      />

      {isBet ? (
        <BetQuestion
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
          onSubmit={recordAndAdvance}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <QuestionCard
              text={currentQuestion.text}
              options={currentQuestion.options}
              selectedOption={selectedOption}
              onSelect={setSelectedOption}
              onNext={recordAndAdvance}
              questionNumber={currentIndex + 1}
              isTrapped={currentQuestion.isTrapped}
            />
          </div>
          <div className="md:col-span-1">
            <SuggestionPanel
              key={currentQuestion.key}
              suggestedAnswer={
                currentQuestion.options[currentQuestion.correctOptionIndex]
              }
              reason={currentQuestion.reason}
              onReasonOpened={handleReasonOpened}
            />
          </div>
        </div>
      )}
    </div>
  );
}
