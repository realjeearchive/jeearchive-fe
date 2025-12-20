import styles from "./InstructionsHeader.module.css";

export function InstructionsHeader() {
  return (
    <section className={styles.block}>
      <h1 className={styles.mainTitle}>INSTRUCTIONS TO CANDIDATES</h1>

      <h2 className={styles.sectionTitle}>GENERAL INSTRUCTIONS</h2>

      <ol className={styles.list}>
        <li>
          Total duration of the paper is 180 minutes.
        </li>
        <li>
          The on-screen computer clock will be set at the server. The countdown
          timer in the top right corner of the computer screen will display the
          remaining time (in minutes) available for you to complete the
          examination. When the timer reaches zero, the examination will end by
          itself automatically. You will not be required to end or submit the
          answers of examination. Please note that only the answers that you
          have saved will be recorded and submitted.
        </li>
        <li>
          The Question Palette displayed on the right side of screen will show
          the status of each question using one of the following symbols. You
          can view the summary of your actions on the questions of any section
          above the question palette.
        </li>
      </ol>
    </section>
  );
}
