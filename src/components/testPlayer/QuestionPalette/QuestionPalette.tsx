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
    status: QuestionStatus;
  }[];
  onQuestionSelect: (questionNumber: number) => void;
}

export default function QuestionPalette({
  sectionId,
  questionCount,
  currentQuestionNumber,
  questionStates,
  onQuestionSelect,
}: QuestionPaletteProps) {
  return (
    <div className={styles.palette}>
      {Array.from({ length: questionCount }, (_, index) => {
        const qNo = index + 1;

        const state = questionStates.find(
          (q) => q.globalQuestionNumber === qNo
        );

        const status: QuestionStatus = state?.status ?? "notVisited";

        return (
          <button
            key={`${sectionId}-${qNo}`}
            className={styles.questionButton}
            onClick={() => onQuestionSelect(qNo)}
          >
            <StatusIcon
              type={
                status === "notVisited" && qNo === currentQuestionNumber
                  ? "notAnswered"
                  : status
              }
              value={qNo}
              isCurrent={qNo === currentQuestionNumber}
            />
          </button>
        );
      })}
    </div>
  );
}
