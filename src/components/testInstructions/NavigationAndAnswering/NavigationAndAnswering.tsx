import styles from "./NavigationAndAnswering.module.css";

export function NavigationAndAnswering() {
  return (
    <div className={styles.block}>
      {/* NAVIGATING TO A QUESTION */}
      <h2 className={styles.sectionTitle}>NAVIGATING TO A QUESTION</h2>
      <p className={styles.paragraph}>
        To navigate between questions, you need to do the following:
      </p>
      <ol className={styles.alphaList}>
        <li>
          Click on the question number in the Question Palette at the right of
          the screen to go to that numbered question directly. Note that using
          this procedure does <span className={styles.bold}>NOT</span> save the
          answer to the current question.
        </li>
        <li>
          Click on <span className={styles.bold}>Save and Next</span> to save
          your answer for the current question and then go to the next question.
        </li>
        <li>
          Click on{" "}
          <span className={styles.bold}>Mark for Review &amp; Next</span> to
          save your answer for the current question, mark it for review, and
          then go to the next question.
        </li>
      </ol>

      {/* ANSWERING A QUESTION */}
      <h2 className={styles.sectionTitle}>ANSWERING A QUESTION</h2>

      {/* 1. MCQ single correct */}
      <ol className={styles.numberList}>
        <li>
          Procedure for answering{" "}
          <span className={styles.bold}>
            multiple choice (single correct option) type questions:
          </span>
        </li>
      </ol>
      <ol className={styles.alphaList}>
        <li>
          To select the option, using the mouse, click on the corresponding
          button of the option.
        </li>
        <li>
          To deselect the chosen answer, click on the{" "}
          <span className={styles.bold}>Clear Response</span> button.
        </li>
        <li>
          To change the chosen answer, first click on the{" "}
          <span className={styles.bold}>Clear Response</span> button to clear
          the entered answer and then enter the new answer.
        </li>
        <li>
          To save the answer and go to the next question, you{" "}
          <span className={styles.bold}>MUST</span> click on the{" "}
          <span className={styles.bold}>Save &amp; Next</span> button.
        </li>
        <li>
          To mark the question for review, click on the{" "}
          <span className={styles.bold}>Mark for Review &amp; Next</span>{" "}
          button.
        </li>
      </ol>

      {/* 2. Multiple select (one or more correct) */}
      <ol className={styles.numberList} start={2}>
        <li>
          Procedure for answering{" "}
          <span className={styles.bold}>
            multiple select (one or more correct options) type questions:
          </span>
        </li>
      </ol>
      <ol className={styles.alphaList}>
        <li>
          To select the option(s),{" "}
          <span className={styles.bold}>using the mouse</span>, click on the
          corresponding button(s) of the option(s).
        </li>
        <li>
          To deselect the chosen answer(s), click on the button(s) of the chosen
          option(s) again or click on the{" "}
          <span className={styles.bold}>Clear Response</span> button.
        </li>
        <li>
          To change the option(s) of a previously answered question, first
          deselect the option(s) as described above and then select the new
          option(s).
        </li>
        <li>
          To save the answer and go to the next question, you{" "}
          <span className={styles.bold}>MUST</span> click on the{" "}
          <span className={styles.bold}>Save &amp; Next</span> button.
        </li>
        <li>
          To mark the question for review, click on the{" "}
          <span className={styles.bold}>Mark for Review &amp; Next</span>{" "}
          button.
        </li>
      </ol>

      {/* 3. Numerical value type */}
      <ol className={styles.numberList} start={3}>
        <li>
          Procedure for answering{" "}
          <span className={styles.bold}>numerical value type questions:</span>
        </li>
      </ol>
      <ol className={styles.alphaList}>
        <li>
          For each question, enter the correct{" "}
          <span className={styles.bold}>numerical value</span> of the answer
          using the computer <span className={styles.bold}>mouse</span> and the{" "}
          <span className={styles.bold}>on-screen virtual numeric keypad</span>.
          Use the mouse to click on numbers (and/or symbols) on the on‑screen
          virtual numeric keypad to enter the numerical value in the space
          provided for the answer.
        </li>
        <li>
          To clear the answer, click on the{" "}
          <span className={styles.bold}>Clear Response</span> button.
        </li>
        <li>
          To change the chosen answer, first click on the{" "}
          <span className={styles.bold}>Clear Response</span> button to clear
          the entered answer and then enter the new answer.
        </li>
        <li>
          To save the answer and go to the next question, you{" "}
          <span className={styles.bold}>MUST</span> click on the{" "}
          <span className={styles.bold}>Save &amp; Next</span> button.
        </li>
        <li>
          To mark the question for review, click on the{" "}
          <span className={styles.bold}>Mark for Review &amp; Next</span>{" "}
          button. <span className={styles.red}>If an answer is entered for a question that is Marked for Review, that answer will be
          considered in evaluation.</span>
        </li>
        <li>
          To change your answer to a question that has already been answered,
          first select that question for answering and then follow the procedure
          for answering that type of question.
        </li>
      </ol>

      {/* 4. Important note about evaluation */}
      <ol className={styles.numberList} start={4}>
        <li>
          Note that <span className={styles.bold}>ONLY</span> Questions for
          which answers are saved or marked for review after answering will be
          considered for evaluation.
        </li>
      </ol>
    </div>
  );
}