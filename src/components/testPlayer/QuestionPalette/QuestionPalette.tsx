"use client";

import StatusIcon from "@/components/testPlayer/StatusIcon/StatusIcon";
import styles from "./QuestionPalette.module.css";
import type { QuestionStatus } from "@/features/tests/playertypes";

interface QuestionPaletteProps {
  sectionId: string;
  questionCount: number;
  currentQuestionNumber: number;
  questionStates: {
    globalQuestionNumber: number;
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
    <div className={styles.palette}>
      {questionStates.map((qState) => {
        return (
          <button
            key={qState.questionId}
            className={styles.questionButton}
            onClick={() => onQuestionSelect(qState.questionId)}
            aria-label={`Go to question ${qState.globalQuestionNumber}`}
          >
            <StatusIcon
              type={qState.status}
              value={qState.globalQuestionNumber}
              isCurrent={qState.globalQuestionNumber === currentQuestionNumber}
            />
          </button>
        );
      })}
    </div>
  );
}