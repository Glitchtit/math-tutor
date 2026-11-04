// Module 21: Power series — radius and interval of convergence, representations of functions,
// term-by-term differentiation and integration.

export default {
  id: 'power-series',
  number: 21,
  part: 'series',
  hw: 'HW6',
  title: 'Power series',
  summary: 'Power series Σ c_n (x − a)^n: radius of convergence from the ratio test, separate endpoint checks, substitutions such as u = (3 − 2x)^3, representations built from the geometric series, term-by-term differentiation and integration (arctan, ln(1 + x)), and series for functions defined by integrals.',
  intro: String.raw`<p>A power series is a "polynomial of infinite degree" in $x$. Where it converges it defines a function, and inside its interval of convergence that function can be differentiated and integrated term by term. This is how calculators evaluate $\ln$, $\arctan$ or $\mathrm{erf}$, and how integrals without elementary antiderivatives are computed.</p>`,
  lessons: [
    {
      id: 'radius',
      title: 'Radius of convergence',
      blocks: [
        { type: 'text', html: String.raw`<p>The geometric series $1 + x + x^2 + \cdots$ is a power series with sum $\dfrac{1}{1-x}$. Raise the degree of the partial sum: inside the green band $|x| < 1$ the polynomials hug the function; outside they peel away no matter how many terms you take.</p>` },
        { type: 'widget', name: 'taylor', config: {
          title: 'Partial sums of Σ x^n against 1/(1 − x)',
          f: '1./(1 - x)', coef: '1 + 0*k', a: 0, nmax: 25, n: 3, R: 1, Rtex: '1',
          xlim: [-2, 1.5], ylim: [-3, 8],
        } },
        { type: 'callout', kind: 'def', title: 'Power series', html: String.raw`<p>A power series centred at $a$ is</p>$$\sum_{n=0}^{\infty} c_n (x-a)^n = c_0 + c_1(x-a) + c_2(x-a)^2 + \cdots$$<p>For each fixed $x$ it is an ordinary series of numbers; the question is <b>for which $x$</b> it converges.</p>` },
        { type: 'callout', kind: 'thm', title: 'Radius of convergence', html: String.raw`<p>For every power series exactly one of the following holds: it converges only at $x = a$ ($R = 0$); it converges absolutely for all $x$ ($R = \infty$); or there is $R > 0$ such that it converges absolutely for $|x - a| < R$ and diverges for $|x - a| > R$. At the <b>endpoints</b> $x = a \pm R$ anything can happen: they must be checked separately with the tests for series of numbers.</p><p>If $\lim \left|\frac{c_{n+1}}{c_n}\right| = L$, then $R = 1/L$ (with $R = \infty$ if $L = 0$).</p>` },
        { type: 'derive', symbolic: true, title: String.raw`Where $R = 1/L$ comes from`, colors: { c: 1, x: 2, L: 3, R: 4 }, steps: [
          { kind: 'start', label: String.raw`Ratio test on $a_n = c_n(x-a)^n$`, from: String.raw`\left|\frac{a_{n+1}}{a_n}\right|=\frac{|\T{c-1}{c_{n+1}}|\,\T{x-1}{|x-a|^{n+1}}}{|\T{c-2}{c_n}|\,\T{x-2}{|x-a|^{n}}}`, to: String.raw`\left|\frac{a_{n+1}}{a_n}\right|=\frac{|\T{c-1}{c_{n+1}}|\,\T{x-1}{|x-a|^{n+1}}}{|\T{c-2}{c_n}|\,\T{x-2}{|x-a|^{n}}}`,
            why: String.raw`For a fixed $x$ the power series is an ordinary series with terms $a_n = c_n(x-a)^n$, so we can apply the ratio test to it.` },
          { kind: 'cancel', label: String.raw`$\frac{|x-a|^{n+1}}{|x-a|^n} = |x-a|$`, to: String.raw`\left|\frac{a_{n+1}}{a_n}\right|=\left|\frac{\T{c-1}{c_{n+1}}}{\T{c-2}{c_n}}\right|\,\T{x-1}{|x-a|}`,
            why: String.raw`$n$ of the $n+1$ factors $|x-a|$ cancel against the denominator, so one factor $|x-a|$ is left and $|x-a|^n$ is crossed out.` },
          { kind: 'sub', label: String.raw`Limit: $\left|\frac{c_{n+1}}{c_n}\right| \to L$`, to: String.raw`\rho=\T{L-1}{L}\,\T{x-1}{|x-a|}`, map: { 'c-1': ['L-1'], 'c-2': ['L-1'] }, arrows: { 'c-1': 'lim = L', 'c-2': '' },
            why: String.raw`$|x-a|$ does not depend on $n$, so only the coefficient ratio changes as $n \to \infty$; its limit is called $L$.` },
          { kind: 'start', label: String.raw`Ratio test: converges when $\rho < 1$`, to: String.raw`\T{L-1}{L}\,\T{x-1}{|x-a|}<1`,
            why: String.raw`The ratio test gives absolute convergence for $\rho < 1$ and divergence for $\rho > 1$.` },
          { kind: 'result', label: String.raw`Both sides $\div L$ (for $L > 0$)`, to: String.raw`\T{x-1}{|x-a|}<\frac{1}{\T{L-1}{L}}=\T{R-1}{R}`, arrows: { 'L-1': '÷ L on both sides' },
            why: String.raw`$L$ is positive, so dividing by it keeps the direction of the inequality. The number $\frac1L$ is the radius $R$. If $L = 0$, then $\rho = 0 < 1$ for every $x$ and $R = \infty$.` },
        ] },
        { type: 'derive', title: String.raw`With numbers: $\displaystyle\sum_{n=1}^{\infty} \frac{(x-2)^n}{n\,3^n}$`, given: String.raw`\T{c-0}{c_n}=\frac{1}{n\,3^n},\quad a=2`, colors: { c: 1, x: 2, L: 3, R: 4, k: 5, m: 6, e: 7 }, steps: [
          { kind: 'sub', label: 'Put the coefficients into the ratio', from: String.raw`\left|\frac{\T{c-x}{c_{n+1}}}{\T{c-y}{c_n}}\right|\qquad\qquad c_{n+1}=\T{c-1}{\frac{1}{(n+1)\,3^{n+1}}},\quad c_n=\T{c-2}{\frac{1}{n\,3^n}}`,
            to: String.raw`\frac{\T{c-1}{\frac{1}{(n+1)\,3^{n+1}}}}{\T{c-2}{\frac{1}{n\,3^n}}}`, arrows: { 'c-1': 'n → n+1', 'c-2': 'c_n' },
            why: String.raw`$c_{n+1}$ is $c_n$ with every $n$ replaced by $n+1$. All quantities are positive, so the absolute value can be dropped.` },
          { kind: 'calc', label: 'Dividing by a fraction = multiplying by its reciprocal', from: String.raw`\frac{\;\frac{1}{\T{k-1}{(n+1)}\,\T{e-1}{3^{n+1}}}\;}{\;\frac{1}{\T{m-1}{n}\,\T{e-2}{3^n}}\;}`, to: String.raw`\frac{\T{m-1}{n}\,\T{e-2}{3^n}}{\T{k-1}{(n+1)}\,\T{e-1}{3^{n+1}}}`, arrows: { 'm-1': 'flip up', 'e-2': '' },
            why: String.raw`The denominator of the lower fraction moves up into the numerator.` },
          { kind: 'factor', label: String.raw`$3^{n+1} = 3\cdot 3^n$`, to: String.raw`\frac{\T{m-1}{n}\,\T{e-2}{3^n}}{\T{k-1}{(n+1)}\cdot 3\cdot\T{e-1}{3^{n}}}`,
            why: String.raw`Splitting off one factor $3$ makes the same power $3^n$ appear above and below.` },
          { kind: 'cancel', label: String.raw`$\frac{3^n}{3^n} = 1$`, to: String.raw`\frac{\T{m-1}{n}}{3\,\T{k-1}{(n+1)}}`,
            why: String.raw`The two powers $3^n$ divide to $1$.` },
          { kind: 'calc', label: String.raw`Limit $n\to\infty$`, to: String.raw`\T{L-1}{L}=\frac13\cdot\lim_{n\to\infty}\frac{n}{n+1}=\frac13`, map: { 'm-1': ['L-1'], 'k-1': ['L-1'] },
            why: String.raw`$\frac{n}{n+1} = \frac{1}{1 + 1/n} \to 1$.` },
          { kind: 'sub', label: String.raw`Put $L$ into $R = 1/L$`, from: String.raw`\T{R-1}{R}=\frac{1}{\T{L-x}{L}}\qquad\qquad L=\T{L-1}{\tfrac13}`, to: String.raw`\T{R-1}{R}=\frac{1}{\T{L-1}{1/3}}=3`, arrows: { 'L-1': 'L = 1/3' },
            why: String.raw`The series converges absolutely for $|x - 2| < 3$ and diverges for $|x - 2| > 3$: centre $a = 2$, radius $R = 3$.` },
          { kind: 'check', label: 'Put the answer back in', from: String.raw`\T{L-x}{L}\,\T{R-x}{R}=1\qquad\qquad L=\T{L-1}{\tfrac13},\quad R=\T{R-1}{3}`, to: String.raw`\T{L-1}{\tfrac13}\cdot\T{R-1}{3}=1\ \checkmark`, arrows: { 'L-1': '', 'R-1': '' },
            why: String.raw`At distance $|x - 2| = R$ the ratio $\rho = L\,|x-2|$ is exactly $1$, the boundary between convergence and divergence. So $R = 3$ is right.` },
        ] },
        { type: 'text', html: String.raw`<p>The ratio test says nothing at $\rho = 1$, so the <b>endpoints</b> $x = 2 \pm 3$ are checked separately. Right endpoint $x = 5$: the series becomes $\sum \frac{3^n}{n3^n} = \sum \frac1n$, the harmonic series, which diverges. Left endpoint $x = -1$: $\sum \frac{(-3)^n}{n3^n} = \sum \frac{(-1)^n}{n}$; here $b_n = \frac1n$ is positive, decreasing and tends to $0$, so it converges by the alternating series test. The interval of convergence is $[-1, 5)$.</p>` },
        { type: 'quiz', question: String.raw`The radius of convergence of $\displaystyle\sum_{n=0}^\infty \frac{x^n}{n!}$ is`, choices: [String.raw`$0$`, String.raw`$1$`, String.raw`$e$`, String.raw`$\infty$`], answer: 3, explain: String.raw`$\left|\frac{a_{n+1}}{a_n}\right| = \frac{|x|}{n+1} \to 0 < 1$ for every $x$. (The sum is $e^x$.)` },
      ],
    },
    {
      id: 'substitution-endpoints',
      title: 'Substitutions and endpoints',
      blocks: [
        { type: 'text', html: String.raw`<p>The series $\displaystyle\sum_{n=1}^{\infty} \frac{(x+1)^{2n}}{n\,9^n}$ contains only even powers. With $u = \frac{(x+1)^2}{9}$ it is $\sum \frac{u^n}{n} = -\ln(1 - u)$. Increase $N$: the partial sums converge on $(-4, 2)$ and blow up outside.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Partial sums S_N(x) of Σ (x+1)^(2n)/(n 9^n)',
          functions: [{ expr: '-log(1 - (x+1).^2/9)', label: String.raw`$-\ln\!\left(1 - \frac{(x+1)^2}{9}\right)$` }, { expr: 'sum(((x+1).^2/9).^(1:N)./(1:N))', label: String.raw`$S_N(x)$` }],
          params: { N: { min: 1, max: 40, value: 4, step: 1, label: '$N$' } },
          vlines: [-4, 2],
          xlim: [-5.5, 3.5], ylim: [-0.5, 4],
          animate: { param: 'N', from: 1, to: 40, duration: 6000 },
          readout: 'At $x = 1.8$: $S_N(1.8) = {{sum(((1.8+1)^2/9).^(1:N)./(1:N))}}$, while the sum is $-\\ln(1 - 2.8^2/9) = {{-log(1-2.8^2/9)}}$.',
        } },
        { type: 'text', html: String.raw`<p><b>Example:</b> $\displaystyle\sum_{n=1}^{\infty} \frac{(x+1)^{2n}}{n\,9^n}$ by substitution. We substitute $u = \dfrac{(x+1)^2}{9}$, so that the series is $\sum_{n\ge1} \frac{u^n}{n}$. For $\sum \frac{u^n}{n}$ the ratio test gives $\frac{n}{n+1}|u| \to |u|$, so it converges for $|u| < 1$. At $u = 1$ it is the harmonic series (divergent), at $u = -1$ the alternating harmonic series (convergent). So it converges exactly for $-1 \le u < 1$. Now we translate this back to $x$:</p>` },
        { type: 'derive', title: String.raw`From $-1 \le u < 1$ back to $x$`, given: String.raw`\T{u-0}{u}=\frac{(x+1)^2}{9}`, colors: { u: 1, s: 2, n: 3 }, steps: [
          { kind: 'sub', label: String.raw`Put in $u = \frac{(x+1)^2}{9}$`, from: String.raw`-1\le\T{u-1}{u}<1`, to: String.raw`-1\le\frac{\T{s-1}{(x+1)^2}}{9}<1`, map: { 'u-1': ['s-1'] }, arrows: { 'u-1': 'u = (x+1)²/9' },
            why: String.raw`The condition was found for $u$; replacing $u$ by its definition turns it into a condition on $x$.` },
          { kind: 'calc', label: String.raw`The left part always holds`, to: String.raw`\frac{\T{s-1}{(x+1)^2}}{\T{n-1}{9}}<1`,
            why: String.raw`A square divided by $9$ is never negative, so it is always $\ge -1$. Only the right inequality is a real condition.` },
          { kind: 'both', label: String.raw`Both sides $\times\,9$`, to: String.raw`\T{s-1}{(x+1)^2}<\T{n-1}{9}`, arrows: { 'n-1': '× 9 on both sides' },
            why: String.raw`Multiplying both sides by the positive number $9$ keeps the inequality and clears the fraction.` },
          { kind: 'calc', label: 'Square root of both sides', to: String.raw`\T{s-1}{|x+1|}<\T{n-1}{3}`,
            why: String.raw`Both sides are non-negative, so taking square roots keeps the inequality. $\sqrt{(x+1)^2} = |x+1|$ (not $x+1$) and $\sqrt9 = 3$.` },
          { kind: 'expand', label: 'Remove the absolute value', to: String.raw`-\T{n-1}{3}<\T{s-1}{x+1}<\T{n-2}{3}`, map: { 'n-1': ['n-1', 'n-2'] }, arrows: { 'n-1': '|y| < 3  ⇔  −3 < y < 3' },
            why: String.raw`A number of size less than $3$ lies strictly between $-3$ and $3$.` },
          { kind: 'result', label: String.raw`All three parts $-\,1$`, to: String.raw`\T{n-1}{-4}<\T{s-1}{x}<\T{n-2}{2}`,
            why: String.raw`Subtracting $1$ everywhere frees $x$. Both endpoints $x = -4$ and $x = 2$ give $u = 1$: divergent. The interval is $(-4, 2)$ and the radius is $R = 3$ (not $9$: the radius refers to $x$, not to $u$).` },
        ] },
        { type: 'callout', kind: 'warn', title: 'Odd powers and negative coefficients', html: String.raw`<p>With $u = \frac{(1 - 2x)^3}{8}$, $u$ takes <b>both</b> signs, so both $u = 1$ and $u = -1$ occur as endpoints. Also note which $x$ gives which: $1 - 2x = 2$ at $x = -\tfrac12$ (that is $u = +1$), while $1 - 2x = -2$ at $x = \tfrac32$ ($u = -1$). Write both endpoint series out explicitly.</p>` },
        { type: 'quiz', question: String.raw`For which $x$ does $\displaystyle\sum_{n=0}^{\infty} \frac{(x-1)^{3n}}{8^n}$ converge?`, choices: [String.raw`$-1 < x < 3$`, String.raw`$-7 < x < 9$`, String.raw`$-1 \le x < 3$`, String.raw`$0 < x < 2$`], answer: 0, explain: String.raw`It is geometric with ratio $r = \left(\frac{x-1}{2}\right)^3$; $|r| < 1 \iff |x - 1| < 2$. At $x = 3$ and $x = -1$, $r = \pm 1$ and the terms do not tend to $0$.` },
      ],
    },
    {
      id: 'representations',
      title: 'Representing functions; differentiating and integrating series',
      blocks: [
        { type: 'text', html: String.raw`<p>Integrating $\dfrac{1}{1+t^2} = 1 - t^2 + t^4 - \cdots$ from $0$ to $x$ gives the series of $\arctan x$. Its radius is $1$ — although $\arctan$ is perfectly smooth on all of $\mathbb R$. (The reason lies in the complex plane: $1 + t^2 = 0$ at $t = \pm i$.)</p>` },
        { type: 'widget', name: 'taylor', config: {
          title: 'arctan x = x − x³/3 + x⁵/5 − ⋯',
          f: 'atan(x)', coef: 'sin(k*pi/2)./(k + (k==0))', a: 0, nmax: 31, n: 5, R: 1, Rtex: '1',
          xlim: [-2.2, 2.2], ylim: [-2, 2],
        } },
        { type: 'table', head: ['Function', 'Power series', 'Radius'], rows: [
          [String.raw`$\dfrac{1}{1-x}$`, String.raw`$\sum_{n=0}^{\infty} x^n$`, String.raw`$1$`],
          [String.raw`$\dfrac{1}{1+x^2}$`, String.raw`$\sum_{n=0}^{\infty} (-1)^n x^{2n}$`, String.raw`$1$`],
          [String.raw`$\dfrac{1}{(1-x)^2}$`, String.raw`$\sum_{n=1}^{\infty} n x^{n-1}$`, String.raw`$1$`],
          [String.raw`$\ln(1+x)$`, String.raw`$\sum_{n=1}^{\infty} \dfrac{(-1)^{n+1} x^n}{n}$`, String.raw`$1$`],
          [String.raw`$\arctan x$`, String.raw`$\sum_{n=0}^{\infty} \dfrac{(-1)^n x^{2n+1}}{2n+1}$`, String.raw`$1$`],
        ] },
        { type: 'callout', kind: 'thm', title: 'Term-by-term calculus', html: String.raw`<p>If $f(x) = \sum c_n (x-a)^n$ has radius $R > 0$, then on $|x - a| < R$</p>$$f'(x) = \sum_{n=1}^\infty n c_n (x-a)^{n-1}, \qquad \int_a^x f(t)\,\mathrm d t = \sum_{n=0}^\infty \frac{c_n}{n+1}(x-a)^{n+1},$$<p>and both series have the <b>same radius</b> $R$. Convergence at the endpoints may change and must be rechecked.</p>` },
        { type: 'derive', title: String.raw`Example: the series of $\ln(1+x)$`, colors: { r: 1, s: 2, i: 3 }, steps: [
          { kind: 'sub', label: String.raw`Ratio $r = -t$ in the geometric series`, from: String.raw`\frac{1}{1-\T{r-1}{r}}=\sum_{n=0}^\infty \T{r-2}{r}^{\,n}`, to: String.raw`\frac{1}{1-\T{r-1}{(-t)}}=\sum_{n=0}^\infty \T{r-2}{(-t)}^{n}`, arrows: { 'r-1': 'r = −t', 'r-2': 'r = −t' },
            why: String.raw`$\frac1{1-r} = \sum r^n$ holds for every $|r| < 1$. Putting $r = -t$ on both sides is allowed for $|t| < 1$.` },
          { kind: 'calc', label: String.raw`$1-(-t) = 1+t$ and $(-t)^n = (-1)^n t^n$`, from: String.raw`\frac{1}{1-(-t)}=\sum_{n=0}^\infty (-t)^{n}`, to: String.raw`\frac{1}{1+t}=\sum_{n=0}^\infty (-1)^n\,t^n`,
            why: String.raw`Minus a negative is plus, and the sign of $(-t)^n$ alternates with $n$.` },
          { kind: 'calculus', label: String.raw`Integrate both sides from $0$ to $x$`, to: String.raw`\int_0^x\frac{\mathrm dt}{1+t}=\sum_{n=0}^\infty (-1)^n\T{i-1}{\int_0^x t^n\,\mathrm dt}`,
            why: String.raw`Inside the radius ($|x| < 1$) a power series may be integrated term by term: the integral of the sum is the sum of the integrals.` },
          { kind: 'calculus', label: 'Evaluate the integrals', to: String.raw`\ln(1+x)=\sum_{n=0}^\infty \frac{(-1)^n\,\T{i-1}{x^{n+1}}}{\T{s-1}{n+1}}`,
            why: String.raw`$\int_0^x \frac{\mathrm dt}{1+t} = \ln(1+x) - \ln 1 = \ln(1+x)$ and $\int_0^x t^n\,\mathrm dt = \frac{x^{n+1}}{n+1}$.` },
          { kind: 'result', label: String.raw`Rename $n+1 \to n$`, to: String.raw`\ln(1+x)=\sum_{n=1}^\infty \frac{(-1)^{n+1}\,\T{i-1}{x^{n}}}{\T{s-1}{n}}`,
            why: String.raw`Writing $n$ for $n+1$ makes the sum start at $n = 1$; then $(-1)^{n-1} = (-1)^{n+1}$. The radius stays $R = 1$. At $x = 1$ the series is the alternating harmonic series, which converges (to $\ln 2$); at $x = -1$ it is $-\sum\frac1n$, divergent.` },
        ] },
        { type: 'derive', title: String.raw`Example: $\dfrac{x}{4 + x^2}$ as a power series`, colors: { r: 1, f: 2 }, steps: [
          { kind: 'factor', label: String.raw`Factor $4$ out of the denominator`, from: String.raw`\frac{x}{4+x^2}`, to: String.raw`\frac{x}{\T{f-1}{4}\left(1+\frac{x^2}{4}\right)}`,
            why: String.raw`The geometric series needs the form $\frac{1}{1 - r}$, so the denominator must start with $1$.` },
          { kind: 'calc', label: String.raw`Write $1 + \frac{x^2}{4}$ as $1 - r$`, to: String.raw`\frac{x}{\T{f-1}{4}}\cdot\frac{1}{1-\T{r-1}{\left(-\frac{x^2}{4}\right)}}`, arrows: { 'f-1': 'split off x/4' },
            why: String.raw`Plus a term is minus its negative, so the ratio is $r = -\frac{x^2}{4}$.` },
          { kind: 'sub', label: String.raw`$\frac{1}{1-r} = \sum r^n$`, to: String.raw`\frac{x}{\T{f-1}{4}}\sum_{n=0}^\infty \T{r-1}{\left(-\frac{x^2}{4}\right)}^{n}`, arrows: { 'r-1': 'r into Σ rⁿ' },
            why: String.raw`The geometric series with ratio $r = -\frac{x^2}{4}$, valid for $|r| < 1$.` },
          { kind: 'expand', label: String.raw`Bring $\frac x4$ into every term`, to: String.raw`\sum_{n=0}^\infty \frac{\T{r-1}{(-1)^n x^{2n}}\cdot\T{x-1}{x}}{\T{r-2}{4^n}\cdot\T{f-1}{4}}`, map: { 'r-1': ['r-1', 'r-2'] }, arrows: { 'r-1': 'power of a fraction' },
            why: String.raw`$\left(-\frac{x^2}{4}\right)^n = \frac{(-1)^n x^{2n}}{4^n}$: the power goes to the top and to the bottom. The factor $\frac x4$ multiplies every term.` },
          { kind: 'calc', label: 'Combine the powers', to: String.raw`\sum_{n=0}^\infty \frac{\T{r-1}{(-1)^n x^{2n+1}}}{\T{r-2}{4^{n+1}}}`, map: { 'x-1': ['r-1'], 'f-1': ['r-2'] },
            why: String.raw`$x^{2n}\cdot x = x^{2n+1}$ and $4^n\cdot 4 = 4^{n+1}$.` },
          { kind: 'result', label: String.raw`Radius from $|r| < 1$`, from: String.raw`\left|-\frac{x^2}{4}\right|<1`, to: String.raw`\left|-\frac{x^2}{4}\right|<1\iff x^2<4\iff |x|<2`,
            why: String.raw`Both sides $\times 4$, then square roots. The radius is $R = 2$.` },
        ] },
        { type: 'derive', title: String.raw`Example: a function defined by an integral, $F(x) = \displaystyle\int_0^x \frac{\arctan t}{t}\,\mathrm d t$`, colors: { t: 1, i: 2 }, steps: [
          { kind: 'start', label: 'The arctan series', from: String.raw`\arctan t=\sum_{n=0}^\infty \frac{(-1)^n\,\T{t-1}{t^{2n+1}}}{2n+1}`, to: String.raw`\arctan t=\sum_{n=0}^\infty \frac{(-1)^n\,\T{t-1}{t^{2n+1}}}{2n+1}`,
            why: String.raw`From the table, valid for $|t| \le 1$.` },
          { kind: 'both', label: String.raw`Both sides $\div\, t$`, to: String.raw`\frac{\arctan t}{t}=\sum_{n=0}^\infty \frac{(-1)^n\,\T{t-1}{t^{2n}}}{2n+1}`,
            why: String.raw`Dividing every term by $t$ lowers each power by one. This holds for $0 < |t| < 1$; the value $1$ at $t = 0$ makes the integrand continuous.` },
          { kind: 'calculus', label: String.raw`Integrate both sides from $0$ to $x$`, to: String.raw`F(x)=\sum_{n=0}^\infty \frac{(-1)^n\,\T{i-1}{x^{2n+1}}}{(2n+1)\,\T{i-2}{(2n+1)}}`, map: { 't-1': ['i-1', 'i-2'] }, arrows: { 't-1': '∫ t²ⁿ dt = x²ⁿ⁺¹/(2n+1)' },
            why: String.raw`Term by term: $\int_0^x t^{2n}\,\mathrm dt = \frac{x^{2n+1}}{2n+1}$, which brings a second factor $2n+1$ into the denominator.` },
          { kind: 'result', label: 'Write out the first terms', to: String.raw`F(x)=\sum_{n=0}^\infty \frac{(-1)^n\,\T{i-1}{x^{2n+1}}}{\T{i-2}{(2n+1)^2}}=x-\frac{x^3}{9}+\frac{x^5}{25}-\cdots`,
            why: String.raw`$n = 0, 1, 2$ give $\frac{x}{1}$, $-\frac{x^3}{9}$, $\frac{x^5}{25}$. Integration keeps the radius $R = 1$.` },
        ] },
        { type: 'quiz', question: String.raw`Differentiating $\sum_{n=0}^\infty x^n = \frac1{1-x}$ and multiplying by $x$ gives $\sum_{n=1}^\infty n x^n = $`, choices: [String.raw`$\dfrac{1}{(1-x)^2}$`, String.raw`$\dfrac{x}{(1-x)^2}$`, String.raw`$\dfrac{x}{1-x}$`, String.raw`$-\ln(1 - x)$`], answer: 1, explain: String.raw`$\frac{\mathrm d}{\mathrm d x}\frac1{1-x} = \frac{1}{(1-x)^2} = \sum_{n\ge1} n x^{n-1}$; multiplying by $x$ gives $\frac{x}{(1-x)^2}$ for $|x| < 1$.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'power-series-matlab',
      title: 'Power series in LaTeX and MATLAB',
      blocks: [
        { type: 'text', html: String.raw`<p>In the equation editor a power series is <code>\sum_{n=0}^{\infty} c_n (x-a)^n</code>. Practise the notation first:</p>` },
        { type: 'latex', prompt: 'Type the general power series:', target: String.raw`\sum_{n=0}^{\infty} c_n (x-a)^n` },
        { type: 'latex', prompt: 'Type the arctan series:', target: String.raw`\arctan x = \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{2n+1}`, accept: [String.raw`\tan^{-1} x = \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{2n+1}`] },
        { type: 'text', html: String.raw`<p>Numerically, a partial sum at <b>many</b> $x$ values at once is a loop over $n$ that adds a whole vector each time. Plotting $S_N$ for growing $N$ shows the interval of convergence: the curves agree inside and fan out outside.</p>` },
        { type: 'code', caption: 'Partial sums of Σ (x−2)^n/(n 3^n) for N = 5, 20, 80 on a grid of x values. Interval of convergence [−1, 5).', editable: true, code: String.raw`x = linspace(-2, 6, 401);
hold on
for N = [5 20 80]
    S = zeros(size(x));
    for n = 1:N
        S = S + (x - 2).^n ./ (n * 3^n);
    end
    plot(x, S)
end
hold off
ylim([-2 6])
xline(-1), xline(5)
grid on
legend('N = 5', 'N = 20', 'N = 80')` },
        { type: 'code', caption: 'At the endpoints: x = 5 gives the harmonic series, x = −1 the alternating harmonic series.', editable: true, code: String.raw`n = 1:10000;
Sright = cumsum(1 ./ n);
Sleft = cumsum((-1).^n ./ n);
fprintf('x = 5:  S_10000 = %.4f (still growing like ln N)\n', Sright(end))
fprintf('x = -1: S_10000 = %.6f (-ln 2 = %.6f)\n', Sleft(end), -log(2))` },
        { type: 'matlab', prompt: String.raw`Evaluate the arctan series at $x = 0.5$ with the terms $n = 0, \dots, 19$ and store the result in <code>S</code>. Compare with <code>atan(0.5)</code>.`, starter: `x = 0.5;\nn = 0:19;\nS = 0;   % replace by the sum of the terms`, solution: `x = 0.5;\nn = 0:19;\nS = sum((-1).^n .* x.^(2*n+1) ./ (2*n+1));\natan(x)`, checks: [{ var: 'S', value: 'atan(0.5)', tol: 1e-10 }], hint: String.raw`<code>sum((-1).^n .* x.^(2*n+1) ./ (2*n+1))</code>` },
        { type: 'matlab', prompt: String.raw`On the grid <code>x = linspace(-0.9, 0.9, 7)</code> compute the partial sums $S_{200}(x) = \sum_{n=1}^{200} \frac{x^n}{n}$ (a vector <code>S</code> of length 7) with a loop, and the largest deviation <code>maxErr</code> from the exact sum $-\ln(1-x)$.`, starter: `x = linspace(-0.9, 0.9, 7);\nS = zeros(size(x));\nfor n = 1:200\n    S = S + 0;   % replace 0 by the n-th term\nend\nmaxErr = 0;   % replace`, solution: `x = linspace(-0.9, 0.9, 7);\nS = zeros(size(x));\nfor n = 1:200\n    S = S + x.^n / n;\nend\nmaxErr = max(abs(S + log(1 - x)));`, checks: [{ var: 'S', size: 7 }, { var: 'maxErr', value: 0, tol: 1e-8 }] },
      ],
    },
    {
      id: 'interval-writeup',
      title: 'Writing up an interval of convergence',
      blocks: [
        { type: 'text', html: String.raw`<p>An interval-of-convergence answer has four steps: <b>ratio test</b> for the open interval, then the <b>left endpoint</b>, the <b>right endpoint</b> (each a series of numbers with its own test and pre-conditions), and the <b>final interval</b> with brackets matching the endpoint results.</p>` },
        { type: 'livescript', caption: 'Model answer: Σ (x+3)^n/(n² 2^n)', blocks: [
          { type: 'heading', content: 'Problem (Attempted)' },
          { type: 'text', content: String.raw`We determine the interval of convergence of $\sum_{n=1}^{\infty} \frac{(x+3)^n}{n^2\,2^n}$. We apply the ratio test to the absolute values of the terms:` },
          { type: 'equation', content: String.raw`\left|\frac{a_{n+1}}{a_n}\right| = \frac{|x+3|^{n+1}}{(n+1)^2\,2^{n+1}}\cdot\frac{n^2\,2^n}{|x+3|^n} = \left(\frac{n}{n+1}\right)^2\frac{|x+3|}{2} \;\to\; \frac{|x+3|}{2}.` },
          { type: 'text', content: String.raw`The series converges absolutely for $|x + 3| < 2$, i.e. $-5 < x < -1$, and diverges for $|x+3| > 2$. The radius is $R = 2$. At the endpoints $x = -1$ and $x = -5$ the series become` },
          { type: 'equation', content: String.raw`\sum_{n=1}^{\infty} \frac{1}{n^2} \qquad\text{and}\qquad \sum_{n=1}^{\infty} \frac{(-1)^n}{n^2},` },
          { type: 'text', content: String.raw`which both converge: the first is a $p$-series with $p = 2 > 1$, and the second converges absolutely because of the first. The interval of convergence is $[-5, -1]$. We check numerically that the partial sums at both endpoints settle:` },
          { type: 'code', content: String.raw`n = 1:2000;
Sa = cumsum(1 ./ n.^2);
Sb = cumsum((-1).^n ./ n.^2);
fprintf('x = -1: %.6f,  x = -5: %.6f\n', Sa(end), Sb(end))` },
        ] },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Interval of convergence with a substitution',
      difficulty: 'challenge',
      hw: 'HW6-style',
      statement: String.raw`<p>Consider the power series $\displaystyle\sum_{n=1}^{\infty} \frac{(4x-1)^{3n}}{8^n\sqrt n}$.</p>`,
      parts: [
        { label: '(a)', prompt: 'The centre $a$ of the series:', kind: 'numeric', answer: '1/4', solution: String.raw`$(4x - 1)^{3n} = 4^{3n}\left(x - \tfrac14\right)^{3n}$, so the series is in powers of $x - \tfrac14$.` },
        { label: '(b)', prompt: 'The radius of convergence $R$:', kind: 'numeric', answer: '1/2', solution: [
          { type: 'text', html: String.raw`<p>With $u = \frac{(4x-1)^3}{8} = \left(\frac{4x-1}{2}\right)^3$ the series is $\sum \frac{u^n}{\sqrt n}$, and the ratio test gives $\sqrt{\frac{n}{n+1}}\,|u| \to |u|$: it converges for $|u| < 1$. We translate this condition back to $x$.</p>` },
          { type: 'derive', colors: { u: 1, n: 2 }, steps: [
            { kind: 'sub', label: String.raw`Put in $u = \left(\frac{4x-1}{2}\right)^3$`, from: String.raw`|\T{u-1}{u}|<1`, to: String.raw`\left|\T{u-1}{\left(\frac{4x-1}{2}\right)^3}\right|<1`, arrows: { 'u-1': 'u = ((4x−1)/2)³' },
              why: String.raw`The condition was found for $u$; its definition turns it into a condition on $x$.` },
            { kind: 'calc', label: 'Cube root of both sides', to: String.raw`\left|\T{u-1}{\frac{4x-1}{2}}\right|<1`,
              why: String.raw`$|y^3| = |y|^3$, and $|y|^3 < 1$ exactly when $|y| < 1$ (the cube root of $1$ is $1$).` },
            { kind: 'both', label: String.raw`Both sides $\times\,2$`, to: String.raw`|\T{u-1}{4x-1}|<\T{n-1}{2}`, arrows: { 'u-1': '× 2 on both sides' },
              why: String.raw`Multiplying by the positive number $2$ keeps the inequality and clears the fraction.` },
            { kind: 'factor', label: String.raw`$4x - 1 = 4\left(x - \frac14\right)$`, to: String.raw`4\,|\T{u-1}{x-\tfrac14}|<\T{n-1}{2}`,
              why: String.raw`Factoring out the coefficient of $x$ shows the centre $\frac14$; $|4y| = 4|y|$.` },
            { kind: 'result', label: String.raw`Both sides $\div\, 4$`, to: String.raw`|\T{u-1}{x-\tfrac14}|<\T{n-1}{\tfrac12}`, arrows: { 'n-1': '÷ 4 on both sides' },
              why: String.raw`The series converges for $\left|x - \frac14\right| < \frac12$: centre $\frac14$, radius $R = \frac12$.` },
          ] },
        ] },
        { label: '(c)', prompt: 'The interval of convergence:', kind: 'choice', choices: [String.raw`$\left(-\tfrac14, \tfrac34\right)$`, String.raw`$\left[-\tfrac14, \tfrac34\right)$`, String.raw`$\left(-\tfrac14, \tfrac34\right]$`, String.raw`$\left[-\tfrac14, \tfrac34\right]$`], answer: 1, solution: String.raw`At $x = \tfrac34$: $u = 1$, $\sum \frac1{\sqrt n}$ diverges ($p = \tfrac12$). At $x = -\tfrac14$: $u = -1$, $\sum \frac{(-1)^n}{\sqrt n}$ converges by the alternating series test.` },
        { label: '(d)', prompt: String.raw`Write a complete Live Script solution: ratio test, both endpoints with the pre-conditions of the tests used, final interval, and a numerical illustration.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 1 (Attempted)' },
        { type: 'text', content: String.raw`We write the series with $u = \left(\frac{4x-1}{2}\right)^3$, so that $\frac{(4x-1)^{3n}}{8^n} = u^n$ and the series is $\sum_{n=1}^\infty \frac{u^n}{\sqrt n}$. We apply the ratio test to the absolute values:` },
        { type: 'equation', content: String.raw`\left|\frac{a_{n+1}}{a_n}\right| = \frac{|u|^{n+1}}{\sqrt{n+1}}\cdot\frac{\sqrt n}{|u|^n} = \sqrt{\frac{n}{n+1}}\;|u| \;\to\; |u| .` },
        { type: 'text', content: String.raw`The series converges absolutely for $|u| < 1$ and diverges for $|u| > 1$. Since $|u| < 1 \iff |4x - 1| < 2 \iff -\frac14 < x < \frac34$, the centre is $a = \frac14$ and the radius is $R = \frac12$.` },
        { type: 'text', content: String.raw`Right endpoint $x = \frac34$: then $4x - 1 = 2$, $u = 1$, and the series is $\sum \frac{1}{\sqrt n}$, a $p$-series with $p = \frac12 \le 1$, which diverges.` },
        { type: 'text', content: String.raw`Left endpoint $x = -\frac14$: then $4x - 1 = -2$, $u = -1$, and the series is $\sum \frac{(-1)^n}{\sqrt n}$. We check the alternating series test for $b_n = \frac{1}{\sqrt n}$: $b_n > 0$, $b_{n+1} < b_n$ because $\sqrt{n}$ is increasing, and $b_n \to 0$. Hence it converges (conditionally).` },
        { type: 'text', content: String.raw`The interval of convergence is $\left[-\frac14, \frac34\right)$. Numerically, the partial sums at the left endpoint settle while those at the right endpoint keep growing like $2\sqrt N$:` },
        { type: 'code', content: String.raw`n = 1:20000;
Sleft = cumsum((-1).^n ./ sqrt(n));
Sright = cumsum(1 ./ sqrt(n));
fprintf('x = -1/4: S_19999 = %.5f, S_20000 = %.5f\n', Sleft(end-1), Sleft(end))
fprintf('x =  3/4: S_20000 = %.2f, 2*sqrt(20000) = %.2f\n', Sright(end), 2*sqrt(20000))` },
      ],
    },
    {
      id: 'a2',
      title: 'Radius and interval of convergence',
      difficulty: 'core',
      statement: String.raw`<p>Find the radius or interval of convergence.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$R$ for $\displaystyle\sum_{n=1}^\infty \frac{n\,x^n}{5^n}$`, kind: 'numeric', answer: '5', solution: String.raw`$\frac{n+1}{n}\cdot\frac{|x|}{5} \to \frac{|x|}{5}$, so $R = 5$.` },
        { label: '(b)', prompt: String.raw`$R$ for $\displaystyle\sum_{n=0}^\infty n!\,x^n$`, kind: 'numeric', answer: '0', solution: String.raw`$(n+1)|x| \to \infty$ for every $x \ne 0$: the series converges only at $x = 0$, $R = 0$.` },
        { label: '(c)', prompt: String.raw`$R$ for $\displaystyle\sum_{n=0}^\infty \frac{(2n)!}{(n!)^2}\,x^n$`, kind: 'numeric', answer: '1/4', solution: [
          { type: 'text', html: String.raw`<p>We apply the ratio test to the terms $a_n = \frac{(2n)!}{(n!)^2}x^n$, cancel the factorials, and read off $R$ from the condition $\rho < 1$.</p>` },
          { type: 'derive', colors: { f: 1, g: 2, x: 3, k: 4, m: 5 }, steps: [
            { kind: 'sub', label: String.raw`Replace $n$ by $n+1$, divide by $a_n$`, from: String.raw`a_n=\frac{(2n)!}{(n!)^2}\,x^n`,
              to: String.raw`\left|\frac{a_{n+1}}{a_n}\right|=\frac{\T{f-1}{(2n+2)!}}{\T{g-1}{((n+1)!)^2}}\cdot\frac{\T{g-2}{(n!)^2}}{\T{f-2}{(2n)!}}\cdot\frac{\T{x-1}{|x|^{n+1}}}{\T{x-2}{|x|^{n}}}`,
              why: String.raw`Dividing by $a_n$ is multiplying by its reciprocal. We sort the factors into factorials and powers of $x$.` },
            { kind: 'expand', label: 'Split off the extra factors', to: String.raw`\left|\frac{a_{n+1}}{a_n}\right|=\frac{\T{k-1}{(2n+2)(2n+1)}\,\T{f-1}{(2n)!}}{\T{m-1}{(n+1)^2}\,\T{g-1}{(n!)^2}}\cdot\frac{\T{g-2}{(n!)^2}}{\T{f-2}{(2n)!}}\cdot\frac{\T{x-1}{|x|^{n+1}}}{\T{x-2}{|x|^{n}}}`,
              map: { 'f-1': ['k-1', 'f-1'], 'g-1': ['m-1', 'g-1'] }, arrows: { 'f-1': '(2n+2)! = (2n+2)(2n+1)·(2n)!', 'g-1': '(n+1)! = (n+1)·n!' },
              why: String.raw`$(2n+2)! = (2n+2)(2n+1)\cdot(2n)!$ and $(n+1)! = (n+1)\cdot n!$, squared.` },
            { kind: 'cancel', label: String.raw`Cancel $(2n)!$, $(n!)^2$ and $|x|^n$`, to: String.raw`\left|\frac{a_{n+1}}{a_n}\right|=\frac{\T{k-1}{(2n+2)(2n+1)}}{\T{m-1}{(n+1)^2}}\,\T{x-1}{|x|}`,
              why: String.raw`Each of these appears once above and once below; of $|x|^{n+1}$ one factor $|x|$ is left.` },
            { kind: 'calc', label: String.raw`Top and bottom $\div\, n^2$`, to: String.raw`\left|\frac{a_{n+1}}{a_n}\right|=\frac{\T{k-1}{\left(2+\frac2n\right)\left(2+\frac1n\right)}}{\T{m-1}{\left(1+\frac1n\right)^2}}\,\T{x-1}{|x|}`,
              why: String.raw`Dividing one factor $n$ out of each bracket shows the limit.` },
            { kind: 'result', label: String.raw`Limit $n\to\infty$`, to: String.raw`\rho=\frac{\T{k-1}{2\cdot 2}}{\T{m-1}{1}}\,\T{x-1}{|x|}=4|x|`,
              why: String.raw`$\rho = 4|x| < 1$ exactly for $|x| < \frac14$. So $L = 4$ and $R = \frac1L = \frac14$.` },
          ] },
        ] },
        { label: '(d)', prompt: String.raw`Interval of convergence of $\displaystyle\sum_{n=1}^\infty \frac{(x-3)^n}{n\,2^n}$`, kind: 'choice', choices: [String.raw`$(1, 5)$`, String.raw`$[1, 5)$`, String.raw`$(1, 5]$`, String.raw`$[1, 5]$`], answer: 1, solution: String.raw`Ratio test: $|x - 3| < 2$. At $x = 5$: $\sum\frac1n$ diverges. At $x = 1$: $\sum\frac{(-1)^n}{n}$ converges (alternating series test).` },
        { label: '(e)', prompt: String.raw`Interval of convergence of $\displaystyle\sum_{n=0}^\infty \frac{(2x+1)^n}{n^2 + 1}$`, kind: 'choice', choices: [String.raw`$(-1, 0)$`, String.raw`$[-1, 0]$`, String.raw`$[-1, 0)$`, String.raw`$\left[-\tfrac32, \tfrac12\right]$`], answer: 1, solution: String.raw`Ratio test: $|2x + 1| < 1 \iff -1 < x < 0$. At both endpoints $|a_n| = \frac1{n^2+1} \le \frac1{n^2}$ (for $n \ge 1$), so both converge absolutely: $[-1, 0]$.` },
      ],
    },
    {
      id: 'a3',
      title: 'Series from the geometric series',
      difficulty: 'core',
      statement: String.raw`<p>Use the geometric series, differentiation and integration.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\dfrac{1}{3 - x} = \sum_{n=0}^\infty c_n x^n$. Give $c_n$ as a function of $n$.`, kind: 'expression', variable: 'n', answer: '3.^(-n-1)', domain: [0, 6], solution: [
          { type: 'text', html: String.raw`<p>We rewrite the function in the form $\frac{1}{1-r}$ and use the geometric series.</p>` },
          { type: 'derive', colors: { r: 1, f: 2 }, steps: [
            { kind: 'factor', label: String.raw`Factor $3$ out of the denominator`, from: String.raw`\frac{1}{3-x}`, to: String.raw`\frac{1}{\T{f-1}{3}\left(1-\T{r-1}{\frac x3}\right)}`,
              why: String.raw`The geometric series needs a denominator that starts with $1$: $3 - x = 3\left(1 - \frac x3\right)$.` },
            { kind: 'calc', label: 'Split into two factors', to: String.raw`\frac{1}{\T{f-1}{3}}\cdot\frac{1}{1-\T{r-1}{\frac x3}}`, arrows: { 'f-1': 'split off 1/3' },
              why: String.raw`$\frac{1}{ab} = \frac1a\cdot\frac1b$.` },
            { kind: 'sub', label: String.raw`$\frac{1}{1-r} = \sum r^n$ with $r = \frac x3$`, to: String.raw`\frac{1}{\T{f-1}{3}}\sum_{n=0}^\infty \T{r-1}{\left(\frac x3\right)}^{n}`, arrows: { 'r-1': 'r into Σ rⁿ' },
              why: String.raw`Valid for $\left|\frac x3\right| < 1$, i.e. $|x| < 3$.` },
            { kind: 'expand', label: 'Power of a fraction', to: String.raw`\sum_{n=0}^\infty \frac{\T{r-1}{x^n}}{\T{r-2}{3^n}\cdot\T{f-1}{3}}`, map: { 'r-1': ['r-1', 'r-2'] }, arrows: { 'r-1': 'top and bottom' },
              why: String.raw`$\left(\frac x3\right)^n = \frac{x^n}{3^n}$, and the factor $\frac13$ goes into every term.` },
            { kind: 'result', label: String.raw`$3^n\cdot 3 = 3^{n+1}$`, to: String.raw`\sum_{n=0}^\infty \frac{\T{r-1}{x^n}}{\T{r-2}{3^{n+1}}}`, map: { 'f-1': ['r-2'] },
              why: String.raw`So $c_n = \frac{1}{3^{n+1}} = 3^{-(n+1)}$, valid for $|x| < 3$.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`The coefficient of $x^6$ in the Maclaurin series of $\dfrac{x^2}{1 + 4x^2}$.`, kind: 'numeric', answer: '16', solution: [
          { type: 'text', html: String.raw`<p>We substitute $r = -4x^2$ into the geometric series, multiply by $x^2$, and pick the term with $x^6$.</p>` },
          { type: 'derive', colors: { r: 1, x: 2 }, steps: [
            { kind: 'sub', label: String.raw`$r = -4x^2$ in the geometric series`, from: String.raw`\frac{1}{1-\T{r-1}{r}}=\sum_{n=0}^\infty \T{r-2}{r}^{\,n}`, to: String.raw`\frac{1}{1-\T{r-1}{(-4x^2)}}=\sum_{n=0}^\infty \T{r-2}{(-4x^2)}^{n}`, arrows: { 'r-1': 'r = −4x²', 'r-2': 'r = −4x²' },
              why: String.raw`The formula holds for every $|r| < 1$, here for $4x^2 < 1$.` },
            { kind: 'both', label: String.raw`Both sides $\times\, x^2$`, from: String.raw`\frac{1}{1+4x^2}=\sum_{n=0}^\infty \T{r-2}{(-4x^2)}^{n}`, to: String.raw`\frac{x^2}{1+4x^2}=\sum_{n=0}^\infty \T{x-1}{x^2}\,\T{r-2}{(-4x^2)}^{n}`,
              why: String.raw`$1 - (-4x^2) = 1 + 4x^2$. Multiplying both sides by $x^2$ multiplies every term of the series by $x^2$.` },
            { kind: 'calc', label: String.raw`$(-4x^2)^n\cdot x^2 = (-4)^n x^{2n+2}$`, to: String.raw`\frac{x^2}{1+4x^2}=\sum_{n=0}^\infty \T{r-2}{(-4)^n}\,\T{x-1}{x^{2n+2}}`, map: { 'r-2': ['r-2', 'x-1'] },
              why: String.raw`The power splits into $(-4)^n$ and $x^{2n}$; then $x^{2n}\cdot x^2 = x^{2n+2}$.` },
            { kind: 'result', label: String.raw`$x^6$: $2n + 2 = 6$, so $n = 2$`, from: String.raw`2n+2=6\iff n=2`, to: String.raw`c_6=(-4)^2=16`,
              why: String.raw`Only the term with $n = 2$ contains $x^6$; its coefficient is $(-4)^2 = 16$.` },
          ] },
        ] },
        { label: '(c)', prompt: String.raw`The coefficient of $x^4$ in the series of $\ln(1 + 2x)$.`, kind: 'numeric', answer: '-4', solution: [
          { type: 'text', html: String.raw`<p>We substitute $2x$ into the series of $\ln(1+u)$ and read off the coefficient for $n = 4$.</p>` },
          { type: 'derive', colors: { u: 1 }, steps: [
            { kind: 'sub', label: String.raw`$u = 2x$`, from: String.raw`\ln(1+\T{u-1}{u})=\sum_{n=1}^\infty\frac{(-1)^{n+1}\,\T{u-2}{u}^{\,n}}{n}`, to: String.raw`\ln(1+\T{u-1}{2x})=\sum_{n=1}^\infty\frac{(-1)^{n+1}\,\T{u-2}{(2x)}^{n}}{n}`, arrows: { 'u-1': 'u = 2x', 'u-2': 'u = 2x' },
              why: String.raw`The series of $\ln(1+u)$ holds for $|u| < 1$; we put $u = 2x$ everywhere.` },
            { kind: 'calc', label: String.raw`$(2x)^n = 2^n x^n$`, to: String.raw`\ln(1+\T{u-1}{2x})=\sum_{n=1}^\infty\frac{(-1)^{n+1}\,\T{u-2}{2^n}\,x^n}{n}`,
              why: String.raw`A power of a product is the product of the powers, so the coefficient of $x^n$ is $\frac{(-1)^{n+1}2^n}{n}$.` },
            { kind: 'sub', label: String.raw`$n = 4$`, from: String.raw`c_n=\frac{(-1)^{n+1}\,2^n}{n}`, to: String.raw`c_4=\frac{(-1)^{5}\,2^4}{4}=\frac{-16}{4}=-4`,
              why: String.raw`$(-1)^5 = -1$ and $2^4 = 16$.` },
          ] },
        ] },
        { label: '(d)', prompt: String.raw`The sum $\displaystyle\sum_{n=1}^\infty \frac{n}{3^n}$.`, kind: 'numeric', answer: '3/4', hint: String.raw`$\sum n x^n = \frac{x}{(1-x)^2}$.`, solution: [
          { type: 'text', html: String.raw`<p>We put $x = \frac13$ (inside $|x| < 1$) into $\sum n x^n = \frac{x}{(1-x)^2}$.</p>` },
          { type: 'derive', colors: { x: 1 }, steps: [
            { kind: 'sub', label: String.raw`$x = \frac13$`, from: String.raw`\sum_{n=1}^\infty n\,\T{x-1}{x}^{n}=\frac{\T{x-2}{x}}{(1-\T{x-3}{x})^2}`, to: String.raw`\sum_{n=1}^\infty n\,\T{x-1}{\left(\tfrac13\right)}^{n}=\frac{\T{x-2}{\tfrac13}}{(1-\T{x-3}{\tfrac13})^2}`, arrows: { 'x-1': 'x = 1/3', 'x-2': 'x = 1/3', 'x-3': 'x = 1/3' },
              why: String.raw`The formula holds for $|x| < 1$, and $\frac13$ is inside.` },
            { kind: 'calc', label: String.raw`$\left(\frac13\right)^n = \frac{1}{3^n}$ and $1 - \frac13 = \frac23$`, to: String.raw`\sum_{n=1}^\infty \frac{n}{\T{x-1}{3^n}}=\frac{\T{x-2}{1/3}}{\T{x-3}{(2/3)^2}}`,
              why: String.raw`The left side is now exactly the series we want.` },
            { kind: 'result', label: String.raw`$(2/3)^2 = \frac49$; dividing by $\frac49$ is multiplying by $\frac94$`, to: String.raw`\sum_{n=1}^\infty \frac{n}{\T{x-1}{3^n}}=\T{x-2}{\frac13}\cdot\T{x-3}{\frac94}=\frac34`,
              why: String.raw`$\frac13\cdot\frac94 = \frac{9}{12} = \frac34$.` },
          ] },
        ] },
      ],
    },
    {
      id: 'a4',
      title: 'A function defined by an integral',
      difficulty: 'challenge',
      statement: String.raw`<p>Let $\displaystyle F(x) = \int_0^x \frac{\mathrm d t}{1 + t^4}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`The Maclaurin series of $F$ is $\sum_{n=0}^\infty c_n x^{4n+1}$. Give the coefficient of $x^9$.`, kind: 'numeric', answer: '1/9', solution: [
          { type: 'text', html: String.raw`<p>We substitute $r = -t^4$ into the geometric series, integrate term by term, and pick the term with $x^9$.</p>` },
          { type: 'derive', colors: { r: 1, t: 2 }, steps: [
            { kind: 'sub', label: String.raw`$r = -t^4$ in the geometric series`, from: String.raw`\frac{1}{1-\T{r-1}{r}}=\sum_{n=0}^\infty \T{r-2}{r}^{\,n}`, to: String.raw`\frac{1}{1-\T{r-1}{(-t^4)}}=\sum_{n=0}^\infty \T{r-2}{(-t^4)}^{n}`, arrows: { 'r-1': 'r = −t⁴', 'r-2': 'r = −t⁴' },
              why: String.raw`Valid for $|r| = t^4 < 1$, i.e. $|t| < 1$.` },
            { kind: 'calc', label: String.raw`$1 - (-t^4) = 1 + t^4$, $(-t^4)^n = (-1)^n t^{4n}$`, from: String.raw`\frac{1}{1-(-t^4)}=\sum_{n=0}^\infty (-t^4)^{n}`, to: String.raw`\frac{1}{1+t^4}=\sum_{n=0}^\infty (-1)^n\,\T{t-1}{t^{4n}}`,
              why: String.raw`Minus a negative is plus, and the sign of $(-t^4)^n$ alternates.` },
            { kind: 'calculus', label: String.raw`Integrate both sides from $0$ to $x$`, to: String.raw`F(x)=\sum_{n=0}^\infty (-1)^n\,\frac{\T{t-1}{x^{4n+1}}}{\T{t-2}{4n+1}}`, map: { 't-1': ['t-1', 't-2'] }, arrows: { 't-1': '∫ t⁴ⁿ dt = x⁴ⁿ⁺¹/(4n+1)' },
              why: String.raw`Term by term inside the radius: $\int_0^x t^{4n}\,\mathrm dt = \frac{x^{4n+1}}{4n+1}$.` },
            { kind: 'result', label: String.raw`$x^9$: $4n + 1 = 9$, so $n = 2$`, from: String.raw`4n+1=9\iff n=2`, to: String.raw`c_2=\frac{(-1)^2}{9}=\frac19`,
              why: String.raw`Only the term with $n = 2$ contains $x^9$.` },
          ] },
        ] },
        { label: '(b)', prompt: 'The radius of convergence:', kind: 'numeric', answer: '1', solution: String.raw`The geometric series converges for $t^4 < 1$, i.e. $|t| < 1$; integration keeps $R = 1$.` },
        { label: '(c)', prompt: String.raw`$F(0.5)$ to five decimals, using the series.`, kind: 'numeric', answer: 'integral(@(t) 1./(1+t.^4), 0, 0.5)', tol: 1e-5, solution: String.raw`$F(0.5) = 0.5 - \frac{0.5^5}{5} + \frac{0.5^9}{9} - \cdots \approx 0.5 - 0.00625 + 0.000217 = 0.49397$; the next term is $\frac{0.5^{13}}{13} \approx 9.4\cdot10^{-6}$, and indeed $F(0.5) = 0.493958\ldots$` },
        { label: '(d)', prompt: String.raw`How many nonzero terms of the series guarantee an error below $10^{-8}$ at $x = 0.5$ (alternating series bound)?`, kind: 'numeric', answer: '6', tol: 1e-9, solution: String.raw`For $x = 0.5$ the series alternates with decreasing $b_n = \frac{0.5^{4n+1}}{4n+1} \to 0$. Using the terms $n = 0, \dots, m-1$ the error is at most $b_m$: $b_5 = \frac{0.5^{21}}{21} \approx 2.3\cdot10^{-8}$ is too large, $b_6 = \frac{0.5^{25}}{25} \approx 1.2\cdot10^{-9}$ suffices. So $6$ terms.` },
      ],
    },
  ],
};
