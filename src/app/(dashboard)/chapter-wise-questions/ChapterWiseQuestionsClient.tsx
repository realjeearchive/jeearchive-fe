"use client";

import React, { useState, useMemo, useEffect } from "react";
// Removed useSearchParams entirely as we are moving to a more robust storage method
import TestListSection, {
  TestListItem,
} from "@/components/dashboard/TestListSection/TestListSection";
import Styles from "./chapterWiseQuestions.module.css";

// --- CONFIGURATIONS ---
const DIVISION_CONFIG: Record<string, { id: string; title: string; meta: string }[]> = {
  physics: [
    { id: "mechanics", title: "Mechanics", meta: "15 Chapters" },
    { id: "electricity", title: "Electricity", meta: "9 Chapters" },
    { id: "optics", title: "Optics", meta: "2 Chapters" },
    { id: "modern-physics", title: "Modern Physics", meta: "4 Chapters" },
  ],
  chemistry: [
    { id: "physical-chemistry", title: "Physical Chemistry", meta: "12 Chapters" },
    { id: "organic-chemistry", title: "Organic Chemistry", meta: "10 Chapters" },
    { id: "inorganic-chemistry", title: "Inorganic Chemistry", meta: "10 Chapters" },
  ],
  maths: [
    { id: "algebra", title: "Algebra", meta: "14 Chapters" },
    { id: "calculus", title: "Calculus", meta: "8 Chapters" },
    { id: "coordinate-geometry", title: "Coordinate Geometry", meta: "5 Chapters" },
    { id: "trigonometry", title: "Trigonometry", meta: "5 Chapters" },
    { id: "statistics", title: "Statistics & Probability", meta: "1 Chapter" },
  ],
};

const CHAPTER_CONFIG: Record<string, { id: string; title: string }[]> = {
  // --- PHYSICS ---
  mechanics: [
    { id: "units-and-measurements", title: "Units and Measurements" },
    { id: "motion-in-a-straight-line", title: "Motion in a Straight Line" },
    { id: "motion", title: "Motion" },
    { id: "circular-motion", title: "Circular Motion" },
    { id: "motion-in-a-plane", title: "Motion in a Plane" },
    { id: "laws-of-motion", title: "Laws of Motion" },
    { id: "impulse-and-momentum", title: "Impulse and Momentum" },
    { id: "work-power-and-energy", title: "Work, Power and Energy" },
    { id: "center-of-mass", title: "Center of Mass" },
    { id: "rotational-motion", title: "Rotational Motion" },
    { id: "Gravitation", title: "Gravitation" },
    { id: "properties-of-matter", title: "Properties of Matter" },
    { id: "heat-and-thermodynamics", title: "Heat and Thermodynamics" },
    { id: "simple-harmonic-motion", title: "Simple Harmonic Motion" },
    { id: "Waves", title: "Waves" },
  ],
  electricity: [
    { id: "electrostatics", title: "Electrostatics" },
    { id: "capacitor", title: "Capacitor" },
    { id: "current-electricity", title: "Current Electricity" },
    { id: "magnetics", title: "Magnetics" },
    { id: "magnetism", title: "Magnetism" },
    { id: "magnetic-properties-of-matter", title: "Magnetic Properties of Matter" },
    { id: "electromagnetic-induction", title: "Electromagnetic Induction" },
    { id: "alternating-current", title: "Alternating Current" },
    { id: "electromagnetic-waves", title: "Electromagnetic Waves" },
  ],
  optics: [
    { id: "geometrical-optics", title: "Geometrical Optics" },
    { id: "wave-optics", title: "Wave Optics" },
  ],
  "modern-physics": [
    { id: "dual-nature-of-radiation", title: "Dual Nature of Radiation" },
    { id: "atoms-and-nuclei", title: "Atoms and Nuclei" },
    { id: "electronic-devices", title: "Electronic Devices" },
    { id: "communication-systems", title: "Communication Systems" },
  ],

  // --- CHEMISTRY ---
  "physical-chemistry": [
    { id: "solid-state", title: "Solid State" },
    { id: "gaseous-state", title: "Gaseous State" },
    { id: "surface-chemistry", title: "Surface Chemistry" },
    { id: "Solutions", title: "Solutions" },
    { id: "some-basic-concepts-of-chemistry", title: "Some Basic Concepts of Chemistry" },
    { id: "structure-of-atom", title: "Structure of Atom" },
    { id: "Electrochemistry", title: "Electrochemistry" },
    { id: "chemical-kinetics-and-nuclear-chemistry", title: "Chemical Kinetics and Nuclear Chemistry" },
    { id: "Thermodynamics", title: "Thermodynamics" },
    { id: "chemical-equilibrium", title: "Chemical Equilibrium" },
    { id: "ionic-equilibrium", title: "Ionic Equilibrium" },
    { id: "redox-reactions", title: "Redox Reactions" },
  ],
  "organic-chemistry": [
    { id: "chemistry-in-everyday-life", title: "Chemistry in Everyday Life" },
    { id: "Polymers", title: "Polymers" },
    { id: "practical-organic-chemistry", title: "Practical Organic Chemistry" },
    { id: "haloalkanes-and-haloarenes", title: "Haloalkanes and Haloarenes" },
    { id: "alcohols-phenols-and-ethers", title: "Alcohols, Phenols and Ethers" },
    { id: "aldehydes-ketones-and-carboxylic-acids", title: "Aldehydes, Ketones and Carboxylic Acids" },
    { id: "basics-of-organic-chemistry", title: "Basics of Organic Chemistry" },
    { id: "Hydrocarbons", title: "Hydrocarbons" },
    { id: "compounds-containing-nitrogen", title: "Compounds Containing Nitrogen" },
    { id: "Biomolecules", title: "Biomolecules" },
  ],
  "inorganic-chemistry": [
    { id: "salt-analysis", title: "Salt Analysis" },
    { id: "environmental-chemistry", title: "Environmental Chemistry" },
    { id: "p-block-elements", title: "P-Block Elements" },
    { id: "isolation-of-elements", title: "Isolation of Elements" },
    { id: "s-block-elements", title: "S-Block Elements" },
    { id: "Hydrogen", title: "Hydrogen" },
    { id: "periodic-table-and-periodicity", title: "Periodic Table and Periodicity" },
    { id: "d-and-f-block-elements", title: "D and F-Block Elements" },
    { id: "chemical-bonding-and-molecular-structure", title: "Chemical Bonding and Molecular Structure" },
    { id: "coordination-compounds", title: "Coordination Compounds" },
  ],

  // --- MATHEMATICS ---
  algebra: [
    { id: "logarithm", title: "Logarithm" },
    { id: "Functions", title: "Functions" },
    { id: "sets-and-relations", title: "Sets and Relations" },
    { id: "matrices-and-determinants", title: "Matrices and Determinants" },
    { id: "quadratic-equation-and-inequalities", title: "Quadratic Equation and Inequalities" },
    { id: "complex-numbers", title: "Complex Numbers" },
    { id: "permutations-and-combinations", title: "Permutations and Combinations" },
    { id: "binomial-theorem", title: "Binomial Theorem" },
    { id: "mathematical-induction-and-binomial-theorem", title: "Mathematical Induction and Binomial Theorem" },
    { id: "sequences-and-series", title: "Sequences and Series" },
    { id: "vector-algebra", title: "Vector Algebra" },
    { id: "3d-geometry", title: "3D Geometry" },
    { id: "probability", title: "Probability" },
    { id: "mathematical-reasoning", title: "Mathematical Reasoning" },
  ],
  calculus: [
    { id: "differentiation", title: "Differentiation" },
    { id: "limits-continuity-and-differentiability", title: "Limits, Continuity and Differentiability" },
    { id: "application-of-derivatives", title: "Application of Derivatives" },
    { id: "indefinite-integrals", title: "Indefinite Integrals" },
    { id: "definite-integration", title: "Definite Integration" },
    { id: "area-under-the-curves", title: "Area Under the Curves" },
    { id: "application-of-integration", title: "Application of Integration" },
    { id: "differential-equations", title: "Differential Equations" },
  ],
  "coordinate-geometry": [
    { id: "straight-lines-and-pair-of-straight-lines", title: "Straight Lines and Pair of Straight Lines" },
    { id: "Hyperbola", title: "Hyperbola" },
    { id: "Ellipse", title: "Ellipse" },
    { id: "Parabola", title: "Parabola" },
    { id: "Circle", title: "Circle" },
  ],
  trigonometry: [
    { id: "inverse-trigonometric-functions", title: "Inverse Trigonometric Functions" },
    { id: "trigonometric-functions-and-equations", title: "Trigonometric Functions and Equations" },
    { id: "properties-of-triangle", title: "Properties of Triangle" },
    { id: "trigonometric-ratio-and-identites", title: "Trigonometric Ratios and Identities" },
    { id: "height-and-distance", title: "Height and Distance" },
  ],
  statistics: [
    { id: "Statistics", title: "Statistics" },
  ],
};

const SUBJECT_LABELS: Record<string, string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  maths: "Mathematics",
};

const SUBJECT_META: Record<string, string> = {
  physics: "4 Divisions · 30 Chapters",
  chemistry: "3 Divisions · 32 Chapters",
  maths: "5 Divisions · 33 Chapters",
};

// --- Dynamic Subject Icon SVGs ---
function PhysicsIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={Styles.subjectIconSvg}>
      <circle cx="16" cy="16" r="2.5" fill="#60C6FF" />
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="#60C6FF" strokeWidth="1.6" fill="none" opacity="0.9" />
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="#60C6FF" strokeWidth="1.6" fill="none" opacity="0.6" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="#60C6FF" strokeWidth="1.6" fill="none" opacity="0.35" transform="rotate(-60 16 16)" />
    </svg>
  );
}

function ChemistryIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={Styles.subjectIconSvg}>
      <path d="M12 4 L12 14 L6.5 24 Q5.5 26 7 27.5 Q8 28.5 10 28.5 L22 28.5 Q24 28.5 25 27.5 Q26.5 26 25.5 24 L20 14 L20 4 Z" stroke="#4ADE80" strokeWidth="1.7" fill="none" strokeLinejoin="round" />
      <path d="M9 22 Q10 20.5 16 21 Q22 21.5 23 22 L25.2 26 Q24.5 27.5 22 27.5 L10 27.5 Q7.5 27.5 6.8 26 Z" fill="#4ADE80" opacity="0.3" />
      <circle cx="14" cy="24.5" r="1" fill="#4ADE80" opacity="0.7" />
      <circle cx="18" cy="23" r="0.7" fill="#4ADE80" opacity="0.5" />
      <line x1="12" y1="8" x2="20" y2="8" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MathsIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={Styles.subjectIconSvg}>
      <path d="M22 6 L10 6 L17.5 15.5 L10 25 L22 25" stroke="#C084FC" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10" y1="6" x2="22" y2="6" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="25" x2="22" y2="25" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
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
  const [activeSubject, setActiveSubject] = useState<string>("physics");
  const [activeDivision, setActiveDivision] = useState<string>("mechanics");

  // 🔥 THE FIX: Use SessionStorage to save the exact state and restore it upon Back navigation
  useEffect(() => {
    const restoreState = () => {
      const savedSub = sessionStorage.getItem("cw_active_subject");
      const savedDiv = sessionStorage.getItem("cw_active_division");

      if (savedSub && DIVISION_CONFIG[savedSub]) {
        setActiveSubject(savedSub);
        if (savedDiv && DIVISION_CONFIG[savedSub].find((d) => d.id === savedDiv)) {
          setActiveDivision(savedDiv);
        } else {
          setActiveDivision(DIVISION_CONFIG[savedSub][0].id);
        }
      }
    };

    // Run on initial mount
    restoreState();

    // Run if the page is restored from the browser's Back-Forward Cache
    window.addEventListener("pageshow", restoreState);
    return () => window.removeEventListener("pageshow", restoreState);
  }, []);

  const handleSubjectChange = (newSubject: string) => {
    const primaryDivision = DIVISION_CONFIG[newSubject]?.[0]?.id || "";
    
    setActiveSubject(newSubject);
    setActiveDivision(primaryDivision);
    
    // Save state instantly
    sessionStorage.setItem("cw_active_subject", newSubject);
    sessionStorage.setItem("cw_active_division", primaryDivision);
  };

  const handleDivisionChange = (divId: string) => {
    setActiveDivision(divId);
    
    // Save state instantly
    sessionStorage.setItem("cw_active_division", divId);
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

            <div className={Styles.headerBlock}>
              <div className={`${Styles.graphicIconContainer} ${Styles[iconContainerClass]}`}>
                {SUBJECT_ICONS[activeSubject]}
              </div>

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

            <nav className={Styles.divisionsListContainer} aria-label="Select division">
              <span className={Styles.listLabel}>Divisions</span>
              
              <div className={Styles.divisionsGrid}>
                {currentDivisions.map((div) => (
                  <button
                    key={div.id}
                    onClick={() => handleDivisionChange(div.id)} 
                    className={`${Styles.divisionTabBtn} ${activeDivision === div.id ? Styles.divisionTabActive : ""}`}
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