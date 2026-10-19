// Module 14: Improper integrals

export default {
  id: 'improper',
  number: 14,
  part: 'techniques',
  hw: 'HW2',
  title: 'Improper integrals',
  summary: 'Integrals over infinite intervals and of unbounded integrands, defined as limits; p-integrals and the comparison test; probability densities (normalising constant, mean, and a density without a mean); integral() with Inf and endpoint singularities. Ends with a Homework-2-style capstone set.',
  intro: String.raw`<p>The definite integral $\int_a^b f(x)\,\mathrm d x$ was defined for a bounded function on a bounded interval. Engineering needs more: the total energy of a decaying signal ($\int_0^\infty$), the work done to escape a gravitational field, or the mean of a probability distribution. An <b>improper integral</b> is the limit of ordinary integrals as the interval grows or as we approach a point where the integrand blows up. The limit may exist (the integral <b>converges</b>) or not (it <b>diverges</b>) — deciding which is half of every problem.</p>`,
  lessons: [
    {
      id: 'infinite-intervals',
      title: 'Type I: infinite intervals',
      blocks: [
        { type: 'text', html: String.raw`<p>Drag the upper limit $t$ to the right, or press the animation button. The shaded area $\int_1^t x^{-2}\,\mathrm d x = 1 - 1/t$ grows with $t$ but never exceeds 1: the lower graph shows it levelling off. The infinitely long region has finite area.</p>` },
        { type: 'widget', name: 'improper', config: {
          title: 'Area under 1/x² on [1, t] as t → ∞',
          f: '1./x.^2', a: 1, singular: 'infinite', value: 1, valueTex: '1', tmax: 200,
          xlim: [0, 12], ylim: [-0.1, 1.2],
        } },
        { type: 'text', html: String.raw`<p>Compare with $1/x$: the graph looks almost the same, yet $\int_1^t x^{-1}\,\mathrm d x = \ln t$ grows without bound. Whether the tail is "thin enough" is a quantitative question.</p>` },
        { type: 'widget', name: 'improper', config: {
          title: 'Area under 1/x on [1, t] keeps growing',
          f: '1./x', a: 1, singular: 'infinite', diverges: true, tmax: 1000,
          xlim: [0, 12], ylim: [-0.1, 1.2],
        } },
        { type: 'callout', kind: 'def', title: 'Improper integral of type I', html: String.raw`<p>If $f$ is continuous on $[a, \infty)$,
$$\int_a^\infty f(x)\,\mathrm d x = \lim_{t\to\infty} \int_a^t f(x)\,\mathrm d x .$$
The integral <b>converges</b> if the limit exists as a finite number, otherwise it <b>diverges</b>. Similarly $\int_{-\infty}^b f(x)\,\mathrm d x = \lim_{s\to-\infty}\int_s^b f(x)\,\mathrm d x$. Over the whole line we split at any point $c$:
$$\int_{-\infty}^{\infty} f(x)\,\mathrm d x = \int_{-\infty}^{c} f(x)\,\mathrm d x + \int_{c}^{\infty} f(x)\,\mathrm d x ,$$
and the integral converges only if <b>both</b> halves converge.</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int_0^\infty x e^{-x}\,\mathrm d x$`, steps: [
          String.raw`We replace the infinite limit by $t$ and integrate by parts with $u = x$, $\mathrm d v = e^{-x}\,\mathrm d x$, so $\mathrm d u = \mathrm d x$, $v = -e^{-x}$:
$$\int_0^t x e^{-x}\,\mathrm d x = \Big[-x e^{-x}\Big]_0^t + \int_0^t e^{-x}\,\mathrm d x = -t e^{-t} + 1 - e^{-t}.$$`,
          String.raw`We let $t \to \infty$. Since $e^{-t} \to 0$ and $t e^{-t} = t/e^{t} \to 0$ (l'Hospital: $1/e^t \to 0$),
$$\int_0^\infty x e^{-x}\,\mathrm d x = \lim_{t\to\infty}\big(1 - t e^{-t} - e^{-t}\big) = 1 .$$`,
          String.raw`The integral converges and its value is $1$.`,
        ] },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int_{-\infty}^{\infty} \frac{\mathrm d x}{1+x^2}$`, steps: [
          String.raw`We split at $c = 0$ and treat each half as a limit. For the right half,
$$\int_0^\infty \frac{\mathrm d x}{1+x^2} = \lim_{t\to\infty} \arctan t - \arctan 0 = \frac{\pi}{2}.$$`,
          String.raw`For the left half, $\displaystyle\int_{-\infty}^0 \frac{\mathrm d x}{1+x^2} = \arctan 0 - \lim_{s\to-\infty}\arctan s = \frac{\pi}{2}$.`,
          String.raw`Both halves converge, so the integral converges and equals $\pi/2 + \pi/2 = \pi$.`,
        ] },
        { type: 'callout', kind: 'warn', title: 'Do not take one symmetric limit', html: String.raw`<p>$\lim_{t\to\infty}\int_{-t}^{t} x\,\mathrm d x = 0$, but $\int_{-\infty}^{\infty} x\,\mathrm d x$ <b>diverges</b>, because $\int_0^\infty x\,\mathrm d x$ already diverges. The two halves must converge separately.</p>` },
        { type: 'quiz', question: String.raw`What is $\displaystyle\int_1^\infty \frac{\mathrm d x}{x^3}$?`, choices: [String.raw`$\tfrac13$`, String.raw`$\tfrac12$`, String.raw`$1$`, 'It diverges'], answer: 1, explain: String.raw`$\int_1^t x^{-3}\,\mathrm d x = \big[-\tfrac{1}{2x^2}\big]_1^t = \tfrac12 - \tfrac{1}{2t^2} \to \tfrac12$.` },
        { type: 'quiz', question: String.raw`Which integral converges?`, choices: [String.raw`$\int_0^\infty \cos x\,\mathrm d x$`, String.raw`$\int_0^\infty e^{-2x}\,\mathrm d x$`, String.raw`$\int_{-\infty}^\infty x^3\,\mathrm d x$`, String.raw`$\int_1^\infty \frac{\mathrm d x}{\sqrt x}$`], answer: 1, explain: String.raw`$\int_0^t e^{-2x}\,\mathrm d x = \tfrac12(1 - e^{-2t}) \to \tfrac12$. $\int_0^t\cos x\,\mathrm d x = \sin t$ oscillates (no limit), $x^3$ is odd but each half diverges, and $\int_1^t x^{-1/2}\,\mathrm d x = 2\sqrt t - 2 \to \infty$.` },
      ],
    },
    {
      id: 'unbounded-integrands',
      title: 'Type II: unbounded integrands and p-integrals',
      blocks: [
        { type: 'text', html: String.raw`<p>Now the interval is bounded but the integrand is not: $1/\sqrt x \to \infty$ as $x \to 0^+$. Cut away a small piece $[0, t]$ and move the cut-off $t$ towards the singularity. The lower graph uses a logarithmic scale for the distance $t - 0$.</p>` },
        { type: 'widget', name: 'improper', config: {
          title: 'Area under 1/√x on [t, 1] as t → 0⁺',
          f: '1./sqrt(x)', a: 0, b: 1, singular: 'lower', value: 2, valueTex: '2',
          xlim: [-0.05, 1.1], ylim: [-0.5, 12],
        } },
        { type: 'callout', kind: 'def', title: 'Improper integral of type II', html: String.raw`<p>If $f$ is continuous on $(a, b]$ and unbounded near $a$,
$$\int_a^b f(x)\,\mathrm d x = \lim_{t\to a^+}\int_t^b f(x)\,\mathrm d x ,$$
and similarly at the upper endpoint. If the singularity is at an interior point $c$, split: $\int_a^b = \int_a^c + \int_c^b$, and both parts must converge.</p>` },
        { type: 'table', head: ['p-integral', 'converges when', 'value'], rows: [
          [String.raw`$\displaystyle\int_1^\infty \frac{\mathrm d x}{x^p}$`, String.raw`$p > 1$`, String.raw`$\dfrac{1}{p-1}$`],
          [String.raw`$\displaystyle\int_0^1 \frac{\mathrm d x}{x^p}$`, String.raw`$p < 1$`, String.raw`$\dfrac{1}{1-p}$`],
          [String.raw`$\displaystyle\int_0^\infty \frac{\mathrm d x}{x^p}$`, 'never', String.raw`one end always diverges`],
        ] },
        { type: 'callout', kind: 'key', html: String.raw`<p>The two p-integrals are mirror images: at infinity the integrand must decay <b>faster</b> than $1/x$; at $0$ it may blow up only <b>slower</b> than $1/x$. The borderline $p = 1$ diverges at both ends ($\ln t \to \pm\infty$).</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int_0^3 \frac{\mathrm d x}{(x-1)^{2/3}}$`, steps: [
          String.raw`The integrand is unbounded at the interior point $x = 1$, so we split the integral there: $\int_0^3 = \int_0^1 + \int_1^3$. An antiderivative is $F(x) = 3(x-1)^{1/3}$ (the real cube root, defined for negative arguments as well).`,
          String.raw`We take the left part as a limit from below:
$$\int_0^1 \frac{\mathrm d x}{(x-1)^{2/3}} = \lim_{t\to 1^-}\Big[3(x-1)^{1/3}\Big]_0^t = 0 - 3(-1) = 3 .$$`,
          String.raw`We take the right part as a limit from above:
$$\int_1^3 \frac{\mathrm d x}{(x-1)^{2/3}} = \lim_{s\to 1^+}\Big[3(x-1)^{1/3}\Big]_s^3 = 3\sqrt[3]{2} .$$`,
          String.raw`Both parts converge, so the integral equals $3 + 3\sqrt[3]{2} \approx 6.780$.`,
        ] },
        { type: 'callout', kind: 'warn', title: 'Hidden singularities', html: String.raw`<p>Blindly applying the Fundamental Theorem to $\int_{-1}^{1} x^{-2}\,\mathrm d x$ gives $\big[-1/x\big]_{-1}^{1} = -2$ — a negative number for a positive integrand. The FTC needs a continuous integrand; here $x = 0$ is a singularity and $\int_0^1 x^{-2}\,\mathrm d x$ diverges, so the whole integral diverges. Always look for zeros of denominators and logarithms of zero inside $[a, b]$.</p>` },
        { type: 'steps', title: String.raw`Example: $\displaystyle\int_0^1 \ln x\,\mathrm d x$`, steps: [
          String.raw`$\ln x \to -\infty$ as $x\to 0^+$, so we integrate from $t$ to $1$. By parts with $u = \ln x$, $\mathrm d v = \mathrm d x$:
$$\int_t^1 \ln x\,\mathrm d x = \Big[x\ln x - x\Big]_t^1 = -1 - t\ln t + t .$$`,
          String.raw`We need the limit $t\ln t$ as $t \to 0^+$, a $0\cdot\infty$ form. Writing it as $\dfrac{\ln t}{1/t}$ and using l'Hospital: $\dfrac{1/t}{-1/t^2} = -t \to 0$.`,
          String.raw`Hence $\displaystyle\int_0^1 \ln x\,\mathrm d x = -1$.`,
        ] },
        { type: 'quiz', question: String.raw`Which of these converge? (Select all.)`, choices: [String.raw`$\int_0^1 x^{-0.9}\,\mathrm d x$`, String.raw`$\int_1^\infty x^{-0.9}\,\mathrm d x$`, String.raw`$\int_0^1 x^{-1.1}\,\mathrm d x$`, String.raw`$\int_1^\infty x^{-1.1}\,\mathrm d x$`], answer: [0, 3], explain: String.raw`On $[0,1]$ we need $p < 1$ ($p = 0.9$ works, value $10$); on $[1,\infty)$ we need $p > 1$ ($p = 1.1$ works, value $10$).` },
      ],
    },
    {
      id: 'comparison',
      title: 'Comparison tests',
      blocks: [
        { type: 'text', html: String.raw`<p>Many integrands have no elementary antiderivative — $e^{-x^2}$ is the famous one. We can still decide convergence by trapping the integrand under (or above) a function whose integral we know. Move $t$: the area under $e^{-x^2}$ on $[1, t]$ always stays below the area under $e^{-x}$, which is at most $e^{-1}$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'e^(−x²) ≤ e^(−x) for x ≥ 1',
          functions: [{ expr: 'exp(-x)', label: String.raw`$e^{-x}$` }, { expr: 'exp(-x.^2)', label: String.raw`$e^{-x^2}$` }],
          params: { t: { min: 1.1, max: 6, value: 3, label: '$t$' } },
          shade: { expr: 'exp(-x.^2)', from: 1, to: 't' },
          xlim: [0, 6], ylim: [-0.05, 1.05],
          animate: { param: 't', from: 1.1, to: 6, duration: 5000 },
          readout: String.raw`$\int_1^t e^{-x}\,dx = {{exp(-1) - exp(-t)}}$ bounds the shaded area for every $t$; the bound tends to $e^{-1} = {{exp(-1)}}$.`,
        } },
        { type: 'callout', kind: 'thm', title: 'Comparison test', html: String.raw`<p>Let $0 \le f(x) \le g(x)$ for $x \ge a$.</p><ul><li>If $\int_a^\infty g(x)\,\mathrm d x$ converges, so does $\int_a^\infty f(x)\,\mathrm d x$ (the smaller area is trapped).</li><li>If $\int_a^\infty f(x)\,\mathrm d x$ diverges, so does $\int_a^\infty g(x)\,\mathrm d x$ (the larger area is pushed to $\infty$).</li></ul><p>The same holds for type II integrals. <b>Limit comparison:</b> if $f, g > 0$ and $f(x)/g(x) \to L$ with $0 < L < \infty$, then both integrals converge or both diverge.</p>` },
        { type: 'steps', title: String.raw`Example: does $\displaystyle\int_1^\infty \frac{2 + \sin x}{\sqrt{x}}\,\mathrm d x$ converge?`, steps: [
          String.raw`We look for a simple lower bound, because the integrand behaves like $1/\sqrt x$, whose integral diverges. Since $\sin x \ge -1$, the numerator is at least $1$:
$$\frac{2+\sin x}{\sqrt x} \ge \frac{1}{\sqrt x} > 0 \qquad (x \ge 1).$$`,
          String.raw`$\int_1^\infty x^{-1/2}\,\mathrm d x$ is a p-integral with $p = \tfrac12 \le 1$, so it diverges.`,
          String.raw`By the comparison test the larger integral $\int_1^\infty \frac{2+\sin x}{\sqrt x}\,\mathrm d x$ diverges as well.`,
        ] },
        { type: 'steps', title: String.raw`Example (limit comparison): $\displaystyle\int_1^\infty \frac{x+3}{x^3+x}\,\mathrm d x$`, steps: [
          String.raw`For large $x$ the integrand behaves like $x/x^3 = 1/x^2$. We compare with $g(x) = 1/x^2$:
$$\lim_{x\to\infty}\frac{(x+3)/(x^3+x)}{1/x^2} = \lim_{x\to\infty}\frac{x^3+3x^2}{x^3+x} = 1 .$$`,
          String.raw`The limit is finite and positive and $\int_1^\infty x^{-2}\,\mathrm d x$ converges ($p = 2 > 1$), so the given integral converges.`,
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>A comparison must point the right way. $\frac{1}{x^2+1} \le \frac{1}{x}$ is true but useless: being below a divergent integral proves nothing. Use $\frac{1}{x^2+1} \le \frac{1}{x^2}$ instead.</p>` },
        { type: 'quiz', question: String.raw`$\displaystyle\int_0^1 \frac{e^x}{x}\,\mathrm d x$ …`, choices: [String.raw`converges, because $e^x/x \le e/x$`, String.raw`diverges, because $e^x/x \ge 1/x$ and $\int_0^1 \frac{\mathrm d x}{x}$ diverges`, String.raw`converges, because $e^x$ is bounded on $[0,1]$`, 'cannot be decided by comparison'], answer: 1, explain: String.raw`For $0 < x \le 1$, $e^x \ge 1$, so $e^x/x \ge 1/x$. The p-integral with $p = 1$ diverges at $0$, so the larger one diverges. The first option compares with a divergent integral from above, which proves nothing.` },
      ],
    },
    {
      id: 'densities',
      title: 'Probability densities',
      blocks: [
        { type: 'text', html: String.raw`<p>A continuous random variable $X$ is described by a <b>probability density</b> $f(x) \ge 0$: probabilities are areas, $P(a \le X \le b) = \int_a^b f(x)\,\mathrm d x$. Lifetimes, waiting times and measurement errors have densities on unbounded intervals, so improper integrals are unavoidable. Move the rate $\lambda$ and the cut-off $b$ of the exponential density:</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Exponential density f(x) = λ e^(−λx), x ≥ 0',
          functions: [{ expr: 'lam*exp(-lam*x).*(x >= 0)', label: String.raw`$\lambda e^{-\lambda x}$` }],
          params: { lam: { min: 0.2, max: 3, value: 1, label: String.raw`$\lambda$` }, b: { min: 0.1, max: 10, value: 2, label: '$b$' } },
          shade: { expr: 'lam*exp(-lam*x)', from: 0, to: 'b' },
          xlim: [-0.5, 10], ylim: [-0.1, 3.1],
          readout: String.raw`$P(0 \le X \le b) = 1 - e^{-\lambda b} = {{1 - exp(-lam*b)}}$. Mean $1/\lambda = {{1/lam}}$.`,
        } },
        { type: 'callout', kind: 'def', title: 'Density, normalisation and mean', html: String.raw`<p>$f$ is a probability density if $f(x) \ge 0$ and
$$\int_{-\infty}^{\infty} f(x)\,\mathrm d x = 1 .$$
If $f = c\,g$ with a known shape $g$, the <b>normalising constant</b> is $c = 1\big/\int g$. The <b>mean</b> (expected value) is
$$\mu = E[X] = \int_{-\infty}^{\infty} x f(x)\,\mathrm d x ,$$
and it <b>exists only if this improper integral converges</b> (in the sense of both halves converging separately).</p>` },
        { type: 'steps', title: String.raw`Example: $f(x) = \dfrac{c}{(1+x)^3}$ for $x \ge 0$ (and $0$ otherwise)`, steps: [
          String.raw`We find $c$ from the normalisation condition. With $u = 1 + x$:
$$\int_0^\infty \frac{\mathrm d x}{(1+x)^3} = \lim_{t\to\infty}\Big[-\frac{1}{2(1+x)^2}\Big]_0^t = \frac12, \qquad\text{so}\quad c = 2 .$$`,
          String.raw`We compute the mean. Writing $x = (1+x) - 1$ splits the integrand into two p-type terms:
$$\mu = \int_0^\infty \frac{2x}{(1+x)^3}\,\mathrm d x = 2\int_0^\infty \Big(\frac{1}{(1+x)^2} - \frac{1}{(1+x)^3}\Big)\mathrm d x = 2\Big(1 - \frac12\Big) = 1 .$$`,
          String.raw`The mean exists and equals $1$. Note why: $x f(x) \sim 2/x^2$ for large $x$, a convergent tail.`,
        ] },
        { type: 'steps', title: String.raw`A density without a mean: $f(x) = \dfrac{1}{x^2}$ for $x \ge 1$`, steps: [
          String.raw`We check normalisation: $\int_1^\infty x^{-2}\,\mathrm d x = 1$, so $f$ is a density.`,
          String.raw`The mean would be $\int_1^\infty x\cdot x^{-2}\,\mathrm d x = \int_1^\infty \frac{\mathrm d x}{x} = \lim_{t\to\infty}\ln t = \infty$.`,
          String.raw`The integral diverges, so <b>the mean does not exist</b>. The tail $f(x) \sim x^{-2}$ is thin enough for the total probability to be finite, but $x f(x) \sim x^{-1}$ is not thin enough for the mean. Heavy-tailed distributions like this (and the Cauchy distribution) appear in physics and finance.`,
        ] },
        { type: 'quiz', question: String.raw`For which $\alpha$ does the density $f(x) = (\alpha - 1)x^{-\alpha}$, $x \ge 1$, have a finite mean?`, choices: [String.raw`$\alpha > 1$`, String.raw`$\alpha > 2$`, String.raw`$\alpha > 3$`, String.raw`for no $\alpha$`], answer: 1, explain: String.raw`The mean needs $\int_1^\infty x^{1-\alpha}\,\mathrm d x$ to converge, i.e. $\alpha - 1 > 1$. (For $\alpha > 1$ the function is a density, but the mean needs $\alpha > 2$.)` },
      ],
    },
  ],
  matlab: [
    {
      id: 'integral-inf',
      title: 'integral() with Inf and singular endpoints',
      blocks: [
        { type: 'text', html: String.raw`<p><code>integral</code> accepts <code>Inf</code> and <code>-Inf</code> as limits, and it never evaluates the integrand exactly at the endpoints, so an integrable singularity at $a$ or $b$ is fine. Use it to <b>check</b> a hand computation — never as the proof of convergence.</p>` },
        { type: 'code', caption: 'Convergent improper integrals: compare with the exact values.', editable: true, code: `I1 = integral(@(x) exp(-x.^2), -Inf, Inf)     % exact sqrt(pi)
sqrt(pi)
I2 = integral(@(x) 1./sqrt(x), 0, 1)            % exact 2
I3 = integral(@(x) x.*exp(-x), 0, Inf)          % exact 1
I4 = integral(@(x) log(x), 0, 1)                % exact -1` },
        { type: 'callout', kind: 'matlab', title: 'Read the warnings', html: String.raw`<p>When the integral diverges, <code>integral</code> cannot know that. It prints a warning such as <i>"Reached the limit on the maximum number of intervals"</i> or <i>"Infinite or Not-a-Number value encountered"</i> and returns a meaningless number (huge, or <code>NaN</code>). A warning means: go back and analyse the integral by hand.</p>` },
        { type: 'code', caption: 'Divergent integrals produce warnings, not answers.', code: `J1 = integral(@(x) 1./x, 0, 1)
J2 = integral(@(x) 1./x, 1, Inf)` },
        { type: 'text', html: String.raw`<p>A convincing numerical picture of a limit is a <b>table of partial integrals</b> $\int_a^t f$ for growing $t$. A converging sequence settles; a diverging one keeps growing (for $1/x$ by $\ln 10 \approx 2.30$ per decade).</p>` },
        { type: 'code', caption: 'Partial integrals in a loop', editable: true, code: `f = @(x) 1./x.^2;
g = @(x) 1./x;
for k = 1:6
    t = 10^k;
    fprintf('t = 1e%d:  int f = %.6f   int g = %.4f\\n', k, integral(f, 1, t), integral(g, 1, t));
end` },
        { type: 'text', html: String.raw`<p>Near a singularity, plot on a range that stops short of it. A logarithmic $x$-axis is not available everywhere, so plot on $[10^{-4}, 1]$ and look at the size of the values.</p>` },
        { type: 'code', caption: 'Plotting an integrand with an endpoint singularity', code: `f = @(x) log(x) ./ x.^(1/3);
fplot(f, [1e-4 1])
grid on
title('ln(x)/x^{1/3} is unbounded near 0 but integrable')` },
        { type: 'matlab', prompt: String.raw`Compute $I = \displaystyle\int_0^\infty \frac{\mathrm d x}{x^2+4}$ numerically with <code>integral</code>. (By hand: $\tfrac12\arctan\tfrac x2$ gives $\pi/4$.)`, starter: `I = 0   % replace 0 by integral(f, a, b) with the right f, a, b`, solution: `I = integral(@(x) 1./(x.^2 + 4), 0, Inf)`, checks: [{ var: 'I', value: 'pi/4', tol: 1e-6 }, { uses: 'integral' }, { noWarning: true }] },
        { type: 'matlab', prompt: String.raw`Store the partial integrals $P_k = \int_1^{10^k} x^{-1.5}\,\mathrm d x$ for $k = 1, \dots, 6$ in a vector <code>P</code> (use a loop). By hand, $P_k = 2 - 2\cdot 10^{-k/2} \to 2$.`, starter: `P = zeros(1, 6);\nfor k = 1:6\n    P(k) = 0;   % replace 0 by the integral from 1 to 10^k\nend\nP`, solution: `P = zeros(1, 6);\nfor k = 1:6\n    P(k) = integral(@(x) x.^(-1.5), 1, 10^k);\nend\nP`, checks: [{ var: 'P', size: 6 }, { var: 'P', value: '2 - 2*10^(-1/2)', tol: 1e-6, message: 'P(1) should be the integral from 1 to 10.' }, { uses: 'integral' }] },
        { type: 'matlab', prompt: String.raw`The density $f(x) = c\,x e^{-x/2}$ on $x \ge 0$ needs a normalising constant. Compute <code>c</code> as <code>1/integral(...)</code> and then the mean <code>mu</code> $= \int_0^\infty x f(x)\,\mathrm d x$. (By hand: $c = 1/4$ and $\mu = 4$.)`, starter: `g = @(x) x .* exp(-x/2);\nc = 0     % replace 0 by 1/integral(g, 0, Inf)\nmu = 0    % replace 0 by the mean`, solution: `g = @(x) x .* exp(-x/2);\nc = 1 / integral(g, 0, Inf)\nmu = integral(@(x) x .* c .* g(x), 0, Inf)`, checks: [{ var: 'c', value: 0.25, tol: 1e-6 }, { var: 'mu', value: 4, tol: 1e-6 }] },
      ],
    },
    {
      id: 'improper-writeup',
      title: 'Writing up an improper integral',
      blocks: [
        { type: 'text', html: String.raw`<p>In a homework answer the limit must be <b>visible</b>: introduce $t$, compute the proper integral, then take the limit in a separate, justified step. A divergence answer names the reason (a limit that is infinite or does not exist, or a comparison). The numerical check comes last.</p>` },
        { type: 'livescript', caption: 'Model answer: an integral with a singularity at the lower endpoint', blocks: [
          { type: 'heading', content: 'Problem (Attempted)' },
          { type: 'text', content: 'The integrand of $\\int_0^1 \\frac{\\ln x}{x^2}\\,\\mathrm d x$ is unbounded at $x = 0$, so we integrate from $t > 0$ and let $t \\to 0^+$. We integrate by parts with $u = \\ln x$ and $\\mathrm d v = x^{-2}\\,\\mathrm d x$, so $\\mathrm d u = \\frac{1}{x}\\mathrm d x$ and $v = -\\frac{1}{x}$:' },
          { type: 'equation', content: String.raw`\int_t^1 \frac{\ln x}{x^2}\,\mathrm d x = \Big[-\frac{\ln x}{x}\Big]_t^1 + \int_t^1 \frac{\mathrm d x}{x^2} = \frac{\ln t}{t} + \Big(\frac1t - 1\Big) = \frac{1 + \ln t}{t} - 1 .` },
          { type: 'text', content: 'We take the limit. As $t \\to 0^+$ the numerator $1 + \\ln t \\to -\\infty$ while $t \\to 0^+$, so the quotient tends to $-\\infty$:' },
          { type: 'equation', content: String.raw`\lim_{t\to 0^+}\Big(\frac{1+\ln t}{t} - 1\Big) = -\infty .` },
          { type: 'text', content: 'Hence the integral **diverges**. The partial integrals confirm it: they decrease without bound as $t \\to 0^+$.' },
          { type: 'code', content: "f = @(x) log(x) ./ x.^2;\nfor k = 1:5\n    t = 10^(-k);\n    fprintf('t = 1e-%d:  %.2f\\n', k, integral(f, t, 1));\nend" },
        ] },
        { type: 'callout', kind: 'exam', html: String.raw`<p>Write "$\int_0^\infty \dots = \lim_{t\to\infty}\int_0^t \dots$" explicitly. Answers that plug $\infty$ into an antiderivative ("$-e^{-\infty} = 0$") lose points even when the number is right.</p>` },
        { type: 'latex', prompt: 'Type the definition of a type I improper integral:', target: String.raw`\int_a^\infty f(x)\,\mathrm d x = \lim_{t \to \infty} \int_a^t f(x)\,\mathrm d x` },
        { type: 'latex', prompt: 'Type this one-sided limit:', target: String.raw`\lim_{t \to 0^+} t \ln t = 0` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Infinite intervals',
      difficulty: 'core',
      statement: String.raw`<p>Evaluate each integral or decide that it diverges.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int_2^\infty \frac{3}{x^4}\,\mathrm d x$`, kind: 'numeric', answer: '1/8', hint: String.raw`Antiderivative $-x^{-3}$; then let the upper limit tend to infinity.`, solution: String.raw`$\int_2^t 3x^{-4}\,\mathrm d x = \big[-x^{-3}\big]_2^t = \tfrac18 - t^{-3} \to \tfrac18$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_0^\infty e^{-3x}\,\mathrm d x$`, kind: 'numeric', answer: '1/3', solution: String.raw`$\int_0^t e^{-3x}\,\mathrm d x = \tfrac13\big(1 - e^{-3t}\big) \to \tfrac13$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_{-\infty}^0 x e^{x}\,\mathrm d x$`, kind: 'numeric', answer: '-1', hint: String.raw`By parts: $\int x e^x\,\mathrm d x = (x-1)e^x$. Then $s e^{s} \to 0$ as $s \to -\infty$.`, solution: String.raw`$\int_s^0 x e^x\,\mathrm d x = \big[(x-1)e^x\big]_s^0 = -1 - (s-1)e^{s}$. As $s \to -\infty$, $(s-1)e^s \to 0$ (exponential beats polynomial), so the value is $-1$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\int_1^\infty \frac{\mathrm d x}{x^{0.99}}$`, kind: 'choice', choices: ['converges to $100$', 'converges to $1/0.99$', 'diverges'], answer: 2, solution: String.raw`p-integral at infinity with $p = 0.99 \le 1$: $\int_1^t x^{-0.99}\,\mathrm d x = 100(t^{0.01} - 1) \to \infty$. Diverges — slowly, but it diverges.` },
        { label: '(e)', prompt: String.raw`$\displaystyle\int_{-\infty}^{\infty} \frac{x}{1+x^2}\,\mathrm d x$`, kind: 'choice', choices: ['$0$, because the integrand is odd', String.raw`$\pi$`, 'diverges'], answer: 2, solution: String.raw`Split at $0$: $\int_0^t \frac{x}{1+x^2}\,\mathrm d x = \tfrac12\ln(1+t^2) \to \infty$. One half diverges, so the integral diverges. Symmetry cancels only when both halves converge.` },
      ],
    },
    {
      id: 'a2',
      title: 'Unbounded integrands',
      difficulty: 'core',
      statement: String.raw`<p>Evaluate each integral or decide that it diverges. Locate the singularity first.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int_0^4 \frac{\mathrm d x}{\sqrt x}$`, kind: 'numeric', answer: '4', solution: String.raw`$\int_t^4 x^{-1/2}\,\mathrm d x = 4 - 2\sqrt t \to 4$ as $t \to 0^+$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_0^8 \frac{\mathrm d x}{\sqrt[3]{x}}$`, kind: 'numeric', answer: '6', solution: String.raw`$\int_t^8 x^{-1/3}\,\mathrm d x = \tfrac32\big(8^{2/3} - t^{2/3}\big) = \tfrac32(4 - t^{2/3}) \to 6$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_1^3 \frac{\mathrm d x}{\sqrt{x-1}}$`, kind: 'numeric', answer: '2*sqrt(2)', solution: String.raw`$\int_t^3 (x-1)^{-1/2}\,\mathrm d x = 2\sqrt2 - 2\sqrt{t-1} \to 2\sqrt2$ as $t \to 1^+$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\int_0^3 \frac{\mathrm d x}{(x-2)^2}$`, kind: 'choice', choices: [String.raw`$-\tfrac32$`, String.raw`$\tfrac32$`, 'diverges'], answer: 2, hint: 'Is the integrand continuous on $[0, 3]$?', solution: String.raw`$x = 2$ is an interior singularity. $\int_0^t (x-2)^{-2}\,\mathrm d x = -\frac{1}{t-2} - \frac12 \to \infty$ as $t\to 2^-$, so the integral diverges. The value $-\tfrac32$ comes from ignoring the singularity.` },
        { label: '(e)', prompt: String.raw`$\displaystyle\int_0^{\pi/2} \tan x\,\mathrm d x$`, kind: 'choice', choices: ['$1$', String.raw`$\ln 2$`, 'diverges'], answer: 2, solution: String.raw`$\int_0^t \tan x\,\mathrm d x = -\ln\cos t \to \infty$ as $t \to \pi/2^-$. Diverges.` },
      ],
    },
    {
      id: 'a3',
      title: 'Comparison',
      difficulty: 'core',
      statement: String.raw`<p>Decide convergence without computing the integral. Each part names a suitable comparison in the solution.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int_1^\infty \frac{\cos^2 x}{x^2}\,\mathrm d x$`, kind: 'choice', choices: ['converges', 'diverges'], answer: 0, solution: String.raw`$0 \le \cos^2 x / x^2 \le 1/x^2$ and $\int_1^\infty x^{-2}\,\mathrm d x$ converges.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_2^\infty \frac{\mathrm d x}{\ln x}$`, kind: 'choice', choices: ['converges', 'diverges'], answer: 1, solution: String.raw`$\ln x < x$ for $x \ge 2$, so $1/\ln x > 1/x$, and $\int_2^\infty \mathrm d x/x$ diverges.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_1^\infty \frac{x}{x^3+1}\,\mathrm d x$`, kind: 'choice', choices: ['converges', 'diverges'], answer: 0, solution: String.raw`$\frac{x}{x^3+1} \le \frac{x}{x^3} = \frac{1}{x^2}$, a convergent p-integral.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\int_0^1 \frac{\mathrm d x}{x + \sqrt x}$`, kind: 'choice', choices: ['converges', 'diverges'], answer: 0, solution: String.raw`$\frac{1}{x+\sqrt x} \le \frac{1}{\sqrt x}$ on $(0,1]$ and $\int_0^1 x^{-1/2}\,\mathrm d x = 2$ converges. (Exact value: substitute $u = \sqrt x$ to get $2\ln 2$.)` },
        { label: '(e)', prompt: String.raw`$\displaystyle\int_1^\infty \frac{\sqrt{x}+1}{x^2-x/2}\,\mathrm d x$`, kind: 'choice', choices: ['converges', 'diverges'], answer: 0, solution: String.raw`Limit comparison with $x^{-3/2}$: $\frac{(\sqrt x + 1)/(x^2 - x/2)}{x^{-3/2}} = \frac{x^2 + x^{3/2}}{x^2 - x/2} \to 1$, and $\int_1^\infty x^{-3/2}\,\mathrm d x$ converges ($p = \tfrac32$).` },
        { label: '(f)', prompt: String.raw`Using $\displaystyle\int_0^1 \frac{\mathrm d x}{x+\sqrt x}$ from (d), substitute $u = \sqrt x$ and give the exact value.`, kind: 'numeric', answer: '2*log(2)', solution: String.raw`$x = u^2$, $\mathrm d x = 2u\,\mathrm d u$: $\int_0^1 \frac{2u\,\mathrm d u}{u^2 + u} = \int_0^1 \frac{2\,\mathrm d u}{u+1} = 2\ln 2$. The substitution removes the singularity.` },
      ],
    },
    {
      id: 'a4',
      title: 'A heavy-tailed density',
      difficulty: 'challenge',
      hw: 'HW2-style',
      statement: String.raw`<p>Let $f(x) = \dfrac{c}{(1+|x|)^2}$ for all $x \in \mathbb R$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Find the constant $c$ that makes $f$ a probability density.`, kind: 'numeric', answer: '1/2', hint: String.raw`The function is even: $\int_{-\infty}^{\infty} = 2\int_0^\infty$.`, solution: String.raw`$\int_0^\infty (1+x)^{-2}\,\mathrm d x = \lim_{t\to\infty}\big(1 - \tfrac{1}{1+t}\big) = 1$, so the total integral is $2c = 1$ and $c = \tfrac12$.` },
        { label: '(b)', prompt: String.raw`Compute $P(-1 \le X \le 1) = \int_{-1}^{1} f(x)\,\mathrm d x$.`, kind: 'numeric', answer: '1/2', solution: String.raw`$2\cdot\tfrac12\int_0^1 (1+x)^{-2}\,\mathrm d x = 1 - \tfrac12 = \tfrac12$.` },
        { label: '(c)', prompt: String.raw`Does the mean $E[X]$ exist?`, kind: 'choice', choices: ['Yes, it is $0$ by symmetry', String.raw`Yes, it is $\tfrac12$`, 'No: the integral diverges'], answer: 2, solution: String.raw`$\int_0^\infty \frac{x/2}{(1+x)^2}\,\mathrm d x$ diverges because $\frac{x}{(1+x)^2} \sim \frac1x$ (limit comparison with $1/x$). One half diverges, so the mean does not exist; symmetry does not rescue it.` },
        { label: '(d)', prompt: String.raw`Write a Live Script solution for (a) and (c) with explicit limits, and a numerical check of (a) with <code>integral</code>. Explain why $\lim_{t\to\infty}\int_{-t}^{t} x f(x)\,\mathrm d x = 0$ does not give a mean.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 4 (Attempted)' },
        { type: 'heading2', content: '(a) Normalising constant' },
        { type: 'text', content: 'We require $\\int_{-\\infty}^{\\infty} f(x)\\,\\mathrm d x = 1$. The integrand is even, so we split at $0$ and compute the right half as a limit:' },
        { type: 'equation', content: String.raw`\int_0^\infty \frac{\mathrm d x}{(1+x)^2} = \lim_{t\to\infty}\Big[-\frac{1}{1+x}\Big]_0^t = \lim_{t\to\infty}\Big(1 - \frac{1}{1+t}\Big) = 1 .` },
        { type: 'text', content: 'The left half is equal by symmetry, so $c\\,(1 + 1) = 1$ and $c = \\frac12$. We check numerically:' },
        { type: 'code', content: "f = @(x) 0.5 ./ (1 + abs(x)).^2;\ntotal = integral(f, -Inf, Inf)" },
        { type: 'heading2', content: '(c) The mean' },
        { type: 'text', content: 'The mean is $\\int_{-\\infty}^{\\infty} x f(x)\\,\\mathrm d x$, which exists only if both halves converge. We examine the right half with $u = 1 + x$:' },
        { type: 'equation', content: String.raw`\int_0^t \frac{x/2}{(1+x)^2}\,\mathrm d x = \frac12\int_1^{1+t}\Big(\frac1u - \frac{1}{u^2}\Big)\mathrm d u = \frac12\Big(\ln(1+t) + \frac{1}{1+t} - 1\Big) \xrightarrow[t\to\infty]{} \infty .` },
        { type: 'text', content: 'The right half diverges, so **the mean does not exist**. The symmetric limit $\\int_{-t}^{t} x f(x)\\,\\mathrm d x = 0$ for every $t$ (odd integrand), but it is not the definition: the two halves are $+\\infty$ and $-\\infty$, and $\\infty - \\infty$ has no value. The partial integrals of the right half grow like $\\frac12\\ln t$:' },
        { type: 'code', content: "g = @(x) x .* 0.5 ./ (1 + x).^2;\nfor k = 1:5\n    fprintf('t = 1e%d:  %.4f\\n', k, integral(g, 0, 10^k));\nend" },
      ],
    },
    {
      id: 'a5',
      title: 'Capstone — Homework 2 style set',
      difficulty: 'exam',
      hw: 'HW2-style',
      statement: String.raw`<p>This set mixes the techniques of the whole part: integration by parts, substitution, partial fractions, completing the square and improper limits. Give exact values (MATLAB syntax, e.g. <code>log(3)/2</code>); a numerical check with <code>integral</code> is a good habit, but justify convergence by hand.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int_0^\infty x e^{-2x}\,\mathrm d x$ (parts)`, kind: 'numeric', answer: '1/4', hint: String.raw`$u = x$, $\mathrm d v = e^{-2x}\,\mathrm d x$.`, solution: String.raw`$\int_0^t x e^{-2x}\,\mathrm d x = \big[-\tfrac x2 e^{-2x}\big]_0^t + \tfrac12\int_0^t e^{-2x}\,\mathrm d x = -\tfrac t2 e^{-2t} + \tfrac14(1 - e^{-2t}) \to \tfrac14$.` },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_e^\infty \frac{\mathrm d x}{x(\ln x)^3}$ (substitution)`, kind: 'numeric', answer: '1/2', hint: String.raw`$u = \ln x$.`, solution: String.raw`With $u = \ln x$, $\mathrm d u = \mathrm d x/x$, the limits become $1$ and $\infty$: $\int_1^\infty u^{-3}\,\mathrm d u = \tfrac12$.` },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_2^\infty \frac{\mathrm d x}{x^2-1}$ (partial fractions)`, kind: 'numeric', answer: 'log(3)/2', hint: String.raw`$\frac{1}{x^2-1} = \frac12\Big(\frac{1}{x-1} - \frac{1}{x+1}\Big)$. Combine the logarithms before taking the limit.`, solution: String.raw`$\int_2^t \frac{\mathrm d x}{x^2-1} = \frac12\Big[\ln\frac{x-1}{x+1}\Big]_2^t = \frac12\ln\frac{t-1}{t+1} - \frac12\ln\frac13 \to 0 + \frac12\ln 3$. Taking the limits of $\ln(t-1)$ and $\ln(t+1)$ separately would give $\infty - \infty$.` },
        { label: '(d)', prompt: String.raw`$\displaystyle\int_0^\infty \frac{\mathrm d x}{x^2+2x+5}$ (completing the square)`, kind: 'numeric', answer: '(pi/2 - atan(1/2))/2', solution: String.raw`$x^2 + 2x + 5 = (x+1)^2 + 4$, so an antiderivative is $\tfrac12\arctan\tfrac{x+1}{2}$. The value is $\tfrac12\big(\tfrac\pi2 - \arctan\tfrac12\big) \approx 0.5536$.` },
        { label: '(e)', prompt: String.raw`$\displaystyle\int_0^1 \frac{\ln x}{\sqrt[3]{x}}\,\mathrm d x$ (parts + a limit at $0$)`, kind: 'numeric', answer: '-9/4', hint: String.raw`$u = \ln x$, $\mathrm d v = x^{-1/3}\,\mathrm d x$, $v = \tfrac32 x^{2/3}$. You will need $\lim_{t\to0^+} t^{2/3}\ln t$.`, solution: String.raw`$\int_t^1 x^{-1/3}\ln x\,\mathrm d x = \big[\tfrac32 x^{2/3}\ln x\big]_t^1 - \tfrac32\int_t^1 x^{-1/3}\,\mathrm d x = -\tfrac32 t^{2/3}\ln t - \tfrac94(1 - t^{2/3})$. By l'Hospital $t^{2/3}\ln t = \frac{\ln t}{t^{-2/3}} \to \frac{1/t}{-\frac23 t^{-5/3}} = -\tfrac32 t^{2/3} \to 0$, so the value is $-\tfrac94$.` },
        { label: '(f)', prompt: String.raw`$\displaystyle\int_1^\infty \frac{\mathrm d x}{x(x+1)}$ (partial fractions)`, kind: 'numeric', answer: 'log(2)', solution: String.raw`$\frac{1}{x(x+1)} = \frac1x - \frac{1}{x+1}$, so $\int_1^t = \Big[\ln\frac{x}{x+1}\Big]_1^t = \ln\frac{t}{t+1} + \ln 2 \to \ln 2$.` },
        { label: '(g)', prompt: String.raw`Write up (e) as a Live Script answer: explicit limit, the l'Hospital step, and an <code>integral</code> check.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5(e) (Attempted)' },
        { type: 'text', content: 'The integrand $\\frac{\\ln x}{x^{1/3}}$ is unbounded as $x \\to 0^+$, so we integrate from $t \\in (0, 1)$ and take the limit $t \\to 0^+$. We integrate by parts with $u = \\ln x$ and $\\mathrm d v = x^{-1/3}\\,\\mathrm d x$, so $\\mathrm d u = \\frac{1}{x}\\,\\mathrm d x$ and $v = \\frac32 x^{2/3}$:' },
        { type: 'equation', content: String.raw`\int_t^1 \frac{\ln x}{x^{1/3}}\,\mathrm d x = \Big[\frac32 x^{2/3}\ln x\Big]_t^1 - \frac32\int_t^1 x^{-1/3}\,\mathrm d x = -\frac32 t^{2/3}\ln t - \frac94\big(1 - t^{2/3}\big).` },
        { type: 'text', content: 'The only nontrivial limit is $t^{2/3}\\ln t$, of the form $0\\cdot(-\\infty)$. We rewrite it as a quotient and use l\'Hospital\'s rule:' },
        { type: 'equation', content: String.raw`\lim_{t\to0^+}\frac{\ln t}{t^{-2/3}} = \lim_{t\to0^+}\frac{1/t}{-\frac23 t^{-5/3}} = \lim_{t\to0^+}\Big(-\frac32 t^{2/3}\Big) = 0 .` },
        { type: 'text', content: 'Therefore the integral converges and' },
        { type: 'equation', content: String.raw`\int_0^1 \frac{\ln x}{\sqrt[3]{x}}\,\mathrm d x = -\frac94 .` },
        { type: 'text', content: 'We check numerically:' },
        { type: 'code', content: "I = integral(@(x) log(x) ./ x.^(1/3), 0, 1)\nfprintf('Exact value -9/4 = %.6f\\n', -9/4)" },
      ],
    },
  ],
};
