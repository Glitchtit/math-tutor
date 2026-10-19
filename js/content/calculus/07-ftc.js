// Module 7: The Fundamental Theorem of Calculus

export default {
  id: 'ftc',
  number: 7,
  part: 'integration',
  hw: 'HW0',
  title: 'The Fundamental Theorem of Calculus',
  summary: 'Accumulation functions A(x) = ∫_a^x f(t) dt, FTC part 1 (A\' = f, also with variable limits and the chain rule), FTC part 2 (∫_a^b f = F(b) − F(a)), and the sine integral Si(x) as a function defined by an integral: derivative, extrema, oddness. MATLAB: functions defined by integrals, arrayfun, local functions.',
  intro: String.raw`<p>Differentiation and integration look unrelated: one is about slopes, the other about areas. The <b>Fundamental Theorem of Calculus</b> says they are inverse operations. Part 1: the rate at which area accumulates under $f$ is $f$ itself. Part 2: a definite integral is computed from any antiderivative, $\int_a^b f(x)\,\mathrm d x = F(b) - F(a)$. Along the way we meet functions that are <i>defined</i> by an integral, such as the sine integral $\mathrm{Si}(x)$ from Homework 0.</p>`,
  lessons: [
    {
      id: 'accumulation',
      title: 'Accumulation functions',
      blocks: [
        { type: 'text', html: String.raw`<p>Fix the left end $a$ and let the right end move: $A(x) = \int_a^x f(t)\,\mathrm d t$ is the signed area accumulated from $a$ up to $x$. The upper plot shows the area, the lower plot the function $A$. Press <b>Accumulate</b> and compare the slope of $A$ (orange tangent) with the height of $f$.</p>` },
        { type: 'widget', name: 'accumulate', config: {
          title: 'A(x) = ∫₀ˣ sin t dt',
          f: 'sin(x)', a: 0, x0: 2, xlim: [-1, 10], ylim: [-1.4, 1.4], Alim: [-0.5, 2.5],
        } },
        { type: 'callout', kind: 'key', html: String.raw`<ul><li>Where $f > 0$, $A$ increases; where $f < 0$, $A$ decreases.</li><li>Where $f$ changes sign from $+$ to $-$, $A$ has a local <b>maximum</b>; from $-$ to $+$, a local <b>minimum</b>.</li><li>Where $f$ has a local extremum, $A$ has an inflection point.</li></ul><p>Here $A(x) = 1 - \cos x$: maxima at $x = \pi, 3\pi, \dots$ where $\sin$ turns negative.</p>` },
        { type: 'text', html: String.raw`<p>Inside the integral the variable is a <b>dummy</b> variable $t$; the function $A$ depends only on the upper limit $x$. Writing $\int_a^x f(x)\,\mathrm d x$ is a common mistake: $x$ cannot be both the limit and the integration variable.</p>` },
        { type: 'steps', title: String.raw`Example: where does $g(x) = \int_0^x (t^2 - 4)\,\mathrm d t$ increase?`, steps: [
          String.raw`We read off the rate of accumulation: the integrand at the upper limit is $x^2 - 4$, so $g'(x) = x^2 - 4$ (made precise by FTC 1 in the next lesson).`,
          String.raw`We find the sign of $g'$: $x^2 - 4 = (x-2)(x+2)$ is positive for $|x| > 2$ and negative for $|x| < 2$.`,
          String.raw`Hence $g$ increases on $(-\infty, -2]$ and $[2, \infty)$, decreases on $[-2, 2]$, has a local maximum at $x = -2$ and a local minimum at $x = 2$.`,
          String.raw`Check by computing explicitly: $g(x) = \frac{x^3}{3} - 4x$, so $g(-2) = \frac{16}{3}$ and $g(2) = -\frac{16}{3}$.`,
        ] },
        { type: 'quiz', question: String.raw`$A(x) = \int_0^x f(t)\,\mathrm d t$, and $f$ changes sign from positive to negative at $x = c$. Then $A$ has at $x = c$ …`, choices: ['a local minimum', 'a local maximum', 'an inflection point', 'a zero'], answer: 1, explain: String.raw`$A' = f$ changes from $+$ to $-$, so $A$ stops increasing and starts decreasing: a local maximum. $A(c)$ need not be zero.` },
      ],
    },
    {
      id: 'ftc-part-1',
      title: 'FTC part 1 and variable limits',
      blocks: [
        { type: 'text', html: String.raw`<p>The function $e^{-x^2}$ has no elementary antiderivative, yet the accumulation function $E(x) = \int_0^x e^{-t^2}\,\mathrm d t$ is perfectly well defined, smooth and increasing. Its slope at every point is the height of the bell curve.</p>` },
        { type: 'widget', name: 'accumulate', config: {
          title: 'E(x) = ∫₀ˣ exp(−t²) dt — a new function with E′ = exp(−x²)',
          f: 'exp(-x.^2)', a: 0, x0: 0.8, xlim: [-3, 3], ylim: [-0.2, 1.2], Alim: [-1.1, 1.1],
        } },
        { type: 'callout', kind: 'thm', title: 'Fundamental Theorem of Calculus, part 1', html: String.raw`<p>If $f$ is continuous on an interval $I$ containing $a$, then $A(x) = \int_a^x f(t)\,\mathrm d t$ is differentiable on $I$ and</p>$$\frac{\mathrm d}{\mathrm d x}\int_a^x f(t)\,\mathrm d t = f(x).$$<p><i>Why:</i> $\frac{A(x+h) - A(x)}{h} = \frac1h\int_x^{x+h} f(t)\,\mathrm d t$ is the mean value of $f$ on $[x, x+h]$, which tends to $f(x)$ as $h \to 0$.</p>` },
        { type: 'callout', kind: 'key', title: 'Variable limits: chain rule', html: String.raw`$$\frac{\mathrm d}{\mathrm d x}\int_{h(x)}^{g(x)} f(t)\,\mathrm d t = f\big(g(x)\big)\,g'(x) - f\big(h(x)\big)\,h'(x).$$<p>Split at a constant $a$: $\int_{h}^{g} = \int_a^{g} - \int_a^{h}$, then differentiate each part with FTC 1 and the chain rule.</p>` },
        { type: 'steps', title: String.raw`Example: $\dfrac{\mathrm d}{\mathrm d x}\displaystyle\int_x^{x^2} \sqrt{1 + t^3}\,\mathrm d t$`, steps: [
          String.raw`We split at $0$: $\int_x^{x^2} \sqrt{1+t^3}\,\mathrm d t = \int_0^{x^2} \sqrt{1+t^3}\,\mathrm d t - \int_0^{x} \sqrt{1+t^3}\,\mathrm d t$.`,
          String.raw`The first term is $A(x^2)$ with $A' = \sqrt{1+x^3}$. By the chain rule its derivative is $\sqrt{1 + (x^2)^3}\cdot 2x = 2x\sqrt{1 + x^6}$.`,
          String.raw`The second term has derivative $\sqrt{1 + x^3}$ by FTC 1.`,
          String.raw`Together: $\dfrac{\mathrm d}{\mathrm d x}\displaystyle\int_x^{x^2} \sqrt{1+t^3}\,\mathrm d t = 2x\sqrt{1+x^6} - \sqrt{1+x^3}$ (for $x \ge -1$, where both roots are real).`,
        ] },
        { type: 'quiz', question: String.raw`$\dfrac{\mathrm d}{\mathrm d x}\displaystyle\int_0^{\sin x} e^{t^2}\,\mathrm d t = \;?$`, choices: [String.raw`$e^{\sin^2 x}$`, String.raw`$e^{\sin^2 x}\cos x$`, String.raw`$e^{x^2}\cos x$`, String.raw`$2\sin x\,e^{\sin^2 x}$`], answer: 1, explain: String.raw`Evaluate the integrand at the upper limit, $e^{(\sin x)^2}$, and multiply by the derivative of the upper limit, $\cos x$.` },
        { type: 'quiz', question: String.raw`$\dfrac{\mathrm d}{\mathrm d x}\displaystyle\int_x^{5} \ln(1 + t^2)\,\mathrm d t = \;?$`, choices: [String.raw`$\ln(1+x^2)$`, String.raw`$-\ln(1+x^2)$`, String.raw`$\ln 26 - \ln(1+x^2)$`, String.raw`$\frac{2x}{1+x^2}$`], answer: 1, explain: String.raw`$\int_x^5 = -\int_5^x$, so the derivative is $-\ln(1 + x^2)$.` },
      ],
    },
    {
      id: 'ftc-part-2',
      title: 'FTC part 2: evaluating integrals',
      blocks: [
        { type: 'text', html: String.raw`<p>The shaded area under $\cos x$ from $a$ to $b$ equals the <b>rise</b> of its antiderivative $\sin x$ over the same interval. Drag $a$ and $b$, including across the zeros of $\cos x$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Area under f = cos x equals F(b) − F(a) with F = sin x',
          functions: [{ expr: 'cos(x)', label: String.raw`$f(x) = \cos x$` }, { expr: 'sin(x)', label: String.raw`$F(x) = \sin x$`, dash: true }],
          params: { a: { min: -3, max: 3, value: -0.5, label: '$a$' }, b: { min: -3, max: 6, value: 2.2, label: '$b$' } },
          shade: { expr: 'cos(x)', from: 'a', to: 'b', signed: true },
          points: [{ x: 'a', y: 'sin(a)' }, { x: 'b', y: 'sin(b)' }],
          xlim: [-3.5, 6.5], ylim: [-1.6, 1.6],
          readout: String.raw`$\int_a^b \cos x\,\mathrm d x = \sin b - \sin a = {{sin(b) - sin(a)}}$ — the difference in height of the two dots on the dashed curve.`,
        } },
        { type: 'callout', kind: 'thm', title: 'Fundamental Theorem of Calculus, part 2', html: String.raw`<p>If $f$ is continuous on $[a, b]$ and $F$ is any antiderivative of $f$ there, then</p>$$\int_a^b f(x)\,\mathrm d x = \Big[ F(x) \Big]_a^b = F(b) - F(a).$$<p>The constant $C$ cancels, so any antiderivative works. Equivalently (net change): $\int_a^b F'(x)\,\mathrm d x = F(b) - F(a)$ — integrating a velocity gives a displacement.</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int_1^4 \left(3\sqrt{x} - \frac{2}{x^2}\right)\mathrm d x$`, steps: [
          String.raw`We find an antiderivative term by term with the power rule: $3x^{1/2} \to 2x^{3/2}$ and $-2x^{-2} \to 2x^{-1}$, so $F(x) = 2x^{3/2} + \frac{2}{x}$.`,
          String.raw`We evaluate at the limits: $F(4) = 2\cdot 8 + \frac12 = \frac{33}{2}$ and $F(1) = 2 + 2 = 4$.`,
          String.raw`We subtract: $\displaystyle\int_1^4 \left(3\sqrt{x} - \frac{2}{x^2}\right)\mathrm d x = \frac{33}{2} - 4 = \frac{25}{2}$.`,
        ] },
        { type: 'callout', kind: 'warn', title: 'Check continuity first', html: String.raw`<p>Blindly applying FTC 2 to $\int_{-1}^{1} \frac{1}{x^2}\,\mathrm d x$ gives $\Big[-\frac1x\Big]_{-1}^{1} = -2$, a negative number for a positive integrand. The theorem does not apply: $\frac{1}{x^2}$ is unbounded at $x = 0$ inside the interval. (This is an improper integral, Module 14; it diverges.)</p>` },
        { type: 'quiz', question: String.raw`$\displaystyle\int_0^{\pi/2} \cos x\,\mathrm d x = \;?$`, choices: ['0', '1', String.raw`$\pi/2$`, '-1'], answer: 1, explain: String.raw`$\Big[\sin x\Big]_0^{\pi/2} = 1 - 0 = 1$.` },
        { type: 'quiz', question: String.raw`A particle has velocity $v(t) = t^2 - 4t + 3$ m/s. What is its displacement for $0 \le t \le 3$?`, choices: ['0 m', String.raw`$\tfrac43$ m`, String.raw`$\tfrac83$ m`, '9 m'], answer: 0, explain: String.raw`$\Big[\frac{t^3}{3} - 2t^2 + 3t\Big]_0^3 = 9 - 18 + 9 = 0$. The particle returns to its start; the distance travelled $\int_0^3 |v|\,\mathrm d t = \frac83$ is not zero.` },
      ],
    },
    {
      id: 'sine-integral',
      title: 'A function defined by an integral: Si(x)',
      blocks: [
        { type: 'text', html: String.raw`<p>The <b>sine integral</b> $\mathrm{Si}(x) = \int_0^x \frac{\sin t}{t}\,\mathrm d t$ has no formula in elementary functions, but FTC 1 tells us everything about its shape. The integrand $\frac{\sin t}{t}$ is even and extends continuously to $t = 0$ with value $1$. Accumulate it in both directions:</p>` },
        { type: 'widget', name: 'accumulate', config: {
          title: 'Si(x) = ∫₀ˣ sin t / t dt',
          f: 'sin(x)./x', a: 0, x0: 3.14, xlim: [-14, 14], ylim: [-0.4, 1.1], Alim: [-2, 2],
        } },
        { type: 'callout', kind: 'def', title: 'Homework 0, Problem 5', html: String.raw`<p>$\mathrm{Si}(x) = \displaystyle\int_0^x \frac{\sin t}{t}\,\mathrm d t$. (a) Find $\mathrm{Si}'(x)$. (b) Find the local maxima of $\mathrm{Si}$. (c) Show that $\mathrm{Si}$ is odd. (d) Evaluate $\int_{-10}^{10} \mathrm{Si}(x)\,\mathrm d x$.</p>` },
        { type: 'steps', title: 'Solution, parts (a) and (b): derivative and local maxima', steps: [
          String.raw`By FTC 1 (the integrand is continuous once we set its value at $0$ to $1$): $\mathrm{Si}'(x) = \dfrac{\sin x}{x}$ for $x \ne 0$, and $\mathrm{Si}'(0) = 1$.`,
          String.raw`Critical points: $\mathrm{Si}'(x) = 0 \iff \sin x = 0,\ x \ne 0 \iff x = k\pi,\ k = \pm1, \pm2, \dots$`,
          String.raw`For $x > 0$ the sign of $\frac{\sin x}{x}$ is the sign of $\sin x$, which changes from $+$ to $-$ at $x = \pi, 3\pi, 5\pi, \dots$: these are local maxima. At $2\pi, 4\pi, \dots$ it changes from $-$ to $+$: local minima.`,
          String.raw`For $x < 0$ the denominator is negative, so the sign of $\frac{\sin x}{x}$ is the <i>opposite</i> of the sign of $\sin x$. On $(-3\pi, -2\pi)$ $\sin x < 0$, so $\mathrm{Si}' > 0$; on $(-2\pi, -\pi)$ $\sin x > 0$, so $\mathrm{Si}' < 0$. Hence $x = -2\pi$ is a local maximum, and likewise $-4\pi, -6\pi, \dots$`,
          String.raw`Answer: local maxima at $x = \pi, 3\pi, 5\pi, \dots$ and at $x = -2\pi, -4\pi, -6\pi, \dots$ (The largest value is $\mathrm{Si}(\pi) \approx 1.8519$.)`,
        ] },
        { type: 'steps', title: 'Solution, parts (c) and (d): oddness and the symmetric integral', steps: [
          String.raw`We write $\mathrm{Si}(-x) = \int_0^{-x} \frac{\sin t}{t}\,\mathrm d t$ and substitute $t = -s$, $\mathrm d t = -\mathrm d s$; the limits $t = 0, -x$ become $s = 0, x$.`,
          String.raw`Then $\mathrm{Si}(-x) = \int_0^{x} \frac{\sin(-s)}{-s}\,(-\mathrm d s) = -\int_0^x \frac{\sin s}{s}\,\mathrm d s = -\mathrm{Si}(x)$, because $\frac{\sin(-s)}{-s} = \frac{\sin s}{s}$.`,
          String.raw`So $\mathrm{Si}$ is odd. It is continuous, so its integral over the symmetric interval $[-10, 10]$ is $\int_{-10}^{10} \mathrm{Si}(x)\,\mathrm d x = 0$.`,
        ] },
        { type: 'quiz', question: String.raw`Where does $\mathrm{Si}$ have a local <b>minimum</b> on $x < 0$?`, choices: [String.raw`$x = -2\pi, -4\pi, \dots$`, String.raw`$x = -\pi, -3\pi, -5\pi, \dots$`, String.raw`$x = -\pi/2, -3\pi/2, \dots$`, 'nowhere'], answer: 1, explain: String.raw`$\mathrm{Si}$ is odd, so the local maxima at $\pi, 3\pi, \dots$ become local minima at $-\pi, -3\pi, \dots$ — consistent with the sign analysis.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'functions-by-integrals',
      title: 'Functions defined by an integral: integral and arrayfun',
      blocks: [
        { type: 'text', html: String.raw`<p>A function such as $\mathrm{Si}$ is defined in MATLAB by wrapping <code>integral</code> in an anonymous function: <code>Si = @(x) integral(f, 0, x)</code>. This handle accepts <b>one number at a time</b> (the upper limit must be a scalar). To evaluate it on a grid, use <code>arrayfun</code>, which calls the function once per element and collects the results.</p>` },
        { type: 'code', caption: 'Plot Si on [−15, 15] and locate its first maximum.', editable: true, code: `f  = @(t) sin(t)./t;
Si = @(x) integral(f, 0, x);        % scalar input only
Si(pi)
xs = linspace(-15, 15, 301);
S  = arrayfun(Si, xs);              % evaluate on the grid
plot(xs, S); grid on
xlabel('x'); ylabel('Si(x)')
xmax = fminbnd(@(x) -Si(x), 2, 4)   % maximise Si = minimise -Si
fprintf('xmax - pi = %.2e\\n', xmax - pi)` },
        { type: 'callout', kind: 'warn', title: 'Vectorising a handle that calls integral', html: String.raw`<p><code>fplot(Si, ...)</code> and <code>integral(Si, ...)</code> call <code>Si</code> with a <i>vector</i>. Wrap it first: <code>SiV = @(x) arrayfun(Si, x);</code>. Then <code>integral(SiV, -10, 10)</code> works and returns (numerically) $0$.</p>` },
        { type: 'text', html: String.raw`<p>The LaTeX for the definition uses <code>\mathrm{Si}</code> so that the name is set upright like $\sin$:</p>` },
        { type: 'latex', prompt: 'Type the definition of the sine integral:', target: String.raw`\mathrm{Si}(x) = \int_0^x \frac{\sin t}{t}\,\mathrm d t` },
        { type: 'latex', prompt: 'Type FTC part 1 for the sine integral:', target: String.raw`\mathrm{Si}'(x) = \frac{\sin x}{x}` },
        { type: 'latex', prompt: 'Type the chain-rule version of FTC 1:', target: String.raw`\frac{\mathrm d}{\mathrm d x}\int_a^{g(x)} f(t)\,\mathrm d t = f(g(x))\,g'(x)`, accept: [String.raw`\frac{d}{dx}\int_{a}^{g(x)} f(t)\,dt = f\big(g(x)\big)\,g'(x)`] },
        { type: 'matlab', prompt: String.raw`Define <code>E = @(x) integral(...)</code> for $E(x) = \int_0^x e^{-t^2}\,\mathrm d t$, and store $E(1)$ in <code>E1</code>.`, starter: `E = @(x) 0;   % replace 0 by integral(@(t) ..., 0, x)\nE1 = 0        % replace 0 by E(1)`, solution: `E = @(x) integral(@(t) exp(-t.^2), 0, x);\nE1 = E(1)`, checks: [{ var: 'E', isFunction: true }, { var: 'E1', value: 0.746824132812427, tol: 1e-8 }, { uses: 'integral' }] },
        { type: 'matlab', prompt: String.raw`Evaluate $\mathrm{Si}$ on the grid <code>xs = linspace(-15, 15, 301)</code> with <code>arrayfun</code>, store the values in <code>S</code> and plot them.`, starter: `Si = @(x) integral(@(t) sin(t)./t, 0, x);\nxs = linspace(-15, 15, 301);\nS = 0;    % replace 0 by arrayfun(...)\n`, solution: `Si = @(x) integral(@(t) sin(t)./t, 0, x);\nxs = linspace(-15, 15, 301);\nS = arrayfun(Si, xs);\nplot(xs, S)\ngrid on`, checks: [{ var: 'S', size: 301 }, { uses: 'arrayfun' }, { figure: true }] },
      ],
    },
    {
      id: 'local-functions',
      title: 'Local functions and the Function definitions section',
      blocks: [
        { type: 'text', html: String.raw`<p>The homework template ends with a <b>Function definitions</b> section. A <b>local function</b> placed there is visible in the whole Live Script and may contain several lines and comments:</p><pre>function y = Si(x)
% Sine integral
y = integral(@(t) sin(t)./t, 0, x);
end</pre><p>Local functions must come <b>after</b> all other code. Pass them to <code>arrayfun</code>, <code>integral</code> or <code>fzero</code> with a handle: <code>@Si</code>.</p>` },
        { type: 'livescript', caption: 'Model answer (Homework 0, Problem 5, numerical part)', blocks: [
          { type: 'heading', content: 'Problem 5 (Attempted)' },
          { type: 'text', content: 'The sine integral is defined by' },
          { type: 'equation', content: String.raw`\mathrm{Si}(x) = \int_0^x \frac{\sin t}{t}\,\mathrm d t .` },
          { type: 'text', content: 'By the Fundamental Theorem of Calculus, part 1, its derivative is the integrand evaluated at the upper limit:' },
          { type: 'equation', content: String.raw`\mathrm{Si}'(x) = \frac{\sin x}{x}, \qquad x \ne 0 .` },
          { type: 'text', content: 'We plot $\\mathrm{Si}$ and check numerically that it is odd and that its integral over $[-10, 10]$ vanishes:' },
          { type: 'code', content: "xs = linspace(-15, 15, 301);\nplot(xs, arrayfun(@Si, xs)); grid on\nxlabel('x'); title('Si(x)')\noddCheck = Si(-2.7) + Si(2.7)\nI = integral(@(x) arrayfun(@Si, x), -10, 10)" },
          { type: 'heading', content: 'Function definitions' },
          { type: 'code', content: "function y = Si(x)\n% Sine integral: integral of sin(t)/t from 0 to x (x scalar)\ny = integral(@(t) sin(t)./t, 0, x);\nend" },
        ] },
        { type: 'matlab', prompt: String.raw`Write a local function <code>g</code> with $g(x) = \int_0^x (t^2 - 4)\,\mathrm d t$ (use <code>integral</code>). Then store <code>gmin = g(2)</code> (exact value $-16/3$).`, starter: `gmin = 0    % replace 0 by g(2)\n\nfunction y = g(x)\ny = 0;      % replace 0 by integral(...)\nend`, solution: `gmin = g(2)\n\nfunction y = g(x)\ny = integral(@(t) t.^2 - 4, 0, x);\nend`, checks: [{ var: 'gmin', value: '-16/3', tol: 1e-8 }, { uses: 'integral' }] },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Derivatives of integrals',
      difficulty: 'core',
      statement: String.raw`<p>Differentiate with FTC 1 and the chain rule. Type the answers in MATLAB syntax.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\dfrac{\mathrm d}{\mathrm d x}\displaystyle\int_1^x \sqrt{t^3 + 1}\,\mathrm d t$`, kind: 'expression', variable: 'x', answer: 'sqrt(x.^3 + 1)', solution: String.raw`FTC 1: $\sqrt{x^3 + 1}$.` },
        { label: '(b)', prompt: String.raw`$\dfrac{\mathrm d}{\mathrm d x}\displaystyle\int_2^{x^3} \ln(1 + t^2)\,\mathrm d t$`, kind: 'expression', variable: 'x', answer: '3*x.^2.*log(1 + x.^6)', solution: String.raw`$\ln\big(1 + (x^3)^2\big)\cdot 3x^2 = 3x^2\ln(1 + x^6)$.` },
        { label: '(c)', prompt: String.raw`$\dfrac{\mathrm d}{\mathrm d x}\displaystyle\int_{\sin x}^{1} e^{t^2}\,\mathrm d t$`, kind: 'expression', variable: 'x', answer: '-exp(sin(x).^2).*cos(x)', solution: String.raw`The variable limit is the lower one: $-e^{\sin^2 x}\cos x$.` },
        { label: '(d)', prompt: String.raw`$\dfrac{\mathrm d}{\mathrm d x}\displaystyle\int_{x}^{2x} \frac{\mathrm d t}{1 + t^4}$`, kind: 'expression', variable: 'x', answer: '2./(1 + 16*x.^4) - 1./(1 + x.^4)', solution: String.raw`$\frac{2}{1 + (2x)^4} - \frac{1}{1 + x^4} = \frac{2}{1 + 16x^4} - \frac{1}{1+x^4}$.` },
      ],
    },
    {
      id: 'a2',
      title: 'Evaluating definite integrals',
      difficulty: 'core',
      statement: String.raw`<p>Evaluate with FTC 2. Exact MATLAB expressions such as <code>(exp(2)-1)/2</code> are accepted.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int_0^2 \left(3x^2 - 4x + 1\right)\mathrm d x$`, kind: 'numeric', answer: '2', solution: String.raw`$\Big[x^3 - 2x^2 + x\Big]_0^2 = 8 - 8 + 2 = 2$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_1^{e} \left(\frac{2}{x} + x\right)\mathrm d x$`, kind: 'numeric', answer: '2 + (exp(2) - 1)/2', solution: String.raw`$\Big[2\ln x + \frac{x^2}{2}\Big]_1^e = 2 + \frac{e^2 - 1}{2}$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_0^{\pi/3} \sec^2 x\,\mathrm d x$`, kind: 'numeric', answer: 'sqrt(3)', solution: String.raw`$\Big[\tan x\Big]_0^{\pi/3} = \sqrt3$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\int_0^1 \left(e^{2x} - \frac{1}{1 + x^2}\right)\mathrm d x$`, kind: 'numeric', answer: '(exp(2) - 1)/2 - pi/4', solution: String.raw`$\Big[\frac{e^{2x}}{2} - \arctan x\Big]_0^1 = \frac{e^2 - 1}{2} - \frac{\pi}{4}$.` },
        { label: '(e)', prompt: String.raw`What is $\displaystyle\int_{-1}^{2} \frac{\mathrm d x}{x^3}$?`, kind: 'choice', choices: [String.raw`$\frac38$`, String.raw`$-\frac38$`, '0', 'FTC 2 does not apply: the integrand is unbounded at $x = 0$'], answer: 3, solution: String.raw`$\frac{1}{x^3}$ is not continuous on $[-1, 2]$. The formal computation $\Big[-\frac{1}{2x^2}\Big]_{-1}^{2} = \frac38$ is meaningless; the integral is improper and diverges.` },
      ],
    },
    {
      id: 'a3',
      title: 'Analysing an accumulation function',
      difficulty: 'core',
      statement: String.raw`<p>Let $g(x) = \displaystyle\int_0^x (t^2 - 4t + 3)\,\mathrm d t$ for $0 \le x \le 5$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`At which $x$ does $g$ have a local maximum?`, kind: 'numeric', answer: '1', solution: String.raw`$g'(x) = x^2 - 4x + 3 = (x-1)(x-3)$ changes from $+$ to $-$ at $x = 1$.` },
        { label: '(b)', prompt: String.raw`Compute the local minimum value $g(3)$.`, kind: 'numeric', answer: '0', solution: String.raw`$g(x) = \frac{x^3}{3} - 2x^2 + 3x$, so $g(3) = 9 - 18 + 9 = 0$.` },
        { label: '(c)', prompt: String.raw`Find the absolute maximum value of $g$ on $[0, 5]$.`, kind: 'numeric', answer: '20/3', solution: String.raw`Candidates: $g(0) = 0$, $g(1) = \frac43$, $g(3) = 0$, $g(5) = \frac{125}{3} - 50 + 15 = \frac{20}{3}$. The maximum is $\frac{20}{3}$ at $x = 5$.` },
        { label: '(d)', prompt: String.raw`Where is the inflection point of $g$?`, kind: 'numeric', answer: '2', solution: String.raw`$g''(x) = 2x - 4$ changes sign at $x = 2$ (where the integrand has its minimum).` },
      ],
    },
    {
      id: 'a4',
      title: 'The sine integral (Homework 0, Problem 5)',
      difficulty: 'exam',
      hw: 'HW0-style',
      statement: String.raw`<p>Let $\mathrm{Si}(x) = \displaystyle\int_0^x \frac{\sin t}{t}\,\mathrm d t$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Give $\mathrm{Si}'(x)$ for $x \ne 0$.`, kind: 'expression', variable: 'x', answer: 'sin(x)./x', solution: String.raw`FTC 1: $\mathrm{Si}'(x) = \frac{\sin x}{x}$.` },
        { label: '(b)', prompt: String.raw`Where does $\mathrm{Si}$ have its local maxima?`, kind: 'choice', choices: [String.raw`$x = k\pi$ for all integers $k \ne 0$`, String.raw`$x = \pi, 3\pi, 5\pi, \dots$ and $x = -\pi, -3\pi, \dots$`, String.raw`$x = \pi, 3\pi, 5\pi, \dots$ and $x = -2\pi, -4\pi, \dots$`, String.raw`$x = 2\pi, 4\pi, \dots$ and $x = -\pi, -3\pi, \dots$`], answer: 2, solution: String.raw`For $x > 0$, $\mathrm{Si}'$ has the sign of $\sin x$: $+\to-$ at odd multiples of $\pi$. For $x < 0$ the sign is reversed: $+\to-$ at $-2\pi, -4\pi, \dots$` },
        { label: '(c)', prompt: String.raw`Compute the maximum value $\mathrm{Si}(\pi)$ numerically (4 decimals suffice).`, kind: 'numeric', answer: 'integral(@(t) sin(t)./t, 0, pi)', tol: 1e-4, solution: String.raw`<code>integral(@(t) sin(t)./t, 0, pi)</code> $\approx 1.8519$.` },
        { label: '(d)', prompt: String.raw`Evaluate $\displaystyle\int_{-10}^{10} \mathrm{Si}(x)\,\mathrm d x$.`, kind: 'numeric', answer: '0', solution: String.raw`$\mathrm{Si}$ is odd and continuous, so the integral over $[-10, 10]$ is $0$.` },
        { label: '(e)', prompt: String.raw`Prove that $\mathrm{Si}$ is odd (substitution $t = -s$) and write the whole solution as a Live Script.`, kind: 'writeup' },
      ],
      writeup: true,
      writeupTemplate: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: 'By the Fundamental Theorem of Calculus ...' },
        { type: 'equation', content: String.raw`\mathrm{Si}'(x) = ` },
        { type: 'heading', content: 'Function definitions' },
        { type: 'code', content: "function y = Si(x)\ny = integral(@(t) sin(t)./t, 0, x);\nend" },
      ],
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: '**(a)** The integrand $\\sin t / t$ is continuous (with value 1 at $t = 0$), so by the Fundamental Theorem of Calculus, part 1,' },
        { type: 'equation', content: String.raw`\mathrm{Si}'(x) = \frac{\sin x}{x}, \qquad x \ne 0 .` },
        { type: 'text', content: '**(b)** The critical points are the zeros of $\\sin x$ with $x \\ne 0$, i.e. $x = k\\pi$, $k \\ne 0$. For $x > 0$ the sign of $\\mathrm{Si}\'(x)$ is the sign of $\\sin x$, which changes from positive to negative at $x = \\pi, 3\\pi, 5\\pi, \\dots$ For $x < 0$ the negative denominator reverses the sign, so $\\mathrm{Si}\'$ changes from positive to negative at $x = -2\\pi, -4\\pi, \\dots$ Hence the local maxima are at' },
        { type: 'equation', content: String.raw`x = \pi, 3\pi, 5\pi, \dots \quad\text{and}\quad x = -2\pi, -4\pi, -6\pi, \dots` },
        { type: 'text', content: '**(c)** We substitute $t = -s$, $\\mathrm d t = -\\mathrm d s$ in $\\mathrm{Si}(-x)$ and use that $\\sin(-s)/(-s) = \\sin s / s$:' },
        { type: 'equation', content: String.raw`\mathrm{Si}(-x) = \int_0^{-x} \frac{\sin t}{t}\,\mathrm d t = \int_0^{x} \frac{\sin(-s)}{-s}\,(-\mathrm d s) = -\int_0^{x} \frac{\sin s}{s}\,\mathrm d s = -\mathrm{Si}(x).` },
        { type: 'text', content: 'Therefore $\\mathrm{Si}$ is odd.' },
        { type: 'text', content: '**(d)** $\\mathrm{Si}$ is continuous and odd, and the interval is symmetric about 0, so' },
        { type: 'equation', content: String.raw`\int_{-10}^{10} \mathrm{Si}(x)\,\mathrm d x = 0 .` },
        { type: 'text', content: 'We check (b) and (d) numerically and plot $\\mathrm{Si}$ with its maxima:' },
        { type: 'code', content: "xs = linspace(-15, 15, 301);\nplot(xs, arrayfun(@Si, xs)); grid on; hold on\nxline(pi); xline(3*pi); xline(-2*pi); xline(-4*pi)\nxmax = fminbnd(@(x) -Si(x), 2, 4)\nI = integral(@(x) arrayfun(@Si, x), -10, 10)" },
        { type: 'heading', content: 'Function definitions' },
        { type: 'code', content: "function y = Si(x)\n% Sine integral: integral of sin(t)/t from 0 to x (x scalar)\ny = integral(@(t) sin(t)./t, 0, x);\nend" },
      ],
    },
    {
      id: 'a5',
      title: 'Both limits variable',
      difficulty: 'challenge',
      statement: String.raw`<p>Let $F(x) = \displaystyle\int_x^{2x} e^{-t^2}\,\mathrm d t$ for $x \ge 0$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Give $F'(x)$.`, kind: 'expression', variable: 'x', answer: '2*exp(-4*x.^2) - exp(-x.^2)', solution: String.raw`$F'(x) = e^{-(2x)^2}\cdot 2 - e^{-x^2}\cdot 1 = 2e^{-4x^2} - e^{-x^2}$.` },
        { label: '(b)', prompt: String.raw`Find the $x > 0$ where $F$ attains its maximum.`, kind: 'numeric', answer: 'sqrt(log(2)/3)', hint: String.raw`Solve $2e^{-4x^2} = e^{-x^2}$ by taking logarithms.`, solution: String.raw`$2e^{-4x^2} = e^{-x^2} \iff \ln 2 = 3x^2 \iff x = \sqrt{\ln 2 / 3} \approx 0.4807$. $F' > 0$ before and $< 0$ after, and $F(0) = 0$, $F(x) \to 0$ as $x \to \infty$, so this is the global maximum.` },
        { label: '(c)', prompt: String.raw`Compute the maximum value numerically.`, kind: 'numeric', answer: 'integral(@(t) exp(-t.^2), sqrt(log(2)/3), 2*sqrt(log(2)/3))', tol: 1e-4, solution: String.raw`<code>c = sqrt(log(2)/3); integral(@(t) exp(-t.^2), c, 2*c)</code> $\approx 0.2860$.` },
      ],
    },
  ],
};
