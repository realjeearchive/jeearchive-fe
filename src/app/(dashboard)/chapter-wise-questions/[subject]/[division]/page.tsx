import TestListSection, { TestListItem } from "@/components/dashboard/TestListSection/TestListSection";
import Styles from '../../chapterWiseQuestions.module.css';

interface DivisionPageProps {
  params: Promise<{ subject: string; division: string }>;
}

// Keep your config exactly as is, with the ':subject' placeholder
const chapterConfig: Record<string, TestListItem[]> = {

  // ---------- PHYSICS ----------
mechanics: [
    { id: "motion-in-a-straight-line", title: "Motion in a Straight Line", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/motion-in-a-straight-line" },
    { id: "motion-in-a-plane", title: "Motion in a Plane", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/motion-in-a-plane" },
    { id: "laws-of-motion", title: "Laws of Motion", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/laws-of-motion" },
    { id: "work-energy-and-power", title: "Work, Energy and Power", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/work-energy-and-power" },
    { id: "system-of-particles-and-rotational-motion", title: "System of Particles and Rotational Motion", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/system-of-particles-and-rotational-motion" },
    { id: "gravitation", title: "Gravitation", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/gravitation" },
    { id: "oscillations", title: "Oscillations", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/oscillations" },
    { id: "waves", title: "Waves", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/waves" },
  ],

thermodynamics: [
    { id: "thermal-properties-of-matter", title: "Thermal Properties of Matter", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/thermodynamics/thermal-properties-of-matter" },
    { id: "thermodynamics-physics", title: "Thermodynamics (Physics)", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/thermodynamics/thermodynamics-physics" },
    { id: "kinetic-theory", title: "Kinetic Theory", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/thermodynamics/kinetic-theory" },
  ],

electromagnetism: [
    { id: "electric-charges-and-fields", title: "Electric Charges and Fields", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/electric-charges-and-fields" },
    { id: "electrostatic-potential-and-capacitance", title: "Electrostatic Potential and Capacitance", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/electrostatic-potential-and-capacitance" },
    { id: "current-electricity", title: "Current Electricity", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/current-electricity" },
    { id: "moving-charges-and-magnetism", title: "Moving Charges and Magnetism", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/moving-charges-and-magnetism" },
    { id: "magnetism-and-matter", title: "Magnetism and Matter", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/magnetism-and-matter" },
    { id: "electromagnetic-induction", title: "Electromagnetic Induction", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/electromagnetic-induction" },
    { id: "alternating-current", title: "Alternating Current", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/alternating-current" },
  ],

optics: [
    { id: "ray-optics-and-optical-instruments", title: "Ray Optics and Optical Instruments", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/optics/ray-optics-and-optical-instruments" },
    { id: "wave-optics", title: "Wave Optics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/optics/wave-optics" },
  ],

"modern-physics": [
    { id: "dual-nature-of-radiation-and-matter", title: "Dual Nature of Radiation and Matter", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/modern-physics/dual-nature-of-radiation-and-matter" },
    { id: "atoms", title: "Atoms", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/modern-physics/atoms" },
    { id: "nuclei", title: "Nuclei", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/modern-physics/nuclei" },
    { id: "semiconductor-electronics", title: "Semiconductor Electronics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/modern-physics/semiconductor-electronics" },
  ],

  // ---------- CHEMISTRY ----------
physical: [
    { id: "the-solid-state", title: "The Solid State", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/the-solid-state" },
    { id: "some-basic-concepts-of-chemistry", title: "Some Basic Concepts of Chemistry", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/some-basic-concepts-of-chemistry" },
    { id: "solutions", title: "Solutions", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/solutions" },
    { id: "structure-of-atom", title: "Structure of Atom", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/structure-of-atom" },
    { id: "electrochemistry", title: "Electrochemistry", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/electrochemistry" },
    { id: "chemical-kinetics", title: "Chemical Kinetics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/chemical-kinetics" },
    { id: "surface-chemistry", title: "Surface Chemistry", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/surface-chemistry" },
    { id: "states-of-matter", title: "States of Matter (Gases & Liquids)", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/states-of-matter" },
    { id: "thermodynamics", title: "Thermodynamics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/thermodynamics" },
    { id: "equilibrium", title: "Equilibrium", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/equilibrium" },
    { id: "redox-reactions", title: "Redox Reactions", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/redox-reactions" },
  ],

organic: [
    { id: "haloalkanes-and-haloarenes", title: "Haloalkanes and Haloarenes", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/haloalkanes-and-haloarenes" },
    { id: "alcohols-phenols-and-ethers", title: "Alcohols, Phenols and Ethers", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/alcohols-phenols-and-ethers" },
    { id: "organic-chemistry-some-basic-principles", title: "Organic Chemistry - Some Basic Principles", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/organic-chemistry-some-basic-principles" },
    { id: "aldehydes-ketones-and-carboxylic-acids", title: "Aldehydes, Ketones and Carboxylic Acids", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/aldehydes-ketones-and-carboxylic-acids" },
    { id: "hydrocarbons", title: "Hydrocarbons", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/hydrocarbons" },
    { id: "amines", title: "Amines", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/amines" },
    { id: "biomolecules", title: "Biomolecules", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/biomolecules" },
    { id: "environmental-chemistry", title: "Environmental Chemistry", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/environmental-chemistry" },
    { id: "polymers", title: "Polymers", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/polymers" },
    { id: "chemistry-in-everyday-life", title: "Chemistry in Everyday Life", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/chemistry-in-everyday-life" },
  ],

inorganic: [
    { id: "classification-of-elements-and-periodicity", title: "Classification of Elements and Periodicity", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/classification-of-elements-and-periodicity" },
    { id: "chemical-bonding-and-molecular-structure", title: "Chemical Bonding and Molecular Structure", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/chemical-bonding-and-molecular-structure" },
    { id: "general-principles-metallurgy", title: "General Principles (Metallurgy)", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/general-principles-metallurgy" },
    { id: "the-p-block-elements-class-12", title: "The p-Block Elements (Class 12)", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/the-p-block-elements-class-12" },
    { id: "the-d-and-f-block-elements", title: "The d- and f- Block Elements", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/the-d-and-f-block-elements" },
    { id: "coordination-compounds", title: "Coordination Compounds", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/coordination-compounds" },
    { id: "hydrogen", title: "Hydrogen", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/hydrogen" },
    { id: "the-s-block-elements", title: "The s-Block Elements", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/the-s-block-elements" },
    { id: "the-p-block-elements-class-11", title: "The p-Block Elements (Class 11)", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/the-p-block-elements-class-11" },
  ],

  // ---------- MATHEMATICS ----------
algebra: [
    { id: "sets", title: "Sets", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/sets" },
    { id: "relations-and-functions", title: "Relations and Functions", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/relations-and-functions" },
    { id: "matrices", title: "Matrices", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/matrices" },
    { id: "mathematical-induction", title: "Principle of Mathematical Induction", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/mathematical-induction" },
    { id: "determinants", title: "Determinants", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/determinants" },
    { id: "complex-numbers-quadratic-equations", title: "Complex Numbers and Quadratic Equations", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/complex-numbers-quadratic-equations" },
    { id: "linear-inequalities", title: "Linear Inequalities", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/linear-inequalities" },
    { id: "permutations-and-combinations", title: "Permutations and Combinations", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/permutations-and-combinations" },
    { id: "binomial-theorem", title: "Binomial Theorem", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/binomial-theorem" },
    { id: "sequences-and-series", title: "Sequences and Series", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/sequences-and-series" },
    { id: "mathematical-reasoning", title: "Mathematical Reasoning", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/mathematical-reasoning" },
  ],

calculus: [
    { id: "continuity-and-differentiability", title: "Continuity and Differentiability", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/continuity-and-differentiability" },
    { id: "application-of-derivatives", title: "Application of Derivatives", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/application-of-derivatives" },
    { id: "integrals", title: "Integrals", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/integrals" },
    { id: "application-of-integrals", title: "Application of Integrals", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/application-of-integrals" },
    { id: "differential-equations", title: "Differential Equations", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/differential-equations" },
    { id: "limits-and-derivatives", title: "Limits and Derivatives", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/limits-and-derivatives" },
  ],

"coordinate-geometry": [
    { id: "straight-lines", title: "Straight Lines", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/coordinate-geometry/straight-lines" },
    { id: "vector-algebra", title: "Vector Algebra", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/coordinate-geometry/vector-algebra" },
    { id: "conic-sections", title: "Conic Sections", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/coordinate-geometry/conic-sections" },
    { id: "three-dimensional-geometry", title: "Three Dimensional Geometry", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/coordinate-geometry/three-dimensional-geometry" },
    { id: "introduction-to-three-dimensional-geometry", title: "Introduction to Three Dimensional Geometry", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/coordinate-geometry/introduction-to-three-dimensional-geometry" },
  ],

 trigonometry: [
    { id: "inverse-trigonometric-functions", title: "Inverse Trigonometric Functions", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/trigonometry/inverse-trigonometric-functions" },
    { id: "trigonometric-functions", title: "Trigonometric Functions", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/trigonometry/trigonometric-functions" },
  ],

statistics: [
    { id: "probability-class-12", title: "Probability (Class 12)", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/statistics/probability-class-12" },
    { id: "statistics", title: "Statistics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/statistics/statistics" },
    { id: "probability-class-11", title: "Probability (Class 11)", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/statistics/probability-class-11" },
  ],
};

export default async function DivisionPage(props: DivisionPageProps) {
  const { subject, division } = await props.params;

  const rawItems = chapterConfig[division];

  if (!rawItems) {
    return <div>No chapters found for {subject} → {division}</div>;
  }

  // --- 🔥 THE FIX IS HERE 🔥 ---
  // We map over the items and replace ":subject" with the actual subject from params (e.g. "physics")
  const items = rawItems.map(item => ({
    ...item,
    href: item.href.replace(":subject", subject)
  }));

  const heading = `${division.toUpperCase()} — Chapters`;

  return <div className={Styles.chapterWiseQuestions}>
    <TestListSection heading={heading} items={items} />
  </div>;
}