// Module 11: Numerical integration and error bounds

export default {
  id: 'numerical',
  number: 11,
  part: 'applications',
  hw: 'HW1',
  title: 'Numerical integration and error bounds',
  summary: 'Midpoint, trapezoid and Simpson rules, how fast their errors shrink, the error bounds with K = max|f″| (or max|f⁗|), estimating K from a plot, choosing n for a tolerance and integrands with a removable singularity — ending with a Homework-1-style capstone.',
  intro: String.raw`<p>Most integrals met in engineering — arc lengths, $\int e^{-x^2}\mathrm dx$, $\int \frac{\sin x}{x}\,\mathrm dx$ — have no elementary antiderivative. Numerical rules replace $f$ by simple pieces (constants, lines, parabolas) whose areas are easy. The real skill is to say <b>how accurate</b> the answer is: the error bounds turn a plot of $f''$ into a guarantee. This module closes the Applications part with a Homework-1-style capstone.</p>`,
  lessons: [
    {
      id: 'midpoint-trapezoid',
      title: 'Midpoint and trapezoid rules',
      blocks: [
        { type: 'text', html: String.raw`<p>Divide $[a, b]$ into $n$ subintervals of width $\Delta x = (b - a)/n$ with nodes $x_k = a + k\,\Delta x$. The <b>trapezoid rule</b> joins neighbouring points of the graph by straight lines; the <b>midpoint rule</b> uses rectangles with height $f$ at the midpoint $\bar x_k$. Switch between the rules and increase $n$.</p>` },
        { type: 'widget', name: 'riemann', config: {
          title: 'Trapezoids under y = exp(-x^2) on [0, 2]',
          f: 'exp(-x.^2)', a: 0, b: 2, n: 4, method: 'trap', nmax: 40, xlim: [-0.2, 2.2], ylim: [-0.1, 1.15],
        } },
        { type: 'callout', kind: 'def', title: 'The two rules', html: String.raw`$$T_n = \frac{\Delta x}{2}\Big(f(x_0) + 2f(x_1) + 2f(x_2) + \dots + 2f(x_{n-1}) + f(x_n)\Big),$$$$M_n = \Delta x\Big(f(\bar x_1) + f(\bar x_2) + \dots + f(\bar x_n)\Big),\qquad \bar x_k = \tfrac12\left(x_{k-1} + x_k\right).$$<p>$T_n$ is the average of the left and right Riemann sums: interior nodes get weight 2, the end points weight 1.</p>` },
        { type: 'text', html: String.raw`<p>Where the graph is <b>convex</b> ($f'' > 0$) every chord lies above the curve, so $T_n$ overestimates; the midpoint rectangle has the same area as the tangent-line trapezoid at the midpoint, which lies below the curve, so $M_n$ underestimates. For concave $f$ both inequalities reverse. Typically $|E_M| \approx \tfrac12 |E_T|$ with opposite sign.</p>` },
        { type: 'text', html: String.raw`<p><b>Example.</b> We compute $T_4$ and $M_4$ for $\int_1^2 \frac{\mathrm d x}{x} = \ln 2 \approx 0.693147$. With $\Delta x = 0.25$ the nodes are $1, 1.25, 1.5, 1.75, 2$ with values $1,\ 0.8,\ 0.666667,\ 0.571429,\ 0.5$; the midpoints are $1.125, 1.375, 1.625, 1.875$.</p>` },
        { type: 'derive', title: String.raw`Example: $T_4$ and $M_4$ for $\int_1^2 \frac{\mathrm d x}{x}$`, colors: { e: 1, i: 2, m: 3 }, steps: [
          { kind: 'sub', label: 'Put the node values into the trapezoid rule',
            from: String.raw`T_4=\frac{\Delta x}{2}\Big(\T{e-1}{f(x_0)}+2\big(\T{i-1}{f(x_1)+f(x_2)+f(x_3)}\big)+\T{e-2}{f(x_4)}\Big)`,
            to: String.raw`T_4=\frac{0.25}{2}\Big(\T{e-1}{1}+2\big(\T{i-1}{0.8+0.666667+0.571429}\big)+\T{e-2}{0.5}\Big)`, arrows: { 'e-1': 'f(1)', 'i-1': 'interior nodes', 'e-2': 'f(2)' },
            why: String.raw`End points get weight $1$, interior nodes weight $2$.` },
          { kind: 'calc', label: 'Add the interior values',
            to: String.raw`T_4=0.125\,\big(\T{e-1}{1}+2\cdot\T{i-2}{2.038096}+\T{e-2}{0.5}\big)`, map: { 'i-1': ['i-2'] },
            why: String.raw`$\frac{0.25}{2}=0.125$.` },
          { kind: 'calc', label: 'Multiply out',
            to: String.raw`T_4=0.125\cdot\T{T-1}{5.576192}=0.697024`, map: { 'e-1': ['T-1'], 'i-2': ['T-1'], 'e-2': ['T-1'] },
            why: String.raw`$1+4.076192+0.5=5.576192$.` },
          { kind: 'sub', label: 'Put the midpoint values into the midpoint rule',
            from: String.raw`M_4=\Delta x\,\big(\T{m-1}{f(1.125)+f(1.375)+f(1.625)+f(1.875)}\big)`,
            to: String.raw`M_4=0.25\,\big(\T{m-1}{0.888889+0.727273+0.615385+0.533333}\big)`, arrows: { 'm-1': 'f = 1/x at the midpoints' },
            why: String.raw`Each rectangle has height $f$ at the midpoint of its subinterval.` },
          { kind: 'calc', label: 'Add and multiply',
            to: String.raw`M_4=0.25\cdot\T{m-2}{2.764880}=0.691220`, map: { 'm-1': ['m-2'] },
            why: String.raw`All four rectangles have the same width $0.25$.` },
          { kind: 'calc', label: String.raw`Compare with $\ln 2$`,
            from: String.raw`E_T=\ln 2-T_4,\qquad E_M=\ln 2-M_4`,
            to: String.raw`E_T\approx 0.693147-0.697024=-0.00388,\qquad E_M\approx 0.693147-0.691220=+0.00193`,
            why: String.raw`The error is exact value minus approximation.` },
          { kind: 'result', label: 'Opposite signs, half the size',
            to: String.raw`T_4>\ln 2>M_4,\qquad |E_M|\approx\tfrac12|E_T|`,
            why: String.raw`$1/x$ is convex, so $T_4$ is too large and $M_4$ too small, exactly as the picture predicts.` },
        ] },
        { type: 'quiz', question: String.raw`$f$ is concave on $[a, b]$. Which ordering is correct?`, choices: [String.raw`$T_n \le \int_a^b f \le M_n$`, String.raw`$M_n \le \int_a^b f \le T_n$`, String.raw`$T_n \le M_n \le \int_a^b f$`, 'Nothing can be said without computing.'], answer: 0, explain: String.raw`For concave $f$ the chords lie below the graph ($T_n$ too small) and the tangent lines above it ($M_n$ too large).` },
      ],
    },
    {
      id: 'simpson',
      title: "Simpson's rule and orders of convergence",
      blocks: [
        { type: 'text', html: String.raw`<p><b>Simpson's rule</b> fits a parabola through each pair of neighbouring subintervals (so $n$ must be even). Parabolas follow a curved graph much better than lines: watch the error in the readout.</p>` },
        { type: 'widget', name: 'riemann', config: {
          title: "Simpson's rule: parabolic arcs over pairs of subintervals",
          f: 'exp(-x.^2)', a: 0, b: 2, n: 4, method: 'simpson', nmax: 40, xlim: [-0.2, 2.2], ylim: [-0.1, 1.15],
        } },
        { type: 'callout', kind: 'def', title: "Simpson's rule ($n$ even)", html: String.raw`$$S_n = \frac{\Delta x}{3}\Big(f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \dots + 2f(x_{n-2}) + 4f(x_{n-1}) + f(x_n)\Big).$$<p>The weights follow the pattern $1, 4, 2, 4, \dots, 2, 4, 1$. Equivalently, $S_{2n} = \tfrac13 T_n + \tfrac23 M_n$: Simpson is the weighted average that cancels the leading errors of $T$ and $M$.</p>` },
        { type: 'text', html: String.raw`<p>The log–log plot below shows the error against $n$ for $\int_0^2 e^{-x^2}\,\mathrm d x$. A straight line of slope $-p$ means $|E| \approx C/n^p$: doubling $n$ divides the error by $2^p$.</p>` },
        { type: 'widget', name: 'convergence', config: { title: 'Error vs n (log-log)', f: 'exp(-x.^2)', a: 0, b: 2, methods: ['trap', 'mid', 'simpson'] } },
        { type: 'table', head: ['Rule', 'Error behaves like', 'Doubling $n$ divides the error by', 'Exact for'], rows: [
          ['Midpoint $M_n$', String.raw`$C/n^2$`, '4', 'lines'],
          ['Trapezoid $T_n$', String.raw`$C/n^2$`, '4', 'lines'],
          ["Simpson $S_n$", String.raw`$C/n^4$`, '16', 'cubics'],
        ] },
        { type: 'derive', title: String.raw`Example: $S_4$ for $\int_1^2 \frac{\mathrm d x}{x}$`, colors: { f: 1, S: 2 }, steps: [
          { kind: 'sub', label: 'Put the node values into the weights 1, 4, 2, 4, 1',
            from: String.raw`S_4=\frac{\Delta x}{3}\Big(\T{f-0}{f_0}+4\T{f-1}{f_1}+2\T{f-2}{f_2}+4\T{f-3}{f_3}+\T{f-4}{f_4}\Big)`,
            to: String.raw`S_4=\frac{0.25}{3}\Big(\T{f-0}{1}+4(\T{f-1}{0.8})+2(\T{f-2}{0.666667})+4(\T{f-3}{0.571429})+\T{f-4}{0.5}\Big)`, arrows: { 'f-0': '', 'f-1': '', 'f-2': '', 'f-3': '', 'f-4': '' },
            why: String.raw`The same five values as for $T_4$, with $\Delta x = 0.25$.` },
          { kind: 'calc', label: 'Weight and add',
            to: String.raw`S_4=\frac{0.25}{3}\cdot\T{S-1}{8.319048}`, map: { 'f-0': ['S-1'], 'f-1': ['S-1'], 'f-2': ['S-1'], 'f-3': ['S-1'], 'f-4': ['S-1'] },
            why: String.raw`$1+3.2+1.333333+2.285714+0.5$.` },
          { kind: 'calc', label: String.raw`$\times\frac{0.25}{3}$`,
            to: String.raw`S_4=\T{S-2}{0.693254}`, map: { 'S-1': ['S-2'] },
            why: String.raw`$0.25\cdot 8.319048=2.079762$, divided by $3$.` },
          { kind: 'calc', label: String.raw`Error against $\ln 2$`,
            from: String.raw`\ln 2-\T{S-2}{S_4}`,
            to: String.raw`0.693147-\T{S-2}{0.693254}\approx -1.1\cdot 10^{-4}`,
            why: String.raw`About 35 times smaller than the error of $T_4$, with the same five function values.` },
          { kind: 'check', label: String.raw`Check: $\tfrac13 T_2 + \tfrac23 M_2$`,
            from: String.raw`\tfrac13 T_2+\tfrac23 M_2,\qquad T_2=0.708333,\ M_2=0.685714`,
            to: String.raw`\tfrac13(0.708333)+\tfrac23(0.685714)=0.236111+0.457143=0.693254=S_4\ \checkmark`,
            why: String.raw`$S_4$ uses the nodes of $T_2$ ($1, 1.5, 2$) and the midpoints of $M_2$ ($1.25, 1.75$), so the weighted average reproduces it.` },
        ] },
        { type: 'quiz', question: String.raw`With $n = 10$ the trapezoid error is $3.2\cdot10^{-3}$ and the Simpson error is $6.4\cdot10^{-6}$. What do you expect with $n = 20$?`, choices: [String.raw`$1.6\cdot10^{-3}$ and $3.2\cdot10^{-6}$`, String.raw`$8\cdot10^{-4}$ and $4\cdot10^{-7}$`, String.raw`$8\cdot10^{-4}$ and $1.6\cdot10^{-6}$`, String.raw`$4\cdot10^{-4}$ and $4\cdot10^{-7}$`], answer: 1, explain: String.raw`Trapezoid: divide by $2^2 = 4$. Simpson: divide by $2^4 = 16$.` },
      ],
    },
    {
      id: 'error-bounds',
      title: 'Error bounds and choosing n',
      blocks: [
        { type: 'text', html: String.raw`<p>Estimates like "the error drops by 4" need a reference value. An <b>error bound</b> needs none: it guarantees the accuracy from the size of a derivative of $f$.</p>` },
        { type: 'callout', kind: 'thm', title: 'Error bounds', html: String.raw`<p>If $|f''(x)| \le K$ on $[a, b]$, then</p>$$|E_T| \le \frac{K(b-a)^3}{12\,n^2}, \qquad |E_M| \le \frac{K(b-a)^3}{24\,n^2}.$$<p>If $|f^{(4)}(x)| \le K$ on $[a, b]$, then</p>$$|E_S| \le \frac{K(b-a)^5}{180\,n^4}.$$` },
        { type: 'text', html: String.raw`<p>The hard part is $K$. Compute $f''$ by hand, then <b>plot $|f''|$</b> on $[a, b]$ and read off its maximum (any larger number is also a valid $K$, just a weaker bound). For $f(x) = e^{-x^2}$ on $[0, 2]$: $f''(x) = (4x^2 - 2)e^{-x^2}$, and the plot shows $|f''| \le 2$, attained at $x = 0$. The readout evaluates the trapezoid bound for the chosen $n$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: '|f″| for f = exp(-x^2) on [0, 2]: K = 2',
          functions: [{ expr: 'abs((4*x.^2-2).*exp(-x.^2))', label: "$|f''(x)|$" }, { expr: '(4*x.^2-2).*exp(-x.^2)', label: "$f''(x)$", dash: true }],
          params: { n: { min: 2, max: 200, value: 10, step: 1, label: '$n$' } },
          hlines: [2], xlim: [-0.1, 2.1], ylim: [-2.3, 2.5],
          readout: String.raw`With $K = 2$, $b - a = 2$: $|E_T| \le \dfrac{2\cdot 2^3}{12 n^2} = {{16/(12*n.^2)}}$ and $|E_M| \le {{16/(24*n.^2)}}$.`,
        } },
        { type: 'text', html: String.raw`<p>To choose $n$ for a tolerance $\varepsilon$, solve the bound for $n$. First in general, for the trapezoid rule:</p>` },
        { type: 'derive', symbolic: true, title: String.raw`Solving the trapezoid bound for $n$`, colors: { K: 1, ba: 2, n: 3, e: 4, q: 5 }, steps: [
          { kind: 'both', label: String.raw`Both sides $\times n^2$`,
            from: String.raw`\frac{\T{K-1}{K}\,\T{ba-1}{(b-a)^3}}{12\,\T{n-1}{n^2}}\le\T{e-1}{\varepsilon}`,
            to: String.raw`\frac{\T{K-1}{K}\,\T{ba-1}{(b-a)^3}}{12}\le\T{e-1}{\varepsilon}\,\T{n-1}{n^2}`, arrows: { 'n-1': '× n² on both sides' },
            why: String.raw`We want the bound to be at most $\varepsilon$. Multiplying by $n^2 > 0$ cancels it on the left and keeps the direction of $\le$.` },
          { kind: 'both', label: String.raw`Both sides $\div\varepsilon$`,
            to: String.raw`\frac{\T{K-1}{K}\,\T{ba-1}{(b-a)^3}}{12\,\T{e-1}{\varepsilon}}\le\T{n-1}{n^2}`, arrows: { 'e-1': '÷ ε on both sides' },
            why: String.raw`$\varepsilon > 0$, so dividing keeps the direction of $\le$.` },
          { kind: 'both', label: 'Square root of both sides',
            to: String.raw`\T{n-1}{n}\ge\sqrt{\frac{\T{K-1}{K}\,\T{ba-1}{(b-a)^3}}{12\,\T{e-1}{\varepsilon}}}`, arrows: { 'n-1': 'read from the other side' },
            why: String.raw`Both sides are positive and the square root is increasing, so the inequality survives. We read it from right to left, so $\le$ becomes $\ge$.` },
          { kind: 'result', label: 'Round up to a whole number',
            to: String.raw`\T{n-1}{n}=\left\lceil\sqrt{\frac{\T{K-1}{K}\,\T{ba-1}{(b-a)^3}}{12\,\T{e-1}{\varepsilon}}}\,\right\rceil`,
            why: String.raw`$n$ counts subintervals, so we take the smallest integer at or above the root. In MATLAB: <code>ceil(sqrt(K*(b-a)^3/(12*tol)))</code>.` },
        ] },
        { type: 'derive', title: String.raw`With numbers: $\int_1^2 \frac{\mathrm d x}{x}$ with error below $10^{-6}$`, given: String.raw`\T{K-0}{K}=2\ \ (f''=2/x^3\text{ at }x=1),\quad \T{ba-0}{b-a}=1,\quad \T{e-0}{\varepsilon}=10^{-6}`, colors: { K: 1, ba: 2, n: 3, e: 4, q: 5 }, steps: [
          { kind: 'sub', label: 'Put the given values into the formula',
            from: String.raw`n\ge\sqrt{\frac{\T{K-x}{K}\,\T{ba-x}{(b-a)}^3}{12\,\T{e-x}{\varepsilon}}}\qquad K=\T{K-1}{2},\ \ b-a=\T{ba-1}{1},\ \ \varepsilon=\T{e-1}{10^{-6}}`,
            to: String.raw`n\ge\sqrt{\frac{\T{K-1}{2}\cdot\T{ba-1}{1}^3}{12\cdot\T{e-1}{10^{-6}}}}`, arrows: { 'K-1': 'K = 2', 'ba-1': 'b − a = 1', 'e-1': 'ε = 10⁻⁶' },
            why: String.raw`$f''(x)=2/x^3$ decreases on $[1, 2]$, so its largest value is $2$ at $x=1$.` },
          { kind: 'calc', label: String.raw`$\frac{2}{12}=\frac16$, and $\div 10^{-6}$ means $\times 10^6$`,
            to: String.raw`n\ge\sqrt{\T{q-1}{\frac{10^6}{6}}}`, map: { 'K-1': ['q-1'], 'ba-1': ['q-1'], 'e-1': ['q-1'] },
            why: String.raw`Dividing by a millionth is multiplying by a million.` },
          { kind: 'calc', label: String.raw`$\sqrt{166\,667}$`,
            to: String.raw`n\ge\T{q-2}{408.2}\quad\Rightarrow\quad n=409`, map: { 'q-1': ['q-2'] },
            why: String.raw`Round up: $408$ subintervals would be slightly too few.` },
          { kind: 'check', label: 'Put the answer back into the bound',
            from: String.raw`\frac{2\cdot 1^3}{12\cdot 409^2}`,
            to: String.raw`\frac{2}{12\cdot 167\,281}\approx 9.96\cdot 10^{-7}\le 10^{-6}\ \checkmark`,
            why: String.raw`With $n=408$ the bound is $1.001\cdot 10^{-6}$, just too big, so $409$ is the smallest $n$ that works.` },
        ] },
        { type: 'derive', title: 'The same tolerance with the midpoint and Simpson rules', given: String.raw`K_2=2,\quad K_4=24\ \ (f^{(4)}=24/x^5\text{ at }x=1),\quad b-a=1`, steps: [
          { kind: 'both', label: String.raw`Midpoint: both sides $\times n^2 \div 10^{-6}$`,
            from: String.raw`\frac{2\cdot 1^3}{24\,n^2}\le 10^{-6}`,
            to: String.raw`n^2\ge\frac{2\cdot 10^6}{24}\approx 83\,333`,
            why: String.raw`The same two operations as in the general derivation; the midpoint bound has $24$ instead of $12$.` },
          { kind: 'result', label: 'Square root, round up',
            to: String.raw`n\ge 288.7\quad\Rightarrow\quad n=289`,
            why: String.raw`Half the constant of the trapezoid bound, so about $\sqrt2$ times fewer subintervals.` },
          { kind: 'both', label: String.raw`Simpson: both sides $\times n^4 \div 10^{-6}$`,
            from: String.raw`\frac{24\cdot 1^5}{180\,n^4}\le 10^{-6}`,
            to: String.raw`n^4\ge\frac{24\cdot 10^6}{180}\approx 133\,333`,
            why: String.raw`Simpson's bound has $n^4$ and $(b-a)^5$.` },
          { kind: 'calc', label: 'Fourth root',
            to: String.raw`n\ge\sqrt[4]{133\,333}\approx 19.1`,
            why: String.raw`Take the square root twice.` },
          { kind: 'result', label: 'Next even integer',
            to: String.raw`n=20`,
            why: String.raw`Simpson needs an even $n$. Twenty function evaluations instead of four hundred.` },
        ] },
        { type: 'callout', kind: 'warn', title: 'Removable singularities', html: String.raw`<p>$f(x) = \dfrac{\sin x}{x}$ is undefined at $x = 0$, but $\lim_{x\to 0}\frac{\sin x}{x} = 1$. Defining $f(0) = 1$ makes $f$ smooth (its Taylor series is $1 - \frac{x^2}{6} + \frac{x^4}{120} - \dots$), so the rules and the error bounds apply. In MATLAB, <code>sin(0)/0</code> is <code>NaN</code> and poisons the whole sum: overwrite that value with the limit, <code>y(x == 0) = 1</code>. Formulas for $f''$ have the same problem at $0$; plot them on $[10^{-2}, b]$ and use the series to get the value at $0$.</p>` },
        { type: 'quiz', question: String.raw`For a trapezoid estimate with $K = 0.5$ on $[0, 3]$, which $n$ is the smallest that guarantees $|E_T| \le 10^{-3}$?`, choices: ['$n = 34$', '$n = 33$', '$n = 24$', '$n = 1125$'], answer: 0, explain: String.raw`$\frac{0.5\cdot 27}{12n^2} \le 10^{-3}$ gives $n^2 \ge 1125$, $n \ge 33.54$, so $n = 34$.` },
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
  assignments: [
    {
      id: 'a1',
      title: 'Three rules by hand',
      difficulty: 'core',
      statement: String.raw`<p>Approximate $\displaystyle\int_0^1 \frac{\mathrm d x}{1 + x^2} = \frac{\pi}{4}$ with $n = 4$ subintervals. Give at least six significant digits (you may type MATLAB expressions such as <code>0.125*(1 + ...)</code>).</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$T_4$`, kind: 'numeric', answer: '0.125*(1 + 2*(16/17 + 0.8 + 0.64) + 0.5)', tol: 1e-6, solution: String.raw`Node values $1, \frac{16}{17}, 0.8, 0.64, 0.5$. $T_4 = \frac{0.25}{2}\big(1 + 2(0.941176 + 0.8 + 0.64) + 0.5\big) = 0.782794$.` },
        { label: '(b)', prompt: String.raw`$M_4$`, kind: 'numeric', answer: '0.25*(64/65 + 64/73 + 64/89 + 64/113)', tol: 1e-6, solution: String.raw`Midpoints $\frac18, \frac38, \frac58, \frac78$ give $f = \frac{64}{65}, \frac{64}{73}, \frac{64}{89}, \frac{64}{113}$. $M_4 = 0.25\,(0.984615 + 0.876712 + 0.719101 + 0.566372) = 0.786700$.` },
        { label: '(c)', prompt: String.raw`$S_4$`, kind: 'numeric', answer: '0.25/3*(1 + 4*16/17 + 2*0.8 + 4*0.64 + 0.5)', tol: 1e-7, solution: String.raw`$S_4 = \frac{0.25}{3}\big(1 + 4(0.941176) + 2(0.8) + 4(0.64) + 0.5\big) = 0.785392$, error only $6\cdot10^{-6}$.` },
        { label: '(d)', prompt: String.raw`Use your results to approximate $\pi$ as $4S_4$.`, kind: 'numeric', answer: '4*0.25/3*(1 + 4*16/17 + 2*0.8 + 4*0.64 + 0.5)', tol: 1e-7, solution: String.raw`$4S_4 = 3.141569$, correct to about $2.4\cdot10^{-5}$.` },
      ],
    },
    {
      id: 'a2',
      title: 'Error bounds and the number of subintervals',
      difficulty: 'core',
      statement: String.raw`<p>Consider $I = \displaystyle\int_0^1 e^{x^2}\,\mathrm d x$. One computes $f''(x) = (2 + 4x^2)e^{x^2}$ and $f^{(4)}(x) = (12 + 48x^2 + 16x^4)e^{x^2}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Give the smallest valid $K = \max_{[0,1]}|f''(x)|$.`, kind: 'numeric', answer: '6*exp(1)', tol: 1e-6, solution: String.raw`$f''$ is positive and increasing on $[0, 1]$, so $K = f''(1) = 6e \approx 16.31$.` },
        { label: '(b)', prompt: String.raw`Give the trapezoid error bound for $n = 10$.`, kind: 'numeric', answer: '6*exp(1)/1200', tol: 1e-6, solution: [
          { type: 'text', html: String.raw`<p>We put $K = 6e$, $b - a = 1$ and $n = 10$ into the trapezoid bound.</p>` },
          { type: 'derive', colors: { K: 1, ba: 2, n: 3 }, steps: [
            { kind: 'sub', label: 'Put the values into the bound',
              from: String.raw`|E_T|\le\frac{\T{K-x}{K}\,\T{ba-x}{(b-a)}^3}{12\,\T{n-x}{n}^2}\qquad K=\T{K-1}{6e},\ \ b-a=\T{ba-1}{1},\ \ n=\T{n-1}{10}`,
              to: String.raw`|E_T|\le\frac{\T{K-1}{6e}\cdot\T{ba-1}{1}^3}{12\cdot\T{n-1}{10}^2}`, arrows: { 'K-1': 'K = 6e', 'ba-1': 'b − a = 1', 'n-1': 'n = 10' },
              why: String.raw`Each number keeps the colour of the letter it replaces.` },
            { kind: 'result', label: String.raw`$\frac{6}{1200}=\frac{1}{200}$`,
              to: String.raw`|E_T|\le\frac{e}{200}\approx 0.01359`,
              why: String.raw`$12\cdot 100=1200$, and $6$ divides it $200$ times.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`Smallest $n$ that guarantees $|E_T| \le 10^{-4}$.`, kind: 'numeric', answer: '117', tol: 1e-9, solution: [
          { type: 'text', html: String.raw`<p>We require the trapezoid bound to be at most $10^{-4}$ and solve for $n$.</p>` },
          { type: 'derive', colors: { n: 3 }, steps: [
            { kind: 'both', label: String.raw`Both sides $\times n^2 \div 10^{-4}$`,
              from: String.raw`\frac{6e\cdot 1^3}{12\,\T{n-1}{n^2}}\le 10^{-4}`,
              to: String.raw`\T{n-1}{n^2}\ge\frac{6e}{12\cdot 10^{-4}}=5000e\approx 13\,591`, arrows: { 'n-1': '× n², ÷ 10⁻⁴' },
              why: String.raw`Both $n^2$ and $10^{-4}$ are positive, so multiplying and dividing keeps the direction; reading from the other side turns $\le$ into $\ge$.` },
            { kind: 'result', label: 'Square root, round up',
              to: String.raw`\T{n-1}{n}\ge 116.6\quad\Rightarrow\quad n=117`,
              why: String.raw`$n$ must be a whole number of subintervals.` },
          ] },
        ] },
        { label: '(d)', prompt: String.raw`Smallest $n$ that guarantees $|E_M| \le 10^{-4}$.`, kind: 'numeric', answer: '83', tol: 1e-9, solution: [
          { type: 'text', html: String.raw`<p>The same as (c) with the midpoint constant $24$ instead of $12$.</p>` },
          { type: 'derive', colors: { n: 3 }, steps: [
            { kind: 'both', label: String.raw`Both sides $\times n^2 \div 10^{-4}$`,
              from: String.raw`\frac{6e\cdot 1^3}{24\,\T{n-1}{n^2}}\le 10^{-4}`,
              to: String.raw`\T{n-1}{n^2}\ge\frac{6e}{24\cdot 10^{-4}}=2500e\approx 6796`, arrows: { 'n-1': '× n², ÷ 10⁻⁴' },
              why: String.raw`Positive factors keep the direction of the inequality.` },
            { kind: 'result', label: 'Square root, round up',
              to: String.raw`\T{n-1}{n}\ge 82.4\quad\Rightarrow\quad n=83`,
              why: String.raw`Half the constant, so about $\sqrt2$ times fewer subintervals than the trapezoid rule.` },
          ] },
        ] },
        { label: '(e)', prompt: String.raw`Smallest admissible $n$ that guarantees $|E_S| \le 10^{-4}$ for Simpson's rule.`, kind: 'numeric', answer: '12', tol: 1e-9, hint: String.raw`$K_4 = f^{(4)}(1) = 76e$. Remember that $n$ must be even.`, solution: [
          { type: 'text', html: String.raw`<p>$f^{(4)}$ is positive and increasing on $[0, 1]$, so $K_4 = f^{(4)}(1) = 76e$. We solve Simpson's bound for $n$.</p>` },
          { type: 'derive', colors: { n: 3 }, steps: [
            { kind: 'both', label: String.raw`Both sides $\times n^4 \div 10^{-4}$`,
              from: String.raw`\frac{76e\cdot 1^5}{180\,\T{n-1}{n^4}}\le 10^{-4}`,
              to: String.raw`\T{n-1}{n^4}\ge\frac{76e}{180\cdot 10^{-4}}\approx 11\,478`, arrows: { 'n-1': '× n⁴, ÷ 10⁻⁴' },
              why: String.raw`Positive factors keep the direction of the inequality.` },
            { kind: 'calc', label: 'Fourth root',
              to: String.raw`\T{n-1}{n}\ge 10.35`,
              why: String.raw`Take the square root twice.` },
            { kind: 'result', label: 'Next even integer',
              to: String.raw`n=12`,
              why: String.raw`Simpson's rule needs an even $n$, so $11$ is not allowed.` },
          ] },
        ] },
      ],
    },
    {
      id: 'a3',
      title: 'Predicting errors and combining rules',
      difficulty: 'challenge',
      statement: String.raw`<p>Use the orders of convergence instead of the bounds.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`A trapezoid approximation with $n = 10$ has error $2.4\cdot10^{-3}$. Predict the error with $n = 40$.`, kind: 'numeric', answer: '2.4e-3/16', tol: 1e-3, solution: String.raw`Two doublings: divide by $4^2 = 16$, giving $1.5\cdot10^{-4}$.` },
        { label: '(b)', prompt: String.raw`A Simpson approximation with $n = 10$ has error $8\cdot10^{-6}$. Predict the error with $n = 20$.`, kind: 'numeric', answer: '8e-6/16', tol: 1e-3, solution: String.raw`One doubling divides a fourth-order error by $2^4 = 16$: $5\cdot10^{-7}$.` },
        { label: '(c)', prompt: String.raw`For $\int_1^2 \frac{\mathrm d x}{x}$ we found $T_4 = 0.697024$ and $M_4 = 0.691220$. Compute $\frac13 T_4 + \frac23 M_4$.`, kind: 'numeric', answer: '(0.697024 + 2*0.691220)/3', tol: 1e-6, solution: String.raw`$\frac{0.697024 + 1.382440}{3} = 0.693155$, which is $S_8$; its error is only $7\cdot10^{-6}$.` },
        { label: '(d)', prompt: String.raw`Why is $\frac13 T_n + \frac23 M_n$ so much better than $T_n$ or $M_n$?`, kind: 'choice', choices: [String.raw`It uses more function values, nothing else.`, String.raw`$E_M \approx -\frac12 E_T$, so the weighted average cancels the leading $1/n^2$ error terms.`, String.raw`Averaging always halves the error.`, String.raw`Because $1/x$ is convex.`], answer: 1, solution: [
          { type: 'text', html: String.raw`<p>We substitute the observed relation $E_M \approx -\frac12 E_T$ into the error of the weighted average.</p>` },
          { type: 'derive', colors: { M: 1, T: 2 }, steps: [
            { kind: 'sub', label: String.raw`Insert $E_M\approx-\tfrac12E_T$`,
              from: String.raw`\tfrac13E_T+\tfrac23\,\T{M-x}{E_M}\qquad E_M\approx\T{M-1}{-\tfrac12E_T}`,
              to: String.raw`\tfrac13E_T+\tfrac23\left(\T{M-1}{-\tfrac12E_T}\right)`, arrows: { 'M-1': 'E_M ≈ −½E_T' },
              why: String.raw`The midpoint error is about half the trapezoid error, with the opposite sign.` },
            { kind: 'calc', label: String.raw`$\tfrac23\cdot\left(-\tfrac12\right)=-\tfrac13$`,
              to: String.raw`\tfrac13E_T\T{M-1}{-\tfrac13E_T}`,
              why: String.raw`Multiply the fractions.` },
            { kind: 'result', label: 'The leading terms cancel',
              to: String.raw`\approx 0`,
              why: String.raw`The $1/n^2$ errors cancel to leading order; what remains is the much smaller $1/n^4$ term of Simpson's rule.` },
          ] },
        ] },
      ],
    },
    {
      id: 'a4',
      title: 'Capstone A — trapezoid rule with a removable singularity',
      difficulty: 'exam',
      hw: 'HW1-style',
      statement: String.raw`<p>Let $g(x) = \dfrac{1 - e^{-x}}{x}$ for $x \ne 0$ and $I = \displaystyle\int_0^2 g(x)\,\mathrm d x$. One can show</p>$$g''(x) = \frac{2 - 2e^{-x} - 2xe^{-x} - x^2e^{-x}}{x^3}\qquad (x \ne 0).$$`,
      parts: [
        { label: '(a)', prompt: String.raw`Which value must $g(0)$ get so that $g$ is continuous on $[0, 2]$?`, kind: 'numeric', answer: '1', solution: String.raw`$1 - e^{-x} = x - \frac{x^2}{2} + \dots$, so $g(x) = 1 - \frac x2 + \dots \to 1$.` },
        { label: '(b)', prompt: String.raw`Compute the trapezoid approximation $T_4$.`, kind: 'numeric', answer: '0.25*(1 + 2*((1-exp(-0.5))/0.5 + (1-exp(-1)) + (1-exp(-1.5))/1.5) + (1-exp(-2))/2)', tol: 1e-6, solution: String.raw`$\Delta x = 0.5$; values $1,\ 0.786939,\ 0.632121,\ 0.517913,\ 0.432332$. $T_4 = 0.25\big(1 + 2(1.936973) + 0.432332\big) = 1.326569$.` },
        { label: '(c)', prompt: String.raw`Plot $|g''|$ on $[0.01, 2]$. Which $K$ do you read off? (Use the series of $g$ to get the value at $0$.)`, kind: 'numeric', answer: '1/3', tol: 1e-2, solution: String.raw`$|g''|$ decreases from its limit $\frac13$ at $x = 0$ (series $g = 1 - \frac x2 + \frac{x^2}{6} - \dots$, so $g''(0) = \frac13$). Hence $K = \frac13$.` },
        { label: '(d)', prompt: 'Give the resulting error bound for $T_4$.', kind: 'numeric', answer: '1/72', tol: 1e-2, solution: [
          { type: 'text', html: String.raw`<p>We put $K = \frac13$, $b - a = 2$ and $n = 4$ into the trapezoid bound.</p>` },
          { type: 'derive', colors: { K: 1, ba: 2, n: 3 }, steps: [
            { kind: 'sub', label: 'Put the values into the bound',
              from: String.raw`|E_T|\le\frac{\T{K-x}{K}\,\T{ba-x}{(b-a)}^3}{12\,\T{n-x}{n}^2}\qquad K=\T{K-1}{\tfrac13},\ \ b-a=\T{ba-1}{2},\ \ n=\T{n-1}{4}`,
              to: String.raw`|E_T|\le\frac{\T{K-1}{\tfrac13}\cdot\T{ba-1}{2}^3}{12\cdot\T{n-1}{4}^2}`, arrows: { 'K-1': 'K = 1/3', 'ba-1': 'b − a = 2', 'n-1': 'n = 4' },
              why: String.raw`Each number keeps the colour of the letter it replaces.` },
            { kind: 'calc', label: 'Powers',
              to: String.raw`|E_T|\le\frac{\tfrac13\cdot 8}{12\cdot 16}=\frac{8/3}{192}`,
              why: String.raw`$2^3=8$ and $4^2=16$.` },
            { kind: 'result', label: String.raw`$\frac{8}{3\cdot 192}=\frac{8}{576}$`,
              to: String.raw`|E_T|\le\frac{1}{72}\approx 0.0139`,
              why: String.raw`$576\div 8=72$.` },
          ] },
        ] },
        { label: '(e)', prompt: String.raw`Compute the actual error $I - T_4$ with <code>integral</code>.`, kind: 'numeric', answer: 'integral(@(x) (1-exp(-x))./x, 0, 2) - 0.25*(1 + 2*((1-exp(-0.5))/0.5 + (1-exp(-1)) + (1-exp(-1.5))/1.5) + (1-exp(-2))/2)', tol: 1e-4, solution: String.raw`$I \approx 1.319263$, so $I - T_4 \approx -0.00731$: within the bound, and negative because $g$ is convex.` },
        { label: '(f)', prompt: String.raw`Smallest $n$ for which the bound guarantees $|E_T| \le 10^{-6}$.`, kind: 'numeric', answer: '472', tol: 1e-9, solution: [
          { type: 'text', html: String.raw`<p>With $K(b-a)^3 = \frac13\cdot 8 = \frac83$ we require the bound to be at most $10^{-6}$ and solve for $n$.</p>` },
          { type: 'derive', colors: { n: 3 }, steps: [
            { kind: 'both', label: String.raw`Both sides $\times n^2 \div 10^{-6}$`,
              from: String.raw`\frac{8/3}{12\,\T{n-1}{n^2}}\le 10^{-6}`,
              to: String.raw`\T{n-1}{n^2}\ge\frac{8/3}{12\cdot 10^{-6}}\approx 222\,222.2`, arrows: { 'n-1': '× n², ÷ 10⁻⁶' },
              why: String.raw`Positive factors keep the direction of the inequality.` },
            { kind: 'result', label: 'Square root, round up',
              to: String.raw`\T{n-1}{n}\ge 471.4\quad\Rightarrow\quad n=472`,
              why: String.raw`The smallest whole number of subintervals that satisfies the bound.` },
          ] },
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
      statement: String.raw`<p>A footbridge has an elliptical arch $x = 20\cos t$, $y = 8\sin t$ (metres), $0 \le t \le \pi$, and a rain barrel is shaped by rotating $r(x) = 0.3 - 0.4x^2$, $-0.5 \le x \le 0.5$ (metres), about the $x$-axis.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Set up the length of the arch and evaluate it with <code>integral</code> (m).`, kind: 'numeric', answer: 'integral(@(t) sqrt(400*sin(t).^2 + 64*cos(t).^2), 0, pi)', tol: 1e-5, solution: String.raw`$L = \int_0^\pi \sqrt{400\sin^2 t + 64\cos^2 t}\,\mathrm d t \approx 46.026$ m.` },
        { label: '(b)', prompt: String.raw`Compute the volume of the barrel exactly (m³).`, kind: 'numeric', answer: '0.072*pi', tol: 1e-6, solution: [
          { type: 'text', html: String.raw`<p>Each slice is a disk of radius $r(x)$. We put the radius into the disk formula, expand the square and integrate term by term.</p>` },
          { type: 'derive', colors: { r: 1, a: 2, b: 3, c: 4 }, steps: [
            { kind: 'sub', label: 'Put the radius into the disk formula',
              from: String.raw`V=\pi\int_{-0.5}^{0.5}r(x)^2\,\mathrm dx\qquad r(x)=\T{r-1}{0.3-0.4x^2}`,
              to: String.raw`V=\pi\int_{-0.5}^{0.5}\left(\T{r-1}{0.3-0.4x^2}\right)^2\mathrm dx`, arrows: { 'r-1': 'radius' },
              why: String.raw`A slice of thickness $\mathrm dx$ has volume $\pi r(x)^2\,\mathrm dx$.` },
            { kind: 'expand', label: String.raw`$(p-q)^2=p^2-2pq+q^2$`,
              to: String.raw`V=\pi\int_{-0.5}^{0.5}\left(\T{a-1}{0.09}-\T{b-1}{0.24x^2}+\T{c-1}{0.16x^4}\right)\mathrm dx`, map: { 'r-1': ['a-1', 'b-1', 'c-1'] }, arrows: { 'r-1': 'square' },
              why: String.raw`$0.3^2=0.09$, $2\cdot 0.3\cdot 0.4=0.24$, $0.4^2=0.16$.` },
            { kind: 'calculus', label: 'Integrate each term over [−0.5, 0.5]',
              to: String.raw`V=\pi\left(\T{a-2}{0.09}-\T{b-2}{0.02}+\T{c-2}{0.002}\right)`, map: { 'a-1': ['a-2'], 'b-1': ['b-2'], 'c-1': ['c-2'] },
              why: String.raw`$\int 0.09\,\mathrm dx=0.09\cdot 1$; $0.24\big[\frac{x^3}{3}\big]_{-0.5}^{0.5}=0.24\cdot\frac{0.25}{3}=0.02$; $0.16\big[\frac{x^5}{5}\big]_{-0.5}^{0.5}=0.16\cdot 0.0125=0.002$.` },
            { kind: 'result', label: 'Add',
              to: String.raw`V=\T{V-1}{0.072\pi}\approx 0.2262\text{ m}^3`, map: { 'a-2': ['V-1'], 'b-2': ['V-1'], 'c-2': ['V-1'] },
              why: String.raw`About 226 litres.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`Check (b) with the trapezoid rule using <code>trapz</code> and 11 points. Which statement is right?`, kind: 'choice', choices: ['The trapezoid value is exact, since the integrand is a polynomial.', String.raw`The trapezoid value differs in the third significant digit; doubling the points reduces the difference about fourfold.`, 'The trapezoid value is far off because of the singularity.', 'trapz cannot be used for volumes.'], answer: 1, solution: String.raw`The integrand $\pi(0.3 - 0.4x^2)^2$ is a quartic, so neither the trapezoid rule nor Simpson's rule is exact; the trapezoid error decreases like $1/n^2$.` },
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
