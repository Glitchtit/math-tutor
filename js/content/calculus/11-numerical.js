// Module 11: Numerical integration and error bounds

export default {
  id: 'numerical',
  number: 11,
  part: 'applications',
  hw: 'HW1',
  title: 'Numerical integration and error bounds',
  summary: 'Midpoint, trapezoid and Simpson rules, how fast their errors shrink, the error bounds with K = max|f″| (or max|f⁗|), estimating K from a plot, choosing n for a tolerance and integrands with a removable singularity — ending with a Homework-1-style capstone.',
  intro: String.raw`<p>Most integrals met in engineering — arc lengths, $\int e^{-x^2}\mathrm dx$, $\int \frac{\sin x}{x}\,\mathrm dx$ — have no elementary antiderivative. Numerical rules replace $f$ by simple pieces (constants, lines, parabolas) whose areas are easy. The real skill is to say <b>how accurate</b> the answer is: the error bounds turn a plot of $f''$ into a guarantee. This module closes the Applications part with a Homework-1-style capstone.</p><p>Every rule is computed the same way, and every worked example writes out every line: <b>(1)</b> the step width $h$, <b>(2)</b> the list of $x$-values, <b>(3)</b> the function values, <b>(4)</b> the weighted sum, <b>(5)</b> the final multiplication.</p>`,
  lessons: [
    {
      id: 'midpoint-trapezoid',
      title: 'The trapezoid rule, one line at a time',
      blocks: [
        { type: 'text', html: String.raw`<p>We want the area $\int_a^b f(x)\,\mathrm d x$ but cannot find an antiderivative. So we cut the interval $[a, b]$ into $n$ strips of equal width and replace the curve on each strip by a straight line. Each strip is then a <b>trapezoid</b>, whose area is easy. Increase $n$ in the widget and watch the trapezoids hug the curve.</p>` },
        { type: 'widget', name: 'riemann', config: {
          title: 'Trapezoids under y = exp(-x^2) on [0, 2]',
          f: 'exp(-x.^2)', a: 0, b: 2, n: 4, method: 'trap', nmax: 40, xlim: [-0.2, 2.2], ylim: [-0.1, 1.15],
        } },
        { type: 'callout', kind: 'def', title: 'The symbols', html: String.raw`<ul><li>$a$, $b$: the ends of the interval. $n$: the number of strips (subintervals).</li><li>$h = \Delta x = \dfrac{b - a}{n}$: the width of one strip ("step width"). Both names are used.</li><li>$x_0 = a,\ x_1 = a + h,\ x_2 = a + 2h,\ \dots,\ x_n = b$: the <b>nodes</b>, i.e. the $n + 1$ points where strips meet. In general $x_k = a + k h$.</li><li>$f(x_k)$: the height of the curve at node $x_k$.</li></ul>` },
        { type: 'refresher', title: 'the step width h and the list of x-values', html: String.raw`<p>Divide the length of the interval by the number of strips; then start at $a$ and keep adding $h$ until you reach $b$. With $n$ strips you always get $n + 1$ points. Example: $[1, 2]$ with $n = 4$.</p>`, steps: [
          { do: String.raw`$h = \dfrac{2 - 1}{4} = 0.25$`, why: String.raw`Length of the interval ($b - a = 1$) divided by the number of strips ($4$).` },
          { do: String.raw`$x_0 = 1,\; x_1 = 1.25,\; x_2 = 1.5,\; x_3 = 1.75,\; x_4 = 2$`, why: String.raw`Start at $a = 1$ and add $0.25$ each time. The last point must be $b = 2$ — a built-in check of the arithmetic.` },
        ] },
        { type: 'text', html: String.raw`<p>One trapezoid between $x_{k-1}$ and $x_k$ has width $h$ and parallel sides $f(x_{k-1})$ and $f(x_k)$, so its area is $\frac h2\big(f(x_{k-1}) + f(x_k)\big)$. When we add all the strips, every <b>inner</b> node is the right side of one trapezoid and the left side of the next, so its height is counted <b>twice</b>; the two end points are counted once.</p>` },
        { type: 'callout', kind: 'def', title: 'Trapezoid rule', html: String.raw`$$T_n = \frac{h}{2}\Big(f(x_0) + 2f(x_1) + 2f(x_2) + \dots + 2f(x_{n-1}) + f(x_n)\Big).$$<p>The numbers in front of the $f$-values, $1, 2, 2, \dots, 2, 1$, are called the <b>weights</b>.</p>` },
        { type: 'steps', title: String.raw`Worked example: $T_4$ for $\displaystyle\int_1^2 \frac{\mathrm d x}{x}$ (exact value $\ln 2 \approx 0.693147$)`, steps: [
          { do: String.raw`$h = \dfrac{b - a}{n} = \dfrac{2 - 1}{4} = 0.25$`, why: String.raw`Step 1 of every rule: the width of one strip. Here $a = 1$, $b = 2$, $n = 4$.` },
          { do: String.raw`$x$-values: $\; 1,\ 1.25,\ 1.5,\ 1.75,\ 2$`, why: String.raw`Step 2: start at $a = 1$ and add $h = 0.25$ until we reach $b = 2$. Four strips give five points.` },
          { do: String.raw`$f(1) = 1,\quad f(1.25) = \tfrac{1}{1.25} = 0.8,\quad f(1.5) = \tfrac{1}{1.5} = 0.666667$`, why: String.raw`Step 3: put each $x$-value into $f(x) = \frac1x$. Keep six decimals so rounding does not spoil the answer.` },
          { do: String.raw`$f(1.75) = \tfrac{1}{1.75} = 0.571429,\quad f(2) = \tfrac12 = 0.5$`, why: 'The remaining two function values.' },
          { do: String.raw`Weights: $\; 1,\ 2,\ 2,\ 2,\ 1$`, why: String.raw`End points count once, the three inner points count twice.` },
          { do: String.raw`$1 + 2(0.8) + 2(0.666667) + 2(0.571429) + 0.5$`, why: 'Step 4: multiply each function value by its weight and add.' },
          { do: String.raw`$= 1 + 1.6 + 1.333333 + 1.142857 + 0.5 = 5.576190$`, why: 'Do the multiplications first, then the additions.' },
          { do: String.raw`$T_4 = \dfrac{h}{2}\cdot 5.576190 = 0.125 \cdot 5.576190 = 0.697024$`, why: String.raw`Step 5: multiply by $\frac h2 = \frac{0.25}{2} = 0.125$.` },
          { do: String.raw`Error $E_T = \ln 2 - T_4 = 0.693147 - 0.697024 = -0.003877$`, why: String.raw`The error is defined as <i>exact minus approximation</i>. It is negative: the trapezoids are slightly too big here.` },
        ] },
        { type: 'guided', title: String.raw`$T_4$ for $\displaystyle\int_0^2 \frac{\mathrm d x}{1 + x}$`, problem: String.raw`Approximate $\displaystyle\int_0^2 \frac{\mathrm d x}{1 + x}$ with the trapezoid rule and $n = 4$. Same five steps as the worked example. (You may type fractions or MATLAB expressions such as <code>2/3</code>.)`, steps: [
          { prompt: String.raw`<b>Step 1.</b> What is the step width $h$?`, ask: { kind: 'numeric', answer: '0.5' }, hint: String.raw`$h = \frac{b - a}{n}$ with $a = 0$, $b = 2$, $n = 4$.`, reveal: String.raw`$h = \dfrac{2 - 0}{4} = 0.5$.` },
          { prompt: String.raw`<b>Step 2.</b> The $x$-values are $0,\ 0.5,\ 1,\ 1.5,\ 2$.`, show: String.raw`Start at $0$ and add $0.5$ four times; the last value is $b = 2$ ✓.` },
          { prompt: String.raw`<b>Step 3.</b> The function values are $f(0) = 1$, $f(0.5) = \frac{1}{1.5} = 0.666667$, $f(1) = 0.5$, $f(1.5) = c$, $f(2) = 0.333333$. What is $c$?`, ask: { kind: 'numeric', answer: '1/2.5', tol: 1e-5 }, hint: String.raw`$f(1.5) = \dfrac{1}{1 + 1.5}$.`, reveal: String.raw`$f(1.5) = \dfrac{1}{2.5} = 0.4$.` },
          { prompt: String.raw`<b>Step 4.</b> Weighted sum with weights $1, 2, 2, 2, 1$: compute $1 + 2(0.666667) + 2(0.5) + 2(0.4) + 0.333333$.`, ask: { kind: 'numeric', answer: '1 + 2*(2/3 + 1/2 + 2/5) + 1/3', tol: 1e-5 }, hint: String.raw`$2(0.666667) = 1.333333$, $2(0.5) = 1$, $2(0.4) = 0.8$. Now add everything.`, reveal: String.raw`$1 + 1.333333 + 1 + 0.8 + 0.333333 = 4.466667$.` },
          { prompt: String.raw`<b>Step 5.</b> Multiply by $\frac h2$: $T_4 = \;?$`, ask: { kind: 'numeric', answer: '0.25*(1 + 2*(2/3 + 1/2 + 2/5) + 1/3)', tol: 1e-5 }, hint: String.raw`$\frac h2 = \frac{0.5}{2} = 0.25$.`, reveal: String.raw`$T_4 = 0.25 \cdot 4.466667 = 1.116667$.` },
        ], finale: String.raw`The exact value is $\ln 3 \approx 1.098612$, so $E_T \approx -0.018$. Again the trapezoid value is too big — see the next paragraph for why.` },
        { type: 'text', html: String.raw`<p>Both $\frac1x$ and $\frac1{1+x}$ curve upwards (they are <b>convex</b>, $f'' > 0$). For a convex curve every straight chord lies <b>above</b> the curve, so the trapezoids are too big and $T_n$ <b>overestimates</b>. For a curve that bends downwards (<b>concave</b>, $f'' < 0$) the chords lie below and $T_n$ underestimates.</p>` },
        { type: 'quiz', question: String.raw`In $T_6$, which weight does $f(x_3)$ get?`, choices: ['1', '2', '3', '4'], answer: 1, explain: String.raw`$x_3$ is an inner node (only $x_0$ and $x_6$ are end points), so it is shared by two trapezoids and gets weight 2.` },
      ],
    },
    {
      id: 'midpoint',
      title: 'The midpoint rule',
      blocks: [
        { type: 'text', html: String.raw`<p>The <b>midpoint rule</b> uses rectangles instead of trapezoids: on each strip the height is the function value at the <b>middle</b> of the strip. Switch the widget between the rules.</p>` },
        { type: 'widget', name: 'riemann', config: {
          title: 'Midpoint rectangles under y = exp(-x^2) on [0, 2]',
          f: 'exp(-x.^2)', a: 0, b: 2, n: 4, method: 'mid', nmax: 40, xlim: [-0.2, 2.2], ylim: [-0.1, 1.15],
        } },
        { type: 'callout', kind: 'def', title: 'Midpoint rule', html: String.raw`$$M_n = h\Big(f(\bar x_1) + f(\bar x_2) + \dots + f(\bar x_n)\Big),\qquad \bar x_k = \tfrac12\left(x_{k-1} + x_k\right).$$<p>$\bar x_k$ ("x-bar $k$") is the midpoint of the $k$-th strip: the average of its two end nodes. There are $n$ midpoints, one per strip, and every weight is $1$.</p>` },
        { type: 'steps', title: String.raw`Worked example: $M_4$ for $\displaystyle\int_1^2 \frac{\mathrm d x}{x}$`, steps: [
          { do: String.raw`$h = \dfrac{2 - 1}{4} = 0.25$`, why: 'Step 1: the strip width, exactly as for the trapezoid rule.' },
          { do: String.raw`Nodes: $\; 1,\ 1.25,\ 1.5,\ 1.75,\ 2$`, why: String.raw`Step 2a: the strip boundaries, starting at $a$ and adding $h$.` },
          { do: String.raw`Midpoints: $\; \bar x_1 = \tfrac{1 + 1.25}{2} = 1.125,\ \ \bar x_2 = 1.375,\ \ \bar x_3 = 1.625,\ \ \bar x_4 = 1.875$`, why: String.raw`Step 2b: average neighbouring nodes. A shortcut: the first midpoint is $a + \frac h2$, then keep adding $h$.` },
          { do: String.raw`$f(1.125) = 0.888889,\ \ f(1.375) = 0.727273,\ \ f(1.625) = 0.615385,\ \ f(1.875) = 0.533333$`, why: String.raw`Step 3: put each midpoint into $f(x) = \frac1x$. The nodes themselves are <b>not</b> used.` },
          { do: String.raw`$0.888889 + 0.727273 + 0.615385 + 0.533333 = 2.764880$`, why: 'Step 4: all weights are 1, so the weighted sum is a plain sum.' },
          { do: String.raw`$M_4 = h \cdot 2.764880 = 0.25 \cdot 2.764880 = 0.691220$`, why: String.raw`Step 5: multiply by $h$ (not $\frac h2$): each rectangle has width $h$.` },
          { do: String.raw`$E_M = \ln 2 - M_4 = 0.693147 - 0.691220 = +0.001927$`, why: String.raw`Positive error: the midpoint value is too small. Compare $E_T = -0.003877$: opposite sign and about half the size.` },
        ] },
        { type: 'guided', title: String.raw`$M_4$ for $\displaystyle\int_0^2 \frac{\mathrm d x}{1 + x}$`, problem: String.raw`Approximate $\displaystyle\int_0^2 \frac{\mathrm d x}{1 + x}$ with the midpoint rule and $n = 4$.`, steps: [
          { prompt: String.raw`<b>Step 1.</b> What is $h$?`, ask: { kind: 'numeric', answer: '0.5' }, hint: String.raw`$h = \frac{b - a}{n}$.`, reveal: String.raw`$h = \frac{2 - 0}{4} = 0.5$.` },
          { prompt: String.raw`<b>Step 2.</b> The nodes are $0, 0.5, 1, 1.5, 2$. The midpoints are $0.25,\ 0.75,\ c,\ 1.75$. What is $c$?`, ask: { kind: 'numeric', answer: '1.25' }, hint: String.raw`The third strip runs from $1$ to $1.5$; average the two ends.`, reveal: String.raw`$\bar x_3 = \frac{1 + 1.5}{2} = 1.25$.` },
          { prompt: String.raw`<b>Step 3.</b> $f(0.75) = \frac{1}{1.75} = 0.571429$, $f(1.25) = \frac{1}{2.25} = 0.444444$, $f(1.75) = \frac{1}{2.75} = 0.363636$. What is $f(0.25)$?`, ask: { kind: 'numeric', answer: '1/1.25', tol: 1e-5 }, hint: String.raw`$f(0.25) = \frac{1}{1 + 0.25}$.`, reveal: String.raw`$f(0.25) = \frac{1}{1.25} = 0.8$.` },
          { prompt: String.raw`<b>Step 4.</b> Add the four midpoint values.`, ask: { kind: 'numeric', answer: '1/1.25 + 1/1.75 + 1/2.25 + 1/2.75', tol: 1e-5 }, hint: String.raw`$0.8 + 0.571429 + 0.444444 + 0.363636$.`, reveal: String.raw`$0.8 + 0.571429 + 0.444444 + 0.363636 = 2.179509$.` },
          { prompt: String.raw`<b>Step 5.</b> Multiply by $h$: $M_4 = \;?$`, ask: { kind: 'numeric', answer: '0.5*(1/1.25 + 1/1.75 + 1/2.25 + 1/2.75)', tol: 1e-5 }, hint: String.raw`Midpoint rule: multiply by $h = 0.5$, not by $\frac h2$.`, reveal: String.raw`$M_4 = 0.5 \cdot 2.179509 = 1.089755$.` },
        ], finale: String.raw`$\ln 3 - M_4 \approx +0.0089$ and $\ln 3 - T_4 \approx -0.0181$: opposite signs, the midpoint error about half as big.` },
        { type: 'text', html: String.raw`<p>Why is $M_n$ too small for a convex curve? A midpoint rectangle has the same area as the trapezoid formed by the <b>tangent line</b> at the midpoint (the tilt adds as much on one side as it removes on the other). For a convex curve tangent lines lie <b>below</b> the curve. So, for convex $f$: $M_n \le \int_a^b f \le T_n$; for concave $f$ both inequalities reverse. Typically $E_M \approx -\tfrac12 E_T$.</p>` },
        { type: 'quiz', question: String.raw`$f$ is concave on $[a, b]$. Which ordering is correct?`, choices: [String.raw`$T_n \le \int_a^b f \le M_n$`, String.raw`$M_n \le \int_a^b f \le T_n$`, String.raw`$T_n \le M_n \le \int_a^b f$`, 'Nothing can be said without computing.'], answer: 0, explain: String.raw`For concave $f$ the chords lie below the graph ($T_n$ too small) and the tangent lines above it ($M_n$ too large).` },
      ],
    },
    {
      id: 'simpson',
      title: "Simpson's rule",
      blocks: [
        { type: 'text', html: String.raw`<p><b>Simpson's rule</b> fits a parabola through three neighbouring points, i.e. over a <b>pair</b> of strips — so $n$ must be <b>even</b>. Parabolas follow a curved graph much better than lines: watch the error in the readout.</p>` },
        { type: 'widget', name: 'riemann', config: {
          title: "Simpson's rule: parabolic arcs over pairs of subintervals",
          f: 'exp(-x.^2)', a: 0, b: 2, n: 4, method: 'simpson', nmax: 40, xlim: [-0.2, 2.2], ylim: [-0.1, 1.15],
        } },
        { type: 'callout', kind: 'def', title: "Simpson's rule ($n$ even)", html: String.raw`$$S_n = \frac{h}{3}\Big(f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \dots + 2f(x_{n-2}) + 4f(x_{n-1}) + f(x_n)\Big).$$<p>Same nodes as the trapezoid rule; new weights and $\frac h3$ in front.</p>` },
        { type: 'refresher', title: 'the Simpson weight pattern', html: String.raw`<p>The weights start and end with $1$; in between they alternate $4, 2, 4, 2, \dots$, and the node next to each end always gets $4$. Odd-numbered nodes $x_1, x_3, \dots$ get $4$, even-numbered inner nodes $x_2, x_4, \dots$ get $2$.</p>`, steps: [
          { do: String.raw`$n = 4$: $\quad 1,\ 4,\ 2,\ 4,\ 1$`, why: String.raw`Five nodes $x_0, \dots, x_4$.` },
          { do: String.raw`$n = 6$: $\quad 1,\ 4,\ 2,\ 4,\ 2,\ 4,\ 1$`, why: 'Seven nodes; the pattern 4, 2 repeats and ends with 4 before the final 1.' },
        ] },
        { type: 'steps', title: String.raw`Worked example: $S_4$ for $\displaystyle\int_1^2 \frac{\mathrm d x}{x}$`, steps: [
          { do: String.raw`$n = 4$ is even ✓`, why: String.raw`Simpson pairs up the strips, so check this first.` },
          { do: String.raw`$h = \dfrac{2 - 1}{4} = 0.25$`, why: 'Step 1: the strip width.' },
          { do: String.raw`$x$-values $1,\ 1.25,\ 1.5,\ 1.75,\ 2$; $\;f$-values $1,\ 0.8,\ 0.666667,\ 0.571429,\ 0.5$`, why: 'Steps 2 and 3: the same nodes and function values as for the trapezoid rule.' },
          { do: String.raw`Weights: $\; 1,\ 4,\ 2,\ 4,\ 1$`, why: 'The Simpson pattern for five nodes (refresher above).' },
          { do: String.raw`$1\cdot 1 + 4\cdot 0.8 + 2\cdot 0.666667 + 4\cdot 0.571429 + 1\cdot 0.5$`, why: 'Step 4: each function value times its weight.' },
          { do: String.raw`$= 1 + 3.2 + 1.333333 + 2.285714 + 0.5 = 8.319048$`, why: 'Multiply, then add.' },
          { do: String.raw`$S_4 = \dfrac{h}{3}\cdot 8.319048 = \dfrac{0.25}{3}\cdot 8.319048 = 0.693254$`, why: String.raw`Step 5: multiply by $\frac h3 = 0.083333$.` },
          { do: String.raw`$E_S = \ln 2 - S_4 = 0.693147 - 0.693254 = -0.000107$`, why: String.raw`About 35 times smaller than $E_T$ — with the very same five function values.` },
        ] },
        { type: 'guided', title: String.raw`$S_4$ for $\displaystyle\int_0^2 \frac{\mathrm d x}{1 + x}$`, problem: String.raw`Approximate $\displaystyle\int_0^2 \frac{\mathrm d x}{1 + x}$ with Simpson's rule and $n = 4$. The nodes and values from the trapezoid exercise are $1,\ 0.666667,\ 0.5,\ 0.4,\ 0.333333$ at $x = 0, 0.5, 1, 1.5, 2$.`, steps: [
          { prompt: String.raw`<b>Weights.</b> Which weight does $f(x_2) = f(1) = 0.5$ get?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`Pattern $1, 4, 2, 4, 1$; $x_2$ is the third node.`, reveal: String.raw`Weight $2$ (the pattern is $1, 4, 2, 4, 1$).` },
          { prompt: String.raw`<b>Weighted sum.</b> Compute $1 + 4(0.666667) + 2(0.5) + 4(0.4) + 0.333333$.`, ask: { kind: 'numeric', answer: '1 + 4*(2/3) + 2*(1/2) + 4*(2/5) + 1/3', tol: 1e-5 }, hint: String.raw`$4(0.666667) = 2.666667$, $2(0.5) = 1$, $4(0.4) = 1.6$.`, reveal: String.raw`$1 + 2.666667 + 1 + 1.6 + 0.333333 = 6.6$.` },
          { prompt: String.raw`<b>Multiply by $\frac h3$</b> (with $h = 0.5$): $S_4 = \;?$`, ask: { kind: 'numeric', answer: '0.5/3*6.6', tol: 1e-5 }, hint: String.raw`$\frac h3 = \frac{0.5}{3} = 0.166667$.`, reveal: String.raw`$S_4 = \frac{0.5}{3}\cdot 6.6 = 1.1$.` },
        ], finale: String.raw`$\ln 3 - S_4 \approx -0.0014$, more than ten times better than $T_4$.` },
        { type: 'callout', kind: 'note', title: 'Approximating a constant', html: String.raw`<p>If the exact value of the integral is a known constant, a rule approximates that constant. For instance $\int_0^1 \frac{\mathrm d x}{1 + x^2} = \arctan 1 = \frac{\pi}{4}$, so $\pi = 4\int_0^1 \frac{\mathrm d x}{1 + x^2} \approx 4\,S_n$: compute $S_n$, then multiply by $4$.</p>` },
        { type: 'quiz', question: String.raw`Which weight list belongs to $S_6$?`, choices: ['1 2 2 2 2 2 1', '1 4 2 4 2 4 1', '1 4 4 4 4 4 1', '1 2 4 2 4 2 1'], answer: 1, explain: String.raw`Seven nodes; ends 1, then 4 and 2 alternating, with 4 next to each end.` },
      ],
    },
    {
      id: 'orders',
      title: 'How fast the errors shrink',
      blocks: [
        { type: 'text', html: String.raw`<p>The log–log plot below shows the error against $n$ for $\int_0^2 e^{-x^2}\,\mathrm d x$. A straight line of slope $-p$ means $|E| \approx C/n^p$ for some constant $C$. The number $p$ is the <b>order</b> of the rule: doubling $n$ divides the error by $2^p$.</p>` },
        { type: 'widget', name: 'convergence', config: { title: 'Error vs n (log-log)', f: 'exp(-x.^2)', a: 0, b: 2, methods: ['trap', 'mid', 'simpson'] } },
        { type: 'table', head: ['Rule', 'Error behaves like', 'Doubling $n$ divides the error by', 'Exact for'], rows: [
          ['Midpoint $M_n$', String.raw`$C/n^2$`, '$2^2 = 4$', 'lines'],
          ['Trapezoid $T_n$', String.raw`$C/n^2$`, '$2^2 = 4$', 'lines'],
          ["Simpson $S_n$", String.raw`$C/n^4$`, '$2^4 = 16$', 'cubics'],
        ] },
        { type: 'refresher', title: 'counting doublings', html: String.raw`<p>Going from $n$ to $2n$ is one doubling, from $n$ to $4n = 2^2 n$ two doublings, from $n$ to $8n = 2^3 n$ three. If one doubling divides the error by $4$, then two doublings divide it by $4 \cdot 4 = 16$. Same as $(4n/n)^2 = 4^2$: the error ratio is (ratio of $n$)$^p$.</p>` },
        { type: 'steps', title: String.raw`Worked example: predicting errors`, problem: String.raw`A trapezoid approximation with $n = 8$ has error $5.0\cdot10^{-3}$, and Simpson with $n = 8$ has error $3.2\cdot10^{-5}$. Predict the trapezoid error for $n = 32$ and the Simpson error for $n = 16$.`, steps: [
          { do: String.raw`Trapezoid: order $p = 2$`, why: 'From the table: trapezoid errors behave like $C/n^2$.' },
          { do: String.raw`$8 \to 16 \to 32$: two doublings`, why: String.raw`$32 = 8\cdot 2^2$.` },
          { do: String.raw`Divide by $4 \cdot 4 = 16$`, why: 'Each doubling divides a second-order error by 4.' },
          { do: String.raw`$E_T(32) \approx \dfrac{5.0\cdot10^{-3}}{16} = 3.1\cdot10^{-4}$`, why: 'Divide the known error.' },
          { do: String.raw`Simpson: order $p = 4$; $8 \to 16$ is one doubling`, why: String.raw`Simpson errors behave like $C/n^4$.` },
          { do: String.raw`$E_S(16) \approx \dfrac{3.2\cdot10^{-5}}{2^4} = \dfrac{3.2\cdot10^{-5}}{16} = 2.0\cdot10^{-6}$`, why: String.raw`One doubling divides a fourth-order error by $2^4 = 16$.` },
        ] },
        { type: 'text', html: String.raw`<p>Because $E_M \approx -\frac12 E_T$, the weighted average $\frac13 T_n + \frac23 M_n$ cancels the leading errors: $\frac13 E_T + \frac23\left(-\frac12 E_T\right) = 0$. In fact it is <b>exactly</b> Simpson's rule with twice as many strips: $\frac13 T_n + \frac23 M_n = S_{2n}$.</p>` },
        { type: 'steps', title: String.raw`Worked example: $\frac13 T_2 + \frac23 M_2$ for $\displaystyle\int_1^2 \frac{\mathrm d x}{x}$`, steps: [
          { do: String.raw`$T_2$: $h = 0.5$, nodes $1, 1.5, 2$, values $1, 0.666667, 0.5$`, why: String.raw`The trapezoid rule with $n = 2$: steps 1–3.` },
          { do: String.raw`$T_2 = \frac{0.5}{2}\big(1 + 2(0.666667) + 0.5\big) = 0.25 \cdot 2.833333 = 0.708333$`, why: 'Steps 4–5 with weights 1, 2, 1.' },
          { do: String.raw`$M_2$: midpoints $1.25$ and $1.75$, values $0.8$ and $0.571429$`, why: String.raw`The middles of the strips $[1, 1.5]$ and $[1.5, 2]$.` },
          { do: String.raw`$M_2 = 0.5\,(0.8 + 0.571429) = 0.685714$`, why: String.raw`Midpoint rule: sum times $h$.` },
          { do: String.raw`$\tfrac13 T_2 + \tfrac23 M_2 = \dfrac{T_2 + 2M_2}{3} = \dfrac{0.708333 + 1.371429}{3}$`, why: String.raw`Put both over the common denominator $3$.` },
          { do: String.raw`$= \dfrac{2.079762}{3} = 0.693254$`, why: String.raw`This is exactly $S_4$ from the Simpson lesson: it uses the nodes of $T_2$ and the midpoints of $M_2$ — the same five points.` },
        ] },
        { type: 'guided', title: 'Predict and combine', problem: String.raw`(1) A trapezoid approximation with $n = 5$ has error $3.6\cdot10^{-3}$; predict it for $n = 20$. (2) Simpson with $n = 6$ has error $4.8\cdot10^{-6}$; predict it for $n = 12$. (3) For $\int_0^2 \frac{\mathrm d x}{1 + x}$ you found $T_4 = 1.116667$ and $M_4 = 1.089755$; combine them.`, steps: [
          { prompt: String.raw`How many doublings take $n = 5$ to $n = 20$?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`$5 \to 10 \to \dots$`, reveal: String.raw`$5 \to 10 \to 20$: two doublings.` },
          { prompt: String.raw`Predicted trapezoid error for $n = 20$?`, ask: { kind: 'numeric', answer: '3.6e-3/16', tol: 1e-3 }, hint: 'Each doubling divides a trapezoid error by 4.', reveal: String.raw`$\dfrac{3.6\cdot10^{-3}}{4\cdot 4} = 2.25\cdot10^{-4}$.` },
          { prompt: String.raw`Predicted Simpson error for $n = 12$?`, ask: { kind: 'numeric', answer: '4.8e-6/16', tol: 1e-3 }, hint: String.raw`One doubling; Simpson is fourth order, so divide by $2^4$.`, reveal: String.raw`$\dfrac{4.8\cdot10^{-6}}{16} = 3.0\cdot10^{-7}$.` },
          { prompt: String.raw`Compute $\frac13 T_4 + \frac23 M_4 = \frac{T_4 + 2M_4}{3}$.`, ask: { kind: 'numeric', answer: '(1.116667 + 2*1.089755)/3', tol: 1e-5 }, hint: String.raw`$2M_4 = 2.179510$; add $T_4$, then divide by 3.`, reveal: String.raw`$\dfrac{1.116667 + 2.179510}{3} = \dfrac{3.296177}{3} = 1.098726$ — compare $\ln 3 = 1.098612$.` },
        ] },
        { type: 'quiz', question: String.raw`With $n = 10$ the trapezoid error is $3.2\cdot10^{-3}$ and the Simpson error is $6.4\cdot10^{-6}$. What do you expect with $n = 20$?`, choices: [String.raw`$1.6\cdot10^{-3}$ and $3.2\cdot10^{-6}$`, String.raw`$8\cdot10^{-4}$ and $4\cdot10^{-7}$`, String.raw`$8\cdot10^{-4}$ and $1.6\cdot10^{-6}$`, String.raw`$4\cdot10^{-4}$ and $4\cdot10^{-7}$`], answer: 1, explain: String.raw`Trapezoid: divide by $2^2 = 4$. Simpson: divide by $2^4 = 16$.` },
      ],
    },
    {
      id: 'error-bounds',
      title: 'Error bounds: finding K',
      blocks: [
        { type: 'text', html: String.raw`<p>Predictions like "the error drops by 4" need a known error to start from. An <b>error bound</b> needs nothing but $f$: it guarantees that the error is <i>at most</i> a certain number. The price: we must know how strongly $f$ curves, measured by its second derivative $f''$ (or the fourth derivative $f^{(4)}$ for Simpson).</p>` },
        { type: 'callout', kind: 'thm', title: 'Error bounds', html: String.raw`<p>If $|f''(x)| \le K$ for every $x$ in $[a, b]$, then</p>$$|E_T| \le \frac{K(b-a)^3}{12\,n^2}, \qquad |E_M| \le \frac{K(b-a)^3}{24\,n^2}.$$<p>If $|f^{(4)}(x)| \le K$ for every $x$ in $[a, b]$, then</p>$$|E_S| \le \frac{K(b-a)^5}{180\,n^4}.$$<p>$K$ is any number that $|f''|$ (resp. $|f^{(4)}|$) never exceeds on $[a,b]$; the best (smallest) choice is its maximum.</p>` },
        { type: 'refresher', title: 'higher derivatives of a power', html: String.raw`<p>Power rule: $\frac{\mathrm d}{\mathrm d x}x^r = r\,x^{r-1}$. Write $\frac1x = x^{-1}$ and differentiate again and again.</p>`, steps: [
          { do: String.raw`$f(x) = x^{-1}$`, why: String.raw`$\frac1x$ as a power.` },
          { do: String.raw`$f'(x) = -x^{-2}$`, why: String.raw`Bring down $-1$, lower the power to $-2$.` },
          { do: String.raw`$f''(x) = 2x^{-3} = \dfrac{2}{x^3}$`, why: String.raw`$(-1)(-2) = 2$; power $-3$.` },
          { do: String.raw`$f'''(x) = -6x^{-4}$`, why: String.raw`$2\cdot(-3) = -6$.` },
          { do: String.raw`$f^{(4)}(x) = 24x^{-5} = \dfrac{24}{x^5}$`, why: String.raw`$(-6)(-4) = 24$.` },
        ] },
        { type: 'steps', title: String.raw`Worked example: error bounds for $\displaystyle\int_1^2 \frac{\mathrm d x}{x}$ with $n = 4$`, steps: [
          { do: String.raw`$f''(x) = \dfrac{2}{x^3}$`, why: 'From the refresher.' },
          { do: String.raw`On $[1, 2]$, $\frac{2}{x^3}$ is positive and decreasing`, why: String.raw`A larger $x$ makes the denominator $x^3$ larger and the fraction smaller.` },
          { do: String.raw`$K = f''(1) = \dfrac{2}{1^3} = 2$`, why: 'A decreasing function is largest at the left end of the interval.' },
          { do: String.raw`$|E_T| \le \dfrac{K(b-a)^3}{12n^2} = \dfrac{2\cdot 1^3}{12\cdot 4^2}$`, why: String.raw`Insert $K = 2$, $b - a = 1$, $n = 4$ into the trapezoid bound.` },
          { do: String.raw`$= \dfrac{2}{192} = 0.010417$`, why: String.raw`$12\cdot 16 = 192$.` },
          { do: String.raw`Check: the actual error $|E_T| = 0.003877 \le 0.010417$ ✓`, why: 'The bound is a guarantee, not a prediction: the true error is usually smaller.' },
          { do: String.raw`$|E_M| \le \dfrac{2\cdot 1^3}{24\cdot 4^2} = \dfrac{2}{384} = 0.005208$`, why: String.raw`Same $K$, but $24$ instead of $12$ in the denominator.` },
          { do: String.raw`Simpson: $K = f^{(4)}(1) = 24$, $\;|E_S| \le \dfrac{24\cdot 1^5}{180\cdot 4^4} = \dfrac{24}{46\,080} = 0.000521$`, why: String.raw`$\frac{24}{x^5}$ is also decreasing, so its maximum on $[1,2]$ is at $x = 1$. $4^4 = 256$ and $180\cdot 256 = 46\,080$.` },
        ] },
        { type: 'refresher', title: String.raw`derivatives of $e^{kx}$`, html: String.raw`<p>Chain rule: $\frac{\mathrm d}{\mathrm d x}e^{kx} = k\,e^{kx}$. Each derivative brings out one more factor $k$: $f'' = k^2e^{kx}$, $f^{(4)} = k^4 e^{kx}$. Since $e^{kx}$ with $k > 0$ is increasing, its maximum on $[a, b]$ is at the right end $x = b$.</p>` },
        { type: 'guided', title: String.raw`Bounds for $\displaystyle\int_0^1 e^{2x}\,\mathrm d x$ with $n = 10$`, problem: String.raw`Find $K$ and the trapezoid and midpoint error bounds for $\displaystyle\int_0^1 e^{2x}\,\mathrm d x$ with $n = 10$.`, steps: [
          { prompt: String.raw`Type $f''(x)$ for $f(x) = e^{2x}$ (MATLAB syntax, e.g. <code>4*exp(2*x)</code>).`, ask: { kind: 'expression', variable: 'x', answer: '4*exp(2*x)' }, hint: String.raw`Each derivative of $e^{2x}$ brings out a factor $2$.`, reveal: String.raw`$f'(x) = 2e^{2x}$, $f''(x) = 4e^{2x}$.` },
          { prompt: String.raw`$K = \max_{[0,1]}|f''(x)| = \;?$`, ask: { kind: 'numeric', answer: '4*exp(2)', tol: 1e-5 }, hint: String.raw`$4e^{2x}$ is increasing, so look at the right end $x = 1$.`, reveal: String.raw`$K = f''(1) = 4e^2 \approx 29.556$.` },
          { prompt: String.raw`Trapezoid bound for $n = 10$?`, ask: { kind: 'numeric', answer: '4*exp(2)/1200', tol: 1e-4 }, hint: String.raw`$\dfrac{K(b-a)^3}{12n^2}$ with $b - a = 1$ and $n^2 = 100$.`, reveal: String.raw`$|E_T| \le \dfrac{4e^2\cdot 1}{12\cdot 100} = \dfrac{4e^2}{1200} \approx 0.02463$.` },
          { prompt: String.raw`Midpoint bound for $n = 10$?`, ask: { kind: 'numeric', answer: '4*exp(2)/2400', tol: 1e-4 }, hint: String.raw`Replace $12$ by $24$.`, reveal: String.raw`$|E_M| \le \dfrac{4e^2}{2400} \approx 0.01232$.` },
        ] },
        { type: 'text', html: String.raw`<p>When $f''$ is <b>not</b> monotone, compute $f''$ by hand, then <b>plot $|f''|$</b> on $[a, b]$ and read off the highest point (any larger number is also a valid $K$, just a weaker bound). For $f(x) = e^{-x^2}$ on $[0, 2]$ the readout evaluates the bounds for the chosen $n$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: '|f″| for f = exp(-x^2) on [0, 2]: K = 2',
          functions: [{ expr: 'abs((4*x.^2-2).*exp(-x.^2))', label: "$|f''(x)|$" }, { expr: '(4*x.^2-2).*exp(-x.^2)', label: "$f''(x)$", dash: true }],
          params: { n: { min: 2, max: 200, value: 10, step: 1, label: '$n$' } },
          hlines: [2], xlim: [-0.1, 2.1], ylim: [-2.3, 2.5],
          readout: String.raw`With $K = 2$, $b - a = 2$: $|E_T| \le \dfrac{2\cdot 2^3}{12 n^2} = {{16/(12*n.^2)}}$ and $|E_M| \le {{16/(24*n.^2)}}$.`,
        } },
        { type: 'steps', title: String.raw`Worked example: $K$ from a plot for $f(x) = e^{-x^2}$ on $[0, 2]$`, steps: [
          { do: String.raw`$f'(x) = -2x\,e^{-x^2}$`, why: String.raw`Chain rule: the inside $-x^2$ has derivative $-2x$.` },
          { do: String.raw`$f''(x) = -2e^{-x^2} + (-2x)(-2x)e^{-x^2}$`, why: String.raw`Product rule on $(-2x)\cdot e^{-x^2}$: derivative of the first factor times the second, plus the first times the derivative of the second.` },
          { do: String.raw`$f''(x) = (4x^2 - 2)\,e^{-x^2}$`, why: String.raw`Factor out $e^{-x^2}$.` },
          { do: String.raw`The plot of $|f''|$ is highest at $x = 0$, with value $|{-2}| = 2$`, why: String.raw`Read the graph above: the other bump (near $x \approx 1.2$) is lower, about $0.9$.` },
          { do: String.raw`$K = 2$, so for $n = 10$: $\;|E_T| \le \dfrac{2\cdot 2^3}{12\cdot 100} = 0.013333$`, why: String.raw`Insert into the trapezoid bound with $b - a = 2$.` },
        ] },
        { type: 'quiz', question: String.raw`On $[0, 3]$ you read $\max|f''| \approx 1.8$ from a plot. Which of these may be used as $K$?`, choices: ['only 1.8', '1.8 or any larger number, e.g. 2', 'any number, e.g. 1', 'only the value of $f\'\'$ at $x = 3$'], answer: 1, explain: String.raw`$K$ must be at least the maximum of $|f''|$. A larger $K$ still gives a valid (weaker) bound; a smaller one does not.` },
      ],
    },
    {
      id: 'choosing-n',
      title: 'Choosing n for a required accuracy',
      blocks: [
        { type: 'text', html: String.raw`<p>Often the question is reversed: <i>how many strips do I need so that the error is guaranteed to be below a tolerance</i> (e.g. $10^{-6}$)? Set the bound $\le$ tolerance and solve for $n$.</p>` },
        { type: 'refresher', title: String.raw`solving $\frac{c}{n^2} \le \text{tol}$ for $n$`, html: String.raw`<p>$n$ is positive, so we may multiply both sides by $n^2$ without flipping the sign. At the end, $n$ must be a whole number: always round <b>up</b> (rounding down would give a bound slightly above the tolerance).</p>`, steps: [
          { do: String.raw`$\dfrac{3}{n^2} \le 0.01$`, why: 'Example inequality.' },
          { do: String.raw`$3 \le 0.01\,n^2$`, why: String.raw`Multiply both sides by $n^2 > 0$.` },
          { do: String.raw`$n^2 \ge 300$`, why: String.raw`Divide both sides by $0.01$ (i.e. multiply by 100).` },
          { do: String.raw`$n \ge \sqrt{300} = 17.32$`, why: 'Take the square root; both sides are positive.' },
          { do: String.raw`$n = 18$`, why: String.raw`The smallest whole number $\ge 17.32$. For $n^4$ take the fourth root, $\sqrt{\sqrt{\ }}$, instead.` },
        ] },
        { type: 'steps', title: String.raw`Worked example: how many strips for $\displaystyle\int_1^2 \frac{\mathrm d x}{x}$ with error below $10^{-6}$?`, steps: [
          { do: String.raw`$K_2 = 2$ (for $f''$) and $K_4 = 24$ (for $f^{(4)}$), $\;b - a = 1$`, why: 'From the previous lesson: both derivatives are largest at $x = 1$.' },
          { do: String.raw`Trapezoid: $\;\dfrac{2\cdot 1^3}{12n^2} \le 10^{-6}$`, why: 'Bound $\le$ tolerance.' },
          { do: String.raw`$n^2 \ge \dfrac{2}{12\cdot 10^{-6}} = 166\,666.7$`, why: String.raw`Multiply by $n^2$, divide by $10^{-6}$ (refresher).` },
          { do: String.raw`$n \ge \sqrt{166\,666.7} = 408.25 \;\Rightarrow\; n = 409$`, why: 'Square root, then round up.' },
          { do: String.raw`Midpoint: $\;\dfrac{2}{24n^2} \le 10^{-6} \Rightarrow n^2 \ge 83\,333.3 \Rightarrow n \ge 288.68 \Rightarrow n = 289$`, why: String.raw`Same steps with $24$ instead of $12$.` },
          { do: String.raw`Simpson: $\;\dfrac{24\cdot 1^5}{180n^4} \le 10^{-6} \Rightarrow n^4 \ge \dfrac{24}{180\cdot10^{-6}} = 133\,333.3$`, why: String.raw`Simpson bound with $K_4 = 24$; now $n$ appears to the fourth power.` },
          { do: String.raw`$n \ge 133\,333.3^{1/4} = 19.11 \;\Rightarrow\; n = 20$`, why: String.raw`Fourth root, round up to $20$ — and check it is <b>even</b> (Simpson needs even $n$). If rounding up gave an odd number, go one further.` },
        ] },
        { type: 'guided', title: String.raw`How many strips for $\displaystyle\int_0^1 e^{2x}\,\mathrm d x$ with error below $10^{-4}$?`, problem: String.raw`For $f(x) = e^{2x}$ on $[0, 1]$ we found $K_2 = 4e^2$; similarly $K_4 = 16e^2$. Find the smallest $n$ that guarantees an error below $10^{-4}$ for each rule.`, steps: [
          { prompt: String.raw`Trapezoid: $\frac{4e^2}{12n^2} \le 10^{-4}$. Smallest whole $n$?`, ask: { kind: 'numeric', answer: '157', tol: 1e-9 }, hint: String.raw`$n^2 \ge \frac{4e^2}{12\cdot 10^{-4}} = 24\,630.2$. Take the square root and round up.`, reveal: String.raw`$n^2 \ge 24\,630.2 \Rightarrow n \ge 156.94 \Rightarrow n = 157$.` },
          { prompt: String.raw`Midpoint: $\frac{4e^2}{24n^2} \le 10^{-4}$. Smallest whole $n$?`, ask: { kind: 'numeric', answer: '111', tol: 1e-9 }, hint: String.raw`$n^2 \ge \frac{4e^2}{24\cdot10^{-4}} = 12\,315.1$.`, reveal: String.raw`$n^2 \ge 12\,315.1 \Rightarrow n \ge 110.97 \Rightarrow n = 111$.` },
          { prompt: String.raw`Simpson: $\frac{16e^2}{180n^4} \le 10^{-4}$ gives $n^4 \ge 6568.0$, so $n \ge 9.002$. Smallest admissible $n$?`, ask: { kind: 'numeric', answer: '10', tol: 1e-9 }, hint: String.raw`Round up to a whole number — and remember Simpson's $n$ must be even.`, reveal: String.raw`Rounding up gives $10$, which is even, so $n = 10$. (Note $9^4 = 6561 < 6568$, so $9$ would not even satisfy the inequality.)` },
        ] },
        { type: 'quiz', question: String.raw`For a trapezoid estimate with $K = 0.5$ on $[0, 3]$, which $n$ is the smallest that guarantees $|E_T| \le 10^{-3}$?`, choices: ['$n = 34$', '$n = 33$', '$n = 24$', '$n = 1125$'], answer: 0, explain: String.raw`$\frac{0.5\cdot 27}{12n^2} \le 10^{-3}$ gives $n^2 \ge 1125$, $n \ge 33.54$, so $n = 34$.` },
      ],
    },
    {
      id: 'removable-singularity',
      title: 'Removable singularities and K from a plot',
      blocks: [
        { type: 'text', html: String.raw`<p>$s(x) = \dfrac{\sin x}{x}$ is undefined at $x = 0$ (we would divide by zero), yet its graph is perfectly smooth there and approaches the height $1$. Such a hole is called a <b>removable singularity</b>: we fill it by defining $s(0)$ as the limit. Then the rules and the error bounds work as usual. To find the limit — and later $f''(0)$ — we use the polynomials that $\sin$, $\cos$ and $\exp$ look like near $0$.</p>` },
        { type: 'refresher', title: String.raw`the series of $e^u$, $\sin u$, $\cos u$ near $0$`, html: String.raw`<p>You will prove these in the module on Taylor series; here we just use them:</p>$$e^{u} = 1 + u + \frac{u^2}{2} + \frac{u^3}{6} + \frac{u^4}{24} + \cdots,\quad \sin u = u - \frac{u^3}{6} + \frac{u^5}{120} - \cdots,\quad \cos u = 1 - \frac{u^2}{2} + \frac{u^4}{24} - \cdots$$<p>If a function is written as $g(x) = c_0 + c_1x + c_2x^2 + \cdots$, then $g(0) = c_0$ and $g''(0) = 2c_2$ (differentiate $c_2x^2$ twice to get $2c_2$; the higher terms still contain $x$ and vanish at $0$).</p>` },
        { type: 'steps', title: String.raw`Worked example, part 1: $T_6$ for $\displaystyle\int_0^3 \frac{\sin x}{x}\,\mathrm d x$`, steps: [
          { do: String.raw`$\sin x = x - \dfrac{x^3}{6} + \dfrac{x^5}{120} - \cdots$`, why: 'The series from the refresher with $u = x$.' },
          { do: String.raw`$s(x) = \dfrac{\sin x}{x} = 1 - \dfrac{x^2}{6} + \dfrac{x^4}{120} - \cdots$`, why: String.raw`Divide every term by $x$. Now nothing is divided by zero.` },
          { do: String.raw`$s(0) = 1$`, why: 'The constant term: this is the value that fills the hole.' },
          { do: String.raw`$h = \dfrac{3 - 0}{6} = 0.5$; $\;x = 0,\ 0.5,\ 1,\ 1.5,\ 2,\ 2.5,\ 3$`, why: 'Steps 1 and 2 of the trapezoid rule.' },
          { do: String.raw`$s$-values: $1,\ 0.958851,\ 0.841471,\ 0.664997,\ 0.454649,\ 0.239389,\ 0.047040$`, why: String.raw`Step 3: $\frac{\sin x}{x}$ at each node, and the filled-in value $1$ at $x = 0$.` },
          { do: String.raw`$1 + 2(0.958851 + 0.841471 + 0.664997 + 0.454649 + 0.239389) + 0.047040$`, why: 'Step 4: weights 1, 2, 2, 2, 2, 2, 1.' },
          { do: String.raw`$= 1 + 2(3.159357) + 0.047040 = 7.365754$`, why: 'Add the inner values first, double, then add the end values.' },
          { do: String.raw`$T_6 = \dfrac{0.5}{2}\cdot 7.365754 = 1.841438$`, why: String.raw`Step 5: multiply by $\frac h2 = 0.25$.` },
        ] },
        { type: 'text', html: String.raw`<p>For the error bound we need $K = \max|s''|$. The quotient rule gives (you may take this as given) $s''(x) = \dfrac{2\sin x - 2x\cos x - x^2\sin x}{x^3}$, which again cannot be evaluated at $0$. So we plot it from $x = 0.01$ and get the value at $0$ from the series.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: '|s″(x)| for s(x) = sin(x)/x on [0.01, 3]',
          functions: [{ expr: 'abs((2*sin(x) - 2*x.*cos(x) - x.^2.*sin(x))./x.^3)', label: "$|s''(x)|$" }],
          hlines: [1 / 3], xlim: [0.01, 3.1], ylim: [-0.05, 0.4],
        } },
        { type: 'steps', title: String.raw`Worked example, part 2: $K$, the error bound and $n$ for $10^{-6}$`, steps: [
          { do: String.raw`The plot of $|s''|$ is highest at the left end, $x \to 0$`, why: 'Read the graph: it starts at its top and falls.' },
          { do: String.raw`$s(x) = 1 - \dfrac{1}{6}x^2 + \cdots \;\Rightarrow\; c_2 = -\dfrac16$`, why: String.raw`The coefficient of $x^2$ in the series.` },
          { do: String.raw`$s''(0) = 2c_2 = -\dfrac13$, so $K = \left|-\dfrac13\right| = \dfrac13$`, why: String.raw`Rule from the refresher; $K$ uses the absolute value. The dashed line in the plot is at height $\frac13$.` },
          { do: String.raw`$|E_T| \le \dfrac{\frac13\cdot 3^3}{12\cdot 6^2} = \dfrac{9}{432} = 0.020833$`, why: String.raw`Trapezoid bound with $b - a = 3$, $n = 6$: $\frac13\cdot 27 = 9$ and $12\cdot 36 = 432$.` },
          { do: String.raw`MATLAB: <code>integral(@(x) sin(x)./x, 0, 3)</code> $= 1.848653$`, why: String.raw`<code>integral</code> never evaluates exactly at the end point $0$, so it works here.` },
          { do: String.raw`Actual error $= 1.848653 - 1.841438 = 0.007214 \le 0.020833$ ✓`, why: 'Exact minus approximation, compared with the bound.' },
          { do: String.raw`$\dfrac{9}{12n^2} \le 10^{-6} \Rightarrow n^2 \ge 750\,000 \Rightarrow n \ge 866.03 \Rightarrow n = 867$`, why: String.raw`Choosing $n$ for a tolerance, exactly as in the previous lesson.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\int_0^2 \frac{1 - \cos x}{x^2}\,\mathrm d x$ with $n = 4$`, problem: String.raw`Let $g(x) = \dfrac{1 - \cos x}{x^2}$. Fill the hole at $0$, compute $T_4$ on $[0, 2]$, and bound its error. (A plot of $|g''|$ shows that it is largest at $x = 0$.)`, steps: [
          { prompt: String.raw`Using $\cos x = 1 - \frac{x^2}{2} + \frac{x^4}{24} - \cdots$, which value must $g(0)$ get?`, ask: { kind: 'numeric', answer: '1/2' }, hint: String.raw`$1 - \cos x = \frac{x^2}{2} - \frac{x^4}{24} + \cdots$; divide by $x^2$ and read the constant term.`, reveal: String.raw`$g(x) = \frac12 - \frac{x^2}{24} + \cdots$, so $g(0) = \frac12$.` },
          { prompt: String.raw`With $h = 0.5$ the values are $0.5,\ 0.489670,\ 0.459698,\ 0.413006,\ 0.354037$. Compute $T_4$.`, ask: { kind: 'numeric', answer: '0.25*(0.5 + 2*(0.489670 + 0.459698 + 0.413006) + 0.354037)', tol: 1e-5 }, hint: String.raw`$\frac h2 = 0.25$; inner values get weight 2.`, reveal: String.raw`$T_4 = 0.25\big(0.5 + 2(1.362374) + 0.354037\big) = 0.25\cdot 3.578785 = 0.894696$.` },
          { prompt: String.raw`From $g(x) = \frac12 - \frac{1}{24}x^2 + \cdots$: what is $K = |g''(0)|$?`, ask: { kind: 'numeric', answer: '1/12' }, hint: String.raw`$g''(0) = 2c_2$ with $c_2 = -\frac{1}{24}$.`, reveal: String.raw`$g''(0) = 2\cdot\left(-\frac1{24}\right) = -\frac1{12}$, so $K = \frac1{12}$.` },
          { prompt: String.raw`Trapezoid error bound for $n = 4$ on $[0, 2]$?`, ask: { kind: 'numeric', answer: '(1/12)*8/(12*16)', tol: 1e-4 }, hint: String.raw`$\dfrac{K(b-a)^3}{12n^2}$ with $(b-a)^3 = 8$ and $n^2 = 16$.`, reveal: String.raw`$|E_T| \le \dfrac{\frac1{12}\cdot 8}{192} = \dfrac{1}{288} \approx 0.003472$.` },
        ], finale: String.raw`<code>integral</code> gives $0.897340$, so the actual error is $0.002644$ — within the bound.` },
        { type: 'callout', kind: 'warn', title: 'Removable singularities in MATLAB', html: String.raw`<p>In MATLAB, <code>sin(0)/0</code> is <code>NaN</code> ("not a number") and poisons the whole sum: overwrite that value with the limit, <code>y(x == 0) = 1</code>. Formulas for $f''$ have the same problem at $0$: plot them on $[10^{-2}, b]$ and use the series to get the value at $0$.</p>` },
      ],
    },
    {
      id: 'capstone-review',
      title: 'Arc length and volume integrals, evaluated numerically',
      blocks: [
        { type: 'text', html: String.raw`<p>Capstone problems combine this module with the two before it: set up an arc length or a volume as an integral, evaluate it exactly where possible, and numerically (<code>integral</code>, <code>trapz</code>) where not.</p>` },
        { type: 'refresher', title: 'parametric arc length (Module 10)', html: String.raw`<p>A curve $x = x(t)$, $y = y(t)$, $t_0 \le t \le t_1$, has length $$L = \int_{t_0}^{t_1}\sqrt{x'(t)^2 + y'(t)^2}\,\mathrm d t .$$ Derivatives: $\frac{\mathrm d}{\mathrm d t}\cos t = -\sin t$, $\frac{\mathrm d}{\mathrm d t}\sin t = \cos t$.</p>` },
        { type: 'refresher', title: 'the disk method and squaring a bracket (Module 9)', html: String.raw`<p>Rotating $y = r(x) \ge 0$, $a \le x \le b$, about the $x$-axis gives a solid of volume $V = \pi\int_a^b r(x)^2\,\mathrm d x$ (each slice is a disk of area $\pi r^2$). To integrate, expand the square: $(p - q x^2)^2 = p^2 - 2pq\,x^2 + q^2x^4$.</p>` },
        { type: 'steps', title: String.raw`Worked example: length of the half-ellipse $x = 5\cos t$, $y = 3\sin t$, $0 \le t \le \pi$`, steps: [
          { do: String.raw`$x'(t) = -5\sin t$`, why: String.raw`Derivative of $5\cos t$.` },
          { do: String.raw`$y'(t) = 3\cos t$`, why: String.raw`Derivative of $3\sin t$.` },
          { do: String.raw`$x'(t)^2 + y'(t)^2 = 25\sin^2 t + 9\cos^2 t$`, why: String.raw`Square each: $(-5\sin t)^2 = 25\sin^2 t$.` },
          { do: String.raw`$L = \displaystyle\int_0^{\pi}\sqrt{25\sin^2 t + 9\cos^2 t}\,\mathrm d t$`, why: 'Insert into the arc-length formula.' },
          { do: String.raw`<code>L = integral(@(t) sqrt(25*sin(t).^2 + 9*cos(t).^2), 0, pi)</code> $= 12.7635$`, why: 'This integrand has no elementary antiderivative (an "elliptic integral"), so we evaluate it numerically.' },
          { do: String.raw`Sanity check: $3\pi = 9.42 < 12.76 < 5\pi = 15.71$`, why: 'The half-ellipse lies between the half-circles of radius 3 and radius 5.' },
        ] },
        { type: 'steps', title: String.raw`Worked example: volume when $r(x) = 0.5 - x^2$, $-0.5 \le x \le 0.5$, rotates about the $x$-axis`, steps: [
          { do: String.raw`$V = \pi\displaystyle\int_{-0.5}^{0.5}\left(0.5 - x^2\right)^2\mathrm d x$`, why: 'Disk method.' },
          { do: String.raw`$\left(0.5 - x^2\right)^2 = 0.25 - x^2 + x^4$`, why: String.raw`Expand with $p = 0.5$, $q = 1$: $p^2 = 0.25$, $2pq = 1$, $q^2 = 1$.` },
          { do: String.raw`$V = 2\pi\displaystyle\int_0^{0.5}\left(0.25 - x^2 + x^4\right)\mathrm d x$`, why: String.raw`The integrand is even and the interval symmetric, so the integral is twice the integral over $[0, 0.5]$.` },
          { do: String.raw`$= 2\pi\Big[0.25x - \tfrac{x^3}{3} + \tfrac{x^5}{5}\Big]_0^{0.5}$`, why: 'Power rule for each term.' },
          { do: String.raw`$= 2\pi\left(0.125 - 0.041667 + 0.00625\right) = 2\pi\cdot 0.089583$`, why: String.raw`Insert $x = 0.5$: $0.5^3/3 = 0.041667$, $0.5^5/5 = 0.00625$; at $x = 0$ everything is $0$.` },
          { do: String.raw`$V = 0.179167\,\pi \approx 0.562869$`, why: 'Multiply out.' },
          { do: String.raw`<code>x = linspace(-0.5, 0.5, 11); trapz(x, pi*(0.5 - x.^2).^2)</code> $= 0.560240$`, why: 'Check with the trapezoid rule (10 strips): close, but not exact — the integrand is a degree-4 polynomial, not a line.' },
          { do: String.raw`With 21 points: $0.562214$; the difference to $V$ drops from $0.00263$ to $0.00066$, about $4$ times`, why: 'Doubling $n$ divides a trapezoid error by about 4 — the order-2 behaviour from the orders lesson.' },
        ] },
        { type: 'guided', title: 'An arch and a vase', problem: String.raw`(1) Find the length of the half-ellipse $x = 4\cos t$, $y = 2\sin t$, $0 \le t \le \pi$. (2) Find the volume when $r(x) = 0.25 - 0.4x^2$, $-0.5 \le x \le 0.5$, rotates about the $x$-axis.`, steps: [
          { prompt: String.raw`Type $x'(t)$ (variable <code>t</code>).`, ask: { kind: 'expression', variable: 't', answer: '-4*sin(t)' }, hint: String.raw`The derivative of $\cos t$ is $-\sin t$.`, reveal: String.raw`$x'(t) = -4\sin t$, and $y'(t) = 2\cos t$.` },
          { prompt: String.raw`$L = \int_0^\pi\sqrt{16\sin^2 t + 4\cos^2 t}\,\mathrm d t$. Evaluate it (you may type <code>integral(@(t) ..., 0, pi)</code>).`, ask: { kind: 'numeric', answer: 'integral(@(t) sqrt(16*sin(t).^2 + 4*cos(t).^2), 0, pi)', tol: 1e-5 }, hint: String.raw`Use element-wise operators: <code>sqrt(16*sin(t).^2 + 4*cos(t).^2)</code>.`, reveal: String.raw`$L \approx 9.6884$ (between $2\pi$ and $4\pi$ ✓).` },
          { prompt: String.raw`Expand $(0.25 - 0.4x^2)^2 = 0.0625 - c\,x^2 + 0.16x^4$. What is $c$?`, ask: { kind: 'numeric', answer: '0.2' }, hint: String.raw`$c = 2pq$ with $p = 0.25$, $q = 0.4$.`, reveal: String.raw`$2\cdot 0.25\cdot 0.4 = 0.2$.` },
          { prompt: String.raw`Now $V = \pi\int_{-0.5}^{0.5}(0.0625 - 0.2x^2 + 0.16x^4)\,\mathrm d x$. Use $\int_{-0.5}^{0.5}1\,\mathrm d x = 1$, $\int_{-0.5}^{0.5}x^2\,\mathrm d x = \frac1{12}$, $\int_{-0.5}^{0.5}x^4\,\mathrm d x = \frac{1}{80}$. $V = \;?$`, ask: { kind: 'numeric', answer: 'pi*(0.0625 - 0.2/12 + 0.16/80)', tol: 1e-5 }, hint: String.raw`$V = \pi\left(0.0625\cdot 1 - 0.2\cdot\frac1{12} + 0.16\cdot\frac1{80}\right)$.`, reveal: String.raw`$V = \pi(0.0625 - 0.016667 + 0.002) = 0.047833\,\pi \approx 0.150273$.` },
        ] },
      ],
    },
  ],
  matlab: [
    {
      id: 'rules-with-vectors',
      title: 'trapz and rules written with weight vectors',
      blocks: [
        { type: 'text', html: String.raw`<p>MATLAB's <code>trapz(x, y)</code> applies the trapezoid rule to data vectors — ideal for measured data. For homework you also need to write the rules yourself, which is short with a <b>weight vector</b>: the rule is <code>dx/2*sum(w.*y)</code> or <code>dx/3*sum(w.*y)</code>.</p>` },
        { type: 'code', caption: 'Four ways to approximate the integral of exp(-x^2) over [0, 2].', editable: true, code: String.raw`f = @(x) exp(-x.^2);
a = 0; b = 2; n = 8;
dx = (b - a)/n;
x = linspace(a, b, n+1);            % n+1 nodes
y = f(x);

T1 = trapz(x, y);                   % built-in trapezoid rule

w = 2*ones(1, n+1);                 % trapezoid weights 1 2 2 ... 2 1
w(1) = 1; w(end) = 1;
T2 = dx/2*sum(w.*y);

xm = a + dx/2 : dx : b;             % midpoints
M = dx*sum(f(xm));

s = 2*ones(1, n+1);                 % Simpson weights 1 4 2 4 ... 4 1
s(2:2:n) = 4; s(1) = 1; s(end) = 1;
S = dx/3*sum(s.*y);

I = integral(f, a, b);
fprintf('T (trapz) = %.8f   error %.2e\n', T1, I - T1)
fprintf('T (sum)   = %.8f\n', T2)
fprintf('M         = %.8f   error %.2e\n', M, I - M)
fprintf('S         = %.8f   error %.2e\n', S, I - S)` },
        { type: 'callout', kind: 'matlab', html: String.raw`<p><code>linspace(a, b, n+1)</code> — not <code>n</code> — gives $n$ subintervals. <code>s(2:2:n) = 4</code> sets the odd-numbered interior nodes $x_1, x_3, \dots$ (MATLAB indices start at 1).</p>` },
        { type: 'matlab', prompt: String.raw`Compute the trapezoid approximation <code>T</code> of $\int_1^3 \ln x\,\mathrm d x$ with $n = 6$ subintervals using <code>trapz</code>.`, starter: `x = linspace(1, 3, 2);   % fix the number of points\ny = log(x);\nT = 0;                   % use trapz`, solution: `x = linspace(1, 3, 7);\ny = log(x);\nT = trapz(x, y);`, checks: [{ var: 'T', value: 'trapz(linspace(1,3,7), log(linspace(1,3,7)))', tol: 1e-10 }, { uses: 'trapz' }], hint: String.raw`$n = 6$ subintervals need 7 points.` },
        { type: 'matlab', prompt: String.raw`Write Simpson's rule with a weight vector and compute <code>S</code> $\approx \int_0^1 e^{x^2}\,\mathrm d x$ with $n = 10$.`, starter: `f = @(x) exp(x.^2);\nn = 10; dx = 1/n;\nx = linspace(0, 1, n+1);\ns = ones(1, n+1);   % fix the weights\nS = 0;`, solution: `f = @(x) exp(x.^2);\nn = 10; dx = 1/n;\nx = linspace(0, 1, n+1);\ns = 2*ones(1, n+1);\ns(2:2:n) = 4; s(1) = 1; s(end) = 1;\nS = dx/3*sum(s.*f(x));`, checks: [{ var: 'S', value: 'sum([1 4 2 4 2 4 2 4 2 4 1].*exp(linspace(0,1,11).^2))*0.1/3', tol: 1e-10 }], hint: String.raw`Weights $1, 4, 2, \dots, 4, 1$; then <code>dx/3*sum(s.*f(x))</code>.` },
        { type: 'matlab', prompt: String.raw`Compute the trapezoid approximation <code>T</code> of $\int_0^2 \frac{\sin x}{x}\,\mathrm d x$ with $n = 8$. Handle the removable singularity at $x = 0$ so that <code>T</code> is a number, not <code>NaN</code>.`, starter: `x = linspace(0, 2, 9);\ny = sin(x)./x;\n% repair y at x = 0 here\nT = trapz(x, y);`, solution: `x = linspace(0, 2, 9);\ny = sin(x)./x;\ny(x == 0) = 1;\nT = trapz(x, y);`, checks: [{ var: 'T', value: 'trapz(linspace(0,2,9), [1, sin(linspace(0.25,2,8))./linspace(0.25,2,8)])', tol: 1e-10, message: '`T` is wrong — is y(1) still NaN?' }], hint: String.raw`<code>y(x == 0) = 1;</code> uses the limit $\lim_{x\to0}\frac{\sin x}{x} = 1$.` },
      ],
    },
    {
      id: 'error-estimates',
      title: 'Estimating K from a plot and testing convergence',
      blocks: [
        { type: 'text', html: String.raw`<p>In homework the constant $K$ is <b>read from a plot</b> of $|f''|$, and the plot belongs in the Live Script as evidence. Compute $f''$ by hand first; then evaluate it on a fine grid. <code>max</code> on a fine grid gives the same number you would read from the graph.</p>` },
        { type: 'code', caption: 'K for exp(-x^2) on [0, 2] and the n needed for |E_T| below 1e-4.', editable: true, code: String.raw`d2f = @(x) (4*x.^2 - 2).*exp(-x.^2);   % f'' computed by hand
a = 0; b = 2;
fplot(@(x) abs(d2f(x)), [a b])
grid on, title('|f''''(x)|')
xx = linspace(a, b, 2001);
K = max(abs(d2f(xx)))
tol = 1e-4;
n = ceil(sqrt(K*(b - a)^3/(12*tol)))     % smallest n with bound <= tol` },
        { type: 'text', html: String.raw`<p>A <code>for</code> loop over $n$ shows the order of convergence: each doubling of $n$ should divide the trapezoid error by about 4 and the Simpson error by about 16.</p>` },
        { type: 'code', caption: 'Error table for the trapezoid and Simpson rules.', editable: true, code: String.raw`f = @(x) exp(-x.^2); a = 0; b = 2;
I = integral(f, a, b);
fprintf('   n      E_T          E_S\n')
for n = [4 8 16 32 64]
  x = linspace(a, b, n+1); dx = (b - a)/n;
  s = 2*ones(1, n+1); s(2:2:n) = 4; s(1) = 1; s(end) = 1;
  ET = I - trapz(x, f(x));
  ES = I - dx/3*sum(s.*f(x));
  fprintf('%4d   %10.3e   %10.3e\n', n, ET, ES)
end` },
        { type: 'matlab', prompt: String.raw`For $f(x) = \sqrt{1 + x^3}$ on $[0, 2]$ one finds $f''(x) = \dfrac{3x + 0.75x^4}{(1 + x^3)^{3/2}}$. Estimate <code>K</code> $= \max|f''|$ on a grid of 2001 points, then the smallest <code>n</code> for which the trapezoid bound is at most $10^{-5}$.`, starter: `d2f = @(x) (3*x + 0.75*x.^4)./(1 + x.^3).^1.5;\nxx = linspace(0, 2, 2001);\nK = 0;   % maximum of |f''| on the grid\nn = 0;   % smallest n with K*(b-a)^3/(12*n^2) <= 1e-5`, solution: `d2f = @(x) (3*x + 0.75*x.^4)./(1 + x.^3).^1.5;\nxx = linspace(0, 2, 2001);\nK = max(abs(d2f(xx)));\nn = ceil(sqrt(K*2^3/(12*1e-5)));`, checks: [{ var: 'K', value: 1.46789, tol: 1e-4 }, { var: 'n', value: 313, tol: 1e-9 }], hint: String.raw`Solve $\frac{K\cdot 8}{12n^2} \le 10^{-5}$ for $n$ and round up with <code>ceil</code>.` },
        { type: 'matlab', prompt: String.raw`Store the trapezoid errors $E_n = I - T_n$ for $\int_0^1 e^{x}\,\mathrm d x = e - 1$ and $n = 2, 4, 8, 16, 32$ in a vector <code>E</code> (use a loop), and the ratio <code>r = E(4)/E(5)</code>. It should be close to 4.`, starter: `I = exp(1) - 1;\nns = [2 4 8 16 32];\nE = zeros(1, 5);\nfor k = 1:5\n  % compute T for n = ns(k) and store I - T in E(k)\nend\nr = 0;`, solution: `I = exp(1) - 1;\nns = [2 4 8 16 32];\nE = zeros(1, 5);\nfor k = 1:5\n  x = linspace(0, 1, ns(k)+1);\n  E(k) = I - trapz(x, exp(x));\nend\nr = E(4)/E(5);`, checks: [{ var: 'E', size: 5 }, { var: 'E', value: 'exp(1) - 1 - trapz(linspace(0,1,3), exp(linspace(0,1,3)))', tol: 1e-10 }, { var: 'r', value: 4, tol: 2e-3 }] },
      ],
    },
  ],
  assignIntro: String.raw`<p>Every problem below is the same type as a worked example and a guided exercise you have already done — the links above each problem take you back to them. If you get stuck, use the hints one at a time, then "Walk me through it".</p>`,
  assignments: [
    {
      id: 'a1',
      title: 'Three rules by hand',
      difficulty: 'core',
      examples: ['midpoint-trapezoid', 'midpoint', 'simpson'],
      statement: String.raw`<p>Approximate $\displaystyle\int_0^1 \frac{\mathrm d x}{1 + x^2} = \frac{\pi}{4}$ with $n = 4$ subintervals. Give at least six significant digits (you may type MATLAB expressions such as <code>0.125*(1 + ...)</code>).</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$T_4$`, kind: 'numeric', answer: '0.125*(1 + 2*(16/17 + 0.8 + 0.64) + 0.5)', tol: 1e-6,
          hints: [String.raw`Same five steps as the trapezoid example: $h$, $x$-values, $f$-values, weighted sum, multiply by $\frac h2$.`, String.raw`$h = 0.25$, nodes $0, 0.25, 0.5, 0.75, 1$, weights $1, 2, 2, 2, 1$.`, String.raw`$f(0.25) = \frac{1}{1 + 0.0625} = \frac{16}{17} = 0.941176$, $f(0.5) = 0.8$, $f(0.75) = 0.64$, $f(0) = 1$, $f(1) = 0.5$.`],
          walkthrough: [
            { do: String.raw`$h = \frac{1 - 0}{4} = 0.25$`, why: 'Strip width.' },
            { do: String.raw`$x$-values: $0,\ 0.25,\ 0.5,\ 0.75,\ 1$`, why: String.raw`Start at $0$, add $0.25$.` },
            { do: String.raw`$f(0) = 1,\ f(0.25) = \frac{1}{1.0625} = 0.941176,\ f(0.5) = \frac{1}{1.25} = 0.8$`, why: String.raw`Insert into $\frac{1}{1 + x^2}$; e.g. $0.25^2 = 0.0625$.` },
            { do: String.raw`$f(0.75) = \frac{1}{1.5625} = 0.64,\ f(1) = 0.5$`, why: String.raw`$0.75^2 = 0.5625$.` },
            { do: String.raw`$1 + 2(0.941176 + 0.8 + 0.64) + 0.5 = 1 + 4.762353 + 0.5 = 6.262353$`, why: 'Weighted sum with weights 1, 2, 2, 2, 1.' },
            { do: String.raw`$T_4 = 0.125\cdot 6.262353 = 0.782794$`, why: String.raw`Multiply by $\frac h2 = 0.125$.` },
          ] },
        { label: '(b)', prompt: String.raw`$M_4$`, kind: 'numeric', answer: '0.25*(64/65 + 64/73 + 64/89 + 64/113)', tol: 1e-6,
          hints: [String.raw`Midpoint rule: function values at the middles of the strips, all weights 1, multiply by $h$.`, String.raw`Midpoints $0.125,\ 0.375,\ 0.625,\ 0.875$.`, String.raw`$f(0.125) = \frac{1}{1 + 0.015625} = 0.984615$. Do the same for the other three midpoints.`],
          walkthrough: [
            { do: String.raw`$h = 0.25$; midpoints $0.125,\ 0.375,\ 0.625,\ 0.875$`, why: String.raw`First midpoint $a + \frac h2$, then add $h$.` },
            { do: String.raw`$f(0.125) = \frac{1}{1.015625} = 0.984615,\quad f(0.375) = \frac{1}{1.140625} = 0.876712$`, why: String.raw`$0.125^2 = 0.015625$, $0.375^2 = 0.140625$.` },
            { do: String.raw`$f(0.625) = \frac{1}{1.390625} = 0.719101,\quad f(0.875) = \frac{1}{1.765625} = 0.566372$`, why: String.raw`$0.625^2 = 0.390625$, $0.875^2 = 0.765625$.` },
            { do: String.raw`Sum $= 0.984615 + 0.876712 + 0.719101 + 0.566372 = 3.146801$`, why: 'All weights are 1.' },
            { do: String.raw`$M_4 = 0.25\cdot 3.146801 = 0.786700$`, why: String.raw`Multiply by $h$.` },
          ] },
        { label: '(c)', prompt: String.raw`$S_4$`, kind: 'numeric', answer: '0.25/3*(1 + 4*16/17 + 2*0.8 + 4*0.64 + 0.5)', tol: 1e-7,
          hints: [String.raw`Same nodes and $f$-values as in (a); only the weights and the factor change.`, String.raw`Weights $1, 4, 2, 4, 1$ and factor $\frac h3 = \frac{0.25}{3}$.`, String.raw`Weighted sum: $1 + 4(0.941176) + 2(0.8) + 4(0.64) + 0.5$.`],
          walkthrough: [
            { do: String.raw`$n = 4$ even ✓, $h = 0.25$, values $1,\ 0.941176,\ 0.8,\ 0.64,\ 0.5$`, why: 'Reuse steps 1–3 from part (a).' },
            { do: String.raw`$1 + 4(0.941176) + 2(0.8) + 4(0.64) + 0.5$`, why: 'Simpson weights 1, 4, 2, 4, 1.' },
            { do: String.raw`$= 1 + 3.764706 + 1.6 + 2.56 + 0.5 = 9.424706$`, why: 'Multiply, then add.' },
            { do: String.raw`$S_4 = \frac{0.25}{3}\cdot 9.424706 = 0.785392$`, why: String.raw`Multiply by $\frac h3$.` },
          ] },
        { label: '(d)', prompt: String.raw`Use your results to approximate $\pi$ as $4S_4$.`, kind: 'numeric', answer: '4*0.25/3*(1 + 4*16/17 + 2*0.8 + 4*0.64 + 0.5)', tol: 1e-7,
          hints: [String.raw`The exact integral is $\frac{\pi}{4}$, so $\pi = 4\cdot$(the integral).`, String.raw`Multiply your $S_4$ from (c) by $4$.`],
          walkthrough: [
            { do: String.raw`$\displaystyle\int_0^1 \frac{\mathrm d x}{1 + x^2} = \frac{\pi}{4}$`, why: String.raw`Given (it is $\arctan 1 - \arctan 0$).` },
            { do: String.raw`$\pi = 4\displaystyle\int_0^1 \frac{\mathrm d x}{1 + x^2} \approx 4S_4$`, why: 'Multiply both sides by 4 and replace the integral by its approximation.' },
            { do: String.raw`$4 \cdot 0.785392 = 3.141569$`, why: String.raw`Correct to about $2.4\cdot10^{-5}$.` },
          ] },
      ],
    },
    {
      id: 'a2',
      title: 'Error bounds and the number of subintervals',
      difficulty: 'core',
      examples: ['error-bounds', 'choosing-n'],
      statement: String.raw`<p>Consider $I = \displaystyle\int_0^1 e^{x^2}\,\mathrm d x$. One computes $f''(x) = (2 + 4x^2)e^{x^2}$ and $f^{(4)}(x) = (12 + 48x^2 + 16x^4)e^{x^2}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Give the smallest valid $K = \max_{[0,1]}|f''(x)|$.`, kind: 'numeric', answer: '6*exp(1)', tol: 1e-6,
          hints: [String.raw`Is $f''$ increasing or decreasing on $[0, 1]$?`, String.raw`Both factors $2 + 4x^2$ and $e^{x^2}$ are positive and grow with $x$, so the maximum is at $x = 1$.`, String.raw`$f''(1) = (2 + 4)e^{1}$.`],
          walkthrough: [
            { do: String.raw`$2 + 4x^2$ and $e^{x^2}$ are positive and increasing on $[0, 1]$`, why: String.raw`$x^2$ grows with $x \ge 0$.` },
            { do: String.raw`$f''$ is increasing, so $K = f''(1)$`, why: 'A product of positive increasing functions is increasing; its maximum is at the right end.' },
            { do: String.raw`$K = (2 + 4\cdot 1)e^{1} = 6e \approx 16.31$`, why: String.raw`Insert $x = 1$.` },
          ] },
        { label: '(b)', prompt: String.raw`Give the trapezoid error bound for $n = 10$.`, kind: 'numeric', answer: '6*exp(1)/1200', tol: 1e-6,
          hints: ['Use the trapezoid bound with the $K$ from (a).', String.raw`$\dfrac{K(b-a)^3}{12n^2}$ with $b - a = 1$, $n = 10$.`, String.raw`$\dfrac{6e\cdot 1}{12\cdot 100}$.`],
          walkthrough: [
            { do: String.raw`$|E_T| \le \dfrac{K(b-a)^3}{12n^2} = \dfrac{6e\cdot 1^3}{12\cdot 10^2}$`, why: 'Insert $K = 6e$, $b - a = 1$, $n = 10$.' },
            { do: String.raw`$= \dfrac{6e}{1200} = \dfrac{e}{200}$`, why: String.raw`$12\cdot 100 = 1200$; cancel $6$.` },
            { do: String.raw`$\approx 0.01359$`, why: String.raw`$e \approx 2.71828$.` },
          ] },
        { label: '(c)', prompt: String.raw`Smallest $n$ that guarantees $|E_T| \le 10^{-4}$.`, kind: 'numeric', answer: '117', tol: 1e-9,
          hints: ['Set the trapezoid bound $\\le 10^{-4}$ and solve for $n$.', String.raw`$\frac{6e}{12n^2} \le 10^{-4}$ gives $n^2 \ge \frac{6e}{12\cdot10^{-4}}$.`, String.raw`$n^2 \ge 5000e \approx 13\,591$. Take the square root and round up.`],
          walkthrough: [
            { do: String.raw`$\dfrac{6e}{12n^2} \le 10^{-4}$`, why: 'Bound $\le$ tolerance.' },
            { do: String.raw`$n^2 \ge \dfrac{6e}{12\cdot10^{-4}} = 5000e = 13\,591.4$`, why: String.raw`Multiply by $n^2$ and divide by $10^{-4}$.` },
            { do: String.raw`$n \ge \sqrt{13\,591.4} = 116.58$`, why: 'Square root.' },
            { do: String.raw`$n = 117$`, why: 'Round up to the next whole number.' },
          ] },
        { label: '(d)', prompt: String.raw`Smallest $n$ that guarantees $|E_M| \le 10^{-4}$.`, kind: 'numeric', answer: '83', tol: 1e-9,
          hints: ['Same as (c) with the midpoint bound.', String.raw`$\frac{6e}{24n^2} \le 10^{-4}$.`, String.raw`$n^2 \ge 2500e \approx 6796$.`],
          walkthrough: [
            { do: String.raw`$\dfrac{6e}{24n^2} \le 10^{-4}$`, why: String.raw`Midpoint bound: $24$ instead of $12$.` },
            { do: String.raw`$n^2 \ge \dfrac{6e}{24\cdot10^{-4}} = 2500e = 6795.7$`, why: String.raw`Solve for $n^2$.` },
            { do: String.raw`$n \ge 82.44 \;\Rightarrow\; n = 83$`, why: 'Square root, round up.' },
          ] },
        { label: '(e)', prompt: String.raw`Smallest admissible $n$ that guarantees $|E_S| \le 10^{-4}$ for Simpson's rule.`, kind: 'numeric', answer: '12', tol: 1e-9,
          hints: [String.raw`First find $K_4 = \max|f^{(4)}|$: like $f''$, it is increasing on $[0,1]$.`, String.raw`$K_4 = f^{(4)}(1) = (12 + 48 + 16)e = 76e$. Solve $\frac{76e}{180n^4} \le 10^{-4}$.`, String.raw`$n^4 \ge 11\,478$; take the fourth root, round up, and remember that $n$ must be even.`],
          walkthrough: [
            { do: String.raw`$K_4 = f^{(4)}(1) = (12 + 48 + 16)e = 76e$`, why: 'All terms are positive and increasing, so the maximum is at $x = 1$.' },
            { do: String.raw`$\dfrac{76e\cdot 1^5}{180n^4} \le 10^{-4}$`, why: 'Simpson bound $\le$ tolerance.' },
            { do: String.raw`$n^4 \ge \dfrac{76e}{180\cdot10^{-4}} = 11\,477.2$`, why: String.raw`Solve for $n^4$.` },
            { do: String.raw`$n \ge 11\,477.2^{1/4} = 10.35$`, why: 'Fourth root (square root twice).' },
            { do: String.raw`$n = 12$`, why: String.raw`Rounding up gives $11$, which is odd; Simpson needs even $n$, so take $12$.` },
          ] },
      ],
    },
    {
      id: 'a3',
      title: 'Predicting errors and combining rules',
      difficulty: 'challenge',
      examples: ['orders'],
      statement: String.raw`<p>Use the orders of convergence instead of the bounds.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`A trapezoid approximation with $n = 10$ has error $2.4\cdot10^{-3}$. Predict the error with $n = 40$.`, kind: 'numeric', answer: '2.4e-3/16', tol: 1e-3,
          hints: ['How many doublings take 10 to 40?', 'Each doubling divides a trapezoid error by 4.', String.raw`Two doublings: divide by $4\cdot 4 = 16$.`],
          walkthrough: [
            { do: String.raw`$10 \to 20 \to 40$: two doublings`, why: String.raw`$40 = 10\cdot 2^2$.` },
            { do: String.raw`Trapezoid order $p = 2$: each doubling divides by $4$`, why: String.raw`$2^2 = 4$.` },
            { do: String.raw`$\dfrac{2.4\cdot10^{-3}}{16} = 1.5\cdot10^{-4}$`, why: String.raw`Two doublings: $4^2 = 16$.` },
          ] },
        { label: '(b)', prompt: String.raw`A Simpson approximation with $n = 10$ has error $8\cdot10^{-6}$. Predict the error with $n = 20$.`, kind: 'numeric', answer: '8e-6/16', tol: 1e-3,
          hints: ['One doubling.', String.raw`Simpson has order $4$: one doubling divides by $2^4$.`],
          walkthrough: [
            { do: String.raw`$10 \to 20$: one doubling`, why: 'Factor 2.' },
            { do: String.raw`Simpson order $p = 4$: divide by $2^4 = 16$`, why: 'From the table of orders.' },
            { do: String.raw`$\dfrac{8\cdot10^{-6}}{16} = 5\cdot10^{-7}$`, why: 'Divide.' },
          ] },
        { label: '(c)', prompt: String.raw`For $\int_1^2 \frac{\mathrm d x}{x}$ we found $T_4 = 0.697024$ and $M_4 = 0.691220$. Compute $\frac13 T_4 + \frac23 M_4$.`, kind: 'numeric', answer: '(0.697024 + 2*0.691220)/3', tol: 1e-6,
          hints: [String.raw`Write it as $\frac{T_4 + 2M_4}{3}$.`, String.raw`$2M_4 = 1.382440$.`, String.raw`$\frac{0.697024 + 1.382440}{3}$.`],
          walkthrough: [
            { do: String.raw`$\tfrac13 T_4 + \tfrac23 M_4 = \dfrac{T_4 + 2M_4}{3}$`, why: 'Common denominator 3.' },
            { do: String.raw`$= \dfrac{0.697024 + 1.382440}{3} = \dfrac{2.079464}{3}$`, why: String.raw`$2\cdot 0.691220 = 1.382440$.` },
            { do: String.raw`$= 0.693155$`, why: String.raw`This is $S_8$; its error is only $7\cdot10^{-6}$.` },
          ] },
        { label: '(d)', prompt: String.raw`Why is $\frac13 T_n + \frac23 M_n$ so much better than $T_n$ or $M_n$?`, kind: 'choice', choices: [String.raw`It uses more function values, nothing else.`, String.raw`$E_M \approx -\frac12 E_T$, so the weighted average cancels the leading $1/n^2$ error terms.`, String.raw`Averaging always halves the error.`, String.raw`Because $1/x$ is convex.`], answer: 1,
          hints: [String.raw`Compare the signs and sizes of $E_T$ and $E_M$ in the midpoint lesson.`, String.raw`Compute $\frac13 E_T + \frac23 E_M$ using $E_M \approx -\frac12 E_T$.`],
          solution: String.raw`$\frac13 E_T + \frac23 E_M \approx \frac13 E_T - \frac13 E_T = 0$ to leading order; what remains is the $1/n^4$ term of Simpson's rule.` },
      ],
    },
    {
      id: 'a4',
      title: 'Capstone A — trapezoid rule with a removable singularity',
      difficulty: 'exam',
      hw: 'HW1-style',
      examples: ['removable-singularity', 'error-bounds', 'choosing-n'],
      statement: String.raw`<p>Let $g(x) = \dfrac{1 - e^{-x}}{x}$ for $x \ne 0$ and $I = \displaystyle\int_0^2 g(x)\,\mathrm d x$. One can show</p>$$g''(x) = \frac{2 - 2e^{-x} - 2xe^{-x} - x^2e^{-x}}{x^3}\qquad (x \ne 0).$$`,
      parts: [
        { label: '(a)', prompt: String.raw`Which value must $g(0)$ get so that $g$ is continuous on $[0, 2]$?`, kind: 'numeric', answer: '1',
          hints: [String.raw`Write $e^{-x}$ as a series (refresher in the removable-singularity lesson, with $u = -x$).`, String.raw`$e^{-x} = 1 - x + \frac{x^2}{2} - \frac{x^3}{6} + \cdots$, so $1 - e^{-x} = x - \frac{x^2}{2} + \cdots$.`, String.raw`Divide by $x$ and read the constant term.`],
          walkthrough: [
            { do: String.raw`$e^{-x} = 1 - x + \dfrac{x^2}{2} - \dfrac{x^3}{6} + \cdots$`, why: String.raw`Series of $e^u$ with $u = -x$.` },
            { do: String.raw`$1 - e^{-x} = x - \dfrac{x^2}{2} + \dfrac{x^3}{6} - \cdots$`, why: 'Subtract from 1: the 1s cancel, every other sign flips.' },
            { do: String.raw`$g(x) = 1 - \dfrac{x}{2} + \dfrac{x^2}{6} - \cdots$`, why: String.raw`Divide each term by $x$.` },
            { do: String.raw`$g(0) = 1$`, why: 'The constant term.' },
          ] },
        { label: '(b)', prompt: String.raw`Compute the trapezoid approximation $T_4$.`, kind: 'numeric', answer: '0.25*(1 + 2*((1-exp(-0.5))/0.5 + (1-exp(-1)) + (1-exp(-1.5))/1.5) + (1-exp(-2))/2)', tol: 1e-6,
          hints: [String.raw`Five steps: $h$, nodes, values (with $g(0) = 1$ from (a)), weighted sum, times $\frac h2$.`, String.raw`$h = 0.5$, nodes $0, 0.5, 1, 1.5, 2$.`, String.raw`$g(0.5) = \frac{1 - e^{-0.5}}{0.5} = 0.786939$.`],
          walkthrough: [
            { do: String.raw`$h = \frac{2 - 0}{4} = 0.5$; nodes $0,\ 0.5,\ 1,\ 1.5,\ 2$`, why: 'Steps 1 and 2.' },
            { do: String.raw`$g(0) = 1,\ g(0.5) = 0.786939,\ g(1) = 0.632121$`, why: String.raw`Step 3; $g(0)$ from (a), the others from the formula, e.g. $g(1) = 1 - e^{-1}$.` },
            { do: String.raw`$g(1.5) = 0.517913,\ g(2) = 0.432332$`, why: String.raw`$\frac{1 - e^{-1.5}}{1.5}$ and $\frac{1 - e^{-2}}{2}$.` },
            { do: String.raw`$1 + 2(0.786939 + 0.632121 + 0.517913) + 0.432332 = 1 + 3.873946 + 0.432332 = 5.306278$`, why: 'Weighted sum, weights 1, 2, 2, 2, 1.' },
            { do: String.raw`$T_4 = 0.25 \cdot 5.306278 = 1.326569$`, why: String.raw`Multiply by $\frac h2 = 0.25$.` },
          ] },
        { label: '(c)', prompt: String.raw`Plot $|g''|$ on $[0.01, 2]$. Which $K$ do you read off? (Use the series of $g$ to get the value at $0$.)`, kind: 'numeric', answer: '1/3', tol: 1e-2,
          hints: ['The plot of $|g\'\'|$ is highest at the left end. So you need $|g\'\'(0)|$.', String.raw`$g''(0) = 2c_2$, where $c_2$ is the coefficient of $x^2$ in the series of $g$.`, String.raw`From (a): $g(x) = 1 - \frac{x}{2} + \frac{x^2}{6} - \cdots$, so $c_2 = \frac16$.`],
          walkthrough: [
            { do: String.raw`<code>fplot(@(x) abs(d2g(x)), [0.01 2])</code>: the curve decreases from about $0.33$`, why: 'Read the plot: the maximum is at the left end.' },
            { do: String.raw`$g(x) = 1 - \dfrac{x}{2} + \dfrac{x^2}{6} - \cdots \Rightarrow c_2 = \dfrac16$`, why: 'Series from part (a).' },
            { do: String.raw`$g''(0) = 2c_2 = \dfrac13$`, why: String.raw`Differentiating $c_2x^2$ twice gives $2c_2$.` },
            { do: String.raw`$K = \dfrac13$`, why: String.raw`The largest value of $|g''|$ on $[0, 2]$.` },
          ] },
        { label: '(d)', prompt: 'Give the resulting error bound for $T_4$.', kind: 'numeric', answer: '1/72', tol: 1e-2,
          hints: ['Trapezoid bound with $K$ from (c).', String.raw`$\dfrac{K(b-a)^3}{12n^2}$ with $b - a = 2$, $n = 4$.`, String.raw`$\dfrac{\frac13\cdot 8}{12\cdot 16}$.`],
          walkthrough: [
            { do: String.raw`$|E_T| \le \dfrac{\frac13\cdot 2^3}{12\cdot 4^2}$`, why: 'Insert $K = \\frac13$, $b - a = 2$, $n = 4$.' },
            { do: String.raw`$= \dfrac{8/3}{192} = \dfrac{8}{576}$`, why: String.raw`$12\cdot 16 = 192$; dividing by $192$ is multiplying the denominator $3$ by $192$.` },
            { do: String.raw`$= \dfrac{1}{72} \approx 0.0139$`, why: 'Cancel 8.' },
          ] },
        { label: '(e)', prompt: String.raw`Compute the actual error $I - T_4$ with <code>integral</code>.`, kind: 'numeric', answer: 'integral(@(x) (1-exp(-x))./x, 0, 2) - 0.25*(1 + 2*((1-exp(-0.5))/0.5 + (1-exp(-1)) + (1-exp(-1.5))/1.5) + (1-exp(-2))/2)', tol: 1e-4,
          hints: [String.raw`Error = exact minus approximation.`, String.raw`<code>I = integral(@(x) (1-exp(-x))./x, 0, 2)</code> — it does not evaluate at exactly $0$.`, String.raw`$I \approx 1.319263$; subtract $T_4$ from (b).`],
          walkthrough: [
            { do: String.raw`<code>I = integral(@(x) (1-exp(-x))./x, 0, 2)</code> $= 1.319263$`, why: 'Numerical value of the exact integral.' },
            { do: String.raw`$I - T_4 = 1.319263 - 1.326569$`, why: 'Exact minus approximation.' },
            { do: String.raw`$= -0.00731$`, why: String.raw`Within the bound $0.0139$; negative because $g$ is convex ($T_4$ too big).` },
          ] },
        { label: '(f)', prompt: String.raw`Smallest $n$ for which the bound guarantees $|E_T| \le 10^{-6}$.`, kind: 'numeric', answer: '472', tol: 1e-9,
          hints: ['Set the bound $\\le 10^{-6}$ and solve for $n$.', String.raw`$\frac{\frac13\cdot 8}{12n^2} \le 10^{-6}$.`, String.raw`$n^2 \ge \frac{8/3}{12\cdot10^{-6}} = 222\,222.2$.`],
          walkthrough: [
            { do: String.raw`$\dfrac{8/3}{12n^2} \le 10^{-6}$`, why: String.raw`$K(b-a)^3 = \frac13\cdot 8$.` },
            { do: String.raw`$n^2 \ge \dfrac{8/3}{12\cdot10^{-6}} = 222\,222.2$`, why: String.raw`Solve for $n^2$.` },
            { do: String.raw`$n \ge 471.4 \;\Rightarrow\; n = 472$`, why: 'Square root, round up.' },
          ] },
        { label: '(g)', prompt: 'Write the complete solution as a Live Script, including the plot from which you read $K$.', kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 4 (Attempted)' },
        { type: 'text', content: String.raw`The integrand has a removable singularity at $x = 0$. Since $1 - e^{-x} = x - \frac{x^2}{2} + \frac{x^3}{6} - \dots$, we have` },
        { type: 'equation', content: String.raw`g(x) = 1 - \frac{x}{2} + \frac{x^2}{6} - \dots \quad\Rightarrow\quad g(0) = 1,\quad g''(0) = \frac{1}{3} .` },
        { type: 'text', content: String.raw`We apply the trapezoid rule with $n = 4$, $\Delta x = 0.5$:` },
        { type: 'equation', content: String.raw`T_4 = \frac{0.5}{2}\Big(g(0) + 2g(0.5) + 2g(1) + 2g(1.5) + g(2)\Big).` },
        { type: 'code', content: String.raw`g = @(x) (1 - exp(-x))./x;
x = linspace(0, 2, 5);
y = g(x); y(x == 0) = 1;          % removable singularity
T4 = trapz(x, y)` },
        { type: 'text', content: String.raw`To bound the error we plot $|g''|$, using the formula given in the problem. The formula cannot be evaluated at $0$, so we start at $0.01$ and use $g''(0) = \frac13$ from the series.` },
        { type: 'code', content: String.raw`d2g = @(x) (2 - 2*exp(-x) - 2*x.*exp(-x) - x.^2.*exp(-x))./x.^3;
fplot(@(x) abs(d2g(x)), [0.01 2]), grid on
title('|g''''(x)|')` },
        { type: 'text', content: String.raw`The plot decreases from $\frac13$ at $x = 0$, so we take $K = \frac13$ and obtain` },
        { type: 'equation', content: String.raw`|E_T| \le \frac{K(b-a)^3}{12n^2} = \frac{\frac13\cdot 2^3}{12\cdot 4^2} = \frac{1}{72} \approx 0.0139 .` },
        { type: 'text', content: 'We compare with the actual error and compute the $n$ required for an error below $10^{-6}$:' },
        { type: 'code', content: String.raw`I = integral(g, 0, 2);
fprintf('T4 = %.6f, I = %.6f, error = %.2e, bound = %.2e\n', T4, I, I - T4, 1/72)
n = ceil(sqrt((1/3)*2^3/(12*1e-6)))` },
        { type: 'text', content: String.raw`The actual error $-0.0073$ is within the bound $0.0139$; it is negative because $g$ is convex. The bound guarantees six-decimal accuracy with $n = 472$ subintervals.` },
      ],
    },
    {
      id: 'a5',
      title: 'Capstone B — an elliptical arch and a barrel',
      difficulty: 'exam',
      hw: 'HW1-style',
      examples: ['capstone-review'],
      statement: String.raw`<p>A footbridge has an elliptical arch $x = 20\cos t$, $y = 8\sin t$ (metres), $0 \le t \le \pi$, and a rain barrel is shaped by rotating $r(x) = 0.3 - 0.4x^2$, $-0.5 \le x \le 0.5$ (metres), about the $x$-axis.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Set up the length of the arch and evaluate it with <code>integral</code> (m).`, kind: 'numeric', answer: 'integral(@(t) sqrt(400*sin(t).^2 + 64*cos(t).^2), 0, pi)', tol: 1e-5,
          hints: ['Parametric arc length, exactly as in the half-ellipse example.', String.raw`$x'(t) = -20\sin t$, $y'(t) = 8\cos t$.`, String.raw`$L = \int_0^\pi\sqrt{400\sin^2 t + 64\cos^2 t}\,\mathrm d t$; evaluate with <code>integral(@(t) sqrt(400*sin(t).^2 + 64*cos(t).^2), 0, pi)</code>.`],
          walkthrough: [
            { do: String.raw`$x'(t) = -20\sin t,\quad y'(t) = 8\cos t$`, why: String.raw`Differentiate $20\cos t$ and $8\sin t$.` },
            { do: String.raw`$x'^2 + y'^2 = 400\sin^2 t + 64\cos^2 t$`, why: 'Square each.' },
            { do: String.raw`$L = \displaystyle\int_0^{\pi}\sqrt{400\sin^2 t + 64\cos^2 t}\,\mathrm d t$`, why: 'Arc-length formula.' },
            { do: String.raw`<code>integral(@(t) sqrt(400*sin(t).^2 + 64*cos(t).^2), 0, pi)</code> $\approx 46.026$ m`, why: 'No elementary antiderivative, so numerically. Check: between $8\\pi \\approx 25.1$ and $20\\pi \\approx 62.8$.' },
          ] },
        { label: '(b)', prompt: String.raw`Compute the volume of the barrel exactly (m³).`, kind: 'numeric', answer: '0.072*pi', tol: 1e-6,
          hints: ['Disk method, as in the worked volume example.', String.raw`$V = \pi\int_{-0.5}^{0.5}(0.3 - 0.4x^2)^2\,\mathrm d x$; expand the square.`, String.raw`$(0.3 - 0.4x^2)^2 = 0.09 - 0.24x^2 + 0.16x^4$; use $\int_{-0.5}^{0.5}x^2 = \frac1{12}$ and $\int_{-0.5}^{0.5}x^4 = \frac1{80}$.`],
          walkthrough: [
            { do: String.raw`$V = \pi\displaystyle\int_{-0.5}^{0.5}\left(0.3 - 0.4x^2\right)^2\mathrm d x$`, why: 'Disk method.' },
            { do: String.raw`$\left(0.3 - 0.4x^2\right)^2 = 0.09 - 0.24x^2 + 0.16x^4$`, why: String.raw`$p^2 - 2pq\,x^2 + q^2x^4$ with $p = 0.3$, $q = 0.4$.` },
            { do: String.raw`$\displaystyle\int_{-0.5}^{0.5}1\,\mathrm d x = 1,\ \int_{-0.5}^{0.5}x^2\,\mathrm d x = \frac{1}{12},\ \int_{-0.5}^{0.5}x^4\,\mathrm d x = \frac{1}{80}$`, why: String.raw`E.g. $\left[\frac{x^3}{3}\right]_{-0.5}^{0.5} = \frac{0.125}{3}\cdot 2 = \frac1{12}$.` },
            { do: String.raw`$V = \pi\left(0.09 - \dfrac{0.24}{12} + \dfrac{0.16}{80}\right) = \pi(0.09 - 0.02 + 0.002)$`, why: 'Integrate term by term.' },
            { do: String.raw`$V = 0.072\pi \approx 0.2262$ m³`, why: 'About 226 litres.' },
          ] },
        { label: '(c)', prompt: String.raw`Check (b) with the trapezoid rule using <code>trapz</code> and 11 points. Which statement is right?`, kind: 'choice', choices: ['The trapezoid value is exact, since the integrand is a polynomial.', String.raw`The trapezoid value differs in the third significant digit; doubling the points reduces the difference about fourfold.`, 'The trapezoid value is far off because of the singularity.', 'trapz cannot be used for volumes.'], answer: 1,
          hints: ['The trapezoid rule is exact only for straight lines. What degree is the integrand?', 'Compare the last steps of the worked volume example: what happened when the number of strips doubled?'],
          solution: String.raw`The integrand $\pi(0.3 - 0.4x^2)^2$ is a quartic, so neither the trapezoid rule nor Simpson's rule is exact; the trapezoid error decreases like $1/n^2$.` },
        { label: '(d)', prompt: 'Write a Live Script solution for (a) and (b), including the derivation of the integrands and the numerical checks.', kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'heading2', content: 'Arch length' },
        { type: 'text', content: String.raw`We use the parametric arc-length formula. With $x'(t) = -20\sin t$ and $y'(t) = 8\cos t$,` },
        { type: 'equation', content: String.raw`L = \int_0^{\pi}\sqrt{x'(t)^2 + y'(t)^2}\,\mathrm d t = \int_0^{\pi}\sqrt{400\sin^2 t + 64\cos^2 t}\,\mathrm d t .` },
        { type: 'text', content: 'This is an elliptic integral without an elementary antiderivative, so we evaluate it numerically:' },
        { type: 'code', content: String.raw`L = integral(@(t) sqrt(400*sin(t).^2 + 64*cos(t).^2), 0, pi);
fprintf('L = %.4f m\n', L)` },
        { type: 'text', content: String.raw`The arch is about $46.03$ m long, between the half-circumferences $8\pi \approx 25.1$ and $20\pi \approx 62.8$ of the circles with radii 8 and 20, as expected.` },
        { type: 'heading2', content: 'Barrel volume' },
        { type: 'text', content: 'We use the disk method. A slice at $x$ is a disk of radius $r(x)$:' },
        { type: 'equation', content: String.raw`V = \pi\int_{-0.5}^{0.5}\left(0.3 - 0.4x^2\right)^2\mathrm d x = 2\pi\int_0^{0.5}\left(0.09 - 0.24x^2 + 0.16x^4\right)\mathrm d x = 2\pi\left(0.045 - 0.01 + 0.001\right) = 0.072\pi .` },
        { type: 'code', content: String.raw`V = 0.072*pi
Vnum = integral(@(x) pi*(0.3 - 0.4*x.^2).^2, -0.5, 0.5)
x = linspace(-0.5, 0.5, 11);
Vtrap = trapz(x, pi*(0.3 - 0.4*x.^2).^2)` },
        { type: 'text', content: String.raw`The volume is $0.072\pi \approx 0.2262\ \mathrm{m^3}$ (226 litres); `+'`integral`'+String.raw` agrees, and the 10-interval trapezoid value is close but not exact.` },
      ],
    },
  ],
};
