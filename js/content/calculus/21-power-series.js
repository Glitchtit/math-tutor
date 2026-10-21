// Module 21: Power series — radius and interval of convergence, representations of functions,
// term-by-term differentiation and integration.
// Written to the hand-holding standard (see CONTENT.md): every assignment type is first worked
// step by step, then practised in a guided exercise with new numbers.

export default {
  id: 'power-series',
  number: 21,
  part: 'series',
  hw: 'HW6',
  title: 'Power series',
  summary: 'Power series Σ c_n (x − a)^n: radius of convergence from the ratio test (powers and factorials), separate endpoint checks, inside terms like (2x − 1), substitutions such as u = (3 − 2x)^3, representations built from the geometric series, term-by-term differentiation and integration (arctan, ln(1 + x), Σ n xⁿ), and series for functions defined by integrals.',
  intro: String.raw`<p>A power series is a "polynomial of infinite degree" in $x$. Where it converges it defines a function, and inside its interval of convergence that function can be differentiated and integrated term by term. This is how calculators evaluate $\ln$, $\arctan$ or $\mathrm{erf}$, and how integrals without elementary antiderivatives are computed.</p><p>Everything here uses the ratio test from the previous module. Each lesson adds one new idea, worked in full and then practised step by step.</p>`,
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
        { type: 'callout', kind: 'def', title: 'Power series', html: String.raw`<p>A power series centred at $a$ is</p>$$\sum_{n=0}^{\infty} c_n (x-a)^n = c_0 + c_1(x-a) + c_2(x-a)^2 + \cdots$$<p>The numbers $c_n$ are the <b>coefficients</b> and $a$ is the <b>centre</b>. For each fixed $x$ it is an ordinary series of numbers; the question is <b>for which $x$</b> it converges.</p>` },
        { type: 'callout', kind: 'thm', title: 'Radius of convergence', html: String.raw`<p>For every power series exactly one of the following holds: it converges only at $x = a$ ($R = 0$); it converges absolutely for all $x$ ($R = \infty$); or there is $R > 0$ such that it converges absolutely for $|x - a| < R$ and diverges for $|x - a| > R$. At the <b>endpoints</b> $x = a \pm R$ anything can happen: they must be checked separately with the tests for series of numbers.</p><p><b>How to find $R$:</b> treat $x$ as a fixed number, apply the ratio test to the terms $a_n = c_n(x-a)^n$, and ask for which $x$ the limit is $< 1$.</p>` },
        { type: 'steps', title: String.raw`Example: the radius of convergence of $\displaystyle\sum_{n=1}^{\infty} \frac{n^2\,x^n}{3^n}$`, steps: [
          { do: String.raw`$a_n = \dfrac{n^2\,x^n}{3^n}$, with $x$ a fixed number`, why: 'For a fixed $x$ this is a series of numbers, so the ratio test applies.' },
          { do: String.raw`$|a_{n+1}| = \dfrac{(n+1)^2\,|x|^{n+1}}{3^{n+1}}$`, why: String.raw`Replace every $n$ by $n+1$ (absolute values, because $x$ may be negative).` },
          { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{(n+1)^2}{n^2}\cdot\dfrac{|x|^{n+1}}{|x|^n}\cdot\dfrac{3^n}{3^{n+1}}$`, why: 'Multiply by the reciprocal of $|a_n|$ and group factors of the same kind.' },
          { do: String.raw`$= \left(1 + \dfrac1n\right)^2\cdot|x|\cdot\dfrac13$`, why: String.raw`Simplify each factor: $\frac{n+1}{n} = 1 + \frac1n$, $\frac{|x|^{n+1}}{|x|^n} = |x|$, $\frac{3^n}{3^{n+1}} = \frac13$.` },
          { do: String.raw`$\to \dfrac{|x|}{3}$`, why: String.raw`$\frac1n \to 0$. Note that $x$ is a constant here — only $n$ goes to infinity.` },
          { do: String.raw`$\dfrac{|x|}{3} < 1 \iff |x| < 3$`, why: 'The ratio test gives absolute convergence when the limit is below 1. Multiply both sides by 3.' },
          { do: String.raw`$R = 3$`, why: String.raw`Converges for $|x| < 3$, diverges for $|x| > 3$ (limit $> 1$). The centre is $a = 0$.` },
        ] },
        { type: 'guided', title: String.raw`Radius of $\displaystyle\sum_{n=0}^{\infty} \frac{(n+1)\,x^n}{2^n}$`, problem: String.raw`Find the radius of convergence of $\sum_{n=0}^{\infty} \frac{(n+1)\,x^n}{2^n}$ with the ratio test.`, steps: [
          { prompt: String.raw`Grouped ratio: $\left|\frac{a_{n+1}}{a_n}\right| = \frac{n+2}{n+1}\cdot\frac{|x|^{n+1}}{|x|^n}\cdot\frac{2^n}{2^{n+1}}$. What is the limit of $\frac{n+2}{n+1}$?`, ask: { kind: 'numeric', answer: '1' }, hint: String.raw`Divide numerator and denominator by $n$.`, reveal: String.raw`$\frac{1 + 2/n}{1 + 1/n} \to 1$.` },
          { prompt: String.raw`So the ratio tends to $\frac{|x|}{c}$. What is $c$?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`$\frac{|x|^{n+1}}{|x|^n} = |x|$ and $\frac{2^n}{2^{n+1}} = \frac12$.`, reveal: String.raw`The limit is $\frac{|x|}{2}$.` },
          { prompt: String.raw`$R = \;?$`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`Solve $\frac{|x|}{2} < 1$.`, reveal: String.raw`$\frac{|x|}{2} < 1 \iff |x| < 2$, so $R = 2$.` },
        ] },
        { type: 'quiz', question: String.raw`If $\left|\frac{a_{n+1}}{a_n}\right| \to \frac{|x|}{5}$, the radius of convergence is`, choices: [String.raw`$\frac15$`, String.raw`$1$`, String.raw`$5$`, String.raw`$\infty$`], answer: 2, explain: String.raw`$\frac{|x|}{5} < 1 \iff |x| < 5$.` },
      ],
    },
    {
      id: 'radius-factorials',
      title: 'Radius of convergence with factorials: R = ∞, R = 0 and in between',
      blocks: [
        { type: 'text', html: String.raw`<p>With factorials in the coefficients, the ratio limit can be $0$ for every $x$ (then $R = \infty$), or $\infty$ for every $x \ne 0$ (then $R = 0$).</p>` },
        { type: 'refresher', title: 'factorial ratios', html: String.raw`<ul><li>$\dfrac{(n+1)!}{n!} = n + 1$ and $\dfrac{n!}{(n+1)!} = \dfrac{1}{n+1}$.</li><li>$\dfrac{(2n+2)!}{(2n)!} = (2n+2)(2n+1)$ and $\dfrac{(n!)^2}{((n+1)!)^2} = \dfrac{1}{(n+1)^2}$.</li><li>If a limit is $c\cdot|x|$ with $c$ a number, then $c|x| < 1 \iff |x| < \frac1c$, so $R = \frac1c$.</li></ul>` },
        { type: 'steps', title: String.raw`Example 1: $\displaystyle\sum_{n=0}^{\infty} \frac{x^n}{n!}$`, steps: [
          { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{|x|^{n+1}}{|x|^n}\cdot\dfrac{n!}{(n+1)!}$`, why: 'Ratio of consecutive terms, grouped.' },
          { do: String.raw`$= |x|\cdot\dfrac{1}{n+1}$`, why: 'Simplify each factor (refresher).' },
          { do: String.raw`$\to 0$ for every $x$`, why: String.raw`For a fixed $x$, $\frac{|x|}{n+1} \to 0$ as $n \to \infty$.` },
          { do: String.raw`$0 < 1$ for all $x$: $R = \infty$`, why: 'The series converges absolutely for every $x$. (Its sum is $e^x$.)' },
        ] },
        { type: 'steps', title: String.raw`Example 2: $\displaystyle\sum_{n=0}^{\infty} \frac{n!\,x^n}{4^n}$`, steps: [
          { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{(n+1)!}{n!}\cdot|x|\cdot\dfrac{4^n}{4^{n+1}}$`, why: 'Ratio of consecutive terms, grouped.' },
          { do: String.raw`$= \dfrac{(n+1)\,|x|}{4}$`, why: String.raw`$\frac{(n+1)!}{n!} = n+1$ and $\frac{4^n}{4^{n+1}} = \frac14$.` },
          { do: String.raw`$\to \infty$ for every $x \ne 0$`, why: String.raw`$|x| > 0$ is fixed and $n + 1$ grows without bound.` },
          { do: String.raw`At $x = 0$ every term after the first is $0$`, why: 'So the series trivially converges there.' },
          { do: String.raw`$R = 0$`, why: 'It converges only at the centre $x = 0$.' },
        ] },
        { type: 'steps', title: String.raw`Example 3: $\displaystyle\sum_{n=0}^{\infty} \frac{(2n)!}{(n!)^2}\,\frac{x^n}{3^n}$`, steps: [
          { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{(2n+2)!}{(2n)!}\cdot\dfrac{(n!)^2}{((n+1)!)^2}\cdot|x|\cdot\dfrac{3^n}{3^{n+1}}$`, why: String.raw`Replace $n$ by $n+1$ (so $2n \to 2n+2$), multiply by the reciprocal, group.` },
          { do: String.raw`$= \dfrac{(2n+2)(2n+1)}{(n+1)^2}\cdot\dfrac{|x|}{3}$`, why: 'Factorial refresher, and $\\frac{3^n}{3^{n+1}} = \\frac13$.' },
          { do: String.raw`$= \dfrac{2(2n+1)}{n+1}\cdot\dfrac{|x|}{3}$`, why: String.raw`$2n + 2 = 2(n+1)$; cancel one $(n+1)$.` },
          { do: String.raw`$\to 4\cdot\dfrac{|x|}{3} = \dfrac{4|x|}{3}$`, why: String.raw`$\frac{2(2 + 1/n)}{1 + 1/n} \to 4$.` },
          { do: String.raw`$\dfrac{4|x|}{3} < 1 \iff |x| < \dfrac34$`, why: String.raw`Multiply both sides by $\frac34$.` },
          { do: String.raw`$R = \tfrac34$`, why: 'Converges for $|x| < \\frac34$, diverges for $|x| > \\frac34$.' },
        ] },
        { type: 'guided', title: String.raw`Radius of $\displaystyle\sum_{n=0}^{\infty} \frac{3^n x^n}{n!}$`, problem: String.raw`Find the radius of convergence of $\sum_{n=0}^{\infty} \frac{3^n x^n}{n!}$.`, steps: [
          { prompt: String.raw`The ratio simplifies to $\frac{c\,|x|}{n+1}$. What is $c$?`, ask: { kind: 'numeric', answer: '3' }, hint: String.raw`$\frac{3^{n+1}}{3^n} = 3$ and $\frac{n!}{(n+1)!} = \frac{1}{n+1}$.`, reveal: String.raw`$\left|\frac{a_{n+1}}{a_n}\right| = \frac{3|x|}{n+1}$.` },
          { prompt: String.raw`For a fixed $x$, what is the limit as $n \to \infty$?`, ask: { kind: 'numeric', answer: '0' }, hint: 'The numerator is a fixed number; the denominator grows.', reveal: String.raw`$\frac{3|x|}{n+1} \to 0$.` },
          { prompt: 'The radius of convergence is', ask: { kind: 'choice', choices: [String.raw`$0$`, String.raw`$\frac13$`, String.raw`$3$`, String.raw`$\infty$`], answer: 3 }, hint: String.raw`$0 < 1$ no matter what $x$ is.`, reveal: String.raw`$R = \infty$ (the sum is $e^{3x}$).` },
        ] },
        { type: 'guided', title: String.raw`Radius of $\displaystyle\sum_{n=0}^{\infty} \frac{(n!)^2}{(2n)!}\,x^n$`, problem: String.raw`Find the radius of convergence of $\sum_{n=0}^{\infty} \frac{(n!)^2}{(2n)!}\,x^n$ — Example 3 turned upside down.`, steps: [
          { prompt: String.raw`Simplify $\frac{((n+1)!)^2}{(n!)^2}$ (expression in <code>n</code>).`, ask: { kind: 'expression', answer: '(n+1).^2', variable: 'n', domain: [1, 6], label: '=' }, hint: String.raw`$\frac{(n+1)!}{n!} = n+1$, then square.`, reveal: String.raw`$(n+1)^2$.` },
          { prompt: String.raw`With $\frac{(2n)!}{(2n+2)!} = \frac{1}{(2n+2)(2n+1)}$ the ratio is $\frac{(n+1)^2}{(2n+2)(2n+1)}|x| = \frac{n+1}{2(2n+1)}|x|$. Its limit is $c|x|$; give $c$.`, ask: { kind: 'numeric', answer: '1/4' }, hint: String.raw`Divide by $n$: $\frac{1 + 1/n}{2(2 + 1/n)}$.`, reveal: String.raw`$c = \frac{1}{4}$: the limit is $\frac{|x|}{4}$.` },
          { prompt: String.raw`$R = \;?$`, ask: { kind: 'numeric', answer: '4' }, hint: String.raw`$\frac{|x|}{4} < 1$.`, reveal: String.raw`$R = 4$.` },
        ] },
        { type: 'quiz', question: String.raw`The radius of convergence of $\displaystyle\sum_{n=0}^\infty (n+1)!\,x^n$ is`, choices: [String.raw`$0$`, String.raw`$1$`, String.raw`$e$`, String.raw`$\infty$`], answer: 0, explain: String.raw`$\left|\frac{a_{n+1}}{a_n}\right| = (n+2)|x| \to \infty$ for every $x \ne 0$, as in Example 2.` },
      ],
    },
    {
      id: 'interval',
      title: 'Interval of convergence: testing the endpoints',
      blocks: [
        { type: 'text', html: String.raw`<p>The ratio test gives an <b>open</b> interval $(a - R, a + R)$. At its two endpoints the ratio limit equals exactly $1$, where the test says nothing. So each endpoint is put into the series, and the resulting series of numbers is tested with a named test from the previous modules. The answer is an interval whose brackets record the two endpoint results: $[$ or $]$ for "converges", $($ or $)$ for "diverges".</p>` },
        { type: 'refresher', title: String.raw`from $|x - a| < R$ to an interval`, html: String.raw`<p>$|x - a|$ is the distance between $x$ and $a$. "Distance less than $R$" means $x$ lies between $a - R$ and $a + R$.</p>`, steps: [
          { do: String.raw`$|x - 2| < 3$`, why: 'The inequality from the ratio test.' },
          { do: String.raw`$-3 < x - 2 < 3$`, why: String.raw`$|y| < 3$ means $-3 < y < 3$.` },
          { do: String.raw`$-1 < x < 5$`, why: String.raw`Add $2$ to all three parts.` },
        ] },
        { type: 'steps', title: String.raw`Example: interval of convergence of $\displaystyle\sum_{n=1}^{\infty} \frac{(x-2)^n}{n\,3^n}$`, steps: [
          { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{|x-2|^{n+1}}{(n+1)\,3^{n+1}}\cdot\dfrac{n\,3^n}{|x-2|^n}$`, why: String.raw`Ratio test on the absolute values of the terms; $a_{n+1}$ has $n+1$ in place of $n$.` },
          { do: String.raw`$= \dfrac{n}{n+1}\cdot\dfrac{|x-2|}{3}$`, why: String.raw`Simplify each kind of factor: $\frac{|x-2|^{n+1}}{|x-2|^n} = |x-2|$, $\frac{3^n}{3^{n+1}} = \frac13$.` },
          { do: String.raw`$\to \dfrac{|x-2|}{3}$`, why: String.raw`$\frac{n}{n+1} \to 1$.` },
          { do: String.raw`$\dfrac{|x-2|}{3} < 1 \iff |x - 2| < 3$`, why: 'Absolute convergence when the limit is below 1. Centre $a = 2$, radius $R = 3$.' },
          { do: String.raw`$-1 < x < 5$`, why: 'Refresher above.' },
          { do: String.raw`Right endpoint $x = 5$: $\;\displaystyle\sum \frac{3^n}{n\,3^n} = \sum \frac{1}{n}$`, why: String.raw`Put $x = 5$ into the series: $x - 2 = 3$, and $3^n$ cancels.` },
          { do: String.raw`$\sum \frac1n$ diverges`, why: String.raw`Harmonic series ($p$-series with $p = 1$). So $x = 5$ is <b>not</b> included.` },
          { do: String.raw`Left endpoint $x = -1$: $\;\displaystyle\sum \frac{(-3)^n}{n\,3^n} = \sum \frac{(-1)^n}{n}$`, why: String.raw`$x - 2 = -3$ and $(-3)^n = (-1)^n 3^n$.` },
          { do: String.raw`$b_n = \frac1n > 0$, decreasing, $\to 0$: converges`, why: 'Alternating series test with all three conditions. So $x = -1$ <b>is</b> included.' },
          { do: String.raw`Interval of convergence: $[-1, 5)$`, why: String.raw`Square bracket at $-1$ (converges), round bracket at $5$ (diverges).` },
        ] },
        { type: 'guided', title: String.raw`Interval of convergence of $\displaystyle\sum_{n=1}^{\infty} \frac{(x+1)^n}{n\,4^n}$`, problem: String.raw`Find the interval of convergence of $\sum_{n=1}^{\infty} \frac{(x+1)^n}{n\,4^n}$. Same steps as the example.`, steps: [
          { prompt: String.raw`The ratio test gives $\lim \left|\frac{a_{n+1}}{a_n}\right| = \frac{|x+1|}{c}$. What is $c$?`, ask: { kind: 'numeric', answer: '4' }, hint: String.raw`$\frac{n}{n+1}\cdot\frac{|x+1|}{4}$.`, reveal: String.raw`$\frac{n}{n+1}\cdot\frac{|x+1|}{4} \to \frac{|x+1|}{4}$, so $|x + 1| < 4$.` },
          { prompt: String.raw`$|x + 1| < 4$ means $p < x < q$. What is the left end $p$?`, ask: { kind: 'numeric', answer: '-5' }, hint: String.raw`$-4 < x + 1 < 4$; subtract $1$.`, reveal: String.raw`$-5 < x < 3$.` },
          { prompt: String.raw`At the right endpoint $x = 3$ the series becomes $\sum \frac{4^n}{n4^n} = \sum\frac1n$. It`, ask: { kind: 'choice', choices: ['converges', 'diverges'], answer: 1 }, hint: 'Harmonic series.', reveal: String.raw`$\sum\frac1n$ diverges: $x = 3$ is excluded.` },
          { prompt: String.raw`At the left endpoint $x = -5$ the series becomes $\sum \frac{(-4)^n}{n4^n} = \sum \frac{(-1)^n}{n}$. It`, ask: { kind: 'choice', choices: ['converges (alternating series test)', 'diverges'], answer: 0 }, hint: String.raw`$b_n = \frac1n$: positive, decreasing, limit 0.`, reveal: String.raw`Converges by the alternating series test: $x = -5$ is included.` },
          { prompt: 'The interval of convergence is', ask: { kind: 'choice', choices: [String.raw`$(-5, 3)$`, String.raw`$[-5, 3)$`, String.raw`$(-5, 3]$`, String.raw`$[-5, 3]$`], answer: 1 }, hint: 'Square bracket where it converges.', reveal: String.raw`$[-5, 3)$.` },
        ] },
      ],
    },
    {
      id: 'interval-linear',
      title: 'Inside terms like (2x − 1): centre, radius and endpoints',
      blocks: [
        { type: 'text', html: String.raw`<p>When the series contains $(2x - 1)^n$ instead of $(x - a)^n$, the ratio test gives a condition like $|2x - 1| < 3$. Solve it for $x$ one line at a time. The centre and radius refer to $x$: since $2x - 1 = 2\left(x - \frac12\right)$, the centre is $\frac12$.</p>` },
        { type: 'refresher', title: String.raw`solving $|2x - 1| < 3$`, html: String.raw`<p>Remove the absolute value first, then do the same operation to all three parts.</p>`, steps: [
          { do: String.raw`$|2x - 1| < 3$`, why: 'The condition from the ratio test.' },
          { do: String.raw`$-3 < 2x - 1 < 3$`, why: String.raw`$|y| < 3 \iff -3 < y < 3$.` },
          { do: String.raw`$-2 < 2x < 4$`, why: String.raw`Add $1$ to all three parts.` },
          { do: String.raw`$-1 < x < 2$`, why: String.raw`Divide all three parts by $2$ (positive, so no flip).` },
          { do: String.raw`Centre $\tfrac12$, radius $\tfrac32$`, why: String.raw`The midpoint of $-1$ and $2$ is $\frac12$; half the length $3$ is $\frac32$. Equivalently $|2x - 1| = 2\left|x - \frac12\right| < 3 \iff \left|x - \frac12\right| < \frac32$.` },
        ] },
        { type: 'steps', title: String.raw`Example: interval of convergence of $\displaystyle\sum_{n=1}^{\infty} \frac{(2x-1)^n}{n^2\,3^n}$`, steps: [
          { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{|2x-1|^{n+1}}{(n+1)^2\,3^{n+1}}\cdot\dfrac{n^2\,3^n}{|2x-1|^n}$`, why: 'Ratio test on the absolute values.' },
          { do: String.raw`$= \left(\dfrac{n}{n+1}\right)^2\cdot\dfrac{|2x-1|}{3} \to \dfrac{|2x-1|}{3}$`, why: String.raw`Simplify each factor; $\frac{n}{n+1} \to 1$.` },
          { do: String.raw`$|2x - 1| < 3 \iff -1 < x < 2$`, why: String.raw`Limit $< 1$; then the refresher. Centre $\frac12$, $R = \frac32$.` },
          { do: String.raw`$x = 2$: $\; 2x - 1 = 3$, series $\displaystyle\sum \frac{3^n}{n^2 3^n} = \sum \frac{1}{n^2}$`, why: 'Put the right endpoint into the series.' },
          { do: String.raw`$\sum\frac1{n^2}$ converges`, why: String.raw`$p$-series with $p = 2 > 1$. So $x = 2$ is included.` },
          { do: String.raw`$x = -1$: $\; 2x - 1 = -3$, series $\displaystyle\sum \frac{(-3)^n}{n^2 3^n} = \sum \frac{(-1)^n}{n^2}$`, why: 'Put the left endpoint into the series.' },
          { do: String.raw`$\sum \left|\frac{(-1)^n}{n^2}\right| = \sum\frac{1}{n^2}$ converges: absolutely convergent`, why: 'Absolute convergence implies convergence. So $x = -1$ is included.' },
          { do: String.raw`Interval of convergence: $[-1, 2]$`, why: 'Both endpoints converge: two square brackets.' },
        ] },
        { type: 'guided', title: String.raw`Interval of convergence of $\displaystyle\sum_{n=1}^{\infty} \frac{(3x+2)^n}{n^2 + 4}$`, problem: String.raw`Find the interval of convergence of $\sum_{n=1}^{\infty} \frac{(3x+2)^n}{n^2+4}$.`, steps: [
          { prompt: String.raw`The ratio test gives $\frac{n^2+4}{(n+1)^2+4}\,|3x+2| \to |3x + 2|$, so the condition is $|3x + 2| < 1$. Solve it: the left end of the open interval is`, ask: { kind: 'numeric', answer: '-1' }, hint: String.raw`$-1 < 3x + 2 < 1$; subtract $2$, then divide by $3$.`, reveal: String.raw`$-3 < 3x < -1 \iff -1 < x < -\frac13$.` },
          { prompt: String.raw`The centre $a$ (midpoint of $-1$ and $-\frac13$):`, ask: { kind: 'numeric', answer: '-2/3' }, hint: String.raw`$3x + 2 = 3\left(x + \frac23\right)$.`, reveal: String.raw`$a = -\frac23$, and $R = \frac13$.` },
          { prompt: String.raw`At $x = -\frac13$: $3x + 2 = 1$ and the series is $\sum \frac{1}{n^2+4}$. It`, ask: { kind: 'choice', choices: [String.raw`converges (compare with $\sum \frac{1}{n^2}$)`, 'diverges'], answer: 0 }, hint: String.raw`$\frac{1}{n^2+4} \le \frac{1}{n^2}$.`, reveal: String.raw`Converges by direct comparison with the $p$-series $p = 2$.` },
          { prompt: String.raw`At $x = -1$: $3x + 2 = -1$ and the series is $\sum \frac{(-1)^n}{n^2+4}$. It`, ask: { kind: 'choice', choices: ['converges absolutely', 'converges conditionally', 'diverges'], answer: 0 }, hint: 'Its absolute values are the series of the previous step.', reveal: 'Converges absolutely.' },
          { prompt: 'The interval of convergence is', ask: { kind: 'choice', choices: [String.raw`$\left(-1, -\frac13\right)$`, String.raw`$\left[-1, -\frac13\right)$`, String.raw`$\left(-1, -\frac13\right]$`, String.raw`$\left[-1, -\frac13\right]$`], answer: 3 }, hint: 'Both endpoints converge.', reveal: String.raw`$\left[-1, -\frac13\right]$.` },
        ] },
      ],
    },
    {
      id: 'substitution-endpoints',
      title: 'Substitutions: even and odd powers like (x + 1)^(2n) and (2x − 3)^(3n)',
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
        { type: 'refresher', title: String.raw`powers of powers, and $\sqrt{n/(n+1)} \to 1$`, html: String.raw`<ul><li>$\dfrac{(x+1)^{2n}}{9^n} = \left(\dfrac{(x+1)^2}{9}\right)^n$ because $(y^2)^n = y^{2n}$.</li><li>$27^n = (3^3)^n$, so $\dfrac{(2x-3)^{3n}}{27^n} = \left(\dfrac{2x-3}{3}\right)^{3n} = \left(\left(\dfrac{2x-3}{3}\right)^3\right)^n$.</li><li>$|y^3| < 1 \iff |y| < 1$ (take the cube root; it is increasing). Likewise $y^2 < 1 \iff |y| < 1$.</li><li>$\sqrt{\dfrac{n}{n+1}} \to \sqrt 1 = 1$, so a factor like this does not change the ratio limit.</li></ul>` },
        { type: 'steps', title: String.raw`Example 1 (even power): $\displaystyle\sum_{n=1}^{\infty} \frac{(x+1)^{2n}}{n\,9^n}$`, steps: [
          { do: String.raw`$u = \dfrac{(x+1)^2}{9}$, so the series is $\displaystyle\sum_{n\ge1} \frac{u^n}{n}$`, why: 'Refresher: the $x$-part and the $9^n$ combine into one $n$-th power.' },
          { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{n}{n+1}\,|u| \to |u|$`, why: String.raw`Ratio test in the variable $u$: $\frac{|u|^{n+1}}{n+1}\cdot\frac{n}{|u|^n}$.` },
          { do: String.raw`Converges for $|u| < 1$`, why: 'Limit below 1.' },
          { do: String.raw`$u = 1$: $\sum\frac1n$ diverges; $\; u = -1$: $\sum\frac{(-1)^n}{n}$ converges`, why: 'Harmonic series, and the alternating series test.' },
          { do: String.raw`Here $u = \frac{(x+1)^2}{9} \ge 0$: condition $\frac{(x+1)^2}{9} < 1$`, why: 'A square is never negative, so $u = -1$ cannot happen for real $x$.' },
          { do: String.raw`$(x+1)^2 < 9 \iff |x + 1| < 3 \iff -4 < x < 2$`, why: 'Multiply by 9, take square roots, then remove the absolute value.' },
          { do: String.raw`$x = -4$ and $x = 2$ both give $u = 1$: divergent`, why: String.raw`$(x+1)^2 = 9$ at both endpoints.` },
          { do: String.raw`Interval $(-4, 2)$, radius $R = 3$`, why: String.raw`The radius refers to $x$, not to $u$: it is $3$, not $9$.` },
        ] },
        { type: 'steps', title: String.raw`Example 2 (odd power): $\displaystyle\sum_{n=1}^{\infty} \frac{(2x-3)^{3n}}{27^n\, n}$`, steps: [
          { do: String.raw`$u = \left(\dfrac{2x-3}{3}\right)^3$, so the series is $\displaystyle\sum_{n\ge1}\frac{u^n}{n}$`, why: String.raw`$27^n = 3^{3n}$ (refresher).` },
          { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{n}{n+1}\,|u| \to |u|$`, why: 'Ratio test in the variable $u$, exactly as in Example 1.' },
          { do: String.raw`$|u| < 1 \iff \left|\dfrac{2x-3}{3}\right| < 1$`, why: 'A cube is less than 1 in size exactly when its base is (refresher).' },
          { do: String.raw`$\iff |2x - 3| < 3$`, why: 'Multiply by 3.' },
          { do: String.raw`$\iff -3 < 2x - 3 < 3 \iff 0 < 2x < 6 \iff 0 < x < 3$`, why: 'Remove the absolute value, add 3, divide by 2.' },
          { do: String.raw`Centre $a = \tfrac32$, radius $R = \tfrac32$`, why: String.raw`$2x - 3 = 2\left(x - \frac32\right)$; the midpoint of $0$ and $3$ is $\frac32$.` },
          { do: String.raw`$x = 3$: $\; 2x - 3 = 3$, $u = 1^3 = 1$: $\;\sum\frac1n$ diverges`, why: 'Right endpoint: harmonic series.' },
          { do: String.raw`$x = 0$: $\; 2x - 3 = -3$, $u = (-1)^3 = -1$: $\;\sum\frac{(-1)^n}{n}$ converges`, why: String.raw`Left endpoint: an <b>odd</b> power keeps the minus sign, so $u = -1$. Alternating series test: $b_n = \frac1n$ positive, decreasing, $\to 0$.` },
          { do: String.raw`Interval $[0, 3)$`, why: 'Included at 0, excluded at 3.' },
        ] },
        { type: 'callout', kind: 'warn', title: 'Odd powers and negative coefficients', html: String.raw`<p>With $u = \frac{(1 - 2x)^3}{8}$, $u$ takes <b>both</b> signs, so both $u = 1$ and $u = -1$ occur as endpoints. Also note which $x$ gives which: $1 - 2x = 2$ at $x = -\tfrac12$ (that is $u = +1$), while $1 - 2x = -2$ at $x = \tfrac32$ ($u = -1$). Write both endpoint series out explicitly.</p>` },
        { type: 'guided', title: String.raw`Interval of convergence of $\displaystyle\sum_{n=1}^{\infty} \frac{(1-2x)^{3n}}{8^n\, n^2}$`, problem: String.raw`Find the centre, radius and interval of convergence of $\sum_{n=1}^{\infty} \frac{(1-2x)^{3n}}{8^n\,n^2}$. Use $u = \left(\frac{1-2x}{2}\right)^3$, so the series is $\sum \frac{u^n}{n^2}$.`, steps: [
          { prompt: String.raw`The ratio test in $u$ gives $\left(\frac{n}{n+1}\right)^2|u| \to |u|$, and $|u| < 1 \iff |1 - 2x| < 2$. Solve: the left end of the open interval is`, ask: { kind: 'numeric', answer: '-1/2' }, hint: String.raw`$-2 < 1 - 2x < 2$; subtract 1: $-3 < -2x < 1$; divide by $-2$ and <b>flip</b> both signs.`, reveal: String.raw`$-\frac12 < x < \frac32$.` },
          { prompt: String.raw`The centre $a$:`, ask: { kind: 'numeric', answer: '1/2' }, hint: String.raw`$1 - 2x = -2\left(x - \frac12\right)$, or take the midpoint.`, reveal: String.raw`$a = \frac12$.` },
          { prompt: String.raw`The radius $R$:`, ask: { kind: 'numeric', answer: '1' }, hint: 'Half the length of the interval.', reveal: String.raw`$R = 1$.` },
          { prompt: String.raw`At $x = -\frac12$, what is $u$?`, ask: { kind: 'numeric', answer: '1' }, hint: String.raw`$1 - 2\cdot\left(-\frac12\right) = 2$.`, reveal: String.raw`$u = \left(\frac22\right)^3 = 1$: the series is $\sum\frac{1}{n^2}$, convergent ($p = 2$).` },
          { prompt: String.raw`At $x = \frac32$, $u = -1$ and the series is $\sum \frac{(-1)^n}{n^2}$. It`, ask: { kind: 'choice', choices: ['converges absolutely', 'converges conditionally', 'diverges'], answer: 0 }, hint: String.raw`Its absolute values form $\sum\frac{1}{n^2}$.`, reveal: 'Converges absolutely.' },
          { prompt: 'The interval of convergence is', ask: { kind: 'choice', choices: [String.raw`$\left(-\frac12, \frac32\right)$`, String.raw`$\left[-\frac12, \frac32\right)$`, String.raw`$\left(-\frac12, \frac32\right]$`, String.raw`$\left[-\frac12, \frac32\right]$`], answer: 3 }, hint: 'Both endpoints converge.', reveal: String.raw`$\left[-\frac12, \frac32\right]$.` },
        ] },
        { type: 'quiz', question: String.raw`For which $x$ does $\displaystyle\sum_{n=0}^{\infty} \frac{(x-1)^{3n}}{8^n}$ converge?`, choices: [String.raw`$-1 < x < 3$`, String.raw`$-7 < x < 9$`, String.raw`$-1 \le x < 3$`, String.raw`$0 < x < 2$`], answer: 0, explain: String.raw`It is geometric with ratio $r = \left(\frac{x-1}{2}\right)^3$; $|r| < 1 \iff |x - 1| < 2$. At $x = 3$ and $x = -1$, $r = \pm 1$ and the terms do not tend to $0$.` },
      ],
    },
    {
      id: 'geometric-representations',
      title: 'Functions as geometric series',
      blocks: [
        { type: 'text', html: String.raw`<p>Many functions can be turned into a power series without any differentiation: bring them into the form $\dfrac{\text{first term}}{1 - \text{ratio}}$ and use the geometric series.</p>` },
        { type: 'refresher', title: 'the geometric series', html: String.raw`<p>$$\frac{1}{1 - r} = \sum_{n=0}^{\infty} r^n = 1 + r + r^2 + \cdots \quad\text{for } |r| < 1.$$</p><ul><li>The denominator must be exactly $1 - (\text{something})$. A plus sign is "minus a negative": $1 + y = 1 - (-y)$.</li><li>If the denominator starts with another number, factor it out: $2 - x = 2\left(1 - \frac x2\right)$.</li><li>$(-y)^n = (-1)^n y^n$ and $\left(\frac{x}{2}\right)^n = \frac{x^n}{2^n}$.</li></ul>` },
        { type: 'steps', title: String.raw`Example 1: $\dfrac{1}{2 - x} = \sum c_n x^n$; find $c_n$ and the radius`, steps: [
          { do: String.raw`$2 - x = 2\left(1 - \dfrac x2\right)$`, why: String.raw`Factor out $2$ so that the bracket starts with $1$.` },
          { do: String.raw`$\dfrac{1}{2 - x} = \dfrac12\cdot\dfrac{1}{1 - \frac x2}$`, why: String.raw`$\frac{1}{2\cdot(\dots)} = \frac12\cdot\frac{1}{(\dots)}$.` },
          { do: String.raw`$= \dfrac12\sum_{n=0}^{\infty}\left(\dfrac x2\right)^n$`, why: String.raw`Geometric series with ratio $r = \frac x2$.` },
          { do: String.raw`$= \sum_{n=0}^{\infty}\dfrac{x^n}{2^{n+1}}$`, why: String.raw`$\frac12\cdot\frac{x^n}{2^n} = \frac{x^n}{2^{n+1}}$.` },
          { do: String.raw`$c_n = \dfrac{1}{2^{n+1}}$`, why: String.raw`The coefficient is everything in front of $x^n$.` },
          { do: String.raw`Valid for $\left|\frac x2\right| < 1 \iff |x| < 2$: $R = 2$`, why: 'The geometric series needs $|r| < 1$.' },
        ] },
        { type: 'guided', title: String.raw`$\dfrac{1}{5 - x}$ as a power series`, problem: String.raw`Write $\frac{1}{5 - x} = \sum_{n=0}^{\infty} c_n x^n$ and find the radius.`, steps: [
          { prompt: String.raw`After factoring out $5$: $\frac{1}{5-x} = \frac15\cdot\frac{1}{1 - r}$. Type the ratio $r$ in terms of <code>x</code>.`, ask: { kind: 'expression', answer: 'x/5', variable: 'x', domain: [-2, 2], label: 'r =' }, hint: String.raw`$5 - x = 5\left(1 - \frac{x}{5}\right)$.`, reveal: String.raw`$r = \frac{x}{5}$.` },
          { prompt: String.raw`Then $\frac15\sum\left(\frac x5\right)^n = \sum c_n x^n$. Type $c_n$ in terms of <code>n</code>.`, ask: { kind: 'expression', answer: '5.^(-n-1)', variable: 'n', domain: [0, 5], label: 'c_n =' }, hint: String.raw`$\frac15\cdot\frac{1}{5^n} = \frac{1}{5^{n+1}}$; in MATLAB <code>1./5.^(n+1)</code>.`, reveal: String.raw`$c_n = \frac{1}{5^{n+1}}$.` },
          { prompt: String.raw`The radius $R$:`, ask: { kind: 'numeric', answer: '5' }, hint: String.raw`$\left|\frac x5\right| < 1$.`, reveal: String.raw`$|x| < 5$: $R = 5$.` },
        ] },
        { type: 'steps', title: String.raw`Example 2: $\dfrac{x}{4 + x^2}$ as a power series, and its coefficient of $x^5$`, steps: [
          { do: String.raw`$4 + x^2 = 4\left(1 + \dfrac{x^2}{4}\right) = 4\left(1 - \left(-\dfrac{x^2}{4}\right)\right)$`, why: String.raw`Factor out $4$, then write the plus as "minus a negative".` },
          { do: String.raw`$\dfrac{x}{4 + x^2} = \dfrac{x}{4}\cdot\dfrac{1}{1 - \left(-\frac{x^2}{4}\right)}$`, why: 'Split off the factors that are not part of the geometric form.' },
          { do: String.raw`$= \dfrac{x}{4}\sum_{n=0}^\infty \left(-\dfrac{x^2}{4}\right)^n$`, why: String.raw`Geometric series with ratio $r = -\frac{x^2}{4}$.` },
          { do: String.raw`$\left(-\dfrac{x^2}{4}\right)^n = \dfrac{(-1)^n x^{2n}}{4^n}$`, why: String.raw`Power of a product: $(-1)^n$, $(x^2)^n = x^{2n}$, $4^n$.` },
          { do: String.raw`$\dfrac{x}{4 + x^2} = \sum_{n=0}^\infty \dfrac{(-1)^n x^{2n+1}}{4^{n+1}}$`, why: String.raw`Multiply each term by $\frac x4$: $x\cdot x^{2n} = x^{2n+1}$ and $4\cdot 4^n = 4^{n+1}$.` },
          { do: String.raw`$x^5$: $\; 2n + 1 = 5 \Rightarrow n = 2$, coefficient $\dfrac{(-1)^2}{4^3} = \dfrac{1}{64}$`, why: 'Find the $n$ that produces the wanted power, then put it into the coefficient.' },
          { do: String.raw`Valid for $\dfrac{x^2}{4} < 1 \iff |x| < 2$: $R = 2$`, why: String.raw`$|r| = \frac{x^2}{4} < 1$.` },
        ] },
        { type: 'guided', title: String.raw`The coefficient of $x^5$ in $\dfrac{x}{1 + 9x^2}$`, problem: String.raw`Find the coefficient of $x^5$ in the Maclaurin series (power series at $0$) of $\frac{x}{1 + 9x^2}$.`, steps: [
          { prompt: String.raw`Write $\frac{1}{1 + 9x^2} = \frac{1}{1 - r}$. Type $r$.`, ask: { kind: 'expression', answer: '-9*x.^2', variable: 'x', domain: [-0.3, 0.3], label: 'r =' }, hint: String.raw`$1 + 9x^2 = 1 - (-9x^2)$.`, reveal: String.raw`$r = -9x^2$.` },
          { prompt: String.raw`So $\frac{x}{1+9x^2} = x\sum(-9x^2)^n = \sum (-9)^n x^{2n+1}$. Which $n$ gives $x^5$?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`Solve $2n + 1 = 5$.`, reveal: String.raw`$n = 2$.` },
          { prompt: 'The coefficient of $x^5$:', ask: { kind: 'numeric', answer: '81' }, hint: String.raw`$(-9)^2$.`, reveal: String.raw`$(-9)^2 = 81$.` },
        ] },
      ],
    },
    {
      id: 'integrate-series',
      title: 'Integrating series: ln(1 + x) and arctan x',
      blocks: [
        { type: 'text', html: String.raw`<p>Integrating $\dfrac{1}{1+t^2} = 1 - t^2 + t^4 - \cdots$ from $0$ to $x$ gives the series of $\arctan x$. Its radius is $1$ — although $\arctan$ is perfectly smooth on all of $\mathbb R$. (The reason lies in the complex plane: $1 + t^2 = 0$ at $t = \pm i$.)</p>` },
        { type: 'widget', name: 'taylor', config: {
          title: 'arctan x = x − x³/3 + x⁵/5 − ⋯',
          f: 'atan(x)', coef: 'sin(k*pi/2)./(k + (k==0))', a: 0, nmax: 31, n: 5, R: 1, Rtex: '1',
          xlim: [-2.2, 2.2], ylim: [-2, 2],
        } },
        { type: 'callout', kind: 'thm', title: 'Term-by-term calculus', html: String.raw`<p>If $f(x) = \sum c_n (x-a)^n$ has radius $R > 0$, then on $|x - a| < R$</p>$$f'(x) = \sum_{n=1}^\infty n c_n (x-a)^{n-1}, \qquad \int_a^x f(t)\,\mathrm d t = \sum_{n=0}^\infty \frac{c_n}{n+1}(x-a)^{n+1},$$<p>and both series have the <b>same radius</b> $R$. Convergence at the endpoints may change and must be rechecked.</p>` },
        { type: 'refresher', title: 'integrating a power of t', html: String.raw`<p>$\displaystyle\int_0^x t^n\,\mathrm d t = \left[\frac{t^{n+1}}{n+1}\right]_0^x = \frac{x^{n+1}}{n+1}$. Each term of a series is integrated like this, one at a time.</p>` },
        { type: 'steps', title: String.raw`Example 1: the series of $\ln(1+x)$`, steps: [
          { do: String.raw`$\dfrac{1}{1+t} = \dfrac{1}{1 - (-t)} = \sum_{n=0}^\infty (-1)^n t^n$ for $|t| < 1$`, why: String.raw`Geometric series with ratio $r = -t$.` },
          { do: String.raw`$\ln(1+x) = \displaystyle\int_0^x \frac{\mathrm d t}{1+t}$`, why: String.raw`An antiderivative of $\frac{1}{1+t}$ is $\ln(1+t)$, and $\ln 1 = 0$.` },
          { do: String.raw`$= \displaystyle\sum_{n=0}^\infty (-1)^n \int_0^x t^n\,\mathrm d t = \sum_{n=0}^\infty \frac{(-1)^n x^{n+1}}{n+1}$`, why: 'Integrate term by term (allowed for $|x| < 1$), using the refresher.' },
          { do: String.raw`$= \displaystyle\sum_{n=1}^\infty \frac{(-1)^{n+1}x^n}{n} = x - \frac{x^2}{2} + \frac{x^3}{3} - \cdots$`, why: String.raw`Rename $n + 1 \to n$ so that the power is $x^n$; the sign $(-1)^{n}$ becomes $(-1)^{n+1}$ and the sum starts at $n = 1$.` },
          { do: String.raw`$R = 1$; at $x = 1$ converges (to $\ln 2$), at $x = -1$ diverges`, why: String.raw`Integration keeps the radius. At $x = 1$: alternating harmonic series. At $x = -1$: $-\sum\frac1n$.` },
        ] },
        { type: 'steps', title: String.raw`Example 2: the coefficient of $x^3$ in $\ln(1 + 3x)$`, steps: [
          { do: String.raw`$\ln(1 + u) = \displaystyle\sum_{n=1}^\infty \frac{(-1)^{n+1}u^n}{n}$`, why: 'Example 1 with the letter $u$.' },
          { do: String.raw`$u = 3x$: $\;\ln(1 + 3x) = \displaystyle\sum_{n=1}^\infty \frac{(-1)^{n+1}3^n x^n}{n}$`, why: String.raw`Substitute; $(3x)^n = 3^n x^n$.` },
          { do: String.raw`$x^3$: $n = 3$`, why: 'The power of $x$ is $n$.' },
          { do: String.raw`Coefficient $= \dfrac{(-1)^{4}\,3^3}{3} = \dfrac{27}{3} = 9$`, why: String.raw`Put $n = 3$ into the coefficient: the sign is $(-1)^{3+1} = +1$.` },
        ] },
        { type: 'guided', title: String.raw`The coefficient of $x^2$ in $\ln(1 + 5x)$`, problem: String.raw`Find the coefficient of $x^2$ in the series of $\ln(1 + 5x)$.`, steps: [
          { prompt: String.raw`Substituting $u = 5x$, the $n$-th term is $\frac{(-1)^{n+1}5^n x^n}{n}$. Which $n$ gives $x^2$?`, ask: { kind: 'numeric', answer: '2' }, hint: 'The power of $x$ is $n$.', reveal: String.raw`$n = 2$.` },
          { prompt: String.raw`What is the sign $(-1)^{n+1}$ for that $n$?`, ask: { kind: 'numeric', answer: '-1' }, hint: String.raw`$(-1)^3$.`, reveal: String.raw`$(-1)^3 = -1$.` },
          { prompt: 'The coefficient of $x^2$:', ask: { kind: 'numeric', answer: '-25/2' }, hint: String.raw`$\frac{-5^2}{2}$.`, reveal: String.raw`$-\frac{25}{2}$, i.e. $\ln(1 + 5x) = 5x - \frac{25}{2}x^2 + \cdots$` },
        ] },
        { type: 'table', head: ['Function', 'Power series', 'Radius'], rows: [
          [String.raw`$\dfrac{1}{1-x}$`, String.raw`$\sum_{n=0}^{\infty} x^n$`, String.raw`$1$`],
          [String.raw`$\dfrac{1}{1+x^2}$`, String.raw`$\sum_{n=0}^{\infty} (-1)^n x^{2n}$`, String.raw`$1$`],
          [String.raw`$\dfrac{1}{(1-x)^2}$`, String.raw`$\sum_{n=1}^{\infty} n x^{n-1}$`, String.raw`$1$`],
          [String.raw`$\ln(1+x)$`, String.raw`$\sum_{n=1}^{\infty} \dfrac{(-1)^{n+1} x^n}{n}$`, String.raw`$1$`],
          [String.raw`$\arctan x$`, String.raw`$\sum_{n=0}^{\infty} \dfrac{(-1)^n x^{2n+1}}{2n+1}$`, String.raw`$1$`],
        ] },
      ],
    },
    {
      id: 'differentiate-series',
      title: 'Differentiating series: sums like Σ n/3ⁿ',
      blocks: [
        { type: 'text', html: String.raw`<p>Differentiating the geometric series produces a factor $n$ in front of each term. This lets us find the exact value of sums such as $\sum \frac{n}{2^n}$, which are not geometric.</p>` },
        { type: 'refresher', title: String.raw`the derivative of $\frac{1}{1-x}$`, html: String.raw`<p>$\dfrac{1}{1-x} = (1-x)^{-1}$. Chain rule: $\dfrac{\mathrm d}{\mathrm d x}(1-x)^{-1} = -1\cdot(1-x)^{-2}\cdot(-1) = \dfrac{1}{(1-x)^2}$ — the inner derivative $-1$ cancels the minus sign from the power.</p>` },
        { type: 'steps', title: String.raw`Example: find $\displaystyle\sum_{n=1}^\infty \frac{n}{2^n}$`, steps: [
          { do: String.raw`$\displaystyle\sum_{n=0}^\infty x^n = \frac{1}{1-x}$ for $|x| < 1$`, why: 'Start from the geometric series.' },
          { do: String.raw`$\displaystyle\sum_{n=1}^\infty n x^{n-1} = \frac{1}{(1-x)^2}$`, why: String.raw`Differentiate both sides term by term: $(x^n)' = n x^{n-1}$; the $n = 0$ term is the constant $1$ with derivative $0$, so the sum starts at $n = 1$. Right side: refresher.` },
          { do: String.raw`$\displaystyle\sum_{n=1}^\infty n x^{n} = \frac{x}{(1-x)^2}$`, why: String.raw`Multiply both sides by $x$: $x\cdot x^{n-1} = x^n$.` },
          { do: String.raw`$\dfrac{n}{2^n} = n\left(\dfrac12\right)^n$, so take $x = \dfrac12$`, why: String.raw`Match the wanted sum with $\sum n x^n$; $x = \frac12$ is inside $|x| < 1$.` },
          { do: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{n}{2^n} = \frac{1/2}{(1 - 1/2)^2} = \frac{1/2}{1/4}$`, why: 'Substitute into the formula.' },
          { do: String.raw`$= 2$`, why: String.raw`$\frac12 \cdot 4 = 2$.` },
        ] },
        { type: 'guided', title: String.raw`Find $\displaystyle\sum_{n=1}^\infty \frac{n}{4^n}$`, problem: String.raw`Use $\sum_{n=1}^\infty n x^n = \frac{x}{(1-x)^2}$ to find $\sum_{n=1}^\infty \frac{n}{4^n}$.`, steps: [
          { prompt: String.raw`Which $x$ do you substitute?`, ask: { kind: 'numeric', answer: '1/4' }, hint: String.raw`$\frac{n}{4^n} = n\left(\frac14\right)^n$.`, reveal: String.raw`$x = \frac14$, inside $|x| < 1$.` },
          { prompt: String.raw`Compute $(1 - x)^2$ for that $x$.`, ask: { kind: 'numeric', answer: '9/16' }, hint: String.raw`$1 - \frac14 = \frac34$.`, reveal: String.raw`$\left(\frac34\right)^2 = \frac{9}{16}$.` },
          { prompt: 'The sum:', ask: { kind: 'numeric', answer: '4/9' }, hint: String.raw`$\frac{1/4}{9/16} = \frac14\cdot\frac{16}{9}$.`, reveal: String.raw`$\sum \frac{n}{4^n} = \frac{4}{9}$.` },
        ] },
        { type: 'quiz', question: String.raw`Differentiating $\sum_{n=0}^\infty x^n = \frac1{1-x}$ and multiplying by $x$ gives $\sum_{n=1}^\infty n x^n = $`, choices: [String.raw`$\dfrac{1}{(1-x)^2}$`, String.raw`$\dfrac{x}{(1-x)^2}$`, String.raw`$\dfrac{x}{1-x}$`, String.raw`$-\ln(1 - x)$`], answer: 1, explain: String.raw`$\frac{\mathrm d}{\mathrm d x}\frac1{1-x} = \frac{1}{(1-x)^2} = \sum_{n\ge1} n x^{n-1}$; multiplying by $x$ gives $\frac{x}{(1-x)^2}$ for $|x| < 1$.` },
      ],
    },
    {
      id: 'integral-series',
      title: 'Functions defined by integrals',
      blocks: [
        { type: 'text', html: String.raw`<p>$\displaystyle\int_0^x \frac{\mathrm d t}{1 + t^3}$ has an antiderivative, but a horrible one. With series it is easy: expand the integrand as a geometric series, integrate term by term, and use the alternating series bound to decide how many terms are needed.</p>` },
        { type: 'steps', title: String.raw`Example: $G(x) = \displaystyle\int_0^x \frac{\mathrm d t}{1 + t^3}$ — series, radius, $G(0.5)$ and the number of terms`, steps: [
          { do: String.raw`$\dfrac{1}{1 + t^3} = \dfrac{1}{1 - (-t^3)} = \displaystyle\sum_{n=0}^\infty (-1)^n t^{3n}$ for $|t| < 1$`, why: String.raw`Geometric series with ratio $-t^3$; $(-t^3)^n = (-1)^n t^{3n}$. It needs $|t^3| < 1$, i.e. $|t| < 1$.` },
          { do: String.raw`$G(x) = \displaystyle\sum_{n=0}^\infty (-1)^n\int_0^x t^{3n}\,\mathrm d t = \sum_{n=0}^\infty \frac{(-1)^n x^{3n+1}}{3n+1}$`, why: String.raw`Integrate term by term: $\int_0^x t^{3n}\,\mathrm d t = \frac{x^{3n+1}}{3n+1}$.` },
          { do: String.raw`$G(x) = x - \dfrac{x^4}{4} + \dfrac{x^7}{7} - \dfrac{x^{10}}{10} + \cdots$`, why: String.raw`Write out $n = 0, 1, 2, 3$. For example the coefficient of $x^7$ ($n = 2$) is $\frac17$.` },
          { do: String.raw`$R = 1$`, why: 'Integration does not change the radius of the geometric series.' },
          { do: String.raw`At $x = 0.5$: $\; b_n = \dfrac{0.5^{3n+1}}{3n+1}$: $\;b_0 = 0.5,\ b_1 = 0.015625,\ b_2 \approx 0.0011161,\ b_3 \approx 9.77\cdot10^{-5}$`, why: String.raw`The series at $x = 0.5$ alternates; these are the sizes of its terms.` },
          { do: String.raw`$b_n > 0$, decreasing, $b_n \to 0$`, why: String.raw`Alternating series test: the numerator $0.5^{3n+1}$ shrinks and the denominator grows.` },
          { do: String.raw`Using $m$ terms ($n = 0, \dots, m-1$), the error is at most $b_m$`, why: 'The first omitted term is $n = m$.' },
          { do: String.raw`$b_4 = \dfrac{0.5^{13}}{13} \approx 9.4\cdot 10^{-6}$, $\; b_5 = \dfrac{0.5^{16}}{16} \approx 9.5\cdot 10^{-7}$`, why: String.raw`For an error below $10^{-6}$ we need $b_m < 10^{-6}$: $b_4$ is too big, $b_5$ is small enough.` },
          { do: String.raw`$5$ terms: $G(0.5) \approx 0.5 - 0.015625 + 0.0011161 - 0.0000977 + 0.0000094 = 0.4854028$`, why: String.raw`Error at most $b_5 < 10^{-6}$. (Numerically $G(0.5) = 0.4854019\ldots$)` },
        ] },
        { type: 'guided', title: String.raw`$H(x) = \displaystyle\int_0^x \frac{\mathrm d t}{1 + t^6}$`, problem: String.raw`Find the series of $H(x) = \int_0^x \frac{\mathrm d t}{1+t^6}$, its radius, and the number of terms needed for $H(0.5)$ with error below $10^{-6}$.`, steps: [
          { prompt: String.raw`$\frac{1}{1+t^6} = \sum (-1)^n t^{6n}$, so $H(x) = \sum_{n=0}^\infty \frac{(-1)^n x^{6n+1}}{6n+1}$. What is the coefficient of $x^{13}$?`, ask: { kind: 'numeric', answer: '1/13' }, hint: String.raw`$6n + 1 = 13$ gives $n = 2$; the sign is $(-1)^2$.`, reveal: String.raw`$n = 2$: coefficient $\frac{1}{13}$.` },
          { prompt: 'The radius of convergence:', ask: { kind: 'numeric', answer: '1' }, hint: String.raw`The geometric series needs $|t^6| < 1$.`, reveal: String.raw`$R = 1$.` },
          { prompt: String.raw`At $x = 0.5$: $b_1 = \frac{0.5^7}{7} \approx 1.1\cdot10^{-3}$, $b_2 = \frac{0.5^{13}}{13} \approx 9.4\cdot 10^{-6}$, $b_3 = \frac{0.5^{19}}{19} \approx 1.0\cdot 10^{-7}$. How many terms guarantee an error below $10^{-6}$?`, ask: { kind: 'numeric', answer: '3' }, hint: String.raw`With $m$ terms the error is at most $b_m$. Which is the first $b_m$ below $10^{-6}$?`, reveal: String.raw`$b_3 < 10^{-6}$, so $m = 3$ terms ($n = 0, 1, 2$).` },
          { prompt: String.raw`Compute $H(0.5) \approx 0.5 - \frac{0.5^7}{7} + \frac{0.5^{13}}{13}$ (6 decimals).`, ask: { kind: 'numeric', answer: '0.5 - 0.5^7/7 + 0.5^13/13', tol: 1e-6 }, hint: String.raw`$0.5 - 0.0011161 + 0.0000094$.`, reveal: String.raw`$H(0.5) \approx 0.498893$.` },
        ] },
        { type: 'steps', title: String.raw`Example: $F(x) = \displaystyle\int_0^x \frac{\arctan t}{t}\,\mathrm d t$`, steps: [
          { do: String.raw`$\arctan t = \displaystyle\sum_{n=0}^\infty \frac{(-1)^n t^{2n+1}}{2n+1}$ for $|t| \le 1$`, why: 'From the table in "Integrating series".' },
          { do: String.raw`$\dfrac{\arctan t}{t} = \displaystyle\sum_{n=0}^\infty \frac{(-1)^n t^{2n}}{2n+1}$`, why: String.raw`Divide each term by $t$: $t^{2n+1}/t = t^{2n}$. (The value $1$ at $t = 0$ makes the integrand continuous.)` },
          { do: String.raw`$F(x) = \displaystyle\sum_{n=0}^\infty \frac{(-1)^n x^{2n+1}}{(2n+1)^2} = x - \frac{x^3}{9} + \frac{x^5}{25} - \cdots$`, why: String.raw`Integrate term by term: $\int_0^x t^{2n}\,\mathrm d t = \frac{x^{2n+1}}{2n+1}$, which gives a second factor $2n+1$.` },
          { do: String.raw`$R = 1$`, why: 'Dividing by $t$ and integrating do not change the radius.' },
        ] },
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
  assignIntro: String.raw`<p>Every problem below is the same type as a worked example and a guided exercise you have already done — the links above each problem take you back to them. If you get stuck, use the hints one at a time, then the step-by-step walkthrough.</p>`,
  assignments: [
    {
      id: 'a2',
      title: 'Radius and interval of convergence',
      difficulty: 'core',
      examples: ['radius', 'radius-factorials', 'interval', 'interval-linear'],
      statement: String.raw`<p>Find the radius or interval of convergence.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$R$ for $\displaystyle\sum_{n=1}^\infty \frac{n\,x^n}{5^n}$`, kind: 'numeric', answer: '5',
          hints: [String.raw`Same as the example in "Radius of convergence" ($\sum \frac{n^2x^n}{3^n}$).`, String.raw`Ratio test: group $\frac{n+1}{n}$, $\frac{|x|^{n+1}}{|x|^n}$ and $\frac{5^n}{5^{n+1}}$.`, String.raw`The ratio is $\frac{n+1}{n}\cdot\frac{|x|}{5}$.`],
          walkthrough: [
            { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{n+1}{n}\cdot\dfrac{|x|^{n+1}}{|x|^n}\cdot\dfrac{5^n}{5^{n+1}}$`, why: 'Ratio of consecutive terms, grouped.' },
            { do: String.raw`$= \left(1 + \dfrac1n\right)\dfrac{|x|}{5} \to \dfrac{|x|}{5}$`, why: 'Simplify each factor; $1/n \\to 0$.' },
            { do: String.raw`$\dfrac{|x|}{5} < 1 \iff |x| < 5$`, why: 'Ratio test: converges when the limit is below 1.' },
            { do: String.raw`$R = 5$`, why: 'Read off the radius.' },
          ] },
        { label: '(b)', prompt: String.raw`$R$ for $\displaystyle\sum_{n=0}^\infty n!\,x^n$`, kind: 'numeric', answer: '0',
          hints: [String.raw`Same type as Example 2 in "Radius with factorials".`, String.raw`$\frac{(n+1)!}{n!} = n+1$.`, String.raw`The ratio is $(n+1)|x|$. What happens to it for a fixed $x \ne 0$?`],
          walkthrough: [
            { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{(n+1)!}{n!}\cdot|x| = (n+1)|x|$`, why: 'Factorial ratio.' },
            { do: String.raw`$\to \infty$ for every $x \ne 0$`, why: String.raw`$|x| > 0$ fixed, $n + 1 \to \infty$.` },
            { do: String.raw`$R = 0$`, why: 'The series converges only at $x = 0$.' },
          ] },
        { label: '(c)', prompt: String.raw`$R$ for $\displaystyle\sum_{n=0}^\infty \frac{(2n)!}{(n!)^2}\,x^n$`, kind: 'numeric', answer: '1/4',
          hints: [String.raw`Same as Example 3 in "Radius with factorials", without the $3^n$.`, String.raw`$\frac{(2n+2)!}{(2n)!} = (2n+2)(2n+1)$ and $\frac{(n!)^2}{((n+1)!)^2} = \frac{1}{(n+1)^2}$.`, String.raw`The ratio is $\frac{2(2n+1)}{n+1}|x| \to 4|x|$.`],
          walkthrough: [
            { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \dfrac{(2n+2)(2n+1)}{(n+1)^2}\,|x|$`, why: 'Factorial ratios (refresher).' },
            { do: String.raw`$= \dfrac{2(2n+1)}{n+1}\,|x|$`, why: String.raw`$2n+2 = 2(n+1)$; cancel one $(n+1)$.` },
            { do: String.raw`$\to 4|x|$`, why: String.raw`$\frac{2(2 + 1/n)}{1 + 1/n} \to 4$.` },
            { do: String.raw`$4|x| < 1 \iff |x| < \tfrac14$: $R = \tfrac14$`, why: 'Divide by 4.' },
          ] },
        { label: '(d)', prompt: String.raw`Interval of convergence of $\displaystyle\sum_{n=1}^\infty \frac{(x-3)^n}{n\,2^n}$`, kind: 'choice', choices: [String.raw`$(1, 5)$`, String.raw`$[1, 5)$`, String.raw`$(1, 5]$`, String.raw`$[1, 5]$`], answer: 1,
          hints: [String.raw`Same as the example in "Interval of convergence" with centre $3$ and $2^n$.`, String.raw`Ratio test: $|x - 3| < 2$, so $1 < x < 5$. Now put $x = 5$ and $x = 1$ into the series.`, String.raw`$x = 5$ gives $\sum \frac1n$; $x = 1$ gives $\sum\frac{(-1)^n}{n}$.`],
          solution: String.raw`Ratio test: $|x - 3| < 2$. At $x = 5$: $\sum\frac1n$ diverges. At $x = 1$: $\sum\frac{(-1)^n}{n}$ converges (alternating series test). Interval $[1, 5)$.` },
        { label: '(e)', prompt: String.raw`Interval of convergence of $\displaystyle\sum_{n=0}^\infty \frac{(2x+1)^n}{n^2 + 1}$`, kind: 'choice', choices: [String.raw`$(-1, 0)$`, String.raw`$[-1, 0]$`, String.raw`$[-1, 0)$`, String.raw`$\left[-\tfrac32, \tfrac12\right]$`], answer: 1,
          hints: [String.raw`Same type as the example in "Inside terms like $(2x-1)$".`, String.raw`The ratio test gives $|2x + 1| < 1$. Solve: $-1 < 2x + 1 < 1$.`, String.raw`$-1 < x < 0$. At both endpoints $|a_n| = \frac{1}{n^2+1} \le \frac{1}{n^2}$.`],
          solution: String.raw`Ratio test: $|2x + 1| < 1 \iff -1 < x < 0$. At both endpoints $|a_n| = \frac1{n^2+1} \le \frac1{n^2}$ (for $n \ge 1$), so both converge absolutely: $[-1, 0]$.` },
      ],
    },
    {
      id: 'a3',
      title: 'Series from the geometric series',
      difficulty: 'core',
      examples: ['geometric-representations', 'integrate-series', 'differentiate-series'],
      statement: String.raw`<p>Use the geometric series, differentiation and integration.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\dfrac{1}{3 - x} = \sum_{n=0}^\infty c_n x^n$. Give $c_n$ as a function of $n$.`, kind: 'expression', variable: 'n', answer: '3.^(-n-1)', domain: [0, 6],
          hints: [String.raw`Same as Example 1 in "Functions as geometric series".`, String.raw`Factor $3$ out of the denominator: $3 - x = 3\left(1 - \frac x3\right)$.`, String.raw`$\frac{1}{3-x} = \frac13\sum\left(\frac{x}{3}\right)^n$.`],
          walkthrough: [
            { do: String.raw`$\dfrac{1}{3-x} = \dfrac13\cdot\dfrac{1}{1 - \frac x3}$`, why: 'Factor out 3 so the bracket starts with 1.' },
            { do: String.raw`$= \dfrac13\sum_{n=0}^\infty \left(\dfrac x3\right)^n$`, why: String.raw`Geometric series with $r = \frac x3$, valid for $|x| < 3$.` },
            { do: String.raw`$= \sum_{n=0}^\infty \dfrac{x^n}{3^{n+1}}$`, why: String.raw`$\frac13\cdot\frac{1}{3^n} = \frac{1}{3^{n+1}}$.` },
            { do: String.raw`$c_n = 3^{-(n+1)}$`, why: 'The coefficient of $x^n$. In MATLAB: <code>3.^(-n-1)</code>.' },
          ] },
        { label: '(b)', prompt: String.raw`The coefficient of $x^6$ in the Maclaurin series of $\dfrac{x^2}{1 + 4x^2}$.`, kind: 'numeric', answer: '16',
          hints: [String.raw`Same as the guided exercise $\frac{x}{1+9x^2}$.`, String.raw`$\frac{1}{1 + 4x^2} = \sum(-4x^2)^n$; then multiply by $x^2$.`, String.raw`The series is $\sum (-4)^n x^{2n+2}$. Which $n$ gives $x^6$?`],
          walkthrough: [
            { do: String.raw`$\dfrac{1}{1 + 4x^2} = \dfrac{1}{1 - (-4x^2)} = \sum_{n=0}^\infty (-4)^n x^{2n}$`, why: String.raw`Geometric series with $r = -4x^2$.` },
            { do: String.raw`$\dfrac{x^2}{1+4x^2} = \sum_{n=0}^\infty (-4)^n x^{2n+2}$`, why: String.raw`Multiply each term by $x^2$.` },
            { do: String.raw`$2n + 2 = 6 \Rightarrow n = 2$`, why: 'Find the term with $x^6$.' },
            { do: String.raw`$(-4)^2 = 16$`, why: 'Put $n = 2$ into the coefficient.' },
          ] },
        { label: '(c)', prompt: String.raw`The coefficient of $x^4$ in the series of $\ln(1 + 2x)$.`, kind: 'numeric', answer: '-4',
          hints: [String.raw`Same as Example 2 and the guided exercise in "Integrating series".`, String.raw`Substitute $u = 2x$ into $\ln(1+u) = \sum \frac{(-1)^{n+1}u^n}{n}$.`, String.raw`For $x^4$ take $n = 4$: $\frac{(-1)^5\, 2^4}{4}$.`],
          walkthrough: [
            { do: String.raw`$\ln(1 + 2x) = \sum_{n=1}^\infty \dfrac{(-1)^{n+1}2^n x^n}{n}$`, why: String.raw`Substitute $u = 2x$; $(2x)^n = 2^n x^n$.` },
            { do: String.raw`$x^4$: $n = 4$`, why: 'The power of $x$ is $n$.' },
            { do: String.raw`$\dfrac{(-1)^{5}\cdot 16}{4} = -4$`, why: String.raw`Sign $(-1)^{4+1} = -1$, $2^4 = 16$.` },
          ] },
        { label: '(d)', prompt: String.raw`The sum $\displaystyle\sum_{n=1}^\infty \frac{n}{3^n}$.`, kind: 'numeric', answer: '3/4',
          hints: [String.raw`Same as the example in "Differentiating series".`, String.raw`Use $\sum n x^n = \frac{x}{(1-x)^2}$ with the right $x$.`, String.raw`$x = \frac13$, so $(1 - x)^2 = \frac49$.`],
          walkthrough: [
            { do: String.raw`$\sum_{n=1}^\infty n x^n = \dfrac{x}{(1-x)^2}$ for $|x| < 1$`, why: 'Differentiate the geometric series and multiply by $x$.' },
            { do: String.raw`$x = \tfrac13$`, why: String.raw`$\frac{n}{3^n} = n\left(\frac13\right)^n$, and $\frac13$ is inside $|x| < 1$.` },
            { do: String.raw`$\dfrac{1/3}{(2/3)^2} = \dfrac{1/3}{4/9}$`, why: 'Substitute.' },
            { do: String.raw`$= \dfrac13\cdot\dfrac94 = \dfrac34$`, why: 'Dividing by a fraction is multiplying by its reciprocal.' },
          ] },
      ],
    },
    {
      id: 'a4',
      title: 'A function defined by an integral',
      difficulty: 'challenge',
      examples: ['integral-series'],
      statement: String.raw`<p>Let $\displaystyle F(x) = \int_0^x \frac{\mathrm d t}{1 + t^4}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`The Maclaurin series of $F$ is $\sum_{n=0}^\infty c_n x^{4n+1}$. Give the coefficient of $x^9$.`, kind: 'numeric', answer: '1/9',
          hints: [String.raw`Same as the example $\int_0^x \frac{\mathrm d t}{1+t^3}$ in "Functions defined by integrals".`, String.raw`$\frac{1}{1+t^4} = \sum(-1)^n t^{4n}$; integrate term by term.`, String.raw`$F(x) = \sum \frac{(-1)^n x^{4n+1}}{4n+1}$; for $x^9$ solve $4n + 1 = 9$.`],
          walkthrough: [
            { do: String.raw`$\dfrac{1}{1 + t^4} = \sum_{n=0}^\infty (-1)^n t^{4n}$`, why: String.raw`Geometric series with ratio $-t^4$.` },
            { do: String.raw`$F(x) = \sum_{n=0}^\infty \dfrac{(-1)^n x^{4n+1}}{4n+1}$`, why: String.raw`Integrate term by term: $\int_0^x t^{4n}\,\mathrm d t = \frac{x^{4n+1}}{4n+1}$.` },
            { do: String.raw`$4n + 1 = 9 \Rightarrow n = 2$`, why: 'Find the term with $x^9$.' },
            { do: String.raw`Coefficient $\dfrac{(-1)^2}{9} = \dfrac19$`, why: 'Put $n = 2$ into the coefficient.' },
          ] },
        { label: '(b)', prompt: 'The radius of convergence:', kind: 'numeric', answer: '1',
          hints: ['Which condition does the geometric series need?', String.raw`$|-t^4| < 1$.`, String.raw`$t^4 < 1 \iff |t| < 1$; integration keeps the radius.`],
          walkthrough: [
            { do: String.raw`Geometric series needs $|{-t^4}| < 1$`, why: 'The ratio must be less than 1 in size.' },
            { do: String.raw`$t^4 < 1 \iff |t| < 1$`, why: 'Take the fourth root.' },
            { do: String.raw`$R = 1$`, why: 'Integration term by term keeps the radius.' },
          ] },
        { label: '(c)', prompt: String.raw`$F(0.5)$ to five decimals, using the series.`, kind: 'numeric', answer: 'integral(@(t) 1./(1+t.^4), 0, 0.5)', tol: 1e-5,
          hints: [String.raw`Put $x = 0.5$ into the series and add terms until the next one is below $10^{-5}$.`, String.raw`$b_n = \frac{0.5^{4n+1}}{4n+1}$: $b_0 = 0.5$, $b_1 = 0.00625$, $b_2 \approx 0.000217$, $b_3 \approx 9.4\cdot10^{-6}$.`, String.raw`Three terms: $0.5 - 0.00625 + 0.000217$.`],
          walkthrough: [
            { do: String.raw`$F(0.5) = 0.5 - \dfrac{0.5^5}{5} + \dfrac{0.5^9}{9} - \dfrac{0.5^{13}}{13} + \cdots$`, why: String.raw`Put $x = 0.5$ into the series of (a).` },
            { do: String.raw`$b_0 = 0.5,\ b_1 = 0.00625,\ b_2 \approx 0.000217,\ b_3 \approx 9.4\cdot 10^{-6}$`, why: 'The sizes of the terms; they decrease to 0, and the signs alternate.' },
            { do: String.raw`$0.5 - 0.00625 + 0.000217 = 0.493967$`, why: String.raw`Three terms; the error is at most $b_3 < 10^{-5}$ (alternating series bound).` },
            { do: String.raw`$F(0.5) \approx 0.49397$ (exact: $0.493958\ldots$)`, why: 'Round to five decimals.' },
          ] },
        { label: '(d)', prompt: String.raw`How many nonzero terms of the series guarantee an error below $10^{-8}$ at $x = 0.5$ (alternating series bound)?`, kind: 'numeric', answer: '6', tol: 1e-9,
          hints: [String.raw`Same as the last steps of the example in "Functions defined by integrals".`, String.raw`With $m$ terms ($n = 0, \dots, m-1$) the error is at most $b_m = \frac{0.5^{4m+1}}{4m+1}$.`, String.raw`$b_5 = \frac{0.5^{21}}{21}$ and $b_6 = \frac{0.5^{25}}{25}$: compare each with $10^{-8}$.`],
          walkthrough: [
            { do: String.raw`$b_n = \dfrac{0.5^{4n+1}}{4n+1}$ positive, decreasing, $\to 0$`, why: 'Conditions of the alternating series test at $x = 0.5$.' },
            { do: String.raw`$m$ terms $\Rightarrow$ error $\le b_m$`, why: 'The first omitted term is $n = m$.' },
            { do: String.raw`$b_5 = \dfrac{0.5^{21}}{21} \approx 2.3\cdot 10^{-8}$: too large`, why: String.raw`$0.5^{21} \approx 4.77\cdot10^{-7}$.` },
            { do: String.raw`$b_6 = \dfrac{0.5^{25}}{25} \approx 1.2\cdot 10^{-9} < 10^{-8}$`, why: String.raw`$0.5^{25} \approx 2.98\cdot10^{-8}$.` },
            { do: String.raw`$6$ terms`, why: String.raw`$m = 6$ is the first with $b_m < 10^{-8}$.` },
          ] },
      ],
    },
    {
      id: 'a1',
      title: 'Interval of convergence with a substitution',
      difficulty: 'challenge',
      hw: 'HW6-style',
      examples: ['substitution-endpoints', 'interval'],
      statement: String.raw`<p>Consider the power series $\displaystyle\sum_{n=1}^{\infty} \frac{(4x-1)^{3n}}{8^n\sqrt n}$.</p>`,
      parts: [
        { label: '(a)', prompt: 'The centre $a$ of the series:', kind: 'numeric', answer: '1/4',
          hints: [String.raw`Write $4x - 1$ as a number times $(x - a)$.`, String.raw`Factor out 4: $4x - 1 = 4\left(x - \dots\right)$.`, String.raw`$4x - 1 = 4\left(x - \frac14\right)$.`],
          walkthrough: [
            { do: String.raw`$4x - 1 = 4\left(x - \tfrac14\right)$`, why: 'Factor out the coefficient of $x$.' },
            { do: String.raw`$(4x - 1)^{3n} = 4^{3n}\left(x - \tfrac14\right)^{3n}$`, why: 'Power of a product.' },
            { do: String.raw`$a = \tfrac14$`, why: String.raw`The series is in powers of $x - \frac14$.` },
          ] },
        { label: '(b)', prompt: 'The radius of convergence $R$:', kind: 'numeric', answer: '1/2',
          hints: [String.raw`Same as Example 2 in "Substitutions": use $u = \left(\frac{4x-1}{2}\right)^3$.`, String.raw`$8^n = 2^{3n}$, so the series is $\sum \frac{u^n}{\sqrt n}$; the ratio test gives $\sqrt{\frac{n}{n+1}}|u| \to |u|$.`, String.raw`$|u| < 1 \iff |4x - 1| < 2$.`],
          walkthrough: [
            { do: String.raw`$u = \left(\dfrac{4x-1}{2}\right)^3$, series $\sum \dfrac{u^n}{\sqrt n}$`, why: String.raw`$8^n = 2^{3n}$, so $\frac{(4x-1)^{3n}}{8^n} = u^n$.` },
            { do: String.raw`$\left|\dfrac{a_{n+1}}{a_n}\right| = \sqrt{\dfrac{n}{n+1}}\,|u| \to |u|$`, why: 'Ratio test in $u$.' },
            { do: String.raw`$|u| < 1 \iff |4x - 1| < 2$`, why: 'Cube root, then multiply by 2.' },
            { do: String.raw`$\iff 4\left|x - \tfrac14\right| < 2 \iff \left|x - \tfrac14\right| < \tfrac12$`, why: String.raw`Factor out 4 and divide by it.` },
            { do: String.raw`$R = \tfrac12$`, why: 'Read off the radius.' },
          ] },
        { label: '(c)', prompt: 'The interval of convergence:', kind: 'choice', choices: [String.raw`$\left(-\tfrac14, \tfrac34\right)$`, String.raw`$\left[-\tfrac14, \tfrac34\right)$`, String.raw`$\left(-\tfrac14, \tfrac34\right]$`, String.raw`$\left[-\tfrac14, \tfrac34\right]$`], answer: 1,
          hints: [String.raw`The open interval is $-\frac14 < x < \frac34$. Find $u$ at each endpoint.`, String.raw`At $x = \frac34$: $4x - 1 = 2$, $u = 1$. At $x = -\frac14$: $4x - 1 = -2$, $u = -1$ (odd power!).`, String.raw`$\sum\frac{1}{\sqrt n}$ is a $p$-series with $p = \frac12$; $\sum\frac{(-1)^n}{\sqrt n}$ — alternating series test.`],
          solution: String.raw`At $x = \tfrac34$: $u = 1$, $\sum \frac1{\sqrt n}$ diverges ($p = \tfrac12$). At $x = -\tfrac14$: $u = -1$, $\sum \frac{(-1)^n}{\sqrt n}$ converges by the alternating series test. Interval $\left[-\tfrac14, \tfrac34\right)$.` },
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
  ],
};
