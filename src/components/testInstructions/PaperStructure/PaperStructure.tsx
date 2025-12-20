import styles from "./PaperStructure.module.css";

interface Props {
  sectionsCount: number;
}

export function PaperStructure({ sectionsCount }: Props) {
  return (
    <div className={styles.block}>
      <h2 className={styles.sectionTitle}>
        NAVIGATING THROUGH PARTS OF QUESTION PAPER
      </h2>

      <ol className={styles.numberList}>
        <li>
          The question paper has three parts:{" "}
          <span className={styles.bold}>MATHEMATICS, PHYSICS and CHEMISTRY</span>.
        </li>
        <li>
          Parts in the question paper are displayed on the top bar of the
          screen. Questions within a part can be viewed by clicking on the part
          name. The part which you will be viewing will be highlighted.
        </li>
        <li>
          After clicking the <span className={styles.bold}>Save &amp; Next</span>{" "}
          button on the last question for a part, you will automatically be
          taken to the first question of the next part.
        </li>
        <li>
          You can shuffle between parts and questions within parts anytime
          during the examination as per your convenience.
        </li>
      </ol>
    </div>
  );
}
