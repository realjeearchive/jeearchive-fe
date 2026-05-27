"use client";

import StatusIcon from "@/components/testPlayer/StatusIcon/StatusIcon";
import styles from "./QuestionPalette.module.css";
import type { QuestionStatus } from "@/features/tests/playertypes";

interface QuestionPaletteProps {
  sectionId: string;
  questionCount: number;
  currentQuestionNumber: number; // This should be the local number of the active question
  questionStates: {
    globalQuestionNumber: number;
    localQuestionNumber: number;
    questionId: string;
    status: QuestionStatus;
  }[];
  onQuestionSelect: (questionId: string) => void;
}

export default function QuestionPalette({
  currentQuestionNumber,
  questionStates,
  onQuestionSelect,
}: QuestionPaletteProps) {
  return (
    <div className={styles.palette} role="list" aria-label="Question navigation palette">
      {questionStates.map((qState) => {
        return (
          <button
            key={qState.questionId}
            className={styles.questionButton}
            onClick={() => onQuestionSelect(qState.questionId)}
            aria-label={`Question ${qState.localQuestionNumber}: ${qState.status}`}
            aria-current={qState.localQuestionNumber === currentQuestionNumber ? "true" : undefined}
          >
            <StatusIcon
              type={qState.status}
              value={qState.localQuestionNumber}
              isCurrent={qState.localQuestionNumber === currentQuestionNumber}
            />
          </button>
        );
      })}
    </div>
  );
}