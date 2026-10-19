// Module 8: Substitution and areas between curves (last module of the Integration part: ends with the HW0 capstone)

export default {
  id: 'substitution',
  number: 8,
  part: 'integration',
  hw: 'HW0',
  title: 'Substitution and areas between curves',
  summary: 'The substitution rule for indefinite and definite integrals (changing the limits, choosing u), areas between curves, and the area of a loop of an implicit curve. Ends with a complete Homework 0 problem set with Live Script model solutions.',
  intro: String.raw`<p>Substitution is the chain rule run backwards: if the integrand contains an inner function $g(x)$ together with its derivative $g'(x)$, the new variable $u = g(x)$ turns the integral into a simpler one. With it we can compute areas between curves, including the area enclosed by a loop of an implicitly given curve. The module ends with the full Homework 0 problem set written in the format the graders expect.</p>`,
  lessons: [
    {
      id: 'u-substitution',
      title: 'The substitution rule',
      blocks: [
        { type: 'text', html: String.raw`<p>The function $f(x) = 2x\cos(x^2)$ looks awkward, but it is exactly what the chain rule produces when differentiating $\sin(x^2)$: the derivative of the outer function, $\cos$, at the inner function $x^2$, times the derivative $2x$ of the inner function. Every curve of the family $\sin(x^2) + C$ has slope $f(x)$:</p>` },
        { type: 'widget', name: 'antiderivative', config: {
          title: 'Antiderivatives of 2x cos(x²) are sin(x²) + C',
          f: '2*x.*cos(x.^2)', F: 'sin(x.^2)', xlim: [-3, 3], ylim: [-5, 5],
        } },
        { type: 'callout', kind: 'thm', title: 'Substitution rule (indefinite)', html: String.raw`<p>If $u = g(x)$ is differentiable and $F' = f$, then</p>$$\int f\big(g(x)\big)\,g'(x)\,\mathrm d x = \int f(u)\,\mathrm d u = F\big(g(x)\big) + C .$$<p>In practice: choose $u$, compute $\mathrm d u = g'(x)\,\mathrm d x$, replace <b>every</b> $x$ in the integral, integrate in $u$, substitute back.</p>` },
        { type: 'table', head: ['Pattern in the integrand', 'Choose', 'Result'], rows: [
          [String.raw`$h(ax + b)$`, String.raw`$u = ax + b$`, String.raw`$\frac{1}{a}H(ax + b) + C$`],
          [String.raw`$\frac{g'(x)}{g(x)}$`, String.raw`$u = g(x)$`, String.raw`$\ln|g(x)| + C$`],
          [String.raw`$e^{g(x)}\,g'(x)$`, String.raw`$u = g(x)$`, String.raw`$e^{g(x)} + C$`],
          [String.raw`$g(x)^n\,g'(x)$, $n \ne -1$`, String.raw`$u = g(x)$`, String.raw`$\frac{g(x)^{n+1}}{n+1} + C$`],
          [String.raw`$\sin^n x\,\cos x$`, String.raw`$u = \sin x$`, String.raw`$\frac{\sin^{n+1} x}{n+1} + C$`],
        ] },
        { type: 'steps', title: String.raw`Example (Homework 0, Problem 2a): $\displaystyle\int \frac{\sin 4x}{7 - 2\cos 4x}\,\mathrm d x$`, steps: [
          String.raw`The derivative of the denominator is $8\sin 4x$, a constant multiple of the numerator. We substitute $u = 7 - 2\cos 4x$, so $\mathrm d u = 8\sin 4x\,\mathrm d x$, i.e. $\sin 4x\,\mathrm d x = \frac18\,\mathrm d u$.`,
          String.raw`The integral becomes $\displaystyle\frac18\int \frac{\mathrm d u}{u} = \frac18\ln|u| + C$.`,
          String.raw`We substitute back. Since $7 - 2\cos 4x \ge 5 > 0$, the absolute value can be dropped: $\displaystyle\int \frac{\sin 4x}{7 - 2\cos 4x}\,\mathrm d x = \frac18\ln(7 - 2\cos 4x) + C$.`,
          String.raw`Check by differentiating: $\frac18\cdot\frac{8\sin 4x}{7 - 2\cos 4x}$ is the integrand.`,
        ] },
        { type: 'steps', title: String.raw`Example (Homework 0, Problem 2b): $\displaystyle\int x e^{-x^2}\,\mathrm d x$`, steps: [
          String.raw`We substitute $u = -x^2$, so $\mathrm d u = -2x\,\mathrm d x$ and $x\,\mathrm d x = -\frac12\,\mathrm d u$.`,
          String.raw`Then $\displaystyle\int x e^{-x^2}\,\mathrm d x = -\frac12\int e^{u}\,\mathrm d u = -\frac12 e^{u} + C = -\frac{e^{-x^2}}{2} + C$.`,
        ] },
        { type: 'quiz', question: String.raw`Which substitution turns $\displaystyle\int x^2\left(x^3 + 1\right)^5\mathrm d x$ into $\frac13\int u^5\,\mathrm d u$?`, choices: [String.raw`$u = x^2$`, String.raw`$u = x^3$`, String.raw`$u = x^3 + 1$`, String.raw`$u = (x^3+1)^5$`], answer: 2, explain: String.raw`$u = x^3 + 1$ gives $\mathrm d u = 3x^2\,\mathrm d x$, so $x^2\,\mathrm d x = \frac13\,\mathrm d u$ and the integrand becomes $\frac13 u^5$.` },
      ],
    },
    {
      id: 'definite-substitution',
      title: 'Substitution in definite integrals',
      blocks: [
        { type: 'text', html: String.raw`<p>In a definite integral the substitution also maps the <b>limits</b>: as $x$ runs from $a$ to $b$, $u = g(x)$ runs from $g(a)$ to $g(b)$. The two areas below are equal, even though the regions look completely different. Press <b>Sweep both</b>.</p>` },
        { type: 'widget', name: 'substitution', config: {
          title: 'u = 3x − 2 maps ∫₁⁴ 6/(3x−2)² dx to ∫₁¹⁰ 2/u² du',
          f: '6./(3*x - 2).^2', u: '3*x - 2', fu: '2./u.^2', a: 1, b: 4, uTex: '3x - 2',
          fLabel: '6/(3x-2)^2', fuLabel: '2/u^2', xlim: [0.8, 4.2], ulim: [0.5, 10.5], ylim: [-0.3, 6.5],
        } },
        { type: 'callout', kind: 'thm', title: 'Substitution rule (definite)', html: String.raw`<p>If $g'$ is continuous on $[a, b]$ and $f$ is continuous on the range of $g$, then</p>$$\int_a^b f\big(g(x)\big)\,g'(x)\,\mathrm d x = \int_{g(a)}^{g(b)} f(u)\,\mathrm d u .$$<p>Change the limits and never go back to $x$. Writing $\int_1^4$ in front of a $\mathrm d u$ integral is the classic error.</p>` },
        { type: 'steps', title: String.raw`Example (Homework 0, Problem 3a): $\displaystyle\int_1^4 \frac{6}{(3x-2)^2}\,\mathrm d x$`, steps: [
          String.raw`We substitute $u = 3x - 2$, so $\mathrm d u = 3\,\mathrm d x$ and $\mathrm d x = \frac13\,\mathrm d u$. The limits become $u(1) = 1$ and $u(4) = 10$.`,
          String.raw`The integral becomes $\displaystyle\int_1^{10} \frac{6}{u^2}\cdot\frac13\,\mathrm d u = \int_1^{10} \frac{2}{u^2}\,\mathrm d u$.`,
          String.raw`We evaluate: $\displaystyle\Big[-\frac{2}{u}\Big]_1^{10} = -\frac{2}{10} + 2 = \frac{9}{5}$.`,
        ] },
        { type: 'callout', kind: 'key', title: 'Symmetry is a substitution', html: String.raw`<p>With $x = -t$: $\int_{-a}^{0} f(x)\,\mathrm d x = \int_0^{a} f(-t)\,\mathrm d t$. For odd $f$ this is $-\int_0^a f$, which proves $\int_{-a}^{a} f = 0$; for even $f$ it proves $\int_{-a}^a f = 2\int_0^a f$.</p>` },
        { type: 'quiz', question: String.raw`After $u = 1 + x^2$, the integral $\displaystyle\int_0^1 x\left(1 + x^2\right)^3\mathrm d x$ becomes …`, choices: [String.raw`$\frac12\int_1^2 u^3\,\mathrm d u$`, String.raw`$\int_0^1 u^3\,\mathrm d u$`, String.raw`$\frac12\int_0^1 u^3\,\mathrm d u$`, String.raw`$2\int_1^2 u^3\,\mathrm d u$`], answer: 0, explain: String.raw`$\mathrm d u = 2x\,\mathrm d x$ gives the factor $\frac12$, and the limits $x = 0, 1$ become $u = 1, 2$. The value is $\frac12\cdot\frac{16 - 1}{4} = \frac{15}{8}$.` },
      ],
    },
    {
      id: 'area-between',
      title: 'Areas between curves',
      blocks: [
        { type: 'text', html: String.raw`<p>The area between two curves is a sum of thin vertical strips of height $(\text{top} - \text{bottom})$ and width $\mathrm d x$. Sweep the strip across the region between $y = x + 2$ and $y = x^2$.</p>` },
        { type: 'widget', name: 'areaBetween', config: {
          title: 'Region between y = x + 2 and y = x²',
          f: 'x + 2', g: 'x.^2', a: -1, b: 2, xlim: [-2, 3], ylim: [-0.5, 5], areaTex: String.raw`\frac{9}{2}`,
        } },
        { type: 'callout', kind: 'def', title: 'Area between curves', html: String.raw`$$A = \int_a^b \big|f(x) - g(x)\big|\,\mathrm d x .$$<p>Find the intersection points, decide which curve is on top on each subinterval, and split where they cross. If the region is bounded by curves $x = f(y)$, integrate horizontal strips: $A = \int_c^d \big(x_R(y) - x_L(y)\big)\,\mathrm d y$, where $x_R$ is the right and $x_L$ the left boundary curve.</p>` },
        { type: 'steps', title: String.raw`Example: the area between $y = x + 2$ and $y = x^2$`, steps: [
          String.raw`We find the intersections: $x^2 = x + 2 \iff x^2 - x - 2 = (x - 2)(x + 1) = 0$, so $x = -1$ and $x = 2$.`,
          String.raw`We decide which curve is on top: at $x = 0$, $x + 2 = 2 > 0 = x^2$, so the line is above on $[-1, 2]$.`,
          String.raw`We integrate top minus bottom: $A = \displaystyle\int_{-1}^{2} \left(x + 2 - x^2\right)\mathrm d x = \Big[\frac{x^2}{2} + 2x - \frac{x^3}{3}\Big]_{-1}^{2} = \frac{10}{3} - \left(-\frac{7}{6}\right) = \frac{9}{2}$.`,
        ] },
        { type: 'quiz', question: String.raw`What is the area between $y = \sin x$ and $y = \cos x$ for $0 \le x \le \pi/2$?`, choices: [String.raw`$0$`, String.raw`$2\sqrt2 - 2$`, String.raw`$\sqrt2 - 1$`, String.raw`$2$`], answer: 1, explain: String.raw`The curves cross at $\pi/4$. $\int_0^{\pi/4} (\cos x - \sin x)\,\mathrm d x = \sqrt2 - 1$, and by symmetry the same on $[\pi/4, \pi/2]$. Without splitting you would get $\int_0^{\pi/2}(\cos x - \sin x)\,\mathrm d x = 0$.` },
      ],
    },
    {
      id: 'implicit-loop',
      title: 'The area of a loop',
      blocks: [
        { type: 'text', html: String.raw`<p>The curve $y^2 = x^2(4 - x)$ is not the graph of one function, but solving for $y$ gives two: $y = \pm x\sqrt{4 - x}$ for $x \le 4$. The two branches cross at the origin and enclose a <b>loop</b> for $0 \le x \le 4$.</p>` },
        { type: 'widget', name: 'areaBetween', config: {
          title: 'The loop of y² = x²(4 − x)',
          f: 'x.*sqrt(4 - x)', g: '-x.*sqrt(4 - x)', a: 0, b: 4, xlim: [-1.5, 4.5], ylim: [-3.6, 3.6], areaTex: String.raw`\frac{256}{15} \approx 17.067`,
        } },
        { type: 'callout', kind: 'key', html: String.raw`<ul><li>Replacing $y$ by $-y$ leaves the equation unchanged, so the curve is symmetric about the $x$-axis: compute the upper half and double it.</li><li>The loop closes where $y = 0$: $x^2(4 - x) = 0$, i.e. $x = 0$ (the self-intersection) and $x = 4$.</li></ul>` },
        { type: 'steps', title: String.raw`Example: the area of the loop of $y^2 = x^2(4 - x)$`, steps: [
          String.raw`On $[0, 4]$ the upper branch is $y = x\sqrt{4-x} \ge 0$ and the lower branch is its mirror image, so $A = 2\displaystyle\int_0^4 x\sqrt{4 - x}\,\mathrm d x$.`,
          String.raw`We substitute $u = 4 - x$, so $x = 4 - u$ and $\mathrm d x = -\mathrm d u$; the limits $x = 0, 4$ become $u = 4, 0$. Reversing the limits absorbs the minus sign: $A = 2\displaystyle\int_0^4 (4 - u)\sqrt u\,\mathrm d u$.`,
          String.raw`We expand and integrate: $\displaystyle 2\int_0^4 \left(4u^{1/2} - u^{3/2}\right)\mathrm d u = 2\Big[\frac83 u^{3/2} - \frac25 u^{5/2}\Big]_0^4 = 2\left(\frac{64}{3} - \frac{64}{5}\right) = \frac{256}{15}$.`,
          String.raw`Numerically $A \approx 17.067$, consistent with the widget.`,
        ] },
        { type: 'quiz', question: String.raw`The curve $y^2 = x^2(x + 3)$ has a loop. For which $x$?`, choices: [String.raw`$0 \le x \le 3$`, String.raw`$-3 \le x \le 0$`, String.raw`$-3 \le x \le 3$`, String.raw`$x \ge -3$`], answer: 1, explain: String.raw`The curve exists for $x \ge -3$; $y = 0$ at $x = -3$ and at the self-intersection $x = 0$. For $x > 0$ the two branches $\pm x\sqrt{x+3}$ separate and never meet again. This loop is Homework 0, Problem 4 (see the capstone).` },
      ],
    },
  ],
  matlab: [
    {
      id: 'full-writeups',
      title: 'Complete write-ups: sentence, equation, check',
      blocks: [
        { type: 'text', html: String.raw`<p>A complete homework answer has three layers, in this order: an <b>English sentence</b> saying what you do next, the <b>equation</b> showing it, and — at the end of the problem — a short <b>MATLAB check</b>. For an indefinite integral the check compares a definite integral with the difference of your antiderivative: if $F' = f$, then <code>integral(f, a, b)</code> must equal <code>F(b) - F(a)</code> for any $a, b$.</p>` },
        { type: 'livescript', caption: 'Model answer for a substitution problem', blocks: [
          { type: 'heading', content: 'Problem 1 (Attempted)' },
          { type: 'text', content: 'We compute $\\int x\\cos(x^2)\\,\\mathrm d x$. The factor $x$ is, up to a constant, the derivative of the inner function $x^2$, so we substitute' },
          { type: 'equation', content: String.raw`u = x^2, \qquad \mathrm d u = 2x\,\mathrm d x .` },
          { type: 'text', content: 'The integral becomes an elementary one in $u$:' },
          { type: 'equation', content: String.raw`\int x\cos(x^2)\,\mathrm d x = \frac12\int \cos u\,\mathrm d u = \frac12\sin u + C = \frac12\sin(x^2) + C .` },
          { type: 'text', content: 'We check the antiderivative numerically on the interval $[0, 1.5]$:' },
          { type: 'code', content: "f = @(x) x.*cos(x.^2);\nF = @(x) sin(x.^2)/2;\nerr = integral(f, 0, 1.5) - (F(1.5) - F(0))" },
        ] },
        { type: 'table', head: ['Type', 'Result'], rows: [
          [String.raw`<code>u = 7 - 2\cos 4x, \quad \mathrm d u = 8\sin 4x\,\mathrm d x</code>`, String.raw`$u = 7 - 2\cos 4x, \quad \mathrm d u = 8\sin 4x\,\mathrm d x$`],
          [String.raw`<code>\int_1^{10} \frac{2}{u^2}\,\mathrm d u</code>`, String.raw`$\int_1^{10} \frac{2}{u^2}\,\mathrm d u$`],
          [String.raw`<code>\Big[ -\frac{2}{u} \Big]_1^{10}</code>`, String.raw`$\Big[ -\frac{2}{u} \Big]_1^{10}$`],
        ] },
        { type: 'latex', prompt: 'Type the substitution line of Homework 0, Problem 2a:', target: String.raw`u = 7 - 2\cos 4x, \quad \mathrm d u = 8\sin 4x\,\mathrm d x`, accept: [String.raw`u = 7-2\cos 4x,\quad du = 8\sin 4x\,dx`] },
        { type: 'latex', prompt: 'Type the transformed integral of Problem 3a (limits changed):', target: String.raw`\int_1^4 \frac{6}{(3x-2)^2}\,\mathrm d x = \int_1^{10} \frac{2}{u^2}\,\mathrm d u` },
        { type: 'matlab', prompt: String.raw`Check the answer of Homework 0, Problem 2a: define $f(x) = \frac{\sin 4x}{7 - 2\cos 4x}$ and $F(x) = \frac18\ln(7 - 2\cos 4x)$, and store <code>err = integral(f, 0, 1) - (F(1) - F(0))</code>.`, starter: `f = @(x) 0;    % replace 0 by the integrand\nF = @(x) 0;    % replace 0 by the antiderivative\nerr = 0        % replace 0 by the comparison`, solution: `f = @(x) sin(4*x)./(7 - 2*cos(4*x));\nF = @(x) log(7 - 2*cos(4*x))/8;\nerr = integral(f, 0, 1) - (F(1) - F(0))`, checks: [{ var: 'err', value: 0, tol: 1e-9, message: 'err should be (numerically) zero — check f and F.' }, { var: 'F', isFunction: true }, { uses: 'integral' }] },
        { type: 'matlab', prompt: String.raw`Compute $\int_0^2 x\sqrt{x^2 + 5}\,\mathrm d x$ with <code>integral</code> in <code>I</code> and the exact value $\frac{27 - 5\sqrt5}{3}$ (from $u = x^2 + 5$) in <code>Iexact</code>.`, starter: `I = 0         % replace 0 by integral(...)\nIexact = 0    % replace 0 by the exact value`, solution: `I = integral(@(x) x.*sqrt(x.^2 + 5), 0, 2)\nIexact = (27 - 5*sqrt(5))/3`, checks: [{ var: 'I', value: '(27-5*sqrt(5))/3', tol: 1e-8 }, { var: 'Iexact', value: '(27-5*sqrt(5))/3', tol: 1e-12 }] },
      ],
    },
    {
      id: 'plotting-regions',
      title: 'Plotting regions: fill, fzero and integral',
      blocks: [
        { type: 'text', html: String.raw`<p>A picture of the region belongs in every area problem. <code>fill(X, Y, color)</code> fills the polygon with vertices <code>(X(k), Y(k))</code>. To fill between two curves, walk along the top curve from left to right and back along the bottom curve: <code>fill([x fliplr(x)], [top fliplr(bottom)], ...)</code>. Intersection points that cannot be found by hand come from <code>fzero</code>.</p>` },
        { type: 'code', caption: 'The region between y = x + 2 and y = x², and its area.', editable: true, code: `top = @(x) x + 2;
bot = @(x) x.^2;
x = linspace(-1, 2, 200);
fill([x fliplr(x)], [top(x) fliplr(bot(x))], [0.75 0.85 1])
hold on
fplot(top, [-2 3]); fplot(bot, [-2 3])
grid on; legend('region', 'y = x + 2', 'y = x^2')
A = integral(@(x) top(x) - bot(x), -1, 2)` },
        { type: 'code', caption: 'The loop of y² = x²(4 − x): both branches and the enclosed area.', editable: true, code: `up  = @(x) x.*sqrt(4 - x);
x = linspace(0, 4, 300);
fill([x fliplr(x)], [up(x) fliplr(-up(x))], [1 0.85 0.7])
hold on
fplot(up, [-1.5 4]); fplot(@(x) -up(x), [-1.5 4])
axis equal; grid on
A = 2*integral(up, 0, 4)
fprintf('256/15 = %.6f\\n', 256/15)` },
        { type: 'matlab', prompt: String.raw`The curves $y = \cos x$ and $y = x^2$ intersect at $x = \pm r$. Find $r > 0$ with <code>fzero</code>, store the enclosed area in <code>A</code>, and draw the region with <code>fill</code>.`, starter: `r = 0;   % replace 0 by fzero(...)\nA = 0    % replace 0 by integral(...)\nx = linspace(-r, r, 200);\n% fill(...)`, solution: `r = fzero(@(x) cos(x) - x.^2, 1);\nA = integral(@(x) cos(x) - x.^2, -r, r)\nx = linspace(-r, r, 200);\nfill([x fliplr(x)], [cos(x) fliplr(x.^2)], [0.8 0.9 1])\ngrid on`, checks: [{ var: 'r', value: 'fzero(@(x) cos(x) - x.^2, 1)', tol: 1e-6 }, { var: 'A', value: 'integral(@(x) cos(x) - x.^2, -fzero(@(x) cos(x) - x.^2, 1), fzero(@(x) cos(x) - x.^2, 1))', tol: 1e-6 }, { uses: 'fill' }, { figure: true }], hint: String.raw`<code>fzero(@(x) cos(x) - x.^2, 1)</code>; on $[-r, r]$ the cosine is on top.` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Indefinite integrals by substitution',
      difficulty: 'core',
      statement: String.raw`<p>Find an antiderivative (the constant is not needed). Type it in MATLAB syntax, e.g. <code>(x.^3+1).^6/18</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int x^2\left(x^3 + 1\right)^5\mathrm d x$`, kind: 'expression', variable: 'x', answer: '(x.^3 + 1).^6/18', upToConstant: true, domain: [-1, 1], solution: String.raw`$u = x^3 + 1$, $\mathrm d u = 3x^2\,\mathrm d x$: $\frac13\int u^5\,\mathrm d u = \frac{u^6}{18} + C = \frac{(x^3 + 1)^6}{18} + C$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int \frac{e^{\sqrt x}}{\sqrt x}\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: '2*exp(sqrt(x))', upToConstant: true, solution: String.raw`$u = \sqrt x$, $\mathrm d u = \frac{\mathrm d x}{2\sqrt x}$: $2\int e^u\,\mathrm d u = 2e^{\sqrt x} + C$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int \tan x\,\mathrm d x$ on $0 < x < \pi/2$`, kind: 'expression', variable: 'x', answer: '-log(cos(x))', upToConstant: true, domain: [0.1, 1.4], solution: String.raw`$\tan x = \frac{\sin x}{\cos x}$; $u = \cos x$, $\mathrm d u = -\sin x\,\mathrm d x$: $-\int \frac{\mathrm d u}{u} = -\ln|\cos x| + C$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\int \frac{\ln x}{x}\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: 'log(x).^2/2', upToConstant: true, solution: String.raw`$u = \ln x$, $\mathrm d u = \frac{\mathrm d x}{x}$: $\int u\,\mathrm d u = \frac{(\ln x)^2}{2} + C$.` },
      ],
    },
    {
      id: 'a2',
      title: 'Definite integrals: change the limits',
      difficulty: 'core',
      statement: String.raw`<p>Evaluate with a substitution, changing the limits.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int_0^2 x\sqrt{x^2 + 5}\,\mathrm d x$`, kind: 'numeric', answer: '(27 - 5*sqrt(5))/3', solution: String.raw`$u = x^2 + 5$ from $5$ to $9$: $\frac12\int_5^9 u^{1/2}\,\mathrm d u = \frac13\Big[u^{3/2}\Big]_5^9 = \frac{27 - 5\sqrt5}{3}$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_0^{\pi/2} \cos x\,e^{\sin x}\,\mathrm d x$`, kind: 'numeric', answer: 'exp(1) - 1', solution: String.raw`$u = \sin x$ from $0$ to $1$: $\int_0^1 e^u\,\mathrm d u = e - 1$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_e^{e^2} \frac{\mathrm d x}{x\ln x}$`, kind: 'numeric', answer: 'log(2)', solution: String.raw`$u = \ln x$ from $1$ to $2$: $\int_1^2 \frac{\mathrm d u}{u} = \ln 2$.` },
        { label: '(d)', prompt: String.raw`With $u = x^2$, the integral $\displaystyle\int_{-1}^{2} x e^{x^2}\,\mathrm d x$ becomes …`, kind: 'choice', choices: [String.raw`$\frac12\int_1^4 e^u\,\mathrm d u$`, String.raw`$\frac12\int_{-1}^{2} e^u\,\mathrm d u$`, String.raw`$\frac12\int_0^4 e^u\,\mathrm d u$`, 'not allowed, because $u = x^2$ is not one-to-one on $[-1, 2]$'], answer: 0, solution: String.raw`The substitution rule only needs $g(x) = x^2$ to have a continuous derivative; it need not be one-to-one. The limits are $g(-1) = 1$ and $g(2) = 4$. (The part over $[-1, 1]$ cancels by oddness, consistent with this.)` },
        { label: '(e)', prompt: String.raw`Evaluate the integral of (d).`, kind: 'numeric', answer: '(exp(4) - exp(1))/2', solution: String.raw`$\frac12\Big[e^u\Big]_1^4 = \frac{e^4 - e}{2} \approx 25.94$.` },
      ],
    },
    {
      id: 'a3',
      title: 'Areas between curves',
      difficulty: 'core',
      statement: String.raw`<p>Find the area of each region. Sketch it first (or plot it with <code>fill</code>).</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`The region between $y = x^2$ and $y = 2x - x^2$.`, kind: 'numeric', answer: '1/3', solution: String.raw`Intersections: $x^2 = 2x - x^2 \iff x = 0, 1$. $\int_0^1 (2x - 2x^2)\,\mathrm d x = 1 - \frac23 = \frac13$.` },
        { label: '(b)', prompt: String.raw`The region between $y = \sin x$ and $y = \cos x$ for $0 \le x \le \pi$.`, kind: 'numeric', answer: '2*sqrt(2)', hint: 'Split where the curves cross.', solution: String.raw`$\int_0^{\pi/4} (\cos x - \sin x)\,\mathrm d x + \int_{\pi/4}^{\pi} (\sin x - \cos x)\,\mathrm d x = (\sqrt2 - 1) + (1 + \sqrt2) = 2\sqrt2$.` },
        { label: '(c)', prompt: String.raw`The region between the curves $x = y^2 - 1$ and $x = 3 - y^2$.`, kind: 'numeric', answer: '16*sqrt(2)/3', hint: 'Use horizontal strips: integrate in $y$.', solution: String.raw`$y^2 - 1 = 3 - y^2 \iff y = \pm\sqrt2$. $\int_{-\sqrt2}^{\sqrt2} \big((3 - y^2) - (y^2 - 1)\big)\,\mathrm d y = \int_{-\sqrt2}^{\sqrt2} (4 - 2y^2)\,\mathrm d y = 8\sqrt2 - \frac{8\sqrt2}{3} = \frac{16\sqrt2}{3}$.` },
      ],
    },
    {
      id: 'a4',
      title: 'A figure-eight curve',
      difficulty: 'challenge',
      statement: String.raw`<p>The curve $y^2 = x^2(1 - x^2)$ consists of two loops.</p>`,
      parts: [
        { label: '(a)', prompt: 'The curve is symmetric about …', kind: 'choice', choices: [String.raw`the $x$-axis only`, String.raw`the $y$-axis only`, 'both axes', 'neither axis'], answer: 2, solution: String.raw`The equation contains only $x^2$ and $y^2$, so it is unchanged by $x \to -x$ and by $y \to -y$.` },
        { label: '(b)', prompt: String.raw`Find the area of the loop in $x \ge 0$.`, kind: 'numeric', answer: '2/3', hint: String.raw`Upper branch $y = x\sqrt{1 - x^2}$, $0 \le x \le 1$; then $u = 1 - x^2$.`, solution: String.raw`$A = 2\int_0^1 x\sqrt{1 - x^2}\,\mathrm d x$. With $u = 1 - x^2$, $\mathrm d u = -2x\,\mathrm d x$: $A = \int_0^1 u^{1/2}\,\mathrm d u = \frac23$.` },
        { label: '(c)', prompt: 'Find the total area enclosed by the curve.', kind: 'numeric', answer: '4/3', solution: String.raw`By symmetry in the $y$-axis the two loops are congruent: $2\cdot\frac23 = \frac43$.` },
      ],
    },
    {
      id: 'capstone',
      title: 'Capstone: Homework 0 (integration review)',
      difficulty: 'exam',
      hw: 'HW0-style',
      statement: String.raw`<p>This is the complete integration part of Homework 0 (ungraded self-study). Solve every problem by hand, write the solution as a Live Script — <b>English sentence, then equation, then a MATLAB check</b> — and compare with the model solution.</p><ol><li><b>Problem 2.</b> Compute (a) $\displaystyle\int \frac{\sin 4x}{7 - 2\cos 4x}\,\mathrm d x$ and (b) $\displaystyle\int x e^{-x^2}\,\mathrm d x$.</li><li><b>Problem 3.</b> Evaluate (a) $\displaystyle\int_1^4 \frac{6}{(3x-2)^2}\,\mathrm d x$ and (b) $\displaystyle\int_{-3}^{3} |4x - 1|\,\mathrm d x$.</li><li><b>Problem 4.</b> Find the area of the loop of the curve $y^2 = x^2(x + 3)$.</li><li><b>Problem 5.</b> Let $\mathrm{Si}(x) = \int_0^x \frac{\sin t}{t}\,\mathrm d t$. Find the local maxima of $\mathrm{Si}$, show that $\mathrm{Si}$ is odd and evaluate $\int_{-10}^{10} \mathrm{Si}(x)\,\mathrm d x$.</li></ol>`,
      parts: [
        { label: '2(a)', prompt: String.raw`An antiderivative of $\dfrac{\sin 4x}{7 - 2\cos 4x}$:`, kind: 'expression', variable: 'x', answer: 'log(7 - 2*cos(4*x))/8', upToConstant: true, domain: [-1.5, 1.5], hint: String.raw`$u = 7 - 2\cos 4x$.`, solution: String.raw`$\frac18\ln(7 - 2\cos 4x) + C$.` },
        { label: '2(b)', prompt: String.raw`An antiderivative of $x e^{-x^2}$:`, kind: 'expression', variable: 'x', answer: '-exp(-x.^2)/2', upToConstant: true, domain: [-2, 2], solution: String.raw`$-\frac12 e^{-x^2} + C$.` },
        { label: '3(a)', prompt: String.raw`$\displaystyle\int_1^4 \frac{6}{(3x-2)^2}\,\mathrm d x$`, kind: 'numeric', answer: '9/5', solution: String.raw`$u = 3x - 2$: $\int_1^{10} \frac{2}{u^2}\,\mathrm d u = \frac95$.` },
        { label: '3(b)', prompt: String.raw`$\displaystyle\int_{-3}^{3} |4x - 1|\,\mathrm d x$`, kind: 'numeric', answer: '145/4', solution: String.raw`Split at $x = \frac14$: $\frac{169}{8} + \frac{121}{8} = \frac{145}{4}$.` },
        { label: '4', prompt: String.raw`Area of the loop of $y^2 = x^2(x+3)$:`, kind: 'numeric', answer: '24*sqrt(3)/5', hint: String.raw`The loop is $-3 \le x \le 0$; upper branch $y = -x\sqrt{x+3}$; substitute $u = x + 3$.`, solution: String.raw`$A = -2\int_{-3}^0 x\sqrt{x+3}\,\mathrm d x = \frac{24\sqrt3}{5} \approx 8.3138$.` },
        { label: '5', prompt: String.raw`Local maxima of $\mathrm{Si}$:`, kind: 'choice', choices: [String.raw`$x = \pm\pi, \pm3\pi, \pm5\pi, \dots$`, String.raw`$x = \pi, 3\pi, 5\pi, \dots$ and $x = -2\pi, -4\pi, \dots$`, String.raw`$x = 2k\pi$, $k \ne 0$`, String.raw`$x = \pi/2 + k\pi$`], answer: 1, solution: String.raw`$\mathrm{Si}'(x) = \frac{\sin x}{x}$ changes from $+$ to $-$ at $\pi, 3\pi, \dots$ and at $-2\pi, -4\pi, \dots$; and $\int_{-10}^{10}\mathrm{Si} = 0$ because $\mathrm{Si}$ is odd.` },
        { label: 'Write-up', prompt: 'Write the complete Live Script for Problems 2–5 and compare with the model solution.', kind: 'writeup' },
      ],
      writeup: true,
      writeupTemplate: [
        { type: 'title', content: 'Homework 0' },
        { type: 'heading', content: 'Problem 2 (Attempted)' },
        { type: 'text', content: 'We substitute ...' },
        { type: 'heading', content: 'Problem 3 (Attempted)' },
        { type: 'heading', content: 'Problem 4 (Attempted)' },
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'heading', content: 'Function definitions' },
        { type: 'code', content: "function y = Si(x)\ny = integral(@(t) sin(t)./t, 0, x);\nend" },
      ],
      solution: [
        { type: 'title', content: 'Homework 0' },
        { type: 'heading', content: 'Problem 2 (Attempted)' },
        { type: 'text', content: '**(a)** The derivative of the denominator is $8\\sin 4x$, a multiple of the numerator. We substitute' },
        { type: 'equation', content: String.raw`u = 7 - 2\cos 4x, \quad \mathrm d u = 8\sin 4x\,\mathrm d x .` },
        { type: 'text', content: 'The integral becomes a logarithm. Since $7 - 2\\cos 4x \\ge 5 > 0$, no absolute value is needed:' },
        { type: 'equation', content: String.raw`\int \frac{\sin 4x}{7 - 2\cos 4x}\,\mathrm d x = \frac18\int \frac{\mathrm d u}{u} = \frac18\ln|u| + C = \frac18\ln\left(7 - 2\cos 4x\right) + C .` },
        { type: 'text', content: '**(b)** We substitute $u = -x^2$, $\\mathrm d u = -2x\\,\\mathrm d x$:' },
        { type: 'equation', content: String.raw`\int x e^{-x^2}\,\mathrm d x = -\frac12\int e^{u}\,\mathrm d u = -\frac12 e^{u} + C = -\frac{e^{-x^2}}{2} + C .` },
        { type: 'text', content: 'We check both antiderivatives by comparing a definite integral with the difference of the antiderivative:' },
        { type: 'code', content: "f1 = @(x) sin(4*x)./(7 - 2*cos(4*x));  F1 = @(x) log(7 - 2*cos(4*x))/8;\nf2 = @(x) x.*exp(-x.^2);              F2 = @(x) -exp(-x.^2)/2;\nerr1 = integral(f1, 0, 2) - (F1(2) - F1(0))\nerr2 = integral(f2, -1, 3) - (F2(3) - F2(-1))" },
        { type: 'heading', content: 'Problem 3 (Attempted)' },
        { type: 'text', content: '**(a)** We substitute $u = 3x - 2$, $\\mathrm d u = 3\\,\\mathrm d x$, and change the limits: $x = 1$ gives $u = 1$ and $x = 4$ gives $u = 10$.' },
        { type: 'equation', content: String.raw`\int_1^4 \frac{6}{(3x-2)^2}\,\mathrm d x = \int_1^{10} \frac{2}{u^2}\,\mathrm d u = \Big[ -\frac{2}{u} \Big]_1^{10} = -\frac15 + 2 = \frac95 .` },
        { type: 'text', content: '**(b)** The expression $4x - 1$ changes sign at $x = 1/4$, so we split the integral there:' },
        { type: 'equation', content: String.raw`\int_{-3}^{3} |4x-1|\,\mathrm d x = \int_{-3}^{1/4} (1 - 4x)\,\mathrm d x + \int_{1/4}^{3} (4x - 1)\,\mathrm d x = \Big[ x - 2x^2 \Big]_{-3}^{1/4} + \Big[ 2x^2 - x \Big]_{1/4}^{3} = \frac{169}{8} + \frac{121}{8} = \frac{145}{4} .` },
        { type: 'text', content: 'We check both values numerically:' },
        { type: 'code', content: "I3a = integral(@(x) 6./(3*x - 2).^2, 1, 4)\nI3b = integral(@(x) abs(4*x - 1), -3, 3)\nfprintf('exact: %.6f and %.6f\\n', 9/5, 145/4)" },
        { type: 'heading', content: 'Problem 4 (Attempted)' },
        { type: 'text', content: 'Solving for $y$ gives the two branches $y = \\pm x\\sqrt{x + 3}$, $x \\ge -3$. They meet where $y = 0$, i.e. at $x = -3$ and $x = 0$, so the loop lies in $-3 \\le x \\le 0$. There $x \\le 0$, so the upper branch is $y = -x\\sqrt{x+3}$ and the lower one is its mirror image. The area is' },
        { type: 'equation', content: String.raw`A = \int_{-3}^{0} \left( -x\sqrt{x+3} - x\sqrt{x+3} \right)\mathrm d x = -2\int_{-3}^{0} x\sqrt{x+3}\,\mathrm d x .` },
        { type: 'text', content: 'We substitute $u = x + 3$, so $x = u - 3$, $\\mathrm d x = \\mathrm d u$, and the limits become $u = 0$ and $u = 3$:' },
        { type: 'equation', content: String.raw`A = -2\int_0^3 (u - 3)\sqrt u\,\mathrm d u = -2\Big[ \frac25 u^{5/2} - 2u^{3/2} \Big]_0^3 = -2\left( \frac{18\sqrt3}{5} - 6\sqrt3 \right) = \frac{24\sqrt3}{5} \approx 8.3138 .` },
        { type: 'text', content: 'We plot the curve with the loop filled and check the area numerically:' },
        { type: 'code', content: "up = @(x) -x.*sqrt(x + 3);\nx = linspace(-3, 0, 300);\nfill([x fliplr(x)], [up(x) fliplr(-up(x))], [0.75 0.85 1])\nhold on\nfplot(up, [-3 1.5]); fplot(@(x) -up(x), [-3 1.5])\naxis equal; grid on\nA = 2*integral(up, -3, 0)\nfprintf('exact 24*sqrt(3)/5 = %.6f\\n', 24*sqrt(3)/5)" },
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: 'By the Fundamental Theorem of Calculus, part 1, the derivative of $\\mathrm{Si}$ is the integrand at the upper limit:' },
        { type: 'equation', content: String.raw`\mathrm{Si}'(x) = \frac{\sin x}{x}, \qquad x \ne 0 .` },
        { type: 'text', content: 'The critical points are $x = k\\pi$, $k \\ne 0$. For $x > 0$, $\\mathrm{Si}\'$ has the sign of $\\sin x$, which changes from positive to negative at odd multiples of $\\pi$. For $x < 0$ the denominator is negative and the sign is reversed. Hence the local maxima are at' },
        { type: 'equation', content: String.raw`x = \pi, 3\pi, 5\pi, \dots \quad\text{and}\quad x = -2\pi, -4\pi, -6\pi, \dots` },
        { type: 'text', content: 'To show that $\\mathrm{Si}$ is odd we substitute $t = -s$, $\\mathrm d t = -\\mathrm d s$:' },
        { type: 'equation', content: String.raw`\mathrm{Si}(-x) = \int_0^{-x} \frac{\sin t}{t}\,\mathrm d t = \int_0^{x} \frac{\sin(-s)}{-s}\,(-\mathrm d s) = -\int_0^{x} \frac{\sin s}{s}\,\mathrm d s = -\mathrm{Si}(x) .` },
        { type: 'text', content: 'Since $\\mathrm{Si}$ is continuous and odd and the interval is symmetric,' },
        { type: 'equation', content: String.raw`\int_{-10}^{10} \mathrm{Si}(x)\,\mathrm d x = 0 .` },
        { type: 'text', content: 'We check numerically:' },
        { type: 'code', content: "xs = linspace(-15, 15, 301);\nfigure; plot(xs, arrayfun(@Si, xs)); grid on\nxmax = fminbnd(@(x) -Si(x), 2, 4)\nI5 = integral(@(x) arrayfun(@Si, x), -10, 10)" },
        { type: 'heading', content: 'Function definitions' },
        { type: 'code', content: "function y = Si(x)\n% Sine integral: integral of sin(t)/t from 0 to x (x scalar)\ny = integral(@(t) sin(t)./t, 0, x);\nend" },
      ],
    },
  ],
};
