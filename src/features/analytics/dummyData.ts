// src/features/analytics/dummyData.ts

export const OVERALL_STATS = {
  testsAttempted: 12,
  averageScore: 145, // out of 300
  averageAccuracy: 76.5, // Percentage
  consistencyScore: 8.2, // Low variation is good
  totalQuestionsSolved: 850,
};

// Trend Data for Line Chart
export const SCORE_TREND_DATA = [
  {
    id: "score",
    color: "hsl(200, 70%, 50%)", // Will use theme color later
    data: [
      { x: "Test 1", y: 110 },
      { x: "Test 2", y: 125 },
      { x: "Test 3", y: 115 },
      { x: "Test 4", y: 135 },
      { x: "Test 5", y: 142 },
      { x: "Test 6", y: 158 },
      { x: "Test 7", y: 150 },
      { x: "Test 8", y: 165 },
    ],
  },
];

// Subject Strength (Radar Data)
export const SUBJECT_STRENGTH_DATA = [
  { subject: "Physics", score: 65, accuracy: 82 },
  { subject: "Chemistry", score: 75, accuracy: 68 },
  { subject: "Maths", score: 45, accuracy: 90 },
];

// Recent Tests List
export const RECENT_TESTS = [
  {
    id: "test_001",
    title: "JEE Main 2025 (27 Jan Shift 1)",
    date: "2 Days ago",
    score: 165,
    totalMarks: 300,
    status: "COMPLETED",
  },
  {
    id: "test_002",
    title: "JEE Main 2024 (29 Jan Shift 2)",
    date: "5 Days ago",
    score: 142,
    totalMarks: 300,
    status: "COMPLETED",
  },
  {
    id: "test_003",
    title: "Mock Test - Full Syllabus 04",
    date: "1 Week ago",
    score: 0,
    totalMarks: 300,
    status: "IN_PROGRESS",
  },
];

// 1. Subject Deep Dive Data
export const SUBJECT_DEEP_DIVE = [
  { subject: "Physics", avgScore: 65, accuracy: 82, negatives: 15, avgTime: 55 },
  { subject: "Chemistry", avgScore: 72, accuracy: 68, negatives: 35, avgTime: 40 },
  { subject: "Mathematics", avgScore: 45, accuracy: 90, negatives: 8, avgTime: 75 },
];

// 2. Difficulty Strategy (The Trap)
// "Easy Questions Missed" is the biggest sin in JEE
export const DIFFICULTY_STRATEGY = {
  easyMissed: 24, // Total count across tests
  moderateMissed: 45,
  toughAttempted: 12, // Wasted time on hard Qs
  toughCorrect: 5,
};

// 3. Weakness Hunter (Chapter Level)
export const WEAK_CHAPTERS = [
  { id: "c1", name: "Rotational Motion", subject: "Physics", accuracy: 32, weightage: "High" },
  { id: "c2", name: "Thermodynamics", subject: "Chemistry", accuracy: 45, weightage: "High" },
  { id: "c3", name: "Complex Numbers", subject: "Mathematics", accuracy: 28, weightage: "Medium" },
  { id: "c4", name: "Electrostatics", subject: "Physics", accuracy: 50, weightage: "High" },
  { id: "c5", name: "Integration", subject: "Mathematics", accuracy: 40, weightage: "High" },
];


// ... existing exports

export const SINGLE_TEST_DATA = {
  meta: {
    testName: "JEE Main 2025 (27 Jan Shift 1)",
    date: "Attempted on 29 Jan 2025",
    totalMarks: 300,
    maxMarks: 300, // Added for compatibility
    score: 159,    // <--- ADDED THIS FIELD
    myScore: 159,
    accuracy: 82.35,
    timeTaken: 167, // minutes
    rank: 830,
    totalStudents: 2346,
    predictedPercentile: 98.17,
  },
  subjects: {
    maths: { score: 28, total: 100, accuracy: 70 },
    physics: { score: 77, total: 100, accuracy: 88 },
    chemistry: { score: 54, total: 100, accuracy: 75 },
  },
  stats: {
    attempted: 51,
    totalQs: 75,
    correct: 42,
    wrong: 9,
    positiveScore: 168,
    negativeScore: -9,
  }
};

export const OVERVIEW_COMPARISON = {
  score: { you: 159, average: 110, topper: 285 },
  accuracy: { you: 82.35, average: 65, topper: 95 },
  time: { you: 167, average: 175, topper: 140 }, // in minutes
  subjects: [
    { name: "Mathematics", score: 28, total: 100, attempted: 9, correct: 7, wrong: 2, accuracy: 77, time: 63 },
    { name: "Physics", score: 77, total: 100, attempted: 23, correct: 20, wrong: 3, accuracy: 87, time: 59 },
    { name: "Chemistry", score: 54, total: 100, attempted: 19, correct: 15, wrong: 4, accuracy: 79, time: 45 },
  ]
};