import { TestListItem } from "@/components/dashboard/TestListSection/TestListSection";

// Generic 5-question template
const questionTemplates = [
  { id: "q1", title: "Basic Concept Check", meta: "Easy · Fundamentals" },
  { id: "q2", title: "Standard JEE Problem", meta: "Medium · Application" },
  { id: "q3", title: "Multi-Concept Question", meta: "Medium · Mixed" },
  { id: "q4", title: "Numerical Problem", meta: "Hard · Calculation" },
  { id: "q5", title: "Advanced JEE Level", meta: "Hard · Challenge" },
];

// This function generates 5 questions for any chapter
export function generateQuestionsForChapter(chapterId: string): TestListItem[] {
  return questionTemplates.map(q => ({
    ...q,
    href: `#`,
    id: `${chapterId}-${q.id}`,
    title: `${q.title} — ${formatChapterName(chapterId)}`,
  }));
}

// Format slug into display text
function formatChapterName(slug: string) {
  return slug
    .split("-")
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
