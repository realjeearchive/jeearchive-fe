"use client";

import React from "react";
import styles from "./TestListSection.module.css";
import { FiChevronRight } from "react-icons/fi";

export interface TestListItem {
  id: string;
  title: string;
  meta: string;   // e.g. "19 Tests"
}

interface TestListSectionProps {
  heading: string;
  items: TestListItem[];
}

const TestListSection: React.FC<TestListSectionProps> = ({ heading, items }) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>{heading}</h2>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <button key={item.id} className={styles.row} type="button">
            <div className={styles.left}>
              <span className={styles.dot} />

              <div className={styles.textBlock}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.meta}>{item.meta}</span>
              </div>
            </div>

            <FiChevronRight className={styles.chevron} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default TestListSection;
