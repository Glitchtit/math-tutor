// Foundations (pre-calculus algebra) skill generators. Format: see ./index.js.

import { frac, fracTex, fracM, gcd, coef, signed, poly } from './index.js';

// negative numbers in brackets when written after an operator: P(-3) '(-3)', P(4) '4'
const P = (n) => (n < 0 ? `(${n})` : `${n}`);
const R = String.raw;

// choice part: correct + up to 3 distinct distractors, shuffled
function choice(r, correct, wrong) {
  const seen = new Set([correct]), ds = [];
  for (const w of wrong) if (!seen.has(w)) { seen.add(w); ds.push(w); }
  const choices = r.shuffle([correct, ...ds.slice(0, 3)]);
  return { kind: 'choice', choices, answer: choices.indexOf(correct) };
}
const m$ = (tex) => `$${tex}$`;

// a step that shows "= reduced" only when reducing changes something
function reduceStep(n, d, why = 'Cancel the common factor from top and bottom.') {
  const raw = R`\frac{${n}}{${d}}`, red = fracTex(n, d);
  return red === raw ? null : { do: R`$= ${red}$`, why: gcd(n, d) > 1 ? why : n < 0 && d < 0 ? 'A minus divided by a minus is a plus.' : 'Write the minus sign in front of the fraction (minus over plus, or plus over minus, is minus).' };
}

// radians as TeX for deg degrees: 150 -> \frac{5\pi}{6}
function radTex(deg) {
  const f = frac(deg, 180);
  if (f.n === 0) return '0';
  const top = f.n === 1 ? R`\pi` : f.n === -1 ? R`-\pi` : R`${f.n}\pi`;
  return f.d === 1 ? top : R`\frac{${top}}{${f.d}}`;
}
const TRIG_TEX = [
  [0, '0'], [0.5, R`\frac{1}{2}`], [Math.SQRT2 / 2, R`\frac{\sqrt{2}}{2}`], [Math.sqrt(3) / 2, R`\frac{\sqrt{3}}{2}`], [1, '1'],
  [Math.sqrt(3) / 3, R`\frac{\sqrt{3}}{3}`], [Math.sqrt(3), R`\sqrt{3}`],
];
function trigTex(v) {
  const hit = TRIG_TEX.find(([x]) => Math.abs(Math.abs(v) - x) < 1e-9);
  return hit[1] === '0' ? '0' : (v < 0 ? '-' : '') + hit[1];
}

export default [
  {
    id: 'alg-int-ops', title: 'Negative numbers and order of operations', area: 'foundations', family: 'arithmetic', method: 'Brackets, powers, then × ÷, then + −',
    prereqs: [], blurb: 'Evaluate expressions with negative numbers in the right order.',
    gen(r) {
      const form = r.pick(['bracket', 'muldiv', 'negsq']);
      let expr, steps, res;
      if (form === 'bracket') {
        const a = r.nz(-9, 9), b = r.nz(-5, 5), c = r.int(-6, 6);
        let d = r.int(-6, 6); if (d === c) d = c === 6 ? -6 : c + 1;
        const e = c - d, f = e * e, g = b * f; res = a + g;
        expr = R`${a} ${signed(b)}\cdot(${c} - ${P(d)})^2`;
        steps = [
          { do: m$(expr), why: 'Order of operations: Brackets first, then Powers, then Multiply/Divide, then Add/Subtract.' },
          { do: R`$= ${a} ${signed(b)}\cdot(${e})^2$`, why: R`Brackets first: $${c} - ${P(d)} = ${e}$.` + (d < 0 ? ' Subtracting a negative number is the same as adding.' : '') },
          { do: R`$= ${a} ${signed(b)}\cdot ${f}$`, why: R`Powers next: $(${e})^2 = ${P(e)}\cdot ${P(e)} = ${f}$.` + (e < 0 ? ' A negative times a negative is positive.' : '') },
          { do: R`$= ${a} ${signed(g)}$`, why: R`Multiply before adding: $${Math.abs(b)}\cdot ${f} = ${Math.abs(g)}$. The sign in front stays.` },
          { do: R`$= ${res}$`, why: 'Last, add or subtract.' },
        ];
      } else if (form === 'muldiv') {
        const a = r.nz(-9, 9), b = r.nz(-6, 6), d = r.pick([2, 3, 4, -2, -3]), m = r.nz(-5, 5), c = d * m;
        const p = b * c, q = p / d; res = a - q;
        expr = R`${a} - ${P(b)}\cdot ${P(c)} \div ${P(d)}`;
        steps = [
          { do: m$(expr), why: 'Multiplication and division come before subtraction, worked from left to right.' },
          { do: R`$= ${a} - ${P(p)} \div ${P(d)}$`, why: R`$${P(b)}\cdot ${P(c)} = ${p}$. Same signs give a positive, different signs a negative.` },
          { do: R`$= ${a} - ${P(q)}$`, why: R`$${P(p)} \div ${P(d)} = ${q}$, with the same sign rule as multiplying.` },
          ...(q < 0 ? [{ do: R`$= ${a} + ${-q}$`, why: 'Subtracting a negative number is the same as adding.' }] : []),
          { do: R`$= ${res}$`, why: 'Now do the last addition or subtraction.' },
        ];
      } else {
        const n = r.int(2, 9), m = r.int(2, 9), k = r.int(1, 9), s = m * m - n * n; res = s - k;
        expr = R`-${n}^2 + (-${m})^2 - ${k}`;
        steps = [
          { do: m$(expr), why: R`Powers come first. In $-${n}^2$ the power belongs only to $${n}$, so it means $-(${n}^2)$. In $(-${m})^2$ the bracket makes the minus part of what is squared.` },
          { do: R`$= -(${n}\cdot ${n}) + (-${m})\cdot(-${m}) - ${k}$`, why: 'Write each power as a multiplication.' },
          { do: R`$= -${n * n} + ${m * m} - ${k}$`, why: 'A negative times a negative is positive.' },
          { do: R`$= ${s} - ${k}$`, why: R`Work left to right: $-${n * n} + ${m * m} = ${s}$.` },
          { do: R`$= ${s - k}$`, why: 'Finish the subtraction.' },
        ];
      }
      return {
        statement: R`<p>Evaluate $${expr}$. Enter a whole number.</p>`,
        part: { kind: 'numeric', answer: String(res), tol: 1e-9 },
        steps,
        hints: ['Do not just go left to right: some operations come first.', 'Brackets, then powers, then multiply/divide, then add/subtract. Watch the signs.'],
      };
    },
  },
  {
    id: 'alg-frac-add', title: 'Adding fractions', area: 'foundations', family: 'fractions', method: 'Common denominator, then add the tops',
    prereqs: [], blurb: 'Add two fractions with different denominators.',
    gen(r) {
      const b = r.pick([2, 3, 4, 5, 6, 8]), d = r.pick([3, 4, 5, 6, 7, 9].filter((x) => x !== b));
      const a = r.int(1, b - 1), c = r.int(1, d - 1);
      const l = (b * d) / gcd(b, d), A = a * (l / b), C = c * (l / d);
      return {
        statement: R`<p>Compute $\frac{${a}}{${b}} + \frac{${c}}{${d}}$. Give the answer as a fraction, e.g. <code>7/12</code>.</p>`,
        part: { kind: 'numeric', answer: fracM(A + C, l), tol: 1e-9 },
        steps: [
          { do: R`$\frac{${a}}{${b}} + \frac{${c}}{${d}}$`, why: 'Fractions can only be added when the bottoms (denominators) are the same.' },
          { do: R`$= \frac{${a}\cdot ${l / b}}{${b}\cdot ${l / b}} + \frac{${c}\cdot ${l / d}}{${d}\cdot ${l / d}}$`, why: R`The smallest common denominator is $${l}$. Multiplying top and bottom by the same number does not change a fraction.` },
          { do: R`$= \frac{${A}}{${l}} + \frac{${C}}{${l}}$`, why: 'Multiply out tops and bottoms.' },
          { do: R`$= \frac{${A + C}}{${l}}$`, why: 'Same denominator: add the tops, keep the bottom.' },
          ...[reduceStep(A + C, l, R`Cancel the common factor $${gcd(A + C, l)}$ from top and bottom.`)].filter(Boolean),
        ],
        hints: ['Make the denominators equal first.', R`Use $${l}$ as the common denominator.`],
      };
    },
  },
  {
    id: 'alg-frac-mul', title: 'Multiplying and dividing fractions', area: 'foundations', family: 'fractions', method: 'Multiply tops and bottoms (÷ means × the reciprocal)',
    prereqs: ['alg-int-ops'], blurb: 'Multiply fractions straight across; divide by flipping the second one.',
    gen(r) {
      const b = r.int(2, 9), a = r.pick([1, 2, 3, 4, 5, 7].filter((x) => x !== b)), d = r.int(2, 9), c = r.pick([1, 2, 3, 4, 5, 7, 8].filter((x) => x !== d));
      const s = r.pick([1, 1, -1]), div = r.next() < 0.5;
      const [C, D] = div ? [d, c] : [c, d], N = s * a * C, Dn = b * D;
      const F1 = R`${s < 0 ? '-' : ''}\frac{${a}}{${b}}`, op = div ? R`\div` : R`\times`;
      const expr = R`${F1} ${op} \frac{${c}}{${d}}`;
      return {
        statement: R`<p>Compute $${expr}$. Give the answer as a fraction, e.g. <code>-5/6</code>.</p>`,
        part: { kind: 'numeric', answer: fracM(N, Dn), tol: 1e-9 },
        steps: [
          { do: m$(expr), why: div ? 'Dividing by a fraction is multiplying by its reciprocal (the fraction turned upside down).' : 'To multiply fractions you do not need a common denominator.' },
          ...(div ? [{ do: R`$= ${F1} \times \frac{${d}}{${c}}$`, why: R`The reciprocal of $\frac{${c}}{${d}}$ is $\frac{${d}}{${c}}$.` }] : []),
          { do: R`$= \frac{${s * a}\cdot ${C}}{${b}\cdot ${D}}$`, why: 'Multiply the tops together and the bottoms together.' + (s < 0 ? ' The minus sign rides along on the top.' : '') },
          { do: R`$= \frac{${N}}{${Dn}}$`, why: 'Work out the two products.' },
          ...[reduceStep(N, Dn, R`Cancel the common factor $${gcd(N, Dn)}$ from top and bottom.`)].filter(Boolean),
        ],
        hints: [div ? 'Turn the division into a multiplication first.' : 'No common denominator needed for multiplying.', 'Top times top, bottom times bottom, then cancel common factors.'],
      };
    },
  },
  {
    id: 'alg-exp-rules', title: 'Exponent laws', area: 'foundations', family: 'exponents', method: 'Same base: add, multiply or subtract the exponents',
    prereqs: ['alg-int-ops'], blurb: 'Combine powers of the same base into one power.',
    gen(r) {
      const form = r.pick(['mul', 'pow', 'div', 'mix', 'val']);
      let expr, n, steps;
      if (form === 'mul') {
        const a = r.int(2, 9), b = r.int(2, 9); n = a + b; expr = R`x^{${a}}\cdot x^{${b}}`;
        steps = [
          { do: m$(expr), why: R`$x^{${a}}$ means $${a}$ copies of $x$ multiplied together.` },
          { do: R`$= \underbrace{x\cdots x}_{${a}}\cdot\underbrace{x\cdots x}_{${b}}$`, why: 'Write out the copies.' },
          { do: R`$= x^{${a}+${b}}$`, why: 'Multiplying powers of the same base: add the exponents (count all the copies).' },
          { do: R`$= x^{${n}}$`, why: R`$${a}+${b} = ${n}$.` },
        ];
      } else if (form === 'pow') {
        const a = r.int(2, 7), b = r.int(2, 5); n = a * b; expr = R`\left(x^{${a}}\right)^{${b}}`;
        steps = [
          { do: m$(expr), why: R`The outer power $${b}$ means $${b}$ copies of $x^{${a}}$ multiplied together.` },
          { do: R`$= \underbrace{x^{${a}}\cdots x^{${a}}}_{${b}}$`, why: 'Write out the copies.' },
          { do: R`$= x^{${a}\cdot ${b}}$`, why: R`$${b}$ groups of $${a}$ copies of $x$: a power of a power multiplies the exponents.` },
          { do: R`$= x^{${n}}$`, why: R`$${a}\cdot ${b} = ${n}$.` },
        ];
      } else if (form === 'div') {
        const a = r.int(5, 12), b = r.int(2, a - 2); n = a - b; expr = R`\frac{x^{${a}}}{x^{${b}}}`;
        steps = [
          { do: m$(expr), why: R`Top: $${a}$ copies of $x$. Bottom: $${b}$ copies.` },
          { do: R`$= x^{${a}-${b}}$`, why: R`Each $x$ on the bottom cancels one on the top: dividing powers of the same base subtracts the exponents.` },
          { do: R`$= x^{${n}}$`, why: R`$${a}-${b} = ${n}$.` },
        ];
      } else if (form === 'mix') {
        const a = r.int(2, 4), b = r.int(2, 3), c = r.int(2, 5), ab = a * b, d = r.int(2, ab + c - 2); n = ab + c - d;
        expr = R`\frac{\left(x^{${a}}\right)^{${b}}\cdot x^{${c}}}{x^{${d}}}`;
        steps = [
          { do: m$(expr), why: 'Work one law at a time: power of a power first.' },
          { do: R`$= \frac{x^{${ab}}\cdot x^{${c}}}{x^{${d}}}$`, why: R`Power of a power: multiply, $${a}\cdot ${b} = ${ab}$.` },
          { do: R`$= \frac{x^{${ab + c}}}{x^{${d}}}$`, why: R`Multiplying: add, $${ab}+${c} = ${ab + c}$.` },
          { do: R`$= x^{${ab + c}-${d}}$`, why: 'Dividing: subtract the exponents.' },
          { do: R`$= x^{${n}}$`, why: R`$${ab + c}-${d} = ${n}$.` },
        ];
      } else {
        const B = r.pick([2, 3]), a = r.int(2, 6), b = r.int(2, 6), k = r.int(2, Math.min(B === 2 ? 6 : 4, a + b - 2)), c = a + b - k;
        expr = R`\frac{${B}^{${a}}\cdot ${B}^{${b}}}{${B}^{${c}}}`;
        steps = [
          { do: m$(expr), why: 'All powers have the same base, so combine them first; no need to work out big numbers.' },
          { do: R`$= \frac{${B}^{${a + b}}}{${B}^{${c}}}$`, why: R`Multiplying: add the exponents, $${a}+${b} = ${a + b}$.` },
          { do: R`$= ${B}^{${a + b}-${c}} = ${B}^{${k}}$`, why: R`Dividing: subtract the exponents, $${a + b}-${c} = ${k}$.` },
          { do: R`$= ${Array(k).fill(B).join(R`\cdot `)} = ${B ** k}$`, why: R`$${B}^{${k}}$ is $${k}$ copies of $${B}$ multiplied.` },
        ];
        return {
          statement: R`<p>Evaluate $${expr}$ without a calculator. Enter a whole number.</p>`,
          part: { kind: 'numeric', answer: String(B ** k), tol: 1e-9 }, steps,
          hints: ['Combine the powers before multiplying anything out.', 'Multiply: add exponents. Divide: subtract exponents.'],
        };
      }
      return {
        statement: R`<p>Write $${expr}$ as a single power $x^{n}$. Enter the number $n$.</p>`,
        part: { kind: 'numeric', answer: String(n), tol: 1e-9 }, steps,
        hints: ['Think of how many copies of x there are in total.', 'Multiply powers: add exponents. Power of a power: multiply. Divide: subtract.'],
      };
    },
  },
  {
    id: 'alg-exp-neg-frac', title: 'Negative and fractional exponents', area: 'foundations', family: 'exponents', method: 'Negative power = 1 over; root = fractional power',
    prereqs: ['alg-exp-rules', 'alg-frac-mul'], blurb: 'Rewrite 1/x^n and roots as powers, and evaluate powers like 8^(2/3).',
    gen(r) {
      const form = r.pick(['recip', 'sqrt', 'root', 'eval']);
      const askN = (expr, ans, steps) => ({
        statement: R`<p>Write $${expr}$ as a single power $x^{n}$. Enter $n$ (a whole number or a fraction, e.g. <code>-3</code> or <code>5/2</code>).</p>`,
        part: { kind: 'numeric', answer: ans, tol: 1e-9 }, steps,
        hints: ['Turn every root and every "1 over" into a power of x first.', R`Use $\frac{1}{x^{a}} = x^{-a}$ and $\sqrt[n]{x} = x^{\frac{1}{n}}$, then the exponent laws.`],
      });
      if (form === 'recip') {
        const n = r.int(2, 9);
        if (r.next() < 0.4) {
          const m = r.int(1, n - 1), X = m === 1 ? 'x' : R`x^{${m}}`, k = m - n;
          return askN(R`\frac{${X}}{x^{${n}}}`, String(k), [
            { do: R`$\frac{${X}}{x^{${n}}}$`, why: 'Same base divided: subtract the exponents, even if the result is negative.' + (m === 1 ? R` Here $x = x^{1}$.` : '') },
            { do: R`$= x^{${m}-${n}}$`, why: 'Top exponent minus bottom exponent.' },
            { do: R`$= x^{${k}}$`, why: R`$${m}-${n} = ${k}$. A negative exponent means more x's ended up on the bottom.` },
          ]);
        }
        return askN(R`\frac{1}{x^{${n}}}`, String(-n), [
          { do: R`$\frac{1}{x^{${n}}} = \frac{x^{0}}{x^{${n}}}$`, why: R`$x^{0} = 1$: any nonzero number to the power 0 is 1.` },
          { do: R`$= x^{0-${n}}$`, why: 'Dividing powers of the same base: subtract the exponents.' },
          { do: R`$= x^{-${n}}$`, why: R`$0-${n} = -${n}$. So "1 over" a power is the same power with a minus sign.` },
        ]);
      }
      if (form === 'sqrt') {
        const a = r.int(2, 6), div = r.next() < 0.5, top = div ? 2 * a - 1 : 2 * a + 1;
        const expr = div ? R`\frac{x^{${a}}}{\sqrt{x}}` : R`x^{${a}}\sqrt{x}`;
        return askN(expr, fracM(top, 2), [
          { do: R`$\sqrt{x} = x^{\frac{1}{2}}$`, why: R`A square root is the power $\frac{1}{2}$, because $x^{\frac{1}{2}}\cdot x^{\frac{1}{2}} = x^{1} = x$.` },
          { do: div ? R`$\frac{x^{${a}}}{x^{\frac{1}{2}}} = x^{${a} - \frac{1}{2}}$` : R`$x^{${a}}\cdot x^{\frac{1}{2}} = x^{${a} + \frac{1}{2}}$`, why: div ? 'Dividing: subtract the exponents.' : 'Multiplying: add the exponents.' },
          { do: R`$${a} ${div ? '-' : '+'} \frac{1}{2} = \frac{${2 * a}}{2} ${div ? '-' : '+'} \frac{1}{2} = \frac{${top}}{2}$`, why: R`Write $${a}$ as halves so the fractions have the same bottom.` },
          { do: R`$= x^{\frac{${top}}{2}}$`, why: 'Put the exponent back on x.' },
        ]);
      }
      if (form === 'root') {
        const n = r.pick([2, 3, 4, 5]), m = r.pick([1, 2, 3, 4, 5, 6, 7].filter((v) => v % n !== 0 && v <= n + 2)), neg = r.next() < 0.5;
        const X = m === 1 ? 'x' : R`x^{${m}}`, root = n === 2 ? R`\sqrt{${X}}` : R`\sqrt[${n}]{${X}}`;
        const mn = R`\frac{${m}}{${n}}`, red = fracTex(m, n);
        const steps = [
          { do: R`$${neg ? R`\frac{1}{${root}}` : root}$`, why: 'Turn the root into a power of x first' + (neg ? ', then deal with the "1 over".' : '.') },
          { do: R`$${root} = ${m === 1 ? R`x^{\frac{1}{${n}}}` : R`\left(${X}\right)^{\frac{1}{${n}}}`}$`, why: R`${n === 2 ? 'A square root' : `The ${n === 3 ? 'cube' : `${n}th`} root`} is the power $\frac{1}{${n}}$.` },
          ...(m === 1 ? [] : [{ do: R`$= x^{${mn}}${red !== mn ? R` = x^{${red}}` : ''}$`, why: R`Power of a power: multiply, $${m}\cdot\frac{1}{${n}} = ${mn}$${red !== mn ? ', then simplify the fraction' : ''}.` }]),
        ];
        if (neg) steps.push({ do: R`$\frac{1}{${root}} = \frac{1}{x^{${red}}} = x^{-${red}}$`, why: '"1 over" a power is the same power with a minus sign.' });
        else steps.push({ do: R`$${root} = x^{${red}}$`, why: 'So the exponent is the power over the root.' });
        return askN(neg ? R`\frac{1}{${root}}` : root, fracM(neg ? -m : m, n), steps);
      }
      const q = r.pick([2, 3]), t = q === 2 ? r.int(2, 6) : r.int(2, 4), p = q === 2 ? r.pick([1, 3]) : r.pick([1, 2]), neg = r.next() < 0.4;
      const b = t ** q, val = t ** p, pq = R`\frac{${p}}{${q}}`, rt = q === 2 ? R`\sqrt{${b}}` : R`\sqrt[3]{${b}}`;
      const expr = R`${b}^{${neg ? '-' : ''}${pq}}`;
      const steps = [
        { do: m$(expr), why: R`In a fractional exponent the bottom ($${q}$) is a root and the top ($${p}$) is a power.` + (neg ? ' The minus sign means "1 over".' : '') },
        ...(neg ? [{ do: R`$= \frac{1}{${b}^{${pq}}}$`, why: 'A negative exponent means 1 over the positive power.' }] : []),
        ...(p > 1 ? [{ do: R`$${b}^{${pq}} = \left(${b}^{\frac{1}{${q}}}\right)^{${p}}$`, why: R`Power of a power: $\frac{1}{${q}}\cdot ${p} = ${pq}$. Take the root first so the numbers stay small.` }] : []),
        { do: R`$${b}^{\frac{1}{${q}}} = ${rt} = ${t}$`, why: R`$${Array(q).fill(t).join(R`\cdot `)} = ${b}$.` },
        ...(p > 1 ? [{ do: R`$${t}^{${p}} = ${val}$`, why: R`$${Array(p).fill(t).join(R`\cdot `)} = ${val}$.` }] : []),
        { do: R`$${expr} = ${neg ? R`\frac{1}{${val}}` : val}$`, why: neg ? 'Put the result under the 1.' : 'That is the value.' },
      ];
      return {
        statement: R`<p>Evaluate $${expr}$ without a calculator. Enter the exact value, e.g. <code>9</code> or <code>1/4</code>.</p>`,
        part: { kind: 'numeric', answer: neg ? `1/${val}` : String(val), tol: 1e-9 }, steps,
        hints: ['The bottom of the exponent is a root, the top is a power.', R`Find the ${q === 2 ? 'square' : 'cube'} root of $${b}$ first.`],
      };
    },
  },
  {
    id: 'alg-expand', title: 'Expanding brackets', area: 'foundations', family: 'quadratics', method: 'Multiply every term by every term (expand)',
    prereqs: ['alg-int-ops'], blurb: 'Multiply out products like (2x+3)(x-4) and (x+5)^2.',
    gen(r) {
      if (r.next() < 0.55) {
        let a, b, c, d;
        do { a = r.pick([1, 1, 2, 3]); c = r.pick([1, 2, 3]); b = r.nz(-6, 6); d = r.nz(-6, 6); } while (a * d + b * c === 0);
        const mid = a * d + b * c, ok = poly([a * c, mid, b * d]), ax = coef(a, 'x'), cx = coef(c, 'x');
        const expr = R`(${poly([a, b])})(${poly([c, d])})`;
        return {
          statement: R`<p>Expand $${expr}$. Which answer is correct?</p>`,
          part: choice(r, m$(ok), [m$(poly([a * c, 0, b * d])), m$(poly([a * c, mid, -b * d])), m$(poly([a * c, -mid, b * d]))]),
          steps: [
            { do: m$(expr), why: 'Multiply every term in the first bracket by every term in the second (4 products).' },
            { do: R`$= ${ax}\cdot ${cx} + ${ax}\cdot ${P(d)} + ${P(b)}\cdot ${cx} + ${P(b)}\cdot ${P(d)}$`, why: 'First times first, first times second, second times first, second times second.' },
            { do: R`$= ${coef(a * c, 'x^{2}')} ${signed(a * d, 'x')} ${signed(b * c, 'x')} ${signed(b * d)}$`, why: R`Work out each product; $x\cdot x = x^{2}$.` },
            { do: R`$= ${ok}$`, why: R`Combine the two $x$ terms: $${a * d} + ${P(b * c)} = ${mid}$.` },
          ],
          hints: ['There are four products, not two.', 'Do not forget the middle x terms, and keep track of the signs.'],
        };
      }
      const a = r.pick([1, 2, 3, -1, -2]), b = r.pick([1, 2, 3]), c = r.nz(-5, 5);
      const pre = a === 1 ? '' : a === -1 ? '-' : String(a), inner = poly([b, c]), sq = [b * b, 2 * b * c, c * c];
      const ok = poly(sq.map((v) => a * v)), expr = R`${pre}(${inner})^2`;
      return {
        statement: R`<p>Expand $${expr}$. Which answer is correct?</p>`,
        part: choice(r, m$(ok), [m$(poly([a * b * b, 0, a * c * c])), m$(poly([a * b * b, a * b * c, a * c * c])), m$(poly([a * b * b, -2 * a * b * c, a * c * c])), m$(poly([a * b * b, 2 * b * c, c * c]))]),
        steps: [
          { do: R`$${expr} = ${pre}(${inner})(${inner})$`, why: R`Squaring means multiplying the bracket by itself. It is NOT $${coef(b * b, 'x^{2}')} + ${c * c}$.` },
          { do: R`$(${inner})(${inner}) = ${coef(b * b, 'x^{2}')} ${signed(b * c, 'x')} ${signed(b * c, 'x')} ${signed(c * c)}$`, why: 'Every term times every term: four products.' },
          { do: R`$= ${poly(sq)}$`, why: R`The two middle terms are equal: $${b * c} + ${P(b * c)} = ${2 * b * c}$.` },
          ...(a === 1 ? [] : [{ do: R`$${pre}\left(${poly(sq)}\right) = ${ok}$`, why: R`Multiply every term inside by $${a}$.` }]),
        ],
        hints: [R`Write the square as two brackets multiplied.`, 'Every term times every term; the middle term appears twice.' + (a === 1 ? '' : ' Multiply by the number in front last.')],
      };
    },
  },
  {
    id: 'alg-factor-quad', title: 'Factoring quadratics', area: 'foundations', family: 'quadratics', method: 'Find two numbers: product c, sum b (factor)',
    prereqs: ['alg-expand'], blurb: 'Write x^2 + bx + c as (x + p)(x + q), taking out a common factor first if there is one.',
    gen(r) {
      let p, q;
      do { p = r.nz(-7, 7); q = r.nz(-7, 7); } while (p === q || p === -q);
      const k = r.next() < 0.35 ? r.int(2, 5) : 1, b = p + q, c = p * q;
      const f = (u, v) => R`(x ${signed(u)})(x ${signed(v)})`, K = k === 1 ? '' : String(k);
      const full = poly([k, k * b, k * c]), monic = poly([1, b, c]);
      return {
        statement: R`<p>Factor $${full}$ completely. Which answer is correct?</p>`,
        part: choice(r, m$(K + f(p, q)), [m$(K + f(-p, -q)), m$(K + f(p, -q)), k === 1 ? m$(f(-p, q)) : m$(f(p, q))]),
        steps: [
          ...(k === 1 ? [] : [{ do: R`$${full} = ${k}\left(${monic}\right)$`, why: R`Every term is divisible by $${k}$: take that common factor out first.` }]),
          { do: m$(monic), why: R`Look for two numbers that multiply to $${c}$ (the constant) and add to $${b}$ (the number in front of $x$).` },
          { do: R`$${p}\cdot ${P(q)} = ${c},\quad ${p} + ${P(q)} = ${b}$`, why: R`$${p}$ and $${q}$ work.` },
          { do: R`$${monic} = ${f(p, q)}$`, why: 'Each number goes into its own bracket with x.' },
          { do: R`$${f(p, q)} = x^{2} ${signed(p, 'x')} ${signed(q, 'x')} ${signed(c)} = ${monic}$`, why: 'Check by expanding: you get back what you started with.' },
          ...(k === 1 ? [] : [{ do: R`$${full} = ${K}${f(p, q)}$`, why: R`Put the $${k}$ back in front.` }]),
        ],
        hints: [R`Which two numbers multiply to $${c}$ and add to $${b}$?`, k === 1 ? 'Try the factor pairs of the constant, with signs, and check their sum.' : R`First take out the common factor $${k}$.`],
      };
    },
  },
  {
    id: 'alg-solve-linear', title: 'Solving linear equations', area: 'foundations', family: 'equations', method: 'Do the same to both sides to get x alone',
    prereqs: ['alg-int-ops', 'alg-frac-mul'], blurb: 'Solve ax + b = cx + d.',
    gen(r) {
      let a, c, d;
      const b = r.nz(-9, 9);
      if (r.next() < 0.6) {
        a = r.int(2, 7); c = r.nz(-5, 5); if (c === a) c = -c;
        d = (a - c) * r.nz(-6, 6) + b;
      } else {
        const diff = r.pick([2, 3, 4, 5, -2, -3]); a = r.int(2, 7); c = a - diff; if (c === 0) { a += 1; c = 1; }
        d = b + diff * r.int(-3, 3) + r.int(1, Math.abs(diff) - 1);
      }
      const e = a - c, N = d - b, eq = R`${coef(a, 'x')} ${signed(b)} = ${coef(c, 'x')} ${signed(d)}`;
      return {
        statement: R`<p>Solve $${eq}$ for $x$. Give $x$ as a whole number or a fraction, e.g. <code>-5/3</code>.</p>`,
        part: { kind: 'numeric', answer: fracM(N, e), tol: 1e-9 },
        steps: [
          { do: m$(eq), why: 'Goal: x on one side, a number on the other. Whatever you do to one side, do to the other.' },
          { do: R`$${coef(e, 'x')} ${signed(b)} = ${d}$`, why: (c > 0 ? R`Subtract $${coef(c, 'x')}$ from both sides` : R`Add $${coef(-c, 'x')}$ to both sides`) + R`: $${coef(a, 'x')} ${c > 0 ? '-' : '+'} ${coef(Math.abs(c), 'x')} = ${coef(e, 'x')}$.` },
          { do: R`$${coef(e, 'x')} = ${N}$`, why: (b > 0 ? R`Subtract $${b}$ from both sides` : R`Add $${-b}$ to both sides`) + R`: $${d} ${b > 0 ? '-' : '+'} ${Math.abs(b)} = ${N}$.` },
          ...(e === 1 ? [] : [{ do: R`$x = \frac{${N}}{${e}}$`, why: R`Divide both sides by $${e}$, the number in front of $x$.` }]),
          ...(e === 1 ? [] : [reduceStep(N, e, R`Simplify: cancel the common factor $${gcd(N, e)}$.`)].filter(Boolean).map((s) => ({ ...s, do: s.do.replace('$=', '$x =') }))),
        ],
        hints: ['Collect the x terms on one side first.', 'Move the x terms together, then the plain numbers, then divide by the number in front of x.'],
      };
    },
  },
  {
    id: 'alg-rearrange', title: 'Rearranging formulas', area: 'foundations', family: 'equations', method: 'Undo the operations in reverse order to isolate a letter',
    prereqs: ['alg-solve-linear'], blurb: 'Make a different letter the subject of a formula.',
    gen(r) {
      const F = [
        { eq: 'v = u + at', v: 't', ok: R`\frac{v-u}{a}`, bad: [R`\frac{v+u}{a}`, R`\frac{v}{a} - u`, 'a(v-u)'], steps: [['v - u = at', 'Subtract u from both sides.'], [R`\frac{v-u}{a} = t`, 'Divide both sides by a.']] },
        { eq: 'v = u + at', v: 'a', ok: R`\frac{v-u}{t}`, bad: [R`\frac{v+u}{t}`, R`\frac{v}{t} - u`, 't(v-u)'], steps: [['v - u = at', 'Subtract u from both sides.'], [R`\frac{v-u}{t} = a`, 'Divide both sides by t.']] },
        { eq: 'v = u + at', v: 'u', ok: 'v - at', bad: ['v + at', 'at - v', R`\frac{v}{at}`], steps: [['v - at = u', 'Subtract at from both sides.']] },
        { eq: 'P = I^{2}R', v: 'I', ok: R`\sqrt{\frac{P}{R}}`, bad: [R`\frac{P}{2R}`, R`\sqrt{PR}`, R`\frac{\sqrt{P}}{R}`], steps: [[R`\frac{P}{R} = I^{2}`, 'Divide both sides by R.'], [R`\sqrt{\frac{P}{R}} = I`, 'Take the square root of both sides (a current size is positive).']] },
        { eq: 'P = I^{2}R', v: 'R', ok: R`\frac{P}{I^{2}}`, bad: [R`PI^{2}`, R`\frac{I^{2}}{P}`, R`\frac{P}{2I}`], steps: [[R`\frac{P}{I^{2}} = R`, R`Divide both sides by $I^{2}$.`]] },
        { eq: R`\frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2}`, v: 'R', ok: R`\frac{R_1R_2}{R_1+R_2}`, bad: ['R_1 + R_2', R`\frac{R_1+R_2}{R_1R_2}`, R`\frac{R_1R_2}{R_1-R_2}`], steps: [[R`\frac{1}{R} = \frac{R_2}{R_1R_2} + \frac{R_1}{R_1R_2}`, R`Common denominator $R_1R_2$: multiply top and bottom of each fraction by the other resistor.`], [R`\frac{1}{R} = \frac{R_1+R_2}{R_1R_2}`, 'Same bottom: add the tops.'], [R`R = \frac{R_1R_2}{R_1+R_2}`, 'If two fractions are equal, their reciprocals are equal: flip both sides.']] },
        { eq: R`A = \pi r^{2}`, v: 'r', ok: R`\sqrt{\frac{A}{\pi}}`, bad: [R`\frac{A}{2\pi}`, R`\sqrt{\pi A}`, R`\frac{\sqrt{A}}{\pi}`], steps: [[R`\frac{A}{\pi} = r^{2}`, R`Divide both sides by $\pi$.`], [R`\sqrt{\frac{A}{\pi}} = r`, 'Take the square root of both sides (a radius is positive).']] },
        { eq: 'y = mx + c', v: 'x', ok: R`\frac{y-c}{m}`, bad: [R`\frac{y+c}{m}`, R`\frac{y}{m} - c`, 'm(y-c)'], steps: [['y - c = mx', 'Subtract c from both sides.'], [R`\frac{y-c}{m} = x`, 'Divide both sides by m.']] },
        { eq: R`E = \frac{1}{2}mv^{2}`, v: 'v', ok: R`\sqrt{\frac{2E}{m}}`, bad: [R`\sqrt{\frac{E}{2m}}`, R`\frac{2E}{m}`, R`\sqrt{2Em}`], steps: [['2E = mv^{2}', 'Multiply both sides by 2 to clear the half.'], [R`\frac{2E}{m} = v^{2}`, 'Divide both sides by m.'], [R`\sqrt{\frac{2E}{m}} = v`, 'Take the square root of both sides (a speed is positive).']] },
        { eq: R`C = \frac{5}{9}(F - 32)`, v: 'F', ok: R`\frac{9C}{5} + 32`, bad: [R`\frac{5C}{9} + 32`, R`\frac{9C}{5} - 32`, R`\frac{9}{5}(C + 32)`], steps: [[R`\frac{9C}{5} = F - 32`, R`Multiply both sides by $\frac{9}{5}$, the reciprocal of $\frac{5}{9}$.`], [R`\frac{9C}{5} + 32 = F`, 'Add 32 to both sides.']] },
        { eq: R`s = \frac{d}{t}`, v: 't', ok: R`\frac{d}{s}`, bad: ['st', R`\frac{s}{d}`, 'd - s'], steps: [['st = d', 'Multiply both sides by t.'], [R`t = \frac{d}{s}`, 'Divide both sides by s.']] },
        { eq: R`A = \frac{1}{2}bh`, v: 'h', ok: R`\frac{2A}{b}`, bad: [R`\frac{A}{2b}`, R`\frac{2b}{A}`, '2Ab'], steps: [['2A = bh', 'Multiply both sides by 2.'], [R`\frac{2A}{b} = h`, 'Divide both sides by b.']] },
        { eq: 'P = 2l + 2w', v: 'w', ok: R`\frac{P-2l}{2}`, bad: [R`\frac{P}{2} - 2l`, 'P - 2l', R`\frac{P+2l}{2}`], steps: [['P - 2l = 2w', 'Subtract 2l from both sides.'], [R`\frac{P-2l}{2} = w`, 'Divide both sides by 2.']] },
      ];
      const f = r.pick(F);
      return {
        statement: R`<p>Rearrange $${f.eq}$ to make $${f.v}$ the subject. Which is correct?</p>`,
        part: choice(r, m$(`${f.v} = ${f.ok}`), f.bad.map((x) => m$(`${f.v} = ${x}`))),
        steps: [
          { do: m$(f.eq), why: R`Undo what is done to $${f.v}$, in reverse order, doing the same to both sides each time.` },
          ...f.steps.map(([d, w]) => ({ do: m$(d), why: w })),
          ...(f.steps.at(-1)[0] === `${f.v} = ${f.ok}` ? [] : [{ do: m$(`${f.v} = ${f.ok}`), why: R`Write it with $${f.v}$ on the left.` }]),
        ],
        hints: [R`What is being done to $${f.v}$? Undo the outermost operation first.`, 'Treat the other letters like numbers: add/subtract first, then multiply/divide, then roots.'],
      };
    },
  },
  {
    id: 'alg-solve-quad', title: 'Solving quadratic equations', area: 'foundations', family: 'quadratics', method: 'Set each factor to zero, or use the quadratic formula',
    prereqs: ['alg-factor-quad', 'alg-exp-neg-frac'], blurb: 'Solve ax^2 + bx + c = 0.',
    gen(r) {
      const larger = r.next() < 0.6, which = larger ? 'larger' : 'smaller';
      if (r.next() < 0.5) {
        let p, q;
        do { p = r.nz(-8, 8); q = r.nz(-8, 8); } while (p === q);
        const eq = poly([1, -(p + q), p * q]), ans = larger ? Math.max(p, q) : Math.min(p, q);
        return {
          statement: R`<p>Solve $${eq} = 0$. Enter the <b>${which}</b> solution.</p>`,
          part: { kind: 'numeric', answer: String(ans), tol: 1e-9 },
          steps: [
            { do: R`$${eq} = 0$`, why: R`Try to factor: two numbers that multiply to $${p * q}$ and add to $${-(p + q)}$.` },
            { do: R`$(x ${signed(-p)})(x ${signed(-q)}) = 0$`, why: R`$${-p}\cdot ${P(-q)} = ${p * q}$ and $${-p} + ${P(-q)} = ${-(p + q)}$.` },
            { do: R`$x ${signed(-p)} = 0 \quad\text{or}\quad x ${signed(-q)} = 0$`, why: 'A product is zero only when one of its factors is zero.' },
            { do: R`$x = ${p} \quad\text{or}\quad x = ${q}$`, why: 'Solve each small equation.' },
            { do: R`$x = ${ans}$`, why: `Pick the ${which} one.` },
          ],
          hints: ['Factor the left side first.', 'If (x - p)(x - q) = 0, then x = p or x = q.'],
        };
      }
      let a, b, c, D;
      do { a = r.pick([1, 2, 3]); b = r.nz(-7, 7); c = r.nz(-6, 6); D = b * b - 4 * a * c; } while (D <= 0 || Number.isInteger(Math.sqrt(D)));
      const sg = larger ? '+' : '-', val = (-b + (larger ? 1 : -1) * Math.sqrt(D)) / (2 * a);
      return {
        statement: R`<p>Solve $${poly([a, b, c])} = 0$ with the quadratic formula. Enter the <b>${which}</b> solution, exactly (e.g. <code>(-3+sqrt(17))/4</code>) or as a decimal with 3 decimals.</p>`,
        part: { kind: 'numeric', answer: `(${-b}${sg}sqrt(${D}))/${2 * a}`, tol: 1e-3 },
        steps: [
          { do: R`$a = ${a},\quad b = ${b},\quad c = ${c}$`, why: R`Read off the numbers in $ax^{2} + bx + c = 0$. It does not factor nicely, so use the formula.` },
          { do: R`$b^{2} - 4ac = ${P(b)}^{2} - 4\cdot ${a}\cdot ${P(c)} = ${b * b} ${signed(-4 * a * c)} = ${D}$`, why: 'Work out the part under the square root first. It is positive, so there are two solutions.' },
          { do: R`$x = \frac{-b \pm \sqrt{b^{2}-4ac}}{2a} = \frac{${-b} \pm \sqrt{${D}}}{${2 * a}}$`, why: R`The quadratic formula, with $-b = ${-b}$ and $2a = ${2 * a}$.` },
          { do: R`$x = \frac{${-b} ${sg} \sqrt{${D}}}{${2 * a}} \approx ${val.toFixed(3)}$`, why: `The ${which} solution uses ${larger ? '+' : '−'} (the bottom is positive).` },
        ],
        hints: [R`Identify $a$, $b$ and $c$.`, R`Use $x = \frac{-b \pm \sqrt{b^{2}-4ac}}{2a}$.`],
      };
    },
  },
  {
    id: 'alg-functions', title: 'Function notation', area: 'foundations', family: 'functions', method: 'Substitute the input, innermost function first',
    prereqs: ['alg-int-ops'], blurb: 'Evaluate f(a), compositions f(g(a)), and f(x + h).',
    gen(r) {
      const form = r.pick(['value', 'compose', 'shift']);
      if (form === 'value') {
        const a = r.nz(-3, 3), b = r.int(-5, 5), c = r.int(-9, 9), k = r.nz(-4, 4);
        const aT = a === 1 ? '' : a === -1 ? '-' : R`${a}\cdot `;
        const sub = [R`${aT}${P(k)}^{2}`, b ? R`${b < 0 ? '-' : '+'} ${Math.abs(b)}\cdot ${P(k)}` : '', signed(c)].join(' ');
        const sub2 = [R`${aT}${k * k}`, b ? R`${b < 0 ? '-' : '+'} ${Math.abs(b)}\cdot ${P(k)}` : '', signed(c)].join(' ');
        const t1 = a * k * k, t2 = b * k, res = t1 + t2 + c;
        return {
          statement: R`<p>Let $f(x) = ${poly([a, b, c])}$. Find $f(${k})$. Enter a number.</p>`,
          part: { kind: 'numeric', answer: String(res), tol: 1e-9 },
          steps: [
            { do: R`$f(${k}) = ${sub}$`, why: R`Replace every $x$ by $${k}$${k < 0 ? ', in brackets because it is negative' : ''}.` },
            { do: R`$= ${sub2}$`, why: R`Powers first: $${P(k)}^{2} = ${k * k}$.` },
            { do: R`$= ${[String(t1), b ? signed(Math.abs(b) * k * (b < 0 ? -1 : 1)) : '', signed(c)].join(' ')}$`, why: 'Multiply next; the sign in front belongs to the number.' },
            { do: R`$= ${res}$`, why: 'Add and subtract from left to right.' },
          ],
          hints: [R`Put $${k}$ wherever you see $x$.`, 'Use brackets around the number, then follow the order of operations.'],
        };
      }
      if (form === 'compose') {
        const a = r.nz(-4, 4), b = r.nz(-6, 6), c = r.nz(-5, 5), k = r.nz(-3, 3), fg = r.next() < 0.5;
        const fT = poly([a, b]), gT = poly([1, 0, c]);
        let steps, res;
        if (fg) {
          const G = k * k + c; res = a * G + b;
          steps = [
            { do: R`$f(g(${k}))$`, why: R`Work from the inside out: first find $g(${k})$, then put that number into $f$.` },
            { do: R`$g(${k}) = ${P(k)}^{2} ${signed(c)} = ${k * k} ${signed(c)} = ${G}$`, why: R`Replace $x$ by $${P(k)}$ in $g$.` },
            { do: R`$f(g(${k})) = f(${G})$`, why: R`Replace $g(${k})$ by its value.` },
            { do: R`$f(${G}) = ${a}\cdot ${P(G)} ${signed(b)} = ${a * G} ${signed(b)} = ${res}$`, why: R`Replace $x$ by $${P(G)}$ in $f$.` },
          ];
        } else {
          const Fk = a * k + b; res = Fk * Fk + c;
          steps = [
            { do: R`$g(f(${k}))$`, why: R`Work from the inside out: first find $f(${k})$, then put that number into $g$.` },
            { do: R`$f(${k}) = ${a}\cdot ${P(k)} ${signed(b)} = ${a * k} ${signed(b)} = ${Fk}$`, why: R`Replace $x$ by $${P(k)}$ in $f$.` },
            { do: R`$g(f(${k})) = g(${Fk})$`, why: R`Replace $f(${k})$ by its value.` },
            { do: R`$g(${Fk}) = ${P(Fk)}^{2} ${signed(c)} = ${Fk * Fk} ${signed(c)} = ${res}$`, why: R`Replace $x$ by $${P(Fk)}$ in $g$.` },
          ];
        }
        return {
          statement: R`<p>Let $f(x) = ${fT}$ and $g(x) = ${gT}$. Find $${fg ? 'f(g' : 'g(f'}(${k}))$. Enter a number.</p>`,
          part: { kind: 'numeric', answer: String(res), tol: 1e-9 }, steps,
          hints: ['Start with the innermost brackets.', R`Find the inside function's value at $${k}$, then use that number as the input of the outside function.`],
        };
      }
      let b, k;
      do { b = r.nz(-5, 5); k = r.nz(-4, 4); } while (k + b === 1);
      const c = r.int(-6, 6), xk = R`x ${signed(k)}`;
      const ok = poly([1, 2 * k + b, k * k + b * k + c]);
      return {
        statement: R`<p>Let $f(x) = ${poly([1, b, c])}$. Which expression equals $f(${xk})$?</p>`,
        part: choice(r, m$(ok), [m$(poly([1, b, c + k])), m$(poly([1, b, k * k + b * k + c])), m$(poly([1, 2 * k + b, k * k + c]))]),
        steps: [
          { do: R`$f(${xk}) = (${xk})^{2} ${signed(b, `(${xk})`)} ${signed(c)}$`, why: R`Replace every $x$ in the formula by $(${xk})$, keeping the brackets.` },
          { do: R`$(${xk})^{2} = x^{2} ${signed(2 * k, 'x')} ${signed(k * k)}$`, why: R`$(${xk})(${xk})$: every term times every term. It is not $x^{2} + ${k * k}$.` },
          { do: R`$${coef(b, `(${xk})`)} = ${coef(b, 'x')} ${signed(b * k)}$`, why: R`Multiply $${b}$ into both terms of the bracket.` },
          { do: R`$f(${xk}) = x^{2} ${signed(2 * k, 'x')} ${signed(k * k)} ${signed(b, 'x')} ${signed(b * k)} ${signed(c)}$`, why: 'Put the pieces together.' },
          { do: R`$= ${ok}$`, why: R`Collect like terms: $x$ terms $${2 * k} + ${P(b)} = ${2 * k + b}$; numbers $${k * k} + ${P(b * k)} + ${P(c)} = ${k * k + b * k + c}$.` },
        ],
        hints: [R`$f(${xk})$ means: put $(${xk})$ wherever $x$ appears.`, 'Expand the square properly (it has a middle term), then collect like terms.'],
      };
    },
  },
  {
    id: 'alg-lines', title: 'Straight lines', area: 'foundations', family: 'functions', method: 'Slope = rise over run, then y = mx + c',
    prereqs: ['alg-solve-linear'], blurb: 'Slope between two points and the equation of a line.',
    gen(r) {
      const form = r.pick(['slope', 'two', 'pslope']);
      const exprHint = 'Enter the right-hand side of $y = \\ldots$ in MATLAB syntax, e.g. <code>2*x - 3</code>.';
      if (form === 'slope') {
        const x1 = r.int(-5, 5); let x2 = r.int(-5, 6); if (x2 === x1) x2 = x1 + r.pick([2, 3]);
        const y1 = r.int(-6, 6); let y2 = r.int(-6, 6); if (y2 === y1) y2 = y1 - r.pick([1, 4]);
        const dy = y2 - y1, dx = x2 - x1;
        return {
          statement: R`<p>Find the slope of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$. Give a whole number or a fraction, e.g. <code>-3/2</code>.</p>`,
          part: { kind: 'numeric', answer: fracM(dy, dx), tol: 1e-9 },
          steps: [
            { do: R`$m = \frac{y_2 - y_1}{x_2 - x_1}$`, why: 'Slope = rise over run: the change in y divided by the change in x.' },
            { do: R`$m = \frac{${y2} - ${P(y1)}}{${x2} - ${P(x1)}}$`, why: 'Substitute the coordinates. Use the same point first on top and bottom.' },
            { do: R`$m = \frac{${dy}}{${dx}}$`, why: 'Subtract (subtracting a negative number is adding).' },
            ...[reduceStep(dy, dx, R`Simplify the fraction.`)].filter(Boolean).map((s) => ({ ...s, do: s.do.replace('$=', '$m =') })),
          ],
          hints: ['Slope is rise over run.', R`Compute $\frac{y_2 - y_1}{x_2 - x_1}$.`],
        };
      }
      if (form === 'two') {
        const x1 = r.nz(-4, 4), dx = r.nz(-3, 3), x2 = x1 + dx, m = r.nz(-4, 4), y1 = r.int(-6, 6), y2 = y1 + m * dx, c = y1 - m * x1;
        return {
          statement: R`<p>Find the equation $y = mx + c$ of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$. ${exprHint}</p>`,
          part: { kind: 'expression', variable: 'x', answer: `${m}*x + (${c})`, domain: [-3, 3] },
          steps: [
            { do: R`$m = \frac{${y2} - ${P(y1)}}{${x2} - ${P(x1)}} = \frac{${m * dx}}{${dx}} = ${m}$`, why: 'Slope = rise over run.' },
            { do: R`$${y1} = ${m}\cdot ${P(x1)} + c$`, why: R`The point $(${x1}, ${y1})$ is on the line, so put $x = ${x1}$, $y = ${y1}$ into $y = ${coef(m, 'x')} + c$.` },
            { do: R`$${y1} = ${m * x1} + c$`, why: 'Multiply.' },
            { do: R`$c = ${y1} - ${P(m * x1)} = ${c}$`, why: m * x1 > 0 ? R`Subtract $${m * x1}$ from both sides.` : R`Add $${-m * x1}$ to both sides (subtracting $${m * x1}$).` },
            { do: R`$y = ${poly([m, c])}$`, why: 'Put m and c into y = mx + c.' },
          ],
          hints: ['Find the slope first.', 'Then put one of the points into y = mx + c to find c.'],
        };
      }
      const x1 = r.nz(-5, 5), y1 = r.int(-6, 6), m = r.nz(-5, 5), c = y1 - m * x1;
      return {
        statement: R`<p>A line has slope $${m}$ and passes through $(${x1}, ${y1})$. Find its equation $y = mx + c$. ${exprHint}</p>`,
        part: { kind: 'expression', variable: 'x', answer: `${m}*x + (${c})`, domain: [-3, 3] },
        steps: [
          { do: R`$y - ${P(y1)} = ${coef(m, `(x - ${P(x1)})`)}$`, why: R`Point-slope form: $y - y_1 = m(x - x_1)$.` },
          { do: R`$y - ${P(y1)} = ${coef(m, 'x')} ${signed(-m * x1)}$`, why: R`Multiply out the bracket: $${m}\cdot ${P(-x1)} = ${-m * x1}$.` },
          { do: R`$y = ${coef(m, 'x')} ${signed(-m * x1)} ${signed(y1)}$`, why: y1 === 0 ? 'Nothing to move: the y-value is 0.' : R`${y1 > 0 ? 'Add' : 'Subtract'} $${Math.abs(y1)}$ ${y1 > 0 ? 'to' : 'from'} both sides.` },
          { do: R`$y = ${poly([m, c])}$`, why: 'Combine the numbers.' },
        ],
        hints: [R`Use $y - y_1 = m(x - x_1)$.`, 'Multiply out the bracket, then get y alone.'],
      };
    },
  },
  {
    id: 'alg-logs', title: 'Exponentials and logarithms', area: 'foundations', family: 'logs-trig', method: 'Log rules; ln undoes e^',
    prereqs: ['alg-exp-rules'], blurb: 'Use log rules and solve equations like e^(kx) = a.',
    gen(r) {
      const form = r.pick(['solve', 'base', 'combine', 'inverse']);
      if (form === 'solve') {
        const k = r.pick([2, 3, 4, 5, -2, -3]), a = r.int(2, 9), c = r.pick([1, 1, 2, 3, 5]), kx = coef(k, 'x');
        const eq = R`${c === 1 ? '' : c}e^{${kx}} = ${c * a}`, val = Math.log(a) / k;
        return {
          statement: R`<p>Solve $${eq}$ for $x$. Enter the exact answer, e.g. <code>log(5)/2</code> (in MATLAB <code>log</code> is ln), or a decimal with 3 decimals.</p>`,
          part: { kind: 'numeric', answer: `log(${a})/(${k})`, tol: 1e-3 },
          steps: [
            ...(c === 1 ? [] : [{ do: R`$e^{${kx}} = ${a}$`, why: R`Divide both sides by $${c}$ so the $e$ part is alone.` }]),
            { do: R`$\ln\left(e^{${kx}}\right) = \ln ${a}$`, why: R`Take $\ln$ of both sides: $\ln$ is the inverse of $e^{(\ldots)}$.` },
            { do: R`$${kx} = \ln ${a}$`, why: R`$\ln\left(e^{\text{something}}\right) = \text{something}$.` },
            { do: R`$x = \frac{\ln ${a}}{${k}} \approx ${val.toFixed(3)}$`, why: R`Divide both sides by $${k}$.` },
          ],
          hints: [R`Get the $e$ part alone, then take $\ln$ of both sides.`, R`$\ln(e^{y}) = y$.`],
        };
      }
      if (form === 'base') {
        const b = r.pick([2, 3, 10]), plus = r.next() < 0.5;
        const mx = { 2: 6, 3: 4, 10: 4 }[b];
        let p, q;
        if (plus) { p = r.int(1, b === 2 ? 4 : 2); q = r.int(1, b === 2 ? 4 : 2); } else { p = r.int(3, mx); q = r.int(1, p - 2); }
        const X = b ** p, Y = b ** q, n = plus ? p + q : p - q, Z = plus ? X * Y : X / Y, L = R`\log_{${b}}`;
        return {
          statement: R`<p>Evaluate $${L} ${X} ${plus ? '+' : '-'} ${L} ${Y}$ without a calculator. Enter a number.</p>`,
          part: { kind: 'numeric', answer: String(n), tol: 1e-9 },
          steps: [
            { do: R`$${L} ${X} ${plus ? '+' : '-'} ${L} ${Y} = ${L}\left(${plus ? R`${X}\cdot ${Y}` : R`\frac{${X}}{${Y}}`}\right)$`, why: plus ? R`Product rule: $\log A + \log B = \log(A\cdot B)$.` : R`Quotient rule: $\log A - \log B = \log\frac{A}{B}$.` },
            { do: R`$= ${L} ${Z}$`, why: plus ? R`$${X}\cdot ${Y} = ${Z}$.` : R`$${X} \div ${Y} = ${Z}$.` },
            { do: R`$= ${L}\left(${b}^{${n}}\right)$`, why: R`$${b}^{${n}} = ${Z}$.` },
            { do: R`$= ${n}$`, why: R`$${L} N$ asks "what power of $${b}$ gives $N$?", so $${L}(${b}^{${n}}) = ${n}$.` },
          ],
          hints: [plus ? 'Adding logs (same base) is the log of a product.' : 'Subtracting logs (same base) is the log of a quotient.', R`Write the result as a power of $${b}$.`],
        };
      }
      if (form === 'combine') {
        const a = r.pick([2, 3]), p = a === 2 ? r.pick([2, 3, 5]) : r.pick([2, 3]), pa = p ** a, plus = r.next() < 0.5;
        const q = plus ? r.int(2, 7) : r.pick([...Array(pa).keys()].filter((d) => d > 1 && d < pa && pa % d === 0)), N = plus ? pa * q : pa / q;
        return {
          statement: R`<p>Write $${a}\ln ${p} ${plus ? '+' : '-'} \ln ${q}$ as a single logarithm $\ln N$. Enter $N$.</p>`,
          part: { kind: 'numeric', answer: String(N), tol: 1e-9 },
          steps: [
            { do: R`$${a}\ln ${p} = \ln\left(${p}^{${a}}\right) = \ln ${pa}$`, why: R`Power rule: $n\ln A = \ln\left(A^{n}\right)$. Do this first.` },
            { do: R`$\ln ${pa} ${plus ? '+' : '-'} \ln ${q} = \ln\left(${plus ? R`${pa}\cdot ${q}` : R`\frac{${pa}}{${q}}`}\right)$`, why: plus ? R`Product rule: $\ln A + \ln B = \ln(A\cdot B)$.` : R`Quotient rule: $\ln A - \ln B = \ln\frac{A}{B}$.` },
            { do: R`$= \ln ${N}$`, why: plus ? R`$${pa}\cdot ${q} = ${N}$.` : R`$${pa} \div ${q} = ${N}$.` },
          ],
          hints: ['Move the number in front up into a power first.', 'Then add logs = multiply inside, subtract logs = divide inside.'],
        };
      }
      const a = r.int(2, 9), b = r.int(2, 9);
      return {
        statement: R`<p>Evaluate $\ln\left(e^{${a}}\right) - \ln 1 + e^{\ln ${b}}$ without a calculator. Enter a number.</p>`,
        part: { kind: 'numeric', answer: String(a + b), tol: 1e-9 },
        steps: [
          { do: R`$\ln\left(e^{${a}}\right) = ${a}$`, why: R`$\ln$ and $e^{(\ldots)}$ undo each other.` },
          { do: R`$\ln 1 = 0$`, why: R`$e^{0} = 1$, so the power of $e$ that gives 1 is 0.` },
          { do: R`$e^{\ln ${b}} = ${b}$`, why: R`$e^{(\ldots)}$ undoes $\ln$ too.` },
          { do: R`$${a} - 0 + ${b} = ${a + b}$`, why: 'Put the pieces together.' },
        ],
        hints: [R`$\ln$ is the inverse of $e^{x}$: they cancel.`, R`$\ln(e^{y}) = y$, $e^{\ln y} = y$, and $\ln 1 = 0$.`],
      };
    },
  },
  {
    id: 'alg-trig-values', title: 'Exact trig values and radians', area: 'foundations', family: 'logs-trig', method: 'Read values off the unit circle',
    prereqs: ['alg-frac-mul'], blurb: 'Exact sin, cos and tan at special angles, and converting radians and degrees.',
    gen(r) {
      const form = r.pick(['value', 'value', 'toRad', 'toDeg']);
      if (form === 'toRad' || form === 'toDeg') {
        const deg = r.pick([15, 30, 45, 60, 75, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360]), g = gcd(deg, 180), f = frac(deg, 180), rad = radTex(deg);
        if (form === 'toRad') return {
          statement: R`<p>Convert $${deg}^\circ$ to radians. Enter the exact value in terms of <code>pi</code>, e.g. <code>3*pi/4</code>.</p>`,
          part: { kind: 'numeric', answer: `${f.n}*pi/${f.d}`, tol: 1e-6 },
          steps: [
            { do: R`$${deg}^\circ = ${deg}\cdot\frac{\pi}{180}$`, why: R`$180^\circ = \pi$ radians, so $1^\circ = \frac{\pi}{180}$.` },
            { do: R`$= \frac{${deg}\pi}{180}$`, why: 'Multiply.' },
            { do: R`$= ${rad}$`, why: R`Cancel the common factor $${g}$ from top and bottom.` },
          ],
          hints: [R`$180^\circ = \pi$.`, R`Multiply by $\frac{\pi}{180}$ and simplify.`],
        };
        return {
          statement: R`<p>Convert $${rad}$ radians to degrees. Enter a number of degrees.</p>`,
          part: { kind: 'numeric', answer: String(deg), tol: 1e-9 },
          steps: [
            { do: R`$${rad} = ${rad}\cdot\frac{180^\circ}{\pi}$`, why: R`$\pi$ radians $= 180^\circ$, so multiply by $\frac{180^\circ}{\pi}$.` },
            { do: f.d === 1 ? R`$= ${f.n}\cdot 180^\circ$` : R`$= \frac{${f.n}\cdot 180^\circ}{${f.d}}$`, why: R`The $\pi$ on top and bottom cancel.` },
            { do: R`$= ${deg}^\circ$`, why: R`$${f.n}\cdot 180 = ${f.n * 180}$` + (f.d === 1 ? '.' : R`, and $${f.n * 180} \div ${f.d} = ${deg}$.`) },
          ],
          hints: [R`$\pi = 180^\circ$.`, R`Replace $\pi$ by $180^\circ$ and simplify.`],
        };
      }
      const fn = r.pick(['sin', 'cos', 'tan']);
      const degs = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].filter((d) => fn !== 'tan' || d % 180 !== 90);
      const deg = r.pick(degs), th = (deg * Math.PI) / 180, rad = radTex(deg);
      const cl = (v) => (Math.abs(v) < 1e-9 ? 0 : v), S = cl(Math.sin(th)), C = cl(Math.cos(th)), V = cl({ sin: S, cos: C, tan: S / C }[fn]);
      const vT = trigTex(V), fT = '\\' + fn, sT = trigTex(S), cT = trigTex(C);
      const quad = deg % 90 === 0 ? 0 : Math.floor(deg / 90) + 1, ref = [deg, 180 - deg, deg - 180, 360 - deg][quad ? quad - 1 : 0];
      const refExpr = ['', R`180^\circ - ${deg}^\circ`, R`${deg}^\circ - 180^\circ`, R`360^\circ - ${deg}^\circ`][quad ? quad - 1 : 0];
      const pool = r.shuffle(fn === 'tan' ? ['0', R`\frac{\sqrt{3}}{3}`, '1', R`\sqrt{3}`, R`-\frac{\sqrt{3}}{3}`, '-1', R`-\sqrt{3}`]
        : ['0', R`\frac{1}{2}`, R`\frac{\sqrt{2}}{2}`, R`\frac{\sqrt{3}}{2}`, '1', R`-\frac{1}{2}`, R`-\frac{\sqrt{2}}{2}`, R`-\frac{\sqrt{3}}{2}`, '-1']);
      const neg = (t) => (t === '0' ? '0' : t.startsWith('-') ? t.slice(1) : '-' + t);
      const other = fn === 'sin' ? cT : fn === 'cos' ? sT : V === 0 ? '1' : trigTex(1 / V);
      const sign = (v) => (v > 0 ? 'positive' : 'negative');
      return {
        statement: R`<p>Find the exact value of $${fT}\left(${rad}\right)$.</p>`,
        part: choice(r, m$(vT), [neg(vT), other, ...pool].map(m$)),
        steps: [
          { do: deg === 0 ? R`$\theta = 0 = 0^\circ$` : R`$${rad} = ${rad}\cdot\frac{180^\circ}{\pi} = ${deg}^\circ$`, why: R`Convert to degrees: $\pi$ radians $= 180^\circ$.` },
          ...(quad ? [{ do: R`$\text{reference angle} = ${quad === 1 ? '' : R`${refExpr} = `}${ref}^\circ$`, why: quad === 1 ? 'The angle is in quadrant I, so it is its own reference angle.' : R`The angle is in quadrant ${['', 'I', 'II', 'III', 'IV'][quad]}. Its angle to the nearest x-axis is $${ref}^\circ$, so the values have the same size as at $${ref}^\circ$.` }] : []),
          { do: R`$\left(\cos ${deg}^\circ, \sin ${deg}^\circ\right) = \left(${cT}, ${sT}\right)$`, why: quad
            ? R`The unit-circle point is $(\cos\theta, \sin\theta)$. At $${ref}^\circ$ the special triangle gives $\cos = ${trigTex(Math.cos((ref * Math.PI) / 180))}$, $\sin = ${trigTex(Math.sin((ref * Math.PI) / 180))}$; in quadrant ${['', 'I', 'II', 'III', 'IV'][quad]} cos is ${sign(C)} and sin is ${sign(S)}.`
            : R`The unit-circle point is $(\cos\theta, \sin\theta)$. At $${deg}^\circ$ it lies on an axis, one unit from the centre.` },
          ...(fn === 'tan' ? [{ do: R`$\tan ${deg}^\circ = \frac{\sin ${deg}^\circ}{\cos ${deg}^\circ} = \frac{${sT}}{${cT}} = ${vT}$`, why: R`$\tan\theta = \frac{\sin\theta}{\cos\theta}$.` + (ref === 30 || ref === 60 ? R` The 2s cancel; $\frac{1}{\sqrt{3}} = \frac{\sqrt{3}}{3}$.` : ref === 45 ? ' Top and bottom have the same size.' : '') }] : []),
          { do: R`$${fT}\left(${rad}\right) = ${vT}$`, why: fn === 'tan' ? 'That is the value.' : `${fn === 'sin' ? 'Sine is the y-coordinate' : 'Cosine is the x-coordinate'} of the point.` },
        ],
        hints: ['Convert to degrees and picture the point on the unit circle.', R`Use the reference angle ($30^\circ$, $45^\circ$ or $60^\circ$) for the size and the quadrant for the sign.`],
      };
    },
  },
];
