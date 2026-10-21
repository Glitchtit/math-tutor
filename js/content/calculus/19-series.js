// Module 19: Infinite series — partial sums, geometric and telescoping series, divergence,
// integral, comparison and limit comparison tests.
// Rewritten to the hand-holding standard: every problem type is worked (steps), then guided, then assigned.

export default {
  id: 'series',
  number: 19,
  part: 'series',
  hw: 'HW5',
  title: 'Infinite series and convergence tests',
  summary: 'Series as limits of partial sums: geometric series (including repeating decimals and series with a variable) and their applications (reflections, bouncing balls), telescoping series via partial fractions, the n-th term test, p-series, the integral test with remainder bounds, and the comparison and limit comparison tests — always with their pre-conditions checked.',
  intro: String.raw`<p>An infinite sum $a_1 + a_2 + a_3 + \cdots$ is defined as the limit of its <b>partial sums</b>. Only two kinds of series can be summed exactly by hand — geometric and telescoping — so most of this module is about <b>tests</b> that decide convergence without knowing the sum, and about bounding the error when a partial sum is used instead. Every test has pre-conditions; graders check that you state and verify them.</p><p>One idea per lesson: each lesson shows the method fully worked, lets you do one step by step, and the assignments then use exactly those methods.</p>`,
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'partial-sums',
      title: 'Partial sums and geometric series',
      blocks: [
        { type: 'text', html: String.raw`<p>The top panel shows the terms $a_n = 0.6^n$, $n = 0, 1, 2, \dots$; the bottom panel shows the running totals $S_N$. Add terms: the partial sums climb towards the green line $2.5$ but never reach it.</p>` },
        { type: 'widget', name: 'series', config: {
          title: 'Geometric series Σ 0.6^n',
          term: '0.6.^n', n0: 0, nmax: 30, N: 4, sum: 2.5, sumTex: String.raw`\frac{1}{1 - 0.6} = 2.5`,
        } },
        { type: 'callout', kind: 'def', title: 'Convergent series', html: String.raw`<p>The symbol $\sum_{n=1}^{\infty} a_n$ means "add the terms $a_1, a_2, a_3, \dots$". The <b>partial sum</b> $S_N = \sum_{n=1}^{N} a_n = a_1 + \cdots + a_N$ adds only the first $N$ terms. The series <b>converges</b> to the sum $S$ if $S_N \to S$ as $N \to \infty$; otherwise it diverges. The <b>remainder</b> (tail) is $R_N = S - S_N = \sum_{n=N+1}^{\infty} a_n$.</p>` },
        { type: 'steps', title: String.raw`Partial sums of $\displaystyle\sum_{n=1}^{\infty} \frac{1}{2^n}$, term by term`, steps: [
          { do: String.raw`$S_1 = \dfrac12$`, why: 'Only the first term.' },
          { do: String.raw`$S_2 = \dfrac12 + \dfrac14 = \dfrac34$`, why: String.raw`Add $a_2 = \frac14$.` },
          { do: String.raw`$S_3 = \dfrac34 + \dfrac18 = \dfrac78$`, why: String.raw`Add $a_3 = \frac18$; $\frac34 = \frac68$.` },
          { do: String.raw`$S_4 = \dfrac78 + \dfrac1{16} = \dfrac{15}{16}$`, why: String.raw`Add $a_4 = \frac{1}{16}$.` },
          { do: String.raw`$S_N = 1 - \dfrac{1}{2^N}$`, why: String.raw`Pattern: each partial sum misses $1$ by exactly the last term added. (Check: $1 - \frac1{16} = \frac{15}{16}$.)` },
          { do: String.raw`$S_N \to 1 - 0 = 1$`, why: String.raw`$\frac{1}{2^N} \to 0$. The series converges with sum $1$.` },
        ] },
        { type: 'refresher', title: 'the finite geometric sum', html: String.raw`<p>A <b>geometric</b> series has a first term $a$ and multiplies by the same <b>ratio</b> $r$ each time: $a + ar + ar^2 + \cdots$. Its partial sums have a closed formula.</p>`, steps: [
          { do: String.raw`$S_N = a + ar + ar^2 + \cdots + ar^N$`, why: String.raw`The partial sum up to the power $r^N$.` },
          { do: String.raw`$rS_N = ar + ar^2 + \cdots + ar^N + ar^{N+1}$`, why: String.raw`Multiply every term by $r$: each power moves up by one.` },
          { do: String.raw`$S_N - rS_N = a - ar^{N+1}$`, why: 'Subtract: all the middle terms cancel.' },
          { do: String.raw`$S_N = a\,\dfrac{1 - r^{N+1}}{1 - r}$ (for $r \ne 1$)`, why: String.raw`Factor $S_N(1 - r)$ on the left and divide by $1 - r$.` },
          { do: String.raw`$|r| < 1$: $\; r^{N+1} \to 0$, so $S_N \to \dfrac{a}{1 - r}$`, why: 'Powers of a number between −1 and 1 shrink to 0.' },
        ] },
        { type: 'callout', kind: 'thm', title: 'Geometric series', html: String.raw`$$\sum_{n=0}^{\infty} a r^n = a + ar + ar^2 + \cdots = \frac{a}{1 - r} \quad\text{if } |r| < 1,$$<p>and the series diverges if $|r| \ge 1$ (and $a \ne 0$). In words: <b>sum = first term / (1 − ratio)</b>. This works whatever index the series starts at, as long as "first term" means the actual first term.</p>` },
        { type: 'refresher', title: String.raw`rewriting a term as (number) · (ratio)$^n$`, html: String.raw`<p>Use $\dfrac{p^n}{q^n} = \left(\dfrac pq\right)^n$ and $q^{n+1} = q\cdot q^n$.</p>`, steps: [
          { do: String.raw`$\dfrac{3\cdot 2^n}{5^{n+1}} = \dfrac{3\cdot 2^n}{5\cdot 5^n}$`, why: String.raw`$5^{n+1} = 5\cdot 5^n$.` },
          { do: String.raw`$= \dfrac35\left(\dfrac25\right)^n$`, why: 'Group the constants and the n-th powers.' },
        ] },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{3\cdot 2^n}{5^{n+1}}$`, steps: [
          { do: String.raw`$\dfrac{3\cdot 2^n}{5^{n+1}} = \dfrac35\left(\dfrac25\right)^n$`, why: 'Refresher: write the term as a constant times an n-th power.' },
          { do: String.raw`$r = \dfrac25$`, why: String.raw`The ratio is the number raised to the power $n$: each term is $\frac25$ times the previous one.` },
          { do: String.raw`$|r| = \dfrac25 < 1$: converges`, why: 'Check the condition of the geometric series theorem first.' },
          { do: String.raw`first term ($n = 1$): $\;\dfrac35\cdot\dfrac25 = \dfrac{6}{25}$`, why: String.raw`The series starts at $n = 1$, so put $n = 1$ into the term.` },
          { do: String.raw`$S = \dfrac{6/25}{1 - 2/5} = \dfrac{6/25}{3/5}$`, why: 'First term over one minus the ratio.' },
          { do: String.raw`$= \dfrac{6}{25}\cdot\dfrac53 = \dfrac{2}{5}$`, why: 'Dividing by a fraction is multiplying by its reciprocal.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{(-3)^n}{4^{n+1}}$`, problem: String.raw`Find the sum of $\displaystyle\sum_{n=1}^{\infty} \frac{(-3)^n}{4^{n+1}}$. Note the negative ratio.`, steps: [
          { prompt: String.raw`Write the term as $\frac14\left(\frac{-3}{4}\right)^n$. What is the ratio $r$?`, ask: { kind: 'numeric', answer: '-3/4' }, hint: String.raw`$\frac{(-3)^n}{4\cdot 4^n}$; the number raised to the $n$ is the ratio.`, reveal: String.raw`$r = -\frac34$, and $|r| = \frac34 < 1$: the series converges.` },
          { prompt: String.raw`What is the first term (at $n = 1$)?`, ask: { kind: 'numeric', answer: '-3/16' }, hint: String.raw`$\frac{(-3)^1}{4^2}$.`, reveal: String.raw`$\dfrac{-3}{16}$.` },
          { prompt: 'The sum (first term over one minus the ratio) is?', ask: { kind: 'numeric', answer: '-3/28', tol: 1e-9 }, hint: String.raw`$1 - \left(-\frac34\right) = \frac74$.`, reveal: String.raw`$S = \dfrac{-3/16}{7/4} = -\dfrac{3}{16}\cdot\dfrac47 = -\dfrac{3}{28}$.` },
        ] },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=3}^{\infty} \frac{2}{3^n}$ — a series that starts later`, steps: [
          { do: String.raw`$\dfrac{2}{3^n} = 2\left(\dfrac13\right)^n, \quad r = \dfrac13$`, why: String.raw`$\frac{1}{3^n} = \left(\frac13\right)^n$. $|r| < 1$: converges.` },
          { do: String.raw`first term ($n = 3$): $\;\dfrac{2}{27}$`, why: String.raw`The sum starts at $n = 3$; $3^3 = 27$.` },
          { do: String.raw`$S = \dfrac{2/27}{1 - 1/3} = \dfrac{2/27}{2/3} = \dfrac{2}{27}\cdot\dfrac32 = \dfrac19$`, why: 'First term over one minus the ratio — no index shifting needed.' },
        ] },
        { type: 'quiz', question: String.raw`$\displaystyle\sum_{n=2}^{\infty} \left(-\frac13\right)^{n}$ equals`, choices: [String.raw`$\dfrac34$`, String.raw`$\dfrac1{12}$`, String.raw`$-\dfrac14$`, String.raw`It diverges`], answer: 1, explain: String.raw`First term $(-\tfrac13)^2 = \tfrac19$, ratio $-\tfrac13$: sum $= \dfrac{1/9}{1 + 1/3} = \dfrac{1}{12}$.` },
      ],
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'geometric-x',
      title: 'Repeating decimals and geometric series with a variable',
      blocks: [
        { type: 'text', html: String.raw`<p>Two classic uses of the geometric series formula: turning a repeating decimal into a fraction, and finding for which values of $x$ a series with $x$ in the ratio converges.</p>` },
        { type: 'steps', title: String.raw`Write $0.\overline{45} = 0.454545\ldots$ as a fraction`, steps: [
          { do: String.raw`$0.\overline{45} = 0.45 + 0.0045 + 0.000045 + \cdots$`, why: 'Split the decimal into its repeating blocks.' },
          { do: String.raw`$= \dfrac{45}{100} + \dfrac{45}{100^2} + \dfrac{45}{100^3} + \cdots$`, why: 'Each block is two decimal places further right, i.e. divided by 100 once more.' },
          { do: String.raw`first term $\dfrac{45}{100}$, ratio $r = \dfrac{1}{100}$`, why: String.raw`Each term is $\frac{1}{100}$ times the previous one; $|r| < 1$.` },
          { do: String.raw`$S = \dfrac{45/100}{1 - 1/100} = \dfrac{45/100}{99/100}$`, why: 'First term over one minus the ratio.' },
          { do: String.raw`$= \dfrac{45}{99} = \dfrac{5}{11}$`, why: String.raw`The $100$s cancel; divide top and bottom by $9$.` },
        ] },
        { type: 'guided', title: String.raw`Write $0.\overline{123} = 0.123123\ldots$ as a fraction`, problem: String.raw`Write $0.\overline{123}$ as a fraction in lowest terms. The repeating block now has three digits.`, steps: [
          { prompt: String.raw`$0.\overline{123} = \frac{123}{1000} + \frac{123}{1000^2} + \cdots$. What is the ratio $r$?`, ask: { kind: 'numeric', answer: '1/1000' }, hint: 'Each block is three decimal places further right.', reveal: String.raw`$r = \frac{1}{1000}$.` },
          { prompt: String.raw`$S = \dfrac{123/1000}{1 - 1/1000} = \dfrac{123}{999}$. Reduce it (divide by $3$) and type the fraction.`, ask: { kind: 'numeric', answer: '41/333', tol: 1e-12 }, hint: String.raw`$123 = 3\cdot 41$ and $999 = 3\cdot 333$.`, reveal: String.raw`$0.\overline{123} = \dfrac{41}{333}$.` },
          { prompt: 'Pattern check: a repeating block of $k$ digits $d$ gives …', ask: { kind: 'choice', choices: [String.raw`$\dfrac{d}{99\ldots9}$ with $k$ nines`, String.raw`$\dfrac{d}{10^k}$`, String.raw`$\dfrac{d}{100\ldots0}$ with $k$ zeros`], answer: 0 }, hint: String.raw`$\frac{45}{99}$ and $\frac{123}{999}$.`, reveal: String.raw`$\dfrac{d}{10^k - 1}$: $k$ nines in the denominator.` },
        ] },
        { type: 'refresher', title: String.raw`the inequality $|u| < c$`, html: String.raw`<p>$|u| < c$ means "$u$ is less than $c$ away from $0$", i.e. $-c < u < c$. Then solve the double inequality by doing the same operation to all three parts.</p>`, steps: [
          { do: String.raw`$|x + 2| < 3$`, why: 'Example.' },
          { do: String.raw`$-3 < x + 2 < 3$`, why: 'Remove the absolute value.' },
          { do: String.raw`$-5 < x < 1$`, why: String.raw`Subtract $2$ from all three parts.` },
        ] },
        { type: 'steps', title: String.raw`For which $x$ does $\displaystyle\sum_{n=0}^{\infty} \frac{(x+2)^n}{3^n}$ converge?`, steps: [
          { do: String.raw`$\dfrac{(x+2)^n}{3^n} = \left(\dfrac{x+2}{3}\right)^n$`, why: String.raw`For a fixed $x$ this is a geometric series with first term $1$ and ratio $r = \frac{x+2}{3}$.` },
          { do: String.raw`converges $\iff \left|\dfrac{x+2}{3}\right| < 1$`, why: 'Geometric series theorem.' },
          { do: String.raw`$\iff |x + 2| < 3$`, why: String.raw`Multiply by $3 > 0$.` },
          { do: String.raw`$\iff -5 < x < 1$`, why: 'Refresher.' },
          { do: String.raw`endpoints: $x = -5$ gives $r = -1$, $x = 1$ gives $r = 1$: diverge`, why: String.raw`$|r| = 1$: the terms $(\pm1)^n$ do not tend to $0$, so the series diverges. The endpoints are excluded.` },
          { do: String.raw`sum $= \dfrac{1}{1 - \frac{x+2}{3}} = \dfrac{3}{1 - x}$ for $-5 < x < 1$`, why: 'Bonus: the sum as a function of x (first term 1).' },
        ] },
        { type: 'guided', title: String.raw`For which $x$ does $\displaystyle\sum_{n=0}^{\infty} \frac{(2x-1)^n}{5^n}$ converge?`, problem: String.raw`Find all $x$ for which $\displaystyle\sum_{n=0}^{\infty} \frac{(2x-1)^n}{5^n}$ converges.`, steps: [
          { prompt: String.raw`The ratio is $r = \frac{2x - 1}{5}$; $|r| < 1$ gives $-5 < 2x - 1 < 5$. Add $1$ and divide by $2$: what is the left end of the interval?`, ask: { kind: 'numeric', answer: '-2' }, hint: String.raw`$-5 + 1 = -4$, then divide by $2$.`, reveal: String.raw`$-4 < 2x < 6$, so $x > -2$.` },
          { prompt: 'And the right end?', ask: { kind: 'numeric', answer: '3' }, hint: String.raw`$\frac{6}{2}$.`, reveal: String.raw`$x < 3$.` },
          { prompt: 'Are the endpoints included?', ask: { kind: 'choice', choices: ['no: there |r| = 1 and the series diverges', 'yes: there the series converges', 'only x = 3'], answer: 0 }, hint: String.raw`What is $|r|$ at $x = -2$ and at $x = 3$?`, reveal: String.raw`At both ends $|r| = 1$: the series diverges. Answer: $-2 < x < 3$.` },
        ] },
      ],
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'geometric-applications',
      title: 'Geometric series in applications: the bouncing ball',
      blocks: [
        { type: 'text', html: String.raw`<p>A ball is dropped from $h_0 = 2$ m, and after each impact it rises to $60\,\%$ of its previous height ($r = 0.6$). The distances travelled are $2$ (first fall) and then $2\cdot 2\cdot 0.6^k$ for the $k$-th rebound (up and down). Their partial sums approach $8$ m:</p>` },
        { type: 'widget', name: 'series', config: {
          title: 'Total distance of a bouncing ball (h0 = 2 m, r = 0.6)',
          term: '2*(n==0) + 4*0.6.^n.*(n>0)', n0: 0, nmax: 25, N: 3, sum: 8, sumTex: '8',
        } },
        { type: 'refresher', title: String.raw`a geometric sum that starts at $k = 1$, and square roots of powers`, html: String.raw`<ul><li>$\sum_{k=1}^{\infty} q^k = q + q^2 + \cdots = \dfrac{q}{1 - q}$ for $|q| < 1$ (first term $q$).</li><li>$\sqrt{h_0 r^k} = \sqrt{h_0}\,\big(\sqrt r\big)^k$, because $\sqrt{r^k} = (r^k)^{1/2} = (r^{1/2})^k$.</li><li>Free fall from rest through a height $h$ takes $t = \sqrt{2h/g}$; rising to height $h$ takes the same time.</li></ul>` },
        { type: 'steps', title: 'Total distance of the ball', steps: [
          { do: String.raw`$D = h_0 + 2h_1 + 2h_2 + 2h_3 + \cdots$`, why: String.raw`Write out the contributions: the first fall, then each rebound goes up and down ($2h_k$).` },
          { do: String.raw`$h_k = h_0 r^k$`, why: String.raw`Each rebound height is $r$ times the previous one.` },
          { do: String.raw`$D = h_0 + 2h_0\sum_{k=1}^{\infty} r^k$`, why: String.raw`Factor out $2h_0$.` },
          { do: String.raw`$= h_0 + 2h_0\,\dfrac{r}{1 - r}$`, why: String.raw`Geometric sum starting at $k = 1$ (refresher), valid since $r = 0.6 < 1$.` },
          { do: String.raw`$= h_0\,\dfrac{(1 - r) + 2r}{1 - r} = h_0\,\dfrac{1 + r}{1 - r}$`, why: 'Common denominator.' },
          { do: String.raw`$= 2\cdot\dfrac{1.6}{0.4} = 8\ \text{m}$`, why: String.raw`Insert $h_0 = 2$, $r = 0.6$.` },
        ] },
        { type: 'steps', title: 'Total time until the ball comes to rest', steps: [
          { do: String.raw`$t_0 = \sqrt{2h_0/g}$`, why: 'Time of the first fall.' },
          { do: String.raw`$k$-th rebound: $\;2\sqrt{2h_0r^k/g} = 2t_0\big(\sqrt r\big)^k$`, why: String.raw`Up and down take $\sqrt{2h_k/g}$ each; refresher for the square root of $r^k$.` },
          { do: String.raw`$T = t_0 + 2t_0\sum_{k=1}^{\infty}\big(\sqrt r\big)^k$`, why: String.raw`Add the first fall and all rebounds. The ratio is $\sqrt r$, <b>not</b> $r$.` },
          { do: String.raw`$= t_0 + 2t_0\,\dfrac{\sqrt r}{1 - \sqrt r} = t_0\,\dfrac{1 + \sqrt r}{1 - \sqrt r}$`, why: 'Same algebra as for the distance, with √r in place of r.' },
          { do: String.raw`$t_0 = \sqrt{4/9.81} \approx 0.6386$ s, $\;\sqrt{0.6} \approx 0.7746$`, why: String.raw`Insert $h_0 = 2$ m and $g = 9.81\ \mathrm{m/s^2}$.` },
          { do: String.raw`$T \approx 0.6386\cdot\dfrac{1.7746}{0.2254} \approx 0.6386\cdot 7.873 \approx 5.03$ s`, why: 'The ball bounces infinitely often in a finite time.' },
        ] },
        { type: 'guided', title: String.raw`Ball dropped from $h_0 = 3$ m with $r = 0.36$`, problem: String.raw`A ball is dropped from $3$ m and rebounds to $36\,\%$ of its previous height each time. Use $g = 9.81\ \mathrm{m/s^2}$.`, steps: [
          { prompt: String.raw`Total distance $D = h_0\dfrac{1 + r}{1 - r}$ in metres?`, ask: { kind: 'numeric', answer: '3*1.36/0.64', tol: 1e-6 }, hint: String.raw`$3\cdot\frac{1.36}{0.64}$.`, reveal: String.raw`$D = 3\cdot\dfrac{1.36}{0.64} = 6.375$ m.` },
          { prompt: String.raw`Which ratio does the series of bounce <b>times</b> have?`, ask: { kind: 'numeric', answer: '0.6' }, hint: String.raw`$\sqrt r$.`, reveal: String.raw`$\sqrt{0.36} = 0.6$.` },
          { prompt: String.raw`Total time $T = t_0\dfrac{1 + \sqrt r}{1 - \sqrt r}$ with $t_0 = \sqrt{2\cdot 3/9.81}$, in seconds?`, ask: { kind: 'numeric', answer: 'sqrt(6/9.81)*1.6/0.4', tol: 1e-5 }, hint: String.raw`$\frac{1.6}{0.4} = 4$, so $T = 4t_0$.`, reveal: String.raw`$t_0 \approx 0.7821$ s, $T = 4t_0 \approx 3.128$ s.` },
        ] },
        { type: 'callout', kind: 'exam', html: String.raw`<p>In application problems, write out the first two or three contributions explicitly before summing. That makes the first term and the ratio visible — and shows the grader where they come from.</p>` },
        { type: 'quiz', question: String.raw`A ball dropped from height $h_0$ rebounds to $r h_0$ each time. Which ratio does the series of bounce <b>times</b> have?`, choices: [String.raw`$r$`, String.raw`$\sqrt r$`, String.raw`$r^2$`, String.raw`$2r$`], answer: 1, explain: String.raw`Time scales like $\sqrt{h}$, and $\sqrt{h_0 r^k} = \sqrt{h_0}\,(\sqrt r)^k$.` },
      ],
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'reflections',
      title: 'Geometric series in applications: multiple reflections',
      blocks: [
        { type: 'text', html: String.raw`<p>A glass pane reflects a fraction $\rho$ (rho) of incoming light, absorbs $\alpha$ and transmits $\tau$ (tau), with $\rho + \alpha + \tau = 1$. With two panes, light bounces back and forth in the gap between them. Every path that light can take is a product of factors $\rho$ and $\tau$ — one factor per encounter with a pane — and adding all paths gives a geometric series.</p>` },
        { type: 'steps', title: String.raw`Two panes, $\rho = 0.3$, $\tau = 0.5$: the fraction transmitted $T$`, steps: [
          { do: String.raw`straight through: $\;\tau\cdot\tau = \tau^2$`, why: 'Through pane 1, then through pane 2.' },
          { do: String.raw`one round trip: $\;\tau\cdot\rho\cdot\rho\cdot\tau = \tau^2\rho^2$`, why: String.raw`Through pane 1, reflected back by pane 2 ($\rho$), reflected forward again by pane 1 ($\rho$), through pane 2.` },
          { do: String.raw`two round trips: $\;\tau^2\rho^4$, and so on`, why: String.raw`Each extra round trip in the gap adds a factor $\rho^2$.` },
          { do: String.raw`$T = \tau^2 + \tau^2\rho^2 + \tau^2\rho^4 + \cdots = \dfrac{\tau^2}{1 - \rho^2}$`, why: String.raw`Geometric series: first term $\tau^2$, ratio $\rho^2 < 1$.` },
          { do: String.raw`$T = \dfrac{0.25}{1 - 0.09} = \dfrac{0.25}{0.91} \approx 0.2747$`, why: String.raw`Insert the numbers — a little more than the single-pass $\tau^2 = 0.25$.` },
        ] },
        { type: 'steps', title: String.raw`Same panes: the fraction reflected back $R$`, steps: [
          { do: String.raw`direct reflection: $\;\rho$`, why: 'Reflected at pane 1 without entering the gap.' },
          { do: String.raw`via pane 2: $\;\tau\cdot\rho\cdot\tau = \tau^2\rho$`, why: 'Through pane 1, reflected by pane 2, back out through pane 1.' },
          { do: String.raw`with one extra round trip: $\;\tau\cdot\rho\cdot\rho\cdot\rho\cdot\tau = \tau^2\rho^3$, and so on`, why: String.raw`Before leaving, the light can bounce in the gap again; each round trip adds $\rho^2$.` },
          { do: String.raw`$R = \rho + \tau^2\rho\left(1 + \rho^2 + \rho^4 + \cdots\right) = \rho + \dfrac{\tau^2\rho}{1 - \rho^2}$`, why: String.raw`The direct reflection is separate; the rest is geometric with first term $\tau^2\rho$ and ratio $\rho^2$.` },
          { do: String.raw`$R = 0.3 + \dfrac{0.25\cdot 0.3}{0.91} \approx 0.3 + 0.0824 = 0.3824$`, why: String.raw`Insert the numbers. The rest, $1 - T - R \approx 0.343$, is absorbed.` },
        ] },
        { type: 'guided', title: String.raw`Two panes with $\rho = 0.2$, $\tau = 0.7$`, problem: String.raw`Two identical panes each reflect $20\,\%$, absorb $10\,\%$ and transmit $70\,\%$. Find the transmitted and the reflected fraction.`, steps: [
          { prompt: String.raw`Each round trip in the gap multiplies by which factor?`, ask: { kind: 'numeric', answer: '0.04' }, hint: String.raw`$\rho^2$.`, reveal: String.raw`$\rho^2 = 0.04$.` },
          { prompt: String.raw`Transmitted fraction $T = \dfrac{\tau^2}{1 - \rho^2}$?`, ask: { kind: 'numeric', answer: '0.49/0.96', tol: 1e-6 }, hint: String.raw`$\tau^2 = 0.49$.`, reveal: String.raw`$T = \dfrac{0.49}{0.96} \approx 0.5104$.` },
          { prompt: String.raw`Reflected fraction $R = \rho + \dfrac{\tau^2\rho}{1 - \rho^2}$?`, ask: { kind: 'numeric', answer: '0.2 + 0.49*0.2/0.96', tol: 1e-6 }, hint: String.raw`$0.2 + \frac{0.098}{0.96}$.`, reveal: String.raw`$R = 0.2 + 0.1021 \approx 0.3021$.` },
        ] },
      ],
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'telescoping-divergence',
      title: 'Telescoping series',
      blocks: [
        { type: 'text', html: String.raw`<p>The terms $\dfrac{1}{n(n+2)}$ split into $\dfrac12\left(\dfrac1n - \dfrac1{n+2}\right)$. In the partial sum almost everything cancels — like a telescope sliding shut — and $S_N$ approaches $\tfrac34$:</p>` },
        { type: 'widget', name: 'series', config: {
          title: 'Telescoping series Σ 1/(n(n+2))',
          term: '1./(n.*(n + 2))', n0: 1, nmax: 30, N: 3, sum: 0.75, sumTex: String.raw`\tfrac34`,
        } },
        { type: 'refresher', title: 'partial fractions (cover-up method)', html: String.raw`<p>To split $\dfrac{2}{(n+1)(n+3)} = \dfrac{A}{n+1} + \dfrac{B}{n+3}$: multiply both sides by $(n+1)(n+3)$, then put in the values of $n$ that make one bracket zero.</p>`, steps: [
          { do: String.raw`$2 = A(n+3) + B(n+1)$`, why: 'Multiply both sides by (n+1)(n+3).' },
          { do: String.raw`$n = -1$: $\;2 = A\cdot 2 \Rightarrow A = 1$`, why: String.raw`The $B$-term vanishes because $n + 1 = 0$.` },
          { do: String.raw`$n = -3$: $\;2 = B\cdot(-2) \Rightarrow B = -1$`, why: String.raw`The $A$-term vanishes because $n + 3 = 0$.` },
          { do: String.raw`$\dfrac{2}{(n+1)(n+3)} = \dfrac{1}{n+1} - \dfrac{1}{n+3}$`, why: 'Check with n = 1: 2/8 = 1/2 − 1/4 ✓.' },
        ] },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{2}{n^2 + 4n + 3}$`, steps: [
          { do: String.raw`$n^2 + 4n + 3 = (n+1)(n+3)$`, why: String.raw`Factor: two numbers with product $3$ and sum $4$.` },
          { do: String.raw`$a_n = \dfrac{1}{n+1} - \dfrac{1}{n+3}$`, why: 'Partial fractions (refresher).' },
          { do: String.raw`$S_N = \left(\tfrac12 - \tfrac14\right) + \left(\tfrac13 - \tfrac15\right) + \left(\tfrac14 - \tfrac16\right) + \left(\tfrac15 - \tfrac17\right) + \cdots$`, why: String.raw`Write out the terms for $n = 1, 2, 3, 4$.` },
          { do: String.raw`$\cdots + \left(\tfrac1N - \tfrac1{N+2}\right) + \left(\tfrac1{N+1} - \tfrac1{N+3}\right)$`, why: String.raw`…and the last two, for $n = N - 1$ and $n = N$.` },
          { do: String.raw`$-\tfrac14$ cancels $+\tfrac14$, $\;-\tfrac15$ cancels $+\tfrac15$, …`, why: 'Every negative part cancels a positive part two terms later.' },
          { do: String.raw`$S_N = \dfrac12 + \dfrac13 - \dfrac1{N+2} - \dfrac1{N+3}$`, why: 'Only the first two positive parts and the last two negative parts survive.' },
          { do: String.raw`$S = \lim_{N\to\infty} S_N = \dfrac12 + \dfrac13 = \dfrac56$`, why: String.raw`$\frac{1}{N+2} \to 0$ and $\frac{1}{N+3} \to 0$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{4}{n(n+4)}$`, problem: String.raw`Sum the telescoping series $\displaystyle\sum_{n=1}^{\infty} \frac{4}{n(n+4)}$.`, steps: [
          { prompt: String.raw`$\dfrac{4}{n(n+4)} = \dfrac{A}{n} + \dfrac{B}{n+4}$. Cover-up with $n = 0$: what is $A$?`, ask: { kind: 'numeric', answer: '1' }, hint: String.raw`$4 = A(n+4) + Bn$; put $n = 0$.`, reveal: String.raw`$4 = 4A$, so $A = 1$.` },
          { prompt: String.raw`With $n = -4$: what is $B$?`, ask: { kind: 'numeric', answer: '-1' }, hint: String.raw`$4 = B\cdot(-4)$.`, reveal: String.raw`$B = -1$: $\;a_n = \frac1n - \frac{1}{n+4}$.` },
          { prompt: String.raw`Each $-\frac{1}{n+4}$ cancels a positive part four terms later. Which positive parts survive?`, ask: { kind: 'choice', choices: [String.raw`$1, \frac12, \frac13, \frac14$`, String.raw`$1, \frac12$`, String.raw`$\frac15, \frac16, \frac17, \frac18$`], answer: 0 }, hint: String.raw`Write out $n = 1, \dots, 5$: $(1 - \frac15) + (\frac12 - \frac16) + (\frac13 - \frac17) + (\frac14 - \frac18) + (\frac15 - \frac19)$.`, reveal: String.raw`The parts $\frac1n$ for $n = 1, 2, 3, 4$ are never cancelled.` },
          { prompt: 'The sum of the series is?', ask: { kind: 'numeric', answer: '25/12', tol: 1e-9 }, hint: String.raw`The last four negative parts tend to $0$. Add $1 + \frac12 + \frac13 + \frac14$ over the denominator $12$.`, reveal: String.raw`$S = 1 + \frac12 + \frac13 + \frac14 = \frac{12 + 6 + 4 + 3}{12} = \frac{25}{12}$.` },
        ] },
        { type: 'refresher', title: String.raw`the sum $1 + 2 + \cdots + m$`, html: String.raw`<p>Gauss's trick: write the sum forwards and backwards and add. Every column gives $m + 1$, and there are $m$ columns, so twice the sum is $m(m+1)$:</p>$$1 + 2 + \cdots + m = \frac{m(m+1)}{2}.$$<p>Example: $1 + 2 + 3 + 4 = 10 = \frac{4\cdot 5}{2}$.</p>` },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{1}{1 + 2 + \cdots + n}$`, steps: [
          { do: String.raw`$1 + 2 + \cdots + n = \dfrac{n(n+1)}{2}$`, why: String.raw`Refresher with $m = n$.` },
          { do: String.raw`$a_n = \dfrac{1}{n(n+1)/2} = \dfrac{2}{n(n+1)}$`, why: 'Dividing by a fraction is multiplying by its reciprocal.' },
          { do: String.raw`$\dfrac{2}{n(n+1)} = \dfrac{2}{n} - \dfrac{2}{n+1}$`, why: String.raw`Partial fractions: $2 = A(n+1) + Bn$; $n = 0$ gives $A = 2$, $n = -1$ gives $B = -2$.` },
          { do: String.raw`$S_N = \left(2 - 1\right) + \left(1 - \tfrac23\right) + \cdots + \left(\tfrac2N - \tfrac{2}{N+1}\right) = 2 - \dfrac{2}{N+1}$`, why: 'Each negative part cancels the next positive part; only the first and the last survive.' },
          { do: String.raw`$S = 2$`, why: String.raw`$\frac{2}{N+1} \to 0$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{1}{3 + 4 + \cdots + (n+2)}$`, problem: String.raw`Find a closed formula for the term and sum the series.`, steps: [
          { prompt: String.raw`$3 + 4 + \cdots + (n+2) = \big(1 + 2 + \cdots + (n+2)\big) - (1 + 2) = \dfrac{(n+2)(n+3)}{2} - 3$. Simplify $a_n = \dfrac{1}{\text{that}}$ and type it.`, ask: { kind: 'expression', answer: '2./(n.*(n+5))', variable: 'n', domain: [1, 6], label: 'a_n =' }, hint: String.raw`$\frac{(n+2)(n+3) - 6}{2} = \frac{n^2 + 5n}{2} = \frac{n(n+5)}{2}$.`, reveal: String.raw`$a_n = \dfrac{2}{n(n+5)}$.` },
          { prompt: String.raw`Partial fractions: $\dfrac{2}{n(n+5)} = c\left(\dfrac1n - \dfrac{1}{n+5}\right)$. What is $c$?`, ask: { kind: 'numeric', answer: '2/5' }, hint: String.raw`$2 = A(n+5) + Bn$ with $n = 0$ gives $A = \frac25$.`, reveal: String.raw`$c = \frac25$.` },
          { prompt: String.raw`The surviving parts are $\frac25\left(1 + \frac12 + \frac13 + \frac14 + \frac15\right)$. The sum is?`, ask: { kind: 'numeric', answer: '137/150', tol: 1e-9 }, hint: String.raw`$1 + \frac12 + \frac13 + \frac14 + \frac15 = \frac{137}{60}$.`, reveal: String.raw`$S = \frac25\cdot\frac{137}{60} = \frac{137}{150}$.` },
        ] },
      ],
    },
    // ------------------------------------------------------------------ 6
    {
      id: 'divergence-test',
      title: 'The divergence test (n-th term test)',
      blocks: [
        { type: 'callout', kind: 'thm', title: 'Divergence test', html: String.raw`<p>If $\sum a_n$ converges, then $a_n \to 0$. Equivalently: <b>if $\lim a_n \ne 0$ or the limit does not exist, the series diverges.</b> (If the terms do not shrink to zero, you keep adding pieces of a fixed size, and the partial sums cannot settle.)</p>` },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{n}{3n + 1}$`, steps: [
          { do: String.raw`$a_n = \dfrac{n}{3n+1} = \dfrac{1}{3 + 1/n}$`, why: String.raw`Divide top and bottom by $n$ to find the limit of the terms.` },
          { do: String.raw`$a_n \to \dfrac13$`, why: String.raw`$\frac1n \to 0$.` },
          { do: String.raw`$\dfrac13 \ne 0$`, why: 'The pre-condition of the test for divergence holds.' },
          { do: String.raw`the series diverges`, why: 'Divergence test.' },
        ] },
        { type: 'callout', kind: 'warn', title: 'The test is one-way only', html: String.raw`<p>If $a_n \to 0$ the test says <b>nothing</b>. The <b>harmonic series</b> $\sum \frac1n$ is the famous example: its terms tend to $0$, but it diverges (worked below).</p>` },
        { type: 'steps', title: String.raw`The harmonic series $\displaystyle\sum_{n=1}^{\infty} \frac1n$ diverges`, steps: [
          { do: String.raw`$S_2 = 1 + \tfrac12$`, why: 'First two terms.' },
          { do: String.raw`$S_4 = S_2 + \tfrac13 + \tfrac14 > S_2 + \tfrac14 + \tfrac14 = 1 + \tfrac12 + \tfrac12$`, why: String.raw`Replace $\frac13$ by the smaller $\frac14$: the two-term group is more than $\frac12$.` },
          { do: String.raw`$S_8 = S_4 + \tfrac15 + \tfrac16 + \tfrac17 + \tfrac18 > S_4 + 4\cdot\tfrac18 = 1 + \tfrac32$`, why: String.raw`Each of the four terms is at least $\frac18$.` },
          { do: String.raw`$S_{2^k} > 1 + \dfrac{k}{2}$`, why: String.raw`Each doubling adds a group worth more than $\frac12$.` },
          { do: String.raw`$S_N \to \infty$`, why: String.raw`$1 + k/2$ grows without bound, and $S_N$ increases.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{3n - 1}{4n + 7}$ and $\displaystyle\sum_{n=1}^{\infty} \frac{1}{n^2}$`, problem: String.raw`Apply the divergence test to two series.`, steps: [
          { prompt: String.raw`What is $\displaystyle\lim_{n\to\infty} \frac{3n - 1}{4n + 7}$?`, ask: { kind: 'numeric', answer: '3/4' }, hint: String.raw`Divide top and bottom by $n$.`, reveal: String.raw`$\dfrac{3 - 1/n}{4 + 7/n} \to \dfrac34$.` },
          { prompt: String.raw`So $\sum \frac{3n-1}{4n+7}$ …`, ask: { kind: 'choice', choices: ['diverges by the divergence test', 'converges by the divergence test', 'the test says nothing'], answer: 0 }, hint: String.raw`Is the limit of the terms $0$?`, reveal: String.raw`$\frac34 \ne 0$: diverges.` },
          { prompt: String.raw`For $\sum \frac{1}{n^2}$ the terms tend to $0$. The divergence test …`, ask: { kind: 'choice', choices: ['proves convergence', 'proves divergence', 'says nothing (another test is needed)'], answer: 2 }, hint: 'The test is one-way only.', reveal: String.raw`It says nothing. (The integral test, next lesson, shows that $\sum \frac{1}{n^2}$ converges.)` },
        ] },
        { type: 'quiz', question: String.raw`What does the divergence test say about $\displaystyle\sum_{n=1}^{\infty} \frac{n}{3n + 1}$ and $\displaystyle\sum_{n=1}^{\infty} \frac{1}{\sqrt n}$?`, choices: [String.raw`Both diverge.`, String.raw`The first diverges; nothing about the second.`, String.raw`The first diverges; the second converges.`, String.raw`Nothing about either.`], answer: 1, explain: String.raw`$\frac{n}{3n+1} \to \frac13 \ne 0$, so the first diverges. For the second $\frac1{\sqrt n} \to 0$, and the test is inconclusive (it diverges as a $p$-series with $p = \tfrac12$).` },
      ],
    },
    // ------------------------------------------------------------------ 7
    {
      id: 'integral-test',
      title: 'The integral test and p-series',
      blocks: [
        { type: 'text', html: String.raw`<p>Each term $a_n = f(n)$ is the area of a rectangle of width $1$. For a decreasing $f$ the rectangles on $[n, n+1]$ lie above the curve, the ones on $[n-1, n]$ below it. So the series and the improper integral converge or diverge <b>together</b>.</p>` },
        { type: 'widget', name: 'series', config: {
          title: 'Σ 1/n² against the curve f(x) = 1/x²',
          term: '1./n.^2', integralTest: '1./x.^2', n0: 1, nmax: 40, N: 3, view: 10, sum: Math.PI ** 2 / 6, sumTex: String.raw`\pi^2/6`,
        } },
        { type: 'callout', kind: 'thm', title: 'Integral test', html: String.raw`<p><b>Pre-conditions:</b> $a_n = f(n)$ where $f$ is <b>continuous, positive and decreasing</b> on $[N_0, \infty)$. Then $\sum a_n$ and $\int_{N_0}^{\infty} f(x)\,\mathrm d x$ either both converge or both diverge.</p>` },
        { type: 'refresher', title: 'improper integrals and the substitution u = ln x', html: String.raw`<p>$\displaystyle\int_a^{\infty} f(x)\,\mathrm d x = \lim_{t\to\infty}\int_a^t f(x)\,\mathrm d x$: integrate up to a finite $t$, then let $t \to \infty$. The integral converges if this limit is a finite number.</p><p>With $u = \ln x$ we have $\mathrm d u = \frac1x\,\mathrm d x$, so $\dfrac{\mathrm d x}{x\,(\dots)}$ becomes $\dfrac{\mathrm d u}{(\dots)}$, and the limits change: $x = 2 \mapsto u = \ln 2$, $x = t \mapsto u = \ln t$.</p>` },
        { type: 'steps', title: String.raw`p-series: $\displaystyle\sum_{n=1}^{\infty} \frac{1}{n^2}$ converges`, steps: [
          { do: String.raw`$f(x) = x^{-2}$ on $[1, \infty)$: continuous, positive`, why: 'No division by zero for x ≥ 1, and a square is positive.' },
          { do: String.raw`$f'(x) = -2x^{-3} < 0$: decreasing`, why: 'Show "decreasing" with the derivative.' },
          { do: String.raw`$\displaystyle\int_1^t x^{-2}\,\mathrm d x = \Big[-x^{-1}\Big]_1^t = 1 - \frac1t$`, why: String.raw`Antiderivative of $x^{-2}$ is $-x^{-1}$.` },
          { do: String.raw`$\to 1$ as $t \to \infty$: the integral converges`, why: String.raw`$\frac1t \to 0$.` },
          { do: String.raw`$\sum \frac{1}{n^2}$ converges`, why: 'Integral test.' },
        ] },
        { type: 'callout', kind: 'key', title: 'p-series', html: String.raw`<p>The same computation with $x^{-p}$ shows: $\displaystyle\sum_{n=1}^{\infty} \frac{1}{n^p}$ converges if $p > 1$ and diverges if $p \le 1$. The harmonic series is the case $p = 1$.</p>` },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=2}^{\infty} \frac{1}{n\ln n}$ diverges`, steps: [
          { do: String.raw`$f(x) = \dfrac{1}{x\ln x}$ on $[2, \infty)$`, why: String.raw`The series starts at $n = 2$ because $\ln 1 = 0$.` },
          { do: String.raw`continuous and positive: $x\ln x > 0$ for $x \ge 2$`, why: String.raw`$x > 0$ and $\ln x \ge \ln 2 > 0$.` },
          { do: String.raw`decreasing: $x\ln x$ increases, so its reciprocal decreases`, why: String.raw`Both factors $x$ and $\ln x$ are positive and increasing. (Or: $f'(x) = -\frac{\ln x + 1}{(x\ln x)^2} < 0$.)` },
          { do: String.raw`$\displaystyle\int_2^t \frac{\mathrm d x}{x\ln x} = \int_{\ln 2}^{\ln t} \frac{\mathrm d u}{u}$`, why: String.raw`Substitute $u = \ln x$, $\mathrm d u = \frac{\mathrm d x}{x}$ (refresher).` },
          { do: String.raw`$= \ln(\ln t) - \ln(\ln 2)$`, why: String.raw`Antiderivative of $\frac1u$ is $\ln u$.` },
          { do: String.raw`$\to \infty$ as $t \to \infty$`, why: String.raw`$\ln t \to \infty$, so $\ln(\ln t) \to \infty$ (slowly!).` },
          { do: String.raw`$\sum \frac{1}{n\ln n}$ diverges`, why: 'Integral test: the integral diverges, so the series diverges.' },
        ] },
        { type: 'guided', title: String.raw`Does $\displaystyle\sum_{n=2}^{\infty} \frac{1}{n(\ln n)^2}$ converge?`, problem: String.raw`Use the integral test on $f(x) = \dfrac{1}{x(\ln x)^2}$, $x \ge 2$ (continuous, positive and decreasing, as in the example).`, steps: [
          { prompt: String.raw`Substitute $u = \ln x$. The integral $\int_2^{\infty} \frac{\mathrm d x}{x(\ln x)^2}$ becomes …`, ask: { kind: 'choice', choices: [String.raw`$\displaystyle\int_{\ln 2}^{\infty} \frac{\mathrm d u}{u^2}$`, String.raw`$\displaystyle\int_{2}^{\infty} \frac{\mathrm d u}{u^2}$`, String.raw`$\displaystyle\int_{\ln 2}^{\infty} \frac{\mathrm d u}{u}$`], answer: 0 }, hint: String.raw`$\frac{\mathrm d x}{x} = \mathrm d u$, and the lower limit $x = 2$ becomes $u = \ln 2$.`, reveal: String.raw`$\displaystyle\int_{\ln 2}^{\infty} u^{-2}\,\mathrm d u$.` },
          { prompt: String.raw`Evaluate it: $\displaystyle\lim_{t\to\infty}\Big[-\frac1u\Big]_{\ln 2}^{t} = ?$`, ask: { kind: 'numeric', answer: '1/log(2)' }, hint: String.raw`$-\frac1t \to 0$, minus $\left(-\frac{1}{\ln 2}\right)$. MATLAB writes $\ln$ as <code>log</code>.`, reveal: String.raw`$0 + \dfrac{1}{\ln 2} \approx 1.443$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['the series converges', 'the series diverges', 'the integral test does not apply'], answer: 0 }, hint: 'The integral is a finite number.', reveal: String.raw`The integral converges, so $\sum \frac{1}{n(\ln n)^2}$ converges by the integral test.` },
        ] },
        { type: 'callout', kind: 'exam', html: String.raw`<p>"Decreasing" must be <b>shown</b>, usually with $f'(x) < 0$. If $f$ only decreases for $x \ge x_0$, apply the test on $[x_0, \infty)$; the finitely many earlier terms do not affect convergence.</p>` },
        { type: 'quiz', question: String.raw`Which series converges?`, choices: [String.raw`$\displaystyle\sum \frac{1}{n^{0.99}}$`, String.raw`$\displaystyle\sum \frac{1}{\sqrt[3]{n^2}}$`, String.raw`$\displaystyle\sum \frac{1}{n\sqrt n}$`, String.raw`$\displaystyle\sum \frac{\sqrt n}{n}$`], answer: 2, explain: String.raw`$\frac1{n\sqrt n} = n^{-3/2}$ with $p = \tfrac32 > 1$. The others have $p = 0.99$, $\tfrac23$ and $\tfrac12$.` },
      ],
    },
    // ------------------------------------------------------------------ 8
    {
      id: 'remainder-bounds',
      title: 'Bounding the sum with the integral test',
      blocks: [
        { type: 'callout', kind: 'thm', title: 'Remainder bounds', html: String.raw`<p>Under the pre-conditions of the integral test, the tail $R_N = S - S_N$ is trapped between two integrals:</p>$$\int_{N+1}^{\infty} f(x)\,\mathrm d x \;\le\; R_N \;\le\; \int_{N}^{\infty} f(x)\,\mathrm d x .$$<p>Adding $S_N$ everywhere gives an interval for the sum: $\;S_N + \int_{N+1}^\infty f \le S \le S_N + \int_N^\infty f$.</p>` },
        { type: 'steps', title: String.raw`Bound $\displaystyle S = \sum_{n=1}^{\infty} \frac1{n^3}$ using $S_5$`, steps: [
          { do: String.raw`$f(x) = x^{-3}$: continuous, positive, $f'(x) = -3x^{-4} < 0$ on $[1, \infty)$`, why: 'Pre-conditions of the integral test.' },
          { do: String.raw`$S_5 = 1 + \tfrac18 + \tfrac1{27} + \tfrac1{64} + \tfrac1{125}$`, why: 'Write the partial sum term by term.' },
          { do: String.raw`$\approx 1 + 0.125 + 0.037037 + 0.015625 + 0.008 = 1.185662$`, why: 'Decimal values.' },
          { do: String.raw`$\displaystyle\int_N^t x^{-3}\,\mathrm d x = \Big[-\frac{1}{2x^2}\Big]_N^t = \frac{1}{2N^2} - \frac{1}{2t^2}$`, why: String.raw`Antiderivative of $x^{-3}$ is $\frac{x^{-2}}{-2}$.` },
          { do: String.raw`$\displaystyle\int_N^\infty x^{-3}\,\mathrm d x = \frac{1}{2N^2}$`, why: String.raw`Let $t \to \infty$.` },
          { do: String.raw`$\dfrac{1}{2\cdot 6^2} \le R_5 \le \dfrac{1}{2\cdot 5^2}$, i.e. $0.013889 \le R_5 \le 0.02$`, why: String.raw`Lower bound with $N + 1 = 6$, upper bound with $N = 5$.` },
          { do: String.raw`$1.199551 \le S \le 1.205662$`, why: String.raw`Add $S_5$. (The true value is $1.2020569\ldots$)` },
        ] },
        { type: 'refresher', title: String.raw`the substitution $u = x^2 + c$`, html: String.raw`<p>For integrands like $\dfrac{x}{(x^2 + 1)^2}$ or $x e^{-x^2}$: put $u$ = the inside, then $\mathrm d u = 2x\,\mathrm d x$, so $x\,\mathrm d x = \frac12\,\mathrm d u$. Example: $\displaystyle\int x e^{-x^2}\,\mathrm d x = -\frac12\int e^{u}\,\mathrm d u$ with $u = -x^2$, $= -\frac12 e^{-x^2} + C$.</p>` },
        { type: 'steps', title: String.raw`Bound $\displaystyle S = \sum_{n=1}^{\infty} n e^{-n^2}$ using $S_2$`, steps: [
          { do: String.raw`$f(x) = x e^{-x^2}$: continuous and positive for $x \ge 1$`, why: 'Product of positive continuous functions.' },
          { do: String.raw`$f'(x) = e^{-x^2} + x\cdot(-2x)e^{-x^2} = e^{-x^2}(1 - 2x^2)$`, why: 'Product rule and chain rule.' },
          { do: String.raw`$f'(x) < 0$ for $x \ge 1$`, why: String.raw`$1 - 2x^2 \le -1 < 0$ there: decreasing. The test applies.` },
          { do: String.raw`$S_2 = e^{-1} + 2e^{-4} \approx 0.367879 + 0.036631 = 0.404510$`, why: 'The first two terms.' },
          { do: String.raw`$\displaystyle\int_N^\infty x e^{-x^2}\,\mathrm d x = \lim_{t\to\infty}\Big[-\tfrac12 e^{-x^2}\Big]_N^t = \tfrac12 e^{-N^2}$`, why: String.raw`Refresher; $e^{-t^2} \to 0$.` },
          { do: String.raw`lower: $S_2 + \tfrac12 e^{-9} \approx 0.404572$`, why: String.raw`Integral from $N + 1 = 3$.` },
          { do: String.raw`upper: $S_2 + \tfrac12 e^{-4} \approx 0.413668$`, why: String.raw`Integral from $N = 2$.` },
        ] },
        { type: 'guided', title: String.raw`Bound $\displaystyle S = \sum_{n=1}^{\infty} \frac{2n}{(n^2+3)^2}$ using $S_2$`, problem: String.raw`$f(x) = \dfrac{2x}{(x^2+3)^2}$ is continuous, positive and decreasing on $[1, \infty)$ (its derivative is $\frac{6(1 - x^2)}{(x^2+3)^3} \le 0$). Find $S_2$ and an interval for $S$.`, steps: [
          { prompt: String.raw`Compute $S_2 = f(1) + f(2)$.`, ask: { kind: 'numeric', answer: '2/16 + 4/49', tol: 1e-8 }, hint: String.raw`$f(1) = \frac{2}{4^2}$, $f(2) = \frac{4}{7^2}$.`, reveal: String.raw`$S_2 = \frac18 + \frac{4}{49} \approx 0.206633$.` },
          { prompt: String.raw`With $u = x^2 + 3$, $\mathrm d u = 2x\,\mathrm d x$: $\displaystyle\int_N^\infty \frac{2x}{(x^2+3)^2}\,\mathrm d x = ?$ (type an expression in <code>N</code>)`, ask: { kind: 'expression', answer: '1./(N.^2 + 3)', variable: 'N', domain: [1, 5], label: '∫ =' }, hint: String.raw`$\int u^{-2}\,\mathrm d u = -u^{-1}$; at $\infty$ it is $0$.`, reveal: String.raw`$\Big[-\dfrac{1}{x^2 + 3}\Big]_N^\infty = \dfrac{1}{N^2 + 3}$.` },
          { prompt: String.raw`Lower bound $S_2 + \int_3^\infty f$?`, ask: { kind: 'numeric', answer: '2/16 + 4/49 + 1/12', tol: 1e-8 }, hint: String.raw`$\frac{1}{3^2 + 3} = \frac{1}{12}$.`, reveal: String.raw`$S \ge 0.206633 + 0.083333 = 0.289966$.` },
          { prompt: String.raw`Upper bound $S_2 + \int_2^\infty f$?`, ask: { kind: 'numeric', answer: '2/16 + 4/49 + 1/7', tol: 1e-8 }, hint: String.raw`$\frac{1}{2^2 + 3} = \frac17$.`, reveal: String.raw`$S \le 0.206633 + 0.142857 = 0.349490$.` },
        ] },
      ],
    },
    // ------------------------------------------------------------------ 9
    {
      id: 'comparison',
      title: 'The direct comparison test',
      blocks: [
        { type: 'callout', kind: 'thm', title: 'Direct comparison test (series with non-negative terms)', html: String.raw`<p>Suppose $0 \le a_n \le b_n$ for all $n \ge n_0$.</p><ul><li>If the <b>bigger</b> series $\sum b_n$ converges, so does $\sum a_n$.</li><li>If the <b>smaller</b> series $\sum a_n$ diverges, so does $\sum b_n$.</li></ul><p>Compare with series you know: geometric series and $p$-series.</p>` },
        { type: 'refresher', title: 'comparing fractions', html: String.raw`<p>For positive numbers: a <b>bigger denominator</b> gives a <b>smaller</b> fraction, and a bigger numerator a bigger fraction. Example: $3^n + n > 3^n$, so $\dfrac{1}{3^n + n} < \dfrac{1}{3^n}$.</p>` },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{1}{3^n + n}$ converges`, steps: [
          { do: String.raw`$3^n + n > 3^n > 0$`, why: String.raw`Adding the positive number $n$ makes the denominator bigger.` },
          { do: String.raw`$0 < \dfrac{1}{3^n + n} < \dfrac{1}{3^n} = \left(\dfrac13\right)^n$`, why: 'Bigger denominator, smaller fraction (refresher).' },
          { do: String.raw`$\sum \left(\frac13\right)^n$ converges`, why: String.raw`Geometric with $|r| = \frac13 < 1$.` },
          { do: String.raw`$\sum \frac{1}{3^n + n}$ converges`, why: 'Direct comparison: it is smaller than a convergent series.' },
        ] },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{3}{n^2 + 5n}$ converges`, steps: [
          { do: String.raw`$n^2 + 5n \ge n^2$`, why: String.raw`$5n > 0$ for $n \ge 1$.` },
          { do: String.raw`$0 < \dfrac{3}{n^2 + 5n} \le \dfrac{3}{n^2}$`, why: 'Bigger denominator, smaller fraction.' },
          { do: String.raw`$\sum \frac{3}{n^2} = 3\sum\frac{1}{n^2}$ converges`, why: String.raw`$p$-series with $p = 2 > 1$, times a constant.` },
          { do: String.raw`the series converges`, why: 'Direct comparison.' },
        ] },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{2 + \sin n}{n}$ diverges`, steps: [
          { do: String.raw`$2 + \sin n \ge 2 - 1 = 1$`, why: String.raw`$\sin n \ge -1$.` },
          { do: String.raw`$\dfrac{2 + \sin n}{n} \ge \dfrac1n \ge 0$`, why: String.raw`Divide by $n > 0$.` },
          { do: String.raw`$\sum \frac1n$ diverges`, why: 'Harmonic series.' },
          { do: String.raw`the series diverges`, why: 'Direct comparison: it is bigger than a divergent series.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{\cos^2 n}{n^3}$`, problem: String.raw`Decide convergence of $\displaystyle\sum_{n=1}^{\infty} \frac{\cos^2 n}{n^3}$ by direct comparison.`, steps: [
          { prompt: 'Which bound is correct?', ask: { kind: 'choice', choices: [String.raw`$0 \le \dfrac{\cos^2 n}{n^3} \le \dfrac{1}{n^3}$`, String.raw`$\dfrac{\cos^2 n}{n^3} \ge \dfrac{1}{n^3}$`, String.raw`$\dfrac{\cos^2 n}{n^3} \le \dfrac{1}{n}$ only`], answer: 0 }, hint: String.raw`$0 \le \cos^2 n \le 1$.`, reveal: String.raw`$0 \le \frac{\cos^2 n}{n^3} \le \frac{1}{n^3}$.` },
          { prompt: String.raw`$\sum \frac{1}{n^3}$ is a $p$-series with $p = ?$`, ask: { kind: 'numeric', answer: '3' }, hint: 'The power of n.', reveal: String.raw`$p = 3 > 1$: it converges.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges by direct comparison', 'diverges by direct comparison', 'no conclusion'], answer: 0 }, hint: 'Smaller than a convergent series.', reveal: String.raw`$\sum \frac{\cos^2 n}{n^3}$ converges.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=3}^{\infty} \frac{\ln n}{\sqrt n}$`, problem: String.raw`Decide convergence of $\displaystyle\sum_{n=3}^{\infty} \frac{\ln n}{\sqrt n}$ by direct comparison.`, steps: [
          { prompt: String.raw`For $n \ge 3$, $\ln n > 1$ (because $3 > e \approx 2.718$). Which bound follows?`, ask: { kind: 'choice', choices: [String.raw`$\dfrac{\ln n}{\sqrt n} > \dfrac{1}{\sqrt n}$`, String.raw`$\dfrac{\ln n}{\sqrt n} < \dfrac{1}{\sqrt n}$`, String.raw`$\dfrac{\ln n}{\sqrt n} < \dfrac{1}{n^2}$`], answer: 0 }, hint: 'A bigger numerator gives a bigger fraction.', reveal: String.raw`$\dfrac{\ln n}{\sqrt n} > \dfrac{1}{\sqrt n} > 0$.` },
          { prompt: String.raw`$\sum \frac{1}{\sqrt n}$ is a $p$-series with $p = ?$`, ask: { kind: 'numeric', answer: '1/2' }, hint: String.raw`$\sqrt n = n^{1/2}$.`, reveal: String.raw`$p = \frac12 \le 1$: it diverges.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges', 'diverges by direct comparison', 'no conclusion'], answer: 1 }, hint: 'Bigger than a divergent series.', reveal: String.raw`$\sum \frac{\ln n}{\sqrt n}$ diverges.` },
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>The inequality must go the right way. "Smaller than a divergent series" or "bigger than a convergent series" proves nothing. Example: $\frac{1}{n^2 - 1/2} > \frac{1}{n^2}$ says nothing by direct comparison with $\sum \frac1{n^2}$ — use the limit comparison test instead (next lesson).</p>` },
      ],
    },
    // ------------------------------------------------------------------ 10
    {
      id: 'limit-comparison',
      title: 'The limit comparison test',
      blocks: [
        { type: 'text', html: String.raw`<p>For large $n$ the terms $a_n = \dfrac{n+1}{n^3+2}$ behave like $b_n = \dfrac1{n^2}$. Move the slider: the ratio $a_n/b_n$ approaches $1$, so the two series share their fate.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'a(x) = (x+1)/(x³+2) and b(x) = 1/x²',
          functions: [{ expr: '(x + 1)./(x.^3 + 2)', label: String.raw`$a(x) = \frac{x+1}{x^3+2}$` }, { expr: '1./x.^2', label: String.raw`$b(x) = \frac{1}{x^2}$`, dash: true }],
          params: { N: { min: 1, max: 60, value: 3, step: 1, label: '$n$' } },
          xlim: [0.5, 12], ylim: [0, 1.2],
          readout: 'At $n = {{N}}$: $a_n/b_n = {{(N+1)*N^2/(N^3+2)}}$.',
        } },
        { type: 'callout', kind: 'thm', title: 'Limit comparison test', html: String.raw`<p><b>Pre-conditions:</b> $a_n > 0$, $b_n > 0$ and $\displaystyle\lim_{n\to\infty} \frac{a_n}{b_n} = c$ with $0 < c < \infty$ (a positive finite number). Then $\sum a_n$ and $\sum b_n$ both converge or both diverge.</p>` },
        { type: 'refresher', title: String.raw`choosing $b_n$: keep the dominant powers`, html: String.raw`<p>In numerator and denominator keep only the fastest-growing term, and drop the constants in front: $\dfrac{n+1}{n^3+2} \approx \dfrac{n}{n^3} = \dfrac{1}{n^2}$; $\;\dfrac{1}{\sqrt{n^5 + n}} \approx \dfrac{1}{\sqrt{n^5}} = \dfrac{1}{n^{5/2}}$.</p>` },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{n+1}{n^3+2}$`, steps: [
          { do: String.raw`$b_n = \dfrac{1}{n^2}$`, why: String.raw`Dominant powers: $\frac{n}{n^3}$ (refresher).` },
          { do: String.raw`$a_n > 0$, $b_n > 0$`, why: 'Pre-condition: both positive for n ≥ 1.' },
          { do: String.raw`$\dfrac{a_n}{b_n} = \dfrac{n+1}{n^3 + 2}\cdot n^2 = \dfrac{n^3 + n^2}{n^3 + 2}$`, why: String.raw`Dividing by $\frac1{n^2}$ is multiplying by $n^2$.` },
          { do: String.raw`$= \dfrac{1 + 1/n}{1 + 2/n^3} \to 1$`, why: String.raw`Divide by $n^3$.` },
          { do: String.raw`$c = 1$, and $0 < 1 < \infty$`, why: 'Pre-condition on the limit.' },
          { do: String.raw`$\sum \frac1{n^2}$ converges ($p = 2 > 1$) $\Rightarrow$ $\sum \frac{n+1}{n^3+2}$ converges`, why: 'Limit comparison test.' },
        ] },
        { type: 'steps', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{1}{\sqrt{n^5 + n}}$`, steps: [
          { do: String.raw`$b_n = \dfrac{1}{n^{5/2}}$`, why: String.raw`Dominant power under the root: $\sqrt{n^5} = n^{5/2}$.` },
          { do: String.raw`$\dfrac{a_n}{b_n} = \dfrac{n^{5/2}}{\sqrt{n^5 + n}} = \sqrt{\dfrac{n^5}{n^5 + n}}$`, why: String.raw`$n^{5/2} = \sqrt{n^5}$, and a quotient of roots is the root of the quotient.` },
          { do: String.raw`$= \sqrt{\dfrac{1}{1 + n^{-4}}} \to 1$`, why: String.raw`Divide inside by $n^5$; $n^{-4} \to 0$.` },
          { do: String.raw`$p = \tfrac52 > 1$: $\sum b_n$ converges $\Rightarrow$ the series converges`, why: 'Limit comparison test (both series positive, c = 1).' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{2n + 3}{n^3 - n + 4}$`, problem: String.raw`Decide convergence with the limit comparison test. (The denominator is positive for $n \ge 1$ since $n^3 \ge n$.)`, steps: [
          { prompt: 'Which $b_n$ do you compare with?', ask: { kind: 'choice', choices: [String.raw`$\dfrac{1}{n^2}$`, String.raw`$\dfrac{1}{n}$`, String.raw`$\dfrac{1}{n^3}$`], answer: 0 }, hint: String.raw`Dominant powers: $\frac{2n}{n^3}$, drop the constant 2.`, reveal: String.raw`$b_n = \frac{1}{n^2}$.` },
          { prompt: String.raw`$\dfrac{a_n}{b_n} = \dfrac{2n^3 + 3n^2}{n^3 - n + 4}$. Its limit $c = ?$`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`Divide by $n^3$.`, reveal: String.raw`$\dfrac{2 + 3/n}{1 - 1/n^2 + 4/n^3} \to 2$, and $0 < 2 < \infty$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges', 'diverges', 'no conclusion'], answer: 0 }, hint: String.raw`What does $\sum \frac{1}{n^2}$ do?`, reveal: String.raw`$\sum\frac{1}{n^2}$ converges ($p = 2$), so the series converges.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{1}{\sqrt{n + 7}}$`, problem: String.raw`Decide convergence with the limit comparison test.`, steps: [
          { prompt: String.raw`Compare with $b_n = n^{-p}$. What is $p$?`, ask: { kind: 'numeric', answer: '1/2' }, hint: String.raw`$\sqrt{n + 7} \approx \sqrt n = n^{1/2}$.`, reveal: String.raw`$b_n = \frac{1}{\sqrt n}$, $p = \frac12$.` },
          { prompt: String.raw`$\dfrac{a_n}{b_n} = \sqrt{\dfrac{n}{n + 7}}$. Its limit?`, ask: { kind: 'numeric', answer: '1' }, hint: String.raw`$\frac{n}{n+7} = \frac{1}{1 + 7/n}$.`, reveal: String.raw`$c = 1$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges', 'diverges', 'no conclusion'], answer: 1 }, hint: String.raw`$p = \frac12 \le 1$.`, reveal: String.raw`$\sum \frac{1}{\sqrt n}$ diverges, so the series diverges.` },
        ] },
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
  assignIntro: String.raw`<p>Every problem below is the same type as a worked example and a guided exercise you have already done — the links above each problem take you back to them. If you get stuck, use the hints one at a time, then "Walk me through it".</p>`,
  assignments: [
    {
      id: 'a1',
      title: 'Geometric series',
      difficulty: 'core',
      examples: ['partial-sums', 'geometric-x'],
      statement: String.raw`<p>Find the sums (exact values).</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\sum_{n=0}^{\infty} \frac{(-2)^n}{3^{n+1}}$`, kind: 'numeric', answer: '1/5',
          hints: [String.raw`Write the term as a constant times $r^n$.`, String.raw`$\frac{(-2)^n}{3\cdot 3^n} = \frac13\left(-\frac23\right)^n$. Then: first term over one minus the ratio.`, String.raw`First term (at $n = 0$) is $\frac13$, ratio $-\frac23$.`],
          walkthrough: [
            { do: String.raw`$\dfrac{(-2)^n}{3^{n+1}} = \dfrac13\left(-\dfrac23\right)^n$`, why: String.raw`$3^{n+1} = 3\cdot 3^n$.` },
            { do: String.raw`$r = -\dfrac23$, $\;|r| < 1$: converges`, why: 'Check the condition.' },
            { do: String.raw`first term ($n = 0$): $\;\dfrac13$`, why: String.raw`$(-\frac23)^0 = 1$.` },
            { do: String.raw`$S = \dfrac{1/3}{1 + 2/3} = \dfrac{1/3}{5/3} = \dfrac15$`, why: 'First term over one minus the ratio.' },
          ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\sum_{n=2}^{\infty} \frac{5}{4^n}$`, kind: 'numeric', answer: '5/12',
          hints: ['Geometric with ratio 1/4 — but it starts at n = 2.', String.raw`The first term is the term at $n = 2$: $\frac{5}{16}$.`, String.raw`$S = \dfrac{5/16}{1 - 1/4}$.`],
          walkthrough: [
            { do: String.raw`$\dfrac{5}{4^n} = 5\left(\dfrac14\right)^n$, $\;r = \dfrac14$`, why: 'Constant times n-th power.' },
            { do: String.raw`first term ($n = 2$): $\;\dfrac{5}{16}$`, why: String.raw`$4^2 = 16$.` },
            { do: String.raw`$S = \dfrac{5/16}{3/4} = \dfrac{5}{16}\cdot\dfrac43 = \dfrac{5}{12}$`, why: 'First term over one minus the ratio.' },
          ] },
        { label: '(c)', prompt: String.raw`The repeating decimal $0.272727\ldots = 0.\overline{27}$ as a fraction.`, kind: 'numeric', answer: '3/11', tol: 1e-9,
          hints: ['Split into repeating blocks: 0.27 + 0.0027 + …', String.raw`First term $\frac{27}{100}$, ratio $\frac{1}{100}$.`, String.raw`$S = \frac{27/100}{99/100} = \frac{27}{99}$; reduce.`],
          walkthrough: [
            { do: String.raw`$0.\overline{27} = \dfrac{27}{100} + \dfrac{27}{100^2} + \cdots$`, why: 'Repeating blocks of two digits.' },
            { do: String.raw`first term $\dfrac{27}{100}$, $\;r = \dfrac{1}{100}$`, why: 'Each block is divided by 100 once more.' },
            { do: String.raw`$S = \dfrac{27/100}{99/100} = \dfrac{27}{99}$`, why: 'First term over one minus the ratio.' },
            { do: String.raw`$= \dfrac{3}{11}$`, why: 'Divide top and bottom by 9.' },
          ] },
        { label: '(d)', prompt: String.raw`For which $x$ does $\displaystyle\sum_{n=0}^{\infty} \frac{(x-1)^n}{2^n}$ converge?`, kind: 'choice', choices: [String.raw`$-1 < x < 3$`, String.raw`$-1 \le x \le 3$`, String.raw`$0 < x < 2$`, String.raw`$-3 < x < 1$`], answer: 0,
          hints: [String.raw`The ratio is $r = \frac{x-1}{2}$. The geometric series converges iff $|r| < 1$.`, String.raw`$|x - 1| < 2 \iff -2 < x - 1 < 2$. And at the endpoints $|r| = 1$.`],
          solution: String.raw`Geometric with ratio $r = \frac{x-1}{2}$: converges iff $|x - 1| < 2$, i.e. $-1 < x < 3$. At $x = -1$ and $x = 3$, $|r| = 1$ and the series diverges.` },
      ],
    },
    {
      id: 'a2',
      title: 'Reflections and a bouncing ball',
      difficulty: 'core',
      hw: 'HW5-style',
      examples: ['reflections', 'geometric-applications'],
      statement: String.raw`<p>(i) Two identical tinted panes each reflect $40\,\%$, absorb $10\,\%$ and transmit $50\,\%$ of the light hitting them (from either side). Light falls on the first pane and bounces back and forth between the panes.</p><p>(ii) A ball is dropped from $h_0 = 1.25$ m. After each impact it rises to $64\,\%$ of its previous height. Use $g = 9.81\ \mathrm{m/s^2}$ and the fall time $t = \sqrt{2h/g}$ from height $h$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`(i) What fraction of the incoming light is transmitted through both panes?`, kind: 'numeric', answer: '25/84', tol: 1e-5,
          hints: ['List the paths: straight through, one round trip in the gap, two round trips, …', String.raw`Each extra round trip in the gap multiplies by $\rho^2 = 0.16$.`, String.raw`$T = \tau^2(1 + \rho^2 + \rho^4 + \cdots)$ with $\tau = 0.5$.`],
          walkthrough: [
            { do: String.raw`$T = \tau^2 + \tau^2\rho^2 + \tau^2\rho^4 + \cdots$`, why: 'Straight through, then with 1, 2, … round trips.' },
            { do: String.raw`$= \dfrac{\tau^2}{1 - \rho^2}$`, why: String.raw`Geometric: first term $\tau^2$, ratio $\rho^2 < 1$.` },
            { do: String.raw`$= \dfrac{0.25}{1 - 0.16} = \dfrac{0.25}{0.84}$`, why: String.raw`$\tau = 0.5$, $\rho = 0.4$.` },
            { do: String.raw`$= \dfrac{25}{84} \approx 0.2976$`, why: 'Multiply top and bottom by 100.' },
          ] },
        { label: '(b)', prompt: String.raw`(i) What fraction is reflected back to the source side in total?`, kind: 'numeric', answer: '0.4 + 0.1/0.84', tol: 1e-5,
          hints: ['Direct reflection, plus light that entered the gap and came back out through the first pane.', String.raw`Paths: $\rho$, $\tau\rho\tau$, $\tau\rho^3\tau$, …`, String.raw`$R = \rho + \dfrac{\tau^2\rho}{1 - \rho^2}$.`],
          walkthrough: [
            { do: String.raw`$R = \rho + \tau^2\rho + \tau^2\rho^3 + \cdots$`, why: 'Direct reflection, then via pane 2 with 0, 1, … extra round trips.' },
            { do: String.raw`$= \rho + \dfrac{\tau^2\rho}{1 - \rho^2}$`, why: String.raw`Geometric part: first term $\tau^2\rho$, ratio $\rho^2$.` },
            { do: String.raw`$= 0.4 + \dfrac{0.25\cdot 0.4}{0.84} = 0.4 + \dfrac{0.1}{0.84}$`, why: 'Insert the numbers.' },
            { do: String.raw`$\approx 0.5190$`, why: String.raw`The absorbed fraction is $1 - T - R \approx 0.1833$.` },
          ] },
        { label: '(c)', prompt: String.raw`(ii) Total distance travelled by the ball, in metres.`, kind: 'numeric', answer: '1.25*1.64/0.36', tol: 1e-5,
          hints: ['First fall plus up-and-down for every rebound.', String.raw`$D = h_0\dfrac{1 + r}{1 - r}$ (derived in the bouncing-ball lesson).`, String.raw`$r = 0.64$, $h_0 = 1.25$.`],
          walkthrough: [
            { do: String.raw`$D = h_0 + 2\sum_{k\ge1} h_0 r^k$`, why: 'First fall and the rebounds.' },
            { do: String.raw`$= h_0\dfrac{1 + r}{1 - r}$`, why: 'Geometric sum from k = 1 and a common denominator.' },
            { do: String.raw`$= 1.25\cdot\dfrac{1.64}{0.36} \approx 5.694$ m`, why: 'Insert the numbers.' },
          ] },
        { label: '(d)', prompt: String.raw`(ii) Total time until the ball comes to rest, in seconds.`, kind: 'numeric', answer: 'sqrt(2*1.25/9.81)*1.8/0.2', tol: 1e-5,
          hints: [String.raw`Times scale with $\sqrt h$, so the ratio is $\sqrt r$.`, String.raw`$\sqrt{0.64} = 0.8$ and $T = t_0\dfrac{1 + \sqrt r}{1 - \sqrt r}$.`, String.raw`$t_0 = \sqrt{2\cdot 1.25/9.81}$.`],
          walkthrough: [
            { do: String.raw`$t_0 = \sqrt{2\cdot 1.25/9.81} \approx 0.5048$ s`, why: 'Time of the first fall.' },
            { do: String.raw`$k$-th rebound: $2t_0(0.8)^k$`, why: String.raw`$\sqrt{r} = 0.8$; up and down.` },
            { do: String.raw`$T = t_0\dfrac{1 + 0.8}{1 - 0.8} = 9t_0$`, why: 'Same algebra as the distance with ratio 0.8.' },
            { do: String.raw`$T \approx 4.543$ s`, why: 'Insert t0.' },
          ] },
      ],
    },
    {
      id: 'a3',
      title: 'A telescoping series',
      difficulty: 'core',
      hw: 'HW5-style',
      examples: ['telescoping-divergence', 'comparison'],
      statement: String.raw`<p>Consider $\displaystyle\sum_{n=1}^{\infty} \frac{1}{2 + 3 + 4 + \cdots + (n+1)}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Give a closed formula for the term $a_n$ in terms of $n$.`, kind: 'expression', variable: 'n', answer: '2./(n.*(n+3))', domain: [1, 6],
          hints: [String.raw`Use $1 + 2 + \cdots + m = \frac{m(m+1)}{2}$.`, String.raw`$2 + 3 + \cdots + (n+1) = (1 + 2 + \cdots + (n+1)) - 1$.`, String.raw`$\dfrac{(n+1)(n+2)}{2} - 1 = \dfrac{n^2 + 3n}{2}$.`],
          walkthrough: [
            { do: String.raw`$2 + \cdots + (n+1) = \dfrac{(n+1)(n+2)}{2} - 1$`, why: 'Gauss sum up to m = n + 1, minus the missing 1.' },
            { do: String.raw`$= \dfrac{n^2 + 3n + 2 - 2}{2} = \dfrac{n(n+3)}{2}$`, why: 'Common denominator and factor.' },
            { do: String.raw`$a_n = \dfrac{2}{n(n+3)}$`, why: 'Reciprocal.' },
          ] },
        { label: '(b)', prompt: String.raw`Which argument proves convergence?`, kind: 'choice', choices: [String.raw`$a_n \to 0$, so the series converges.`, String.raw`$0 < a_n \le \frac{2}{n^2}$ and $\sum \frac{2}{n^2}$ converges ($p = 2$), so it converges by direct comparison.`, String.raw`$a_n \le \frac{2}{n}$ and $\sum \frac2n$ diverges, so it converges.`, String.raw`Ratio of consecutive terms tends to $1$, so it converges.`], answer: 1,
          hints: ['The divergence test can never prove convergence.', String.raw`$n(n+3) \ge n^2$: compare with a convergent $p$-series, as in the comparison lesson.`],
          solution: String.raw`$n(n+3) \ge n^2$ gives $0 < a_n \le 2/n^2$; comparison with a convergent $p$-series. Option 1 confuses a necessary condition with a sufficient one, option 3 compares in the useless direction.` },
        { label: '(c)', prompt: String.raw`Find the sum of the series.`, kind: 'numeric', answer: '11/9', tol: 1e-8,
          hints: ['Partial fractions, then write out the partial sum.', String.raw`$\dfrac{2}{n(n+3)} = \dfrac23\left(\dfrac1n - \dfrac1{n+3}\right)$.`, String.raw`The parts $1, \frac12, \frac13$ survive.`],
          walkthrough: [
            { do: String.raw`$\dfrac{2}{n(n+3)} = \dfrac23\left(\dfrac1n - \dfrac1{n+3}\right)$`, why: String.raw`Cover-up: $2 = A(n+3) + Bn$, $n = 0$ gives $A = \frac23$, $n = -3$ gives $B = -\frac23$.` },
            { do: String.raw`$S_N = \dfrac23\Big[(1 - \tfrac14) + (\tfrac12 - \tfrac15) + (\tfrac13 - \tfrac16) + (\tfrac14 - \tfrac17) + \cdots\Big]$`, why: 'Write out the first terms.' },
            { do: String.raw`$S_N = \dfrac23\left(1 + \dfrac12 + \dfrac13 - \dfrac1{N+1} - \dfrac1{N+2} - \dfrac1{N+3}\right)$`, why: 'Each negative part cancels a positive part three terms later.' },
            { do: String.raw`$S = \dfrac23\cdot\dfrac{11}{6} = \dfrac{11}{9}$`, why: String.raw`Let $N \to \infty$; $1 + \frac12 + \frac13 = \frac{11}{6}$.` },
          ] },
      ],
    },
    {
      id: 'a4',
      title: 'Integral test with remainder bounds',
      difficulty: 'challenge',
      hw: 'HW5-style',
      examples: ['remainder-bounds', 'integral-test'],
      statement: String.raw`<p>Consider $\displaystyle\sum_{n=1}^{\infty} \frac{n}{(n^2+1)^2}$ and $f(x) = \dfrac{x}{(x^2+1)^2}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute the partial sum $S_3$.`, kind: 'numeric', answer: '0.36', tol: 1e-8,
          hints: [String.raw`$S_3 = f(1) + f(2) + f(3)$.`, String.raw`$f(1) = \frac14$, $f(2) = \frac{2}{25}$, $f(3) = \frac{3}{100}$.`],
          walkthrough: [
            { do: String.raw`$f(1) = \dfrac{1}{2^2} = 0.25$`, why: String.raw`$1^2 + 1 = 2$.` },
            { do: String.raw`$f(2) = \dfrac{2}{5^2} = 0.08, \quad f(3) = \dfrac{3}{10^2} = 0.03$`, why: String.raw`$2^2 + 1 = 5$, $3^2 + 1 = 10$.` },
            { do: String.raw`$S_3 = 0.25 + 0.08 + 0.03 = 0.36$`, why: 'Add.' },
          ] },
        { label: '(b)', prompt: String.raw`Lower bound for the sum $S$ from $S_3$ and the integral test.`, kind: 'numeric', answer: '0.36 + 1/34', tol: 1e-7,
          hints: [String.raw`The lower bound is $S_3 + \int_4^\infty f(x)\,\mathrm d x$.`, String.raw`Substitute $u = x^2 + 1$, $\mathrm d u = 2x\,\mathrm d x$.`, String.raw`$\int_N^\infty f = \dfrac{1}{2(N^2 + 1)}$.`],
          walkthrough: [
            { do: String.raw`$\displaystyle\int \frac{x}{(x^2+1)^2}\,\mathrm d x = \frac12\int u^{-2}\,\mathrm d u = -\frac{1}{2u} = -\frac{1}{2(x^2+1)}$`, why: String.raw`$u = x^2 + 1$, $x\,\mathrm d x = \frac12\mathrm d u$.` },
            { do: String.raw`$\displaystyle\int_N^\infty f = \lim_{t\to\infty}\Big[-\frac{1}{2(x^2+1)}\Big]_N^t = \frac{1}{2(N^2+1)}$`, why: 'The value at t tends to 0.' },
            { do: String.raw`$\displaystyle\int_4^\infty f = \frac{1}{2\cdot 17} = \frac{1}{34}$`, why: String.raw`Lower bound uses $N + 1 = 4$.` },
            { do: String.raw`$S \ge 0.36 + \dfrac{1}{34} \approx 0.389412$`, why: 'Add S3.' },
          ] },
        { label: '(c)', prompt: String.raw`Upper bound for $S$.`, kind: 'numeric', answer: '0.41', tol: 1e-7,
          hints: [String.raw`The upper bound is $S_3 + \int_3^\infty f(x)\,\mathrm d x$.`, String.raw`$\int_3^\infty f = \frac{1}{2(9 + 1)}$.`],
          walkthrough: [
            { do: String.raw`$\displaystyle\int_3^\infty f = \frac{1}{2(3^2 + 1)} = \frac{1}{20}$`, why: 'Formula from (b) with N = 3.' },
            { do: String.raw`$S \le 0.36 + 0.05$`, why: 'Add S3.' },
            { do: String.raw`$S \le 0.41$`, why: 'Arithmetic.' },
          ] },
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
      examples: ['divergence-test', 'limit-comparison', 'integral-test', 'comparison'],
      statement: String.raw`<p>Decide convergence. The correct option names a test whose pre-conditions actually hold. Each series is the same type as one worked in the lessons on the divergence test, the integral test, and the two comparison tests.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{n}{2n + 1}$`, kind: 'choice', choices: ['converges by comparison with $\\sum 1/n^2$', 'diverges by the divergence test', 'diverges by the integral test with $p = 1$', 'converges: geometric with $r = 1/2$'], answer: 1,
          hints: ['First check: do the terms tend to 0?', String.raw`Divide top and bottom by $n$: $\frac{1}{2 + 1/n}$.`],
          solution: String.raw`$\frac{n}{2n+1} \to \frac12 \ne 0$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{1}{\sqrt{n^3 + 1}}$`, kind: 'choice', choices: ['converges by limit comparison with $\\sum n^{-3/2}$', 'diverges by limit comparison with $\\sum n^{-1/2}$', 'diverges by the divergence test', 'converges because the terms tend to 0'], answer: 0,
          hints: [String.raw`Keep the dominant power under the root: $\sqrt{n^3} = n^{3/2}$.`, String.raw`$\dfrac{a_n}{n^{-3/2}} = \sqrt{\dfrac{n^3}{n^3 + 1}} \to 1$. Is $p = \frac32$ bigger than $1$?`],
          solution: String.raw`$\dfrac{1/\sqrt{n^3+1}}{n^{-3/2}} = \sqrt{\dfrac{n^3}{n^3+1}} \to 1$; $p = \tfrac32 > 1$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\sum_{n=2}^\infty \frac{1}{n\ln n}$`, kind: 'choice', choices: ['converges by comparison with $\\sum 1/n^2$', 'converges by the integral test', 'diverges by the integral test', 'diverges by the divergence test'], answer: 2,
          hints: ['This exact series is worked in the integral-test lesson.', String.raw`With $u = \ln x$: $\int_2^t \frac{\mathrm d x}{x\ln x} = \ln(\ln t) - \ln(\ln 2)$. What happens as $t \to \infty$?`],
          solution: String.raw`$f(x) = \frac1{x\ln x}$ is continuous, positive and decreasing on $[2, \infty)$, and $\int_2^\infty \frac{\mathrm d x}{x\ln x} = \lim_{t\to\infty}\big[\ln(\ln x)\big]_2^t = \infty$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{\sin^2 n}{n^2}$`, kind: 'choice', choices: ['diverges: $\\sin^2 n$ does not converge', 'converges by direct comparison with $\\sum 1/n^2$', 'the integral test applies', 'diverges by limit comparison with $\\sum 1/n$'], answer: 1,
          hints: [String.raw`Bound the numerator: $0 \le \sin^2 n \le 1$.`, String.raw`Same pattern as $\sum\frac{\cos^2 n}{n^3}$ in the comparison lesson. (Is $\frac{\sin^2 x}{x^2}$ decreasing? If not, the integral test cannot be used.)`],
          solution: String.raw`$0 \le \frac{\sin^2 n}{n^2} \le \frac{1}{n^2}$. The integral test does not apply: $\sin^2 x/x^2$ is not decreasing.` },
        { label: '(e)', prompt: String.raw`$\displaystyle\sum_{n=3}^\infty \frac{\ln n}{n}$`, kind: 'choice', choices: ['converges by limit comparison with $\\sum 1/n^2$', 'diverges by direct comparison: $\\frac{\\ln n}{n} \\ge \\frac1n$ for $n \\ge 3$', 'converges by the divergence test', 'diverges by the divergence test'], answer: 1,
          hints: [String.raw`For $n \ge 3$, $\ln n > 1$.`, String.raw`Same pattern as $\sum \frac{\ln n}{\sqrt n}$ in the comparison lesson: bigger than a divergent series.`],
          solution: String.raw`For $n \ge 3$, $\ln n > 1$, so $\frac{\ln n}{n} > \frac1n \ge 0$ and $\sum \frac1n$ diverges. (Note: the divergence test never proves convergence.)` },
      ],
    },
  ],
};
