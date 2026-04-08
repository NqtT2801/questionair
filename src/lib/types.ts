export type Group = "TREATMENT" | "CONTROL";

export type QuestionDef = {
  key: string;
  phase: 1 | 2 | 3;
  group: Group | "ALL";
  text: string;
  options: string[];
  correctOptionIndex: number; // -1 for bet question (no correct answer)
  reason: string;
  isTrapped: boolean;
  isBet: boolean;
};

export type ResponseData = {
  questionKey: string;
  phase: number;
  selectedOption: number;
  isSuggestedAnswer: boolean;
  openedReason: boolean;
  timeToAnswerSeconds: number;
  isTrapped: boolean;
};

export type SurveyStartResponse = {
  participantId: string;
  group: Group;
  questions: QuestionDef[];
};

export type ParticipantStats = {
  participantId: string;
  group: string;
  phase1SuggestedRate: number;
  phase1AvgTime: number;
  phase2SuggestedRate: number;
  phase2AvgTime: number;
  phase2OpenedReasonRate: number;
  phase2OpenedAndSuggested: number;
  phase2OpenedAndNotSuggested: number;
  phase2NotOpenedAndSuggested: number;
  phase2NotOpenedAndNotSuggested: number;
  trappedWrong: boolean | null;
  bet: boolean | null;
};
