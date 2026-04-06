"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import styles from "./EfficiencyMatrix.module.css";

interface EfficiencyData {
  mcqAcc: number;
  numAcc: number;
  leakage: number;
  momentum: number;
}

interface EfficiencyMatrixProps {
  data: EfficiencyData;
}

export const EfficiencyMatrix: React.FC<EfficiencyMatrixProps> = ({ data }) => {
  const isZero = data.mcqAcc === 0 && data.numAcc === 0 && data.leakage === 0 && data.momentum === 0;

  return (
    <AnalyticsCard title="Format Strategy" subtitle="Accuracy by question type & score trend">
      <div className={`${styles.listContainer} ${isZero ? styles.faded : ''}`}>
        
        {/* Row 1: MCQ */}
        <div className={styles.row}>
          <div className={styles.label}>MCQ Accuracy</div>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${data.mcqAcc}%` }} />
          </div>
          <div className={styles.value}>{data.mcqAcc}%</div>
        </div>

        {/* Row 2: Numerical */}
        <div className={styles.row}>
          <div className={styles.label}>Numerical Acc.</div>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${data.numAcc}%` }} />
          </div>
          <div className={styles.value}>{data.numAcc}%</div>
        </div>

        {/* Separator */}
        <div className={styles.divider} />

        {/* Row 3: Leakage */}
        <div className={styles.row}>
          <div className={styles.label}>Score Leakage</div>
          <div className={styles.spacer} />
          <div className={styles.valueBadge}>-{data.leakage}</div>
        </div>

        {/* Row 4: Momentum */}
        <div className={styles.row}>
          <div className={styles.label}>Score Momentum</div>
          <div className={styles.spacer} />
          <div className={`${styles.valueBadge} ${data.momentum > 0 ? styles.positive : styles.negative}`}>
            {data.momentum > 0 ? '+' : ''}{data.momentum}
          </div>
        </div>

        {isZero && (
          <div className={styles.emptyOverlay}>
            Not enough data
          </div>
        )}

      </div>
    </AnalyticsCard>
  );
};