import styles from "./PyqProgressCard.module.css";

interface Props {
  label: "Physics" | "Chemistry" | "Mathematics";
  solved: number;
  total: number;
}

export default function PyqProgressCard({ label, solved, total }: Props) {
  const percentage = Math.round((solved / total) * 100);
  const tone = label === "Mathematics" ? "maths" : label.toLowerCase();

  return (
    <div className={`${styles.card} ${styles[tone]}`}>
      <div className={styles.header}>
        <div className={styles.label}>{label}</div>
        <div className={styles.meta}>Last 5 Years</div>
      </div>

      <div className={styles.main}>
        <div className={styles.circleWrapper}>
          <svg viewBox="0 0 100 100" className={styles.progressSvg}>
            <circle className={styles.bg} cx="50" cy="50" r="45" />
            <circle
              className={styles.progress}
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: 283,
                strokeDashoffset: 283 - (283 * percentage) / 100,
              }}
            />
          </svg>

          <div className={styles.center}>
            <div className={styles.value}>
              {solved}
              <span> / {total}</span>
            </div>
            <div className={styles.solvedLabel}>Solved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
