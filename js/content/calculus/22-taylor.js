// Module 22: Taylor polynomials and Taylor series — the last module of the course, ending with
// a capstone on sequences, series, power series and Taylor remainders.

export default {
  id: 'taylor',
  number: 22,
  part: 'series',
  hw: 'HW6',
  title: 'Taylor polynomials and Taylor series',
  summary: 'Taylor polynomials P_n, the standard Maclaurin series (e^x, sin, cos, ln(1+x), arctan, binomial), the Lagrange remainder |R_n(x)| ≤ M|x − a|^(n+1)/(n+1)! with M bounding the (n+1)-th derivative between a and x, the alternating-series bound as an alternative, and series for integrals such as erf. Ends with a capstone covering the whole series part.',
  intro: String.raw`<p>The tangent line is the best degree-1 approximation of a function near a point. Taylor polynomials continue the idea: match the value and the first $n$ derivatives at $x = a$. Their limit, the Taylor series, connects every function of the course to the power series of the previous module — and the remainder estimate tells you, with a proof, how many terms you need.</p>`,
  lessons: [
    {
      id: 'taylor-polynomials',
      title: 'Taylor polynomials',
      blocks: [
        { type: 'text', html: String.raw`<p>Raise the degree $n$: the Taylor polynomials $P_n$ of $e^x$ at $a = 0$ hug the graph on a longer and longer stretch. At $x = 1.5$ (purple line) the readout shows the error shrinking.</p>` },
        { type: 'widget', name: 'taylor', config: {
          title: 'Taylor polynomials of e^x at a = 0',
          f: 'exp(x)', coef: '1./gamma(k + 1)', a: 0, nmax: 12, n: 2, at: 1.5,
          xlim: [-3, 3], ylim: [-1, 12],
        } },
        { type: 'callout', kind: 'def', title: 'Taylor polynomial', html: String.raw`<p>The Taylor polynomial of degree $n$ of $f$ at $x = a$ is</p>$$P_n(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(x-a)^k = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \cdots + \frac{f^{(n)}(a)}{n!}(x-a)^n .$$<p>It is the unique polynomial of degree $\le n$ with $P_n^{(k)}(a) = f^{(k)}(a)$ for $k = 0, \dots, n$. For $a = 0$ it is called a <b>Maclaurin</b> polynomial. Letting $n \to \infty$ gives the <b>Taylor series</b>.</p>` },
        { type: 'steps', title: String.raw`Example: $P_3$ of $f(x) = \sqrt x$ at $a = 4$`, steps: [
          String.raw`We compute the derivatives: $f = x^{1/2}$, $f' = \tfrac12 x^{-1/2}$, $f'' = -\tfrac14 x^{-3/2}$, $f''' = \tfrac38 x^{-5/2}$.`,
          String.raw`We evaluate them at $a = 4$ (note $4^{1/2} = 2$): $f(4) = 2$, $f'(4) = \tfrac14$, $f''(4) = -\tfrac1{32}$, $f'''(4) = \tfrac{3}{256}$.`,
          String.raw`We divide by $k!$: the coefficients are $2$, $\tfrac14$, $-\tfrac{1}{64}$ and $\tfrac{3}{256\cdot 6} = \tfrac{1}{512}$.`,
          String.raw`Hence $P_3(x) = 2 + \dfrac{x-4}{4} - \dfrac{(x-4)^2}{64} + \dfrac{(x-4)^3}{512}$.`,
        ] },
        { type: 'callout', kind: 'exam', html: String.raw`<p>Keep powers of $(x - a)$ — do not expand them. A table with columns $k$, $f^{(k)}(x)$, $f^{(k)}(a)$, $f^{(k)}(a)/k!$ is the clearest way to present the computation.</p>` },
        { type: 'quiz', question: String.raw`If $P_2(x) = 3 - 2(x-1) + 5(x-1)^2$ is the Taylor polynomial of $f$ at $1$, then $f''(1) = $`, choices: [String.raw`$5$`, String.raw`$10$`, String.raw`$5/2$`, String.raw`$-2$`], answer: 1, explain: String.raw`The coefficient of $(x-1)^2$ is $f''(1)/2! = 5$, so $f''(1) = 10$.` },
      ],
    },
    {
      id: 'maclaurin',
      title: 'The standard Maclaurin series',
      blocks: [
        { type: 'text', html: String.raw`<p>The sine series contains only odd powers. Each new term corrects the previous polynomial by a little, and since the radius of convergence is infinite, the polynomials eventually follow the sine for any distance you like.</p>` },
        { type: 'widget', name: 'taylor', config: {
          title: 'sin x = x − x³/3! + x⁵/5! − ⋯',
          f: 'sin(x)', coef: 'sin(k*pi/2)./gamma(k + 1)', a: 0, nmax: 25, n: 3,
          xlim: [-10, 10], ylim: [-3, 3],
        } },
        { type: 'table', head: ['Function', 'Maclaurin series', 'Converges for'], rows: [
          [String.raw`$e^x$`, String.raw`$\sum_{n=0}^{\infty} \dfrac{x^n}{n!} = 1 + x + \dfrac{x^2}{2!} + \cdots$`, String.raw`all $x$`],
          [String.raw`$\sin x$`, String.raw`$\sum_{n=0}^{\infty} \dfrac{(-1)^n x^{2n+1}}{(2n+1)!} = x - \dfrac{x^3}{3!} + \cdots$`, String.raw`all $x$`],
          [String.raw`$\cos x$`, String.raw`$\sum_{n=0}^{\infty} \dfrac{(-1)^n x^{2n}}{(2n)!} = 1 - \dfrac{x^2}{2!} + \cdots$`, String.raw`all $x$`],
          [String.raw`$\ln(1+x)$`, String.raw`$\sum_{n=1}^{\infty} \dfrac{(-1)^{n+1} x^n}{n} = x - \dfrac{x^2}{2} + \cdots$`, String.raw`$-1 < x \le 1$`],
          [String.raw`$\arctan x$`, String.raw`$\sum_{n=0}^{\infty} \dfrac{(-1)^n x^{2n+1}}{2n+1} = x - \dfrac{x^3}{3} + \cdots$`, String.raw`$-1 \le x \le 1$`],
          [String.raw`$(1+x)^k$`, String.raw`$\sum_{n=0}^{\infty} \binom{k}{n} x^n$, $\;\binom{k}{n} = \dfrac{k(k-1)\cdots(k-n+1)}{n!}$`, String.raw`$|x| < 1$`],
        ] },
        { type: 'callout', kind: 'key', title: 'Build new series from old ones', html: String.raw`<p>Substitute ($e^{-x^2}$: replace $x$ by $-x^2$), multiply by powers of $x$, add, differentiate or integrate — never differentiate $e^{-x^2}$ ten times by hand. The Taylor series is unique, so any correct manipulation gives <i>the</i> Taylor series, and $f^{(n)}(a) = n!\,c_n$ can be read off from it.</p>` },
        { type: 'steps', title: String.raw`Example: Maclaurin series of $x\cos(2x)$ and $f^{(7)}(0)$`, steps: [
          String.raw`We substitute $2x$ into the cosine series: $\cos 2x = \sum_{n=0}^\infty \dfrac{(-1)^n 4^n x^{2n}}{(2n)!}$, valid for all $x$.`,
          String.raw`We multiply by $x$: $x\cos 2x = \sum_{n=0}^\infty \dfrac{(-1)^n 4^n x^{2n+1}}{(2n)!} = x - 2x^3 + \dfrac{2}{3}x^5 - \cdots$`,
          String.raw`The coefficient of $x^7$ comes from $n = 3$: $c_7 = \dfrac{-64}{720} = -\dfrac{4}{45}$.`,
          String.raw`Since $c_7 = f^{(7)}(0)/7!$, we get $f^{(7)}(0) = 7!\cdot\left(-\dfrac4{45}\right) = -448$.`,
        ] },
        { type: 'steps', title: String.raw`Example: the binomial series of $\sqrt{1+x}$ up to $x^3$`, steps: [
          String.raw`With $k = \tfrac12$: $\binom{1/2}{1} = \tfrac12$, $\binom{1/2}{2} = \dfrac{\frac12\cdot(-\frac12)}{2} = -\tfrac18$, $\binom{1/2}{3} = \dfrac{\frac12(-\frac12)(-\frac32)}{6} = \tfrac1{16}$.`,
          String.raw`Hence $\sqrt{1+x} = 1 + \dfrac{x}{2} - \dfrac{x^2}{8} + \dfrac{x^3}{16} - \cdots$ for $|x| < 1$.`,
        ] },
        { type: 'quiz', question: String.raw`Use series to find $\displaystyle\lim_{x\to0} \frac{e^{x} - 1 - x}{x^2}$.`, choices: [String.raw`$0$`, String.raw`$\tfrac12$`, String.raw`$1$`, String.raw`$\infty$`], answer: 1, explain: String.raw`$e^x - 1 - x = \frac{x^2}{2} + \frac{x^3}{6} + \cdots$, so the quotient is $\frac12 + \frac{x}{6} + \cdots \to \frac12$.` },
      ],
    },
    {
      id: 'remainder',
      title: 'The Lagrange remainder',
      blocks: [
        { type: 'text', html: String.raw`<p>How good is $P_n(x)$? For $\ln(1+x)$ at $x = 0.5$ the error shrinks by a factor of about $2$ per degree; past the radius ($x > 1$) it grows instead. The remainder theorem turns this picture into a guaranteed bound.</p>` },
        { type: 'widget', name: 'taylor', config: {
          title: 'Taylor polynomials of ln(1 + x) at a = 0; error at x = 0.5',
          f: 'log(1 + x)', coef: '(k > 0).*cos((k-1)*pi)./(k + (k==0))', a: 0, nmax: 20, n: 3, R: 1, Rtex: '1', at: 0.5,
          xlim: [-1, 2.5], ylim: [-3, 2],
        } },
        { type: 'callout', kind: 'thm', title: "Taylor's theorem with the Lagrange remainder", html: String.raw`<p>If $f^{(n+1)}$ exists on an interval containing $a$ and $x$, then $f(x) = P_n(x) + R_n(x)$ with</p>$$R_n(x) = \frac{f^{(n+1)}(\xi)}{(n+1)!}(x - a)^{n+1}$$<p>for some $\xi$ between $a$ and $x$. Consequently, if $|f^{(n+1)}(t)| \le M$ for all $t$ <b>between $a$ and $x$</b>,</p>$$|R_n(x)| \le \frac{M\,|x-a|^{n+1}}{(n+1)!}.$$` },
        { type: 'steps', title: String.raw`Example: approximate $\sqrt{4.2}$ with $P_2$ at $a = 4$ and bound the error`, steps: [
          String.raw`From the first lesson, $P_2(x) = 2 + \dfrac{x-4}{4} - \dfrac{(x-4)^2}{64}$, so $P_2(4.2) = 2 + 0.05 - 0.000625 = 2.049375$.`,
          String.raw`We need $M \ge |f'''(t)| = \dfrac{3}{8}t^{-5/2}$ for $t$ between $4$ and $4.2$. This is decreasing in $t$, so its maximum is at $t = 4$: $M = \dfrac38\cdot\dfrac{1}{32} = \dfrac{3}{256}$.`,
          String.raw`The Lagrange bound gives $|R_2(4.2)| \le \dfrac{3}{256}\cdot\dfrac{0.2^3}{3!} = \dfrac{3}{256}\cdot\dfrac{0.008}{6} \approx 1.56\cdot 10^{-5}$.`,
          String.raw`Moreover $f'''(\xi) > 0$ and $(x - a)^3 > 0$, so $R_2 > 0$: $\;2.049375 < \sqrt{4.2} < 2.049391$. (Indeed $\sqrt{4.2} = 2.0493901\ldots$)`,
        ] },
        { type: 'callout', kind: 'key', title: 'Finding M', html: String.raw`<ul><li>Write down $f^{(n+1)}(t)$ explicitly and find its largest absolute value on the closed interval between $a$ and $x$ — monotonicity is often enough; otherwise check critical points (or <code>fminbnd</code>/a grid in MATLAB as support).</li><li>Any valid upper bound works ($|\sin| \le 1$, $e^{0.5} < 2$), but a cruder $M$ gives a weaker estimate.</li><li>The interval is between $a$ and $x$ — not a symmetric interval around $a$.</li></ul>` },
        { type: 'callout', kind: 'thm', title: 'The alternating-series alternative', html: String.raw`<p>If, at the given $x$, the Taylor series is alternating with terms that decrease in size to $0$ (for example $\sin x$, $\cos x$, $\arctan x$, $\ln(1+x)$ at $0 < x \le 1$, $e^{-x}$ at $x > 0$, $\mathrm{erf}$), then $|R_n| \le$ the size of the first omitted term, and the remainder has the sign of that term. Check the decreasing condition before you use it.</p>` },
        { type: 'quiz', question: String.raw`To bound $|R_3(x)|$ for $f(x) = e^{x}$, $a = 0$, $x = -0.4$, a valid $M$ is`, choices: [String.raw`$e^{-0.4}$`, String.raw`$1$`, String.raw`$e^{0.4}$ but not $1$`, String.raw`$0$`], answer: 1, explain: String.raw`$|f^{(4)}(t)| = e^t$ for $t \in [-0.4, 0]$ is at most $e^0 = 1$. $e^{-0.4}$ is the minimum, not the maximum. ($e^{0.4}$ would also be valid, just cruder.)` },
      ],
    },
    {
      id: 'erf-integrals',
      title: 'Series for integrals: the error function',
      blocks: [
        { type: 'text', html: String.raw`<p>$e^{-t^2}$ has no elementary antiderivative, but its series can be integrated term by term. The result defines the <b>error function</b>, used for the normal distribution and heat conduction:</p>$$\mathrm{erf}(x) = \frac{2}{\sqrt\pi}\int_0^x e^{-t^2}\,\mathrm d t = \frac{2}{\sqrt\pi}\sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{n!\,(2n+1)} .$$` },
        { type: 'widget', name: 'taylor', config: {
          title: 'Partial sums of the erf series',
          f: 'erf(x)', coef: 'mod(k,2).*2/sqrt(pi).*cos((k-1)*pi/2)./(gamma((k+1)/2).*(k + (k==0)))', a: 0, nmax: 25, n: 5, at: 1,
          xlim: [-3.5, 3.5], ylim: [-1.6, 1.6],
        } },
        { type: 'steps', title: String.raw`Example: $\mathrm{erf}(0.5)$ from three terms, with an error bound`, steps: [
          String.raw`We substitute $-t^2$ into the exponential series: $e^{-t^2} = \sum_{n=0}^\infty \dfrac{(-1)^n t^{2n}}{n!}$, valid for all $t$ (radius $\infty$).`,
          String.raw`We integrate term by term from $0$ to $x$ and multiply by $\frac{2}{\sqrt\pi}$, which gives the series above; integration keeps the radius $R = \infty$.`,
          String.raw`At $x = 0.5$ the first three terms give $\mathrm{erf}(0.5) \approx \dfrac{2}{\sqrt\pi}\left(0.5 - \dfrac{0.5^3}{3} + \dfrac{0.5^5}{10}\right) \approx 0.520700$.`,
          String.raw`For $x = 0.5$ the series alternates and $b_n = \frac{2}{\sqrt\pi}\frac{0.5^{2n+1}}{n!(2n+1)}$ is decreasing ($b_{n+1}/b_n = \frac{0.25(2n+1)}{(n+1)(2n+3)} < 1$) with limit $0$. So the error is at most the first omitted term: $\dfrac{2}{\sqrt\pi}\cdot\dfrac{0.5^7}{3!\cdot 7} \approx 2.1\cdot 10^{-4}$, and it is negative.`,
          String.raw`Hence $0.520490 < \mathrm{erf}(0.5) < 0.520700$. (MATLAB: <code>erf(0.5)</code> $= 0.520500$.)`,
        ] },
        { type: 'quiz', question: String.raw`The Maclaurin series of $\displaystyle\int_0^x \sin(t^2)\,\mathrm d t$ starts with`, choices: [String.raw`$\dfrac{x^3}{3} - \dfrac{x^7}{42} + \cdots$`, String.raw`$x^2 - \dfrac{x^6}{6} + \cdots$`, String.raw`$\dfrac{x^3}{3} - \dfrac{x^5}{30} + \cdots$`, String.raw`$x - \dfrac{x^3}{3!} + \cdots$`], answer: 0, explain: String.raw`$\sin t^2 = t^2 - \frac{t^6}{3!} + \cdots$; integrating gives $\frac{x^3}{3} - \frac{x^7}{7\cdot 6} + \cdots$.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'taylor-numerics',
      title: 'Taylor polynomials in MATLAB',
      blocks: [
        { type: 'text', html: String.raw`<p>Two ways to evaluate $P_n$: an <b>explicit sum</b> over $k$ with <code>factorial</code>, or <code>polyval</code>. <code>polyval(p, t)</code> wants the coefficients in <b>descending</b> order, so flip the Taylor coefficients with <code>fliplr</code> and evaluate at $t = x - a$.</p>` },
        { type: 'code', caption: 'P_3 of sqrt(x) at a = 4: coefficients, polyval, and the error f − P_3.', editable: true, code: String.raw`a = 4;
c = [2, 1/4, -1/64, 1/512];        % c_0 ... c_3
f = @(x) sqrt(x);
P3 = @(x) polyval(fliplr(c), x - a);
x = linspace(0.5, 9, 400);
plot(x, f(x) - P3(x))
grid on
title('f(x) - P_3(x)')
fprintf('P3(4.2) = %.8f, sqrt(4.2) = %.8f\n', P3(4.2), sqrt(4.2))` },
        { type: 'code', caption: 'Maclaurin polynomials of e^x as explicit sums: the error at x = 1 against the bound 3/(n+1)!.', editable: true, code: String.raw`x = 1;
for n = 2:2:10
    k = 0:n;
    Pn = sum(x.^k ./ factorial(k));
    fprintf('n = %2d: error %.3e, bound %.3e\n', n, exp(x) - Pn, 3/factorial(n+1))
end` },
        { type: 'text', html: String.raw`<p>To <b>support</b> a hand-derived bound $M$ for $|f^{(n+1)}|$, evaluate the derivative on a fine grid between $a$ and $x$ and take <code>max(abs(...))</code>, or maximise with <code>fminbnd</code> applied to $-|f^{(n+1)}|$. The derivative itself must be computed by hand (no <code>syms</code>).</p>` },
        { type: 'code', editable: true, code: String.raw`% f(x) = ln x, a = 1, x = 1.3, n = 3: we need |f''''(t)| = 6/t^4 on [1, 1.3]
f4 = @(t) -6 ./ t.^4;
t = linspace(1, 1.3, 1001);
M = max(abs(f4(t)))
[tmax, negM] = fminbnd(@(t) -abs(f4(t)), 1, 1.3)` },
        { type: 'matlab', prompt: String.raw`Compute $P_6(0.5)$ for $\cos x$ at $a = 0$, i.e. $\sum_{k=0}^{3} \frac{(-1)^k\,0.5^{2k}}{(2k)!}$, with <code>factorial</code>, and store it in <code>P</code>. Also store the error <code>err = cos(0.5) - P</code>.`, starter: `k = 0:3;\nP = 0;     % replace by the sum\nerr = 0;   % replace`, solution: `k = 0:3;\nP = sum((-1).^k .* 0.5.^(2*k) ./ factorial(2*k));\nerr = cos(0.5) - P;`, checks: [{ var: 'P', value: '1 - 0.5^2/2 + 0.5^4/24 - 0.5^6/720', tol: 1e-12 }, { var: 'err', value: 'cos(0.5) - (1 - 0.5^2/2 + 0.5^4/24 - 0.5^6/720)', tol: 1e-12 }, { uses: 'factorial' }] },
        { type: 'matlab', prompt: String.raw`For $f(x) = e^{-x^2}$ one finds $f'''(x) = (12x - 8x^3)e^{-x^2}$. Estimate $M = \max_{0 \le x \le 1} |f'''(x)|$ on a grid of 10001 points and store it in <code>M</code>.`, starter: `f3 = @(x) (12*x - 8*x.^3) .* exp(-x.^2);\nx = linspace(0, 1, 10001);\nM = 0;   % replace`, solution: `f3 = @(x) (12*x - 8*x.^3) .* exp(-x.^2);\nx = linspace(0, 1, 10001);\nM = max(abs(f3(x)));`, checks: [{ var: 'M', value: 3.9035661, tol: 1e-5 }, { uses: 'max' }] },
        { type: 'matlab', prompt: String.raw`Evaluate the first six terms ($n = 0, \dots, 5$) of the erf series at $x = 0.8$, store the result in <code>S</code>, and compare with MATLAB's <code>erf(0.8)</code> in <code>err = abs(erf(0.8) - S)</code>.`, starter: `x = 0.8;\nn = 0:5;\nS = 0;     % replace by 2/sqrt(pi) times the sum\nerr = 0;   % replace`, solution: `x = 0.8;\nn = 0:5;\nS = 2/sqrt(pi) * sum((-1).^n .* x.^(2*n+1) ./ (factorial(n) .* (2*n+1)));\nerr = abs(erf(0.8) - S);`, checks: [{ var: 'S', value: 'erf(0.8)', tol: 1e-5 }, { var: 'err', value: 0, tol: 1e-5 }] },
      ],
    },
    {
      id: 'remainder-writeup',
      title: 'Writing up a remainder estimate',
      blocks: [
        { type: 'text', html: String.raw`<p>A remainder estimate in a homework answer states the theorem, names the interval for $\xi$, derives $M$ with a reason (monotonicity or a bound on each factor), and only then substitutes numbers. A numerical comparison with the true error closes the answer.</p>` },
        { type: 'livescript', caption: 'Model answer: ln(1.3) with P_3 of ln x at a = 1', blocks: [
          { type: 'heading', content: 'Problem (Attempted)' },
          { type: 'text', content: String.raw`We approximate $\ln 1.3$ with the Taylor polynomial $P_3$ of $f(x) = \ln x$ at $a = 1$. The derivatives are $f'(x) = x^{-1}$, $f''(x) = -x^{-2}$, $f'''(x) = 2x^{-3}$ and $f^{(4)}(x) = -6x^{-4}$, so at $a = 1$:` },
          { type: 'equation', content: String.raw`P_3(x) = (x-1) - \frac{(x-1)^2}{2} + \frac{(x-1)^3}{3}, \qquad P_3(1.3) = 0.3 - 0.045 + 0.009 = 0.264 .` },
          { type: 'text', content: String.raw`By Taylor's theorem $R_3(1.3) = \frac{f^{(4)}(\xi)}{4!}(0.3)^4$ for some $\xi \in (1, 1.3)$. Since $|f^{(4)}(t)| = 6/t^4$ is decreasing, its maximum on $[1, 1.3]$ is $M = 6$ at $t = 1$. Hence` },
          { type: 'equation', content: String.raw`|R_3(1.3)| \le \frac{6\cdot 0.3^4}{4!} = 0.002025 .` },
          { type: 'text', content: String.raw`Since $f^{(4)}(\xi) < 0$, the remainder is negative, so $0.261975 \le \ln 1.3 < 0.264$. We compare with MATLAB:` },
          { type: 'code', content: String.raw`P3 = 0.3 - 0.3^2/2 + 0.3^3/3;
fprintf('P3 = %.6f, ln(1.3) = %.6f, error = %.6f, bound = %.6f\n', P3, log(1.3), log(1.3) - P3, 6*0.3^4/24)` },
        ] },
        { type: 'latex', prompt: 'Type the Lagrange remainder bound:', target: String.raw`|R_n(x)| \le \frac{M |x-a|^{n+1}}{(n+1)!}` },
        { type: 'latex', prompt: 'Type the series of the error function:', target: String.raw`\mathrm{erf}(x) = \frac{2}{\sqrt{\pi}} \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{n!\,(2n+1)}` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Taylor polynomials of sec x and a remainder estimate',
      difficulty: 'challenge',
      hw: 'HW6-style',
      statement: String.raw`<p>Let $f(x) = \sec x = \dfrac{1}{\cos x}$ and $a = \dfrac{\pi}{3}$. You may use $f' = \sec x\tan x$, $f'' = 2\sec^3 x - \sec x$ and $f''' = \sec x\tan x\,(6\sec^2 x - 1)$. Enter polynomials in MATLAB syntax in powers of <code>(x-pi/3)</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$P_1(x)$`, kind: 'expression', variable: 'x', answer: '2 + 2*sqrt(3)*(x-pi/3)', domain: [0.9, 1.2], solution: String.raw`$\sec\frac\pi3 = 2$, $\tan\frac\pi3 = \sqrt3$: $f(a) = 2$, $f'(a) = 2\sqrt3$. $P_1(x) = 2 + 2\sqrt3\,(x - \frac\pi3)$.` },
        { label: '(b)', prompt: String.raw`$P_2(x)$`, kind: 'expression', variable: 'x', answer: '2 + 2*sqrt(3)*(x-pi/3) + 7*(x-pi/3).^2', domain: [0.9, 1.2], solution: String.raw`$f''(a) = 2\cdot 8 - 2 = 14$, coefficient $14/2! = 7$.` },
        { label: '(c)', prompt: String.raw`$P_3(x)$`, kind: 'expression', variable: 'x', answer: '2 + 2*sqrt(3)*(x-pi/3) + 7*(x-pi/3).^2 + 23*sqrt(3)/3*(x-pi/3).^3', domain: [0.9, 1.2], solution: String.raw`$f'''(a) = 2\sqrt3\,(6\cdot4 - 1) = 46\sqrt3$, coefficient $\frac{46\sqrt3}{6} = \frac{23\sqrt3}{3}$.` },
        { label: '(d)', prompt: String.raw`$P_2\!\left(\frac\pi3 - 0.1\right)$`, kind: 'numeric', answer: '2 - 0.2*sqrt(3) + 0.07', tol: 1e-6, solution: String.raw`$2 + 2\sqrt3(-0.1) + 7(0.01) = 2.07 - 0.2\sqrt3 \approx 1.723590$.` },
        { label: '(e)', prompt: String.raw`The Lagrange bound for $\left|R_2\!\left(\frac\pi3 - 0.1\right)\right|$, with $M$ the maximum of $|f'''|$ on $\left[\frac\pi3 - 0.1, \frac\pi3\right]$.`, kind: 'numeric', answer: '46*sqrt(3)*0.1^3/6', tol: 1e-4, solution: String.raw`On $(0, \frac\pi2)$, $\sec$, $\tan$ and $6\sec^2 - 1$ are positive and increasing, so $f'''$ is increasing and $M = f'''(\frac\pi3) = 46\sqrt3 \approx 79.67$. Bound: $\frac{46\sqrt3\cdot 0.1^3}{3!} \approx 0.01328$.` },
        { label: '(f)', prompt: String.raw`Write the full solution as a Live Script: derivative table, $P_1$–$P_3$, the remainder estimate with a justified $M$, and a MATLAB comparison with the true error.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 1 (Attempted)' },
        { type: 'text', content: String.raw`We compute the derivatives of $f(x) = \sec x$ and evaluate them at $a = \frac\pi3$, where $\sec a = 2$ and $\tan a = \sqrt3$:` },
        { type: 'equation', content: String.raw`f(a) = 2,\quad f'(a) = \sec a\tan a = 2\sqrt3,\quad f''(a) = 2\sec^3 a - \sec a = 14,\quad f'''(a) = \sec a\tan a\,(6\sec^2 a - 1) = 46\sqrt3 .` },
        { type: 'text', content: 'Dividing by $k!$ gives the Taylor polynomials:' },
        { type: 'equation', content: String.raw`P_1(x) = 2 + 2\sqrt3\left(x - \tfrac\pi3\right), \quad P_2(x) = P_1(x) + 7\left(x - \tfrac\pi3\right)^2, \quad P_3(x) = P_2(x) + \frac{23\sqrt3}{3}\left(x - \tfrac\pi3\right)^3 .` },
        { type: 'text', content: String.raw`At $x = \frac\pi3 - 0.1$ we get $P_2(x) = 2 - 0.2\sqrt3 + 0.07 \approx 1.723590$. By Taylor's theorem $R_2(x) = \frac{f'''(\xi)}{3!}(-0.1)^3$ for some $\xi \in \left(\frac\pi3 - 0.1, \frac\pi3\right)$. On $(0, \frac\pi2)$ the functions $\sec t$, $\tan t$ and $6\sec^2 t - 1$ are positive and increasing, so $f'''$ is increasing there and its maximum on the interval is $M = f'''(\frac\pi3) = 46\sqrt3$. Hence` },
        { type: 'equation', content: String.raw`\left|R_2\left(\tfrac\pi3 - 0.1\right)\right| \le \frac{46\sqrt3\cdot 0.1^3}{3!} \approx 0.01328 .` },
        { type: 'text', content: 'Since $f\'\'\'(\\xi) > 0$ and $(-0.1)^3 < 0$, the remainder is negative: $P_2$ overestimates. We compare with the true values:' },
        { type: 'code', content: String.raw`a = pi/3;  x = a - 0.1;  h = x - a;
P2 = 2 + 2*sqrt(3)*h + 7*h^2;
P3 = P2 + 23*sqrt(3)/3*h^3;
f3 = @(t) sec(t).*tan(t).*(6*sec(t).^2 - 1);
M = max(f3(linspace(x, a, 1001)));
fprintf('sec(x) = %.6f, P2 = %.6f, R2 = %.6f, bound = %.6f\n', sec(x), P2, sec(x) - P2, M*0.1^3/6)
fprintf('P3 = %.6f, R3 = %.6f\n', P3, sec(x) - P3)` },
      ],
    },
    {
      id: 'a2',
      title: 'Working with Maclaurin series',
      difficulty: 'core',
      statement: String.raw`<p>Use the standard series; do not differentiate repeatedly.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`The coefficient of $x^6$ in the Maclaurin series of $x^2 e^{-2x^2}$.`, kind: 'numeric', answer: '2', solution: String.raw`$x^2e^{-2x^2} = \sum \frac{(-2)^n x^{2n+2}}{n!}$; $x^6$: $n = 2$, $\frac{4}{2} = 2$.` },
        { label: '(b)', prompt: String.raw`The coefficient of $x^5$ in the series of $\sin(3x)$.`, kind: 'numeric', answer: '81/40', solution: String.raw`$\frac{3^5}{5!} = \frac{243}{120} = \frac{81}{40}$.` },
        { label: '(c)', prompt: String.raw`The coefficient of $x^2$ in the binomial series of $\sqrt[3]{1+x}$.`, kind: 'numeric', answer: '-1/9', solution: String.raw`$\binom{1/3}{2} = \frac{\frac13\cdot(-\frac23)}{2} = -\frac19$.` },
        { label: '(d)', prompt: String.raw`$f^{(10)}(0)$ for $f(x) = x^2\cos x$.`, kind: 'numeric', answer: '90', solution: String.raw`$x^2\cos x = \sum \frac{(-1)^n x^{2n+2}}{(2n)!}$; $x^{10}$: $n = 4$, $c_{10} = \frac{1}{8!}$. So $f^{(10)}(0) = \frac{10!}{8!} = 90$.` },
        { label: '(e)', prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\sin x - x}{x^3}$`, kind: 'numeric', answer: '-1/6', solution: String.raw`$\sin x - x = -\frac{x^3}{6} + \frac{x^5}{120} - \cdots$, so the quotient tends to $-\frac16$.` },
      ],
    },
    {
      id: 'a3',
      title: 'How accurate is P_n?',
      difficulty: 'core',
      statement: String.raw`<p>Remainder estimates for Maclaurin polynomials.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Lagrange bound for $|R_4(0.5)|$ when $f(x) = e^x$, using $M = e^{0.5}$.`, kind: 'numeric', answer: 'exp(0.5)*0.5^5/120', tol: 1e-6, solution: String.raw`$f^{(5)}(t) = e^t \le e^{0.5}$ on $[0, 0.5]$: $|R_4| \le \frac{e^{0.5}\,0.5^5}{5!} \approx 4.29\cdot10^{-4}$.` },
        { label: '(b)', prompt: String.raw`Using $M = 3$ (since $e^t < 3$ on $[0, 1]$), the smallest $n$ for which the Lagrange bound guarantees $|e - P_n(1)| < 10^{-6}$.`, kind: 'numeric', answer: '9', tol: 1e-9, solution: String.raw`Need $\frac{3}{(n+1)!} < 10^{-6}$, i.e. $(n+1)! > 3\cdot10^6$. $9! = 362880$ is too small, $10! = 3628800$ works: $n + 1 = 10$, $n = 9$.` },
        { label: '(c)', prompt: String.raw`$\cos(0.2) \approx 1 - \frac{0.2^2}{2} = 0.98$. Since $P_2 = P_3$ for cosine, the error is $|R_3(0.2)|$. Give the Lagrange bound with $M = 1$.`, kind: 'numeric', answer: '0.2^4/24', tol: 1e-7, solution: String.raw`$|f^{(4)}| = |\cos t| \le 1$: $|R_3(0.2)| \le \frac{0.2^4}{4!} \approx 6.67\cdot10^{-5}$ — the same as the first omitted term of the alternating series.` },
        { label: '(d)', prompt: String.raw`$\arctan(0.2) \approx 0.2 - \frac{0.2^3}{3}$. Which statement is justified?`, kind: 'choice', choices: [String.raw`The error is at most $\frac{0.2^5}{5}$ and the approximation is too small.`, String.raw`The error is at most $\frac{0.2^5}{5}$ and the approximation is too large.`, String.raw`The error is at most $\frac{0.2^3}{3}$; its sign is unknown.`, String.raw`No bound is possible since $\arctan$ has radius $1$.`], answer: 0, solution: String.raw`At $x = 0.2$ the series alternates with $b_n = \frac{0.2^{2n+1}}{2n+1}$ decreasing to $0$. The first omitted term $+\frac{0.2^5}{5}$ is positive, so the remainder is positive: the approximation is too small by at most $6.4\cdot10^{-5}$.` },
      ],
    },
    {
      id: 'a4',
      title: 'Capstone I — sequences and series',
      difficulty: 'exam',
      statement: String.raw`<p>Exam-style review of the series part. Verify the pre-conditions of every test you use.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{n\to\infty}\left(\frac{3n-1}{3n+2}\right)^n$`, kind: 'numeric', answer: 'exp(-1)', tol: 1e-6, solution: String.raw`$\ln a_n = n\ln\left(1 - \frac{3}{3n+2}\right)$; with L'Hôpital on $\frac{\ln(3x-1) - \ln(3x+2)}{1/x}$: $\frac{\frac{3}{3x-1} - \frac{3}{3x+2}}{-1/x^2} = \frac{-9x^2}{(3x-1)(3x+2)} \to -1$. Limit $e^{-1}$.` },
        { label: '(b)', prompt: String.raw`$a_1 = 2$, $a_{n+1} = 4 - \dfrac{3}{a_n}$. Find $\lim a_n$.`, kind: 'numeric', answer: '3', solution: String.raw`By induction $2 \le a_n < 3$: if so, $4 - \frac3{a_n} \in [2.5, 3)$. Also $a_{n+1} - a_n = \frac{-(a_n - 1)(a_n - 3)}{a_n} > 0$. Increasing and bounded: converges, and $L = 4 - 3/L$ gives $L \in \{1, 3\}$; $L \ge 2$ so $L = 3$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{2^n + 3^n}{6^n}$`, kind: 'numeric', answer: '3/2', solution: String.raw`$\sum (\frac13)^n + \sum (\frac12)^n = \frac{1/3}{2/3} + \frac{1/2}{1/2} = \frac12 + 1 = \frac32$ (both geometric with $|r| < 1$).` },
        { label: '(d)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{1}{4n^2 - 1}$`, kind: 'numeric', answer: '1/2', solution: String.raw`$\frac{1}{(2n-1)(2n+1)} = \frac12\left(\frac{1}{2n-1} - \frac{1}{2n+1}\right)$; telescoping $S_N = \frac12\left(1 - \frac{1}{2N+1}\right) \to \frac12$.` },
        { label: '(e)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty (-1)^n\frac{(n!)^2}{(2n)!}$ is`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 0, solution: String.raw`Ratio test: $\frac{(n+1)^2}{(2n+2)(2n+1)} \to \frac14 < 1$.` },
        { label: '(f)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \left(\frac{n+1}{n}\right)^{n^2}$ is`, kind: 'choice', choices: ['convergent by the root test', 'divergent by the root test', 'the root test is inconclusive', 'convergent by comparison with a geometric series'], answer: 1, solution: String.raw`$\sqrt[n]{a_n} = \left(1 + \frac1n\right)^n \to e > 1$.` },
      ],
    },
    {
      id: 'a5',
      title: 'Capstone II — power series and Taylor remainders',
      difficulty: 'exam',
      hw: 'HW6-style',
      statement: String.raw`<p>(i) Consider $\displaystyle\sum_{n=1}^\infty \frac{(x-1)^n}{n\,4^n}$. (ii) Let $\displaystyle F(x) = \int_0^x \cos(t^2)\,\mathrm d t$.</p>`,
      parts: [
        { label: '(a)', prompt: '(i) The interval of convergence:', kind: 'choice', choices: [String.raw`$(-3, 5)$`, String.raw`$[-3, 5)$`, String.raw`$(-3, 5]$`, String.raw`$[-3, 5]$`], answer: 1, solution: String.raw`Ratio test: $|x - 1| < 4$. At $x = 5$: harmonic series, divergent. At $x = -3$: $\sum\frac{(-1)^n}{n}$, convergent by the alternating series test.` },
        { label: '(b)', prompt: String.raw`(ii) The coefficient of $x^9$ in the Maclaurin series of $F$.`, kind: 'numeric', answer: '1/216', tol: 1e-9, solution: String.raw`$\cos t^2 = \sum \frac{(-1)^n t^{4n}}{(2n)!}$, so $F(x) = \sum \frac{(-1)^n x^{4n+1}}{(2n)!\,(4n+1)}$. $x^9$: $n = 2$, $\frac{1}{24\cdot 9} = \frac{1}{216}$.` },
        { label: '(c)', prompt: '(ii) The radius of convergence of the series of $F$:', kind: 'choice', choices: [String.raw`$1$`, String.raw`$\sqrt[4]{2}$`, String.raw`$\pi$`, String.raw`$\infty$`], answer: 3, solution: String.raw`The cosine series converges for all arguments, and integration keeps $R = \infty$.` },
        { label: '(d)', prompt: String.raw`(ii) The partial sum of the first three nonzero terms at $x = 1$.`, kind: 'numeric', answer: '1 - 1/10 + 1/216', tol: 1e-7, solution: String.raw`$1 - \frac{1}{2!\cdot5} + \frac{1}{4!\cdot9} = 1 - 0.1 + 0.0046296 = 0.9046296$.` },
        { label: '(e)', prompt: String.raw`(ii) The alternating-series bound for the error of (d).`, kind: 'numeric', answer: '1/9360', tol: 1e-8, solution: String.raw`First omitted term: $\frac{1}{6!\cdot 13} = \frac{1}{9360} \approx 1.068\cdot10^{-4}$.` },
        { label: '(f)', prompt: String.raw`(ii) The lower endpoint of the resulting interval for $F(1)$.`, kind: 'numeric', answer: '1 - 1/10 + 1/216 - 1/9360', tol: 1e-7, solution: String.raw`The first omitted term is negative, so $F(1) \in \left[S_3 - \frac1{9360},\ S_3\right] = [0.9045228,\ 0.9046296]$.` },
        { label: '(g)', prompt: String.raw`Write (ii) as a Live Script: derive the series, its radius, $S_3$ at $x = 1$, verify the conditions of the alternating series test, give the interval for $F(1)$ and check it with <code>integral</code>.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: String.raw`We substitute $t^2$ into the Maclaurin series of the cosine, which converges for every real argument:` },
        { type: 'equation', content: String.raw`\cos(t^2) = \sum_{n=0}^{\infty} \frac{(-1)^n t^{4n}}{(2n)!}, \qquad t \in \mathbb R .` },
        { type: 'text', content: 'Integrating term by term from $0$ to $x$ (allowed inside the interval of convergence, which is all of $\\mathbb R$) gives' },
        { type: 'equation', content: String.raw`F(x) = \sum_{n=0}^{\infty} \frac{(-1)^n x^{4n+1}}{(2n)!\,(4n+1)} = x - \frac{x^5}{10} + \frac{x^9}{216} - \frac{x^{13}}{9360} + \cdots,` },
        { type: 'text', content: String.raw`with radius of convergence $R = \infty$ (integration does not change the radius). At $x = 1$ the series is $\sum (-1)^n b_n$ with $b_n = \frac{1}{(2n)!\,(4n+1)}$. We check the alternating series test: $b_n > 0$; $b_{n+1} < b_n$ because both $(2n)!$ and $4n+1$ increase with $n$; and $b_n \to 0$. Therefore $|R| \le b_3$ for the partial sum of the first three terms:` },
        { type: 'equation', content: String.raw`S_3 = 1 - \frac{1}{10} + \frac{1}{216} \approx 0.9046296, \qquad |F(1) - S_3| \le \frac{1}{6!\cdot 13} = \frac{1}{9360} \approx 1.07\cdot 10^{-4}.` },
        { type: 'text', content: String.raw`The first omitted term $-b_3$ is negative, so the remainder is negative and $0.9045228 \le F(1) < 0.9046296$. We verify with numerical integration:` },
        { type: 'code', content: String.raw`S3 = 1 - 1/10 + 1/216;
b3 = 1/(factorial(6)*13);
F1 = integral(@(t) cos(t.^2), 0, 1);
fprintf('[%.7f, %.7f], integral = %.7f\n', S3 - b3, S3, F1)` },
      ],
    },
  ],
};
