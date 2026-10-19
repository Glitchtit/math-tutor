// Module 4: Using derivatives: extrema, shape and L'Hôpital's rule.

export default {
  id: 'derivative-apps',
  number: 4,
  part: 'foundations',
  title: "Using derivatives: extrema, shape and L'Hôpital",
  summary: "Critical points, increasing and decreasing functions, the first and second derivative tests, concavity and inflection points, absolute extrema on closed intervals, optimisation and L'Hôpital's rule — with fzero, fminbnd and plots of f' and f'' in MATLAB.",
  intro: String.raw`<p>The sign of $f'$ tells where a function rises and falls; the sign of $f''$ tells which way it bends. Together they locate and classify maxima and minima — even for a function you only know through its derivative, which is exactly the situation in Homework 0, Problem 5, where $\mathrm{Si}(x)$ is defined by an integral but $\mathrm{Si}'(x) = \frac{\sin x}{x}$ is simple. The module ends with optimisation and with L'Hôpital's rule for $\frac00$ limits.</p>`,
  lessons: [
    {
      id: 'critical-points',
      title: 'Increasing, decreasing and critical points',
      blocks: [
        { type: 'text', html: String.raw`<p>The labels along the bottom show where $f$ increases and decreases; the dots are the points where the tangent is horizontal. Between two consecutive dots $f'$ keeps one sign, so $f$ is monotone there.</p>` },
        { type: 'widget', name: 'extrema', config: {
          title: 'f(x) = x³/3 − x² − 3x + 2',
          f: 'x.^3/3 - x.^2 - 3*x + 2', df: 'x.^2 - 2*x - 3', d2f: '2*x - 2', xlim: [-3, 5.5], ylim: [-9, 9],
        } },
        { type: 'callout', kind: 'def', title: 'Critical points and the first derivative test', html: String.raw`<p>On an interval where $f' > 0$, $f$ is increasing; where $f' < 0$, decreasing. A <b>critical point</b> is an interior point $c$ of the domain where $f'(c) = 0$ or $f'(c)$ does not exist. Local extrema of $f$ can only occur at critical points (or at endpoints of the domain).</p><p><b>First derivative test.</b> At a critical point $c$ where $f$ is continuous: if $f'$ changes from $+$ to $-$, $f$ has a <b>local maximum</b> at $c$; from $-$ to $+$, a <b>local minimum</b>; if $f'$ does not change sign, no extremum.</p>` },
        { type: 'steps', title: String.raw`Example: $f(x) = x^4 - 4x^3$`, steps: [
          String.raw`We differentiate and factor: $f'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$. The critical points are $x = 0$ and $x = 3$.`,
          String.raw`We find the sign of $f'$ on each interval. The factor $4x^2 \ge 0$ never changes sign, so the sign is that of $x - 3$: $$f'(x) \begin{cases} < 0, & x < 0, \\ < 0, & 0 < x < 3, \\ > 0, & x > 3. \end{cases}$$`,
          String.raw`At $x = 0$ the sign does not change: no extremum (a horizontal inflection). At $x = 3$ it changes from $-$ to $+$: a local minimum $f(3) = 81 - 108 = -27$, which is in fact the global minimum.`,
        ] },
        { type: 'quiz', question: String.raw`For $f(x) = x^3/3 - x^2 - 3x + 2$ (the widget), what happens at $x = -1$?`, choices: ['local maximum', 'local minimum', 'inflection point', 'nothing special'], answer: 0, explain: String.raw`$f'(x) = (x - 3)(x + 1)$ is positive for $x < -1$ and negative on $(-1, 3)$: it changes from $+$ to $-$, a local maximum $f(-1) = \frac{11}{3}$.` },
      ],
    },
    {
      id: 'concavity',
      title: 'Concavity and the second derivative test',
      blocks: [
        { type: 'text', html: String.raw`<p>Green arcs bend upwards ($f'' > 0$, slopes increasing), orange arcs bend downwards ($f'' < 0$). A peak always sits on an orange arc and a valley on a green one: that is the second derivative test. The hollow dots, where the colour changes, are inflection points.</p>` },
        { type: 'widget', name: 'extrema', config: {
          title: 'A damped oscillation f(x) = e^(−x/4) sin x',
          f: 'exp(-x/4).*sin(x)', df: 'exp(-x/4).*(cos(x) - sin(x)/4)', d2f: 'exp(-x/4).*(-15/16*sin(x) - cos(x)/2)',
          xlim: [0, 10], ylim: [-1, 1],
        } },
        { type: 'callout', kind: 'def', title: 'Concavity, inflection, second derivative test', html: String.raw`<ul><li>$f$ is <b>concave up</b> where $f'' > 0$ and <b>concave down</b> where $f'' < 0$. An <b>inflection point</b> is a point where the concavity changes.</li><li><b>Second derivative test.</b> If $f'(c) = 0$ and $f''(c) < 0$, then $f$ has a local <b>maximum</b> at $c$. If $f'(c) = 0$ and $f''(c) > 0$, a local <b>minimum</b>. If $f''(c) = 0$ the test is inconclusive — use the first derivative test.</li></ul>` },
        { type: 'steps', title: String.raw`Example: local maxima of $f(x) = e^{-x/4}\sin x$ for $x > 0$`, steps: [
          String.raw`We differentiate with the product rule: $f'(x) = e^{-x/4}\left(\cos x - \tfrac14\sin x\right)$. Since $e^{-x/4} > 0$, $f'(x) = 0$ exactly when $\cos x = \tfrac14 \sin x$, i.e. $\tan x = 4$: $$x_k = \arctan 4 + k\pi, \qquad k = 0, 1, 2, \dots$$`,
          String.raw`We differentiate again: $f''(x) = e^{-x/4}\left(-\tfrac{15}{16}\sin x - \tfrac12\cos x\right)$.`,
          String.raw`At a critical point we may use $\cos x_k = \tfrac14\sin x_k$ to simplify: $$f''(x_k) = e^{-x_k/4}\left(-\tfrac{15}{16} - \tfrac{2}{16}\right)\sin x_k = -\tfrac{17}{16}\,e^{-x_k/4}\sin x_k.$$`,
          String.raw`So $f''(x_k) < 0$ exactly when $\sin x_k > 0$, which holds for even $k$ ($x_k$ in the first quadrant plus a multiple of $2\pi$). The local maxima are at $x = \arctan 4 + 2n\pi$, $n = 0, 1, 2, \dots$; the odd $k$ give local minima.`,
        ] },
        { type: 'callout', kind: 'exam', title: 'The Homework 0 technique', html: String.raw`<p>You do not need a formula for $f$ itself — only $f'$. Solve $f'(x) = 0$, compute $f''$, and evaluate its sign at the zeros, simplifying with $f'(x_k) = 0$ as above. For $\mathrm{Si}(x) = \int_0^x \frac{\sin t}{t}\,\mathrm dt$ you are given $\mathrm{Si}'(x) = \frac{\sin x}{x}$, and the argument goes exactly the same way. Assignment 5 below practises it on a function with $g'(x) = \frac{\cos x}{x}$.</p>` },
        { type: 'quiz', question: String.raw`$f'(2) = 0$ and $f''(2) = -3$. What can you conclude?`, choices: ['local minimum at 2', 'local maximum at 2', 'inflection point at 2', 'nothing'], answer: 1, explain: String.raw`Horizontal tangent and concave down: the second derivative test gives a local maximum.` },
        { type: 'quiz', question: String.raw`Where does $f(x) = x^3 - 6x^2 + 5$ have an inflection point?`, choices: [String.raw`$x = 0$`, String.raw`$x = 2$`, String.raw`$x = 4$`, 'nowhere'], answer: 1, explain: String.raw`$f''(x) = 6x - 12$ changes sign at $x = 2$.` },
      ],
    },
    {
      id: 'absolute-extrema',
      title: 'Absolute extrema and optimisation',
      blocks: [
        { type: 'text', html: String.raw`<p>An open box is folded from a $30 \times 30$ cm sheet by cutting squares of side $x$ from the corners. Its volume is $V(x) = x(30 - 2x)^2$ for $0 \le x \le 15$. Drag $x$: too small a cut gives a flat box, too large a narrow one.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Volume of the box as a function of the cut x',
          functions: [{ expr: 'x.*(30 - 2*x).^2', label: String.raw`$V(x) = x(30 - 2x)^2$` }],
          params: { s: { min: 0, max: 15, value: 2, step: 0.05, label: 'cut $x$ (cm)' } },
          points: [{ x: 's', y: 's*(30 - 2*s)^2' }],
          xlim: [0, 15], ylim: [0, 2300],
          readout: String.raw`$V = {{s*(30 - 2*s)^2}}$ cm³.`,
        } },
        { type: 'callout', kind: 'thm', title: 'Closed interval method', html: String.raw`<p>A continuous function on a closed interval $[a, b]$ attains an absolute maximum and an absolute minimum (extreme value theorem). To find them, evaluate $f$ at</p><ol><li>the critical points in $(a, b)$, and</li><li>the endpoints $a$ and $b$,</li></ol><p>and compare: the largest value is the absolute maximum, the smallest the absolute minimum.</p>` },
        { type: 'steps', title: String.raw`Example: $f(x) = x^3 - 3x^2 + 1$ on $[-1, 4]$`, steps: [
          String.raw`We find the critical points: $f'(x) = 3x^2 - 6x = 3x(x - 2) = 0$ gives $x = 0$ and $x = 2$, both inside $(-1, 4)$.`,
          String.raw`We evaluate at the critical points and endpoints: $f(-1) = -3$, $f(0) = 1$, $f(2) = -3$, $f(4) = 17$.`,
          String.raw`The absolute maximum is $17$ (at $x = 4$, an endpoint), and the absolute minimum is $-3$, attained twice, at $x = -1$ and $x = 2$.`,
        ] },
        { type: 'steps', title: 'Example: the largest box', steps: [
          String.raw`We maximise $V(x) = x(30 - 2x)^2$ on $[0, 15]$. The product rule gives $$V'(x) = (30 - 2x)^2 + x\cdot 2(30 - 2x)(-2) = (30 - 2x)(30 - 6x).$$`,
          String.raw`The critical point inside $(0, 15)$ is $x = 5$ ($x = 15$ is an endpoint).`,
          String.raw`We compare with the endpoints: $V(0) = V(15) = 0$ and $V(5) = 5 \cdot 20^2 = 2000$. The largest box has volume $2000\ \text{cm}^3$, obtained with $5$ cm cuts.`,
        ] },
        { type: 'quiz', question: String.raw`Where is the absolute minimum of $f(x) = x^2$ on $[1, 3]$?`, choices: [String.raw`$x = 0$`, String.raw`$x = 1$`, String.raw`$x = 3$`, 'There is none'], answer: 1, explain: String.raw`The only critical point $x = 0$ lies outside the interval. Comparing endpoints, $f(1) = 1 < f(3) = 9$.` },
      ],
    },
    {
      id: 'lhopital',
      title: "L'Hôpital's rule",
      blocks: [
        { type: 'text', html: String.raw`<p>Near $x = 0$ both $e^{2x} - 1$ and $\sin x$ vanish, and each looks like its tangent line: $2x$ and $x$. So their quotient behaves like $\frac{2x}{x} = 2$ — the quotient of the <i>slopes</i>.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Two functions vanishing at 0 and their tangent lines',
          functions: [{ expr: 'exp(2*x) - 1', label: String.raw`$e^{2x} - 1$` }, { expr: 'sin(x)', label: String.raw`$\sin x$` }, { expr: '2*x', label: '$2x$', dash: true }, { expr: 'x', label: '$x$', dash: true }],
          xlim: [-0.6, 0.6], ylim: [-0.8, 1.4],
          caption: String.raw`$\displaystyle\lim_{x\to0}\frac{e^{2x} - 1}{\sin x} = \frac{2}{1} = 2$.`,
        } },
        { type: 'callout', kind: 'thm', title: "L'Hôpital's rule", html: String.raw`<p>If $\lim f(x) = \lim g(x) = 0$, or both are $\pm\infty$, and $\displaystyle\lim \frac{f'(x)}{g'(x)}$ exists (or is $\pm\infty$), then $$\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}.$$ It holds for $x \to a$, $x \to a^\pm$ and $x \to \pm\infty$. Differentiate numerator and denominator <b>separately</b> — this is not the quotient rule.</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\lim_{x \to 0}\frac{x - \sin x}{x^3}$`, steps: [
          String.raw`At $x = 0$ the form is $\frac00$, so we apply the rule: $\displaystyle\lim_{x\to0}\frac{1 - \cos x}{3x^2}$, still $\frac00$.`,
          String.raw`Again: $\displaystyle\lim_{x\to0}\frac{\sin x}{6x} = \frac16$ (using $\frac{\sin x}{x} \to 1$, or the rule a third time: $\frac{\cos x}{6} \to \frac16$).`,
        ] },
        { type: 'steps', title: String.raw`Example: other indeterminate forms`, steps: [
          String.raw`$\infty/\infty$: $\displaystyle\lim_{x\to\infty} \frac{x^2}{e^x} = \lim_{x\to\infty}\frac{2x}{e^x} = \lim_{x\to\infty}\frac{2}{e^x} = 0$. Exponentials beat powers.`,
          String.raw`$0\cdot\infty$: rewrite as a quotient first. $\displaystyle\lim_{x\to0^+} x\ln x = \lim_{x\to0^+}\frac{\ln x}{1/x} = \lim_{x\to0^+}\frac{1/x}{-1/x^2} = \lim_{x\to0^+}(-x) = 0$.`,
          String.raw`$0^0$: take the logarithm. $x^x = e^{x\ln x} \to e^0 = 1$ as $x \to 0^+$, by the previous line and the continuity of $e^u$.`,
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>Check the form before each application. $\displaystyle\lim_{x\to0}\frac{x + 1}{x + 2} = \frac12$ by substitution; applying the rule anyway would give the wrong answer $\frac11 = 1$.</p>` },
        { type: 'quiz', question: String.raw`What is $\displaystyle\lim_{x \to \infty}\frac{\ln x}{x}$?`, choices: [String.raw`$0$`, String.raw`$1$`, String.raw`$\infty$`, 'does not exist'], answer: 0, explain: String.raw`$\frac{\infty}{\infty}$; the rule gives $\lim \frac{1/x}{1} = 0$. Logarithms grow slower than any power.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'critical-points-matlab',
      title: "Cases, inequalities and finding critical points numerically",
      blocks: [
        { type: 'text', html: String.raw`<p>Sign tables and piecewise functions are written with the <code>cases</code> environment: <code>&amp;</code> separates the formula from the condition and <code>\\</code> starts a new line. Inequalities use <code>&lt;</code>, <code>&gt;</code>, <code>\le</code>, <code>\ge</code>; <code>\text{...}</code> puts words inside an equation.</p>` },
        { type: 'table', head: ['Type', 'Result'], rows: [
          [String.raw`<code>|x| = \begin{cases} -x &amp; x &lt; 0 \\ x &amp; x \ge 0 \end{cases}</code>`, String.raw`$|x| = \begin{cases} -x & x < 0 \\ x & x \ge 0 \end{cases}$`],
          [String.raw`<code>f'(x) &gt; 0 \quad \text{for } -1 &lt; x &lt; 3</code>`, String.raw`$f'(x) > 0 \quad \text{for } -1 < x < 3$`],
          [String.raw`<code>0 \le x \le 15</code>`, String.raw`$0 \le x \le 15$`],
        ] },
        { type: 'latex', prompt: 'Type this piecewise function:', target: String.raw`f(x) = \begin{cases} x^2 & x < 1 \\ 2x - 1 & x \ge 1 \end{cases}` },
        { type: 'latex', prompt: 'Type this sign statement:', target: String.raw`f'(x) < 0 \quad \text{for } 0 < x < 3` },
        { type: 'latex', prompt: 'Type the conclusion of a second derivative test:', target: String.raw`f'(c) = 0 \quad \text{and} \quad f''(c) < 0` },
        { type: 'text', html: String.raw`<p>When $f'(x) = 0$ cannot be solved by hand, MATLAB finds the zeros numerically. Plot $f'$ first to see roughly where it crosses zero, then call <code>fzero(df, x0)</code> with a starting guess (or a bracket <code>[a b]</code> with a sign change). Plot $f''$ to read its sign at the zeros. You still differentiate <b>by hand</b>.</p>` },
        { type: 'code', caption: "Critical points of f(x) = exp(-x/4) sin x on [0, 10]: plot f' and f'', then refine with fzero.", editable: true, code: `df  = @(x) exp(-x/4) .* (cos(x) - sin(x)/4);
d2f = @(x) exp(-x/4) .* (-15/16*sin(x) - cos(x)/2);
fplot(df, [0 10])
hold on
fplot(d2f, [0 10], '--')
yline(0)
hold off
grid on
legend("f'", "f''")
x1 = fzero(df, 1)         % first zero of f'
x2 = fzero(df, 4.5)       % second zero of f'
[d2f(x1), d2f(x2)]        % negative: max, positive: min
atan(4)                   % the exact x1` },
        { type: 'text', html: String.raw`<p><code>fminbnd(f, a, b)</code> returns the point in $[a, b]$ where $f$ is smallest. For a maximum, minimise $-f$: <code>[xm, v] = fminbnd(@(x) -f(x), a, b)</code> gives the location <code>xm</code> and $-f(x_m)$ in <code>v</code>.</p>` },
        { type: 'code', caption: 'The largest box of the lesson, found numerically.', code: `V = @(x) x .* (30 - 2*x).^2;
[xm, negV] = fminbnd(@(x) -V(x), 0, 15);
fprintf('cut x = %.4f cm, volume = %.2f cm^3\\n', xm, -negV)` },
        { type: 'matlab', prompt: String.raw`Let $f(x) = x^2 - 4\sin x$. By hand, $f'(x) = 2x - 4\cos x$. Plot $f'$ on $[-3, 3]$, find its zero with <code>fzero</code> and store it in <code>c</code>. Then store $f''(c) = 2 + 4\sin c$ in <code>d2</code>. Is $c$ a minimum or a maximum?`, starter: `df = @(x) 2*x - 4*cos(x);\nfplot(df, [-3 3])\ngrid on\nc = 0;     % use fzero\nd2 = 0;    % f''(c)`, solution: `df = @(x) 2*x - 4*cos(x);\nfplot(df, [-3 3])\ngrid on\nc = fzero(df, 1)\nd2 = 2 + 4*sin(c)`, checks: [{ var: 'c', value: 1.029866529322259, tol: 1e-6 }, { var: 'd2', value: '2 + 4*sin(1.029866529322259)', tol: 1e-6 }, { uses: 'fzero' }], success: "f''(c) > 0, so c is a local minimum (in fact the global one)." },
        { type: 'matlab', prompt: String.raw`Find the maximum of $g(x) = x^2 e^{-x}$ on $[0, 5]$ with <code>fminbnd</code>. Store the location in <code>xmax</code> and the maximum value in <code>gmax</code>.`, starter: `g = @(x) x.^2 .* exp(-x);\nxmax = 0;   % use fminbnd on -g\ngmax = 0;`, solution: `g = @(x) x.^2 .* exp(-x);\nxmax = fminbnd(@(x) -g(x), 0, 5)\ngmax = g(xmax)`, checks: [{ var: 'xmax', value: 2, tol: 1e-4 }, { var: 'gmax', value: '4*exp(-2)', tol: 1e-6 }, { uses: 'fminbnd' }], hint: String.raw`By hand: $g'(x) = x e^{-x}(2 - x)$, so you should get $x = 2$ and $g(2) = 4e^{-2}$.` },
      ],
    },
    {
      id: 'extremum-writeup',
      title: 'Writing a local-extremum argument',
      blocks: [
        { type: 'text', html: String.raw`<p>A complete answer locates the critical points by hand, classifies them with a stated test, and uses MATLAB only to confirm. Read this model answer for the damped oscillation of the lesson; you will write the same argument for $\mathrm{Si}(x)$ in Homework 0.</p>` },
        { type: 'livescript', caption: 'Model answer: local maxima from f′ and f″', blocks: [
          { type: 'heading', content: 'Problem 5 (Attempted)' },
          { type: 'text', content: 'We find the local maxima of $f(x) = e^{-x/4}\\sin x$ for $x > 0$. We differentiate with the product rule:' },
          { type: 'equation', content: String.raw`f'(x) = e^{-x/4}\left(\cos x - \frac{1}{4}\sin x\right).` },
          { type: 'text', content: 'Since $e^{-x/4} > 0$, the critical points satisfy $\\tan x = 4$, that is' },
          { type: 'equation', content: String.raw`x_k = \arctan 4 + k\pi, \quad k = 0, 1, 2, \ldots` },
          { type: 'text', content: 'We differentiate once more and use $\\cos x_k = \\frac{1}{4}\\sin x_k$ to simplify the value at the critical points:' },
          { type: 'equation', content: String.raw`f''(x) = e^{-x/4}\left(-\frac{15}{16}\sin x - \frac{1}{2}\cos x\right), \qquad f''(x_k) = -\frac{17}{16}e^{-x_k/4}\sin x_k .` },
          { type: 'text', content: 'The sign of $\\sin x_k$ alternates with $k$, so by the second derivative test' },
          { type: 'equation', content: String.raw`x_k \text{ is a } \begin{cases} \text{local maximum} & k \text{ even}, \\ \text{local minimum} & k \text{ odd}. \end{cases}` },
          { type: 'text', content: 'Hence the local maxima are at $x = \\arctan 4 + 2n\\pi$, $n = 0, 1, 2, \\ldots$ We check the first two critical points numerically:' },
          { type: 'code', content: "df  = @(x) exp(-x/4) .* (cos(x) - sin(x)/4);\nd2f = @(x) exp(-x/4) .* (-15/16*sin(x) - cos(x)/2);\nxk = fzero(df, 1) + [0 pi]\nd2f(xk)" },
        ] },
        { type: 'callout', kind: 'exam', html: String.raw`<p>State which test you use and why it applies ("$f'(x_k) = 0$ and $f''(x_k) < 0$, so by the second derivative test …"). A plot alone is not a proof, but it is a valuable check.</p>` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Monotonicity, extrema and inflection',
      difficulty: 'core',
      statement: String.raw`<p>Let $f(x) = x^3 - 6x^2 + 9x + 1$.</p>`,
      parts: [
        { label: '(a)', prompt: 'At which $x$ does $f$ have a local maximum?', kind: 'numeric', answer: '1', solution: String.raw`$f'(x) = 3x^2 - 12x + 9 = 3(x - 1)(x - 3)$. The sign changes from $+$ to $-$ at $x = 1$.` },
        { label: '(b)', prompt: 'What is the local maximum value?', kind: 'numeric', answer: '5', solution: String.raw`$f(1) = 1 - 6 + 9 + 1 = 5$.` },
        { label: '(c)', prompt: 'What is the local minimum value?', kind: 'numeric', answer: '1', solution: String.raw`At $x = 3$ the sign of $f'$ changes from $-$ to $+$: $f(3) = 27 - 54 + 27 + 1 = 1$.` },
        { label: '(d)', prompt: 'At which $x$ is the inflection point?', kind: 'numeric', answer: '2', solution: String.raw`$f''(x) = 6x - 12$ changes sign at $x = 2$.` },
        { label: '(e)', prompt: String.raw`On which interval is $f$ decreasing?`, kind: 'choice', choices: [String.raw`$(-\infty, 1)$`, String.raw`$(1, 3)$`, String.raw`$(3, \infty)$`, String.raw`$(2, \infty)$`], answer: 1, solution: String.raw`$f'(x) = 3(x-1)(x-3) < 0$ between the zeros.` },
      ],
    },
    {
      id: 'a2',
      title: 'Absolute extrema on a closed interval',
      difficulty: 'core',
      statement: String.raw`<p>Let $f(x) = 2x^3 - 3x^2 - 12x + 1$ on $[-2, 3]$.</p>`,
      parts: [
        { label: '(a)', prompt: 'What is the absolute maximum value?', kind: 'numeric', answer: '8', solution: String.raw`$f'(x) = 6x^2 - 6x - 12 = 6(x - 2)(x + 1)$, critical points $-1$ and $2$. Values: $f(-2) = -3$, $f(-1) = 8$, $f(2) = -19$, $f(3) = -8$. The maximum is $8$.` },
        { label: '(b)', prompt: 'What is the absolute minimum value?', kind: 'numeric', answer: '-19', solution: String.raw`The smallest of the four values is $f(2) = -19$.` },
        { label: '(c)', prompt: 'Where is the absolute minimum attained?', kind: 'numeric', answer: '2', solution: String.raw`At $x = 2$.` },
      ],
    },
    {
      id: 'a3',
      title: 'Optimisation: the cheapest can',
      difficulty: 'core',
      statement: String.raw`<p>A closed cylindrical can must hold $V = 1000\ \text{cm}^3$. Its surface area is $A = 2\pi r^2 + 2\pi r h$. Using $h = \frac{V}{\pi r^2}$, $$A(r) = 2\pi r^2 + \frac{2000}{r}, \qquad r > 0.$$</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Find the radius $r$ (cm) that minimises $A$. Enter an exact expression or at least 4 decimals.`, kind: 'numeric', answer: '(500/pi)^(1/3)', tol: 1e-5, solution: String.raw`$A'(r) = 4\pi r - \dfrac{2000}{r^2} = 0$ gives $r^3 = \dfrac{500}{\pi}$, so $r = \left(\dfrac{500}{\pi}\right)^{1/3} \approx 5.419$ cm. Since $A''(r) = 4\pi + \frac{4000}{r^3} > 0$, it is a minimum, and the only critical point on $(0, \infty)$, so the absolute minimum.` },
        { label: '(b)', prompt: String.raw`What is the ratio $h / r$ of the optimal can?`, kind: 'numeric', answer: '2', solution: String.raw`$h = \dfrac{1000}{\pi r^2} = \dfrac{2\cdot 500}{\pi r^3}\, r = 2r$: the height equals the diameter.` },
        { label: '(c)', prompt: String.raw`What is the minimal surface area (cm²)?`, kind: 'numeric', answer: '6*pi*(500/pi)^(2/3)', tol: 1e-5, solution: String.raw`With $h = 2r$: $A = 2\pi r^2 + 4\pi r^2 = 6\pi r^2 = 6\pi\left(\frac{500}{\pi}\right)^{2/3} \approx 553.58$ cm².` },
      ],
    },
    {
      id: 'a4',
      title: "L'Hôpital's rule",
      difficulty: 'core',
      statement: String.raw`<p>Evaluate the limits.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{x \to 0}\frac{e^{2x} - 1 - 2x}{x^2}$`, kind: 'numeric', answer: '2', solution: String.raw`$\frac00$ twice: $\lim \frac{2e^{2x} - 2}{2x} = \lim\frac{4e^{2x}}{2} = 2$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\lim_{x \to 0}\frac{\tan x - x}{x^3}$`, kind: 'numeric', answer: '1/3', solution: String.raw`$\lim\frac{1/\cos^2 x - 1}{3x^2} = \lim\frac{\tan^2 x}{3x^2} = \frac13\left(\lim\frac{\sin x}{x}\cdot\frac{1}{\cos x}\right)^2 = \frac13$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\lim_{x \to \infty}\frac{\ln x}{\sqrt{x}}$`, kind: 'numeric', answer: '0', solution: String.raw`$\frac\infty\infty$: $\lim\frac{1/x}{1/(2\sqrt x)} = \lim\frac{2}{\sqrt x} = 0$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\lim_{x \to 0^+} x^{x}$`, kind: 'numeric', answer: '1', solution: String.raw`$x^x = e^{x\ln x}$ and $x\ln x = \frac{\ln x}{1/x} \to 0$ by L'Hôpital, so $x^x \to e^0 = 1$.` },
      ],
    },
    {
      id: 'a5',
      title: 'A function known only through its derivative',
      difficulty: 'exam',
      hw: 'HW0-style',
      statement: String.raw`<p>A function $g$ is differentiable on $(0, \infty)$ with $$g'(x) = \frac{\cos x}{x}.$$ No formula for $g$ itself is needed (one exists: $g$ is the cosine integral plus a constant).</p>`,
      parts: [
        { label: '(a)', prompt: 'What is the smallest positive critical point of $g$?', kind: 'numeric', answer: 'pi/2', solution: String.raw`$g'(x) = 0 \iff \cos x = 0 \iff x = \frac\pi2 + k\pi$. The smallest is $\frac\pi2$.` },
        { label: '(b)', prompt: String.raw`Compute $g''\left(\frac{\pi}{2}\right)$.`, kind: 'numeric', answer: '-2/pi', solution: String.raw`$g''(x) = \dfrac{-x\sin x - \cos x}{x^2}$. At $x = \frac\pi2$: $\dfrac{-\frac\pi2}{\pi^2/4} = -\dfrac2\pi$.` },
        { label: '(c)', prompt: String.raw`So at $x = \frac\pi2$, $g$ has …`, kind: 'choice', choices: ['a local maximum', 'a local minimum', 'an inflection point', 'no conclusion possible'], answer: 0, solution: String.raw`$g'(\frac\pi2) = 0$ and $g''(\frac\pi2) < 0$: a local maximum by the second derivative test.` },
        { label: '(d)', prompt: 'Where is the second positive local maximum of $g$?', kind: 'numeric', answer: '5*pi/2', solution: String.raw`At a critical point $\cos x_k = 0$, so $g''(x_k) = -\frac{\sin x_k}{x_k}$, negative where $\sin x_k = 1$: $x = \frac\pi2 + 2n\pi$. The second one is $\frac{5\pi}{2}$.` },
        { label: '(e)', prompt: 'Write the full argument as a Live Script: all local maxima of $g$ on $(0, \\infty)$, with a numerical check.', kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: 'We locate the critical points of $g$ by solving $g\'(x) = 0$. Since $x > 0$, this happens exactly when $\\cos x = 0$:' },
        { type: 'equation', content: String.raw`x_k = \frac{\pi}{2} + k\pi, \quad k = 0, 1, 2, \ldots` },
        { type: 'text', content: 'We differentiate $g\'$ with the quotient rule:' },
        { type: 'equation', content: String.raw`g''(x) = \frac{-x\sin x - \cos x}{x^2}.` },
        { type: 'text', content: 'At a critical point $\\cos x_k = 0$, so the second derivative simplifies to' },
        { type: 'equation', content: String.raw`g''(x_k) = -\frac{\sin x_k}{x_k} = \begin{cases} -\frac{1}{x_k} < 0 & k \text{ even}, \\ \frac{1}{x_k} > 0 & k \text{ odd}. \end{cases}` },
        { type: 'text', content: 'By the second derivative test, $g$ has local maxima at $x = \\frac{\\pi}{2} + 2n\\pi$, $n = 0, 1, 2, \\ldots$, and local minima at $x = \\frac{3\\pi}{2} + 2n\\pi$. We check the signs numerically:' },
        { type: 'code', content: "d2g = @(x) (-x.*sin(x) - cos(x)) ./ x.^2;\nxk = pi/2 + (0:3)*pi\nd2g(xk)" },
      ],
    },
  ],
};
