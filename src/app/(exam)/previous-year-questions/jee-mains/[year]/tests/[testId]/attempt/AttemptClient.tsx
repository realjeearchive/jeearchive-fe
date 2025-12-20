"use client";

import React, { useEffect } from "react";
import Styles from "./attempt.module.css";
import { getTestAttemptData } from "@/features/tests/api";
import { useTestAttemptStore } from "@/features/tests/useTestAttemptStore";
import { Question } from "@/features/tests/types";

interface AttemptClientProps {
  year: string;
  testId: string;
  data: Awaited<ReturnType<typeof getTestAttemptData>>;
}

export default function AttemptClient({ year, data }: AttemptClientProps) {
  const loadAttempt = useTestAttemptStore((s) => s.loadAttempt);
  const test = useTestAttemptStore((s) => s.test);
  const questions = useTestAttemptStore((s) => s.questions);
  const currentQuestionId = useTestAttemptStore((s) => s.currentQuestionId);
  const goToQuestion = useTestAttemptStore((s) => s.goToQuestion);
  const answerSingleChoice = useTestAttemptStore(
    (s) => s.answerSingleChoice
  );
  const responses = useTestAttemptStore((s) => s.responses);

  useEffect(() => {
    loadAttempt(data.test, data.questions);
  }, [data.test, data.questions, loadAttempt]);

  if (!test || !questions.length || !currentQuestionId) {
    return <div className={Styles.loading}>Loading test…</div>;
  }

  const currentQuestion: Question =
    questions.find((q) => q.id === currentQuestionId) ?? questions[0];

  const currentResponse = responses[currentQuestion.id];

  return (
    <div className={Styles.layout}>
      <header className={Styles.header}>
        <div>
          <p className={Styles.breadcrumb}>
            JEE Main {year} · {test.summary.shift ?? "Full Test"}
          </p>
          <h1 className={Styles.title}>{test.summary.title}</h1>
        </div>
        <div className={Styles.timerBox}>
          <span className={Styles.timerLabel}>Time Left</span>
          <span className={Styles.timerValue}>3:00:00</span>
        </div>
      </header>

      <main className={Styles.main}>
        <section className={Styles.questionPanel}>
          <div className={Styles.questionMeta}>
            <span>Question {currentQuestion.questionNumber}</span>
            <span>{currentQuestion.subject}</span>
          </div>

          <div className={Styles.questionText}>
            {currentQuestion.questionText}
          </div>

          {currentQuestion.type === "SC" && currentQuestion.options && (
            <div className={Styles.optionsList}>
              {currentQuestion.options.map((opt) => {
                const selected =
                  currentResponse?.answerOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`${Styles.optionButton} ${
                      selected ? Styles.optionButton_selected : ""
                    }`}
                    onClick={() =>
                      answerSingleChoice(currentQuestion.id, opt.id)
                    }
                  >
                    <span className={Styles.optionLabel}>{opt.id}</span>
                    <span className={Styles.optionText}>{opt.text}</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <aside className={Styles.palettePanel}>
          <div className={Styles.paletteHeader}>Question Palette</div>
          <div className={Styles.paletteGrid}>
            {questions.map((q) => {
              const r = responses[q.id];
              const isCurrent = q.id === currentQuestion.id;
              const answered =
                r?.answerOptionId || r?.answerNumericValue;
              const marked = r?.markedForReview;

              return (
                <button
                  key={q.id}
                  type="button"
                  className={`${Styles.paletteItem} ${
                    isCurrent ? Styles.paletteItem_current : ""
                  } ${answered ? Styles.paletteItem_answered : ""} ${
                    marked ? Styles.paletteItem_marked : ""
                  }`}
                  onClick={() => goToQuestion(q.id)}
                >
                  {q.questionNumber}
                </button>
              );
            })}
          </div>
        </aside>
      </main>

      <footer className={Styles.footer}>
        <button className={Styles.secondaryButton} type="button">
          Clear Response
        </button>
        <button className={Styles.secondaryButton} type="button">
          Mark for Review
        </button>
        <button className={Styles.primaryButton} type="button">
          Save &amp; Next
        </button>
        <button className={Styles.submitButton} type="button">
          Submit Test
        </button>
      </footer>
    </div>
  );
}
