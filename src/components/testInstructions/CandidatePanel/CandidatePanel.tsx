import styles from "./CandidatePanel.module.css";

interface Props {
  candidateLabel: string;
}

export function CandidatePanel({ candidateLabel }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.avatar} />
      <div className={styles.name}>{candidateLabel}</div>
    </div>
  );
}
