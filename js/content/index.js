// Course registry. Each course has parts; each module belongs to one course and one part.
// Module ids must be unique across all courses. See CONTENT.md for the module format.

import c01 from './calculus/01-functions.js';
import c02 from './calculus/02-limits.js';
import c03 from './calculus/03-derivatives.js';
import c04 from './calculus/04-derivative-apps.js';
import c05 from './calculus/05-antiderivatives.js';
import c06 from './calculus/06-definite-integral.js';
import c07 from './calculus/07-ftc.js';
import c08 from './calculus/08-substitution.js';
import c09 from './calculus/09-volumes.js';
import c10 from './calculus/10-arclength.js';
import c11 from './calculus/11-numerical.js';
import c12 from './calculus/12-parts.js';
import c13 from './calculus/13-inverse-sub.js';
import c14 from './calculus/14-improper.js';
import c15 from './calculus/15-ode-first.js';
import c16 from './calculus/16-ode-models.js';
import c17 from './calculus/17-ode-second.js';
import c18 from './calculus/18-sequences.js';
import c19 from './calculus/19-series.js';
import c20 from './calculus/20-alternating.js';
import c21 from './calculus/21-power-series.js';
import c22 from './calculus/22-taylor.js';
import ee01 from './ee/01-ee-intro.js';

export const COURSES = [
  {
    id: 'calculus',
    title: 'Calculus',
    subtitle: 'Differential & integral calculus, ODEs and series',
    description: 'From limits and derivatives to integration techniques, differential equations and Taylor series — taught with live graphs first, then written the way the course wants it: in the MATLAB Live Editor.',
    tutorScope: 'calculus from basics to the level of the course MATH.APP.160 (integration and its applications, integration techniques, improper integrals, first and second order ODEs, sequences, series, power and Taylor series)',
  },
  {
    id: 'ee',
    title: 'Electrical Engineering',
    subtitle: 'Circuits, transients and AC analysis',
    description: 'Circuit laws, resistive networks, RC/RL/RLC transients and sinusoidal steady state with phasors — built on the calculus and ODE modules, with MATLAB for every computation. Assignments for this course are being added.',
    tutorScope: 'introductory electrical engineering (circuit laws, resistive networks, capacitors and inductors, first and second order transients, phasors and AC power), using calculus, complex numbers and MATLAB',
  },
];

export const PARTS = [
  { course: 'calculus', id: 'foundations', title: 'Foundations', desc: 'The prerequisites: functions, limits and derivatives.', hw: '' },
  { course: 'calculus', id: 'integration', title: 'Integration', desc: 'Antiderivatives, the definite integral, the Fundamental Theorem and substitution.', hw: 'HW0' },
  { course: 'calculus', id: 'applications', title: 'Applications & numerical integration', desc: 'Volumes, arc length, displacement and numerical rules with error bounds.', hw: 'HW1' },
  { course: 'calculus', id: 'techniques', title: 'Integration techniques', desc: 'Integration by parts, inverse substitutions, partial fractions and improper integrals.', hw: 'HW2' },
  { course: 'calculus', id: 'odes', title: 'Differential equations', desc: 'Slope fields, separable and linear equations, models, and second-order linear ODEs.', hw: 'HW3–HW4' },
  { course: 'calculus', id: 'series', title: 'Sequences & series', desc: 'Convergence of sequences and series, power series and Taylor polynomials.', hw: 'HW5–HW6' },
  { course: 'ee', id: 'ee-dc', title: 'DC circuits', desc: 'Charge, current, voltage, power; Ohm, Kirchhoff; resistive networks.', hw: '' },
  { course: 'ee', id: 'ee-transients', title: 'Energy storage & transients', desc: 'Capacitors, inductors, RC/RL/RLC step responses.', hw: '' },
  { course: 'ee', id: 'ee-ac', title: 'AC circuits', desc: 'Sinusoids, complex numbers, phasors, impedance and AC power.', hw: '' },
];

const calculus = [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22].map((m) => ({ ...m, course: 'calculus' }));
const ee = [ee01].map((m) => ({ ...m, course: 'ee' }));

export const MODULES = [...calculus, ...ee];

export const HOMEWORK_TEMPLATE = {
  title: 'Homework N',
  blocks: [
    { type: 'title', content: 'Homework N' },
    { type: 'text', content: 'Fill in the homework solutions into this Live Script, under the subsections titled "Solution". Mark each attempted problem as such by editing the parenthesized text in the problem titles. When done, export to PDF (or .mlx and then PDF from MATLAB).' },
    { type: 'text', content: 'Write your solutions as if explaining to a fellow student who has not read the course material: say in English what you are about to do (technique, theorem) before doing it. Do not use the Symbolic Toolbox (`syms`).' },
    { type: 'text', content: 'Example — the evaluation rule of definite integrals, with $f = f(x)$ the integrand and $F = F(x)$ an antiderivative:' },
    { type: 'equation', content: 'I = \\int_a^b f(x)\\,\\mathrm d x = F(b) - F(a) \\,.' },
    { type: 'heading', content: 'Problem 1 (Attempted | Not attempted)' },
    { type: 'heading2', content: 'Solution' },
    { type: 'text', content: 'Solution of problem 1 goes here.' },
    { type: 'heading', content: 'Problem 2 (Attempted | Not attempted)' },
    { type: 'heading2', content: 'Solution' },
    { type: 'text', content: 'Solution of problem 2 goes here.' },
    { type: 'heading', content: 'Problem 3 (Attempted | Not attempted)' },
    { type: 'heading2', content: 'Solution' },
    { type: 'text', content: 'Solution of problem 3 goes here.' },
    { type: 'heading', content: 'Function definitions' },
    { type: 'text', content: 'Place any function definitions needed above here, in their own code blocks. Press Alt+Enter to switch between text and code.' },
  ],
};
