// Module 2: Limits and continuity.

export default {
  id: 'limits',
  number: 2,
  part: 'foundations',
  title: 'Limits and continuity',
  summary: 'Limits as the value a function approaches, one-sided limits, limit laws, limits at infinity, the squeeze theorem and sin x / x, continuity of piecewise functions and the intermediate value theorem — plus tables of values and zoomed plots in MATLAB.',
  intro: String.raw`<p>Derivatives, integrals and series are all defined as limits, so this is the one idea the whole course rests on. You will watch $x$ approach a point from both sides, learn the algebra that turns a $\frac{0}{0}$ expression into a number, and decide when a piecewise function (such as the velocity of a vehicle that changes driving mode) is continuous. In MATLAB you will build tables of values and zoom in on a graph — the standard way to <i>check</i> a limit numerically.</p>`,
  lessons: [
    {
      id: 'intuitive-limits',
      title: 'What a limit is',
      blocks: [
        { type: 'text', html: String.raw`<p>The function $f(x) = \dfrac{x^2 - 1}{x - 1}$ is not defined at $x = 1$ (it would be $\frac{0}{0}$). Press <b>Approach a</b> and watch the two points slide towards $x = 1$ from the left and from the right. Both values approach $2$, although $f(1)$ does not exist: the graph is the line $y = x + 1$ with a hole.</p>` },
        { type: 'widget', name: 'limit', config: {
          title: 'Approaching x = 1 from both sides',
          f: '(x.^2 - 1)./(x - 1)', a: 1, L: 2, xlim: [-1, 3], ylim: [-0.5, 4.5],
        } },
        { type: 'callout', kind: 'def', title: 'Limit', html: String.raw`<p>We write $\displaystyle\lim_{x \to a} f(x) = L$ if $f(x)$ can be made as close to $L$ as we like by taking $x$ close enough to $a$, <b>but not equal to</b> $a$. The value $f(a)$ — or whether it exists at all — plays no role.</p><p><b>One-sided limits:</b> $\lim_{x \to a^-} f(x)$ uses only $x < a$, and $\lim_{x \to a^+} f(x)$ only $x > a$. The two-sided limit exists exactly when both one-sided limits exist and are equal.</p>` },
        { type: 'text', html: String.raw`<p>The sign function $\dfrac{x}{|x|}$ has value $-1$ for $x < 0$ and $+1$ for $x > 0$. The one-sided limits at $0$ are $-1$ and $+1$; they differ, so $\lim_{x \to 0} \frac{x}{|x|}$ does not exist. Look at the table below the graph.</p>` },
        { type: 'widget', name: 'limit', config: {
          title: 'Different one-sided limits at x = 0',
          f: 'x./abs(x)', a: 0, xlim: [-3, 3], ylim: [-2, 2],
        } },
        { type: 'derive', title: String.raw`Example: $\displaystyle\lim_{x \to 4} \frac{\sqrt{x} - 2}{x - 4}$`, colors: { r: 1, two: 2, d: 3, c: 4, n: 3 }, steps: [
          { kind: 'expand', label: String.raw`Multiply by $\frac{\sqrt{x} + 2}{\sqrt{x} + 2} = 1$`,
            from: String.raw`\frac{\T{r-1}{\sqrt{x}} - \T{two-1}{2}}{\T{d-1}{x - 4}}`,
            to: String.raw`\frac{(\T{r-1}{\sqrt{x}} - \T{two-1}{2})\,\T{c-1}{(\sqrt{x} + 2)}}{\T{d-1}{(x - 4)}\,\T{c-2}{(\sqrt{x} + 2)}}`,
            why: String.raw`Direct substitution gives $\frac{0}{0}$, which is not a value — it only says that more work is needed. Multiplying by a fraction equal to $1$ does not change the value; the conjugate $\sqrt{x} + 2$ is chosen because it removes the root from the numerator.` },
          { kind: 'expand', label: String.raw`$(a - b)(a + b) = a^2 - b^2$`,
            to: String.raw`\frac{\T{n-1}{x - 4}}{\T{d-1}{(x - 4)}\,\T{c-2}{(\sqrt{x} + 2)}}`,
            map: { 'r-1': ['n-1'], 'two-1': ['n-1'], 'c-1': ['n-1'] }, arrows: { 'c-1': 'difference of squares' },
            why: String.raw`With $a = \sqrt{x}$ and $b = 2$: $(\sqrt{x})^2 - 2^2 = x - 4$. The root is gone from the numerator.` },
          { kind: 'cancel', label: String.raw`Cancel $x - 4$ (allowed for $x \ne 4$)`, to: String.raw`\frac{1}{\T{c-2}{\sqrt{x} + 2}}`,
            why: String.raw`A limit never uses $x = 4$ itself, so $x - 4 \ne 0$ and we may divide numerator and denominator by it.` },
          { kind: 'sub', label: String.raw`Let $x \to 4$: substitute`, to: String.raw`\frac{1}{\T{c-2}{\sqrt{4} + 2}} = \frac{1}{4}`,
            why: String.raw`$\frac{1}{\sqrt{x} + 2}$ is continuous at $4$, so its limit is its value there. Hence the limit is $\frac{1}{4}$.` },
        ] },
        { type: 'quiz', question: String.raw`Let $f(x) = \begin{cases} x^2 & x < 2 \\ 5 & x = 2 \\ 6 - x & x > 2 \end{cases}$. What is $\lim_{x \to 2} f(x)$?`, choices: [String.raw`$5$`, String.raw`$4$`, String.raw`It does not exist`, String.raw`$2$`], answer: 1, explain: String.raw`From the left $x^2 \to 4$, from the right $6 - x \to 4$. Both one-sided limits equal $4$, so the limit is $4$. The value $f(2) = 5$ is irrelevant for the limit (it only shows that $f$ is not continuous at $2$).` },
      ],
    },
    {
      id: 'limit-laws-infinity',
      title: 'Limit laws, limits at infinity and infinite limits',
      blocks: [
        { type: 'text', html: String.raw`<p>Drag $c$ to change the coefficient of the leading term. For large $|x|$ only the highest powers matter, so the rational function $\dfrac{c x^2 + x}{x^2 + 1}$ levels off at the horizontal asymptote $y = c$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'A horizontal asymptote',
          functions: [{ expr: '(c*x.^2 + x)./(x.^2 + 1)', label: String.raw`$\frac{c x^2 + x}{x^2 + 1}$` }, { expr: 'c + 0*x', label: String.raw`$y = c$`, dash: true }],
          params: { c: { min: -2, max: 3, value: 2, step: 0.1, label: '$c$' } },
          xlim: [-20, 20], ylim: [-3, 4],
        } },
        { type: 'callout', kind: 'thm', title: 'Limit laws', html: String.raw`<p>If $\lim_{x\to a} f(x) = L$ and $\lim_{x\to a} g(x) = M$ (both finite), then the limit of $f \pm g$ is $L \pm M$, of $f g$ is $L M$, of $f/g$ is $L/M$ provided $M \ne 0$, and of $f(x)^{n}$ is $L^{n}$. Consequently, for polynomials, rational functions (where the denominator is non-zero), roots, $e^x$, $\ln x$ and the trigonometric functions you may <b>substitute</b> $x = a$ whenever the result is defined.</p>` },
        { type: 'callout', kind: 'def', title: 'Limits involving infinity', html: String.raw`<ul><li>$\lim_{x\to\infty} f(x) = L$: $f(x)$ approaches $L$ as $x$ grows without bound. The line $y = L$ is a <b>horizontal asymptote</b>.</li><li>$\lim_{x\to a} f(x) = \infty$: $f(x)$ grows without bound as $x \to a$. The line $x = a$ is a <b>vertical asymptote</b>. The limit does not exist as a number; writing $\infty$ describes <i>how</i> it fails.</li></ul>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Infinite limits at x = 1',
          functions: [{ expr: '1./(x - 1).^2', label: String.raw`$\frac{1}{(x-1)^2}$` }, { expr: '1./(x - 1)', label: String.raw`$\frac{1}{x-1}$` }],
          vlines: [1], xlim: [-2, 4], ylim: [-8, 8],
          caption: String.raw`Both sides of $\frac{1}{(x-1)^2}$ go to $+\infty$, so $\lim_{x\to 1}\frac{1}{(x-1)^2} = \infty$. For $\frac{1}{x-1}$ the left limit is $-\infty$ and the right limit $+\infty$.`,
        } },
        { type: 'derive', title: String.raw`Example: $\displaystyle\lim_{x \to \infty} \frac{2x^2 - 3x}{5x^2 + 1}$`, steps: [
          { kind: 'expand', label: String.raw`Divide every term by $x^2$`,
            from: String.raw`\frac{\T{a-1}{2x^2} - \T{b-1}{3x}}{\T{c-1}{5x^2} + \T{d-1}{1}}`,
            to: String.raw`\frac{\T{a-1}{2} - \T{b-1}{\frac{3}{x}}}{\T{c-1}{5} + \T{d-1}{\frac{1}{x^2}}}`,
            why: String.raw`Numerator and denominator both grow without bound ($\frac{\infty}{\infty}$). Dividing both by the same non-zero number, here the highest power in the denominator $x^2$, does not change the fraction.` },
          { kind: 'sub', label: String.raw`$\frac{3}{x} \to 0$ and $\frac{1}{x^2} \to 0$`,
            to: String.raw`\frac{\T{a-1}{2} - \T{b-1}{0}}{\T{c-1}{5} + \T{d-1}{0}}`,
            why: String.raw`A fixed number divided by something that grows without bound tends to $0$.` },
          { kind: 'result', label: 'Limit laws', to: String.raw`\frac{\T{a-1}{2}}{\T{c-1}{5}}`,
            why: String.raw`By the limit laws the limit is $\frac{2}{5}$. The graph has the horizontal asymptote $y = \frac{2}{5}$.` },
        ] },
        { type: 'derive', title: String.raw`Example: $\displaystyle\lim_{x \to \infty} \left(\sqrt{x^2 + 4x} - x\right)$`, colors: { r: 1, x: 2, c: 4 }, steps: [
          { kind: 'expand', label: String.raw`Multiply by $\frac{\sqrt{x^2+4x} + x}{\sqrt{x^2+4x} + x} = 1$`,
            from: String.raw`\T{r-1}{\sqrt{x^2 + 4x}} - \T{x-1}{x}`,
            to: String.raw`\frac{(\T{r-1}{\sqrt{x^2 + 4x}} - \T{x-1}{x})\,\T{c-1}{(\sqrt{x^2 + 4x} + x)}}{\T{c-2}{\sqrt{x^2 + 4x} + x}}`,
            why: String.raw`This is of the form $\infty - \infty$, which says nothing yet. Multiplying by the conjugate over itself (a fraction equal to $1$) prepares a difference of squares.` },
          { kind: 'expand', label: String.raw`$(a - b)(a + b) = a^2 - b^2$`,
            to: String.raw`\frac{\T{r-1}{(x^2 + 4x)} - \T{x-1}{x^2}}{\T{c-2}{\sqrt{x^2 + 4x} + x}}`,
            map: { 'c-1': ['r-1', 'x-1'] }, arrows: { 'c-1': 'difference of squares' },
            why: String.raw`With $a = \sqrt{x^2+4x}$ and $b = x$, the numerator becomes $a^2 - b^2$: the root disappears.` },
          { kind: 'cancel', label: String.raw`$x^2 - x^2 = 0$`,
            from: String.raw`\frac{\T{q-1}{x^2} + \T{f-1}{4x} - \T{q-2}{x^2}}{\T{c-2}{\sqrt{x^2 + 4x} + x}}`,
            to: String.raw`\frac{\T{f-1}{4x}}{\T{c-2}{\sqrt{x^2 + 4x} + x}}`,
            why: String.raw`$+x^2$ and $-x^2$ have the same size and opposite signs, so together they are $0$.` },
          { kind: 'expand', label: String.raw`Divide every term by $x = \sqrt{x^2}$ ($x > 0$)`,
            from: String.raw`\frac{\T{f-1}{4x}}{\T{s-1}{\sqrt{x^2 + 4x}} + \T{x-1}{x}}`,
            to: String.raw`\frac{\T{f-1}{4}}{\T{s-1}{\sqrt{1 + \frac{4}{x}}} + \T{x-1}{1}}`,
            why: String.raw`Dividing numerator and denominator by $x$ keeps the value. Inside the root, dividing by $x = \sqrt{x^2}$ means dividing $x^2 + 4x$ by $x^2$.` },
          { kind: 'sub', label: String.raw`Let $x \to \infty$: $\frac{4}{x} \to 0$`,
            to: String.raw`\frac{\T{f-1}{4}}{\T{s-1}{\sqrt{1 + 0}} + \T{x-1}{1}} = \frac{4}{2} = 2`,
            why: String.raw`Now nothing is indeterminate: the limit is $\frac{4}{1 + 1} = 2$.` },
        ] },
        { type: 'quiz', question: String.raw`What is $\displaystyle\lim_{x \to 3^-} \frac{x}{x - 3}$?`, choices: [String.raw`$+\infty$`, String.raw`$-\infty$`, String.raw`$1$`, String.raw`$0$`], answer: 1, explain: String.raw`For $x$ slightly less than $3$ the numerator is close to $3 > 0$ and the denominator is a small <i>negative</i> number, so the quotient is a large negative number: $-\infty$.` },
      ],
    },
    {
      id: 'squeeze',
      title: 'The squeeze theorem and sin x / x',
      blocks: [
        { type: 'text', html: String.raw`<p>Substitution fails for $\dfrac{\sin x}{x}$ at $x = 0$, and no algebraic trick removes the $\frac{0}{0}$. The table of values strongly suggests the limit $1$. This limit is the reason why $\frac{\mathrm d}{\mathrm d x}\sin x = \cos x$, and it reappears in Homework 0 as the integrand of the sine integral $\mathrm{Si}(x)$.</p>` },
        { type: 'widget', name: 'limit', config: {
          title: 'sin x / x near 0',
          f: 'sin(x)./x', a: 0, L: 1, xlim: [-8, 8], ylim: [-0.5, 1.4],
        } },
        { type: 'callout', kind: 'thm', title: 'Squeeze theorem', html: String.raw`<p>If $g(x) \le f(x) \le h(x)$ for all $x$ near $a$ (except possibly at $a$) and $\lim_{x\to a} g(x) = \lim_{x\to a} h(x) = L$, then $\lim_{x\to a} f(x) = L$.</p>` },
        { type: 'text', html: String.raw`<p>A geometric argument with areas in the unit circle gives $\cos x \le \dfrac{\sin x}{x} \le 1$ for $0 < |x| < \frac{\pi}{2}$. Both bounds tend to $1$, so</p>$$\lim_{x \to 0} \frac{\sin x}{x} = 1 \qquad (x \text{ in radians}).$$<p>The squeeze theorem also handles oscillating factors. Below, $x^2 \sin(1/x)$ oscillates infinitely often near $0$ but is trapped between $-x^2$ and $x^2$, which both tend to $0$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Squeezing x² sin(1/x) between ±x²',
          functions: [{ expr: 'x.^2.*sin(1./x)', label: String.raw`$x^2\sin(1/x)$` }, { expr: 'x.^2', label: String.raw`$x^2$`, dash: true }, { expr: '-x.^2', label: String.raw`$-x^2$`, dash: true }],
          xlim: [-0.5, 0.5], ylim: [-0.25, 0.25],
        } },
        { type: 'derive', title: String.raw`Example: $\displaystyle\lim_{x \to 0} \frac{1 - \cos x}{x^2}$`, colors: { n: 1, d: 2, c: 4, s: 1 }, steps: [
          { kind: 'expand', label: String.raw`Multiply by $\frac{1 + \cos x}{1 + \cos x} = 1$`,
            from: String.raw`\frac{\T{n-1}{1 - \cos x}}{\T{d-1}{x^2}}`,
            to: String.raw`\frac{\T{n-1}{(1 - \cos x)}\,\T{c-1}{(1 + \cos x)}}{\T{d-1}{x^2}\,\T{c-2}{(1 + \cos x)}}`,
            why: String.raw`Substitution gives $\frac{0}{0}$. Multiplying by a fraction equal to $1$ keeps the value and prepares a difference of squares.` },
          { kind: 'expand', label: String.raw`$(1 - \cos x)(1 + \cos x) = 1 - \cos^2 x$`,
            to: String.raw`\frac{\T{n-1}{1 - \cos^2 x}}{\T{d-1}{x^2}\,\T{c-2}{(1 + \cos x)}}`, map: { 'c-1': ['n-1'] }, arrows: { 'c-1': 'difference of squares' },
            why: String.raw`$(a - b)(a + b) = a^2 - b^2$ with $a = 1$, $b = \cos x$.` },
          { kind: 'sub', label: String.raw`$1 - \cos^2 x = \sin^2 x$`,
            to: String.raw`\frac{\T{n-1}{\sin^2 x}}{\T{d-1}{x^2}\,\T{c-2}{(1 + \cos x)}}`,
            why: String.raw`From $\sin^2 x + \cos^2 x = 1$, subtracting $\cos^2 x$ from both sides.` },
          { kind: 'factor', label: 'Split into the standard limit times the rest',
            to: String.raw`\left(\frac{\T{n-1}{\sin x}}{\T{d-1}{x}}\right)^2 \cdot \frac{1}{\T{c-2}{1 + \cos x}}`,
            why: String.raw`$\frac{\sin^2 x}{x^2} = \left(\frac{\sin x}{x}\right)^2$, and we know the limit of $\frac{\sin x}{x}$.` },
          { kind: 'sub', label: String.raw`Let $x \to 0$`,
            from: String.raw`\T{s-1}{\left(\frac{\sin x}{x}\right)}^2 \cdot \frac{1}{\T{c-2}{1 + \cos x}}`,
            to: String.raw`\T{s-1}{1}^2 \cdot \frac{1}{\T{c-2}{1 + 1}} = \frac{1}{2}`,
            why: String.raw`By the limit laws and $\lim_{x\to0}\frac{\sin x}{x} = 1$, $\cos 0 = 1$: the limit is $1^2\cdot\frac{1}{2} = \frac{1}{2}$.` },
        ] },
        { type: 'callout', kind: 'key', html: String.raw`<p>Rescale to the standard limit: $\displaystyle\lim_{x \to 0} \frac{\sin(kx)}{x} = \lim_{x \to 0} k\,\frac{\sin(kx)}{kx} = k$, because $u = kx \to 0$ as well.</p>` },
        { type: 'quiz', question: String.raw`What is $\displaystyle\lim_{x \to 0} \frac{\sin(6x)}{2x}$?`, choices: [String.raw`$1$`, String.raw`$3$`, String.raw`$6$`, String.raw`$\frac{1}{3}$`], answer: 1, explain: String.raw`$\frac{\sin 6x}{2x} = 3\cdot\frac{\sin 6x}{6x} \to 3 \cdot 1 = 3$.` },
      ],
    },
    {
      id: 'continuity',
      title: 'Continuity, piecewise functions and the IVT',
      blocks: [
        { type: 'text', html: String.raw`<p>A vehicle accelerates with velocity $v(t) = k t^2$ for $0 \le t < 2$ and then decelerates with $v(t) = 12 - 2t$ for $t \ge 2$ (units m/s). A real velocity cannot jump, so $k$ must make the two pieces meet. Drag $k$ until the jump disappears.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Choosing k to make a piecewise velocity continuous',
          functions: [{ expr: '(x < 2).*(k*x.^2) + (x >= 2).*(12 - 2*x)', label: String.raw`$v(t)$ ($t$ on the horizontal axis)` }],
          params: { k: { min: 0.5, max: 4, value: 1, step: 0.05, label: '$k$' } },
          points: [{ x: 2, y: '4*k', hollow: true }, { x: 2, y: 8, label: 'v(2) = 8' }],
          xlim: [0, 6], ylim: [0, 14],
          readout: String.raw`Left limit $\lim_{t\to2^-} v(t) = 4k = {{4*k}}$, right limit $= 8$, jump $= {{8 - 4*k}}$.`,
        } },
        { type: 'callout', kind: 'def', title: 'Continuity', html: String.raw`<p>$f$ is <b>continuous at $a$</b> if $\displaystyle\lim_{x \to a} f(x) = f(a)$. This hides three requirements: $f(a)$ is defined, the limit exists, and the two are equal. $f$ is continuous on an interval if it is continuous at every point of it (one-sided at closed endpoints).</p>` },
        { type: 'table', head: ['Type of discontinuity at $a$', 'What happens', 'Example'], rows: [
          ['Removable', String.raw`$\lim_{x\to a} f(x)$ exists, but $f(a)$ is undefined or different`, String.raw`$\frac{x^2-1}{x-1}$ at $a = 1$`],
          ['Jump', 'Both one-sided limits exist (finite) but differ', String.raw`$\frac{x}{|x|}$ at $a = 0$`],
          ['Infinite', 'A one-sided limit is $\\pm\\infty$ (vertical asymptote)', String.raw`$\frac{1}{x-1}$ at $a = 1$`],
          ['Oscillating', 'No one-sided limit exists', String.raw`$\sin(1/x)$ at $a = 0$`],
        ] },
        { type: 'derive', title: String.raw`Example: choose $k$ so that $v(t) = \begin{cases} k t^2 & 0 \le t < 2 \\ 12 - 2t & t \ge 2 \end{cases}$ is continuous`, colors: { k: 1, t: 2, a: 3, b: 4 }, steps: [
          { kind: 'sub', label: String.raw`One-sided limits at $t = 2$: substitute $t = 2$`,
            from: String.raw`\lim_{t \to 2^-} \T{k-1}{k}\,\T{t-1}{t}^2 = \lim_{t \to 2^+} (12 - 2\,\T{t-2}{t})`,
            to: String.raw`\T{k-1}{k}\cdot\T{t-1}{2}^2 = 12 - 2\cdot\T{t-2}{2}`,
            why: String.raw`Each piece is a polynomial, hence continuous on its own interval; the only point to check is the junction $t = 2$. Continuity there requires left limit $=$ right limit $= v(2)$. Polynomials are continuous, so each limit is found by substituting $t = 2$.` },
          { kind: 'calc', label: String.raw`$2^2 = 4$ and $12 - 4 = 8$`,
            from: String.raw`\T{k-1}{k}\cdot\T{a-1}{2^2} = \T{b-1}{12 - 2\cdot 2}`,
            to: String.raw`\T{a-1}{4}\,\T{k-1}{k} = \T{b-1}{8}`,
            why: String.raw`The left limit is $4k$, the right limit (and $v(2)$) is $8$.` },
          { kind: 'both', label: String.raw`Both sides $\div 4$`, to: String.raw`\T{k-1}{k} = \frac{\T{b-1}{8}}{\T{a-1}{4}} = 2`, arrows: { 'a-1': '÷4 on both sides' },
            why: String.raw`Dividing both sides by $4$ leaves $k$ alone: $k = 2$. For any other $k$ the velocity has a jump discontinuity at $t = 2$.` },
        ] },
        { type: 'callout', kind: 'thm', title: 'Intermediate value theorem (IVT)', html: String.raw`<p>If $f$ is continuous on the closed interval $[a, b]$ and $s$ is any number between $f(a)$ and $f(b)$, then $f(c) = s$ for at least one $c \in [a, b]$. In particular, if $f(a)$ and $f(b)$ have opposite signs, $f$ has a <b>root</b> in $(a, b)$. This is what <code>fzero(f, [a b])</code> relies on.</p>` },
        { type: 'steps', title: String.raw`Example: $x^3 + x - 1 = 0$ has a solution in $(0, 1)$`, steps: [
          String.raw`Let $f(x) = x^3 + x - 1$. It is a polynomial, so it is continuous on $[0, 1]$.`,
          String.raw`We evaluate at the endpoints: $f(0) = -1 < 0$ and $f(1) = 1 > 0$.`,
          String.raw`Since $0$ lies between $f(0)$ and $f(1)$, the IVT gives $c \in (0, 1)$ with $f(c) = 0$. (Numerically, $c \approx 0.6823$.)`,
        ] },
        { type: 'quiz', question: String.raw`What kind of discontinuity does $f(x) = \dfrac{x^2 - 4}{x - 2}$ have at $x = 2$?`, choices: ['Removable', 'Jump', 'Infinite', 'None — it is continuous'], answer: 0, explain: String.raw`$f(x) = x + 2$ for $x \ne 2$, so the limit is $4$, but $f(2)$ is undefined. Defining $f(2) = 4$ would remove the discontinuity.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'tables-of-values',
      title: 'Limits in the Live Editor: notation and tables of values',
      blocks: [
        { type: 'text', html: String.raw`<p>A limit in a written solution is typeset with <code>\lim_{x \to a}</code>: the subscript goes under "lim" in display equations. Use <code>\left(</code> … <code>\right)</code> so that brackets grow with what they enclose.</p>` },
        { type: 'table', head: ['Type', 'Result'], rows: [
          [String.raw`<code>\lim_{x \to 0} \frac{\sin x}{x} = 1</code>`, String.raw`$\displaystyle\lim_{x \to 0} \frac{\sin x}{x} = 1$`],
          [String.raw`<code>\lim_{x \to 2^-} f(x)</code>, <code>\lim_{x \to 2^+} f(x)</code>`, String.raw`$\displaystyle\lim_{x \to 2^-} f(x),\ \lim_{x \to 2^+} f(x)$`],
          [String.raw`<code>\lim_{x \to \infty} e^{-x} = 0</code>`, String.raw`$\displaystyle\lim_{x \to \infty} e^{-x} = 0$`],
          [String.raw`<code>\left( 1 + \frac{1}{n} \right)^n</code>`, String.raw`$\left( 1 + \frac{1}{n} \right)^n$`],
        ] },
        { type: 'latex', prompt: 'Type the standard trigonometric limit:', target: String.raw`\lim_{x \to 0} \frac{\sin x}{x} = 1` },
        { type: 'latex', prompt: 'Type this limit at infinity (use \\left( and \\right)):', target: String.raw`\lim_{x \to \infty} \left( 1 + \frac{1}{x} \right)^x = e` },
        { type: 'latex', prompt: 'Type this one-sided infinite limit:', target: String.raw`\lim_{x \to 3^-} \frac{x}{x - 3} = -\infty` },
        { type: 'text', html: String.raw`<p>Numerically, a limit is checked by evaluating $f$ at points that approach $a$. The vector <code>10.^-(1:6)</code> is $[10^{-1}, 10^{-2}, \dots, 10^{-6}]$, so <code>x = 1 - 10.^-(1:6)</code> approaches $1$ from the left. <code>format long</code> shows 15 significant digits; <code>fprintf</code> prints a formatted table — it cycles through the columns of the matrix you give it.</p>` },
        { type: 'code', caption: 'Approach x = 1 from the left and from the right. Edit f and run again.', editable: true, code: `f = @(x) (x.^2 - 1) ./ (x - 1);
h = 10.^-(1:6);            % step sizes 0.1, 0.01, ..., 1e-6
xl = 1 - h;                % from the left
xr = 1 + h;                % from the right
format long
[xl' f(xl)']               % two-column table
fprintf('%10.6f   %.10f\\n', [xr; f(xr)])
format short` },
        { type: 'callout', kind: 'warn', title: 'Rounding errors near the limit point', html: String.raw`<p>Do not push $h$ too far. For $\frac{1 - \cos x}{x^2}$ at $x = 10^{-8}$ the computer evaluates $\cos x$ as exactly $1$, so the quotient comes out as $0$, not $\frac{1}{2}$. Values from $h = 10^{-1}$ to about $10^{-5}$ are reliable; trust the trend, not the last digit.</p>` },
        { type: 'code', code: `g = @(x) (1 - cos(x)) ./ x.^2;
g(10.^-(1:8))` },
        { type: 'matlab', prompt: String.raw`Tabulate $f(x) = \dfrac{1 - x^3}{1 - x}$ for <code>x = 1 - 10.^-(1:6)</code>. Store the values in <code>y</code> and the last value (the one closest to $x = 1$) in <code>last</code>. What limit do you expect?`, starter: `f = @(x) 0;   % replace 0 by the formula\nx = 1 - 10.^-(1:6);\ny = f(x)\nlast = 0;    % the last element of y`, solution: `f = @(x) (1 - x.^3) ./ (1 - x);\nx = 1 - 10.^-(1:6);\ny = f(x)\nlast = y(end)`, checks: [{ var: 'y', size: 6 }, { var: 'last', value: 3, tol: 1e-4, message: 'last should be about 3, since 1 - x^3 = (1 - x)(1 + x + x^2).' }], hint: String.raw`<code>y(end)</code> is the last element of a vector. Use <code>./</code> and <code>.^</code>.` },
        { type: 'matlab', prompt: String.raw`Estimate $\displaystyle\lim_{x \to 0} \frac{e^{3x} - 1}{x}$: evaluate the quotient at <code>x = 1e-6</code> and store the value in <code>L</code>. Print it with <code>fprintf</code> to 6 decimals.`, starter: `q = @(x) 0;   % replace 0 by the quotient\nL = 0;       % value at x = 1e-6\n% print L with fprintf`, solution: `q = @(x) (exp(3*x) - 1) ./ x;\nL = q(1e-6);\nfprintf('L = %.6f\\n', L)`, checks: [{ var: 'L', value: 3, tol: 1e-4 }, { output: 'L =', message: "Print with fprintf('L = %.6f\\n', L)." }] },
      ],
    },
    {
      id: 'zooming',
      title: 'Zooming in on a point and writing a limit answer',
      blocks: [
        { type: 'text', html: String.raw`<p>A graph near the limit point is the second numerical check. <code>fplot</code> draws $f$ on an interval; <code>xlim</code> and <code>ylim</code> set the visible window, and <code>hold on</code> keeps the curve while you add a marker for the limit value.</p>` },
        { type: 'code', caption: 'Zoom: change the window to [-0.01 0.01] and run again.', editable: true, code: `f = @(x) sin(3*x) ./ x;
fplot(f, [-1 1])
hold on
plot(0, 3, 'o')            % the expected limit value
hold off
xlim([-0.5 0.5])
ylim([2 3.2])
grid on
title('sin(3x)/x near x = 0')` },
        { type: 'text', html: String.raw`<p>A good written answer states the method, does the algebra in LaTeX, and uses MATLAB only to confirm. This is the format the homework expects:</p>` },
        { type: 'livescript', caption: 'Model answer: a piecewise velocity', blocks: [
          { type: 'heading', content: 'Problem 1 (Attempted)' },
          { type: 'text', content: 'The velocity of a cart is $v(t) = t^2 + 1$ for $0 \\le t < 3$ and $v(t) = c\\,(t - 1)$ for $t \\ge 3$. We find $c$ such that $v$ is continuous. Both pieces are polynomials, so we only need to check $t = 3$. We compute the one-sided limits:' },
          { type: 'equation', content: String.raw`\lim_{t \to 3^-} v(t) = 3^2 + 1 = 10, \qquad \lim_{t \to 3^+} v(t) = c\,(3 - 1) = 2c = v(3).` },
          { type: 'text', content: 'Continuity requires the limits to be equal, so $2c = 10$, which gives $c = 5$. We confirm with a plot that the two pieces meet at $t = 3$:' },
          { type: 'code', content: "c = 5;\nv = @(t) (t < 3).*(t.^2 + 1) + (t >= 3).*(c*(t - 1));\nfplot(v, [0 6])\nxlim([2 4]); ylim([5 15])\ngrid on" },
        ] },
        { type: 'callout', kind: 'matlab', title: 'Piecewise functions in MATLAB', html: String.raw`<p>A comparison such as <code>(t &lt; 3)</code> is $1$ where true and $0$ where false, so <code>(t &lt; 3).*g1(t) + (t &gt;= 3).*g2(t)</code> is a vectorised piecewise function. Make sure the conditions do not overlap.</p>` },
        { type: 'matlab', prompt: String.raw`Define the piecewise function $f(x) = \begin{cases} x^2 & x < 1 \\ 3 - 2x & x \ge 1 \end{cases}$ as a vectorised anonymous function <code>f</code>. Store the left limit estimate <code>fl = f(1 - 1e-8)</code> and the value <code>fr = f(1)</code>. Is $f$ continuous at $1$?`, starter: `f = @(x) 0;   % use (x < 1).*piece1 + (x >= 1).*piece2\nfl = f(1 - 1e-8)\nfr = f(1)`, solution: `f = @(x) (x < 1).*x.^2 + (x >= 1).*(3 - 2*x);\nfl = f(1 - 1e-8)\nfr = f(1)`, checks: [{ var: 'f', isFunction: true }, { var: 'fl', value: 1, tol: 1e-6 }, { var: 'fr', value: 1 }], success: 'Both values are 1, and each piece is continuous: f is continuous at x = 1.' },
        { type: 'matlab', prompt: String.raw`Plot $g(x) = \dfrac{x^2 - 9}{x - 3}$ on $[2, 4]$ with <code>fplot</code>, then restrict the vertical axis to $[5, 7]$ with <code>ylim</code>. The hole at $x = 3$ is invisible, but the graph shows the limit value $6$.`, starter: `g = @(x) 0;   % replace 0 by the formula\nfplot(g, [2 4])\n`, solution: `g = @(x) (x.^2 - 9) ./ (x - 3);\nfplot(g, [2 4])\nylim([5 7])\ngrid on`, checks: [{ figure: true }, { uses: 'ylim' }, { noWarning: true, message: 'Vectorise the function with .^ and ./' }] },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Limits by algebra',
      difficulty: 'core',
      statement: String.raw`<p>Evaluate the limits exactly. Enter numbers or exact MATLAB expressions such as <code>1/6</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{x \to 3} \frac{x^2 - x - 6}{x - 3}$`, kind: 'numeric', answer: '5', hint: 'Factor the numerator.', solution: [
          { type: 'text', html: String.raw`<p>We factor the numerator, cancel the common factor and then substitute $x = 3$.</p>` },
          { type: 'derive', steps: [
            { kind: 'factor', label: 'Factor the numerator', from: String.raw`\frac{\T{n-1}{x^2 - x - 6}}{\T{d-1}{x - 3}}`,
              to: String.raw`\frac{\T{q-1}{(x - 3)}\,\T{p-1}{(x + 2)}}{\T{d-1}{x - 3}}`, map: { 'n-1': ['q-1', 'p-1'] }, arrows: { 'n-1': '' },
              why: String.raw`We need two numbers with product $-6$ and sum $-1$: $-3$ and $2$.` },
            { kind: 'cancel', label: String.raw`Cancel $x - 3$ ($x \ne 3$)`, to: String.raw`\T{p-1}{x + 2}`,
              why: String.raw`In the limit $x \ne 3$, so $x - 3 \ne 0$ and we may divide numerator and denominator by it.` },
            { kind: 'sub', label: String.raw`Substitute $x = 3$`, to: String.raw`\T{p-1}{3 + 2} = 5`, why: String.raw`$x + 2$ is continuous, so the limit is $5$.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\lim_{x \to 0} \frac{\sqrt{x + 9} - 3}{x}$`, kind: 'numeric', answer: '1/6', hint: String.raw`Multiply by the conjugate $\sqrt{x+9} + 3$.`, solution: [
          { type: 'text', html: String.raw`<p>We multiply by the conjugate to remove the root, cancel $x$, and substitute.</p>` },
          { type: 'derive', colors: { r: 1, t: 2, d: 3, c: 4, n: 3 }, steps: [
            { kind: 'expand', label: String.raw`Multiply by $\frac{\sqrt{x+9}+3}{\sqrt{x+9}+3} = 1$`, from: String.raw`\frac{\T{r-1}{\sqrt{x + 9}} - \T{t-1}{3}}{\T{d-1}{x}}`,
              to: String.raw`\frac{(\T{r-1}{\sqrt{x + 9}} - \T{t-1}{3})\,\T{c-1}{(\sqrt{x + 9} + 3)}}{\T{d-1}{x}\,\T{c-2}{(\sqrt{x + 9} + 3)}}`,
              why: String.raw`Substitution gives $\frac{0}{0}$. Multiplying by $1$ in this form keeps the value and prepares a difference of squares.` },
            { kind: 'expand', label: String.raw`$(a - b)(a + b) = a^2 - b^2$`, to: String.raw`\frac{\T{n-1}{x}}{\T{d-1}{x}\,\T{c-2}{(\sqrt{x + 9} + 3)}}`,
              map: { 'r-1': ['n-1'], 't-1': ['n-1'], 'c-1': ['n-1'] }, arrows: { 'c-1': 'difference of squares' },
              why: String.raw`$(\sqrt{x+9})^2 - 3^2 = x + 9 - 9 = x$.` },
            { kind: 'cancel', label: String.raw`Cancel $x$ ($x \ne 0$)`, to: String.raw`\frac{1}{\T{c-2}{\sqrt{x + 9} + 3}}`, why: String.raw`In the limit $x \ne 0$, so we may divide numerator and denominator by $x$.` },
            { kind: 'sub', label: String.raw`Substitute $x = 0$`, to: String.raw`\frac{1}{\T{c-2}{\sqrt{9} + 3}} = \frac{1}{6}`, why: String.raw`The expression is continuous at $0$.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`$\displaystyle\lim_{x \to 0} \frac{\sin(5x)}{2x}$`, kind: 'numeric', answer: '5/2', solution: [
          { type: 'text', html: String.raw`<p>We make the denominator match the angle $5x$, so that the standard limit $\frac{\sin u}{u} \to 1$ applies.</p>` },
          { type: 'derive', steps: [
            { kind: 'expand', label: String.raw`Multiply by $\frac{5}{5} = 1$`, from: String.raw`\frac{\sin 5x}{\T{t-1}{2}\,\T{x-1}{x}}`,
              to: String.raw`\frac{\T{f-1}{5}}{\T{t-1}{2}} \cdot \frac{\sin 5x}{\T{f-2}{5}\,\T{x-1}{x}}`, arrows: { 't-1': 'pulled out in front' },
              why: String.raw`Multiplying by $1$ keeps the value. One $5$ goes under $x$ to build $5x$; the other stays in front with the $2$.` },
            { kind: 'sub', label: String.raw`$u = 5x \to 0$, so $\frac{\sin u}{u} \to 1$`, from: String.raw`\frac{5}{2} \cdot \T{s-1}{\frac{\sin 5x}{5x}}`,
              to: String.raw`\frac{5}{2} \cdot \T{s-1}{1} = \frac{5}{2}`, why: String.raw`As $x \to 0$ also $u = 5x \to 0$, so the standard limit applies.` },
          ] },
        ] },
        { label: '(d)', prompt: String.raw`$\displaystyle\lim_{x \to 0} \frac{1 - \cos(2x)}{x^2}$`, kind: 'numeric', answer: '2', hint: String.raw`Use $\lim_{u\to0}\frac{1-\cos u}{u^2} = \frac12$ with $u = 2x$.`, solution: [
          { type: 'text', html: String.raw`<p>We substitute $u = 2x$ to reach the known limit $\frac{1 - \cos u}{u^2} \to \frac{1}{2}$.</p>` },
          { type: 'derive', steps: [
            { kind: 'sub', label: String.raw`$u = 2x$, so $x = \frac{u}{2}$ and $x^2 = \frac{u^2}{4}$`, from: String.raw`\frac{1 - \cos \T{u-1}{2x}}{\T{x-1}{x^2}}`,
              to: String.raw`\frac{1 - \cos \T{u-1}{u}}{\T{x-1}{u^2/4}}`, why: String.raw`Every $x$ is written in terms of $u$. As $x \to 0$, also $u \to 0$.` },
            { kind: 'calc', label: String.raw`Dividing by $\frac{u^2}{4}$ is multiplying by $\frac{4}{u^2}$`, from: String.raw`\frac{1 - \cos u}{u^2/\T{f-1}{4}}`,
              to: String.raw`\T{f-1}{4} \cdot \frac{1 - \cos u}{u^2}`, arrows: { 'f-1': 'out of the denominator' },
              why: String.raw`A $4$ that divides the denominator multiplies the whole fraction.` },
            { kind: 'sub', label: String.raw`$u \to 0$: the standard limit is $\frac{1}{2}$`, from: String.raw`4 \cdot \T{l-1}{\frac{1 - \cos u}{u^2}}`,
              to: String.raw`4 \cdot \T{l-1}{\frac{1}{2}} = 2`, why: String.raw`We use $\lim_{u\to0}\frac{1-\cos u}{u^2} = \frac12$ from the lesson.` },
          ] },
        ] },
      ],
    },
    {
      id: 'a2',
      title: 'Limits at infinity and infinite limits',
      difficulty: 'core',
      statement: String.raw`<p>Evaluate the limits.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{x \to \infty} \frac{4x^3 - x}{2x^3 + 7}$`, kind: 'numeric', answer: '2', solution: [
          { type: 'text', html: String.raw`<p>We divide every term by the highest power in the denominator, $x^3$.</p>` },
          { type: 'derive', steps: [
            { kind: 'expand', label: String.raw`Divide every term by $x^3$`, from: String.raw`\frac{\T{a-1}{4x^3} - \T{b-1}{x}}{\T{c-1}{2x^3} + \T{d-1}{7}}`,
              to: String.raw`\frac{\T{a-1}{4} - \T{b-1}{\frac{1}{x^2}}}{\T{c-1}{2} + \T{d-1}{\frac{7}{x^3}}}`, why: String.raw`Dividing numerator and denominator by the same non-zero number keeps the fraction's value.` },
            { kind: 'sub', label: String.raw`$\frac{1}{x^2} \to 0$, $\frac{7}{x^3} \to 0$`, to: String.raw`\frac{\T{a-1}{4} - \T{b-1}{0}}{\T{c-1}{2} + \T{d-1}{0}} = 2`, why: String.raw`A fixed number over a growing power tends to $0$; what remains is $\frac{4}{2}$.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\lim_{x \to \infty} \left(\sqrt{x^2 + 3x} - x\right)$`, kind: 'numeric', answer: '3/2', hint: 'Multiply and divide by the conjugate.', solution: [
          { type: 'text', html: String.raw`<p>We multiply and divide by the conjugate, simplify, and divide by $x$.</p>` },
          { type: 'derive', colors: { r: 1, x: 2, c: 4 }, steps: [
            { kind: 'expand', label: String.raw`Multiply by $\frac{\sqrt{x^2+3x} + x}{\sqrt{x^2+3x} + x} = 1$`, from: String.raw`\T{r-1}{\sqrt{x^2 + 3x}} - \T{x-1}{x}`,
              to: String.raw`\frac{(\T{r-1}{\sqrt{x^2 + 3x}} - \T{x-1}{x})\,\T{c-1}{(\sqrt{x^2 + 3x} + x)}}{\T{c-2}{\sqrt{x^2 + 3x} + x}}`,
              why: String.raw`$\infty - \infty$ is indeterminate. Multiplying by $1$ in this form prepares a difference of squares.` },
            { kind: 'expand', label: String.raw`$(a - b)(a + b) = a^2 - b^2$`, to: String.raw`\frac{\T{r-1}{(x^2 + 3x)} - \T{x-1}{x^2}}{\T{c-2}{\sqrt{x^2 + 3x} + x}}`,
              map: { 'c-1': ['r-1', 'x-1'] }, arrows: { 'c-1': 'difference of squares' }, why: String.raw`The root disappears from the numerator.` },
            { kind: 'cancel', label: String.raw`$x^2 - x^2 = 0$`, from: String.raw`\frac{\T{q-1}{x^2} + \T{f-1}{3x} - \T{q-2}{x^2}}{\T{c-2}{\sqrt{x^2 + 3x} + x}}`,
              to: String.raw`\frac{\T{f-1}{3x}}{\T{c-2}{\sqrt{x^2 + 3x} + x}}`, why: String.raw`Equal terms with opposite signs add to $0$.` },
            { kind: 'expand', label: String.raw`Divide every term by $x = \sqrt{x^2}$ ($x > 0$)`, from: String.raw`\frac{\T{f-1}{3x}}{\T{s-1}{\sqrt{x^2 + 3x}} + \T{x-1}{x}}`,
              to: String.raw`\frac{\T{f-1}{3}}{\T{s-1}{\sqrt{1 + 3/x}} + \T{x-1}{1}}`, why: String.raw`Inside the root, dividing by $x = \sqrt{x^2}$ divides $x^2 + 3x$ by $x^2$.` },
            { kind: 'sub', label: String.raw`$\frac{3}{x} \to 0$`, to: String.raw`\frac{\T{f-1}{3}}{\T{s-1}{\sqrt{1 + 0}} + \T{x-1}{1}} = \frac{3}{2}`, why: String.raw`Nothing is indeterminate any more.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`$\displaystyle\lim_{x \to \infty} \frac{3e^{2x} + 1}{e^{2x} - 5}$`, kind: 'numeric', answer: '3', solution: [
          { type: 'text', html: String.raw`<p>We divide every term by the fastest-growing term, $e^{2x}$.</p>` },
          { type: 'derive', steps: [
            { kind: 'expand', label: String.raw`Divide every term by $e^{2x}$`, from: String.raw`\frac{\T{a-1}{3e^{2x}} + \T{b-1}{1}}{\T{c-1}{e^{2x}} - \T{d-1}{5}}`,
              to: String.raw`\frac{\T{a-1}{3} + \T{b-1}{e^{-2x}}}{\T{c-1}{1} - \T{d-1}{5e^{-2x}}}`, why: String.raw`Dividing numerator and denominator by the same positive number keeps the value; $\frac{1}{e^{2x}} = e^{-2x}$.` },
            { kind: 'sub', label: String.raw`$e^{-2x} \to 0$`, to: String.raw`\frac{\T{a-1}{3} + \T{b-1}{0}}{\T{c-1}{1} - \T{d-1}{0}} = 3`, why: String.raw`As $x \to \infty$, $e^{-2x} \to 0$.` },
          ] },
        ] },
        { label: '(d)', prompt: String.raw`$\displaystyle\lim_{x \to 2^-} \frac{x + 1}{x - 2}$`, kind: 'choice', choices: [String.raw`$+\infty$`, String.raw`$-\infty$`, String.raw`$0$`, String.raw`$\frac{3}{4}$`], answer: 1, solution: String.raw`The numerator tends to $3 > 0$ and the denominator to $0$ through negative values, so the quotient tends to $-\infty$.` },
      ],
    },
    {
      id: 'a3',
      title: 'A piecewise velocity',
      difficulty: 'core',
      statement: String.raw`<p>A test vehicle has velocity (m/s) $$v(t) = \begin{cases} t^3 - 2t & 0 \le t < 2, \\ c\,(6 - t) & 2 \le t \le 6. \end{cases}$$</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $\lim_{t \to 2^-} v(t)$.`, kind: 'numeric', answer: '4', solution: String.raw`$t^3 - 2t$ is continuous, so the left limit is $8 - 4 = 4$.` },
        { label: '(b)', prompt: String.raw`For which value of $c$ is $v$ continuous on $[0, 6]$?`, kind: 'numeric', answer: '1', solution: String.raw`The right limit is $v(2) = 4c$. Continuity at $t = 2$ requires $4c = 4$, so $c = 1$. Both pieces are polynomials, so there is no other point to check.` },
        { label: '(c)', prompt: String.raw`Let $c = 2$. Compute $\lim_{t \to 2^+} v(t)$.`, kind: 'numeric', answer: '8', solution: String.raw`$\lim_{t\to2^+} 2(6 - t) = 8$.` },
        { label: '(d)', prompt: String.raw`With $c = 2$, what kind of discontinuity does $v$ have at $t = 2$?`, kind: 'choice', choices: ['Removable', 'Jump', 'Infinite', 'Oscillating'], answer: 1, solution: String.raw`Both one-sided limits exist and are finite ($4$ and $8$) but differ: a jump discontinuity of size $4$ m/s.` },
      ],
    },
    {
      id: 'a4',
      title: 'Locating a root with the IVT',
      difficulty: 'core',
      statement: String.raw`<p>Let $f(x) = x^3 - 4x + 1$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`On which interval does the intermediate value theorem guarantee a root of $f$?`, kind: 'choice', choices: [String.raw`$[-1, 0]$`, String.raw`$[0, 1]$`, String.raw`$[1, 1.5]$`, String.raw`$[2, 3]$`], answer: 1, solution: String.raw`$f(0) = 1 > 0$ and $f(1) = -2 < 0$, and $f$ is continuous, so there is a root in $(0, 1)$. On the other intervals the endpoint values have the same sign: $f(-1) = 4$, $f(0) = 1$; $f(1) = -2$, $f(1.5) = -1.625$; $f(2) = 1$, $f(3) = 16$.` },
        { label: '(b)', prompt: String.raw`Find that root to at least four decimals (use <code>fzero(f, [0 1])</code>).`, kind: 'numeric', answer: '0.254101688365052', tol: 1e-4, solution: String.raw`<code>fzero(@(x) x.^3 - 4*x + 1, [0 1])</code> returns $x \approx 0.25410$.` },
        { label: '(c)', prompt: String.raw`How many real roots does $f$ have in total?`, kind: 'numeric', answer: '3', hint: String.raw`Look for sign changes on $[-3, -2]$, $[0, 1]$ and $[1.5, 2]$.`, solution: String.raw`$f(-3) = -14 < 0 < f(-2) = 1$, $f(0) > 0 > f(1)$ and $f(1.5) < 0 < f(2)$: three sign changes, hence three roots by the IVT. A cubic has at most three roots, so there are exactly three.` },
      ],
    },
    {
      id: 'a5',
      title: 'Classifying discontinuities',
      difficulty: 'challenge',
      statement: String.raw`<p>Let $f(x) = \dfrac{x^2 - 4}{x^2 - 3x + 2}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $\lim_{x \to 2} f(x)$.`, kind: 'numeric', answer: '4', hint: 'Factor numerator and denominator.', solution: [
          { type: 'text', html: String.raw`<p>We factor numerator and denominator, cancel the common factor and substitute.</p>` },
          { type: 'derive', steps: [
            { kind: 'factor', label: 'Factor numerator and denominator', from: String.raw`\frac{\T{n-1}{x^2 - 4}}{\T{d-1}{x^2 - 3x + 2}}`,
              to: String.raw`\frac{\T{q-1}{(x - 2)}\,\T{p-1}{(x + 2)}}{\T{m-1}{(x - 1)}\,\T{q-2}{(x - 2)}}`, map: { 'n-1': ['q-1', 'p-1'], 'd-1': ['m-1', 'q-2'] },
              why: String.raw`$x^2 - 4$ is a difference of squares. For $x^2 - 3x + 2$ we need two numbers with product $2$ and sum $-3$: $-1$ and $-2$.` },
            { kind: 'cancel', label: String.raw`Cancel $x - 2$ ($x \ne 2$)`, to: String.raw`\frac{\T{p-1}{x + 2}}{\T{m-1}{x - 1}}`, why: String.raw`In the limit $x \ne 2$, so the common factor is non-zero and may be divided out (valid for $x \ne 1, 2$).` },
            { kind: 'sub', label: String.raw`Substitute $x = 2$`, to: String.raw`\frac{\T{p-1}{2 + 2}}{\T{m-1}{2 - 1}} = 4`, why: String.raw`The simplified fraction is continuous at $2$.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`The discontinuity at $x = 2$ is …`, kind: 'choice', choices: ['removable', 'a jump', 'infinite'], answer: 0, solution: String.raw`The limit exists but $f(2)$ is undefined; setting $f(2) = 4$ removes it.` },
        { label: '(c)', prompt: String.raw`$\lim_{x \to 1^+} f(x)$ is …`, kind: 'choice', choices: [String.raw`$+\infty$`, String.raw`$-\infty$`, String.raw`$3$`, String.raw`$0$`], answer: 0, solution: String.raw`$\frac{x+2}{x-1}$: numerator $\to 3$, denominator $\to 0^+$, so $+\infty$. The discontinuity at $x = 1$ is infinite.` },
        { label: '(d)', prompt: String.raw`Compute $\lim_{x \to \infty} f(x)$.`, kind: 'numeric', answer: '1', solution: [
          { type: 'text', html: String.raw`<p>We start from the simplified form $\frac{x+2}{x-1}$ of part (a) and divide every term by $x$.</p>` },
          { type: 'derive', steps: [
            { kind: 'expand', label: String.raw`Divide every term by $x$`, from: String.raw`\frac{\T{a-1}{x} + \T{b-1}{2}}{\T{c-1}{x} - \T{d-1}{1}}`,
              to: String.raw`\frac{\T{a-1}{1} + \T{b-1}{2/x}}{\T{c-1}{1} - \T{d-1}{1/x}}`, why: String.raw`Dividing numerator and denominator by the same non-zero number keeps the value.` },
            { kind: 'sub', label: String.raw`$\frac{2}{x}, \frac{1}{x} \to 0$`, to: String.raw`\frac{\T{a-1}{1} + \T{b-1}{0}}{\T{c-1}{1} - \T{d-1}{0}} = 1`, why: String.raw`The horizontal asymptote is $y = 1$.` },
          ] },
        ] },
      ],
    },
  ],
};
