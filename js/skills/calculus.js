// Calculus skill generators, each tied to a module. Format: see ./index.js.

import { coef, signed, poly, frac, fracTex, fracM } from './index.js';

// ---- private TeX helpers
const par = (n) => (n < 0 ? `(${n})` : `${n}`);                                  // bracket negatives: (-3)
const lin = (a, v = 'x') => (a === 0 ? v : a > 0 ? `${v} - ${a}` : `${v} + ${-a}`); // x - a
const subLin = (x, a) => (a === 0 ? `${x}` : `${x} ${a > 0 ? '-' : '+'} ${Math.abs(a)}`); // x - a with x a number: '-2 + 4'
const xp = (p) => (p === 1 ? 'x' : String.raw`x^{${p}}`);                        // x, x^{3}
// reduced fraction n/d in front of body: ct(3,6,'x') '\frac{1}{2}x', ct(-2,1,'x') '-2x', ct(1,1,'x') 'x'
function ct(n, d, body, dot = false) {
  const f = frac(n, d);
  if (f.n === 0) return '0';
  const sign = f.n < 0 ? '-' : '', a = Math.abs(f.n);
  if (a === 1 && f.d === 1) return sign + body;
  return sign + (f.d === 1 ? String(a) : String.raw`\frac{${a}}{${f.d}}`) + (dot ? String.raw`\cdot ` : '') + body;
}
// a sum of numbers: [6, -2, 0, 3] '6 - 2 + 3'
function sumTex(vals) {
  const v = vals.filter((x) => x !== 0);
  return v.length ? [String(v[0]), ...v.slice(1).map((x) => signed(x))].join(' ') : '0';
}
// substitute x = a into a polynomial (coefficients high → low), showing every step
function evalPoly(cs, a) {
  const n = cs.length - 1, terms = [], vals = [];
  let total = 0;
  cs.forEach((c, i) => {
    if (!c) return;
    const k = n - i, v = c * a ** k, ac = Math.abs(c);
    total += v;
    // c = -1 keeps '1\cdot' so '-1\cdot 3^{2}' cannot be misread as (-3)^2
    const body = k === 0 ? String(ac) : (c === 1 ? '' : String.raw`${ac}\cdot `) + (k === 1 ? par(a) : String.raw`${par(a)}^{${k}}`);
    terms.push((c < 0 ? (terms.length ? '- ' : '-') : (terms.length ? '+ ' : '')) + body);
    vals.push(v);
  });
  const parts = [terms.join(' ') || '0', sumTex(vals), String(total)];
  const uniq = parts.filter((s, i) => parts.indexOf(s) === i);
  return { tex: uniq.join(' = '), plusC: uniq.map((s) => `${s} + C`).join(' = '), val: total };
}
// term-by-term antiderivative of p x^2 + q x + s shown as fractions: '\frac{3}{3}x^{3} - \frac{4}{2}x^{2} + 5x'
function antiTex(p, q, s) {
  const out = [];
  [[p, 3, 3], [q, 2, 2], [s, 1, 1]].forEach(([c, d, k]) => {
    if (!c) return;
    const sign = c < 0 ? (out.length ? '- ' : '-') : (out.length ? '+ ' : '');
    out.push(sign + (d === 1 ? coef(Math.abs(c), xp(k)) : String.raw`\frac{${Math.abs(c)}}{${d}}` + xp(k)));
  });
  return out.join(' ') || '0';
}
// number with sign in front of a fraction bar: fx(-3,'x') '-\frac{3}{x}'
const fx = (n, den) => String.raw`${n < 0 ? '-' : ''}\frac{${Math.abs(n)}}{${den}}`;
const texPar = (t) => (t.startsWith('-') ? String.raw`\left(${t}\right)` : t);

const SYN = String.raw`MATLAB syntax: <code>*</code> for every multiplication, <code>^</code> for powers, <code>exp(x)</code> for $e^x$, <code>log(x)</code> for $\ln x$, <code>sqrt(x)</code> for $\sqrt{x}$.`;
const ANTI = String.raw`Enter one antiderivative $F(x)$ (you may leave out $+\,C$). ${SYN}`;
const NUM = 'Enter a number; a fraction like <code>-3/4</code> is fine.';

export default [
  // ---------------------------------------------------------------- limits
  {
    id: 'calc-limit-factor', title: 'Limit by factoring', area: 'calculus', module: 'limits', lesson: 'factoring-limits', family: 'limits', method: 'Factor and cancel',
    prereqs: ['alg-factor-quad'], blurb: 'A 0/0 limit of a fraction: factor, cancel the common bracket, then substitute.',
    gen(r) {
      const a = r.nz(-5, 5);
      let b; do b = r.nz(-6, 6); while (b === a);
      const two = r.next() < 0.5;
      let c = 0; if (two) do c = r.nz(-6, 6); while (c === a || c === b);
      const N = [1, -(a + b), a * b], D = two ? [1, -(a + c), a * c] : [1, -a];
      const fa = `(${lin(a)})`, fb = `(${lin(b)})`, fc = `(${lin(c)})`;
      const after = two ? String.raw`\frac{${lin(b)}}{${lin(c)}}` : lin(b);
      const ans = two ? String.raw`\frac{${subLin(a, b)}}{${subLin(a, c)}} = \frac{${a - b}}{${a - c}}${fracTex(a - b, a - c) !== String.raw`\frac{${a - b}}{${a - c}}` ? ` = ${fracTex(a - b, a - c)}` : ''}` : `${subLin(a, b)} = ${a - b}`;
      const steps = [
        { do: String.raw`Top at $x = ${a}$: $${evalPoly(N, a).tex}$`, why: 'Always try substituting first.' },
        { do: String.raw`Bottom at $x = ${a}$: $${evalPoly(D, a).tex}$`, why: String.raw`We get $\frac{0}{0}$, which has no value. It means $${lin(a)}$ is hiding in both top and bottom, so we simplify first.` },
        { do: String.raw`$${poly(N)} = ${fa}${fb}$`, why: String.raw`Factor the top: we need two numbers that add to $${-(a + b)}$ and multiply to $${a * b}$. They are $${-a}$ and $${-b}$: $${-a} + ${par(-b)} = ${-(a + b)}$ and $${par(-a)}\cdot ${par(-b)} = ${a * b}$.` },
      ];
      if (two) steps.push({ do: String.raw`$${poly(D)} = ${fa}${fc}$`, why: String.raw`Factor the bottom the same way: $${-a} + ${par(-c)} = ${-(a + c)}$ and $${par(-a)}\cdot ${par(-c)} = ${a * c}$.` });
      steps.push(
        { do: String.raw`$\frac{${fa}${fb}}{${fa}${two ? fc : ''}} = ${after}$`, why: String.raw`Cancel the common bracket. This is allowed because in a limit $x$ only gets close to $${a}$, never equals it, so $${lin(a)} \neq 0$.` },
        { do: String.raw`$\lim_{x \to ${a}} ${after} = ${ans}$`, why: String.raw`Now substitution works: put $x = ${a}$.` },
      );
      return {
        statement: String.raw`<p>Find $\displaystyle\lim_{x \to ${a}} \frac{${poly(N)}}{${poly(D)}}$. ${NUM}</p>`,
        part: { kind: 'numeric', answer: fracM(a - b, two ? a - c : 1) },
        steps,
        hints: [String.raw`Try $x = ${a}$ first. What do you get?`, String.raw`$\frac{0}{0}$ means a common factor $${lin(a)}$. Factor and cancel it.`, String.raw`The top factors as $${fa}${fb}$.`],
      };
    },
  },
  {
    id: 'calc-limit-infinity', title: 'Limit at infinity of a rational function', area: 'calculus', module: 'limits', lesson: 'limit-laws-infinity', family: 'limits', method: 'Divide by the highest power',
    prereqs: ['alg-frac-mul', 'alg-exp-rules'], blurb: 'Divide top and bottom by the highest power of x in the bottom.',
    gen(r) {
      const form = r.pick(['22', '11', '12']);
      const k = form === '11' ? 1 : 2;
      const N = form === '22' ? [r.nz(-7, 7), r.int(-6, 6), r.int(-9, 9)] : [r.nz(-7, 7), r.int(-9, 9)];
      const D = form === '11' ? [r.nz(-6, 6), r.int(-9, 9)] : [r.nz(-6, 6), r.int(-6, 6), r.int(-9, 9)];
      const div = (cs) => {
        const n = cs.length - 1, out = [];
        cs.forEach((c, i) => {
          if (!c) return;
          const j = n - i, sign = c < 0 ? (out.length ? '- ' : '-') : (out.length ? '+ ' : '');
          out.push(sign + (j === k ? `${Math.abs(c)}` : String.raw`\frac{${Math.abs(c)}}{${xp(k - j)}}`));
        });
        return out.join(' ');
      };
      const top = N.length - 1 === k ? N[0] : 0, d = D[0];
      return {
        statement: String.raw`<p>Find $\displaystyle\lim_{x \to \infty} \frac{${poly(N)}}{${poly(D)}}$. ${NUM}</p>`,
        part: { kind: 'numeric', answer: fracM(top, d) },
        steps: [
          { do: String.raw`Highest power in the bottom: $${xp(k)}$`, why: 'For very large x the highest power dominates; dividing by it turns every other term into something that shrinks to 0.' },
          { do: String.raw`$\frac{${poly(N)}}{${poly(D)}} = \frac{${div(N)}}{${div(D)}}$`, why: String.raw`Divide every term, top and bottom, by $${xp(k)}$. Dividing top and bottom by the same thing does not change the fraction.` },
          { do: String.raw`$\frac{\text{number}}{x} \to 0, \quad \frac{\text{number}}{x^{2}} \to 0$`, why: 'A fixed number divided by a huge number is almost 0.' },
          { do: String.raw`$\lim_{x\to\infty} = \frac{${top}}{${d}}$`, why: 'Only the terms without x are left.' },
          { do: String.raw`$= ${fracTex(top, d)}$`, why: top ? 'Simplify the fraction.' : '0 divided by a nonzero number is 0.' },
        ],
        hints: ['Which power of x grows fastest in the bottom?', String.raw`Divide every term by $${xp(k)}$.`, String.raw`Every term like $\frac{5}{x}$ goes to 0 as $x \to \infty$.`],
      };
    },
  },
  {
    id: 'calc-lhopital', title: "L'Hôpital's rule", area: 'calculus', module: 'derivative-apps', lesson: 'lhopital', family: 'limits', method: "L'Hôpital's rule",
    prereqs: ['calc-chain-rule'], blurb: 'A 0/0 limit that will not factor: differentiate top and bottom separately.',
    gen(r) {
      const form = r.pick(['exp', 'sin', 'cos']);
      const lh = String.raw`L'Hôpital's rule: if substituting gives $\frac{0}{0}$, then $\lim \frac{f}{g} = \lim \frac{f'}{g'}$ (differentiate top and bottom separately, not as a quotient).`;
      if (form === 'cos') {
        const k = r.int(2, 5), kx = coef(k, 'x');
        return {
          statement: String.raw`<p>Find $\displaystyle\lim_{x \to 0} \frac{1 - \cos(${kx})}{x^2}$. ${NUM}</p>`,
          part: { kind: 'numeric', answer: fracM(k * k, 2) },
          steps: [
            { do: String.raw`$\frac{1 - \cos 0}{0^2} = \frac{1 - 1}{0} = \frac{0}{0}$`, why: 'Substitute first: 0/0, and this does not factor.' },
            { do: String.raw`$\lim_{x\to 0} \frac{${coef(k, `\\sin(${kx})`)}}{2x}$`, why: String.raw`${lh} Top: $\frac{d}{dx}(1 - \cos(${kx})) = ${coef(k, `\\sin(${kx})`)}$. Bottom: $\frac{d}{dx}x^2 = 2x$.` },
            { do: String.raw`$\frac{${coef(k, '\\sin 0')}}{2\cdot 0} = \frac{0}{0}$`, why: 'Substitute again: still 0/0, so use the rule a second time.' },
            { do: String.raw`$\lim_{x\to 0} \frac{${coef(k * k, `\\cos(${kx})`)}}{2}$`, why: String.raw`Top: $\frac{d}{dx}${coef(k, `\\sin(${kx})`)} = ${k}\cdot ${k}\cos(${kx}) = ${coef(k * k, `\\cos(${kx})`)}$. Bottom: $\frac{d}{dx}2x = 2$.` },
            { do: String.raw`$\frac{${k * k}\cdot\cos 0}{2} = \frac{${k * k}\cdot 1}{2} = ${fracTex(k * k, 2)}$`, why: String.raw`Now substitution works; $\cos 0 = 1$.` },
          ],
          hints: ['Substitute x = 0 first.', "0/0 and nothing to factor: L'Hôpital. You may need it twice.", String.raw`After one step: $\frac{${coef(k, `\\sin(${kx})`)}}{2x}$.`],
        };
      }
      const k = form === 'exp' ? r.pick([-3, -2, 2, 3, 4, 5]) : r.int(2, 6), m = r.int(1, 5), kx = coef(k, 'x');
      const f = form === 'exp' ? String.raw`e^{${kx}} - 1` : String.raw`\sin(${kx})`;
      const f0 = form === 'exp' ? String.raw`e^{0} - 1 = 1 - 1 = 0` : String.raw`\sin 0 = 0`;
      const df = form === 'exp' ? coef(k, `e^{${kx}}`) : coef(k, String.raw`\cos(${kx})`);
      const at0 = form === 'exp' ? String.raw`${k}\cdot e^{0}` : String.raw`${k}\cdot \cos 0`;
      return {
        statement: String.raw`<p>Find $\displaystyle\lim_{x \to 0} \frac{${f}}{${coef(m, 'x')}}$. ${NUM}</p>`,
        part: { kind: 'numeric', answer: fracM(k, m) },
        steps: [
          { do: String.raw`Top: $${f0}$, bottom: $${m}\cdot 0 = 0$`, why: 'Substitute first: 0/0, and this does not factor.' },
          { do: String.raw`$\lim \frac{f}{g} = \lim \frac{f'}{g'}$`, why: lh },
          { do: String.raw`$f'(x) = ${df}, \quad g'(x) = ${m}$`, why: form === 'exp' ? String.raw`$\frac{d}{dx}e^{${kx}} = ${df}$ (chain rule: the inside $${kx}$ has derivative $${k}$); the $-1$ is a constant, derivative 0.` : String.raw`$\frac{d}{dx}\sin(${kx}) = ${df}$ (chain rule: the inside has derivative $${k}$).` },
          { do: String.raw`$\lim_{x\to 0} \frac{${df}}{${m}} = \frac{${at0}}{${m}}$`, why: 'Now substitution works.' },
          { do: String.raw`$= \frac{${k}\cdot 1}{${m}} = ${fracTex(k, m)}$`, why: form === 'exp' ? '$e^0 = 1$.' : String.raw`$\cos 0 = 1$.` },
        ],
        hints: ['Substitute x = 0 first.', "0/0 and nothing to factor: differentiate top and bottom separately (L'Hôpital).", String.raw`The top's derivative is $${df}$.`],
      };
    },
  },

  // ---------------------------------------------------------------- derivatives
  {
    id: 'calc-power-rule', title: 'Power rule', area: 'calculus', module: 'derivatives', lesson: 'power-rule', family: 'derivative-rules', method: 'Power rule on each term',
    prereqs: ['alg-exp-rules', 'alg-exp-neg-frac'], blurb: 'Differentiate a polynomial term by term.',
    gen(r) {
      const n = r.int(3, 5), a = r.nz(-4, 5), b = r.nz(-6, 6), c = r.nz(-9, 9);
      const f = poly([a, ...Array(n - 2).fill(0), b, c]);
      return {
        statement: String.raw`<p>Differentiate $f(x) = ${f}$. Enter $f'(x)$ in MATLAB syntax, e.g. <code>3*x^2 - 2</code>.</p>`,
        part: { kind: 'expression', variable: 'x', answer: `${a * n}*x^${n - 1} + (${b})`, domain: [-2, 2] },
        steps: [
          { do: String.raw`$f(x) = ${f}$`, why: 'Differentiate term by term: the derivative of a sum is the sum of the derivatives.' },
          { do: String.raw`$\frac{d}{dx}\,${coef(a, `x^{${n}}`)} = ${a}\cdot ${n}\,x^{${n - 1}} = ${coef(a * n, `x^{${n - 1}}`)}$`, why: String.raw`Power rule: $\frac{d}{dx}x^n = n\,x^{n-1}$; a constant factor stays in front.` },
          { do: String.raw`$\frac{d}{dx}\,${coef(b, 'x')} = ${b}$`, why: String.raw`$\frac{d}{dx}x = 1$.` },
          { do: String.raw`$\frac{d}{dx}\,(${c}) = 0$`, why: 'A constant does not change, so its derivative is 0.' },
          { do: String.raw`$f'(x) = ${poly([a * n, ...Array(n - 2).fill(0), b])}$`, why: 'Add the pieces.' },
        ],
        hints: ['Work on one term at a time.', String.raw`Power rule: bring the power down in front, then lower the power by 1: $x^n \to n x^{n-1}$.`, String.raw`The constant $${c}$ disappears.`],
      };
    },
  },
  {
    id: 'calc-product-rule', title: 'Product rule', area: 'calculus', module: 'derivatives', lesson: 'product-rule', family: 'derivative-rules', method: 'Product rule',
    prereqs: ['calc-power-rule'], blurb: 'Differentiate a product of two different kinds of function.',
    gen(r) {
      const form = r.pick(['exp', 'sin', 'ln']), n = r.int(2, 4);
      let v, dv, ans, m, dom, vWhy, M;
      if (form === 'exp') {
        const k = r.pick([-2, -1, 1, 2, 3]), E = String.raw`e^{${coef(k, 'x')}}`;
        v = E; dv = coef(k, E); vWhy = String.raw`$\frac{d}{dx}e^{kx} = k\,e^{kx}$.`;
        m = String.raw`${xp(n)}\cdot ${k < 0 ? `(${dv})` : dv}`;
        ans = String.raw`${coef(n, xp(n - 1))}${E} ${signed(k, xp(n) + E)}`;
        dom = [-1.5, 1.5];
        M = `${n}*x^${n - 1}*exp(${k}*x) + (${k})*x^${n}*exp(${k}*x)`;
      } else if (form === 'sin') {
        const k = r.int(1, 4), kx = coef(k, 'x');
        v = String.raw`\sin(${kx})`; dv = coef(k, String.raw`\cos(${kx})`); vWhy = String.raw`$\frac{d}{dx}\sin(kx) = k\cos(kx)$.`;
        m = String.raw`${xp(n)}\cdot ${dv}`;
        ans = String.raw`${coef(n, xp(n - 1))}\sin(${kx}) + ${coef(k, xp(n))}\cos(${kx})`;
        dom = [-2, 2];
        M = `${n}*x^${n - 1}*sin(${k}*x) + ${k}*x^${n}*cos(${k}*x)`;
      } else {
        v = String.raw`\ln x`; dv = String.raw`\frac{1}{x}`; vWhy = String.raw`$\frac{d}{dx}\ln x = \frac{1}{x}$.`;
        m = String.raw`${xp(n)}\cdot \frac{1}{x}`;
        ans = String.raw`${coef(n, xp(n - 1))}\ln x + ${xp(n - 1)}`;
        dom = [0.3, 3];
        M = `${n}*x^${n - 1}*log(x) + x^${n - 1}`;
      }
      const f = xp(n) + (form === 'ln' ? String.raw`\ln x` : v);
      const steps = [
        { do: String.raw`$u = ${xp(n)}, \quad v = ${v}$`, why: 'The function is one thing times another: call them u and v.' },
        { do: String.raw`$u' = ${coef(n, xp(n - 1))}, \quad v' = ${dv}$`, why: String.raw`Power rule for $u$. ${vWhy}` },
        { do: String.raw`$f'(x) = u'v + uv'$`, why: 'Product rule: (derivative of the first) times the second, plus the first times (derivative of the second).' },
        { do: String.raw`$f'(x) = ${coef(n, xp(n - 1))}\cdot ${v} + ${m}$`, why: 'Substitute u, u\', v, v\'.' },
        { do: String.raw`$f'(x) = ${ans}$`, why: form === 'ln' ? String.raw`Tidy up: $${xp(n)}\cdot\frac{1}{x} = ${xp(n - 1)}$ (one x cancels).` : 'Tidy up: put the numbers in front.' },
      ];
      return {
        statement: String.raw`<p>Differentiate $f(x) = ${f}$. Enter $f'(x)$. ${SYN}</p>`,
        part: { kind: 'expression', variable: 'x', answer: M, domain: dom },
        steps,
        hints: ['This is a product of two different functions.', String.raw`Product rule: $(uv)' = u'v + uv'$.`, String.raw`Take $u = ${xp(n)}$ and $v = ${v}$.`],
      };
    },
  },
  {
    id: 'calc-quotient-rule', title: 'Quotient rule', area: 'calculus', module: 'derivatives', lesson: 'quotient-rule', family: 'derivative-rules', method: 'Quotient rule',
    prereqs: ['calc-power-rule', 'alg-expand'], blurb: 'Differentiate one function divided by another.',
    gen(r) {
      const form = r.pick(['lin', 'lin', 'xsq', 'sqx']);
      const qr = String.raw`Quotient rule: $\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}$ ("low d-high minus high d-low, over low squared").`;
      let U, V, dU, dV, sub, exp1, res, M, dom, lastWhy;
      if (form === 'lin') {
        let a, b, c, d;
        do { a = r.nz(-4, 5); b = r.nz(-6, 6); c = r.int(1, 4); d = r.nz(-6, 6); } while (a * d - b * c === 0);
        U = poly([a, b]); V = poly([c, d]); dU = `${a}`; dV = `${c}`;
        const aV = a === 1 ? `(${V})` : a === -1 ? `-(${V})` : `${a}(${V})`;
        sub = String.raw`\frac{${aV} - (${U})\cdot ${c}}{(${V})^2}`;
        exp1 = String.raw`\frac{(${poly([a * c, a * d])}) - (${poly([a * c, b * c])})}{(${V})^2}`;
        res = String.raw`\frac{${a * d} - ${par(b * c)}}{(${V})^2} = \frac{${a * d - b * c}}{(${V})^2}`;
        M = `(${a * d - b * c})./(${c}*x + (${d})).^2`;
        const x0 = -d / c; dom = [x0 + 0.3, x0 + 3];
        lastWhy = String.raw`The $${coef(a * c, 'x')}$ terms cancel; subtract the numbers.`;
      } else if (form === 'sqx') {
        const b = r.int(1, 9);
        U = 'x'; V = `x^2 + ${b}`; dU = '1'; dV = '2x';
        sub = String.raw`\frac{1\cdot (${V}) - x\cdot 2x}{(${V})^2}`;
        exp1 = String.raw`\frac{x^2 + ${b} - 2x^2}{(${V})^2}`;
        res = String.raw`\frac{${b} - x^2}{(${V})^2}`;
        M = `(${b} - x.^2)./(x.^2 + ${b}).^2`; dom = [-2, 2];
        lastWhy = String.raw`Collect: $x^2 - 2x^2 = -x^2$.`;
      } else {
        const d = r.nz(-5, 5);
        U = 'x^2'; V = poly([1, d]); dU = '2x'; dV = '1';
        sub = String.raw`\frac{2x(${V}) - x^2\cdot 1}{(${V})^2}`;
        exp1 = String.raw`\frac{${poly([2, 2 * d, 0])} - x^2}{(${V})^2}`;
        res = String.raw`\frac{${poly([1, 2 * d, 0])}}{(${V})^2}`;
        M = `(x.^2 + (${2 * d})*x)./(x + (${d})).^2`; dom = [-d + 0.3, -d + 3];
        lastWhy = String.raw`Collect: $2x^2 - x^2 = x^2$.`;
      }
      return {
        statement: String.raw`<p>Differentiate $f(x) = \frac{${U}}{${V}}$. Enter $f'(x)$ (you do not need to expand the bottom). ${SYN}</p>`,
        part: { kind: 'expression', variable: 'x', answer: M, domain: dom },
        steps: [
          { do: String.raw`$u = ${U}, \quad v = ${V}$`, why: 'Name the top u and the bottom v.' },
          { do: String.raw`$u' = ${dU}, \quad v' = ${dV}$`, why: 'Power rule on each.' },
          { do: String.raw`$f'(x) = \frac{u'v - uv'}{v^2}$`, why: qr },
          { do: String.raw`$f'(x) = ${sub}$`, why: "Substitute u, u', v, v'." },
          { do: String.raw`$= ${exp1}$`, why: 'Multiply out the top.' },
          { do: String.raw`$= ${res}$`, why: lastWhy },
        ],
        hints: ['A fraction with x on top and bottom.', String.raw`Quotient rule: $\frac{u'v - uv'}{v^2}$.`, String.raw`$u = ${U}$, $v = ${V}$.`],
      };
    },
  },
  {
    id: 'calc-chain-rule', title: 'Chain rule', area: 'calculus', module: 'derivatives', lesson: 'chain-rule', family: 'derivative-rules', method: 'Chain rule',
    prereqs: ['calc-power-rule', 'alg-functions'], blurb: 'Differentiate a function of a function: outer derivative times inner derivative.',
    gen(r) {
      const form = r.pick(['lin', 'sq', 'exp', 'sqrt']);
      let f, h, g, dg, dh, sub, res, M, dom = [-1.5, 1.5];
      if (form === 'lin') {
        const a = r.pick([-3, -2, 2, 3, 4, 5]), b = r.nz(-6, 6), n = r.int(3, 6);
        h = poly([a, b]); f = String.raw`(${h})^{${n}}`; g = String.raw`u^{${n}}`; dg = String.raw`${n}u^{${n - 1}}`; dh = `${a}`;
        sub = String.raw`${n}(${h})^{${n - 1}}\cdot ${par(a)}`; res = String.raw`${n * a}(${h})^{${n - 1}}`;
        M = `${n * a}*(${a}*x + (${b}))^${n - 1}`;
      } else if (form === 'sq') {
        const b = r.nz(-5, 6), n = r.int(3, 5);
        h = poly([1, 0, b]); f = String.raw`(${h})^{${n}}`; g = String.raw`u^{${n}}`; dg = String.raw`${n}u^{${n - 1}}`; dh = '2x';
        sub = String.raw`${n}(${h})^{${n - 1}}\cdot 2x`; res = String.raw`${2 * n}x(${h})^{${n - 1}}`;
        M = `${2 * n}*x*(x^2 + (${b}))^${n - 1}`;
      } else if (form === 'exp') {
        const a = r.pick([-2, -1, 1, 2, 3]);
        h = coef(a, 'x^2'); f = String.raw`e^{${h}}`; g = 'e^{u}'; dg = 'e^{u}'; dh = coef(2 * a, 'x');
        sub = String.raw`e^{${h}}\cdot ${a < 0 ? `(${coef(2 * a, 'x')})` : coef(2 * a, 'x')}`; res = String.raw`${coef(2 * a, 'x')}e^{${h}}`;
        M = `${2 * a}*x.*exp(${a}*x.^2)`;
      } else {
        const a = r.int(2, 5), b = r.int(1, 9);
        h = poly([a, b]); f = String.raw`\sqrt{${h}}`; g = String.raw`\sqrt{u} = u^{1/2}`; dg = String.raw`\tfrac{1}{2}u^{-1/2} = \frac{1}{2\sqrt{u}}`; dh = `${a}`;
        sub = String.raw`\frac{1}{2\sqrt{${h}}}\cdot ${a}`;
        res = String.raw`\frac{${a}}{2\sqrt{${h}}}${a % 2 ? '' : String.raw` = \frac{${a / 2}}{\sqrt{${h}}}`}`;
        M = `${a}./(2*sqrt(${a}*x + ${b}))`; dom = [0.2, 3];
      }
      return {
        statement: String.raw`<p>Differentiate $f(x) = ${f}$. Enter $f'(x)$. ${SYN}</p>`,
        part: { kind: 'expression', variable: 'x', answer: M, domain: dom },
        steps: [
          { do: String.raw`$\text{inner } h(x) = ${h}, \quad \text{outer } g(u) = ${g}$`, why: 'Spot the function inside another function: the inside is h, what is done to it is g.' },
          { do: String.raw`$g'(u) = ${dg}$`, why: form === 'exp' ? String.raw`$e^u$ is its own derivative.` : 'Power rule on the outer function.' },
          { do: String.raw`$h'(x) = ${dh}$`, why: 'Differentiate the inside.' },
          { do: String.raw`$f'(x) = g'(h(x))\cdot h'(x)$`, why: 'Chain rule: derivative of the outside (with the inside left alone), times the derivative of the inside.' },
          { do: String.raw`$f'(x) = ${sub}$`, why: String.raw`Put $u = ${h}$ back into $g'$, multiply by $h'$.` },
          { do: String.raw`$f'(x) = ${res}$`, why: 'Multiply the numbers together.' },
        ],
        hints: ['Is there a function inside another function?', String.raw`Chain rule: outer derivative times inner derivative.`, String.raw`The inside is $${h}$.`],
      };
    },
  },
  {
    id: 'calc-tangent-line', title: 'Tangent line at a point', area: 'calculus', module: 'derivatives', lesson: 'linear-approximation', family: 'applications', method: "Tangent line y = f(a) + f'(a)(x - a)",
    prereqs: ['calc-power-rule', 'alg-lines'], blurb: 'The slope of the tangent is the derivative at the point.',
    gen(r) {
      let cs, a, dcs, m;
      do {
        cs = r.next() < 0.5 ? [r.nz(-3, 3), r.int(-5, 5), r.int(-6, 6)] : [r.nz(-2, 2), 0, r.int(-5, 5), r.int(-6, 6)];
        a = r.int(-2, 3);
        dcs = cs.slice(0, -1).map((c, i) => c * (cs.length - 1 - i));
        m = evalPoly(dcs, a).val;
      } while (m === 0);
      const fa = evalPoly(cs, a).val, b0 = fa - m * a, ask = r.pick(['slope', 'intercept', 'line']);
      const F = String.raw`$f(x) = ${poly(cs)}$`;
      const dSteps = [
        { do: String.raw`$f'(x) = ${poly(dcs)}$`, why: 'Power rule on each term.' },
        { do: String.raw`$f'(${a}) = ${evalPoly(dcs, a).tex}$`, why: String.raw`The slope of the tangent at $x = ${a}$ is $f'(${a})$.` },
      ];
      if (ask === 'slope') {
        return {
          statement: String.raw`<p>Let ${F}. Find the slope of the tangent line to the graph at $x = ${a}$. ${NUM}</p>`,
          part: { kind: 'numeric', answer: String(m) },
          steps: [
            { do: String.raw`$\text{slope at } x = ${a} \;=\; f'(${a})$`, why: 'The derivative measures the slope of the curve, which is the slope of its tangent line.' },
            ...dSteps,
            { do: String.raw`$\text{slope} = ${m}$`, why: 'That is the answer.' },
          ],
          hints: ['The slope of a tangent is a derivative.', String.raw`Find $f'(x)$, then put $x = ${a}$.`],
        };
      }
      const steps = [
        { do: String.raw`$f(${a}) = ${evalPoly(cs, a).tex}$`, why: String.raw`The tangent touches the curve at the point $(${a}, f(${a}))$.` },
        ...dSteps,
        { do: String.raw`$y = ${fa} + ${par(m)}(${lin(a)})$`, why: String.raw`Point-slope form: $y = f(a) + f'(a)(x - a)$.` },
        { do: String.raw`$y = ${fa} ${signed(m, 'x')} ${signed(-m * a)}$`, why: String.raw`Multiply out: $${par(m)}\cdot x = ${coef(m, 'x')}$ and $${par(m)}\cdot ${par(-a)} = ${-m * a}$.` },
        { do: String.raw`$y = ${poly([m, b0])}$`, why: 'Collect the numbers.' },
      ];
      if (ask === 'intercept') steps.push({ do: String.raw`$y\text{-intercept} = ${b0}$`, why: String.raw`The y-intercept is the number left when $x = 0$.` });
      return {
        statement: ask === 'line'
          ? String.raw`<p>Let ${F}. Find the tangent line to the graph at $x = ${a}$. Enter the right-hand side of $y = \ldots$ as an expression in x, e.g. <code>5*x - 2</code>.</p>`
          : String.raw`<p>Let ${F}. The tangent line to the graph at $x = ${a}$ crosses the y-axis where? Enter its y-intercept as a number.</p>`,
        part: ask === 'line' ? { kind: 'expression', variable: 'x', answer: `${m}*x + (${b0})`, domain: [-2, 2] } : { kind: 'numeric', answer: String(b0) },
        steps,
        hints: ['You need a point and a slope.', String.raw`The point is $(${a}, f(${a}))$; the slope is $f'(${a})$.`, String.raw`Then use $y = f(a) + f'(a)(x - a)$.`],
      };
    },
  },

  // ---------------------------------------------------------------- applications of derivatives
  {
    id: 'calc-critical-points', title: 'Critical points of a cubic', area: 'calculus', module: 'derivative-apps', lesson: 'critical-points', family: 'applications', method: "Set f'(x) = 0 and solve",
    prereqs: ['calc-power-rule', 'alg-factor-quad', 'alg-solve-quad'], blurb: "Stationary points are where f'(x) = 0.",
    gen(r) {
      let p, q; do { p = r.int(-4, 4); q = r.int(-4, 5); } while (p >= q);
      const c = r.int(-9, 9), big = r.next() < 0.5;
      const cs = [2, -3 * (p + q), 6 * p * q, c], d = [6, -6 * (p + q), 6 * p * q], d1 = [1, -(p + q), p * q];
      const fp = p === 0 ? 'x' : `(${lin(p)})`, fq = q === 0 ? 'x' : `(${lin(q)})`;
      return {
        statement: String.raw`<p>$f(x) = ${poly(cs)}$ has two stationary points (where the slope is 0). Enter the x-value of the ${big ? 'larger' : 'smaller'} one.</p>`,
        part: { kind: 'numeric', answer: String(big ? q : p) },
        steps: [
          { do: String.raw`$f'(x) = ${poly(d)}$`, why: 'Power rule on each term; the constant disappears.' },
          { do: String.raw`$${poly(d)} = 0$`, why: 'A stationary point is where the slope f\'(x) is 0.' },
          { do: String.raw`$${poly(d1)} = 0$`, why: 'Divide every term by 6 (both sides), which keeps the equation true.' },
          { do: String.raw`$${fp}${fq} = 0$`, why: String.raw`Factor: two numbers that add to $${-(p + q)}$ and multiply to $${p * q}$ are $${-p}$ and $${-q}$.` },
          { do: String.raw`$x = ${p} \quad\text{or}\quad x = ${q}$`, why: 'A product is 0 only when one of its factors is 0.' },
          { do: String.raw`$\text{${big ? 'larger' : 'smaller'}: } x = ${big ? q : p}$`, why: 'Pick the one asked for.' },
        ],
        hints: [String.raw`Stationary means $f'(x) = 0$.`, 'Differentiate, set to 0, divide by the common factor 6, then factor.', String.raw`$f'(x) = ${poly(d)}$.`],
      };
    },
  },

  // ---------------------------------------------------------------- integration
  {
    id: 'calc-antiderivative-power', title: 'Antiderivative with the power rule', area: 'calculus', module: 'antiderivatives', lesson: 'rewriting-powers', family: 'integration', method: 'Power rule backwards',
    prereqs: ['calc-power-rule', 'alg-exp-neg-frac'], blurb: 'Rewrite as a power of x, add 1 to the power, divide by the new power.',
    gen(r) {
      const form = r.pick(['poly', 'neg', 'sqrt', 'invsqrt']);
      const rule = { do: String.raw`$\int x^{n}\,dx = \frac{x^{n+1}}{n+1} + C \quad (n \neq -1)$`, why: 'Power rule backwards: add 1 to the power, then divide by the new power.' };
      if (form === 'poly') {
        const n = r.int(2, 4), s = r.nz(-3, 3), A = s * (n + 1), B = r.nz(-6, 6);
        return {
          statement: String.raw`<p>Find $\int (${poly([A, ...Array(n - 1).fill(0), B])})\,dx$. ${ANTI}</p>`,
          part: { kind: 'expression', variable: 'x', answer: `${s}*x^${n + 1} + (${B})*x`, domain: [-2, 2], upToConstant: true },
          steps: [
            { do: String.raw`$\int ${coef(A, xp(n))}\,dx ${B < 0 ? '-' : '+'} \int ${Math.abs(B)}\,dx$`, why: 'Integrate term by term.' },
            rule,
            { do: String.raw`$\int ${coef(A, xp(n))}\,dx = ${A}\cdot\frac{x^{${n + 1}}}{${n + 1}} = ${coef(s, xp(n + 1))}$`, why: String.raw`Power ${n} becomes ${n + 1}; divide by ${n + 1}: $${A} \div ${n + 1} = ${s}$.` },
            { do: String.raw`$\int ${Math.abs(B)}\,dx = ${coef(Math.abs(B), 'x')}$`, why: 'A constant k integrates to kx (its derivative is k).' },
            { do: String.raw`$F(x) = ${coef(s, xp(n + 1))} ${signed(B, 'x')} + C$`, why: 'Put the pieces together.' },
          ],
          hints: ['One term at a time.', 'Add 1 to the power, divide by the new power.'],
        };
      }
      if (form === 'neg') {
        const m = r.int(2, 4), k = r.nz(-8, 8), e = 1 - m, f = frac(k, e);
        const fin = String.raw`${f.n < 0 ? '-' : ''}\frac{${Math.abs(f.n)}}{${f.d === 1 ? '' : f.d}${xp(m - 1)}}`;
        return {
          statement: String.raw`<p>Find $\int ${fx(k, xp(m))}\,dx$ for $x > 0$. ${ANTI}</p>`,
          part: { kind: 'expression', variable: 'x', answer: `(${k})/(${e})*x^(${e})`, domain: [0.5, 3], upToConstant: true },
          steps: [
            { do: String.raw`$${fx(k, xp(m))} = ${coef(k, `x^{${-m}}`)}$`, why: String.raw`Rewrite as a power: $\frac{1}{x^{m}} = x^{-m}$.` },
            rule,
            { do: String.raw`$${-m} + 1 = ${e}$`, why: 'Add 1 to the power.' },
            { do: String.raw`$${k}\cdot\frac{x^{${e}}}{${e}} = ${ct(k, e, `x^{${e}}`)}$`, why: String.raw`Divide by the new power $${e}$; the constant $${k}$ stays in front.` },
            { do: String.raw`$F(x) = ${fin} + C$`, why: 'Rewrite the negative power as a fraction again (optional, but tidier).' },
          ],
          hints: ['Write the fraction as a power of x first.', String.raw`$${fx(k, xp(m))} = ${coef(k, `x^{${-m}}`)}$; now use the power rule backwards.`],
        };
      }
      const k = r.nz(-6, 6);
      if (form === 'sqrt') {
        return {
          statement: String.raw`<p>Find $\int ${coef(k, String.raw`\sqrt{x}`)}\,dx$ for $x > 0$. ${ANTI}</p>`,
          part: { kind: 'expression', variable: 'x', answer: `${2 * k}/3*x^(3/2)`, domain: [0.5, 3], upToConstant: true },
          steps: [
            { do: String.raw`$${coef(k, String.raw`\sqrt{x}`)} = ${coef(k, 'x^{1/2}')}$`, why: String.raw`A square root is the power $\tfrac{1}{2}$.` },
            rule,
            { do: String.raw`$\tfrac{1}{2} + 1 = \tfrac{3}{2}$`, why: 'Add 1 to the power.' },
            { do: String.raw`$${k}\cdot\frac{x^{3/2}}{3/2} = ${k}\cdot\frac{2}{3}x^{3/2}$`, why: String.raw`Dividing by $\tfrac{3}{2}$ is the same as multiplying by $\tfrac{2}{3}$.` },
            { do: String.raw`$F(x) = ${ct(2 * k, 3, 'x^{3/2}')} + C$`, why: String.raw`$${k}\cdot\frac{2}{3} = ${fracTex(2 * k, 3)}$.` },
          ],
          hints: [String.raw`Write $\sqrt{x}$ as a power of x.`, String.raw`$\sqrt{x} = x^{1/2}$; add 1 to the power and divide by the new power.`],
        };
      }
      return {
        statement: String.raw`<p>Find $\int ${fx(k, String.raw`\sqrt{x}`)}\,dx$ for $x > 0$. ${ANTI}</p>`,
        part: { kind: 'expression', variable: 'x', answer: `${2 * k}*sqrt(x)`, domain: [0.5, 3], upToConstant: true },
        steps: [
          { do: String.raw`$${fx(k, String.raw`\sqrt{x}`)} = ${coef(k, 'x^{-1/2}')}$`, why: String.raw`$\sqrt{x} = x^{1/2}$, and 1 over a power is the negative power.` },
          rule,
          { do: String.raw`$-\tfrac{1}{2} + 1 = \tfrac{1}{2}$`, why: 'Add 1 to the power.' },
          { do: String.raw`$${k}\cdot\frac{x^{1/2}}{1/2} = ${k}\cdot 2x^{1/2}$`, why: String.raw`Dividing by $\tfrac{1}{2}$ is the same as multiplying by 2.` },
          { do: String.raw`$F(x) = ${coef(2 * k, String.raw`\sqrt{x}`)} + C$`, why: String.raw`$${k}\cdot 2 = ${2 * k}$, and $x^{1/2} = \sqrt{x}$.` },
        ],
        hints: [String.raw`Write $\frac{1}{\sqrt{x}}$ as a power of x.`, String.raw`It is $x^{-1/2}$; add 1 to the power and divide by the new power.`],
      };
    },
  },
  {
    id: 'calc-ftc', title: 'Definite integral with the Fundamental Theorem', area: 'calculus', module: 'ftc', lesson: 'ftc-part-2', family: 'integration', method: 'Fundamental Theorem (evaluate F(b) - F(a))',
    prereqs: ['calc-antiderivative-power', 'alg-int-ops'], blurb: 'Find an antiderivative F, then compute F(b) - F(a).',
    gen(r) {
      const ftc = { why: String.raw`Fundamental Theorem of Calculus: $\int_a^b f(x)\,dx = F(b) - F(a)$ for any antiderivative $F$ (the $+C$ cancels).` };
      if (r.next() < 0.7) {
        const p = r.pick([3, -3, 6]), q = 2 * r.int(-3, 3), s = r.int(-5, 5), a = r.int(-1, 1), b = a + r.int(1, 3);
        const Fc = [p / 3, q / 2, s, 0], Fb = evalPoly(Fc, b), Fa = evalPoly(Fc, a);
        return {
          statement: String.raw`<p>Compute $\displaystyle\int_{${a}}^{${b}} (${poly([p, q, s])})\,dx$. Enter a number.</p>`,
          part: { kind: 'numeric', answer: String(Fb.val - Fa.val) },
          steps: [
            { do: String.raw`$F(x) = ${antiTex(p, q, s)} = ${poly(Fc)}$`, why: String.raw`Power rule backwards on each term: $x^2 \to \frac{x^3}{3}$, $x \to \frac{x^2}{2}$, a number $c \to cx$.` },
            { do: String.raw`$\int_{${a}}^{${b}} f(x)\,dx = F(${b}) - F(${a})$`, ...ftc },
            { do: String.raw`$F(${b}) = ${Fb.tex}$`, why: String.raw`Substitute $x = ${b}$.` },
            { do: String.raw`$F(${a}) = ${Fa.tex}$`, why: String.raw`Substitute $x = ${a}$.` },
            { do: String.raw`$F(${b}) - F(${a}) = ${Fb.val} - ${par(Fa.val)} = ${Fb.val - Fa.val}$`, why: 'Subtract: top limit minus bottom limit.' },
          ],
          hints: ['First find an antiderivative F(x).', String.raw`Then compute $F(${b}) - F(${a})$.`],
        };
      }
      const k = r.nz(-6, 6), b = r.int(2, 5);
      const Fb = fracTex(-k, b), raw = fx(-k, b);
      return {
        statement: String.raw`<p>Compute $\displaystyle\int_{1}^{${b}} ${fx(k, 'x^2')}\,dx$. ${NUM}</p>`,
        part: { kind: 'numeric', answer: fracM(k * (b - 1), b) },
        steps: [
          { do: String.raw`$${fx(k, 'x^2')} = ${coef(k, 'x^{-2}')}$`, why: String.raw`Rewrite as a power: $\frac{1}{x^2} = x^{-2}$.` },
          { do: String.raw`$F(x) = ${k}\cdot\frac{x^{-1}}{-1} = ${fx(-k, 'x')}$`, why: String.raw`Power rule backwards: $-2 + 1 = -1$, divide by $-1$; $x^{-1} = \frac{1}{x}$.` },
          { do: String.raw`$\int_{1}^{${b}} f(x)\,dx = F(${b}) - F(1)$`, ...ftc },
          { do: String.raw`$F(${b}) = ${raw}${raw !== Fb ? ` = ${Fb}` : ''}, \quad F(1) = ${fx(-k, 1)} = ${-k}$`, why: 'Substitute both limits.' },
          { do: String.raw`$F(${b}) - F(1) = ${Fb} - ${par(-k)}${k > 0 ? ` = ${Fb} + ${k}` : ''} = ${fracTex(k * (b - 1), b)}$`, why: k > 0 ? 'Subtract; minus a negative is plus.' : 'Subtract: top limit minus bottom limit.' },
        ],
        hints: [String.raw`Write $\frac{1}{x^2}$ as $x^{-2}$ and find an antiderivative.`, String.raw`An antiderivative is $${fx(-k, 'x')}$; now compute $F(${b}) - F(1)$.`],
      };
    },
  },
  {
    id: 'calc-u-sub', title: 'u-substitution', area: 'calculus', module: 'substitution', lesson: 'u-substitution', family: 'integration', method: 'u-substitution',
    prereqs: ['calc-chain-rule', 'calc-antiderivative-power'], blurb: 'Spot an inside function whose derivative is also there; call it u.',
    gen(r) {
      const form = r.pick(['sq', 'cube', 'exp']), k = r.pick([1, 2, 3, 4, 6]);
      if (form === 'exp') {
        return {
          statement: String.raw`<p>Find $\int ${coef(k, 'x')}\,e^{x^2}\,dx$. ${ANTI}</p>`,
          part: { kind: 'expression', variable: 'x', answer: `${k}/2*exp(x.^2)`, domain: [-1.5, 1.5], upToConstant: true },
          steps: [
            { do: '$u = x^2$', why: 'Choose u = the inside of the exponential; its derivative 2x is (up to a number) also in the integral.' },
            { do: String.raw`$\frac{du}{dx} = 2x \;\Rightarrow\; x\,dx = \tfrac{1}{2}\,du$`, why: 'Differentiate u, then solve for the x dx that appears in the integral.' },
            { do: String.raw`$\int ${coef(k, 'x')}\,e^{x^2}\,dx = \int ${coef(k, 'e^{u}')}\cdot\tfrac{1}{2}\,du = ${ct(k, 2, String.raw`\int e^{u}\,du`)}$`, why: String.raw`Replace $x^2$ by $u$ and $x\,dx$ by $\tfrac{1}{2}du$; $${k}\cdot\tfrac{1}{2} = ${fracTex(k, 2)}$.` },
            { do: String.raw`$= ${ct(k, 2, 'e^{u}')} + C$`, why: String.raw`$\int e^u\,du = e^u + C$.` },
            { do: String.raw`$= ${ct(k, 2, 'e^{x^2}')} + C$`, why: 'Put u = x² back.' },
          ],
          hints: ['Look for an inside function whose derivative is also there.', String.raw`Let $u = x^2$; then $x\,dx = \tfrac{1}{2}du$.`],
        };
      }
      const cube = form === 'cube', a = r.int(1, 9), n = r.int(2, 4), dd = cube ? 3 : 2;
      const inner = cube ? `x^3 + ${a}` : `x^2 + ${a}`, xf = cube ? 'x^2' : 'x';
      const B = String.raw`(${inner})^{${n}}`;
      return {
        statement: String.raw`<p>Find $\int ${coef(k, xf)}${B}\,dx$. ${ANTI}</p>`,
        part: { kind: 'expression', variable: 'x', answer: `${k}/${dd * (n + 1)}*(${cube ? 'x.^3' : 'x.^2'} + ${a}).^${n + 1}`, domain: [-1.2, 1.2], upToConstant: true },
        steps: [
          { do: String.raw`$u = ${inner}$`, why: String.raw`Choose u = the inside of the bracket; its derivative $${dd}${xf}$ is (up to a number) also in the integral.` },
          { do: String.raw`$\frac{du}{dx} = ${dd}${xf} \;\Rightarrow\; ${xf}\,dx = \tfrac{1}{${dd}}\,du$`, why: `Differentiate u, then solve for the ${xf === 'x' ? 'x' : 'x²'} dx that appears in the integral.` },
          { do: String.raw`$\int ${coef(k, xf)}${B}\,dx = \int ${coef(k, `u^{${n}}`)}\cdot\tfrac{1}{${dd}}\,du = ${ct(k, dd, String.raw`\int u^{${n}}\,du`)}$`, why: String.raw`Replace the bracket by $u$ and $${xf}\,dx$ by $\tfrac{1}{${dd}}du$; $${k}\cdot\tfrac{1}{${dd}} = ${fracTex(k, dd)}$.` },
          { do: String.raw`$= ${ct(k, dd, String.raw`\frac{u^{${n + 1}}}{${n + 1}}`, true)} = ${ct(k, dd * (n + 1), `u^{${n + 1}}`)} + C$`, why: String.raw`Power rule backwards: $u^{${n}} \to \frac{u^{${n + 1}}}{${n + 1}}$; then multiply the fractions: $${fracTex(k, dd)}\cdot\frac{1}{${n + 1}} = ${fracTex(k, dd * (n + 1))}$.` },
          { do: String.raw`$= ${ct(k, dd * (n + 1), `(${inner})^{${n + 1}}`)} + C$`, why: `Put u = ${inner.replace('^3', '³').replace('^2', '²')} back.` },
        ],
        hints: ['Is there a bracket whose derivative is (nearly) sitting outside it?', String.raw`Let $u = ${inner}$; then $${xf}\,dx = \tfrac{1}{${dd}}du$.`],
      };
    },
  },
  {
    id: 'calc-parts', title: 'Integration by parts', area: 'calculus', module: 'parts', lesson: 'parts-formula', family: 'integration', method: 'Integration by parts',
    prereqs: ['calc-product-rule', 'calc-antiderivative-power'], blurb: 'Integrate a product by trading it for an easier integral: uv - ∫v du.',
    gen(r) {
      const form = r.pick(['exp', 'cos', 'ln']);
      const formula = { do: String.raw`$\int u\,dv = uv - \int v\,du$`, why: 'Integration by parts (the product rule run backwards).' };
      if (form === 'ln') {
        const n = r.int(0, 4), X = xp(n + 1), v = ct(1, n + 1, X), q = (n + 1) ** 2;
        const xn = n ? xp(n) : '';
        const simp = n ? ct(1, n + 1, xp(n)) : '1';
        return {
          statement: String.raw`<p>Find $\int ${xn}\ln x\,dx$ for $x > 0$. ${ANTI}</p>`,
          part: { kind: 'expression', variable: 'x', answer: `x.^${n + 1}.*log(x)/${n + 1} - x.^${n + 1}/${q}`, domain: [0.5, 3], upToConstant: true },
          steps: [
            { do: String.raw`$u = \ln x, \quad dv = ${n ? xn : '1'}\,dx$`, why: String.raw`$\ln x$ is easy to differentiate but hard to integrate, so make it u.` },
            { do: String.raw`$du = \frac{1}{x}\,dx, \quad v = ${v}$`, why: String.raw`$\frac{d}{dx}\ln x = \frac{1}{x}$; power rule backwards for v.` },
            formula,
            { do: String.raw`$= ${ct(1, n + 1, X + String.raw`\ln x`)} - \int ${v}\cdot\frac{1}{x}\,dx$`, why: 'Substitute u, v, du.' },
            { do: String.raw`$${v}\cdot\frac{1}{x} = ${simp}$`, why: n ? String.raw`One x cancels: $\frac{${X}}{x} = ${xp(n)}$.` : String.raw`$x\cdot\frac{1}{x} = 1$.` },
            { do: String.raw`$\int ${simp}\,dx = ${ct(1, q, X)}$`, why: 'Power rule backwards.' },
            { do: String.raw`$= ${ct(1, n + 1, X + String.raw`\ln x`)} - ${ct(1, q, X)} + C$`, why: 'Put it together.' },
          ],
          hints: ['A product with ln x: integration by parts.', String.raw`Take $u = \ln x$ (its derivative $\frac{1}{x}$ is simpler).`],
        };
      }
      const a = r.int(1, 5), ax = coef(a, 'x');
      if (form === 'exp') {
        const E = `e^{${ax}}`;
        return {
          statement: String.raw`<p>Find $\int x\,${E}\,dx$. ${ANTI}</p>`,
          part: { kind: 'expression', variable: 'x', answer: `x.*exp(${a}*x)/${a} - exp(${a}*x)/${a * a}`, domain: [-1, 1.5], upToConstant: true },
          steps: [
            { do: String.raw`$u = x, \quad dv = ${E}\,dx$`, why: 'Make u the part that gets simpler when differentiated: x becomes 1.' },
            { do: String.raw`$du = dx, \quad v = ${ct(1, a, E)}$`, why: String.raw`$\int e^{${ax}}\,dx = ${ct(1, a, E)}$ (check: differentiating gives back $${E}$).` },
            formula,
            { do: String.raw`$= ${ct(1, a, 'x' + E)} - \int ${ct(1, a, E)}\,dx$`, why: 'Substitute u, v, du.' },
            { do: String.raw`$\int ${ct(1, a, E)}\,dx = ${ct(1, a * a, E)}$`, why: a === 1 ? String.raw`$\int e^{x}\,dx = e^{x}$.` : String.raw`Integrating $${E}$ divides by ${a} again: $\frac{1}{${a}}\cdot\frac{1}{${a}} = \frac{1}{${a * a}}$.` },
            { do: String.raw`$= ${ct(1, a, 'x' + E)} - ${ct(1, a * a, E)} + C$`, why: 'Put it together.' },
          ],
          hints: ['A product of x and an exponential: integration by parts.', String.raw`Take $u = x$, $dv = ${E}\,dx$.`],
        };
      }
      const S = String.raw`\sin(${ax})`, Cc = String.raw`\cos(${ax})`;
      return {
        statement: String.raw`<p>Find $\int x\cos(${ax})\,dx$. ${ANTI}</p>`,
        part: { kind: 'expression', variable: 'x', answer: `x.*sin(${a}*x)/${a} + cos(${a}*x)/${a * a}`, domain: [-2, 2], upToConstant: true },
        steps: [
          { do: String.raw`$u = x, \quad dv = ${Cc}\,dx$`, why: 'Make u the part that gets simpler when differentiated: x becomes 1.' },
          { do: String.raw`$du = dx, \quad v = ${ct(1, a, S)}$`, why: String.raw`$\int \cos(${ax})\,dx = ${ct(1, a, S)}$ (check: differentiating gives back $${Cc}$).` },
          formula,
          { do: String.raw`$= ${ct(1, a, 'x' + S)} - \int ${ct(1, a, S)}\,dx$`, why: 'Substitute u, v, du.' },
          { do: String.raw`$\int ${ct(1, a, S)}\,dx = -${ct(1, a * a, Cc)}$`, why: a === 1 ? String.raw`$\int \sin x\,dx = -\cos x$.` : String.raw`$\int \sin(${ax})\,dx = -${ct(1, a, Cc)}$, times the $${fracTex(1, a)}$ in front: $\frac{1}{${a}}\cdot\frac{1}{${a}} = \frac{1}{${a * a}}$.` },
          { do: String.raw`$= ${ct(1, a, 'x' + S)} + ${ct(1, a * a, Cc)} + C$`, why: 'Minus a minus gives plus.' },
        ],
        hints: ['A product of x and a trig function: integration by parts.', String.raw`Take $u = x$, $dv = ${Cc}\,dx$.`],
      };
    },
  },
  {
    id: 'calc-partial-fractions', title: 'Partial fractions', area: 'calculus', module: 'inverse-sub', lesson: 'partial-fractions', family: 'integration', method: 'Partial fractions',
    prereqs: ['alg-frac-add', 'alg-solve-linear', 'alg-factor-quad', 'alg-logs'], blurb: 'Split a fraction with a factored bottom into simple pieces that integrate to logs.',
    gen(r) {
      const a = r.nz(-4, 5); let b; do b = r.nz(-4, 5); while (b === a);
      const m = r.nz(-3, 3), k = m * (a - b), D = poly([1, -(a + b), a * b]);
      const La = lin(a), Lb = lin(b), B = -m;
      return {
        statement: String.raw`<p>Find $\int \frac{${k}}{${D}}\,dx$ for $x > ${Math.max(a, b)}$. ${ANTI}</p>`,
        part: { kind: 'expression', variable: 'x', answer: `(${m})*log(abs(x - (${a}))) + (${B})*log(abs(x - (${b})))`, domain: [Math.max(a, b) + 0.5, Math.max(a, b) + 3], upToConstant: true },
        steps: [
          { do: String.raw`$${D} = (${La})(${Lb})$`, why: String.raw`Factor the bottom: two numbers adding to $${-(a + b)}$ and multiplying to $${a * b}$ are $${-a}$ and $${-b}$.` },
          { do: String.raw`$\frac{${k}}{(${La})(${Lb})} = \frac{A}{${La}} + \frac{B}{${Lb}}$`, why: 'Partial fractions: write it as a sum of two simpler fractions with unknown tops A and B.' },
          { do: String.raw`$${k} = A(${Lb}) + B(${La})$`, why: String.raw`Multiply both sides by $(${La})(${Lb})$.` },
          { do: String.raw`$x = ${a}:\; ${k} = A(${subLin(a, b)}) = ${coef(a - b, 'A')} \;\Rightarrow\; A = \frac{${k}}{${a - b}} = ${m}$`, why: String.raw`Choose $x = ${a}$ so the B term becomes 0.` },
          { do: String.raw`$x = ${b}:\; ${k} = B(${subLin(b, a)}) = ${coef(b - a, 'B')} \;\Rightarrow\; B = \frac{${k}}{${b - a}} = ${B}$`, why: String.raw`Choose $x = ${b}$ so the A term becomes 0.` },
          { do: String.raw`$\int \left(${fx(m, La)} ${B < 0 ? '-' : '+'} \frac{${Math.abs(B)}}{${Lb}}\right)dx$`, why: 'Integrate the two simple pieces separately.' },
          { do: String.raw`$= ${coef(m, String.raw`\ln|${La}|`)} ${signed(B, String.raw`\ln|${Lb}|`)} + C$`, why: String.raw`$\int \frac{1}{x - c}\,dx = \ln|x - c|$.` },
        ],
        hints: ['Factor the bottom first.', String.raw`Write it as $\frac{A}{${La}} + \frac{B}{${Lb}}$ and find A and B.`, String.raw`Multiply through, then put $x = ${a}$ and $x = ${b}$.`],
      };
    },
  },
  {
    id: 'calc-p-integral', title: 'p-integrals', area: 'calculus', module: 'improper', lesson: 'p-integrals', family: 'series', method: 'p-integral rule (converges only if p > 1)',
    prereqs: ['calc-antiderivative-power'], blurb: 'Does the area under 1/x^p out to infinity add up to a finite number?',
    gen(r) {
      const [n, d] = r.pick([[2, 1], [3, 1], [4, 1], [3, 2], [1, 1], [1, 2]]), k = r.int(1, 6);
      const pT = d === 1 ? `${n}` : `${n}/${d}`, conv = n > d;
      const den = n === 1 && d === 1 ? 'x' : n === 1 ? String.raw`\sqrt{x}` : `x^{${pT}}`;
      const lim = String.raw`\int_1^{\infty} ${fx(k, den)}\,dx = \lim_{t\to\infty}\int_1^{t} ${fx(k, den)}\,dx`;
      const limWhy = 'An integral to infinity means: integrate up to t, then let t grow without bound.';
      let steps;
      if (n === 1 && d === 1) {
        steps = [
          { do: `$${lim}$`, why: limWhy },
          { do: String.raw`$\int ${fx(k, 'x')}\,dx = ${coef(k, String.raw`\ln x`)}$`, why: String.raw`$\int \frac{1}{x}\,dx = \ln x$ for $x > 0$ (the power rule does not work for $x^{-1}$).` },
          { do: String.raw`$\Big[${coef(k, String.raw`\ln x`)}\Big]_1^{t} = ${coef(k, String.raw`\ln t`)} - ${coef(k, String.raw`\ln 1`)} = ${coef(k, String.raw`\ln t`)}$`, why: String.raw`$\ln 1 = 0$.` },
          { do: String.raw`$${coef(k, String.raw`\ln t`)} \to \infty \text{ as } t \to \infty$`, why: String.raw`$\ln t$ grows slowly but without limit.` },
          { do: String.raw`$\text{Diverges}$`, why: 'The limit is not a finite number.' },
        ];
      } else {
        const en = d - n, ed = d, eT = ed === 1 ? `${en}` : `${en}/${ed}`, C = fracTex(k * ed, en);
        steps = [
          { do: `$${lim}$`, why: limWhy },
          { do: String.raw`$\int ${coef(k, `x^{-${pT}}`)}\,dx = ${k}\cdot\frac{x^{${eT}}}{${eT}} = ${ct(k * ed, en, `x^{${eT}}`)}$`, why: String.raw`Rewrite as $x^{-${pT}}$; power rule backwards: $-${pT} + 1 = ${eT}$, then divide by $${eT}$.` },
          { do: String.raw`$\Big[${ct(k * ed, en, `x^{${eT}}`)}\Big]_1^{t} = ${ct(k * ed, en, `t^{${eT}}`)} - ${texPar(C)}$`, why: String.raw`Substitute $t$ and $1$; $1$ to any power is $1$.` },
          conv
            ? { do: String.raw`$t^{${eT}} = \frac{1}{${ed === 1 && en === -1 ? 't' : `t^{${ed === 1 ? -en : `${-en}/${ed}`}}`}} \to 0 \text{ as } t \to \infty$`, why: 'A negative power of a huge number is tiny.' }
            : { do: String.raw`$t^{${eT}} \to \infty \text{ as } t \to \infty$`, why: 'A positive power of a huge number is huge.' },
          conv
            ? { do: String.raw`$0 - ${texPar(C)} = ${fracTex(-k * ed, en)}$`, why: String.raw`The limit is a finite number, so the integral converges (here $p = ${pT} > 1$).` }
            : { do: String.raw`$\text{Diverges}$`, why: String.raw`The limit is not a finite number (here $p = ${pT} \le 1$).` },
        ];
      }
      const V = (val) => String.raw`Converges to $${val}$`;
      const right = conv ? V(fracTex(k * d, n - d)) : 'Diverges';
      const opts = conv ? [right, V(fracTex(k * d, n)), V(fracTex(k * d, n + d)), 'Diverges'] : [right, V(k), V(2 * k), V(0)];
      const choices = r.shuffle(opts);
      return {
        statement: String.raw`<p>Does $\displaystyle\int_1^{\infty} ${fx(k, den)}\,dx$ converge? If it does, to what value?</p>`,
        part: { kind: 'choice', choices, answer: choices.indexOf(right) },
        steps,
        hints: [String.raw`Write $${fx(k, den)}$ as $${coef(k, 'x^{-p}')}$. What is p?`, String.raw`$\int_1^\infty \frac{1}{x^p}\,dx$ converges only when $p > 1$.`, 'Integrate up to t, then let t → ∞.'],
      };
    },
  },

  // ---------------------------------------------------------------- differential equations
  {
    id: 'calc-ivp', title: 'Initial value problem: integrate directly', area: 'calculus', module: 'antiderivatives', lesson: 'initial-value', family: 'odes', method: 'Integrate, then use the given value to find C',
    prereqs: ['calc-antiderivative-power', 'alg-solve-linear'], blurb: "Given f'(x) and one value of f, find f.",
    gen(r) {
      const p = r.pick([3, -3, 6]), q = 2 * r.int(-3, 3), s = r.nz(-5, 5), c = r.int(-5, 8), x0 = r.pick([1, -1]), x1 = r.pick([2, 3]);
      const Fc = [p / 3, q / 2, s, 0], F0 = evalPoly(Fc, x0), C = c - F0.val, full = [p / 3, q / 2, s, C], F1 = evalPoly(full, x1);
      return {
        statement: String.raw`<p>$f'(x) = ${poly([p, q, s])}$ and $f(${x0}) = ${c}$. Find $f(${x1})$. Enter a number.</p>`,
        part: { kind: 'numeric', answer: String(F1.val) },
        steps: [
          { do: String.raw`$f(x) = ${antiTex(p, q, s)} + C = ${poly(Fc)} + C$`, why: 'Integrate f\'(x) term by term (power rule backwards); keep the + C, we will need it.' },
          { do: String.raw`$f(${x0}) = ${F0.plusC}$`, why: String.raw`Put $x = ${x0}$ into $f$.` },
          { do: String.raw`$${F0.val} + C = ${c}$`, why: String.raw`We are told $f(${x0}) = ${c}$.` },
          { do: String.raw`$C = ${c} - ${par(F0.val)} = ${C}$`, why: String.raw`Subtract $${F0.val}$ from both sides.` },
          { do: String.raw`$f(x) = ${poly(full)}$`, why: 'Now f is completely known.' },
          { do: String.raw`$f(${x1}) = ${F1.tex}$`, why: String.raw`Substitute $x = ${x1}$.` },
        ],
        hints: [String.raw`Integrate $f'(x)$ to get $f(x)$ with a $+C$.`, String.raw`Use $f(${x0}) = ${c}$ to find C, then evaluate at $x = ${x1}$.`],
      };
    },
  },
  {
    id: 'calc-separable', title: 'Separable differential equation', area: 'calculus', module: 'ode-first', lesson: 'separable', family: 'odes', method: 'Separate the variables',
    prereqs: ['calc-antiderivative-power', 'alg-logs'], blurb: 'Move all y to one side and all x to the other, then integrate both sides.',
    gen(r) {
      const form = r.pick(['ky', 'kxy', 'xy']);
      if (form === 'xy') {
        const [y0, x1, h] = r.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]]);
        return {
          statement: String.raw`<p>Solve $\frac{dy}{dx} = \frac{x}{y}$ with $y(0) = ${y0}$ (and $y > 0$). Find $y(${x1})$. Enter a number.</p>`,
          part: { kind: 'numeric', answer: String(h) },
          steps: [
            { do: String.raw`$y\,dy = x\,dx$`, why: 'Separate: multiply both sides by y and by dx, so all y is on the left and all x on the right.' },
            { do: String.raw`$\frac{y^2}{2} = \frac{x^2}{2} + C$`, why: 'Integrate both sides (power rule backwards); one + C is enough.' },
            { do: String.raw`$\frac{${y0}^2}{2} = 0 + C \;\Rightarrow\; C = \frac{${y0 * y0}}{2}$`, why: String.raw`Use $y = ${y0}$ when $x = 0$.` },
            { do: String.raw`$y^2 = x^2 + ${y0 * y0}$`, why: 'Multiply both sides by 2.' },
            { do: String.raw`$y = \sqrt{x^2 + ${y0 * y0}}$`, why: 'Take the positive square root, because y > 0.' },
            { do: String.raw`$y(${x1}) = \sqrt{${x1}^2 + ${y0 * y0}} = \sqrt{${x1 * x1} + ${y0 * y0}} = \sqrt{${h * h}} = ${h}$`, why: String.raw`Substitute $x = ${x1}$.` },
          ],
          hints: ['Get all the y on one side, all the x on the other.', String.raw`$y\,dy = x\,dx$; integrate both sides.`],
        };
      }
      const y0 = r.int(2, 5);
      let k, x1, rhs, sep, integ, sol, at, ex;
      if (form === 'ky') {
        k = r.pick([-2, -1, 1, 2]); x1 = r.pick([1, 2]); ex = k * x1;
        rhs = coef(k, 'y'); sep = coef(k, String.raw`\,dx`); integ = `${coef(k, 'x')} + C`;
        sol = coef(y0, `e^{${coef(k, 'x')}}`); at = coef(y0, String.raw`e^{${k}\cdot ${x1}}`);
      } else {
        k = r.pick([-2, 2, -4, 4]); x1 = Math.abs(k) === 4 ? 1 : r.pick([1, 2]); ex = (k / 2) * x1 * x1;
        rhs = coef(k, 'xy'); sep = coef(k, 'x\\,dx'); integ = String.raw`${k}\cdot\frac{x^2}{2} + C = ${coef(k / 2, 'x^2')} + C`;
        sol = coef(y0, `e^{${coef(k / 2, 'x^2')}}`); at = coef(y0, String.raw`e^{${k / 2}\cdot ${x1}^2}`);
      }
      const inner = form === 'ky' ? coef(k, 'x') : coef(k / 2, 'x^2');
      return {
        statement: String.raw`<p>Solve $\frac{dy}{dx} = ${rhs}$ with $y(0) = ${y0}$. Find $y(${x1})$. Enter an exact value such as <code>3*exp(2)</code> or a decimal.</p>`,
        part: { kind: 'numeric', answer: `${y0}*exp(${ex})` },
        steps: [
          { do: String.raw`$\frac{1}{y}\,dy = ${sep}$`, why: 'Separate: divide both sides by y and multiply by dx, so all y is on the left and all x on the right.' },
          { do: String.raw`$\ln|y| = ${integ}$`, why: String.raw`Integrate both sides: $\int \frac{1}{y}\,dy = \ln|y|$; one + C is enough.` },
          { do: String.raw`$\ln ${y0} = 0 + C \;\Rightarrow\; C = \ln ${y0}$`, why: String.raw`Use $y = ${y0}$ when $x = 0$.` },
          { do: String.raw`$y = e^{${inner} + \ln ${y0}} = e^{\ln ${y0}}\cdot e^{${inner}} = ${sol}$`, why: String.raw`Raise e to both sides; $e^{a+b} = e^a e^b$ and $e^{\ln ${y0}} = ${y0}$. (y stays positive, so drop the bars.)` },
          { do: String.raw`$y(${x1}) = ${at} = ${coef(y0, ex === 1 ? 'e' : `e^{${ex}}`)} \approx ${(y0 * Math.exp(ex)).toFixed(3)}$`, why: String.raw`Substitute $x = ${x1}$.` },
        ],
        hints: ['Get all the y on one side, all the x on the other.', String.raw`$\frac{1}{y}\,dy = ${sep}$; integrate both sides.`, 'Use y(0) to find C.'],
      };
    },
  },

  // ---------------------------------------------------------------- series
  {
    id: 'calc-geometric-series', title: 'Geometric series sum', area: 'calculus', module: 'series', lesson: 'geometric-x', family: 'series', method: 'Geometric series formula (first term)/(1 - r)',
    prereqs: ['alg-frac-add', 'alg-frac-mul'], blurb: 'Each term is r times the previous one; if |r| < 1 the sum is first/(1 - r).',
    gen(r) {
      const [rn, rd] = r.pick([[1, 2], [-1, 2], [1, 3], [2, 3], [-1, 3], [1, 4], [3, 4], [-2, 3], [2, 5]]);
      const a = r.int(1, 9), s0 = r.int(0, 1);
      const term = (j) => [a * rn ** (s0 + j), rd ** (s0 + j)];
      const terms = [0, 1, 2].map(term);
      const sumT = terms.map(([n, d], i) => (i === 0 ? fracTex(n, d) : `${n < 0 ? '-' : '+'} ${fracTex(Math.abs(n), d)}`)).join(' ');
      const [Tn, Td] = terms[0], T = fracTex(Tn, Td), R = fracTex(rn, rd), ans = frac(Tn * rd, Td * (rd - rn));
      return {
        statement: String.raw`<p>Find $\displaystyle\sum_{n=${s0}}^{\infty} ${a === 1 ? '' : a}\left(${R}\right)^{n}$. ${NUM}</p>`,
        part: { kind: 'numeric', answer: fracM(ans.n, ans.d) },
        steps: [
          { do: String.raw`$= ${sumT} + \cdots$`, why: String.raw`Write out the first terms (n = ${s0}, ${s0 + 1}, ${s0 + 2}).` },
          { do: String.raw`$\text{first term} = ${T}, \quad r = ${R}$`, why: String.raw`Each term is the previous one times $${R}$: that is the ratio r.` },
          { do: String.raw`$|r| = ${fracTex(Math.abs(rn), rd)} < 1$`, why: 'A geometric series adds up to a finite number only when |r| < 1.' },
          { do: String.raw`$S = \frac{\text{first term}}{1 - r}$`, why: 'Geometric series formula.' },
          { do: String.raw`$S = \frac{${T}}{1 - ${texPar(R)}} = \frac{${T}}{${fracTex(rd - rn, rd)}}$`, why: String.raw`$1 - ${texPar(R)} = \frac{${rd}}{${rd}} - ${texPar(R)} = ${fracTex(rd - rn, rd)}$.` },
          { do: String.raw`$= ${T}\cdot\frac{${rd}}{${rd - rn}} = ${fracTex(ans.n, ans.d)}$`, why: 'Dividing by a fraction is multiplying by it flipped.' },
        ],
        hints: ['What do you multiply each term by to get the next?', String.raw`It is geometric with $r = ${R}$; use $\frac{\text{first term}}{1 - r}$.`, String.raw`The first term (n = ${s0}) is $${T}$.`],
      };
    },
  },
  {
    id: 'calc-maclaurin', title: 'Maclaurin coefficient', area: 'calculus', module: 'taylor', lesson: 'maclaurin', family: 'series', method: 'Maclaurin formula c_n = f^(n)(0)/n!',
    prereqs: ['calc-chain-rule'], blurb: 'The coefficient of x^n is the n-th derivative at 0 divided by n!.',
    gen(r) {
      const cosF = r.next() < 0.3;
      const k = cosF ? r.int(1, 3) : r.pick([-3, -2, -1, 2, 3, 4]), n = cosF ? r.pick([2, 4]) : r.int(2, 4);
      const kx = coef(k, 'x'), fact = [1, 2, 6, 24][n - 1], mult = Array.from({ length: n }, (_, i) => i + 1).join(String.raw`\cdot `);
      const f = cosF ? String.raw`\cos(${kx})` : `e^{${kx}}`;
      const D = (j) => (j === 1 ? "f'" : j === 2 ? "f''" : `f^{(${j})}`);
      let ders, val, at0;
      if (cosF) {
        const S = String.raw`\sin(${kx})`, C = String.raw`\cos(${kx})`;
        const list = [coef(-k, S), coef(-(k ** 2), C), coef(k ** 3, S), coef(k ** 4, C)];
        ders = list.slice(0, n).map((t, i) => `${D(i + 1)}(x) = ${t}`).join(String.raw`,\; `);
        val = n === 2 ? -(k ** 2) : k ** 4;
        at0 = String.raw`${val}\cdot\cos 0 = ${val}\cdot 1 = ${val}`;
      } else {
        const E = `e^{${kx}}`;
        ders = Array.from({ length: n }, (_, i) => `${D(i + 1)}(x) = ${coef(k ** (i + 1), E)}`).join(String.raw`,\; `);
        val = k ** n;
        at0 = String.raw`${par(k)}^{${n}}\cdot e^{0} = ${val}\cdot 1 = ${val}`;
      }
      return {
        statement: String.raw`<p>Find the coefficient of $x^{${n}}$ in the Maclaurin series of $f(x) = ${f}$. ${NUM}</p>`,
        part: { kind: 'numeric', answer: fracM(val, fact) },
        steps: [
          { do: String.raw`$c_{${n}} = \frac{${D(n)}(0)}{${n}!}$`, why: String.raw`Maclaurin series: the coefficient of $x^n$ is $\frac{f^{(n)}(0)}{n!}$.` },
          { do: `$${ders}$`, why: cosF ? String.raw`Differentiate again and again: $\cos \to -\sin \to -\cos \to \sin \to \cos$, and each time the chain rule brings out a factor $${k}$.` : String.raw`Each derivative of $e^{${kx}}$ brings out another factor $${k}$ (chain rule).` },
          { do: String.raw`$${D(n)}(0) = ${at0}$`, why: cosF ? String.raw`Put $x = 0$: $\cos 0 = 1$.` : String.raw`Put $x = 0$: $e^0 = 1$.` },
          { do: String.raw`$${n}! = ${mult} = ${fact}$`, why: 'n! means multiply 1 · 2 · … · n.' },
          { do: String.raw`$c_{${n}} = \frac{${val}}{${fact}}${fracTex(val, fact) !== String.raw`\frac{${val}}{${fact}}` ? ` = ${fracTex(val, fact)}` : ''}$`, why: 'Divide and simplify.' },
        ],
        hints: [String.raw`The coefficient of $x^n$ is $\frac{f^{(n)}(0)}{n!}$.`, `Differentiate ${n} times, then put x = 0.`],
      };
    },
  },
];
