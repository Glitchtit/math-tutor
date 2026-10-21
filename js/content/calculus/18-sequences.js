// Module 18: Sequences — convergence, limit techniques, monotone and recursive sequences.
// Rewritten to the hand-holding standard: every technique is worked (steps), then guided, then assigned.

export default {
  id: 'sequences',
  number: 18,
  part: 'series',
  hw: 'HW5',
  title: 'Sequences',
  summary: 'Convergence of sequences with the ε–N picture, limit laws and rational sequences, conjugates, limits via functions (L\'Hôpital) and the squeeze theorem, factorial growth, (1 + a/n)^n-type limits via logarithms, n-th roots, oscillating divergent sequences, and monotone bounded and recursive sequences with fixed points.',
  intro: String.raw`<p>A sequence is a function whose inputs are the integers $n = 1, 2, 3, \dots$. Sequences are the language of the whole series part of the course: a series converges exactly when its sequence of partial sums does. This module builds the toolbox for computing limits $\lim_{n\to\infty} a_n$ and — just as important — for <b>proving</b> that a limit exists before you compute it.</p><p>Each lesson teaches <b>one</b> technique: you see it fully worked, then do one yourself step by step, and the assignments use exactly these techniques.</p>`,
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'convergence',
      title: 'Convergence: the ε–N picture',
      blocks: [
        { type: 'text', html: String.raw`<p>A <b>sequence</b> $\{a_n\}$ is a list of numbers $a_1, a_2, a_3, \dots$ given by a formula in the index $n$. The terms of $a_n = \dfrac{2n+1}{n+3}$ are plotted below together with a band of half-width $\varepsilon$ (the Greek letter epsilon, a small positive number) around $L = 2$. Shrink $\varepsilon$: the band gets thinner, the first index $N$ after which <i>every</i> term stays inside moves to the right — but such an $N$ always exists. That is what convergence means.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_n = (2n+1)/(n+3) and an ε-band around L = 2',
          a: '(2*n + 1)./(n + 3)', nmax: 60, L: 2, eps: 0.3, ylim: [0, 2.6],
        } },
        { type: 'callout', kind: 'def', title: 'Convergent sequence', html: String.raw`<p>The sequence $\{a_n\}$ <b>converges</b> to $L$, written $\lim_{n\to\infty} a_n = L$, if for every $\varepsilon > 0$ there is an index $N$ such that $|a_n - L| < \varepsilon$ for all $n \ge N$. A sequence that does not converge <b>diverges</b>; $a_n \to \infty$ is a special kind of divergence.</p>` },
        { type: 'steps', title: String.raw`Find $N$ for $a_n = \dfrac{2n+1}{n+3}$, $L = 2$, $\varepsilon = 0.3$`, steps: [
          { do: String.raw`$a_n - 2 = \dfrac{2n+1}{n+3} - \dfrac{2(n+3)}{n+3}$`, why: String.raw`To subtract, write $2$ with the same denominator $n + 3$.` },
          { do: String.raw`$= \dfrac{2n + 1 - 2n - 6}{n+3} = \dfrac{-5}{n+3}$`, why: 'Subtract the numerators; the 2n cancel.' },
          { do: String.raw`$|a_n - 2| = \dfrac{5}{n+3}$`, why: String.raw`Absolute value removes the minus sign ($n + 3 > 0$).` },
          { do: String.raw`$\dfrac{5}{n+3} < \varepsilon \iff n + 3 > \dfrac{5}{\varepsilon}$`, why: String.raw`Multiply both sides by the positive numbers $n + 3$ and $1/\varepsilon$.` },
          { do: String.raw`$n > \dfrac{5}{0.3} - 3 \approx 13.67$`, why: String.raw`Insert $\varepsilon = 0.3$ and subtract $3$.` },
          { do: String.raw`$N = 14$`, why: String.raw`The first integer above $13.67$. Compare with the widget. For every $\varepsilon > 0$ such an integer exists, hence $a_n \to 2$.` },
        ] },
        { type: 'quiz', question: String.raw`For $a_n = \dfrac{2n+1}{n+3}$ and $\varepsilon = 0.1$, which $N$ is the smallest that works?`, choices: ['$N = 14$', '$N = 47$', '$N = 48$', '$N = 50$'], answer: 2, explain: String.raw`$n > 5/0.1 - 3 = 47$, so the first integer is $48$ (at $n = 47$, $|a_n - 2| = 5/50 = 0.1$ is not $< 0.1$).` },
      ],
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'rational-limits',
      title: 'Limit laws and rational sequences',
      blocks: [
        { type: 'callout', kind: 'thm', title: 'Limit laws', html: String.raw`<p>If $a_n \to A$ and $b_n \to B$, then $a_n \pm b_n \to A \pm B$, $\;c\,a_n \to cA$, $\;a_n b_n \to AB$ and $a_n / b_n \to A/B$ provided $B \ne 0$. Constants are convergent sequences, and $\dfrac{1}{n^p} \to 0$ for every $p > 0$.</p>` },
        { type: 'text', html: String.raw`<p>A <b>rational sequence</b> is a quotient of two polynomials in $n$, like $\dfrac{6n^3 - n + 4}{2n^3 + 5n^2}$. Both top and bottom grow to infinity ("$\infty/\infty$"), so the quotient law cannot be used directly. The trick: divide numerator and denominator by the <b>highest power of $n$ in the denominator</b>. This does not change the fraction, but afterwards every term except the leading ones has the form $\frac{\text{number}}{n^p}$ and tends to $0$.</p>` },
        { type: 'refresher', title: String.raw`dividing each term by $n^3$`, html: String.raw`<p>Dividing a sum by $n^3$ means dividing <b>every</b> term by $n^3$, then simplifying each with the power rule $\dfrac{n^a}{n^b} = n^{a - b} = \dfrac{1}{n^{b-a}}$.</p>`, steps: [
          { do: String.raw`$\dfrac{6n^3}{n^3} = 6$`, why: 'Same power: they cancel.' },
          { do: String.raw`$\dfrac{n}{n^3} = \dfrac{1}{n^2}$`, why: String.raw`$n^{1-3} = n^{-2}$.` },
          { do: String.raw`$\dfrac{5n^2}{n^3} = \dfrac{5}{n}$`, why: String.raw`$n^{2-3} = n^{-1}$.` },
          { do: String.raw`$\dfrac{4}{n^3}$ stays $\dfrac{4}{n^3}$`, why: String.raw`A constant just gets $n^3$ underneath.` },
        ] },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{6n^3 - n + 4}{2n^3 + 5n^2}$`, steps: [
          { do: String.raw`Highest power in the denominator: $n^3$`, why: String.raw`The denominator $2n^3 + 5n^2$ has degree $3$.` },
          { do: String.raw`$\dfrac{6n^3 - n + 4}{2n^3 + 5n^2} = \dfrac{(6n^3 - n + 4)/n^3}{(2n^3 + 5n^2)/n^3}$`, why: String.raw`Divide top and bottom by the same number $n^3$; the value of the fraction is unchanged.` },
          { do: String.raw`$= \dfrac{6 - \frac{1}{n^2} + \frac{4}{n^3}}{2 + \frac{5}{n}}$`, why: 'Divide term by term (refresher).' },
          { do: String.raw`$\dfrac{1}{n^2} \to 0, \quad \dfrac{4}{n^3} \to 0, \quad \dfrac{5}{n} \to 0$`, why: String.raw`$\frac{1}{n^p} \to 0$ for $p > 0$, times a constant.` },
          { do: String.raw`numerator $\to 6$, denominator $\to 2 \ne 0$`, why: 'Sum law for the numerator and the denominator separately.' },
          { do: String.raw`$\lim = \dfrac{6}{2} = 3$`, why: String.raw`Quotient law — allowed because the denominator's limit $2$ is not $0$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{8n^3 + n}{5 - 4n^3}$`, problem: String.raw`Compute $\displaystyle\lim_{n\to\infty} \frac{8n^3 + n}{5 - 4n^3}$ by dividing by the highest power of $n$ in the denominator.`, steps: [
          { prompt: 'Which power of $n$ do you divide by?', ask: { kind: 'choice', choices: ['$n$', '$n^2$', '$n^3$'], answer: 2 }, hint: String.raw`Look at the denominator $5 - 4n^3$.`, reveal: String.raw`$n^3$: $\;\dfrac{8 + \frac{1}{n^2}}{\frac{5}{n^3} - 4}$.` },
          { prompt: 'What does the new denominator $\\frac{5}{n^3} - 4$ tend to?', ask: { kind: 'numeric', answer: '-4' }, hint: String.raw`$\frac{5}{n^3} \to 0$.`, reveal: String.raw`$0 - 4 = -4$ (not zero, so the quotient law applies).` },
          { prompt: 'And the limit of the whole sequence?', ask: { kind: 'numeric', answer: '-2' }, hint: String.raw`The numerator tends to $8$.`, reveal: String.raw`$\dfrac{8 + 0}{0 - 4} = -2$.` },
        ], finale: 'Rule of thumb you can now check: equal degrees give the ratio of the leading coefficients (here 8 / (−4)).' },
        { type: 'callout', kind: 'key', title: 'Rule of thumb (after you know why)', html: String.raw`<p>Equal degrees: the limit is the ratio of the leading coefficients. Higher degree in the denominator: the limit is $0$. Higher degree in the numerator: the sequence diverges to $\pm\infty$. In a written answer, still show the division.</p>` },
        { type: 'quiz', question: String.raw`$\displaystyle\lim_{n\to\infty} \frac{4 - 9n^2}{3n^2 + 7n}$ equals`, choices: [String.raw`$4/7$`, String.raw`$3$`, String.raw`$-3$`, String.raw`$0$`], answer: 2, explain: String.raw`Divide by $n^2$: $\dfrac{4/n^2 - 9}{3 + 7/n} \to \dfrac{-9}{3} = -3$.` },
      ],
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'conjugate',
      title: 'Differences of square roots: the conjugate',
      blocks: [
        { type: 'text', html: String.raw`<p>In $\sqrt{n^2 + 6n} - n$ both parts grow to infinity, and "$\infty - \infty$" can be anything. Multiplying by the <b>conjugate</b> $\sqrt{n^2 + 6n} + n$ (same two terms, plus instead of minus) turns the difference into a quotient that we can handle like a rational sequence.</p>` },
        { type: 'refresher', title: String.raw`the conjugate and $\sqrt{n^2(\dots)}$`, html: String.raw`<ul><li>$(a - b)(a + b) = a^2 - b^2$. With $a = \sqrt{X}$ the square root disappears: $(\sqrt X - n)(\sqrt X + n) = X - n^2$.</li><li>For $n > 0$: $\sqrt{n^2 + 6n} = \sqrt{n^2\big(1 + \frac6n\big)} = n\sqrt{1 + \frac6n}$, because $\sqrt{n^2} = n$. So $\dfrac{\sqrt{n^2 + 6n}}{n} = \sqrt{1 + \frac6n}$.</li></ul>` },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \left(\sqrt{n^2 + 6n} - n\right)$`, steps: [
          { do: String.raw`$\sqrt{n^2 + 6n} - n = \dfrac{\big(\sqrt{n^2 + 6n} - n\big)\big(\sqrt{n^2 + 6n} + n\big)}{\sqrt{n^2 + 6n} + n}$`, why: String.raw`Multiply and divide by the conjugate — this is multiplying by $1$.` },
          { do: String.raw`$= \dfrac{(n^2 + 6n) - n^2}{\sqrt{n^2 + 6n} + n}$`, why: String.raw`Numerator: $(a - b)(a + b) = a^2 - b^2$ with $a^2 = n^2 + 6n$, $b^2 = n^2$.` },
          { do: String.raw`$= \dfrac{6n}{\sqrt{n^2 + 6n} + n}$`, why: String.raw`The $n^2$ cancel. Now it is a quotient of two things that grow like $n$.` },
          { do: String.raw`$= \dfrac{6}{\frac{\sqrt{n^2 + 6n}}{n} + 1}$`, why: String.raw`Divide numerator and denominator by $n$ (highest power).` },
          { do: String.raw`$= \dfrac{6}{\sqrt{1 + \frac6n} + 1}$`, why: String.raw`Refresher: $\sqrt{n^2 + 6n}/n = \sqrt{1 + 6/n}$ for $n > 0$.` },
          { do: String.raw`$\to \dfrac{6}{\sqrt{1 + 0} + 1} = \dfrac{6}{2} = 3$`, why: String.raw`$\frac6n \to 0$; the square root is continuous, so $\sqrt{1 + 6/n} \to 1$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty} \left(\sqrt{4n^2 + n} - 2n\right)$`, problem: String.raw`Compute $\displaystyle\lim_{n\to\infty} \left(\sqrt{4n^2 + n} - 2n\right)$ with the conjugate $\sqrt{4n^2 + n} + 2n$.`, steps: [
          { prompt: String.raw`After multiplying top and bottom by the conjugate, the numerator is $(4n^2 + n) - (2n)^2$. Simplify it (type an expression in <code>n</code>).`, ask: { kind: 'expression', answer: 'n', variable: 'n', domain: [1, 5], label: 'numerator =' }, hint: String.raw`$(2n)^2 = 4n^2$.`, reveal: String.raw`$(4n^2 + n) - 4n^2 = n$, so $a_n = \dfrac{n}{\sqrt{4n^2 + n} + 2n}$.` },
          { prompt: String.raw`Divide top and bottom by $n$: $a_n = \dfrac{1}{\sqrt{4 + \frac1n} + 2}$. What does $\sqrt{4 + \frac1n}$ tend to?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`$\frac1n \to 0$.`, reveal: String.raw`$\sqrt{4 + 0} = 2$.` },
          { prompt: 'So the limit is?', ask: { kind: 'numeric', answer: '1/4' }, hint: String.raw`$\dfrac{1}{2 + 2}$.`, reveal: String.raw`$\dfrac{1}{2 + 2} = \dfrac14$.` },
        ] },
        { type: 'quiz', question: String.raw`Why can we not just say $\sqrt{n^2 + 6n} - n \to \infty - \infty = 0$?`, choices: ['Because ∞ − ∞ is not a number: the result depends on how fast each part grows', 'Because the limit is ∞', 'Because square roots have no limits'], answer: 0, explain: String.raw`$\infty - \infty$ is an indeterminate form: $(n + 3) - n \to 3$, $(2n) - n \to \infty$, $n - n \to 0$.` },
      ],
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'functions-squeeze',
      title: "Limits via functions: L'Hôpital's rule",
      blocks: [
        { type: 'callout', kind: 'thm', title: 'Sequences from functions', html: String.raw`<p>If $\lim_{x\to\infty} f(x) = L$ and $a_n = f(n)$ for all $n$, then $a_n \to L$. This lets you use L'Hôpital's rule on $f(x)$ — never differentiate with respect to the integer $n$ directly.</p>` },
        { type: 'refresher', title: "L'Hôpital's rule and the derivative of a logarithm", html: String.raw`<p><b>L'Hôpital:</b> if $f(x) \to \infty$ and $g(x) \to \infty$ (or both $\to 0$), then $\displaystyle\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}$, provided the right-hand limit exists. Differentiate top and bottom <b>separately</b> — not the quotient rule.</p><p><b>Chain rule for ln:</b> $\dfrac{\mathrm d}{\mathrm d x}\ln\big(g(x)\big) = \dfrac{g'(x)}{g(x)}$. Example: $\big(\ln(x^2 + 4)\big)' = \dfrac{2x}{x^2 + 4}$, and $\big((\ln x)^2\big)' = 2\ln x\cdot\dfrac1x$.</p>` },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{(\ln n)^2}{n}$`, steps: [
          { do: String.raw`$f(x) = \dfrac{(\ln x)^2}{x}, \quad x \ge 1$`, why: String.raw`Pass to a function of a real variable $x$ with $f(n) = a_n$.` },
          { do: String.raw`$(\ln x)^2 \to \infty, \quad x \to \infty$: form $\infty/\infty$`, why: "Check the pre-condition of L'Hôpital first." },
          { do: String.raw`$\displaystyle\lim_{x\to\infty} \frac{(\ln x)^2}{x} = \lim_{x\to\infty} \frac{2\ln x\cdot\frac1x}{1}$`, why: String.raw`Differentiate top (chain rule) and bottom ($x' = 1$) separately.` },
          { do: String.raw`$= \displaystyle\lim_{x\to\infty} \frac{2\ln x}{x}$`, why: String.raw`Simplify: $\frac{2\ln x / x}{1} = \frac{2\ln x}{x}$.` },
          { do: String.raw`$= \displaystyle\lim_{x\to\infty} \frac{2/x}{1} = 0$`, why: String.raw`Still $\infty/\infty$, so apply L'Hôpital once more: $(2\ln x)' = 2/x$.` },
          { do: String.raw`$\dfrac{(\ln n)^2}{n} \to 0$`, why: 'The sequence has the same limit as the function. (Any power of ln n loses against any positive power of n.)' },
        ] },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{\ln(n^2 + 4)}{\ln n}$`, steps: [
          { do: String.raw`$f(x) = \dfrac{\ln(x^2 + 4)}{\ln x}$: form $\infty/\infty$`, why: 'Both logarithms grow without bound.' },
          { do: String.raw`numerator$' = \dfrac{2x}{x^2 + 4}, \quad$ denominator$' = \dfrac1x$`, why: 'Chain rule for ln (refresher).' },
          { do: String.raw`$\dfrac{2x/(x^2+4)}{1/x} = \dfrac{2x}{x^2 + 4}\cdot x = \dfrac{2x^2}{x^2 + 4}$`, why: String.raw`Dividing by $\frac1x$ is multiplying by $x$.` },
          { do: String.raw`$= \dfrac{2}{1 + 4/x^2}$`, why: String.raw`Divide top and bottom by $x^2$.` },
          { do: String.raw`$\to \dfrac{2}{1 + 0} = 2$`, why: String.raw`$4/x^2 \to 0$.` },
          { do: String.raw`$\dfrac{\ln(n^2 + 4)}{\ln n} \to 2$`, why: "L'Hôpital: the original quotient has the same limit." },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{\ln(5n + 1)}{\ln n}$`, problem: String.raw`Compute $\displaystyle\lim_{n\to\infty} \frac{\ln(5n + 1)}{\ln n}$ with L'Hôpital on $f(x) = \dfrac{\ln(5x + 1)}{\ln x}$.`, steps: [
          { prompt: String.raw`Differentiate the numerator $\ln(5x + 1)$.`, ask: { kind: 'expression', answer: '5./(5*x + 1)', variable: 'x', label: 'derivative =' }, hint: String.raw`$\frac{g'}{g}$ with $g = 5x + 1$.`, reveal: String.raw`$\dfrac{5}{5x + 1}$.` },
          { prompt: String.raw`Divide by the derivative $\frac1x$ of the denominator and simplify to a single fraction.`, ask: { kind: 'expression', answer: '5*x./(5*x + 1)', variable: 'x', label: 'quotient =' }, hint: String.raw`Dividing by $\frac1x$ means multiplying by $x$.`, reveal: String.raw`$\dfrac{5x}{5x + 1}$.` },
          { prompt: 'Its limit as $x \\to \\infty$ (and hence the limit of the sequence)?', ask: { kind: 'numeric', answer: '1' }, hint: String.raw`Divide top and bottom by $x$: $\frac{5}{5 + 1/x}$.`, reveal: String.raw`$\dfrac{5}{5 + 0} = 1$.` },
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>The function trick works in one direction only: $a_n = \sin(\pi n) = 0$ converges to $0$, although $\sin(\pi x)$ has no limit as $x \to \infty$.</p>` },
        { type: 'quiz', question: String.raw`What is $\displaystyle\lim_{n\to\infty} n\sin\!\left(\frac{1}{n}\right)$?`, choices: [String.raw`$0$`, String.raw`$1$`, String.raw`$\infty$`, String.raw`The limit does not exist`], answer: 1, explain: String.raw`With $t = 1/x \to 0^+$: $\displaystyle\lim_{x\to\infty} x\sin(1/x) = \lim_{t\to 0^+} \frac{\sin t}{t} = 1$, so the sequence tends to $1$.` },
      ],
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'squeeze',
      title: 'The squeeze theorem',
      blocks: [
        { type: 'text', html: String.raw`<p>The terms $a_n = \dfrac{\cos n}{\sqrt n}$ jump around irregularly, but they are trapped between $-1/\sqrt n$ and $1/\sqrt n$, and both bounds tend to $0$. Shrink $\varepsilon$ and watch the terms settle in the band around $0$.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_n = cos(n)/√n is squeezed to 0',
          a: 'cos(n)./sqrt(n)', nmax: 80, L: 0, eps: 0.3, ylim: [-0.8, 0.8],
        } },
        { type: 'callout', kind: 'thm', title: 'Squeeze theorem', html: String.raw`<p>If $b_n \le a_n \le c_n$ for all $n \ge n_0$, and $b_n \to L$ and $c_n \to L$ (the <b>same</b> $L$), then $a_n \to L$. In particular, since $-|a_n| \le a_n \le |a_n|$: if $|a_n| \to 0$, then $a_n \to 0$.</p>` },
        { type: 'refresher', title: 'bounding sine and cosine, and dividing inequalities', html: String.raw`<ul><li>For every real number $t$: $-1 \le \sin t \le 1$, $\;-1 \le \cos t \le 1$, $\;0 \le \cos^2 t \le 1$.</li><li>Adding a number to all three parts keeps the inequalities: $-1 \le \cos n \le 1 \Rightarrow 1 \le 2 + \cos n \le 3$.</li><li>Dividing all three parts by a <b>positive</b> number keeps the direction: $1 \le 2 + \cos n \le 3 \Rightarrow \frac{1}{n^2} \le \frac{2 + \cos n}{n^2} \le \frac{3}{n^2}$.</li></ul>` },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{2 + \cos n}{n^2}$`, steps: [
          { do: String.raw`$-1 \le \cos n \le 1$`, why: 'Cosine is always between −1 and 1.' },
          { do: String.raw`$1 \le 2 + \cos n \le 3$`, why: String.raw`Add $2$ to all three parts.` },
          { do: String.raw`$\dfrac{1}{n^2} \le \dfrac{2 + \cos n}{n^2} \le \dfrac{3}{n^2}$`, why: String.raw`Divide by $n^2 > 0$; the inequalities keep their direction.` },
          { do: String.raw`$\dfrac{1}{n^2} \to 0, \qquad \dfrac{3}{n^2} \to 0$`, why: 'Both bounds tend to the same number 0.' },
          { do: String.raw`$\dfrac{2 + \cos n}{n^2} \to 0$`, why: 'Squeeze theorem.' },
        ] },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{n + \sin(n^2)}{2n - 1}$`, steps: [
          { do: String.raw`$-1 \le \sin(n^2) \le 1$`, why: 'Bound the oscillating part.' },
          { do: String.raw`$n - 1 \le n + \sin(n^2) \le n + 1$`, why: String.raw`Add $n$ to all three parts.` },
          { do: String.raw`$\dfrac{n - 1}{2n - 1} \le a_n \le \dfrac{n + 1}{2n - 1}$`, why: String.raw`Divide by $2n - 1$, which is positive for $n \ge 1$.` },
          { do: String.raw`$\dfrac{n \pm 1}{2n - 1} = \dfrac{1 \pm 1/n}{2 - 1/n} \to \dfrac12$`, why: String.raw`Both bounds are rational sequences: divide by $n$.` },
          { do: String.raw`$a_n \to \dfrac12$`, why: 'Squeeze theorem: both bounds have the same limit.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{5 + \sin n}{n}$`, problem: String.raw`Use the squeeze theorem to find $\displaystyle\lim_{n\to\infty} \frac{5 + \sin n}{n}$.`, steps: [
          { prompt: String.raw`From $-1 \le \sin n \le 1$: $\;m \le 5 + \sin n \le M$. What is the lower number $m$?`, ask: { kind: 'numeric', answer: '4' }, hint: String.raw`Add $5$ to $-1$.`, reveal: String.raw`$4 \le 5 + \sin n \le 6$.` },
          { prompt: String.raw`Divide by $n > 0$: $\frac4n \le a_n \le \frac6n$. What do both bounds tend to?`, ask: { kind: 'numeric', answer: '0' }, hint: String.raw`A constant over $n$.`, reveal: String.raw`$\frac4n \to 0$ and $\frac6n \to 0$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: [String.raw`$a_n \to 0$ by the squeeze theorem`, String.raw`$a_n \to 5$`, 'the limit does not exist because sin n oscillates'], answer: 0 }, hint: 'Both bounds have the same limit.', reveal: String.raw`$a_n \to 0$ by the squeeze theorem.` },
        ] },
        { type: 'quiz', question: String.raw`Which statement is <b>false</b>?`, choices: [String.raw`If $|a_n| \to 0$ then $a_n \to 0$.`, String.raw`A bounded sequence always converges.`, String.raw`If $0 \le a_n \le \frac1n$ then $a_n \to 0$.`], answer: 1, explain: String.raw`$(-1)^n$ is bounded (between $-1$ and $1$) but jumps between $-1$ and $1$ forever, so it diverges. The other two are the squeeze theorem.` },
      ],
    },
    // ------------------------------------------------------------------ 6
    {
      id: 'factorials',
      title: 'Factorials beat powers: product bounds',
      blocks: [
        { type: 'text', html: String.raw`<p>The <b>factorial</b> $n! = 1\cdot 2\cdot 3\cdots n$ grows faster than any power $c^n$. To prove limits like $\dfrac{5^n}{n!} \to 0$, write the quotient as a product of $n$ small fractions, bound most of them by $1$, and squeeze.</p>` },
        { type: 'refresher', title: 'writing a quotient as a product of fractions', html: String.raw`<p>$5^n$ has $n$ factors $5$, and $n!$ has $n$ factors $1, 2, \dots, n$. Pair them up:</p>$$\frac{5^n}{n!} = \frac{5}{1}\cdot\frac{5}{2}\cdot\frac{5}{3}\cdots\frac{5}{n}.$$<p>Example $n = 3$: $\frac{5^3}{3!} = \frac{125}{6}$ and $\frac51\cdot\frac52\cdot\frac53 = \frac{125}{6}$ ✓. Also: multiplying by a number $\le 1$ never makes a positive number bigger.</p>` },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{5^n}{n!}$`, steps: [
          { do: String.raw`$a_n = \dfrac{5}{1}\cdot\dfrac{5}{2}\cdot\dfrac{5}{3}\cdot\dfrac{5}{4}\cdot\dfrac{5}{5}\cdot\dfrac{5}{6}\cdots\dfrac{5}{n-1}\cdot\dfrac{5}{n}$`, why: 'Product of n fractions (refresher). Take n ≥ 6.' },
          { do: String.raw`$\dfrac51\cdot\dfrac52\cdot\dfrac53\cdot\dfrac54\cdot\dfrac55 = \dfrac{5^5}{5!} = \dfrac{3125}{120} = \dfrac{625}{24}$`, why: 'The first five factors are a fixed number, whatever n is.' },
          { do: String.raw`$\dfrac56,\ \dfrac57,\ \dots,\ \dfrac{5}{n-1}$ are all $< 1$`, why: 'From the sixth factor on, the denominator exceeds 5.' },
          { do: String.raw`$0 < a_n \le \dfrac{625}{24}\cdot\dfrac{5}{n}$`, why: 'Replace the middle factors by 1 (this can only make the product bigger) and keep the last factor 5/n.' },
          { do: String.raw`$\dfrac{625}{24}\cdot\dfrac{5}{n} \to 0$`, why: 'A constant times 1/n.' },
          { do: String.raw`$\dfrac{5^n}{n!} \to 0$`, why: String.raw`Squeeze theorem between $0$ and $\frac{3125}{24n}$.` },
        ] },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{n!}{(2n)^n}$ — keep the first factor instead`, steps: [
          { do: String.raw`$a_n = \dfrac{1}{2n}\cdot\dfrac{2}{2n}\cdot\dfrac{3}{2n}\cdots\dfrac{n}{2n}$`, why: String.raw`$n!$ has factors $1, \dots, n$ and $(2n)^n$ has $n$ factors $2n$.` },
          { do: String.raw`$\dfrac{k}{2n} \le \dfrac{n}{2n} = \dfrac12 < 1$ for every $k = 2, \dots, n$`, why: String.raw`Each numerator $k$ is at most $n$.` },
          { do: String.raw`$0 < a_n \le \dfrac{1}{2n}$`, why: 'Keep the first factor, replace all others by 1.' },
          { do: String.raw`$a_n \to 0$`, why: String.raw`Squeeze between $0$ and $\frac{1}{2n} \to 0$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{2^n}{n!}$`, problem: String.raw`Show that $\dfrac{2^n}{n!} \to 0$ with a product bound.`, steps: [
          { prompt: String.raw`Warm-up: compute $a_4 = \dfrac{2^4}{4!}$ (as a fraction).`, ask: { kind: 'numeric', answer: '2/3', tol: 1e-9 }, hint: String.raw`$2^4 = 16$ and $4! = 24$. Or multiply $\frac21\cdot\frac22\cdot\frac23\cdot\frac24$.`, reveal: String.raw`$a_4 = \frac{16}{24} = \frac23$; indeed $\frac21\cdot\frac22\cdot\frac23\cdot\frac24 = \frac{16}{24}$.` },
          { prompt: String.raw`$a_n = \dfrac21\cdot\dfrac22\cdot\dfrac23\cdots\dfrac2n$. For $n \ge 2$, replace the middle factors $\frac22, \dots, \frac{2}{n-1}$ (all $\le 1$) by $1$. Then $a_n \le \dfrac{K}{n}$ with $K = ?$`, ask: { kind: 'numeric', answer: '4' }, hint: String.raw`Keep the first factor $\frac21$ and the last factor $\frac2n$.`, reveal: String.raw`$a_n \le \dfrac21\cdot\dfrac2n = \dfrac4n$.` },
          { prompt: String.raw`What is $\displaystyle\lim \frac{2^n}{n!}$?`, ask: { kind: 'numeric', answer: '0' }, hint: String.raw`$0 < a_n \le \frac4n$.`, reveal: String.raw`Squeeze: $a_n \to 0$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty} \frac{n!}{(n+1)^n}$`, problem: String.raw`Show that $\dfrac{n!}{(n+1)^n} \to 0$ by keeping the first factor.`, steps: [
          { prompt: String.raw`Warm-up: compute $a_2 = \dfrac{2!}{3^2}$.`, ask: { kind: 'numeric', answer: '2/9', tol: 1e-9 }, hint: String.raw`$2! = 2$ and $3^2 = 9$.`, reveal: String.raw`$a_2 = \frac29$, which is the product $\frac13\cdot\frac23$.` },
          { prompt: String.raw`Write $a_n = \dfrac{1}{n+1}\cdot\dfrac{2}{n+1}\cdots\dfrac{n}{n+1}$. Every factor is $< 1$. Keeping only the first factor, $a_n \le\ ?$ (type an expression in <code>n</code>)`, ask: { kind: 'expression', answer: '1./(n+1)', variable: 'n', domain: [1, 6], label: 'bound =' }, hint: 'The first factor has numerator 1.', reveal: String.raw`$0 < a_n \le \dfrac{1}{n+1}$.` },
          { prompt: 'The limit is?', ask: { kind: 'numeric', answer: '0' }, hint: String.raw`$\frac{1}{n+1} \to 0$.`, reveal: String.raw`Squeeze: $a_n \to 0$.` },
        ] },
      ],
    },
    // ------------------------------------------------------------------ 7
    {
      id: 'exponential-oscillation',
      title: 'Limits of the form 1^∞',
      blocks: [
        { type: 'text', html: String.raw`<p>Expressions like $\left(\frac{n}{n+2}\right)^n$ are a tug of war: the base tends to $1$, the exponent to $\infty$ — the form $1^\infty$ is indeterminate (it is <b>not</b> automatically $1$). The widget shows that this one settles at $e^{-2} \approx 0.135$.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_n = (n/(n+2))^n → e^(−2)',
          a: '(n./(n + 2)).^n', nmax: 60, L: Math.exp(-2), Ltex: 'e^{-2}', eps: 0.05, ylim: [0, 0.4],
        } },
        { type: 'callout', kind: 'key', title: 'The standard limit', html: String.raw`$$\lim_{n\to\infty}\left(1 + \frac{a}{n}\right)^n = e^a \qquad\text{for every real number } a.$$<p>Here $e \approx 2.718$ is Euler's number. With $a = 1$ this is the definition of $e$.</p>` },
        { type: 'refresher', title: 'power rules', html: String.raw`<p>$x^{bn} = \big(x^{n}\big)^{b}$, and if $c_n \to C$ then $c_n^{\,b} \to C^{b}$ (powers are continuous). Example: $\left(1 + \frac2n\right)^{3n} = \left[\left(1 + \frac2n\right)^{n}\right]^3$.</p>` },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \left(1 - \frac{2}{n}\right)^{3n}$ (shortcut)`, steps: [
          { do: String.raw`$1 - \dfrac2n = 1 + \dfrac{-2}{n}$`, why: String.raw`Write the base in the standard form $1 + \frac{a}{n}$; here $a = -2$.` },
          { do: String.raw`$\left(1 + \dfrac{-2}{n}\right)^{3n} = \left[\left(1 + \dfrac{-2}{n}\right)^{n}\right]^3$`, why: String.raw`Power rule $x^{3n} = (x^n)^3$.` },
          { do: String.raw`$\left(1 + \dfrac{-2}{n}\right)^{n} \to e^{-2}$`, why: String.raw`Standard limit with $a = -2$.` },
          { do: String.raw`$\left[\,\cdot\,\right]^3 \to \left(e^{-2}\right)^3 = e^{-6}$`, why: String.raw`Cubing is continuous; $(e^{-2})^3 = e^{-6}$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty} \left(1 + \frac{4}{n}\right)^{n/2}$`, problem: String.raw`Compute $\displaystyle\lim_{n\to\infty} \left(1 + \frac{4}{n}\right)^{n/2}$ with the standard limit.`, steps: [
          { prompt: String.raw`In the standard form $1 + \frac an$, what is $a$?`, ask: { kind: 'numeric', answer: '4' }, hint: 'Read it off.', reveal: String.raw`$a = 4$, so $\left(1 + \frac4n\right)^n \to e^4$.` },
          { prompt: String.raw`$x^{n/2} = (x^n)^{b}$ with $b = ?$`, ask: { kind: 'numeric', answer: '1/2' }, hint: String.raw`$n/2 = n\cdot\frac12$.`, reveal: String.raw`$b = \frac12$.` },
          { prompt: 'The limit is (type e.g. <code>exp(3)</code>):', ask: { kind: 'numeric', answer: 'exp(2)', tol: 1e-6 }, hint: String.raw`$\left(e^4\right)^{1/2}$.`, reveal: String.raw`$\left(e^{4}\right)^{1/2} = e^{2} \approx 7.389$.` },
        ] },
        { type: 'text', html: String.raw`<p>When the base is not literally $1 + \frac an$, use the <b>logarithm trick</b>: take $\ln$, which turns the power into a product, compute that limit with L'Hôpital, and exponentiate back.</p>` },
        { type: 'refresher', title: 'logarithm rules', html: String.raw`<ul><li>$\ln\big(x^{b}\big) = b\ln x$ — the exponent comes down in front.</li><li>$\ln\dfrac{p}{q} = \ln p - \ln q$.</li><li>$e^{\ln y} = y$ for $y > 0$. So if $\ln a_n \to M$, then $a_n = e^{\ln a_n} \to e^{M}$ (the exponential function is continuous).</li></ul>` },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \left(\frac{2n+1}{2n-1}\right)^n$ (logarithm trick)`, steps: [
          { do: String.raw`base $\to 1$, exponent $\to \infty$: form $1^\infty$`, why: String.raw`$\frac{2n+1}{2n-1} \to \frac22 = 1$. Indeterminate, so we need the trick.` },
          { do: String.raw`$\ln a_n = n\ln\dfrac{2n+1}{2n-1}$`, why: String.raw`$\ln(x^{n}) = n\ln x$.` },
          { do: String.raw`$= n\big[\ln(2n+1) - \ln(2n-1)\big]$`, why: 'ln of a quotient.' },
          { do: String.raw`$f(x) = \dfrac{\ln(2x+1) - \ln(2x-1)}{1/x}$: form $0/0$`, why: String.raw`Write the product $n\cdot[\dots]$ as a quotient by dividing by $\frac1x$; the bracket $\to \ln 1 = 0$ and $\frac1x \to 0$.` },
          { do: String.raw`numerator$' = \dfrac{2}{2x+1} - \dfrac{2}{2x-1}$`, why: 'Chain rule for ln, term by term.' },
          { do: String.raw`$= \dfrac{2(2x-1) - 2(2x+1)}{(2x+1)(2x-1)} = \dfrac{-4}{4x^2 - 1}$`, why: String.raw`Common denominator; $(2x+1)(2x-1) = 4x^2 - 1$.` },
          { do: String.raw`denominator$' = \left(x^{-1}\right)' = -\dfrac{1}{x^2}$`, why: 'Power rule.' },
          { do: String.raw`$\dfrac{-4/(4x^2 - 1)}{-1/x^2} = \dfrac{4x^2}{4x^2 - 1}$`, why: String.raw`Dividing by $-\frac1{x^2}$ is multiplying by $-x^2$; the minus signs cancel.` },
          { do: String.raw`$= \dfrac{4}{4 - 1/x^2} \to 1$`, why: String.raw`Divide by $x^2$.` },
          { do: String.raw`$\ln a_n \to 1 \;\Rightarrow\; a_n \to e^1 = e$`, why: String.raw`Exponentiate back: $a_n = e^{\ln a_n}$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty} \left(\frac{n+3}{n+1}\right)^n$`, problem: String.raw`Compute the limit with the logarithm trick: $\ln a_n = \dfrac{\ln(x+3) - \ln(x+1)}{1/x}$ at $x = n$, a $0/0$ form.`, steps: [
          { prompt: 'Differentiate the numerator $\\ln(x+3) - \\ln(x+1)$ and combine into one fraction:', ask: { kind: 'choice', choices: [String.raw`$\dfrac{-2}{(x+3)(x+1)}$`, String.raw`$\dfrac{2}{(x+3)(x+1)}$`, String.raw`$\dfrac{2x+4}{(x+3)(x+1)}$`], answer: 0 }, hint: String.raw`$\frac{1}{x+3} - \frac{1}{x+1} = \frac{(x+1) - (x+3)}{(x+3)(x+1)}$.`, reveal: String.raw`$\dfrac{(x+1) - (x+3)}{(x+3)(x+1)} = \dfrac{-2}{(x+3)(x+1)}$.` },
          { prompt: String.raw`Divide by $-\frac{1}{x^2}$: you get $\dfrac{2x^2}{(x+3)(x+1)}$. What is its limit?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`$(x+3)(x+1) = x^2 + 4x + 3$; divide by $x^2$.`, reveal: String.raw`$\dfrac{2}{1 + 4/x + 3/x^2} \to 2$, so $\ln a_n \to 2$.` },
          { prompt: 'So $a_n \\to$ ? (type e.g. <code>exp(1)</code>)', ask: { kind: 'numeric', answer: 'exp(2)', tol: 1e-6 }, hint: String.raw`$a_n = e^{\ln a_n}$.`, reveal: String.raw`$a_n \to e^{2}$.` },
        ] },
        { type: 'quiz', question: String.raw`$\displaystyle\lim_{n\to\infty}\left(1 - \frac{3}{n}\right)^{2n}$ equals`, choices: [String.raw`$e^{-3}$`, String.raw`$e^{-6}$`, String.raw`$e^{6}$`, String.raw`$1$`], answer: 1, explain: String.raw`$\left(1 - \frac3n\right)^{2n} = \left[\left(1 + \frac{-3}{n}\right)^{n}\right]^2 \to (e^{-3})^2 = e^{-6}$, using continuity of $t \mapsto t^2$.` },
      ],
    },
    // ------------------------------------------------------------------ 8
    {
      id: 'infinity-zero',
      title: 'n-th roots: the forms ∞^0 and (sum)^(1/n)',
      blocks: [
        { type: 'text', html: String.raw`<p>A base that grows to infinity raised to a power $\frac1n$ that shrinks to $0$ — the form $\infty^0$ — is again a tug of war. The same logarithm trick decides it.</p>` },
        { type: 'refresher', title: String.raw`$c^{1/n} \to 1$ for every $c > 0$`, html: String.raw`<p>$c^{1/n} = e^{\ln(c^{1/n})} = e^{(\ln c)/n}$. Since $\frac{\ln c}{n} \to 0$, we get $c^{1/n} \to e^0 = 1$. Example: $2^{1/10} \approx 1.072$, $2^{1/100} \approx 1.007$.</p>` },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \left(n^2 + 1\right)^{1/n}$`, steps: [
          { do: String.raw`base $\to \infty$, exponent $\to 0$: form $\infty^0$`, why: 'Indeterminate: use the logarithm.' },
          { do: String.raw`$\ln a_n = \dfrac1n\ln(n^2 + 1) = \dfrac{\ln(n^2 + 1)}{n}$`, why: String.raw`$\ln(x^{b}) = b\ln x$ with $b = \frac1n$.` },
          { do: String.raw`$f(x) = \dfrac{\ln(x^2 + 1)}{x}$: form $\infty/\infty$`, why: "Pass to a function; L'Hôpital applies." },
          { do: String.raw`$\dfrac{f\text{-numerator}'}{f\text{-denominator}'} = \dfrac{2x/(x^2+1)}{1} = \dfrac{2x}{x^2 + 1}$`, why: 'Chain rule for ln on top, derivative 1 below.' },
          { do: String.raw`$= \dfrac{2/x}{1 + 1/x^2} \to 0$`, why: String.raw`Divide by $x^2$.` },
          { do: String.raw`$\ln a_n \to 0 \;\Rightarrow\; a_n \to e^0 = 1$`, why: 'Exponentiate back.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty} (3n)^{1/n}$`, problem: String.raw`Compute $\displaystyle\lim_{n\to\infty} (3n)^{1/n}$ with $\ln a_n = \dfrac{\ln(3n)}{n}$.`, steps: [
          { prompt: String.raw`Differentiate $\ln(3x)$.`, ask: { kind: 'expression', answer: '1./x', variable: 'x', label: 'derivative =' }, hint: String.raw`$\frac{g'}{g}$ with $g = 3x$: $\frac{3}{3x}$.`, reveal: String.raw`$\dfrac{3}{3x} = \dfrac1x$.` },
          { prompt: String.raw`L'Hôpital: $\displaystyle\lim \frac{\ln(3x)}{x} = \lim \frac{1/x}{1} = ?$`, ask: { kind: 'numeric', answer: '0' }, hint: String.raw`$\frac1x \to 0$.`, reveal: String.raw`$\ln a_n \to 0$.` },
          { prompt: 'So $(3n)^{1/n} \\to$ ?', ask: { kind: 'numeric', answer: '1' }, hint: String.raw`$e^{0}$.`, reveal: String.raw`$a_n \to e^0 = 1$.` },
        ] },
        { type: 'text', html: String.raw`<p><b>Roots of sums.</b> For $(3^n + 4^n)^{1/n}$, the largest term $4^n$ dominates. Squeeze the sum between the largest term and a multiple of it.</p>` },
        { type: 'steps', title: String.raw`$\displaystyle\lim_{n\to\infty} \left(3^n + 4^n\right)^{1/n}$`, steps: [
          { do: String.raw`$4^n \le 3^n + 4^n$`, why: String.raw`Adding the positive number $3^n$ makes it bigger.` },
          { do: String.raw`$3^n + 4^n \le 4^n + 4^n = 2\cdot 4^n$`, why: String.raw`$3^n \le 4^n$, so replacing $3^n$ by $4^n$ can only increase.` },
          { do: String.raw`$\left(4^n\right)^{1/n} \le a_n \le \left(2\cdot 4^n\right)^{1/n}$`, why: String.raw`Take the $n$-th root of all three parts; $t \mapsto t^{1/n}$ is increasing for $t > 0$, so the inequalities keep their direction.` },
          { do: String.raw`$4 \le a_n \le 2^{1/n}\cdot 4$`, why: String.raw`$(4^n)^{1/n} = 4$ and $(2\cdot 4^n)^{1/n} = 2^{1/n}\cdot 4$.` },
          { do: String.raw`$2^{1/n}\cdot 4 \to 1\cdot 4 = 4$`, why: String.raw`Refresher: $2^{1/n} \to 1$.` },
          { do: String.raw`$a_n \to 4$`, why: 'Squeeze theorem: both bounds tend to 4.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty} \left(1 + 3^n\right)^{1/n}$`, problem: String.raw`Compute $\displaystyle\lim_{n\to\infty} \left(1 + 3^n\right)^{1/n}$ by squeezing.`, steps: [
          { prompt: 'Which bounds are correct for every $n \\ge 1$?', ask: { kind: 'choice', choices: [String.raw`$3^n \le 1 + 3^n \le 2\cdot 3^n$`, String.raw`$1 \le 1 + 3^n \le 3^n$`, String.raw`$3^n \le 1 + 3^n \le 3^n$`], answer: 0 }, hint: String.raw`$1 \le 3^n$, so $1 + 3^n \le 3^n + 3^n$.`, reveal: String.raw`$3^n \le 1 + 3^n \le 2\cdot 3^n$.` },
          { prompt: String.raw`Taking $n$-th roots gives $3 \le a_n \le 2^{1/n}\cdot 3$. What does $2^{1/n}$ tend to?`, ask: { kind: 'numeric', answer: '1' }, hint: String.raw`$2^{1/n} = e^{(\ln 2)/n}$ (refresher at the top of this lesson).`, reveal: String.raw`$2^{1/n} \to e^0 = 1$.` },
          { prompt: String.raw`So $3 \le a_n \le 2^{1/n}\cdot 3$ with both bounds tending to the same number. What is the limit?`, ask: { kind: 'numeric', answer: '3' }, hint: String.raw`$2^{1/n} \to 1$.`, reveal: String.raw`Both bounds tend to $3$, so $a_n \to 3$.` },
        ] },
      ],
    },
    // ------------------------------------------------------------------ 9
    {
      id: 'oscillation',
      title: 'Oscillating sequences: proving divergence',
      blocks: [
        { type: 'text', html: String.raw`<p>Not every sequence settles down. The sequence $a_n = 2^{\sin(\pi n/2)}$ cycles through $2, 1, \tfrac12, 1, 2, 1, \tfrac12, \dots$ forever:</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_n = 2^sin(πn/2) oscillates',
          a: '2.^sin(pi*n/2)', nmax: 24, ylim: [0, 2.5],
        } },
        { type: 'refresher', title: 'sine and cosine at multiples of π/2', html: String.raw`<p>On the unit circle, the angles $\frac{\pi}{2}, \pi, \frac{3\pi}{2}, 2\pi$ are a quarter, half, three quarters and a full turn.</p>`, steps: [
          { do: String.raw`$\sin\frac{\pi}{2} = 1,\ \sin\pi = 0,\ \sin\frac{3\pi}{2} = -1,\ \sin 2\pi = 0$`, why: String.raw`So $\sin(\pi n/2)$ repeats $1, 0, -1, 0$ with period $4$ in $n$.` },
          { do: String.raw`$\cos(\pi n) = (-1)^n$`, why: String.raw`Even multiples of $\pi$ are full turns ($\cos = 1$), odd ones half turns ($\cos = -1$).` },
          { do: String.raw`$\sin(\pi n) = 0$`, why: 'Every multiple of π lies on the horizontal axis.' },
        ] },
        { type: 'callout', kind: 'thm', title: 'Proving divergence with subsequences', html: String.raw`<p>A <b>subsequence</b> picks out some of the terms in order, e.g. only even $n$ ($a_2, a_4, a_6, \dots$). If $a_n \to L$, then <b>every</b> subsequence also tends to $L$. So two subsequences with different limits prove divergence.</p>` },
        { type: 'steps', title: String.raw`Show that $a_n = 2^{\sin(\pi n/2)}$ diverges`, steps: [
          { do: String.raw`$a_1 = 2^{1} = 2,\ a_2 = 2^{0} = 1,\ a_3 = 2^{-1} = \tfrac12,\ a_4 = 2^0 = 1$`, why: 'Write out the first terms using the refresher.' },
          { do: String.raw`$n = 4k + 1$: $\;\sin\!\big(2\pi k + \tfrac{\pi}{2}\big) = 1$, so $a_{4k+1} = 2$`, why: String.raw`Adding full turns $2\pi k$ does not change the sine.` },
          { do: String.raw`$n = 4k + 3$: $\;\sin\!\big(2\pi k + \tfrac{3\pi}{2}\big) = -1$, so $a_{4k+3} = \tfrac12$`, why: 'Same argument.' },
          { do: String.raw`$a_{4k+1} \to 2, \qquad a_{4k+3} \to \tfrac12$`, why: 'Both subsequences are constant, so they converge to these constants.' },
          { do: String.raw`$2 \ne \tfrac12 \;\Rightarrow\;$ the sequence diverges`, why: 'If it converged, all subsequences would have the same limit.' },
          { do: String.raw`not to $\infty$: $\;\tfrac12 \le a_n \le 2$`, why: 'It stays bounded — it diverges by oscillation.' },
        ] },
        { type: 'guided', title: String.raw`Does $a_n = 4^{\cos(\pi n)}$ converge?`, problem: String.raw`Decide whether $a_n = 4^{\cos(\pi n)}$ converges, using even and odd subsequences.`, steps: [
          { prompt: String.raw`For even $n$, $\cos(\pi n) = 1$. What is $a_n$?`, ask: { kind: 'numeric', answer: '4' }, hint: String.raw`$4^1$.`, reveal: String.raw`$a_{2k} = 4$.` },
          { prompt: String.raw`For odd $n$, $\cos(\pi n) = -1$. What is $a_n$?`, ask: { kind: 'numeric', answer: '1/4' }, hint: String.raw`$4^{-1}$.`, reveal: String.raw`$a_{2k+1} = \tfrac14$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges to 4', 'diverges: two subsequences with different limits', 'diverges to ∞'], answer: 1 }, hint: String.raw`Compare $4$ and $\frac14$.`, reveal: String.raw`The subsequences tend to $4$ and $\frac14$: the sequence diverges (it stays bounded).` },
        ] },
        { type: 'quiz', question: String.raw`Which sequence converges?`, choices: [String.raw`$(-1)^n\dfrac{n}{n+1}$`, String.raw`$\cos(\pi n)$`, String.raw`$\dfrac{\cos(\pi n)}{n}$`, String.raw`$2^{(-1)^n}$`], answer: 2, explain: String.raw`$\left|\frac{\cos \pi n}{n}\right| = \frac1n \to 0$, so it converges to $0$. The others have even- and odd-indexed subsequences with different limits ($\pm1$, $\pm1$, and $2$ vs $\tfrac12$).` },
      ],
    },
    // ------------------------------------------------------------------ 10
    {
      id: 'monotone-recursive',
      title: 'Monotone bounded and recursive sequences',
      blocks: [
        { type: 'text', html: String.raw`<p>A <b>recursive</b> sequence is defined by a starting value and a rule $a_{n+1} = g(a_n)$ that computes each term from the previous one. Below, $a_1 = 1$ and $a_{n+1} = \sqrt{2 + a_n}$. The terms increase, but never pass $2$ — and they converge to $2$.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_1 = 1, a_(n+1) = √(2 + a_n)',
          recursive: { a1: 1, next: 'sqrt(2 + a)' }, nmax: 15, L: 2, eps: 0.1, ylim: [0.8, 2.2],
        } },
        { type: 'callout', kind: 'thm', title: 'Monotone convergence theorem', html: String.raw`<p>A sequence that is <b>increasing and bounded above</b>, or <b>decreasing and bounded below</b> (from some index on), converges.</p>` },
        { type: 'callout', kind: 'key', title: 'Fixed points', html: String.raw`<p>If $a_{n+1} = g(a_n)$, $a_n \to L$ and $g$ is continuous at $L$, then letting $n \to \infty$ on both sides gives $L = g(L)$. The limit must be a <b>fixed point</b> of $g$ — but only <i>after</i> you know the limit exists.</p>` },
        { type: 'refresher', title: 'proof by induction', html: String.raw`<p>To show a statement $P(n)$ for all $n \ge 1$: (1) check $P(1)$; (2) show that <i>if</i> $P(n)$ holds, then $P(n+1)$ holds. Like dominoes: the first falls, and each one knocks over the next.</p>` },
        { type: 'steps', title: String.raw`$a_1 = 1$, $a_{n+1} = \sqrt{2 + a_n}$: prove convergence and find the limit`, steps: [
          { do: String.raw`$P(n)$: $\;1 \le a_n < 2$`, why: 'The bound we want to prove by induction.' },
          { do: String.raw`$P(1)$: $\;1 \le 1 < 2$ ✓`, why: String.raw`Start: $a_1 = 1$.` },
          { do: String.raw`$1 \le a_n < 2 \;\Rightarrow\; 3 \le 2 + a_n < 4 \;\Rightarrow\; \sqrt3 \le a_{n+1} < 2$`, why: String.raw`Induction step: add $2$, then take square roots (increasing). Since $\sqrt3 > 1$, $P(n+1)$ holds.` },
          { do: String.raw`$a_{n+1}^2 - a_n^2 = 2 + a_n - a_n^2$`, why: String.raw`To show increasing, compare squares: $a_{n+1}^2 = 2 + a_n$.` },
          { do: String.raw`$= (2 - a_n)(1 + a_n) > 0$`, why: String.raw`Factor: $(2 - a)(1 + a) = 2 + a - a^2$. Both factors are positive because $1 \le a_n < 2$.` },
          { do: String.raw`$a_{n+1} > a_n$`, why: 'Both terms are positive, so a bigger square means a bigger number.' },
          { do: String.raw`increasing and bounded above by $2$ $\Rightarrow$ converges, say to $L$`, why: 'Monotone convergence theorem.' },
          { do: String.raw`$L = \sqrt{2 + L}$`, why: 'Let n → ∞ on both sides of the recursion (fixed point).' },
          { do: String.raw`$L^2 = 2 + L \;\Rightarrow\; L^2 - L - 2 = 0$`, why: 'Square both sides and move everything to one side.' },
          { do: String.raw`$(L - 2)(L + 1) = 0 \;\Rightarrow\; L = 2$ or $L = -1$`, why: 'Factor (or use the quadratic formula).' },
          { do: String.raw`$L = 2$`, why: String.raw`All terms are $\ge 1$, so the limit is $\ge 1$: reject $-1$.` },
        ] },
        { type: 'guided', title: String.raw`$a_1 = 1$, $a_{n+1} = \sqrt{12 + a_n}$`, problem: String.raw`The sequence $a_1 = 1$, $a_{n+1} = \sqrt{12 + a_n}$ is increasing and bounded above by $4$ (same proof as the example, with $a_{n+1}^2 - a_n^2 = (4 - a_n)(3 + a_n)$). Compute a term and find the limit.`, steps: [
          { prompt: String.raw`Compute $a_2$ (exact, e.g. <code>sqrt(5)</code>).`, ask: { kind: 'numeric', answer: 'sqrt(13)', tol: 1e-6 }, hint: String.raw`$a_2 = \sqrt{12 + a_1}$.`, reveal: String.raw`$a_2 = \sqrt{13} \approx 3.606$.` },
          { prompt: String.raw`The limit solves $L = \sqrt{12 + L}$, i.e. $L^2 - L - 12 = 0$. What is $L$?`, ask: { kind: 'numeric', answer: '4' }, hint: String.raw`Factor: $(L - 4)(L + 3)$.`, reveal: String.raw`$L = 4$ or $L = -3$.` },
          { prompt: String.raw`Why is $L = -3$ rejected?`, ask: { kind: 'choice', choices: ['all terms are positive, so the limit cannot be negative', 'negative numbers have no square root', 'because 4 is bigger'], answer: 0 }, hint: 'What sign do all the terms have?', reveal: String.raw`All $a_n \ge 1$, so $L \ge 1$: $L = 4$.` },
        ] },
        { type: 'callout', kind: 'warn', title: 'Why existence comes first', html: String.raw`<p>For $a_1 = 1$, $a_{n+1} = 2a_n$ the "fixed point" equation $L = 2L$ gives $L = 0$, yet $a_n = 2^{n-1} \to \infty$. Solving $L = g(L)$ without proving convergence is a classic lost point.</p>` },
        { type: 'quiz', question: String.raw`Let $a_1 = 0$ and $a_{n+1} = 1 + \dfrac{a_n}{3}$. The sequence is increasing and bounded. What is its limit?`, choices: [String.raw`$1$`, String.raw`$\dfrac32$`, String.raw`$3$`, String.raw`$\dfrac43$`], answer: 1, explain: String.raw`$L = 1 + L/3$ gives $\tfrac23 L = 1$, so $L = \tfrac32$.` },
      ],
    },
    // ------------------------------------------------------------------ 11
    {
      id: 'newton-recursion',
      title: 'The recursion a(n+1) = a(n)/2 + c/a(n)',
      blocks: [
        { type: 'text', html: String.raw`<p>The recursion $a_{n+1} = \dfrac{a_n}{2} + \dfrac{1}{a_n}$ is the ancient Babylonian (Newton) method for $\sqrt2$: each step averages a guess $a_n$ with $2/a_n$. It converges extremely fast — and its proof uses one neat trick: the difference to the limit is a perfect square.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'a_1 = 1, a_(n+1) = a_n/2 + 1/a_n',
          recursive: { a1: 1, next: 'a/2 + 1./a' }, nmax: 10, L: Math.SQRT2, Ltex: String.raw`\sqrt2`, eps: 0.05, ylim: [0.8, 1.6],
        } },
        { type: 'refresher', title: 'adding fractions and dividing by a fraction', html: String.raw`<ul><li>$\dfrac{1}{3/2} = \dfrac23$: dividing by a fraction is multiplying by its reciprocal.</li><li>$\dfrac34 + \dfrac23 = \dfrac{9}{12} + \dfrac{8}{12} = \dfrac{17}{12}$: write both over the common denominator $12$, then add the numerators.</li></ul>` },
        { type: 'steps', title: String.raw`$a_1 = 1$, $a_{n+1} = \dfrac{a_n}{2} + \dfrac{1}{a_n}$: first terms and the limit`, steps: [
          { do: String.raw`$a_2 = \dfrac12 + \dfrac11 = \dfrac32$`, why: String.raw`Put $a_1 = 1$ into the rule.` },
          { do: String.raw`$a_3 = \dfrac{3/2}{2} + \dfrac{1}{3/2} = \dfrac34 + \dfrac23$`, why: String.raw`Put $a_2 = \frac32$ into the rule; refresher for $\frac{1}{3/2}$.` },
          { do: String.raw`$a_3 = \dfrac{9}{12} + \dfrac{8}{12} = \dfrac{17}{12} \approx 1.4167$`, why: 'Common denominator 12.' },
          { do: String.raw`If $a_n \to L$: $\;L = \dfrac{L}{2} + \dfrac1L$`, why: 'Let n → ∞ on both sides (fixed point).' },
          { do: String.raw`$\dfrac{L}{2} = \dfrac1L \;\Rightarrow\; L^2 = 2$`, why: String.raw`Subtract $\frac L2$ from both sides, then multiply by $2L$.` },
          { do: String.raw`$L = \sqrt2$`, why: String.raw`All terms are positive (sum of positive numbers), so reject $-\sqrt2$.` },
        ] },
        { type: 'steps', title: String.raw`Prove that this sequence converges`, steps: [
          { do: String.raw`$a_n > 0$ for all $n$`, why: String.raw`Induction: $a_1 = 1 > 0$, and if $a_n > 0$ then $\frac{a_n}{2} + \frac{1}{a_n} > 0$.` },
          { do: String.raw`$a_{n+1} - \sqrt2 = \dfrac{a_n}{2} + \dfrac{1}{a_n} - \sqrt2 = \dfrac{a_n^2 + 2 - 2\sqrt2\,a_n}{2a_n}$`, why: String.raw`Common denominator $2a_n$: multiply $\frac{a_n}{2}$ by $\frac{a_n}{a_n}$, $\frac{1}{a_n}$ by $\frac22$, and $\sqrt2$ by $\frac{2a_n}{2a_n}$.` },
          { do: String.raw`$= \dfrac{\big(a_n - \sqrt2\big)^2}{2a_n} \ge 0$`, why: String.raw`The numerator is a perfect square: $(a - \sqrt2)^2 = a^2 - 2\sqrt2 a + 2$. A square is $\ge 0$ and $2a_n > 0$.` },
          { do: String.raw`$a_n \ge \sqrt2$ for all $n \ge 2$`, why: 'Every term after the first is at least √2: bounded below.' },
          { do: String.raw`$a_{n+1} - a_n = \dfrac{1}{a_n} - \dfrac{a_n}{2} = \dfrac{2 - a_n^2}{2a_n}$`, why: String.raw`Subtract $a_n = \frac{2a_n}{2}$; common denominator $2a_n$.` },
          { do: String.raw`$\le 0$ for $n \ge 2$, since $a_n^2 \ge 2$`, why: 'So the sequence is decreasing from n = 2 on.' },
          { do: String.raw`decreasing and bounded below $\Rightarrow$ converges; $L = \sqrt2$`, why: 'Monotone convergence theorem, then the fixed-point computation above.' },
        ] },
        { type: 'guided', title: String.raw`$a_1 = 2$, $a_{n+1} = \dfrac{a_n}{2} + \dfrac{5}{2a_n}$`, problem: String.raw`For $a_1 = 2$, $a_{n+1} = \dfrac{a_n}{2} + \dfrac{5}{2a_n}$, compute two terms, the limit, and the key identity of the proof.`, steps: [
          { prompt: String.raw`Compute $a_2$ (as a fraction, e.g. <code>7/3</code>).`, ask: { kind: 'numeric', answer: '9/4', tol: 1e-9 }, hint: String.raw`$\frac22 + \frac{5}{4}$.`, reveal: String.raw`$a_2 = 1 + \frac54 = \frac94$.` },
          { prompt: String.raw`Compute $a_3$ exactly.`, ask: { kind: 'numeric', answer: '161/72', tol: 1e-9 }, hint: String.raw`$\frac{9/4}{2} = \frac98$ and $\frac{5}{2\cdot 9/4} = \frac{5}{9/2} = \frac{10}{9}$. Common denominator $72$.`, reveal: String.raw`$a_3 = \frac98 + \frac{10}{9} = \frac{81}{72} + \frac{80}{72} = \frac{161}{72} \approx 2.2361$.` },
          { prompt: String.raw`Assuming convergence, $L = \frac L2 + \frac{5}{2L}$. What is $L$?`, ask: { kind: 'numeric', answer: 'sqrt(5)', tol: 1e-8 }, hint: String.raw`$\frac L2 = \frac{5}{2L}$ gives $L^2 = 5$; the terms are positive.`, reveal: String.raw`$L = \sqrt5 \approx 2.23607$.` },
          { prompt: String.raw`Which identity shows $a_{n+1} \ge \sqrt5$?`, ask: { kind: 'choice', choices: [String.raw`$a_{n+1} - \sqrt5 = \dfrac{(a_n - \sqrt5)^2}{2a_n}$`, String.raw`$a_{n+1} - \sqrt5 = \dfrac{a_n^2 - 5}{2a_n}$`, String.raw`$a_{n+1} - \sqrt5 = \dfrac{a_n - \sqrt5}{2}$`], answer: 0 }, hint: String.raw`Over the common denominator $2a_n$ the numerator is $a_n^2 + 5 - 2\sqrt5 a_n$.`, reveal: String.raw`$a_n^2 - 2\sqrt5 a_n + 5 = (a_n - \sqrt5)^2 \ge 0$, so $a_{n+1} \ge \sqrt5$.` },
        ] },
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
  assignIntro: String.raw`<p>Every problem below is the same type as a worked example and a guided exercise you have already done — the links above each problem take you back to them. If you get stuck, use the hints one at a time, then "Walk me through it".</p>`,
  assignments: [
    {
      id: 'a1',
      title: 'Limits of sequences',
      difficulty: 'core',
      hw: 'HW5-style',
      examples: ['rational-limits', 'conjugate', 'oscillation', 'squeeze', 'functions-squeeze'],
      statement: String.raw`<p>Determine the limits, or decide that the sequence diverges. State which rule (limit laws, conjugate, L'Hôpital on a function, squeeze, subsequences) you use.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \frac{7n^2 - 4n}{3 - 2n^2}$`, kind: 'numeric', answer: '-7/2',
          hints: ['A rational sequence: see the lesson on limit laws.', String.raw`Divide numerator and denominator by $n^2$, the highest power in the denominator.`, String.raw`$\dfrac{7 - 4/n}{3/n^2 - 2}$.`],
          walkthrough: [
            { do: String.raw`$\dfrac{7n^2 - 4n}{3 - 2n^2} = \dfrac{(7n^2 - 4n)/n^2}{(3 - 2n^2)/n^2}$`, why: String.raw`Divide by $n^2$, the highest power in the denominator.` },
            { do: String.raw`$= \dfrac{7 - \frac4n}{\frac{3}{n^2} - 2}$`, why: 'Divide term by term.' },
            { do: String.raw`$\to \dfrac{7 - 0}{0 - 2}$`, why: String.raw`$\frac{c}{n^p} \to 0$; the denominator's limit $-2$ is not zero.` },
            { do: String.raw`$= -\dfrac72$`, why: 'Quotient law.' },
          ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \left(\sqrt{n^2 + 3n} - n\right)$`, kind: 'numeric', answer: '3/2',
          hints: [String.raw`This is $\infty - \infty$: see the conjugate lesson.`, String.raw`Multiply and divide by $\sqrt{n^2 + 3n} + n$.`, String.raw`The numerator becomes $(n^2 + 3n) - n^2 = 3n$.`],
          walkthrough: [
            { do: String.raw`$= \dfrac{(n^2 + 3n) - n^2}{\sqrt{n^2 + 3n} + n}$`, why: String.raw`Multiply and divide by the conjugate; $(a - b)(a + b) = a^2 - b^2$.` },
            { do: String.raw`$= \dfrac{3n}{\sqrt{n^2 + 3n} + n}$`, why: String.raw`The $n^2$ cancel.` },
            { do: String.raw`$= \dfrac{3}{\sqrt{1 + 3/n} + 1}$`, why: String.raw`Divide top and bottom by $n$; $\sqrt{n^2 + 3n}/n = \sqrt{1 + 3/n}$.` },
            { do: String.raw`$\to \dfrac{3}{1 + 1} = \dfrac32$`, why: String.raw`$3/n \to 0$ and the root is continuous.` },
          ] },
        { label: '(c)', prompt: String.raw`$a_n = 3^{\sin(\pi n/2)}$`, kind: 'choice', choices: [String.raw`converges to $1$`, String.raw`converges to $3$`, String.raw`diverges: subsequences tend to $3$ and $\tfrac13$`, String.raw`diverges to $\infty$`], answer: 2,
          hints: [String.raw`Write out $a_1, a_2, a_3, a_4$ using $\sin(\pi n/2) = 1, 0, -1, 0, \dots$`, String.raw`Look at the subsequences $n = 4k + 1$ and $n = 4k + 3$, as in the oscillation lesson.`],
          solution: String.raw`$a_{4k+1} = 3$ and $a_{4k+3} = 3^{-1} = \tfrac13$ for all $k$. Two subsequences with different limits, so the sequence diverges (it stays bounded, so it does not tend to $\infty$).` },
        { label: '(d)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \frac{\cos^2 n}{\sqrt n}$`, kind: 'numeric', answer: '0',
          hints: ['Bound the oscillating part, then squeeze.', String.raw`$0 \le \cos^2 n \le 1$.`, String.raw`Divide by $\sqrt n > 0$: $0 \le a_n \le \frac{1}{\sqrt n}$.`],
          walkthrough: [
            { do: String.raw`$0 \le \cos^2 n \le 1$`, why: 'A square of a number between −1 and 1.' },
            { do: String.raw`$0 \le \dfrac{\cos^2 n}{\sqrt n} \le \dfrac{1}{\sqrt n}$`, why: String.raw`Divide by $\sqrt n > 0$.` },
            { do: String.raw`$0 \to 0, \quad \dfrac{1}{\sqrt n} = \dfrac{1}{n^{1/2}} \to 0$`, why: 'Both bounds tend to 0.' },
            { do: String.raw`$\dfrac{\cos^2 n}{\sqrt n} \to 0$`, why: 'Squeeze theorem.' },
          ] },
        { label: '(e)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \frac{\ln(n^3 + 1)}{\ln n}$`, kind: 'numeric', answer: '3',
          hints: [String.raw`Pass to the function $f(x) = \frac{\ln(x^3 + 1)}{\ln x}$: it is $\infty/\infty$.`, String.raw`L'Hôpital: differentiate top and bottom with the chain rule for $\ln$.`, String.raw`$\dfrac{3x^2/(x^3 + 1)}{1/x} = \dfrac{3x^3}{x^3 + 1}$.`],
          walkthrough: [
            { do: String.raw`$f(x) = \dfrac{\ln(x^3 + 1)}{\ln x}$: form $\infty/\infty$`, why: "Pre-condition of L'Hôpital." },
            { do: String.raw`numerator$' = \dfrac{3x^2}{x^3 + 1}, \quad$ denominator$' = \dfrac1x$`, why: 'Chain rule for ln.' },
            { do: String.raw`$\dfrac{3x^2/(x^3+1)}{1/x} = \dfrac{3x^3}{x^3 + 1}$`, why: String.raw`Multiply by $x$.` },
            { do: String.raw`$= \dfrac{3}{1 + 1/x^3} \to 3$`, why: String.raw`Divide by $x^3$.` },
            { do: String.raw`$a_n = f(n) \to 3$`, why: 'The sequence has the limit of the function.' },
          ] },
      ],
    },
    {
      id: 'a2',
      title: 'Limits of the form 1^∞',
      difficulty: 'core',
      hw: 'HW5-style',
      examples: ['exponential-oscillation', 'infinity-zero'],
      statement: String.raw`<p>Compute the limits. Give exact values as MATLAB expressions, e.g. <code>exp(-2)</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \left(1 + \frac{3}{n}\right)^{2n}$`, kind: 'numeric', answer: 'exp(6)', tol: 1e-6,
          hints: [String.raw`The base is already in the standard form $1 + \frac an$.`, String.raw`Write the power $2n$ as $(\,\cdot\,^n)^2$.`, String.raw`$\left[\left(1 + \frac3n\right)^n\right]^2$ and $\left(1 + \frac3n\right)^n \to e^3$.`],
          walkthrough: [
            { do: String.raw`$\left(1 + \frac3n\right)^{2n} = \left[\left(1 + \frac3n\right)^{n}\right]^2$`, why: String.raw`$x^{2n} = (x^n)^2$.` },
            { do: String.raw`$\left(1 + \frac3n\right)^{n} \to e^3$`, why: String.raw`Standard limit with $a = 3$.` },
            { do: String.raw`$\left[\,\cdot\,\right]^2 \to (e^3)^2 = e^6$`, why: 'Squaring is continuous.' },
          ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \left(\frac{n+2}{n-1}\right)^{n}$`, kind: 'numeric', answer: 'exp(3)', tol: 1e-6,
          hints: ['Form 1^∞ with a base that is not 1 + a/n: use the logarithm trick.', String.raw`$\ln a_n = \dfrac{\ln(x+2) - \ln(x-1)}{1/x}$ at $x = n$, a $0/0$ form. Apply L'Hôpital.`, String.raw`Numerator$' = \frac{1}{x+2} - \frac{1}{x-1} = \frac{-3}{(x+2)(x-1)}$; denominator$' = -\frac{1}{x^2}$.`],
          walkthrough: [
            { do: String.raw`$\ln a_n = n\big[\ln(n+2) - \ln(n-1)\big]$`, why: 'Logarithm rules.' },
            { do: String.raw`$f(x) = \dfrac{\ln(x+2) - \ln(x-1)}{1/x}$: form $0/0$`, why: 'Rewrite the product as a quotient.' },
            { do: String.raw`numerator$' = \dfrac{1}{x+2} - \dfrac{1}{x-1} = \dfrac{(x - 1) - (x + 2)}{(x+2)(x-1)} = \dfrac{-3}{(x+2)(x-1)}$`, why: 'Chain rule and a common denominator.' },
            { do: String.raw`$\dfrac{-3/((x+2)(x-1))}{-1/x^2} = \dfrac{3x^2}{(x+2)(x-1)}$`, why: String.raw`Multiply by $-x^2$.` },
            { do: String.raw`$= \dfrac{3}{(1 + 2/x)(1 - 1/x)} \to 3$`, why: String.raw`Divide by $x^2 = x\cdot x$, one $x$ into each bracket.` },
            { do: String.raw`$\ln a_n \to 3 \Rightarrow a_n \to e^3$`, why: 'Exponentiate back.' },
          ] },
        { label: '(c)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} n^{1/n}$`, kind: 'numeric', answer: '1',
          hints: [String.raw`Form $\infty^0$: take the logarithm.`, String.raw`$\ln a_n = \dfrac{\ln n}{n}$; use L'Hôpital on $\frac{\ln x}{x}$.`, String.raw`$\dfrac{1/x}{1} \to 0$.`],
          walkthrough: [
            { do: String.raw`$\ln a_n = \dfrac1n\ln n = \dfrac{\ln n}{n}$`, why: String.raw`$\ln(x^{b}) = b\ln x$.` },
            { do: String.raw`$\displaystyle\lim_{x\to\infty}\frac{\ln x}{x} = \lim_{x\to\infty}\frac{1/x}{1} = 0$`, why: "L'Hôpital (∞/∞)." },
            { do: String.raw`$a_n \to e^0 = 1$`, why: 'Exponentiate back.' },
          ] },
        { label: '(d)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \left(1 - \frac{1}{n^2}\right)^{n}$`, kind: 'numeric', answer: '1',
          hints: [String.raw`The base is $1 - \frac{1}{n^2}$, not $1 + \frac an$: use the logarithm trick.`, String.raw`$\ln a_n = \dfrac{\ln(1 - x^{-2})}{1/x}$ at $x = n$, a $0/0$ form.`, String.raw`Numerator$' = \dfrac{2x^{-3}}{1 - x^{-2}}$ (chain rule), denominator$' = -x^{-2}$.`],
          walkthrough: [
            { do: String.raw`$\ln a_n = n\ln\!\left(1 - \frac{1}{n^2}\right)$`, why: 'Logarithm of a power.' },
            { do: String.raw`$f(x) = \dfrac{\ln(1 - x^{-2})}{x^{-1}}$: form $0/0$`, why: String.raw`$\ln 1 = 0$ and $1/x \to 0$.` },
            { do: String.raw`numerator$' = \dfrac{2x^{-3}}{1 - x^{-2}}$`, why: String.raw`Chain rule: $(1 - x^{-2})' = 2x^{-3}$.` },
            { do: String.raw`$\dfrac{2x^{-3}/(1 - x^{-2})}{-x^{-2}} = \dfrac{-2x^{-1}}{1 - x^{-2}}$`, why: String.raw`$x^{-3}/x^{-2} = x^{-1}$.` },
            { do: String.raw`$\to \dfrac{0}{1 - 0} = 0$`, why: String.raw`$x^{-1} \to 0$, $x^{-2} \to 0$.` },
            { do: String.raw`$a_n \to e^0 = 1$`, why: String.raw`Exponentiate. (Contrast with $(1 - 1/n)^n \to e^{-1}$: here the base approaches $1$ too fast.)` },
          ] },
      ],
    },
    {
      id: 'a3',
      title: 'A recursive sequence',
      difficulty: 'challenge',
      hw: 'HW5-style',
      examples: ['newton-recursion', 'monotone-recursive'],
      statement: String.raw`<p>Let $a_1 = 1$ and $a_{n+1} = \dfrac{a_n}{2} + \dfrac{3}{a_n}$ for $n \ge 1$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $a_2$.`, kind: 'numeric', answer: '7/2',
          hints: [String.raw`Put $a_1 = 1$ into the rule.`, String.raw`$a_2 = \frac12 + \frac31$.`],
          walkthrough: [
            { do: String.raw`$a_2 = \dfrac{a_1}{2} + \dfrac{3}{a_1}$`, why: String.raw`The rule with $n = 1$.` },
            { do: String.raw`$= \dfrac12 + 3$`, why: String.raw`$a_1 = 1$.` },
            { do: String.raw`$= \dfrac72$`, why: String.raw`$3 = \frac62$.` },
          ] },
        { label: '(b)', prompt: String.raw`Compute $a_3$ exactly.`, kind: 'numeric', answer: '73/28', tol: 1e-8,
          hints: [String.raw`Put $a_2 = \frac72$ into the rule.`, String.raw`$\dfrac{7/2}{2} = \dfrac74$ and $\dfrac{3}{7/2} = \dfrac67$.`, String.raw`Common denominator $28$.`],
          walkthrough: [
            { do: String.raw`$a_3 = \dfrac{7/2}{2} + \dfrac{3}{7/2}$`, why: String.raw`The rule with $n = 2$.` },
            { do: String.raw`$= \dfrac74 + \dfrac67$`, why: 'Dividing by a fraction is multiplying by its reciprocal.' },
            { do: String.raw`$= \dfrac{49}{28} + \dfrac{24}{28} = \dfrac{73}{28} \approx 2.6071$`, why: 'Common denominator 28.' },
          ] },
        { label: '(c)', prompt: String.raw`Assuming the sequence converges, find its limit $L$.`, kind: 'numeric', answer: 'sqrt(6)', tol: 1e-8,
          hints: ['Let n → ∞ on both sides of the recursion.', String.raw`$L = \frac L2 + \frac3L$.`, String.raw`$\frac L2 = \frac3L$ gives $L^2 = 6$.`],
          walkthrough: [
            { do: String.raw`$L = \dfrac{L}{2} + \dfrac{3}{L}$`, why: 'Fixed-point equation.' },
            { do: String.raw`$\dfrac{L}{2} = \dfrac{3}{L}$`, why: String.raw`Subtract $\frac L2$.` },
            { do: String.raw`$L^2 = 6$`, why: String.raw`Multiply by $2L$.` },
            { do: String.raw`$L = \sqrt6$`, why: 'All terms are positive, so reject the negative root.' },
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
      examples: ['infinity-zero', 'factorials', 'monotone-recursive', 'squeeze'],
      statement: String.raw`<p>Short exam-style questions. Each uses one technique from the lessons on n-th roots, factorials, recursive sequences and the squeeze theorem.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{n\to\infty} \left(2^n + 5^n\right)^{1/n}$`, kind: 'numeric', answer: '5',
          hints: ['Which term dominates? Squeeze the sum between it and a multiple of it.', String.raw`$5^n \le 2^n + 5^n \le 2\cdot 5^n$.`, String.raw`Take $n$-th roots: $5 \le a_n \le 2^{1/n}\cdot 5$.`],
          walkthrough: [
            { do: String.raw`$5^n \le 2^n + 5^n \le 5^n + 5^n = 2\cdot 5^n$`, why: String.raw`Add a positive number; then $2^n \le 5^n$.` },
            { do: String.raw`$5 \le a_n \le 2^{1/n}\cdot 5$`, why: String.raw`$n$-th roots keep the inequalities; $(5^n)^{1/n} = 5$.` },
            { do: String.raw`$2^{1/n} = e^{(\ln 2)/n} \to e^0 = 1$`, why: String.raw`$c^{1/n} \to 1$ for $c > 0$.` },
            { do: String.raw`$a_n \to 5$`, why: 'Squeeze theorem.' },
          ] },
        { label: '(b)', prompt: String.raw`The sequence $a_n = \dfrac{n!}{n^n}$`, kind: 'choice', choices: [String.raw`converges to $0$`, String.raw`converges to $1$`, String.raw`converges to $e^{-1}$`, String.raw`diverges to $\infty$`], answer: 0,
          hints: [String.raw`Write $a_n$ as a product of $n$ fractions $\frac{k}{n}$, as in the factorial lesson.`, String.raw`Every factor $\frac kn \le 1$; keep only the first one, $\frac1n$.`],
          solution: String.raw`$0 < \dfrac{n!}{n^n} = \dfrac{1}{n}\cdot\dfrac{2}{n}\cdots\dfrac{n}{n} \le \dfrac1n$, because every factor after the first is at most $1$. Squeeze: $a_n \to 0$.` },
        { label: '(c)', prompt: String.raw`$a_1 = 0$, $a_{n+1} = \sqrt{6 + a_n}$. The sequence is increasing and bounded above by $3$. Find $\lim a_n$.`, kind: 'numeric', answer: '3',
          hints: ['The sequence converges (monotone and bounded), so the limit is a fixed point.', String.raw`$L = \sqrt{6 + L}$; square both sides.`, String.raw`$L^2 - L - 6 = (L - 3)(L + 2) = 0$.`],
          walkthrough: [
            { do: String.raw`$L = \sqrt{6 + L}$`, why: 'Fixed point (convergence is given).' },
            { do: String.raw`$L^2 = 6 + L \Rightarrow L^2 - L - 6 = 0$`, why: 'Square and rearrange.' },
            { do: String.raw`$(L - 3)(L + 2) = 0$`, why: 'Factor.' },
            { do: String.raw`$L = 3$`, why: String.raw`All $a_n \ge 0$, so reject $-2$.` },
          ] },
        { label: '(d)', prompt: String.raw`Which statement is true for every sequence?`, choices: [String.raw`If $a_n$ is bounded, it converges.`, String.raw`If $a_n$ is increasing, it converges.`, String.raw`If $|a_n| \to 0$, then $a_n \to 0$.`, String.raw`If $|a_n| \to 1$, then $a_n \to 1$ or $a_n \to -1$.`], kind: 'choice', answer: 2,
          hints: [String.raw`Test each statement on $(-1)^n$ and on $a_n = n$.`, String.raw`One statement follows from the squeeze theorem with $-|a_n| \le a_n \le |a_n|$.`],
          solution: String.raw`$-|a_n| \le a_n \le |a_n|$ and the squeeze theorem give (c). Counterexamples: $(-1)^n$ is bounded and $|(-1)^n| \to 1$ but it diverges; $a_n = n$ is increasing and diverges.` },
      ],
    },
  ],
};
