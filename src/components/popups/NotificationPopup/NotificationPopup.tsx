"use client";

import React, { useEffect, useRef } from "react";
import styles from "./NotificationPopup.module.css";
import { FiBell } from "react-icons/fi";

export interface NotificationItem {
  id: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('#notification-bell-btn')
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.popupContainer} ref={popupRef}>
      <div className={styles.header}>
        <h3 className={styles.title}>Notifications</h3>
        {notifications.some(n => !n.isRead) && (
          <button 
            className={styles.markAllBtn}
            onClick={() => notifications.forEach(n => !n.isRead && onMarkAsRead(n.id))}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className={styles.listContainer}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <FiBell size={24} className={styles.emptyIcon} />
            <p>No new notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
              onClick={() => {
                if (!notification.isRead) onMarkAsRead(notification.id);
              }}
            >
              <div className={styles.itemHeader}>
                <span className={styles.itemSubject}>{notification.subject}</span>
                <span className={styles.itemTime}>
                  {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className={styles.itemContent}>{notification.content}</p>
              
              {!notification.isRead && <div className={styles.unreadDot} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};