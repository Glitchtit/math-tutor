// Module 20: Alternating series, absolute and conditional convergence, ratio and root tests.
// Written to the hand-holding standard (see CONTENT.md): every assignment type is first worked
// step by step, then practised in a guided exercise with new numbers.

export default {
  id: 'alternating',
  number: 20,
  part: 'series',
  hw: 'HW6',
  title: 'Alternating series, absolute convergence, ratio and root tests',
  summary: 'The alternating series test with its three conditions, the remainder bound |R_N| ≤ b_(N+1) and the sign of the remainder, how many terms a given accuracy needs, checking "eventually decreasing" with the derivative, absolute versus conditional convergence, and the ratio and root tests (powers, factorials, n^n and the number e, and the inconclusive case ρ = 1).',
  intro: String.raw`<p>When the terms change sign, cancellation can make a series converge even though the sizes of the terms add up to infinity. This module gives the test for alternating series — which also comes with an excellent, easy error bound — and the two tests that handle series with factorials and powers: the ratio and root tests.</p><p>Each lesson introduces <b>one</b> new idea, shows it fully worked, and then lets you do the same type yourself, one small step at a time.</p>`,
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
        { type: 'text', html: String.raw`<p><b>Notation.</b> An alternating series is written $\sum (-1)^{n+1} b_n$ or $\sum (-1)^n b_n$. The factor $(-1)^{n+1}$ only produces the signs $+, -, +, -, \dots$; the number $b_n$ is the <b>size</b> of the $n$-th term. For $\sum \frac{(-1)^{n+1}}{n^3}$ the size is $b_n = \frac{1}{n^3}$.</p><p>$S_N$ is the <b>partial sum</b> (the sum of the first $N$ terms), $S$ the sum of the whole series, and $R_N = S - S_N$ the <b>remainder</b>: the error we make when we stop after $N$ terms.</p>` },
        { type: 'callout', kind: 'thm', title: 'Alternating series test (Leibniz)', html: String.raw`<p>Consider $\sum (-1)^{n+1} b_n$ (or $\sum (-1)^n b_n$). If</p><ol><li>$b_n > 0$ for all $n$ (the series really <b>alternates</b>),</li><li>$b_{n+1} \le b_n$ for all $n \ge n_0$ (<b>decreasing</b>, at least eventually),</li><li>$\lim_{n\to\infty} b_n = 0$,</li></ol><p>then the series converges. Moreover, if the conditions hold from $n = N+1$ on, the remainder $R_N = S - S_N$ satisfies</p>$$|R_N| \le b_{N+1},$$<p>and $R_N$ has the <b>same sign as the first omitted term</b>. So $S$ lies between $S_N$ and $S_{N+1}$.</p>` },
        { type: 'steps', title: String.raw`Example 1: check the three conditions for $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n^3}$`, steps: [
          { do: String.raw`$b_n = \dfrac{1}{n^3}$`, why: String.raw`Remove the sign factor $(-1)^{n+1}$; what is left is the size of the $n$-th term.` },
          { do: String.raw`Condition 1: $\; b_n = \dfrac{1}{n^3} > 0$ for $n \ge 1$`, why: String.raw`$1$ divided by a positive number is positive. So the signs really alternate.` },
          { do: String.raw`Condition 2: $\; (n+1)^3 > n^3$`, why: String.raw`A larger positive base gives a larger cube.` },
          { do: String.raw`$\Rightarrow\; b_{n+1} = \dfrac{1}{(n+1)^3} < \dfrac{1}{n^3} = b_n$`, why: String.raw`Same numerator, larger denominator: the fraction is smaller. So the sizes decrease.` },
          { do: String.raw`Condition 3: $\; \displaystyle\lim_{n\to\infty} \frac{1}{n^3} = 0$`, why: String.raw`The denominator grows without bound, so the fraction shrinks to $0$.` },
          { do: String.raw`The series converges by the alternating series test.`, why: 'All three conditions hold, so the theorem applies.' },
        ] },
        { type: 'steps', title: String.raw`Example 2: estimate $\displaystyle S = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n^3}$ with $S_4$ and say where $S$ lies`, steps: [
          { do: String.raw`$S_4 = 1 - \dfrac18 + \dfrac1{27} - \dfrac1{64}$`, why: String.raw`The first four terms: $n = 1, 2, 3, 4$ give the sizes $\frac1{1}, \frac18, \frac1{27}, \frac1{64}$ with signs $+, -, +, -$.` },
          { do: String.raw`$S_4 = 1 - 0.125 + 0.037037 - 0.015625 = 0.896412$`, why: 'Convert to decimals (6 decimals) and add.' },
          { do: String.raw`First omitted term: $\; n = 5:\; (-1)^{6}\dfrac{1}{125} = +\dfrac{1}{125}$`, why: String.raw`We stopped after $n = 4$, so the first term we left out is $n = 5$. Its sign is $(-1)^{5+1} = +1$.` },
          { do: String.raw`$|R_4| \le b_5 = \dfrac{1}{125} = 0.008$`, why: String.raw`The error bound of the theorem: the error is at most the size of the first omitted term. (The conditions were checked in Example 1.)` },
          { do: String.raw`$R_4 > 0$, so $S > S_4$`, why: String.raw`The remainder has the sign of the first omitted term, which is $+$. A positive remainder means the true sum is larger than $S_4$.` },
          { do: String.raw`$0.896412 < S \le 0.896412 + 0.008 = 0.904412$`, why: String.raw`$S$ is above $S_4$, but by at most $0.008$. (True value: $S = 0.901543\ldots$ — inside the interval.)` },
        ] },
        { type: 'guided', title: String.raw`Estimate $\displaystyle S = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n\,3^n}$ with $S_3$`, problem: String.raw`Use $S_3$ to estimate $S = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n\,3^n}$, bound the error and give the interval that contains $S$. Same steps as Example 2.`, steps: [
          { prompt: String.raw`<b>Conditions.</b> The size is $b_n = \frac{1}{n\,3^n}$.`, show: String.raw`$b_n > 0$; both $n$ and $3^n$ grow, so the denominator grows and $b_{n+1} < b_n$; and $b_n \to 0$. The test applies.`, why: 'Always check the three conditions before using the error bound.' },
          { prompt: String.raw`<b>Partial sum.</b> Compute $S_3 = \frac{1}{1\cdot 3} - \frac{1}{2\cdot 9} + \frac{1}{3\cdot 27}$ (a fraction or 6 decimals).`, ask: { kind: 'numeric', answer: '47/162', tol: 1e-6 }, hint: String.raw`$\frac13 - \frac1{18} + \frac1{81}$. Common denominator $162$: $\frac{54}{162} - \frac{9}{162} + \frac{2}{162}$.`, reveal: String.raw`$S_3 = \frac{54 - 9 + 2}{162} = \frac{47}{162} \approx 0.290123$.` },
          { prompt: String.raw`<b>Error bound.</b> $|R_3| \le b_4 = \;?$`, ask: { kind: 'numeric', answer: '1/324', tol: 1e-6 }, hint: String.raw`Put $n = 4$ into $b_n = \frac{1}{n\,3^n}$.`, reveal: String.raw`$b_4 = \frac{1}{4\cdot 81} = \frac{1}{324} \approx 0.003086$.` },
          { prompt: String.raw`<b>Sign.</b> The first omitted term is $(-1)^{5}\,b_4$. Where is $S$?`, ask: { kind: 'choice', choices: [String.raw`$S_3 < S \le S_3 + \frac1{324}$`, String.raw`$S_3 - \frac1{324} \le S < S_3$`, String.raw`the sign cannot be known`], answer: 1 }, hint: String.raw`$(-1)^5 = -1$: the first omitted term is negative, and the remainder has its sign.`, reveal: String.raw`The remainder is negative, so $S < S_3$: $\;S_3 - \frac1{324} \le S < S_3$.` },
          { prompt: String.raw`<b>Lower endpoint.</b> Compute $S_3 - b_4$.`, ask: { kind: 'numeric', answer: '31/108', tol: 1e-6 }, hint: String.raw`$\frac{47}{162} - \frac{1}{324} = \frac{94}{324} - \frac{1}{324}$.`, reveal: String.raw`$\frac{93}{324} = \frac{31}{108} \approx 0.287037$. So $0.287037 \le S < 0.290123$. (True value: $\ln\frac43 = 0.287682$.)` },
        ], finale: String.raw`Same recipe as the example: check the conditions, add the first $N$ terms, the bound is the next size $b_{N+1}$, the sign is the sign of the next term.` },
        { type: 'callout', kind: 'warn', html: String.raw`<p>All three conditions are needed. $\sum (-1)^n \frac{n}{n+1}$ alternates, but $b_n = \frac{n}{n+1} \to 1$: condition 3 fails, and the series diverges by the divergence test. Always write down all three checks — including the sign check $b_n > 0$.</p>` },
        { type: 'quiz', question: String.raw`For $\sum_{n=1}^\infty (-1)^{n+1} b_n$ satisfying the test, $S_6$ is computed. Which is true?`, choices: [String.raw`$S_6 < S \le S_6 + b_7$`, String.raw`$S_6 - b_7 \le S < S_6$`, String.raw`$|S - S_6| \le b_6$ is the best bound`, String.raw`Nothing can be said about the sign`], answer: 0, explain: String.raw`The first omitted term is $(-1)^{8} b_7 = +b_7 > 0$, so $R_6 > 0$ and $0 < R_6 \le b_7$.` },
      ],
    },
    {
      id: 'alternating-accuracy',
      title: 'How many terms for a given accuracy?',
      blocks: [
        { type: 'text', html: String.raw`<p>Turn the error bound around: instead of "how big is the error after $N$ terms?" ask "how many terms $N$ make the error smaller than a tolerance, say $10^{-4}$?" Because $|R_N| \le b_{N+1}$, it is enough to find the first $N$ with $b_{N+1} < 10^{-4}$.</p>` },
        { type: 'refresher', title: 'flipping an inequality between reciprocals, and trial tables', html: String.raw`<p>For positive numbers, $\dfrac{1}{A} < \dfrac{1}{B}$ is the same as $A > B$: a smaller fraction needs a larger denominator. For example $\frac1A < 10^{-4} = \frac{1}{10000}$ means $A > 10000$.</p><p>When the unknown sits both in a factor and in an exponent, as in $k\cdot 3^k > 10000$, there is no algebraic way to solve it. Make a small <b>table</b> of $k = 1, 2, 3, \dots$ and read off the first $k$ that works.</p>` },
        { type: 'steps', title: String.raw`Example: smallest $N$ with guaranteed $|R_N| < 10^{-4}$ for $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n\,3^n}$`, steps: [
          { do: String.raw`$|R_N| \le b_{N+1} = \dfrac{1}{(N+1)\,3^{N+1}}$`, why: String.raw`The alternating series bound. Its conditions hold: $b_n = \frac1{n3^n}$ is positive, decreasing and tends to $0$ (previous lesson). $b_{N+1}$ means: put $n = N+1$ into $b_n$.` },
          { do: String.raw`It suffices that $\dfrac{1}{(N+1)\,3^{N+1}} < 10^{-4}$`, why: String.raw`If the bound is below $10^{-4}$, the error, which is even smaller, is too.` },
          { do: String.raw`$\Leftrightarrow\; (N+1)\,3^{N+1} > 10^{4} = 10000$`, why: 'Take reciprocals of both (positive) sides; the inequality flips (refresher).' },
          { do: String.raw`Let $k = N + 1$: we need $k\cdot 3^k > 10000$`, why: 'A shorter name for the unknown makes the table easier to write.' },
          { do: String.raw`$k = 5:\; 5\cdot 243 = 1215; \quad k = 6:\; 6\cdot 729 = 4374; \quad k = 7:\; 7\cdot 2187 = 15309$`, why: String.raw`Trial table. $k = 6$ gives $4374$, still below $10000$; $k = 7$ is the first value above.` },
          { do: String.raw`$k = 7 \;\Rightarrow\; N = k - 1 = 6$`, why: String.raw`$k$ was $N + 1$.` },
          { do: String.raw`Check: $b_7 = \tfrac{1}{15309} \approx 6.5\cdot 10^{-5} < 10^{-4}$, but $b_6 = \tfrac{1}{4374} \approx 2.3\cdot 10^{-4}$ is not.`, why: String.raw`So $N = 6$ works and $N = 5$ is not guaranteed by the bound: $N = 6$ is the smallest.` },
        ] },
        { type: 'guided', title: String.raw`Smallest $N$ with $|R_N| < 10^{-4}$ for $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n\,5^n}$`, problem: String.raw`Find the smallest $N$ for which the alternating series bound guarantees $|R_N| < 10^{-4}$ for $\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n\,5^n}$. (The conditions hold: $b_n = \frac{1}{n5^n}$ is positive, decreasing and tends to $0$.)`, steps: [
          { prompt: String.raw`With $k = N + 1$ the condition $b_k < 10^{-4}$ becomes $k\cdot 5^k > c$. What is $c$?`, ask: { kind: 'numeric', answer: '10000' }, hint: String.raw`$\frac{1}{k\,5^k} < \frac{1}{10000}$; flip both sides.`, reveal: String.raw`$k\cdot 5^k > 10^4 = 10000$.` },
          { prompt: String.raw`Trial table: what is $4\cdot 5^4$?`, ask: { kind: 'numeric', answer: '2500' }, hint: String.raw`$5^4 = 625$.`, reveal: String.raw`$4 \cdot 625 = 2500 < 10000$: not enough.` },
          { prompt: String.raw`$5 \cdot 5^5 = 15625$. What is the smallest $k$ that works?`, ask: { kind: 'numeric', answer: '5' }, hint: String.raw`$k = 4$ was too small; $k = 5$ gives $15625 > 10000$.`, reveal: String.raw`$k = 5$.` },
          { prompt: String.raw`So the smallest $N$ is:`, ask: { kind: 'numeric', answer: '4' }, hint: String.raw`$k = N + 1$.`, reveal: String.raw`$N = 5 - 1 = 4$. Check: $b_5 = \frac{1}{15625} = 6.4\cdot 10^{-5} < 10^{-4}$.` },
        ] },
        { type: 'quiz', question: String.raw`For $\displaystyle\sum_{n=1}^\infty \frac{(-1)^{n}}{n^2}$, the smallest $N$ for which the bound guarantees $|R_N| < 0.01$ is`, choices: ['9', '10', '11', '100'], answer: 1, explain: String.raw`Need $b_{N+1} = \frac{1}{(N+1)^2} < 0.01$, i.e. $(N+1)^2 > 100$, i.e. $N + 1 > 10$, so $N + 1 = 11$ and $N = 10$.` },
      ],
    },
    {
      id: 'conditional',
      title: 'Absolute vs conditional convergence',
      blocks: [
        { type: 'callout', kind: 'def', title: 'Absolute and conditional convergence', html: String.raw`<p>$\sum a_n$ converges <b>absolutely</b> if $\sum |a_n|$ converges. It converges <b>conditionally</b> if $\sum a_n$ converges but $\sum |a_n|$ diverges.</p><p><b>Theorem.</b> Absolute convergence implies convergence. (So for series with mixed signs, try the positive-term tests on $|a_n|$ first.)</p>` },
        { type: 'callout', kind: 'key', title: 'The classification recipe', html: String.raw`<ol><li><b>Absolute?</b> Test the positive series $\sum |a_n|$ (comparison, limit comparison, $p$-series, ratio test). If it converges: <b>absolutely convergent</b>, done.</li><li><b>Conditional?</b> If $\sum |a_n|$ diverges, test $\sum a_n$ itself with the alternating series test (all three conditions). If it converges: <b>conditionally convergent</b>.</li><li><b>Divergent.</b> If the terms do not tend to $0$, the divergence test says the series diverges.</li></ol>` },
        { type: 'refresher', title: String.raw`$p$-series and the limit comparison test (module 19)`, html: String.raw`<ul><li>$\sum \frac{1}{n^p}$ converges if $p > 1$ and diverges if $p \le 1$. Note $\frac{1}{\sqrt n} = \frac{1}{n^{1/2}}$ has $p = \frac12$.</li><li><b>Limit comparison:</b> if $a_n > 0$, $c_n > 0$ and $\lim \frac{a_n}{c_n}$ is a number strictly between $0$ and $\infty$, then $\sum a_n$ and $\sum c_n$ do the same thing (both converge or both diverge).</li><li>To choose $c_n$: keep only the fastest-growing part of the numerator and of the denominator.</li></ul>`, steps: [
          { do: String.raw`$\dfrac{\sqrt n}{2\sqrt n + 1} = \dfrac{1}{2 + 1/\sqrt n}$`, why: String.raw`Typical limit: divide numerator and denominator by $\sqrt n$.` },
          { do: String.raw`$\to \dfrac{1}{2 + 0} = \dfrac12$`, why: String.raw`$1/\sqrt n \to 0$.` },
        ] },
        { type: 'steps', title: String.raw`Example: classify $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^n}{\sqrt n + 3}$`, steps: [
          { do: String.raw`$|a_n| = \dfrac{1}{\sqrt n + 3}$`, why: String.raw`Step 1 of the recipe: test absolute convergence. The absolute value removes the factor $(-1)^n$.` },
          { do: String.raw`Compare with $c_n = \dfrac{1}{\sqrt n}$`, why: String.raw`For large $n$ the $+3$ is tiny next to $\sqrt n$, so $|a_n|$ behaves like $\frac{1}{\sqrt n}$.` },
          { do: String.raw`$\dfrac{|a_n|}{c_n} = \dfrac{1}{\sqrt n + 3}\cdot\dfrac{\sqrt n}{1} = \dfrac{\sqrt n}{\sqrt n + 3}$`, why: String.raw`Dividing by $\frac{1}{\sqrt n}$ is multiplying by $\sqrt n$.` },
          { do: String.raw`$= \dfrac{1}{1 + 3/\sqrt n} \;\to\; 1$`, why: String.raw`Divide numerator and denominator by $\sqrt n$; then $3/\sqrt n \to 0$. The limit $1$ lies strictly between $0$ and $\infty$.` },
          { do: String.raw`$\sum \dfrac{1}{\sqrt n} = \sum \dfrac{1}{n^{1/2}}$ diverges`, why: String.raw`$p$-series with $p = \frac12 \le 1$.` },
          { do: String.raw`$\sum |a_n|$ diverges: <b>not</b> absolutely convergent`, why: 'Limit comparison test: both series do the same thing.' },
          { do: String.raw`AST condition 1: $\; b_n = \dfrac{1}{\sqrt n + 3} > 0$`, why: 'Step 2 of the recipe: the alternating series test on the series itself. The denominator is positive.' },
          { do: String.raw`Condition 2: $\; \sqrt{n+1} + 3 > \sqrt n + 3 \;\Rightarrow\; b_{n+1} < b_n$`, why: String.raw`$\sqrt{\ }$ is increasing, so the denominator grows and the fraction shrinks.` },
          { do: String.raw`Condition 3: $\; b_n = \dfrac{1}{\sqrt n + 3} \to 0$`, why: 'The denominator grows without bound.' },
          { do: String.raw`The series converges, but not absolutely: <b>conditionally convergent</b>`, why: 'The alternating series test gives convergence; step 1 showed there is no absolute convergence.' },
        ] },
        { type: 'guided', title: String.raw`Classify $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^n}{3\sqrt n - 1}$`, problem: String.raw`Classify $\sum_{n=1}^{\infty} \frac{(-1)^n}{3\sqrt n - 1}$ as absolutely convergent, conditionally convergent or divergent. (For $n \ge 1$, $3\sqrt n - 1 \ge 2 > 0$.)`, steps: [
          { prompt: String.raw`<b>Absolute convergence.</b> $|a_n| = \frac{1}{3\sqrt n - 1}$. Compare with $c_n = \frac{1}{\sqrt n}$: compute $\lim \frac{|a_n|}{c_n}$.`, ask: { kind: 'numeric', answer: '1/3' }, hint: String.raw`$\frac{|a_n|}{c_n} = \frac{\sqrt n}{3\sqrt n - 1}$; divide top and bottom by $\sqrt n$.`, reveal: String.raw`$\frac{\sqrt n}{3\sqrt n - 1} = \frac{1}{3 - 1/\sqrt n} \to \frac13$, a number in $(0, \infty)$.` },
          { prompt: String.raw`$\sum \frac{1}{\sqrt n}$ is a $p$-series. What is $p$?`, ask: { kind: 'numeric', answer: '1/2' }, hint: String.raw`$\sqrt n = n^{1/2}$.`, reveal: String.raw`$p = \frac12 \le 1$: divergent. By limit comparison $\sum |a_n|$ diverges — no absolute convergence.` },
          { prompt: String.raw`<b>Alternating series test.</b> $b_n = \frac{1}{3\sqrt n - 1} > 0$, and $b_n$ decreases because $3\sqrt n - 1$ increases. What is $\lim b_n$?`, ask: { kind: 'numeric', answer: '0' }, hint: 'The denominator grows without bound.', reveal: String.raw`$b_n \to 0$. All three conditions hold.` },
          { prompt: 'Conclusion: the series is', ask: { kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 1 }, hint: 'It converges (alternating series test) but the absolute values diverge.', reveal: String.raw`<b>Conditionally convergent.</b>` },
        ] },
        { type: 'quiz', question: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^n}{n^{2/3}}$ is`, choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 1, explain: String.raw`$\sum n^{-2/3}$ diverges ($p < 1$), but $b_n = n^{-2/3}$ is positive, decreasing and tends to $0$.` },
      ],
    },
    {
      id: 'absolute-divergent',
      title: 'Absolute convergence by comparison, and divergent alternating series',
      blocks: [
        { type: 'text', html: String.raw`<p>Two short cases of the classification recipe. If $\sum |a_n|$ converges, you are done at step 1 — no alternating series test is needed. If the sizes $|a_n|$ do not tend to $0$, the series diverges and no other test is needed.</p>` },
        { type: 'refresher', title: String.raw`$0 < \sin t \le t$ for $0 < t \le 1$`, html: String.raw`<p>On the unit circle, the arc of length $t$ is longer than the vertical height $\sin t$, so $\sin t \le t$ for $t \ge 0$. (Calculus proof: $g(t) = t - \sin t$ has $g(0) = 0$ and $g'(t) = 1 - \cos t \ge 0$, so $g$ never goes below $0$.) And $\sin t > 0$ for $0 < t < \pi$, in particular for $0 < t \le 1$.</p>` },
        { type: 'steps', title: String.raw`Example: classify $\displaystyle\sum_{n=1}^{\infty} (-1)^n \sin\!\left(\frac{1}{n^{3/2}}\right)$`, steps: [
          { do: String.raw`$0 < \dfrac{1}{n^{3/2}} \le 1$ for $n \ge 1$`, why: String.raw`$n^{3/2} \ge 1$ when $n \ge 1$, so its reciprocal is between $0$ and $1$.` },
          { do: String.raw`$|a_n| = \sin\!\left(\dfrac{1}{n^{3/2}}\right)$`, why: String.raw`The sine of a number in $(0, 1]$ is positive (refresher), so the absolute value just removes $(-1)^n$.` },
          { do: String.raw`$\sin\!\left(\dfrac{1}{n^{3/2}}\right) \le \dfrac{1}{n^{3/2}}$`, why: String.raw`$\sin t \le t$ with $t = \frac{1}{n^{3/2}}$.` },
          { do: String.raw`$\sum \dfrac{1}{n^{3/2}}$ converges`, why: String.raw`$p$-series with $p = \frac32 > 1$.` },
          { do: String.raw`$\sum |a_n|$ converges`, why: String.raw`Direct comparison: $0 < |a_n| \le \frac{1}{n^{3/2}}$, and the bigger series converges.` },
          { do: String.raw`<b>Absolutely convergent</b> (and therefore convergent)`, why: 'Step 1 of the recipe already settles it.' },
        ] },
        { type: 'guided', title: String.raw`Classify $\displaystyle\sum_{n=1}^{\infty} (-1)^n \sin\!\left(\frac{2}{n^3}\right)$`, problem: String.raw`Classify $\sum_{n=1}^{\infty} (-1)^n \sin\!\left(\frac{2}{n^3}\right)$. (For $n \ge 1$, $0 < \frac{2}{n^3} \le 2 < \pi$, so the sine is positive.)`, steps: [
          { prompt: String.raw`Using $\sin t \le t$, give an upper bound for $|a_n|$ as a function of $n$ (MATLAB syntax).`, ask: { kind: 'expression', answer: '2./n.^3', variable: 'n', domain: [1, 5], label: '|a_n| ≤' }, hint: String.raw`Put $t = \frac{2}{n^3}$ into $\sin t \le t$.`, reveal: String.raw`$|a_n| = \sin\frac{2}{n^3} \le \frac{2}{n^3}$.` },
          { prompt: String.raw`$\sum \frac{2}{n^3} = 2\sum \frac{1}{n^3}$ is a multiple of a $p$-series. What is $p$?`, ask: { kind: 'numeric', answer: '3' }, hint: String.raw`Look at the power of $n$ in the denominator.`, reveal: String.raw`$p = 3 > 1$: it converges.` },
          { prompt: 'So the series is', ask: { kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 0 }, hint: String.raw`By direct comparison $\sum |a_n|$ converges.`, reveal: String.raw`<b>Absolutely convergent.</b>` },
        ] },
        { type: 'steps', title: String.raw`Example: classify $\displaystyle\sum_{n=1}^{\infty} (-1)^n \frac{n}{n+1}$`, steps: [
          { do: String.raw`$|a_n| = \dfrac{n}{n+1}$`, why: 'Look at the sizes of the terms first.' },
          { do: String.raw`$= \dfrac{1}{1 + 1/n}$`, why: String.raw`Divide numerator and denominator by $n$.` },
          { do: String.raw`$\to \dfrac{1}{1 + 0} = 1$`, why: String.raw`$1/n \to 0$.` },
          { do: String.raw`$a_n$ does not tend to $0$`, why: String.raw`The terms keep jumping between values near $-1$ and near $+1$.` },
          { do: String.raw`<b>Divergent</b> by the divergence test`, why: String.raw`A convergent series must have $a_n \to 0$. The alternating series test cannot help here: its condition 3 fails.` },
        ] },
        { type: 'guided', title: String.raw`Classify $\displaystyle\sum_{n=1}^{\infty} (-1)^n \frac{2n+1}{n+5}$`, problem: String.raw`Classify $\sum_{n=1}^{\infty} (-1)^n \frac{2n+1}{n+5}$.`, steps: [
          { prompt: String.raw`Compute $\lim_{n\to\infty} |a_n| = \lim \frac{2n+1}{n+5}$.`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`Divide numerator and denominator by $n$.`, reveal: String.raw`$\frac{2 + 1/n}{1 + 5/n} \to 2$.` },
          { prompt: String.raw`Do the terms $a_n$ tend to $0$?`, ask: { kind: 'choice', choices: ['yes', 'no'], answer: 1 }, hint: String.raw`Their sizes tend to $2$.`, reveal: String.raw`No: the terms jump between values near $-2$ and $+2$.` },
          { prompt: 'So the series is', ask: { kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 2 }, hint: 'Divergence test.', reveal: String.raw`<b>Divergent</b> by the divergence test.` },
        ] },
        { type: 'quiz', question: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{\cos n}{n^2}$ is`, choices: ['divergent, since $\\cos n$ has no limit', 'absolutely convergent', 'conditionally convergent by the alternating series test', 'not decidable with our tests'], answer: 1, explain: String.raw`It is not alternating, but $\left|\frac{\cos n}{n^2}\right| \le \frac{1}{n^2}$, so $\sum |a_n|$ converges by comparison; absolute convergence implies convergence.` },
      ],
    },
    {
      id: 'eventually-decreasing',
      title: 'Checking "decreasing" with the derivative',
      blocks: [
        { type: 'text', html: String.raw`<p>Is $b_n = \dfrac{\sqrt n}{n+4}$ decreasing? The first terms say no: $b_1 = 0.2$, $b_2 \approx 0.236$, $b_3 \approx 0.247$. Plot $f(x) = \sqrt x/(x+4)$ and its derivative: $f$ increases until $x = 4$ and decreases afterwards. The test only needs "decreasing from some $n_0$ on" — finitely many early terms never change whether a series converges.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'f(x) = √x/(x+4) and f\'(x) = (4 − x)/(2√x (x+4)²)',
          functions: [{ expr: 'sqrt(x)./(x + 4)', label: String.raw`$f(x)$` }, { expr: '(4 - x)./(2*sqrt(x).*(x + 4).^2)', label: String.raw`$f'(x)$`, dash: true }],
          xlim: [0, 30], ylim: [-0.05, 0.3],
          points: [{ x: 4, y: 0.25, label: 'max at x = 4' }],
          hlines: [0],
        } },
        { type: 'text', html: String.raw`<p><b>The method.</b> Replace $n$ by a real variable $x$ to get a function $f(x)$ with $f(n) = b_n$. Where $f'(x) < 0$ the function decreases, so the terms $b_n$ decrease there too.</p>` },
        { type: 'refresher', title: 'quotient rule, derivative of ln, and the sign of a fraction', html: String.raw`<ul><li>Quotient rule: $\left(\dfrac{u}{v}\right)' = \dfrac{u'v - uv'}{v^2}$.</li><li>$(\sqrt x)' = (x^{1/2})' = \dfrac{1}{2\sqrt x}$, and $(x^{1/3})' = \frac13 x^{-2/3}$.</li><li>$(\ln x)' = \dfrac1x$; by the chain rule $\big((\ln x)^2\big)' = 2\ln x\cdot\dfrac1x$.</li><li>If the denominator of a fraction is positive, the fraction has the sign of its numerator.</li><li>$\ln x > c \iff x > e^{c}$ (exp is increasing).</li></ul>` },
        { type: 'steps', title: String.raw`Example 1: for which $n$ is $b_n = \dfrac{\sqrt n}{n+4}$ decreasing?`, steps: [
          { do: String.raw`$f(x) = \dfrac{\sqrt x}{x + 4}$, so $f(n) = b_n$`, why: String.raw`Replace $n$ by $x$ to be allowed to differentiate.` },
          { do: String.raw`$u = \sqrt x,\; u' = \dfrac{1}{2\sqrt x};\quad v = x + 4,\; v' = 1$`, why: 'Name the numerator and denominator for the quotient rule and differentiate each.' },
          { do: String.raw`$f'(x) = \dfrac{\frac{x+4}{2\sqrt x} - \sqrt x}{(x+4)^2}$`, why: String.raw`Quotient rule $\frac{u'v - uv'}{v^2}$: $u'v = \frac{x+4}{2\sqrt x}$ and $uv' = \sqrt x$.` },
          { do: String.raw`$\dfrac{x+4}{2\sqrt x} - \sqrt x = \dfrac{x + 4 - 2x}{2\sqrt x} = \dfrac{4 - x}{2\sqrt x}$`, why: String.raw`Common denominator: $\sqrt x = \frac{2x}{2\sqrt x}$ because $\sqrt x\cdot 2\sqrt x = 2x$.` },
          { do: String.raw`$f'(x) = \dfrac{4 - x}{2\sqrt x\,(x+4)^2}$`, why: 'Put the simplified numerator back.' },
          { do: String.raw`$f'(x) < 0 \iff 4 - x < 0 \iff x > 4$`, why: String.raw`The denominator is positive for $x > 0$, so $f'$ has the sign of $4 - x$.` },
          { do: String.raw`$b_n$ is decreasing for $n \ge 4$`, why: String.raw`$f$ decreases on $[4, \infty)$. That is enough for condition 2 of the alternating series test.` },
        ] },
        { type: 'steps', title: String.raw`Example 2: classify $\displaystyle\sum_{n=2}^{\infty} (-1)^n \frac{\ln n}{n}$`, steps: [
          { do: String.raw`$|a_n| = \dfrac{\ln n}{n} \ge \dfrac{1}{n}$ for $n \ge 3$`, why: String.raw`Absolute convergence first. $\ln n \ge 1$ when $n \ge e \approx 2.718$, i.e. for $n \ge 3$.` },
          { do: String.raw`$\sum \dfrac{\ln n}{n}$ diverges: not absolutely convergent`, why: String.raw`Direct comparison: it is larger than the harmonic series $\sum \frac1n$, which diverges.` },
          { do: String.raw`Condition 1: $\; b_n = \dfrac{\ln n}{n} > 0$ for $n \ge 2$`, why: String.raw`$\ln n > 0$ for $n > 1$.` },
          { do: String.raw`$f(x) = \dfrac{\ln x}{x}:\quad f'(x) = \dfrac{\frac1x\cdot x - \ln x\cdot 1}{x^2}$`, why: String.raw`Quotient rule with $u = \ln x$, $u' = \frac1x$, $v = x$, $v' = 1$.` },
          { do: String.raw`$f'(x) = \dfrac{1 - \ln x}{x^2}$`, why: String.raw`$\frac1x \cdot x = 1$.` },
          { do: String.raw`$f'(x) < 0 \iff 1 - \ln x < 0 \iff \ln x > 1 \iff x > e$`, why: String.raw`$x^2 > 0$, so the sign is that of $1 - \ln x$; then exponentiate (refresher).` },
          { do: String.raw`Condition 2: $\; b_n$ is decreasing for $n \ge 3$`, why: String.raw`$e \approx 2.718$, so every integer $n \ge 3$ lies in the decreasing region.` },
          { do: String.raw`Condition 3: $\; \displaystyle\lim_{x\to\infty}\frac{\ln x}{x} = \lim_{x\to\infty}\frac{1/x}{1} = 0$`, why: String.raw`Form $\frac{\infty}{\infty}$, so L'Hôpital: differentiate numerator and denominator separately.` },
          { do: String.raw`<b>Conditionally convergent</b>`, why: 'The alternating series test gives convergence; there is no absolute convergence.' },
        ] },
        { type: 'guided', title: String.raw`Classify $\displaystyle\sum_{n=2}^{\infty} (-1)^n \frac{\ln n}{n^{1/3}}$`, problem: String.raw`Classify $\sum_{n=2}^{\infty} (-1)^n \frac{\ln n}{n^{1/3}}$, finding where $b_n = \frac{\ln n}{n^{1/3}}$ decreases. Same steps as Example 2.`, steps: [
          { prompt: String.raw`<b>Absolute convergence.</b> For $n \ge 3$, $\frac{\ln n}{n^{1/3}} \ge \frac{1}{n^{1/3}}$. Does $\sum \frac{1}{n^{1/3}}$ converge?`, ask: { kind: 'choice', choices: [String.raw`yes, $p = \frac13$`, String.raw`no, $p = \frac13 \le 1$`], answer: 1 }, hint: String.raw`A $p$-series converges only when $p > 1$.`, reveal: String.raw`No ($p = \frac13$). By direct comparison $\sum |a_n|$ diverges: no absolute convergence.` },
          { prompt: String.raw`<b>Derivative.</b> The quotient rule with $u = \ln x$, $v = x^{1/3}$ gives $f'(x) = \dfrac{3 - \ln x}{3x^{4/3}}$. $f'(x) < 0$ exactly for $x > c$. What is $c$?`, ask: { kind: 'numeric', answer: 'exp(3)', tol: 1e-6 }, hint: String.raw`The denominator is positive, so you need $3 - \ln x < 0$, i.e. $\ln x > 3$.`, reveal: String.raw`$\ln x > 3 \iff x > e^3 \approx 20.09$.` },
          { prompt: String.raw`From which integer $n$ on is $b_n$ decreasing?`, ask: { kind: 'numeric', answer: '21' }, hint: String.raw`The first integer larger than $e^3 \approx 20.09$.`, reveal: String.raw`$b_n$ is decreasing for $n \ge 21$ — late, but "eventually" is all the test needs.` },
          { prompt: String.raw`<b>Limit.</b> By L'Hôpital, $\lim \frac{\ln x}{x^{1/3}} = \lim \frac{1/x}{\frac13 x^{-2/3}} = \lim \frac{3}{x^{1/3}}$. What is it?`, ask: { kind: 'numeric', answer: '0' }, hint: String.raw`$x^{1/3} \to \infty$.`, reveal: String.raw`$\frac{3}{x^{1/3}} \to 0$, so $b_n \to 0$.` },
          { prompt: 'Conclusion: the series is', ask: { kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 1 }, hint: 'Converges by the alternating series test, but not absolutely.', reveal: String.raw`<b>Conditionally convergent.</b>` },
        ] },
      ],
    },
    {
      id: 'ratio-test',
      title: 'The ratio test',
      blocks: [
        { type: 'text', html: String.raw`<p>For $a_n = \dfrac{n^2}{2^n}$ the ratio of consecutive terms $\dfrac{a_{n+1}}{a_n} = \dfrac12\left(\dfrac{n+1}{n}\right)^2$ settles at $\tfrac12$. Far out, the series looks like a geometric series with ratio $\tfrac12$ — and converges.</p>` },
        { type: 'widget', name: 'sequence', config: {
          title: 'Ratios a_(n+1)/a_n for a_n = n²/2^n',
          a: '((n + 1)./n).^2/2', nmax: 40, L: 0.5, Ltex: String.raw`\tfrac12`, eps: 0.1, ylim: [0, 2.2],
        } },
        { type: 'callout', kind: 'thm', title: 'Ratio test', html: String.raw`<p>Let $a_n \ne 0$ and $\displaystyle\rho = \lim_{n\to\infty}\left|\frac{a_{n+1}}{a_n}\right|$.</p><ul><li>$\rho < 1$: $\sum a_n$ converges <b>absolutely</b>.</li><li>$\rho > 1$ or $\rho = \infty$: $\sum a_n$ <b>diverges</b> (the terms do not tend to $0$).</li><li>$\rho = 1$: <b>inconclusive</b> — use another test.</li></ul><p>Recipe: (1) write $a_{n+1}$ by replacing every $n$ by $n+1$; (2) form the ratio and turn the division into a multiplication; (3) simplify each kind of factor separately; (4) take the limit.</p>` },
        { type: 'callout', kind: 'key', html: String.raw`<p>Use the ratio test for factorials and exponentials ($n!$, $3^n$, $n^n$). It gives $\rho = 1$ for every $p$-series and every rational function of $n$, so it is useless there (see the last lesson).</p>` },
        { type: 'refresher', title: 'exponent rules for the ratio test', html: String.raw`<ul><li>$\dfrac{3^n}{3^{n+1}} = \dfrac{3^n}{3^n\cdot 3} = \dfrac13$.</li><li>$\dfrac{(n+1)^3}{n^3} = \left(\dfrac{n+1}{n}\right)^3 = \left(1 + \dfrac1n\right)^3 \to 1$.</li><li>$|(-1)^n| = 1$: the sign factors disappear in $\left|\frac{a_{n+1}}{a_n}\right|$.</li></ul>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} (-1)^n \frac{n^3}{3^n}$ with the ratio test`, steps: [
          { do: String.raw`$|a_n| = \dfrac{n^3}{3^n}$`, why: String.raw`The ratio test uses absolute values, so the factor $(-1)^n$ disappears.` },
          { do: String.raw`$|a_{n+1}| = \dfrac{(n+1)^3}{3^{n+1}}$`, why: String.raw`Replace every $n$ by $n + 1$.` },
          { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{(n+1)^3}{3^{n+1}}\cdot\dfrac{3^n}{n^3}$`, why: 'Dividing by a fraction is multiplying by its reciprocal.' },
          { do: String.raw`$= \dfrac{(n+1)^3}{n^3}\cdot\dfrac{3^n}{3^{n+1}}$`, why: 'Group the factors of the same kind: powers of $n$ together, powers of 3 together.' },
          { do: String.raw`$\dfrac{3^n}{3^{n+1}} = \dfrac13$`, why: String.raw`$3^{n+1} = 3^n\cdot 3$; cancel $3^n$.` },
          { do: String.raw`$\dfrac{(n+1)^3}{n^3} = \left(1 + \dfrac1n\right)^3$`, why: String.raw`$\frac{n+1}{n} = 1 + \frac1n$.` },
          { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac13\left(1 + \dfrac1n\right)^3 \;\to\; \dfrac13$`, why: String.raw`$\frac1n \to 0$, so the bracket tends to $1^3 = 1$.` },
          { do: String.raw`$\rho = \tfrac13 < 1$: converges absolutely`, why: 'Ratio test. (Absolute convergence implies convergence.)' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} (-1)^n \frac{n^4}{5^n}$ with the ratio test`, problem: String.raw`Apply the ratio test to $\sum_{n=1}^{\infty} (-1)^n \frac{n^4}{5^n}$.`, steps: [
          { prompt: String.raw`After grouping, $\left|\frac{a_{n+1}}{a_n}\right| = \frac{(n+1)^4}{n^4}\cdot\frac{5^n}{5^{n+1}}$. Simplify the second factor $\frac{5^n}{5^{n+1}}$.`, ask: { kind: 'numeric', answer: '1/5' }, hint: String.raw`$5^{n+1} = 5^n \cdot 5$.`, reveal: String.raw`$\frac{5^n}{5^{n+1}} = \frac15$.` },
          { prompt: String.raw`What is $\lim \frac{(n+1)^4}{n^4} = \lim \left(1 + \frac1n\right)^4$?`, ask: { kind: 'numeric', answer: '1' }, hint: String.raw`$\frac1n \to 0$.`, reveal: String.raw`$(1 + 0)^4 = 1$.` },
          { prompt: String.raw`So $\rho = \;?$`, ask: { kind: 'numeric', answer: '1/5' }, hint: 'Multiply the two limits.', reveal: String.raw`$\rho = 1\cdot\frac15 = \frac15$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges absolutely', 'converges conditionally', 'diverges', 'inconclusive'], answer: 0 }, hint: String.raw`$\rho < 1$.`, reveal: String.raw`$\rho = \frac15 < 1$: the series converges absolutely.` },
        ] },
      ],
    },
    {
      id: 'ratio-factorial',
      title: 'The ratio test with factorials',
      blocks: [
        { type: 'text', html: String.raw`<p>Factorials are where the ratio test shines, because a ratio of two neighbouring factorials collapses to a single factor.</p>` },
        { type: 'refresher', title: String.raw`simplifying $\frac{(n+1)!}{n!}$ and $\frac{(2n+2)!}{(2n)!}$`, html: String.raw`<p>$n! = 1\cdot 2\cdot 3 \cdots n$. So $(n+1)! = n!\cdot(n+1)$: one more factor at the end. With numbers: $5! = 4!\cdot 5$.</p>`, steps: [
          { do: String.raw`$\dfrac{(n+1)!}{n!} = \dfrac{n!\,(n+1)}{n!} = n + 1$`, why: String.raw`Write the bigger factorial as the smaller one times the missing factors, then cancel. Example: $\frac{5!}{4!} = 5$.` },
          { do: String.raw`$\big(2(n+1)\big)! = (2n+2)! = (2n)!\,(2n+1)(2n+2)$`, why: String.raw`From $(2n)!$ to $(2n+2)!$ two factors are missing: $2n+1$ and $2n+2$. Example: $8! = 6!\cdot 7\cdot 8$.` },
          { do: String.raw`$\dfrac{(2n+2)!}{(2n)!} = (2n+1)(2n+2)$`, why: String.raw`Cancel $(2n)!$.` },
          { do: String.raw`$\dfrac{(n!)^2}{\big((n+1)!\big)^2} = \left(\dfrac{n!}{(n+1)!}\right)^2 = \dfrac{1}{(n+1)^2}$`, why: 'A square of a ratio is the ratio of the squares; then use the first line upside down.' },
        ] },
        { type: 'steps', title: String.raw`Example 1: $\displaystyle\sum_{n=0}^{\infty} \frac{2^n}{n!}$`, steps: [
          { do: String.raw`$a_{n+1} = \dfrac{2^{n+1}}{(n+1)!}$`, why: String.raw`Replace $n$ by $n + 1$.` },
          { do: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{2^{n+1}}{2^n}\cdot\dfrac{n!}{(n+1)!}$`, why: 'Multiply by the reciprocal of $a_n$ and group factors of the same kind.' },
          { do: String.raw`$= 2\cdot\dfrac{1}{n+1}$`, why: String.raw`$\frac{2^{n+1}}{2^n} = 2$ and $\frac{n!}{(n+1)!} = \frac{1}{n+1}$ (refresher).` },
          { do: String.raw`$\to 0 = \rho$`, why: String.raw`$\frac{2}{n+1} \to 0$.` },
          { do: String.raw`$\rho = 0 < 1$: converges`, why: 'Ratio test. (Its sum is $e^2$ — see the Taylor module.)' },
        ] },
        { type: 'steps', title: String.raw`Example 2: $\displaystyle\sum_{n=1}^{\infty} \frac{(2n)!}{(n!)^2\,7^n}$`, steps: [
          { do: String.raw`$a_{n+1} = \dfrac{(2n+2)!}{\big((n+1)!\big)^2\,7^{n+1}}$`, why: String.raw`Replace every $n$ by $n+1$; note $2n$ becomes $2(n+1) = 2n + 2$.` },
          { do: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{(2n+2)!}{(2n)!}\cdot\dfrac{(n!)^2}{\big((n+1)!\big)^2}\cdot\dfrac{7^n}{7^{n+1}}$`, why: 'Multiply by the reciprocal of $a_n$ and put matching factors together.' },
          { do: String.raw`$\dfrac{(2n+2)!}{(2n)!} = (2n+2)(2n+1)$`, why: 'Refresher, line 3.' },
          { do: String.raw`$\dfrac{(n!)^2}{\big((n+1)!\big)^2} = \dfrac{1}{(n+1)^2}$`, why: 'Refresher, line 4.' },
          { do: String.raw`$\dfrac{7^n}{7^{n+1}} = \dfrac17$`, why: String.raw`Cancel $7^n$.` },
          { do: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{(2n+2)(2n+1)}{7\,(n+1)^2}$`, why: 'Multiply the three simplified factors.' },
          { do: String.raw`$= \dfrac{2(n+1)(2n+1)}{7\,(n+1)^2} = \dfrac{2(2n+1)}{7(n+1)}$`, why: String.raw`Factor $2n + 2 = 2(n+1)$ and cancel one $(n+1)$.` },
          { do: String.raw`$= \dfrac{2(2 + 1/n)}{7(1 + 1/n)} \;\to\; \dfrac{4}{7}$`, why: String.raw`Divide numerator and denominator by $n$; then $\frac1n \to 0$.` },
          { do: String.raw`$\rho = \tfrac47 < 1$: converges (absolutely)`, why: 'Ratio test.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{(2n)!}{(n!)^2\,6^n}$ with the ratio test`, problem: String.raw`Apply the ratio test to $\sum_{n=1}^{\infty} \frac{(2n)!}{(n!)^2\,6^n}$, exactly as in Example 2.`, steps: [
          { prompt: String.raw`Simplify $\dfrac{(2n+2)!}{(2n)!}$ (an expression in <code>n</code>).`, ask: { kind: 'expression', answer: '(2*n+2).*(2*n+1)', variable: 'n', domain: [1, 6], label: '=' }, hint: String.raw`Two factors are missing from $(2n)!$ to $(2n+2)!$.`, reveal: String.raw`$(2n+2)(2n+1)$.` },
          { prompt: String.raw`Simplify $\dfrac{(n!)^2}{\big((n+1)!\big)^2}$.`, ask: { kind: 'expression', answer: '1./(n+1).^2', variable: 'n', domain: [1, 6], label: '=' }, hint: String.raw`$\frac{n!}{(n+1)!} = \frac{1}{n+1}$, then square.`, reveal: String.raw`$\frac{1}{(n+1)^2}$.` },
          { prompt: String.raw`With $\frac{6^n}{6^{n+1}} = \frac16$, the ratio is $\frac{(2n+2)(2n+1)}{6(n+1)^2} = \frac{2(2n+1)}{6(n+1)}$. What is $\rho$?`, ask: { kind: 'numeric', answer: '2/3' }, hint: String.raw`Divide by $n$: $\frac{2(2 + 1/n)}{6(1 + 1/n)}$.`, reveal: String.raw`$\rho = \frac{4}{6} = \frac23$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges', 'diverges', 'inconclusive'], answer: 0 }, hint: String.raw`Compare $\rho$ with $1$.`, reveal: String.raw`$\rho = \frac23 < 1$: converges.` },
        ] },
        { type: 'quiz', question: String.raw`What does the ratio test give for $\displaystyle\sum_{n=1}^\infty \frac{n!}{5^n}$?`, choices: [String.raw`$\rho = 1/5$, converges`, String.raw`$\rho = 1$, inconclusive`, String.raw`$\rho = \infty$, diverges`, String.raw`$\rho = 5$, diverges`], answer: 2, explain: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{n+1}{5} \to \infty$. Factorials beat every exponential.` },
      ],
    },
    {
      id: 'ratio-e',
      title: 'The ratio test with n^n: the number e',
      blocks: [
        { type: 'text', html: String.raw`<p>When $n^n$ appears, the ratio test produces the expression $\left(\frac{n}{n+1}\right)^n$. Its limit is not $1$ (a common mistake) but $\frac1e$.</p>` },
        { type: 'refresher', title: String.raw`the limit $\left(1 + \frac1n\right)^n \to e$`, html: String.raw`<p>$\displaystyle\lim_{n\to\infty}\left(1 + \frac1n\right)^n = e \approx 2.71828$. With numbers: $n = 10$ gives $2.5937$, $n = 100$ gives $2.7048$, $n = 1000$ gives $2.7169$. (It is a $1^\infty$ form: the base tends to $1$ but the exponent grows, and the two effects balance.)</p>`, steps: [
          { do: String.raw`$\left(\dfrac{n}{n+1}\right)^n = \dfrac{1}{\left(\frac{n+1}{n}\right)^n}$`, why: 'Flip the fraction inside and put the power in the denominator.' },
          { do: String.raw`$= \dfrac{1}{\left(1 + \frac1n\right)^n} \;\to\; \dfrac1e$`, why: String.raw`$\frac{n+1}{n} = 1 + \frac1n$, and the denominator tends to $e$.` },
        ] },
        { type: 'steps', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} \frac{n!}{n^n}$`, steps: [
          { do: String.raw`$a_{n+1} = \dfrac{(n+1)!}{(n+1)^{n+1}}$`, why: String.raw`Replace every $n$ by $n+1$ — also in the exponent.` },
          { do: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{(n+1)!}{n!}\cdot\dfrac{n^n}{(n+1)^{n+1}}$`, why: 'Multiply by the reciprocal of $a_n$ and group.' },
          { do: String.raw`$\dfrac{(n+1)!}{n!} = n + 1$`, why: 'Factorial refresher.' },
          { do: String.raw`$(n+1)^{n+1} = (n+1)\cdot(n+1)^n$`, why: String.raw`Exponent rule $b^{m+1} = b\cdot b^m$.` },
          { do: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{(n+1)\,n^n}{(n+1)\,(n+1)^n} = \dfrac{n^n}{(n+1)^n}$`, why: String.raw`Cancel the factor $n + 1$.` },
          { do: String.raw`$= \left(\dfrac{n}{n+1}\right)^n \;\to\; \dfrac1e$`, why: 'Same exponent, so combine into one power; then the refresher.' },
          { do: String.raw`$\rho = \tfrac1e \approx 0.368 < 1$: converges`, why: 'Ratio test.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{2^n\, n!}{n^n}$`, problem: String.raw`Apply the ratio test to $\sum_{n=1}^{\infty} \frac{2^n\, n!}{n^n}$.`, steps: [
          { prompt: String.raw`The ratio is $\frac{2^{n+1}}{2^n}\cdot\frac{(n+1)!}{n!}\cdot\frac{n^n}{(n+1)^{n+1}}$. What is $\frac{2^{n+1}}{2^n}$?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`$2^{n+1} = 2\cdot 2^n$.`, reveal: String.raw`$\frac{2^{n+1}}{2^n} = 2$.` },
          { prompt: String.raw`The other two factors give $\frac{(n+1)\,n^n}{(n+1)(n+1)^n} = \left(\frac{n}{n+1}\right)^n$, exactly as in the example. What is its limit?`, ask: { kind: 'numeric', answer: 'exp(-1)', tol: 1e-6 }, hint: 'See the refresher.', reveal: String.raw`$\left(\frac{n}{n+1}\right)^n \to \frac1e$.` },
          { prompt: String.raw`So $\rho = \;?$`, ask: { kind: 'numeric', answer: '2/exp(1)', tol: 1e-6 }, hint: 'Multiply the two limits.', reveal: String.raw`$\rho = \frac{2}{e} \approx 0.736$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges', 'diverges', 'inconclusive'], answer: 0 }, hint: String.raw`$e \approx 2.718 > 2$.`, reveal: String.raw`$\rho = \frac2e < 1$: converges.` },
        ] },
      ],
    },
    {
      id: 'root-test',
      title: 'The root test',
      blocks: [
        { type: 'callout', kind: 'thm', title: 'Root test', html: String.raw`<p>Let $\displaystyle\rho = \lim_{n\to\infty}\sqrt[n]{|a_n|}$. Then $\rho < 1$: converges absolutely; $\rho > 1$ (or $\infty$): diverges; $\rho = 1$: inconclusive. Use it when the <b>whole term is an $n$-th power</b>, such as $\left(\frac{2n+1}{3n-1}\right)^n$.</p>` },
        { type: 'refresher', title: String.raw`the $n$-th root of a power`, html: String.raw`<ul><li>$\sqrt[n]{x} = x^{1/n}$, and $(x^m)^{1/n} = x^{m/n}$.</li><li>So $\sqrt[n]{c^n} = c$ for $c \ge 0$, and $\sqrt[n]{c^{n^2}} = c^{n^2/n} = c^{n}$.</li><li>$\sqrt[n]{\dfrac{A}{3^n}} = \dfrac{\sqrt[n]{A}}{3}$.</li></ul>` },
        { type: 'steps', title: String.raw`Example 1: $\displaystyle\sum_{n=1}^{\infty} \left(\frac{2n+1}{3n-1}\right)^n$`, steps: [
          { do: String.raw`$a_n > 0$ for $n \ge 1$`, why: String.raw`$2n + 1 > 0$ and $3n - 1 > 0$, so the base is positive; no absolute values needed.` },
          { do: String.raw`$\sqrt[n]{a_n} = \dfrac{2n+1}{3n-1}$`, why: 'The whole term is an $n$-th power; the $n$-th root undoes it.' },
          { do: String.raw`$= \dfrac{2 + 1/n}{3 - 1/n}$`, why: String.raw`Divide numerator and denominator by $n$.` },
          { do: String.raw`$\to \dfrac23 = \rho$`, why: String.raw`$\frac1n \to 0$.` },
          { do: String.raw`$\rho = \tfrac23 < 1$: converges`, why: 'Root test.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \left(\frac{n+5}{2n+1}\right)^n$`, problem: String.raw`Apply the root test to $\sum_{n=1}^{\infty} \left(\frac{n+5}{2n+1}\right)^n$.`, steps: [
          { prompt: String.raw`Type $\sqrt[n]{a_n}$ as an expression in <code>n</code>.`, ask: { kind: 'expression', answer: '(n+5)./(2*n+1)', variable: 'n', domain: [1, 6], label: 'ⁿ√aₙ =' }, hint: 'The root undoes the $n$-th power.', reveal: String.raw`$\sqrt[n]{a_n} = \frac{n+5}{2n+1}$ (positive, so no absolute value is needed).` },
          { prompt: String.raw`$\rho = \;?$`, ask: { kind: 'numeric', answer: '1/2' }, hint: String.raw`Divide by $n$: $\frac{1 + 5/n}{2 + 1/n}$.`, reveal: String.raw`$\rho = \frac12$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges', 'diverges', 'inconclusive'], answer: 0 }, hint: String.raw`$\rho < 1$.`, reveal: 'Converges by the root test.' },
        ] },
        { type: 'steps', title: String.raw`Example 2: $\displaystyle\sum_{n=1}^{\infty} \left(\frac{n}{n+1}\right)^{n^2}$`, steps: [
          { do: String.raw`$a_n > 0$`, why: 'A positive base to any power is positive.' },
          { do: String.raw`$\sqrt[n]{a_n} = \left(\dfrac{n}{n+1}\right)^{n^2/n} = \left(\dfrac{n}{n+1}\right)^{n}$`, why: String.raw`$\big(c^{n^2}\big)^{1/n} = c^{n^2/n} = c^n$ (refresher). One power of $n$ remains.` },
          { do: String.raw`$= \dfrac{1}{\left(1 + \frac1n\right)^n}$`, why: String.raw`Flip the fraction: $\frac{n+1}{n} = 1 + \frac1n$.` },
          { do: String.raw`$\to \dfrac{1}{e} = \rho$`, why: String.raw`$\left(1 + \frac1n\right)^n \to e$ (refresher in the previous lesson).` },
          { do: String.raw`$\rho = \tfrac1e < 1$: converges`, why: 'Root test.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{1}{3^n}\left(\frac{n+1}{n}\right)^{n^2}$`, problem: String.raw`Apply the root test to $\sum_{n=1}^{\infty} \frac{1}{3^n}\left(\frac{n+1}{n}\right)^{n^2}$.`, steps: [
          { prompt: String.raw`$\sqrt[n]{a_n} = \frac{1}{3}\left(\frac{n+1}{n}\right)^{k}$. What is the exponent $k$, in terms of <code>n</code>?`, ask: { kind: 'expression', answer: 'n', variable: 'n', domain: [1, 6], label: 'k =' }, hint: String.raw`$\sqrt[n]{3^n} = 3$ and $\big(c^{n^2}\big)^{1/n} = c^{n^2/n}$.`, reveal: String.raw`$k = \frac{n^2}{n} = n$: $\;\sqrt[n]{a_n} = \frac13\left(1 + \frac1n\right)^n$.` },
          { prompt: String.raw`$\rho = \;?$`, ask: { kind: 'numeric', answer: 'exp(1)/3', tol: 1e-6 }, hint: String.raw`$\left(1 + \frac1n\right)^n \to e$.`, reveal: String.raw`$\rho = \frac{e}{3} \approx 0.906$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges', 'diverges', 'inconclusive'], answer: 0 }, hint: String.raw`$e < 3$.`, reveal: String.raw`$\rho = \frac e3 < 1$: converges. (Without the factor $\frac{1}{3^n}$ we would get $\rho = e > 1$: divergence.)` },
        ] },
      ],
    },
    {
      id: 'ratio-inconclusive',
      title: 'When ρ = 1: the test says nothing',
      blocks: [
        { type: 'text', html: String.raw`<p>$\sum \frac1n$ diverges and $\sum \frac{1}{n^2}$ converges, yet the ratio test gives $\rho = 1$ for both: $\frac{n}{n+1} \to 1$ and $\frac{n^2}{(n+1)^2} \to 1$. So $\rho = 1$ carries <b>no information</b>; this happens for every $p$-series and every rational function of $n$. Then another test (comparison, limit comparison, $p$-series) must decide.</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} \frac{1}{n^2+1}$`, steps: [
          { do: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{n^2 + 1}{(n+1)^2 + 1}$`, why: String.raw`Ratio test: $a_{n+1} = \frac{1}{(n+1)^2 + 1}$, multiplied by the reciprocal of $a_n$.` },
          { do: String.raw`$= \dfrac{n^2 + 1}{n^2 + 2n + 2}$`, why: String.raw`Expand $(n+1)^2 + 1 = n^2 + 2n + 1 + 1$.` },
          { do: String.raw`$= \dfrac{1 + 1/n^2}{1 + 2/n + 2/n^2} \;\to\; 1$`, why: String.raw`Divide by $n^2$; all the small fractions tend to $0$.` },
          { do: String.raw`$\rho = 1$: the ratio test is inconclusive`, why: 'Neither convergence nor divergence follows.' },
          { do: String.raw`$\dfrac{1/(n^2+1)}{1/n^2} = \dfrac{n^2}{n^2+1} \to 1$`, why: String.raw`Switch to limit comparison with $\frac{1}{n^2}$; the limit is in $(0, \infty)$.` },
          { do: String.raw`$\sum \dfrac{1}{n^2}$ converges $\Rightarrow$ $\sum \dfrac{1}{n^2+1}$ converges`, why: String.raw`$p$-series with $p = 2 > 1$, then the limit comparison test.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^{\infty} \frac{2n+1}{n^3}$`, problem: String.raw`Try the ratio test on $\sum_{n=1}^{\infty} \frac{2n+1}{n^3}$, then decide with another test.`, steps: [
          { prompt: String.raw`$\frac{a_{n+1}}{a_n} = \frac{2n+3}{2n+1}\cdot\frac{n^3}{(n+1)^3}$. What is $\rho$?`, ask: { kind: 'numeric', answer: '1' }, hint: 'Both factors tend to 1.', reveal: String.raw`$\rho = 1\cdot 1 = 1$.` },
          { prompt: String.raw`What does $\rho = 1$ tell you?`, ask: { kind: 'choice', choices: ['the series converges', 'the series diverges', 'nothing — use another test'], answer: 2 }, hint: 'Re-read the first paragraph of this lesson.', reveal: 'Nothing: the ratio test is inconclusive.' },
          { prompt: String.raw`Limit comparison with $\frac{1}{n^2}$: compute $\lim \frac{(2n+1)/n^3}{1/n^2}$.`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`$\frac{2n+1}{n^3}\cdot n^2 = \frac{2n+1}{n}$.`, reveal: String.raw`$\frac{2n+1}{n} = 2 + \frac1n \to 2 \in (0, \infty)$.` },
          { prompt: 'Conclusion:', ask: { kind: 'choice', choices: ['converges', 'diverges'], answer: 0 }, hint: String.raw`$\sum \frac{1}{n^2}$ is a $p$-series with $p = 2$.`, reveal: String.raw`Converges, by limit comparison with the convergent $p$-series $\sum \frac{1}{n^2}$.` },
        ] },
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
  assignIntro: String.raw`<p>Every problem below is the same type as a worked example and a guided exercise you have already done — the links above each problem take you back to them. If you get stuck, use the hints one at a time, then the step-by-step walkthrough.</p>`,
  assignments: [
    {
      id: 'a1',
      title: 'Absolutely, conditionally or divergent?',
      difficulty: 'core',
      examples: ['conditional', 'absolute-divergent', 'ratio-test', 'eventually-decreasing'],
      statement: String.raw`<p>Classify each series. Follow the recipe: absolute convergence first, then the alternating series test, and the divergence test when the terms do not tend to $0$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{(-1)^n}{2\sqrt n + 1}$`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 1,
          hints: [String.raw`This is the type of the worked example $\sum \frac{(-1)^n}{\sqrt n + 3}$ in "Absolute vs conditional convergence".`, String.raw`Limit-compare $|a_n|$ with $\frac{1}{\sqrt n}$; then check the three conditions of the alternating series test.`, String.raw`$\frac{1/(2\sqrt n + 1)}{1/\sqrt n} = \frac{\sqrt n}{2\sqrt n + 1} \to \frac12$, and $\sum\frac{1}{\sqrt n}$ diverges ($p = \frac12$).`],
          walkthrough: [
            { do: String.raw`$\dfrac{|a_n|}{1/\sqrt n} = \dfrac{\sqrt n}{2\sqrt n + 1} = \dfrac{1}{2 + 1/\sqrt n} \to \dfrac12$`, why: 'Limit comparison of the absolute values with $1/\\sqrt n$.' },
            { do: String.raw`$\sum \frac{1}{\sqrt n}$ diverges, so $\sum |a_n|$ diverges`, why: String.raw`$p = \frac12 \le 1$; the limit $\frac12$ is in $(0, \infty)$.` },
            { do: String.raw`$b_n = \dfrac{1}{2\sqrt n + 1} > 0$, decreasing, $\to 0$`, why: 'The denominator is positive and increases without bound.' },
            { do: 'Conditionally convergent', why: 'Converges by the alternating series test, but not absolutely.' },
          ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty (-1)^n \frac{n^2}{2^n}$`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 0,
          hints: ['An exponential in the denominator: which test?', String.raw`Ratio test exactly as in the example $\sum (-1)^n \frac{n^3}{3^n}$.`, String.raw`$\left|\frac{a_{n+1}}{a_n}\right| = \frac{(n+1)^2}{n^2}\cdot\frac{2^n}{2^{n+1}}$.`],
          walkthrough: [
            { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{(n+1)^2}{n^2}\cdot\dfrac{2^n}{2^{n+1}}$`, why: 'Ratio of absolute values, factors grouped.' },
            { do: String.raw`$= \left(1 + \dfrac1n\right)^2\cdot\dfrac12$`, why: 'Simplify each factor separately.' },
            { do: String.raw`$\to \dfrac12 = \rho$`, why: String.raw`$\frac1n \to 0$.` },
            { do: 'Absolutely convergent', why: String.raw`$\rho < 1$ in the ratio test.` },
          ] },
        { label: '(c)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty (-1)^n \frac{n+1}{2n}$`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 2,
          hints: ['Do the terms tend to 0?', String.raw`Compute $\lim \frac{n+1}{2n}$ by dividing by $n$.`, String.raw`$\frac{n+1}{2n} = \frac{1 + 1/n}{2} \to \frac12 \ne 0$.`],
          walkthrough: [
            { do: String.raw`$|a_n| = \dfrac{n+1}{2n} = \dfrac{1 + 1/n}{2} \to \dfrac12$`, why: String.raw`Divide numerator and denominator by $n$.` },
            { do: String.raw`$a_n \not\to 0$`, why: String.raw`The terms jump between values near $\pm\frac12$.` },
            { do: 'Divergent', why: 'Divergence test.' },
          ] },
        { label: '(d)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty (-1)^n \sin\!\left(\frac{1}{n^2}\right)$`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 0,
          hints: [String.raw`Same type as the example $\sum (-1)^n \sin\left(\frac{1}{n^{3/2}}\right)$.`, String.raw`Use $0 < \sin t \le t$ for $0 < t \le 1$.`, String.raw`$|a_n| = \sin\frac{1}{n^2} \le \frac{1}{n^2}$.`],
          walkthrough: [
            { do: String.raw`$0 < \dfrac1{n^2} \le 1 \Rightarrow |a_n| = \sin\dfrac1{n^2} \le \dfrac{1}{n^2}$`, why: String.raw`$\sin t$ is positive and at most $t$ for $0 < t \le 1$.` },
            { do: String.raw`$\sum \frac1{n^2}$ converges`, why: String.raw`$p = 2 > 1$.` },
            { do: 'Absolutely convergent', why: String.raw`Direct comparison: $\sum |a_n|$ converges.` },
          ] },
        { label: '(e)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty (-1)^n \frac{n}{n^2+3}$`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 1,
          hints: [String.raw`Absolute values first: $\frac{n}{n^2+3}$ behaves like $\frac1n$.`, String.raw`For "decreasing", differentiate $f(x) = \frac{x}{x^2+3}$ as in "Checking decreasing with the derivative".`, String.raw`$f'(x) = \frac{(x^2+3) - x\cdot 2x}{(x^2+3)^2} = \frac{3 - x^2}{(x^2+3)^2}$.`],
          walkthrough: [
            { do: String.raw`$\dfrac{n/(n^2+3)}{1/n} = \dfrac{n^2}{n^2+3} \to 1$`, why: 'Limit comparison of the absolute values with the harmonic series.' },
            { do: String.raw`$\sum |a_n|$ diverges`, why: String.raw`$\sum\frac1n$ diverges and the limit $1$ is in $(0, \infty)$.` },
            { do: String.raw`$b_n = \dfrac{n}{n^2+3} > 0$`, why: 'Condition 1.' },
            { do: String.raw`$f'(x) = \dfrac{3 - x^2}{(x^2+3)^2} < 0$ for $x > \sqrt 3$`, why: String.raw`Quotient rule; the denominator is positive. So $b_n$ decreases for $n \ge 2$ (condition 2).` },
            { do: String.raw`$b_n = \dfrac{1/n}{1 + 3/n^2} \to 0$`, why: String.raw`Condition 3: divide by $n^2$.` },
            { do: 'Conditionally convergent', why: 'Converges by the alternating series test, but not absolutely.' },
          ] },
      ],
    },
    {
      id: 'a3',
      title: 'Estimating an alternating sum',
      difficulty: 'core',
      hw: 'HW6-style',
      examples: ['alternating-test', 'alternating-accuracy'],
      statement: String.raw`<p>Let $\displaystyle S = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n\,2^n}$. (The conditions of the alternating series test hold: $b_n = \frac{1}{n2^n} > 0$ is decreasing and tends to $0$.)</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $S_5$.`, kind: 'numeric', answer: '391/960', tol: 1e-8,
          hints: [String.raw`Add the first five terms with signs $+, -, +, -, +$.`, String.raw`The sizes are $b_n = \frac{1}{n2^n}$: $\frac12, \frac18, \frac1{24}, \frac1{64}, \frac1{160}$.`, String.raw`$S_5 = \frac12 - \frac18 + \frac1{24} - \frac1{64} + \frac1{160}$; use the common denominator $960$.`],
          walkthrough: [
            { do: String.raw`$b_1 = \tfrac12,\ b_2 = \tfrac18,\ b_3 = \tfrac1{24},\ b_4 = \tfrac1{64},\ b_5 = \tfrac1{160}$`, why: String.raw`Put $n = 1, \dots, 5$ into $\frac{1}{n\,2^n}$.` },
            { do: String.raw`$S_5 = \tfrac12 - \tfrac18 + \tfrac1{24} - \tfrac1{64} + \tfrac1{160}$`, why: String.raw`Signs $(-1)^{n+1}$: $+, -, +, -, +$.` },
            { do: String.raw`$= \dfrac{480 - 120 + 40 - 15 + 6}{960}$`, why: String.raw`Common denominator $960$: $960/2 = 480$, $960/8 = 120$, $960/24 = 40$, $960/64 = 15$, $960/160 = 6$.` },
            { do: String.raw`$= \dfrac{391}{960} \approx 0.407292$`, why: 'Add the numerators.' },
          ] },
        { label: '(b)', prompt: String.raw`The alternating series bound for $|R_5|$.`, kind: 'numeric', answer: '1/384', tol: 1e-9,
          hints: ['The bound is the size of the first omitted term.', String.raw`$|R_5| \le b_6$.`, String.raw`$b_6 = \frac{1}{6\cdot 2^6}$.`],
          walkthrough: [
            { do: String.raw`$|R_5| \le b_6$`, why: 'Alternating series bound: the first omitted term is $n = 6$.' },
            { do: String.raw`$b_6 = \dfrac{1}{6\cdot 2^6} = \dfrac{1}{6\cdot 64}$`, why: String.raw`Put $n = 6$ into $b_n$.` },
            { do: String.raw`$= \dfrac{1}{384} \approx 0.002604$`, why: String.raw`$6 \cdot 64 = 384$.` },
          ] },
        { label: '(c)', prompt: 'Which interval contains $S$?', kind: 'choice', choices: [String.raw`$[S_5,\ S_5 + \tfrac1{384}]$`, String.raw`$[S_5 - \tfrac1{384},\ S_5]$`, String.raw`$[S_5 - \tfrac1{384},\ S_5 + \tfrac1{384}]$ and no better`, String.raw`$[S_5 - \tfrac1{160},\ S_5]$`], answer: 1,
          hints: ['The remainder has the sign of the first omitted term.', String.raw`The first omitted term is $(-1)^{6+1} b_6$. Is it positive or negative?`],
          solution: String.raw`The first omitted term $(-1)^7 b_6 = -\tfrac1{384}$ is negative, so $R_5 < 0$: $S_5 - \tfrac1{384} \le S < S_5$.` },
        { label: '(d)', prompt: String.raw`The lower endpoint of that interval (exact or to 6 decimals).`, kind: 'numeric', answer: '777/1920', tol: 1e-7,
          hints: [String.raw`Lower endpoint $= S_5 - b_6$.`, String.raw`Use the common denominator $1920$.`, String.raw`$\frac{391}{960} = \frac{782}{1920}$ and $\frac{1}{384} = \frac{5}{1920}$.`],
          walkthrough: [
            { do: String.raw`$S_5 - b_6 = \dfrac{391}{960} - \dfrac{1}{384}$`, why: 'From (a), (b) and (c).' },
            { do: String.raw`$= \dfrac{782}{1920} - \dfrac{5}{1920}$`, why: String.raw`$1920 = 2\cdot 960 = 5\cdot 384$.` },
            { do: String.raw`$= \dfrac{777}{1920} = 0.4046875$`, why: String.raw`Subtract. (In fact $S = \ln\frac32 \approx 0.405465$, inside the interval.)` },
          ] },
        { label: '(e)', prompt: String.raw`Smallest $N$ for which the bound guarantees $|R_N| < 10^{-4}$.`, kind: 'numeric', answer: '9', tol: 1e-9,
          hints: [String.raw`You need $b_{N+1} < 10^{-4}$.`, String.raw`With $k = N + 1$: $k\cdot 2^k > 10000$. Make a table.`, String.raw`$9\cdot 2^9 = 4608$, $10\cdot 2^{10} = 10240$.`],
          walkthrough: [
            { do: String.raw`$b_{N+1} = \dfrac{1}{(N+1)\,2^{N+1}} < 10^{-4}$`, why: 'The bound must be below the tolerance.' },
            { do: String.raw`$k\cdot 2^k > 10000$ with $k = N + 1$`, why: 'Take reciprocals; the inequality flips.' },
            { do: String.raw`$k = 9:\ 4608;\quad k = 10:\ 10240$`, why: 'Trial table: $k = 10$ is the first that works.' },
            { do: String.raw`$N = k - 1 = 9$`, why: String.raw`$k = N + 1$.` },
          ] },
      ],
    },
    {
      id: 'a4',
      title: 'Ratio and root tests',
      difficulty: 'core',
      examples: ['ratio-factorial', 'ratio-e', 'root-test', 'ratio-inconclusive'],
      statement: String.raw`<p>Compute the limit $\rho$ of the ratio or root test and draw the conclusion.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Ratio test for $\displaystyle\sum_{n=1}^\infty \frac{(2n)!}{(n!)^2\,5^n}$: $\rho = $`, kind: 'numeric', answer: '4/5',
          hints: [String.raw`Same as Example 2 of "The ratio test with factorials", with $5$ instead of $7$.`, String.raw`Simplify $\frac{(2n+2)!}{(2n)!}$, $\frac{(n!)^2}{((n+1)!)^2}$ and $\frac{5^n}{5^{n+1}}$ separately.`, String.raw`The ratio is $\frac{(2n+2)(2n+1)}{5(n+1)^2}$.`],
          walkthrough: [
            { do: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{(2n+2)!}{(2n)!}\cdot\dfrac{(n!)^2}{((n+1)!)^2}\cdot\dfrac{5^n}{5^{n+1}}$`, why: String.raw`Write $a_{n+1}$ ($n \to n+1$), multiply by the reciprocal of $a_n$, group.` },
            { do: String.raw`$= (2n+2)(2n+1)\cdot\dfrac{1}{(n+1)^2}\cdot\dfrac15$`, why: 'Simplify each factor (factorial refresher).' },
            { do: String.raw`$= \dfrac{2(2n+1)}{5(n+1)}$`, why: String.raw`$2n+2 = 2(n+1)$; cancel one $(n+1)$.` },
            { do: String.raw`$= \dfrac{2(2 + 1/n)}{5(1 + 1/n)} \to \dfrac45$`, why: String.raw`Divide by $n$. Since $\rho = \frac45 < 1$ the series converges.` },
          ] },
        { label: '(b)', prompt: String.raw`Ratio test for $\displaystyle\sum_{n=1}^\infty \frac{n^n}{3^n\, n!}$: $\rho = $`, kind: 'numeric', answer: 'exp(1)/3', tol: 1e-6,
          hints: [String.raw`The lesson "The ratio test with $n^n$" shows this type; here $n^n$ is in the numerator.`, String.raw`Group: $\frac{(n+1)^{n+1}}{n^n}\cdot\frac{n!}{(n+1)!}\cdot\frac{3^n}{3^{n+1}}$, and write $(n+1)^{n+1} = (n+1)(n+1)^n$.`, String.raw`After cancelling $(n+1)$ you get $\frac13\left(\frac{n+1}{n}\right)^n = \frac13\left(1 + \frac1n\right)^n$.`],
          walkthrough: [
            { do: String.raw`$\dfrac{a_{n+1}}{a_n} = \dfrac{(n+1)^{n+1}}{n^n}\cdot\dfrac{n!}{(n+1)!}\cdot\dfrac{3^n}{3^{n+1}}$`, why: String.raw`Replace $n$ by $n+1$, multiply by the reciprocal, group.` },
            { do: String.raw`$= \dfrac{(n+1)(n+1)^n}{n^n}\cdot\dfrac{1}{n+1}\cdot\dfrac13$`, why: String.raw`$(n+1)^{n+1} = (n+1)(n+1)^n$; $\frac{n!}{(n+1)!} = \frac1{n+1}$; $\frac{3^n}{3^{n+1}} = \frac13$.` },
            { do: String.raw`$= \dfrac13\left(\dfrac{n+1}{n}\right)^n = \dfrac13\left(1 + \dfrac1n\right)^n$`, why: String.raw`Cancel $(n+1)$; same exponent $n$, so combine into one power.` },
            { do: String.raw`$\to \dfrac{e}{3} \approx 0.906$`, why: String.raw`$\left(1 + \frac1n\right)^n \to e$. Since $\rho < 1$ the series converges.` },
          ] },
        { label: '(c)', prompt: String.raw`Root test for $\displaystyle\sum_{n=1}^\infty \left(\frac{3n+2}{4n-1}\right)^n$: $\rho = $`, kind: 'numeric', answer: '3/4',
          hints: ['The whole term is an $n$-th power.', String.raw`$\sqrt[n]{a_n} = \frac{3n+2}{4n-1}$.`, String.raw`Divide numerator and denominator by $n$.`],
          walkthrough: [
            { do: String.raw`$a_n > 0$ for $n \ge 1$`, why: String.raw`$3n + 2 > 0$ and $4n - 1 > 0$.` },
            { do: String.raw`$\sqrt[n]{a_n} = \dfrac{3n+2}{4n-1}$`, why: String.raw`The $n$-th root undoes the $n$-th power.` },
            { do: String.raw`$= \dfrac{3 + 2/n}{4 - 1/n} \to \dfrac34$`, why: String.raw`Divide by $n$. $\rho = \frac34 < 1$: converges.` },
          ] },
        { label: '(d)', prompt: String.raw`Ratio test for $\displaystyle\sum_{n=1}^\infty \frac{n^2 + 1}{n^4}$ gives`, kind: 'choice', choices: [String.raw`$\rho = 0$: converges`, String.raw`$\rho = 1$: inconclusive (the series converges by limit comparison with $p = 2$)`, String.raw`$\rho = 1$: diverges`, String.raw`$\rho = \infty$: diverges`], answer: 1,
          hints: ['The term is a rational function of $n$. What does the ratio test always give for those?', String.raw`$\rho = 1$ says nothing. Limit-compare $\frac{n^2+1}{n^4}$ with $\frac{1}{n^2}$.`, String.raw`$\frac{(n^2+1)/n^4}{1/n^2} = \frac{n^2+1}{n^2} \to 1$.`],
          solution: String.raw`For any rational function of $n$ the ratio tends to $1$. Limit comparison with $\frac1{n^2}$ decides: converges.` },
      ],
    },
    {
      id: 'a2',
      title: 'An eventually decreasing alternating series',
      difficulty: 'challenge',
      hw: 'HW6-style',
      examples: ['eventually-decreasing', 'conditional'],
      statement: String.raw`<p>Consider $\displaystyle\sum_{n=2}^{\infty} (-1)^n \frac{(\ln n)^2}{n}$ and $f(x) = \dfrac{(\ln x)^2}{x}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$f'(x) < 0$ exactly for $x > c$ (with $x > 1$). Give $c$.`, kind: 'numeric', answer: 'exp(2)', tol: 1e-6,
          hints: [String.raw`Quotient rule with $u = (\ln x)^2$ and $v = x$, as in Example 2 of "Checking decreasing with the derivative".`, String.raw`$u' = 2\ln x\cdot\frac1x$ by the chain rule. Then factor $\ln x$ out of the numerator.`, String.raw`$f'(x) = \frac{2\ln x - (\ln x)^2}{x^2} = \frac{\ln x\,(2 - \ln x)}{x^2}$.`],
          walkthrough: [
            { do: String.raw`$u = (\ln x)^2,\ u' = \dfrac{2\ln x}{x};\quad v = x,\ v' = 1$`, why: 'Chain rule for $u$: outer square, inner $\\ln x$.' },
            { do: String.raw`$f'(x) = \dfrac{\frac{2\ln x}{x}\cdot x - (\ln x)^2\cdot 1}{x^2}$`, why: String.raw`Quotient rule $\frac{u'v - uv'}{v^2}$.` },
            { do: String.raw`$= \dfrac{2\ln x - (\ln x)^2}{x^2} = \dfrac{\ln x\,(2 - \ln x)}{x^2}$`, why: String.raw`Cancel $x$, then factor out $\ln x$.` },
            { do: String.raw`For $x > 1$: $\ln x > 0$ and $x^2 > 0$, so $f'(x) < 0 \iff 2 - \ln x < 0$`, why: 'The sign of the fraction is the sign of the remaining factor.' },
            { do: String.raw`$\iff \ln x > 2 \iff x > e^2 \approx 7.389$`, why: String.raw`Exponentiate. So $c = e^2$, and $b_n$ decreases for $n \ge 8$.` },
          ] },
        { label: '(b)', prompt: 'The series is', kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 1,
          hints: [String.raw`Absolute values: compare $\frac{(\ln n)^2}{n}$ with $\frac1n$ for $n \ge 3$.`, String.raw`For the alternating series test you have condition 2 from (a); the limit needs L'Hôpital twice.`, String.raw`$\lim \frac{(\ln x)^2}{x} = \lim\frac{2\ln x/x}{1} = \lim\frac{2\ln x}{x} = \lim\frac{2/x}{1} = 0$.`],
          solution: String.raw`$\frac{(\ln n)^2}{n} \ge \frac1n$ for $n \ge 3$, so there is no absolute convergence; $b_n > 0$, decreasing from $n = 8$ on, and $b_n \to 0$: conditionally convergent.` },
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
  ],
};
