// Module 6: Area, Riemann sums and the definite integral

export default {
  id: 'definite-integral',
  number: 6,
  part: 'integration',
  hw: 'HW0',
  title: 'Area, Riemann sums and the definite integral',
  summary: 'The area problem, sigma notation and Riemann sums, the definite integral as a limit and as signed area, its properties (linearity, additivity, comparison, symmetry), integrals of |f| by splitting at sign changes, and the mean value of a function. MATLAB: Riemann sums with vectors and sum(), checks with integral().',
  intro: String.raw`<p>How much area lies under a curve? Approximate it by rectangles, add them up, and let the rectangles get thinner: the limit is the <b>definite integral</b> $\int_a^b f(x)\,\mathrm d x$. This module builds the integral from that picture, collects the rules that make it easy to compute, and handles the typical homework trap — integrals of absolute values, which must be split where the expression changes sign.</p>`,
  lessons: [
    {
      id: 'riemann-sums',
      title: 'The area problem and Riemann sums',
      blocks: [
        { type: 'text', html: String.raw`<p>Split $[a, b]$ into $n$ subintervals of width $\Delta x = \frac{b-a}{n}$ with endpoints $x_i = a + i\,\Delta x$. On each subinterval build a rectangle whose height is the function value at a <b>sample point</b>: the left endpoint, the right endpoint or the midpoint. Change the rule and increase $n$: all three sums approach the same number.</p>` },
        { type: 'widget', name: 'riemann', config: {
          title: 'Riemann sums for f(x) = x² on [0, 2]',
          f: 'x.^2', a: 0, b: 2, n: 4, method: 'left', nmax: 80, exact: 8 / 3, exactTex: String.raw`\tfrac{8}{3}`,
          xlim: [-0.2, 2.2], ylim: [-0.3, 4.5],
        } },
        { type: 'callout', kind: 'def', title: 'Sigma notation and Riemann sums', html: String.raw`<p>$\displaystyle\sum_{i=1}^{n} c_i = c_1 + c_2 + \dots + c_n$. With sample points $x_i^*$ in the $i$-th subinterval, the <b>Riemann sum</b> is</p>$$S_n = \sum_{i=1}^{n} f(x_i^*)\,\Delta x .$$<p>Left sum: $x_i^* = x_{i-1}$; right sum: $x_i^* = x_i$; midpoint sum: $x_i^* = \tfrac{1}{2}(x_{i-1} + x_i)$.</p>` },
        { type: 'table', head: ['Sum', 'Closed form'], rows: [
          [String.raw`$\sum_{i=1}^{n} c$`, String.raw`$nc$`],
          [String.raw`$\sum_{i=1}^{n} i$`, String.raw`$\frac{n(n+1)}{2}$`],
          [String.raw`$\sum_{i=1}^{n} i^2$`, String.raw`$\frac{n(n+1)(2n+1)}{6}$`],
          [String.raw`$\sum_{i=1}^{n} i^3$`, String.raw`$\left(\frac{n(n+1)}{2}\right)^2$`],
        ] },
        { type: 'steps', title: String.raw`Example: the right sum $R_n$ for $f(x) = x^2$ on $[0, 2]$ and its limit`, steps: [
          String.raw`We set up the partition: $\Delta x = \frac{2 - 0}{n} = \frac{2}{n}$ and the right endpoints are $x_i = \frac{2i}{n}$, $i = 1, \dots, n$.`,
          String.raw`We write the sum: $R_n = \sum_{i=1}^{n} \left(\frac{2i}{n}\right)^2 \frac{2}{n} = \frac{8}{n^3}\sum_{i=1}^{n} i^2$.`,
          String.raw`We use the closed form for $\sum i^2$: $R_n = \frac{8}{n^3}\cdot\frac{n(n+1)(2n+1)}{6} = \frac{4(n+1)(2n+1)}{3n^2}$.`,
          String.raw`We let $n \to \infty$: $\frac{(n+1)(2n+1)}{n^2} \to 2$, so $R_n \to \frac{8}{3}$. The area under $y = x^2$ on $[0,2]$ is $\frac{8}{3}$.`,
        ] },
        { type: 'quiz', question: String.raw`$f$ is increasing on $[a, b]$. Which statement always holds (exact area $A$)?`, choices: [String.raw`$R_n \le A \le L_n$`, String.raw`$L_n \le A \le R_n$`, String.raw`$M_n = A$`, String.raw`$L_n = R_n$`], answer: 1, explain: String.raw`For an increasing function the left endpoint is the lowest point of each subinterval, so every left rectangle lies under the graph; every right rectangle reaches above it.` },
        { type: 'quiz', question: String.raw`$\displaystyle\sum_{i=1}^{4} (2i - 1) = \;?$`, choices: ['10', '16', '20', '7'], answer: 1, explain: String.raw`$1 + 3 + 5 + 7 = 16$. In general $\sum_{i=1}^{n}(2i-1) = 2\cdot\frac{n(n+1)}{2} - n = n^2$.` },
      ],
    },
    {
      id: 'definite-integral',
      title: 'The definite integral as signed area',
      blocks: [
        { type: 'text', html: String.raw`<p>When $f$ takes negative values, the terms $f(x_i^*)\Delta x$ are negative: the Riemann sum counts area <b>below</b> the axis with a minus sign. Its limit is therefore a <b>signed area</b>. Drag $b$ and watch the blue and red parts compete.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Signed area of f(x) = x³ − 3x on [0, b]',
          functions: [{ expr: 'x.^3 - 3*x', label: String.raw`$x^3 - 3x$` }],
          params: { b: { min: 0.1, max: 2.4, value: 2.2, label: '$b$' } },
          shade: { expr: 'x.^3 - 3*x', from: 0, to: 'b', signed: true },
          xlim: [-0.5, 2.6], ylim: [-3, 6],
          animate: { param: 'b', from: 0.1, to: 2.4, duration: 6000 },
          readout: String.raw`$\int_0^b (x^3 - 3x)\,\mathrm d x = \frac{b^4}{4} - \frac{3b^2}{2} = {{b^4/4 - 3*b^2/2}}$. The signed area is zero at $b = \sqrt 6 \approx 2.449$.`,
        } },
        { type: 'callout', kind: 'def', title: 'Definite integral', html: String.raw`<p>If the limit exists and is the same for every choice of sample points,</p>$$\int_a^b f(x)\,\mathrm d x = \lim_{n \to \infty} \sum_{i=1}^{n} f(x_i^*)\,\Delta x .$$<p>Every continuous function on $[a, b]$ is integrable, and so is every bounded function with finitely many jumps. The variable $x$ is a dummy: $\int_a^b f(x)\,\mathrm d x = \int_a^b f(t)\,\mathrm d t$.</p>` },
        { type: 'callout', kind: 'key', html: String.raw`<p>$\int_a^b f(x)\,\mathrm d x = (\text{area above the } x\text{-axis}) - (\text{area below the } x\text{-axis})$. The geometric area is $\int_a^b |f(x)|\,\mathrm d x$.</p>` },
        { type: 'steps', title: String.raw`Example: $\int_0^3 (x - 1)\,\mathrm d x$ from geometry`, steps: [
          String.raw`We locate the sign change: $x - 1 < 0$ on $[0, 1)$ and $x - 1 > 0$ on $(1, 3]$.`,
          String.raw`The part below the axis is a triangle with base $1$ and height $1$: area $\frac{1}{2}$, counted negative.`,
          String.raw`The part above the axis is a triangle with base $2$ and height $2$: area $2$.`,
          String.raw`We add the signed areas: $\int_0^3 (x - 1)\,\mathrm d x = 2 - \frac{1}{2} = \frac{3}{2}$, while the geometric area is $2 + \frac{1}{2} = \frac{5}{2}$.`,
        ] },
        { type: 'quiz', question: String.raw`$\displaystyle\int_{-2}^{2} \sqrt{4 - x^2}\,\mathrm d x = \;?$`, choices: [String.raw`$4\pi$`, String.raw`$2\pi$`, String.raw`$\pi$`, String.raw`$0$`], answer: 1, explain: String.raw`$y = \sqrt{4 - x^2}$ is the upper half of the circle of radius $2$. Half of $\pi \cdot 2^2$ is $2\pi$.` },
      ],
    },
    {
      id: 'properties',
      title: 'Properties, absolute values and the mean value',
      blocks: [
        { type: 'text', html: String.raw`<p>The <b>mean value</b> of $f$ on $[a, b]$ is the height of the rectangle with the same base and the same (signed) area as the region under $f$. Move $b$: the dashed line sits at $f_{\text{avg}} = \frac{1}{b}\int_0^b x^2\,\mathrm d x = \frac{b^2}{3}$, and the shaded area equals the rectangle under the dashed line.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Mean value of f(x) = x² on [0, b]',
          functions: [{ expr: 'x.^2', label: String.raw`$x^2$` }, { expr: 'b.^2/3 + 0*x', label: String.raw`$f_{\text{avg}} = b^2/3$`, dash: true }],
          params: { b: { min: 0.3, max: 2.5, value: 2, label: '$b$' } },
          shade: { expr: 'x.^2', from: 0, to: 'b' },
          vlines: ['b/sqrt(3)'],
          xlim: [-0.2, 2.7], ylim: [-0.3, 6.5],
          readout: String.raw`$f_{\text{avg}} = {{b^2/3}}$, attained at $c = b/\sqrt3 = {{b/sqrt(3)}}$ (vertical line): $f(c) = f_{\text{avg}}$.`,
        } },
        { type: 'callout', kind: 'thm', title: 'Properties of the definite integral', html: String.raw`<ul>
<li>Linearity: $\int_a^b \big(\alpha f + \beta g\big)\,\mathrm d x = \alpha\int_a^b f\,\mathrm d x + \beta\int_a^b g\,\mathrm d x$.</li>
<li>$\int_a^a f\,\mathrm d x = 0$ and $\int_b^a f\,\mathrm d x = -\int_a^b f\,\mathrm d x$.</li>
<li>Interval additivity: $\int_a^b f\,\mathrm d x + \int_b^c f\,\mathrm d x = \int_a^c f\,\mathrm d x$ (for any order of $a, b, c$).</li>
<li>Comparison: if $f \le g$ on $[a, b]$ then $\int_a^b f \le \int_a^b g$. In particular $m(b-a) \le \int_a^b f\,\mathrm d x \le M(b-a)$ when $m \le f \le M$.</li>
<li>Symmetry: $\int_{-a}^{a} f\,\mathrm d x = 0$ for odd $f$, and $= 2\int_0^a f\,\mathrm d x$ for even $f$.</li>
<li>Mean value: $f_{\text{avg}} = \frac{1}{b-a}\int_a^b f(x)\,\mathrm d x$; if $f$ is continuous there is a $c \in [a, b]$ with $f(c) = f_{\text{avg}}$.</li>
</ul>` },
        { type: 'callout', kind: 'note', title: 'Preview of Module 7', html: String.raw`<p>If $F' = f$ on $[a, b]$ and $f$ is continuous, then $\int_a^b f(x)\,\mathrm d x = \Big[ F(x) \Big]_a^b = F(b) - F(a)$. We use this notation already; the proof is the Fundamental Theorem of Calculus.</p>` },
        { type: 'steps', title: String.raw`Example (Homework 0, Problem 3b): $\displaystyle\int_{-3}^{3} |4x - 1|\,\mathrm d x$`, steps: [
          String.raw`We find where the expression inside the absolute value changes sign: $4x - 1 = 0$ at $x = \frac{1}{4}$. Hence $|4x - 1| = 1 - 4x$ for $x < \frac14$ and $|4x-1| = 4x - 1$ for $x \ge \frac14$.`,
          String.raw`We split the integral at $x = \frac14$ using interval additivity: $\int_{-3}^{3} |4x-1|\,\mathrm d x = \int_{-3}^{1/4} (1 - 4x)\,\mathrm d x + \int_{1/4}^{3} (4x - 1)\,\mathrm d x$.`,
          String.raw`The graph is two straight pieces, so each integral is a triangle. Left: base $3 + \frac14 = \frac{13}{4}$, height $|4(-3) - 1| = 13$, area $\frac12\cdot\frac{13}{4}\cdot 13 = \frac{169}{8}$.`,
          String.raw`Right: base $3 - \frac14 = \frac{11}{4}$, height $4\cdot 3 - 1 = 11$, area $\frac12\cdot\frac{11}{4}\cdot 11 = \frac{121}{8}$.`,
          String.raw`We add: $\frac{169}{8} + \frac{121}{8} = \frac{290}{8} = \frac{145}{4} = 36.25$. With antiderivatives: $\Big[x - 2x^2\Big]_{-3}^{1/4} + \Big[2x^2 - x\Big]_{1/4}^{3} = \frac{169}{8} + \frac{121}{8}$, the same.`,
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>$\int_a^b |f(x)|\,\mathrm d x \ne \left|\int_a^b f(x)\,\mathrm d x\right|$ in general. Here $\left|\int_{-3}^3 (4x-1)\,\mathrm d x\right| = |{-6}| = 6$, far from $\frac{145}{4}$.</p>` },
        { type: 'quiz', question: String.raw`$\displaystyle\int_{-1}^{1} \left(x^5 + 3\right)\mathrm d x = \;?$`, choices: ['0', '3', '6', String.raw`$\tfrac{1}{3}$`], answer: 2, explain: String.raw`$x^5$ is odd, so its integral over $[-1, 1]$ vanishes; the constant gives $3 \cdot 2 = 6$.` },
        { type: 'quiz', question: String.raw`What is the mean value of $f(x) = \sqrt{4 - x^2}$ on $[0, 2]$?`, choices: [String.raw`$\pi$`, String.raw`$\pi/2$`, String.raw`$\pi/4$`, String.raw`$1$`], answer: 1, explain: String.raw`The region is a quarter disc of radius 2, area $\pi$. Dividing by the length $2$ gives $\pi/2$.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'riemann-sums-matlab',
      title: 'Riemann sums with vectors, sum() and integral()',
      blocks: [
        { type: 'text', html: String.raw`<p>A Riemann sum is a single line of MATLAB: build the vector of sample points, evaluate the (vectorised) function on it, add with <code>sum</code> and multiply by $\Delta x$. The built-in <code>integral(f, a, b)</code> computes the limit to about 10 significant digits and is the standard way to <b>check</b> a hand computation.</p>` },
        { type: 'code', caption: 'Left, right and midpoint sums for x² on [0, 2]. Change n and run again.', editable: true, code: `f = @(x) x.^2;
a = 0; b = 2; n = 100;
dx = (b - a)/n;
i = 1:n;                       % indices 1, 2, ..., n
L = sum(f(a + (i-1)*dx))*dx    % left endpoints
R = sum(f(a + i*dx))*dx        % right endpoints
M = sum(f(a + (i-0.5)*dx))*dx  % midpoints
I = integral(f, a, b)          % numerical value of the integral
fprintf('Errors: L %.2e, R %.2e, M %.2e\\n', I-L, I-R, I-M)` },
        { type: 'text', html: String.raw`<p>In the Live Editor equation editor, sums and integrals use subscripts and superscripts for their limits. Remember the thin space <code>\,</code> before $\mathrm d x$.</p>` },
        { type: 'table', head: ['Type', 'Result'], rows: [
          [String.raw`<code>\sum_{i=1}^{n} f(x_i)\,\Delta x</code>`, String.raw`$\sum_{i=1}^{n} f(x_i)\,\Delta x$`],
          [String.raw`<code>\Delta x = \frac{b-a}{n}</code>`, String.raw`$\Delta x = \frac{b-a}{n}$`],
          [String.raw`<code>\int_a^b f(x)\,\mathrm d x</code>`, String.raw`$\int_a^b f(x)\,\mathrm d x$`],
          [String.raw`<code>\lim_{n \to \infty}</code>`, String.raw`$\lim_{n \to \infty}$`],
        ] },
        { type: 'latex', prompt: 'Type the right Riemann sum:', target: String.raw`R_n = \sum_{i=1}^{n} f(x_i)\,\Delta x`, hint: String.raw`<code>\sum_{i=1}^{n}</code>, then <code>\Delta x</code>.` },
        { type: 'latex', prompt: 'Type the definition of the definite integral:', target: String.raw`\int_a^b f(x)\,\mathrm d x = \lim_{n \to \infty} \sum_{i=1}^{n} f(x_i^*)\,\Delta x`, accept: [String.raw`\int_{a}^{b} f(x)\,dx = \lim_{n\to\infty}\sum_{i=1}^{n} f(x_i^{*})\,\Delta x`] },
        { type: 'matlab', prompt: String.raw`Compute the midpoint sum $M_{50}$ of $f(x) = e^{-x^2}$ on $[0, 1]$ and store it in <code>M</code>. Store <code>integral(f, 0, 1)</code> in <code>I</code>.`, starter: `f = @(x) 0;      % replace 0 by the formula\na = 0; b = 1; n = 50;\ndx = 0;          % replace 0 by the width\nM = 0            % replace 0 by the midpoint sum\nI = 0            % replace 0 by integral(f, a, b)`, solution: `f = @(x) exp(-x.^2);\na = 0; b = 1; n = 50;\ndx = (b - a)/n;\nM = sum(f(a + ((1:n) - 0.5)*dx))*dx\nI = integral(f, a, b)`, checks: [{ var: 'M', value: 'sum(exp(-(((1:50)-0.5)/50).^2))/50', tol: 1e-9 }, { var: 'I', value: 0.746824132812427, tol: 1e-8 }, { uses: 'integral' }], hint: String.raw`Midpoints are <code>a + ((1:n) - 0.5)*dx</code>.` },
        { type: 'matlab', prompt: String.raw`For $f(x) = \sin x$ on $[0, \pi]$, compute the right sums for $n = 10$ and $n = 100$ in <code>R10</code> and <code>R100</code>. The exact value is $2$; see how the error shrinks.`, starter: `f = @(x) sin(x);\na = 0; b = pi;\nR10 = 0     % replace 0 by the right sum with n = 10\nR100 = 0    % replace 0 by the right sum with n = 100`, solution: `f = @(x) sin(x);\na = 0; b = pi;\nR10 = sum(f(a + (1:10)*(b-a)/10))*(b-a)/10\nR100 = sum(f(a + (1:100)*(b-a)/100))*(b-a)/100`, checks: [{ var: 'R10', value: 'sum(sin((1:10)*pi/10))*pi/10', tol: 1e-9 }, { var: 'R100', value: 'sum(sin((1:100)*pi/100))*pi/100', tol: 1e-9 }] },
      ],
    },
    {
      id: 'absolute-values-matlab',
      title: 'Absolute values, splitting and the bracket notation',
      blocks: [
        { type: 'text', html: String.raw`<p>An integral of $|f|$ is computed by hand by splitting at the zeros of $f$. MATLAB's <code>abs</code> is element-wise, so <code>integral(@(x) abs(4*x - 1), -3, 3)</code> checks the answer directly. When the zero is not obvious, <code>fzero</code> finds it and the split can be done numerically as well.</p><p>The evaluation bracket is typed <code>\Big[ F(x) \Big]_a^b</code>; <code>\Big</code> makes the brackets taller than the expression.</p>` },
        { type: 'livescript', caption: 'Model answer (Homework 0, Problem 3b)', blocks: [
          { type: 'heading', content: 'Problem 3b (Attempted)' },
          { type: 'text', content: 'The expression $4x - 1$ changes sign at $x = 1/4$, so we split the integral at that point and remove the absolute value on each piece:' },
          { type: 'equation', content: String.raw`\int_{-3}^{3} |4x-1|\,\mathrm d x = \int_{-3}^{1/4} (1-4x)\,\mathrm d x + \int_{1/4}^{3} (4x-1)\,\mathrm d x .` },
          { type: 'text', content: 'We evaluate both integrals with antiderivatives:' },
          { type: 'equation', content: String.raw`= \Big[ x - 2x^2 \Big]_{-3}^{1/4} + \Big[ 2x^2 - x \Big]_{1/4}^{3} = \frac{169}{8} + \frac{121}{8} = \frac{145}{4}.` },
          { type: 'text', content: 'We check the result numerically:' },
          { type: 'code', content: "I = integral(@(x) abs(4*x - 1), -3, 3);\nfprintf('integral: %.6f, exact 145/4 = %.6f\\n', I, 145/4)" },
        ] },
        { type: 'latex', prompt: 'Type the evaluation of the second piece:', target: String.raw`\Big[ 2x^2 - x \Big]_{1/4}^{3} = \frac{121}{8}`, accept: [String.raw`\Big[2x^2-x\Big]_{\frac{1}{4}}^{3}=\frac{121}{8}`] },
        { type: 'code', caption: 'Splitting at a zero found numerically: ∫ from 0 to 2 of |cos(2x) − x/2|.', editable: true, code: `f = @(x) cos(2*x) - x/2;
c = fzero(f, 0.6)                       % sign change inside [0, 2]
I1 = integral(f, 0, c);                 % f > 0 here
I2 = integral(f, c, 2);                 % f < 0 here
Isplit = I1 - I2
Iabs = integral(@(x) abs(f(x)), 0, 2)   % same number
fplot(@(x) abs(f(x)), [0 2]); grid on` },
        { type: 'matlab', prompt: String.raw`Compute $\int_0^2 |x^2 - 1|\,\mathrm d x$ with <code>integral</code> and <code>abs</code>, and store it in <code>I</code>. (By hand: split at $x = 1$; the answer is $2$.)`, starter: `I = 0   % replace 0 by integral(...)`, solution: `I = integral(@(x) abs(x.^2 - 1), 0, 2)`, checks: [{ var: 'I', value: 2, tol: 1e-7 }, { uses: 'integral' }] },
        { type: 'matlab', prompt: String.raw`Compute the mean value of $f(x) = \sin x$ on $[0, \pi]$ and store it in <code>favg</code>.`, starter: `f = @(x) sin(x);\nfavg = 0   % replace 0 by the mean value`, solution: `f = @(x) sin(x);\nfavg = integral(f, 0, pi)/(pi - 0)`, checks: [{ var: 'favg', value: '2/pi', tol: 1e-8 }], hint: String.raw`$f_{\text{avg}} = \frac{1}{b-a}\int_a^b f(x)\,\mathrm d x$.` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Riemann sums by hand',
      difficulty: 'core',
      statement: String.raw`<p>Let $f(x) = 1 + x^2$ on $[0, 2]$ with $n = 4$ subintervals.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute the left sum $L_4$.`, kind: 'numeric', answer: '15/4', hint: String.raw`$\Delta x = 0.5$; sample points $0, 0.5, 1, 1.5$.`, solution: String.raw`$L_4 = 0.5\,\big(f(0) + f(0.5) + f(1) + f(1.5)\big) = 0.5\,(1 + 1.25 + 2 + 3.25) = 3.75$.` },
        { label: '(b)', prompt: String.raw`Compute the right sum $R_4$.`, kind: 'numeric', answer: '23/4', solution: String.raw`$R_4 = 0.5\,(1.25 + 2 + 3.25 + 5) = 5.75$.` },
        { label: '(c)', prompt: String.raw`Compute the midpoint sum $M_4$.`, kind: 'numeric', answer: '37/8', solution: String.raw`$M_4 = 0.5\,\big(f(0.25) + f(0.75) + f(1.25) + f(1.75)\big) = 0.5\,(1.0625 + 1.5625 + 2.5625 + 4.0625) = 4.625$.` },
        { label: '(d)', prompt: String.raw`The exact value is $\int_0^2 (1 + x^2)\,\mathrm d x = \frac{14}{3}$. Which ordering is correct?`, kind: 'choice', choices: [String.raw`$L_4 < M_4 < \frac{14}{3} < R_4$`, String.raw`$L_4 < \frac{14}{3} < M_4 < R_4$`, String.raw`$M_4 < L_4 < \frac{14}{3} < R_4$`, String.raw`$L_4 < M_4 < R_4 < \frac{14}{3}$`], answer: 0, solution: String.raw`$3.75 < 4.625 < 4.667 < 5.75$. $f$ is increasing, so $L_4 < A < R_4$; for a convex function the midpoint rule underestimates.` },
      ],
    },
    {
      id: 'a2',
      title: 'From a Riemann sum to an integral',
      difficulty: 'core',
      statement: String.raw`<p>Let $f(x) = x^3$ on $[0, 1]$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Using $\sum_{i=1}^n i^3 = \left(\frac{n(n+1)}{2}\right)^2$, give the right sum $R_n$ as a function of $n$ (type it in MATLAB syntax with variable <code>n</code>).`, kind: 'expression', variable: 'n', answer: '(n+1).^2./(4*n.^2)', domain: [1, 20], hint: String.raw`$\Delta x = \frac1n$, $x_i = \frac in$.`, solution: String.raw`$R_n = \sum_{i=1}^{n} \frac{i^3}{n^3}\cdot\frac1n = \frac{1}{n^4}\cdot\frac{n^2(n+1)^2}{4} = \frac{(n+1)^2}{4n^2}$.` },
        { label: '(b)', prompt: String.raw`Compute $\displaystyle\int_0^1 x^3\,\mathrm d x = \lim_{n\to\infty} R_n$.`, kind: 'numeric', answer: '1/4', solution: String.raw`$\frac{(n+1)^2}{4n^2} = \frac14\left(1 + \frac1n\right)^2 \to \frac14$.` },
        { label: '(c)', prompt: String.raw`Which integral equals $\displaystyle\lim_{n\to\infty}\sum_{i=1}^{n} \frac{2}{n}\sqrt{1 + \frac{2i}{n}}$?`, kind: 'choice', choices: [String.raw`$\int_0^2 \sqrt{1 + x}\,\mathrm d x$`, String.raw`$\int_0^1 \sqrt{1 + 2x}\,\mathrm d x$`, String.raw`$\int_0^2 \sqrt{1 + 2x}\,\mathrm d x$`, String.raw`$\int_1^2 \sqrt{x}\,\mathrm d x$`], answer: 0, solution: String.raw`$\Delta x = \frac2n$ means an interval of length 2, and $x_i = \frac{2i}{n}$ are the right endpoints of $[0, 2]$; the integrand is $\sqrt{1 + x}$. (Equivalently $\int_1^3 \sqrt x\,\mathrm d x$.) Option 2 has the wrong $\Delta x$.` },
      ],
    },
    {
      id: 'a3',
      title: 'Absolute values and symmetry',
      difficulty: 'core',
      hw: 'HW0-style',
      statement: String.raw`<p>Evaluate the integrals. Split at sign changes and use symmetry where possible.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int_{-3}^{3} |4x - 1|\,\mathrm d x$ (Homework 0, Problem 3b)`, kind: 'numeric', answer: '145/4', hint: String.raw`$4x - 1 = 0$ at $x = 1/4$. Two triangles.`, solution: String.raw`Triangles with bases $\frac{13}{4}$, $\frac{11}{4}$ and heights $13$, $11$: $\frac{169}{8} + \frac{121}{8} = \frac{145}{4}$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_{-1}^{3} |2 - 2x|\,\mathrm d x$`, kind: 'numeric', answer: '8', solution: String.raw`Zero at $x = 1$. Two triangles, each with base $2$ and height $4$: $4 + 4 = 8$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_{-\pi}^{\pi} \left(\sin^3 x + |x|\right)\mathrm d x$`, kind: 'numeric', answer: 'pi^2', solution: String.raw`$\sin^3 x$ is odd and contributes $0$. $|x|$ is even: $2\int_0^\pi x\,\mathrm d x = 2\cdot\frac{\pi^2}{2} = \pi^2$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\left|\int_{-3}^{3} (4x - 1)\,\mathrm d x\right|$ — compare with (a).`, kind: 'numeric', answer: '6', solution: String.raw`$4x$ is odd, so $\int_{-3}^3 (4x - 1)\,\mathrm d x = -6$, and the absolute value is $6 \ne \frac{145}{4}$.` },
      ],
    },
    {
      id: 'a4',
      title: 'Mean value and bounds',
      difficulty: 'core',
      statement: String.raw`<p>Let $f(x) = \sqrt{9 - x^2}$ on $[-3, 3]$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $\int_{-3}^{3} f(x)\,\mathrm d x$ using geometry.`, kind: 'numeric', answer: '9*pi/2', solution: String.raw`Upper half of the disc of radius 3: $\frac12\pi\cdot 3^2 = \frac{9\pi}{2}$.` },
        { label: '(b)', prompt: String.raw`Compute the mean value $f_{\text{avg}}$ on $[-3, 3]$.`, kind: 'numeric', answer: '3*pi/4', solution: String.raw`$f_{\text{avg}} = \frac{1}{6}\cdot\frac{9\pi}{2} = \frac{3\pi}{4} \approx 2.356$.` },
        { label: '(c)', prompt: String.raw`Find the positive $c$ with $f(c) = f_{\text{avg}}$.`, kind: 'numeric', answer: '3*sqrt(1 - pi^2/16)', solution: String.raw`$\sqrt{9 - c^2} = \frac{3\pi}{4}$ gives $c^2 = 9 - \frac{9\pi^2}{16}$, so $c = 3\sqrt{1 - \pi^2/16} \approx 1.857$.` },
        { label: '(d)', prompt: String.raw`Which bounds follow from the comparison property for $\int_0^1 e^{-x^2}\,\mathrm d x$?`, kind: 'choice', choices: [String.raw`$0 \le I \le e^{-1}$`, String.raw`$e^{-1} \le I \le 1$`, String.raw`$1 \le I \le e$`, String.raw`$\frac12 \le I \le e^{-1}$`], answer: 1, solution: String.raw`On $[0,1]$, $e^{-1} \le e^{-x^2} \le 1$; multiply by the length $1$. (Numerically $I \approx 0.7468$.)` },
      ],
    },
    {
      id: 'a5',
      title: 'Write-up: an integral of an absolute value',
      difficulty: 'exam',
      hw: 'HW0-style',
      statement: String.raw`<p>Evaluate $\displaystyle\int_{-1}^{2} |x^2 - 1|\,\mathrm d x$ by splitting at the sign changes, using antiderivatives for the pieces. Write the solution as a Live Script: a sentence before each step, the evaluation with $\Big[ F(x) \Big]_a^b$, and a numerical check with <code>integral</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`The value of the integral:`, kind: 'numeric', answer: '8/3', hint: String.raw`$x^2 - 1 \le 0$ on $[-1, 1]$ and $\ge 0$ on $[1, 2]$.`, solution: String.raw`$\int_{-1}^{1}(1 - x^2)\,\mathrm d x + \int_1^2 (x^2 - 1)\,\mathrm d x = \frac43 + \frac43 = \frac83$.` },
        { label: '(b)', prompt: 'Write the full solution in Live Script style and compare with the model solution.', kind: 'writeup' },
      ],
      writeup: true,
      writeupTemplate: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: 'We find where $x^2 - 1$ changes sign on $[-1, 2]$ ...' },
        { type: 'equation', content: String.raw`\int_{-1}^{2} |x^2-1|\,\mathrm d x = ` },
        { type: 'code', content: "I = integral(@(x) abs(x.^2 - 1), -1, 2)" },
      ],
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: 'The expression $x^2 - 1 = (x-1)(x+1)$ is non-positive on $[-1, 1]$ and non-negative on $[1, 2]$. We split the integral at $x = 1$ and remove the absolute value on each piece:' },
        { type: 'equation', content: String.raw`\int_{-1}^{2} |x^2-1|\,\mathrm d x = \int_{-1}^{1} \left(1 - x^2\right)\mathrm d x + \int_{1}^{2} \left(x^2 - 1\right)\mathrm d x .` },
        { type: 'text', content: 'We evaluate both pieces with the antiderivatives $x - x^3/3$ and $x^3/3 - x$:' },
        { type: 'equation', content: String.raw`\Big[ x - \frac{x^3}{3} \Big]_{-1}^{1} + \Big[ \frac{x^3}{3} - x \Big]_{1}^{2} = \left(\frac23 + \frac23\right) + \left(\frac23 + \frac23\right) = \frac{8}{3}.` },
        { type: 'text', content: 'We confirm the value numerically and plot the integrand:' },
        { type: 'code', content: "f = @(x) abs(x.^2 - 1);\nI = integral(f, -1, 2);\nfprintf('integral: %.6f, exact 8/3 = %.6f\\n', I, 8/3)\nfplot(f, [-1 2]); grid on" },
      ],
    },
  ],
};
