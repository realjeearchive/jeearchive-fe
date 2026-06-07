"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import TestListSection, {
  TestListItem,
} from "@/components/dashboard/TestListSection/TestListSection";
import Styles from "./chapterWiseQuestions.module.css";

// --- CONFIGURATIONS ---
const DIVISION_CONFIG: Record<string, { id: string; title: string; meta: string }[]> = {
  physics: [
    { id: "mechanics", title: "Mechanics", meta: "13 Chapters" },
    { id: "thermodynamics", title: "Thermodynamics", meta: "3 Chapters" },
    { id: "electromagnetism", title: "Electromagnetism", meta: "8 Chapters" },
    { id: "optics", title: "Optics", meta: "2 Chapters" },
    { id: "modern-physics", title: "Modern Physics", meta: "4 Chapters" },
  ],
  chemistry: [
    { id: "physical", title: "Physical Chemistry", meta: "11 Chapters" },
    { id: "organic", title: "Organic Chemistry", meta: "11 Chapters" },
    { id: "inorganic", title: "Inorganic Chemistry", meta: "9 Chapters" },
  ],
  maths: [
    { id: "algebra", title: "Algebra", meta: "12 Chapters" },
    { id: "calculus", title: "Calculus", meta: "6 Chapters" },
    { id: "coordinate-geometry", title: "Coordinate Geometry", meta: "9 Chapters" },
    { id: "trigonometry", title: "Trigonometry", meta: "5 Chapters" },
    { id: "statistics", title: "Statistics & Probability", meta: "3 Chapters" },
  ],
};

const CHAPTER_CONFIG: Record<string, { id: string; title: string }[]> = {
  mechanics: [
    { id: "physical-world", title: "Physical World" },
    { id: "units-and-dimensions", title: "Units and Dimensions" },
    { id: "motion-in-a-straight-line", title: "Motion in a Straight Line" },
    { id: "motion-in-a-plane", title: "Motion in a Plane" },
    { id: "laws-of-motion", title: "Laws of Motion" },
    { id: "work-energy-and-power", title: "Work, Energy and Power" },
    { id: "system-of-particles-and-rotational-motion", title: "System of Particles and Rotational Motion" },
    { id: "gravitation", title: "Gravitation" },
    { id: "mechanical-properties-of-solids", title: "Mechanical Properties of Solids" },
    { id: "mechanical-properties-of-fluids", title: "Mechanical Properties of Fluids" },
    { id: "oscillations", title: "Oscillations" },
    { id: "waves", title: "Waves" },
    { id: "experimental-physics", title: "Experimental Physics" },
  ],
  thermodynamics: [
    { id: "thermal-properties-of-matter", title: "Thermal Properties of Matter" },
    { id: "thermodynamics-physics", title: "Thermodynamics (Physics)" },
    { id: "kinetic-theory", title: "Kinetic Theory" },
  ],
  electromagnetism: [
    { id: "electric-charges-and-fields", title: "Electric Charges and Fields" },
    { id: "electrostatic-potential-and-capacitance", title: "Electrostatic Potential and Capacitance" },
    { id: "current-electricity", title: "Current Electricity" },
    { id: "moving-charges-and-magnetism", title: "Moving Charges and Magnetism" },
    { id: "magnetism-and-matter", title: "Magnetism and Matter" },
    { id: "electromagnetic-induction", title: "Electromagnetic Induction" },
    { id: "alternating-current", title: "Alternating Current" },
    { id: "electromagnetic-waves", title: "Electromagnetic Waves" },
  ],
  optics: [
    { id: "ray-optics-and-optical-instruments", title: "Ray Optics and Optical Instruments" },
    { id: "wave-optics", title: "Wave Optics" },
  ],
  "modern-physics": [
    { id: "dual-nature-of-radiation-and-matter", title: "Dual Nature of Radiation and Matter" },
    { id: "atoms", title: "Atoms" },
    { id: "nuclei", title: "Nuclei" },
    { id: "semiconductor-electronics", title: "Semiconductor Electronics" },
  ],
  physical: [
    { id: "the-solid-state", title: "The Solid State" },
    { id: "some-basic-concepts-of-chemistry", title: "Some Basic Concepts of Chemistry" },
    { id: "solutions", title: "Solutions" },
    { id: "structure-of-atom", title: "Structure of Atom" },
    { id: "electrochemistry", title: "Electrochemistry" },
    { id: "chemical-kinetics", title: "Chemical Kinetics" },
    { id: "states-of-matter", title: "States of Matter (Gases & Liquids)" },
    { id: "surface-chemistry", title: "Surface Chemistry" },
    { id: "thermodynamics", title: "Thermodynamics" },
    { id: "equilibrium", title: "Equilibrium" },
    { id: "redox-reactions", title: "Redox Reactions" },
  ],
  organic: [
    { id: "practical-organic-chemistry", title: "Practical Organic Chemistry" },
    { id: "haloalkanes-and-haloarenes", title: "Haloalkanes and Haloarenes" },
    { id: "alcohols-phenols-and-ethers", title: "Alcohols, Phenols and Ethers" },
    { id: "organic-chemistry-some-basic-principles", title: "Organic Chemistry - Some Basic Principles" },
    { id: "aldehydes-ketones-and-carboxylic-acids", title: "Aldehydes, Ketones and Carboxylic Acids" },
    { id: "hydrocarbons", title: "Hydrocarbons" },
    { id: "amines", title: "Amines" },
    { id: "biomolecules", title: "Biomolecules" },
    { id: "environmental-chemistry", title: "Environmental Chemistry" },
    { id: "polymers", title: "Polymers" },
    { id: "chemistry-in-everyday-life", title: "Chemistry in Everyday Life" },
  ],
  inorganic: [
    { id: "classification-of-elements-and-periodicity", title: "Classification of Elements and Periodicity" },
    { id: "chemical-bonding-and-molecular-structure", title: "Chemical Bonding and Molecular Structure" },
    { id: "general-principles-metallurgy", title: "General Principles (Metallurgy)" },
    { id: "the-p-block-elements-class-12", title: "The p-Block Elements (Class 12)" },
    { id: "the-d-and-f-block-elements", title: "The d- and f- Block Elements" },
    { id: "hydrogen", title: "Hydrogen" },
    { id: "coordination-compounds", title: "Coordination Compounds" },
    { id: "the-s-block-elements", title: "The s-Block Elements" },
    { id: "the-p-block-elements-class-11", title: "The p-Block Elements (Class 11)" },
  ],
  algebra: [
    { id: "functions", title: "Functions" },
    { id: "sets", title: "Sets" },
    { id: "relations-and-functions", title: "Relations and Functions" },
    { id: "matrices", title: "Matrices" },
    { id: "principle-of-mathematical-induction", title: "Principle of Mathematical Induction" },
    { id: "determinants", title: "Determinants" },
    { id: "complex-numbers-and-quadratic-equations", title: "Complex Numbers and Quadratic Equations" },
    { id: "linear-inequalities", title: "Linear Inequalities" },
    { id: "permutations-and-combinations", title: "Permutations and Combinations" },
    { id: "binomial-theorem", title: "Binomial Theorem" },
    { id: "sequences-and-series", title: "Sequences and Series" },
    { id: "mathematical-reasoning", title: "Mathematical Reasoning" },
  ],
  calculus: [
    { id: "continuity-and-differentiability", title: "Continuity and Differentiability" },
    { id: "application-of-derivatives", title: "Application of Derivatives" },
    { id: "integrals", title: "Integrals" },
    { id: "application-of-integrals", title: "Application of Integrals" },
    { id: "differential-equations", title: "Differential Equations" },
    { id: "limits-and-derivatives", title: "Limits and Derivatives" },
  ],
  "coordinate-geometry": [
    { id: "vector-algebra", title: "Vector Algebra" },
    { id: "straight-lines", title: "Straight Lines" },
    { id: "three-dimensional-geometry", title: "Three Dimensional Geometry" },
    { id: "conic-sections", title: "Conic Sections" },
    { id: "circle", title: "Circle" },
    { id: "introduction-to-three-dimensional-geometry", title: "Introduction to Three Dimensional Geometry" },
    { id: "parabola", title: "Parabola" },
    { id: "ellipse", title: "Ellipse" },
    { id: "hyperbola", title: "Hyperbola" },
  ],
  trigonometry: [
    { id: "trigonometric-equations", title: "Trigonometric Equations" },
    { id: "inverse-trigonometric-functions", title: "Inverse Trigonometric Functions" },
    { id: "trigonometric-functions", title: "Trigonometric Functions" },
    { id: "properties-of-triangles", title: "Properties of Triangles" },
    { id: "heights-and-distances", title: "Heights and Distances" },
  ],
  statistics: [
    { id: "probability-class-12", title: "Probability (Class 12)" },
    { id: "statistics", title: "Statistics" },
    { id: "probability-class-11", title: "Probability (Class 11)" },
  ],
};

const SUBJECT_LABELS: Record<string, string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  maths: "Mathematics",
};

// --- SUBJECT META (total chapters + divisions count) ---
const SUBJECT_META: Record<string, string> = {
  physics: "5 Divisions · 30 Chapters",
  chemistry: "3 Divisions · 31 Chapters",
  maths: "5 Divisions · 35 Chapters",
};

// --- Dynamic Subject Icon SVGs ---
// Physics: atom / orbital rings — blue-teal
// Chemistry: flask / beaker — green
// Maths: sigma / function — purple

function PhysicsIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={Styles.subjectIconSvg}>
      {/* Nucleus dot */}
      <circle cx="16" cy="16" r="2.5" fill="#60C6FF" />
      {/* Orbital ring 1 — horizontal ellipse */}
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="#60C6FF" strokeWidth="1.6" fill="none" opacity="0.9" />
      {/* Orbital ring 2 — rotated 60deg */}
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="#60C6FF" strokeWidth="1.6" fill="none" opacity="0.6"
        transform="rotate(60 16 16)" />
      {/* Orbital ring 3 — rotated -60deg */}
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="#60C6FF" strokeWidth="1.6" fill="none" opacity="0.35"
        transform="rotate(-60 16 16)" />
    </svg>
  );
}

function ChemistryIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={Styles.subjectIconSvg}>
      {/* Flask body */}
      <path
        d="M12 4 L12 14 L6.5 24 Q5.5 26 7 27.5 Q8 28.5 10 28.5 L22 28.5 Q24 28.5 25 27.5 Q26.5 26 25.5 24 L20 14 L20 4 Z"
        stroke="#4ADE80" strokeWidth="1.7" fill="none" strokeLinejoin="round"
      />
      {/* Liquid inside flask */}
      <path
        d="M9 22 Q10 20.5 16 21 Q22 21.5 23 22 L25.2 26 Q24.5 27.5 22 27.5 L10 27.5 Q7.5 27.5 6.8 26 Z"
        fill="#4ADE80" opacity="0.3"
      />
      {/* Bubbles */}
      <circle cx="14" cy="24.5" r="1" fill="#4ADE80" opacity="0.7" />
      <circle cx="18" cy="23" r="0.7" fill="#4ADE80" opacity="0.5" />
      {/* Flask neck lines */}
      <line x1="12" y1="8" x2="20" y2="8" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MathsIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={Styles.subjectIconSvg}>
      {/* Sigma / Summation symbol */}
      <path
        d="M22 6 L10 6 L17.5 15.5 L10 25 L22 25"
        stroke="#C084FC" strokeWidth="2" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Top bar tick */}
      <line x1="10" y1="6" x2="22" y2="6" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
      {/* Bottom bar tick */}
      <line x1="10" y1="25" x2="22" y2="25" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
      {/* Small decorative plus in corner */}
      <line x1="25" y1="10" x2="25" y2="14" stroke="#C084FC" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      <line x1="23" y1="12" x2="27" y2="12" stroke="#C084FC" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  physics: <PhysicsIcon />,
  chemistry: <ChemistryIcon />,
  maths: <MathsIcon />,
};

const SUBJECT_ICON_CLASS: Record<string, string> = {
  physics: "iconContainerPhysics",
  chemistry: "iconContainerChemistry",
  maths: "iconContainerMaths",
};

export function ChapterWiseQuestionsClient() {
  const router = useRouter();

  const [activeSubject, setActiveSubject] = useState<string>("physics");
  const [activeDivision, setActiveDivision] = useState<string>("mechanics");

  const handleSubjectChange = (newSubject: string) => {
    setActiveSubject(newSubject);
    const primaryDivision = DIVISION_CONFIG[newSubject]?.[0]?.id || "";
    setActiveDivision(primaryDivision);
  };

  const currentDivisions = useMemo(() => DIVISION_CONFIG[activeSubject] || [], [activeSubject]);

  const mappedChapters: TestListItem[] = useMemo(() => {
    const rawChapters = CHAPTER_CONFIG[activeDivision] || [];
    return rawChapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      meta: "Practice Questions",
      href: `/chapter-wise-questions/${activeSubject}/${activeDivision}/${ch.id}`,
    }));
  }, [activeDivision, activeSubject]);

  const activeDivisionTitle =
    currentDivisions.find((d) => d.id === activeDivision)?.title || "Chapters";

  const subjectLabel = SUBJECT_LABELS[activeSubject] || activeSubject;
  const subjectMeta = SUBJECT_META[activeSubject] || "";
  const iconContainerClass = SUBJECT_ICON_CLASS[activeSubject] || "iconContainerPhysics";
  const totalDivisions = currentDivisions.length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://jeearchive.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Chapter-wise Questions",
                item: "https://jeearchive.com/chapter-wise-questions",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `${subjectLabel} - ${activeDivisionTitle}`,
                item: `https://jeearchive.com/chapter-wise-questions/${activeSubject}/${activeDivision}`,
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: mappedChapters.map((chapter, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "LearningResource",
                name: `${chapter.title} - JEE Chapter-wise Practice`,
                url: `https://jeearchive.com${chapter.href}`,
                educationalLevel: "Higher Secondary",
                about: {
                  "@type": "Thing",
                  name: `${subjectLabel} - ${chapter.title}`,
                },
              },
            })),
          }),
        }}
      />

      <main className={Styles.pageContainer} aria-label="Chapter-wise JEE practice questions">
        <div className={Styles.splitLayout}>

          {/* ─── LEFT SIDEBAR ─────────────────────────────────────────── */}
          <aside className={Styles.leftSidebar} aria-label="Subject and division filter">

            {/* HEADER BLOCK — mirrors PYQ exactly */}
            <div className={Styles.headerBlock}>

              {/* Dynamic subject icon container */}
              <div className={`${Styles.graphicIconContainer} ${Styles[iconContainerClass]}`}>
                {SUBJECT_ICONS[activeSubject]}
              </div>

              {/* Title + meta */}
              <div className={Styles.headerTextGroup}>
                <h1 className={Styles.cardTitle}>{subjectLabel}</h1>
                <div className={Styles.metaInfoRow}>
                  <span>JEE Archive</span>
                  <span className={Styles.metaDivider}>•</span>
                  <span>{totalDivisions} Divisions</span>
                  <span className={Styles.metaDivider}>•</span>
                  <span>Chapter-wise</span>
                </div>
              </div>
            </div>

            {/* SUBJECT SEGMENTED CONTROL */}
            <nav className={Styles.segmentedControl} aria-label="Select subject">
              {(["physics", "chemistry", "maths"] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubjectChange(sub)}
                  className={`${Styles.segmentBtn} ${activeSubject === sub ? Styles.segmentActive : ""}`}
                  aria-pressed={activeSubject === sub}
                >
                  {sub === "maths" ? "Math" : sub.charAt(0).toUpperCase() + sub.slice(1)}
                </button>
              ))}
            </nav>

            {/* DIVISIONS LIST */}
            <nav className={Styles.divisionsListContainer} aria-label="Select division">
              <span className={Styles.listLabel}>Divisions</span>
              <div className={Styles.divisionsList}>
                {currentDivisions.map((div) => (
                  <button
                    key={div.id}
                    onClick={() => setActiveDivision(div.id)}
                    className={`${Styles.divisionRowItem} ${activeDivision === div.id ? Styles.divisionRowActive : ""}`}
                    aria-current={activeDivision === div.id ? "true" : undefined}
                  >
                    <span className={Styles.divisionNameText}>{div.title}</span>
                    <span className={Styles.divisionMetaText}>{div.meta}</span>
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* ─── RIGHT CONTENT ─────────────────────────────────────────── */}
          <section className={Styles.rightContent} aria-label={`${activeDivisionTitle} chapters`}>
            <div className={Styles.scrollContentWrapper}>
              <TestListSection
                heading={`${activeDivisionTitle.toUpperCase()} — CHAPTERS`}
                items={mappedChapters}
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}