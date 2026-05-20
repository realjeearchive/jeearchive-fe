'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TestListSection, { TestListItem } from "@/components/dashboard/TestListSection/TestListSection";
import Styles from './chapterWiseQuestions.module.css';

// --- CONFIGURATIONS ---
const DIVISION_CONFIG: Record<string, { id: string; title: string; meta: string }[]> = {
  physics: [
    { id: "mechanics", title: "Mechanics", meta: "8 Chapters" },
    { id: "thermodynamics", title: "Thermodynamics", meta: "3 Chapters" },
    { id: "electromagnetism", title: "Electromagnetism", meta: "7 Chapters" },
    { id: "optics", title: "Optics", meta: "2 Chapters" },
    { id: "modern-physics", title: "Modern Physics", meta: "4 Chapters" },
  ],
  chemistry: [
    { id: "physical", title: "Physical Chemistry", meta: "11 Chapters" },
    { id: "organic", title: "Organic Chemistry", meta: "10 Chapters" },
    { id: "inorganic", title: "Inorganic Chemistry", meta: "9 Chapters" },
  ],
  maths: [
    { id: "algebra", title: "Algebra", meta: "11 Chapters" },
    { id: "calculus", title: "Calculus", meta: "6 Chapters" },
    { id: "coordinate-geometry", title: "Coordinate Geometry", meta: "5 Chapters" },
    { id: "trigonometry", title: "Trigonometry", meta: "2 Chapters" },
    { id: "statistics", title: "Statistics & Probability", meta: "3 Chapters" },
  ],
};

const CHAPTER_CONFIG: Record<string, { id: string; title: string }[]> = {
  mechanics: [
    { id: "motion-in-a-straight-line", title: "Motion in a Straight Line" },
    { id: "motion-in-a-plane", title: "Motion in a Plane" },
    { id: "laws-of-motion", title: "Laws of Motion" },
    { id: "work-energy-and-power", title: "Work, Energy and Power" },
    { id: "system-of-particles-and-rotational-motion", title: "System of Particles and Rotational Motion" },
    { id: "gravitation", title: "Gravitation" },
    { id: "oscillations", title: "Oscillations" },
    { id: "waves", title: "Waves" },
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
    { id: "surface-chemistry", title: "Surface Chemistry" },
    { id: "states-of-matter", title: "States of Matter (Gases & Liquids)" },
    { id: "thermodynamics", title: "Thermodynamics" },
    { id: "equilibrium", title: "Equilibrium" },
    { id: "redox-reactions", title: "Redox Reactions" },
  ],
  organic: [
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
    { id: "coordination-compounds", title: "Coordination Compounds" },
    { id: "hydrogen", title: "Hydrogen" },
    { id: "the-s-block-elements", title: "The s-Block Elements" },
    { id: "the-p-block-elements-class-11", title: "The p-Block Elements (Class 11)" },
  ],
  algebra: [
    { id: "sets", title: "Sets" },
    { id: "relations-and-functions", title: "Relations and Functions" },
    { id: "matrices", title: "Matrices" },
    { id: "mathematical-induction", title: "Principle of Mathematical Induction" },
    { id: "determinants", title: "Determinants" },
    { id: "complex-numbers-quadratic-equations", title: "Complex Numbers and Quadratic Equations" },
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
    { id: "straight-lines", title: "Straight Lines" },
    { id: "vector-algebra", title: "Vector Algebra" },
    { id: "conic-sections", title: "Conic Sections" },
    { id: "three-dimensional-geometry", title: "Three Dimensional Geometry" },
    { id: "introduction-to-three-dimensional-geometry", title: "Introduction to Three Dimensional Geometry" },
  ],
  trigonometry: [
    { id: "inverse-trigonometric-functions", title: "Inverse Trigonometric Functions" },
    { id: "trigonometric-functions", title: "Trigonometric Functions" },
  ],
  statistics: [
    { id: "probability-class-12", title: "Probability (Class 12)" },
    { id: "statistics", title: "Statistics" },
    { id: "probability-class-11", title: "Probability (Class 11)" },
  ],
};

export default function UnifiedChapterWiseQuestions() {
  const router = useRouter();

  // --- STATE ---
  const [activeSubject, setActiveSubject] = useState<string>("physics");
  const [activeDivision, setActiveDivision] = useState<string>("mechanics");

  // --- 🔥 THE FIX: Handle both state updates atomically on click, removing useEffect ---
  const handleSubjectChange = (newSubject: string) => {
    setActiveSubject(newSubject);
    const primaryDivision = DIVISION_CONFIG[newSubject]?.[0]?.id || "";
    setActiveDivision(primaryDivision);
  };

  // --- DERIVED DATA ---
  const currentDivisions = useMemo(() => DIVISION_CONFIG[activeSubject] || [], [activeSubject]);
  
  // Format the raw chapter data into TestListItems for the right pane
  const mappedChapters: TestListItem[] = useMemo(() => {
    const rawChapters = CHAPTER_CONFIG[activeDivision] || [];
    return rawChapters.map(ch => ({
      id: ch.id,
      title: ch.title,
      meta: "Practice Questions", 
      href: `/chapter-wise-questions/${activeSubject}/${activeDivision}/${ch.id}`
    }));
  }, [activeDivision, activeSubject]);

  const activeDivisionTitle = currentDivisions.find(d => d.id === activeDivision)?.title || "Chapters";

  return (
    <div className={Styles.pageContainer}>
      <div className={Styles.splitLayout}>
        
        {/* LEFT SIDEBAR: Subject Tabs & Divisions */}
        <aside className={Styles.leftSidebar}>
          <div className={Styles.cardHeader}>
            <div className={Styles.iconSquare}>C</div>
            <div>
              <h1 className={Styles.cardTitle}>Chapter-wise</h1>
              <p className={Styles.cardSubtitle}>JEE Archive • Syllabus</p>
            </div>
          </div>

          {/* Subject Tabs */}
          <div className={Styles.subjectTabs}>
            {(["physics", "chemistry", "maths"] as const).map((sub) => (
              <button
                key={sub}
                // 🔥 THE FIX: Call our new atomic handler instead of just setActiveSubject
                onClick={() => handleSubjectChange(sub)}
                className={`${Styles.subjectBtn} ${activeSubject === sub ? Styles.subjectBtnActive : ''}`}
              >
                {sub === "maths" ? "Math" : sub}
              </button>
            ))}
          </div>

          {/* Divisions List */}
          <div className={Styles.divisionsListContainer}>
            <span className={Styles.listLabel}>Divisions</span>
            <div className={Styles.divisionsList}>
              {currentDivisions.map((div) => (
                <button
                  key={div.id}
                  onClick={() => setActiveDivision(div.id)}
                  className={`${Styles.divisionRowItem} ${activeDivision === div.id ? Styles.divisionRowActive : ''}`}
                >
                  <span className={Styles.divisionNameText}>{div.title}</span>
                  <span className={Styles.divisionMetaText}>{div.meta}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT: Renders exactly like your old [division]/page.tsx did! */}
        <main className={Styles.rightContent}>
          <div className={Styles.scrollContentWrapper}>
            <TestListSection 
              heading={`${activeDivisionTitle.toUpperCase()} — CHAPTERS`} 
              items={mappedChapters} 
            />
          </div>
        </main>

      </div>
    </div>
  );
}