// Module 12: Integration by parts and reduction formulas

export default {
  id: 'parts',
  number: 12,
  part: 'techniques',
  hw: 'HW2',
  title: 'Integration by parts and reduction formulas',
  summary: 'The product rule backwards: ∫u dv = uv − ∫v du, choosing u with LIATE, repeated parts, solving for the integral (e^x sin x), definite integrals, inverse trigonometric functions and logarithms, and reduction formulas such as Wallis’ formula — checked numerically with integral and for loops.',
  intro: String.raw`<p>Substitution undoes the chain rule; <b>integration by parts</b> undoes the product rule. It handles products of different kinds of functions ($x e^x$, $x\sin x$, $e^x\cos x$), functions with simple derivatives but no obvious antiderivative ($\ln x$, $\arctan x$, $\arcsin x$), and whole families of integrals at once through <b>reduction formulas</b>. In MATLAB you check every result with <code>integral</code> and verify recursions with a <code>for</code> loop.</p><p>Every worked example follows the same five moves, each written on its own line: <b>(1)</b> choose $u$ and $\mathrm d v$, <b>(2)</b> compute $\mathrm d u$ and $v$, <b>(3)</b> write $uv - \int v\,\mathrm d u$ with the pieces put in, <b>(4)</b> do the remaining integral, <b>(5)</b> check by differentiating (or evaluate the limits).</p>`,
  lessons: [
    {
      id: 'parts-formula',
      title: 'The formula and how to choose u',
      blocks: [
        { type: 'text', html: String.raw`<p>Plot the curve $\big(u(t), v(t)\big)$ in a $uv$-plane. The rectangle $[0, u] \times [0, v]$ splits into the area <b>under</b> the curve, $\int v\,\mathrm d u$, and the area <b>left</b> of it, $\int u\,\mathrm d v$. Here $u = \ln t$ and $v = t$ for $1 \le t \le e$: the orange area is $\int_1^e \ln t\,\mathrm d t$, the blue area is $\int_1^e t\cdot\frac{1}{t}\,\mathrm d t = e - 1$, and together they fill the rectangle of area $uv = e$.</p>` },
        { type: 'widget', name: 'parts', config: {
          title: 'Integration by parts as areas: u = ln t, v = t',
          u: 'log(t)', v: 't', t0: 1, t1: Math.E, ulim: [-0.1, 1.25], vlim: [-0.1, 3],
        } },
        { type: 'refresher', title: 'the product rule', html: String.raw`<p>For two functions $u(x)$ and $v(x)$: $\;(uv)' = u'v + uv'$. Example: $\frac{\mathrm d}{\mathrm d x}\big(x\sin x\big) = 1\cdot\sin x + x\cos x$.</p>` },
        { type: 'steps', title: 'Where the formula comes from', steps: [
          { do: String.raw`$(uv)' = u'v + uv'$`, why: 'The product rule (refresher).' },
          { do: String.raw`$uv' = (uv)' - u'v$`, why: String.raw`Subtract $u'v$ from both sides.` },
          { do: String.raw`$\displaystyle\int u v'\,\mathrm d x = uv - \int u' v\,\mathrm d x$`, why: String.raw`Integrate both sides; integrating the derivative $(uv)'$ gives back $uv$.` },
          { do: String.raw`$\displaystyle\int u\,\mathrm d v = uv - \int v\,\mathrm d u$`, why: String.raw`Short notation: $\mathrm d v = v'\,\mathrm d x$ and $\mathrm d u = u'\,\mathrm d x$.` },
        ] },
        { type: 'callout', kind: 'thm', title: 'Integration by parts', html: String.raw`$$\int u\,\mathrm d v = uv - \int v\,\mathrm d u, \qquad \int_a^b u(x)v'(x)\,\mathrm d x = \Big[u(x)v(x)\Big]_a^b - \int_a^b u'(x)v(x)\,\mathrm d x .$$<p>We split the integrand into two factors: $u$ (which we will <b>differentiate</b>) and $\mathrm d v$ (which we will <b>integrate</b>). Choose $u$ so that $u'$ is <i>simpler</i> than $u$, and $\mathrm d v$ so that you <i>can</i> integrate it.</p>` },
        { type: 'table', head: ['LIATE: prefer as $u$ (top first)', 'Examples'], rows: [
          ['<b>L</b>ogarithms', String.raw`$\ln x$, $\ln(1 + x^2)$`],
          ['<b>I</b>nverse trigonometric', String.raw`$\arctan x$, $\arcsin x$`],
          ['<b>A</b>lgebraic (powers, polynomials)', String.raw`$x$, $x^2 + 1$`],
          ['<b>T</b>rigonometric', String.raw`$\sin x$, $\cos 3x$`],
          ['<b>E</b>xponential', String.raw`$e^x$, $e^{-2x}$`],
        ] },
        { type: 'steps', title: String.raw`Worked example: $\displaystyle\int x\cos x\,\mathrm d x$`, steps: [
          { do: String.raw`$u = x,\qquad \mathrm d v = \cos x\,\mathrm d x$`, why: String.raw`LIATE: $x$ is <b>A</b>lgebraic, $\cos x$ is <b>T</b>rigonometric; A comes before T, so $u = x$. Good sign: $u' = 1$ is simpler than $x$.` },
          { do: String.raw`$\mathrm d u = 1\,\mathrm d x = \mathrm d x$`, why: String.raw`Differentiate $u = x$.` },
          { do: String.raw`$v = \displaystyle\int \cos x\,\mathrm d x = \sin x$`, why: String.raw`Integrate $\mathrm d v$. No $+C$ is needed here; one constant at the very end is enough.` },
          { do: String.raw`$\displaystyle\int x\cos x\,\mathrm d x = x\cdot\sin x - \int \sin x\,\mathrm d x$`, why: String.raw`Put the pieces into $uv - \int v\,\mathrm d u$: $u = x$, $v = \sin x$, $\mathrm d u = \mathrm d x$.` },
          { do: String.raw`$\displaystyle\int \sin x\,\mathrm d x = -\cos x$`, why: 'The remaining integral is a basic one.' },
          { do: String.raw`$\displaystyle\int x\cos x\,\mathrm d x = x\sin x - (-\cos x) + C = x\sin x + \cos x + C$`, why: 'Substitute it back; minus a minus is a plus.' },
          { do: String.raw`Check: $\dfrac{\mathrm d}{\mathrm d x}(x\sin x + \cos x) = \sin x + x\cos x - \sin x = x\cos x$ ✓`, why: 'Differentiate the answer (product rule on $x\\sin x$); we must get the integrand back.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\int x e^{x}\,\mathrm d x$`, problem: String.raw`Find $\displaystyle\int x e^{x}\,\mathrm d x$ with the same five moves.`, steps: [
          { prompt: String.raw`<b>Choose.</b> Which factor is $u$?`, ask: { kind: 'choice', choices: [String.raw`$u = x$, $\mathrm d v = e^x\,\mathrm d x$`, String.raw`$u = e^x$, $\mathrm d v = x\,\mathrm d x$`] , answer: 0 }, hint: String.raw`LIATE: Algebraic comes before Exponential.`, reveal: String.raw`$u = x$, $\mathrm d v = e^x\,\mathrm d x$.` },
          { prompt: String.raw`<b>Compute.</b> $\mathrm d u = \mathrm d x$. What is $v$? (type it in <code>x</code>)`, ask: { kind: 'expression', variable: 'x', answer: 'exp(x)' }, hint: String.raw`$v = \int e^x\,\mathrm d x$.`, reveal: String.raw`$v = e^x$.` },
          { prompt: String.raw`<b>Formula.</b> $\int x e^x\,\mathrm d x = x e^x - \int e^x\,\mathrm d x$.`, show: String.raw`$uv - \int v\,\mathrm d u$ with $u = x$, $v = e^x$, $\mathrm d u = \mathrm d x$.` },
          { prompt: String.raw`<b>Finish.</b> Type the antiderivative.`, ask: { kind: 'expression', variable: 'x', answer: 'x.*exp(x) - exp(x)', upToConstant: true }, hint: String.raw`$\int e^x\,\mathrm d x = e^x$.`, reveal: String.raw`$\int x e^x\,\mathrm d x = x e^x - e^x + C = (x - 1)e^x + C$.` },
        ], finale: String.raw`Check: $\frac{\mathrm d}{\mathrm d x}\big((x-1)e^x\big) = e^x + (x-1)e^x = x e^x$ ✓.` },
        { type: 'quiz', question: String.raw`For $\int x\,e^{2x}\,\mathrm d x$, which choice works?`, choices: [String.raw`$u = e^{2x}$, $\mathrm d v = x\,\mathrm d x$`, String.raw`$u = x$, $\mathrm d v = e^{2x}\,\mathrm d x$`, String.raw`$u = x e^{2x}$, $\mathrm d v = \mathrm d x$`, 'Integration by parts does not apply.'], answer: 1, explain: String.raw`With $u = x$ the derivative is $1$ and the new integral $\int \frac12 e^{2x}\,\mathrm d x$ is easy. The first choice raises the power of $x$ and makes things worse.` },
      ],
    },
    {
      id: 'parts-inner-constant',
      title: String.raw`Polynomial times e^(kx), sin kx or cos kx`,
      blocks: [
        { type: 'text', html: String.raw`<p>The same moves work when the exponential or trigonometric factor has a constant inside, like $e^{3x}$ or $\cos 2x$. The only new thing is computing $v$, which needs the "reverse chain rule".</p>` },
        { type: 'refresher', title: String.raw`integrating $e^{kx}$, $\sin kx$, $\cos kx$`, html: String.raw`<p>Differentiating $e^{kx}$ brings out a factor $k$, so integrating must divide by $k$:</p>$$\int e^{kx}\,\mathrm d x = \frac1k e^{kx},\qquad \int \cos kx\,\mathrm d x = \frac1k\sin kx,\qquad \int \sin kx\,\mathrm d x = -\frac1k\cos kx .$$<p>Check one: $\frac{\mathrm d}{\mathrm d x}\left(\frac13 e^{3x}\right) = \frac13\cdot 3e^{3x} = e^{3x}$ ✓.</p>` },
        { type: 'steps', title: String.raw`Worked example: $\displaystyle\int x e^{3x}\,\mathrm d x$`, steps: [
          { do: String.raw`$u = x,\qquad \mathrm d v = e^{3x}\,\mathrm d x$`, why: String.raw`LIATE: Algebraic before Exponential.` },
          { do: String.raw`$\mathrm d u = \mathrm d x$`, why: String.raw`Differentiate $u$.` },
          { do: String.raw`$v = \displaystyle\int e^{3x}\,\mathrm d x = \frac13 e^{3x}$`, why: String.raw`Refresher: divide by the inner constant $k = 3$.` },
          { do: String.raw`$\displaystyle\int x e^{3x}\,\mathrm d x = x\cdot\frac13 e^{3x} - \int \frac13 e^{3x}\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$ with the pieces put in.` },
          { do: String.raw`$\displaystyle\int \frac13 e^{3x}\,\mathrm d x = \frac13\cdot\frac13 e^{3x} = \frac19 e^{3x}$`, why: String.raw`Constant factor $\frac13$ stays; integrate $e^{3x}$ again (divide by 3 again).` },
          { do: String.raw`$\displaystyle\int x e^{3x}\,\mathrm d x = \frac{x}{3}e^{3x} - \frac19 e^{3x} + C$`, why: 'Substitute back.' },
          { do: String.raw`Check: $\frac13 e^{3x} + x e^{3x} - \frac13 e^{3x} = x e^{3x}$ ✓`, why: String.raw`Derivative of $\frac x3 e^{3x}$ (product rule) is $\frac13 e^{3x} + x e^{3x}$; derivative of $\frac19 e^{3x}$ is $\frac13 e^{3x}$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\int x\cos 2x\,\mathrm d x$`, problem: String.raw`Find $\displaystyle\int x\cos 2x\,\mathrm d x$.`, steps: [
          { prompt: String.raw`<b>Choose.</b> $u = x$ and $\mathrm d v = \cos 2x\,\mathrm d x$ (A before T). Then $\mathrm d u = \mathrm d x$. What is $v$?`, ask: { kind: 'expression', variable: 'x', answer: 'sin(2*x)/2' }, hint: String.raw`$\int \cos kx\,\mathrm d x = \frac1k\sin kx$ with $k = 2$.`, reveal: String.raw`$v = \frac12\sin 2x$.` },
          { prompt: String.raw`<b>Formula.</b> $\int x\cos 2x\,\mathrm d x = \frac{x}{2}\sin 2x - \int \frac12\sin 2x\,\mathrm d x$. Type the remaining integral $\int \frac12\sin 2x\,\mathrm d x$.`, ask: { kind: 'expression', variable: 'x', answer: '-cos(2*x)/4', upToConstant: true }, hint: String.raw`$\int \sin 2x\,\mathrm d x = -\frac12\cos 2x$; then multiply by $\frac12$.`, reveal: String.raw`$\int \frac12\sin 2x\,\mathrm d x = \frac12\cdot\left(-\frac12\cos 2x\right) = -\frac14\cos 2x$.` },
          { prompt: String.raw`<b>Finish.</b> Type $\int x\cos 2x\,\mathrm d x$.`, ask: { kind: 'expression', variable: 'x', answer: 'x.*sin(2*x)/2 + cos(2*x)/4', upToConstant: true }, hint: String.raw`$\frac x2\sin 2x - \left(-\frac14\cos 2x\right)$.`, reveal: String.raw`$\int x\cos 2x\,\mathrm d x = \frac{x}{2}\sin 2x + \frac14\cos 2x + C$.` },
        ] },
        { type: 'quiz', question: String.raw`What is $v$ if $\mathrm d v = \sin 5x\,\mathrm d x$?`, choices: [String.raw`$5\cos 5x$`, String.raw`$-\frac15\cos 5x$`, String.raw`$\frac15\cos 5x$`, String.raw`$-5\cos 5x$`], answer: 1, explain: String.raw`$\int\sin kx\,\mathrm d x = -\frac1k\cos kx$; check: $\frac{\mathrm d}{\mathrm d x}\left(-\frac15\cos 5x\right) = \sin 5x$.` },
      ],
    },
    {
      id: 'parts-log',
      title: String.raw`Powers times ln x: u = ln x`,
      blocks: [
        { type: 'text', html: String.raw`<p>For $x^n\ln x$ the choice flips: $\ln x$ is first in LIATE, so $u = \ln x$. Two reasons: its derivative $\frac1x$ is simpler, and we could not integrate $\ln x$ as $\mathrm d v$ anyway (we do not know its antiderivative yet).</p>` },
        { type: 'refresher', title: 'the power rule and simplifying powers', html: String.raw`<p>$\int x^n\,\mathrm d x = \frac{x^{n+1}}{n+1}$ for $n \ne -1$. And $x^a\cdot\frac1x = x^{a-1}$, e.g. $\frac{x^2}{2}\cdot\frac1x = \frac x2$.</p>` },
        { type: 'steps', title: String.raw`Worked example: $\displaystyle\int x\ln x\,\mathrm d x$`, steps: [
          { do: String.raw`$u = \ln x,\qquad \mathrm d v = x\,\mathrm d x$`, why: String.raw`LIATE: Logarithm before Algebraic.` },
          { do: String.raw`$\mathrm d u = \dfrac1x\,\mathrm d x$`, why: String.raw`Derivative of $\ln x$.` },
          { do: String.raw`$v = \displaystyle\int x\,\mathrm d x = \frac{x^2}{2}$`, why: 'Power rule.' },
          { do: String.raw`$\displaystyle\int x\ln x\,\mathrm d x = \frac{x^2}{2}\ln x - \int \frac{x^2}{2}\cdot\frac1x\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$.` },
          { do: String.raw`$\dfrac{x^2}{2}\cdot\dfrac1x = \dfrac{x}{2}$`, why: 'Simplify the new integrand first: the logarithm is gone.' },
          { do: String.raw`$\displaystyle\int \frac x2\,\mathrm d x = \frac{x^2}{4}$`, why: 'Power rule.' },
          { do: String.raw`$\displaystyle\int x\ln x\,\mathrm d x = \frac{x^2}{2}\ln x - \frac{x^2}{4} + C$`, why: 'Substitute back.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\int x^4\ln x\,\mathrm d x$`, problem: String.raw`Find $\displaystyle\int x^4\ln x\,\mathrm d x$.`, steps: [
          { prompt: String.raw`<b>Choose.</b> Which choice is right?`, ask: { kind: 'choice', choices: [String.raw`$u = x^4$, $\mathrm d v = \ln x\,\mathrm d x$`, String.raw`$u = \ln x$, $\mathrm d v = x^4\,\mathrm d x$`], answer: 1 }, hint: 'L comes before A in LIATE.', reveal: String.raw`$u = \ln x$, $\mathrm d v = x^4\,\mathrm d x$, so $\mathrm d u = \frac1x\,\mathrm d x$.` },
          { prompt: String.raw`What is $v$?`, ask: { kind: 'expression', variable: 'x', answer: 'x.^5/5' }, hint: String.raw`Power rule: raise the power by one and divide by the new power.`, reveal: String.raw`$v = \frac{x^5}{5}$.` },
          { prompt: String.raw`$\int x^4\ln x\,\mathrm d x = \frac{x^5}{5}\ln x - \int\frac{x^5}{5}\cdot\frac1x\,\mathrm d x$. Simplify the new integrand $\frac{x^5}{5}\cdot\frac1x$.`, ask: { kind: 'expression', variable: 'x', answer: 'x.^4/5' }, hint: String.raw`$x^5\cdot\frac1x = x^4$.`, reveal: String.raw`$\frac{x^4}{5}$.` },
          { prompt: String.raw`<b>Finish.</b> Type the antiderivative.`, ask: { kind: 'expression', variable: 'x', answer: 'x.^5.*log(x)/5 - x.^5/25', upToConstant: true }, hint: String.raw`$\int\frac{x^4}{5}\,\mathrm d x = \frac{x^5}{25}$.`, reveal: String.raw`$\int x^4\ln x\,\mathrm d x = \frac{x^5}{5}\ln x - \frac{x^5}{25} + C$.` },
        ] },
      ],
    },
    {
      id: 'invisible-dv',
      title: String.raw`The invisible factor dv = dx: ln x, arcsin x, arctan x`,
      blocks: [
        { type: 'text', html: String.raw`<p>$\int \ln x\,\mathrm d x$ looks like it has only one factor. Write it as $\int \ln x\cdot 1\,\mathrm d x$: take $u = \ln x$ and the "invisible" factor $\mathrm d v = 1\,\mathrm d x$, so $v = x$. The same trick works for $\arcsin x$, $\arccos x$ and $\arctan x$, whose derivatives are algebraic.</p>` },
        { type: 'table', head: ['$u$', "$u'$"], rows: [
          [String.raw`$\ln x$`, String.raw`$\dfrac1x$`],
          [String.raw`$\arcsin x$`, String.raw`$\dfrac{1}{\sqrt{1 - x^2}}$`],
          [String.raw`$\arccos x$`, String.raw`$-\dfrac{1}{\sqrt{1 - x^2}}$`],
          [String.raw`$\arctan x$`, String.raw`$\dfrac{1}{1 + x^2}$`],
        ] },
        { type: 'steps', title: String.raw`Worked example: $\displaystyle\int \ln x\,\mathrm d x$`, steps: [
          { do: String.raw`$u = \ln x,\qquad \mathrm d v = 1\,\mathrm d x$`, why: 'The invisible factor 1.' },
          { do: String.raw`$\mathrm d u = \dfrac1x\,\mathrm d x,\qquad v = x$`, why: String.raw`Differentiate $u$; integrate $1$.` },
          { do: String.raw`$\displaystyle\int \ln x\,\mathrm d x = x\ln x - \int x\cdot\frac1x\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$.` },
          { do: String.raw`$= x\ln x - \displaystyle\int 1\,\mathrm d x$`, why: String.raw`$x\cdot\frac1x = 1$.` },
          { do: String.raw`$= x\ln x - x + C$`, why: String.raw`$\int 1\,\mathrm d x = x$.` },
        ] },
        { type: 'refresher', title: String.raw`substitution for $\int \frac{x}{\sqrt{1 - x^2}}\,\mathrm d x$ and $\int \frac{x}{1 + x^2}\,\mathrm d x$`, html: String.raw`<p>The leftover integrals have the derivative of the inside sitting in the numerator (up to a constant), so substitute the inside.</p>`, steps: [
          { do: String.raw`$w = 1 - x^2,\quad \mathrm d w = -2x\,\mathrm d x,\quad x\,\mathrm d x = -\tfrac12\,\mathrm d w$`, why: 'Name the inside and solve for the piece $x\\,\\mathrm d x$.' },
          { do: String.raw`$\displaystyle\int \frac{x}{\sqrt{1 - x^2}}\,\mathrm d x = -\frac12\int w^{-1/2}\,\mathrm d w = -w^{1/2} = -\sqrt{1 - x^2}$`, why: String.raw`Power rule: $\int w^{-1/2}\,\mathrm d w = 2w^{1/2}$; times $-\frac12$.` },
          { do: String.raw`$w = 1 + x^2$: $\displaystyle\int \frac{x}{1 + x^2}\,\mathrm d x = \frac12\int\frac{\mathrm d w}{w} = \frac12\ln(1 + x^2)$`, why: String.raw`Here $x\,\mathrm d x = \frac12\,\mathrm d w$; $1 + x^2 > 0$ so no absolute value is needed.` },
        ] },
        { type: 'steps', title: String.raw`Worked example: $\displaystyle\int \arcsin x\,\mathrm d x$`, steps: [
          { do: String.raw`$u = \arcsin x,\qquad \mathrm d v = 1\,\mathrm d x$`, why: String.raw`Inverse trig function: invisible factor $1$.` },
          { do: String.raw`$\mathrm d u = \dfrac{1}{\sqrt{1 - x^2}}\,\mathrm d x,\qquad v = x$`, why: 'Table above; integrate 1.' },
          { do: String.raw`$\displaystyle\int \arcsin x\,\mathrm d x = x\arcsin x - \int \frac{x}{\sqrt{1 - x^2}}\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$.` },
          { do: String.raw`$\displaystyle\int \frac{x}{\sqrt{1 - x^2}}\,\mathrm d x = -\sqrt{1 - x^2}$`, why: String.raw`Substitution $w = 1 - x^2$ (refresher).` },
          { do: String.raw`$\displaystyle\int \arcsin x\,\mathrm d x = x\arcsin x + \sqrt{1 - x^2} + C$`, why: 'Minus a minus is a plus.' },
          { do: String.raw`Check: $\arcsin x + \dfrac{x}{\sqrt{1 - x^2}} - \dfrac{x}{\sqrt{1 - x^2}} = \arcsin x$ ✓`, why: String.raw`Differentiate: product rule on $x\arcsin x$, chain rule on $\sqrt{1 - x^2}$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\int_0^1 \arctan x\,\mathrm d x$`, problem: String.raw`Compute $\displaystyle\int_0^1 \arctan x\,\mathrm d x$: first the antiderivative, then the limits.`, steps: [
          { prompt: String.raw`With $u = \arctan x$, $\mathrm d v = \mathrm d x$: what is $\mathrm d u / \mathrm d x$?`, ask: { kind: 'expression', variable: 'x', answer: '1./(1 + x.^2)' }, hint: 'See the table of derivatives.', reveal: String.raw`$\mathrm d u = \dfrac{1}{1 + x^2}\,\mathrm d x$, and $v = x$.` },
          { prompt: String.raw`$\int \arctan x\,\mathrm d x = x\arctan x - \int \frac{x}{1 + x^2}\,\mathrm d x$. Type the antiderivative.`, ask: { kind: 'expression', variable: 'x', answer: 'x.*atan(x) - log(1 + x.^2)/2', upToConstant: true }, hint: String.raw`Refresher: $\int\frac{x}{1 + x^2}\,\mathrm d x = \frac12\ln(1 + x^2)$.`, reveal: String.raw`$\int \arctan x\,\mathrm d x = x\arctan x - \frac12\ln(1 + x^2) + C$.` },
          { prompt: String.raw`Evaluate from $0$ to $1$.`, ask: { kind: 'numeric', answer: 'pi/4 - log(2)/2', tol: 1e-6 }, hint: String.raw`At $x = 1$: $1\cdot\arctan 1 - \frac12\ln 2$, with $\arctan 1 = \frac{\pi}{4}$. At $x = 0$: $0 - \frac12\ln 1 = 0$.`, reveal: String.raw`$\Big[x\arctan x - \tfrac12\ln(1 + x^2)\Big]_0^1 = \frac{\pi}{4} - \frac12\ln 2 - 0 \approx 0.4388$.` },
        ] },
        { type: 'quiz', question: String.raw`For $\int \arccos x\,\mathrm d x$ with $u = \arccos x$, $\mathrm d v = \mathrm d x$, what is the remaining integral $\int v\,\mathrm d u$?`, choices: [String.raw`$\int \frac{x}{\sqrt{1 - x^2}}\,\mathrm d x$`, String.raw`$-\int \frac{x}{\sqrt{1 - x^2}}\,\mathrm d x$`, String.raw`$\int \frac{1}{\sqrt{1 - x^2}}\,\mathrm d x$`, String.raw`$\int x\arccos x\,\mathrm d x$`], answer: 1, explain: String.raw`$\mathrm d u = -\frac{\mathrm d x}{\sqrt{1 - x^2}}$ and $v = x$, so $\int v\,\mathrm d u = -\int\frac{x}{\sqrt{1 - x^2}}\,\mathrm d x$ — the only difference from $\arcsin$ is this sign.` },
      ],
    },
    {
      id: 'definite-parts',
      title: 'Definite integrals by parts',
      blocks: [
        { type: 'text', html: String.raw`<p>For a definite integral use $\int_a^b u\,\mathrm d v = \Big[uv\Big]_a^b - \int_a^b v\,\mathrm d u$ and evaluate the boundary term $\big[uv\big]_a^b$ straight away. It keeps the numbers small.</p>` },
        { type: 'refresher', title: String.raw`evaluating $\big[F(x)\big]_a^b$`, html: String.raw`<p>$\big[F(x)\big]_a^b = F(b) - F(a)$: value at the upper limit minus value at the lower limit. Useful values: $\cos\pi = -1$, $\cos 0 = 1$, $\sin\pi = \sin 0 = 0$, $\ln 1 = 0$, $\ln e = 1$, $\arctan 1 = \frac\pi4$, $\arctan\sqrt3 = \frac\pi3$.</p>` },
        { type: 'steps', title: String.raw`Worked example: $\displaystyle\int_0^\pi x\sin x\,\mathrm d x$`, steps: [
          { do: String.raw`$u = x,\quad \mathrm d v = \sin x\,\mathrm d x$`, why: 'A before T.' },
          { do: String.raw`$\mathrm d u = \mathrm d x,\quad v = -\cos x$`, why: String.raw`$\int\sin x\,\mathrm d x = -\cos x$.` },
          { do: String.raw`$\displaystyle\int_0^\pi x\sin x\,\mathrm d x = \Big[-x\cos x\Big]_0^\pi - \int_0^\pi (-\cos x)\,\mathrm d x$`, why: String.raw`Definite form: $\big[uv\big]_0^\pi - \int_0^\pi v\,\mathrm d u$.` },
          { do: String.raw`$\Big[-x\cos x\Big]_0^\pi = -\pi\cos\pi - (-0\cdot\cos 0) = -\pi(-1) - 0 = \pi$`, why: 'Boundary term: upper minus lower.' },
          { do: String.raw`$-\displaystyle\int_0^\pi(-\cos x)\,\mathrm d x = \int_0^\pi\cos x\,\mathrm d x = \Big[\sin x\Big]_0^\pi = 0 - 0 = 0$`, why: 'The remaining integral.' },
          { do: String.raw`$\displaystyle\int_0^\pi x\sin x\,\mathrm d x = \pi + 0 = \pi$`, why: 'Add the two pieces.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\int_1^e x\ln x\,\mathrm d x$`, problem: String.raw`Compute $\displaystyle\int_1^e x\ln x\,\mathrm d x$ (you met the antiderivative in the $\ln x$ lesson).`, steps: [
          { prompt: String.raw`With $u = \ln x$, $v = \frac{x^2}{2}$: evaluate the boundary term $\Big[\frac{x^2}{2}\ln x\Big]_1^e$.`, ask: { kind: 'numeric', answer: 'exp(2)/2', tol: 1e-6 }, hint: String.raw`$\ln e = 1$ and $\ln 1 = 0$.`, reveal: String.raw`$\frac{e^2}{2}\cdot 1 - \frac12\cdot 0 = \frac{e^2}{2}$.` },
          { prompt: String.raw`The remaining integral is $\int_1^e \frac{x}{2}\,\mathrm d x$. Its value?`, ask: { kind: 'numeric', answer: '(exp(2) - 1)/4', tol: 1e-6 }, hint: String.raw`$\Big[\frac{x^2}{4}\Big]_1^e$.`, reveal: String.raw`$\frac{e^2}{4} - \frac14 = \frac{e^2 - 1}{4}$.` },
          { prompt: String.raw`Boundary term minus remaining integral = ?`, ask: { kind: 'numeric', answer: '(exp(2) + 1)/4', tol: 1e-6 }, hint: String.raw`$\frac{e^2}{2} - \frac{e^2 - 1}{4}$; write over the denominator 4.`, reveal: String.raw`$\frac{2e^2 - e^2 + 1}{4} = \frac{e^2 + 1}{4} \approx 2.0973$.` },
        ] },
        { type: 'refresher', title: String.raw`rewriting $\frac{x^2}{1 + x^2}$ (add and subtract)`, html: String.raw`<p>When numerator and denominator have the same degree, add and subtract to split off a whole part.</p>`, steps: [
          { do: String.raw`$\dfrac{x^2}{1 + x^2} = \dfrac{x^2 + 1 - 1}{1 + x^2}$`, why: String.raw`Add and subtract $1$ in the numerator (adds nothing overall).` },
          { do: String.raw`$= \dfrac{x^2 + 1}{1 + x^2} - \dfrac{1}{1 + x^2} = 1 - \dfrac{1}{1 + x^2}$`, why: 'Split the fraction; the first part cancels to 1.' },
          { do: String.raw`$\displaystyle\int \frac{x^2}{1 + x^2}\,\mathrm d x = x - \arctan x$`, why: String.raw`$\int\frac{\mathrm d x}{1 + x^2} = \arctan x$.` },
        ] },
        { type: 'steps', title: String.raw`Worked example: $\displaystyle\int x\arctan x\,\mathrm d x$`, steps: [
          { do: String.raw`$u = \arctan x,\quad \mathrm d v = x\,\mathrm d x$`, why: String.raw`LIATE: Inverse trig before Algebraic (and we cannot integrate $\arctan x$ as $\mathrm d v$ easily).` },
          { do: String.raw`$\mathrm d u = \dfrac{1}{1 + x^2}\,\mathrm d x,\quad v = \dfrac{x^2}{2}$`, why: 'Differentiate $u$, integrate $x$.' },
          { do: String.raw`$\displaystyle\int x\arctan x\,\mathrm d x = \frac{x^2}{2}\arctan x - \int \frac{x^2}{2}\cdot\frac{1}{1 + x^2}\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$.` },
          { do: String.raw`$= \dfrac{x^2}{2}\arctan x - \dfrac12\displaystyle\int \frac{x^2}{1 + x^2}\,\mathrm d x$`, why: String.raw`Pull the constant $\frac12$ out.` },
          { do: String.raw`$= \dfrac{x^2}{2}\arctan x - \dfrac12\big(x - \arctan x\big) + C$`, why: 'Refresher: add and subtract 1.' },
          { do: String.raw`$= \dfrac{x^2 + 1}{2}\arctan x - \dfrac{x}{2} + C$`, why: String.raw`Collect the two $\arctan x$ terms: $\frac{x^2}{2} + \frac12 = \frac{x^2 + 1}{2}$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\int_0^{\sqrt3} x\arctan x\,\mathrm d x$`, problem: String.raw`Compute $\displaystyle\int_0^{\sqrt3} x\arctan x\,\mathrm d x$ with the definite form of parts.`, steps: [
          { prompt: String.raw`Boundary term: $\Big[\frac{x^2}{2}\arctan x\Big]_0^{\sqrt3} = \;?$`, ask: { kind: 'numeric', answer: '3/2*pi/3', tol: 1e-6 }, hint: String.raw`$(\sqrt3)^2 = 3$ and $\arctan\sqrt3 = \frac{\pi}{3}$.`, reveal: String.raw`$\frac32\cdot\frac{\pi}{3} - 0 = \frac{\pi}{2}$.` },
          { prompt: String.raw`Remaining integral: $\frac12\int_0^{\sqrt3}\frac{x^2}{1 + x^2}\,\mathrm d x = \frac12\Big[x - \arctan x\Big]_0^{\sqrt3} = \;?$`, ask: { kind: 'numeric', answer: '(sqrt(3) - pi/3)/2', tol: 1e-6 }, hint: String.raw`At $\sqrt3$: $\sqrt3 - \frac\pi3$. At $0$: $0$.`, reveal: String.raw`$\frac12\left(\sqrt3 - \frac{\pi}{3}\right)$.` },
          { prompt: 'The value of the integral?', ask: { kind: 'numeric', answer: '2*pi/3 - sqrt(3)/2', tol: 1e-6 }, hint: 'Boundary term minus remaining integral.', reveal: String.raw`$\frac{\pi}{2} - \frac{\sqrt3}{2} + \frac{\pi}{6} = \frac{2\pi}{3} - \frac{\sqrt3}{2} \approx 1.2284$.` },
        ] },
      ],
    },
    {
      id: 'repeated-parts',
      title: String.raw`Parts twice: x² times e^x, sin x or cos x`,
      blocks: [
        { type: 'text', html: String.raw`<p>With $x^2$ in front, one round of parts lowers the power to $x^1$; a second round lowers it to $x^0 = 1$, and then the integral is basic. Keep the same kind of choice in each round: $u$ = the power of $x$.</p>` },
        { type: 'steps', title: String.raw`Worked example: $\displaystyle\int x^2 e^x\,\mathrm d x$`, steps: [
          { do: String.raw`Round 1: $u = x^2,\ \mathrm d v = e^x\,\mathrm d x$; $\;\mathrm d u = 2x\,\mathrm d x,\ v = e^x$`, why: 'A before E; differentiate $u$, integrate $\\mathrm d v$.' },
          { do: String.raw`$\displaystyle\int x^2 e^x\,\mathrm d x = x^2 e^x - \int 2x\,e^x\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$. The new integral has $x^1$ instead of $x^2$: progress.` },
          { do: String.raw`Round 2: $\displaystyle\int x e^x\,\mathrm d x$ with $u = x,\ \mathrm d v = e^x\,\mathrm d x$`, why: 'Same kind of choice again: $u$ = the power of $x$.' },
          { do: String.raw`$\displaystyle\int x e^x\,\mathrm d x = x e^x - \int e^x\,\mathrm d x = x e^x - e^x$`, why: 'This is the guided exercise of the first lesson.' },
          { do: String.raw`$\displaystyle\int x^2 e^x\,\mathrm d x = x^2 e^x - 2\left(x e^x - e^x\right) + C$`, why: String.raw`Put round 2 into round 1; the constant $2$ multiplies the <b>whole</b> bracket.` },
          { do: String.raw`$= x^2 e^x - 2x e^x + 2e^x + C = e^x\left(x^2 - 2x + 2\right) + C$`, why: String.raw`Multiply out; factor $e^x$.` },
        ] },
        { type: 'text', html: String.raw`<p>The bookkeeping is quicker in a <b>table</b>: differentiate $u$ down to zero, integrate $\mathrm d v$ the same number of times, then multiply each $u$-entry with the $\mathrm d v$-entry one row lower, with signs $+, -, +, \dots$</p>` },
        { type: 'table', head: ['sign', String.raw`$u$ and derivatives`, String.raw`$\mathrm d v$ and integrals`], rows: [
          ['+', String.raw`$x^2$`, String.raw`$e^x$`],
          ['−', String.raw`$2x$`, String.raw`$e^x$`],
          ['+', String.raw`$2$`, String.raw`$e^x$`],
          ['', String.raw`$0$`, String.raw`$e^x$`],
        ] },
        { type: 'text', html: String.raw`<p>Reading diagonally: $+x^2\cdot e^x - 2x\cdot e^x + 2\cdot e^x$ — the same result.</p>` },
        { type: 'guided', title: String.raw`$\displaystyle\int x^2\sin x\,\mathrm d x$`, problem: String.raw`Find $\displaystyle\int x^2\sin x\,\mathrm d x$ with two rounds of parts.`, steps: [
          { prompt: String.raw`Round 1: $u = x^2$, $\mathrm d v = \sin x\,\mathrm d x$, so $\mathrm d u = 2x\,\mathrm d x$ and $v = -\cos x$. Type $uv$.`, ask: { kind: 'expression', variable: 'x', answer: '-x.^2.*cos(x)' }, hint: String.raw`$x^2\cdot(-\cos x)$.`, reveal: String.raw`$\int x^2\sin x\,\mathrm d x = -x^2\cos x - \int(-\cos x)\,2x\,\mathrm d x = -x^2\cos x + 2\int x\cos x\,\mathrm d x$.` },
          { prompt: String.raw`Round 2: type $\int x\cos x\,\mathrm d x$ (worked in the first lesson).`, ask: { kind: 'expression', variable: 'x', answer: 'x.*sin(x) + cos(x)', upToConstant: true }, hint: String.raw`$u = x$, $v = \sin x$.`, reveal: String.raw`$\int x\cos x\,\mathrm d x = x\sin x + \cos x$.` },
          { prompt: String.raw`Combine: type $\int x^2\sin x\,\mathrm d x$.`, ask: { kind: 'expression', variable: 'x', answer: '-x.^2.*cos(x) + 2*x.*sin(x) + 2*cos(x)', upToConstant: true }, hint: String.raw`$-x^2\cos x + 2\left(x\sin x + \cos x\right)$.`, reveal: String.raw`$\int x^2\sin x\,\mathrm d x = -x^2\cos x + 2x\sin x + 2\cos x + C$.` },
        ] },
        { type: 'steps', title: String.raw`Worked example (definite): $\displaystyle\int_0^1 x^2 e^x\,\mathrm d x$`, steps: [
          { do: String.raw`$\displaystyle\int x^2 e^x\,\mathrm d x = e^x\left(x^2 - 2x + 2\right)$`, why: 'The antiderivative from the first example.' },
          { do: String.raw`At $x = 1$: $\; e^1(1 - 2 + 2) = e$`, why: 'Upper limit.' },
          { do: String.raw`At $x = 0$: $\; e^0(0 - 0 + 2) = 2$`, why: String.raw`Lower limit; $e^0 = 1$.` },
          { do: String.raw`$\displaystyle\int_0^1 x^2 e^x\,\mathrm d x = e - 2 \approx 0.7183$`, why: 'Upper minus lower.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\int_0^2 x^2 e^{-x}\,\mathrm d x$`, problem: String.raw`Compute $\displaystyle\int_0^2 x^2 e^{-x}\,\mathrm d x$. Use the table with $\mathrm d v = e^{-x}\,\mathrm d x$ (each integration of $e^{-x}$ gives $-e^{-x}$, then $e^{-x}$, …).`, steps: [
          { prompt: String.raw`The table gives $x^2(-e^{-x}) - 2x(e^{-x}) + 2(-e^{-x})$. Type this antiderivative.`, ask: { kind: 'expression', variable: 'x', answer: '-exp(-x).*(x.^2 + 2*x + 2)', upToConstant: true }, hint: String.raw`Factor out $-e^{-x}$.`, reveal: String.raw`$\int x^2e^{-x}\,\mathrm d x = -e^{-x}\left(x^2 + 2x + 2\right) + C$.` },
          { prompt: String.raw`Value of the antiderivative at $x = 2$?`, ask: { kind: 'numeric', answer: '-10*exp(-2)', tol: 1e-6 }, hint: String.raw`$-e^{-2}(4 + 4 + 2)$.`, reveal: String.raw`$-10e^{-2}$.` },
          { prompt: String.raw`Value at $x = 0$, and then the integral?`, ask: { kind: 'numeric', answer: '2 - 10*exp(-2)', tol: 1e-6 }, hint: String.raw`At $0$: $-e^{0}(0 + 0 + 2) = -2$. Upper minus lower.`, reveal: String.raw`$-10e^{-2} - (-2) = 2 - 10e^{-2} \approx 0.6467$.` },
        ] },
        { type: 'quiz', question: String.raw`How many integrations by parts does $\int x^3\cos x\,\mathrm d x$ need (with $u$ a power of $x$ each time)?`, choices: ['1', '2', '3', '4'], answer: 2, explain: String.raw`Each round lowers the power of $x$ by one: $x^3 \to x^2 \to x \to 1$, three rounds, after which only $\int \sin x$ or $\int \cos x$ remains.` },
      ],
    },
    {
      id: 'log-power',
      title: String.raw`Parts twice with logarithms: (ln x)²`,
      blocks: [
        { type: 'text', html: String.raw`<p>$(\ln x)^2$ is integrated with the invisible factor $\mathrm d v = \mathrm d x$. One round turns $(\ln x)^2$ into $\ln x$; a second round (the $\int\ln x$ example) finishes the job.</p>` },
        { type: 'refresher', title: String.raw`differentiating $(\ln x)^2$`, html: String.raw`<p>Chain rule: outer function "square", inner function $\ln x$. $\frac{\mathrm d}{\mathrm d x}(\ln x)^2 = 2\ln x\cdot\frac1x = \frac{2\ln x}{x}$.</p>` },
        { type: 'steps', title: String.raw`Worked example: $\displaystyle\int (\ln x)^2\,\mathrm d x$`, steps: [
          { do: String.raw`$u = (\ln x)^2,\quad \mathrm d v = \mathrm d x$`, why: 'Invisible factor.' },
          { do: String.raw`$\mathrm d u = \dfrac{2\ln x}{x}\,\mathrm d x,\quad v = x$`, why: 'Refresher (chain rule); integrate 1.' },
          { do: String.raw`$\displaystyle\int (\ln x)^2\,\mathrm d x = x(\ln x)^2 - \int x\cdot\frac{2\ln x}{x}\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$.` },
          { do: String.raw`$= x(\ln x)^2 - 2\displaystyle\int \ln x\,\mathrm d x$`, why: String.raw`$x$ cancels; pull out the $2$.` },
          { do: String.raw`$\displaystyle\int \ln x\,\mathrm d x = x\ln x - x$`, why: 'Round 2: the invisible-factor example.' },
          { do: String.raw`$= x(\ln x)^2 - 2\left(x\ln x - x\right) + C = x(\ln x)^2 - 2x\ln x + 2x + C$`, why: 'Substitute back and multiply out the bracket.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\int_1^{e^2} (\ln x)^2\,\mathrm d x$`, problem: String.raw`Use the antiderivative $F(x) = x(\ln x)^2 - 2x\ln x + 2x$ to compute $\displaystyle\int_1^{e^2}(\ln x)^2\,\mathrm d x$.`, steps: [
          { prompt: String.raw`What is $\ln(e^2)$?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`$\ln$ undoes $e^{\cdots}$.`, reveal: String.raw`$\ln(e^2) = 2$.` },
          { prompt: String.raw`$F(e^2) = e^2\cdot 2^2 - 2e^2\cdot 2 + 2e^2 = \;?$`, ask: { kind: 'numeric', answer: '2*exp(2)', tol: 1e-6 }, hint: String.raw`$4e^2 - 4e^2 + 2e^2$.`, reveal: String.raw`$F(e^2) = 2e^2$.` },
          { prompt: String.raw`$F(1)$ (use $\ln 1 = 0$), and then the integral?`, ask: { kind: 'numeric', answer: '2*exp(2) - 2', tol: 1e-6 }, hint: String.raw`$F(1) = 0 - 0 + 2 = 2$.`, reveal: String.raw`$\int_1^{e^2}(\ln x)^2\,\mathrm d x = 2e^2 - 2 \approx 12.778$.` },
        ] },
      ],
    },
    {
      id: 'solve-for-integral',
      title: 'When the integral comes back: solving for it',
      blocks: [
        { type: 'text', html: String.raw`<p>For $e^x\sin x$ neither factor ever becomes simpler: differentiating $\sin$ gives $\cos$, then $-\sin$ again. After two rounds the <b>original integral comes back</b>. Call it $I$; then the result is an ordinary equation that can be <b>solved</b> for $I$. The slope field below shows the slopes $e^x\sin x$; the curve $F + C$ follows them for every $C$.</p>` },
        { type: 'widget', name: 'antiderivative', config: {
          title: 'F(x) = e^x (sin x − cos x)/2 fits the slope field of e^x sin x',
          f: 'exp(x).*sin(x)', F: 'exp(x).*(sin(x)-cos(x))/2', xlim: [-4, 2.5], ylim: [-4, 9],
        } },
        { type: 'refresher', title: String.raw`solving an equation for $I$`, html: String.raw`<p>Treat $I$ like an unknown number $y$: from $I = A - I$ we get $2I = A$, so $I = \frac A2$. From $I = A - \frac14 I$ we get $\frac54 I = A$, so $I = \frac45 A$.</p>` },
        { type: 'steps', title: String.raw`Worked example: $I = \displaystyle\int e^x\sin x\,\mathrm d x$`, steps: [
          { do: String.raw`Round 1: $u = \sin x,\ \mathrm d v = e^x\,\mathrm d x$; $\;\mathrm d u = \cos x\,\mathrm d x,\ v = e^x$`, why: 'T before E. (Choosing $u = e^x$ also works, as long as you keep the same choice in round 2.)' },
          { do: String.raw`$I = e^x\sin x - \displaystyle\int e^x\cos x\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$.` },
          { do: String.raw`Round 2: $u = \cos x,\ \mathrm d v = e^x\,\mathrm d x$; $\;\mathrm d u = -\sin x\,\mathrm d x,\ v = e^x$`, why: String.raw`<b>Keep the same roles</b>: the trig function is $u$ again.` },
          { do: String.raw`$\displaystyle\int e^x\cos x\,\mathrm d x = e^x\cos x - \int e^x(-\sin x)\,\mathrm d x = e^x\cos x + I$`, why: String.raw`$uv - \int v\,\mathrm d u$; the last integral is the original $I$.` },
          { do: String.raw`$I = e^x\sin x - \big(e^x\cos x + I\big) = e^x\sin x - e^x\cos x - I$`, why: 'Put round 2 into round 1; the minus sign applies to the whole bracket.' },
          { do: String.raw`$2I = e^x\sin x - e^x\cos x$`, why: String.raw`Add $I$ to both sides.` },
          { do: String.raw`$I = \tfrac12 e^x(\sin x - \cos x) + C$`, why: String.raw`Divide by $2$; add the constant at the end.` },
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>If you swap the roles in the second round ($u = e^x$), the two integrations cancel and you get the useless identity $I = I$.</p>` },
        { type: 'steps', title: String.raw`Worked example (definite): $\displaystyle\int_0^{\pi/2} e^x\sin x\,\mathrm d x$`, steps: [
          { do: String.raw`$F(x) = \tfrac12 e^x(\sin x - \cos x)$`, why: 'Antiderivative from the previous example.' },
          { do: String.raw`$F(\tfrac{\pi}{2}) = \tfrac12 e^{\pi/2}(1 - 0) = \tfrac12 e^{\pi/2}$`, why: String.raw`$\sin\frac\pi2 = 1$, $\cos\frac\pi2 = 0$.` },
          { do: String.raw`$F(0) = \tfrac12 e^{0}(0 - 1) = -\tfrac12$`, why: String.raw`$\sin 0 = 0$, $\cos 0 = 1$.` },
          { do: String.raw`$\displaystyle\int_0^{\pi/2} e^x\sin x\,\mathrm d x = \tfrac12 e^{\pi/2} + \tfrac12 = \frac{e^{\pi/2} + 1}{2} \approx 2.905$`, why: 'Upper minus lower.' },
        ] },
        { type: 'guided', title: String.raw`$I = \displaystyle\int e^{2x}\sin x\,\mathrm d x$, then $\displaystyle\int_0^\pi$`, problem: String.raw`Find $I = \int e^{2x}\sin x\,\mathrm d x$ by solving for $I$, then compute $\int_0^\pi e^{2x}\sin x\,\mathrm d x$. Keep $u$ = the trig function and $\mathrm d v = e^{2x}\,\mathrm d x$, so $v = \frac12 e^{2x}$, in both rounds.`, steps: [
          { prompt: String.raw`Round 1 gives $I = \frac12 e^{2x}\sin x - \frac12\int e^{2x}\cos x\,\mathrm d x$. Round 2 gives $\int e^{2x}\cos x\,\mathrm d x = \frac12 e^{2x}\cos x + \frac12 I$. Substituting: $I = \frac12 e^{2x}\sin x - \frac14 e^{2x}\cos x - c\,I$. What is $c$?`, ask: { kind: 'numeric', answer: '1/4' }, hint: String.raw`$-\frac12\cdot\frac12 I$.`, reveal: String.raw`$c = \frac14$: $\;I = \frac12 e^{2x}\sin x - \frac14 e^{2x}\cos x - \frac14 I$.` },
          { prompt: String.raw`Solve for $I$ (add $\frac14 I$, then multiply by $\frac45$). Type $I$.`, ask: { kind: 'expression', variable: 'x', answer: 'exp(2*x).*(2*sin(x) - cos(x))/5', upToConstant: true }, hint: String.raw`$\frac54 I = \frac14 e^{2x}(2\sin x - \cos x)$.`, reveal: String.raw`$I = \frac15 e^{2x}(2\sin x - \cos x) + C$.` },
          { prompt: String.raw`Evaluate $\int_0^\pi e^{2x}\sin x\,\mathrm d x$.`, ask: { kind: 'numeric', answer: '(exp(2*pi) + 1)/5', tol: 1e-6 }, hint: String.raw`At $\pi$: $\frac15 e^{2\pi}(0 - (-1))$. At $0$: $\frac15(0 - 1)$.`, reveal: String.raw`$\frac{e^{2\pi}}{5} - \left(-\frac15\right) = \frac{e^{2\pi} + 1}{5} \approx 107.3$.` },
        ] },
      ],
    },
    {
      id: 'reduction-formulas',
      title: String.raw`Reduction formulas: Wallis' integrals`,
      blocks: [
        { type: 'text', html: String.raw`<p>Integration by parts applied to a whole family $I_n$ gives a <b>reduction formula</b>: $I_n$ in terms of $I_{n-1}$ or $I_{n-2}$. Starting from one or two easy members, a recursion produces all the others. Slide $n$: the areas $C_n = \int_0^{\pi/2}\cos^n x\,\mathrm d x$ shrink as the graph concentrates near $x = 0$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'cos^n x on [0, π/2]',
          functions: [{ expr: 'cos(x).^n', label: '$\\cos^n x$' }],
          params: { n: { min: 0, max: 20, value: 2, step: 1, label: '$n$' } },
          shade: { expr: 'cos(x).^n', from: 0, to: 'pi/2' },
          xlim: [-0.1, 1.7], ylim: [-0.1, 1.15],
          readout: String.raw`$C_n = \int_0^{\pi/2}\cos^n x\,\mathrm dx = {{sqrt(pi)*gamma((n+1)/2)/(2*gamma(n/2+1))}}$`,
        } },
        { type: 'refresher', title: String.raw`the identity $\sin^2 x + \cos^2 x = 1$`, html: String.raw`<p>For every $x$: $\sin^2 x + \cos^2 x = 1$, so $\sin^2 x = 1 - \cos^2 x$ and $\cos^2 x = 1 - \sin^2 x$. We use it to turn an unwanted $\sin^2$ back into cosines.</p>` },
        { type: 'steps', title: String.raw`Derivation: $C_n = \displaystyle\int_0^{\pi/2}\cos^n x\,\mathrm d x = \frac{n-1}{n}\,C_{n-2}$ for $n \ge 2$`, steps: [
          { do: String.raw`$\cos^n x = \cos^{n-1}x\cdot\cos x$`, why: 'Split off one factor that we know how to integrate.' },
          { do: String.raw`$u = \cos^{n-1}x,\quad \mathrm d v = \cos x\,\mathrm d x$`, why: 'The power is differentiated, the single cosine integrated.' },
          { do: String.raw`$\mathrm d u = -(n-1)\cos^{n-2}x\,\sin x\,\mathrm d x,\quad v = \sin x$`, why: String.raw`Chain rule: power rule on the outside, $\frac{\mathrm d}{\mathrm d x}\cos x = -\sin x$ inside.` },
          { do: String.raw`$C_n = \Big[\cos^{n-1}x\,\sin x\Big]_0^{\pi/2} + (n-1)\displaystyle\int_0^{\pi/2}\cos^{n-2}x\,\sin^2 x\,\mathrm d x$`, why: String.raw`$\big[uv\big] - \int v\,\mathrm d u$; the two minus signs give a plus.` },
          { do: String.raw`$\Big[\cos^{n-1}x\,\sin x\Big]_0^{\pi/2} = 0 - 0 = 0$`, why: String.raw`At $\frac\pi2$: $\cos = 0$ (and $n - 1 \ge 1$). At $0$: $\sin 0 = 0$.` },
          { do: String.raw`$C_n = (n-1)\displaystyle\int_0^{\pi/2}\cos^{n-2}x\,\big(1 - \cos^2 x\big)\,\mathrm d x$`, why: String.raw`Refresher: $\sin^2 x = 1 - \cos^2 x$.` },
          { do: String.raw`$C_n = (n-1)\big(C_{n-2} - C_n\big)$`, why: String.raw`Multiply out: $\int\cos^{n-2}x = C_{n-2}$ and $\int\cos^{n}x = C_n$ — the original integral is back.` },
          { do: String.raw`$C_n + (n-1)C_n = (n-1)C_{n-2} \;\Rightarrow\; nC_n = (n-1)C_{n-2}$`, why: String.raw`Solve for $C_n$: bring the $C_n$ terms to the left.` },
          { do: String.raw`$C_n = \dfrac{n-1}{n}\,C_{n-2}$`, why: String.raw`Divide by $n$.` },
        ] },
        { type: 'steps', title: String.raw`Applying it: $C_4$ and $C_5$`, steps: [
          { do: String.raw`$C_0 = \displaystyle\int_0^{\pi/2}1\,\mathrm d x = \frac{\pi}{2},\qquad C_1 = \int_0^{\pi/2}\cos x\,\mathrm d x = 1$`, why: 'The two starting values (one for even, one for odd $n$).' },
          { do: String.raw`$C_2 = \dfrac12 C_0 = \dfrac{\pi}{4}$`, why: String.raw`$n = 2$: factor $\frac{2-1}{2}$.` },
          { do: String.raw`$C_4 = \dfrac34 C_2 = \dfrac34\cdot\dfrac{\pi}{4} = \dfrac{3\pi}{16}$`, why: String.raw`$n = 4$: factor $\frac34$.` },
          { do: String.raw`$C_3 = \dfrac23 C_1 = \dfrac23,\qquad C_5 = \dfrac45 C_3 = \dfrac{8}{15}$`, why: 'Odd $n$ start from $C_1$.' },
        ] },
        { type: 'guided', title: String.raw`$S_n = \displaystyle\int_0^{\pi/2}\sin^n x\,\mathrm d x$`, problem: String.raw`Derive a reduction formula for $S_n = \int_0^{\pi/2}\sin^n x\,\mathrm d x$ with $u = \sin^{n-1}x$, $\mathrm d v = \sin x\,\mathrm d x$, and use it.`, steps: [
          { prompt: String.raw`$\mathrm d u = (n-1)\sin^{n-2}x\cos x\,\mathrm d x$ and $v = -\cos x$. The boundary term is $\Big[-\sin^{n-1}x\cos x\Big]_0^{\pi/2}$ (for $n \ge 2$). Its value?`, ask: { kind: 'numeric', answer: '0' }, hint: String.raw`$\cos\frac\pi2 = 0$ and $\sin 0 = 0$.`, reveal: String.raw`$0 - 0 = 0$. So $S_n = (n-1)\int_0^{\pi/2}\sin^{n-2}x\cos^2 x\,\mathrm d x$.` },
          { prompt: String.raw`Write $\cos^2 x = 1 - \sin^2 x$ and solve for $S_n$. Which formula do you get?`, ask: { kind: 'choice', choices: [String.raw`$S_n = \frac{n-1}{n}S_{n-2}$`, String.raw`$S_n = \frac{n}{n-1}S_{n-2}$`, String.raw`$S_n = (n-1)S_{n-2}$`, String.raw`$S_n = \frac{n-1}{n}S_{n-1}$`], answer: 0 }, hint: String.raw`$S_n = (n-1)(S_{n-2} - S_n)$; bring $S_n$ to the left.`, reveal: String.raw`$nS_n = (n-1)S_{n-2}$, so $S_n = \frac{n-1}{n}S_{n-2}$ — the same as for cosines.` },
          { prompt: String.raw`With $S_1 = \int_0^{\pi/2}\sin x\,\mathrm d x = 1$: compute $S_5$.`, ask: { kind: 'numeric', answer: '8/15', tol: 1e-9 }, hint: String.raw`$S_3 = \frac23 S_1$, then $S_5 = \frac45 S_3$.`, reveal: String.raw`$S_3 = \frac23$, $S_5 = \frac45\cdot\frac23 = \frac{8}{15}$.` },
        ] },
        { type: 'callout', kind: 'exam', html: String.raw`<p>A reduction-formula problem has two parts: <b>derive</b> the formula (state $u$ and $\mathrm d v$, show why the boundary term vanishes, use an identity to bring back $I_n$, solve for $I_n$), then <b>apply</b> it, showing every step of the recursion. A MATLAB loop that reproduces the values with <code>integral</code> is a convincing check.</p>` },
      ],
    },
    {
      id: 'reduction-algebraic',
      title: String.raw`Reduction formulas for (1 − x^k)^n`,
      blocks: [
        { type: 'text', html: String.raw`<p>The same three ideas — parts, a vanishing boundary term, an identity that brings the original integral back — work for algebraic families such as $\int_0^1 (1 - x^3)^n\,\mathrm d x$. Here the identity is not trigonometric but plain algebra.</p>` },
        { type: 'refresher', title: String.raw`the trick $x^3 = 1 - (1 - x^3)$`, html: String.raw`<p>Adding and subtracting $1$ changes nothing: $x^3 = 1 - 1 + x^3 = 1 - (1 - x^3)$. It lets us write $x^3(1 - x^3)^{n-1} = (1 - x^3)^{n-1} - (1 - x^3)^{n}$: two members of the family.</p>` },
        { type: 'steps', title: String.raw`Worked example: $Q_n = \displaystyle\int_0^1 (1 - x^3)^n\,\mathrm d x = \frac{3n}{3n+1}\,Q_{n-1}$ for $n \ge 1$`, steps: [
          { do: String.raw`$u = (1 - x^3)^n,\quad \mathrm d v = \mathrm d x$`, why: 'The invisible factor: we only know how to differentiate the power.' },
          { do: String.raw`$\mathrm d u = n(1 - x^3)^{n-1}\cdot(-3x^2)\,\mathrm d x = -3nx^2(1 - x^3)^{n-1}\,\mathrm d x,\quad v = x$`, why: String.raw`Chain rule: outer power $n$, inner derivative $-3x^2$.` },
          { do: String.raw`$Q_n = \Big[x(1 - x^3)^n\Big]_0^1 + 3n\displaystyle\int_0^1 x^3(1 - x^3)^{n-1}\,\mathrm d x$`, why: String.raw`$\big[uv\big] - \int v\,\mathrm d u$; $x\cdot x^2 = x^3$ and the two minus signs give plus.` },
          { do: String.raw`$\Big[x(1 - x^3)^n\Big]_0^1 = 1\cdot 0^n - 0 = 0$`, why: String.raw`At $x = 1$ the bracket $1 - 1^3$ is $0$ (and $n \ge 1$); at $x = 0$ the factor $x$ is $0$.` },
          { do: String.raw`$Q_n = 3n\displaystyle\int_0^1\Big((1 - x^3)^{n-1} - (1 - x^3)^n\Big)\mathrm d x$`, why: String.raw`Refresher: $x^3 = 1 - (1 - x^3)$.` },
          { do: String.raw`$Q_n = 3n\big(Q_{n-1} - Q_n\big)$`, why: 'Both integrals are members of the family.' },
          { do: String.raw`$Q_n + 3nQ_n = 3nQ_{n-1} \;\Rightarrow\; (3n + 1)Q_n = 3nQ_{n-1}$`, why: String.raw`Bring the $Q_n$ terms to the left.` },
          { do: String.raw`$Q_n = \dfrac{3n}{3n+1}\,Q_{n-1}$`, why: String.raw`Divide by $3n + 1$.` },
          { do: String.raw`$Q_0 = 1,\quad Q_1 = \dfrac34,\quad Q_2 = \dfrac67\cdot\dfrac34 = \dfrac{9}{14}$`, why: String.raw`Apply it. Check $Q_1 = \int_0^1(1 - x^3)\,\mathrm d x = 1 - \frac14$ ✓.` },
        ] },
        { type: 'guided', title: String.raw`$R_n = \displaystyle\int_0^1 (1 - x^4)^n\,\mathrm d x$`, problem: String.raw`Derive a reduction formula for $R_n = \int_0^1 (1 - x^4)^n\,\mathrm d x$ with $u = (1 - x^4)^n$, $\mathrm d v = \mathrm d x$, and compute $R_2$.`, steps: [
          { prompt: String.raw`$\mathrm d u = -4nx^3(1 - x^4)^{n-1}\,\mathrm d x$ and $v = x$. Value of the boundary term $\Big[x(1 - x^4)^n\Big]_0^1$ for $n \ge 1$?`, ask: { kind: 'numeric', answer: '0' }, hint: String.raw`At $1$ the bracket $1 - 1^4$ vanishes; at $0$ the factor $x$ vanishes.`, reveal: String.raw`$0$. So $R_n = 4n\int_0^1 x^4(1 - x^4)^{n-1}\,\mathrm d x$.` },
          { prompt: String.raw`Write $x^4 = 1 - (1 - x^4)$ and solve for $R_n$. Which formula do you get?`, ask: { kind: 'choice', choices: [String.raw`$R_n = \frac{4n}{4n+1}R_{n-1}$`, String.raw`$R_n = \frac{4n+1}{4n}R_{n-1}$`, String.raw`$R_n = \frac{n}{n+1}R_{n-1}$`, String.raw`$R_n = 1 - 4nR_{n-1}$`], answer: 0 }, hint: String.raw`$R_n = 4n(R_{n-1} - R_n)$.`, reveal: String.raw`$(4n + 1)R_n = 4nR_{n-1}$, so $R_n = \frac{4n}{4n+1}R_{n-1}$.` },
          { prompt: String.raw`With $R_0 = 1$, compute $R_2$.`, ask: { kind: 'numeric', answer: '32/45', tol: 1e-9 }, hint: String.raw`$R_1 = \frac45 R_0$, $R_2 = \frac89 R_1$.`, reveal: String.raw`$R_1 = \frac45$, $R_2 = \frac89\cdot\frac45 = \frac{32}{45}$.` },
        ] },
      ],
    },
    {
      id: 'reduction-exp',
      title: String.raw`Reduction formulas with x^n e^x`,
      blocks: [
        { type: 'text', html: String.raw`<p>For $J_n = \int_0^1 x^n e^x\,\mathrm d x$ one round of parts lowers $n$ by one. No identity is needed; the recursion runs downwards from $J_n$ to $J_0$, and we compute upwards from $J_0$.</p>` },
        { type: 'steps', title: String.raw`Derivation and use: $J_n = \displaystyle\int_0^1 x^n e^x\,\mathrm d x$`, steps: [
          { do: String.raw`$u = x^n,\ \mathrm d v = e^x\,\mathrm d x$; $\;\mathrm d u = nx^{n-1}\,\mathrm d x,\ v = e^x$`, why: 'A before E.' },
          { do: String.raw`$J_n = \Big[x^n e^x\Big]_0^1 - n\displaystyle\int_0^1 x^{n-1}e^x\,\mathrm d x$`, why: String.raw`Definite parts; the constant $n$ comes out of the integral.` },
          { do: String.raw`$\Big[x^n e^x\Big]_0^1 = 1\cdot e - 0 = e$`, why: String.raw`For $n \ge 1$, $0^n = 0$.` },
          { do: String.raw`$J_n = e - nJ_{n-1}$`, why: String.raw`The remaining integral is $J_{n-1}$.` },
          { do: String.raw`$J_0 = \displaystyle\int_0^1 e^x\,\mathrm d x = e - 1$`, why: 'Starting value.' },
          { do: String.raw`$J_1 = e - 1\cdot(e - 1) = 1$`, why: String.raw`$n = 1$.` },
          { do: String.raw`$J_2 = e - 2\cdot 1 = e - 2$`, why: String.raw`$n = 2$ — the same as the definite example $\int_0^1 x^2e^x\,\mathrm d x$ ✓.` },
        ] },
        { type: 'guided', title: String.raw`$L_n = \displaystyle\int_0^1 x^n e^{-x}\,\mathrm d x$`, problem: String.raw`Derive a reduction formula for $L_n = \int_0^1 x^n e^{-x}\,\mathrm d x$ and compute $L_2$. Take $u = x^n$, $\mathrm d v = e^{-x}\,\mathrm d x$, so $v = -e^{-x}$.`, steps: [
          { prompt: String.raw`Boundary term $\Big[-x^n e^{-x}\Big]_0^1$ for $n \ge 1$?`, ask: { kind: 'numeric', answer: '-exp(-1)', tol: 1e-6 }, hint: String.raw`At $1$: $-1\cdot e^{-1}$. At $0$: $0$.`, reveal: String.raw`$-e^{-1}$.` },
          { prompt: String.raw`The remaining part is $-\int_0^1(-e^{-x})\,nx^{n-1}\,\mathrm d x = +nL_{n-1}$. So $L_n = -e^{-1} + nL_{n-1}$. With $L_0 = 1 - e^{-1}$, compute $L_1$.`, ask: { kind: 'numeric', answer: '1 - 2*exp(-1)', tol: 1e-6 }, hint: String.raw`$L_1 = -e^{-1} + 1\cdot(1 - e^{-1})$.`, reveal: String.raw`$L_1 = 1 - 2e^{-1} \approx 0.2642$.` },
          { prompt: String.raw`Compute $L_2$.`, ask: { kind: 'numeric', answer: '2 - 5*exp(-1)', tol: 1e-6 }, hint: String.raw`$L_2 = -e^{-1} + 2L_1$.`, reveal: String.raw`$L_2 = -e^{-1} + 2 - 4e^{-1} = 2 - 5e^{-1} \approx 0.1606$.` },
        ] },
        { type: 'quiz', question: String.raw`With $J_n = \int_0^1 x^n e^x\,\mathrm d x = e - nJ_{n-1}$ and $J_0 = e - 1$, what is $J_2$?`, choices: [String.raw`$e - 2$`, String.raw`$2 - e$`, String.raw`$1$`, String.raw`$e - 1$`], answer: 0, explain: String.raw`$J_1 = e - (e - 1) = 1$ and $J_2 = e - 2\cdot 1 = e - 2 \approx 0.718$.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'parts-live-script',
      title: 'The parts formula in LaTeX and checks with integral',
      blocks: [
        { type: 'text', html: String.raw`<p>In a write-up, state the choice of $u$ and $\mathrm d v$ in a sentence, then show the formula. The thin space <code>\,</code> before $\mathrm d v$ and the upright <code>\mathrm d</code> make it look professional.</p>` },
        { type: 'table', head: ['You type', 'Result'], rows: [
          [String.raw`<code>\int u\,\mathrm d v = uv - \int v\,\mathrm d u</code>`, String.raw`$\int u\,\mathrm d v = uv - \int v\,\mathrm d u$`],
          [String.raw`<code>\Big[ x\sin x \Big]_0^{\pi}</code>`, String.raw`$\Big[ x\sin x \Big]_0^{\pi}$`],
          [String.raw`<code>\arctan x</code>, <code>\arcsin x</code>, <code>\sin^{-1} x</code>`, String.raw`$\arctan x$, $\arcsin x$, $\sin^{-1} x$`],
        ] },
        { type: 'latex', prompt: 'Type the integration by parts formula:', target: String.raw`\int u\,\mathrm d v = uv - \int v\,\mathrm d u` },
        { type: 'latex', prompt: 'Type the definite version:', target: String.raw`\int_a^b u v'\,\mathrm d x = \Big[uv\Big]_a^b - \int_a^b u' v\,\mathrm d x`, accept: [String.raw`\int_a^b u v'\,\mathrm d x = \left[uv\right]_a^b - \int_a^b u' v\,\mathrm d x`, String.raw`\int_a^b u v'\,\mathrm d x = [uv]_a^b - \int_a^b u' v\,\mathrm d x`] },
        { type: 'text', html: String.raw`<p>Every hand computation of a definite integral gets a one-line numerical check. For antiderivatives, compare $F(b) - F(a)$ with <code>integral(f, a, b)</code> on some interval.</p>` },
        { type: 'code', caption: 'Checking two results from the lessons.', editable: true, code: String.raw`format long
I1 = integral(@(x) x.*log(x), 1, exp(1))   % by parts: (e^2 + 1)/4
exact1 = (exp(1)^2 + 1)/4

f = @(x) exp(x).*sin(x);
F = @(x) exp(x).*(sin(x) - cos(x))/2;       % antiderivative found by solving for I
difference = (F(2) - F(-1)) - integral(f, -1, 2)` },
        { type: 'matlab', prompt: String.raw`By parts twice, $\int_0^\pi x^2\sin x\,\mathrm d x = \pi^2 - 4$. Compute the integral numerically in <code>I</code> and the difference <code>d = I - (pi^2 - 4)</code>.`, starter: `I = 0;   % use integral\nd = I - (pi^2 - 4);`, solution: `I = integral(@(x) x.^2.*sin(x), 0, pi);\nd = I - (pi^2 - 4);`, checks: [{ var: 'I', value: 'pi^2 - 4', tol: 1e-8 }, { var: 'd', value: 0, tol: 1e-8 }, { uses: 'integral' }] },
        { type: 'matlab', prompt: String.raw`Check the antiderivative $F(x) = x\arctan x - \tfrac12\ln(1 + x^2)$: define <code>F</code> and compute <code>d = (F(3) - F(0)) - integral(@(x) atan(x), 0, 3)</code>.`, starter: `F = @(x) 0*x;   % replace by the antiderivative\nd = (F(3) - F(0)) - integral(@(x) atan(x), 0, 3);`, solution: `F = @(x) x.*atan(x) - log(1 + x.^2)/2;\nd = (F(3) - F(0)) - integral(@(x) atan(x), 0, 3);`, checks: [{ var: 'F', isFunction: true }, { var: 'd', value: 0, tol: 1e-9, message: '`d` is not zero — check the formula for F.' }] },
      ],
    },
    {
      id: 'reduction-loops',
      title: 'Verifying a reduction formula with a for loop',
      blocks: [
        { type: 'text', html: String.raw`<p>A reduction formula is a recursion, i.e. a <code>for</code> loop. MATLAB indices start at 1, so store $C_n$ in <code>C(n+1)</code>. Comparing with <code>integral</code> for every $n$ verifies the formula.</p>` },
        { type: 'code', caption: 'Wallis integrals by recursion and by integral.', editable: true, code: String.raw`N = 10;
C = zeros(1, N+1);
C(1) = pi/2;          % C_0
C(2) = 1;             % C_1
for n = 2:N
  C(n+1) = (n-1)/n*C(n-1);
end
for n = 0:N
  fprintf('n = %2d   recursion %.10f   integral %.10f\n', n, C(n+1), integral(@(x) cos(x).^n, 0, pi/2))
end` },
        { type: 'callout', kind: 'warn', title: 'Unstable recursions', html: String.raw`<p>$J_n = e - nJ_{n-1}$ is exact, but each step multiplies the rounding error of $J_{n-1}$ by $n$; after $n$ steps the error of $J_0$ is amplified by $n!$. Run the block below: the recursion is fine up to $n \approx 12$ and then produces nonsense (even negative values, although $J_n > 0$). Wallis' recursion multiplies by $\frac{n-1}{n} < 1$ and is stable.</p>` },
        { type: 'code', caption: 'J_n = ∫ x^n e^x dx on [0, 1]: forward recursion vs integral.', editable: true, code: String.raw`J = zeros(1, 21);
J(1) = exp(1) - 1;                  % J_0
for n = 1:20
  J(n+1) = exp(1) - n*J(n);
end
for n = [5 10 15 18 20]
  fprintf('n = %2d   recursion %12.6f   integral %10.6f\n', n, J(n+1), integral(@(x) x.^n.*exp(x), 0, 1))
end` },
        { type: 'matlab', prompt: String.raw`Use the Wallis recursion in a loop to compute $C_0, \dots, C_{10}$ in a vector <code>C</code> (with $C_n$ in <code>C(n+1)</code>). The exact value is $C_{10} = \frac{63\pi}{512}$.`, starter: `C = zeros(1, 11);\nC(1) = pi/2;\nC(2) = 1;\n% loop over n = 2:10 here`, solution: `C = zeros(1, 11);\nC(1) = pi/2;\nC(2) = 1;\nfor n = 2:10\n  C(n+1) = (n-1)/n*C(n-1);\nend\nC10 = C(11);`, checks: [{ var: 'C', size: 11 }, { var: 'C', value: 'pi/2' }, { var: 'C10', value: '63*pi/512', tol: 1e-12, message: 'Store C(11) in C10 and check your recursion.' }], hint: String.raw`<code>C(n+1) = (n-1)/n*C(n-1);</code> — then <code>C10 = C(11);</code>` },
        { type: 'matlab', prompt: String.raw`Compute $J_8 = \int_0^1 x^8e^x\,\mathrm d x$ with the recursion $J_n = e - nJ_{n-1}$, $J_0 = e - 1$, and store it in <code>J8</code>. (For $n = 8$ the recursion is still accurate.)`, starter: `J = exp(1) - 1;     % J_0\n% loop here, then\nJ8 = J;`, solution: `J = exp(1) - 1;\nfor n = 1:8\n  J = exp(1) - n*J;\nend\nJ8 = J;`, checks: [{ var: 'J8', value: 'integral(@(x) x.^8.*exp(x), 0, 1)', tol: 1e-8 }] },
      ],
    },
  ],
  assignIntro: String.raw`<p>Every problem below is the same type as a worked example and a guided exercise you have already done — the links above each problem take you back to them. If you get stuck, use the hints one at a time, then "Walk me through it".</p>`,
  assignments: [
    {
      id: 'a1',
      title: 'Basic integration by parts',
      difficulty: 'core',
      examples: ['parts-formula', 'parts-inner-constant', 'parts-log'],
      statement: String.raw`<p>Find the antiderivatives (any constant). Type them in MATLAB syntax, e.g. <code>x.^2.*exp(x)</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int x e^{-2x}\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: '-x.*exp(-2*x)/2 - exp(-2*x)/4', upToConstant: true,
          hints: [String.raw`Same type as $\int x e^{3x}\,\mathrm d x$: which factor is $u$ by LIATE?`, String.raw`$u = x$, $\mathrm d v = e^{-2x}\,\mathrm d x$; $v = \int e^{-2x}\,\mathrm d x$ divides by the inner constant $k = -2$.`, String.raw`$v = -\frac12 e^{-2x}$, so $\int x e^{-2x}\,\mathrm d x = -\frac x2 e^{-2x} - \int\left(-\frac12 e^{-2x}\right)\mathrm d x$.`],
          walkthrough: [
            { do: String.raw`$u = x,\quad \mathrm d v = e^{-2x}\,\mathrm d x$`, why: 'LIATE: Algebraic before Exponential.' },
            { do: String.raw`$\mathrm d u = \mathrm d x,\quad v = -\tfrac12 e^{-2x}$`, why: String.raw`$\int e^{kx}\,\mathrm d x = \frac1k e^{kx}$ with $k = -2$.` },
            { do: String.raw`$\displaystyle\int x e^{-2x}\,\mathrm d x = -\frac{x}{2}e^{-2x} - \int\left(-\frac12 e^{-2x}\right)\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$.` },
            { do: String.raw`$= -\dfrac{x}{2}e^{-2x} + \dfrac12\displaystyle\int e^{-2x}\,\mathrm d x$`, why: 'Minus times minus; pull out the constant.' },
            { do: String.raw`$= -\dfrac{x}{2}e^{-2x} + \dfrac12\cdot\left(-\dfrac12 e^{-2x}\right) + C = -\dfrac{x}{2}e^{-2x} - \dfrac14 e^{-2x} + C$`, why: String.raw`Integrate $e^{-2x}$ once more.` },
          ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\int x^2\ln x\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: 'x.^3.*log(x)/3 - x.^3/9', upToConstant: true,
          hints: [String.raw`Same type as $\int x\ln x\,\mathrm d x$ and $\int x^4\ln x\,\mathrm d x$.`, String.raw`LIATE: $u = \ln x$, $\mathrm d v = x^2\,\mathrm d x$, so $\mathrm d u = \frac1x\,\mathrm d x$ and $v = \frac{x^3}{3}$.`, String.raw`$\frac{x^3}{3}\ln x - \int\frac{x^3}{3}\cdot\frac1x\,\mathrm d x = \frac{x^3}{3}\ln x - \int\frac{x^2}{3}\,\mathrm d x$.`],
          walkthrough: [
            { do: String.raw`$u = \ln x,\quad \mathrm d v = x^2\,\mathrm d x$`, why: 'Logarithm before Algebraic.' },
            { do: String.raw`$\mathrm d u = \dfrac1x\,\mathrm d x,\quad v = \dfrac{x^3}{3}$`, why: 'Differentiate $\\ln x$; power rule for $x^2$.' },
            { do: String.raw`$\displaystyle\int x^2\ln x\,\mathrm d x = \frac{x^3}{3}\ln x - \int \frac{x^3}{3}\cdot\frac1x\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$.` },
            { do: String.raw`$= \dfrac{x^3}{3}\ln x - \displaystyle\int \frac{x^2}{3}\,\mathrm d x$`, why: String.raw`$x^3\cdot\frac1x = x^2$.` },
            { do: String.raw`$= \dfrac{x^3}{3}\ln x - \dfrac{x^3}{9} + C$`, why: String.raw`$\int\frac{x^2}{3}\,\mathrm d x = \frac{x^3}{9}$.` },
          ] },
        { label: '(c)', prompt: String.raw`$\displaystyle\int x\sin 3x\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: '-x.*cos(3*x)/3 + sin(3*x)/9', upToConstant: true,
          hints: [String.raw`Same type as the guided $\int x\cos 2x\,\mathrm d x$.`, String.raw`$u = x$, $\mathrm d v = \sin 3x\,\mathrm d x$, so $v = -\frac13\cos 3x$.`, String.raw`$-\frac{x}{3}\cos 3x - \int\left(-\frac13\cos 3x\right)\mathrm d x = -\frac{x}{3}\cos 3x + \frac13\int\cos 3x\,\mathrm d x$.`],
          walkthrough: [
            { do: String.raw`$u = x,\quad \mathrm d v = \sin 3x\,\mathrm d x$`, why: 'A before T.' },
            { do: String.raw`$\mathrm d u = \mathrm d x,\quad v = -\tfrac13\cos 3x$`, why: String.raw`$\int\sin kx\,\mathrm d x = -\frac1k\cos kx$.` },
            { do: String.raw`$\displaystyle\int x\sin 3x\,\mathrm d x = -\frac{x}{3}\cos 3x + \frac13\int\cos 3x\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$; minus times minus.` },
            { do: String.raw`$= -\dfrac{x}{3}\cos 3x + \dfrac13\cdot\dfrac13\sin 3x + C = -\dfrac{x}{3}\cos 3x + \dfrac19\sin 3x + C$`, why: String.raw`$\int\cos 3x\,\mathrm d x = \frac13\sin 3x$.` },
          ] },
        { label: '(d)', prompt: String.raw`For $\int x^3\ln x\,\mathrm d x$ the right choice is`, kind: 'choice', choices: [String.raw`$u = x^3$, $\mathrm d v = \ln x\,\mathrm d x$`, String.raw`$u = \ln x$, $\mathrm d v = x^3\,\mathrm d x$`, String.raw`$u = x^3\ln x$, $\mathrm d v = \mathrm d x$`], answer: 1,
          hints: ['Where is the logarithm in LIATE?', String.raw`As $\mathrm d v$ you must be able to integrate it — do you know $\int\ln x\,\mathrm d x$ offhand? And is $\frac1x$ simpler than $\ln x$?`],
          solution: String.raw`Logarithms come first in LIATE; besides, we do not know $\int \ln x\,\mathrm d x$ offhand. Result: $\frac{x^4}{4}\ln x - \frac{x^4}{16} + C$.` },
      ],
    },
    {
      id: 'a2',
      title: 'Inverse trigonometric functions',
      difficulty: 'core',
      examples: ['invisible-dv', 'definite-parts'],
      statement: String.raw`<p>Integrate with the invisible factor $\mathrm d v = \mathrm d x$, or with an algebraic $\mathrm d v$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int \arccos x\,\mathrm d x$ (in MATLAB, <code>acos(x)</code>)`, kind: 'expression', variable: 'x', answer: 'x.*acos(x) - sqrt(1 - x.^2)', upToConstant: true, domain: [-0.8, 0.8],
          hints: [String.raw`Same type as $\int\arcsin x\,\mathrm d x$: invisible factor $\mathrm d v = \mathrm d x$.`, String.raw`$u = \arccos x$, $\mathrm d u = -\frac{\mathrm d x}{\sqrt{1 - x^2}}$, $v = x$. Watch the extra minus sign.`, String.raw`$x\arccos x + \int\frac{x}{\sqrt{1 - x^2}}\,\mathrm d x$, and $\int\frac{x}{\sqrt{1 - x^2}}\,\mathrm d x = -\sqrt{1 - x^2}$.`],
          walkthrough: [
            { do: String.raw`$u = \arccos x,\quad \mathrm d v = \mathrm d x$`, why: 'Invisible factor.' },
            { do: String.raw`$\mathrm d u = -\dfrac{1}{\sqrt{1 - x^2}}\,\mathrm d x,\quad v = x$`, why: 'Derivative of $\\arccos$ (table); integrate 1.' },
            { do: String.raw`$\displaystyle\int\arccos x\,\mathrm d x = x\arccos x - \int x\cdot\left(-\frac{1}{\sqrt{1 - x^2}}\right)\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$.` },
            { do: String.raw`$= x\arccos x + \displaystyle\int\frac{x}{\sqrt{1 - x^2}}\,\mathrm d x$`, why: 'Minus times minus.' },
            { do: String.raw`$= x\arccos x - \sqrt{1 - x^2} + C$`, why: String.raw`Substitution $w = 1 - x^2$ gives $\int\frac{x}{\sqrt{1 - x^2}}\,\mathrm d x = -\sqrt{1 - x^2}$.` },
          ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_0^1 x\arctan x\,\mathrm d x$`, kind: 'numeric', answer: 'pi/4 - 1/2', tol: 1e-6,
          hints: [String.raw`Same type as the guided $\int_0^{\sqrt3}x\arctan x\,\mathrm d x$.`, String.raw`$u = \arctan x$, $\mathrm d v = x\,\mathrm d x$; then write $\frac{x^2}{1 + x^2} = 1 - \frac{1}{1 + x^2}$.`, String.raw`Boundary term $\Big[\frac{x^2}{2}\arctan x\Big]_0^1 = \frac12\cdot\frac\pi4$; remaining integral $\frac12\Big[x - \arctan x\Big]_0^1$.`],
          walkthrough: [
            { do: String.raw`$u = \arctan x,\ \mathrm d v = x\,\mathrm d x$; $\;\mathrm d u = \dfrac{\mathrm d x}{1 + x^2},\ v = \dfrac{x^2}{2}$`, why: 'I before A.' },
            { do: String.raw`$\displaystyle\int_0^1 x\arctan x\,\mathrm d x = \Big[\frac{x^2}{2}\arctan x\Big]_0^1 - \frac12\int_0^1\frac{x^2}{1 + x^2}\,\mathrm d x$`, why: 'Definite parts.' },
            { do: String.raw`$\Big[\dfrac{x^2}{2}\arctan x\Big]_0^1 = \dfrac12\cdot\dfrac{\pi}{4} - 0 = \dfrac{\pi}{8}$`, why: String.raw`$\arctan 1 = \frac\pi4$.` },
            { do: String.raw`$\dfrac12\displaystyle\int_0^1\left(1 - \frac{1}{1 + x^2}\right)\mathrm d x = \frac12\Big[x - \arctan x\Big]_0^1 = \frac12\left(1 - \frac{\pi}{4}\right)$`, why: 'Add and subtract 1 in the numerator.' },
            { do: String.raw`$\dfrac{\pi}{8} - \dfrac12 + \dfrac{\pi}{8} = \dfrac{\pi}{4} - \dfrac12 \approx 0.2854$`, why: 'Boundary term minus remaining integral.' },
          ] },
        { label: '(c)', prompt: String.raw`$\displaystyle\int_0^{1/2} \arcsin x\,\mathrm d x$`, kind: 'numeric', answer: 'pi/12 + sqrt(3)/2 - 1', tol: 1e-6,
          hints: [String.raw`You have the antiderivative from the $\arcsin$ worked example.`, String.raw`$F(x) = x\arcsin x + \sqrt{1 - x^2}$; compute $F(\frac12) - F(0)$.`, String.raw`$\arcsin\frac12 = \frac\pi6$ and $\sqrt{1 - \frac14} = \frac{\sqrt3}{2}$.`],
          walkthrough: [
            { do: String.raw`$F(x) = x\arcsin x + \sqrt{1 - x^2}$`, why: 'Antiderivative by parts with the invisible factor.' },
            { do: String.raw`$F(\tfrac12) = \tfrac12\cdot\tfrac{\pi}{6} + \sqrt{\tfrac34} = \tfrac{\pi}{12} + \tfrac{\sqrt3}{2}$`, why: String.raw`$\arcsin\frac12 = \frac\pi6$.` },
            { do: String.raw`$F(0) = 0 + \sqrt1 = 1$`, why: 'Lower limit.' },
            { do: String.raw`$\displaystyle\int_0^{1/2}\arcsin x\,\mathrm d x = \frac{\pi}{12} + \frac{\sqrt3}{2} - 1 \approx 0.1278$`, why: 'Upper minus lower.' },
          ] },
      ],
    },
    {
      id: 'a3',
      title: 'A definite integral by parts, written up',
      difficulty: 'exam',
      hw: 'HW2-style',
      examples: ['log-power', 'repeated-parts', 'definite-parts'],
      statement: String.raw`<p>Compute $\displaystyle I = \int_1^e (\ln x)^2\,\mathrm d x$ and $\displaystyle K = \int_0^1 x^2e^{-x}\,\mathrm d x$ exactly, and check both with <code>integral</code>.</p>`,
      parts: [
        { label: '(a)', prompt: '$I$', kind: 'numeric', answer: 'exp(1) - 2', tol: 1e-6,
          hints: [String.raw`Same type as the guided $\int_1^{e^2}(\ln x)^2\,\mathrm d x$.`, String.raw`$F(x) = x(\ln x)^2 - 2x\ln x + 2x$ (parts twice with the invisible factor).`, String.raw`$F(e) = e - 2e + 2e = e$ and $F(1) = 2$.`],
          walkthrough: [
            { do: String.raw`$u = (\ln x)^2,\ \mathrm d v = \mathrm d x$; $\;\mathrm d u = \dfrac{2\ln x}{x}\,\mathrm d x,\ v = x$`, why: 'Invisible factor; chain rule for $\\mathrm d u$.' },
            { do: String.raw`$\displaystyle\int(\ln x)^2\,\mathrm d x = x(\ln x)^2 - 2\int\ln x\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$; the $x$ cancels.` },
            { do: String.raw`$= x(\ln x)^2 - 2x\ln x + 2x$`, why: String.raw`$\int\ln x\,\mathrm d x = x\ln x - x$.` },
            { do: String.raw`At $e$: $\; e\cdot 1 - 2e\cdot 1 + 2e = e$`, why: String.raw`$\ln e = 1$.` },
            { do: String.raw`At $1$: $\; 0 - 0 + 2 = 2$`, why: String.raw`$\ln 1 = 0$.` },
            { do: String.raw`$I = e - 2 \approx 0.7183$`, why: 'Upper minus lower.' },
          ] },
        { label: '(b)', prompt: '$K$', kind: 'numeric', answer: '2 - 5*exp(-1)', tol: 1e-6,
          hints: [String.raw`Same type as the guided $\int_0^2 x^2e^{-x}\,\mathrm d x$.`, String.raw`Antiderivative $-e^{-x}(x^2 + 2x + 2)$ (table method).`, String.raw`At $1$: $-5e^{-1}$. At $0$: $-2$.`],
          walkthrough: [
            { do: String.raw`$\displaystyle\int x^2e^{-x}\,\mathrm d x = -x^2e^{-x} - 2xe^{-x} - 2e^{-x} = -e^{-x}\left(x^2 + 2x + 2\right)$`, why: String.raw`Table: $u$: $x^2, 2x, 2, 0$; $\mathrm d v$: $e^{-x}, -e^{-x}, e^{-x}, -e^{-x}$; signs $+,-,+$.` },
            { do: String.raw`At $x = 1$: $\; -e^{-1}(1 + 2 + 2) = -5e^{-1}$`, why: 'Upper limit.' },
            { do: String.raw`At $x = 0$: $\; -1\cdot 2 = -2$`, why: String.raw`$e^0 = 1$.` },
            { do: String.raw`$K = -5e^{-1} - (-2) = 2 - 5e^{-1} \approx 0.1606$`, why: 'Upper minus lower.' },
          ] },
        { label: '(c)', prompt: 'Write the computation of $I$ as a Live Script with an English sentence before each step and a numerical check.', kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 3 (Attempted)' },
        { type: 'text', content: String.raw`We integrate by parts with $u = (\ln x)^2$ and $\mathrm d v = \mathrm d x$, so that $\mathrm d u = \frac{2\ln x}{x}\,\mathrm d x$ and $v = x$:` },
        { type: 'equation', content: String.raw`I = \int_1^e (\ln x)^2\,\mathrm d x = \Big[x(\ln x)^2\Big]_1^e - \int_1^e x\cdot\frac{2\ln x}{x}\,\mathrm d x = e - 2\int_1^e \ln x\,\mathrm d x .` },
        { type: 'text', content: String.raw`The remaining integral is computed by parts again, with $u = \ln x$ and $\mathrm d v = \mathrm d x$:` },
        { type: 'equation', content: String.raw`\int_1^e \ln x\,\mathrm d x = \Big[x\ln x\Big]_1^e - \int_1^e \mathrm d x = e - (e - 1) = 1 .` },
        { type: 'text', content: 'Therefore' },
        { type: 'equation', content: String.raw`I = e - 2 \approx 0.7183 .` },
        { type: 'text', content: 'We check the result numerically:' },
        { type: 'code', content: String.raw`I = integral(@(x) log(x).^2, 1, exp(1));
fprintf('integral: %.10f,  e - 2: %.10f\n', I, exp(1) - 2)` },
        { type: 'text', content: 'The two values agree to all printed digits.' },
      ],
    },
    {
      id: 'a4',
      title: 'Solving for the integral and repeated parts',
      difficulty: 'challenge',
      examples: ['solve-for-integral', 'repeated-parts', 'reduction-exp'],
      statement: String.raw`<p>These integrals need two (or more) rounds of integration by parts.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\int e^{2x}\cos x\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: 'exp(2*x).*(2*cos(x) + sin(x))/5', upToConstant: true,
          hints: [String.raw`Same type as the guided $\int e^{2x}\sin x\,\mathrm d x$: the integral comes back after two rounds.`, String.raw`Keep $u$ = the trig function and $\mathrm d v = e^{2x}\,\mathrm d x$ ($v = \frac12 e^{2x}$) in both rounds, then solve for $I$.`, String.raw`Round 1: $I = \frac12 e^{2x}\cos x + \frac12\int e^{2x}\sin x\,\mathrm d x$.`],
          walkthrough: [
            { do: String.raw`Round 1: $u = \cos x,\ \mathrm d v = e^{2x}\,\mathrm d x$; $\;\mathrm d u = -\sin x\,\mathrm d x,\ v = \tfrac12 e^{2x}$`, why: 'Trig function as $u$.' },
            { do: String.raw`$I = \tfrac12 e^{2x}\cos x + \tfrac12\displaystyle\int e^{2x}\sin x\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$; minus times minus.` },
            { do: String.raw`Round 2: $\displaystyle\int e^{2x}\sin x\,\mathrm d x = \tfrac12 e^{2x}\sin x - \tfrac12\int e^{2x}\cos x\,\mathrm d x = \tfrac12 e^{2x}\sin x - \tfrac12 I$`, why: String.raw`Same roles: $u = \sin x$, $v = \frac12 e^{2x}$. The original $I$ is back.` },
            { do: String.raw`$I = \tfrac12 e^{2x}\cos x + \tfrac14 e^{2x}\sin x - \tfrac14 I$`, why: String.raw`Put round 2 into round 1 (multiply it by $\frac12$).` },
            { do: String.raw`$\tfrac54 I = \tfrac14 e^{2x}(2\cos x + \sin x)$`, why: String.raw`Add $\frac14 I$; factor $\frac14 e^{2x}$.` },
            { do: String.raw`$I = \tfrac15 e^{2x}(2\cos x + \sin x) + C$`, why: String.raw`Multiply by $\frac45$.` },
          ] },
        { label: '(b)', prompt: String.raw`$\displaystyle\int_0^\pi e^x\sin x\,\mathrm d x$`, kind: 'numeric', answer: '(exp(pi) + 1)/2', tol: 1e-6,
          hints: [String.raw`Same type as the worked $\int_0^{\pi/2}e^x\sin x\,\mathrm d x$.`, String.raw`Use $F(x) = \frac12 e^x(\sin x - \cos x)$.`, String.raw`$\sin\pi = 0$, $\cos\pi = -1$, $\sin 0 = 0$, $\cos 0 = 1$.`],
          walkthrough: [
            { do: String.raw`$F(x) = \tfrac12 e^x(\sin x - \cos x)$`, why: 'Antiderivative found by solving for the integral.' },
            { do: String.raw`$F(\pi) = \tfrac12 e^{\pi}(0 - (-1)) = \tfrac12 e^{\pi}$`, why: 'Upper limit.' },
            { do: String.raw`$F(0) = \tfrac12(0 - 1) = -\tfrac12$`, why: 'Lower limit.' },
            { do: String.raw`$\tfrac12 e^{\pi} + \tfrac12 = \dfrac{e^\pi + 1}{2} \approx 12.07$`, why: 'Upper minus lower.' },
          ] },
        { label: '(c)', prompt: String.raw`$\displaystyle\int x^2\cos x\,\mathrm d x$`, kind: 'expression', variable: 'x', answer: 'x.^2.*sin(x) + 2*x.*cos(x) - 2*sin(x)', upToConstant: true,
          hints: [String.raw`Same type as the guided $\int x^2\sin x\,\mathrm d x$: two rounds with $u$ = the power of $x$.`, String.raw`Round 1: $u = x^2$, $v = \sin x$: $x^2\sin x - 2\int x\sin x\,\mathrm d x$.`, String.raw`$\int x\sin x\,\mathrm d x = -x\cos x + \sin x$.`],
          walkthrough: [
            { do: String.raw`Round 1: $u = x^2,\ \mathrm d v = \cos x\,\mathrm d x$; $\;\mathrm d u = 2x\,\mathrm d x,\ v = \sin x$`, why: 'A before T.' },
            { do: String.raw`$\displaystyle\int x^2\cos x\,\mathrm d x = x^2\sin x - 2\int x\sin x\,\mathrm d x$`, why: String.raw`$uv - \int v\,\mathrm d u$.` },
            { do: String.raw`Round 2: $\displaystyle\int x\sin x\,\mathrm d x = -x\cos x + \int\cos x\,\mathrm d x = -x\cos x + \sin x$`, why: String.raw`$u = x$, $v = -\cos x$.` },
            { do: String.raw`$= x^2\sin x - 2(-x\cos x + \sin x) + C = x^2\sin x + 2x\cos x - 2\sin x + C$`, why: 'Substitute back; multiply the whole bracket by $-2$.' },
          ] },
        { label: '(d)', prompt: String.raw`$\displaystyle\int_0^1 x^3e^x\,\mathrm d x$ (use $J_n = e - nJ_{n-1}$)`, kind: 'numeric', answer: '6 - 2*exp(1)', tol: 1e-6,
          hints: [String.raw`Continue the recursion of the worked example one more step.`, String.raw`$J_0 = e - 1$, $J_1 = 1$, $J_2 = e - 2$.`, String.raw`$J_3 = e - 3J_2 = e - 3(e - 2)$.`],
          walkthrough: [
            { do: String.raw`$J_0 = e - 1$`, why: String.raw`$\int_0^1 e^x\,\mathrm d x$.` },
            { do: String.raw`$J_1 = e - 1\cdot(e - 1) = 1$`, why: String.raw`$n = 1$.` },
            { do: String.raw`$J_2 = e - 2\cdot 1 = e - 2$`, why: String.raw`$n = 2$.` },
            { do: String.raw`$J_3 = e - 3(e - 2) = e - 3e + 6 = 6 - 2e \approx 0.5634$`, why: String.raw`$n = 3$; multiply out the bracket.` },
          ] },
      ],
    },
    {
      id: 'a5',
      title: 'A reduction formula',
      difficulty: 'exam',
      hw: 'HW2-style',
      examples: ['reduction-algebraic', 'reduction-formulas'],
      statement: String.raw`<p>Let $\displaystyle W_n = \int_0^1 (1 - x^2)^n\,\mathrm d x$ for $n = 0, 1, 2, \dots$</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Which reduction formula holds for $n \ge 1$?`, kind: 'choice', choices: [String.raw`$W_n = \dfrac{n}{n+1}W_{n-1}$`, String.raw`$W_n = \dfrac{2n}{2n+1}W_{n-1}$`, String.raw`$W_n = \dfrac{2n-1}{2n}W_{n-1}$`, String.raw`$W_n = 1 - 2nW_{n-1}$`], answer: 1,
          hints: [String.raw`Same pattern as Wallis: parts, boundary term $0$, an identity brings $W_n$ back, solve for $W_n$.`, String.raw`$u = (1 - x^2)^n$, $\mathrm d v = \mathrm d x$: $\mathrm d u = -2nx(1 - x^2)^{n-1}\,\mathrm d x$, $v = x$. Then write $x^2 = 1 - (1 - x^2)$.`, String.raw`You get $W_n = 2n\left(W_{n-1} - W_n\right)$; solve for $W_n$.`],
          solution: String.raw`$W_n = \Big[x(1-x^2)^n\Big]_0^1 + 2n\int_0^1 x^2(1-x^2)^{n-1}\,\mathrm d x = 2n\left(W_{n-1} - W_n\right)$, so $(2n+1)W_n = 2nW_{n-1}$.` },
        { label: '(b)', prompt: '$W_3$', kind: 'numeric', answer: '16/35', tol: 1e-9,
          hints: [String.raw`Start from $W_0 = \int_0^1 1\,\mathrm d x$ and apply the formula from (a) three times.`, String.raw`$W_0 = 1$, $W_1 = \frac23 W_0$.`, String.raw`$W_2 = \frac45 W_1$, $W_3 = \frac67 W_2$.`],
          walkthrough: [
            { do: String.raw`$W_0 = \displaystyle\int_0^1 1\,\mathrm d x = 1$`, why: 'Starting value.' },
            { do: String.raw`$W_1 = \dfrac{2}{3}\cdot 1 = \dfrac23$`, why: String.raw`$n = 1$: factor $\frac{2n}{2n+1} = \frac23$.` },
            { do: String.raw`$W_2 = \dfrac45\cdot\dfrac23 = \dfrac{8}{15}$`, why: String.raw`$n = 2$: factor $\frac45$.` },
            { do: String.raw`$W_3 = \dfrac67\cdot\dfrac{8}{15} = \dfrac{48}{105} = \dfrac{16}{35}$`, why: String.raw`$n = 3$: factor $\frac67$; cancel 3.` },
          ] },
        { label: '(c)', prompt: '$W_4$', kind: 'numeric', answer: '128/315', tol: 1e-9,
          hints: ['One more step of the recursion.', String.raw`$W_4 = \frac{8}{9}W_3$.`, String.raw`$\frac89\cdot\frac{16}{35}$.`],
          walkthrough: [
            { do: String.raw`$W_3 = \dfrac{16}{35}$`, why: 'From part (b).' },
            { do: String.raw`$W_4 = \dfrac{2\cdot 4}{2\cdot 4 + 1}W_3 = \dfrac89 W_3$`, why: String.raw`$n = 4$ in $W_n = \frac{2n}{2n+1}W_{n-1}$.` },
            { do: String.raw`$= \dfrac89\cdot\dfrac{16}{35} = \dfrac{128}{315} \approx 0.4063$`, why: 'Multiply numerators and denominators.' },
          ] },
        { label: '(d)', prompt: 'Write the derivation of the reduction formula and the computation of $W_4$ as a Live Script, and verify $W_0, \\dots, W_6$ with a loop and integral.', kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: String.raw`We integrate by parts with $u = (1 - x^2)^n$ and $\mathrm d v = \mathrm d x$, so that $\mathrm d u = -2nx(1 - x^2)^{n-1}\,\mathrm d x$ and $v = x$:` },
        { type: 'equation', content: String.raw`W_n = \Big[x\left(1 - x^2\right)^n\Big]_0^1 + 2n\int_0^1 x^2\left(1 - x^2\right)^{n-1}\mathrm d x .` },
        { type: 'text', content: String.raw`For $n \ge 1$ the boundary term is zero at both ends. We write $x^2 = 1 - (1 - x^2)$ in the remaining integral:` },
        { type: 'equation', content: String.raw`W_n = 2n\int_0^1 \left(1 - x^2\right)^{n-1}\mathrm d x - 2n\int_0^1 \left(1 - x^2\right)^{n}\mathrm d x = 2n\,W_{n-1} - 2n\,W_n .` },
        { type: 'text', content: String.raw`Solving for $W_n$ gives the reduction formula` },
        { type: 'equation', content: String.raw`W_n = \frac{2n}{2n+1}\,W_{n-1}, \qquad W_0 = \int_0^1 \mathrm d x = 1 .` },
        { type: 'text', content: 'We apply it four times:' },
        { type: 'equation', content: String.raw`W_4 = \frac{8}{9}\cdot\frac{6}{7}\cdot\frac{4}{5}\cdot\frac{2}{3}\cdot 1 = \frac{384}{945} = \frac{128}{315} \approx 0.4063 .` },
        { type: 'text', content: 'We verify the recursion against numerical integration for $n = 0, \\dots, 6$:' },
        { type: 'code', content: String.raw`W = zeros(1, 7);
W(1) = 1;                          % W_0
for n = 1:6
  W(n+1) = 2*n/(2*n + 1)*W(n);
end
for n = 0:6
  fprintf('n = %d   recursion %.10f   integral %.10f\n', n, W(n+1), integral(@(x) (1 - x.^2).^n, 0, 1))
end` },
        { type: 'text', content: 'The recursion and the numerical integrals agree for every $n$.' },
      ],
    },
  ],
};
