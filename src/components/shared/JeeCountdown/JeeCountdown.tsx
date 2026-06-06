"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { getJeeDaysLeft } from "@/utils/jeeTimer";
import { Hourglass } from "lucide-react";
import styles from "./JeeCountdown.module.css";

export const JeeCountdown = () => {
  const profile = useUserStore((s) => s.profile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const userClass = profile?.className || profile?.class; 
  const timeLeft = userClass ? getJeeDaysLeft(userClass) : null;

  if (!timeLeft) return null;

  return (
    <div className={styles.container}>
      <Hourglass size={14} className={styles.icon} strokeWidth={2.5} />
      <div className={styles.textBlock}>
        <span className={styles.days}>{timeLeft.days}</span>
        <span className={styles.label}>Days to {timeLeft.label}</span>
      </div>
    </div>
  );
};