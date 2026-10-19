// Module 12: Integration by parts and reduction formulas

export default {
  id: 'parts',
  number: 12,
  part: 'techniques',
  hw: 'HW2',
  title: 'Integration by parts and reduction formulas',
  summary: 'The product rule backwards: ∫u dv = uv − ∫v du, choosing u with LIATE, repeated parts, solving for the integral (e^x sin x), definite integrals, inverse trigonometric functions and logarithms, and reduction formulas such as Wallis’ formula — checked numerically with integral and for loops.',
  intro: String.raw`<p>Substitution undoes the chain rule; <b>integration by parts</b> undoes the product rule. It handles products of different kinds of functions ($x e^x$, $x\sin x$, $e^x\cos x$), functions with simple derivatives but no obvious antiderivative ($\ln x$, $\arctan x$, $\arcsin x$), and whole families of integrals at once through <b>reduction formulas</b>. In MATLAB you check every result with <code>integral</code> and verify recursions with a <code>for</code> loop.</p>`,
  lessons: [
    {
      id: 'parts-formula',
      title: 'The formula and how to choose u',
      blocks: [
        { type: 'text', html: String.raw`<p>Plot the curve $\big(u(t), v(t)\big)$ in a $uv$-plane. The rectangle $[0, u] \times [0, v]$ splits into the area <b>under</b> the curve, $\int v\,\mathrm d u$, and the area <b>left</b> of it, $\int u\,\mathrm d v$. Here $u = \ln t$ and $v = t$ for $1 \le t \le e$: the orange area is $\int_1^e \ln t\,\mathrm d t$, the blue area is $\int_1^e t\cdot\frac{1}{t}\,\mathrm d t = e - 1$, and together they fill the rectangle of area $uv = e$.</p>` },
        { type: 'widget', name: 'parts', config: {
          title: 'Integration by parts as areas: u = ln t, v = t',
          u: 'log(t)', v: 't', t0: 1, t1: Math.E, ulim: [-0.1, 1.25], vlim: [-0.1, 3],
        } },
        { type: 'callout', kind: 'thm', title: 'Integration by parts', html: String.raw`<p>From $(uv)' = u'v + uv'$ we get</p>$$\int u\,\mathrm d v = uv - \int v\,\mathrm d u, \qquad \int_a^b u(x)v'(x)\,\mathrm d x = \Big[u(x)v(x)\Big]_a^b - \int_a^b u'(x)v(x)\,\mathrm d x .$$<p>Choose $u$ so that $u'$ is <i>simpler</i> than $u$, and $\mathrm d v$ so that you <i>can</i> integrate it.</p>` },
        { type: 'table', head: ['LIATE: prefer as $u$ (top first)', 'Examples'], rows: [
          ['<b>L</b>ogarithms', String.raw`$\ln x$, $\ln(1 + x^2)$`],
          ['<b>I</b>nverse trigonometric', String.raw`$\arctan x$, $\arcsin x$`],
          ['<b>A</b>lgebraic (powers, polynomials)', String.raw`$x$, $x^2 + 1$`],
          ['<b>T</b>rigonometric', String.raw`$\sin x$, $\cos 3x$`],
          ['<b>E</b>xponential', String.raw`$e^x$, $e^{-2x}$`],
        ] },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int x\cos x\,\mathrm d x$`, steps: [
          String.raw`We choose $u = x$ (algebraic) and $\mathrm d v = \cos x\,\mathrm d x$ (trigonometric), so $\mathrm d u = \mathrm d x$ and $v = \sin x$.`,
          String.raw`We apply the formula: $\int x\cos x\,\mathrm d x = x\sin x - \int \sin x\,\mathrm d x$.`,
          String.raw`The remaining integral is elementary: $\int x\cos x\,\mathrm d x = x\sin x + \cos x + C$. Check: $\frac{\mathrm d}{\mathrm d x}(x\sin x + \cos x) = \sin x + x\cos x - \sin x = x\cos x$.`,
        ] },
        { type: 'text', html: String.raw`<p>Logarithms and inverse trigonometric functions are integrated by parts with the "invisible" factor $\mathrm d v = \mathrm d x$: their derivatives are algebraic and much simpler.</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int \arctan x\,\mathrm d x$ and $\displaystyle\int \arcsin x\,\mathrm d x$`, steps: [
          String.raw`For $\arctan$ we take $u = \arctan x$, $\mathrm d v = \mathrm d x$, so $\mathrm d u = \dfrac{\mathrm d x}{1 + x^2}$ and $v = x$: $\int \arctan x\,\mathrm d x = x\arctan x - \int \dfrac{x}{1 + x^2}\,\mathrm d x$.`,
          String.raw`The substitution $w = 1 + x^2$ finishes it: $\int \arctan x\,\mathrm d x = x\arctan x - \tfrac12\ln(1 + x^2) + C$.`,
          String.raw`For $\arcsin$ in the same way: $\int \arcsin x\,\mathrm d x = x\arcsin x - \int \dfrac{x}{\sqrt{1 - x^2}}\,\mathrm d x = x\arcsin x + \sqrt{1 - x^2} + C$.`,
        ] },
        { type: 'quiz', question: String.raw`For $\int x\,e^{2x}\,\mathrm d x$, which choice works?`, choices: [String.raw`$u = e^{2x}$, $\mathrm d v = x\,\mathrm d x$`, String.raw`$u = x$, $\mathrm d v = e^{2x}\,\mathrm d x$`, String.raw`$u = x e^{2x}$, $\mathrm d v = \mathrm d x$`, 'Integration by parts does not apply.'], answer: 1, explain: String.raw`With $u = x$ the derivative is $1$ and the new integral $\int \frac12 e^{2x}\,\mathrm d x$ is easy: the result is $\frac{x}{2}e^{2x} - \frac14 e^{2x} + C$. The first choice raises the power of $x$ and makes things worse.` },
      ],
    },
    {
      id: 'repeated-parts',
      title: 'Repeated parts, solving for the integral, definite integrals',
      blocks: [
        { type: 'text', html: String.raw`<p>Sometimes integration by parts brings back the integral you started with. Then the equation can be <b>solved</b> for it. For $\int e^x\sin x\,\mathrm d x$ this gives $F(x) = \tfrac12 e^x(\sin x - \cos x)$. The slope field below shows the slopes $e^x\sin x$; the curve $F + C$ follows them for every $C$.</p>` },
        { type: 'widget', name: 'antiderivative', config: {
          title: 'F(x) = e^x (sin x − cos x)/2 fits the slope field of e^x sin x',
          f: 'exp(x).*sin(x)', F: 'exp(x).*(sin(x)-cos(x))/2', xlim: [-4, 2.5], ylim: [-4, 9],
        } },
        { type: 'steps', title: String.raw`Example: $I = \displaystyle\int e^x\sin x\,\mathrm d x$`, steps: [
          String.raw`We integrate by parts with $u = \sin x$, $\mathrm d v = e^x\,\mathrm d x$: $I = e^x\sin x - \int e^x\cos x\,\mathrm d x$.`,
          String.raw`We integrate by parts again, <b>keeping the same roles</b> ($u = \cos x$, $\mathrm d v = e^x\,\mathrm d x$): $\int e^x\cos x\,\mathrm d x = e^x\cos x + \int e^x\sin x\,\mathrm d x = e^x\cos x + I$.`,
          String.raw`Substituting back: $I = e^x\sin x - e^x\cos x - I$. The unknown $I$ appears on both sides.`,
          String.raw`We solve for it: $2I = e^x(\sin x - \cos x)$, so $I = \tfrac12 e^x(\sin x - \cos x) + C$.`,
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>If you swap the roles in the second step ($u = e^x$), the two integrations cancel and you get the useless identity $I = I$.</p>` },
        { type: 'text', html: String.raw`<p>For $x^n$ times $e^x$, $\sin x$ or $\cos x$, each round of parts lowers the power by one. The bookkeeping is easiest in a table: differentiate $u$ down to zero, integrate $\mathrm d v$ the same number of times, and multiply diagonally with alternating signs.</p>` },
        { type: 'table', head: ['sign', String.raw`$u$ and derivatives`, String.raw`$\mathrm d v$ and integrals`], rows: [
          ['+', String.raw`$x^2$`, String.raw`$e^x$`],
          ['−', String.raw`$2x$`, String.raw`$e^x$`],
          ['+', String.raw`$2$`, String.raw`$e^x$`],
          ['', String.raw`$0$`, String.raw`$e^x$`],
        ] },
        { type: 'text', html: String.raw`<p>Reading diagonally: $\int x^2 e^x\,\mathrm d x = x^2e^x - 2xe^x + 2e^x + C = e^x(x^2 - 2x + 2) + C$.</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int_0^\pi x\sin x\,\mathrm d x$`, steps: [
          String.raw`We take $u = x$, $\mathrm d v = \sin x\,\mathrm d x$, so $\mathrm d u = \mathrm d x$, $v = -\cos x$, and apply the definite form: $\int_0^\pi x\sin x\,\mathrm d x = \Big[-x\cos x\Big]_0^\pi + \int_0^\pi \cos x\,\mathrm d x$.`,
          String.raw`We evaluate the boundary term: $-\pi\cos\pi - 0 = \pi$. The remaining integral is $\big[\sin x\big]_0^\pi = 0$.`,
          String.raw`Hence $\int_0^\pi x\sin x\,\mathrm d x = \pi$. Evaluating the boundary terms immediately keeps the computation short.`,
        ] },
        { type: 'quiz', question: String.raw`How many integrations by parts does $\int x^3\cos x\,\mathrm d x$ need (with $u$ a power of $x$ each time)?`, choices: ['1', '2', '3', '4'], answer: 2, explain: String.raw`Each round lowers the power of $x$ by one: $x^3 \to x^2 \to x \to 1$, three rounds, after which only $\int \sin x$ or $\int \cos x$ remains.` },
      ],
    },
    {
      id: 'reduction-formulas',
      title: 'Reduction formulas',
      blocks: [
        { type: 'text', html: String.raw`<p>Integration by parts applied to a whole family $I_n$ gives a <b>reduction formula</b>: $I_n$ in terms of $I_{n-1}$ or $I_{n-2}$. Starting from one or two easy members, a recursion produces all the others. Slide $n$: the areas $C_n = \int_0^{\pi/2}\cos^n x\,\mathrm d x$ shrink as the graph concentrates near $x = 0$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'cos^n x on [0, π/2]',
          functions: [{ expr: 'cos(x).^n', label: '$\\cos^n x$' }],
          params: { n: { min: 0, max: 20, value: 2, step: 1, label: '$n$' } },
          shade: { expr: 'cos(x).^n', from: 0, to: 'pi/2' },
          xlim: [-0.1, 1.7], ylim: [-0.1, 1.15],
          readout: String.raw`$C_n = \int_0^{\pi/2}\cos^n x\,\mathrm dx = {{sqrt(pi)*gamma((n+1)/2)/(2*gamma(n/2+1))}}$`,
        } },
        { type: 'steps', title: String.raw`Derivation: $C_n = \displaystyle\int_0^{\pi/2}\cos^n x\,\mathrm d x = \frac{n-1}{n}\,C_{n-2}$ for $n \ge 2$`, steps: [
          String.raw`We split off one factor: $u = \cos^{n-1}x$, $\mathrm d v = \cos x\,\mathrm d x$, so $\mathrm d u = -(n-1)\cos^{n-2}x\,\sin x\,\mathrm d x$ and $v = \sin x$.`,
          String.raw`Integration by parts gives $C_n = \Big[\cos^{n-1}x\,\sin x\Big]_0^{\pi/2} + (n-1)\int_0^{\pi/2}\cos^{n-2}x\,\sin^2 x\,\mathrm d x$. The boundary term vanishes at both ends (for $n \ge 2$).`,
          String.raw`We write $\sin^2 x = 1 - \cos^2 x$: $C_n = (n-1)\big(C_{n-2} - C_n\big)$.`,
          String.raw`We solve for $C_n$: $nC_n = (n-1)C_{n-2}$, i.e. $C_n = \dfrac{n-1}{n}C_{n-2}$. With $C_0 = \frac{\pi}{2}$ and $C_1 = 1$: $C_2 = \frac{\pi}{4}$, $C_3 = \frac23$, $C_4 = \frac34\cdot\frac{\pi}{4} = \frac{3\pi}{16}$.`,
        ] },
        { type: 'callout', kind: 'key', title: 'Two standard reduction formulas', html: String.raw`<ul><li>$\displaystyle\int x^n e^x\,\mathrm d x = x^n e^x - n\int x^{n-1}e^x\,\mathrm d x$ ($u = x^n$, $\mathrm d v = e^x\mathrm d x$). For $J_n = \int_0^1 x^n e^x\,\mathrm d x$: $J_n = e - nJ_{n-1}$, $J_0 = e - 1$.</li><li>Wallis: $\displaystyle\int_0^{\pi/2}\cos^n x\,\mathrm d x = \int_0^{\pi/2}\sin^n x\,\mathrm d x = \frac{n-1}{n}\cdot\frac{n-3}{n-2}\cdots$, ending with $\frac12\cdot\frac{\pi}{2}$ ($n$ even) or $\frac23\cdot 1$ ($n$ odd).</li></ul>` },
        { type: 'callout', kind: 'exam', html: String.raw`<p>A reduction-formula problem has two parts: <b>derive</b> the formula (state $u$ and $\mathrm d v$, show why the boundary term vanishes, solve for $I_n$), then <b>apply</b> it, showing every step of the recursion. A MATLAB loop that reproduces the values with <code>integral</code> is a convincing check.</p>` },
        { type: 'quiz', question: String.raw`With $J_n = \int_0^1 x^n e^x\,\mathrm d x = e - nJ_{n-1}$ and $J_0 = e - 1$, what is $J_2$?`, choices: [String.raw`$e - 2$`, String.raw`$2 - e$`, String.raw`$1$`, String.raw`$e - 1$`], answer: 0, explain: String.raw`$J_1 = e - (e - 1) = 1$ and $J_2 = e - 2\cdot 1 = e - 2 \approx 0.718$.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'parts-live-script',
      title: 'The parts formula in LaTeX and checks with integral',
      blocks: [
        { type: 'text', html: String.raw`<p>In a write-up, state the choice of $u$ and $\mathrm d v$ in a sentence, then show the formula. The thin space <code>\,</code> before $\mathrm d v$ and the upright <code>\mathrm d</code> make it look professional.</p>` },
        { type: 'table', head: ['You type', 'Result'], rows: [
          [String.raw`<code>\int u\,\mathrm d v = uv - \int v\,\mathrm d u</code>`, String.raw`$\int u\,\mathrm d v = uv - \int v\,\mathrm d u$`],
          [String.raw`<code>\Big[ x\sin x \Big]_0^{\pi}</code>`, String.raw`$\Big[ x\sin x \Big]_0^{\pi}$`],
          [String.raw`<code>\arctan x</code>, <code>\arcsin x</code>, <code>\sin^{-1} x</code>`, String.raw`$\arctan x$, $\arcsin x$, $\sin^{-1} x$`],
        ] },
        { type: 'latex', prompt: 'Type the integration by parts formula:', target: String.raw`\int u\,\mathrm d v = uv - \int v\,\mathrm d u` },
        { type: 'latex', prompt: 'Type the definite version:', target: String.raw`\int_a^b u v'\,\mathrm d x = \Big[uv\Big]_a^b - \int_a^b u' v\,\mathrm d x`, accept: [String.raw`\int_a^b u v'\,\mathrm d x = \left[uv\right]_a^b - \int_a^b u' v\,\mathrm d x`, String.raw`\int_a^b u v'\,\mathrm d x = [uv]_a^b - \int_a^b u' v\,\mathrm d x`] },
        { type: 'text', html: String.raw`<p>Every hand computation of a definite integral gets a one-line numerical check. For antiderivatives, compare $F(b) - F(a)$ with <code>integral(f, a, b)</code> on some interval.</p>` },
        { type: 'code', caption: 'Checking two results from the lessons.', editable: true, code: String.raw`format long
I1 = integral(@(x) x.*log(x), 1, exp(1))   % by parts: (e^2 + 1)/4
exact1 = (exp(1)^2 + 1)/4

f = @(x) exp(x).*sin(x);
F = @(x) exp(x).*(sin(x) - cos(x))/2;       % antiderivative found by solving for I
difference = (F(2) - F(-1)) - integral(f, -1, 2)` },
        { type: 'matlab', prompt: String.raw`By parts twice, $\int_0^\pi x^2\sin x\,\mathrm d x = \pi^2 - 4$. Compute the integral numerically in <code>I</code> and the difference <code>d = I - (pi^2 - 4)</code>.`, starter: `I = 0;   % use integral\nd = I - (pi^2 - 4);`, solution: `I = integral(@(x) x.^2.*sin(x), 0, pi);\nd = I - (pi^2 - 4);`, checks: [{ var: 'I', value: 'pi^2 - 4', tol: 1e-8 }, { var: 'd', value: 0, tol: 1e-8 }, { uses: 'integral' }] },
        { type: 'matlab', prompt: String.raw`Check the antiderivative $F(x) = x\arctan x - \tfrac12\ln(1 + x^2)$: define <code>F</code> and compute <code>d = (F(3) - F(0)) - integral(@(x) atan(x), 0, 3)</code>.`, starter: `F = @(x) 0*x;   % replace by the antiderivative\nd = (F(3) - F(0)) - integral(@(x) atan(x), 0, 3);`, solution: `F = @(x) x.*atan(x) - log(1 + x.^2)/2;\nd = (F(3) - F(0)) - integral(@(x) atan(x), 0, 3);`, checks: [{ var: 'F', isFunction: true }, { var: 'd', value: 0, tol: 1e-9, message: '`d` is not zero — check the formula for F.' }] },
      ],
    },
    {
      id: 'reduction-loops',
      title: 'Verifying a reduction formula with a for loop',
      blocks: [
        { type: 'text', html: String.raw`<p>A reduction formula is a recursion, i.e. a <code>for</code> loop. MATLAB indices start at 1, so store $C_n$ in <code>C(n+1)</code>. Comparing with <code>integral</code> for every $n$ verifies the formula.</p>` },
        { type: 'code', caption: 'Wallis integrals by recursion and by integral.', editable: true, code: String.raw`N = 10;
C = zeros(1, N+1);
C(1) = pi/2;          % C_0
C(2) = 1;             % C_1
for n = 2:N
  C(n+1) = (n-1)/n*C(n-1);
end
for n = 0:N
  fprintf('n = %2d   recursion %.10f   integral %.10f\n', n, C(n+1), integral(@(x) cos(x).^n, 0, pi/2))
end` },
        { type: 'callout', kind: 'warn', title: 'Unstable recursions', html: String.raw`<p>$J_n = e - nJ_{n-1}$ is exact, but each step multiplies the rounding error of $J_{n-1}$ by $n$; after $n$ steps the error of $J_0$ is amplified by $n!$. Run the block below: the recursion is fine up to $n \approx 12$ and then produces nonsense (even negative values, although $J_n > 0$). Wallis' recursion multiplies by $\frac{n-1}{n} < 1$ and is stable.</p>` },
        { type: 'code', caption: 'J_n = ∫ x^n e^x dx on [0, 1]: forward recursion vs integral.', editable: true, code: String.raw`J = zeros(1, 21);
J(1) = exp(1) - 1;                  % J_0
for n = 1:20
  J(n+1) = exp(1) - n*J(n);
end
for n = [5 10 15 18 20]
  fprintf('n = %2d   recursion %12.6f   integral %10.6f\n', n, J(n+1), integral(@(x) x.^n.*exp(x), 0, 1))
end` },
        { type: 'matlab', prompt: String.raw`Use the Wallis recursion in a loop to compute $C_0, \dots, C_{10}$ in a vector <code>C</code> (with $C_n$ in <code>C(n+1)</code>). The exact value is $C_{10} = \frac{63\pi}{512}$.`, starter: `C = zeros(1, 11);\nC(1) = pi/2;\nC(2) = 1;\n% loop over n = 2:10 here`, solution: `C = zeros(1, 11);\nC(1) = pi/2;\nC(2) = 1;\nfor n = 2:10\n  C(n+1) = (n-1)/n*C(n-1);\nend\nC10 = C(11);`, checks: [{ var: 'C', size: 11 }, { var: 'C', value: 'pi/2' }, { var: 'C10', value: '63*pi/512', tol: 1e-12, message: 'Store C(11) in C10 and check your recursion.' }], hint: String.raw`<code>C(n+1) = (n-1)/n*C(n-1);</code> — then <code>C10 = C(11);</code>` },
        { type: 'matlab', prompt: String.raw`Compute $J_8 = \int_0^1 x^8e^x\,\mathrm d x$ with the recursion $J_n = e - nJ_{n-1}$, $J_0 = e - 1$, and store it in <code>J8</code>. (For $n = 8$ the recursion is still accurate.)`, starter: `J = exp(1) - 1;     % J_0\n% loop here, then\nJ8 = J;`, solution: `J = exp(1) - 1;\nfor n = 1:8\n  J = exp(1) - n*J;\nend\nJ8 = J;`, checks: [{ var: 'J8', value: 'integral(@(x) x.^8.*exp(x), 0, 1)', tol: 1e-8 }] },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Basic integration by parts',
      difficulty: 'core',
      statement: String.raw`<p>Find the antiderivatives (any constant). Type them in MATLAB syntax, e.g. <code>x.^2.*exp(x)</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int x e^{-2x}\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: '-x.*exp(-2*x)/2 - exp(-2*x)/4', upToConstant: true, solution: String.raw`$u = x$, $\mathrm d v = e^{-2x}\mathrm d x$, $v = -\frac12 e^{-2x}$: $-\frac{x}{2}e^{-2x} + \frac12\int e^{-2x}\,\mathrm d x = -\frac{x}{2}e^{-2x} - \frac14 e^{-2x} + C$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int x^2\ln x\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: 'x.^3.*log(x)/3 - x.^3/9', upToConstant: true, solution: String.raw`LIATE: $u = \ln x$, $\mathrm d v = x^2\mathrm d x$, $v = \frac{x^3}{3}$: $\frac{x^3}{3}\ln x - \int \frac{x^3}{3}\cdot\frac1x\,\mathrm d x = \frac{x^3}{3}\ln x - \frac{x^3}{9} + C$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int x\sin 3x\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: '-x.*cos(3*x)/3 + sin(3*x)/9', upToConstant: true, solution: String.raw`$u = x$, $v = -\frac13\cos 3x$: $-\frac{x}{3}\cos 3x + \frac13\int\cos 3x\,\mathrm d x = -\frac{x}{3}\cos 3x + \frac19\sin 3x + C$.` },
        { label: '(d)', prompt: String.raw`For $\int x^3\ln x\,\mathrm d x$ the right choice is`, kind: 'choice', choices: [String.raw`$u = x^3$, $\mathrm d v = \ln x\,\mathrm d x$`, String.raw`$u = \ln x$, $\mathrm d v = x^3\,\mathrm d x$`, String.raw`$u = x^3\ln x$, $\mathrm d v = \mathrm d x$`], answer: 1, solution: String.raw`Logarithms come first in LIATE; besides, we do not know $\int \ln x\,\mathrm d x$ offhand. Result: $\frac{x^4}{4}\ln x - \frac{x^4}{16} + C$.` },
      ],
    },
    {
      id: 'a2',
      title: 'Inverse trigonometric functions',
      difficulty: 'core',
      statement: String.raw`<p>Integrate with the invisible factor $\mathrm d v = \mathrm d x$, or with an algebraic $\mathrm d v$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int \arccos x\,\mathrm d x$ (in MATLAB, <code>acos(x)</code>)`, kind: 'expression', variable: 'x', answer: 'x.*acos(x) - sqrt(1 - x.^2)', upToConstant: true, domain: [-0.8, 0.8], solution: String.raw`$u = \arccos x$, $\mathrm d u = -\frac{\mathrm d x}{\sqrt{1 - x^2}}$, $v = x$: $x\arccos x + \int \frac{x}{\sqrt{1 - x^2}}\,\mathrm d x = x\arccos x - \sqrt{1 - x^2} + C$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_0^1 x\arctan x\,\mathrm d x$`, kind: 'numeric', answer: 'pi/4 - 1/2', tol: 1e-6, hint: String.raw`$u = \arctan x$, $\mathrm d v = x\,\mathrm d x$. Then write $\frac{x^2}{1 + x^2} = 1 - \frac{1}{1 + x^2}$.`, solution: String.raw`$\Big[\frac{x^2}{2}\arctan x\Big]_0^1 - \frac12\int_0^1 \frac{x^2}{1 + x^2}\,\mathrm d x = \frac{\pi}{8} - \frac12\Big[x - \arctan x\Big]_0^1 = \frac{\pi}{8} - \frac12 + \frac{\pi}{8} = \frac{\pi}{4} - \frac12$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_0^{1/2} \arcsin x\,\mathrm d x$`, kind: 'numeric', answer: 'pi/12 + sqrt(3)/2 - 1', tol: 1e-6, solution: String.raw`$\Big[x\arcsin x + \sqrt{1 - x^2}\Big]_0^{1/2} = \frac12\cdot\frac{\pi}{6} + \frac{\sqrt3}{2} - 1 = \frac{\pi}{12} + \frac{\sqrt3}{2} - 1 \approx 0.1278$.` },
      ],
    },
    {
      id: 'a3',
      title: 'A definite integral by parts, written up',
      difficulty: 'exam',
      hw: 'HW2-style',
      statement: String.raw`<p>Compute $\displaystyle I = \int_1^e (\ln x)^2\,\mathrm d x$ and $\displaystyle K = \int_0^1 x^2e^{-x}\,\mathrm d x$ exactly, and check both with <code>integral</code>.</p>`,
      parts: [
        { label: '(a)', prompt: '$I$', kind: 'numeric', answer: 'exp(1) - 2', tol: 1e-6, hint: String.raw`$u = (\ln x)^2$, $\mathrm d v = \mathrm d x$; then you need $\int \ln x\,\mathrm d x$ — parts again.`, solution: String.raw`$I = \Big[x(\ln x)^2\Big]_1^e - 2\int_1^e \ln x\,\mathrm d x = e - 2\Big[x\ln x - x\Big]_1^e = e - 2\big(0 - (-1)\big) = e - 2$.` },
        { label: '(b)', prompt: '$K$', kind: 'numeric', answer: '2 - 5*exp(-1)', tol: 1e-6, solution: String.raw`Two rounds of parts (tabular) give $\int x^2e^{-x}\,\mathrm d x = -e^{-x}(x^2 + 2x + 2) + C$, so $K = -5e^{-1} + 2 \approx 0.1606$.` },
        { label: '(c)', prompt: 'Write the computation of $I$ as a Live Script with an English sentence before each step and a numerical check.', kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 3 (Attempted)' },
        { type: 'text', content: String.raw`We integrate by parts with $u = (\ln x)^2$ and $\mathrm d v = \mathrm d x$, so that $\mathrm d u = \frac{2\ln x}{x}\,\mathrm d x$ and $v = x$:` },
        { type: 'equation', content: String.raw`I = \int_1^e (\ln x)^2\,\mathrm d x = \Big[x(\ln x)^2\Big]_1^e - \int_1^e x\cdot\frac{2\ln x}{x}\,\mathrm d x = e - 2\int_1^e \ln x\,\mathrm d x .` },
        { type: 'text', content: String.raw`The remaining integral is computed by parts again, with $u = \ln x$ and $\mathrm d v = \mathrm d x$:` },
        { type: 'equation', content: String.raw`\int_1^e \ln x\,\mathrm d x = \Big[x\ln x\Big]_1^e - \int_1^e \mathrm d x = e - (e - 1) = 1 .` },
        { type: 'text', content: 'Therefore' },
        { type: 'equation', content: String.raw`I = e - 2 \approx 0.7183 .` },
        { type: 'text', content: 'We check the result numerically:' },
        { type: 'code', content: String.raw`I = integral(@(x) log(x).^2, 1, exp(1));
fprintf('integral: %.10f,  e - 2: %.10f\n', I, exp(1) - 2)` },
        { type: 'text', content: 'The two values agree to all printed digits.' },
      ],
    },
    {
      id: 'a4',
      title: 'Solving for the integral and repeated parts',
      difficulty: 'challenge',
      statement: String.raw`<p>These integrals need two rounds of integration by parts.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int e^{2x}\cos x\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: 'exp(2*x).*(2*cos(x) + sin(x))/5', upToConstant: true, hint: String.raw`Keep $\mathrm d v = e^{2x}\mathrm d x$ in both rounds and solve for the integral.`, solution: String.raw`Twice with $\mathrm d v = e^{2x}\mathrm d x$: $I = \frac12 e^{2x}\cos x + \frac12\int e^{2x}\sin x\,\mathrm d x = \frac12 e^{2x}\cos x + \frac14 e^{2x}\sin x - \frac14 I$. Hence $\frac54 I = \frac14 e^{2x}(2\cos x + \sin x)$ and $I = \frac15 e^{2x}(2\cos x + \sin x) + C$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_0^\pi e^x\sin x\,\mathrm d x$`, kind: 'numeric', answer: '(exp(pi) + 1)/2', tol: 1e-6, solution: String.raw`$\Big[\frac12 e^x(\sin x - \cos x)\Big]_0^\pi = \frac12 e^\pi(0 + 1) - \frac12(0 - 1) = \frac{e^\pi + 1}{2} \approx 12.07$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int x^2\cos x\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: 'x.^2.*sin(x) + 2*x.*cos(x) - 2*sin(x)', upToConstant: true, solution: String.raw`Tabular: $u$: $x^2, 2x, 2, 0$; $\mathrm d v$: $\cos x, \sin x, -\cos x, -\sin x$. Result $x^2\sin x + 2x\cos x - 2\sin x + C$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\int_0^1 x^3e^x\,\mathrm d x$ (use $J_n = e - nJ_{n-1}$)`, kind: 'numeric', answer: '6 - 2*exp(1)', tol: 1e-6, solution: String.raw`$J_0 = e - 1$, $J_1 = 1$, $J_2 = e - 2$, $J_3 = e - 3(e - 2) = 6 - 2e \approx 0.5634$.` },
      ],
    },
    {
      id: 'a5',
      title: 'A reduction formula',
      difficulty: 'exam',
      hw: 'HW2-style',
      statement: String.raw`<p>Let $\displaystyle W_n = \int_0^1 (1 - x^2)^n\,\mathrm d x$ for $n = 0, 1, 2, \dots$</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Which reduction formula holds for $n \ge 1$?`, kind: 'choice', choices: [String.raw`$W_n = \dfrac{n}{n+1}W_{n-1}$`, String.raw`$W_n = \dfrac{2n}{2n+1}W_{n-1}$`, String.raw`$W_n = \dfrac{2n-1}{2n}W_{n-1}$`, String.raw`$W_n = 1 - 2nW_{n-1}$`], answer: 1, hint: String.raw`Integrate by parts with $u = (1 - x^2)^n$, $\mathrm d v = \mathrm d x$, then write $x^2 = 1 - (1 - x^2)$.`, solution: String.raw`$W_n = \Big[x(1-x^2)^n\Big]_0^1 + 2n\int_0^1 x^2(1-x^2)^{n-1}\,\mathrm d x = 2n\left(W_{n-1} - W_n\right)$, so $(2n+1)W_n = 2nW_{n-1}$.` },
        { label: '(b)', prompt: '$W_3$', kind: 'numeric', answer: '16/35', tol: 1e-9, solution: String.raw`$W_0 = 1$, $W_1 = \frac23$, $W_2 = \frac45\cdot\frac23 = \frac{8}{15}$, $W_3 = \frac67\cdot\frac{8}{15} = \frac{16}{35}$.` },
        { label: '(c)', prompt: '$W_4$', kind: 'numeric', answer: '128/315', tol: 1e-9, solution: String.raw`$W_4 = \frac89\cdot\frac{16}{35} = \frac{128}{315}$.` },
        { label: '(d)', prompt: 'Write the derivation of the reduction formula and the computation of $W_4$ as a Live Script, and verify $W_0, \dots, W_6$ with a loop and integral.', kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: String.raw`We integrate by parts with $u = (1 - x^2)^n$ and $\mathrm d v = \mathrm d x$, so that $\mathrm d u = -2nx(1 - x^2)^{n-1}\,\mathrm d x$ and $v = x$:` },
        { type: 'equation', content: String.raw`W_n = \Big[x\left(1 - x^2\right)^n\Big]_0^1 + 2n\int_0^1 x^2\left(1 - x^2\right)^{n-1}\mathrm d x .` },
        { type: 'text', content: String.raw`For $n \ge 1$ the boundary term is zero at both ends. We write $x^2 = 1 - (1 - x^2)$ in the remaining integral:` },
        { type: 'equation', content: String.raw`W_n = 2n\int_0^1 \left(1 - x^2\right)^{n-1}\mathrm d x - 2n\int_0^1 \left(1 - x^2\right)^{n}\mathrm d x = 2n\,W_{n-1} - 2n\,W_n .` },
        { type: 'text', content: String.raw`Solving for $W_n$ gives the reduction formula` },
        { type: 'equation', content: String.raw`W_n = \frac{2n}{2n+1}\,W_{n-1}, \qquad W_0 = \int_0^1 \mathrm d x = 1 .` },
        { type: 'text', content: 'We apply it four times:' },
        { type: 'equation', content: String.raw`W_4 = \frac{8}{9}\cdot\frac{6}{7}\cdot\frac{4}{5}\cdot\frac{2}{3}\cdot 1 = \frac{384}{945} = \frac{128}{315} \approx 0.4063 .` },
        { type: 'text', content: 'We verify the recursion against numerical integration for $n = 0, \\dots, 6$:' },
        { type: 'code', content: String.raw`W = zeros(1, 7);
W(1) = 1;                          % W_0
for n = 1:6
  W(n+1) = 2*n/(2*n + 1)*W(n);
end
for n = 0:6
  fprintf('n = %d   recursion %.10f   integral %.10f\n', n, W(n+1), integral(@(x) (1 - x.^2).^n, 0, 1))
end` },
        { type: 'text', content: 'The recursion and the numerical integrals agree for every $n$.' },
      ],
    },
  ],
};
