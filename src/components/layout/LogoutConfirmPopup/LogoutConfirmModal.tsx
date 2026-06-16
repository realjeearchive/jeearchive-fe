"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./LogoutConfirmModal.module.css";
import { authenticatedFetch } from "@/features/auth/api";

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure portal only renders on the client to prevent SSR hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Hit the backend logout API
      await authenticatedFetch("/auth/logout", {
        method: "POST",
      });
      onConfirm();
    } catch (error) {
      console.error("Logout API failed:", error);
      onConfirm();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 🔥 createPortal renders the modal at the root level (document.body)
  return createPortal(
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
            disabled={isLoggingOut}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};