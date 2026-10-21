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
      title: 'Functions, graphs and domains',
      blocks: [
        { type: 'text', html: String.raw`<p>A <b>function</b> $f$ is a rule that takes an input number $x$ and gives back exactly one output number $f(x)$. For example $f(x) = x^2$ takes $3$ and gives back $9$. The <b>graph</b> of $f$ is the curve made of all the points $(x, f(x))$.</p><p>Most functions in this course are built from a few basic shapes by shifting and stretching them. Move the sliders and watch what each number does to the graph of $y = a\sin\big(b(x - c)\big) + d$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Transforming y = sin x',
          functions: [{ expr: 'sin(x)', label: '$\\sin x$', dash: true }, { expr: 'a*sin(b*(x-c)) + d', label: '$a\\sin\\big(b(x-c)\\big)+d$' }],
          params: { a: { min: -3, max: 3, value: 1.5, label: '$a$' }, b: { min: 0.2, max: 4, value: 1, label: '$b$' }, c: { min: -3, max: 3, value: 0, label: '$c$' }, d: { min: -2, max: 2, value: 0, label: '$d$' } },
          xlim: [-7, 7], ylim: [-4, 4],
          animate: { param: 'c', from: -3, to: 3, duration: 5000 },
          readout: 'Period $2\\pi/b = {{2*pi/b}}$, amplitude $|a| = {{abs(a)}}$.',
        } },
        { type: 'table', head: ['Change', 'Effect on the graph'], rows: [
          [String.raw`$a f(x)$`, String.raw`stretched vertically by the factor $a$ (flipped upside down if $a<0$)`],
          [String.raw`$f(x) + d$`, String.raw`moved up by $d$`],
          [String.raw`$f(x - c)$`, String.raw`moved <b>right</b> by $c$ — the input must be $c$ larger to give the same output`],
          [String.raw`$f(bx)$`, String.raw`squeezed horizontally by the factor $b$`],
        ] },
        { type: 'text', html: String.raw`<p>The <b>domain</b> of $f$ is the set of all inputs $x$ for which the formula makes sense. In this course only three things can go wrong:</p><ul><li>dividing by zero — a denominator must not be $0$;</li><li>the square root of a negative number — the inside of $\sqrt{\ }$ must be $\ge 0$;</li><li>the logarithm of a number that is not positive — the inside of $\ln$ must be $> 0$.</li></ul><p>So finding a domain means: write down one condition for each of these, solve each condition, and combine them.</p>` },
        { type: 'refresher', title: 'solving a linear inequality', html: String.raw`<p>An inequality is solved like an equation: add or subtract the same number on both sides, multiply or divide both sides by the same number. The one extra rule: <b>multiplying or dividing by a negative number flips the sign</b> ($<$ becomes $>$).</p>`, steps: [
          { do: String.raw`$5 - x \ge 0$`, why: 'The inequality we want to solve.' },
          { do: String.raw`$-x \ge -5$`, why: String.raw`Subtract $5$ from both sides.` },
          { do: String.raw`$x \le 5$`, why: String.raw`Multiply both sides by $-1$. Because $-1$ is negative, $\ge$ flips to $\le$.` },
        ] },
        { type: 'steps', title: String.raw`Domain of $f(x) = \dfrac{\sqrt{x+3}}{x-1}$`, steps: [
          { do: String.raw`Square root: $\; x + 3 \ge 0$`, why: String.raw`The number inside $\sqrt{\ }$ must not be negative, so we write that as an inequality.` },
          { do: String.raw`$x \ge -3$`, why: String.raw`Subtract $3$ from both sides of $x + 3 \ge 0$.` },
          { do: String.raw`Denominator: $\; x - 1 \ne 0$`, why: 'We may never divide by zero, so the denominator must not equal 0.' },
          { do: String.raw`$x \ne 1$`, why: String.raw`Add $1$ to both sides of $x - 1 \ne 0$.` },
          { do: String.raw`Both together: $\; x \ge -3$ and $x \ne 1$`, why: 'The formula works only when every condition holds at the same time.' },
          { do: String.raw`Domain $= [-3, 1) \cup (1, \infty)$`, why: String.raw`Interval notation: all numbers from $-3$ (included, square bracket) up to $1$ (excluded, round bracket), joined ($\cup$) with all numbers above $1$.` },
        ] },
        { type: 'guided', title: String.raw`Domain of $g(x) = \dfrac{\sqrt{5 - x}}{x + 2}$`, problem: String.raw`Find the domain of $g(x) = \dfrac{\sqrt{5 - x}}{x + 2}$. Same three-part recipe as the example: square-root condition, denominator condition, combine.`, steps: [
          { prompt: String.raw`<b>Square root.</b> The inside $5 - x$ must be $\ge 0$. Solving gives $x \le c$. What is $c$?`, ask: { kind: 'numeric', answer: '5' }, hint: String.raw`Subtract 5 from both sides, then multiply by $-1$ and remember to flip the sign (see the refresher above).`, reveal: String.raw`$5 - x \ge 0 \;\Rightarrow\; -x \ge -5 \;\Rightarrow\; x \le 5$.` },
          { prompt: String.raw`<b>Denominator.</b> $x + 2$ must not be $0$. Which value of $x$ is forbidden?`, ask: { kind: 'numeric', answer: '-2' }, hint: String.raw`Solve $x + 2 = 0$.`, reveal: String.raw`$x + 2 \ne 0 \;\Rightarrow\; x \ne -2$.` },
          { prompt: '<b>Combine.</b> Which set is the domain?', ask: { kind: 'choice', choices: [String.raw`$(-\infty, 5]$`, String.raw`$(-\infty, -2) \cup (-2, 5]$`, String.raw`$(-2, 5]$`, String.raw`$[5, \infty)$`], answer: 1 }, hint: String.raw`All $x \le 5$, but with $x = -2$ removed.`, reveal: String.raw`Domain $= (-\infty, -2) \cup (-2, 5]$: everything up to and including $5$, except $-2$.` },
        ], finale: String.raw`You used exactly the recipe of the worked example: one condition per "dangerous" operation, solve each, combine.` },
        { type: 'refresher', title: String.raw`solving $x^2 < 9$ (a quadratic inequality)`, html: String.raw`<p>$x^2 < 9$ does <b>not</b> mean $x < 3$ only. Negative numbers square to positives too: $(-4)^2 = 16 > 9$ but $(-2)^2 = 4 < 9$. The solution is the interval between the two square roots.</p>`, steps: [
          { do: String.raw`$x^2 < 9$`, why: 'The inequality to solve.' },
          { do: String.raw`$|x| < 3$`, why: String.raw`Take square roots of both (non-negative) sides; $\sqrt{x^2} = |x|$, the distance of $x$ from $0$.` },
          { do: String.raw`$-3 < x < 3$`, why: String.raw`"Distance from $0$ is less than $3$" means $x$ lies strictly between $-3$ and $3$.` },
        ] },
        { type: 'steps', title: String.raw`Domain of $h(x) = \dfrac{\ln(9 - x^2)}{x}$`, steps: [
          { do: String.raw`Logarithm: $\; 9 - x^2 > 0$`, why: String.raw`$\ln$ is only defined for positive numbers (strictly greater than $0$).` },
          { do: String.raw`$x^2 < 9$`, why: String.raw`Add $x^2$ to both sides.` },
          { do: String.raw`$-3 < x < 3$`, why: 'Quadratic inequality, exactly as in the refresher.' },
          { do: String.raw`Denominator: $\; x \ne 0$`, why: 'We cannot divide by zero.' },
          { do: String.raw`Domain $= (-3, 0) \cup (0, 3)$`, why: String.raw`Numbers strictly between $-3$ and $3$, with $0$ removed. Round brackets because $-3$ and $3$ themselves are excluded (there $9 - x^2 = 0$ and $\ln 0$ is undefined).` },
        ] },
        { type: 'guided', title: String.raw`Domain of $k(x) = \dfrac{\ln(16 - x^2)}{x - 1}$`, problem: String.raw`Find the domain of $k(x) = \dfrac{\ln(16 - x^2)}{x - 1}$.`, steps: [
          { prompt: String.raw`<b>Logarithm.</b> $16 - x^2 > 0$ gives $-c < x < c$. What is $c$?`, ask: { kind: 'numeric', answer: '4' }, hint: String.raw`Rewrite as $x^2 < 16$ and take the square root.`, reveal: String.raw`$16 - x^2 > 0 \Rightarrow x^2 < 16 \Rightarrow -4 < x < 4$.` },
          { prompt: '<b>Denominator.</b> Which $x$ is forbidden?', ask: { kind: 'numeric', answer: '1' }, hint: String.raw`Solve $x - 1 = 0$.`, reveal: String.raw`$x \ne 1$.` },
          { prompt: '<b>Combine.</b> The domain is:', ask: { kind: 'choice', choices: [String.raw`$(-4, 4)$`, String.raw`$(-4, 1) \cup (1, 4)$`, String.raw`$[-4, 1) \cup (1, 4]$`, String.raw`$(1, 4)$`], answer: 1 }, hint: 'Strict inequalities give round brackets.', reveal: String.raw`Domain $= (-4, 1) \cup (1, 4)$.` },
        ] },
        { type: 'quiz', question: String.raw`The graph of $y = (x-2)^2 + 1$ is the parabola $y = x^2$ moved …`, choices: ['2 left and 1 up', '2 right and 1 up', '2 right and 1 down', '1 right and 2 up'], answer: 1, explain: String.raw`$x \mapsto x - 2$ shifts right by 2, and $+1$ shifts up by 1. The vertex is at $(2, 1)$.` },
      ],
    },
    {
      id: 'composition',
      title: 'Combining functions: composition',
      blocks: [
        { type: 'text', html: String.raw`<p><b>Composition</b> means feeding the output of one function into another. $(f \circ g)(x)$ is read "$f$ after $g$" and means $f\big(g(x)\big)$: first apply $g$, then apply $f$ to the result. The order matters — $f\circ g$ and $g \circ f$ are usually different.</p><p>Composition is everywhere later on: $e^{-x^2}$ is $e^{u}$ with $u = -x^2$ inside it, and the chain rule and the substitution method are both about spotting this "inside function".</p>` },
        { type: 'steps', title: String.raw`Let $f(x) = x^2 - 1$ and $g(x) = 2x + 3$. Compute $(f\circ g)(1)$ and the formula of $(g \circ f)(x)$.`, steps: [
          { do: String.raw`$g(1) = 2\cdot 1 + 3 = 5$`, why: String.raw`$(f\circ g)(1) = f\big(g(1)\big)$, so the inside function $g$ goes first. Put $x = 1$ into $g$.` },
          { do: String.raw`$f(5) = 5^2 - 1 = 24$`, why: String.raw`Now feed that output, $5$, into $f$.` },
          { do: String.raw`$(f\circ g)(1) = 24$`, why: 'That is the value of the composition.' },
          { do: String.raw`$(g\circ f)(x) = g\big(f(x)\big) = g(x^2 - 1)$`, why: String.raw`For a formula, put the whole expression $f(x) = x^2 - 1$ into $g$.` },
          { do: String.raw`$= 2(x^2 - 1) + 3$`, why: String.raw`$g$ doubles its input and adds $3$. Its input is now $x^2 - 1$, so write it in brackets where $x$ was.` },
          { do: String.raw`$= 2x^2 - 2 + 3 = 2x^2 + 1$`, why: 'Multiply out the bracket and collect the numbers.' },
        ] },
        { type: 'guided', title: String.raw`$f(x) = x^2 + 4$ and $g(x) = x - 3$`, problem: String.raw`With $f(x) = x^2 + 4$ and $g(x) = x - 3$, compute $(f\circ g)(5)$ and find the formula of $(f\circ g)(x)$.`, steps: [
          { prompt: String.raw`Inside first: what is $g(5)$?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`$g$ subtracts $3$.`, reveal: String.raw`$g(5) = 5 - 3 = 2$.` },
          { prompt: String.raw`Now apply $f$ to that number: $(f\circ g)(5) = f(2) = ?$`, ask: { kind: 'numeric', answer: '8' }, hint: String.raw`$f$ squares its input and adds $4$.`, reveal: String.raw`$f(2) = 2^2 + 4 = 8$.` },
          { prompt: String.raw`Formula: put $g(x) = x - 3$ into $f$. Type $(f\circ g)(x)$ (MATLAB syntax, e.g. <code>(x-3)^2+4</code>).`, ask: { kind: 'expression', answer: '(x-3).^2+4', variable: 'x', label: '(f∘g)(x) =' }, hint: String.raw`Replace every $x$ in $x^2 + 4$ by the bracket $(x - 3)$.`, reveal: String.raw`$(f\circ g)(x) = f(x-3) = (x-3)^2 + 4$.` },
        ] },
        { type: 'quiz', question: String.raw`With $f(x) = x^2$ and $g(x) = x + 1$, which is $(g\circ f)(x)$?`, choices: [String.raw`$(x+1)^2$`, String.raw`$x^2 + 1$`, String.raw`$x^2 + x$`, String.raw`$2x + 1$`], answer: 1, explain: String.raw`$(g\circ f)(x) = g\big(f(x)\big) = g(x^2) = x^2 + 1$. The other order gives $(x+1)^2$.` },
      ],
    },
    {
      id: 'elementary-functions',
      title: 'The elementary functions and inverses',
      blocks: [
        { type: 'text', html: String.raw`<p>The building blocks are polynomials, $e^x$ and $\ln x$, the trigonometric functions and their inverses. The sine and cosine are easiest to remember from the unit circle: $\cos\theta$ is the horizontal and $\sin\theta$ the vertical coordinate of the point at angle $\theta$ (in <b>radians</b>, as always in calculus).</p>` },
        { type: 'widget', name: 'unitcircle', config: {} },
        { type: 'text', html: String.raw`<p>The <b>inverse</b> $f^{-1}$ undoes $f$: if $f$ turns $x$ into $y$, then $f^{-1}$ turns $y$ back into $x$. Its graph is the mirror image of the graph of $f$ in the line $y = x$. The natural logarithm undoes the exponential: $\ln(e^{a}) = a$ and $e^{\ln b} = b$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'A function and its inverse are mirror images in y = x',
          functions: [{ expr: 'exp(k*x)', label: '$e^{kx}$' }, { expr: 'log(x)/k', label: '$\\frac{1}{k}\\ln x$' }, { expr: 'x', label: '$y = x$', dash: true }],
          params: { k: { min: 0.3, max: 2, value: 1, label: '$k$' } },
          xlim: [-4, 6], ylim: [-4, 6], axisEqual: true,
        } },
        { type: 'refresher', title: 'logarithm and exponential rules', html: String.raw`<ul><li>$\ln(e^{a}) = a$ and $e^{\ln b} = b$ for $b>0$ — each undoes the other.</li><li>To free $x$ from inside $e^{\dots}$, take $\ln$ of both sides. To free $x$ from inside $\ln(\dots)$, raise $e$ to both sides.</li><li>Example: $e^{x} = 7 \Rightarrow x = \ln 7$. And $\ln x = 2 \Rightarrow x = e^{2}$.</li></ul>` },
        { type: 'steps', title: String.raw`Invert $y = e^{2x} + 1$`, steps: [
          { do: String.raw`$y = e^{2x} + 1$`, why: String.raw`Start from $y = f(x)$. The goal is to solve for $x$, i.e. write $x = \text{(something with } y)$.` },
          { do: String.raw`$e^{2x} = y - 1$`, why: String.raw`Subtract $1$ from both sides so the exponential stands alone.` },
          { do: String.raw`$2x = \ln(y - 1)$`, why: String.raw`Take $\ln$ of both sides; $\ln(e^{2x}) = 2x$ by the refresher rule. This needs $y - 1 > 0$.` },
          { do: String.raw`$x = \tfrac{1}{2}\ln(y - 1)$`, why: String.raw`Divide both sides by $2$.` },
          { do: String.raw`$f^{-1}(x) = \tfrac{1}{2}\ln(x - 1), \quad x > 1$`, why: String.raw`It is customary to call the input of $f^{-1}$ "$x$" again, so rename $y \to x$.` },
          { do: String.raw`Check: $f^{-1}(f(0)) = \tfrac12\ln(e^{0}+1-1) = \tfrac12 \ln 1 = 0$ ✓`, why: String.raw`A quick check with one number: $f$ then $f^{-1}$ must give back the start value $0$.` },
        ] },
        { type: 'guided', title: String.raw`Invert $y = 4e^{x/2} - 3$`, problem: String.raw`Find the inverse of $f(x) = 4e^{x/2} - 3$. Same moves as the example: isolate the exponential, take $\ln$, solve for $x$, rename.`, steps: [
          { prompt: String.raw`Add $3$ and divide by $4$: $e^{x/2} = \;?$ (type it in terms of <code>y</code>)`, ask: { kind: 'expression', answer: '(y+3)/4', variable: 'y', domain: [0, 5], label: 'e^(x/2) =' }, hint: String.raw`From $y = 4e^{x/2} - 3$: first $y + 3 = 4e^{x/2}$.`, reveal: String.raw`$y + 3 = 4e^{x/2} \;\Rightarrow\; e^{x/2} = \dfrac{y+3}{4}$.` },
          { prompt: String.raw`Take $\ln$ of both sides. What is $\frac{x}{2}$?`, ask: { kind: 'expression', answer: 'log((y+3)/4)', variable: 'y', domain: [0, 5], label: 'x/2 =' }, hint: String.raw`$\ln(e^{x/2}) = x/2$.`, reveal: String.raw`$\dfrac{x}{2} = \ln\dfrac{y+3}{4}$.` },
          { prompt: String.raw`Multiply by $2$ and rename $y \to x$: $f^{-1}(x) = \;?$`, ask: { kind: 'expression', answer: '2*log((x+3)/4)', variable: 'x', domain: [0, 5], label: 'f⁻¹(x) =' }, hint: 'Multiply the right-hand side by 2.', reveal: String.raw`$f^{-1}(x) = 2\ln\dfrac{x+3}{4}$, defined for $x > -3$.` },
        ] },
        { type: 'table', head: ['Function', 'Domain', 'Range', 'Inverse'], rows: [
          [String.raw`$e^x$`, String.raw`$\mathbb R$`, String.raw`$(0, \infty)$`, String.raw`$\ln x$`],
          [String.raw`$\sin x$ on $[-\frac{\pi}{2}, \frac{\pi}{2}]$`, String.raw`$[-\frac{\pi}{2}, \frac{\pi}{2}]$`, String.raw`$[-1, 1]$`, String.raw`$\sin^{-1} x = \arcsin x$`],
          [String.raw`$\tan x$ on $(-\frac{\pi}{2}, \frac{\pi}{2})$`, String.raw`$(-\frac{\pi}{2}, \frac{\pi}{2})$`, String.raw`$\mathbb R$`, String.raw`$\tan^{-1} x = \arctan x$`],
        ] },
        { type: 'callout', kind: 'key', title: 'Domain and range swap', html: String.raw`<p>The range of $f^{-1}$ is the domain of $f$, and the domain of $f^{-1}$ is the range of $f$ — because the inverse runs the same arrows backwards.</p>` },
        { type: 'quiz', question: String.raw`What is $\sin^{-1}\!\big(\sin(3\pi/4)\big)$?`, choices: [String.raw`$3\pi/4$`, String.raw`$\pi/4$`, String.raw`$-\pi/4$`, String.raw`$\sqrt{2}/2$`], answer: 1, explain: String.raw`$\sin(3\pi/4) = \sqrt2/2$, and $\sin^{-1}$ returns the angle in $[-\pi/2, \pi/2]$ with that sine, which is $\pi/4$ — not $3\pi/4$.` },
      ],
    },
    {
      id: 'symmetry',
      title: 'Even and odd functions',
      blocks: [
        { type: 'text', html: String.raw`<p>A function is <b>even</b> if $f(-x) = f(x)$ for every $x$ — its graph is a mirror image in the $y$-axis, like $x^2$ or $\cos x$. It is <b>odd</b> if $f(-x) = -f(x)$ — its graph looks the same after a half-turn about the origin, like $x^3$ or $\sin x$.</p><p>Why care: over a symmetric interval $[-a, a]$ the signed area of an odd function is exactly zero. Move the sliders.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Signed area of an odd function on [-a, a]',
          functions: [{ expr: 'x.^3 - 2*x + m*x.^2', label: '$x^3 - 2x + m x^2$' }],
          params: { a: { min: 0.2, max: 2.2, value: 1.8, label: '$a$' }, m: { min: 0, max: 1.5, value: 0, label: 'even part $m$' } },
          shade: { expr: 'x.^3 - 2*x + m*x.^2', from: '-a', to: 'a', signed: true },
          xlim: [-2.5, 2.5], ylim: [-4, 4],
          readout: 'Signed area $= \\frac{2m a^3}{3} = {{2*m*a^3/3}}$. With $m = 0$ the function is odd and the blue and red areas cancel.',
        } },
        { type: 'refresher', title: 'powers of a negative number', html: String.raw`<p>$(-x)^n$: an <b>even</b> power removes the minus sign, an <b>odd</b> power keeps it. $(-x)^2 = x^2$, $(-x)^3 = -x^3$. Also $\sin(-x) = -\sin x$ (sine is odd) and $\cos(-x) = \cos x$ (cosine is even).</p>` },
        { type: 'steps', title: String.raw`Is $f(x) = x^3\cos x$ even, odd or neither?`, steps: [
          { do: String.raw`$f(-x) = (-x)^3\cos(-x)$`, why: String.raw`The test always starts the same way: replace every $x$ in the formula by $-x$.` },
          { do: String.raw`$(-x)^3 = -x^3$`, why: 'Odd power keeps the minus sign (refresher).' },
          { do: String.raw`$\cos(-x) = \cos x$`, why: 'Cosine is even.' },
          { do: String.raw`$f(-x) = -x^3\cos x$`, why: 'Put the two simplified pieces together.' },
          { do: String.raw`$f(-x) = -\big(x^3\cos x\big) = -f(x)$`, why: String.raw`Compare with the original $f(x) = x^3\cos x$: we got exactly minus the original.` },
          { do: String.raw`$f$ is odd.`, why: String.raw`That is the definition of odd: $f(-x) = -f(x)$ for every $x$.` },
        ] },
        { type: 'steps', title: String.raw`Use symmetry to evaluate $\displaystyle\int_{-2}^{2} x^3\cos x\,\mathrm d x$`, steps: [
          { do: String.raw`The integrand $x^3\cos x$ is odd.`, why: 'We just proved this in the previous example.' },
          { do: String.raw`The interval $[-2, 2]$ is symmetric about $0$.`, why: String.raw`It has the form $[-a, a]$ with $a = 2$.` },
          { do: String.raw`$\displaystyle\int_{-2}^{2} x^3\cos x\,\mathrm d x = 0$`, why: 'The area left of 0 is the mirror image of the area right of 0 with the opposite sign, so they cancel exactly — no antiderivative needed.' },
        ] },
        { type: 'guided', title: String.raw`Is $f(x) = x\sin x$ even or odd?`, problem: String.raw`Decide whether $f(x) = x\sin x$ is even, odd or neither, using the same test.`, steps: [
          { prompt: String.raw`Replace $x$ by $-x$ and simplify. Type $f(-x)$ in terms of $x$.`, ask: { kind: 'expression', answer: 'x.*sin(x)', variable: 'x', label: 'f(-x) =' }, hint: String.raw`$(-x)\sin(-x)$: the factor $-x$ and $\sin(-x) = -\sin x$ give two minus signs.`, reveal: String.raw`$f(-x) = (-x)\sin(-x) = (-x)(-\sin x) = x\sin x$.` },
          { prompt: 'Compare with the original. The function is:', ask: { kind: 'choice', choices: ['even', 'odd', 'neither'], answer: 0 }, hint: String.raw`Is $f(-x)$ equal to $f(x)$, or to $-f(x)$?`, reveal: String.raw`$f(-x) = f(x)$, so $f$ is <b>even</b>.` },
          { prompt: String.raw`Does symmetry make $\int_{-1}^{1} x\sin x\,\mathrm d x$ zero?`, ask: { kind: 'choice', choices: ['yes', 'no — only odd functions cancel'], answer: 1 }, hint: 'The cancellation trick is for odd functions.', reveal: String.raw`No. For an even function the two halves are equal, so $\int_{-1}^{1} = 2\int_0^1$, which is positive here.` },
        ] },
        { type: 'callout', kind: 'thm', title: 'Useful facts', html: String.raw`<ul><li>odd · odd = even, even · even = even, odd · even = odd.</li><li>If $f$ is odd, $\int_{-a}^{a} f(x)\,\mathrm d x = 0$. If $f$ is even, $\int_{-a}^{a} f(x)\,\mathrm d x = 2\int_0^a f(x)\,\mathrm d x$.</li><li>To <i>prove</i> oddness, compute $f(-x)$ and show it equals $-f(x)$; a picture is only a hint.</li></ul>` },
        { type: 'quiz', question: String.raw`Which function is odd?`, choices: [String.raw`$x\sin x$`, String.raw`$x^2\cos x$`, String.raw`$\dfrac{\sin x}{x}$`, String.raw`$x^3\cos x$`], answer: 3, explain: String.raw`$x^3$ is odd and $\cos x$ is even, so the product is odd. The others are even.` },
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
  assignIntro: String.raw`<p>Every problem below is the same type as a worked example and a guided exercise you have already done — the link above each problem takes you back to them. If you get stuck, use the hints one at a time, then "Walk me through it".</p>`,
  assignments: [
    {
      id: 'a1',
      title: 'Composition',
      difficulty: 'core',
      examples: ['composition'],
      statement: String.raw`<p>Let $f(x) = x^2 + 1$ and $g(x) = \sqrt{x}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $(f \circ g)(4) = f\big(g(4)\big)$.`, kind: 'numeric', answer: '5',
          hints: [String.raw`Inside function first: which function is applied to $4$ first?`, String.raw`Compute $g(4) = \sqrt 4$, then put that number into $f$.`, String.raw`$g(4) = 2$, so you need $f(2) = 2^2 + 1$.`],
          walkthrough: [
            { do: String.raw`$g(4) = \sqrt{4} = 2$`, why: String.raw`$(f\circ g)(4) = f(g(4))$: the inside function $g$ acts first.` },
            { do: String.raw`$f(2) = 2^2 + 1 = 5$`, why: String.raw`Feed the output $2$ into $f$.` },
            { do: String.raw`$(f\circ g)(4) = 5$`, why: 'That is the answer.' },
          ] },
        { label: '(b)', prompt: String.raw`Give the formula of $(g \circ f)(x)$.`, kind: 'expression', variable: 'x', answer: 'sqrt(x.^2+1)', domain: [-2, 2],
          hints: [String.raw`$(g\circ f)(x) = g\big(f(x)\big)$: which function is on the inside now?`, String.raw`Put the whole expression $f(x) = x^2 + 1$ into $g$, which takes the square root.`, String.raw`$g(x^2 + 1) = \sqrt{\;\cdot\;}$ of that bracket.`],
          walkthrough: [
            { do: String.raw`$(g\circ f)(x) = g\big(f(x)\big)$`, why: String.raw`Definition of composition: $f$ acts first, then $g$.` },
            { do: String.raw`$= g(x^2 + 1)$`, why: String.raw`Replace $f(x)$ by its formula.` },
            { do: String.raw`$= \sqrt{x^2 + 1}$`, why: String.raw`$g$ takes the square root of its input.` },
          ] },
      ],
    },
    {
      id: 'a2',
      title: 'Inverse function',
      difficulty: 'core',
      examples: ['elementary-functions'],
      statement: String.raw`<p>Let $f(x) = 3\ln(x - 2)$ for $x > 2$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Find $f^{-1}(x)$.`, kind: 'expression', variable: 'x', answer: '2 + exp(x/3)', domain: [-2, 3],
          hints: ['Write $y = 3\\ln(x-2)$ and solve for $x$, like the worked example — but here $x$ is inside a logarithm, not an exponential.', String.raw`Divide by $3$ first, then raise $e$ to both sides: $e^{\ln(x-2)} = x - 2$.`, String.raw`$\ln(x - 2) = y/3$, so $x - 2 = e^{y/3}$.`],
          walkthrough: [
            { do: String.raw`$y = 3\ln(x - 2)$`, why: String.raw`Start from $y = f(x)$; the goal is $x$ in terms of $y$.` },
            { do: String.raw`$\ln(x - 2) = \dfrac{y}{3}$`, why: String.raw`Divide both sides by $3$ so the logarithm stands alone.` },
            { do: String.raw`$x - 2 = e^{y/3}$`, why: String.raw`Raise $e$ to both sides: $e^{\ln(x-2)} = x - 2$ (exp undoes ln).` },
            { do: String.raw`$x = 2 + e^{y/3}$`, why: String.raw`Add $2$ to both sides.` },
            { do: String.raw`$f^{-1}(x) = 2 + e^{x/3}$`, why: String.raw`Rename $y \to x$.` },
          ] },
        { label: '(b)', prompt: String.raw`What is the range of $f^{-1}$?`, kind: 'choice', choices: [String.raw`$\mathbb R$`, String.raw`$(0, \infty)$`, String.raw`$(2, \infty)$`, String.raw`$[2, \infty)$`], answer: 2,
          hints: ['See the "Domain and range swap" box in the lesson.', String.raw`The range of $f^{-1}$ equals the domain of $f$. What does the problem say about $x$?`] },
      ],
    },
    {
      id: 'a3',
      title: 'Symmetry',
      difficulty: 'core',
      examples: ['symmetry'],
      statement: String.raw`<p>Classify each function as even, odd or neither, then use the result.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$f(x) = x^2\sin(3x)$`, kind: 'choice', choices: ['even', 'odd', 'neither'], answer: 1,
          hints: [String.raw`Replace $x$ by $-x$ everywhere.`, String.raw`$(-x)^2 = x^2$ and $\sin(-3x) = -\sin 3x$. Compare the result with $f(x)$.`] },
        { label: '(b)', prompt: String.raw`$f(x) = e^{-x^2}\cos x$`, kind: 'choice', choices: ['even', 'odd', 'neither'], answer: 0,
          hints: [String.raw`What happens to $-x^2$ when $x \to -x$?`, String.raw`$e^{-(-x)^2} = e^{-x^2}$ and $\cos(-x) = \cos x$: nothing changes.`] },
        { label: '(c)', prompt: String.raw`$f(x) = e^{x}$`, kind: 'choice', choices: ['even', 'odd', 'neither'], answer: 2,
          hints: [String.raw`Compute $f(-x) = e^{-x}$.`, String.raw`Is $e^{-x}$ equal to $e^{x}$ for every $x$? Is it equal to $-e^{x}$? Try $x = 1$.`] },
        { label: '(d)', prompt: String.raw`Using symmetry, evaluate $\displaystyle\int_{-2}^{2} x^2\sin(3x)\,\mathrm d x$.`, kind: 'numeric', answer: '0',
          hints: ['Look at your answer to (a) and at the interval.', 'Odd integrand + symmetric interval: see the second worked example in the symmetry lesson.'],
          walkthrough: [
            { do: String.raw`$x^2\sin(3x)$ is odd`, why: 'Part (a).' },
            { do: String.raw`$[-2, 2]$ is symmetric about $0$`, why: String.raw`It is $[-a, a]$ with $a = 2$.` },
            { do: String.raw`$\displaystyle\int_{-2}^{2} x^2\sin(3x)\,\mathrm d x = 0$`, why: 'The signed areas on the two halves cancel exactly.' },
          ] },
      ],
    },
    {
      id: 'a4',
      title: 'Domain, and a first write-up',
      difficulty: 'challenge',
      examples: ['graphs-transformations', 'symmetry'],
      statement: String.raw`<p>Let $h(x) = \dfrac{\ln(4 - x^2)}{x}$.</p>`,
      parts: [
        { label: '(a)', prompt: 'What is the domain of $h$?', kind: 'choice', choices: [String.raw`$(-2, 2)$`, String.raw`$(-2, 0) \cup (0, 2)$`, String.raw`$[-2, 2] \setminus \{0\}$`, String.raw`$(0, 2)$`], answer: 1,
          hints: [String.raw`Two conditions: one from $\ln$, one from the denominator — exactly like the second worked example in the domains lesson.`, String.raw`$4 - x^2 > 0$ gives $-2 < x < 2$; the denominator gives $x \ne 0$.`] },
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
