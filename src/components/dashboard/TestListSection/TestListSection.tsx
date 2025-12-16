"use client";

import React from "react";
import Link from "next/link";
import styles from "./TestListSection.module.css";
import { FiChevronRight } from "react-icons/fi";

export interface TestListItem {
  id: string;
  title: string;
  meta: string;
  href: string;          // route for this item
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
          <Link
            key={item.id}
            href={item.href}
            className={styles.rowLink}
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

export default TestListSection;
