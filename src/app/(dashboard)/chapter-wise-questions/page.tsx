// src/app/(dashboard)/chapter-wise-questions/page.tsx
import TestListSection, { TestListItem } from "@/components/dashboard/TestListSection/TestListSection";
import Styles from './chapterWiseQuestions.module.css';

const ChapterWiseQuestions = () => {
  const subjectItems: TestListItem[] = [
    { id: "physics", title: "Physics", meta: "30 Chapters", href:"/chapter-wise-questions/physics" },
    { id: "chemistry", title: "Chemistry", meta: "30 Chapters", href:"/chapter-wise-questions/chemistry"  },
    { id: "maths", title: "Mathematics", meta: "30 Chapters", href:"/chapter-wise-questions/maths"  },
  ];

  return (
    <div className={Styles.chapterWiseQuestions}>
      <TestListSection heading="Chapter Wise Questions" items={subjectItems} />
    </div>
  );
};

export default ChapterWiseQuestions;