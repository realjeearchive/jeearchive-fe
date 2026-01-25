"use client";

import React from "react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import styles from "./TestListSection2.module.css";

export interface TestListItem {
  id: string;
  title: string;
  meta: string;
  href: string;
}

interface TestListSectionProps {
  heading: string;
  items: TestListItem[];
  // Callback to handle click (opens popup) instead of instant navigation
  onItemClick?: (item: TestListItem) => void;
}

const TestListSection2: React.FC<TestListSectionProps> = ({ 
  heading, 
  items, 
  onItemClick 
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>{heading}</h2>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={styles.rowLink}
            onClick={(e) => {
              if (onItemClick) {
                e.preventDefault(); // Stop navigation to open popup first
                onItemClick(item);
              }
            }}
          >
            <div className={styles.row}>
              <div className={styles.left}>
                <span className={styles.dot} />
                <div className={styles.textBlock}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.meta}>{item.meta}</span>
                </div>
              </div>

              <FiChevronRight className={styles.chevron} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TestListSection2;