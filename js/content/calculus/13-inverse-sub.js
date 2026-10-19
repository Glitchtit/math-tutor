// Module 13: Inverse substitutions and partial fractions

export default {
  id: 'inverse-sub',
  number: 13,
  part: 'techniques',
  hw: 'HW2',
  title: 'Inverse substitutions and partial fractions',
  summary: 'Trigonometric substitutions x = a sinθ, a tanθ, a secθ, completing the square, rationalizing substitutions u = √x and u = x^(1/n), and partial fractions with distinct linear, repeated linear and irreducible quadratic factors — with coefficients solved by A\\b in MATLAB.',
  intro: String.raw`<p>In ordinary substitution the new variable is a function of $x$. In an <b>inverse substitution</b> we write $x$ as a function of a new variable — $x = a\sin\theta$, $x = u^2$ — chosen so that an awkward root disappears. Rational functions, finally, are split into <b>partial fractions</b>, each of which integrates to a logarithm, a power or an arctangent. The algebra (finding coefficients) is a linear system, which MATLAB solves with <code>A\b</code>.</p>`,
  lessons: [
    {
      id: 'trig-substitution',
      title: 'Trigonometric substitutions',
      blocks: [
        { type: 'text', html: String.raw`<p>The roots $\sqrt{a^2 - x^2}$, $\sqrt{a^2 + x^2}$, $\sqrt{x^2 - a^2}$ are sides of right triangles. Setting $x = a\sin\theta$ turns $\sqrt{a^2 - x^2}$ into $a\cos\theta$ — the root is gone. Drag $\theta$ and read the sides of the triangle.</p>` },
        { type: 'widget', name: 'trigsub', config: { title: 'x = a sin θ with a = 2', a: 2, kind: 'sin' } },
        { type: 'table', head: ['Expression', 'Substitution', 'Identity used', 'Root becomes'], rows: [
          [String.raw`$\sqrt{a^2 - x^2}$`, String.raw`$x = a\sin\theta$, $-\frac{\pi}{2} \le \theta \le \frac{\pi}{2}$`, String.raw`$1 - \sin^2\theta = \cos^2\theta$`, String.raw`$a\cos\theta$`],
          [String.raw`$\sqrt{a^2 + x^2}$`, String.raw`$x = a\tan\theta$, $-\frac{\pi}{2} < \theta < \frac{\pi}{2}$`, String.raw`$1 + \tan^2\theta = \sec^2\theta$`, String.raw`$a\sec\theta$`],
          [String.raw`$\sqrt{x^2 - a^2}$`, String.raw`$x = a\sec\theta$, $0 \le \theta < \frac{\pi}{2}$`, String.raw`$\sec^2\theta - 1 = \tan^2\theta$`, String.raw`$a\tan\theta$`],
        ] },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int_0^2 \sqrt{4 - x^2}\,\mathrm d x$`, steps: [
          String.raw`We substitute $x = 2\sin\theta$, so $\mathrm d x = 2\cos\theta\,\mathrm d\theta$ and $\sqrt{4 - x^2} = 2\cos\theta$ (as $\cos\theta \ge 0$). The limits $x = 0$ and $x = 2$ become $\theta = 0$ and $\theta = \frac{\pi}{2}$.`,
          String.raw`The integral becomes $\displaystyle\int_0^{\pi/2} 4\cos^2\theta\,\mathrm d\theta = \int_0^{\pi/2} 2\big(1 + \cos 2\theta\big)\,\mathrm d\theta$.`,
          String.raw`We integrate: $\Big[2\theta + \sin 2\theta\Big]_0^{\pi/2} = \pi$ — the area of a quarter disk of radius 2, as the picture of $y = \sqrt{4 - x^2}$ predicts.`,
        ] },
        { type: 'text', html: String.raw`<p>For an <b>indefinite</b> integral we must return to $x$. Draw the triangle of the substitution and read off every trigonometric ratio. For $x = 3\tan\theta$: opposite side $x$, adjacent side $3$, hypotenuse $\sqrt{x^2 + 9}$.</p>` },
        { type: 'widget', name: 'trigsub', config: { title: 'x = a tan θ with a = 3', a: 3, kind: 'tan' } },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int \frac{\mathrm d x}{x^2\sqrt{x^2 + 9}}$`, steps: [
          String.raw`We substitute $x = 3\tan\theta$: $\mathrm d x = 3\sec^2\theta\,\mathrm d\theta$ and $\sqrt{x^2 + 9} = 3\sec\theta$.`,
          String.raw`The integral becomes $\displaystyle\int \frac{3\sec^2\theta}{9\tan^2\theta\cdot 3\sec\theta}\,\mathrm d\theta = \frac19\int \frac{\sec\theta}{\tan^2\theta}\,\mathrm d\theta = \frac19\int \frac{\cos\theta}{\sin^2\theta}\,\mathrm d\theta$.`,
          String.raw`With $w = \sin\theta$ this is $\frac19\int w^{-2}\,\mathrm d w = -\dfrac{1}{9\sin\theta} + C$.`,
          String.raw`From the triangle, $\sin\theta = \dfrac{x}{\sqrt{x^2 + 9}}$. Hence $\displaystyle\int \frac{\mathrm d x}{x^2\sqrt{x^2 + 9}} = -\frac{\sqrt{x^2 + 9}}{9x} + C$.`,
        ] },
        { type: 'quiz', question: String.raw`Which substitution suits $\displaystyle\int \frac{\sqrt{x^2 - 16}}{x}\,\mathrm d x$?`, choices: [String.raw`$x = 4\sin\theta$`, String.raw`$x = 4\tan\theta$`, String.raw`$x = 4\sec\theta$`, String.raw`$x = 16\sec\theta$`], answer: 2, explain: String.raw`$x^2 - a^2$ with $a = 4$: $x = 4\sec\theta$ gives $\sqrt{x^2 - 16} = 4\tan\theta$.` },
      ],
    },
    {
      id: 'square-rationalizing',
      title: 'Completing the square and rationalizing substitutions',
      blocks: [
        { type: 'text', html: String.raw`<p>A general quadratic is reduced to one of the standard forms by <b>completing the square</b>: $x^2 + bx + c = \left(x + \frac b2\right)^2 + \left(c - \frac{b^2}{4}\right)$. Then a shift $u = x + \frac b2$ leaves $u^2 \pm k^2$ or $k^2 - u^2$.</p>` },
        { type: 'steps', title: String.raw`Examples with completed squares`, steps: [
          String.raw`$x^2 + 4x + 13 = (x + 2)^2 + 9$, so with $u = x + 2$: $\displaystyle\int \frac{\mathrm d x}{x^2 + 4x + 13} = \int \frac{\mathrm d u}{u^2 + 9} = \frac13\arctan\frac{x + 2}{3} + C$.`,
          String.raw`$3 + 2x - x^2 = 4 - (x - 1)^2$, so with $u = x - 1$: $\displaystyle\int \frac{\mathrm d x}{\sqrt{3 + 2x - x^2}} = \int \frac{\mathrm d u}{\sqrt{4 - u^2}} = \arcsin\frac{x - 1}{2} + C$.`,
        ] },
        { type: 'callout', kind: 'key', title: 'Two standard integrals', html: String.raw`$$\int \frac{\mathrm d u}{u^2 + a^2} = \frac1a\arctan\frac ua + C, \qquad \int \frac{\mathrm d u}{\sqrt{a^2 - u^2}} = \arcsin\frac ua + C.$$` },
        { type: 'text', html: String.raw`<p>A <b>rationalizing substitution</b> removes a root of $x$ itself: $u = \sqrt x$, i.e. $x = u^2$, $\mathrm d x = 2u\,\mathrm d u$. If several roots appear, $\sqrt x$ and $\sqrt[3]{x}$, use $u = x^{1/n}$ with $n$ the least common multiple of the root orders (here $n = 6$), so that every root becomes a power of $u$. The widget shows $\int_0^4 \frac{\mathrm d x}{1 + \sqrt x}$ and the transformed integral $\int_0^2 \frac{2u}{1 + u}\,\mathrm d u$: different graphs, equal areas.</p>` },
        { type: 'widget', name: 'substitution', config: {
          title: 'Rationalizing: u = √x',
          f: '1./(1+sqrt(x))', u: 'sqrt(x)', fu: '2*u./(1+u)', a: 0, b: 4, uTex: String.raw`\sqrt{x}`,
          fLabel: '1/(1+√x)', fuLabel: '2u/(1+u)', xlim: [-0.3, 4.3], ulim: [-0.2, 2.2], ylim: [-0.1, 1.5],
        } },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int_0^4 \frac{\mathrm d x}{1 + \sqrt x}$`, steps: [
          String.raw`We substitute $u = \sqrt x$, i.e. $x = u^2$ and $\mathrm d x = 2u\,\mathrm d u$; the limits become $u = 0$ and $u = 2$.`,
          String.raw`The integrand is now rational: $\displaystyle\int_0^2 \frac{2u}{1 + u}\,\mathrm d u = \int_0^2 \left(2 - \frac{2}{1 + u}\right)\mathrm d u$.`,
          String.raw`We integrate: $\Big[2u - 2\ln(1 + u)\Big]_0^2 = 4 - 2\ln 3 \approx 1.8028$.`,
        ] },
        { type: 'quiz', question: String.raw`Which substitution turns $\displaystyle\int \frac{\mathrm d x}{\sqrt x + \sqrt[3]{x}}$ into an integral of a rational function?`, choices: [String.raw`$u = \sqrt x$`, String.raw`$u = \sqrt[3]{x}$`, String.raw`$u = x^{1/6}$`, String.raw`$u = x^{5/6}$`], answer: 2, explain: String.raw`With $x = u^6$: $\sqrt x = u^3$, $\sqrt[3]x = u^2$, $\mathrm d x = 6u^5\,\mathrm d u$, giving $\int \frac{6u^5}{u^3 + u^2}\,\mathrm d u = \int\frac{6u^3}{u + 1}\,\mathrm d u$.` },
      ],
    },
    {
      id: 'partial-fractions',
      title: 'Partial fractions: distinct linear factors',
      blocks: [
        { type: 'text', html: String.raw`<p>A rational function whose denominator factors into distinct linear factors is a sum of simple fractions, one per factor. Toggle the terms: the dashed curves add up to the original function exactly.</p>` },
        { type: 'widget', name: 'partialFractions', config: {
          title: '(x + 5)/((x − 1)(x + 2)) = 2/(x − 1) − 1/(x + 2)',
          f: '(x+5)./((x-1).*(x+2))',
          terms: [{ expr: '2./(x-1)', label: '$\\frac{2}{x-1}$' }, { expr: '-1./(x+2)', label: '$-\\frac{1}{x+2}$' }],
          asymptotes: [1, -2], xlim: [-5, 5], ylim: [-6, 6],
        } },
        { type: 'callout', kind: 'def', title: 'Procedure', html: String.raw`<ol><li>If $\deg P \ge \deg Q$, first do <b>polynomial long division</b>: $\frac{P}{Q} = S + \frac{R}{Q}$ with $\deg R < \deg Q$.</li><li>Factor $Q$ completely into linear factors and irreducible quadratics.</li><li>Write one term per factor: $\dfrac{A}{x - r}$ for each simple linear factor.</li><li>Find the constants: multiply by $Q$ and either insert the roots ("cover-up") or equate coefficients.</li></ol>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int \frac{x + 5}{x^2 + x - 2}\,\mathrm d x$`, steps: [
          String.raw`We factor the denominator: $x^2 + x - 2 = (x - 1)(x + 2)$, and write $\dfrac{x + 5}{(x - 1)(x + 2)} = \dfrac{A}{x - 1} + \dfrac{B}{x + 2}$.`,
          String.raw`Multiplying by the denominator: $x + 5 = A(x + 2) + B(x - 1)$. We insert $x = 1$: $6 = 3A$, so $A = 2$. We insert $x = -2$: $3 = -3B$, so $B = -1$.`,
          String.raw`We integrate term by term: $\displaystyle\int \frac{x + 5}{x^2 + x - 2}\,\mathrm d x = 2\ln|x - 1| - \ln|x + 2| + C$.`,
        ] },
        { type: 'steps', title: String.raw`Example with long division: $\displaystyle\int \frac{x^3 + x}{x^2 - 1}\,\mathrm d x$`, steps: [
          String.raw`The numerator has the higher degree, so we divide: $x^3 + x = x(x^2 - 1) + 2x$, hence $\dfrac{x^3 + x}{x^2 - 1} = x + \dfrac{2x}{x^2 - 1}$.`,
          String.raw`We split the proper part: $\dfrac{2x}{(x - 1)(x + 1)} = \dfrac{1}{x - 1} + \dfrac{1}{x + 1}$ (cover-up at $x = \pm 1$).`,
          String.raw`Integrating: $\dfrac{x^2}{2} + \ln|x - 1| + \ln|x + 1| + C = \dfrac{x^2}{2} + \ln|x^2 - 1| + C$.`,
        ] },
        { type: 'quiz', question: String.raw`What must you do first with $\dfrac{x^2 + 1}{x^2 - 4}$?`, choices: ['Write it as $\\frac{A}{x-2} + \\frac{B}{x+2}$ directly.', 'Long division, because the degrees are equal.', 'Complete the square in the denominator.', 'Substitute $u = x^2 - 4$.'], answer: 1, explain: String.raw`$\deg P = \deg Q = 2$, so divide first: $\frac{x^2 + 1}{x^2 - 4} = 1 + \frac{5}{x^2 - 4}$. Only the proper fraction is split.` },
      ],
    },
    {
      id: 'repeated-quadratic',
      title: 'Repeated and irreducible quadratic factors',
      blocks: [
        { type: 'text', html: String.raw`<p>An irreducible quadratic $x^2 + px + q$ ($p^2 < 4q$) needs a numerator $Bx + C$; it integrates to a logarithm plus an arctangent. Here $\frac{3x^2 - 2x + 3}{(x - 1)(x^2 + 1)} = \frac{2}{x - 1} + \frac{x - 1}{x^2 + 1}$.</p>` },
        { type: 'widget', name: 'partialFractions', config: {
          title: 'A linear and an irreducible quadratic factor',
          f: '(3*x.^2-2*x+3)./((x-1).*(x.^2+1))',
          terms: [{ expr: '2./(x-1)', label: '$\\frac{2}{x-1}$' }, { expr: '(x-1)./(x.^2+1)', label: '$\\frac{x-1}{x^2+1}$' }],
          asymptotes: [1], xlim: [-4, 4], ylim: [-6, 6],
        } },
        { type: 'table', head: ['Factor of $Q$', 'Terms in the decomposition', 'Integrates to'], rows: [
          [String.raw`$(x - r)$`, String.raw`$\dfrac{A}{x - r}$`, String.raw`$A\ln|x - r|$`],
          [String.raw`$(x - r)^m$`, String.raw`$\dfrac{A_1}{x - r} + \dfrac{A_2}{(x - r)^2} + \dots + \dfrac{A_m}{(x - r)^m}$`, String.raw`$\ln$ and negative powers`],
          [String.raw`$x^2 + a^2$`, String.raw`$\dfrac{Bx + C}{x^2 + a^2}$`, String.raw`$\frac B2\ln(x^2 + a^2) + \frac Ca\arctan\frac xa$`],
        ] },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int \frac{3x^2 - 2x + 3}{(x - 1)(x^2 + 1)}\,\mathrm d x$`, steps: [
          String.raw`We write $\dfrac{3x^2 - 2x + 3}{(x - 1)(x^2 + 1)} = \dfrac{A}{x - 1} + \dfrac{Bx + C}{x^2 + 1}$, i.e. $3x^2 - 2x + 3 = A(x^2 + 1) + (Bx + C)(x - 1)$.`,
          String.raw`The cover-up value $x = 1$ gives $4 = 2A$, so $A = 2$.`,
          String.raw`We equate coefficients of $x^2$: $3 = A + B$, so $B = 1$; constant terms: $3 = A - C$, so $C = -1$. (Check with $x$: $-2 = C - B$. ✓)`,
          String.raw`We integrate, splitting $\frac{x - 1}{x^2 + 1} = \frac{x}{x^2 + 1} - \frac{1}{x^2 + 1}$: the result is $2\ln|x - 1| + \frac12\ln(x^2 + 1) - \arctan x + C$.`,
        ] },
        { type: 'steps', title: String.raw`Example with a repeated factor: $\dfrac{4x^2 - 3x + 1}{x(x - 1)^2}$`, steps: [
          String.raw`The repeated factor $(x - 1)^2$ needs two terms: $\dfrac{4x^2 - 3x + 1}{x(x - 1)^2} = \dfrac{A}{x} + \dfrac{B}{x - 1} + \dfrac{C}{(x - 1)^2}$, i.e. $4x^2 - 3x + 1 = A(x - 1)^2 + Bx(x - 1) + Cx$.`,
          String.raw`We insert $x = 0$: $1 = A$. We insert $x = 1$: $2 = C$.`,
          String.raw`No root is left for $B$, so we compare the $x^2$ coefficients: $4 = A + B$, $B = 3$.`,
          String.raw`Integrating: $\displaystyle\int \frac{4x^2 - 3x + 1}{x(x - 1)^2}\,\mathrm d x = \ln|x| + 3\ln|x - 1| - \frac{2}{x - 1} + C$.`,
        ] },
        { type: 'quiz', question: String.raw`Which is the correct form of the decomposition of $\dfrac{x + 1}{x^2(x^2 + 4)}$?`, choices: [String.raw`$\dfrac{A}{x^2} + \dfrac{B}{x^2 + 4}$`, String.raw`$\dfrac{A}{x} + \dfrac{B}{x^2} + \dfrac{C}{x^2 + 4}$`, String.raw`$\dfrac{A}{x} + \dfrac{B}{x^2} + \dfrac{Cx + D}{x^2 + 4}$`, String.raw`$\dfrac{Ax + B}{x^2} + \dfrac{C}{x + 2} + \dfrac{D}{x - 2}$`], answer: 2, explain: String.raw`$x^2$ is a repeated linear factor (terms $\frac Ax + \frac B{x^2}$); $x^2 + 4$ is irreducible over $\mathbb R$ and needs a linear numerator. Four unknowns for a degree-4 denominator.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'coefficients-backslash',
      title: 'Partial-fraction coefficients with A\\b',
      blocks: [
        { type: 'text', html: String.raw`<p>Equating coefficients produces a <b>linear system</b>. For $3x^2 - 2x + 3 = A(x^2 + 1) + (Bx + C)(x - 1) = (A + B)x^2 + (C - B)x + (A - C)$:</p>$$\begin{aligned} A + B &= 3 \\ -B + C &= -2 \\ A - C &= 3 \end{aligned} \qquad\Longleftrightarrow\qquad \begin{pmatrix} 1 & 1 & 0 \\ 0 & -1 & 1 \\ 1 & 0 & -1 \end{pmatrix}\begin{pmatrix} A \\ B \\ C \end{pmatrix} = \begin{pmatrix} 3 \\ -2 \\ 3 \end{pmatrix}.$$<p>In MATLAB, <code>c = M\b</code> solves $Mc = b$ (the backslash operator). Each row of <code>M</code> is one power of $x$; each column one unknown.</p>` },
        { type: 'code', caption: 'Roots of the denominator, coefficients and a check by plotting the difference.', editable: true, code: String.raw`r = roots([1 -1 1 -1])            % (x-1)(x^2+1): one real root, two complex
M = [1 1 0; 0 -1 1; 1 0 -1];       % rows: x^2, x^1, x^0; columns: A, B, C
b = [3; -2; 3];
c = M\b                            % A = 2, B = 1, C = -1

f = @(x) (3*x.^2 - 2*x + 3)./((x - 1).*(x.^2 + 1));
g = @(x) c(1)./(x - 1) + (c(2)*x + c(3))./(x.^2 + 1);
x = linspace(-3, 3, 400);
x = x(abs(x - 1) > 0.05);          % stay away from the pole
plot(x, f(x) - g(x)), grid on
title('f - (sum of partial fractions)')
maxdiff = max(abs(f(x) - g(x)))` },
        { type: 'callout', kind: 'matlab', html: String.raw`<p>The difference plot should be pure rounding noise ($10^{-15}$). A wrong coefficient shows up immediately as a visible curve. Complex roots in the output of <code>roots</code> (here $\pm i$) signal an irreducible quadratic factor.</p>` },
        { type: 'matlab', prompt: String.raw`For $\dfrac{4x^2 - 3x + 1}{x(x - 1)^2} = \dfrac{A}{x} + \dfrac{B}{x - 1} + \dfrac{C}{(x - 1)^2}$ we have $4x^2 - 3x + 1 = (A + B)x^2 + (-2A - B + C)x + A$. Set up <code>M</code> and <code>b</code>, solve with backslash, and store the coefficients in <code>A</code>, <code>B</code>, <code>C</code>.`, starter: `M = eye(3);        % rows: x^2, x^1, x^0; columns: A, B, C\nb = [0; 0; 0];\nc = M\\b;\nA = c(1); B = c(2); C = c(3);`, solution: `M = [1 1 0; -2 -1 1; 1 0 0];\nb = [4; -3; 1];\nc = M\\b;\nA = c(1); B = c(2); C = c(3);`, checks: [{ var: 'A', value: 1, tol: 1e-10 }, { var: 'B', value: 3, tol: 1e-10 }, { var: 'C', value: 2, tol: 1e-10 }], hint: String.raw`Row for $x^2$: <code>[1 1 0]</code>, right-hand side 4. Row for $x$: <code>[-2 -1 1]</code>, right-hand side $-3$.` },
        { type: 'text', html: String.raw`<p>For <b>distinct simple roots</b> there is a shortcut: the coefficient of $\frac{1}{x - r_k}$ in $\frac{P}{Q}$ is $\dfrac{P(r_k)}{Q'(r_k)}$ — the cover-up rule in disguise. With <code>polyval</code> and <code>polyder</code> this is one line.</p>` },
        { type: 'matlab', prompt: String.raw`Decompose $\dfrac{x^2 + 1}{x^3 - 2x^2 - 5x + 6}$: compute the roots <code>r</code> of the denominator, the coefficients <code>Ak = polyval(P, r)./polyval(polyder(Q), r)</code>, and store the coefficient belonging to the root $x = 3$ in <code>A3</code>.`, starter: `P = [1 0 1];\nQ = [1 -2 -5 6];\nr = roots(Q);\nAk = 0*r;          % replace\nA3 = 0;            % pick the entry with r = 3`, solution: `P = [1 0 1];\nQ = [1 -2 -5 6];\nr = roots(Q);\nAk = polyval(P, r)./polyval(polyder(Q), r);\nA3 = Ak(abs(r - 3) < 1e-9);`, checks: [{ var: 'Ak', size: 3 }, { var: 'A3', value: 1, tol: 1e-9 }], hint: String.raw`Select with a logical mask: <code>Ak(abs(r - 3) &lt; 1e-9)</code>.` },
      ],
    },
    {
      id: 'checking-substitutions',
      title: 'Writing and checking substitutions',
      blocks: [
        { type: 'text', html: String.raw`<p>In a write-up, an inverse substitution needs three statements: the substitution, the differential, and the new limits (or the triangle used to return to $x$). The LaTeX for typical lines:</p>` },
        { type: 'table', head: ['You type', 'Result'], rows: [
          [String.raw`<code>x = 2\sin\theta,\ \mathrm d x = 2\cos\theta\,\mathrm d\theta</code>`, String.raw`$x = 2\sin\theta,\ \mathrm d x = 2\cos\theta\,\mathrm d\theta$`],
          [String.raw`<code>\sqrt{a^2 - x^2}</code>, <code>\arcsin\frac{x}{a}</code>`, String.raw`$\sqrt{a^2 - x^2}$, $\arcsin\frac{x}{a}$`],
          [String.raw`<code>u = \sqrt[4]{x}</code>, <code>x = u^4</code>`, String.raw`$u = \sqrt[4]{x}$, $x = u^4$`],
          [String.raw`<code>\ln\left|x - 1\right|</code>`, String.raw`$\ln\left|x - 1\right|$`],
        ] },
        { type: 'latex', prompt: 'Type the substitution line:', target: String.raw`x = 3\tan\theta,\quad \mathrm d x = 3\sec^2\theta\,\mathrm d\theta` },
        { type: 'latex', prompt: 'Type the result of the second lesson example:', target: String.raw`\int \frac{\mathrm d x}{\sqrt{3 + 2x - x^2}} = \arcsin\frac{x - 1}{2} + C` },
        { type: 'code', caption: 'Numerical checks of three results from the lessons.', editable: true, code: String.raw`I1 = integral(@(x) sqrt(4 - x.^2), 0, 2);           % trig substitution: pi
I2 = integral(@(x) 1./(1 + sqrt(x)), 0, 4);          % u = sqrt(x): 4 - 2 ln 3
F = @(x) -sqrt(x.^2 + 9)./(9*x);                      % antiderivative from x = 3 tan(theta)
I3 = integral(@(x) 1./(x.^2.*sqrt(x.^2 + 9)), 1, 4);
fprintf('%.12f  %.12f\n%.12f  %.12f\n%.12f  %.12f\n', I1, pi, I2, 4 - 2*log(3), I3, F(4) - F(1))` },
        { type: 'matlab', prompt: String.raw`With $u = x^{1/3}$ one finds $\displaystyle\int_0^8 \frac{\mathrm d x}{1 + x^{1/3}} = 3\ln 3$. Compute the integral numerically in <code>I</code> and the difference <code>d = I - 3*log(3)</code>.`, starter: `I = 0;   % use integral\nd = I - 3*log(3);`, solution: `I = integral(@(x) 1./(1 + x.^(1/3)), 0, 8);\nd = I - 3*log(3);`, checks: [{ var: 'I', value: '3*log(3)', tol: 1e-6 }, { var: 'd', value: 0, tol: 1e-6 }, { uses: 'integral' }] },
        { type: 'matlab', prompt: String.raw`Check the antiderivative $F(x) = \ln|x| + 3\ln|x - 1| - \dfrac{2}{x - 1}$ of $\dfrac{4x^2 - 3x + 1}{x(x - 1)^2}$ on $[2, 5]$: compute <code>d = (F(5) - F(2)) - integral(f, 2, 5)</code>.`, starter: `f = @(x) (4*x.^2 - 3*x + 1)./(x.*(x - 1).^2);\nF = @(x) 0*x;   % replace\nd = (F(5) - F(2)) - integral(f, 2, 5);`, solution: `f = @(x) (4*x.^2 - 3*x + 1)./(x.*(x - 1).^2);\nF = @(x) log(abs(x)) + 3*log(abs(x - 1)) - 2./(x - 1);\nd = (F(5) - F(2)) - integral(f, 2, 5);`, checks: [{ var: 'F', isFunction: true }, { var: 'd', value: 0, tol: 1e-9 }] },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Trigonometric substitutions',
      difficulty: 'core',
      statement: String.raw`<p>Use $x = a\sin\theta$, $a\tan\theta$ or $a\sec\theta$. Type antiderivatives in MATLAB syntax (<code>asin</code>, <code>atan</code>, <code>acos</code>, <code>sqrt</code>).</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int_0^3 \sqrt{9 - x^2}\,\mathrm d x$`, kind: 'numeric', answer: '9*pi/4', tol: 1e-6, solution: String.raw`$x = 3\sin\theta$: $\int_0^{\pi/2} 9\cos^2\theta\,\mathrm d\theta = \frac{9\pi}{4}$ — a quarter of a disk of radius 3.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int \frac{\mathrm d x}{(x^2 + 4)^{3/2}}$`, kind: 'expression', variable: 'x', answer: 'x./(4*sqrt(x.^2 + 4))', upToConstant: true, domain: [-2, 2], solution: String.raw`$x = 2\tan\theta$, $\mathrm d x = 2\sec^2\theta\,\mathrm d\theta$, $(x^2 + 4)^{3/2} = 8\sec^3\theta$: $\int \frac14\cos\theta\,\mathrm d\theta = \frac14\sin\theta = \frac{x}{4\sqrt{x^2 + 4}} + C$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int \frac{\sqrt{x^2 - 1}}{x}\,\mathrm d x$ for $x > 1$`, kind: 'expression', variable: 'x', answer: 'sqrt(x.^2 - 1) - acos(1./x)', upToConstant: true, domain: [1.2, 3], hint: String.raw`$x = \sec\theta$ leads to $\int \tan^2\theta\,\mathrm d\theta$. Note $\theta = \operatorname{arcsec} x = \arccos(1/x)$.`, solution: String.raw`$x = \sec\theta$: $\int \frac{\tan\theta}{\sec\theta}\sec\theta\tan\theta\,\mathrm d\theta = \int(\sec^2\theta - 1)\,\mathrm d\theta = \tan\theta - \theta = \sqrt{x^2 - 1} - \arccos\frac1x + C$.` },
        { label: '(d)', prompt: String.raw`Which substitution suits $\sqrt{25 - 4x^2}$?`, kind: 'choice', choices: [String.raw`$x = 5\sin\theta$`, String.raw`$x = \frac52\sin\theta$`, String.raw`$x = \frac25\sin\theta$`, String.raw`$x = \frac52\tan\theta$`], answer: 1, solution: String.raw`$25 - 4x^2 = 25 - (2x)^2$, so $2x = 5\sin\theta$ and $\sqrt{25 - 4x^2} = 5\cos\theta$.` },
      ],
    },
    {
      id: 'a2',
      title: 'Completing the square and rationalizing',
      difficulty: 'exam',
      hw: 'HW2-style',
      statement: String.raw`<p>Reduce to standard forms. Part (e) is a full write-up.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int \frac{\mathrm d x}{x^2 - 6x + 13}$`, kind: 'expression', variable: 'x', answer: 'atan((x - 3)/2)/2', upToConstant: true, solution: String.raw`$x^2 - 6x + 13 = (x - 3)^2 + 4$: $\frac12\arctan\frac{x - 3}{2} + C$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int \frac{\mathrm d x}{\sqrt{5 + 4x - x^2}}$`, kind: 'expression', variable: 'x', answer: 'asin((x - 2)/3)', upToConstant: true, domain: [-0.5, 4.5], solution: String.raw`$5 + 4x - x^2 = 9 - (x - 2)^2$: $\arcsin\frac{x - 2}{3} + C$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_0^8 \frac{\mathrm d x}{1 + \sqrt[3]{x}}$`, kind: 'numeric', answer: '3*log(3)', tol: 1e-6, solution: String.raw`$u = x^{1/3}$, $\mathrm d x = 3u^2\,\mathrm d u$: $\int_0^2 \frac{3u^2}{1 + u}\,\mathrm d u = 3\int_0^2\left(u - 1 + \frac{1}{1 + u}\right)\mathrm d u = 3\left(2 - 2 + \ln 3\right) = 3\ln 3$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\int_4^9 \frac{\mathrm d x}{x - \sqrt x}$`, kind: 'numeric', answer: '2*log(2)', tol: 1e-6, solution: String.raw`$u = \sqrt x$: $\int_2^3 \frac{2u}{u^2 - u}\,\mathrm d u = \int_2^3 \frac{2}{u - 1}\,\mathrm d u = 2\ln 2$.` },
        { label: '(e)', prompt: String.raw`Compute $\displaystyle\int_1^{16} \frac{\mathrm d x}{\sqrt x + x^{3/4}}$ exactly with a suitable rationalizing substitution, and check with <code>integral</code>. Enter the value here and the write-up in the Live Script.`, kind: 'numeric', answer: '4 - 4*log(3/2)', tol: 1e-6, hint: String.raw`Both $\sqrt x$ and $x^{3/4}$ are powers of $u = x^{1/4}$.`, solution: String.raw`$u = x^{1/4}$, $x = u^4$, $\mathrm d x = 4u^3\,\mathrm d u$, limits $1 \to 2$: $\int_1^2 \frac{4u^3}{u^2 + u^3}\,\mathrm d u = \int_1^2 \frac{4u}{1 + u}\,\mathrm d u = 4\Big[u - \ln(1 + u)\Big]_1^2 = 4 - 4\ln\frac32 \approx 2.3781$.` },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 2(e) (Attempted)' },
        { type: 'text', content: String.raw`Both roots are powers of $x^{1/4}$, so we substitute $u = x^{1/4}$, i.e. $x = u^4$ and $\mathrm d x = 4u^3\,\mathrm d u$. Then $\sqrt x = u^2$, $x^{3/4} = u^3$, and the limits $x = 1$ and $x = 16$ become $u = 1$ and $u = 2$:` },
        { type: 'equation', content: String.raw`\int_1^{16} \frac{\mathrm d x}{\sqrt x + x^{3/4}} = \int_1^2 \frac{4u^3}{u^2 + u^3}\,\mathrm d u = \int_1^2 \frac{4u}{1 + u}\,\mathrm d u .` },
        { type: 'text', content: String.raw`The numerator and denominator have the same degree, so we divide: $\frac{4u}{1 + u} = 4 - \frac{4}{1 + u}$. Hence` },
        { type: 'equation', content: String.raw`\int_1^2 \left(4 - \frac{4}{1 + u}\right)\mathrm d u = \Big[4u - 4\ln(1 + u)\Big]_1^2 = 4 - 4\ln 3 + 4\ln 2 = 4 - 4\ln\frac{3}{2} \approx 2.3781 .` },
        { type: 'text', content: 'We check the result numerically:' },
        { type: 'code', content: String.raw`I = integral(@(x) 1./(sqrt(x) + x.^(3/4)), 1, 16);
fprintf('integral: %.10f,  exact: %.10f\n', I, 4 - 4*log(3/2))` },
        { type: 'text', content: 'The numerical value agrees with the exact result.' },
      ],
    },
    {
      id: 'a3',
      title: 'Partial fractions with linear factors',
      difficulty: 'core',
      statement: String.raw`<p>Decompose, then integrate.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int \frac{x + 7}{x^2 - x - 6}\,\mathrm d x$ (give an antiderivative valid for $x > 3$)`, kind: 'expression', variable: 'x', answer: '2*log(abs(x - 3)) - log(abs(x + 2))', upToConstant: true, domain: [3.5, 6], solution: String.raw`$x^2 - x - 6 = (x - 3)(x + 2)$; cover-up: $A = \frac{10}{5} = 2$ at $x = 3$, $B = \frac{5}{-5} = -1$ at $x = -2$. Result $2\ln|x - 3| - \ln|x + 2| + C$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_4^5 \frac{x + 7}{x^2 - x - 6}\,\mathrm d x$`, kind: 'numeric', answer: '2*log(2) - log(7/6)', tol: 1e-6, solution: String.raw`$\Big[2\ln(x - 3) - \ln(x + 2)\Big]_4^5 = 2\ln 2 - \ln 7 + \ln 6 = 2\ln 2 - \ln\frac76 \approx 1.2321$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_1^2 \frac{x^3 + 2x^2 + 3}{x^2 + 2x}\,\mathrm d x$`, kind: 'numeric', answer: '3/2 + 3/2*log(3/2)', tol: 1e-6, hint: 'Divide first.', solution: String.raw`Long division: $\frac{x^3 + 2x^2 + 3}{x^2 + 2x} = x + \frac{3}{x(x + 2)} = x + \frac{3/2}{x} - \frac{3/2}{x + 2}$. Integral: $\frac32 + \frac32\Big[\ln\frac{x}{x + 2}\Big]_1^2 = \frac32 + \frac32\ln\frac32 \approx 2.1082$.` },
      ],
    },
    {
      id: 'a4',
      title: 'Repeated and quadratic factors',
      difficulty: 'challenge',
      statement: String.raw`<p>Let $\dfrac{x^2 + 3}{x(x + 1)^2} = \dfrac{A}{x} + \dfrac{B}{x + 1} + \dfrac{C}{(x + 1)^2}$.</p>`,
      parts: [
        { label: '(a)', prompt: '$A$', kind: 'numeric', answer: '3', solution: String.raw`$x^2 + 3 = A(x + 1)^2 + Bx(x + 1) + Cx$. At $x = 0$: $A = 3$.` },
        { label: '(b)', prompt: '$C$', kind: 'numeric', answer: '-4', solution: String.raw`At $x = -1$: $4 = -C$, so $C = -4$.` },
        { label: '(c)', prompt: '$B$', kind: 'numeric', answer: '-2', solution: String.raw`$x^2$ coefficients: $1 = A + B$, so $B = -2$.` },
        { label: '(d)', prompt: String.raw`An antiderivative of $\dfrac{x^2 + 3}{x(x + 1)^2}$ for $x > 0$`, kind: 'expression', variable: 'x', answer: '3*log(x) - 2*log(x + 1) + 4./(x + 1)', upToConstant: true, solution: String.raw`$3\ln|x| - 2\ln|x + 1| + \frac{4}{x + 1} + C$ (since $\int -4(x + 1)^{-2}\,\mathrm d x = 4(x + 1)^{-1}$).` },
        { label: '(e)', prompt: String.raw`$\displaystyle\int_0^1 \frac{2x^2 + x + 3}{(x + 1)(x^2 + 1)}\,\mathrm d x$`, kind: 'numeric', answer: '2*log(2) + pi/4', tol: 1e-6, hint: String.raw`Ansatz $\frac{A}{x + 1} + \frac{Bx + C}{x^2 + 1}$.`, solution: String.raw`$A = \frac{2 - 1 + 3}{2} = 2$; $x^2$: $A + B = 2$, $B = 0$; constants: $A + C = 3$, $C = 1$. So the integrand is $\frac{2}{x + 1} + \frac{1}{x^2 + 1}$, and the integral is $2\ln 2 + \frac{\pi}{4} \approx 2.1717$.` },
      ],
    },
    {
      id: 'a5',
      title: 'Four coefficients with A\\b',
      difficulty: 'exam',
      hw: 'HW2-style',
      statement: String.raw`<p>Compute $\displaystyle I = \int_2^3 \frac{x^2 + 2}{(x - 1)^2(x^2 + 1)}\,\mathrm d x$ using the decomposition</p>$$\frac{x^2 + 2}{(x - 1)^2(x^2 + 1)} = \frac{A}{x - 1} + \frac{B}{(x - 1)^2} + \frac{Cx + D}{x^2 + 1}.$$`,
      parts: [
        { label: '(a)', prompt: '$A$', kind: 'numeric', answer: '-1/2', tol: 1e-9, solution: String.raw`Equating coefficients gives the system below; its solution is $A = -\frac12$, $B = \frac32$, $C = \frac12$, $D = 0$.` },
        { label: '(b)', prompt: '$B$', kind: 'numeric', answer: '3/2', tol: 1e-9, solution: String.raw`Cover-up at $x = 1$: $3 = 2B$.` },
        { label: '(c)', prompt: '$C$', kind: 'numeric', answer: '1/2', tol: 1e-9, solution: String.raw`$x^3$ coefficients: $A + C = 0$.` },
        { label: '(d)', prompt: '$D$', kind: 'numeric', answer: '0', tol: 1e-9, solution: String.raw`$x$ coefficients: $A + C - 2D = 0$, so $D = 0$.` },
        { label: '(e)', prompt: '$I$', kind: 'numeric', answer: '3/4 - log(2)/4', tol: 1e-6, solution: String.raw`$\Big[-\frac12\ln(x - 1) - \frac{3}{2(x - 1)} + \frac14\ln(x^2 + 1)\Big]_2^3 = -\frac12\ln 2 + \frac34 + \frac14\ln 2 = \frac34 - \frac14\ln 2 \approx 0.5767$.` },
        { label: '(f)', prompt: 'Write the solution as a Live Script: the linear system from equating coefficients, its solution with A\\b, the integration, and checks (difference plot and integral).', kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: 'We multiply the decomposition by the denominator and expand:' },
        { type: 'equation', content: String.raw`x^2 + 2 = A(x - 1)\left(x^2 + 1\right) + B\left(x^2 + 1\right) + (Cx + D)(x - 1)^2 .` },
        { type: 'text', content: String.raw`Equating the coefficients of $x^3, x^2, x, 1$ gives a linear system for $A, B, C, D$:` },
        { type: 'equation', content: String.raw`\begin{pmatrix} 1 & 0 & 1 & 0 \\ -1 & 1 & -2 & 1 \\ 1 & 0 & 1 & -2 \\ -1 & 1 & 0 & 1 \end{pmatrix}\begin{pmatrix} A \\ B \\ C \\ D \end{pmatrix} = \begin{pmatrix} 0 \\ 1 \\ 0 \\ 2 \end{pmatrix}.` },
        { type: 'text', content: 'We solve it with the backslash operator and check the decomposition by plotting the difference:' },
        { type: 'code', content: String.raw`M = [1 0 1 0; -1 1 -2 1; 1 0 1 -2; -1 1 0 1];
b = [0; 1; 0; 2];
c = M\b
f = @(x) (x.^2 + 2)./((x - 1).^2.*(x.^2 + 1));
g = @(x) c(1)./(x - 1) + c(2)./(x - 1).^2 + (c(3)*x + c(4))./(x.^2 + 1);
x = linspace(1.5, 4, 200);
plot(x, f(x) - g(x)), grid on
title('f - decomposition')` },
        { type: 'text', content: String.raw`Hence $A = -\frac12$, $B = \frac32$, $C = \frac12$, $D = 0$. We integrate term by term on $[2, 3]$:` },
        { type: 'equation', content: String.raw`I = \Big[-\frac12\ln(x - 1) - \frac{3}{2(x - 1)} + \frac14\ln\left(x^2 + 1\right)\Big]_2^3 = \frac34 - \frac14\ln 2 \approx 0.5767 .` },
        { type: 'text', content: 'We confirm the value with `integral`:' },
        { type: 'code', content: String.raw`I = integral(f, 2, 3);
fprintf('integral: %.10f,  exact: %.10f\n', I, 3/4 - log(2)/4)` },
      ],
    },
  ],
};
