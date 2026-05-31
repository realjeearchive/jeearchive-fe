"use client";

import React from "react";
import Link from "next/link";
import styles from "./TestListSection.module.css";
import { FiChevronRight, FiInbox } from "react-icons/fi";

export interface TestListItem {
  id: string;
  title: string;
  meta: string;
  href: string;
}

interface TestListSectionProps {
  heading: string;
  items: TestListItem[];
}

const TestListSection: React.FC<TestListSectionProps> = ({ heading, items }) => {
  const hasItems = items && items.length > 0;

  return (
    <section className={styles.section} aria-label={heading}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>{heading}</h2>
      </div>

      <div className={styles.listContainer}>
        {hasItems ? (
          <div className={styles.list} role="list">
            {items.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={item.href}
                className={styles.rowLink}
                role="listitem"
                aria-label={`${item.title} - ${item.meta}`}
              >
                <div className={styles.row}>
                  <div className={styles.left}>
                    <span className={styles.dot} aria-hidden="true" />
                    <div className={styles.textBlock}>
                      <span className={styles.title}>{item.title}</span>
                      <span className={styles.meta}>{item.meta}</span>
                    </div>
                  </div>

                  <FiChevronRight className={styles.chevron} aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiInbox className={styles.emptyIcon} aria-hidden="true" />
            <span className={styles.emptyText}>No items available yet</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestListSection;