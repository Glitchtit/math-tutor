// Module 10: Arc length and physical applications

export default {
  id: 'arclength',
  number: 10,
  part: 'applications',
  hw: 'HW1',
  title: 'Arc length and physical applications',
  summary: 'Arc length as the limit of polygon lengths, L = ∫√(1+f′²)dx, parametric curves and surfaces of revolution; displacement versus distance from velocity, piecewise motion with continuity conditions, work, mass and centre of mass — with roots and integral in MATLAB.',
  intro: String.raw`<p>The definite integral adds up anything that can be cut into small pieces: lengths of tiny line segments, distances travelled in short time intervals, work done over short displacements, masses of thin slices. This module sets up those sums. Most arc-length integrals have no elementary antiderivative, so MATLAB's <code>integral</code> becomes part of the answer, and piecewise motion problems lead to polynomial equations solved with <code>roots</code>.</p>`,
  lessons: [
    {
      id: 'arc-length',
      title: 'Arc length of a graph',
      blocks: [
        { type: 'text', html: String.raw`<p>To measure a curve, replace it by a polygon through $n+1$ points on the graph and add up the straight segments. Refining the polygon, the total length increases towards the true arc length. Press <b>Refine</b>.</p>` },
        { type: 'widget', name: 'arclength', config: {
          title: 'Polygon approximations of y = x^(3/2) on [0, 4]',
          f: 'x.^1.5', a: 0, b: 4, xlim: [-0.3, 4.3], ylim: [-0.5, 8.5],
          exactTex: String.raw`\tfrac{8}{27}\left(10\sqrt{10}-1\right) \approx 9.0734`,
        } },
        { type: 'text', html: String.raw`<p>One segment from $x_{k-1}$ to $x_k$ has length $\sqrt{\Delta x^2 + \Delta y^2} = \sqrt{1 + (\Delta y/\Delta x)^2}\,\Delta x$. By the mean value theorem $\Delta y/\Delta x = f'(c_k)$ for some $c_k$ in the subinterval, so the polygon length is a Riemann sum of $\sqrt{1 + f'(x)^2}$. Its limit is an integral.</p>` },
        { type: 'callout', kind: 'def', title: 'Arc length', html: String.raw`<p>If $f'$ is continuous on $[a, b]$, the length of the graph $y = f(x)$, $a \le x \le b$, is</p>$$L = \int_a^b \sqrt{1 + \big(f'(x)\big)^2}\,\mathrm d x .$$<p>Think of $\mathrm d s = \sqrt{\mathrm d x^2 + \mathrm d y^2}$ as the length of an infinitesimal piece of the curve.</p>` },
        { type: 'steps', title: String.raw`Example: length of $y = \dfrac{x^2}{4} - \dfrac{\ln x}{2}$ on $[1, e]$`, steps: [
          String.raw`We differentiate: $f'(x) = \dfrac{x}{2} - \dfrac{1}{2x}$.`,
          String.raw`We expand $1 + f'(x)^2 = 1 + \dfrac{x^2}{4} - \dfrac12 + \dfrac{1}{4x^2} = \dfrac{x^2}{4} + \dfrac12 + \dfrac{1}{4x^2} = \left(\dfrac{x}{2} + \dfrac{1}{2x}\right)^2$ — a perfect square, which is what makes this example computable by hand.`,
          String.raw`Hence $\sqrt{1 + f'(x)^2} = \dfrac{x}{2} + \dfrac{1}{2x}$ (positive on $[1, e]$), and $L = \displaystyle\int_1^e \left(\frac{x}{2} + \frac{1}{2x}\right)\mathrm d x = \Big[\frac{x^2}{4} + \frac{\ln x}{2}\Big]_1^e$.`,
          String.raw`Evaluating, $L = \dfrac{e^2}{4} + \dfrac12 - \dfrac14 = \dfrac{e^2 + 1}{4} \approx 2.0973$.`,
        ] },
        { type: 'callout', kind: 'warn', title: 'Usually numerical', html: String.raw`<p>Only specially designed functions make $\sqrt{1 + f'^2}$ integrable in closed form. Already $y = x^2$ needs a trigonometric substitution, and $y = \sin x$ leads to an elliptic integral. In homework the expected answer is then: set up the integral exactly, evaluate it with <code>integral</code>.</p>` },
        { type: 'quiz', question: String.raw`Which integral gives the length of one arch of $y = \sin x$, $0 \le x \le \pi$?`, choices: [String.raw`$\int_0^\pi \sqrt{1 + \sin^2 x}\,\mathrm d x$`, String.raw`$\int_0^\pi \sqrt{1 + \cos^2 x}\,\mathrm d x$`, String.raw`$\int_0^\pi \big(1 + \cos x\big)\,\mathrm d x$`, String.raw`$\int_0^\pi \sqrt{1 + \cos x}\,\mathrm d x$`], answer: 1, explain: String.raw`$f'(x) = \cos x$, and the integrand is $\sqrt{1 + (f')^2} = \sqrt{1 + \cos^2 x}$. Its value is about $3.8202$ — longer than the straight distance $\pi$, as it must be.` },
      ],
    },
    {
      id: 'parametric-surface',
      title: 'Parametric curves and surfaces of revolution',
      blocks: [
        { type: 'text', html: String.raw`<p>The same idea, $\mathrm d s = \sqrt{\mathrm d x^2 + \mathrm d y^2}$, works when the curve is traced by a parameter: $x = x(t)$, $y = y(t)$, $\alpha \le t \le \beta$. Dividing by $\mathrm d t$ gives the speed $\sqrt{x'(t)^2 + y'(t)^2}$ along the curve, and the length is the integral of the speed.</p>` },
        { type: 'callout', kind: 'thm', title: 'Formulas', html: String.raw`<ul><li>Parametric curve: $\displaystyle L = \int_\alpha^\beta \sqrt{x'(t)^2 + y'(t)^2}\,\mathrm d t$.</li><li>Surface obtained by rotating $y = f(x) \ge 0$, $a \le x \le b$, about the $x$-axis: $\displaystyle S = \int_a^b 2\pi f(x)\sqrt{1 + f'(x)^2}\,\mathrm d x$ — a band of radius $f(x)$ and slant width $\mathrm d s$ has area $2\pi f(x)\,\mathrm d s$.</li></ul>` },
        { type: 'text', html: String.raw`<p>A striking consequence (Archimedes): slice a sphere of radius $R$ by two parallel planes a distance $h$ apart. With $f(x) = \sqrt{R^2 - x^2}$ one gets $f\sqrt{1 + f'^2} = R$, so the zone has area $2\pi R h$ no matter where the slab sits. Move the slab and watch the readout.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Zones of a sphere: area depends only on the thickness h',
          functions: [{ expr: 'sqrt(R^2 - x.^2)', label: '$y = \\sqrt{R^2 - x^2}$' }],
          params: { R: { min: 2, max: 3, value: 2.5, label: '$R$' }, c: { min: -2, max: 1, value: -1, label: 'slab start $c$' }, h: { min: 0.2, max: 1, value: 0.8, label: 'thickness $h$' } },
          shade: { expr: 'sqrt(R^2 - x.^2)', from: 'c', to: 'c+h' },
          xlim: [-3.2, 3.2], ylim: [-0.5, 3.5], axisEqual: true,
          readout: String.raw`Zone area $S = 2\pi R h = {{2*pi*R*h}}$, the same for every position $c$ of the slab.`,
        } },
        { type: 'steps', title: String.raw`Example: one arch of the cycloid $x = t - \sin t$, $y = 1 - \cos t$, $0 \le t \le 2\pi$`, steps: [
          String.raw`We differentiate the coordinates: $x'(t) = 1 - \cos t$ and $y'(t) = \sin t$.`,
          String.raw`We simplify the speed squared: $x'^2 + y'^2 = 1 - 2\cos t + \cos^2 t + \sin^2 t = 2 - 2\cos t = 4\sin^2(t/2)$, using $1 - \cos t = 2\sin^2(t/2)$.`,
          String.raw`On $[0, 2\pi]$ we have $\sin(t/2) \ge 0$, so the speed is $2\sin(t/2)$ and $L = \displaystyle\int_0^{2\pi} 2\sin\frac t2\,\mathrm d t = \Big[-4\cos\frac t2\Big]_0^{2\pi} = 4 + 4 = 8$.`,
        ] },
        { type: 'quiz', question: String.raw`The parabola $y = x^2$, $0 \le x \le 1$, is rotated about the $x$-axis. Which integral is its surface area?`, choices: [String.raw`$\int_0^1 2\pi x^2\,\mathrm d x$`, String.raw`$\int_0^1 \pi x^4\,\mathrm d x$`, String.raw`$\int_0^1 2\pi x^2\sqrt{1 + 4x^2}\,\mathrm d x$`, String.raw`$\int_0^1 2\pi x\sqrt{1 + 4x^2}\,\mathrm d x$`], answer: 2, explain: String.raw`Radius $f(x) = x^2$ times slant width $\sqrt{1 + f'^2}\,\mathrm d x = \sqrt{1 + 4x^2}\,\mathrm d x$. The second choice is the <i>volume</i>; the last one would be the area when rotating about the $y$-axis.` },
      ],
    },
    {
      id: 'physical',
      title: 'Displacement, distance, work and mass',
      blocks: [
        { type: 'text', html: String.raw`<p>If $v(t)$ is the velocity of an object moving on a line, then $\int_a^b v(t)\,\mathrm d t$ is its <b>displacement</b> (net change of position), while $\int_a^b |v(t)|\,\mathrm d t$ is the <b>distance travelled</b>. They differ whenever the object turns around. Below, $v(t) = (t - 1)(t - 3)$: blue area counts forward motion, red area backward motion.</p>` },
        { type: 'widget', name: 'plot', config: {
          title: 'Velocity v(t) = (t-1)(t-3): displacement vs distance',
          functions: [{ expr: '(x-1).*(x-3)', label: '$v(t) = (t-1)(t-3)$' }],
          params: { T: { min: 0.05, max: 4, value: 4, label: 'end time $T$' } },
          shade: { expr: '(x-1).*(x-3)', from: 0, to: 'T', signed: true },
          xlim: [-0.3, 4.3], ylim: [-1.5, 3.5],
          animate: { param: 'T', from: 0.05, to: 4, duration: 6000 },
          readout: String.raw`Displacement $\int_0^T v\,\mathrm dt = {{T.^3/3-2*T.^2+3*T}}$ m, distance $\int_0^T |v|\,\mathrm dt = {{(T<=1).*(T.^3/3-2*T.^2+3*T) + (T>1 & T<=3).*(8/3-(T.^3/3-2*T.^2+3*T)) + (T>3).*(8/3+(T.^3/3-2*T.^2+3*T))}}$ m.`,
        } },
        { type: 'callout', kind: 'key', html: String.raw`<p>To compute $\int |v|\,\mathrm d t$ by hand, find the zeros of $v$, split the interval there and add the absolute values of the pieces. Here $\int_0^1 v = \tfrac43$, $\int_1^3 v = -\tfrac43$, $\int_3^4 v = \tfrac43$: displacement $\tfrac43$ m, distance $4$ m.</p>` },
        { type: 'text', html: String.raw`<p>Real motions are often <b>piecewise</b>: accelerate, cruise, brake. The pieces are glued by continuity conditions — position and velocity cannot jump (that would need infinite acceleration), but acceleration can, and does when a motor switches mode.</p>` },
        { type: 'steps', title: 'Example: a lift with three phases', steps: [
          String.raw`A lift starts from rest, accelerates with $a = 2\ \mathrm{m/s^2}$ for 2 s, moves with constant speed until time $T$, then brakes with $a = -2\ \mathrm{m/s^2}$ to rest. It rises 30 m in total. We write the velocity piecewise, choosing constants so that $v$ is continuous:
          $$v(t) = \begin{cases} 2t, & 0 \le t \le 2, \\ 4, & 2 < t \le T, \\ 4 - 2(t - T), & T < t \le T + 2. \end{cases}$$`,
          String.raw`We integrate each piece: $\int_0^2 2t\,\mathrm d t = 4$, $\int_2^T 4\,\mathrm d t = 4(T - 2)$, and $\int_T^{T+2} \big(4 - 2(t-T)\big)\,\mathrm d t = 8 - 4 = 4$.`,
          String.raw`The total displacement is $4 + 4(T - 2) + 4 = 4T$. Setting $4T = 30$ gives $T = 7.5$ s; the ride lasts $9.5$ s.`,
          String.raw`The acceleration is $2$, $0$, $-2$ on the three phases, so it is <b>not</b> continuous at $t = 2$ and $t = 7.5$ — passengers feel a jolt. Velocity and position are continuous.`,
        ] },
        { type: 'text', html: String.raw`<p>The same "slice and add" recipe gives other physical quantities. The integrand is always <i>(density of the quantity) × (size of a slice)</i>.</p>` },
        { type: 'table', head: ['Quantity', 'Small piece', 'Integral'], rows: [
          [String.raw`Work by a variable force $F(x)$`, String.raw`$\mathrm d W = F(x)\,\mathrm d x$`, String.raw`$W = \int_a^b F(x)\,\mathrm d x$`],
          [String.raw`Spring, $F = kx$ ($x$ = extension)`, String.raw`$kx\,\mathrm d x$`, String.raw`$W = \tfrac12 k\left(x_2^2 - x_1^2\right)$`],
          [String.raw`Mass of a rod, line density $\rho(x)$`, String.raw`$\mathrm d m = \rho(x)\,\mathrm d x$`, String.raw`$m = \int_a^b \rho(x)\,\mathrm d x$`],
          [String.raw`Centre of mass of the rod`, String.raw`moment $x\,\rho(x)\,\mathrm d x$`, String.raw`$\bar x = \dfrac{\int_a^b x\rho(x)\,\mathrm d x}{\int_a^b \rho(x)\,\mathrm d x}$`],
        ] },
        { type: 'steps', title: String.raw`Example: rod on $[0, 3]$ m with density $\rho(x) = 1 + x^2$ kg/m`, steps: [
          String.raw`We integrate the density to get the mass: $m = \int_0^3 (1 + x^2)\,\mathrm d x = 3 + 9 = 12$ kg.`,
          String.raw`We compute the first moment: $\int_0^3 x(1 + x^2)\,\mathrm d x = \Big[\frac{x^2}{2} + \frac{x^4}{4}\Big]_0^3 = \frac92 + \frac{81}{4} = \frac{99}{4}$ kg·m.`,
          String.raw`Dividing, $\bar x = \dfrac{99/4}{12} = \dfrac{33}{16} \approx 2.06$ m — to the right of the midpoint $1.5$ m, because the rod is heavier at the right end.`,
        ] },
        { type: 'quiz', question: String.raw`A particle has $v(t) = \cos t$ m/s on $[0, 2\pi]$. Which pair is (displacement, distance)?`, choices: [String.raw`$(0, 0)$`, String.raw`$(0, 4)$`, String.raw`$(4, 4)$`, String.raw`$(2, 4)$`], answer: 1, explain: String.raw`$\int_0^{2\pi}\cos t\,\mathrm d t = 0$: the particle returns to its start. But $\int_0^{2\pi}|\cos t|\,\mathrm d t = 4\int_0^{\pi/2}\cos t\,\mathrm d t = 4$.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'piecewise-roots',
      title: 'Piecewise functions, cases in LaTeX and roots',
      blocks: [
        { type: 'text', html: String.raw`<p>Homework 1 asks you to write arc-length integrands and piecewise definitions in the equation editor. The square brackets of the derivative need <code>\left( ... \right)</code> so they grow with the content, and piecewise functions use the <code>cases</code> environment: <code>&amp;</code> aligns the conditions, <code>\\</code> starts a new line.</p>` },
        { type: 'table', head: ['You type', 'Result'], rows: [
          [String.raw`<code>\sqrt{1 + \left(f'(x)\right)^2}</code>`, String.raw`$\sqrt{1 + \left(f'(x)\right)^2}$`],
          [String.raw`<code>v(t) = \begin{cases} 2t, &amp; 0 \le t \le 2 \\ 4, &amp; t &gt; 2 \end{cases}</code>`, String.raw`$v(t) = \begin{cases} 2t, & 0 \le t \le 2 \\ 4, & t > 2 \end{cases}$`],
          [String.raw`<code>\mathrm{m/s^2}</code>`, String.raw`$\mathrm{m/s^2}$`],
        ] },
        { type: 'latex', prompt: 'Type the arc-length formula:', target: String.raw`L = \int_a^b \sqrt{1 + \left(f'(x)\right)^2}\,\mathrm d x`, accept: [String.raw`L = \int_a^b \sqrt{1 + (f'(x))^2}\,\mathrm d x`, String.raw`L = \int_a^b \sqrt{1 + f'(x)^2}\,\mathrm d x`] },
        { type: 'latex', prompt: 'Type the velocity of the lift during its first two phases:', target: String.raw`v(t) = \begin{cases} 2t, & 0 \le t \le 2 \\ 4, & 2 < t \le 7.5 \end{cases}`, hint: String.raw`<code>\begin{cases} ... &amp; ... \\ ... &amp; ... \end{cases}</code>` },
        { type: 'text', html: String.raw`<p>In MATLAB a piecewise function is a sum of pieces multiplied by <b>logical masks</b>: <code>(t &lt;= 2)</code> is 1 where the condition holds and 0 elsewhere. Combine conditions with <code>&amp;</code>. The result works on vectors, so <code>fplot</code> and <code>integral</code> accept it.</p>` },
        { type: 'code', caption: 'The lift from the lesson: velocity, plot and total displacement.', editable: true, code: String.raw`T = 7.5;                          % end of the constant-speed phase (s)
v = @(t) (t <= 2).*(2*t) + (t > 2 & t <= T).*4 + (t > T).*(4 - 2*(t - T));
D = integral(v, 0, T + 2)         % total rise, should be 30 m
fplot(v, [0 T+2])
grid on
xlabel('t (s)'), ylabel('v (m/s)')` },
        { type: 'text', html: String.raw`<p>Continuity conditions often produce a <b>polynomial equation</b> for an unknown switching time. <code>roots(p)</code> returns all roots of the polynomial with coefficient vector <code>p</code> (highest power first, zeros for missing powers) as a column — possibly complex. Keep only the real root that makes physical sense.</p><p>Example: a cable car has $v = 0.5t^2$ m/s until time $t_1$, then constant speed $0.5t_1^2$ until $t = 12$ s, and rises 60 m. Then $\tfrac{t_1^3}{6} + \tfrac{t_1^2}{2}(12 - t_1) = 60$, i.e. $t_1^3 - 18t_1^2 + 180 = 0$, and we need $0 \le t_1 \le 12$.</p>` },
        { type: 'code', caption: 'Picking the physically meaningful root.', editable: true, code: String.raw`r = roots([1 -18 0 180])          % note the 0 for the missing t^1 term
ok = abs(imag(r)) < 1e-9 & real(r) >= 0 & real(r) <= 12;
t1 = real(r(ok))
check = t1^3/6 + t1^2/2*(12 - t1)  % should reproduce 60` },
        { type: 'callout', kind: 'matlab', html: String.raw`<p>Always state in the text <i>why</i> you discard the other roots ("negative time", "after the end of the motion"). Graders look for that sentence.</p>` },
        { type: 'matlab', prompt: String.raw`The equation $t^3 - 12t^2 + 150 = 0$ has exactly one root in $[0, 8]$. Find it with <code>roots</code> and store it (as a real number) in <code>t1</code>.`, starter: `r = roots([0]);   % replace [0] by the coefficient vector\nt1 = 0;          % replace 0: pick the real root in [0, 8]`, solution: `r = roots([1 -12 0 150]);\nt1 = real(r(abs(imag(r)) < 1e-9 & real(r) >= 0 & real(r) <= 8));`, checks: [{ var: 't1', value: 'fzero(@(t) t.^3-12*t.^2+150, [4 5])', tol: 1e-8 }, { uses: 'roots' }], hint: String.raw`The coefficient vector is <code>[1 -12 0 150]</code>. Filter with a logical condition on <code>real(r)</code>.` },
        { type: 'matlab', prompt: String.raw`A particle has velocity $v(t) = 2t$ for $0 \le t \le 3$ and $v(t) = 6 - 3(t - 3)$ for $3 < t \le 6$ (m/s). Define <code>v</code> with logical masks and compute the displacement <code>D</code> and the distance travelled <code>S</code> on $[0, 6]$ with <code>integral</code>.`, starter: `v = @(t) 0*t;    % replace by the piecewise velocity\nD = 0;           % displacement with integral\nS = 0;           % distance with integral`, solution: `v = @(t) (t <= 3).*(2*t) + (t > 3).*(6 - 3*(t - 3));\nD = integral(v, 0, 6);\nS = integral(@(t) abs(v(t)), 0, 6);`, checks: [{ var: 'v', isFunction: true }, { var: 'D', value: 13.5, tol: 1e-6 }, { var: 'S', value: 16.5, tol: 1e-5 }, { uses: 'integral' }], hint: String.raw`Distance: integrate <code>abs(v(t))</code>. The velocity changes sign at $t = 5$.` },
      ],
    },
    {
      id: 'arc-length-numeric',
      title: 'Arc length with integral and quad',
      blocks: [
        { type: 'text', html: String.raw`<p>For arc length the workflow is always the same: differentiate by hand, write the integrand $\sqrt{1 + f'(x)^2}$ as an anonymous function, call <code>integral</code>. The older function <code>quad</code> does the same job (adaptive Simpson) and appears in older course material; <code>integral</code> is preferred.</p><p>A hanging chain takes the shape of a <b>catenary</b> $y = a\cosh(x/a)$. Because $1 + \sinh^2 = \cosh^2$, its length is known exactly, $L = 2a\sinh(S/a)$ over $[-S, S]$ — a good test of the numerical method.</p>` },
        { type: 'code', caption: 'Catenary with a = 50 m over a span of 80 m.', editable: true, code: String.raw`a = 50; S = 40;
df = @(x) sinh(x/a);                     % derivative of a*cosh(x/a)
L1 = integral(@(x) sqrt(1 + df(x).^2), -S, S);
L2 = quad(@(x) sqrt(1 + df(x).^2), -S, S);
Lexact = 2*a*sinh(S/a);
fprintf('integral: %.10f\nquad:     %.10f\nexact:    %.10f\n', L1, L2, Lexact)` },
        { type: 'callout', kind: 'warn', html: String.raw`<p>Write <code>df(x).^2</code>, not <code>df(x)^2</code>: <code>integral</code> evaluates the integrand at a whole vector of points at once.</p>` },
        { type: 'matlab', prompt: String.raw`Compute the length <code>L</code> of one arch of $y = \sin x$, $0 \le x \le \pi$, with <code>integral</code>.`, starter: `L = integral(@(x) 0*x, 0, pi);   % replace 0*x by the integrand`, solution: `L = integral(@(x) sqrt(1 + cos(x).^2), 0, pi);`, checks: [{ var: 'L', value: 'integral(@(x) sqrt(1 + cos(x).^2), 0, pi)', tol: 1e-8 }, { uses: 'integral' }] },
        { type: 'matlab', prompt: String.raw`The ellipse $x = 3\cos t$, $y = 2\sin t$, $0 \le t \le 2\pi$, has no elementary circumference formula. Compute its circumference <code>C</code> with the parametric arc-length integral.`, starter: `dx = @(t) 0*t;   % x'(t)\ndy = @(t) 0*t;   % y'(t)\nC = 0;           % circumference with integral`, solution: `dx = @(t) -3*sin(t);\ndy = @(t) 2*cos(t);\nC = integral(@(t) sqrt(dx(t).^2 + dy(t).^2), 0, 2*pi);`, checks: [{ var: 'C', value: 'integral(@(t) sqrt(9*sin(t).^2 + 4*cos(t).^2), 0, 2*pi)', tol: 1e-8 }], hint: String.raw`Speed $\sqrt{x'(t)^2 + y'(t)^2}$ with $x' = -3\sin t$, $y' = 2\cos t$. The answer lies between the circumferences $4\pi$ and $6\pi$ of the inner and outer circles.` },
        { type: 'livescript', caption: 'Model write-up of a numerical arc-length problem', blocks: [
          { type: 'heading', content: 'Example (Attempted)' },
          { type: 'text', content: String.raw`We compute the length of the parabola $y = x^2$ on $[0, 2]$. Since $f'(x) = 2x$, the arc-length formula gives` },
          { type: 'equation', content: String.raw`L = \int_0^2 \sqrt{1 + \left(2x\right)^2}\,\mathrm d x = \int_0^2 \sqrt{1 + 4x^2}\,\mathrm d x .` },
          { type: 'text', content: 'We evaluate the integral numerically with `integral`:' },
          { type: 'code', content: String.raw`L = integral(@(x) sqrt(1 + 4*x.^2), 0, 2);
fprintf('L = %.6f\n', L)` },
          { type: 'text', content: String.raw`The length is $L \approx 4.6468$, slightly more than the chord length $\sqrt{2^2 + 4^2} \approx 4.4721$, as it must be.` },
        ] },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Arc length by hand',
      difficulty: 'core',
      statement: String.raw`<p>The following curves are designed so that $1 + f'(x)^2$ is a perfect square or a simple power.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`For $f(x) = \tfrac23 (x - 1)^{3/2}$, simplify the arc-length integrand $\sqrt{1 + f'(x)^2}$ (as a function of $x$, valid for $x \ge 1$).`, kind: 'expression', variable: 'x', answer: 'sqrt(x)', domain: [1.2, 3.8], hint: String.raw`$f'(x) = (x-1)^{1/2}$.`, solution: String.raw`$f'(x) = (x - 1)^{1/2}$, so $1 + f'(x)^2 = 1 + (x - 1) = x$ and the integrand is $\sqrt x$.` },
        { label: '(b)', prompt: String.raw`Compute the length of this curve for $1 \le x \le 4$.`, kind: 'numeric', answer: '14/3', solution: String.raw`$L = \int_1^4 \sqrt x\,\mathrm d x = \tfrac23\big[x^{3/2}\big]_1^4 = \tfrac23(8 - 1) = \tfrac{14}{3}$.` },
        { label: '(c)', prompt: String.raw`Compute the length of $y = \dfrac{x^3}{6} + \dfrac{1}{2x}$ for $1 \le x \le 2$.`, kind: 'numeric', answer: '17/12', hint: String.raw`Show that $1 + f'^2 = \left(\frac{x^2}{2} + \frac{1}{2x^2}\right)^2$.`, solution: String.raw`$f'(x) = \frac{x^2}{2} - \frac{1}{2x^2}$, so $1 + f'^2 = \frac{x^4}{4} + \frac12 + \frac{1}{4x^4} = \left(\frac{x^2}{2} + \frac{1}{2x^2}\right)^2$. Hence $L = \int_1^2 \left(\frac{x^2}{2} + \frac{1}{2x^2}\right)\mathrm d x = \Big[\frac{x^3}{6} - \frac{1}{2x}\Big]_1^2 = \left(\frac43 - \frac14\right) - \left(\frac16 - \frac12\right) = \frac{17}{12}$.` },
      ],
    },
    {
      id: 'a2',
      title: 'Displacement and distance',
      difficulty: 'core',
      statement: String.raw`<p>A particle moves on a line with velocity $v(t) = t^2 - 5t + 4$ m/s for $0 \le t \le 5$ s.</p>`,
      parts: [
        { label: '(a)', prompt: 'On which time interval does the particle move in the negative direction?', kind: 'choice', choices: [String.raw`$(0, 1)$`, String.raw`$(1, 4)$`, String.raw`$(4, 5)$`, String.raw`$(0, 4)$`], answer: 1, solution: String.raw`$v(t) = (t - 1)(t - 4) < 0$ exactly for $1 < t < 4$.` },
        { label: '(b)', prompt: 'Compute the displacement on $[0, 5]$ (m).', kind: 'numeric', answer: '-5/6', solution: String.raw`With $F(t) = \frac{t^3}{3} - \frac{5t^2}{2} + 4t$: $F(5) - F(0) = \frac{125}{3} - \frac{125}{2} + 20 = -\frac56$ m.` },
        { label: '(c)', prompt: 'Compute the total distance travelled on $[0, 5]$ (m).', kind: 'numeric', answer: '49/6', hint: String.raw`Split at $t = 1$ and $t = 4$.`, solution: String.raw`$F(1) = \frac{11}{6}$, $F(4) = -\frac83$, $F(5) = -\frac56$. Distance $= |F(1) - F(0)| + |F(4) - F(1)| + |F(5) - F(4)| = \frac{11}{6} + \frac{27}{6} + \frac{11}{6} = \frac{49}{6}$ m. Check: <code>integral(@(t) abs(t.^2-5*t+4), 0, 5)</code>.` },
      ],
    },
    {
      id: 'a3',
      title: 'Tram with a switching time',
      difficulty: 'exam',
      hw: 'HW1-style',
      statement: String.raw`<p>A tram starts from rest. Its velocity is $v(t) = 0.02\,t^2$ m/s for $0 \le t \le t_1$; after that the driver holds the speed constant until $t = 90$ s. The velocity is continuous, and the tram travels 900 m during the 90 s.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Find $t_1$ (s).`, kind: 'numeric', answer: 'fzero(@(t) t.^3-135*t.^2+67500, [20 30])', tol: 1e-4, hint: String.raw`Displacement $\int_0^{t_1} 0.02t^2\,\mathrm dt + 0.02t_1^2(90 - t_1) = 900$ leads to a cubic. Which root lies in $[0, 90]$?`, solution: String.raw`$\frac{0.02}{3}t_1^3 + 0.02t_1^2(90 - t_1) = 900$, i.e. $90t_1^2 - \frac23 t_1^3 = 45000$, i.e. $t_1^3 - 135t_1^2 + 67500 = 0$. Its roots are about $-20.8$, $24.74$ and $131.1$; only $t_1 \approx 24.74$ s lies in $[0, 90]$.` },
        { label: '(b)', prompt: 'What is the cruising speed (m/s)?', kind: 'numeric', answer: '0.02*fzero(@(t) t.^3-135*t.^2+67500, [20 30])^2', tol: 1e-4, solution: String.raw`$v = 0.02\,t_1^2 \approx 12.24$ m/s (about 44 km/h).` },
        { label: '(c)', prompt: String.raw`Is the acceleration continuous at $t = t_1$?`, kind: 'choice', choices: ['Yes, because the velocity is continuous.', String.raw`No: it jumps from $0.04\,t_1 \approx 0.99\ \mathrm{m/s^2}$ to $0$.`, 'Yes, the acceleration is zero on both sides.', 'It cannot be decided from the data.'], answer: 1, solution: String.raw`$a(t) = v'(t) = 0.04t$ for $t < t_1$ and $0$ for $t > t_1$. The one-sided limits $0.04t_1 \approx 0.99$ and $0$ differ.` },
        { label: '(d)', prompt: 'Write the full solution as a Live Script: piecewise velocity with cases, the equation for $t_1$, roots in MATLAB with the choice of root justified, and a plot of $v(t)$.', kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 3 (Attempted)' },
        { type: 'text', content: String.raw`Since the velocity is continuous, the constant speed after $t_1$ equals $0.02t_1^2$. Hence` },
        { type: 'equation', content: String.raw`v(t) = \begin{cases} 0.02\,t^2, & 0 \le t \le t_1, \\ 0.02\,t_1^2, & t_1 < t \le 90. \end{cases}` },
        { type: 'text', content: 'We integrate the velocity over $[0, 90]$ and require the displacement to be 900 m:' },
        { type: 'equation', content: String.raw`\int_0^{t_1} 0.02\,t^2\,\mathrm d t + \int_{t_1}^{90} 0.02\,t_1^2\,\mathrm d t = \frac{0.02}{3}t_1^3 + 0.02\,t_1^2\left(90 - t_1\right) = 900 .` },
        { type: 'text', content: String.raw`Multiplying by $75$ and rearranging gives the cubic equation` },
        { type: 'equation', content: String.raw`t_1^3 - 135\,t_1^2 + 67500 = 0 .` },
        { type: 'text', content: 'We solve it with `roots` and keep the root in $[0, 90]$:' },
        { type: 'code', content: String.raw`r = roots([1 -135 0 67500])
t1 = real(r(abs(imag(r)) < 1e-9 & real(r) >= 0 & real(r) <= 90))
vmax = 0.02*t1^2` },
        { type: 'text', content: String.raw`The negative root is not a time after the start and the root near 131 s is after the end of the motion, so $t_1 \approx 24.74$ s, and the cruising speed is $0.02t_1^2 \approx 12.24$ m/s. We check the displacement numerically and plot the velocity:` },
        { type: 'code', content: String.raw`v = @(t) (t <= t1).*(0.02*t.^2) + (t > t1).*(0.02*t1^2);
D = integral(v, 0, 90)
fplot(v, [0 90]), grid on
xlabel('t (s)'), ylabel('v (m/s)')` },
        { type: 'text', content: String.raw`The acceleration is $a(t) = 0.04t$ for $t < t_1$ and $0$ for $t > t_1$. At $t_1$ it jumps from about $0.99\ \mathrm{m/s^2}$ to $0$, so it is **not** continuous, although the velocity is.` },
      ],
    },
    {
      id: 'a4',
      title: 'Work, mass and centre of mass',
      difficulty: 'core',
      statement: String.raw`<p>Set up each quantity as an integral and evaluate it.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`A spring with $k = 400$ N/m is stretched from $0.1$ m to $0.3$ m beyond its natural length. How much work (J) is done?`, kind: 'numeric', answer: '16', solution: String.raw`$W = \int_{0.1}^{0.3} 400x\,\mathrm d x = 200\left(0.3^2 - 0.1^2\right) = 16$ J.` },
        { label: '(b)', prompt: String.raw`A rod occupies $0 \le x \le 2$ m and has line density $\rho(x) = 3 + 2x$ kg/m. Find its mass (kg).`, kind: 'numeric', answer: '10', solution: String.raw`$m = \int_0^2 (3 + 2x)\,\mathrm d x = 6 + 4 = 10$ kg.` },
        { label: '(c)', prompt: String.raw`Find the centre of mass $\bar x$ (m) of the rod.`, kind: 'numeric', answer: '17/15', solution: String.raw`$\int_0^2 x(3 + 2x)\,\mathrm d x = 6 + \frac{16}{3} = \frac{34}{3}$, so $\bar x = \frac{34/3}{10} = \frac{17}{15} \approx 1.133$ m.` },
        { label: '(d)', prompt: String.raw`A force $F(x) = 50\,x\,e^{-x}$ N acts along the $x$-axis. Compute the work (J) done from $x = 0$ to $x = 3$ m. (Use <code>integral</code>, or integrate by parts.)`, kind: 'numeric', answer: '50*(1 - 4*exp(-3))', tol: 1e-5, solution: String.raw`$W = 50\int_0^3 x e^{-x}\,\mathrm d x = 50\big[-(x + 1)e^{-x}\big]_0^3 = 50\left(1 - 4e^{-3}\right) \approx 40.04$ J.` },
      ],
    },
    {
      id: 'a5',
      title: 'Surfaces, parametric curves and a corrugated sheet',
      difficulty: 'challenge',
      statement: String.raw`<p>Surface area, parametric length and a numerical arc length.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`The curve $y = \sqrt x$, $0 \le x \le 2$, is rotated about the $x$-axis. Compute the area of the resulting surface.`, kind: 'numeric', answer: '13*pi/3', hint: String.raw`$f\sqrt{1 + f'^2} = \sqrt{x}\sqrt{1 + \frac{1}{4x}} = \sqrt{x + \frac14}$.`, solution: String.raw`$S = 2\pi\int_0^2 \sqrt{x + \tfrac14}\,\mathrm d x = \frac{4\pi}{3}\Big[\left(x + \tfrac14\right)^{3/2}\Big]_0^2 = \frac{4\pi}{3}\left(\frac{27}{8} - \frac18\right) = \frac{13\pi}{3}$.` },
        { label: '(b)', prompt: String.raw`Compute the length of the curve $x = t^2$, $y = t^3$, $0 \le t \le 1$.`, kind: 'numeric', answer: '(13*sqrt(13) - 8)/27', hint: String.raw`The speed is $\sqrt{4t^2 + 9t^4} = t\sqrt{4 + 9t^2}$; substitute $u = 4 + 9t^2$.`, solution: String.raw`$L = \int_0^1 t\sqrt{4 + 9t^2}\,\mathrm d t = \frac{1}{27}\Big[(4 + 9t^2)^{3/2}\Big]_0^1 = \frac{13\sqrt{13} - 8}{27} \approx 1.4397$.` },
        { label: '(c)', prompt: String.raw`A corrugated roofing sheet has the profile $y = 0.02\sin(20\pi x)$ (metres), i.e. amplitude 2 cm and wavelength 10 cm. How long a flat sheet (m) is needed to produce 1 m of corrugated width? Use <code>integral</code>.`, kind: 'numeric', answer: 'integral(@(x) sqrt(1+(0.4*pi*cos(20*pi*x)).^2), 0, 1)', tol: 1e-5, hint: String.raw`$f'(x) = 0.02\cdot 20\pi\cos(20\pi x) = 0.4\pi\cos(20\pi x)$.`, solution: String.raw`$L = \int_0^1 \sqrt{1 + \left(0.4\pi\cos(20\pi x)\right)^2}\,\mathrm d x \approx 1.3207$ m: the sheet must be about 32 % wider than the roof it covers.` },
      ],
    },
  ],
};
