import { QuestionListItem } from "./api";

/**
 * Sorts questions based on Year (descending), Session, Month, Date, Shift, and finally questionNumber.
 * This ensures that the practice player presents questions in the exact same order as the list view.
 */
export function sortQuestions(questions: QuestionListItem[]): QuestionListItem[] {
  return [...questions].sort((a, b) => {
    const yearA = a.papers?.year || 0;
    const yearB = b.papers?.year || 0;
    if (yearA !== yearB) return yearB - yearA;

    const sessionA = a.papers?.session || "";
    const sessionB = b.papers?.session || "";
    if (sessionA !== sessionB) return sessionA.localeCompare(sessionB);

    const months: Record<string, number> = {
      january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
      july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
    };
    const monthA = months[(a.papers?.month || "").toLowerCase()] || 99;
    const monthB = months[(b.papers?.month || "").toLowerCase()] || 99;
    if (monthA !== monthB) return monthA - monthB;

    const dateA = parseInt(a.papers?.date || "0");
    const dateB = parseInt(b.papers?.date || "0");
    if (dateA !== dateB) return dateA - dateB;

    const shiftA = a.papers?.shift?.toLowerCase() || "";
    const shiftB = b.papers?.shift?.toLowerCase() || "";
    if (shiftA !== shiftB) {
      const isMorningA = shiftA.includes("morning") || shiftA.includes("1");
      const isMorningB = shiftB.includes("morning") || shiftB.includes("1");
      if (isMorningA && !isMorningB) return -1;
      if (!isMorningA && isMorningB) return 1;
      return shiftA.localeCompare(shiftB);
    }

    return (a.questionNumber || 0) - (b.questionNumber || 0);
  });
}
