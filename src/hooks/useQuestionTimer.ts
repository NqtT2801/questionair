"use client";

import { useEffect, useRef, useState } from "react";

export function useQuestionTimer(questionIndex: number) {
  const startTime = useRef<number>(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    startTime.current = Date.now();
    setElapsed(0);

    const interval = setInterval(() => {
      setElapsed((Date.now() - startTime.current) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [questionIndex]);

  const getElapsedSeconds = () => {
    return (Date.now() - startTime.current) / 1000;
  };

  return { elapsed, getElapsedSeconds };
}
