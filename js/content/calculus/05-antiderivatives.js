// Module 5: Antiderivatives and indefinite integrals (prepares Homework 0).

export default {
  id: 'antiderivatives',
  number: 5,
  part: 'integration',
  hw: 'HW0',
  title: 'Antiderivatives and indefinite integrals',
  summary: 'Antiderivatives and the family F + C, why two antiderivatives differ by a constant only on an interval (Homework 0, Problem 1), the table of basic antiderivatives, linearity, checking by differentiation and initial value problems y\' = f(x) — plus numerical checks and the homework template in MATLAB.',
  intro: String.raw`<p>Integration starts by running differentiation backwards: given a slope function $f$, find all functions $F$ with $F' = f$. Every answer you produce can be <b>checked by differentiating</b>, and you will be expected to do so. This module also contains Homework 0, Problem 1 — an ungraded self-study problem with a published model solution — about a subtle point: two antiderivatives differ by a constant only on an <i>interval</i>.</p>`,
  lessons: [
    {
      id: 'antiderivative-family',
      title: 'Antiderivatives and the family F + C',
      blocks: [
        { type: 'text', html: String.raw`<p>The short line segments have slope $f(x) = \cos x$ — the same slope all along each vertical line. A curve that follows the segments everywhere is an antiderivative. Drag $C$: shifting $\sin x$ up or down does not change any slope, so every $\sin x + C$ fits the field.</p>` },
        { type: 'widget', name: 'antiderivative', config: {
          title: 'Antiderivatives of cos x',
          f: 'cos(x)', F: 'sin(x)', xlim: [-6.3, 6.3], ylim: [-5, 5],
        } },
        { type: 'callout', kind: 'def', title: 'Antiderivative and indefinite integral', html: String.raw`<p>$F$ is an <b>antiderivative</b> of $f$ on an interval $I$ if $F'(x) = f(x)$ for all $x \in I$. The <b>indefinite integral</b> denotes the whole family: $$\int f(x)\,\mathrm d x = F(x) + C,$$ where $C$ is an arbitrary constant. The function $f$ is called the <b>integrand</b>.</p>` },
        { type: 'steps', title: String.raw`Example: all antiderivatives of $f(x) = 3x^2 + \dfrac{2}{x}$ for $x > 0$`, steps: [
          String.raw`We look for a function whose derivative is each term. Since $\frac{\mathrm d}{\mathrm d x}x^3 = 3x^2$ and $\frac{\mathrm d}{\mathrm d x}\ln x = \frac1x$, a candidate is $F(x) = x^3 + 2\ln x$.`,
          String.raw`We check by differentiating: $F'(x) = 3x^2 + \frac{2}{x} = f(x)$. ✓`,
          String.raw`On the interval $(0, \infty)$ all antiderivatives are $$\int\left(3x^2 + \frac{2}{x}\right)\mathrm d x = x^3 + 2\ln x + C.$$`,
        ] },
        { type: 'quiz', question: String.raw`Which function is <b>not</b> an antiderivative of $f(x) = 2x$?`, choices: [String.raw`$x^2$`, String.raw`$x^2 - 7$`, String.raw`$x^2 + \pi$`, String.raw`$2x^2$`], answer: 3, explain: String.raw`$\frac{\mathrm d}{\mathrm d x}2x^2 = 4x \ne 2x$. The other three differ from $x^2$ by constants.` },
      ],
    },
    {
      id: 'constant-difference',
      title: 'Why antiderivatives differ by a constant — on an interval',
      blocks: [
        { type: 'callout', kind: 'thm', title: 'Theorem', html: String.raw`<p>If $F'(x) = G'(x)$ for all $x$ in an <b>interval</b> $I$, then $F(x) - G(x) = C$ (a constant) on $I$.</p><p><i>Proof.</i> Let $H = F - G$, so $H' = 0$ on $I$. For $x_1 < x_2$ in $I$ the mean value theorem gives a point $\xi \in (x_1, x_2)$ with $$H(x_2) - H(x_1) = H'(\xi)(x_2 - x_1) = 0.$$ So $H$ takes the same value everywhere on $I$. $\square$</p>` },
        { type: 'text', html: String.raw`<p>The proof needs every point between $x_1$ and $x_2$ to belong to $I$. If the domain has a gap, the argument breaks down. Look at $f(x) = \dfrac{1}{(1 - x)^2}$, which is undefined at $x = 1$. Both $$F_1(x) = \frac{x}{1 - x} \qquad\text{and}\qquad F_2(x) = \frac{1}{1 - x}$$ are antiderivatives of $f$ (check it!). The function $G$ below equals $F_2$ to the left of $1$ and $F_2 + c$ to the right. Drag $c$: $G$ still has slope $f(x)$ at every point of the domain, yet $G - F_2$ is <b>not</b> one constant.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Antiderivatives of 1/(1−x)² on both sides of x = 1',
          functions: [{ expr: '1./(1 - x) + c*(x > 1)', label: String.raw`$G(x)$` }, { expr: '1./(1 - x)', label: String.raw`$F_2(x) = \frac{1}{1-x}$`, dash: true }, { expr: 'x./(1 - x)', label: String.raw`$F_1(x) = \frac{x}{1-x}$`, dash: true }],
          params: { c: { min: -4, max: 4, value: 2, step: 0.1, label: '$c$' } },
          vlines: [1], xlim: [-3, 5], ylim: [-8, 8],
          readout: String.raw`$G - F_2 = 0$ for $x < 1$ and $G - F_2 = {{c}}$ for $x > 1$. Meanwhile $F_1 - F_2 = -1$ on both sides.`,
        } },
        { type: 'steps', title: String.raw`Example: comparing $F_1 = \frac{x}{1-x}$ and $F_2 = \frac{1}{1-x}$`, steps: [
          String.raw`We differentiate $F_1$ with the quotient rule: $$F_1'(x) = \frac{1\cdot(1 - x) - x\cdot(-1)}{(1 - x)^2} = \frac{1}{(1 - x)^2}.$$`,
          String.raw`We differentiate $F_2 = (1 - x)^{-1}$ with the chain rule: $F_2'(x) = -(1 - x)^{-2}\cdot(-1) = \dfrac{1}{(1 - x)^2}$. Both are antiderivatives of $f$ on $(-\infty, 1)$ and on $(1, \infty)$.`,
          String.raw`Their difference is $F_1(x) - F_2(x) = \dfrac{x - 1}{1 - x} = -1$ for all $x \ne 1$ — here the same constant on both intervals.`,
          String.raw`But the theorem only promises a constant <i>on each interval separately</i>. The most general antiderivative of $f$ on its domain is $$F(x) = \begin{cases} \frac{1}{1-x} + C_1, & x < 1, \\ \frac{1}{1-x} + C_2, & x > 1, \end{cases}$$ with two independent constants.`,
        ] },
        { type: 'callout', kind: 'key', html: String.raw`<p>The same happens for $\int \frac{1}{x}\,\mathrm d x = \ln|x| + C$ and $\int \frac{1}{x^2}\,\mathrm d x = -\frac1x + C$: the "$+ C$" is understood on each interval of the domain separately. This becomes essential for definite integrals: never integrate across a point where the integrand blows up without checking.</p>` },
        { type: 'quiz', question: String.raw`$F'(x) = G'(x)$ for all $x \ne 0$, with $F(1) = G(1)$. Which is guaranteed?`, choices: [String.raw`$F(x) = G(x)$ for all $x \ne 0$`, String.raw`$F(x) = G(x)$ for all $x > 0$`, String.raw`$F(-1) = G(-1)$`, 'nothing'], answer: 1, explain: String.raw`$F - G$ is constant on the interval $(0, \infty)$, where it is $0$ because $F(1) = G(1)$. On $(-\infty, 0)$ it is some other constant, about which we know nothing.` },
      ],
    },
    {
      id: 'basic-table',
      title: 'Basic antiderivatives and linearity',
      blocks: [
        { type: 'text', html: String.raw`<p>Every line of the derivative table, read backwards, is an antiderivative. Learn this table — the integration techniques of later modules all aim to reduce an integral to one of these lines.</p>` },
        { type: 'table', head: ['$f(x)$', String.raw`$\int f(x)\,\mathrm d x$`, '$f(x)$', String.raw`$\int f(x)\,\mathrm d x$`], rows: [
          [String.raw`$x^r$, $r \ne -1$`, String.raw`$\dfrac{x^{r+1}}{r+1} + C$`, String.raw`$\sin(ax)$`, String.raw`$-\dfrac{\cos(ax)}{a} + C$`],
          [String.raw`$\dfrac{1}{x}$`, String.raw`$\ln|x| + C$`, String.raw`$\cos(ax)$`, String.raw`$\dfrac{\sin(ax)}{a} + C$`],
          [String.raw`$e^{ax}$`, String.raw`$\dfrac{e^{ax}}{a} + C$`, String.raw`$\dfrac{1}{\cos^2 x}$`, String.raw`$\tan x + C$`],
          [String.raw`$a^x$`, String.raw`$\dfrac{a^x}{\ln a} + C$`, String.raw`$\dfrac{1}{1 + x^2}$`, String.raw`$\arctan x + C$`],
          [String.raw`$\dfrac{1}{a^2 + x^2}$`, String.raw`$\dfrac{1}{a}\arctan\dfrac{x}{a} + C$`, String.raw`$\dfrac{1}{\sqrt{1 - x^2}}$`, String.raw`$\arcsin x + C$`],
        ] },
        { type: 'callout', kind: 'thm', title: 'Linearity and linear inner functions', html: String.raw`<ul><li>$\displaystyle\int \big(a f(x) + b g(x)\big)\,\mathrm d x = a\int f(x)\,\mathrm d x + b\int g(x)\,\mathrm d x$.</li><li>If $\int f(u)\,\mathrm d u = F(u) + C$, then $\displaystyle\int f(ax + b)\,\mathrm d x = \frac{1}{a}F(ax + b) + C$ ($a \ne 0$). Check: the chain rule produces the factor $a$, which the $\frac1a$ cancels.</li><li>There is <b>no</b> product rule for integrals: $\int f g \ne \int f \cdot \int g$.</li></ul>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int\left(4x^3 - \frac{6}{\sqrt{x}} + 5e^{2x} - 3\sin x\right)\mathrm d x$`, steps: [
          String.raw`By linearity we integrate term by term, writing $\frac{6}{\sqrt x} = 6x^{-1/2}$: $$\int 4x^3\,\mathrm dx = x^4,\quad \int 6x^{-1/2}\,\mathrm dx = 6\cdot\frac{x^{1/2}}{1/2} = 12\sqrt{x},\quad \int 5e^{2x}\,\mathrm dx = \frac52 e^{2x},\quad \int 3\sin x\,\mathrm dx = -3\cos x.$$`,
          String.raw`Combining with the signs of the integrand: $$\int\left(4x^3 - \frac{6}{\sqrt{x}} + 5e^{2x} - 3\sin x\right)\mathrm d x = x^4 - 12\sqrt{x} + \frac52 e^{2x} + 3\cos x + C.$$`,
          String.raw`We check by differentiating: $4x^3 - 12\cdot\frac{1}{2\sqrt x} + 5e^{2x} - 3\sin x$. ✓`,
        ] },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int\frac{(x + 1)^2}{x}\,\mathrm d x$ — simplify first`, steps: [
          String.raw`The table has no quotient rule, so we expand and divide: $\dfrac{(x+1)^2}{x} = \dfrac{x^2 + 2x + 1}{x} = x + 2 + \dfrac1x$.`,
          String.raw`Term by term: $$\int\frac{(x+1)^2}{x}\,\mathrm d x = \frac{x^2}{2} + 2x + \ln|x| + C.$$`,
        ] },
        { type: 'steps', title: String.raw`Example: check that $\displaystyle\int x e^{-x^2}\,\mathrm d x = -\frac12 e^{-x^2} + C$`, steps: [
          String.raw`We differentiate the proposed antiderivative with the chain rule: $$\frac{\mathrm d}{\mathrm d x}\left(-\frac12 e^{-x^2}\right) = -\frac12 e^{-x^2}\cdot(-2x) = x e^{-x^2}.$$`,
          String.raw`This is the integrand, so the claim is correct. (How to <i>find</i> such an antiderivative systematically is the substitution rule, module 8.)`,
        ] },
        { type: 'quiz', question: String.raw`$\displaystyle\int\frac{\mathrm d x}{2x + 1} = \;?$`, choices: [String.raw`$\ln|2x + 1| + C$`, String.raw`$\frac12\ln|2x + 1| + C$`, String.raw`$2\ln|2x + 1| + C$`, String.raw`$-\dfrac{2}{(2x+1)^2} + C$`], answer: 1, explain: String.raw`Linear inner function with $a = 2$: $\frac12\ln|2x+1| + C$. Check: $\frac12\cdot\frac{2}{2x+1}$. ✓` },
        { type: 'quiz', question: String.raw`$\displaystyle\int \cos(3x)\,\mathrm d x = \;?$`, choices: [String.raw`$3\sin(3x) + C$`, String.raw`$-\frac13\sin(3x) + C$`, String.raw`$\frac13\sin(3x) + C$`, String.raw`$\sin(3x) + C$`], answer: 2, explain: String.raw`$\frac{\mathrm d}{\mathrm d x}\frac13\sin 3x = \cos 3x$.` },
      ],
    },
    {
      id: 'initial-value',
      title: "Initial value problems y' = f(x)",
      blocks: [
        { type: 'text', html: String.raw`<p>The differential equation $y' = 3x^2 - 2$ has infinitely many solutions $y = x^3 - 2x + C$. An <b>initial condition</b> such as $y(1) = 4$ picks one of them: drag $C$ until the curve passes through the marked point.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: "Selecting the solution of y' = 3x² − 2 through (1, 4)",
          functions: [{ expr: 'x.^3 - 2*x + C', label: String.raw`$y = x^3 - 2x + C$` }],
          params: { C: { min: -4, max: 8, value: 0, step: 0.1, label: '$C$' } },
          points: [{ x: 1, y: 4, label: '(1, 4)' }],
          xlim: [-3, 3], ylim: [-6, 12],
          readout: String.raw`$y(1) = -1 + C = {{C - 1}}$.`,
        } },
        { type: 'callout', kind: 'def', title: 'Initial value problem', html: String.raw`<p>Find $y(x)$ with $$y' = f(x), \qquad y(x_0) = y_0.$$ Take the general antiderivative $y = F(x) + C$ and solve $F(x_0) + C = y_0$ for $C$. On an interval containing $x_0$ where $f$ is continuous the solution exists and is unique — by the theorem of the previous lesson.</p>` },
        { type: 'steps', title: String.raw`Example: $y' = 3x^2 - 2$, $y(1) = 4$`, steps: [
          String.raw`We integrate: $y = x^3 - 2x + C$.`,
          String.raw`We impose the initial condition: $y(1) = 1 - 2 + C = 4$, so $C = 5$.`,
          String.raw`The solution is $y = x^3 - 2x + 5$. Check: $y' = 3x^2 - 2$ and $y(1) = 4$. ✓`,
        ] },
        { type: 'steps', title: 'Example: vertical throw', steps: [
          String.raw`A ball is thrown upwards from a height of $2$ m at $15$ m/s. With $g = 9.81\ \text{m/s}^2$ the acceleration is $s''(t) = -9.81$, and $s'(0) = 15$, $s(0) = 2$.`,
          String.raw`We integrate once and use $s'(0) = 15$: $s'(t) = -9.81\,t + 15$.`,
          String.raw`We integrate again and use $s(0) = 2$: $s(t) = -4.905\,t^2 + 15\,t + 2$.`,
          String.raw`The ball is highest when $s'(t) = 0$, at $t = \frac{15}{9.81} \approx 1.53$ s, at height $s \approx 13.47$ m.`,
        ] },
        { type: 'quiz', question: String.raw`Solve $y' = \cos x$, $y(0) = 2$.`, choices: [String.raw`$y = \sin x + 2$`, String.raw`$y = \sin x + 1$`, String.raw`$y = -\sin x + 2$`, String.raw`$y = \cos x + 1$`], answer: 0, explain: String.raw`$y = \sin x + C$ and $y(0) = C = 2$.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'checking-antiderivatives',
      title: 'Integral notation and numerical checks',
      blocks: [
        { type: 'text', html: String.raw`<p>The integral sign is <code>\int</code>. Put a thin space <code>\,</code> before the differential and write the d upright: <code>\,\mathrm d x</code>. Limits of a definite integral go in a subscript and superscript: <code>\int_a^b</code>.</p>` },
        { type: 'table', head: ['Type', 'Result'], rows: [
          [String.raw`<code>\int f(x)\,\mathrm d x = F(x) + C</code>`, String.raw`$\int f(x)\,\mathrm d x = F(x) + C$`],
          [String.raw`<code>\int x^n\,\mathrm d x = \frac{x^{n+1}}{n+1} + C</code>`, String.raw`$\int x^n\,\mathrm d x = \frac{x^{n+1}}{n+1} + C$`],
          [String.raw`<code>\int_0^2 x e^{-x^2}\,\mathrm d x</code>`, String.raw`$\int_0^2 x e^{-x^2}\,\mathrm d x$`],
        ] },
        { type: 'latex', prompt: 'Type this indefinite integral:', target: String.raw`\int \frac{1}{(1-x)^2}\,\mathrm d x = \frac{1}{1-x} + C` },
        { type: 'latex', prompt: 'Type this one:', target: String.raw`\int x e^{-x^2}\,\mathrm d x = -\frac{1}{2} e^{-x^2} + C` },
        { type: 'latex', prompt: 'And this one:', target: String.raw`\int \frac{\mathrm d x}{1 + x^2} = \arctan x + C`, accept: [String.raw`\int \frac{1}{1 + x^2}\,\mathrm d x = \arctan x + C`] },
        { type: 'text', html: String.raw`<p>MATLAB cannot find antiderivatives without <code>syms</code>, but it can <b>check</b> one in two ways:</p><ol><li><b>Differentiate numerically.</b> The central difference of $F$ must agree with $f$ at many points.</li><li><b>Integrate numerically.</b> <code>integral(f, a, b)</code> must equal $F(b) - F(a)$ — this is the Fundamental Theorem of Calculus (module 7), which you can already use as a check.</li></ol>` },
        { type: 'code', caption: 'Both checks for F(x) = x/(1 - x), an antiderivative of 1/(1 - x)^2 on x > 1.', editable: true, code: `f = @(x) 1 ./ (1 - x).^2;
F = @(x) x ./ (1 - x);
x = linspace(1.5, 4, 6);             % stay inside the interval x > 1
h = 1e-5;
dF = (F(x + h) - F(x - h)) / (2*h);  % numerical derivative of F
maxError = max(abs(dF - f(x)))
I = integral(f, 2, 4)
fprintf('F(4) - F(2) = %.10f\\n', F(4) - F(2))` },
        { type: 'callout', kind: 'warn', html: String.raw`<p>Keep the check points and the interval of integration inside one interval of the domain. <code>integral(f, 0, 2)</code> for $f = \frac{1}{(1-x)^2}$ crosses the singularity at $x = 1$; the integral diverges, and $F(2) - F(0) = -2$ is meaningless.</p>` },
        { type: 'matlab', prompt: String.raw`Check numerically that $F(x) = \frac18\ln(7 - 2\cos 4x)$ is an antiderivative of $f(x) = \dfrac{\sin 4x}{7 - 2\cos 4x}$: compute the central difference of $F$ with $h = 10^{-5}$ at <code>x = linspace(0, 2, 50)</code> and store the largest deviation from $f$ in <code>err</code>.`, starter: `f = @(x) sin(4*x) ./ (7 - 2*cos(4*x));\nF = @(x) log(7 - 2*cos(4*x)) / 8;\nx = linspace(0, 2, 50);\nh = 1e-5;\nerr = 1;   % replace by max(abs(...))`, solution: `f = @(x) sin(4*x) ./ (7 - 2*cos(4*x));\nF = @(x) log(7 - 2*cos(4*x)) / 8;\nx = linspace(0, 2, 50);\nh = 1e-5;\ndF = (F(x + h) - F(x - h)) / (2*h);\nerr = max(abs(dF - f(x)))`, checks: [{ var: 'err', value: 0, tol: 1e-6, message: 'err should be tiny (below 1e-6) — check the central difference.' }, { notUses: 'syms' }] },
        { type: 'matlab', prompt: String.raw`Compare <code>I = integral(f, 0, 1)</code> for $f(x) = \dfrac{1}{1 + x^2}$ with <code>D = F(1) - F(0)</code> for the antiderivative $F(x) = \arctan x$. Both should equal $\frac{\pi}{4}$.`, starter: `f = @(x) 1 ./ (1 + x.^2);\nF = @(x) atan(x);\nI = 0;   % use integral\nD = 0;`, solution: `f = @(x) 1 ./ (1 + x.^2);\nF = @(x) atan(x);\nI = integral(f, 0, 1)\nD = F(1) - F(0)`, checks: [{ var: 'I', value: 'pi/4', tol: 1e-8 }, { var: 'D', value: 'pi/4', tol: 1e-12 }, { uses: 'integral' }] },
      ],
    },
    {
      id: 'homework-template',
      title: 'The homework template',
      blocks: [
        { type: 'text', html: String.raw`<p>Homework is submitted as one Live Script built from the course template. The structure is fixed:</p><ul><li>A <b>title</b> with the homework number.</li><li>One heading per problem with its status: <b>Problem 2 (Attempted)</b> or <b>Problem 2 (Not attempted)</b>. Keep every heading, also for problems you skip.</li><li>Inside each problem: an <b>English sentence before every equation</b> that says what you are about to do, then the equation in LaTeX.</li><li>Code sections only for plots and numerical <b>checks</b>. <code>syms</code> and other Symbolic Math Toolbox functions are not allowed: the mathematics is done by hand.</li></ul>` },
        { type: 'livescript', caption: 'A complete short homework in the template format', blocks: [
          { type: 'title', content: 'Homework 0' },
          { type: 'heading', content: 'Problem 1 (Attempted)' },
          { type: 'text', content: 'We solve the initial value problem $y\' = \\frac{2}{x} + 4x$, $y(1) = 3$, on the interval $x > 0$. We first integrate term by term:' },
          { type: 'equation', content: String.raw`y(x) = \int \left( \frac{2}{x} + 4x \right) \mathrm d x = 2\ln x + 2x^2 + C .` },
          { type: 'text', content: 'Next we use the initial condition to determine the constant:' },
          { type: 'equation', content: String.raw`y(1) = 2\ln 1 + 2 + C = 2 + C = 3 \quad \Rightarrow \quad C = 1 .` },
          { type: 'text', content: 'Hence $y(x) = 2\\ln x + 2x^2 + 1$. We check the differential equation with a central difference and the initial condition directly:' },
          { type: 'code', content: "y = @(x) 2*log(x) + 2*x.^2 + 1;\nf = @(x) 2./x + 4*x;\nx = linspace(0.5, 3, 20);\nh = 1e-5;\nmaxError = max(abs((y(x + h) - y(x - h))/(2*h) - f(x)))\ny(1)" },
          { type: 'heading', content: 'Problem 2 (Not attempted)' },
        ] },
        { type: 'callout', kind: 'exam', html: String.raw`<p>The numerical check is not a substitute for the derivation, but it catches most algebra slips — a wrong sign or a missing factor $\frac1a$ shows up immediately as a large <code>maxError</code>.</p>` },
        { type: 'text', html: String.raw`<p>Practise the format. The sheet below solves $y' = e^{-x}$, $y(0) = 0$, but the sentences are missing: write an English sentence before each equation, state the answer $y = 1 - e^{-x}$ in a final sentence, and run the check.</p>` },
        { type: 'livescript', editable: true, caption: 'Practice sheet (editable)', blocks: [
          { type: 'heading', content: 'Problem 1 (Attempted)' },
          { type: 'equation', content: String.raw`y(x) = \int e^{-x}\,\mathrm d x = -e^{-x} + C .` },
          { type: 'equation', content: String.raw`y(0) = -1 + C = 0 \quad \Rightarrow \quad C = 1 .` },
          { type: 'code', content: "y = @(x) 1 - exp(-x);\nx = linspace(0, 3, 20);\nh = 1e-5;\nmaxError = max(abs((y(x + h) - y(x - h))/(2*h) - exp(-x)))" },
        ] },
        { type: 'matlab', prompt: String.raw`Check the solution $y(x) = x^3 - 2x + 5$ of $y' = 3x^2 - 2$, $y(1) = 4$: store the largest deviation of a central difference of <code>y</code> from <code>3*x.^2 - 2</code> on <code>x = linspace(-2, 2, 40)</code> in <code>maxError</code>, and <code>y(1)</code> in <code>y1</code>. No <code>syms</code>.`, starter: `y = @(x) x.^3 - 2*x + 5;\nx = linspace(-2, 2, 40);\nh = 1e-5;\nmaxError = 1;   % replace\ny1 = 0;         % replace`, solution: `y = @(x) x.^3 - 2*x + 5;\nx = linspace(-2, 2, 40);\nh = 1e-5;\nmaxError = max(abs((y(x + h) - y(x - h))/(2*h) - (3*x.^2 - 2)))\ny1 = y(1)`, checks: [{ var: 'maxError', value: 0, tol: 1e-6 }, { var: 'y1', value: 4 }, { notUses: 'syms' }] },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Homework 0, Problem 1 — two antiderivatives of 1/(1 − x)²',
      difficulty: 'core',
      hw: 'HW0',
      statement: String.raw`<p>Let $f(x) = \dfrac{1}{(1 - x)^2}$, $F_1(x) = \dfrac{x}{1 - x}$ and $F_2(x) = \dfrac{1}{1 - x}$, all defined for $x \ne 1$. Show that $F_1$ and $F_2$ are both antiderivatives of $f$. Do they differ by a constant? Explain why this does or does not contradict the theorem that two antiderivatives of the same function differ by a constant. (Self-study: ungraded, with a model solution.)</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $F_1'(x)$.`, kind: 'expression', variable: 'x', answer: '1./(1 - x).^2', domain: [1.5, 4], solution: String.raw`Quotient rule: $F_1'(x) = \dfrac{(1 - x) + x}{(1 - x)^2} = \dfrac{1}{(1-x)^2}$.` },
        { label: '(b)', prompt: String.raw`Compute $F_1(x) - F_2(x)$ for $x \ne 1$.`, kind: 'numeric', answer: '-1', solution: String.raw`$\dfrac{x - 1}{1 - x} = -1$.` },
        { label: '(c)', prompt: String.raw`Let $G(x) = F_2(x)$ for $x < 1$ and $G(x) = F_2(x) + 3$ for $x > 1$. Which statement is true?`, kind: 'choice', choices: [
          String.raw`$G$ is not an antiderivative of $f$, because it has a jump.`,
          String.raw`$G$ is an antiderivative of $f$ on its domain, but $G - F_2$ is not constant there.`,
          String.raw`$G = F_2 + C$ for some constant $C$.`,
          String.raw`$G$ is an antiderivative of $f$ only for $x > 1$.`,
        ], answer: 1, solution: String.raw`$G'(x) = f(x)$ at every $x \ne 1$ (a constant shift on $x > 1$ does not change the derivative), and $x = 1$ is not in the domain. But $G - F_2$ equals $0$ on $(-\infty, 1)$ and $3$ on $(1, \infty)$: the domain is not an interval, so the theorem does not apply on all of it.` },
        { label: '(d)', prompt: 'Write the full solution as a Live Script, following the homework template.', kind: 'writeup' },
      ],
      writeup: true,
      writeupTemplate: [
        { type: 'heading', content: 'Problem 1 (Attempted)' },
        { type: 'text', content: 'We differentiate $F_1$ with the quotient rule:' },
        { type: 'equation', content: String.raw`F_1'(x) = ` },
      ],
      solution: [
        { type: 'heading', content: 'Problem 1 (Attempted)' },
        { type: 'text', content: 'We differentiate $F_1$ with the quotient rule:' },
        { type: 'equation', content: String.raw`F_1'(x) = \frac{1 \cdot (1 - x) - x \cdot (-1)}{(1 - x)^2} = \frac{1}{(1 - x)^2} = f(x), \quad x \ne 1.` },
        { type: 'text', content: 'We differentiate $F_2 = (1 - x)^{-1}$ with the chain rule:' },
        { type: 'equation', content: String.raw`F_2'(x) = -(1 - x)^{-2} \cdot (-1) = \frac{1}{(1 - x)^2} = f(x), \quad x \ne 1.` },
        { type: 'text', content: 'Hence both functions are antiderivatives of $f$. Next we compute their difference:' },
        { type: 'equation', content: String.raw`F_1(x) - F_2(x) = \frac{x - 1}{1 - x} = -1, \quad x \ne 1.` },
        { type: 'text', content: 'So $F_1$ and $F_2$ do differ by the constant $-1$. This agrees with the theorem, which states: if $F\' = G\'$ on an **interval** $I$, then $F - G$ is constant on $I$. The domain of $f$ is $(-\\infty, 1) \\cup (1, \\infty)$, which is not an interval, so the theorem applies on each of the two intervals separately. There the difference may be different constants; here it happens to be $-1$ on both. For example' },
        { type: 'equation', content: String.raw`G(x) = \begin{cases} \frac{1}{1 - x}, & x < 1, \\ \frac{1}{1 - x} + 3, & x > 1, \end{cases}` },
        { type: 'text', content: 'is also an antiderivative of $f$ on its whole domain, but $G - F_2$ is $0$ for $x < 1$ and $3$ for $x > 1$, not a single constant. We check numerically that $F_1$ and $F_2$ have derivative $f$ on both sides of $x = 1$ and that their difference is $-1$:' },
        { type: 'code', content: "f  = @(x) 1 ./ (1 - x).^2;\nF1 = @(x) x ./ (1 - x);\nF2 = @(x) 1 ./ (1 - x);\nx = [-2 -0.5 0.5 1.5 3];\nh = 1e-6;\nerr1 = max(abs((F1(x + h) - F1(x - h))/(2*h) - f(x)))\nerr2 = max(abs((F2(x + h) - F2(x - h))/(2*h) - f(x)))\nF1(x) - F2(x)" },
      ],
    },
    {
      id: 'a2',
      title: 'Basic antiderivatives',
      difficulty: 'core',
      statement: String.raw`<p>Find an antiderivative (the constant $C$ may be omitted). Use MATLAB syntax, e.g. <code>2*x.^3 - log(x)</code>, <code>atan(x)</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int\left(6x^2 - 4x + 3\right)\mathrm d x$`, kind: 'expression', variable: 'x', answer: '2*x.^3 - 2*x.^2 + 3*x', upToConstant: true, domain: [-2, 2], solution: String.raw`$2x^3 - 2x^2 + 3x + C$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int\left(\sqrt{x} + \frac{2}{x^2}\right)\mathrm d x$, $x > 0$`, kind: 'expression', variable: 'x', answer: '2/3*x.^(3/2) - 2./x', upToConstant: true, solution: String.raw`$\int x^{1/2}\,\mathrm dx = \frac{2}{3}x^{3/2}$ and $\int 2x^{-2}\,\mathrm dx = -2x^{-1}$: $\frac23 x^{3/2} - \frac{2}{x} + C$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int\left(5e^{-x} + 2\cos(3x)\right)\mathrm d x$`, kind: 'expression', variable: 'x', answer: '-5*exp(-x) + 2/3*sin(3*x)', upToConstant: true, domain: [-1, 2], solution: String.raw`$-5e^{-x} + \frac23\sin(3x) + C$. Check: $5e^{-x} + 2\cos 3x$. ✓` },
        { label: '(d)', prompt: String.raw`$\displaystyle\int\frac{4}{1 + x^2}\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: '4*atan(x)', upToConstant: true, domain: [-2, 2], solution: String.raw`$4\arctan x + C$.` },
        { label: '(e)', prompt: String.raw`$\displaystyle\int\frac{(x^2 + 1)^2}{x}\,\mathrm d x$, $x > 0$`, kind: 'expression', variable: 'x', answer: 'x.^4/4 + x.^2 + log(x)', upToConstant: true, solution: String.raw`Expand first: $\frac{x^4 + 2x^2 + 1}{x} = x^3 + 2x + \frac1x$, so the integral is $\frac{x^4}{4} + x^2 + \ln x + C$.` },
      ],
    },
    {
      id: 'a3',
      title: 'Checking by differentiation',
      difficulty: 'core',
      statement: String.raw`<p>Decide by differentiating which function is an antiderivative of the integrand.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int x e^{-x^2}\,\mathrm d x$`, kind: 'choice', choices: [String.raw`$\frac12 e^{-x^2}$`, String.raw`$-\frac12 e^{-x^2}$`, String.raw`$-\frac{x^2}{2}e^{-x^2}$`, String.raw`$-2e^{-x^2}$`], answer: 1, solution: String.raw`$\frac{\mathrm d}{\mathrm d x}\left(-\frac12 e^{-x^2}\right) = -\frac12 e^{-x^2}(-2x) = x e^{-x^2}$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int\frac{\sin 4x}{7 - 2\cos 4x}\,\mathrm d x$`, kind: 'choice', choices: [String.raw`$\frac12\ln(7 - 2\cos 4x)$`, String.raw`$-\frac18\ln(7 - 2\cos 4x)$`, String.raw`$\frac18\ln(7 - 2\cos 4x)$`, String.raw`$-\frac14\cos 4x \,\ln(7 - 2\cos 4x)$`], answer: 2, solution: String.raw`$\frac{\mathrm d}{\mathrm d x}\frac18\ln(7 - 2\cos 4x) = \frac18\cdot\frac{8\sin 4x}{7 - 2\cos 4x} = \frac{\sin 4x}{7 - 2\cos 4x}$, since $\frac{\mathrm d}{\mathrm d x}(-2\cos 4x) = 8\sin 4x$. (The argument $7 - 2\cos 4x \ge 5$ is always positive, so no absolute value is needed.)` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int\ln x\,\mathrm d x$, $x > 0$`, kind: 'choice', choices: [String.raw`$\frac1x$`, String.raw`$x\ln x$`, String.raw`$x\ln x - x$`, String.raw`$\frac12(\ln x)^2$`], answer: 2, solution: String.raw`$\frac{\mathrm d}{\mathrm d x}(x\ln x - x) = \ln x + 1 - 1 = \ln x$. (Found by integration by parts, module 12.)` },
        { label: '(d)', prompt: String.raw`Find $\displaystyle\int\frac{6}{(3x - 2)^2}\,\mathrm d x$ for $x > \frac23$.`, kind: 'expression', variable: 'x', answer: '-2./(3*x - 2)', upToConstant: true, domain: [1, 3], hint: String.raw`$\int u^{-2}\,\mathrm du = -u^{-1}$, with the linear inner function $u = 3x - 2$.`, solution: String.raw`$\int 6(3x - 2)^{-2}\,\mathrm d x = 6\cdot\frac13\cdot\frac{(3x-2)^{-1}}{-1} + C = -\frac{2}{3x - 2} + C$.` },
      ],
    },
    {
      id: 'a4',
      title: 'Initial value problems',
      difficulty: 'core',
      statement: String.raw`<p>Solve the initial value problems.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$y' = 4x^3 - 2x + 1$, $y(1) = 3$. Give $y(x)$.`, kind: 'expression', variable: 'x', answer: 'x.^4 - x.^2 + x + 2', domain: [-2, 2], solution: String.raw`$y = x^4 - x^2 + x + C$ and $y(1) = 1 + C = 3$, so $C = 2$.` },
        { label: '(b)', prompt: String.raw`$y' = e^{2x}$, $y(0) = 1$. Give $y(x)$.`, kind: 'expression', variable: 'x', answer: 'exp(2*x)/2 + 1/2', domain: [-1, 1], solution: String.raw`$y = \frac12 e^{2x} + C$ and $y(0) = \frac12 + C = 1$, so $y = \frac12 e^{2x} + \frac12$.` },
        { label: '(c)', prompt: String.raw`$y' = \dfrac{1}{1 + x^2}$, $y(1) = 0$. Compute $y(0)$.`, kind: 'numeric', answer: '-pi/4', solution: String.raw`$y = \arctan x + C$ with $\frac\pi4 + C = 0$. Then $y(0) = 0 - \frac\pi4 = -\frac\pi4$.` },
        { label: '(d)', prompt: String.raw`A particle has acceleration $a(t) = 6t - 4$ (m/s²), initial velocity $v(0) = 2$ m/s and position $s(0) = 0$. Find $s(3)$ in metres.`, kind: 'numeric', answer: '15', solution: String.raw`$v(t) = 3t^2 - 4t + 2$ (using $v(0) = 2$), $s(t) = t^3 - 2t^2 + 2t$ (using $s(0) = 0$), so $s(3) = 27 - 18 + 6 = 15$ m.` },
      ],
    },
    {
      id: 'a5',
      title: 'An antiderivative on a domain with a gap',
      difficulty: 'exam',
      hw: 'HW0-style',
      statement: String.raw`<p>Let $f(x) = \dfrac{1}{x^2}$, $x \ne 0$. Find the antiderivative $G$ of $f$ on its whole domain that satisfies $G(-1) = 2$ and $G(1) = 3$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $G(-2)$.`, kind: 'numeric', answer: '3/2', solution: String.raw`On $(-\infty, 0)$: $G(x) = -\frac1x + C_1$ and $G(-1) = 1 + C_1 = 2$, so $C_1 = 1$ and $G(-2) = \frac12 + 1 = \frac32$.` },
        { label: '(b)', prompt: String.raw`Compute $G(2)$.`, kind: 'numeric', answer: '7/2', solution: String.raw`On $(0, \infty)$: $G(x) = -\frac1x + C_2$ and $G(1) = -1 + C_2 = 3$, so $C_2 = 4$ and $G(2) = -\frac12 + 4 = \frac72$.` },
        { label: '(c)', prompt: String.raw`Is there a single constant $C$ with $G(x) = -\frac1x + C$ for all $x \ne 0$?`, kind: 'choice', choices: ['Yes', 'No'], answer: 1, solution: String.raw`No: $C_1 = 1 \ne C_2 = 4$. Two conditions, one on each interval, need two constants.` },
        { label: '(d)', prompt: 'Write the solution as a Live Script in the homework format, including a plot of $G$.', kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: 'The domain of $f(x) = x^{-2}$ is $(-\\infty, 0) \\cup (0, \\infty)$, the union of two intervals. On each interval the antiderivatives differ by a constant, so we use one constant per interval:' },
        { type: 'equation', content: String.raw`G(x) = \begin{cases} -\frac{1}{x} + C_1, & x < 0, \\ -\frac{1}{x} + C_2, & x > 0. \end{cases}` },
        { type: 'text', content: 'We determine $C_1$ from the condition at $x = -1$ and $C_2$ from the condition at $x = 1$:' },
        { type: 'equation', content: String.raw`G(-1) = 1 + C_1 = 2 \;\Rightarrow\; C_1 = 1, \qquad G(1) = -1 + C_2 = 3 \;\Rightarrow\; C_2 = 4.` },
        { type: 'text', content: 'Hence $G(x) = 1 - \\frac{1}{x}$ for $x < 0$ and $G(x) = 4 - \\frac{1}{x}$ for $x > 0$. In particular $G(-2) = \\frac{3}{2}$ and $G(2) = \\frac{7}{2}$. We check the two conditions and plot $G$:' },
        { type: 'code', content: "G = @(x) (x < 0).*(1 - 1./x) + (x > 0).*(4 - 1./x);\n[G(-1), G(1), G(-2), G(2)]\nfplot(G, [-4 -0.1])\nhold on\nfplot(G, [0.1 4])\nhold off\nylim([-6 12])\ngrid on" },
      ],
    },
  ],
};
