import TestListSection, { TestListItem } from "@/components/dashboard/TestListSection/TestListSection";
import Styles from '../../chapterWiseQuestions.module.css';

interface DivisionPageProps {
  params: Promise<{ subject: string; division: string }>;
}

const chapterConfig: Record<string, TestListItem[]> = {

  // ---------- PHYSICS ----------
  mechanics: [
    { id: "kinematics", title: "Kinematics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/kinematics" },
    { id: "laws-of-motion", title: "Laws of Motion", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/laws-of-motion" },
    { id: "work-energy-power", title: "Work, Energy & Power", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/work-energy-power" },
    { id: "center-of-mass", title: "Center of Mass & Rotational Motion", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/center-of-mass" },
    { id: "gravitation", title: "Gravitation", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/gravitation" },
    { id: "oscillations-waves", title: "Oscillations & Waves", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/oscillations-waves" },
    { id: "mechanical-properties-of-matter", title: "Mechanical Properties of Matter", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/mechanics/mechanical-properties-of-matter" },
  ],

  thermodynamics: [
    { id: "thermal-properties", title: "Thermal Properties of Matter", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/thermodynamics/thermal-properties" },
    { id: "thermodynamics-laws", title: "Thermodynamics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/thermodynamics/thermodynamics-laws" },
    { id: "kinetic-theory", title: "Kinetic Theory of Gases", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/thermodynamics/kinetic-theory" },
    { id: "thermal-processes", title: "Heat Transfer", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/thermodynamics/thermal-processes" },
  ],

  electromagnetism: [
    { id: "electrostatics", title: "Electrostatics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/electrostatics" },
    { id: "current-electricity", title: "Current Electricity", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/current-electricity" },
    { id: "magnetism", title: "Magnetism & Matter", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/magnetism" },
    { id: "electromagnetic-induction", title: "Electromagnetic Induction", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/electromagnetic-induction" },
    { id: "alternating-current", title: "Alternating Current", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/alternating-current" },
    { id: "em-waves", title: "Electromagnetic Waves", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/electromagnetism/em-waves" },
  ],

  optics: [
    { id: "ray-optics", title: "Ray Optics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/optics/ray-optics" },
    { id: "wave-optics", title: "Wave Optics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/optics/wave-optics" },
  ],

  "modern-physics": [
    { id: "dual-nature", title: "Dual Nature of Matter & Radiation", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/modern-physics/dual-nature" },
    { id: "atoms", title: "Atoms", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/modern-physics/atoms" },
    { id: "nuclei", title: "Nuclei", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/modern-physics/nuclei" },
    { id: "semiconductors", title: "Semiconductor Electronics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/modern-physics/semiconductors" },
  ],

  // ---------- CHEMISTRY ----------
  physical: [
    { id: "mole-concept", title: "Mole Concept", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/mole-concept" },
    { id: "thermodynamics-chem", title: "Chemical Thermodynamics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/thermodynamics-chem" },
    { id: "equilibrium", title: "Equilibrium", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/equilibrium" },
    { id: "electrochemistry", title: "Electrochemistry", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/electrochemistry" },
    { id: "chemical-kinetics", title: "Chemical Kinetics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/chemical-kinetics" },
    { id: "solutions", title: "Solutions", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/solutions" },
    { id: "solid-state", title: "Solid State", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/physical/solid-state" },
  ],

  organic: [
    { id: "goc", title: "General Organic Chemistry", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/goc" },
    { id: "hydrocarbons", title: "Hydrocarbons", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/hydrocarbons" },
    { id: "alkyl-halides", title: "Haloalkanes & Haloarenes", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/alkyl-halides" },
    { id: "alcohols", title: "Alcohols, Phenols & Ethers", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/alcohols" },
    { id: "carbonyl", title: "Aldehydes, Ketones & Carboxylic Acids", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/carbonyl" },
    { id: "amines", title: "Amines", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/amines" },
    { id: "biomolecules", title: "Biomolecules", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/organic/biomolecules" },
  ],

  inorganic: [
    { id: "periodic-table", title: "Periodic Table", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/periodic-table" },
    { id: "chemical-bonding", title: "Chemical Bonding", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/chemical-bonding" },
    { id: "coordination-compounds", title: "Coordination Compounds", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/coordination-compounds" },
    { id: "p-block", title: "p-Block Elements", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/p-block" },
    { id: "d-f-block", title: "d- & f-Block Elements", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/inorganic/d-f-block" },
  ],

  // ---------- MATHEMATICS ----------
  algebra: [
    { id: "sets-relations", title: "Sets, Relations & Functions", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/sets-relations" },
    { id: "complex-numbers", title: "Complex Numbers", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/complex-numbers" },
    { id: "quadratic", title: "Quadratic Equations", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/quadratic" },
    { id: "sequence-series", title: "Sequences & Series", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/sequence-series" },
    { id: "permutations", title: "Permutations & Combinations", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/permutations" },
    { id: "binomial", title: "Binomial Theorem", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/binomial" },
    { id: "matrices", title: "Matrices & Determinants", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/algebra/matrices" },
  ],

  calculus: [
    { id: "limits", title: "Limits & Continuity", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/limits" },
    { id: "derivatives", title: "Differentiation", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/derivatives" },
    { id: "applications", title: "Applications of Derivatives", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/applications" },
    { id: "integrals", title: "Integration", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/integrals" },
    { id: "differential-equations", title: "Differential Equations", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/calculus/differential-equations" },
  ],

  "coordinate-geometry": [
    { id: "straight-lines", title: "Straight Lines", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/coordinate-geometry/straight-lines" },
    { id: "circle", title: "Circle", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/coordinate-geometry/circle" },
    { id: "parabola", title: "Parabola", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/coordinate-geometry/parabola" },
    { id: "ellipse", title: "Ellipse", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/coordinate-geometry/ellipse" },
    { id: "hyperbola", title: "Hyperbola", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/coordinate-geometry/hyperbola" },
  ],

  trigonometry: [
    { id: "trig-identities", title: "Trigonometric Identities", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/trigonometry/trig-identities" },
    { id: "trig-equations", title: "Trigonometric Equations", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/trigonometry/trig-equations" },
    { id: "heights-distances", title: "Heights & Distances", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/trigonometry/heights-distances" },
  ],

  statistics: [
    { id: "statistics", title: "Statistics", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/statistics/statistics" },
    { id: "probability", title: "Probability", meta: "Practice Questions", href: "/chapter-wise-questions/:subject/statistics/probability" },
  ],
};



export default async function DivisionPage(props: DivisionPageProps) {
  const { subject, division } = await props.params;   // ⭐ same pattern

  const items = chapterConfig[division];

  if (!items) {
    return <div>No chapters found for {subject} → {division}</div>;
  }

  const heading = `${division.toUpperCase()} — Chapters`;

  return <div className={Styles.chapterWiseQuestions}>
    <TestListSection heading={heading} items={items} />
  </div>;
}
