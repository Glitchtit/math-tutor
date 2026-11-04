// Module 18: Sequences — convergence, limit techniques, monotone and recursive sequences.

export default {
  id: 'sequences',
  number: 18,
  part: 'series',
  hw: 'HW5',
  title: 'Sequences',
  summary: 'Convergence of sequences with the ε–N picture, limit laws and rational sequences, limits via functions (L\'Hôpital) and the squeeze theorem, (1 + a/n)^n-type limits via logarithms, oscillating divergent sequences, and monotone bounded and recursive sequences with fixed points.',
  intro: String.raw`<p>A sequence is a function whose inputs are the integers $n = 1, 2, 3, \dots$. Sequences are the language of the whole series part of the course: a series converges exactly when its sequence of partial sums does. This module builds the toolbox for computing limits $\lim_{n\to\infty} a_n$ and — just as important — for <b>proving</b> that a limit exists before you compute it.</p>`,
  lessons: [
    {
      id: 'convergence',
      title: 'Convergence: the ε–N picture',
      blocks: [
        { type: 'text', html: String.raw`<p>The terms of $a_n = \dfrac{2n+1}{n+3}$ are plotted below together with a band of half-width $\varepsilon$ around $L = 2$. Shrink $\varepsilon$: the band gets thinner, the first index $N$ after which <i>every</i> term stays inside moves to the right — but such an $N$ always exists. That is what convergence means.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_n = (2n+1)/(n+3) and an ε-band around L = 2',
          a: '(2*n + 1)./(n + 3)', nmax: 60, L: 2, eps: 0.3, ylim: [0, 2.6],
        } },
        { type: 'callout', kind: 'def', title: 'Convergent sequence', html: String.raw`<p>The sequence $\{a_n\}$ <b>converges</b> to $L$, written $\lim_{n\to\infty} a_n = L$, if for every $\varepsilon > 0$ there is an index $N$ such that $|a_n - L| < \varepsilon$ for all $n \ge N$. A sequence that does not converge <b>diverges</b>; $a_n \to \infty$ is a special kind of divergence.</p>` },
        { type: 'derive', symbolic: true, title: String.raw`Example: find $N$ for $a_n = \dfrac{2n+1}{n+3}$, $L = 2$, for any $\varepsilon$`, colors: { p: 1, q: 2, d: 3, e: 4, t: 5 }, steps: [
          { kind: 'calc', label: 'Common denominator', from: String.raw`a_n - 2 = \dfrac{2n+1}{n+3} - 2`, to: String.raw`a_n - 2 = \dfrac{2n + 1 - \T{q-1}{2(n+3)}}{n+3}`,
            why: String.raw`$2 = \frac{2(n+3)}{n+3}$, so both fractions can be written over $n + 3$.` },
          { kind: 'expand', label: String.raw`Multiply $2$ into $(n+3)$`, to: String.raw`a_n - 2 = \dfrac{2n + 1 - \T{q-1}{2n} - \T{q-2}{6}}{n+3}`, map: { 'q-1': ['q-1', 'q-2'] }, arrows: { 'q-1': '× each term' },
            why: String.raw`The minus in front applies to both terms: $-2(n+3) = -2n - 6$.` },
          { kind: 'cancel', label: String.raw`$2n - 2n = 0$`, from: String.raw`a_n - 2 = \dfrac{\T{p-1}{2n} + 1 - \T{p-2}{2n} - 6}{n+3}`, to: String.raw`a_n - 2 = \dfrac{-5}{n+3}`,
            why: String.raw`The $n$-terms cancel and $1 - 6 = -5$.` },
          { kind: 'calc', label: 'Take the absolute value', to: String.raw`|a_n - 2| = \dfrac{5}{n+3}`, why: String.raw`$n + 3 > 0$, so only the sign of $-5$ changes.` },
          { kind: 'both', label: String.raw`Require $< \varepsilon$, then both sides $\times\frac{n+3}{\varepsilon}$`, from: String.raw`\dfrac{5}{\T{d-1}{n+3}} < \T{e-1}{\varepsilon}`, to: String.raw`\dfrac{5}{\T{e-1}{\varepsilon}} < \T{d-1}{n+3}`, arrows: { 'd-1': '× (n+3)', 'e-1': '÷ ε' },
            why: String.raw`Multiplying both sides by the positive number $\frac{n+3}{\varepsilon}$ keeps the direction of $<$.` },
          { kind: 'both', label: String.raw`Both sides $-3$`, from: String.raw`\dfrac{5}{\varepsilon} < n \T{t-1}{+ 3}`, to: String.raw`n > \dfrac{5}{\varepsilon} \T{t-1}{- 3}`, arrows: { 't-1': '−3 on both sides' },
            why: String.raw`Every index $n$ larger than $\frac5\varepsilon - 3$ keeps $a_n$ inside the band. Such integers exist for every $\varepsilon > 0$, hence $a_n \to 2$.` },
        ] },
        { type: 'derive', title: String.raw`With numbers: $\varepsilon = 0.3$`, given: String.raw`\T{e-0}{\varepsilon} = 0.3`, colors: { e: 4, n: 6 }, steps: [
          { kind: 'sub', label: String.raw`Put $\varepsilon = 0.3$ into the condition`, from: String.raw`n > \dfrac{5}{\T{e-x}{\varepsilon}} - 3\qquad \varepsilon = \T{e-1}{0.3}`, to: String.raw`n > \dfrac{5}{\T{e-1}{0.3}} - 3`, arrows: { 'e-1': 'ε = 0.3' },
            why: String.raw`The number keeps the colour of $\varepsilon$.` },
          { kind: 'calc', label: String.raw`$5 \div 0.3 \approx 16.67$`, to: String.raw`n > 16.67 - 3 = 13.67`, why: String.raw`Every index above $13.67$ works.` },
          { kind: 'result', label: 'First integer above 13.67', to: String.raw`N = 14`, why: String.raw`Compare with the widget at $\varepsilon = 0.3$.` },
          { kind: 'check', label: String.raw`Distance at $n = 14$`, from: String.raw`|a_n - 2| = \dfrac{5}{n+3}\qquad n = \T{n-1}{14}`, to: String.raw`|a_{14} - 2| = \dfrac{5}{\T{n-1}{14} + 3} = \dfrac{5}{17} \approx 0.294 < 0.3\ \checkmark`, arrows: { 'n-1': '' },
            why: String.raw`Inside the band. At $n = 13$ the distance is $\frac{5}{16} = 0.3125$, outside, so $14$ is indeed the first index.` },
        ] },
        { type: 'callout', kind: 'thm', title: 'Limit laws', html: String.raw`<p>If $a_n \to A$ and $b_n \to B$, then $a_n \pm b_n \to A \pm B$, $\;c\,a_n \to cA$, $\;a_n b_n \to AB$ and $a_n / b_n \to A/B$ provided $B \ne 0$. Constants are convergent sequences, and $1/n^p \to 0$ for every $p > 0$.</p>` },
        { type: 'text', html: String.raw`<p>For a <b>rational sequence</b> divide numerator and denominator by the highest power of $n$ in the denominator; then every term except the leading ones tends to zero by the limit laws.</p>` },
        { type: 'derive', title: String.raw`Example: $\displaystyle\lim_{n\to\infty} \frac{6n^3 - n + 4}{2n^3 + 5n^2}$`, colors: { z: 1 }, steps: [
          { kind: 'both', label: String.raw`Numerator and denominator $\div n^3$`, from: String.raw`\lim_{n\to\infty}\dfrac{6n^3 - n + 4}{2n^3 + 5n^2}`, to: String.raw`\lim_{n\to\infty}\dfrac{6 - \T{z-1}{\frac{1}{n^2}} + \T{z-2}{\frac{4}{n^3}}}{2 + \T{z-3}{\frac{5}{n}}}`,
            why: String.raw`$n^3$ is the highest power in the denominator. Dividing top and bottom by the same number does not change a fraction: $\frac{6n^3}{n^3} = 6$, $\frac{n}{n^3} = \frac1{n^2}$, $\frac{5n^2}{n^3} = \frac5n$.` },
          { kind: 'calc', label: String.raw`$\frac{c}{n^p} \to 0$`, to: String.raw`\dfrac{6 - \T{z-1}{0} + \T{z-2}{0}}{2 + \T{z-3}{0}}`,
            why: String.raw`Each term with $n$ in its denominator tends to $0$. The limit laws let us take the limit term by term, and the quotient law applies because the denominator's limit $2 \ne 0$.` },
          { kind: 'result', label: String.raw`$6 \div 2$`, to: String.raw`= 3`, why: String.raw`The ratio of the leading coefficients.` },
        ] },
        { type: 'text', html: String.raw`<p>Rule of thumb: equal degrees give the ratio of the leading coefficients; a higher degree in the denominator gives $0$; a higher degree in the numerator gives divergence to $\pm\infty$.</p>` },
        { type: 'quiz', question: String.raw`$\displaystyle\lim_{n\to\infty} \frac{4 - 9n^2}{3n^2 + 7n}$ equals`, choices: [String.raw`$4/7$`, String.raw`$3$`, String.raw`$-3$`, String.raw`$0$`], answer: 2, explain: String.raw`Divide by $n^2$: $\dfrac{4/n^2 - 9}{3 + 7/n} \to \dfrac{-9}{3} = -3$.` },
      ],
    },
    {
      id: 'functions-squeeze',
      title: 'Limits via functions and the squeeze theorem',
      blocks: [
        { type: 'text', html: String.raw`<p>The terms $a_n = \dfrac{\cos n}{\sqrt n}$ jump around irregularly, but they are trapped between $-1/\sqrt n$ and $1/\sqrt n$, and both bounds tend to $0$. Shrink $\varepsilon$ and watch the terms settle in the band around $0$.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_n = cos(n)/√n is squeezed to 0',
          a: 'cos(n)./sqrt(n)', nmax: 80, L: 0, eps: 0.3, ylim: [-0.8, 0.8],
        } },
        { type: 'callout', kind: 'thm', title: 'Three tools', html: String.raw`<ul><li><b>Functions.</b> If $\lim_{x\to\infty} f(x) = L$ and $a_n = f(n)$ for all $n$, then $a_n \to L$. This lets you use L'Hôpital's rule on $f(x)$ — never differentiate with respect to the integer $n$ directly.</li><li><b>Squeeze theorem.</b> If $b_n \le a_n \le c_n$ for all $n \ge n_0$ and $b_n \to L$, $c_n \to L$, then $a_n \to L$. In particular $|a_n| \to 0$ implies $a_n \to 0$.</li><li><b>Continuous functions.</b> If $a_n \to L$ and $g$ is continuous at $L$, then $g(a_n) \to g(L)$.</li></ul>` },
        { type: 'callout', kind: 'warn', html: String.raw`<p>The first tool works in one direction only: $a_n = \sin(\pi n) = 0$ converges to $0$, although $\sin(\pi x)$ has no limit as $x \to \infty$.</p>` },
        { type: 'text', html: String.raw`<p><b>Example:</b> $\displaystyle\lim_{n\to\infty} \frac{(\ln n)^2}{n}$. We pass to the function $f(x) = \dfrac{(\ln x)^2}{x}$, $x \ge 1$; if $f(x)$ has a limit as $x \to \infty$, the sequence has the same limit.</p>` },
        { type: 'derive', colors: { u: 1, v: 2 }, steps: [
          { kind: 'calculus', label: String.raw`L'Hôpital: differentiate top and bottom`, from: String.raw`\lim_{x\to\infty}\dfrac{\T{u-1}{(\ln x)^2}}{\T{v-1}{x}}`, to: String.raw`\lim_{x\to\infty}\dfrac{\T{u-1}{2\ln x\cdot\frac1x}}{\T{v-1}{1}}`,
            why: String.raw`The quotient has the form $\infty/\infty$, so L'Hôpital's rule applies. The chain rule gives $\big((\ln x)^2\big)' = 2\ln x\cdot\frac1x$.` },
          { kind: 'calc', label: 'Simplify', to: String.raw`\lim_{x\to\infty}\dfrac{\T{u-1}{2\ln x}}{\T{v-1}{x}}`, why: String.raw`$\frac{2\ln x\cdot\frac1x}{1} = \frac{2\ln x}{x}$.` },
          { kind: 'calculus', label: String.raw`L'Hôpital again`, to: String.raw`\lim_{x\to\infty}\dfrac{\T{u-1}{2/x}}{\T{v-1}{1}}`, why: String.raw`Still $\infty/\infty$; $(2\ln x)' = \frac2x$ and $x' = 1$.` },
          { kind: 'result', label: String.raw`$\frac2x \to 0$`, from: String.raw`\lim_{x\to\infty}\dfrac{2/x}{1}`, to: String.raw`= 0`, why: String.raw`Hence $\frac{(\ln n)^2}{n} \to 0$. (Any power of $\ln n$ loses against any positive power of $n$.)` },
        ] },
        { type: 'derive', title: String.raw`Example: $\displaystyle\lim_{n\to\infty} \frac{n + \sin(n^2)}{2n - 1}$ by squeezing`, colors: { s: 1, k: 2 }, steps: [
          { kind: 'start', label: 'Bound the oscillating part', from: String.raw`-1 \le \sin(n^2) \le 1`, to: String.raw`-1 \le \T{s-1}{\sin(n^2)} \le 1`, why: String.raw`Sine always lies between $-1$ and $1$, whatever its argument.` },
          { kind: 'both', label: String.raw`All three parts $+\,n$`, to: String.raw`n - 1 \le n + \T{s-1}{\sin(n^2)} \le n + 1`, why: String.raw`Adding the same number to every part of an inequality keeps it true.` },
          { kind: 'both', label: String.raw`All three parts $\div (2n - 1)$`, from: String.raw`n - 1 \le \T{s-1}{n + \sin(n^2)} \le n + 1`, to: String.raw`\dfrac{n - 1}{\T{k-1}{2n - 1}} \le \dfrac{\T{s-1}{n + \sin(n^2)}}{\T{k-2}{2n - 1}} \le \dfrac{n + 1}{\T{k-3}{2n - 1}}`,
            why: String.raw`For $n \ge 1$, $2n - 1 > 0$; dividing by a positive number keeps the direction of $\le$. The middle is $a_n$.` },
          { kind: 'calc', label: 'Limits of the bounds', from: String.raw`\dfrac{n \mp 1}{2n - 1}`, to: String.raw`\dfrac{1 \mp \frac1n}{2 - \frac1n} \to \dfrac{1}{2}`,
            why: String.raw`Divide top and bottom by $n$; $\frac1n \to 0$. Both bounds tend to $\frac12$.` },
          { kind: 'result', label: 'Squeeze theorem', to: String.raw`a_n \to \dfrac12`, why: String.raw`$a_n$ is trapped between two sequences with the same limit $\frac12$.` },
        ] },
        { type: 'quiz', question: String.raw`What is $\displaystyle\lim_{n\to\infty} n\sin\!\left(\frac{1}{n}\right)$?`, choices: [String.raw`$0$`, String.raw`$1$`, String.raw`$\infty$`, String.raw`The limit does not exist`], answer: 1, explain: String.raw`With $t = 1/x \to 0^+$: $\displaystyle\lim_{x\to\infty} x\sin(1/x) = \lim_{t\to 0^+} \frac{\sin t}{t} = 1$, so the sequence tends to $1$.` },
      ],
    },
    {
      id: 'exponential-oscillation',
      title: 'Limits of the form (1 + a/n)^n, and oscillation',
      blocks: [
        { type: 'text', html: String.raw`<p>Expressions like $\left(\frac{n}{n+2}\right)^n$ are a tug of war: the base tends to $1$, the exponent to $\infty$ — the form $1^\infty$ is indeterminate. The widget shows that this one settles at $e^{-2} \approx 0.135$.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_n = (n/(n+2))^n → e^(−2)',
          a: '(n./(n + 2)).^n', nmax: 60, L: Math.exp(-2), Ltex: 'e^{-2}', eps: 0.05, ylim: [0, 0.4],
        } },
        { type: 'callout', kind: 'key', title: 'The logarithm trick', html: String.raw`<p>For $1^\infty$, $0^0$ or $\infty^0$ forms take the logarithm: $\ln a_n = b_n \ln(\text{base})$ is a $0\cdot\infty$ form, which L'Hôpital (applied to a function of $x$) can handle. If $\ln a_n \to M$ then $a_n = e^{\ln a_n} \to e^M$ because $e^x$ is continuous. The standard result is</p>$$\lim_{n\to\infty}\left(1 + \frac{a}{n}\right)^n = e^a \qquad\text{for every real } a.$$` },
        { type: 'derive', title: String.raw`Example: $\displaystyle\lim_{n\to\infty} \left(\frac{2n+1}{2n-1}\right)^n$`, colors: { x: 1, u: 2, v: 3 }, steps: [
          { kind: 'both', label: String.raw`Take $\ln$ of both sides`, from: String.raw`a_n = \left(\dfrac{2n+1}{2n-1}\right)^{\T{x-1}{n}}`, to: String.raw`\ln a_n = \T{x-1}{n}\,\ln\dfrac{2n+1}{2n-1}`, arrows: { 'x-1': 'exponent comes down' },
            why: String.raw`$\ln(b^n) = n\ln b$: the logarithm turns the troublesome exponent into a factor.` },
          { kind: 'sub', label: String.raw`Pass to $x$ and write the factor as a denominator`, to: String.raw`\ln y(x) = \dfrac{\T{u-1}{\ln(2x+1) - \ln(2x-1)}}{\T{v-1}{1/x}}`,
            why: String.raw`$\ln\frac{A}{B} = \ln A - \ln B$, and multiplying by $x$ is dividing by $\frac1x$. As $x \to \infty$ this is a $0/0$ form.` },
          { kind: 'calculus', label: String.raw`L'Hôpital: differentiate top and bottom`, to: String.raw`\dfrac{\T{u-1}{\frac{2}{2x+1} - \frac{2}{2x-1}}}{\T{v-1}{-\frac{1}{x^2}}}`, why: String.raw`Chain rule: $\big(\ln(2x \pm 1)\big)' = \frac{2}{2x \pm 1}$; $\big(x^{-1}\big)' = -x^{-2}$.` },
          { kind: 'calc', label: 'Common denominator on top', to: String.raw`\dfrac{\T{u-1}{\frac{-4}{4x^2 - 1}}}{\T{v-1}{-\frac{1}{x^2}}}`, why: String.raw`$\frac{2(2x-1) - 2(2x+1)}{(2x+1)(2x-1)} = \frac{-4}{4x^2 - 1}$.` },
          { kind: 'calc', label: String.raw`Dividing by $-\frac1{x^2}$ is multiplying by $-x^2$`, from: String.raw`\dfrac{\frac{-4}{4x^2 - 1}}{-\frac{1}{x^2}}`, to: String.raw`\dfrac{4x^2}{4x^2 - 1} \to 1`, why: String.raw`The two minus signs cancel. Equal degrees: the limit is the ratio $\frac44 = 1$. So $\ln a_n \to 1$.` },
          { kind: 'result', label: String.raw`Undo the logarithm`, to: String.raw`a_n = e^{\ln a_n} \to e^1 = e`, why: String.raw`The exponential function is continuous, so the limit can be taken inside it.` },
        ] },
        { type: 'text', html: String.raw`<p>Not every sequence settles down. The sequence $a_n = 3^{\sin(\pi n/2)}$ cycles through $3, 1, \tfrac13, 1, 3, 1, \tfrac13, \dots$ forever:</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_n = 3^sin(πn/2) oscillates',
          a: '3.^sin(pi*n/2)', nmax: 24, ylim: [0, 3.5],
        } },
        { type: 'callout', kind: 'thm', title: 'Proving divergence with subsequences', html: String.raw`<p>If $a_n \to L$, then <b>every</b> subsequence also tends to $L$. So two subsequences with different limits prove divergence: here $a_{4k+1} = 3^1 = 3 \to 3$ but $a_{4k+3} = 3^{-1} \to \tfrac13$, hence $\{3^{\sin(\pi n/2)}\}$ diverges. Note that $\cos(\pi n) = (-1)^n$ and $\sin(\pi n) = 0$ for integers $n$.</p>` },
        { type: 'quiz', question: String.raw`$\displaystyle\lim_{n\to\infty}\left(1 - \frac{3}{n}\right)^{2n}$ equals`, choices: [String.raw`$e^{-3}$`, String.raw`$e^{-6}$`, String.raw`$e^{6}$`, String.raw`$1$`], answer: 1, explain: String.raw`$\left(1 - \frac3n\right)^{2n} = \left[\left(1 + \frac{-3}{n}\right)^{n}\right]^2 \to (e^{-3})^2 = e^{-6}$, using continuity of $t \mapsto t^2$.` },
        { type: 'quiz', question: String.raw`Which sequence converges?`, choices: [String.raw`$(-1)^n\dfrac{n}{n+1}$`, String.raw`$\cos(\pi n)$`, String.raw`$\dfrac{\cos(\pi n)}{n}$`, String.raw`$2^{(-1)^n}$`], answer: 2, explain: String.raw`$\left|\frac{\cos \pi n}{n}\right| = \frac1n \to 0$, so it converges to $0$. The others have even- and odd-indexed subsequences with different limits ($\pm1$, $\pm1$, and $2$ vs $\tfrac12$).` },
      ],
    },
    {
      id: 'monotone-recursive',
      title: 'Monotone bounded and recursive sequences',
      blocks: [
        { type: 'text', html: String.raw`<p>A <b>recursive</b> sequence is defined by a starting value and a rule $a_{n+1} = g(a_n)$. Below, $a_1 = 1$ and $a_{n+1} = \sqrt{2 + a_n}$. The terms increase, but never pass $2$ — and they converge to $2$.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_1 = 1, a_(n+1) = √(2 + a_n)',
          recursive: { a1: 1, next: 'sqrt(2 + a)' }, nmax: 15, L: 2, eps: 0.1, ylim: [0.8, 2.2],
        } },
        { type: 'callout', kind: 'thm', title: 'Monotone convergence theorem', html: String.raw`<p>A sequence that is <b>increasing and bounded above</b>, or <b>decreasing and bounded below</b> (from some index on), converges. It is enough that the conditions hold for $n \ge n_0$.</p>` },
        { type: 'callout', kind: 'key', title: 'Fixed points', html: String.raw`<p>If $a_{n+1} = g(a_n)$, $a_n \to L$ and $g$ is continuous at $L$, then letting $n \to \infty$ on both sides gives $L = g(L)$. The limit must be a <b>fixed point</b> of $g$ — but only <i>after</i> you know the limit exists.</p>` },
        { type: 'text', html: String.raw`<p><b>Example:</b> $a_1 = 1$, $a_{n+1} = \sqrt{2 + a_n}$. The plan: (1) show by induction that $1 \le a_n < 2$ (it holds for $a_1 = 1$); (2) show that the sequence is increasing; (3) conclude by the monotone convergence theorem that a limit $L$ exists; (4) only then find $L$ from the recursion.</p>` },
        { type: 'derive', colors: { a: 1, L: 2, m: 3 }, steps: [
          { kind: 'both', label: String.raw`(1) Induction step: all parts $+2$`, from: String.raw`1 \le \T{a-1}{a_n} < 2`, to: String.raw`3 \le 2 + \T{a-1}{a_n} < 4`, why: String.raw`Assume $1 \le a_n < 2$. Adding $2$ to every part keeps the inequalities.` },
          { kind: 'both', label: String.raw`Square root of all parts`, to: String.raw`1 < \sqrt3 \le \sqrt{2 + \T{a-1}{a_n}} = a_{n+1} < \sqrt4 = 2`,
            why: String.raw`$\sqrt{\ }$ is increasing, so it keeps the order. Hence $1 \le a_{n+1} < 2$ as well: the bound passes from $n$ to $n+1$.` },
          { kind: 'sub', label: String.raw`(2) Increasing: use $a_{n+1}^2 = 2 + a_n$`, from: String.raw`a_{n+1}^2 - a_n^2`, to: String.raw`2 + a_n - a_n^2`, why: String.raw`Squaring the recursion gives $a_{n+1}^2 = 2 + a_n$.` },
          { kind: 'factor', label: 'Factor', to: String.raw`(2 - a_n)(1 + a_n) > 0`, why: String.raw`Multiply out to check: $2 + 2a_n - a_n - a_n^2$. Both factors are positive because $a_n < 2$ and $a_n > 0$.` },
          { kind: 'result', label: 'Positive terms keep the order when squared', to: String.raw`a_{n+1}^2 > a_n^2\ \Rightarrow\ a_{n+1} > a_n`,
            why: String.raw`(3) Increasing and bounded above by $2$: by the monotone convergence theorem the sequence converges. Call the limit $L$.` },
          { kind: 'sub', label: String.raw`(4) Let $n \to \infty$ on both sides`, from: String.raw`\T{a-1}{a_{n+1}} = \sqrt{2 + \T{a-2}{a_n}}`, to: String.raw`\T{L-1}{L} = \sqrt{2 + \T{L-2}{L}}`, map: { 'a-1': 'L-1', 'a-2': 'L-2' },
            why: String.raw`Both $a_{n+1}$ and $a_n$ tend to $L$, and $\sqrt{2 + x}$ is continuous.` },
          { kind: 'both', label: 'Square both sides', to: String.raw`\T{L-1}{L^2} = 2 + \T{L-2}{L}`, why: String.raw`Both sides are non-negative, so squaring is safe here.` },
          { kind: 'both', label: String.raw`Both sides $-2 - L$`, from: String.raw`L^2 = \T{m-1}{2} + \T{m-2}{L}`, to: String.raw`L^2 \T{m-2}{- L} \T{m-1}{- 2} = 0`, arrows: { 'm-1': '−2 on both sides', 'm-2': '−L on both sides' },
            why: String.raw`Subtracting on both sides moves the terms to the left with a minus sign.` },
          { kind: 'factor', label: 'Factor', from: String.raw`L^2 - L - 2 = 0`, to: String.raw`(L - 2)(L + 1) = 0`, why: String.raw`Two numbers with product $-2$ and sum $-1$: $-2$ and $1$.` },
          { kind: 'result', label: 'Pick the root that fits', to: String.raw`L = 2`, why: String.raw`$L = -1$ is impossible: all terms satisfy $a_n \ge 1$, so $L \ge 1$.` },
        ] },
        { type: 'callout', kind: 'warn', title: 'Why existence comes first', html: String.raw`<p>For $a_1 = 1$, $a_{n+1} = 2a_n$ the "fixed point" equation $L = 2L$ gives $L = 0$, yet $a_n = 2^{n-1} \to \infty$. Solving $L = g(L)$ without proving convergence is a classic lost point.</p>` },
        { type: 'quiz', question: String.raw`Let $a_1 = 0$ and $a_{n+1} = 1 + \dfrac{a_n}{3}$. The sequence is increasing and bounded. What is its limit?`, choices: [String.raw`$1$`, String.raw`$\dfrac32$`, String.raw`$3$`, String.raw`$\dfrac43$`], answer: 1, explain: String.raw`$L = 1 + L/3$ gives $\tfrac23 L = 1$, so $L = \tfrac32$.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'vectors-plots',
      title: 'Sequences as vectors: n = 1:N, plot and stem',
      blocks: [
        { type: 'text', html: String.raw`<p>In MATLAB a sequence is just a vector. Create the index vector <code>n = 1:N</code> and compute all terms at once with element-wise operators. Plot the terms as <b>dots</b> (<code>plot(n, a, '.')</code>) or as a <b>stem plot</b> — never as a connected line, since a sequence has no values between the integers. <code>format long</code> shows 15 significant digits, which helps when you watch a limit being approached.</p>` },
        { type: 'code', caption: 'Terms of a_n = (2n+1)/(n+3), the limit line, and the first N with |a_n − 2| < 0.3 for all later n.', editable: true, code: String.raw`n = 1:60;
a = (2*n + 1) ./ (n + 3);
plot(n, a, '.')
yline(2)
grid on
xlabel('n')
title('a_n = (2n+1)/(n+3)')
% last index where the distance is still at least 0.3, plus one
N = max(find(abs(a - 2) >= 0.3)) + 1
format long
a(end)
format short` },
        { type: 'code', caption: 'The 1^∞ limit (1 + 2/n)^n → e^2: the convergence is slow (error about e^2/n).', editable: true, code: String.raw`n = 1:200;
a = (1 + 2./n).^n;
stem(n, a)
yline(exp(2))
grid on
err = exp(2) - a(end)` },
        { type: 'callout', kind: 'matlab', html: String.raw`<p>MATLAB has no built-in constant $e$: write <code>exp(1)</code>. And <code>n/(n+3)</code> without the dot would try to solve a linear system — use <code>./</code>.</p>` },
        { type: 'matlab', prompt: String.raw`Compute the first $1000$ terms of $a_n = \dfrac{5n^2 - 3}{2n^2 + n}$ into a vector <code>a</code> and store the last term in <code>aN</code>. (Compare with the limit $5/2$.)`, starter: `n = 1:1000;\na = 0;   % replace 0 by the formula\naN = 0;  % replace 0 by the last term`, solution: `n = 1:1000;\na = (5*n.^2 - 3) ./ (2*n.^2 + n);\naN = a(end);`, checks: [{ var: 'a', size: 1000 }, { var: 'aN', value: '(5*1000^2-3)/(2*1000^2+1000)', tol: 1e-12 }], hint: String.raw`Use <code>.^</code> and <code>./</code>; the last element is <code>a(end)</code>.` },
        { type: 'matlab', prompt: String.raw`Make a <code>stem</code> plot of $a_n = \left(1 - \dfrac{1}{n}\right)^{n}$ for $n = 1, \dots, 50$ and draw the limit $e^{-1}$ with <code>yline</code>. Store the vector of terms in <code>a</code> and the last term in <code>a50</code>.`, starter: `n = 1:50;\na = 0 * n;   % replace by the formula\nstem(n, a)\n`, solution: `n = 1:50;\na = (1 - 1./n).^n;\nstem(n, a)\nyline(exp(-1))\ngrid on\na50 = a(end);`, checks: [{ figure: true }, { uses: 'stem' }, { var: 'a', size: 50 }, { var: 'a50', value: '(1 - 1/50)^50', tol: 1e-12, message: 'Check the formula of the terms.' }] },
        { type: 'latex', prompt: 'Type the standard limit in LaTeX:', target: String.raw`\lim_{n \to \infty} \left(1 + \frac{a}{n}\right)^n = e^a` },
      ],
    },
    {
      id: 'recursive-loops',
      title: 'Recursive sequences with for and while loops',
      blocks: [
        { type: 'text', html: String.raw`<p>A recursive sequence needs a loop: each term is computed from the previous one. Preallocate the vector with <code>zeros</code>, set the first term, and fill the rest. MATLAB indices start at 1, which matches $a_1$.</p>` },
        { type: 'code', caption: 'a_1 = 1, a_(n+1) = sqrt(2 + a_n): a table of terms and a plot.', editable: true, code: String.raw`N = 12;
a = zeros(1, N);
a(1) = 1;
for k = 1:N-1
    a(k+1) = sqrt(2 + a(k));
end
fprintf('%2d   %.12f\n', [1:N; a])
plot(1:N, a, 'o')
yline(2)
grid on` },
        { type: 'text', html: String.raw`<p>When you do not know in advance how many terms are needed, use a <code>while</code> loop with a stopping condition. The block below finds the first $n$ for which $(1 + 1/n)^n$ is within $0.01$ of $e$.</p>` },
        { type: 'code', editable: true, code: String.raw`n = 1;
while exp(1) - (1 + 1/n)^n >= 0.01
    n = n + 1;
end
n` },
        { type: 'text', html: String.raw`<p>In a homework answer, the numerical table <b>supports</b> the proof but does not replace it. A complete Live Script answer for a recursive sequence looks like this:</p>` },
        { type: 'livescript', caption: 'Model answer: a_1 = 1, a_(n+1) = sqrt(2 + a_n)', blocks: [
          { type: 'heading', content: 'Problem (Attempted)' },
          { type: 'text', content: String.raw`We first show by induction that $1 \le a_n < 2$ for all $n$. This holds for $a_1 = 1$, and if $1 \le a_n < 2$, then` },
          { type: 'equation', content: String.raw`\sqrt{3} \le a_{n+1} = \sqrt{2 + a_n} < \sqrt{4} = 2 .` },
          { type: 'text', content: String.raw`Next we show that the sequence is increasing, using $0 < a_n < 2$:` },
          { type: 'equation', content: String.raw`a_{n+1}^2 - a_n^2 = 2 + a_n - a_n^2 = (2 - a_n)(1 + a_n) > 0 .` },
          { type: 'text', content: String.raw`The sequence is increasing and bounded above, so it converges by the monotone convergence theorem. Letting $n \to \infty$ in the recursion, the limit $L \ge 1$ satisfies $L = \sqrt{2 + L}$, i.e. $(L-2)(L+1) = 0$, so $L = 2$. We check numerically:` },
          { type: 'code', content: String.raw`a = 1;
for k = 1:30
    a = sqrt(2 + a);
end
fprintf('a_31 = %.12f\n', a)` },
        ] },
        { type: 'matlab', prompt: String.raw`Let $a_1 = 2$ and $a_{n+1} = 1 + \dfrac{1}{a_n}$. Compute $a_1, \dots, a_{30}$ into a vector <code>a</code> with a <code>for</code> loop and store $a_{30}$ in <code>L</code>. (The limit is the golden ratio $\frac{1+\sqrt5}{2}$: it solves $L = 1 + 1/L$.)`, starter: `a = zeros(1, 30);\na(1) = 2;\nfor k = 1:29\n    a(k+1) = 0;   % replace 0 by the recursion\nend\nL = 0;   % replace 0 by the last term`, solution: `a = zeros(1, 30);\na(1) = 2;\nfor k = 1:29\n    a(k+1) = 1 + 1/a(k);\nend\nL = a(end);`, checks: [{ var: 'a', size: 30 }, { var: 'L', value: '(1+sqrt(5))/2', tol: 1e-8 }] },
        { type: 'matlab', prompt: String.raw`Use a <code>while</code> loop to find the first $n$ such that $\dfrac{\ln n}{n} < 0.01$, and store it in <code>n</code>. (The sequence decreases for $n \ge 3$, so after this index all terms stay below $0.01$.)`, starter: `n = 3;\nwhile false   % replace false by the condition\n    n = n + 1;\nend\nn`, solution: `n = 3;\nwhile log(n)/n >= 0.01\n    n = n + 1;\nend\nn`, checks: [{ var: 'n', value: 648 }], hint: String.raw`The loop continues while the condition for "not yet small enough" holds: <code>log(n)/n >= 0.01</code>.` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Limits of sequences',
      difficulty: 'core',
      hw: 'HW5-style',
      statement: String.raw`<p>Determine the limits, or decide that the sequence diverges. State which rule (limit laws, L'Hôpital on a function, squeeze, subsequences) you use.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \frac{7n^2 - 4n}{3 - 2n^2}$`, kind: 'numeric', answer: '-7/2', hint: String.raw`Divide numerator and denominator by $n^2$.`, solution: [
          { type: 'text', html: String.raw`<p>We divide numerator and denominator by $n^2$, the highest power in the denominator, and use the limit laws.</p>` },
          { type: 'derive', colors: { z: 1 }, steps: [
            { kind: 'both', label: String.raw`Numerator and denominator $\div n^2$`, from: String.raw`\dfrac{7n^2 - 4n}{3 - 2n^2}`, to: String.raw`\dfrac{7 - \T{z-1}{\frac{4}{n}}}{\T{z-2}{\frac{3}{n^2}} - 2}`, why: String.raw`Dividing top and bottom by the same number does not change the fraction.` },
            { kind: 'calc', label: String.raw`$\frac{c}{n^p} \to 0$`, to: String.raw`\to \dfrac{7 - \T{z-1}{0}}{\T{z-2}{0} - 2}`, why: String.raw`Limit laws; the denominator's limit $-2$ is not $0$.` },
            { kind: 'result', label: String.raw`$7 \div (-2)$`, to: String.raw`= -\dfrac72`, why: String.raw`The ratio of the leading coefficients $7$ and $-2$.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \left(\sqrt{n^2 + 3n} - n\right)$`, kind: 'numeric', answer: '3/2', hint: String.raw`Multiply and divide by the conjugate $\sqrt{n^2+3n} + n$.`, solution: [
          { type: 'text', html: String.raw`<p>$\infty - \infty$ is indeterminate, so we multiply by the conjugate to turn the difference into a fraction, then divide by $n$.</p>` },
          { type: 'derive', colors: { s: 1 }, steps: [
            { kind: 'both', label: 'Multiply by the conjugate over itself', from: String.raw`\sqrt{n^2+3n} - n`, to: String.raw`\left(\sqrt{n^2+3n} - n\right)\cdot\dfrac{\sqrt{n^2+3n} + n}{\sqrt{n^2+3n} + n}`, why: String.raw`The extra fraction equals $1$, so the value is unchanged.` },
            { kind: 'expand', label: String.raw`$(A - B)(A + B) = A^2 - B^2$`, to: String.raw`\dfrac{(n^2 + 3n) - n^2}{\sqrt{n^2+3n} + n}`, why: String.raw`With $A = \sqrt{n^2+3n}$ and $B = n$, the square root disappears on top.` },
            { kind: 'cancel', label: String.raw`$n^2 - n^2 = 0$`, from: String.raw`\dfrac{\T{s-1}{n^2} + 3n - \T{s-2}{n^2}}{\sqrt{n^2+3n} + n}`, to: String.raw`\dfrac{3n}{\sqrt{n^2+3n} + n}`, why: String.raw`The two $n^2$ terms cancel.` },
            { kind: 'both', label: String.raw`Numerator and denominator $\div n$`, to: String.raw`\dfrac{3}{\sqrt{1 + \frac3n} + 1}`, why: String.raw`For $n > 0$, $n = \sqrt{n^2}$, so $\frac{\sqrt{n^2+3n}}{n} = \sqrt{\frac{n^2 + 3n}{n^2}} = \sqrt{1 + \frac3n}$.` },
            { kind: 'result', label: String.raw`$\frac3n \to 0$`, to: String.raw`\to \dfrac{3}{\sqrt1 + 1} = \dfrac32`, why: String.raw`The square root is continuous, so the limit can be taken inside it.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`$a_n = 3^{\sin(\pi n/2)}$`, kind: 'choice', choices: [String.raw`converges to $1$`, String.raw`converges to $3$`, String.raw`diverges: subsequences tend to $3$ and $\tfrac13$`, String.raw`diverges to $\infty$`], answer: 2, solution: String.raw`$a_{4k+1} = 3$ and $a_{4k+3} = 3^{-1} = \tfrac13$ for all $k$. Two subsequences with different limits, so the sequence diverges (it stays bounded, so it does not tend to $\infty$).` },
        { label: '(d)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \frac{\cos^2 n}{\sqrt n}$`, kind: 'numeric', answer: '0', solution: String.raw`$0 \le \dfrac{\cos^2 n}{\sqrt n} \le \dfrac{1}{\sqrt n} \to 0$, so the limit is $0$ by the squeeze theorem.` },
        { label: '(e)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \frac{\ln(n^3 + 1)}{\ln n}$`, kind: 'numeric', answer: '3', hint: String.raw`Use L'Hôpital on $f(x) = \ln(x^3+1)/\ln x$.`, solution: [
          { type: 'text', html: String.raw`<p>We pass to the function $f(x) = \dfrac{\ln(x^3+1)}{\ln x}$, an $\infty/\infty$ form, and apply L'Hôpital's rule.</p>` },
          { type: 'derive', colors: { u: 1, v: 2 }, steps: [
            { kind: 'calculus', label: String.raw`L'Hôpital: differentiate top and bottom`, from: String.raw`\lim_{x\to\infty}\dfrac{\T{u-1}{\ln(x^3+1)}}{\T{v-1}{\ln x}}`, to: String.raw`\lim_{x\to\infty}\dfrac{\T{u-1}{\frac{3x^2}{x^3+1}}}{\T{v-1}{\frac1x}}`, why: String.raw`Chain rule on top: $\frac{1}{x^3+1}\cdot 3x^2$.` },
            { kind: 'calc', label: String.raw`Dividing by $\frac1x$ is multiplying by $x$`, from: String.raw`\lim_{x\to\infty}\dfrac{\frac{3x^2}{x^3+1}}{\frac1x}`, to: String.raw`\lim_{x\to\infty}\dfrac{3x^3}{x^3 + 1}`, why: String.raw`$\frac{3x^2}{x^3+1}\cdot x = \frac{3x^3}{x^3+1}$.` },
            { kind: 'result', label: 'Equal degrees', to: String.raw`= 3`, why: String.raw`The ratio of the leading coefficients. Hence $a_n = f(n) \to 3$.` },
          ] },
        ] },
      ],
    },
    {
      id: 'a2',
      title: 'Limits of the form 1^∞',
      difficulty: 'core',
      hw: 'HW5-style',
      statement: String.raw`<p>Compute the limits. Give exact values as MATLAB expressions, e.g. <code>exp(-2)</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \left(1 + \frac{3}{n}\right)^{2n}$`, kind: 'numeric', answer: 'exp(6)', tol: 1e-6, solution: [
          { type: 'text', html: String.raw`<p>We rewrite the power so that the standard limit $\left(1 + \frac an\right)^n \to e^a$ appears.</p>` },
          { type: 'derive', colors: { s: 1 }, steps: [
            { kind: 'factor', label: String.raw`$b^{2n} = (b^n)^2$`, from: String.raw`\left(1 + \frac3n\right)^{2n}`, to: String.raw`\left[\T{s-1}{\left(1 + \frac3n\right)^{n}}\right]^2`, why: String.raw`Power rule for exponents: $b^{2n} = (b^n)^2$.` },
            { kind: 'sub', label: String.raw`Standard limit with $a = 3$`, to: String.raw`\to \left[\T{s-1}{e^3}\right]^2`, why: String.raw`The inner part tends to $e^3$, and $t \mapsto t^2$ is continuous.` },
            { kind: 'result', label: String.raw`$(e^3)^2 = e^6$`, to: String.raw`= e^6`, why: String.raw`Multiply the exponents.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \left(\frac{n+2}{n-1}\right)^{n}$`, kind: 'numeric', answer: 'exp(3)', tol: 1e-6, hint: String.raw`Write $\frac{n+2}{n-1} = 1 + \frac{3}{n-1}$ and take logarithms.`, solution: [
          { type: 'text', html: String.raw`<p>A $1^\infty$ form: we take logarithms, pass to a function of $x$ and use L'Hôpital.</p>` },
          { type: 'derive', colors: { u: 1, v: 2 }, steps: [
            { kind: 'both', label: String.raw`$\ln$ of both sides, then pass to $x$`, from: String.raw`a_n = \left(\dfrac{n+2}{n-1}\right)^{n}`, to: String.raw`\ln y(x) = \dfrac{\T{u-1}{\ln(x+2) - \ln(x-1)}}{\T{v-1}{1/x}}`, why: String.raw`$\ln(b^n) = n\ln b$, $\ln\frac AB = \ln A - \ln B$, and multiplying by $x$ is dividing by $\frac1x$. A $0/0$ form.` },
            { kind: 'calculus', label: String.raw`L'Hôpital`, to: String.raw`\dfrac{\T{u-1}{\frac{1}{x+2} - \frac{1}{x-1}}}{\T{v-1}{-1/x^2}}`, why: String.raw`Differentiate numerator and denominator separately.` },
            { kind: 'calc', label: 'Common denominator on top, then divide', from: String.raw`\dfrac{\frac{1}{x+2} - \frac{1}{x-1}}{-1/x^2}`, to: String.raw`\dfrac{\frac{-3}{(x+2)(x-1)}}{-1/x^2} = \dfrac{3x^2}{(x+2)(x-1)}`, why: String.raw`$(x-1) - (x+2) = -3$; dividing by $-\frac1{x^2}$ is multiplying by $-x^2$, and the minus signs cancel.` },
            { kind: 'calc', label: 'Equal degrees', to: String.raw`\to 3`, why: String.raw`$(x+2)(x-1) = x^2 + x - 2$, leading coefficient $1$. So $\ln a_n \to 3$.` },
            { kind: 'result', label: 'Undo the logarithm', to: String.raw`a_n = e^{\ln a_n} \to e^3`, why: String.raw`$e^x$ is continuous.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} n^{1/n}$`, kind: 'numeric', answer: '1', solution: [
          { type: 'text', html: String.raw`<p>An $\infty^0$ form: we take logarithms and use L'Hôpital on $\frac{\ln x}{x}$.</p>` },
          { type: 'derive', steps: [
            { kind: 'both', label: String.raw`$\ln$ of both sides`, from: String.raw`a_n = n^{1/n}`, to: String.raw`\ln a_n = \dfrac{\ln n}{n}`, why: String.raw`$\ln\big(n^{1/n}\big) = \frac1n\ln n$.` },
            { kind: 'calculus', label: String.raw`L'Hôpital on $\frac{\ln x}{x}$`, from: String.raw`\lim_{x\to\infty}\dfrac{\ln x}{x}`, to: String.raw`\lim_{x\to\infty}\dfrac{1/x}{1} = 0`, why: String.raw`An $\infty/\infty$ form; $(\ln x)' = \frac1x$, $x' = 1$.` },
            { kind: 'result', label: 'Undo the logarithm', to: String.raw`a_n = e^{\ln a_n} \to e^0 = 1`, why: String.raw`$e^x$ is continuous.` },
          ] },
        ] },
        { label: '(d)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \left(1 - \frac{1}{n^2}\right)^{n}$`, kind: 'numeric', answer: '1', solution: [
          { type: 'text', html: String.raw`<p>We take logarithms, pass to $x$, and use L'Hôpital on the $0/0$ form.</p>` },
          { type: 'derive', colors: { u: 1, v: 2 }, steps: [
            { kind: 'both', label: String.raw`$\ln$ of both sides, then pass to $x$`, from: String.raw`a_n = \left(1 - \frac{1}{n^2}\right)^{n}`, to: String.raw`\ln y(x) = \dfrac{\T{u-1}{\ln(1 - x^{-2})}}{\T{v-1}{1/x}}`, why: String.raw`$\ln(b^n) = n\ln b$, and multiplying by $x$ is dividing by $\frac1x$.` },
            { kind: 'calculus', label: String.raw`L'Hôpital`, to: String.raw`\dfrac{\T{u-1}{\frac{2x^{-3}}{1 - x^{-2}}}}{\T{v-1}{-x^{-2}}}`, why: String.raw`Chain rule: $\big(\ln(1 - x^{-2})\big)' = \frac{2x^{-3}}{1 - x^{-2}}$.` },
            { kind: 'calc', label: String.raw`Divide by $-x^{-2}$`, from: String.raw`\dfrac{\frac{2x^{-3}}{1 - x^{-2}}}{-x^{-2}}`, to: String.raw`\dfrac{-2x^{-1}}{1 - x^{-2}} = \dfrac{-2}{x - 1/x}`, why: String.raw`$\frac{x^{-3}}{x^{-2}} = x^{-1}$; then multiply top and bottom by $x$.` },
            { kind: 'calc', label: String.raw`The denominator grows`, to: String.raw`\to 0`, why: String.raw`$x - \frac1x \to \infty$. So $\ln a_n \to 0$.` },
            { kind: 'result', label: 'Undo the logarithm', to: String.raw`a_n \to e^0 = 1`, why: String.raw`Contrast with $(1 - 1/n)^n \to e^{-1}$: here the base approaches $1$ too fast.` },
          ] },
        ] },
      ],
    },
    {
      id: 'a3',
      title: 'A recursive sequence',
      difficulty: 'challenge',
      hw: 'HW5-style',
      statement: String.raw`<p>Let $a_1 = 1$ and $a_{n+1} = \dfrac{a_n}{2} + \dfrac{3}{a_n}$ for $n \ge 1$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $a_2$.`, kind: 'numeric', answer: '7/2', solution: String.raw`$a_2 = \tfrac12 + 3 = \tfrac72$.` },
        { label: '(b)', prompt: String.raw`Compute $a_3$ exactly.`, kind: 'numeric', answer: '73/28', tol: 1e-8, solution: [
          { type: 'text', html: String.raw`<p>We put $a_2 = \frac72$ into the recursion and add the fractions.</p>` },
          { type: 'derive', colors: { a: 1 }, steps: [
            { kind: 'sub', label: String.raw`Put $a_2 = \frac72$`, from: String.raw`a_3 = \dfrac{\T{a-1}{a_2}}{2} + \dfrac{3}{\T{a-2}{a_2}}\qquad a_2 = \T{a-3}{\tfrac72}`, to: String.raw`a_3 = \dfrac{\T{a-3}{7/2}}{2} + \dfrac{3}{\T{a-4}{7/2}}`, map: { 'a-3': ['a-3', 'a-4'] }, arrows: { 'a-3': '' }, why: String.raw`Both places where $a_2$ occurs get the value.` },
            { kind: 'calc', label: 'Simplify each fraction', from: String.raw`a_3 = \dfrac{7/2}{2} + \dfrac{3}{7/2}`, to: String.raw`a_3 = \tfrac74 + \tfrac67`, why: String.raw`$\frac{7/2}{2} = \frac74$; dividing by $\frac72$ is multiplying by $\frac27$: $3\cdot\frac27 = \frac67$.` },
            { kind: 'calc', label: 'Common denominator 28', to: String.raw`a_3 = \tfrac{49}{28} + \tfrac{24}{28} = \tfrac{73}{28} \approx 2.6071`, why: String.raw`$\frac74 = \frac{49}{28}$, $\frac67 = \frac{24}{28}$.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`Assuming the sequence converges, find its limit $L$.`, kind: 'numeric', answer: 'sqrt(6)', tol: 1e-8, solution: [
          { type: 'text', html: String.raw`<p>If $a_n \to L$, letting $n \to \infty$ in the recursion gives an equation for $L$, which we solve.</p>` },
          { type: 'derive', colors: { h: 1, L: 2 }, steps: [
            { kind: 'sub', label: String.raw`Let $n \to \infty$`, from: String.raw`a_{n+1} = \dfrac{a_n}{2} + \dfrac{3}{a_n}`, to: String.raw`L = \T{h-1}{\dfrac{L}{2}} + \dfrac{3}{L}`, why: String.raw`Both $a_{n+1}$ and $a_n$ tend to $L$; the right side is continuous for $L \ne 0$.` },
            { kind: 'both', label: String.raw`Both sides $-\frac L2$`, to: String.raw`\dfrac{L}{2} = \dfrac{3}{L}`, why: String.raw`$L - \frac L2 = \frac L2$ on the left; the $\frac L2$ on the right is gone.` },
            { kind: 'both', label: String.raw`Both sides $\times 2L$`, to: String.raw`L^2 = 6`, why: String.raw`$\frac L2\cdot 2L = L^2$ and $\frac3L\cdot 2L = 6$.` },
            { kind: 'result', label: 'Positive square root', to: String.raw`L = \sqrt6`, why: String.raw`All terms are positive, so $L \ge 0$ and $-\sqrt6$ is excluded.` },
          ] },
        ] },
        { label: '(d)', prompt: String.raw`Prove that the sequence converges: show that $a_n \ge \sqrt6$ for $n \ge 2$ and that the sequence is decreasing from $n = 2$ on. Write the answer as a Live Script and support it with a short table of terms.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 3 (Attempted)' },
        { type: 'text', content: String.raw`All terms are positive: $a_1 = 1 > 0$, and if $a_n > 0$ then $a_{n+1} = a_n/2 + 3/a_n > 0$. We show that $a_{n+1} \ge \sqrt6$ for every $n \ge 1$ by writing the difference as a square:` },
        { type: 'equation', content: String.raw`a_{n+1} - \sqrt6 = \frac{a_n^2 - 2\sqrt6\,a_n + 6}{2a_n} = \frac{\left(a_n - \sqrt6\right)^2}{2a_n} \ge 0 .` },
        { type: 'text', content: String.raw`Hence $a_n \ge \sqrt6$ for all $n \ge 2$. Next we show that the sequence is decreasing from $n = 2$ on:` },
        { type: 'equation', content: String.raw`a_{n+1} - a_n = \frac{3}{a_n} - \frac{a_n}{2} = \frac{6 - a_n^2}{2a_n} \le 0 \quad\text{for } n \ge 2, \text{ since } a_n^2 \ge 6 .` },
        { type: 'text', content: String.raw`The sequence $\{a_n\}_{n \ge 2}$ is decreasing and bounded below by $\sqrt6$, so it converges by the monotone convergence theorem. Letting $n \to \infty$ in the recursion, the limit satisfies $L = L/2 + 3/L$, i.e. $L^2 = 6$, and $L \ge \sqrt6 > 0$ gives $L = \sqrt6$. A table of the first terms confirms this:` },
        { type: 'code', content: String.raw`N = 7;
a = zeros(1, N);
a(1) = 1;
for k = 1:N-1
    a(k+1) = a(k)/2 + 3/a(k);
end
fprintf('%d   %.12f\n', [1:N; a])
fprintf('sqrt(6) = %.12f\n', sqrt(6))` },
      ],
    },
    {
      id: 'a4',
      title: 'Squeeze, growth rates and fixed points',
      difficulty: 'exam',
      statement: String.raw`<p>Short exam-style questions.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \left(2^n + 5^n\right)^{1/n}$`, kind: 'numeric', answer: '5', hint: String.raw`Squeeze: $5^n \le 2^n + 5^n \le 2\cdot 5^n$.`, solution: [
          { type: 'text', html: String.raw`<p>We trap $2^n + 5^n$ between two multiples of $5^n$, take $n$-th roots, and squeeze.</p>` },
          { type: 'derive', steps: [
            { kind: 'start', label: String.raw`Bound the inside`, from: String.raw`0 < 2^n \le 5^n`, to: String.raw`5^n \le 2^n + 5^n \le 5^n + 5^n = 2\cdot 5^n`, why: String.raw`Add $5^n$ to all parts of $0 < 2^n \le 5^n$.` },
            { kind: 'both', label: String.raw`$n$-th root of all three parts`, to: String.raw`5 \le a_n \le 2^{1/n}\cdot 5`, why: String.raw`$t \mapsto t^{1/n}$ is increasing, so it keeps the order; $(2\cdot5^n)^{1/n} = 2^{1/n}\cdot 5$.` },
            { kind: 'calc', label: String.raw`$2^{1/n} \to 1$`, to: String.raw`2^{1/n} = e^{(\ln 2)/n} \to e^0 = 1`, why: String.raw`$\frac{\ln 2}{n} \to 0$ and $e^x$ is continuous. So the upper bound tends to $5$.` },
            { kind: 'result', label: 'Squeeze theorem', to: String.raw`a_n \to 5`, why: String.raw`Both bounds tend to $5$.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`The sequence $a_n = \dfrac{n!}{n^n}$`, kind: 'choice', choices: [String.raw`converges to $0$`, String.raw`converges to $1$`, String.raw`converges to $e^{-1}$`, String.raw`diverges to $\infty$`], answer: 0, solution: [
          { type: 'text', html: String.raw`<p>We split the fraction into $n$ factors and bound all but the first by $1$.</p>` },
          { type: 'derive', colors: { f: 1, g: 2 }, steps: [
            { kind: 'expand', label: 'Write as a product of n fractions', from: String.raw`\dfrac{n!}{n^n}`, to: String.raw`\T{f-1}{\dfrac{1}{n}}\cdot\T{g-1}{\dfrac{2}{n}\cdots\dfrac{n}{n}}`, why: String.raw`$n! = 1\cdot 2\cdots n$ and $n^n = n\cdot n\cdots n$, one $n$ under each factor.` },
            { kind: 'both', label: String.raw`Each factor after the first is $\le 1$`, to: String.raw`0 < \dfrac{n!}{n^n} \le \T{f-1}{\dfrac{1}{n}}`, why: String.raw`$\frac kn \le 1$ for $k \le n$, so dropping those factors can only make the product larger (or equal).` },
            { kind: 'result', label: 'Squeeze theorem', to: String.raw`a_n \to 0`, why: String.raw`$0 \to 0$ and $\frac1n \to 0$.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`$a_1 = 0$, $a_{n+1} = \sqrt{6 + a_n}$. The sequence is increasing and bounded above by $3$. Find $\lim a_n$.`, kind: 'numeric', answer: '3', solution: [
          { type: 'text', html: String.raw`<p>The limit exists (given), so we let $n \to \infty$ in the recursion and solve for $L$.</p>` },
          { type: 'derive', colors: { m: 1 }, steps: [
            { kind: 'sub', label: String.raw`Let $n \to \infty$, then square`, from: String.raw`a_{n+1} = \sqrt{6 + a_n}`, to: String.raw`L^2 = \T{m-1}{6} + \T{m-2}{L}`, why: String.raw`$L = \sqrt{6 + L}$; both sides are non-negative, so squaring is safe.` },
            { kind: 'both', label: String.raw`Both sides $-6 - L$`, to: String.raw`L^2 \T{m-2}{- L} \T{m-1}{- 6} = 0`, arrows: { 'm-1': '−6 on both sides', 'm-2': '−L on both sides' }, why: String.raw`Subtracting on both sides moves the terms to the left with a minus sign.` },
            { kind: 'factor', label: 'Factor', from: String.raw`L^2 - L - 6 = 0`, to: String.raw`(L - 3)(L + 2) = 0`, why: String.raw`Product $-6$, sum $-1$: $-3$ and $2$.` },
            { kind: 'result', label: 'Pick the root that fits', to: String.raw`L = 3`, why: String.raw`$a_n \ge 0$, so $L \ge 0$ and $L = -2$ is excluded.` },
          ] },
        ] },
        { label: '(d)', prompt: String.raw`Which statement is true for every sequence?`, choices: [String.raw`If $a_n$ is bounded, it converges.`, String.raw`If $a_n$ is increasing, it converges.`, String.raw`If $|a_n| \to 0$, then $a_n \to 0$.`, String.raw`If $|a_n| \to 1$, then $a_n \to 1$ or $a_n \to -1$.`], kind: 'choice', answer: 2, solution: String.raw`$-|a_n| \le a_n \le |a_n|$ and the squeeze theorem give (c). Counterexamples: $(-1)^n$ is bounded and $|(-1)^n| \to 1$ but it diverges; $a_n = n$ is increasing and diverges.` },
      ],
    },
  ],
};
