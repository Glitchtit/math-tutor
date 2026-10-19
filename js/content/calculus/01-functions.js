// Module 1: Functions, graphs and the Live Editor (reference module for the content style).

export default {
  id: 'functions',
  number: 1,
  part: 'foundations',
  title: 'Functions, graphs and the Live Editor',
  summary: 'Functions as machines and as graphs, transformations, the elementary functions, inverses and symmetry — and your first Live Script: text, LaTeX and MATLAB anonymous functions.',
  intro: String.raw`<p>Everything in this course is about functions: we differentiate them, integrate them and solve equations whose unknowns are functions. This module refreshes the vocabulary (domain, composition, inverse, even and odd) with graphs you can move, and introduces the tool you will write all homework and exams in — the MATLAB Live Editor.</p>`,
  lessons: [
    {
      id: 'graphs-transformations',
      title: 'Functions and their graphs',
      blocks: [
        { type: 'text', html: String.raw`<p>A <b>function</b> $f$ assigns to each input $x$ in its <b>domain</b> exactly one output $f(x)$. Its graph is the set of points $(x, f(x))$. Most of the functions in this course are built from a few basic shapes by shifting, stretching and combining them.</p><p>Move the sliders: the graph of $y = a\,f\big(b(x - c)\big) + d$ is the graph of $f$ stretched vertically by $a$, compressed horizontally by $b$, shifted right by $c$ and up by $d$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Transforming y = sin x',
          functions: [{ expr: 'sin(x)', label: '$\\sin x$', dash: true }, { expr: 'a*sin(b*(x-c)) + d', label: '$a\\sin\\big(b(x-c)\\big)+d$' }],
          params: { a: { min: -3, max: 3, value: 1.5, label: '$a$' }, b: { min: 0.2, max: 4, value: 1, label: '$b$' }, c: { min: -3, max: 3, value: 0, label: '$c$' }, d: { min: -2, max: 2, value: 0, label: '$d$' } },
          xlim: [-7, 7], ylim: [-4, 4],
          animate: { param: 'c', from: -3, to: 3, duration: 5000 },
          readout: 'Period $2\\pi/b = {{2*pi/b}}$, amplitude $|a| = {{abs(a)}}$.',
        } },
        { type: 'callout', kind: 'key', html: String.raw`<p>Replacing $x$ by $x - c$ moves the graph <b>right</b> by $c$ (the input has to be $c$ larger to produce the same output). Multiplying $x$ by $b > 1$ squeezes the graph horizontally.</p>` },
        { type: 'steps', title: String.raw`Example: domain of $f(x) = \dfrac{\sqrt{x+3}}{x-1}$`, steps: [
          String.raw`The square root needs a non-negative argument: $x + 3 \ge 0$, i.e. $x \ge -3$.`,
          String.raw`The denominator must not vanish: $x \ne 1$.`,
          String.raw`Combine both conditions: the domain is $[-3, 1) \cup (1, \infty)$.`,
        ] },
        { type: 'quiz', question: String.raw`The graph of $y = (x-2)^2 + 1$ is the parabola $y = x^2$ moved …`, choices: ['2 left and 1 up', '2 right and 1 up', '2 right and 1 down', '1 right and 2 up'], answer: 1, explain: String.raw`$x \mapsto x - 2$ shifts right by 2, and $+1$ shifts up by 1. The vertex is at $(2, 1)$.` },
      ],
    },
    {
      id: 'elementary-functions',
      title: 'The elementary functions and inverses',
      blocks: [
        { type: 'text', html: String.raw`<p>The building blocks are polynomials, $e^x$ and $\ln x$, the trigonometric functions and their inverses. The sine and cosine are easiest to remember from the unit circle: $\cos\theta$ is the horizontal and $\sin\theta$ the vertical coordinate of the point at angle $\theta$ (in <b>radians</b>, as always in calculus).</p>` },
        { type: 'widget', name: 'unitcircle', config: {} },
        { type: 'text', html: String.raw`<p>A one-to-one function $f$ has an <b>inverse</b> $f^{-1}$ with $f^{-1}\big(f(x)\big) = x$. Its graph is the mirror image of the graph of $f$ in the line $y = x$. The natural logarithm is the inverse of the exponential, and $\sin^{-1} = \arcsin$ is the inverse of sine restricted to $[-\pi/2, \pi/2]$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'A function and its inverse are mirror images in y = x',
          functions: [{ expr: 'exp(k*x)', label: '$e^{kx}$' }, { expr: 'log(x)/k', label: '$\\frac{1}{k}\\ln x$' }, { expr: 'x', label: '$y = x$', dash: true }],
          params: { k: { min: 0.3, max: 2, value: 1, label: '$k$' } },
          xlim: [-4, 6], ylim: [-4, 6], axisEqual: true,
        } },
        { type: 'table', head: ['Function', 'Domain', 'Range', 'Inverse'], rows: [
          [String.raw`$e^x$`, String.raw`$\mathbb R$`, String.raw`$(0, \infty)$`, String.raw`$\ln x$`],
          [String.raw`$\sin x$ on $[-\frac{\pi}{2}, \frac{\pi}{2}]$`, String.raw`$[-\frac{\pi}{2}, \frac{\pi}{2}]$`, String.raw`$[-1, 1]$`, String.raw`$\sin^{-1} x = \arcsin x$`],
          [String.raw`$\tan x$ on $(-\frac{\pi}{2}, \frac{\pi}{2})$`, String.raw`$(-\frac{\pi}{2}, \frac{\pi}{2})$`, String.raw`$\mathbb R$`, String.raw`$\tan^{-1} x = \arctan x$`],
          [String.raw`$x^3$`, String.raw`$\mathbb R$`, String.raw`$\mathbb R$`, String.raw`$\sqrt[3]{x}$`],
        ] },
        { type: 'steps', title: String.raw`Example: invert $y = e^{2x} + 1$`, steps: [
          String.raw`Solve for $x$ in terms of $y$. First isolate the exponential: $e^{2x} = y - 1$.`,
          String.raw`Take the natural logarithm of both sides (allowed when $y > 1$): $2x = \ln(y - 1)$.`,
          String.raw`Divide by 2 and rename the variable: $f^{-1}(x) = \tfrac{1}{2}\ln(x - 1)$ for $x > 1$.`,
        ] },
        { type: 'quiz', question: String.raw`What is $\sin^{-1}\!\big(\sin(3\pi/4)\big)$?`, choices: [String.raw`$3\pi/4$`, String.raw`$\pi/4$`, String.raw`$-\pi/4$`, String.raw`$\sqrt{2}/2$`], answer: 1, explain: String.raw`$\sin(3\pi/4) = \sqrt2/2$, and $\sin^{-1}$ returns the angle in $[-\pi/2, \pi/2]$ with that sine, which is $\pi/4$ — not $3\pi/4$.` },
      ],
    },
    {
      id: 'symmetry',
      title: 'Even and odd functions',
      blocks: [
        { type: 'text', html: String.raw`<p>A function is <b>even</b> if $f(-x) = f(x)$ (mirror symmetric in the $y$-axis, like $x^2$ or $\cos x$) and <b>odd</b> if $f(-x) = -f(x)$ (symmetric under a half-turn about the origin, like $x^3$ or $\sin x$). Symmetry will save a lot of work with integrals: over a symmetric interval $[-a, a]$ the signed area of an odd function is exactly zero.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Signed area of an odd function on [-a, a]',
          functions: [{ expr: 'x.^3 - 2*x + m*x.^2', label: '$x^3 - 2x + m x^2$' }],
          params: { a: { min: 0.2, max: 2.2, value: 1.8, label: '$a$' }, m: { min: 0, max: 1.5, value: 0, label: 'even part $m$' } },
          shade: { expr: 'x.^3 - 2*x + m*x.^2', from: '-a', to: 'a', signed: true },
          xlim: [-2.5, 2.5], ylim: [-4, 4],
          readout: 'Signed area $= \\frac{2m a^3}{3} = {{2*m*a^3/3}}$. With $m = 0$ the function is odd and the blue and red areas cancel.',
        } },
        { type: 'callout', kind: 'thm', title: 'Useful facts', html: String.raw`<ul><li>odd · odd = even, even · even = even, odd · even = odd.</li><li>If $f$ is odd, $\int_{-a}^{a} f(x)\,\mathrm d x = 0$. If $f$ is even, $\int_{-a}^{a} f(x)\,\mathrm d x = 2\int_0^a f(x)\,\mathrm d x$.</li><li>To <i>prove</i> oddness, compute $f(-x)$ and show it equals $-f(x)$; a picture is only a hint.</li></ul>` },
        { type: 'quiz', question: String.raw`Which function is odd?`, choices: [String.raw`$x\sin x$`, String.raw`$x^2\cos x$`, String.raw`$\dfrac{\sin x}{x}$`, String.raw`$x^3\cos x$`], answer: 3, explain: String.raw`$x^3$ is odd and $\cos x$ is even, so the product is odd. The others are even: $x\sin x$ is odd·odd, and $\frac{\sin x}{x}$ is odd/odd.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'live-editor-tour',
      title: 'Your first Live Script',
      blocks: [
        { type: 'text', html: String.raw`<p>Homework and exams in this course are written in the <b>MATLAB Live Editor</b>, because the electronic exam rooms do not allow pen and paper. A Live Script mixes three kinds of content:</p><ul><li><b>Text</b> — your explanation in English. Graders expect a sentence saying <i>what you are about to do</i> before each piece of mathematics.</li><li><b>Equations</b> — typed in LaTeX after pressing <b>Ctrl+Shift+L</b> (Cmd+Shift+L on Mac). An equation can sit inside a sentence or on its own line.</li><li><b>Code</b> — MATLAB, for plots and numerical checks. Toggle a line between text and code with <b>Alt+Enter</b>.</li></ul><p>This is what a short, good answer looks like:</p>` },
        { type: 'livescript', caption: 'Example answer (read-only; press Run code to execute it)', blocks: [
          { type: 'heading', content: 'Problem 1 (Attempted)' },
          { type: 'text', content: 'We find the domain of $f(x) = \\frac{\\sqrt{x+3}}{x-1}$. The square root requires a non-negative argument and the denominator must not vanish:' },
          { type: 'equation', content: String.raw`x + 3 \ge 0 \quad\text{and}\quad x - 1 \ne 0 .` },
          { type: 'text', content: 'Hence the domain is $[-3, 1) \\cup (1, \\infty)$. We confirm the vertical asymptote at $x = 1$ with a plot:' },
          { type: 'code', content: 'f = @(x) sqrt(x+3) ./ (x-1);\nfplot(f, [-3, 5])\nylim([-10 10])\ngrid on' },
        ] },
        { type: 'text', html: String.raw`<p>The LaTeX editor understands the commands below. In this app the exercises check your LaTeX by comparing the typeset result, so spacing and optional braces do not matter.</p>` },
        { type: 'table', head: ['Type', 'Result'], rows: [
          [String.raw`<code>x^2</code>, <code>x^{10}</code>`, String.raw`$x^2,\ x^{10}$`],
          [String.raw`<code>\frac{1}{1-x}</code>`, String.raw`$\frac{1}{1-x}$`],
          [String.raw`<code>\sqrt{x+3}</code>`, String.raw`$\sqrt{x+3}$`],
          [String.raw`<code>\sin(4x)</code>, <code>e^{-x^2}</code>, <code>\ln x</code>`, String.raw`$\sin(4x),\ e^{-x^2},\ \ln x$`],
        ] },
        { type: 'latex', prompt: 'Type the function from Homework 0, Problem 1:', target: String.raw`F_1(x) = \frac{x}{1-x}`, hint: String.raw`Subscripts use <code>_</code>: <code>F_1</code>.` },
        { type: 'latex', prompt: 'Type this square root expression:', target: String.raw`y = -x\sqrt{x+3}` },
        { type: 'latex', prompt: 'Type this exponential (braces group a multi-character exponent):', target: String.raw`f(x) = x e^{-x^2}`, accept: [String.raw`f(x) = xe^{-x^2}`] },
        { type: 'latex', prompt: 'Type this trigonometric expression:', target: String.raw`\frac{\sin 4x}{7 - 2\cos 4x}`, hint: String.raw`<code>\sin</code> and <code>\cos</code> set the function names upright.` },
        { type: 'callout', kind: 'exam', html: String.raw`<p>Graders deduct points for solutions that are only formulas. One short English sentence per step is enough: <i>"We substitute $u = 3x - 2$, so that $\mathrm d u = 3\,\mathrm d x$."</i></p>` },
      ],
    },
    {
      id: 'anonymous-functions',
      title: 'Functions in MATLAB: @(x) and element-wise operators',
      blocks: [
        { type: 'text', html: String.raw`<p>In MATLAB a mathematical function is written as an <b>anonymous function</b>: <code>f = @(x) x.^2 + 1;</code>. The name before <code>=</code> is the handle, <code>@(x)</code> lists the input, and the expression after it is the formula. Call it like <code>f(3)</code>.</p><p>MATLAB works on whole vectors at once, so the arithmetic must be <b>element-wise</b>: use <code>.*</code>, <code>./</code> and <code>.^</code> whenever both sides may be vectors. Plotting and integration functions call your function with a vector of many $x$ values.</p>` },
        { type: 'code', caption: 'Try it: change the formula and press Run.', editable: true, code: `f = @(x) x.^2 .* exp(-x);   % element-wise product and power
f(1)                          % a single value
x = [0 1 2 3];
f(x)                          % four values at once
fplot(f, [0 8])
grid on
title('f(x) = x^2 e^{-x}')` },
        { type: 'callout', kind: 'warn', title: 'The most common MATLAB error', html: String.raw`<p><code>@(x) x^2</code> works for a single number but fails for a vector, because <code>^</code> means <i>matrix</i> power. Run the block below and read the error message — you will see it again.</p>` },
        { type: 'code', expectError: true, code: `g = @(x) x^2;
g([1 2 3])` },
        { type: 'matlab', prompt: String.raw`Define the function $f(x) = x\sqrt{x+3}$ as an anonymous function <code>f</code> (vectorised) and store the value $f(1)$ in the variable <code>y</code>.`, starter: `f = @(x) 0;   % replace 0 by the formula\ny = 0;          % replace 0 by f(1)`, solution: `f = @(x) x .* sqrt(x + 3);\ny = f(1);`, checks: [{ var: 'f', isFunction: true }, { var: 'y', value: 2 }], hint: String.raw`Use <code>.*</code> between <code>x</code> and <code>sqrt(x + 3)</code>.` },
        { type: 'matlab', prompt: String.raw`Plot $g(x) = \dfrac{\sin x}{x}$ on $[-10, 10]$ with <code>fplot</code> and turn the grid on. Your function must be vectorised (no warning).`, starter: `g = @(x) 0;   % replace 0 by the formula\nfplot(g, [-10 10])\n`, solution: `g = @(x) sin(x) ./ x;\nfplot(g, [-10 10])\ngrid on`, checks: [{ figure: true }, { noWarning: true, message: 'fplot warned that your function is not vectorised — use ./ instead of /.' }, { uses: 'fplot' }] },
        { type: 'matlab', prompt: String.raw`Check numerically that $f(x) = x^3\cos x$ is odd: store <code>v = f(1.7)</code> and <code>d = f(-1.7) + f(1.7)</code>, which should be (numerically) zero.`, starter: `f = @(x) 0;   % replace 0 by the formula\nv = 0;         % replace 0 by f(1.7)\nd = 0          % replace 0 by f(-1.7) + f(1.7)`, solution: `f = @(x) x.^3 .* cos(x);\nv = f(1.7);\nd = f(-1.7) + f(1.7)`, checks: [{ var: 'v', value: '1.7^3*cos(1.7)' }, { var: 'd', value: 0, tol: 1e-12 }] },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Composition',
      difficulty: 'core',
      statement: String.raw`<p>Let $f(x) = x^2 + 1$ and $g(x) = \sqrt{x}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $(f \circ g)(4) = f\big(g(4)\big)$.`, kind: 'numeric', answer: '5', hint: String.raw`First $g(4)$, then put the result into $f$.`, solution: String.raw`$g(4) = 2$, so $f(g(4)) = f(2) = 2^2 + 1 = 5$.` },
        { label: '(b)', prompt: String.raw`Give the formula of $(g \circ f)(x)$.`, kind: 'expression', variable: 'x', answer: 'sqrt(x.^2+1)', domain: [-2, 2], solution: String.raw`$(g\circ f)(x) = g\big(f(x)\big) = \sqrt{x^2+1}$, defined for all real $x$.` },
      ],
    },
    {
      id: 'a2',
      title: 'Inverse function',
      difficulty: 'core',
      statement: String.raw`<p>Let $f(x) = 3\ln(x - 2)$ for $x > 2$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Find $f^{-1}(x)$.`, kind: 'expression', variable: 'x', answer: '2 + exp(x/3)', domain: [-2, 3], hint: String.raw`Write $y = 3\ln(x-2)$ and solve for $x$.`, solution: String.raw`From $y = 3\ln(x - 2)$ we get $\ln(x-2) = y/3$, so $x = 2 + e^{y/3}$. Renaming, $f^{-1}(x) = 2 + e^{x/3}$.` },
        { label: '(b)', prompt: String.raw`What is the range of $f^{-1}$?`, kind: 'choice', choices: [String.raw`$\mathbb R$`, String.raw`$(0, \infty)$`, String.raw`$(2, \infty)$`, String.raw`$[2, \infty)$`], answer: 2, solution: String.raw`The range of $f^{-1}$ is the domain of $f$, which is $(2, \infty)$.` },
      ],
    },
    {
      id: 'a3',
      title: 'Symmetry',
      difficulty: 'core',
      statement: String.raw`<p>Classify each function as even, odd or neither.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$f(x) = x^2\sin(3x)$`, kind: 'choice', choices: ['even', 'odd', 'neither'], answer: 1, solution: String.raw`$f(-x) = (-x)^2\sin(-3x) = -x^2\sin 3x = -f(x)$: odd.` },
        { label: '(b)', prompt: String.raw`$f(x) = e^{-x^2}\cos x$`, kind: 'choice', choices: ['even', 'odd', 'neither'], answer: 0, solution: String.raw`Both factors are even, so the product is even.` },
        { label: '(c)', prompt: String.raw`$f(x) = e^{x}$`, kind: 'choice', choices: ['even', 'odd', 'neither'], answer: 2, solution: String.raw`$f(-x) = e^{-x}$ is neither $e^{x}$ nor $-e^{x}$.` },
        { label: '(d)', prompt: String.raw`Using symmetry, evaluate $\displaystyle\int_{-2}^{2} x^2\sin(3x)\,\mathrm d x$.`, kind: 'numeric', answer: '0', solution: String.raw`The integrand is odd (part (a)) and the interval is symmetric, so the integral is $0$.` },
      ],
    },
    {
      id: 'a4',
      title: 'Domain and a first write-up',
      difficulty: 'challenge',
      statement: String.raw`<p>Let $h(x) = \dfrac{\ln(4 - x^2)}{x}$.</p>`,
      parts: [
        { label: '(a)', prompt: 'What is the domain of $h$?', kind: 'choice', choices: [String.raw`$(-2, 2)$`, String.raw`$(-2, 0) \cup (0, 2)$`, String.raw`$[-2, 2] \setminus \{0\}$`, String.raw`$(0, 2)$`], answer: 1, solution: String.raw`We need $4 - x^2 > 0$, i.e. $-2 < x < 2$, and $x \ne 0$.` },
        { label: '(b)', prompt: String.raw`Is $h$ even, odd or neither? Write a short Live Script answer that proves it (compute $h(-x)$), and confirm with a plot.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 4 (Attempted)' },
        { type: 'text', content: 'We compute $h(-x)$ directly from the definition, using that $(-x)^2 = x^2$:' },
        { type: 'equation', content: String.raw`h(-x) = \frac{\ln\left(4 - (-x)^2\right)}{-x} = -\frac{\ln\left(4 - x^2\right)}{x} = -h(x).` },
        { type: 'text', content: 'Therefore $h$ is odd. The plot shows the half-turn symmetry about the origin:' },
        { type: 'code', content: 'h = @(x) log(4 - x.^2) ./ x;\nfplot(h, [-1.99 1.99])\ngrid on' },
      ],
    },
  ],
};
