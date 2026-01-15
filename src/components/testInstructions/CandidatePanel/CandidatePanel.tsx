"use client";

import { useUserStore } from "@/store/userStore";
import styles from "./CandidatePanel.module.css";

interface Props {
  candidateLabel?: string; 
}

export function CandidatePanel({ candidateLabel }: Props) {

  const userName = useUserStore((s) => s.profile?.name);
  

  const displayName = userName || candidateLabel || "Candidate Name";

  return (
    <div className={styles.panel}>
      <div className={styles.avatar} />
      <div className={styles.name} suppressHydrationWarning>
        {displayName}
      </div>
    </div>
  );
}