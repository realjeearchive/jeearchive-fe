// src/app/(dashboard)/chapter-wise-questions/[subject]/page.tsx
import TestListSection, { TestListItem } from "@/components/dashboard/TestListSection/TestListSection";
import Styles from '../chapterWiseQuestions.module.css';

interface SubjectPageProps {
  params: Promise<{ subject: string }>;
}

const divisionConfig: Record<string, TestListItem[]> = {
  physics: [
    { id: "mechanics", title: "Mechanics", meta: "11 Chapters", href: "/chapter-wise-questions/physics/mechanics" },
    { id: "thermodynamics", title: "Thermodynamics", meta: "4 Chapters", href: "/chapter-wise-questions/physics/thermodynamics" },
    { id: "electromagnetism", title: "Electromagnetism", meta: "7 Chapters", href: "/chapter-wise-questions/physics/electromagnetism" },
    { id: "optics", title: "Optics", meta: "2 Chapters", href: "/chapter-wise-questions/physics/optics" },
    { id: "modern-physics", title: "Modern Physics", meta: "5 Chapters", href: "/chapter-wise-questions/physics/modern-physics" },
  ],

  chemistry: [
    { id: "physical", title: "Physical Chemistry", meta: "9 Chapters", href: "/chapter-wise-questions/chemistry/physical" },
    { id: "organic", title: "Organic Chemistry", meta: "13 Chapters", href: "/chapter-wise-questions/chemistry/organic" },
    { id: "inorganic", title: "Inorganic Chemistry", meta: "10 Chapters", href: "/chapter-wise-questions/chemistry/inorganic" },
  ],

  maths: [
    { id: "algebra", title: "Algebra", meta: "11 Chapters", href: "/chapter-wise-questions/maths/algebra" },
    { id: "calculus", title: "Calculus", meta: "10 Chapters", href: "/chapter-wise-questions/maths/calculus" },
    { id: "coordinate-geometry", title: "Coordinate Geometry", meta: "6 Chapters", href: "/chapter-wise-questions/maths/coordinate-geometry" },
    { id: "trigonometry", title: "Trigonometry", meta: "4 Chapters", href: "/chapter-wise-questions/maths/trigonometry" },
    { id: "statistics", title: "Statistics & Probability", meta: "3 Chapters", href: "/chapter-wise-questions/maths/statistics" },
  ],
};



export default async function SubjectPage(props: SubjectPageProps) {
  const { subject } = await props.params;   // ⭐ matches your working JEE code

  const items = divisionConfig[subject];

  if (!items) {
    return <div>No divisions found for {subject}</div>;
  }

  const heading = `${subject.toUpperCase()} — Chapter Groups`;

  return <div className={Styles.chapterWiseQuestions}>
    <TestListSection heading={heading} items={items} />
  </div>;
}
