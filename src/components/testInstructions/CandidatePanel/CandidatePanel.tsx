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
    <aside className={styles.panel} aria-label="Candidate information">
      <div className={styles.avatar} aria-hidden="true" />
      <h2 className={styles.name} suppressHydrationWarning>
        {displayName}
      </h2>
    </aside>
  );
}