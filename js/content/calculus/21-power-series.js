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
        { type: 'steps', title: String.raw`Example: interval of convergence of $\displaystyle\sum_{n=1}^{\infty} \frac{(x-2)^n}{n\,3^n}$`, steps: [
          String.raw`We apply the ratio test to the absolute values of the terms: $\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{|x-2|^{n+1}}{(n+1)3^{n+1}}\cdot\dfrac{n\,3^n}{|x-2|^n} = \dfrac{n}{n+1}\cdot\dfrac{|x-2|}{3} \to \dfrac{|x-2|}{3}$.`,
          String.raw`The series converges absolutely if $\frac{|x-2|}{3} < 1$, i.e. $|x - 2| < 3$, and diverges if $|x-2| > 3$. Centre $a = 2$, radius $R = 3$.`,
          String.raw`We check the right endpoint $x = 5$: the series becomes $\sum \frac{3^n}{n3^n} = \sum \frac1n$, the harmonic series, which diverges.`,
          String.raw`We check the left endpoint $x = -1$: $\sum \frac{(-3)^n}{n3^n} = \sum \frac{(-1)^n}{n}$. Here $b_n = \frac1n$ is positive, decreasing and tends to $0$, so it converges by the alternating series test.`,
          String.raw`The interval of convergence is $[-1, 5)$.`,
        ] },
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
        { type: 'steps', title: String.raw`Example: $\displaystyle\sum_{n=1}^{\infty} \frac{(x+1)^{2n}}{n\,9^n}$ by substitution`, steps: [
          String.raw`We substitute $u = \dfrac{(x+1)^2}{9}$, so that the series is $\sum_{n\ge1} \frac{u^n}{n}$.`,
          String.raw`For $\sum \frac{u^n}{n}$ the ratio test gives $\frac{n}{n+1}|u| \to |u|$, so it converges for $|u| < 1$. At $u = 1$ it is the harmonic series (divergent), at $u = -1$ the alternating harmonic series (convergent). So it converges exactly for $-1 \le u < 1$.`,
          String.raw`We translate back. Here $u = \frac{(x+1)^2}{9} \ge 0$, so the condition is $0 \le \frac{(x+1)^2}{9} < 1$, i.e. $|x + 1| < 3$, i.e. $-4 < x < 2$.`,
          String.raw`Both endpoints $x = -4$ and $x = 2$ give $u = 1$: divergent. The interval is $(-4, 2)$ and the radius is $R = 3$ (not $9$: the radius refers to $x$, not to $u$).`,
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
        { type: 'steps', title: String.raw`Example: the series of $\ln(1+x)$`, steps: [
          String.raw`We start from the geometric series with ratio $-t$: $\dfrac{1}{1+t} = \sum_{n=0}^\infty (-1)^n t^n$ for $|t| < 1$.`,
          String.raw`We integrate term by term from $0$ to $x$ (allowed for $|x| < 1$): $\ln(1+x) = \displaystyle\int_0^x \frac{\mathrm d t}{1+t} = \sum_{n=0}^\infty \frac{(-1)^n x^{n+1}}{n+1} = \sum_{n=1}^\infty \frac{(-1)^{n+1}x^n}{n}$.`,
          String.raw`The radius stays $R = 1$. At $x = 1$ the series is the alternating harmonic series, which converges (and its value is $\ln 2$); at $x = -1$ it is $-\sum\frac1n$, divergent.`,
        ] },
        { type: 'steps', title: String.raw`Example: $\dfrac{x}{4 + x^2}$ as a power series`, steps: [
          String.raw`We bring the denominator to the form $1 - (\text{ratio})$: $\dfrac{x}{4 + x^2} = \dfrac{x}{4}\cdot\dfrac{1}{1 - \left(-\frac{x^2}{4}\right)}$.`,
          String.raw`The geometric series with ratio $-\frac{x^2}{4}$ gives $\dfrac{x}{4}\sum_{n=0}^\infty \left(-\dfrac{x^2}{4}\right)^n = \sum_{n=0}^\infty \dfrac{(-1)^n x^{2n+1}}{4^{n+1}}$.`,
          String.raw`It converges when $\frac{x^2}{4} < 1$, i.e. $R = 2$.`,
        ] },
        { type: 'steps', title: String.raw`Example: a function defined by an integral, $F(x) = \displaystyle\int_0^x \frac{\arctan t}{t}\,\mathrm d t$`, steps: [
          String.raw`We divide the arctan series by $t$: $\dfrac{\arctan t}{t} = \sum_{n=0}^\infty \dfrac{(-1)^n t^{2n}}{2n+1}$ for $0 < |t| < 1$ (the value $1$ at $t = 0$ makes the integrand continuous).`,
          String.raw`We integrate term by term: $F(x) = \sum_{n=0}^\infty \dfrac{(-1)^n x^{2n+1}}{(2n+1)^2} = x - \dfrac{x^3}{9} + \dfrac{x^5}{25} - \cdots$, with radius $R = 1$.`,
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
        { label: '(b)', prompt: 'The radius of convergence $R$:', kind: 'numeric', answer: '1/2', solution: String.raw`With $u = \frac{(4x-1)^3}{8} = \left(\frac{4x-1}{2}\right)^3$ the ratio test gives $\sqrt{\frac{n}{n+1}}\,|u| \to |u|$; $|u| < 1 \iff |4x - 1| < 2 \iff |x - \tfrac14| < \tfrac12$.` },
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
        { label: '(c)', prompt: String.raw`$R$ for $\displaystyle\sum_{n=0}^\infty \frac{(2n)!}{(n!)^2}\,x^n$`, kind: 'numeric', answer: '1/4', solution: String.raw`$\frac{(2n+2)(2n+1)}{(n+1)^2}|x| \to 4|x|$, so $R = \frac14$.` },
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
        { label: '(a)', prompt: String.raw`$\dfrac{1}{3 - x} = \sum_{n=0}^\infty c_n x^n$. Give $c_n$ as a function of $n$.`, kind: 'expression', variable: 'n', answer: '3.^(-n-1)', domain: [0, 6], solution: String.raw`$\dfrac{1}{3-x} = \dfrac13\cdot\dfrac{1}{1 - x/3} = \sum_{n=0}^\infty \dfrac{x^n}{3^{n+1}}$, so $c_n = 3^{-(n+1)}$, valid for $|x| < 3$.` },
        { label: '(b)', prompt: String.raw`The coefficient of $x^6$ in the Maclaurin series of $\dfrac{x^2}{1 + 4x^2}$.`, kind: 'numeric', answer: '16', solution: String.raw`$\dfrac{x^2}{1+4x^2} = x^2\sum (-4x^2)^n = \sum (-4)^n x^{2n+2}$; $x^6$ needs $n = 2$: $(-4)^2 = 16$.` },
        { label: '(c)', prompt: String.raw`The coefficient of $x^4$ in the series of $\ln(1 + 2x)$.`, kind: 'numeric', answer: '-4', solution: String.raw`$\ln(1+2x) = \sum_{n\ge1} \frac{(-1)^{n+1}(2x)^n}{n}$; $n = 4$: $\frac{-16}{4} = -4$.` },
        { label: '(d)', prompt: String.raw`The sum $\displaystyle\sum_{n=1}^\infty \frac{n}{3^n}$.`, kind: 'numeric', answer: '3/4', hint: String.raw`$\sum n x^n = \frac{x}{(1-x)^2}$.`, solution: String.raw`With $x = \frac13$ (inside $|x| < 1$): $\dfrac{1/3}{(2/3)^2} = \dfrac{1/3}{4/9} = \dfrac34$.` },
      ],
    },
    {
      id: 'a4',
      title: 'A function defined by an integral',
      difficulty: 'challenge',
      statement: String.raw`<p>Let $\displaystyle F(x) = \int_0^x \frac{\mathrm d t}{1 + t^4}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`The Maclaurin series of $F$ is $\sum_{n=0}^\infty c_n x^{4n+1}$. Give the coefficient of $x^9$.`, kind: 'numeric', answer: '1/9', solution: String.raw`$\dfrac{1}{1+t^4} = \sum (-1)^n t^{4n}$, so $F(x) = \sum_{n=0}^\infty \dfrac{(-1)^n x^{4n+1}}{4n+1}$. For $x^9$: $n = 2$, coefficient $\frac{1}{9}$.` },
        { label: '(b)', prompt: 'The radius of convergence:', kind: 'numeric', answer: '1', solution: String.raw`The geometric series converges for $t^4 < 1$, i.e. $|t| < 1$; integration keeps $R = 1$.` },
        { label: '(c)', prompt: String.raw`$F(0.5)$ to five decimals, using the series.`, kind: 'numeric', answer: 'integral(@(t) 1./(1+t.^4), 0, 0.5)', tol: 1e-5, solution: String.raw`$F(0.5) = 0.5 - \frac{0.5^5}{5} + \frac{0.5^9}{9} - \cdots \approx 0.5 - 0.00625 + 0.000217 = 0.49397$; the next term is $\frac{0.5^{13}}{13} \approx 9.4\cdot10^{-6}$, and indeed $F(0.5) = 0.493958\ldots$` },
        { label: '(d)', prompt: String.raw`How many nonzero terms of the series guarantee an error below $10^{-8}$ at $x = 0.5$ (alternating series bound)?`, kind: 'numeric', answer: '6', tol: 1e-9, solution: String.raw`For $x = 0.5$ the series alternates with decreasing $b_n = \frac{0.5^{4n+1}}{4n+1} \to 0$. Using the terms $n = 0, \dots, m-1$ the error is at most $b_m$: $b_5 = \frac{0.5^{21}}{21} \approx 2.3\cdot10^{-8}$ is too large, $b_6 = \frac{0.5^{25}}{25} \approx 1.2\cdot10^{-9}$ suffices. So $6$ terms.` },
      ],
    },
  ],
};
