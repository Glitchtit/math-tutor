// Module 3: Derivatives.

export default {
  id: 'derivatives',
  number: 3,
  part: 'foundations',
  title: 'Derivatives',
  summary: 'The derivative as the limit of secant slopes and as a function, the product, quotient and chain rules, derivatives of exp, ln, trigonometric and inverse trigonometric functions, implicit differentiation and linear approximation — with numerical derivatives and tangent-line plots in MATLAB.',
  intro: String.raw`<p>The derivative measures an instantaneous rate of change: velocity from position, current from charge, the slope of a graph. It is defined as a limit, but in practice you compute it with a handful of rules. This module builds the definition from a moving secant line, then drills the rules you will use in every later module — integration by substitution is the chain rule run backwards. In MATLAB you approximate derivatives by difference quotients and plot tangent lines.</p>`,
  lessons: [
    {
      id: 'secant-tangent',
      title: 'From secant to tangent: the definition',
      blocks: [
        { type: 'text', html: String.raw`<p>The line through $P = (a, f(a))$ and $Q = (a + h, f(a + h))$ is a <b>secant</b>. Its slope $\dfrac{f(a+h) - f(a)}{h}$ is the average rate of change over $[a, a+h]$. Press <b>Let h → 0</b>: $Q$ slides into $P$ and the secant turns into the <b>tangent</b> (dashed). Move $a$ to see the tangent slope change along the curve.</p>` },
        { type: 'widget', name: 'secant', config: {
          title: 'Secant slopes approach the tangent slope',
          f: 'x.^3/3 - x + 1', a: 1.5, xlim: [-3, 3], ylim: [-2, 5],
        } },
        { type: 'callout', kind: 'def', title: 'Derivative', html: String.raw`<p>The derivative of $f$ at $a$ is $$f'(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h},$$ provided the limit exists; $f$ is then <b>differentiable</b> at $a$. The tangent line at $a$ is $y = f(a) + f'(a)(x - a)$.</p>` },
        { type: 'steps', title: String.raw`Example: $f(x) = \dfrac{1}{x}$ from the definition`, steps: [
          String.raw`We form the difference quotient and put the fractions over a common denominator: $$\frac{f(x+h) - f(x)}{h} = \frac{1}{h}\left(\frac{1}{x+h} - \frac{1}{x}\right) = \frac{x - (x + h)}{h\,x(x+h)} = \frac{-1}{x(x+h)}.$$`,
          String.raw`The factor $h$ cancelled, so we can now let $h \to 0$ by substitution: $$f'(x) = \lim_{h\to0} \frac{-1}{x(x+h)} = -\frac{1}{x^2}, \qquad x \ne 0.$$`,
        ] },
        { type: 'callout', kind: 'note', html: String.raw`<p>Differentiable implies continuous, but not conversely: $|x|$ is continuous at $0$, yet the difference quotient $\frac{|h|}{h}$ has one-sided limits $-1$ and $+1$ (the sign function from the previous module), so $|x|$ has no derivative at its corner.</p>` },
        { type: 'quiz', question: String.raw`The position of a cart is $s(t) = t^2$ (metres, $t$ in seconds). Which quantity is $\dfrac{s(3 + h) - s(3)}{h}$ for $h = 0.1$?`, choices: ['The velocity at $t = 3$', 'The average velocity on $[3, 3.1]$', 'The acceleration at $t = 3$', 'The distance travelled in $[3, 3.1]$'], answer: 1, explain: String.raw`A difference quotient with a fixed $h$ is an <i>average</i> rate: $\frac{9.61 - 9}{0.1} = 6.1$ m/s. Only its limit as $h \to 0$ is the instantaneous velocity $s'(3) = 6$ m/s.` },
      ],
    },
    {
      id: 'derivative-function',
      title: 'The derivative as a function',
      blocks: [
        { type: 'text', html: String.raw`<p>Computing $f'(x)$ at every $x$ gives a new function $f'$. Drag the point (or press <b>Sweep</b>): the lower graph records the slope of the tangent above it. Where $f$ rises, $f' > 0$; where $f$ falls, $f' < 0$; at the peaks and valleys of $f$ the tangent is horizontal and $f' = 0$.</p>` },
        { type: 'widget', name: 'derivative', config: {
          title: 'Recording the slope of sin x',
          f: 'sin(x)', df: 'cos(x)', x0: -5, xlim: [-6.3, 6.3], ylim: [-1.6, 1.6], dylim: [-1.6, 1.6],
        } },
        { type: 'text', html: String.raw`<p>The recorded curve is $\cos x$: $\frac{\mathrm d}{\mathrm d x} \sin x = \cos x$. The proof uses the addition formula and the two limits of the previous module, $\frac{\sin h}{h} \to 1$ and $\frac{1 - \cos h}{h} \to 0$.</p><p>Notation: $f'(x) = \dfrac{\mathrm d f}{\mathrm d x} = \dfrac{\mathrm d}{\mathrm d x} f(x)$. The second derivative $f''$ is the derivative of $f'$; for a position $s(t)$, $s'$ is the velocity and $s''$ the acceleration.</p>` },
        { type: 'widget', name: 'derivative', config: {
          title: 'A cubic and its derivative',
          f: 'x.^3 - 3*x', df: '3*x.^2 - 3', x0: -2, xlim: [-2.5, 2.5], ylim: [-4, 4], dylim: [-4, 12],
        } },
        { type: 'quiz', question: String.raw`For $f(x) = x^3 - 3x$ (above), where is $f'(x) < 0$?`, choices: [String.raw`$x < -1$ or $x > 1$`, String.raw`$-1 < x < 1$`, String.raw`$x < 0$`, String.raw`$-\sqrt3 < x < \sqrt3$`], answer: 1, explain: String.raw`$f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$ is negative between its zeros $\pm1$: there the cubic decreases from its peak at $x = -1$ to its valley at $x = 1$.` },
      ],
    },
    {
      id: 'rules',
      title: 'Differentiation rules',
      blocks: [
        { type: 'text', html: String.raw`<p>The chain rule in a picture: $\sin(kx)$ oscillates $k$ times as fast as $\sin x$, so its slopes are $k$ times as steep. Drag $k$ and compare the dashed curve $k\cos(kx)$ with the slopes of the solid curve.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'The inner derivative k in d/dx sin(kx) = k cos(kx)',
          functions: [{ expr: 'sin(k*x)', label: String.raw`$\sin(kx)$` }, { expr: 'k*cos(k*x)', label: String.raw`$k\cos(kx)$`, dash: true }],
          params: { k: { min: 0.5, max: 3, value: 2, step: 0.05, label: '$k$' } },
          xlim: [-4, 4], ylim: [-3.2, 3.2],
        } },
        { type: 'table', head: ['$f(x)$', "$f'(x)$", '$f(x)$', "$f'(x)$"], rows: [
          [String.raw`$x^r$ ($r$ real)`, String.raw`$r x^{r-1}$`, String.raw`$\sin x$`, String.raw`$\cos x$`],
          [String.raw`$e^x$`, String.raw`$e^x$`, String.raw`$\cos x$`, String.raw`$-\sin x$`],
          [String.raw`$a^x$`, String.raw`$a^x \ln a$`, String.raw`$\tan x$`, String.raw`$\dfrac{1}{\cos^2 x} = 1 + \tan^2 x$`],
          [String.raw`$\ln |x|$`, String.raw`$\dfrac{1}{x}$`, String.raw`$\arcsin x$`, String.raw`$\dfrac{1}{\sqrt{1 - x^2}}$`],
          [String.raw`$\log_a x$`, String.raw`$\dfrac{1}{x \ln a}$`, String.raw`$\arctan x$`, String.raw`$\dfrac{1}{1 + x^2}$`],
        ] },
        { type: 'callout', kind: 'thm', title: 'Rules', html: String.raw`<ul><li><b>Linearity:</b> $(a f + b g)' = a f' + b g'$.</li><li><b>Product:</b> $(f g)' = f' g + f g'$.</li><li><b>Quotient:</b> $\left(\dfrac{f}{g}\right)' = \dfrac{f' g - f g'}{g^2}$.</li><li><b>Chain:</b> $\dfrac{\mathrm d}{\mathrm d x} f\big(g(x)\big) = f'\big(g(x)\big)\, g'(x)$ — outer derivative at the inner function, times the inner derivative.</li></ul>` },
        { type: 'steps', title: String.raw`Example: $\dfrac{\mathrm d}{\mathrm d x}\left(x^2 e^{-3x}\right)$`, steps: [
          String.raw`The function is a product of $x^2$ and $e^{-3x}$. By the chain rule $\frac{\mathrm d}{\mathrm d x} e^{-3x} = e^{-3x}\cdot(-3)$.`,
          String.raw`The product rule gives $$\frac{\mathrm d}{\mathrm d x}\left(x^2 e^{-3x}\right) = 2x\, e^{-3x} + x^2 \cdot \left(-3 e^{-3x}\right) = x e^{-3x}(2 - 3x).$$`,
        ] },
        { type: 'steps', title: String.raw`Example: $\dfrac{\mathrm d}{\mathrm d x}\arctan\left(\sqrt{x}\right)$ and where the arctan rule comes from`, steps: [
          String.raw`Outer function $\arctan u$ with $u = \sqrt x$, inner derivative $u' = \frac{1}{2\sqrt x}$. The chain rule gives $$\frac{\mathrm d}{\mathrm d x}\arctan\sqrt{x} = \frac{1}{1 + (\sqrt x)^2}\cdot\frac{1}{2\sqrt{x}} = \frac{1}{2\sqrt{x}\,(1 + x)}.$$`,
          String.raw`Why $\frac{\mathrm d}{\mathrm d x}\arctan x = \frac{1}{1+x^2}$: let $y = \arctan x$, so $\tan y = x$. Differentiating both sides with the chain rule gives $(1 + \tan^2 y)\, y' = 1$.`,
          String.raw`Hence $y' = \dfrac{1}{1 + \tan^2 y} = \dfrac{1}{1 + x^2}$. The same idea with $\sin y = x$ gives $\frac{\mathrm d}{\mathrm d x}\arcsin x = \frac{1}{\cos y} = \frac{1}{\sqrt{1 - x^2}}$ (we take $\cos y \ge 0$ because $y \in [-\frac\pi2, \frac\pi2]$).`,
        ] },
        { type: 'steps', title: String.raw`Example: $\dfrac{\mathrm d}{\mathrm d x}\,\dfrac{\ln x}{x}$`, steps: [
          String.raw`The quotient rule with $f = \ln x$, $f' = \frac1x$, $g = x$, $g' = 1$: $$\frac{\mathrm d}{\mathrm d x}\,\frac{\ln x}{x} = \frac{\frac{1}{x}\cdot x - \ln x \cdot 1}{x^2} = \frac{1 - \ln x}{x^2}.$$`,
          String.raw`It vanishes at $x = e$, where $\frac{\ln x}{x}$ has its largest value $\frac1e$ — a preview of the next module.`,
        ] },
        { type: 'quiz', question: String.raw`What is $\dfrac{\mathrm d}{\mathrm d x}\ln(\cos x)$?`, choices: [String.raw`$\dfrac{1}{\cos x}$`, String.raw`$-\tan x$`, String.raw`$\tan x$`, String.raw`$-\dfrac{1}{\sin x}$`], answer: 1, explain: String.raw`Chain rule: $\frac{1}{\cos x}\cdot(-\sin x) = -\tan x$.` },
        { type: 'quiz', question: String.raw`What is $\dfrac{\mathrm d}{\mathrm d x}\sin^2(3x)$?`, choices: [String.raw`$2\sin(3x)$`, String.raw`$6\sin(3x)\cos(3x)$`, String.raw`$2\sin(3x)\cos(3x)$`, String.raw`$3\cos^2(3x)$`], answer: 1, explain: String.raw`Two nested chain rules: $2\sin(3x)\cdot\cos(3x)\cdot 3 = 6\sin 3x\cos 3x = 3\sin 6x$.` },
      ],
    },
    {
      id: 'implicit-linear',
      title: 'Implicit differentiation and linear approximation',
      blocks: [
        { type: 'text', html: String.raw`<p>Near the point of tangency the tangent line is an excellent approximation of the function. Move $a$ and watch how small the gap is for $x$ close to $a$.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'The linearisation of √x at x = a',
          functions: [{ expr: 'sqrt(x)', label: String.raw`$\sqrt{x}$` }, { expr: 'sqrt(a) + (x - a)./(2*sqrt(a))', label: String.raw`$L(x) = \sqrt a + \frac{x - a}{2\sqrt a}$`, dash: true }],
          params: { a: { min: 0.25, max: 8, value: 4, step: 0.05, label: '$a$' } },
          points: [{ x: 'a', y: 'sqrt(a)' }],
          xlim: [0, 10], ylim: [-0.5, 4],
          readout: String.raw`At $x = a + 0.1$: $\sqrt{x} = {{sqrt(a + 0.1)}}$, $L(x) = {{sqrt(a) + 0.05/sqrt(a)}}$.`,
        } },
        { type: 'callout', kind: 'def', title: 'Linear approximation', html: String.raw`<p>For $x$ near $a$, $$f(x) \approx L(x) = f(a) + f'(a)(x - a).$$ The error is small compared with $|x - a|$: it shrinks roughly like $(x - a)^2$.</p>` },
        { type: 'steps', title: String.raw`Example: approximate $\sqrt{4.1}$`, steps: [
          String.raw`We take $f(x) = \sqrt x$ and $a = 4$, where everything is known: $f(4) = 2$ and $f'(x) = \frac{1}{2\sqrt x}$, so $f'(4) = \frac14$.`,
          String.raw`The linear approximation gives $\sqrt{4.1} \approx 2 + \frac14 \cdot 0.1 = 2.025$. The true value is $2.02485\ldots$, an error of about $1.5\cdot10^{-4}$.`,
        ] },
        { type: 'text', html: String.raw`<p>A curve such as the circle $x^2 + y^2 = 25$ is not the graph of one function, but near each point it is the graph of some $y(x)$. <b>Implicit differentiation</b> differentiates the equation as it stands, treating $y$ as a function of $x$ (so $\frac{\mathrm d}{\mathrm d x} y^2 = 2y\,y'$ by the chain rule), and then solves for $y'$.</p>` },
        { type: 'steps', title: String.raw`Example: slope of $x^2 + y^2 = 25$ at $(3, 4)$`, steps: [
          String.raw`We differentiate both sides with respect to $x$: $2x + 2y\,y' = 0$.`,
          String.raw`Solving for $y'$ gives $y' = -\dfrac{x}{y}$. At $(3, 4)$ the slope is $-\frac34$.`,
          String.raw`Check: the radius to $(3,4)$ has slope $\frac43$, and the tangent of a circle is perpendicular to the radius: $\frac43 \cdot \left(-\frac34\right) = -1$.`,
        ] },
        { type: 'quiz', question: String.raw`Use the linearisation of $e^x$ at $0$ to estimate $e^{0.05}$.`, choices: [String.raw`$1.05$`, String.raw`$1.0513$`, String.raw`$0.95$`, String.raw`$1.5$`], answer: 0, explain: String.raw`$L(x) = e^0 + e^0 (x - 0) = 1 + x$, so $e^{0.05} \approx 1.05$. (The true value is $1.05127\ldots$)` },
      ],
    },
  ],
  matlab: [
    {
      id: 'numerical-derivative',
      title: 'Derivative notation and numerical derivatives',
      blocks: [
        { type: 'text', html: String.raw`<p>Write the derivative operator with an upright d, as in the reference: <code>\frac{\mathrm d}{\mathrm d x}</code>. A prime is typed with the apostrophe, <code>f'(x)</code>, and <code>\cdot</code> is the multiplication dot.</p>` },
        { type: 'table', head: ['Type', 'Result'], rows: [
          [String.raw`<code>\frac{\mathrm d}{\mathrm d x} \sin x = \cos x</code>`, String.raw`$\frac{\mathrm d}{\mathrm d x} \sin x = \cos x$`],
          [String.raw`<code>f'(x)</code>, <code>f''(x)</code>`, String.raw`$f'(x)$, $f''(x)$`],
          [String.raw`<code>2x \cdot e^{-3x}</code>`, String.raw`$2x \cdot e^{-3x}$`],
          [String.raw`<code>\frac{\mathrm d y}{\mathrm d x}</code>`, String.raw`$\frac{\mathrm d y}{\mathrm d x}$`],
        ] },
        { type: 'latex', prompt: 'Type the product rule:', target: String.raw`\frac{\mathrm d}{\mathrm d x}\left( f(x) g(x) \right) = f'(x) g(x) + f(x) g'(x)`, accept: [String.raw`\frac{\mathrm d}{\mathrm d x}\left( f(x) \cdot g(x) \right) = f'(x) \cdot g(x) + f(x) \cdot g'(x)`] },
        { type: 'latex', prompt: 'Type this derivative:', target: String.raw`\frac{\mathrm d}{\mathrm d x} \arctan x = \frac{1}{1 + x^2}` },
        { type: 'latex', prompt: 'Type the result of the worked example:', target: String.raw`f'(x) = 2x \cdot e^{-3x} - 3x^2 \cdot e^{-3x}` },
        { type: 'text', html: String.raw`<p>MATLAB does not differentiate formulas (that would need <code>syms</code>, which is not allowed). It approximates derivatives by difference quotients. The <b>central difference</b> $$f'(x) \approx \frac{f(x + h) - f(x - h)}{2h}$$ is much more accurate than the one-sided quotient: its error shrinks like $h^2$ instead of $h$. Run the comparison for $f = e^x$ at $x = 1$, where the exact answer is $e$:</p>` },
        { type: 'code', caption: 'Errors of the forward and central quotients. Note how the error grows again for very small h (rounding).', editable: true, code: `f = @(x) exp(x);
x0 = 1;
h = 10.^-(1:10);
forward = (f(x0 + h) - f(x0)) ./ h;
central = (f(x0 + h) - f(x0 - h)) ./ (2*h);
fprintf('%8.0e   %10.2e   %10.2e\\n', [h; abs(forward - exp(1)); abs(central - exp(1))])` },
        { type: 'callout', kind: 'matlab', html: String.raw`<p>A step around $h = 10^{-5}$ is a good default for the central difference: about 10 correct digits. Smaller $h$ loses digits because $f(x+h)$ and $f(x-h)$ become almost equal and their difference is dominated by rounding.</p>` },
        { type: 'matlab', prompt: String.raw`Approximate $f'(1)$ for $f(x) = x^2 \sin x$ by a central difference with $h = 10^{-5}$ and store it in <code>d</code>. Then store the exact value from the product rule, $f'(x) = 2x\sin x + x^2\cos x$, in <code>exact</code>.`, starter: `f = @(x) x.^2 .* sin(x);\nh = 1e-5;\nd = 0;       % central difference at x = 1\nexact = 0;   % product rule at x = 1`, solution: `f = @(x) x.^2 .* sin(x);\nh = 1e-5;\nd = (f(1 + h) - f(1 - h)) / (2*h)\nexact = 2*sin(1) + cos(1)`, checks: [{ var: 'd', value: '2*sin(1) + cos(1)', tol: 1e-8 }, { var: 'exact', value: '2*sin(1) + cos(1)', tol: 1e-12 }] },
        { type: 'matlab', prompt: String.raw`Write a reusable numerical derivative: an anonymous function <code>D = @(f, x) ...</code> that returns the central difference of any function handle <code>f</code> at <code>x</code> with $h = 10^{-5}$. Use it to compute <code>s = D(@(x) atan(x), 1)</code>, which should be close to $\frac{1}{2}$.`, starter: `D = @(f, x) 0;   % replace 0 by the central difference\ns = D(@(x) atan(x), 1)`, solution: `D = @(f, x) (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;\ns = D(@(x) atan(x), 1)`, checks: [{ var: 'D', isFunction: true }, { var: 's', value: 0.5, tol: 1e-8 }] },
      ],
    },
    {
      id: 'tangent-plot',
      title: 'Plotting a function with its tangent line',
      blocks: [
        { type: 'text', html: String.raw`<p>A tangent line is a function too: <code>T = @(x) f(a) + m*(x - a)</code>. To show several graphs in one figure use <code>hold on</code> after the first plot command and <code>legend</code> to label them in the order they were drawn. <code>hold off</code> releases the figure.</p>` },
        { type: 'code', caption: 'The function f(x) = ln x and its tangent at x = 2. Change a and run again.', editable: true, code: `f = @(x) log(x);
a = 2;
m = 1/a;                       % f'(a) by hand: d/dx ln x = 1/x
T = @(x) f(a) + m*(x - a);     % tangent line
fplot(f, [0.2 5])
hold on
fplot(T, [0.2 5], '--')
plot(a, f(a), 'o')
hold off
grid on
legend('f(x) = ln x', 'tangent at x = a', 'point of tangency')` },
        { type: 'livescript', caption: 'Model answer: a tangent line with a numerical check', blocks: [
          { type: 'heading', content: 'Problem 2 (Attempted)' },
          { type: 'text', content: 'We find the tangent line of $f(x) = x e^{-x}$ at $x = 2$. We differentiate with the product rule:' },
          { type: 'equation', content: String.raw`f'(x) = 1 \cdot e^{-x} + x \cdot \left(-e^{-x}\right) = (1 - x)\,e^{-x}.` },
          { type: 'text', content: 'At $x = 2$ we get $f(2) = 2e^{-2}$ and $f\'(2) = -e^{-2}$, so the tangent line is' },
          { type: 'equation', content: String.raw`y = 2e^{-2} - e^{-2}(x - 2) = e^{-2}(4 - x).` },
          { type: 'text', content: 'We check the slope with a central difference and plot both graphs:' },
          { type: 'code', content: "f = @(x) x .* exp(-x);\nh = 1e-5;\nslope = (f(2 + h) - f(2 - h)) / (2*h)\nexact = -exp(-2)\nT = @(x) exp(-2)*(4 - x);\nfplot(f, [0 5])\nhold on\nfplot(T, [0 5], '--')\nhold off\ngrid on\nlegend('f', 'tangent at x = 2')" },
        ] },
        { type: 'matlab', prompt: String.raw`For $f(x) = \sqrt{x}$ at $a = 4$: store the slope $f'(4)$ in <code>m</code> (compute it by hand: $f'(x) = \frac{1}{2\sqrt x}$), define the tangent line <code>T</code>, and plot $f$ and $T$ on $[0, 9]$ in one figure with a legend.`, starter: `f = @(x) sqrt(x);\na = 4;\nm = 0;              % f'(4)\nT = @(x) 0*x;       % tangent line\nfplot(f, [0 9])\n`, solution: `f = @(x) sqrt(x);\na = 4;\nm = 1/(2*sqrt(a));\nT = @(x) f(a) + m*(x - a);\nfplot(f, [0 9])\nhold on\nfplot(T, [0 9], '--')\nhold off\nlegend('sqrt(x)', 'tangent at x = 4')`, checks: [{ var: 'm', value: 0.25 }, { var: 'T', isFunction: true }, { figure: true }, { uses: 'legend' }], hint: String.raw`<code>hold on</code> between the two <code>fplot</code> calls.` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'The derivative from the definition',
      difficulty: 'core',
      statement: String.raw`<p>Let $f(x) = x^2 - 3x$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Simplify the difference quotient $\dfrac{f(2 + h) - f(2)}{h}$ for $h \ne 0$ (an expression in <code>h</code>).`, kind: 'expression', variable: 'h', answer: 'h + 1', domain: [0.1, 2], solution: String.raw`$f(2+h) = 4 + 4h + h^2 - 6 - 3h = -2 + h + h^2$ and $f(2) = -2$, so the quotient is $\frac{h + h^2}{h} = 1 + h$.` },
        { label: '(b)', prompt: String.raw`Compute $f'(2)$.`, kind: 'numeric', answer: '1', solution: String.raw`$f'(2) = \lim_{h\to0}(1 + h) = 1$.` },
        { label: '(c)', prompt: String.raw`Give $f'(x)$.`, kind: 'expression', variable: 'x', answer: '2*x - 3', domain: [-2, 3], solution: String.raw`$f'(x) = 2x - 3$ (check: $f'(2) = 1$).` },
      ],
    },
    {
      id: 'a2',
      title: 'Product, quotient and chain rules',
      difficulty: 'core',
      statement: String.raw`<p>Differentiate. Enter $f'(x)$ in MATLAB syntax, e.g. <code>2*x.*exp(2*x)</code>, <code>asin(x)</code>, <code>atan(x)</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$f(x) = x^3 e^{2x}$`, kind: 'expression', variable: 'x', answer: '3*x.^2.*exp(2*x) + 2*x.^3.*exp(2*x)', domain: [-1, 1.5], solution: String.raw`Product and chain rule: $f'(x) = 3x^2 e^{2x} + x^3\cdot 2e^{2x} = x^2 e^{2x}(3 + 2x)$.` },
        { label: '(b)', prompt: String.raw`$f(x) = \ln(x^2 + 1)$`, kind: 'expression', variable: 'x', answer: '2*x./(x.^2 + 1)', domain: [-2, 2], solution: String.raw`Chain rule: $f'(x) = \dfrac{1}{x^2+1}\cdot 2x$.` },
        { label: '(c)', prompt: String.raw`$f(x) = \dfrac{\sin x}{1 + \cos x}$ (simplify as far as you can)`, kind: 'expression', variable: 'x', answer: '1./(1 + cos(x))', domain: [-2, 2], solution: String.raw`Quotient rule: $f'(x) = \dfrac{\cos x\,(1 + \cos x) - \sin x\,(-\sin x)}{(1 + \cos x)^2} = \dfrac{\cos x + \cos^2 x + \sin^2 x}{(1+\cos x)^2} = \dfrac{1 + \cos x}{(1 + \cos x)^2} = \dfrac{1}{1 + \cos x}$.` },
        { label: '(d)', prompt: String.raw`$f(x) = \arctan(2x)$`, kind: 'expression', variable: 'x', answer: '2./(1 + 4*x.^2)', domain: [-2, 2], solution: String.raw`$f'(x) = \dfrac{1}{1 + (2x)^2}\cdot 2 = \dfrac{2}{1 + 4x^2}$.` },
        { label: '(e)', prompt: String.raw`$f(x) = \arcsin\left(\dfrac{x}{2}\right)$, $|x| < 2$`, kind: 'expression', variable: 'x', answer: '1./sqrt(4 - x.^2)', domain: [-1.5, 1.5], solution: String.raw`$f'(x) = \dfrac{1}{\sqrt{1 - x^2/4}}\cdot\dfrac12 = \dfrac{1}{\sqrt{4 - x^2}}$, since $2\sqrt{1 - x^2/4} = \sqrt{4 - x^2}$.` },
      ],
    },
    {
      id: 'a3',
      title: 'Tangent line and linear approximation',
      difficulty: 'core',
      statement: String.raw`<p>Let $f(x) = \sqrt{1 + 3x}$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Compute $f'(1)$.`, kind: 'numeric', answer: '3/4', solution: String.raw`$f'(x) = \dfrac{3}{2\sqrt{1+3x}}$, so $f'(1) = \dfrac{3}{2\cdot 2} = \dfrac34$.` },
        { label: '(b)', prompt: String.raw`Give the tangent line $y = L(x)$ at $x = 1$.`, kind: 'expression', variable: 'x', answer: '2 + 3/4*(x - 1)', domain: [0, 3], solution: String.raw`$f(1) = 2$, so $L(x) = 2 + \frac34(x - 1)$.` },
        { label: '(c)', prompt: String.raw`Use $L$ to approximate $f(1.08) = \sqrt{4.24}$.`, kind: 'numeric', answer: '2.06', tol: 1e-5, solution: String.raw`$L(1.08) = 2 + \frac34 \cdot 0.08 = 2.06$. (The true value is $2.05913\ldots$)` },
      ],
    },
    {
      id: 'a4',
      title: 'Implicit differentiation',
      difficulty: 'core',
      statement: String.raw`<p>Find $\dfrac{\mathrm d y}{\mathrm d x}$ at the given point of each curve.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$x^3 + y^3 = 9$ at $(1, 2)$`, kind: 'numeric', answer: '-1/4', solution: String.raw`$3x^2 + 3y^2 y' = 0$, so $y' = -\dfrac{x^2}{y^2} = -\dfrac{1}{4}$.` },
        { label: '(b)', prompt: String.raw`$e^{y} + x y = e$ at $(0, 1)$`, kind: 'numeric', answer: '-1/exp(1)', solution: String.raw`$e^y y' + y + x y' = 0$, so $y' = -\dfrac{y}{e^y + x}$. At $(0, 1)$: $y' = -\dfrac{1}{e}$.` },
      ],
    },
    {
      id: 'a5',
      title: 'Inverse trigonometric derivatives',
      difficulty: 'challenge',
      statement: String.raw`<p>Simplify each derivative as far as possible.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\dfrac{\mathrm d}{\mathrm d x}\left(x \arcsin x + \sqrt{1 - x^2}\right)$, $|x| < 1$`, kind: 'expression', variable: 'x', answer: 'asin(x)', domain: [-0.9, 0.9], solution: String.raw`$\arcsin x + \dfrac{x}{\sqrt{1-x^2}} + \dfrac{-2x}{2\sqrt{1 - x^2}} = \arcsin x$. (So $x\arcsin x + \sqrt{1 - x^2}$ is an antiderivative of $\arcsin x$ — see module 5.)` },
        { label: '(b)', prompt: String.raw`$\dfrac{\mathrm d}{\mathrm d x}\arctan\left(\dfrac{1}{x}\right)$, $x \ne 0$`, kind: 'expression', variable: 'x', answer: '-1./(1 + x.^2)', domain: [0.3, 3], solution: String.raw`$\dfrac{1}{1 + 1/x^2}\cdot\left(-\dfrac{1}{x^2}\right) = -\dfrac{1}{x^2 + 1}$.` },
        { label: '(c)', prompt: String.raw`By (b), $\arctan x + \arctan(1/x)$ has derivative $0$ for $x > 0$. What is its (constant) value there?`, kind: 'numeric', answer: 'pi/2', solution: String.raw`Evaluate at $x = 1$: $\frac\pi4 + \frac\pi4 = \frac\pi2$. A function with zero derivative on an interval is constant there (module 5).` },
        { label: '(d)', prompt: String.raw`Where is $f(x) = |x^2 - 4|$ <b>not</b> differentiable?`, kind: 'choice', choices: [String.raw`only at $x = 0$`, String.raw`at $x = \pm 2$`, String.raw`at $x = 0$ and $x = \pm 2$`, 'nowhere'], answer: 1, solution: String.raw`$f$ has corners where $x^2 - 4$ changes sign with non-zero slope: at $x = \pm 2$, the one-sided derivatives are $\pm 4$ (e.g. $-4$ and $4$ at $x = 2$). At $x = 0$, $f = 4 - x^2$ is smooth.` },
      ],
    },
  ],
};
