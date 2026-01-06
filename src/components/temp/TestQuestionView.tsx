"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const data = {
  "isBonus": false,
  "isOutOfSyllabus": false,
  "questionType": "mcq",
  "postiveMarks": 3,
  "negativeMarks": 1,
  "subject": "physics",
  "questionNumber": 1,
  "question": "A region in the form of an equilateral triangle (in $x-y$ plane) of height $L$ has a uniform magnetic field $\\vec{B}$ pointing in the $+z$-direction. A conducting loop $\\mathrm{PQR}$, in the form of an equilateral triangle of the same height $L$, is placed in the $x-y$ plane with its vertex $\\mathrm{P}$ at $x=0$ in the orientation shown in the figure. At $t=0$, the loop starts entering the region of the magnetic field with a uniform velocity $\\vec{v}$ along the $+x$-direction. The plane of the loop and its orientation remain unchanged throughout its motion.\n\n![image_0](0)\n\nWhich of the following graph best depicts the variation of the induced emf $(E)$ in the loop as a function of the distance $(x)$ starting from $x=0$ ?",
  "questionImage": [
    "https://f003.backblazeb2.com/file/Jee-Archive/jee-advanced/2024/Online1/question/'image_0'?Authorization=3_20260106195136_43eb071678cdea799bd4a31a_a3b0f81861e4354f399fb2b0317931de928bfa3c_003_20260113195136_0044_dnld"
  ],
  "comprehension": "",
  "comprehensionImage": [],
  "options": [
    {
      "identifier": "A",
      "content": "\n\n![image_0](0)",
      "image": [
        "https://f003.backblazeb2.com/file/Jee-Archive/jee-advanced/2024/Online1/Option_{A}/'image_0'?Authorization=3_20260106195142_de5423bcca76d73391aa4e12_17986f60a500b457ccfeda1e742de2ae8e7ab707_003_20260113195142_0046_dnld"
      ]
    },
    {
      "identifier": "B",
      "content": "\n\n![image_0](0)",
      "image": [
        "https://f003.backblazeb2.com/file/Jee-Archive/jee-advanced/2024/Online1/Option_{B}/'image_0'?Authorization=3_20260106195148_7a19e21c91af4464d9194578_d3158d820512a4246a13597eb2ad31a8e533973a_003_20260113195148_0046_dnld"
      ]
    },
    {
      "identifier": "C",
      "content": "\n\n![image_0](0)",
      "image": [
        "https://f003.backblazeb2.com/file/Jee-Archive/jee-advanced/2024/Online1/Option_{C}/'image_0'?Authorization=3_20260106195154_7d8469c062732d765be14799_b062d4b4d29a0a0fc3d06bf2815280530975df29_003_20260113195154_0046_dnld"
      ]
    },
    {
      "identifier": "D",
      "content": "\n\n![image_0](0)",
      "image": [
        "https://f003.backblazeb2.com/file/Jee-Archive/jee-advanced/2024/Online1/Option_{D}/'image_0'?Authorization=3_20260106195200_3d3dc1f65dc2250256efcda5_00119966625ee2e397268dec12519c2900cd0434_003_20260113195200_0046_dnld"
      ]
    }
  ],
  "correctAnswer": [
    "A",
    null
  ],
  "explation": "0 to L\n\n![image_0](0)\n\n$$\\varepsilon=\\mathrm{B} \\ell_{\\mathrm{ent}} \\mathrm{v}=\\mathrm{B} \\times \\frac{\\mathrm{x}}{\\sqrt{3}} \\mathrm{v}$$\n\nL to 2 L\n\n![image_1](1)\n\n$$\\begin{aligned} & |\\operatorname{emf}|=B\\left(\\frac{L}{\\sqrt{3}}-\\frac{x_0}{\\sqrt{3}}\\right) v-B \\frac{2 x_0}{\\sqrt{3}} v \\\\ \n & =\\frac{B v L}{\\sqrt{3}}-\\sqrt{3} B v x_0 \\\\ \n & =B v\\left\\[\\frac{L}{\\sqrt{3}}-\\sqrt{3}(x-L)\\right\\] \\\\ \n & =\\frac{B v}{\\sqrt{3}}\\[L-3 x+3 L\\] \\\\ \n & =\\frac{B v}{\\sqrt{3}}\\[4 L-3 x\\] \\\\ \n & \\text { at } x=\\frac{4 L}{3} \\\\ \n & \\text { emf }=0 \\end{aligned}$$",
  "explationImage": [
    "https://f003.backblazeb2.com/file/Jee-Archive/jee-advanced/2024/Online1/explanation/'image_0'?Authorization=3_20260106195207_cce716a4be1a74d03b4f5fa5_0389db010c44b5ef32362e1c127e5cbcb2a006df_003_20260113195207_0047_dnld",
    "https://f003.backblazeb2.com/file/Jee-Archive/jee-advanced/2024/Online1/explanation/'image_1'?Authorization=3_20260106195214_9c71f098cd00174ec8efba2d_42f41264a81eb1d45c4fa869c9716e5a12cc9ace_003_20260113195214_0047_dnld"
  ],
  "chapter": "",
  "examDetails": ""
};

const data2 = {
  "isBonus": false,
  "isOutOfSyllabus": false,
  "questionType": "integer",
  "postiveMarks": 4,
  "negativeMarks": 0,
  "subject": "mathematics",
  "questionNumber": 1,
  "question": "Let the function $f: \\mathbb{R} \\rightarrow \\mathbb{R}$ be defined by\n\n$$ f(x)=\\frac{\\sin x}{e^{\\pi x}} \\frac{\\left(x^{2023}+2024 x+2025\\right)}{\\left(x^2-x+3\\right)}+\\frac{2}{e^{\\pi x}} \\frac{\\left(x^{2023}+2024 x+2025\\right)}{\\left(x^2-x+3\\right)} . $$\n\nThen the number of solutions of $f(x)=0$ in $\\mathbb{R}$ is \\_\\_\\_\\_\\_\\_\\_\\_\\_.",
  "questionImage": [],
  "comprehension": "",
  "comprehensionImage": [],
  "options": [],
  "correctAnswer": [
    "1"
  ],
  "explation": "$$\\begin{aligned} & \\mathrm{f}(\\mathrm{x})=\\frac{\\left(\\mathrm{x}^{2023}+2024 \\mathrm{x}+2025\\right)}{\\mathrm{e}^{\\pi \\mathrm{x}}\\left(\\mathrm{x}^2-\\mathrm{x}+3\\right)}(\\sin \\mathrm{x}+2) \\\\ & \\because(\\sin \\mathrm{x}+2) \\text { is never zero } \\\\ & \\therefore \\text { for } \\mathrm{x}^{2223}+2024 \\mathrm{x}+2025=0 \\\\ & \\text { let } \\phi(\\mathrm{x})=\\mathrm{x}^{2023}+2024 \\mathrm{x}+2025 \\\\ & \\phi^{\\prime}(\\mathrm{x})=2023 \\mathrm{x}^{2022}+2024>0 \\forall \\mathrm{x} \\in \\mathrm{R} \\\\ & \\therefore \\phi(\\mathrm{x}) \\text { is an Strictly Increasing function } \\\\ & \\therefore \\phi(\\mathrm{x})=0 \\text { for exactly one value of } \\mathrm{x} \\\\ & \\therefore \\mathrm{f}(\\mathrm{x})=0 \\text { has one solution } \\end{aligned}$$",
  "explationImage": [],
  "chapter": "",
  "examDetails": ""
}

interface Option {
  identifier: string;
  content: string;
  image: string[];
}

interface QuestionData {
  questionType: string;
  questionNumber: number;
  postiveMarks: number;
  negativeMarks: number;
  question: string;
  questionImage: string[];
  options: Option[];
  correctAnswer: (string | null)[];
  explation: string;
  explationImage: string[];
  subject?: string;
}

const render = (content: string, images: string[]) => (
  <div className="prose max-w-none text-white [&_.katex]:text-white">
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        img: ({ src }) => {
          const index = parseInt(src || "0", 10);
          const url = images[index];
          if (!url) return null;

          return (
            <img
              src={url}
              className="my-4 max-h-[300px] rounded-lg shadow invert"
              loading="lazy"
              alt={`Question image ${index}`}
            />
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

// Individual Question Component
const QuestionItem = ({ questionData }: { questionData: QuestionData }) => {
  const isMCQ = questionData.questionType === "mcq";
  const isInteger = questionData.questionType === "integer";
  const hasOptions = questionData.options && questionData.options.length > 0;

  return (
    <div className="mb-12 last:mb-0 p-6 border rounded-xl bg-gray-900/30">
      {/* Question Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Question {questionData.questionNumber}</h2>
            {questionData.subject && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                {questionData.subject.charAt(0).toUpperCase() + questionData.subject.slice(1)}
              </span>
            )}
          </div>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            {isMCQ ? "MCQ" : isInteger ? "Integer Type" : questionData.questionType}
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-green-500 font-medium">+{questionData.postiveMarks}</span>
          {questionData.negativeMarks > 0 && (
            <span className="text-red-500 font-medium">−{questionData.negativeMarks}</span>
          )}
        </div>
      </div>

      {/* Question Content */}
      <div className="p-5 border rounded-lg mb-6 bg-gray-800/20">
        {render(questionData.question, questionData.questionImage)}
      </div>

      {/* Options Section - Only show if MCQ */}
      {hasOptions && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Options</h3>
          <div className="space-y-3">
            {questionData.options.map(opt => (
              <div key={opt.identifier} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-700/20 transition-colors">
                <div className="font-semibold text-blue-400 min-w-[28px] text-center">{opt.identifier}.</div>
                <div className="flex-1">{render(opt.content, opt.image)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* For Integer Type - Show answer box */}
      {isInteger && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-800/20">
          <h3 className="font-semibold mb-3">Your Answer</h3>
          <div className="flex gap-2">
            <div className="flex-1 border-2 border-dashed border-gray-500 rounded-lg p-4 text-center text-gray-300">
              Integer answer goes here
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            Enter a single integer value (0-9)
          </div>
        </div>
      )}

      {/* Explanation Section */}
      <div className="p-5 border rounded-lg bg-gray-800/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Explanation</h3>
          <div className="text-sm text-gray-400">
            Show Answer
          </div>
        </div>
        {render(questionData.explation, questionData.explationImage)}
        
        {/* Correct Answer Display */}
        <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded-lg">
          <div className="font-semibold text-green-400 mb-2">Correct Answer</div>
          <div className="text-green-300">
            {isInteger ? (
              <div className="flex items-center gap-3">
                <span>Integer Answer:</span>
                <span className="text-2xl font-bold bg-green-800 px-4 py-2 rounded-lg">
                  {questionData.correctAnswer.filter(Boolean).join(", ")}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span>Correct Option(s):</span>
                <div className="flex gap-2">
                  {questionData.correctAnswer
                    .filter(Boolean)
                    .map((ans, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-700 text-white font-bold text-lg"
                      >
                        {ans}
                      </span>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TestQuestionView() {
  const questions = [data, data2];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sample Questions</h1>
        <p className="text-gray-400">
          Showing {questions.length} different question types
        </p>
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">MCQ Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Integer Type Questions</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={index} className="relative">
            {index > 0 && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="h-8 w-px bg-gradient-to-b from-gray-600 to-transparent"></div>
              </div>
            )}
            <QuestionItem questionData={question} />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 border rounded-lg bg-gray-800/20">
        <h3 className="font-semibold mb-2">Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Total Questions:</div>
            <div className="font-medium">{questions.length}</div>
          </div>
          <div>
            <div className="text-gray-400">MCQ Questions:</div>
            <div className="font-medium">{questions.filter(q => q.questionType === "mcq").length}</div>
          </div>
          <div>
            <div className="text-gray-400">Integer Type:</div>
            <div className="font-medium">{questions.filter(q => q.questionType === "integer").length}</div>
          </div>
          <div>
            <div className="text-gray-400">Total Marks:</div>
            <div className="font-medium">
              {questions.reduce((sum, q) => sum + q.postiveMarks, 0)} marks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}