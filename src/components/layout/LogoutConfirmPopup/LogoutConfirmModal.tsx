"use client";

import React from "react";
import styles from "./LogoutConfirmModal.module.css";

interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        <h2 className={styles.title}>Log out</h2>
        <p className={styles.message}>
          Are you sure you want to log out of your account?
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={onConfirm}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};
