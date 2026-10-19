// Module 20: Alternating series, absolute and conditional convergence, ratio and root tests.

export default {
  id: 'alternating',
  number: 20,
  part: 'series',
  hw: 'HW6',
  title: 'Alternating series, absolute convergence, ratio and root tests',
  summary: 'The alternating series test with its three conditions, the remainder bound |R_N| ≤ b_(N+1) and the sign of the remainder, checking "eventually decreasing" with the derivative, absolute versus conditional convergence, and the ratio and root tests.',
  intro: String.raw`<p>When the terms change sign, cancellation can make a series converge even though the sizes of the terms add up to infinity. This module gives the test for alternating series — which also comes with an excellent, easy error bound — and the two tests that handle series with factorials and powers: the ratio and root tests.</p>`,
  lessons: [
    {
      id: 'alternating-test',
      title: 'The alternating series test and its error bound',
      blocks: [
        { type: 'text', html: String.raw`<p>The alternating harmonic series $1 - \tfrac12 + \tfrac13 - \tfrac14 + \cdots$ has partial sums that zig-zag: each step overshoots, then the next one comes back by a smaller amount. The purple band of half-width $b_{N+1}$ (the size of the next term) around $S_N$ always contains the sum $\ln 2$.</p>` },
        { type: 'widget', name: 'series', config: {
          title: 'Alternating harmonic series Σ (−1)^(n+1)/n',
          term: '(-1).^round(n+1)./n', n0: 1, nmax: 40, N: 5, sum: Math.LN2, sumTex: String.raw`\ln 2`, alternating: true,
        } },
        { type: 'callout', kind: 'thm', title: 'Alternating series test (Leibniz)', html: String.raw`<p>Consider $\sum (-1)^{n+1} b_n$ (or $\sum (-1)^n b_n$). If</p><ol><li>$b_n > 0$ for all $n$ (the series really <b>alternates</b>),</li><li>$b_{n+1} \le b_n$ for all $n \ge n_0$ (<b>decreasing</b>, at least eventually),</li><li>$\lim_{n\to\infty} b_n = 0$,</li></ol><p>then the series converges. Moreover, if the conditions hold from $n = N+1$ on, the remainder $R_N = S - S_N$ satisfies</p>$$|R_N| \le b_{N+1},$$<p>and $R_N$ has the <b>same sign as the first omitted term</b> $(-1)^{N+2}b_{N+1}$. So $S$ lies between $S_N$ and $S_{N+1}$.</p>` },
        { type: 'steps', title: String.raw`Example: estimate $\displaystyle S = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n^3}$ with $S_4$`, steps: [
          String.raw`We verify the conditions of the alternating series test with $b_n = 1/n^3$: $b_n > 0$; $b_{n+1} = \frac{1}{(n+1)^3} < \frac1{n^3} = b_n$; and $b_n \to 0$. The series converges.`,
          String.raw`We compute the partial sum: $S_4 = 1 - \tfrac18 + \tfrac1{27} - \tfrac1{64} \approx 0.896412$.`,
          String.raw`The remainder is bounded by the first omitted term: $|R_4| \le b_5 = \tfrac1{125} = 0.008$.`,
          String.raw`The first omitted term $+\tfrac{1}{125}$ is positive, so $R_4 > 0$ and $S_4 < S < S_4 + 0.008$, i.e. $0.896412 < S < 0.904412$. (True value $0.901543\ldots$)`,
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>All three conditions are needed. $\sum (-1)^n \frac{n}{n+1}$ alternates, but $b_n = \frac{n}{n+1} \to 1$: condition 3 fails, and the series diverges by the divergence test. Always write down all three checks — including the sign check $b_n > 0$.</p>` },
        { type: 'quiz', question: String.raw`For $\sum_{n=1}^\infty (-1)^{n+1} b_n$ satisfying the test, $S_6$ is computed. Which is true?`, choices: [String.raw`$S_6 < S \le S_6 + b_7$`, String.raw`$S_6 - b_7 \le S < S_6$`, String.raw`$|S - S_6| \le b_6$ is the best bound`, String.raw`Nothing can be said about the sign`], answer: 0, explain: String.raw`The first omitted term is $(-1)^{8} b_7 = +b_7 > 0$, so $R_6 > 0$ and $0 < R_6 \le b_7$.` },
      ],
    },
    {
      id: 'absolute-conditional',
      title: 'Eventually decreasing; absolute vs conditional convergence',
      blocks: [
        { type: 'text', html: String.raw`<p>Is $b_n = \dfrac{\sqrt n}{n+4}$ decreasing? The first terms say no: $b_1 = 0.2$, $b_2 \approx 0.236$, $b_3 \approx 0.247$. Plot $f(x) = \sqrt x/(x+4)$ and its derivative: $f$ increases until $x = 4$ and decreases afterwards. The test only needs "decreasing from some $n_0$ on".</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'f(x) = √x/(x+4) and f\'(x) = (4 − x)/(2√x (x+4)²)',
          functions: [{ expr: 'sqrt(x)./(x + 4)', label: String.raw`$f(x)$` }, { expr: '(4 - x)./(2*sqrt(x).*(x + 4).^2)', label: String.raw`$f'(x)$`, dash: true }],
          xlim: [0, 30], ylim: [-0.05, 0.3],
          points: [{ x: 4, y: 0.25, label: 'max at x = 4' }],
          hlines: [0],
        } },
        { type: 'callout', kind: 'def', title: 'Absolute and conditional convergence', html: String.raw`<p>$\sum a_n$ converges <b>absolutely</b> if $\sum |a_n|$ converges. It converges <b>conditionally</b> if $\sum a_n$ converges but $\sum |a_n|$ diverges.</p><p><b>Theorem.</b> Absolute convergence implies convergence. (So for series with mixed signs, try the positive-term tests on $|a_n|$ first.)</p>` },
        { type: 'steps', title: String.raw`Example: classify $\displaystyle\sum_{n=1}^{\infty} (-1)^n \frac{\sqrt n}{n+4}$`, steps: [
          String.raw`<b>Absolute convergence.</b> We test $\sum \frac{\sqrt n}{n+4}$ by limit comparison with $\frac{1}{\sqrt n}$: $\dfrac{\sqrt n/(n+4)}{1/\sqrt n} = \dfrac{n}{n+4} \to 1 \in (0,\infty)$. Since $\sum \frac1{\sqrt n}$ diverges ($p = \tfrac12$), the series is <b>not</b> absolutely convergent.`,
          String.raw`<b>Alternating series test, condition 1.</b> $b_n = \frac{\sqrt n}{n+4} > 0$ for $n \ge 1$, so the series alternates.`,
          String.raw`<b>Condition 2.</b> With $f(x) = \frac{\sqrt x}{x+4}$: $f'(x) = \dfrac{\frac{x+4}{2\sqrt x} - \sqrt x}{(x+4)^2} = \dfrac{4 - x}{2\sqrt x\,(x+4)^2} < 0$ for $x > 4$. So $b_n$ is decreasing for $n \ge 4$.`,
          String.raw`<b>Condition 3.</b> $b_n = \dfrac{1/\sqrt n}{1 + 4/n} \to 0$.`,
          String.raw`<b>Conclusion.</b> The series converges by the alternating series test but not absolutely: it is <b>conditionally convergent</b>.`,
        ] },
        { type: 'quiz', question: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{\cos n}{n^2}$ is`, choices: ['divergent, since $\\cos n$ has no limit', 'absolutely convergent', 'conditionally convergent by the alternating series test', 'not decidable with our tests'], answer: 1, explain: String.raw`It is not alternating, but $\left|\frac{\cos n}{n^2}\right| \le \frac{1}{n^2}$, so $\sum |a_n|$ converges by comparison; absolute convergence implies convergence.` },
        { type: 'quiz', question: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^n}{n^{2/3}}$ is`, choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 1, explain: String.raw`$\sum n^{-2/3}$ diverges ($p < 1$), but $b_n = n^{-2/3}$ is positive, decreasing and tends to $0$.` },
      ],
    },
    {
      id: 'ratio-root',
      title: 'The ratio and root tests',
      blocks: [
        { type: 'text', html: String.raw`<p>For $a_n = \dfrac{n^2}{2^n}$ the ratio of consecutive terms $\dfrac{a_{n+1}}{a_n} = \dfrac12\left(\dfrac{n+1}{n}\right)^2$ settles at $\tfrac12$. Far out, the series looks like a geometric series with ratio $\tfrac12$ — and converges.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'Ratios a_(n+1)/a_n for a_n = n²/2^n',
          a: '((n + 1)./n).^2/2', nmax: 40, L: 0.5, Ltex: String.raw`\tfrac12`, eps: 0.1, ylim: [0, 2.2],
        } },
        { type: 'callout', kind: 'thm', title: 'Ratio test and root test', html: String.raw`<p>Let $\displaystyle\rho = \lim_{n\to\infty}\left|\frac{a_{n+1}}{a_n}\right|$ (ratio test, needs $a_n \ne 0$) or $\displaystyle\rho = \lim_{n\to\infty}\sqrt[n]{|a_n|}$ (root test).</p><ul><li>$\rho < 1$: $\sum a_n$ converges <b>absolutely</b>.</li><li>$\rho > 1$ or $\rho = \infty$: $\sum a_n$ <b>diverges</b> (the terms do not tend to $0$).</li><li>$\rho = 1$: <b>inconclusive</b> — use another test.</li></ul>` },
        { type: 'callout', kind: 'key', html: String.raw`<p>Use the ratio test for factorials and exponentials ($n!$, $3^n$, $n^n$); the root test when the whole term is an $n$-th power. Both give $\rho = 1$ for every $p$-series and every rational function of $n$, so they are useless there.</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} (-1)^n \frac{n^3}{3^n}$ with the ratio test`, steps: [
          String.raw`We form the ratio of absolute values (the signs cancel): $\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{(n+1)^3}{3^{n+1}}\cdot\dfrac{3^n}{n^3} = \dfrac13\left(1 + \dfrac1n\right)^3$.`,
          String.raw`The limit is $\rho = \tfrac13 < 1$.`,
          String.raw`The series converges absolutely by the ratio test (and therefore converges).`,
        ] },
        { type: 'steps', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} \left(\frac{2n+1}{3n-1}\right)^n$ with the root test`, steps: [
          String.raw`All terms are positive for $n \ge 1$, and the term is an $n$-th power, so we take the $n$-th root: $\sqrt[n]{a_n} = \dfrac{2n+1}{3n-1}$.`,
          String.raw`The limit is $\rho = \tfrac23 < 1$, so the series converges by the root test.`,
        ] },
        { type: 'quiz', question: String.raw`What does the ratio test give for $\displaystyle\sum_{n=1}^\infty \frac{n!}{5^n}$?`, choices: [String.raw`$\rho = 1/5$, converges`, String.raw`$\rho = 1$, inconclusive`, String.raw`$\rho = \infty$, diverges`, String.raw`$\rho = 5$, diverges`], answer: 2, explain: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{n+1}{5} \to \infty$. Factorials beat every exponential.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'alternating-numerics',
      title: 'Signs, bounds and ratios in MATLAB',
      blocks: [
        { type: 'text', html: String.raw`<p>Alternating signs are produced with <code>(-1).^n</code> — note the dot, and the parentheses around $-1$ (<code>-1.^n</code> is $-(1^n) = -1$). <code>abs</code> gives the sizes $b_n$, and <code>cumsum</code> the partial sums.</p>` },
        { type: 'code', caption: 'Partial sums of Σ (−1)^(n+1)/n³ and the interval from the alternating series bound.', editable: true, code: String.raw`n = 1:12;
a = (-1).^(n+1) ./ n.^3;
S = cumsum(a);
b = abs(a);
plot(n, S, 'o-')
grid on
N = 4;
fprintf('S_%d = %.6f, |R_%d| <= b_%d = %.6f\n', N, S(N), N, N+1, b(N+1))
fprintf('S lies between %.6f and %.6f\n', S(N), S(N) + a(N+1))` },
        { type: 'text', html: String.raw`<p>A quick <b>sanity check</b> before applying the ratio test by hand: compute $|a_{n+1}/a_n|$ for many $n$ and see where it settles. It is not a proof — the limit still has to be computed exactly — but it catches algebra mistakes.</p>` },
        { type: 'code', editable: true, code: String.raw`n = 1:40;
a = factorial(2*n) ./ (factorial(n).^2 .* 5.^n);
r = abs(a(2:end) ./ a(1:end-1));
plot(n(1:end-1), r, '.')
yline(4/5)
grid on
r(end)` },
        { type: 'matlab', prompt: String.raw`For $\displaystyle\sum_{n=1}^\infty \frac{(-1)^{n+1}}{n^3}$ compute the partial sum $S_{10}$ in <code>S10</code> and the alternating series error bound $b_{11}$ in <code>bound</code>.`, starter: `n = 1:11;\na = 0 * n;     % replace by the terms\nS10 = 0;       % replace\nbound = 0;     % replace`, solution: `n = 1:11;\na = (-1).^(n+1) ./ n.^3;\nS10 = sum(a(1:10));\nbound = abs(a(11));`, checks: [{ var: 'S10', value: 'sum((-1).^((1:10)+1)./(1:10).^3)', tol: 1e-12 }, { var: 'bound', value: '1/1331', tol: 1e-12 }], hint: String.raw`<code>(-1).^(n+1)</code> gives $+1, -1, +1, \dots$` },
        { type: 'matlab', prompt: String.raw`Compute the ratios $r_n = |a_{n+1}/a_n|$ for $a_n = \dfrac{n^3}{3^n}$, $n = 1, \dots, 50$ (a vector <code>r</code> of length 49), and store the last ratio in <code>rLast</code>. Compare it with the limit $\tfrac13$.`, starter: `n = 1:50;\na = n.^3 ./ 3.^n;\nr = 0;       % replace by the vector of ratios\nrLast = 0;   % replace`, solution: `n = 1:50;\na = n.^3 ./ 3.^n;\nr = abs(a(2:end) ./ a(1:end-1));\nrLast = r(end);`, checks: [{ var: 'r', size: 49 }, { var: 'rLast', value: '(50/49)^3/3', tol: 1e-10 }] },
        { type: 'matlab', prompt: String.raw`For $\displaystyle\sum_{n=1}^\infty \frac{(-1)^n}{n^2+1}$ find the smallest $N$ for which the alternating series bound guarantees $|R_N| \le b_{N+1} < 10^{-4}$. Store it in <code>N</code>. (Hint: <code>find(b < 1e-4, 1)</code> returns the first index $k$ with $b_k < 10^{-4}$, and then $N = k - 1$.)`, starter: `n = 1:200;\nb = 1 ./ (n.^2 + 1);\nN = 0;   % replace`, solution: `n = 1:200;\nb = 1 ./ (n.^2 + 1);\nN = find(b < 1e-4, 1) - 1;`, checks: [{ var: 'N', value: 99 }] },
      ],
    },
    {
      id: 'classification-writeup',
      title: 'Writing up absolute / conditional / divergent',
      blocks: [
        { type: 'text', html: String.raw`<p>A classification question has a fixed structure: first test <b>absolute</b> convergence (positive-term tests on $|a_n|$). If that fails, test convergence of the series itself (usually the alternating series test with all three conditions). If the terms do not tend to $0$, the divergence test settles everything at once.</p>` },
        { type: 'livescript', caption: 'Model answer: Σ (−1)^n n/(n²+4)', blocks: [
          { type: 'heading', content: 'Problem (Attempted)' },
          { type: 'text', content: String.raw`We classify $\sum_{n=1}^{\infty} (-1)^n \frac{n}{n^2+4}$. First we test absolute convergence. The series of absolute values $\sum \frac{n}{n^2+4}$ has positive terms, and we compare it with the harmonic series:` },
          { type: 'equation', content: String.raw`\lim_{n\to\infty} \frac{n/(n^2+4)}{1/n} = \lim_{n\to\infty} \frac{n^2}{n^2+4} = 1 \in (0, \infty).` },
          { type: 'text', content: String.raw`Since $\sum \frac1n$ diverges, the series is not absolutely convergent by the limit comparison test. Next we check the three conditions of the alternating series test for $b_n = \frac{n}{n^2+4}$. Clearly $b_n > 0$. For monotonicity we differentiate $f(x) = \frac{x}{x^2+4}$:` },
          { type: 'equation', content: String.raw`f'(x) = \frac{(x^2+4) - 2x^2}{(x^2+4)^2} = \frac{4 - x^2}{(x^2+4)^2} < 0 \quad\text{for } x > 2,` },
          { type: 'text', content: String.raw`so $b_n$ is decreasing for $n \ge 2$. Finally $b_n = \frac{1/n}{1 + 4/n^2} \to 0$. By the alternating series test the series converges, so it is **conditionally convergent**. Numerically:` },
          { type: 'code', content: String.raw`n = 1:2000;
a = (-1).^n .* n ./ (n.^2 + 4);
S = cumsum(a);
fprintf('S_1999 = %.6f, S_2000 = %.6f\n', S(1999), S(2000))
fprintf('sum of |a_n| up to 2000: %.3f (keeps growing)\n', sum(abs(a)))` },
        ] },
        { type: 'latex', prompt: 'Type the alternating series remainder bound:', target: String.raw`|R_N| = |S - S_N| \le b_{N+1}` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Absolutely, conditionally or divergent?',
      difficulty: 'core',
      statement: String.raw`<p>Classify each series.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{(-1)^n}{2\sqrt n + 1}$`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 1, solution: String.raw`$|a_n| \sim \frac{1}{2\sqrt n}$: limit comparison with $\sum n^{-1/2}$ (divergent) shows no absolute convergence. $b_n = \frac{1}{2\sqrt n + 1}$ is positive, decreasing, $\to 0$: converges by the alternating series test.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty (-1)^n \frac{n^2}{2^n}$`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 0, solution: String.raw`Ratio test: $\left|\frac{a_{n+1}}{a_n}\right| = \frac12\left(\frac{n+1}{n}\right)^2 \to \frac12 < 1$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty (-1)^n \frac{n+1}{2n}$`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 2, solution: String.raw`$|a_n| = \frac{n+1}{2n} \to \frac12$, so $a_n \not\to 0$: divergent by the divergence test.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty (-1)^n \sin\!\left(\frac{1}{n^2}\right)$`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 0, solution: String.raw`$0 < \sin(1/n^2) \le 1/n^2$ (since $\sin t \le t$ for $t \ge 0$), so $\sum |a_n|$ converges by comparison with $p = 2$.` },
        { label: '(e)', prompt: String.raw`$\displaystyle\sum_{n=2}^\infty \frac{(-1)^n}{n\ln n}$`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 1, solution: String.raw`$\sum \frac{1}{n\ln n}$ diverges by the integral test ($\int_2^\infty \frac{\mathrm d x}{x\ln x} = \infty$). $b_n = \frac1{n\ln n}$ is positive, decreasing (the denominator increases) and $\to 0$, so the series converges by the alternating series test.` },
      ],
    },
    {
      id: 'a2',
      title: 'An eventually decreasing alternating series',
      difficulty: 'challenge',
      hw: 'HW6-style',
      statement: String.raw`<p>Consider $\displaystyle\sum_{n=2}^{\infty} (-1)^n \frac{(\ln n)^2}{n}$ and $f(x) = \dfrac{(\ln x)^2}{x}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$f'(x) < 0$ exactly for $x > c$. Give $c$.`, kind: 'numeric', answer: 'exp(2)', tol: 1e-6, hint: String.raw`$f'(x) = \dfrac{\ln x\,(2 - \ln x)}{x^2}$.`, solution: String.raw`$f'(x) = \dfrac{2\ln x\cdot\frac1x\cdot x - (\ln x)^2}{x^2} = \dfrac{\ln x\,(2 - \ln x)}{x^2}$, negative for $\ln x > 2$, i.e. $x > e^2 \approx 7.39$.` },
        { label: '(b)', prompt: 'The series is', kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 1, solution: String.raw`$\frac{(\ln n)^2}{n} \ge \frac1n$ for $n \ge 3$, so there is no absolute convergence; the alternating series test applies from $n = 8$ on.` },
        { label: '(c)', prompt: String.raw`Write a Live Script that classifies the series, verifying every pre-condition of the tests you use.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 2 (Attempted)' },
        { type: 'text', content: String.raw`We first test absolute convergence. For $n \ge 3$ we have $\ln n > 1$, hence` },
        { type: 'equation', content: String.raw`\left|(-1)^n\frac{(\ln n)^2}{n}\right| = \frac{(\ln n)^2}{n} > \frac{1}{n} > 0 .` },
        { type: 'text', content: String.raw`The harmonic series diverges, so $\sum \frac{(\ln n)^2}{n}$ diverges by the direct comparison test: the series is not absolutely convergent. Next we check the three conditions of the alternating series test for $b_n = \frac{(\ln n)^2}{n}$. First, $b_n > 0$ for $n \ge 2$. Second, we differentiate $f(x) = \frac{(\ln x)^2}{x}$:` },
        { type: 'equation', content: String.raw`f'(x) = \frac{2\ln x - (\ln x)^2}{x^2} = \frac{\ln x\,(2 - \ln x)}{x^2} < 0 \quad\text{for } x > e^2 \approx 7.39 .` },
        { type: 'text', content: String.raw`So $b_n$ is decreasing for $n \ge 8$ (it is enough that this holds eventually). Third, by L'Hôpital's rule applied twice,` },
        { type: 'equation', content: String.raw`\lim_{x\to\infty}\frac{(\ln x)^2}{x} = \lim_{x\to\infty}\frac{2\ln x}{x} = \lim_{x\to\infty}\frac{2}{x} = 0 .` },
        { type: 'text', content: String.raw`All conditions hold, so the series converges by the alternating series test; it is **conditionally convergent**. The table shows the increase up to $n = 7$ and the decrease afterwards:` },
        { type: 'code', content: String.raw`n = 2:12;
b = log(n).^2 ./ n;
fprintf('%2d  %.5f\n', [n; b])` },
      ],
    },
    {
      id: 'a3',
      title: 'Estimating an alternating sum',
      difficulty: 'core',
      hw: 'HW6-style',
      statement: String.raw`<p>Let $\displaystyle S = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n\,2^n}$. (The conditions of the alternating series test hold: $b_n = \frac{1}{n2^n} > 0$ is decreasing and tends to $0$.)</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $S_5$.`, kind: 'numeric', answer: '391/960', tol: 1e-8, solution: String.raw`$S_5 = \tfrac12 - \tfrac18 + \tfrac1{24} - \tfrac1{64} + \tfrac1{160} = \tfrac{480 - 120 + 40 - 15 + 6}{960} = \tfrac{391}{960} \approx 0.407292$.` },
        { label: '(b)', prompt: String.raw`The alternating series bound for $|R_5|$.`, kind: 'numeric', answer: '1/384', tol: 1e-9, solution: String.raw`$|R_5| \le b_6 = \dfrac{1}{6\cdot 2^6} = \dfrac1{384} \approx 0.002604$.` },
        { label: '(c)', prompt: 'Which interval contains $S$?', kind: 'choice', choices: [String.raw`$[S_5,\ S_5 + \tfrac1{384}]$`, String.raw`$[S_5 - \tfrac1{384},\ S_5]$`, String.raw`$[S_5 - \tfrac1{384},\ S_5 + \tfrac1{384}]$ and no better`, String.raw`$[S_5 - \tfrac1{160},\ S_5]$`], answer: 1, solution: String.raw`The first omitted term $(-1)^7 b_6 = -\tfrac1{384}$ is negative, so $R_5 < 0$: $S_5 - \tfrac1{384} \le S < S_5$.` },
        { label: '(d)', prompt: String.raw`The lower endpoint of that interval (exact or to 6 decimals).`, kind: 'numeric', answer: '777/1920', tol: 1e-7, solution: String.raw`$\tfrac{391}{960} - \tfrac{1}{384} = \tfrac{782 - 5}{1920} = \tfrac{777}{1920} = 0.4046875$. (In fact $S = \ln\tfrac32 \approx 0.405465$, see the power series module.)` },
        { label: '(e)', prompt: String.raw`Smallest $N$ for which the bound guarantees $|R_N| < 10^{-4}$.`, kind: 'numeric', answer: '9', tol: 1e-9, solution: String.raw`Need $(N+1)2^{N+1} > 10^4$: $9\cdot 2^9 = 4608$ is too small, $10\cdot 2^{10} = 10240$ works. So $N + 1 = 10$, $N = 9$.` },
      ],
    },
    {
      id: 'a4',
      title: 'Ratio and root tests',
      difficulty: 'core',
      statement: String.raw`<p>Compute the limit $\rho$ of the ratio or root test and draw the conclusion.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Ratio test for $\displaystyle\sum_{n=1}^\infty \frac{(2n)!}{(n!)^2\,5^n}$: $\rho = $`, kind: 'numeric', answer: '4/5', solution: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{(2n+2)(2n+1)}{(n+1)^2\cdot 5} = \dfrac{2(2n+1)}{5(n+1)} \to \dfrac45$. Since $\rho < 1$ the series converges (absolutely).` },
        { label: '(b)', prompt: String.raw`Ratio test for $\displaystyle\sum_{n=1}^\infty \frac{n^n}{3^n\, n!}$: $\rho = $`, kind: 'numeric', answer: 'exp(1)/3', tol: 1e-6, solution: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{(n+1)^{n+1}}{3(n+1)\,n^n} = \dfrac13\left(1 + \dfrac1n\right)^n \to \dfrac e3 \approx 0.906 < 1$: converges.` },
        { label: '(c)', prompt: String.raw`Root test for $\displaystyle\sum_{n=1}^\infty \left(\frac{3n+2}{4n-1}\right)^n$: $\rho = $`, kind: 'numeric', answer: '3/4', solution: String.raw`$\sqrt[n]{a_n} = \dfrac{3n+2}{4n-1} \to \dfrac34 < 1$: converges.` },
        { label: '(d)', prompt: String.raw`Ratio test for $\displaystyle\sum_{n=1}^\infty \frac{n^2 + 1}{n^4}$ gives`, kind: 'choice', choices: [String.raw`$\rho = 0$: converges`, String.raw`$\rho = 1$: inconclusive (the series converges by limit comparison with $p = 2$)`, String.raw`$\rho = 1$: diverges`, String.raw`$\rho = \infty$: diverges`], answer: 1, solution: String.raw`For any rational function of $n$ the ratio tends to $1$. Limit comparison with $\frac1{n^2}$ decides: converges.` },
      ],
    },
  ],
};
