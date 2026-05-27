"use client";

import styles from "./StatusButton.module.css";

export type StatusButtonVariant = "primary" | "outline";

interface StatusButtonProps {
  label: string;
  variant?: StatusButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
}

export default function StatusButton({
  label,
  variant = "outline",
  onClick,
  disabled = false,
}: StatusButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label={label}
    >
      {label}
    </button>
  );
}