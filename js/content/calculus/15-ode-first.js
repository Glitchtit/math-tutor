// Module 15: First-order differential equations

export default {
  id: 'ode-first',
  number: 15,
  part: 'odes',
  hw: 'HW3',
  title: 'First-order differential equations',
  summary: 'What an ODE and a solution are; slope fields and Euler\'s method; separable equations (explicit and implicit solutions, initial conditions); linear equations with an integrating factor; existence and uniqueness; slope fields with meshgrid + quiver and numerical solutions with ode45.',
  intro: String.raw`<p>A <b>differential equation</b> relates an unknown function to its derivatives. It is the natural language of change: the rate at which a tank drains, a capacitor charges or a population grows depends on the current state. This module shows a first-order equation $y' = F(x, y)$ three ways — as a field of slopes you can follow with your finger, as a step-by-step numerical recipe, and as a formula obtained by separating variables or with an integrating factor — and how to do all three in MATLAB.</p>`,
  lessons: [
    {
      id: 'slope-fields',
      title: 'ODEs, solutions and slope fields',
      blocks: [
        { type: 'text', html: String.raw`<p>The equation $y' = x - y$ prescribes, at every point $(x, y)$ of the plane, the slope that a solution curve passing through that point must have. Drawing a short segment with that slope at many points gives the <b>slope field</b>. Click anywhere to start a solution curve there: it follows the segments like a leaf on a stream.</p>` },
        { type: 'widget', name: 'slopefield', config: {
          title: "Slope field of y' = x − y",
          F: 'x - y', initial: [[0, 1], [0, -2], [-2, 3]],
          xlim: [-3, 4], ylim: [-4, 4],
          hint: String.raw`Click to add solution curves. Every curve approaches the line $y = x - 1$ (itself a solution) as $x$ grows.`,
        } },
        { type: 'callout', kind: 'def', title: 'Vocabulary', html: String.raw`<ul><li>An <b>ordinary differential equation</b> (ODE) involves an unknown function $y(x)$ of one variable and its derivatives. Its <b>order</b> is the highest derivative that appears.</li><li>A <b>solution</b> on an interval $I$ is a differentiable function that satisfies the equation at every $x \in I$.</li><li>The <b>general solution</b> contains arbitrary constants (one per order). An <b>initial value problem</b> (IVP) adds a condition $y(x_0) = y_0$ that selects one curve.</li><li>The equation is <b>linear</b> if $y$ and its derivatives appear only to the first power, multiplied by functions of $x$: $y' + p(x)y = q(x)$.</li></ul>` },
        { type: 'steps', title: String.raw`Example: verify that $y = x - 1 + Ce^{-x}$ solves $y' = x - y$`, steps: [
          String.raw`We differentiate the candidate: $y' = 1 - Ce^{-x}$.`,
          String.raw`We compute the right-hand side with the same candidate: $x - y = x - (x - 1 + Ce^{-x}) = 1 - Ce^{-x}$.`,
          String.raw`Both sides agree for every $x$ and every constant $C$, so this is a one-parameter family of solutions. $C = 0$ gives the straight-line solution $y = x - 1$ visible in the slope field.`,
          String.raw`For the IVP $y(0) = 1$: $1 = 0 - 1 + C$, so $C = 2$ and $y = x - 1 + 2e^{-x}$.`,
        ] },
        { type: 'callout', kind: 'key', html: String.raw`<p>Reading a slope field: where $F(x, y) = 0$ the segments are horizontal (the <b>nullcline</b>, here $y = x$). If $F$ depends only on $y$ (an <b>autonomous</b> equation), segments are the same along every horizontal line, and zeros of $F(y)$ are constant <b>equilibrium</b> solutions.</p>` },
        { type: 'quiz', question: String.raw`Which function solves $y' = 2y$, $y(0) = 3$?`, choices: [String.raw`$y = 3 + 2x$`, String.raw`$y = 3e^{2x}$`, String.raw`$y = e^{2x} + 2$`, String.raw`$y = 2e^{3x}$`], answer: 1, explain: String.raw`$(3e^{2x})' = 6e^{2x} = 2\cdot 3e^{2x}$ and $3e^0 = 3$. The third option satisfies the initial condition but $y' = 2e^{2x} \ne 2y$.` },
        { type: 'quiz', question: String.raw`What is the order of $y''' + x\,(y')^4 = \sin y$, and is it linear?`, choices: ['order 3, linear', 'order 3, nonlinear', 'order 4, nonlinear', 'order 4, linear'], answer: 1, explain: String.raw`The highest derivative is $y'''$ (order 3). The power $(y')^4$ and $\sin y$ make it nonlinear; the exponent 4 is not the order.` },
      ],
    },
    {
      id: 'euler',
      title: "Euler's method",
      blocks: [
        { type: 'text', html: String.raw`<p>Following the slope field with finite steps is <b>Euler's method</b>: from the current point, walk a step $h$ along the tangent line, then read the new slope. Increase the number of steps $n$ and watch the polygon approach the exact solution of $y' = x + y$, $y(0) = 1$.</p>` },
        { type: 'widget', name: 'euler', config: {
          title: "Euler's method for y' = x + y, y(0) = 1",
          F: 'x + y', x0: 0, y0: 1, xEnd: 1, exact: '2*exp(x) - x - 1',
          xlim: [-0.1, 1.1], ylim: [0.5, 4],
        } },
        { type: 'callout', kind: 'def', title: "Euler's method", html: String.raw`<p>For $y' = F(x, y)$, $y(x_0) = y_0$ and step $h$:
$$x_{n+1} = x_n + h, \qquad y_{n+1} = y_n + h\,F(x_n, y_n).$$
The global error at a fixed end point is proportional to $h$ (a <b>first-order</b> method): halving $h$ roughly halves the error. MATLAB's <code>ode45</code> is a fifth-order method with adaptive step size.</p>` },
        { type: 'steps', title: String.raw`Example: two Euler steps for $y' = x + y$, $y(0) = 1$, $h = 0.5$`, steps: [
          String.raw`First step from $(x_0, y_0) = (0, 1)$: the slope is $F(0, 1) = 1$, so $y_1 = 1 + 0.5\cdot 1 = 1.5$ at $x_1 = 0.5$.`,
          String.raw`Second step from $(0.5, 1.5)$: the slope is $F(0.5, 1.5) = 2$, so $y_2 = 1.5 + 0.5\cdot 2 = 2.5$ at $x_2 = 1$.`,
          String.raw`The exact solution is $y = 2e^x - x - 1$ (check: $y' = 2e^x - 1 = x + y$), so $y(1) = 2e - 2 \approx 3.437$. The error $0.94$ is large because $h$ is large and the solution is convex: Euler's tangent lines always fall below it.`,
        ] },
        { type: 'quiz', question: String.raw`With $h = 0.1$ Euler's method has error $0.25$ at $x = 1$. Roughly what error do you expect with $h = 0.025$?`, choices: ['0.25', '0.125', '0.0625', '0.016'], answer: 2, explain: String.raw`First-order method: error $\propto h$. Dividing $h$ by 4 divides the error by about 4.` },
      ],
    },
    {
      id: 'separable',
      title: 'Separable equations',
      blocks: [
        { type: 'text', html: String.raw`<p>The slope field of $y' = -2xy$ is symmetric and every solution curve is a bell shape. The formula comes from <b>separating the variables</b>: all $y$ on one side, all $x$ on the other.</p>` },
        { type: 'widget', name: 'slopefield', config: {
          title: "y' = −2xy: solutions y = C e^(−x²)",
          F: '-2*x.*y', initial: [[0, 3], [0, 1], [0, -2]],
          xlim: [-3, 3], ylim: [-3.5, 3.5],
          hint: String.raw`Click to add curves. $y = 0$ is also a solution — the one lost when dividing by $y$.`,
        } },
        { type: 'callout', kind: 'def', title: 'Separable equation', html: String.raw`<p>An equation of the form $\dfrac{\mathrm d y}{\mathrm d x} = g(x)\,h(y)$. Where $h(y) \ne 0$:
$$\int \frac{\mathrm d y}{h(y)} = \int g(x)\,\mathrm d x + C .$$
The result is often an <b>implicit</b> solution $H(y) = G(x) + C$; solve for $y$ when possible. Every zero $y = y^*$ of $h$ gives a <b>constant solution</b> that division by $h(y)$ loses.</p>` },
        { type: 'steps', title: String.raw`Example: $y' = -2xy$, $y(0) = 3$`, steps: [
          String.raw`We separate the variables (for $y \ne 0$): $\dfrac{\mathrm d y}{y} = -2x\,\mathrm d x$.`,
          String.raw`We integrate both sides: $\ln|y| = -x^2 + C_1$, so $|y| = e^{C_1}e^{-x^2}$ and $y = Ce^{-x^2}$ with $C = \pm e^{C_1}$. The lost solution $y = 0$ is included as $C = 0$.`,
          String.raw`We apply the initial condition: $3 = Ce^0$, so $y = 3e^{-x^2}$.`,
        ] },
        { type: 'steps', title: String.raw`Example with an implicit solution: $y' = \dfrac{x^2}{1+y^2}$, $y(0) = 1$`, steps: [
          String.raw`We separate: $(1 + y^2)\,\mathrm d y = x^2\,\mathrm d x$. Here $h(y) = 1/(1+y^2)$ never vanishes, so no solutions are lost.`,
          String.raw`We integrate: $y + \dfrac{y^3}{3} = \dfrac{x^3}{3} + C$.`,
          String.raw`The initial condition gives $1 + \tfrac13 = C$, so the solution is given implicitly by
$$3y + y^3 = x^3 + 4 .$$
Solving the cubic for $y$ is possible but unhelpful; the implicit form is an acceptable answer. To evaluate, e.g., $y(1)$, solve $3y + y^3 = 5$ numerically: <code>fzero(@(y) 3*y + y.^3 - 5, 1)</code> gives $y \approx 1.154$.`,
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>Keep the constant in the right place. From $\ln|y| = x^2 + C$ we get $y = Ae^{x^2}$, <b>not</b> $y = e^{x^2} + C$. And when you take a square root, as in $y^2 = 2x + 4$, the initial condition decides the sign: $y(0) = -2$ gives $y = -\sqrt{2x+4}$.</p>` },
        { type: 'quiz', question: String.raw`Which equation is <b>not</b> separable?`, choices: [String.raw`$y' = e^{x+y}$`, String.raw`$y' = x y^2 + x$`, String.raw`$y' = \sin(xy)$`, String.raw`$x y' = y \ln x$`], answer: 2, explain: String.raw`$e^{x+y} = e^x e^y$, $xy^2 + x = x(y^2+1)$ and $y' = y\ln x/x$ all factor as $g(x)h(y)$; $\sin(xy)$ does not.` },
      ],
    },
    {
      id: 'linear',
      title: 'Linear equations and integrating factors',
      blocks: [
        { type: 'text', html: String.raw`<p>The linear equation $y' + a y = \cos t$ models a first-order system (an RC filter, a thermometer) driven by a periodic input. Change the time constant $1/a$: after a transient, every solution settles to the same oscillation, with amplitude $1/\sqrt{1+a^2}$.</p>` },
        { type: 'widget', name: 'ode', config: {
          title: "y' + a y = cos t, y(0) = 2",
          F: '-a*y + cos(t)', params: { a: { min: 0.2, max: 3, value: 1, label: '$a$' } },
          y0: 2, tspan: [0, 15], ylim: [-2, 3], slopeField: true,
          readout: String.raw`Steady-state amplitude $1/\sqrt{1+a^2} = {{1/sqrt(1+a^2)}}$; the transient decays like $e^{-at}$ with time constant $1/a = {{1/a}}$.`,
        } },
        { type: 'callout', kind: 'thm', title: 'Integrating factor', html: String.raw`<p>Write the equation in <b>standard form</b> $y' + p(x)\,y = q(x)$ (divide by the coefficient of $y'$ first). Multiply by
$$\mu(x) = e^{\int p(x)\,\mathrm d x} .$$
Then the left side is an exact derivative, $(\mu y)' = \mu y' + \mu p y$, so
$$(\mu y)' = \mu q \quad\Longrightarrow\quad y = \frac{1}{\mu(x)}\Big(\int \mu(x) q(x)\,\mathrm d x + C\Big).$$
Any antiderivative of $p$ will do; the constant of integration in $\mu$ is not needed.</p>` },
        { type: 'steps', title: String.raw`Example: $y' + 2xy = x$, $y(0) = 2$`, steps: [
          String.raw`The equation is already in standard form with $p(x) = 2x$, so the integrating factor is $\mu = e^{\int 2x\,\mathrm d x} = e^{x^2}$.`,
          String.raw`Multiplying by $\mu$ turns the left side into a derivative: $\big(e^{x^2}y\big)' = x e^{x^2}$.`,
          String.raw`We integrate (substitution $u = x^2$): $e^{x^2}y = \tfrac12 e^{x^2} + C$, so $y = \tfrac12 + Ce^{-x^2}$.`,
          String.raw`The initial condition gives $2 = \tfrac12 + C$, so $y = \tfrac12 + \tfrac32 e^{-x^2}$. (This equation is also separable: $y' = x(1 - 2y)$.)`,
        ] },
        { type: 'steps', title: String.raw`Example: $x y' - y = x^3$, $y(1) = 0$, for $x > 0$`, steps: [
          String.raw`We divide by $x$ to reach standard form: $y' - \dfrac{1}{x}y = x^2$, so $p(x) = -1/x$.`,
          String.raw`The integrating factor is $\mu = e^{-\ln x} = \dfrac1x$ (for $x > 0$), and $\Big(\dfrac{y}{x}\Big)' = \dfrac1x\cdot x^2 = x$.`,
          String.raw`We integrate: $\dfrac yx = \dfrac{x^2}{2} + C$, so $y = \dfrac{x^3}{2} + Cx$.`,
          String.raw`From $y(1) = 0$: $C = -\tfrac12$, hence $y = \dfrac{x^3 - x}{2}$.`,
        ] },
        { type: 'callout', kind: 'thm', title: 'Existence and uniqueness', html: String.raw`<p>If $F$ and $\partial F/\partial y$ are continuous in a rectangle around $(x_0, y_0)$, the IVP $y' = F(x, y)$, $y(x_0) = y_0$ has exactly one solution on some interval around $x_0$. For a <b>linear</b> equation with $p, q$ continuous on an interval $I \ni x_0$, the solution exists and is unique on all of $I$ — e.g. in the second example $p = -1/x$ is continuous on $(0, \infty)$, so the solution lives there.</p><p>Without the hypothesis uniqueness can fail: $y' = y^{1/3}$, $y(0) = 0$ is solved by $y = 0$ and by $y = \big(\tfrac{2x}{3}\big)^{3/2}$ ($x \ge 0$). Here $\partial F/\partial y = \tfrac13 y^{-2/3}$ is unbounded at $y = 0$.</p>` },
        { type: 'quiz', question: String.raw`What is the integrating factor for $x^2 y' + 4x y = e^x$ ($x > 0$)?`, choices: [String.raw`$e^{4x}$`, String.raw`$x^4$`, String.raw`$e^{2x^2}$`, String.raw`$x^2$`], answer: 1, explain: String.raw`Standard form: $y' + \frac{4}{x}y = \frac{e^x}{x^2}$, so $\mu = e^{4\ln x} = x^4$. Forgetting to divide by $x^2$ first leads to the wrong factor $e^{2x^2}$.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'slope-fields-matlab',
      title: 'Slope fields with quiver, and an Euler loop',
      blocks: [
        { type: 'text', html: String.raw`<p>MATLAB draws a direction field with <code>quiver(X, Y, U, V)</code>: at each grid point $(X, Y)$ an arrow with components $(U, V)$. A slope $y' = F$ is the direction $(1, F)$. <code>meshgrid</code> builds the grid. The course uses the following pattern, which scales every segment to the same visual length (relative to the plot ranges) and removes the arrow heads:</p>` },
        { type: 'code', caption: "The course's slope-field pattern for y' = 1/(xy)", editable: true, code: `[x,y] = meshgrid(0.01:0.5:6,0.01:0.5:5);
dy = 1./(x.*y);
dx = 1;
L = sqrt((dx/(x(1,end)-x(1,1)))^2+(dy/(y(end,1)-y(1,1))).^2);
q = quiver(x,y,dx./L,dy./L,0.5);
q.ShowArrowHead = 'off';
q.Marker = '.';` },
        { type: 'table', head: ['Line', 'What it does'], rows: [
          [String.raw`<code>meshgrid(xs, ys)</code>`, 'matrices of the $x$- and $y$-coordinates of all grid points (start at 0.01 to avoid dividing by zero)'],
          [String.raw`<code>dy = 1./(x.*y)</code>`, String.raw`the slope $F(x,y)$ at every grid point — element-wise operators`],
          [String.raw`<code>L = sqrt(...)</code>`, 'length of $(dx, dy)$ measured in units of the plot ranges, so all segments look equally long'],
          [String.raw`<code>quiver(x,y,dx./L,dy./L,0.5)</code>`, 'draw the normalised directions, scaled by 0.5'],
          [String.raw`<code>ShowArrowHead = 'off'</code>, <code>Marker = '.'</code>`, 'segments with a dot at the base point'],
        ] },
        { type: 'text', html: String.raw`<p>To overlay a solution, keep the axes with <code>hold on</code> and plot the formula. Here $y' = x - y$ with the solution $y = x - 1 + 2e^{-x}$ through $(0, 1)$:</p>` },
        { type: 'code', caption: 'Slope field and a solution curve', editable: true, code: `[x,y] = meshgrid(-2:0.4:4, -2:0.4:4);
dy = x - y;
dx = 1;
L = sqrt((dx/(x(1,end)-x(1,1)))^2+(dy/(y(end,1)-y(1,1))).^2);
q = quiver(x,y,dx./L,dy./L,0.5);
q.ShowArrowHead = 'off';
q.Marker = '.';
hold on
fplot(@(x) x - 1 + 2*exp(-x), [-1 4], 'LineWidth', 2)
hold off
xlim([-2 4]), ylim([-2 4])
title("y' = x - y and the solution with y(0) = 1")` },
        { type: 'matlab', prompt: String.raw`Draw the slope field of $y' = -2xy$ on $[-2, 2]\times[-1, 3]$ with the course pattern (<code>meshgrid</code> + <code>quiver</code>), and overlay the solution $y = 3e^{-x^2}$ with <code>hold on</code> and <code>fplot</code>.`, starter: `[x,y] = meshgrid(-2:0.25:2, -1:0.25:3);\ndy = 0*x;   % replace by the slope -2xy (element-wise)\ndx = 1;\nL = sqrt((dx/(x(1,end)-x(1,1)))^2+(dy/(y(end,1)-y(1,1))).^2);\nq = quiver(x,y,dx./L,dy./L,0.5);\nq.ShowArrowHead = 'off';\nq.Marker = '.';\n% add the solution curve here\n`, solution: `[x,y] = meshgrid(-2:0.25:2, -1:0.25:3);\ndy = -2*x.*y;\ndx = 1;\nL = sqrt((dx/(x(1,end)-x(1,1)))^2+(dy/(y(end,1)-y(1,1))).^2);\nq = quiver(x,y,dx./L,dy./L,0.5);\nq.ShowArrowHead = 'off';\nq.Marker = '.';\nhold on\nfplot(@(x) 3*exp(-x.^2), [-2 2], 'LineWidth', 2)\nhold off`, checks: [{ figure: true }, { uses: 'quiver' }, { uses: 'meshgrid' }, { uses: 'fplot', message: 'Overlay the solution curve with fplot.' }] },
        { type: 'text', html: String.raw`<p>Euler's method is a three-line loop. Store the result of each step in a vector if you want to plot the polygon.</p>` },
        { type: 'code', caption: "Euler's method for y' = x + y, y(0) = 1 on [0, 1]", editable: true, code: `F = @(x,y) x + y;
h = 0.25;  N = 4;
x = zeros(1, N+1);  y = zeros(1, N+1);
x(1) = 0;  y(1) = 1;
for n = 1:N
    y(n+1) = y(n) + h*F(x(n), y(n));
    x(n+1) = x(n) + h;
end
plot(x, y, 'o-'), hold on
fplot(@(x) 2*exp(x) - x - 1, [0 1]), hold off
legend('Euler, h = 0.25', 'exact', 'Location', 'northwest')
fprintf('Euler y(1) = %.4f, exact %.4f\\n', y(end), 2*exp(1) - 2)` },
        { type: 'matlab', prompt: String.raw`Run Euler's method for $y' = x + y$, $y(0) = 1$ with $h = 0.1$ up to $x = 1$. Store the final approximation in <code>yN</code>.`, starter: `F = @(x,y) x + y;\nh = 0.1;  N = 10;\nx = 0;  y = 1;\nfor n = 1:N\n    % update y, then x\nend\nyN = y`, solution: `F = @(x,y) x + y;\nh = 0.1;  N = 10;\nx = 0;  y = 1;\nfor n = 1:N\n    y = y + h*F(x, y);\n    x = x + h;\nend\nyN = y`, checks: [{ var: 'yN', value: 3.1874849202, tol: 1e-8, message: 'yN should be about 3.187. Did you update y with the slope at the old x?' }], hint: 'Update y first (using the old x), then increase x by h.' },
      ],
    },
    {
      id: 'ode45-basics',
      title: 'Numerical solutions with ode45',
      blocks: [
        { type: 'text', html: String.raw`<p><code>ode45</code> solves $y' = F(t, y)$, $y(t_0) = y_0$ on $[t_0, t_f]$:</p><p style="text-align:center"><code>[t, y] = ode45(@(t,y) F, [t0 tf], y0);</code></p><p>The right-hand side must be a function of <b>both</b> <code>t</code> and <code>y</code> (in that order) even if one is unused. The outputs are column vectors of the times chosen by the solver and the solution values; <code>y(end)</code> is the value at $t_f$.</p>` },
        { type: 'code', caption: "ode45 for y' = t − y, y(0) = 1, compared with the exact solution", editable: true, code: `[t, y] = ode45(@(t,y) t - y, [0 3], 1);
plot(t, y, 'o'), hold on
fplot(@(t) t - 1 + 2*exp(-t), [0 3]), hold off
legend('ode45', 'exact', 'Location', 'northwest')
yEnd = y(end)
exact = 3 - 1 + 2*exp(-3)` },
        { type: 'text', html: String.raw`<p>To read the solution at particular times, pass them in the time vector: <code>ode45(..., [0 0.5 1 2 3], y0)</code> returns exactly those times. Alternatively keep the solution structure and evaluate it with <code>deval</code>. (Desktop MATLAB also offers <code>interp1(t, y, 1.5)</code>.)</p>` },
        { type: 'code', caption: 'Values at chosen times', editable: true, code: `[t, y] = ode45(@(t,y) t - y, [0 0.5 1 2 3], 1);
[t y]
sol = ode45(@(t,y) t - y, [0 3], 1);
y15 = deval(sol, 1.5)` },
        { type: 'callout', kind: 'matlab', title: 'Accuracy', html: String.raw`<p>The default relative tolerance of <code>ode45</code> is $10^{-3}$. For a check against a hand calculation to more digits, tighten it: <code>opts = odeset('RelTol', 1e-8, 'AbsTol', 1e-10); [t, y] = ode45(F, tspan, y0, opts);</code></p>` },
        { type: 'matlab', prompt: String.raw`Solve $y' = y\cos t$, $y(0) = 1$ on $[0, 3]$ with <code>ode45</code> and store $y(3)$ in <code>y3</code>. Compare with the separable-equation answer $y = e^{\sin t}$ by storing <code>err = abs(y3 - exp(sin(3)))</code>.`, starter: `[t, y] = ode45(@(t,y) 0*y, [0 3], 1);   % replace 0*y by the right-hand side\ny3 = 0;    % replace 0 by the last value of y\nerr = abs(y3 - exp(sin(3)))`, solution: `[t, y] = ode45(@(t,y) y.*cos(t), [0 3], 1);\ny3 = y(end);\nerr = abs(y3 - exp(sin(3)))`, checks: [{ var: 'y3', value: 'exp(sin(3))', tol: 1e-3 }, { var: 'err', value: 0, tol: 1e-3 }, { uses: 'ode45' }] },
        { type: 'matlab', prompt: String.raw`The IVP $x y' - y = x^3$, $y(1) = 0$ has the solution $y = (x^3 - x)/2$. Rewrite it as $y' = F(x, y)$, solve it with <code>ode45</code> on $[1, 3]$ using <code>odeset('RelTol', 1e-8, 'AbsTol', 1e-10)</code>, and store $y(3)$ in <code>y3</code> (exact: $12$).`, starter: `opts = odeset('RelTol', 1e-8, 'AbsTol', 1e-10);\nF = @(x,y) 0*y;    % replace by (x^3 + y)/x, element-wise\n[x, y] = ode45(F, [1 3], 0, opts);\ny3 = y(end)`, solution: `opts = odeset('RelTol', 1e-8, 'AbsTol', 1e-10);\nF = @(x,y) (x.^3 + y)./x;\n[x, y] = ode45(F, [1 3], 0, opts);\ny3 = y(end)`, checks: [{ var: 'y3', value: 12, tol: 1e-6 }, { uses: 'ode45' }], hint: String.raw`Solve $x y' - y = x^3$ for $y'$: $y' = (x^3 + y)/x$.` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Solutions and equilibria',
      difficulty: 'core',
      statement: String.raw`<p>Basic vocabulary and checks.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`What is the order of $\;y''' + y\,y' = \sin x$?`, kind: 'numeric', answer: '3', solution: String.raw`The highest derivative is $y'''$.` },
        { label: '(b)', prompt: String.raw`$y = Ce^{-3x} + 2$ solves $y' = 6 - 3y$. Find $C$ for the initial condition $y(0) = 5$.`, kind: 'numeric', answer: '3', solution: String.raw`Check: $y' = -3Ce^{-3x}$ and $6 - 3y = -3Ce^{-3x}$. Then $y(0) = C + 2 = 5$ gives $C = 3$.` },
        { label: '(c)', prompt: String.raw`What is the equilibrium (constant) solution of $y' = 6 - 3y$, and what do other solutions do as $x \to \infty$?`, kind: 'choice', choices: [String.raw`$y = 2$; all solutions approach it`, String.raw`$y = 2$; all solutions move away from it`, String.raw`$y = 6$; all solutions approach it`, String.raw`$y = 0$; all solutions approach it`], answer: 0, solution: String.raw`$6 - 3y = 0$ at $y = 2$. Since $Ce^{-3x} \to 0$, every solution tends to 2 (a stable equilibrium): above 2 the slope is negative, below 2 positive.` },
        { label: '(d)', prompt: 'Which equation is linear in $y$?', kind: 'choice', choices: [String.raw`$y' = y^2 + x$`, String.raw`$y' + x^2 y = \sin x$`, String.raw`$y\,y' = x$`, String.raw`$y' = \sin y$`], answer: 1, solution: String.raw`Only $y' + x^2 y = \sin x$ has $y$ and $y'$ to the first power with coefficients depending on $x$ alone.` },
      ],
    },
    {
      id: 'a2',
      title: "Euler's method by hand",
      difficulty: 'core',
      statement: String.raw`<p>Consider $y' = xy + 1$, $y(0) = 1$. Approximate $y(1)$ with Euler's method.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Use $h = 0.5$ (two steps).`, kind: 'numeric', answer: '2.375', tol: 1e-6, solution: String.raw`$y_1 = 1 + 0.5(0\cdot1 + 1) = 1.5$; $y_2 = 1.5 + 0.5(0.5\cdot1.5 + 1) = 1.5 + 0.875 = 2.375$.` },
        { label: '(b)', prompt: String.raw`Use $h = 0.25$ (four steps). Give at least four decimals.`, kind: 'numeric', answer: '2.6551513671875', tol: 1e-5, solution: String.raw`$y_1 = 1.25$, $y_2 = 1.578125$, $y_3 = 2.025390625$, $y_4 = 2.025390625 + 0.25(0.75\cdot 2.025390625 + 1) \approx 2.65515$.` },
        { label: '(c)', prompt: String.raw`The true value is $y(1) \approx 3.0594$. By roughly what factor did the error shrink from (a) to (b)?`, kind: 'choice', choices: ['about 1 (no improvement)', 'about 2', 'about 4', 'about 16'], answer: 1, solution: String.raw`Errors $3.0594 - 2.375 \approx 0.68$ and $3.0594 - 2.655 \approx 0.40$: a factor of about $1.7$, i.e. roughly $2$, as expected for a first-order method when $h$ is halved.` },
      ],
    },
    {
      id: 'a3',
      title: 'A separable IVP with a slope field',
      difficulty: 'core',
      hw: 'HW3-style',
      statement: String.raw`<p>Consider the initial value problem $\;e^{x}\,y\,y' = 1,\quad y(0) = 2.$</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Solve the IVP. Enter $y(x)$.`, kind: 'expression', variable: 'x', answer: 'sqrt(6 - 2*exp(-x))', hint: String.raw`Separate: $y\,\mathrm d y = e^{-x}\,\mathrm d x$.`, solution: String.raw`$\int y\,\mathrm d y = \int e^{-x}\,\mathrm d x$ gives $\tfrac12 y^2 = -e^{-x} + C$. From $y(0) = 2$: $2 = -1 + C$, $C = 3$. So $y^2 = 6 - 2e^{-x}$ and, since $y(0) > 0$, $y = \sqrt{6 - 2e^{-x}}$.` },
        { label: '(b)', prompt: String.raw`Compute $y(1)$.`, kind: 'numeric', answer: 'sqrt(6 - 2*exp(-1))', solution: String.raw`$y(1) = \sqrt{6 - 2/e} \approx 2.2944$.` },
        { label: '(c)', prompt: String.raw`Compute $\lim_{x\to\infty} y(x)$.`, kind: 'numeric', answer: 'sqrt(6)', solution: String.raw`$e^{-x} \to 0$, so $y \to \sqrt 6$.` },
        { label: '(d)', prompt: String.raw`The solution exists on an interval $(x_*, \infty)$. Find the left end point $x_*$.`, kind: 'numeric', answer: '-log(3)', hint: 'Where does the expression under the root vanish? There $y = 0$ and $y\' = e^{-x}/y$ blows up.', solution: String.raw`$6 - 2e^{-x} > 0 \iff e^{-x} < 3 \iff x > -\ln 3$. At $x = -\ln 3$ the solution reaches $y = 0$, where $y' = e^{-x}/y$ is undefined.` },
        { label: '(e)', prompt: String.raw`Write a Live Script answer: the separation of variables, a slope field of $y' = e^{-x}/y$ on $[-1, 4]\times(0, 4]$ with the course <code>quiver</code> pattern, and the solution curve on top.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 3 (Attempted)' },
        { type: 'text', content: 'We write the equation in the form $y\' = g(x)h(y)$. Dividing by $e^x y$ (with $y \\ne 0$) gives $y\' = \\frac{e^{-x}}{y}$, which is separable. We separate the variables and integrate:' },
        { type: 'equation', content: String.raw`\int y\,\mathrm d y = \int e^{-x}\,\mathrm d x \quad\Longrightarrow\quad \frac{y^2}{2} = -e^{-x} + C .` },
        { type: 'text', content: 'We apply the initial condition $y(0) = 2$: $2 = -1 + C$, so $C = 3$ and $y^2 = 6 - 2e^{-x}$. Since $y(0) = 2 > 0$ we take the positive root:' },
        { type: 'equation', content: String.raw`y(x) = \sqrt{6 - 2e^{-x}}, \qquad x > -\ln 3 .` },
        { type: 'text', content: 'We draw the slope field of $y\' = e^{-x}/y$ with the solution curve on top. The grid starts at $y = 0.01$ to avoid division by zero.' },
        { type: 'code', content: "[x,y] = meshgrid(-1:0.25:4, 0.01:0.25:4);\ndy = exp(-x)./y;\ndx = 1;\nL = sqrt((dx/(x(1,end)-x(1,1)))^2+(dy/(y(end,1)-y(1,1))).^2);\nq = quiver(x,y,dx./L,dy./L,0.5);\nq.ShowArrowHead = 'off';\nq.Marker = '.';\nhold on\nfplot(@(x) sqrt(6 - 2*exp(-x)), [-1 4], 'LineWidth', 2)\nplot(0, 2, 'o')\nhold off\nxlim([-1 4]), ylim([0 4])\ntitle(\"y' = e^{-x}/y,  y(0) = 2\")" },
        { type: 'text', content: 'The curve follows the field and levels off towards $\\sqrt 6 \\approx 2.449$, in agreement with the formula.' },
      ],
    },
    {
      id: 'a4',
      title: 'A linear IVP, by hand and with ode45',
      difficulty: 'challenge',
      hw: 'HW3-style',
      statement: String.raw`<p>Consider $\;x\,y' + 3y = x^2,\quad y(1) = 1$, for $x > 0$.</p>`,
      parts: [
        { label: '(a)', prompt: 'Which integrating factor do you use?', kind: 'choice', choices: [String.raw`$e^{3x}$`, String.raw`$x^3$`, String.raw`$e^{3x^2/2}$`, String.raw`$3\ln x$`], answer: 1, solution: String.raw`Standard form $y' + \frac3x y = x$, so $\mu = e^{\int 3/x\,\mathrm d x} = e^{3\ln x} = x^3$.` },
        { label: '(b)', prompt: String.raw`Enter the solution $y(x)$.`, kind: 'expression', variable: 'x', answer: 'x.^2/5 + 4./(5*x.^3)', solution: String.raw`$(x^3 y)' = x^4$, so $x^3 y = \frac{x^5}{5} + C$ and $y = \frac{x^2}{5} + \frac{C}{x^3}$. $y(1) = \frac15 + C = 1$ gives $C = \frac45$.` },
        { label: '(c)', prompt: String.raw`Compute $y(2)$ exactly.`, kind: 'numeric', answer: '9/10', solution: String.raw`$y(2) = \frac45 + \frac{4}{40} = 0.9$. An <code>ode45</code> check: <code>[x,y] = ode45(@(x,y) x - 3*y./x, [1 2], 1); y(end)</code>.` },
        { label: '(d)', prompt: 'On which interval is the solution guaranteed to exist and be unique?', kind: 'choice', choices: [String.raw`$\mathbb R$`, String.raw`$(0, \infty)$`, String.raw`$[1, \infty)$`, String.raw`$(-\infty, 0)$`], answer: 1, solution: String.raw`$p(x) = 3/x$ and $q(x) = x$ are continuous on $(0, \infty)$, which contains $x_0 = 1$. (Indeed $y$ blows up at $x = 0$.)` },
      ],
    },
    {
      id: 'a5',
      title: 'When uniqueness fails',
      difficulty: 'challenge',
      statement: String.raw`<p>Consider $y' = 3y^{2/3}$, where $y^{2/3} = \big(\sqrt[3]{y}\big)^2 \ge 0$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Does the existence and uniqueness theorem guarantee a unique solution with $y(0) = 0$?`, kind: 'choice', choices: [String.raw`Yes: $F$ is continuous`, String.raw`No: $\partial F/\partial y = 2y^{-1/3}$ is not continuous at $y = 0$`, 'No: $F$ is not continuous at $y = 0$'], answer: 1, solution: String.raw`$F(y) = 3y^{2/3}$ is continuous, which gives existence, but $\partial F/\partial y = 2y^{-1/3}$ is unbounded near $y = 0$, so uniqueness is not guaranteed.` },
        { label: '(b)', prompt: String.raw`Which functions solve the IVP $y(0) = 0$?`, kind: 'choice', choices: [String.raw`only $y = 0$`, String.raw`only $y = x^3$`, String.raw`both $y = 0$ and $y = x^3$`, 'neither'], answer: 2, solution: String.raw`$y = x^3$: $y' = 3x^2 = 3(x^3)^{2/3}$. And $y = 0$ trivially. Two solutions through the same point.` },
        { label: '(c)', prompt: String.raw`Solve the IVP with $y(0) = 1$ by separation and compute $y(1)$.`, kind: 'numeric', answer: '8', solution: String.raw`$y^{-2/3}\,\mathrm d y = 3\,\mathrm d x$ gives $3y^{1/3} = 3x + C$; $y(0) = 1$ gives $C = 3$, so $y = (x+1)^3$ near $x = 0$ and $y(1) = 8$. (Away from $y = 0$ the theorem applies, so this solution is unique there.)` },
      ],
    },
  ],
};
