import TestListSection from "@/components/dashboard/TestListSection/TestListSection";
import { generateQuestionsForChapter } from "./question-config";
import Styles from '../../../chapterWiseQuestions.module.css';

interface PageProps {
  params: Promise<{
    subject: string;
    division: string;
    chapter: string;
  }>;
}

export default async function ChapterPage(props: PageProps) {
  const { chapter } = await props.params;

  const items = generateQuestionsForChapter(chapter);

  const heading =
    chapter
      .split("-")
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(" ") + " — Practice Questions";

  return <div className={Styles.chapterWiseQuestions}>
    <TestListSection heading={heading} items={items} />
  </div>;
}
