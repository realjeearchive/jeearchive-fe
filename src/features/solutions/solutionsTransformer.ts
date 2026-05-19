import { SolutionDataPayload, SolutionQuestion, SubjectGroup } from "./solutionsApi";

export type Subject = "Physics" | "Chemistry" | "Mathematics";
export type SectionType = "Single Correct" | "Numerical" | "Multiple Correct";
export type QuestionStatus = "correct" | "incorrect" | "unattempted";

export interface TransformedOption {
  id: string;
  text: string;
}

export interface TransformedQuestion {
  id: string;
  number: number;
  subject: Subject;
  section: SectionType;
  comprehensionContent?: string; // 🔥 NEW: Added Passage support
  text: string;
  hasImage: boolean;
  imageUrl?: string;
  options: TransformedOption[];
  correctAnswer: string[]; // 🔥 FIXED: Now an array
  userAnswer: string[] | null; // 🔥 FIXED: Now an array
  status: QuestionStatus;
  chapter: string;
  topic: string;
  solution: string;
  stats: {
    userTime: string;
    avgTime: string;
    accuracy: number;
  };
  meta: {
    difficulty: string;
    marksPos: number;
    marksNeg: number;
  };
}

export interface TransformedSolutionUI {
  id: string;
  name: string;
  questions: TransformedQuestion[];
}

const formatTime = (seconds: number | undefined) => {
  if (!seconds) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

// Helper to safely extract and clean HTML text
const extractText = (content: string | undefined | null) => {
  if (!content) return "";
  return content; 
};

export const transformSolutionData = (data: SolutionDataPayload | null): TransformedSolutionUI | null => {
  if (!data) return null;

  const paper = data.paper;
  if (!paper) return null;
  
  // 1. Build the beautiful Test Title
  const examRawName = paper.exam?.name || "Mock";
  let formattedExamName = examRawName.replace("_", " ");
  if (examRawName === "JEE_MAIN") formattedExamName = "JEE Main";
  if (examRawName === "JEE_ADVANCED") formattedExamName = "JEE Advanced";

  const testTitle = [
    formattedExamName, 
    paper.year, 
    paper.date, 
    paper.month, 
    paper.shift ? `(${paper.shift})` : ""
  ].filter(Boolean).join(" ").trim() || "Mock Test";

  const questions: TransformedQuestion[] = [];
  const subjects: Subject[] = ["Physics", "Chemistry", "Mathematics"];
  
  // Strictly typing the section keys to match the SubjectGroup interface
  const sections: (keyof SubjectGroup)[] = [
      "SingleCorrect", 
      "MultiCorrect", 
      "Integer", 
      "ComprehensionSingleCorrect", 
      "ComprehensionMultiCorrect", 
      "ComprehensionInteger"
  ];

  // 2. Flatten the deeply nested Subject -> Type -> Questions array
  subjects.forEach((subject) => {
    // Safely cast to access dynamic subject properties
    const subjectData = data[subject as keyof SolutionDataPayload] as SubjectGroup | undefined;
    if (!subjectData) return;

    sections.forEach((sectionKey) => {
      const qList = subjectData[sectionKey];
      if (!qList || !Array.isArray(qList)) return;
      
      qList.forEach((q: SolutionQuestion) => {
        
        // --- A. Format Options ---
        const options: TransformedOption[] = [];
        if (q.options) {
          if (q.options.optionAtext) options.push({ id: "A", text: extractText(q.options.optionAtext) });
          if (q.options.optionBtext) options.push({ id: "B", text: extractText(q.options.optionBtext) });
          if (q.options.optionCtext) options.push({ id: "C", text: extractText(q.options.optionCtext) });
          if (q.options.optionDtext) options.push({ id: "D", text: extractText(q.options.optionDtext) });
        }

        // --- B. Determine User Status ---
        let status: QuestionStatus = "unattempted";
        const userAnswerArr = q.attemptStatus?.userAnswer || [];
        const correctAnsArr = q.correctAnswer || [];
        
        if (q.attemptStatus?.status === "answered") {
          // Sort arrays to safely compare multiple correct answers (e.g., ["A", "B"] vs ["B", "A"])
          const userStr = [...userAnswerArr].sort().join(",");
          const correctStr = [...correctAnsArr].sort().join(",");
          status = (userStr === correctStr) ? "correct" : "incorrect";
        }

        // --- C. Map Backend Type to UI Section Name ---
        let uiSection: SectionType = "Single Correct";
        if (sectionKey.includes("Multi")) uiSection = "Multiple Correct";
        if (sectionKey.includes("Integer")) uiSection = "Numerical";

        // --- D. Push to flattened array ---
        questions.push({
          id: q.id,
          number: q.questionNumber,
          subject: subject,
          section: uiSection,
          comprehensionContent: extractText(q.comprehensionContent), // 🔥 Extract passage
          text: extractText(q.content),
          hasImage: false, 
          imageUrl: undefined,
          options: options,
          correctAnswer: correctAnsArr, // 🔥 Pass array directly
          userAnswer: userAnswerArr.length > 0 ? userAnswerArr : null, // 🔥 Pass array directly
          status: status,
          chapter: q.chapter || "Mixed Concepts",
          topic: "JEE Syllabus", 
          solution: extractText(q.solution?.text) || "<p>Detailed solution not available.</p>",
          stats: {
            userTime: formatTime(q.attemptStatus?.timeSpent),
            avgTime: "--", 
            accuracy: 0    
          },
          meta: {
            difficulty: "Medium", 
            marksPos: q.positiveMarks || 4,
            marksNeg: q.negativeMarks || 1
          }
        });
      });
    });
  });

  // 3. Sort all flattened questions perfectly by their question number (1 to 75/90)
  questions.sort((a, b) => a.number - b.number);

  return {
    id: paper.id,
    name: testTitle,
    questions: questions
  };
};