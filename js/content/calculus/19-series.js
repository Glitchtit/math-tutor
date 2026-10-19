// Module 19: Infinite series — partial sums, geometric and telescoping series, divergence,
// integral, comparison and limit comparison tests.

export default {
  id: 'series',
  number: 19,
  part: 'series',
  hw: 'HW5',
  title: 'Infinite series and convergence tests',
  summary: 'Series as limits of partial sums: geometric series and their applications (reflections, bouncing balls), telescoping series via partial fractions, the n-th term test, p-series, the integral test with remainder bounds, and the comparison and limit comparison tests — always with their pre-conditions checked.',
  intro: String.raw`<p>An infinite sum $a_1 + a_2 + a_3 + \cdots$ is defined as the limit of its <b>partial sums</b>. Only two kinds of series can be summed exactly by hand — geometric and telescoping — so most of this module is about <b>tests</b> that decide convergence without knowing the sum, and about bounding the error when a partial sum is used instead. Every test has pre-conditions; graders check that you state and verify them.</p>`,
  lessons: [
    {
      id: 'partial-sums',
      title: 'Partial sums and geometric series',
      blocks: [
        { type: 'text', html: String.raw`<p>The top panel shows the terms $a_n = 0.6^n$, $n = 0, 1, 2, \dots$; the bottom panel shows the running totals $S_N$. Add terms: the partial sums climb towards the green line $2.5$ but never reach it.</p>` },
        { type: 'widget', name: 'series', config: {
          title: 'Geometric series Σ 0.6^n',
          term: '0.6.^n', n0: 0, nmax: 30, N: 4, sum: 2.5, sumTex: String.raw`\frac{1}{1 - 0.6} = 2.5`,
        } },
        { type: 'callout', kind: 'def', title: 'Convergent series', html: String.raw`<p>The series $\sum_{n=1}^{\infty} a_n$ <b>converges</b> to the sum $S$ if its sequence of partial sums $S_N = \sum_{n=1}^{N} a_n$ converges to $S$. Otherwise the series diverges. The <b>remainder</b> (tail) is $R_N = S - S_N = \sum_{n=N+1}^{\infty} a_n$.</p>` },
        { type: 'callout', kind: 'thm', title: 'Geometric series', html: String.raw`<p>With first term $a$ and ratio $r$,</p>$$\sum_{n=0}^{\infty} a r^n = a + ar + ar^2 + \cdots = \frac{a}{1 - r} \quad\text{if } |r| < 1,$$<p>and the series diverges if $|r| \ge 1$ (and $a \ne 0$). Proof: $S_N - rS_N = a - ar^{N+1}$, so $S_N = a\,\dfrac{1 - r^{N+1}}{1 - r} \to \dfrac{a}{1-r}$ exactly when $r^{N+1} \to 0$.</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} \frac{3\cdot 2^n}{5^{n+1}}$`, steps: [
          String.raw`We rewrite the term as a geometric expression: $\dfrac{3\cdot 2^n}{5^{n+1}} = \dfrac35\left(\dfrac25\right)^n$, so the ratio is $r = \tfrac25$ and $|r| < 1$: the series converges.`,
          String.raw`The first term (at $n = 1$) is $a = \dfrac35\cdot\dfrac25 = \dfrac{6}{25}$.`,
          String.raw`Sum $=$ first term$/(1 - r) = \dfrac{6/25}{1 - 2/5} = \dfrac{6}{25}\cdot\dfrac53 = \dfrac25$.`,
        ] },
        { type: 'callout', kind: 'key', html: String.raw`<p>"First term over one minus the ratio" avoids index mistakes: you never need to shift the series to start at $n = 0$.</p>` },
        { type: 'quiz', question: String.raw`$\displaystyle\sum_{n=2}^{\infty} \left(-\frac13\right)^{n}$ equals`, choices: [String.raw`$\dfrac34$`, String.raw`$\dfrac1{12}$`, String.raw`$-\dfrac14$`, String.raw`It diverges`], answer: 1, explain: String.raw`First term $(-\tfrac13)^2 = \tfrac19$, ratio $-\tfrac13$: sum $= \dfrac{1/9}{1 + 1/3} = \dfrac{1}{12}$.` },
      ],
    },
    {
      id: 'geometric-applications',
      title: 'Geometric series in applications',
      blocks: [
        { type: 'text', html: String.raw`<p>A ball is dropped from $h_0 = 2$ m, and after each impact it rises to $60\,\%$ of its previous height. The distances travelled are $2$ (first fall) and then $2\cdot 2\cdot 0.6^k$ for the $k$-th rebound (up and down). Their partial sums approach $8$ m:</p>` },
        { type: 'widget', name: 'series', config: {
          title: 'Total distance of a bouncing ball (h0 = 2 m, r = 0.6)',
          term: '2*(n==0) + 4*0.6.^n.*(n>0)', n0: 0, nmax: 25, N: 3, sum: 8, sumTex: '8',
        } },
        { type: 'steps', title: 'Example: total distance and total time of the bouncing ball', steps: [
          String.raw`We add the first fall and the rebounds. The $k$-th rebound reaches $h_k = h_0 r^k$ and contributes $2h_k$:<br>$D = h_0 + 2\sum_{k=1}^{\infty} h_0 r^k = h_0 + \dfrac{2h_0 r}{1 - r} = h_0\,\dfrac{1 + r}{1 - r} = 2\cdot\dfrac{1.6}{0.4} = 8\ \text{m}.$`,
          String.raw`For the time we use free fall: falling from rest through height $h$ takes $t = \sqrt{2h/g}$, and rising to $h$ takes the same time. So the $k$-th rebound takes $2\sqrt{2h_0 r^k/g} = 2t_0\left(\sqrt r\right)^k$ with $t_0 = \sqrt{2h_0/g}$.`,
          String.raw`The times form a geometric series with ratio $\sqrt r$ (not $r$!):<br>$T = t_0 + 2t_0\sum_{k=1}^{\infty} \left(\sqrt r\right)^k = t_0\,\dfrac{1 + \sqrt r}{1 - \sqrt r}.$`,
          String.raw`With $g = 9.81\ \mathrm{m/s^2}$: $t_0 = \sqrt{4/9.81} \approx 0.6386$ s and $\sqrt{0.6} \approx 0.7746$, so $T \approx 0.6386\cdot 7.873 \approx 5.03$ s. The ball bounces infinitely often in a finite time.`,
        ] },
        { type: 'text', html: String.raw`<p><b>Multiple reflections.</b> A glass pane reflects a fraction $\rho$ of incoming light, absorbs $\alpha$ and transmits $\tau$, with $\rho + \alpha + \tau = 1$. With two panes, light bounces back and forth in the gap; each round trip multiplies the intensity by $\rho^2$. The fraction that finally passes both panes is</p>$$T = \tau^2 + \tau\rho^2\tau + \tau\rho^4\tau + \cdots = \tau^2\sum_{k=0}^{\infty} \rho^{2k} = \frac{\tau^2}{1 - \rho^2}.$$<p>For $\rho = 0.3$, $\tau = 0.5$: $T = 0.25/0.91 \approx 0.275$, a little more than the $\tau^2 = 0.25$ of a single pass.</p>` },
        { type: 'callout', kind: 'exam', html: String.raw`<p>In application problems, write out the first two or three contributions explicitly before summing. That makes the first term and the ratio visible — and shows the grader where they come from.</p>` },
        { type: 'quiz', question: String.raw`A ball dropped from height $h_0$ rebounds to $r h_0$ each time. Which ratio does the series of bounce <b>times</b> have?`, choices: [String.raw`$r$`, String.raw`$\sqrt r$`, String.raw`$r^2$`, String.raw`$2r$`], answer: 1, explain: String.raw`Time scales like $\sqrt{h}$, and $\sqrt{h_0 r^k} = \sqrt{h_0}\,(\sqrt r)^k$.` },
      ],
    },
    {
      id: 'telescoping-divergence',
      title: 'Telescoping series and the divergence test',
      blocks: [
        { type: 'text', html: String.raw`<p>The terms $\dfrac{1}{n(n+2)}$ split into $\dfrac12\left(\dfrac1n - \dfrac1{n+2}\right)$. In the partial sum almost everything cancels, and $S_N$ approaches $\tfrac34$:</p>` },
        { type: 'widget', name: 'series', config: {
          title: 'Telescoping series Σ 1/(n(n+2))',
          term: '1./(n.*(n + 2))', n0: 1, nmax: 30, N: 3, sum: 0.75, sumTex: String.raw`\tfrac34`,
        } },
        { type: 'steps', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} \frac{2}{n^2 + 4n + 3}$`, steps: [
          String.raw`We factor the denominator and use partial fractions: $\dfrac{2}{(n+1)(n+3)} = \dfrac{A}{n+1} + \dfrac{B}{n+3}$ with $A = \dfrac{2}{-1+3} = 1$ and $B = \dfrac{2}{-3+1} = -1$.`,
          String.raw`We write out the partial sum: $S_N = \left(\tfrac12 - \tfrac14\right) + \left(\tfrac13 - \tfrac15\right) + \left(\tfrac14 - \tfrac16\right) + \cdots + \left(\tfrac1{N+1} - \tfrac1{N+3}\right)$.`,
          String.raw`Every negative term cancels a positive term two places later, leaving $S_N = \dfrac12 + \dfrac13 - \dfrac1{N+2} - \dfrac1{N+3}$.`,
          String.raw`Letting $N \to \infty$: $S = \dfrac12 + \dfrac13 = \dfrac56$.`,
        ] },
        { type: 'callout', kind: 'thm', title: 'Divergence test (n-th term test)', html: String.raw`<p>If $\sum a_n$ converges, then $a_n \to 0$. Equivalently: if $\lim a_n \ne 0$ or the limit does not exist, the series <b>diverges</b>.</p>` },
        { type: 'callout', kind: 'warn', html: String.raw`<p>The converse is false. The <b>harmonic series</b> $\sum \frac1n$ has $\frac1n \to 0$ but diverges: grouping $\tfrac13 + \tfrac14 > \tfrac12$, $\tfrac15 + \cdots + \tfrac18 > \tfrac12$, … the partial sums exceed $1 + k/2$ for $N = 2^k$. The test can only prove <b>divergence</b>.</p>` },
        { type: 'quiz', question: String.raw`What does the divergence test say about $\displaystyle\sum_{n=1}^{\infty} \frac{n}{3n + 1}$ and $\displaystyle\sum_{n=1}^{\infty} \frac{1}{\sqrt n}$?`, choices: [String.raw`Both diverge.`, String.raw`The first diverges; nothing about the second.`, String.raw`The first diverges; the second converges.`, String.raw`Nothing about either.`], answer: 1, explain: String.raw`$\frac{n}{3n+1} \to \frac13 \ne 0$, so the first diverges. For the second $\frac1{\sqrt n} \to 0$, and the test is inconclusive (it diverges as a $p$-series with $p = \tfrac12$).` },
      ],
    },
    {
      id: 'integral-test',
      title: 'The integral test, p-series and remainder bounds',
      blocks: [
        { type: 'text', html: String.raw`<p>Each term $a_n = f(n)$ is the area of a rectangle of width $1$. For a decreasing $f$ the rectangles on $[n, n+1]$ lie above the curve, the ones on $[n-1, n]$ below it. So the series and the improper integral converge or diverge <b>together</b>, and the tail of the series is trapped between two integrals.</p>` },
        { type: 'widget', name: 'series', config: {
          title: 'Σ 1/n² against the curve f(x) = 1/x²',
          term: '1./n.^2', integralTest: '1./x.^2', n0: 1, nmax: 40, N: 3, view: 10, sum: Math.PI ** 2 / 6, sumTex: String.raw`\pi^2/6`,
        } },
        { type: 'callout', kind: 'thm', title: 'Integral test', html: String.raw`<p><b>Pre-conditions:</b> $a_n = f(n)$ where $f$ is <b>continuous, positive and decreasing</b> on $[N_0, \infty)$. Then $\sum a_n$ and $\int_{N_0}^{\infty} f(x)\,\mathrm d x$ either both converge or both diverge. If they converge, the remainder satisfies, for $N \ge N_0$,</p>$$\int_{N+1}^{\infty} f(x)\,\mathrm d x \;\le\; R_N = \sum_{n=N+1}^{\infty} a_n \;\le\; \int_{N}^{\infty} f(x)\,\mathrm d x .$$` },
        { type: 'callout', kind: 'key', title: 'p-series', html: String.raw`<p>$\displaystyle\sum_{n=1}^{\infty} \frac{1}{n^p}$ converges if $p > 1$ and diverges if $p \le 1$ (integral test with $\int_1^\infty x^{-p}\,\mathrm d x$). The harmonic series is the case $p = 1$.</p>` },
        { type: 'steps', title: String.raw`Example: bound $\displaystyle S = \sum_{n=1}^{\infty} \frac1{n^3}$ using $S_5$`, steps: [
          String.raw`We check the pre-conditions for $f(x) = x^{-3}$ on $[1, \infty)$: it is continuous and positive there, and $f'(x) = -3x^{-4} < 0$, so it is decreasing. The integral test applies.`,
          String.raw`We compute the partial sum: $S_5 = 1 + \tfrac18 + \tfrac1{27} + \tfrac1{64} + \tfrac1{125} \approx 1.185662$.`,
          String.raw`We compute the remainder integrals: $\displaystyle\int_N^\infty x^{-3}\,\mathrm d x = \frac{1}{2N^2}$, so $\dfrac{1}{2\cdot 36} \le R_5 \le \dfrac{1}{2\cdot 25}$, i.e. $0.013889 \le R_5 \le 0.02$.`,
          String.raw`Adding $S_5$: $\;1.199551 \le S \le 1.205662$. (The true value is $1.2020569\ldots$)`,
        ] },
        { type: 'callout', kind: 'exam', html: String.raw`<p>"Decreasing" must be <b>shown</b>, usually with $f'(x) < 0$. If $f$ only decreases for $x \ge x_0$, apply the test on $[x_0, \infty)$; the finitely many earlier terms do not affect convergence.</p>` },
        { type: 'quiz', question: String.raw`Which series converges?`, choices: [String.raw`$\displaystyle\sum \frac{1}{n^{0.99}}$`, String.raw`$\displaystyle\sum \frac{1}{\sqrt[3]{n^2}}$`, String.raw`$\displaystyle\sum \frac{1}{n\sqrt n}$`, String.raw`$\displaystyle\sum \frac{\sqrt n}{n}$`], answer: 2, explain: String.raw`$\frac1{n\sqrt n} = n^{-3/2}$ with $p = \tfrac32 > 1$. The others have $p = 0.99$, $\tfrac23$ and $\tfrac12$.` },
      ],
    },
    {
      id: 'comparison',
      title: 'Comparison and limit comparison tests',
      blocks: [
        { type: 'text', html: String.raw`<p>For large $n$ the terms $a_n = \dfrac{n+1}{n^3+2}$ behave like $b_n = \dfrac1{n^2}$. Move the slider: the ratio $a_n/b_n$ approaches $1$, so the two series share their fate.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'a(x) = (x+1)/(x³+2) and b(x) = 1/x²',
          functions: [{ expr: '(x + 1)./(x.^3 + 2)', label: String.raw`$a(x) = \frac{x+1}{x^3+2}$` }, { expr: '1./x.^2', label: String.raw`$b(x) = \frac{1}{x^2}$`, dash: true }],
          params: { N: { min: 1, max: 60, value: 3, step: 1, label: '$n$' } },
          xlim: [0.5, 12], ylim: [0, 1.2],
          readout: 'At $n = {{N}}$: $a_n/b_n = {{(N+1)*N^2/(N^3+2)}}$.',
        } },
        { type: 'callout', kind: 'thm', title: 'Comparison tests (series with positive terms)', html: String.raw`<p><b>Direct comparison.</b> Suppose $0 \le a_n \le b_n$ for all $n \ge n_0$. If $\sum b_n$ converges, so does $\sum a_n$; if $\sum a_n$ diverges, so does $\sum b_n$.</p><p><b>Limit comparison.</b> Suppose $a_n > 0$, $b_n > 0$ and $\displaystyle\lim_{n\to\infty} \frac{a_n}{b_n} = c$ with $0 < c < \infty$. Then $\sum a_n$ and $\sum b_n$ both converge or both diverge.</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} \frac{n+1}{n^3+2}$`, steps: [
          String.raw`We choose the comparison series by keeping the dominant powers: $\dfrac{n+1}{n^3 + 2} \approx \dfrac{n}{n^3} = \dfrac1{n^2}$, so $b_n = \dfrac{1}{n^2}$. Both $a_n$ and $b_n$ are positive.`,
          String.raw`We compute the limit of the ratio: $\dfrac{a_n}{b_n} = \dfrac{n^3 + n^2}{n^3 + 2} \to 1$, and $0 < 1 < \infty$.`,
          String.raw`$\sum \frac1{n^2}$ is a convergent $p$-series ($p = 2 > 1$), so $\sum \frac{n+1}{n^3+2}$ converges by the limit comparison test.`,
        ] },
        { type: 'steps', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} \frac{1}{3^n + n}$ by direct comparison`, steps: [
          String.raw`We bound the term from above: since $n > 0$, $0 < \dfrac{1}{3^n + n} < \dfrac{1}{3^n}$ for all $n \ge 1$.`,
          String.raw`$\sum \left(\frac13\right)^n$ is a geometric series with $|r| = \tfrac13 < 1$, hence convergent.`,
          String.raw`By the direct comparison test the series converges.`,
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>The inequality must go the right way. $\frac{1}{n^2 - 1/2} > \frac{1}{n^2}$ says nothing by direct comparison with $\sum \frac1{n^2}$ — use the limit comparison test instead.</p>` },
        { type: 'quiz', question: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{1}{2n - 1}$`, choices: ['converges by comparison with $\\sum 1/n^2$', 'diverges by limit comparison with $\\sum 1/n$', 'diverges by the divergence test', 'converges because the terms tend to 0'], answer: 1, explain: String.raw`$\dfrac{1/(2n-1)}{1/n} = \dfrac{n}{2n - 1} \to \dfrac12 \in (0, \infty)$ and the harmonic series diverges. The terms do tend to $0$, so the divergence test says nothing.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'partial-sums-matlab',
      title: 'Partial sums with cumsum, remainder bounds with integral',
      blocks: [
        { type: 'text', html: String.raw`<p><code>cumsum</code> turns a vector of terms into the vector of partial sums: <code>S(N)</code> is $S_N$. Plot the partial sums with dots and compare with the claimed sum.</p>` },
        { type: 'code', caption: 'Partial sums of the telescoping series Σ 2/((n+1)(n+3)) and its sum 5/6.', editable: true, code: String.raw`n = 1:500;
a = 2 ./ ((n + 1) .* (n + 3));
S = cumsum(a);
plot(n, S, '.')
yline(5/6)
grid on
xlabel('N'), ylabel('S_N')
fprintf('S_500 = %.8f,  5/6 = %.8f\n', S(end), 5/6)` },
        { type: 'text', html: String.raw`<p>For the integral-test bounds, <code>integral</code> accepts <code>Inf</code> as a limit. Print the resulting interval with <code>fprintf</code>, and always say in text that the pre-conditions (continuous, positive, decreasing) were checked by hand.</p>` },
        { type: 'code', caption: 'Bounds for Σ 1/n³ from S_5: S_5 + ∫_6^∞ f ≤ S ≤ S_5 + ∫_5^∞ f.', editable: true, code: String.raw`f = @(x) 1 ./ x.^3;
N = 5;
SN = sum(f(1:N));
lower = SN + integral(f, N+1, Inf);
upper = SN + integral(f, N, Inf);
fprintf('S_5 = %.6f\n', SN)
fprintf('%.6f <= S <= %.6f\n', lower, upper)` },
        { type: 'matlab', prompt: String.raw`Compute the partial sums $S_1, \dots, S_{100}$ of $\displaystyle\sum_{n=1}^\infty \frac{1}{n(n+2)}$ into a vector <code>S</code> with <code>cumsum</code>, and store $S_{100}$ in <code>S100</code>.`, starter: `n = 1:100;\na = 0 * n;   % replace by the terms\nS = 0 * n;   % replace by the partial sums\nS100 = 0;    % replace by the last partial sum`, solution: `n = 1:100;\na = 1 ./ (n .* (n + 2));\nS = cumsum(a);\nS100 = S(end);`, checks: [{ var: 'S', size: 100 }, { var: 'S100', value: '3/4 - (1/101 + 1/102)/2', tol: 1e-10 }, { uses: 'cumsum' }] },
        { type: 'matlab', prompt: String.raw`For $\displaystyle\sum_{n=1}^\infty \frac{n}{(n^2+1)^2}$ compute $S_4$ in <code>S4</code> and the integral-test bounds for the sum in <code>lower</code> and <code>upper</code>. ($f(x) = x/(x^2+1)^2$ is decreasing for $x \ge 1$.)`, starter: `f = @(x) x ./ (x.^2 + 1).^2;\nS4 = 0;      % replace\nlower = 0;   % replace\nupper = 0;   % replace`, solution: `f = @(x) x ./ (x.^2 + 1).^2;\nS4 = sum(f(1:4));\nlower = S4 + integral(f, 5, Inf);\nupper = S4 + integral(f, 4, Inf);`, checks: [{ var: 'S4', value: '1/4 + 2/25 + 3/100 + 4/289', tol: 1e-10 }, { var: 'lower', value: '1/4 + 2/25 + 3/100 + 4/289 + 1/52', tol: 1e-8 }, { var: 'upper', value: '1/4 + 2/25 + 3/100 + 4/289 + 1/34', tol: 1e-8 }, { uses: 'integral' }], hint: String.raw`$R_4$ lies between $\int_5^\infty f$ and $\int_4^\infty f$.` },
        { type: 'latex', prompt: 'Type the integral-test remainder bounds:', target: String.raw`\int_{N+1}^{\infty} f(x)\,\mathrm{d}x \le R_N \le \int_{N}^{\infty} f(x)\,\mathrm{d}x` },
      ],
    },
    {
      id: 'tests-writeup',
      title: 'Writing up a convergence test',
      blocks: [
        { type: 'text', html: String.raw`<p>A convergence argument has three parts, and each needs a sentence: <b>(1)</b> name the test, <b>(2)</b> verify its pre-conditions, <b>(3)</b> draw the conclusion. A numerical check is welcome but never a proof — partial sums of the divergent harmonic series grow like $\ln N$, which looks almost flat on a plot.</p>` },
        { type: 'livescript', caption: 'Model answer: limit comparison test with a numerical check', blocks: [
          { type: 'heading', content: 'Problem (Attempted)' },
          { type: 'text', content: String.raw`We show that $\sum_{n=1}^{\infty} \frac{\sqrt{n} + 2}{n^2 + 1}$ converges with the limit comparison test. For large $n$ the term behaves like $\sqrt n / n^2 = n^{-3/2}$, so we compare with $b_n = n^{-3/2}$. Both sequences are positive, and` },
          { type: 'equation', content: String.raw`\lim_{n\to\infty} \frac{a_n}{b_n} = \lim_{n\to\infty} \frac{(\sqrt n + 2)\,n^{3/2}}{n^2 + 1} = \lim_{n\to\infty} \frac{1 + 2n^{-1/2}}{1 + n^{-2}} = 1 \in (0, \infty).` },
          { type: 'text', content: String.raw`Since $\sum n^{-3/2}$ is a convergent $p$-series ($p = 3/2 > 1$), the given series converges by the limit comparison test. Numerically the partial sums grow ever more slowly; by the integral test the tail after $N$ terms is roughly $2/\sqrt N$:` },
          { type: 'code', content: String.raw`n = 1:5000;
S = cumsum((sqrt(n) + 2) ./ (n.^2 + 1));
fprintf('S_1000 = %.5f,  S_5000 = %.5f\n', S(1000), S(5000))` },
        ] },
        { type: 'code', caption: 'Why plots are not proofs: the harmonic series after 10^5 terms is only about 12.', editable: true, code: String.raw`N = 100000;
S = cumsum(1 ./ (1:N));
fprintf('S_N = %.4f,  ln(N) + 0.5772 = %.4f\n', S(end), log(N) + 0.5772)` },
        { type: 'latex', prompt: 'Type the p-series with its convergence condition:', target: String.raw`\sum_{n=1}^{\infty} \frac{1}{n^p} \text{ converges} \iff p > 1` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Geometric series',
      difficulty: 'core',
      statement: String.raw`<p>Find the sums (exact values).</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\sum_{n=0}^{\infty} \frac{(-2)^n}{3^{n+1}}$`, kind: 'numeric', answer: '1/5', solution: String.raw`First term $\tfrac13$, ratio $-\tfrac23$ with $|r| < 1$: sum $= \dfrac{1/3}{1 + 2/3} = \dfrac15$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\sum_{n=2}^{\infty} \frac{5}{4^n}$`, kind: 'numeric', answer: '5/12', solution: String.raw`First term $\tfrac{5}{16}$, ratio $\tfrac14$: sum $= \dfrac{5/16}{3/4} = \dfrac{5}{12}$.` },
        { label: '(c)', prompt: String.raw`The repeating decimal $0.272727\ldots = 0.\overline{27}$ as a fraction.`, kind: 'numeric', answer: '3/11', tol: 1e-9, solution: String.raw`$0.\overline{27} = \sum_{k=1}^\infty 27\cdot 100^{-k} = \dfrac{27/100}{1 - 1/100} = \dfrac{27}{99} = \dfrac{3}{11}$.` },
        { label: '(d)', prompt: String.raw`For which $x$ does $\displaystyle\sum_{n=0}^{\infty} \frac{(x-1)^n}{2^n}$ converge?`, kind: 'choice', choices: [String.raw`$-1 < x < 3$`, String.raw`$-1 \le x \le 3$`, String.raw`$0 < x < 2$`, String.raw`$-3 < x < 1$`], answer: 0, solution: String.raw`Geometric with ratio $r = \frac{x-1}{2}$: converges iff $|x - 1| < 2$, i.e. $-1 < x < 3$. At $x = -1$ and $x = 3$, $|r| = 1$ and the series diverges.` },
      ],
    },
    {
      id: 'a2',
      title: 'Reflections and a bouncing ball',
      difficulty: 'core',
      hw: 'HW5-style',
      statement: String.raw`<p>(i) Two identical tinted panes each reflect $40\,\%$, absorb $10\,\%$ and transmit $50\,\%$ of the light hitting them (from either side). Light falls on the first pane and bounces back and forth between the panes.</p><p>(ii) A ball is dropped from $h_0 = 1.25$ m. After each impact it rises to $64\,\%$ of its previous height. Use $g = 9.81\ \mathrm{m/s^2}$ and the fall time $t = \sqrt{2h/g}$ from height $h$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`(i) What fraction of the incoming light is transmitted through both panes?`, kind: 'numeric', answer: '25/84', tol: 1e-5, hint: String.raw`Each extra round trip in the gap multiplies by $\rho^2 = 0.16$.`, solution: String.raw`$T = \tau^2(1 + \rho^2 + \rho^4 + \cdots) = \dfrac{0.25}{1 - 0.16} = \dfrac{25}{84} \approx 0.2976$.` },
        { label: '(b)', prompt: String.raw`(i) What fraction is reflected back to the source side in total?`, kind: 'numeric', answer: '0.4 + 0.1/0.84', tol: 1e-5, hint: String.raw`Direct reflection $\rho$, plus light that entered the gap, was reflected by the second pane and passed back through the first: $\tau\rho\tau$, $\tau\rho^3\tau$, …`, solution: String.raw`$R = \rho + \tau^2\rho(1 + \rho^2 + \cdots) = 0.4 + \dfrac{0.25\cdot 0.4}{0.84} \approx 0.5190$. (The absorbed fraction is $1 - T - R \approx 0.1833$.)` },
        { label: '(c)', prompt: String.raw`(ii) Total distance travelled by the ball, in metres.`, kind: 'numeric', answer: '1.25*1.64/0.36', tol: 1e-5, solution: String.raw`$D = h_0 + 2\sum_{k\ge1} h_0 r^k = h_0\dfrac{1 + r}{1 - r} = 1.25\cdot\dfrac{1.64}{0.36} \approx 5.694$ m.` },
        { label: '(d)', prompt: String.raw`(ii) Total time until the ball comes to rest, in seconds.`, kind: 'numeric', answer: 'sqrt(2*1.25/9.81)*1.8/0.2', tol: 1e-5, hint: String.raw`The times form a geometric series with ratio $\sqrt{0.64} = 0.8$.`, solution: String.raw`$t_0 = \sqrt{2\cdot1.25/9.81} \approx 0.5048$ s; each rebound takes $2t_0(0.8)^k$. $T = t_0\dfrac{1 + 0.8}{1 - 0.8} = 9t_0 \approx 4.543$ s.` },
      ],
    },
    {
      id: 'a3',
      title: 'A telescoping series',
      difficulty: 'core',
      hw: 'HW5-style',
      statement: String.raw`<p>Consider $\displaystyle\sum_{n=1}^{\infty} \frac{1}{2 + 3 + 4 + \cdots + (n+1)}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Give a closed formula for the term $a_n$ in terms of $n$.`, kind: 'expression', variable: 'n', answer: '2./(n.*(n+3))', domain: [1, 6], hint: String.raw`$2 + 3 + \cdots + (n+1) = (1 + 2 + \cdots + (n+1)) - 1$.`, solution: String.raw`$\sum_{k=2}^{n+1} k = \dfrac{(n+1)(n+2)}{2} - 1 = \dfrac{n^2 + 3n}{2}$, so $a_n = \dfrac{2}{n(n+3)}$.` },
        { label: '(b)', prompt: String.raw`Which argument proves convergence?`, kind: 'choice', choices: [String.raw`$a_n \to 0$, so the series converges.`, String.raw`$0 < a_n \le \frac{2}{n^2}$ and $\sum \frac{2}{n^2}$ converges ($p = 2$), so it converges by direct comparison.`, String.raw`$a_n \le \frac{2}{n}$ and $\sum \frac2n$ diverges, so it converges.`, String.raw`Ratio of consecutive terms tends to $1$, so it converges.`], answer: 1, solution: String.raw`$n(n+3) \ge n^2$ gives $0 < a_n \le 2/n^2$; comparison with a convergent $p$-series. Option 1 confuses a necessary condition with a sufficient one, option 3 compares in the useless direction.` },
        { label: '(c)', prompt: String.raw`Find the sum of the series.`, kind: 'numeric', answer: '11/9', tol: 1e-8, hint: String.raw`$\dfrac{2}{n(n+3)} = \dfrac23\left(\dfrac1n - \dfrac1{n+3}\right)$.`, solution: String.raw`$S_N = \dfrac23\left(1 + \tfrac12 + \tfrac13 - \tfrac1{N+1} - \tfrac1{N+2} - \tfrac1{N+3}\right) \to \dfrac23\cdot\dfrac{11}{6} = \dfrac{11}{9}$.` },
      ],
    },
    {
      id: 'a4',
      title: 'Integral test with remainder bounds',
      difficulty: 'challenge',
      hw: 'HW5-style',
      statement: String.raw`<p>Consider $\displaystyle\sum_{n=1}^{\infty} \frac{n}{(n^2+1)^2}$ and $f(x) = \dfrac{x}{(x^2+1)^2}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute the partial sum $S_3$.`, kind: 'numeric', answer: '0.36', tol: 1e-8, solution: String.raw`$S_3 = \tfrac14 + \tfrac{2}{25} + \tfrac{3}{100} = 0.25 + 0.08 + 0.03 = 0.36$.` },
        { label: '(b)', prompt: String.raw`Lower bound for the sum $S$ from $S_3$ and the integral test.`, kind: 'numeric', answer: '0.36 + 1/34', tol: 1e-7, solution: String.raw`$\int_N^\infty f = \Big[-\dfrac{1}{2(x^2+1)}\Big]_N^\infty = \dfrac{1}{2(N^2+1)}$. Lower bound $S_3 + \int_4^\infty f = 0.36 + \dfrac1{34} \approx 0.389412$.` },
        { label: '(c)', prompt: String.raw`Upper bound for $S$.`, kind: 'numeric', answer: '0.41', tol: 1e-7, solution: String.raw`$S_3 + \int_3^\infty f = 0.36 + \dfrac{1}{20} = 0.41$.` },
        { label: '(d)', prompt: String.raw`Write a Live Script that verifies the pre-conditions of the integral test for $f$, proves convergence, derives the interval for $S$, and checks it numerically.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 4 (Attempted)' },
        { type: 'text', content: String.raw`We use the integral test with $f(x) = \frac{x}{(x^2+1)^2}$, so that $a_n = f(n)$. First we check its pre-conditions on $[1, \infty)$: $f$ is continuous (the denominator never vanishes) and positive for $x > 0$. For monotonicity we differentiate with the quotient rule:` },
        { type: 'equation', content: String.raw`f'(x) = \frac{(x^2+1)^2 - x\cdot 2(x^2+1)\cdot 2x}{(x^2+1)^4} = \frac{1 - 3x^2}{(x^2+1)^3} < 0 \quad\text{for } x > \tfrac{1}{\sqrt3}.` },
        { type: 'text', content: String.raw`Hence $f$ is decreasing on $[1, \infty)$ and the integral test applies. With the substitution $u = x^2 + 1$ we get` },
        { type: 'equation', content: String.raw`\int_N^{\infty} \frac{x}{(x^2+1)^2}\,\mathrm d x = \lim_{t\to\infty}\Big[-\frac{1}{2(x^2+1)}\Big]_N^t = \frac{1}{2(N^2+1)} .` },
        { type: 'text', content: String.raw`The integral is finite, so the series converges. For the sum we use $S_3 + \int_4^\infty f \le S \le S_3 + \int_3^\infty f$ with $S_3 = 0.36$:` },
        { type: 'equation', content: String.raw`0.36 + \frac{1}{34} \le S \le 0.36 + \frac{1}{20}, \qquad 0.389412 \le S \le 0.41 .` },
        { type: 'text', content: 'We check the bounds and compare with a long partial sum:' },
        { type: 'code', content: String.raw`f = @(x) x ./ (x.^2 + 1).^2;
S3 = sum(f(1:3));
lower = S3 + integral(f, 4, Inf);
upper = S3 + integral(f, 3, Inf);
fprintf('%.6f <= S <= %.6f\n', lower, upper)
fprintf('S_100000 = %.6f\n', sum(f(1:100000)))` },
      ],
    },
    {
      id: 'a5',
      title: 'Choose the right test',
      difficulty: 'exam',
      statement: String.raw`<p>Decide convergence. The correct option names a test whose pre-conditions actually hold.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{n}{2n + 1}$`, kind: 'choice', choices: ['converges by comparison with $\\sum 1/n^2$', 'diverges by the divergence test', 'diverges by the integral test with $p = 1$', 'converges: geometric with $r = 1/2$'], answer: 1, solution: String.raw`$\frac{n}{2n+1} \to \frac12 \ne 0$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{1}{\sqrt{n^3 + 1}}$`, kind: 'choice', choices: ['converges by limit comparison with $\\sum n^{-3/2}$', 'diverges by limit comparison with $\\sum n^{-1/2}$', 'diverges by the divergence test', 'converges because the terms tend to 0'], answer: 0, solution: String.raw`$\dfrac{1/\sqrt{n^3+1}}{n^{-3/2}} = \sqrt{\dfrac{n^3}{n^3+1}} \to 1$; $p = \tfrac32 > 1$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\sum_{n=2}^\infty \frac{1}{n\ln n}$`, kind: 'choice', choices: ['converges by comparison with $\\sum 1/n^2$', 'converges by the integral test', 'diverges by the integral test', 'diverges by the divergence test'], answer: 2, solution: String.raw`$f(x) = \frac1{x\ln x}$ is continuous, positive and decreasing on $[2, \infty)$, and $\int_2^\infty \frac{\mathrm d x}{x\ln x} = \lim_{t\to\infty}\big[\ln(\ln x)\big]_2^t = \infty$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{\sin^2 n}{n^2}$`, kind: 'choice', choices: ['diverges: $\\sin^2 n$ does not converge', 'converges by direct comparison with $\\sum 1/n^2$', 'the integral test applies', 'diverges by limit comparison with $\\sum 1/n$'], answer: 1, solution: String.raw`$0 \le \frac{\sin^2 n}{n^2} \le \frac{1}{n^2}$. The integral test does not apply: $\sin^2 x/x^2$ is not decreasing.` },
        { label: '(e)', prompt: String.raw`$\displaystyle\sum_{n=3}^\infty \frac{\ln n}{n}$`, kind: 'choice', choices: ['converges by limit comparison with $\\sum 1/n^2$', 'diverges by direct comparison: $\\frac{\\ln n}{n} \\ge \\frac1n$ for $n \\ge 3$', 'converges by the divergence test', 'diverges by the divergence test'], answer: 1, solution: String.raw`For $n \ge 3$, $\ln n > 1$, so $\frac{\ln n}{n} > \frac1n \ge 0$ and $\sum \frac1n$ diverges. (Note: the divergence test never proves convergence.)` },
      ],
    },
  ],
};
