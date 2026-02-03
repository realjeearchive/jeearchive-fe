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
    localQuestionNumber: number; // <--- ADD THIS LINE
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
          >
            <StatusIcon
              type={qState.status}
              value={qState.localQuestionNumber} // Error will disappear now
              isCurrent={qState.localQuestionNumber === currentQuestionNumber}
            />
          </button>
        );
      })}
    </div>
  );
}