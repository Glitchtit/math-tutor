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
        { type: 'callout', kind: 'thm', title: 'Geometric series', html: String.raw`<p>With first term $a$ and ratio $r$,</p>$$\sum_{n=0}^{\infty} a r^n = a + ar + ar^2 + \cdots = \frac{a}{1 - r} \quad\text{if } |r| < 1,$$<p>and the series diverges if $|r| \ge 1$ (and $a \ne 0$). The derivation below shows why.</p>` },
        { type: 'derive', symbolic: true, title: 'Where the geometric sum comes from', colors: { p: 1, q: 2, w: 3, S: 4, rn: 5 }, steps: [
          { kind: 'both', label: String.raw`Write $S_N$, and below it both sides $\times r$`, from: String.raw`S_N = a + \T{p-1}{ar} + \T{q-1}{ar^2} + \cdots + \T{w-1}{ar^N}`,
            to: String.raw`S_N = a + \T{p-1}{ar} + \T{q-1}{ar^2} + \cdots + \T{w-1}{ar^N},\qquad rS_N = \T{p-2}{ar} + \T{q-2}{ar^2} + \cdots + \T{w-2}{ar^N} + ar^{N+1}`,
            map: { 'p-1': ['p-1', 'p-2'], 'q-1': ['q-1', 'q-2'], 'w-1': ['w-1', 'w-2'] }, arrows: { 'p-1': '× r shifts each term', 'w-1': '' },
            why: String.raw`Multiplying every term by $r$ turns each term into the next one: $a \to ar$, $ar \to ar^2$, …, $ar^N \to ar^{N+1}$.` },
          { kind: 'cancel', label: 'Subtract the second line from the first', to: String.raw`S_N - rS_N = a - ar^{N+1}`,
            why: String.raw`Every term from $ar$ to $ar^N$ appears in both lines and cancels. Only the first term $a$ of $S_N$ and the last term $ar^{N+1}$ of $rS_N$ are left.` },
          { kind: 'factor', label: String.raw`Take out $S_N$ on the left and $a$ on the right`, from: String.raw`\T{S-1}{S_N} - r\,\T{S-2}{S_N} = a - ar^{N+1}`, to: String.raw`\T{S-1}{S_N}\,(1 - r) = a\,(1 - r^{N+1})`, map: { 'S-2': 'S-1' }, arrows: { 'S-2': 'common factor' },
            why: String.raw`Distributive law backwards on both sides.` },
          { kind: 'both', label: String.raw`Both sides $\div (1 - r)$`, to: String.raw`\T{S-1}{S_N} = a\,\dfrac{1 - r^{N+1}}{1 - r}`, why: String.raw`Allowed for $r \ne 1$ (for $r = 1$ the series is $a + a + \cdots$ and diverges).` },
          { kind: 'result', label: String.raw`Let $N \to \infty$ with $|r| < 1$`, from: String.raw`S_N = a\,\dfrac{1 - \T{rn-1}{r^{N+1}}}{1 - r}`, to: String.raw`S = a\,\dfrac{1 - \T{rn-1}{0}}{1 - r} = \dfrac{a}{1 - r}`,
            why: String.raw`$r^{N+1} \to 0$ exactly when $|r| < 1$; for $|r| \ge 1$ it does not, and the partial sums have no limit.` },
        ] },
        { type: 'derive', title: String.raw`With numbers: $\sum_{n=0}^\infty 0.6^n$ from the widget`, given: String.raw`\T{a-0}{a} = 1,\quad \T{r-0}{r} = 0.6`, colors: { a: 6, r: 7 }, steps: [
          { kind: 'sub', label: 'Put the first term and the ratio into the formula', from: String.raw`S = \dfrac{\T{a-x}{a}}{1 - \T{r-x}{r}}\qquad a = \T{a-1}{1},\ r = \T{r-1}{0.6}`, to: String.raw`S = \dfrac{\T{a-1}{1}}{1 - \T{r-1}{0.6}}`, arrows: { 'a-1': 'a = 1', 'r-1': 'r = 0.6' },
            why: String.raw`The first term is $0.6^0 = 1$ and each term is $0.6$ times the previous one; $|r| < 1$, so the formula applies.` },
          { kind: 'calc', label: String.raw`$1 \div 0.4$`, to: String.raw`S = \dfrac{1}{0.4} = 2.5`, why: String.raw`The green line in the widget.` },
          { kind: 'check', label: String.raw`The series is its first term plus $r$ times itself`, from: String.raw`S = \T{a-1}{a} + \T{r-1}{r}\,S\qquad S = \T{S-1}{2.5}`, to: String.raw`1 + 0.6\cdot\T{S-1}{2.5} = 1 + 1.5 = 2.5\ \checkmark`, arrows: { 'S-1': '' },
            why: String.raw`$1 + 0.6 + 0.6^2 + \cdots = 1 + 0.6\,(1 + 0.6 + \cdots)$. The value $2.5$ satisfies it, and the partial sums $S_4 \approx 2.31$, … climb towards it.` },
        ] },
        { type: 'derive', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} \frac{3\cdot 2^n}{5^{n+1}}$`, colors: { f: 1, r: 2 }, steps: [
          { kind: 'calc', label: String.raw`$5^{n+1} = 5\cdot 5^n$`, from: String.raw`\dfrac{3\cdot 2^n}{5^{n+1}}`, to: String.raw`\dfrac{3\cdot 2^n}{5\cdot 5^n}`, why: String.raw`Power rule: $5^{n+1} = 5^1\cdot 5^n$.` },
          { kind: 'factor', label: 'Group the powers with the same exponent', to: String.raw`\dfrac35\left(\T{r-1}{\dfrac25}\right)^n`, why: String.raw`$\frac{2^n}{5^n} = \left(\frac25\right)^n$. So the ratio is $r = \frac25$, $|r| < 1$: the series converges.` },
          { kind: 'sub', label: String.raw`First term: put $n = 1$`, to: String.raw`\T{f-1}{\dfrac35\cdot\dfrac25 = \dfrac{6}{25}}`, why: String.raw`The sum starts at $n = 1$, so the first term is the $n = 1$ term.` },
          { kind: 'sub', label: 'First term over one minus the ratio', from: String.raw`S = \dfrac{\text{first term}}{1 - r}\qquad \text{first term} = \T{f-1}{\tfrac{6}{25}},\ r = \T{r-1}{\tfrac25}`, to: String.raw`S = \dfrac{\T{f-1}{6/25}}{1 - \T{r-1}{2/5}}`, arrows: { 'f-1': '', 'r-1': '' },
            why: String.raw`No index shift needed.` },
          { kind: 'calc', label: String.raw`Dividing by $\frac35$ is multiplying by $\frac53$`, from: String.raw`S = \dfrac{6/25}{3/5}`, to: String.raw`S = \dfrac{6}{25}\cdot\dfrac53 = \dfrac{30}{75} = \dfrac25`, why: String.raw`$1 - \frac25 = \frac35$.` },
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
        { type: 'text', html: String.raw`<p><b>Example: total distance of the bouncing ball.</b> We add the first fall and the rebounds. The $k$-th rebound reaches $h_k = h_0 r^k$ and contributes $2h_k$ (up and down).</p>` },
        { type: 'derive', symbolic: true, title: String.raw`Total distance $D$ for drop height $h_0$ and rebound ratio $r$`, colors: { h: 1, r: 2, x: 3 }, steps: [
          { kind: 'start', label: 'First fall plus all rebounds', from: String.raw`D = h_0 + 2h_1 + 2h_2 + \cdots`, to: String.raw`D = h_0 + 2\sum_{k=1}^{\infty} h_0 r^k`, why: String.raw`$h_k = h_0 r^k$, and the factor $2$ is taken out of the sum.` },
          { kind: 'sub', label: String.raw`Geometric sum: first term $h_0r$, ratio $r$`, to: String.raw`D = h_0 + \dfrac{2h_0 r}{1 - r}`, why: String.raw`$\sum_{k\ge1} h_0r^k = \frac{h_0 r}{1 - r}$ for $0 < r < 1$.` },
          { kind: 'calc', label: 'Common denominator', to: String.raw`D = \dfrac{h_0(1 - r) + 2h_0 r}{1 - r}`, why: String.raw`$h_0 = \frac{h_0(1 - r)}{1 - r}$.` },
          { kind: 'cancel', label: String.raw`$-h_0r + 2h_0r = h_0r$`, from: String.raw`D = \dfrac{h_0 \T{x-1}{- h_0 r} + \T{x-2}{2h_0 r}}{1 - r}`, to: String.raw`D = \dfrac{h_0 + \T{x-2}{h_0 r}}{1 - r}`, why: String.raw`Multiply out $h_0(1 - r) = h_0 - h_0r$; one of the two $h_0r$ is used up.` },
          { kind: 'factor', label: String.raw`Take out $h_0$`, to: String.raw`D = h_0\,\dfrac{1 + r}{1 - r}`, why: String.raw`$h_0 + h_0 r = h_0(1 + r)$.` },
        ] },
        { type: 'derive', title: String.raw`With numbers: $h_0 = 2$ m, $r = 0.6$`, given: String.raw`\T{h-0}{h_0} = 2\text{ m},\quad \T{r-0}{r} = 0.6`, colors: { h: 1, r: 2 }, steps: [
          { kind: 'sub', label: 'Put the values into the formula', from: String.raw`D = \T{h-x}{h_0}\,\dfrac{1 + \T{r-x}{r}}{1 - \T{r-y}{r}}\qquad h_0 = \T{h-1}{2},\ r = \T{r-1}{0.6}`, to: String.raw`D = \T{h-1}{2}\cdot\dfrac{1 + \T{r-1}{0.6}}{1 - \T{r-2}{0.6}}`, map: { 'r-1': ['r-1', 'r-2'] }, arrows: { 'h-1': 'h₀ = 2 m', 'r-1': 'r = 0.6' },
            why: String.raw`Each number keeps the colour of its symbol.` },
          { kind: 'calc', label: String.raw`$1.6 \div 0.4 = 4$`, to: String.raw`D = 2\cdot\dfrac{1.6}{0.4} = 2\cdot 4 = 8\text{ m}`, why: String.raw`The green line in the widget.` },
          { kind: 'check', label: 'Rebounds alone', from: String.raw`D - h_0 = \dfrac{2h_0 r}{1 - r}`, to: String.raw`8 - 2 = 6 = \dfrac{2\cdot 2\cdot 0.6}{0.4} = \dfrac{2.4}{0.4}\ \checkmark`,
            why: String.raw`The rebounds contribute $6$ m both ways, so $D = 8$ m is consistent.` },
        ] },
        { type: 'text', html: String.raw`<p><b>Total time.</b> Falling from rest through height $h$ takes $t = \sqrt{2h/g}$, and rising to $h$ takes the same time. So the $k$-th rebound takes $2\sqrt{2h_0 r^k/g} = 2t_0\left(\sqrt r\right)^k$ with $t_0 = \sqrt{2h_0/g}$: the times form a geometric series with ratio $\sqrt r$ (not $r$!).</p>` },
        { type: 'derive', symbolic: true, title: String.raw`Total time $T$`, colors: { t: 1, s: 2, x: 3 }, steps: [
          { kind: 'start', label: 'First fall plus all rebound times', from: String.raw`T = t_0 + 2t_0\sqrt r + 2t_0\left(\sqrt r\right)^2 + \cdots`, to: String.raw`T = t_0 + 2t_0\sum_{k=1}^{\infty}\left(\sqrt r\right)^k`, why: String.raw`Take $2t_0$ out of every rebound term.` },
          { kind: 'sub', label: String.raw`Geometric sum: first term $\sqrt r$, ratio $\sqrt r$`, to: String.raw`T = t_0 + \dfrac{2t_0\sqrt r}{1 - \sqrt r}`, why: String.raw`$0 < \sqrt r < 1$, so the sum converges.` },
          { kind: 'calc', label: 'Common denominator', to: String.raw`T = \dfrac{t_0(1 - \sqrt r) + 2t_0\sqrt r}{1 - \sqrt r}`, why: String.raw`$t_0 = \frac{t_0(1 - \sqrt r)}{1 - \sqrt r}$.` },
          { kind: 'cancel', label: String.raw`$-t_0\sqrt r + 2t_0\sqrt r = t_0\sqrt r$`, from: String.raw`T = \dfrac{t_0 \T{x-1}{- t_0\sqrt r} + \T{x-2}{2t_0\sqrt r}}{1 - \sqrt r}`, to: String.raw`T = \dfrac{t_0 + \T{x-2}{t_0\sqrt r}}{1 - \sqrt r}`, why: String.raw`Same pattern as for the distance.` },
          { kind: 'factor', label: String.raw`Take out $t_0$`, to: String.raw`T = t_0\,\dfrac{1 + \sqrt r}{1 - \sqrt r}`, why: String.raw`The distance formula with $r$ replaced by $\sqrt r$ (and $h_0$ by $t_0$).` },
        ] },
        { type: 'derive', title: String.raw`With numbers: $h_0 = 2$ m, $r = 0.6$, $g = 9.81\ \mathrm{m/s^2}$`, given: String.raw`h_0 = 2\text{ m},\quad r = 0.6,\quad g = 9.81\ \mathrm{m/s^2}`, colors: { t: 1, s: 2 }, steps: [
          { kind: 'calc', label: String.raw`First the fall time $t_0$ and $\sqrt r$`, from: String.raw`t_0 = \sqrt{2h_0/g},\qquad \sqrt r`, to: String.raw`t_0 = \sqrt{4/9.81} \approx 0.6386\text{ s},\qquad \sqrt{0.6} \approx 0.7746`, why: String.raw`$2h_0 = 4$ m.` },
          { kind: 'sub', label: 'Put them into the formula', from: String.raw`T = \T{t-x}{t_0}\,\dfrac{1 + \T{s-x}{\sqrt r}}{1 - \T{s-y}{\sqrt r}}\qquad t_0 = \T{t-1}{0.6386},\ \sqrt r = \T{s-1}{0.7746}`, to: String.raw`T = \T{t-1}{0.6386}\cdot\dfrac{1 + \T{s-1}{0.7746}}{1 - \T{s-2}{0.7746}}`, map: { 's-1': ['s-1', 's-2'] }, arrows: { 't-1': 't₀', 's-1': '√r' },
            why: String.raw`Each number keeps the colour of its symbol.` },
          { kind: 'calc', label: String.raw`$1.7746 \div 0.2254 \approx 7.873$`, to: String.raw`T \approx 0.6386\cdot 7.873 \approx 5.03\text{ s}`, why: String.raw`The ball bounces infinitely often in a finite time.` },
          { kind: 'check', label: String.raw`Multiply back: $T(1 - \sqrt r) = t_0(1 + \sqrt r)$`, from: String.raw`T\,(1 - \sqrt r) = t_0\,(1 + \sqrt r)`, to: String.raw`5.028\cdot 0.2254 \approx 1.133 \approx 0.6386\cdot 1.7746\ \checkmark`, why: String.raw`Both sides agree to rounding.` },
        ] },
        { type: 'text', html: String.raw`<p><b>Multiple reflections.</b> A glass pane reflects a fraction $\rho$ of incoming light, absorbs $\alpha$ and transmits $\tau$, with $\rho + \alpha + \tau = 1$. With two panes, light bounces back and forth in the gap; each round trip multiplies the intensity by $\rho^2$. The fraction that finally passes both panes is:</p>` },
        { type: 'derive', symbolic: true, title: 'Transmission through two panes', colors: { tau: 1, rho: 2 }, steps: [
          { kind: 'start', label: 'Direct pass, then one, two, … round trips', from: String.raw`T = \tau^2 + \tau\rho^2\tau + \tau\rho^4\tau + \cdots`, to: String.raw`T = \T{tau-1}{\tau^2} + \T{tau-2}{\tau^2}\rho^2 + \T{tau-3}{\tau^2}\rho^4 + \cdots`, why: String.raw`Each path passes both panes once ($\tau\cdot\tau$) and makes $k$ round trips in the gap ($\rho^{2k}$).` },
          { kind: 'factor', label: String.raw`Take out $\tau^2$`, to: String.raw`T = \T{tau-1}{\tau^2}\,\big(1 + \rho^2 + \rho^4 + \cdots\big) = \tau^2\sum_{k=0}^{\infty}\big(\T{rho-1}{\rho^2}\big)^k`, map: { 'tau-2': 'tau-1', 'tau-3': 'tau-1' }, arrows: { 'tau-2': 'common factor', 'tau-3': '' },
            why: String.raw`What is left in the bracket is geometric with first term $1$ and ratio $\rho^2$.` },
          { kind: 'result', label: String.raw`Geometric sum with ratio $\rho^2 < 1$`, to: String.raw`T = \dfrac{\T{tau-1}{\tau^2}}{1 - \T{rho-1}{\rho^2}}`, why: String.raw`$\sum_k (\rho^2)^k = \frac{1}{1 - \rho^2}$ because $0 \le \rho < 1$.` },
        ] },
        { type: 'derive', title: String.raw`With numbers: $\rho = 0.3$, $\tau = 0.5$`, given: String.raw`\T{rho-0}{\rho} = 0.3,\quad \T{tau-0}{\tau} = 0.5`, colors: { tau: 1, rho: 2 }, steps: [
          { kind: 'sub', label: 'Put the values into the formula', from: String.raw`T = \dfrac{\T{tau-x}{\tau}^2}{1 - \T{rho-x}{\rho}^2}\qquad \tau = \T{tau-1}{0.5},\ \rho = \T{rho-1}{0.3}`, to: String.raw`T = \dfrac{\T{tau-1}{0.5}^2}{1 - \T{rho-1}{0.3}^2}`, arrows: { 'tau-1': 'τ = 0.5', 'rho-1': 'ρ = 0.3' },
            why: String.raw`Each number keeps the colour of its symbol.` },
          { kind: 'calc', label: 'Square, then divide', to: String.raw`T = \dfrac{0.25}{1 - 0.09} = \dfrac{0.25}{0.91} \approx 0.275`, why: String.raw`A little more than the $\tau^2 = 0.25$ of a single pass: some light gets a second chance.` },
          { kind: 'check', label: String.raw`Multiply back: $T(1 - \rho^2) = \tau^2$`, from: String.raw`T\,(1 - \rho^2) = \tau^2`, to: String.raw`0.2747\cdot 0.91 \approx 0.250 = 0.5^2\ \checkmark`, why: String.raw`The formula is satisfied.` },
        ] },
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
        { type: 'derive', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} \frac{2}{n^2 + 4n + 3}$`, colors: { k: 1, a: 2, b: 3, c: 4, d: 5, e: 6, f: 7 }, steps: [
          { kind: 'factor', label: 'Factor the denominator', from: String.raw`\dfrac{2}{n^2 + 4n + 3}`, to: String.raw`\dfrac{2}{(n+1)(n+3)}`, why: String.raw`$1\cdot 3 = 3$ and $1 + 3 = 4$.` },
          { kind: 'expand', label: 'Partial fractions (cover-up)', to: String.raw`\dfrac{1}{n+1} - \dfrac{1}{n+3}`,
            why: String.raw`$\frac{2}{(n+1)(n+3)} = \frac{A}{n+1} + \frac{B}{n+3}$. Cover $(n+1)$ and put $n = -1$: $A = \frac{2}{-1+3} = 1$. Cover $(n+3)$ and put $n = -3$: $B = \frac{2}{-3+1} = -1$.` },
          { kind: 'expand', label: String.raw`Write out the partial sum $S_N$`, from: String.raw`S_N = \sum_{n=1}^{N}\left(\dfrac{1}{n+1} - \dfrac{1}{n+3}\right)`,
            to: String.raw`S_N = \left(\T{k-1}{\tfrac12} \T{a-1}{- \tfrac14}\right) + \left(\T{k-2}{\tfrac13} \T{b-1}{- \tfrac15}\right) + \left(\T{a-2}{\tfrac14} \T{c-1}{- \tfrac16}\right) + \left(\T{b-2}{\tfrac15} \T{d-1}{- \tfrac17}\right) + \cdots + \left(\T{e-1}{\tfrac1N} \T{k-3}{- \tfrac1{N+2}}\right) + \left(\T{f-1}{\tfrac1{N+1}} \T{k-4}{- \tfrac1{N+3}}\right)`,
            why: String.raw`Terms for $n = 1, 2, 3, 4, \dots, N-1, N$. Each negative term $-\frac1{n+3}$ reappears as a positive term two places later.` },
          { kind: 'cancel', label: 'Cancel each pair', to: String.raw`S_N = \T{k-1}{\tfrac12} + \T{k-2}{\tfrac13} \T{k-3}{- \tfrac1{N+2}} \T{k-4}{- \tfrac1{N+3}}`,
            why: String.raw`$-\frac14$ cancels $+\frac14$, $-\frac15$ cancels $+\frac15$; likewise $-\frac16$, $-\frac17$, $+\frac1N$, $+\frac1{N+1}$ cancel partners hidden in the dots. Only the first two positive and the last two negative terms survive.` },
          { kind: 'result', label: String.raw`Let $N \to \infty$`, to: String.raw`S = \T{k-1}{\tfrac12} + \T{k-2}{\tfrac13} = \tfrac56`, why: String.raw`$\frac1{N+2} \to 0$ and $\frac1{N+3} \to 0$; $\frac12 + \frac13 = \frac36 + \frac26$.` },
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
        { type: 'text', html: String.raw`<p><b>Example:</b> bound $\displaystyle S = \sum_{n=1}^{\infty} \frac1{n^3}$ using $S_5$. First the pre-conditions for $f(x) = x^{-3}$ on $[1, \infty)$: it is continuous and positive there, and $f'(x) = -3x^{-4} < 0$, so it is decreasing. The integral test applies.</p>` },
        { type: 'derive', colors: { R: 1, S: 2 }, steps: [
          { kind: 'calc', label: 'The partial sum', from: String.raw`S_5 = 1 + \tfrac18 + \tfrac1{27} + \tfrac1{64} + \tfrac1{125}`, to: String.raw`\T{S-1}{S_5} \approx 1.185662`, why: String.raw`Five terms added on a calculator.` },
          { kind: 'calculus', label: 'The remainder integral', from: String.raw`\int_N^\infty x^{-3}\,\mathrm d x`, to: String.raw`\lim_{t\to\infty}\Big[-\dfrac{1}{2x^2}\Big]_N^t = \lim_{t\to\infty}\left(-\dfrac{1}{2t^2} + \dfrac{1}{2N^2}\right) = \dfrac{1}{2N^2}`, why: String.raw`An antiderivative of $x^{-3}$ is $\frac{x^{-2}}{-2}$; the term with $t$ tends to $0$.` },
          { kind: 'sub', label: String.raw`Bounds with $N + 1 = 6$ (below) and $N = 5$ (above)`, from: String.raw`\int_{6}^\infty f \le R_5 \le \int_{5}^\infty f`, to: String.raw`\dfrac{1}{2\cdot 36} \le \T{R-1}{R_5} \le \dfrac{1}{2\cdot 25}\quad\text{i.e.}\quad 0.013889 \le R_5 \le 0.02`, why: String.raw`Put $N = 6$ and $N = 5$ into $\frac{1}{2N^2}$.` },
          { kind: 'both', label: String.raw`All parts $+\,S_5$`, from: String.raw`0.013889 \le \T{R-1}{R_5} \le 0.02\qquad S_5 \approx \T{S-1}{1.185662}`, to: String.raw`1.199551 \le \T{S-1}{S_5} + \T{R-1}{R_5} = S \le 1.205662`, arrows: { 'S-1': '+S₅ on all parts' },
            why: String.raw`$S = S_5 + R_5$. Adding the same number to all parts keeps the inequalities. (The true value is $1.2020569\ldots$)` },
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
        { type: 'text', html: String.raw`<p><b>Example:</b> $\displaystyle\sum_{n=1}^{\infty} \frac{n+1}{n^3+2}$. We choose the comparison series by keeping the dominant powers: $\dfrac{n+1}{n^3 + 2} \approx \dfrac{n}{n^3} = \dfrac1{n^2}$, so $b_n = \dfrac{1}{n^2}$. Both $a_n$ and $b_n$ are positive. Then we compute the limit of the ratio:</p>` },
        { type: 'derive', colors: { b: 1, z: 2 }, steps: [
          { kind: 'calc', label: String.raw`Dividing by $\frac1{n^2}$ is multiplying by $n^2$`, from: String.raw`\dfrac{a_n}{b_n} = \dfrac{n+1}{n^3+2} \div \T{b-1}{\dfrac{1}{n^2}}`, to: String.raw`\dfrac{a_n}{b_n} = \dfrac{(n+1)\,\T{b-1}{n^2}}{n^3+2}`, arrows: { 'b-1': '÷ 1/n² = × n²' },
            why: String.raw`Dividing by a fraction is multiplying by its reciprocal.` },
          { kind: 'expand', label: 'Multiply out', to: String.raw`\dfrac{a_n}{b_n} = \dfrac{n^3 + n^2}{n^3 + 2}`, why: String.raw`$(n + 1)n^2 = n^3 + n^2$.` },
          { kind: 'both', label: String.raw`Numerator and denominator $\div n^3$`, to: String.raw`\dfrac{1 + \T{z-1}{\frac1n}}{1 + \T{z-2}{\frac{2}{n^3}}}`, why: String.raw`The fraction is unchanged; now every term but the leading ones has $n$ in a denominator.` },
          { kind: 'result', label: String.raw`$\frac{c}{n^p} \to 0$`, to: String.raw`\to \dfrac{1 + \T{z-1}{0}}{1 + \T{z-2}{0}} = 1`, why: String.raw`$0 < 1 < \infty$. Since $\sum \frac1{n^2}$ is a convergent $p$-series ($p = 2 > 1$), $\sum \frac{n+1}{n^3+2}$ converges by the limit comparison test.` },
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
        { label: '(a)', prompt: String.raw`$\displaystyle\sum_{n=0}^{\infty} \frac{(-2)^n}{3^{n+1}}$`, kind: 'numeric', answer: '1/5', solution: [
          { type: 'text', html: String.raw`<p>We write the term as (number) $\times$ (ratio)$^n$, read off the first term and the ratio, and use first term over one minus the ratio.</p>` },
          { type: 'derive', colors: { f: 1, r: 2 }, steps: [
            { kind: 'factor', label: String.raw`$3^{n+1} = 3\cdot 3^n$`, from: String.raw`\dfrac{(-2)^n}{3^{n+1}}`, to: String.raw`\dfrac13\left(\T{r-1}{-\dfrac23}\right)^n`, why: String.raw`$\frac{(-2)^n}{3\cdot 3^n} = \frac13\left(\frac{-2}{3}\right)^n$. Ratio $r = -\frac23$, $|r| < 1$: convergent.` },
            { kind: 'sub', label: String.raw`First term ($n = 0$) and ratio into the formula`, from: String.raw`S = \dfrac{\text{first term}}{1 - r}\qquad \text{first term} = \T{f-1}{\tfrac13},\ r = \T{r-1}{-\tfrac23}`, to: String.raw`S = \dfrac{\T{f-1}{1/3}}{1 - (\T{r-1}{-2/3})}`, arrows: { 'f-1': '', 'r-1': '' }, why: String.raw`At $n = 0$ the power is $1$, so the first term is $\frac13$.` },
            { kind: 'calc', label: String.raw`$1 + \frac23 = \frac53$`, to: String.raw`S = \dfrac{1/3}{5/3} = \dfrac13\cdot\dfrac35 = \dfrac15`, why: String.raw`Minus a negative number is plus; dividing by $\frac53$ is multiplying by $\frac35$.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\sum_{n=2}^{\infty} \frac{5}{4^n}$`, kind: 'numeric', answer: '5/12', solution: [
          { type: 'text', html: String.raw`<p>The first term is the $n = 2$ term, the ratio is $\frac14$; we use first term over one minus the ratio.</p>` },
          { type: 'derive', colors: { f: 1, r: 2 }, steps: [
            { kind: 'sub', label: 'First term and ratio into the formula', from: String.raw`S = \dfrac{\text{first term}}{1 - r}\qquad \text{first term} = \tfrac{5}{4^2} = \T{f-1}{\tfrac{5}{16}},\ r = \T{r-1}{\tfrac14}`, to: String.raw`S = \dfrac{\T{f-1}{5/16}}{1 - \T{r-1}{1/4}}`, arrows: { 'f-1': '', 'r-1': '' }, why: String.raw`Each term is $\frac14$ of the previous one; the sum starts at $n = 2$.` },
            { kind: 'calc', label: String.raw`$1 - \frac14 = \frac34$`, to: String.raw`S = \dfrac{5/16}{3/4} = \dfrac{5}{16}\cdot\dfrac43 = \dfrac{20}{48} = \dfrac{5}{12}`, why: String.raw`Dividing by $\frac34$ is multiplying by $\frac43$.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`The repeating decimal $0.272727\ldots = 0.\overline{27}$ as a fraction.`, kind: 'numeric', answer: '3/11', tol: 1e-9, solution: [
          { type: 'text', html: String.raw`<p>Each block of two digits is $\frac{1}{100}$ of the previous one, so the decimal is a geometric series.</p>` },
          { type: 'derive', steps: [
            { kind: 'expand', label: 'Split into blocks of two digits', from: String.raw`0.\overline{27}`, to: String.raw`\dfrac{27}{100} + \dfrac{27}{100^2} + \dfrac{27}{100^3} + \cdots`, why: String.raw`$0.27 + 0.0027 + 0.000027 + \cdots$.` },
            { kind: 'sub', label: String.raw`First term $\frac{27}{100}$, ratio $\frac1{100}$`, to: String.raw`\dfrac{27/100}{1 - 1/100} = \dfrac{27/100}{99/100}`, why: String.raw`$|r| < 1$, so first term over one minus the ratio applies.` },
            { kind: 'cancel', label: String.raw`The $\frac{1}{100}$ cancels`, to: String.raw`\dfrac{27}{99} = \dfrac{3}{11}`, why: String.raw`Then divide top and bottom by $9$.` },
          ] },
        ] },
        { label: '(d)', prompt: String.raw`For which $x$ does $\displaystyle\sum_{n=0}^{\infty} \frac{(x-1)^n}{2^n}$ converge?`, kind: 'choice', choices: [String.raw`$-1 < x < 3$`, String.raw`$-1 \le x \le 3$`, String.raw`$0 < x < 2$`, String.raw`$-3 < x < 1$`], answer: 0, solution: [
          { type: 'text', html: String.raw`<p>The series is geometric with ratio $r = \frac{x-1}{2}$; it converges exactly when $|r| < 1$, which we solve for $x$.</p>` },
          { type: 'derive', colors: { o: 1 }, steps: [
            { kind: 'start', label: String.raw`Condition $|r| < 1$`, from: String.raw`\left|\dfrac{x-1}{2}\right| < 1`, to: String.raw`\dfrac{|x-1|}{2} < 1`, why: String.raw`$|2| = 2$.` },
            { kind: 'both', label: String.raw`Both sides $\times 2$`, to: String.raw`|x - 1| < 2`, why: String.raw`Multiplying by a positive number keeps $<$.` },
            { kind: 'calc', label: 'Remove the absolute value', to: String.raw`-2 < x \T{o-1}{- 1} < 2`, why: String.raw`$|u| < 2$ means $u$ lies between $-2$ and $2$.` },
            { kind: 'both', label: String.raw`All parts $+1$`, to: String.raw`-1 < x < 3`, why: String.raw`At $x = -1$ and $x = 3$, $|r| = 1$ and the series diverges, so the endpoints are excluded.` },
          ] },
        ] },
      ],
    },
    {
      id: 'a2',
      title: 'Reflections and a bouncing ball',
      difficulty: 'core',
      hw: 'HW5-style',
      statement: String.raw`<p>(i) Two identical tinted panes each reflect $40\,\%$, absorb $10\,\%$ and transmit $50\,\%$ of the light hitting them (from either side). Light falls on the first pane and bounces back and forth between the panes.</p><p>(ii) A ball is dropped from $h_0 = 1.25$ m. After each impact it rises to $64\,\%$ of its previous height. Use $g = 9.81\ \mathrm{m/s^2}$ and the fall time $t = \sqrt{2h/g}$ from height $h$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`(i) What fraction of the incoming light is transmitted through both panes?`, kind: 'numeric', answer: '25/84', tol: 1e-5, hint: String.raw`Each extra round trip in the gap multiplies by $\rho^2 = 0.16$.`, solution: [
          { type: 'text', html: String.raw`<p>We use the two-pane formula $T = \frac{\tau^2}{1 - \rho^2}$ from the lesson with $\tau = 0.5$, $\rho = 0.4$.</p>` },
          { type: 'derive', colors: { tau: 1, rho: 2 }, steps: [
            { kind: 'sub', label: 'Put in the values', from: String.raw`T = \tau^2\big(1 + \rho^2 + \rho^4 + \cdots\big) = \dfrac{\T{tau-x}{\tau}^2}{1 - \T{rho-x}{\rho}^2}\qquad \tau = \T{tau-1}{0.5},\ \rho = \T{rho-1}{0.4}`, to: String.raw`T = \dfrac{\T{tau-1}{0.5}^2}{1 - \T{rho-1}{0.4}^2}`, arrows: { 'tau-1': '', 'rho-1': '' }, why: String.raw`Geometric series with ratio $\rho^2 = 0.16$.` },
            { kind: 'calc', label: 'Square, then divide', to: String.raw`T = \dfrac{0.25}{0.84} = \dfrac{25}{84} \approx 0.2976`, why: String.raw`Multiply top and bottom by $100$.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`(i) What fraction is reflected back to the source side in total?`, kind: 'numeric', answer: '0.4 + 0.1/0.84', tol: 1e-5, hint: String.raw`Direct reflection $\rho$, plus light that entered the gap, was reflected by the second pane and passed back through the first: $\tau\rho\tau$, $\tau\rho^3\tau$, …`, solution: [
          { type: 'text', html: String.raw`<p>We add the direct reflection and the geometric series of light that went through the first pane, bounced, and came back out.</p>` },
          { type: 'derive', colors: { g: 1 }, steps: [
            { kind: 'factor', label: String.raw`Take out $\tau^2\rho$ from the paths through the gap`, from: String.raw`R = \rho + \tau\rho\tau + \tau\rho^3\tau + \cdots`, to: String.raw`R = \rho + \tau^2\rho\,\T{g-1}{\big(1 + \rho^2 + \rho^4 + \cdots\big)}`, why: String.raw`Each path through the gap passes the first pane twice ($\tau^2$), reflects once more at the second pane ($\rho$), plus $k$ extra round trips ($\rho^{2k}$).` },
            { kind: 'sub', label: String.raw`Geometric sum with ratio $\rho^2$`, to: String.raw`R = \rho + \dfrac{\tau^2\rho}{\T{g-1}{1 - \rho^2}}`, why: String.raw`$\sum_k \rho^{2k} = \frac{1}{1 - \rho^2}$.` },
            { kind: 'sub', label: String.raw`$\rho = 0.4$, $\tau = 0.5$`, from: String.raw`R = \rho + \dfrac{\tau^2\rho}{1 - \rho^2}`, to: String.raw`R = 0.4 + \dfrac{0.25\cdot 0.4}{0.84} \approx 0.4 + 0.1190 = 0.5190`, why: String.raw`The absorbed fraction is $1 - T - R \approx 0.1833$.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`(ii) Total distance travelled by the ball, in metres.`, kind: 'numeric', answer: '1.25*1.64/0.36', tol: 1e-5, solution: [
          { type: 'text', html: String.raw`<p>We use the distance formula from the lesson, $D = h_0\frac{1 + r}{1 - r}$, with $h_0 = 1.25$ m and $r = 0.64$.</p>` },
          { type: 'derive', colors: { h: 1, r: 2 }, steps: [
            { kind: 'sub', label: 'Put in the values', from: String.raw`D = h_0 + 2\sum_{k\ge1} h_0 r^k = \T{h-x}{h_0}\dfrac{1 + \T{r-x}{r}}{1 - \T{r-y}{r}}\qquad h_0 = \T{h-1}{1.25},\ r = \T{r-1}{0.64}`, to: String.raw`D = \T{h-1}{1.25}\cdot\dfrac{1 + \T{r-1}{0.64}}{1 - \T{r-2}{0.64}}`, map: { 'r-1': ['r-1', 'r-2'] }, arrows: { 'h-1': '', 'r-1': '' }, why: String.raw`First fall plus rebounds, summed as in the lesson.` },
            { kind: 'calc', label: 'Calculate', to: String.raw`D = 1.25\cdot\dfrac{1.64}{0.36} \approx 5.694\text{ m}`, why: String.raw`$1.64/0.36 \approx 4.556$.` },
          ] },
        ] },
        { label: '(d)', prompt: String.raw`(ii) Total time until the ball comes to rest, in seconds.`, kind: 'numeric', answer: 'sqrt(2*1.25/9.81)*1.8/0.2', tol: 1e-5, hint: String.raw`The times form a geometric series with ratio $\sqrt{0.64} = 0.8$.`, solution: [
          { type: 'text', html: String.raw`<p>We compute the first fall time $t_0$, then use $T = t_0\frac{1 + \sqrt r}{1 - \sqrt r}$ with $\sqrt r = 0.8$ (each rebound takes $2t_0(0.8)^k$).</p>` },
          { type: 'derive', colors: { t: 1, s: 2 }, steps: [
            { kind: 'calc', label: 'First fall time', from: String.raw`t_0 = \sqrt{2h_0/g}`, to: String.raw`\T{t-1}{t_0} = \sqrt{2\cdot 1.25/9.81} \approx 0.5048\text{ s}`, why: String.raw`Free fall from rest through $1.25$ m.` },
            { kind: 'sub', label: String.raw`Put $t_0$ and $\sqrt r = 0.8$ into the formula`, from: String.raw`T = \T{t-1}{t_0}\,\dfrac{1 + \T{s-1}{\sqrt r}}{1 - \T{s-2}{\sqrt r}}`, to: String.raw`T = \T{t-1}{t_0}\cdot\dfrac{1 + \T{s-1}{0.8}}{1 - \T{s-2}{0.8}}`, why: String.raw`$\sqrt{0.64} = 0.8$.` },
            { kind: 'calc', label: String.raw`$1.8 \div 0.2 = 9$`, to: String.raw`T = 9\,\T{t-1}{t_0} \approx 9\cdot 0.5048 \approx 4.543\text{ s}`, why: String.raw`A finite total time despite infinitely many bounces.` },
          ] },
        ] },
      ],
    },
    {
      id: 'a3',
      title: 'A telescoping series',
      difficulty: 'core',
      hw: 'HW5-style',
      statement: String.raw`<p>Consider $\displaystyle\sum_{n=1}^{\infty} \frac{1}{2 + 3 + 4 + \cdots + (n+1)}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Give a closed formula for the term $a_n$ in terms of $n$.`, kind: 'expression', variable: 'n', answer: '2./(n.*(n+3))', domain: [1, 6], hint: String.raw`$2 + 3 + \cdots + (n+1) = (1 + 2 + \cdots + (n+1)) - 1$.`, solution: [
          { type: 'text', html: String.raw`<p>We use $1 + 2 + \cdots + m = \frac{m(m+1)}{2}$ with $m = n + 1$ and subtract the missing $1$.</p>` },
          { type: 'derive', steps: [
            { kind: 'sub', label: String.raw`Sum formula with $m = n + 1$, minus the term $1$`, from: String.raw`2 + 3 + \cdots + (n+1)`, to: String.raw`\dfrac{(n+1)(n+2)}{2} - 1`, why: String.raw`The sum from $1$ to $n + 1$, without its first term.` },
            { kind: 'expand', label: 'Common denominator and multiply out', to: String.raw`\dfrac{n^2 + 3n + 2 - 2}{2} = \dfrac{n^2 + 3n}{2}`, why: String.raw`$1 = \frac22$ and $(n+1)(n+2) = n^2 + 3n + 2$; $+2 - 2 = 0$.` },
            { kind: 'result', label: 'Take the reciprocal', to: String.raw`a_n = \dfrac{2}{n^2 + 3n} = \dfrac{2}{n(n+3)}`, why: String.raw`$a_n$ is $1$ divided by this sum.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`Which argument proves convergence?`, kind: 'choice', choices: [String.raw`$a_n \to 0$, so the series converges.`, String.raw`$0 < a_n \le \frac{2}{n^2}$ and $\sum \frac{2}{n^2}$ converges ($p = 2$), so it converges by direct comparison.`, String.raw`$a_n \le \frac{2}{n}$ and $\sum \frac2n$ diverges, so it converges.`, String.raw`Ratio of consecutive terms tends to $1$, so it converges.`], answer: 1, solution: String.raw`$n(n+3) \ge n^2$ gives $0 < a_n \le 2/n^2$; comparison with a convergent $p$-series. Option 1 confuses a necessary condition with a sufficient one, option 3 compares in the useless direction.` },
        { label: '(c)', prompt: String.raw`Find the sum of the series.`, kind: 'numeric', answer: '11/9', tol: 1e-8, hint: String.raw`$\dfrac{2}{n(n+3)} = \dfrac23\left(\dfrac1n - \dfrac1{n+3}\right)$.`, solution: [
          { type: 'text', html: String.raw`<p>With the partial fraction split from the hint, the partial sum telescopes: each negative term cancels a positive term three places later.</p>` },
          { type: 'derive', colors: { k: 1, a: 2, b: 3, c: 4, d: 5, e: 6 }, steps: [
            { kind: 'expand', label: String.raw`Write out $S_N$`, from: String.raw`S_N = \dfrac23\sum_{n=1}^{N}\left(\dfrac1n - \dfrac1{n+3}\right)`,
              to: String.raw`S_N = \dfrac23\Big[\big(\T{k-1}{1} \T{a-1}{- \tfrac14}\big) + \big(\T{k-2}{\tfrac12} \T{b-1}{- \tfrac15}\big) + \big(\T{k-3}{\tfrac13} \T{c-1}{- \tfrac16}\big) + \big(\T{a-2}{\tfrac14} \T{d-1}{- \tfrac17}\big) + \cdots + \big(\T{e-1}{\tfrac1N} \T{k-6}{- \tfrac1{N+3}}\big)\Big]`,
              why: String.raw`The terms for $n = 1, 2, 3, 4, \dots, N$.` },
            { kind: 'cancel', label: 'Cancel each pair', to: String.raw`S_N = \dfrac23\left(\T{k-1}{1} + \T{k-2}{\tfrac12} + \T{k-3}{\tfrac13} - \tfrac1{N+1} - \tfrac1{N+2} \T{k-6}{- \tfrac1{N+3}}\right)`,
              why: String.raw`$-\frac14$ cancels $+\frac14$; $-\frac15$, $-\frac16$, $-\frac17$ and $+\frac1N$ cancel partners in the dots. The first three positive terms survive, and the last three negative ones ($-\frac1{N+1}$ and $-\frac1{N+2}$ come from the terms $n = N-2$ and $n = N-1$ in the dots).` },
            { kind: 'result', label: String.raw`Let $N \to \infty$`, to: String.raw`S = \dfrac23\left(\T{k-1}{1} + \T{k-2}{\tfrac12} + \T{k-3}{\tfrac13}\right) = \dfrac23\cdot\dfrac{11}{6} = \dfrac{11}{9}`, why: String.raw`The three $N$-terms tend to $0$; $1 + \frac12 + \frac13 = \frac{11}{6}$.` },
          ] },
        ] },
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
        { label: '(b)', prompt: String.raw`Lower bound for the sum $S$ from $S_3$ and the integral test.`, kind: 'numeric', answer: '0.36 + 1/34', tol: 1e-7, solution: [
          { type: 'text', html: String.raw`<p>We compute the tail integral once for general $N$, then use the lower bound $S \ge S_3 + \int_4^\infty f$.</p>` },
          { type: 'derive', colors: { I: 1 }, steps: [
            { kind: 'calculus', label: String.raw`Substitution $u = x^2 + 1$`, from: String.raw`\int_N^\infty \dfrac{x}{(x^2+1)^2}\,\mathrm d x`, to: String.raw`\lim_{t\to\infty}\Big[-\dfrac{1}{2(x^2+1)}\Big]_N^t`, why: String.raw`$\mathrm d u = 2x\,\mathrm d x$, so $\int \frac{x}{u^2}\,\mathrm d x = \frac12\int u^{-2}\,\mathrm d u = -\frac{1}{2u}$.` },
            { kind: 'calc', label: String.raw`The term at $t$ tends to $0$`, to: String.raw`\T{I-1}{\dfrac{1}{2(N^2+1)}}`, why: String.raw`$-\frac{1}{2(t^2+1)} \to 0$, and minus the lower limit gives $+\frac{1}{2(N^2+1)}$.` },
            { kind: 'sub', label: String.raw`Lower bound: $N = 4$`, from: String.raw`S \ge S_3 + \T{I-1}{\int_4^\infty f}`, to: String.raw`S \ge 0.36 + \T{I-1}{\dfrac{1}{2\cdot 17}} = 0.36 + \dfrac1{34} \approx 0.389412`, why: String.raw`$4^2 + 1 = 17$.` },
          ] },
        ] },
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
