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
        { type: 'derive', title: String.raw`Example: verify that $y = x - 1 + Ce^{-x}$ solves $y' = x - y$`, colors: { C: 1, y: 2 }, steps: [
          { kind: 'calculus', label: 'Differentiate the candidate', from: String.raw`y = x - 1 + \T{C-1}{Ce^{-x}}`, to: String.raw`y' = 1 - \T{C-1}{Ce^{-x}}`,
            why: String.raw`We differentiate term by term: $x$ gives $1$, the constant $-1$ gives $0$, and by the chain rule $(Ce^{-x})' = -Ce^{-x}$.` },
          { kind: 'sub', label: String.raw`Put the candidate in for $y$ on the right-hand side`, from: String.raw`x - \T{y-1}{y}\qquad\qquad y = \T{y-2}{x - 1 + Ce^{-x}}`, to: String.raw`x - (\T{y-2}{x - 1 + Ce^{-x}})`, arrows: { 'y-2': 'replace y' },
            why: String.raw`Now we compute the right-hand side with the same candidate. The bracket keeps the whole candidate together behind the minus sign.` },
          { kind: 'expand', label: 'Remove the bracket', from: String.raw`\T{x-1}{x} - (\T{x-2}{x} - \T{n-1}{1} + \T{C-1}{Ce^{-x}})`, to: String.raw`\T{x-1}{x} - \T{x-2}{x} + \T{n-1}{1} - \T{C-1}{Ce^{-x}}`,
            why: String.raw`The minus in front of the bracket multiplies every term inside, so each sign flips.` },
          { kind: 'cancel', label: String.raw`$x - x = 0$`, to: String.raw`\T{n-1}{1} - \T{C-1}{Ce^{-x}}`,
            why: String.raw`$+x$ and $-x$ are equal with opposite signs, so together they are $0$.` },
          { kind: 'result', label: 'Both sides agree', from: String.raw`y' = 1 - Ce^{-x}\qquad\qquad x - y = 1 - Ce^{-x}`, to: String.raw`y' = x - y\quad\text{for every } x \text{ and every } C\ \checkmark`,
            why: String.raw`Both sides agree for every $x$ and every constant $C$, so this is a one-parameter family of solutions. $C = 0$ gives the straight-line solution $y = x - 1$ visible in the slope field.` },
          { kind: 'sub', label: String.raw`Initial condition $y(0) = 1$`, from: String.raw`\T{y-3}{y} = \T{x-3}{x} - 1 + Ce^{-\T{x-4}{x}}\qquad\qquad x = \T{z-1}{0},\ y = \T{o-1}{1}`, to: String.raw`\T{o-1}{1} = \T{z-1}{0} - 1 + Ce^{-\T{z-2}{0}}`,
            map: { 'z-1': ['z-1', 'z-2'] }, arrows: { 'z-1': 'x = 0', 'o-1': 'y = 1' },
            why: String.raw`For the IVP we put $x = 0$ and $y = 1$ into the general solution. Every $x$ gets the same value $0$.` },
          { kind: 'calc', label: String.raw`$e^{0} = 1$`, from: String.raw`1 = 0 - 1 + Ce^{0}`, to: String.raw`1 = \T{m-1}{-1} + \T{C-2}{C}`,
            why: String.raw`Any number to the power $0$ is $1$, so $Ce^{0} = C$.` },
          { kind: 'both', label: String.raw`Both sides $+1$`, to: String.raw`1 \T{m-1}{+ 1} = \T{C-2}{C}`, arrows: { 'm-1': '+1 on both sides' },
            why: String.raw`Adding $1$ to both sides cancels the $-1$ on the right and makes $+1$ appear on the left. That is why the sign flips.` },
          { kind: 'calc', label: String.raw`$1 + 1 = 2$`, to: String.raw`\T{C-2}{C} = 2`, why: String.raw`Now $C$ stands alone.` },
          { kind: 'result', label: String.raw`Put $C = 2$ into the general solution`, from: String.raw`y = x - 1 + \T{C-3}{C}e^{-x}\qquad\qquad C = \T{t-1}{2}`, to: String.raw`y = x - 1 + \T{t-1}{2}e^{-x}`, arrows: { 't-1': 'C = 2' },
            why: String.raw`This is the one curve of the family that passes through $(0, 1)$.` },
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
        { type: 'derive', title: String.raw`Example: two Euler steps for $y' = x + y$, $y(0) = 1$, $h = 0.5$`, colors: { x: 1, y: 2, h: 3, s: 4 }, steps: [
          { kind: 'sub', label: String.raw`Slope at $(x_0, y_0) = (0, 1)$`, from: String.raw`F(x, y) = \T{x-1}{x} + \T{y-1}{y}`, to: String.raw`F(0, 1) = \T{x-1}{0} + \T{y-1}{1} = 1`,
            why: String.raw`First step from $(x_0, y_0) = (0, 1)$: we put the point into $F$ to read the slope there.` },
          { kind: 'sub', label: 'First Euler step', from: String.raw`y_1 = \T{y-1}{y_0} + \T{h-1}{h}\,\T{s-1}{F(x_0, y_0)}`, to: String.raw`y_1 = \T{y-1}{1} + \T{h-1}{0.5}\cdot\T{s-1}{1}`,
            why: String.raw`We walk a step $h = 0.5$ along the tangent line: new height = old height + step $\times$ slope.` },
          { kind: 'calc', label: String.raw`$1 + 0.5 = 1.5$`, from: String.raw`y_1 = 1 + 0.5\cdot 1`, to: String.raw`y_1 = 1.5\quad\text{at } x_1 = 0.5`,
            why: String.raw`The first Euler point is $(0.5, 1.5)$.` },
          { kind: 'sub', label: String.raw`Slope at $(x_1, y_1) = (0.5, 1.5)$`, from: String.raw`F(x_1, y_1) = \T{x-1}{x_1} + \T{y-1}{y_1}`, to: String.raw`F(0.5, 1.5) = \T{x-1}{0.5} + \T{y-1}{1.5} = 2`,
            why: String.raw`Second step from $(0.5, 1.5)$: we read the new slope there.` },
          { kind: 'sub', label: 'Second Euler step', from: String.raw`y_2 = \T{y-1}{y_1} + \T{h-1}{h}\,\T{s-1}{F(x_1, y_1)}`, to: String.raw`y_2 = \T{y-1}{1.5} + \T{h-1}{0.5}\cdot\T{s-1}{2}`,
            why: String.raw`Same recipe, starting from the new point.` },
          { kind: 'calc', label: String.raw`$1.5 + 1 = 2.5$`, from: String.raw`y_2 = 1.5 + 0.5\cdot 2`, to: String.raw`y_2 = 2.5\quad\text{at } x_2 = 1`,
            why: String.raw`Euler's approximation of $y(1)$ is $2.5$.` },
          { kind: 'check', label: 'Compare with the exact solution', from: String.raw`y = 2e^{\T{x-1}{x}} - \T{x-2}{x} - 1\qquad\qquad x = \T{o-1}{1}`, to: String.raw`y(1) = 2e^{\T{o-1}{1}} - \T{o-2}{1} - 1 = 2e - 2 \approx 3.437`,
            map: { 'o-1': ['o-1', 'o-2'] }, arrows: { 'o-1': 'x = 1' },
            why: String.raw`The exact solution is $y = 2e^x - x - 1$ (check: $y' = 2e^x - 1 = x + y$).` },
          { kind: 'result', label: String.raw`Error $3.437 - 2.5$`, from: String.raw`3.437 - 2.5`, to: String.raw`\text{error} \approx 0.94`,
            why: String.raw`The error is large because $h$ is large and the solution is convex: Euler's tangent lines always fall below it.` },
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
        { type: 'derive', title: String.raw`Example: $y' = -2xy$, $y(0) = 3$`, colors: { dx: 1, y: 2, C: 3 }, steps: [
          { kind: 'both', label: String.raw`Both sides $\times\,\mathrm d x$`, from: String.raw`\frac{\mathrm d y}{\T{dx-1}{\mathrm d x}} = -2x\,y`, to: String.raw`\mathrm d y = -2x\,y\,\T{dx-1}{\mathrm d x}`, arrows: { 'dx-1': '× dx on both sides' },
            why: String.raw`We treat $\frac{\mathrm d y}{\mathrm d x}$ as a quotient of differentials. Multiplying both sides by $\mathrm d x$ clears it on the left and makes it appear on the right.` },
          { kind: 'both', label: String.raw`Both sides $\div\, y$ (for $y \ne 0$)`, from: String.raw`\mathrm d y = -2x\,\T{y-1}{y}\,\T{dx-1}{\mathrm d x}`, to: String.raw`\frac{\mathrm d y}{\T{y-1}{y}} = -2x\,\T{dx-1}{\mathrm d x}`, arrows: { 'y-1': '÷ y on both sides' },
            why: String.raw`Now all $y$ are on the left and all $x$ on the right: the variables are separated. Dividing is only allowed for $y \ne 0$, so $y = 0$ must be checked separately.` },
          { kind: 'calculus', label: 'Integrate both sides', from: String.raw`\frac{\mathrm d y}{y} = -2x\,\mathrm d x`, to: String.raw`\ln|y| = -x^2 + \T{C-1}{C_1}`,
            why: String.raw`$\int \frac{\mathrm d y}{y} = \ln|y|$ and $\int -2x\,\mathrm d x = -x^2$. One constant on one side is enough.` },
          { kind: 'both', label: String.raw`Both sides as a power of $e$`, to: String.raw`|y| = e^{-x^2 + \T{C-1}{C_1}}`,
            why: String.raw`$e^{\ln|y|} = |y|$ undoes the logarithm. Equal numbers have equal powers of $e$.` },
          { kind: 'expand', label: String.raw`$e^{a+b} = e^a e^b$`, to: String.raw`|y| = \T{C-1}{e^{C_1}}\,e^{-x^2}`,
            why: String.raw`Splitting the power separates the constant factor from the part that depends on $x$.` },
          { kind: 'result', label: 'Rename the constant', to: String.raw`y = \T{C-1}{C}\,e^{-x^2}`,
            why: String.raw`Removing the absolute value gives a sign $\pm$, so $C = \pm e^{C_1}$. The lost solution $y = 0$ is included as $C = 0$.` },
          { kind: 'sub', label: String.raw`Initial condition $y(0) = 3$`, from: String.raw`\T{y-2}{y} = C\,e^{-\T{x-1}{x^2}}\qquad\qquad x = \T{z-1}{0},\ y = \T{t-1}{3}`, to: String.raw`\T{t-1}{3} = C\,e^{-\T{z-1}{0^2}}`, arrows: { 'z-1': 'x = 0', 't-1': 'y = 3' },
            why: String.raw`We apply the initial condition by putting $x = 0$ and $y = 3$ into the general solution.` },
          { kind: 'calc', label: String.raw`$e^{0} = 1$`, from: String.raw`3 = C\,e^{0}`, to: String.raw`3 = \T{C-2}{C}`, why: String.raw`$e^0 = 1$, so the constant is $C = 3$.` },
          { kind: 'result', label: String.raw`Put $C = 3$ back`, from: String.raw`y = \T{C-3}{C}\,e^{-x^2}\qquad\qquad C = \T{t-2}{3}`, to: String.raw`y = \T{t-2}{3}\,e^{-x^2}`, arrows: { 't-2': 'C = 3' },
            why: String.raw`The bell curve through $(0, 3)$.` },
        ] },
        { type: 'derive', title: String.raw`Example with an implicit solution: $y' = \dfrac{x^2}{1+y^2}$, $y(0) = 1$`, colors: { dx: 1, h: 2, C: 3 }, steps: [
          { kind: 'both', label: String.raw`Both sides $\times\,\mathrm d x$`, from: String.raw`\frac{\mathrm d y}{\T{dx-1}{\mathrm d x}} = \frac{x^2}{\T{h-1}{1+y^2}}`, to: String.raw`\mathrm d y = \frac{x^2}{\T{h-1}{1+y^2}}\,\T{dx-1}{\mathrm d x}`, arrows: { 'dx-1': '× dx on both sides' },
            why: String.raw`Multiplying both sides by $\mathrm d x$ moves it to the right-hand side.` },
          { kind: 'both', label: String.raw`Both sides $\times\,(1+y^2)$`, to: String.raw`\T{h-1}{(1+y^2)}\,\mathrm d y = x^2\,\T{dx-1}{\mathrm d x}`, arrows: { 'h-1': '× (1+y²) on both sides' },
            why: String.raw`Multiplying both sides by $1 + y^2$ cancels the denominator on the right. Here $h(y) = 1/(1+y^2)$ never vanishes, so no solutions are lost.` },
          { kind: 'calculus', label: 'Integrate both sides', from: String.raw`(1+y^2)\,\mathrm d y = x^2\,\mathrm d x`, to: String.raw`y + \frac{y^3}{3} = \frac{x^3}{3} + \T{C-1}{C}`,
            why: String.raw`We integrate each side with the power rule.` },
          { kind: 'sub', label: String.raw`Initial condition $y(0) = 1$`, from: String.raw`\T{y-1}{y} + \frac{\T{y-2}{y^3}}{3} = \frac{\T{x-1}{x^3}}{3} + C\qquad\qquad x = \T{z-1}{0},\ y = \T{o-1}{1}`, to: String.raw`\T{o-1}{1} + \frac{\T{o-2}{1^3}}{3} = \frac{\T{z-1}{0^3}}{3} + C`,
            map: { 'o-1': ['o-1', 'o-2'] }, arrows: { 'o-1': 'y = 1', 'z-1': 'x = 0' },
            why: String.raw`We put $x = 0$ and $y = 1$ into the implicit solution.` },
          { kind: 'calc', label: String.raw`$1 + \tfrac13 = \tfrac43$`, from: String.raw`1 + \frac{1}{3} = \frac{0}{3} + C`, to: String.raw`\frac43 = \T{C-2}{C}`,
            why: String.raw`The initial condition gives $C = 1 + \frac13 = \frac43$.` },
          { kind: 'sub', label: String.raw`Put $C = \tfrac43$ back`, from: String.raw`y + \frac{y^3}{3} = \frac{x^3}{3} + \T{C-3}{C}\qquad\qquad C = \T{f-1}{\tfrac43}`, to: String.raw`y + \frac{y^3}{3} = \frac{x^3}{3} + \T{f-1}{\frac43}`, arrows: { 'f-1': 'C = 4/3' },
            why: String.raw`This selects the one curve through $(0, 1)$.` },
          { kind: 'result', label: String.raw`Both sides $\times\, 3$`, from: String.raw`\T{y-1}{y} + \frac{\T{y-2}{y^3}}{\T{t-1}{3}} = \frac{\T{x-1}{x^3}}{\T{t-2}{3}} + \frac{\T{f-1}{4}}{\T{t-3}{3}}`, to: String.raw`3\T{y-1}{y} + \T{y-2}{y^3} = \T{x-1}{x^3} + \T{f-1}{4}`,
            why: String.raw`Multiplying every term by $3$ clears the denominators. Solving the cubic for $y$ is possible but unhelpful; the implicit form is an acceptable answer. To evaluate, e.g., $y(1)$, solve $3y + y^3 = 5$ numerically: <code>fzero(@(y) 3*y + y.^3 - 5, 1)</code> gives $y \approx 1.154$.` },
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
        { type: 'derive', title: String.raw`Example: $y' + 2xy = x$, $y(0) = 2$`, colors: { mu: 1, p: 2, C: 3 }, steps: [
          { kind: 'calculus', label: 'Integrating factor', from: String.raw`\mu = e^{\int \T{p-1}{2x}\,\mathrm d x}`, to: String.raw`\mu = e^{\T{p-1}{x^2}}`,
            why: String.raw`The equation is already in standard form with $p(x) = 2x$. An antiderivative of $2x$ is $x^2$; no constant is needed.` },
          { kind: 'both', label: String.raw`Both sides $\times\, e^{x^2}$`, from: String.raw`y' + 2x\,y = x`, to: String.raw`\T{mu-1}{e^{x^2}}\,y' + \T{mu-2}{e^{x^2}}\,2x\,y = \T{mu-3}{e^{x^2}}\,x`,
            why: String.raw`We multiply every term on both sides by $\mu$. That keeps the equation true, since $\mu$ is never $0$.` },
          { kind: 'factor', label: 'The left side is a product-rule derivative', to: String.raw`\big(\T{mu-1}{e^{x^2}}\,y\big)' = \T{mu-3}{e^{x^2}}\,x`, map: { 'mu-2': ['mu-1'] },
            why: String.raw`By the product rule $\big(e^{x^2}y\big)' = e^{x^2}y' + 2x\,e^{x^2}y$, exactly our left side. This is why $\mu$ was chosen.` },
          { kind: 'calculus', label: 'Integrate both sides', to: String.raw`\T{mu-1}{e^{x^2}}\,y = \tfrac12 e^{x^2} + \T{C-1}{C}`,
            why: String.raw`Integrating a derivative gives back the function. On the right, the substitution $u = x^2$ gives $\int x e^{x^2}\,\mathrm d x = \frac12 e^{x^2}$.` },
          { kind: 'both', label: String.raw`Both sides $\div\, e^{x^2}$`, to: String.raw`y = \tfrac12 + \T{C-1}{C}\,\T{mu-1}{e^{-x^2}}`, arrows: { 'mu-1': '÷ e^(x²) on both sides' },
            why: String.raw`Dividing every term by $e^{x^2}$: $\frac12 e^{x^2}/e^{x^2} = \frac12$ and $C/e^{x^2} = Ce^{-x^2}$.` },
          { kind: 'sub', label: String.raw`Initial condition $y(0) = 2$`, from: String.raw`\T{y-1}{y} = \tfrac12 + C\,e^{-\T{x-1}{x^2}}\qquad\qquad x = \T{z-1}{0},\ y = \T{t-1}{2}`, to: String.raw`\T{t-1}{2} = \tfrac12 + C\,e^{-\T{z-1}{0^2}}`, arrows: { 'z-1': 'x = 0', 't-1': 'y = 2' },
            why: String.raw`We put $x = 0$ and $y = 2$ into the general solution.` },
          { kind: 'calc', label: String.raw`$e^{0} = 1$`, from: String.raw`2 = \tfrac12 + C\,e^{0}`, to: String.raw`2 = \T{h-1}{\tfrac12} + \T{C-2}{C}`, why: String.raw`$e^0 = 1$.` },
          { kind: 'both', label: String.raw`Both sides $-\tfrac12$`, to: String.raw`2 \T{h-1}{- \tfrac12} = \T{C-2}{C}`, arrows: { 'h-1': '−½ on both sides' },
            why: String.raw`Subtracting $\frac12$ from both sides cancels it on the right and makes $-\frac12$ appear on the left.` },
          { kind: 'calc', label: String.raw`$2 - \tfrac12 = \tfrac32$`, to: String.raw`\T{C-2}{C} = \tfrac32`, why: String.raw`Now $C$ stands alone.` },
          { kind: 'result', label: String.raw`Put $C = \tfrac32$ back`, from: String.raw`y = \tfrac12 + \T{C-3}{C}\,e^{-x^2}\qquad\qquad C = \T{f-1}{\tfrac32}`, to: String.raw`y = \tfrac12 + \T{f-1}{\tfrac32}\,e^{-x^2}`, arrows: { 'f-1': 'C = 3/2' },
            why: String.raw`(This equation is also separable: $y' = x(1 - 2y)$.)` },
        ] },
        { type: 'derive', title: String.raw`Example: $x y' - y = x^3$, $y(1) = 0$, for $x > 0$`, colors: { mu: 1, p: 2, C: 3, x: 4 }, steps: [
          { kind: 'both', label: String.raw`Both sides $\div\, x$`, from: String.raw`\T{x-1}{x}\,y' - y = x^3`, to: String.raw`y' - \frac{y}{\T{x-1}{x}} = \frac{x^3}{\T{x-2}{x}}`,
            map: { 'x-1': ['x-1', 'x-2'] }, arrows: { 'x-1': '÷ x on both sides' },
            why: String.raw`Standard form needs coefficient $1$ in front of $y'$. Dividing by $x$ is allowed because $x > 0$.` },
          { kind: 'calc', label: String.raw`$x^3 \div x = x^2$`, from: String.raw`y' - \frac{y}{x} = \frac{x^3}{x}`, to: String.raw`y' \T{p-1}{- \frac{1}{x}}\,y = x^2`,
            why: String.raw`Now the equation is in standard form with $p(x) = -1/x$.` },
          { kind: 'calculus', label: 'Integrating factor', from: String.raw`\mu = e^{\int \T{p-1}{-\frac1x}\,\mathrm d x}`, to: String.raw`\mu = e^{\T{p-1}{-\ln x}}`,
            why: String.raw`An antiderivative of $-1/x$ is $-\ln x$ (for $x > 0$).` },
          { kind: 'calc', label: String.raw`$e^{-\ln x} = 1/x$`, to: String.raw`\mu = \frac1x`, why: String.raw`$e^{-\ln x} = \big(e^{\ln x}\big)^{-1} = x^{-1}$.` },
          { kind: 'both', label: String.raw`Both sides $\times\,\tfrac1x$`, from: String.raw`y' - \frac1x\,y = x^2`, to: String.raw`\T{mu-1}{\tfrac1x}\,y' - \T{mu-2}{\tfrac1x}\cdot\tfrac1x\,y = \T{mu-3}{\tfrac1x}\,x^2`,
            why: String.raw`We multiply every term on both sides by $\mu = \frac1x$.` },
          { kind: 'factor', label: 'The left side is a derivative', to: String.raw`\Big(\T{mu-1}{\frac1x}\,y\Big)' = \T{mu-3}{x}`, map: { 'mu-2': ['mu-1'] },
            why: String.raw`By the product rule $\big(\frac{y}{x}\big)' = \frac{y'}{x} - \frac{y}{x^2}$, exactly our left side. On the right, $\frac1x\cdot x^2 = x$.` },
          { kind: 'calculus', label: 'Integrate both sides', to: String.raw`\T{mu-1}{\frac1x}\,y = \frac{x^2}{2} + \T{C-1}{C}`,
            why: String.raw`Integrating a derivative gives back the function; $\int x\,\mathrm d x = \frac{x^2}{2}$.` },
          { kind: 'both', label: String.raw`Both sides $\times\, x$`, to: String.raw`y = \frac{x^3}{2} + \T{C-1}{C}\,x`,
            why: String.raw`Multiplying by $x$ cancels the $\frac1x$ on the left; every term on the right gets a factor $x$.` },
          { kind: 'sub', label: String.raw`Initial condition $y(1) = 0$`, from: String.raw`\T{y-1}{y} = \frac{\T{x-1}{x^3}}{2} + C\,\T{x-2}{x}\qquad\qquad x = \T{o-1}{1},\ y = \T{z-1}{0}`, to: String.raw`\T{z-1}{0} = \frac{\T{o-1}{1}}{2} + C\cdot\T{o-2}{1}`,
            map: { 'o-1': ['o-1', 'o-2'] }, arrows: { 'o-1': 'x = 1', 'z-1': 'y = 0' },
            why: String.raw`We put $x = 1$ and $y = 0$ into the general solution ($1^3 = 1$).` },
          { kind: 'both', label: String.raw`Both sides $-\,C$`, from: String.raw`0 = \frac12 + \T{C-2}{C}`, to: String.raw`\T{C-2}{-C} = \frac12`, arrows: { 'C-2': '−C on both sides' },
            why: String.raw`Subtracting $C$ from both sides moves it to the left with a minus sign.` },
          { kind: 'both', label: String.raw`Both sides $\times\,(-1)$`, to: String.raw`\T{C-2}{C} = -\frac12`, why: String.raw`Changing the sign on both sides gives $C$ itself.` },
          { kind: 'result', label: String.raw`Put $C = -\tfrac12$ back`, from: String.raw`y = \frac{x^3}{2} + \T{C-3}{C}\,x\qquad\qquad C = \T{f-1}{-\tfrac12}`, to: String.raw`y = \frac{x^3}{2} \T{f-1}{- \frac12}\,x = \frac{x^3 - x}{2}`, arrows: { 'f-1': 'C = −1/2' },
            why: String.raw`Both terms have denominator $2$, so they combine into one fraction.` },
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
        { label: '(b)', prompt: String.raw`$y = Ce^{-3x} + 2$ solves $y' = 6 - 3y$. Find $C$ for the initial condition $y(0) = 5$.`, kind: 'numeric', answer: '3', solution: [
          { type: 'text', html: String.raw`<p>We first check that the candidate solves the equation, then use $y(0) = 5$ to find $C$.</p>` },
          { type: 'derive', colors: { C: 1, y: 2 }, steps: [
            { kind: 'calculus', label: 'Differentiate the candidate', from: String.raw`y = \T{C-1}{Ce^{-3x}} + 2`, to: String.raw`y' = -3\,\T{C-1}{Ce^{-3x}}`,
              why: String.raw`By the chain rule $(e^{-3x})' = -3e^{-3x}$; the constant $2$ gives $0$.` },
            { kind: 'sub', label: String.raw`Put the candidate in for $y$ on the right-hand side`, from: String.raw`6 - 3\,\T{y-1}{y}\qquad\qquad y = \T{y-2}{Ce^{-3x} + 2}`, to: String.raw`6 - 3(\T{y-2}{Ce^{-3x} + 2})`, arrows: { 'y-2': 'replace y' },
              why: String.raw`We compute the right-hand side with the same candidate.` },
            { kind: 'expand', label: String.raw`Multiply $-3$ into the bracket`, to: String.raw`\T{s-1}{6} - 3Ce^{-3x} \T{s-2}{- 6}`,
              why: String.raw`$-3$ multiplies both terms in the bracket: $-3\cdot Ce^{-3x}$ and $-3\cdot 2 = -6$.` },
            { kind: 'cancel', label: String.raw`$6 - 6 = 0$`, to: String.raw`-3Ce^{-3x} = y'\ \checkmark`,
              why: String.raw`The right-hand side equals $y'$, so the candidate is a solution for every $C$.` },
            { kind: 'sub', label: String.raw`Initial condition $y(0) = 5$`, from: String.raw`\T{y-3}{y} = C\,e^{-3\T{x-1}{x}} + 2\qquad\qquad x = \T{z-1}{0},\ y = \T{f-1}{5}`, to: String.raw`\T{f-1}{5} = C\,e^{-3\cdot\T{z-1}{0}} + 2`, arrows: { 'z-1': 'x = 0', 'f-1': 'y = 5' },
              why: String.raw`We put $x = 0$ and $y = 5$ into the solution.` },
            { kind: 'calc', label: String.raw`$e^{0} = 1$`, from: String.raw`5 = C\,e^{0} + 2`, to: String.raw`5 = \T{C-2}{C} \T{t-1}{+ 2}`, why: String.raw`$e^0 = 1$, so $y(0) = C + 2$.` },
            { kind: 'both', label: String.raw`Both sides $-2$`, to: String.raw`5 \T{t-1}{- 2} = \T{C-2}{C}`, arrows: { 't-1': '−2 on both sides' },
              why: String.raw`Subtracting $2$ from both sides cancels it on the right and makes $-2$ appear on the left.` },
            { kind: 'result', label: String.raw`$5 - 2 = 3$`, to: String.raw`\T{C-2}{C} = 3`, why: String.raw`The solution through $(0, 5)$ is $y = 3e^{-3x} + 2$.` },
          ] },
        ] },
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
        { label: '(a)', prompt: String.raw`Use $h = 0.5$ (two steps).`, kind: 'numeric', answer: '2.375', tol: 1e-6, solution: [
          { type: 'text', html: String.raw`<p>We apply $y_{n+1} = y_n + h\,(x_n y_n + 1)$ twice, starting from $(x_0, y_0) = (0, 1)$ with $h = 0.5$.</p>` },
          { type: 'derive', colors: { y: 1, h: 2, x: 3 }, steps: [
            { kind: 'sub', label: String.raw`First step from $(0, 1)$`, from: String.raw`y_1 = \T{y-1}{y_0} + \T{h-1}{h}\,(\T{x-1}{x_0}\,\T{y-2}{y_0} + 1)`, to: String.raw`y_1 = \T{y-1}{1} + \T{h-1}{0.5}\,(\T{x-1}{0}\cdot\T{y-2}{1} + 1)`,
              why: String.raw`New height = old height + step $\times$ slope, with the slope $F = xy + 1$ read at the old point.` },
            { kind: 'calc', label: String.raw`$1 + 0.5\cdot 1$`, from: String.raw`y_1 = 1 + 0.5\,(0\cdot 1 + 1)`, to: String.raw`y_1 = 1.5\quad\text{at } x_1 = 0.5`, why: String.raw`The slope at $(0, 1)$ is $1$.` },
            { kind: 'sub', label: String.raw`Second step from $(0.5, 1.5)$`, from: String.raw`y_2 = \T{y-1}{y_1} + \T{h-1}{h}\,(\T{x-1}{x_1}\,\T{y-2}{y_1} + 1)`, to: String.raw`y_2 = \T{y-1}{1.5} + \T{h-1}{0.5}\,(\T{x-1}{0.5}\cdot\T{y-2}{1.5} + 1)`,
              why: String.raw`Same recipe from the new point.` },
            { kind: 'calc', label: String.raw`$0.5\cdot 1.5 + 1 = 1.75$`, from: String.raw`y_2 = 1.5 + 0.5\,(0.5\cdot 1.5 + 1)`, to: String.raw`y_2 = 1.5 + 0.5\cdot 1.75 = 1.5 + 0.875`, why: String.raw`The slope at $(0.5, 1.5)$ is $1.75$.` },
            { kind: 'result', label: String.raw`$1.5 + 0.875$`, to: String.raw`y_2 = 2.375`, why: String.raw`Euler's approximation of $y(1)$ with $h = 0.5$.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`Use $h = 0.25$ (four steps). Give at least four decimals.`, kind: 'numeric', answer: '2.6551513671875', tol: 1e-5, solution: [
          { type: 'text', html: String.raw`<p>We apply $y_{n+1} = y_n + 0.25\,(x_n y_n + 1)$ four times, with $x_n = 0, 0.25, 0.5, 0.75$.</p>` },
          { type: 'derive', steps: [
            { kind: 'sub', label: String.raw`Step 1 from $(0, 1)$`, from: String.raw`y_{n+1} = y_n + 0.25\,(x_n\,y_n + 1)`, to: String.raw`y_1 = 1 + 0.25\,(0\cdot 1 + 1) = 1.25`,
              why: String.raw`The slope at the start is $0\cdot 1 + 1 = 1$.` },
            { kind: 'calc', label: String.raw`Step 2 from $(0.25, 1.25)$`, to: String.raw`y_2 = 1.25 + 0.25\,(0.25\cdot 1.25 + 1) = 1.578125`, why: String.raw`The slope is $1.3125$.` },
            { kind: 'calc', label: String.raw`Step 3 from $(0.5, 1.578125)$`, to: String.raw`y_3 = 1.578125 + 0.25\,(0.5\cdot 1.578125 + 1) = 2.025390625`, why: String.raw`The slope is $1.7890625$.` },
            { kind: 'result', label: String.raw`Step 4 from $(0.75, 2.025390625)$`, to: String.raw`y_4 = 2.025390625 + 0.25\,(0.75\cdot 2.025390625 + 1) \approx 2.65515`, why: String.raw`Euler's approximation of $y(1)$ with $h = 0.25$.` },
          ] },
        ] },
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
        { label: '(a)', prompt: String.raw`Solve the IVP. Enter $y(x)$.`, kind: 'expression', variable: 'x', answer: 'sqrt(6 - 2*exp(-x))', hint: String.raw`Separate: $y\,\mathrm d y = e^{-x}\,\mathrm d x$.`, solution: [
          { type: 'text', html: String.raw`<p>We separate the variables, integrate, use $y(0) = 2$ to find $C$, and solve for $y$.</p>` },
          { type: 'derive', colors: { e: 1, dx: 2, C: 3 }, steps: [
            { kind: 'both', label: String.raw`Both sides $\div\, e^{x}$`, from: String.raw`\T{e-1}{e^{x}}\,y\,\frac{\mathrm d y}{\mathrm d x} = 1`, to: String.raw`y\,\frac{\mathrm d y}{\mathrm d x} = \frac{1}{\T{e-1}{e^{x}}}`, arrows: { 'e-1': '÷ eˣ on both sides' },
              why: String.raw`Dividing both sides by $e^x$ (never $0$) clears it on the left.` },
            { kind: 'calc', label: String.raw`$1/e^{x} = e^{-x}$`, to: String.raw`y\,\frac{\mathrm d y}{\T{dx-1}{\mathrm d x}} = \T{e-1}{e^{-x}}`, why: String.raw`A reciprocal is a negative power.` },
            { kind: 'both', label: String.raw`Both sides $\times\,\mathrm d x$`, to: String.raw`y\,\mathrm d y = \T{e-1}{e^{-x}}\,\T{dx-1}{\mathrm d x}`, arrows: { 'dx-1': '× dx on both sides' },
              why: String.raw`Now all $y$ are on the left and all $x$ on the right.` },
            { kind: 'calculus', label: 'Integrate both sides', from: String.raw`y\,\mathrm d y = e^{-x}\,\mathrm d x`, to: String.raw`\tfrac12 y^2 = -e^{-x} + \T{C-1}{C}`,
              why: String.raw`$\int y\,\mathrm d y = \frac12 y^2$ and $\int e^{-x}\,\mathrm d x = -e^{-x}$.` },
            { kind: 'sub', label: String.raw`Initial condition $y(0) = 2$`, from: String.raw`\tfrac12 \T{y-1}{y^2} = -e^{-\T{x-1}{x}} + C\qquad\qquad x = \T{z-1}{0},\ y = \T{t-1}{2}`, to: String.raw`\tfrac12\cdot\T{t-1}{2^2} = -e^{-\T{z-1}{0}} + C`, arrows: { 'z-1': 'x = 0', 't-1': 'y = 2' },
              why: String.raw`We put $x = 0$ and $y = 2$ in.` },
            { kind: 'calc', label: String.raw`$\tfrac12\cdot 4 = 2$, $e^0 = 1$`, from: String.raw`\tfrac12\cdot 4 = -e^{0} + C`, to: String.raw`2 = \T{m-1}{-1} + \T{C-2}{C}`, why: String.raw`Both sides simplified.` },
            { kind: 'both', label: String.raw`Both sides $+1$`, to: String.raw`2 \T{m-1}{+ 1} = \T{C-2}{C}`, arrows: { 'm-1': '+1 on both sides' },
              why: String.raw`Adding $1$ cancels the $-1$ on the right; it appears as $+1$ on the left. So $C = 3$.` },
            { kind: 'sub', label: String.raw`Put $C = 3$ back`, from: String.raw`\tfrac12 y^2 = -e^{-x} + \T{C-3}{C}\qquad\qquad C = \T{f-1}{3}`, to: String.raw`\tfrac12 y^2 = -e^{-x} + \T{f-1}{3}`, arrows: { 'f-1': 'C = 3' },
              why: String.raw`This is the implicit solution through $(0, 2)$.` },
            { kind: 'both', label: String.raw`Both sides $\times\, 2$`, from: String.raw`\tfrac12 y^2 = \T{a-1}{-e^{-x}} + \T{f-1}{3}`, to: String.raw`y^2 = \T{f-1}{6} \T{a-1}{- 2e^{-x}}`,
              why: String.raw`Doubling every term clears the $\frac12$.` },
            { kind: 'result', label: 'Positive square root', to: String.raw`y = \sqrt{6 - 2e^{-x}}`,
              why: String.raw`A square root has two signs; since $y(0) = 2 > 0$ we take the positive one.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`Compute $y(1)$.`, kind: 'numeric', answer: 'sqrt(6 - 2*exp(-1))', solution: String.raw`$y(1) = \sqrt{6 - 2/e} \approx 2.2944$.` },
        { label: '(c)', prompt: String.raw`Compute $\lim_{x\to\infty} y(x)$.`, kind: 'numeric', answer: 'sqrt(6)', solution: String.raw`$e^{-x} \to 0$, so $y \to \sqrt 6$.` },
        { label: '(d)', prompt: String.raw`The solution exists on an interval $(x_*, \infty)$. Find the left end point $x_*$.`, kind: 'numeric', answer: '-log(3)', hint: 'Where does the expression under the root vanish? There $y = 0$ and $y\' = e^{-x}/y$ blows up.', solution: [
          { type: 'text', html: String.raw`<p>The root needs a positive argument, so we solve the inequality $6 - 2e^{-x} > 0$ for $x$.</p>` },
          { type: 'derive', colors: { a: 1, t: 2 }, steps: [
            { kind: 'both', label: String.raw`Both sides $+\,2e^{-x}$`, from: String.raw`6 \T{a-1}{- 2e^{-x}} > 0`, to: String.raw`6 > \T{a-1}{2e^{-x}}`, arrows: { 'a-1': '+2e⁻ˣ on both sides' },
              why: String.raw`Adding the same amount to both sides keeps the inequality; the term crosses with a flipped sign.` },
            { kind: 'both', label: String.raw`Both sides $\div\, 2$`, from: String.raw`\T{t-1}{6} > \T{a-1}{2e^{-x}}`, to: String.raw`\T{t-1}{3} > \T{a-1}{e^{-x}}`,
              why: String.raw`Dividing by a positive number keeps the direction of the inequality.` },
            { kind: 'both', label: String.raw`$\ln$ of both sides`, to: String.raw`\T{t-1}{\ln 3} > \T{a-1}{-x}`,
              why: String.raw`$\ln$ is increasing, so it keeps the direction; $\ln e^{-x} = -x$.` },
            { kind: 'both', label: String.raw`Both sides $\times\,(-1)$`, to: String.raw`\T{a-1}{x} > \T{t-1}{-\ln 3}`, arrows: { 'a-1': '× (−1): the inequality flips' },
              why: String.raw`Multiplying by a negative number reverses the inequality; we write the result with $x$ on the left.` },
            { kind: 'result', label: 'Left end point', from: String.raw`x > -\ln 3`, to: String.raw`x_* = -\ln 3`,
              why: String.raw`At $x = -\ln 3$ the solution reaches $y = 0$, where $y' = e^{-x}/y$ is undefined.` },
          ] },
        ] },
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
        { label: '(a)', prompt: 'Which integrating factor do you use?', kind: 'choice', choices: [String.raw`$e^{3x}$`, String.raw`$x^3$`, String.raw`$e^{3x^2/2}$`, String.raw`$3\ln x$`], answer: 1, solution: [
          { type: 'text', html: String.raw`<p>We bring the equation to standard form, read off $p(x)$, and compute $\mu = e^{\int p\,\mathrm d x}$.</p>` },
          { type: 'derive', colors: { x: 1, p: 2 }, steps: [
            { kind: 'both', label: String.raw`Both sides $\div\, x$`, from: String.raw`\T{x-1}{x}\,y' + 3y = x^2`, to: String.raw`y' + \frac{3}{\T{x-1}{x}}\,y = \frac{x^2}{\T{x-2}{x}}`,
              map: { 'x-1': ['x-1', 'x-2'] }, arrows: { 'x-1': '÷ x on both sides' },
              why: String.raw`Standard form needs coefficient $1$ in front of $y'$; dividing by $x$ is allowed for $x > 0$.` },
            { kind: 'calc', label: String.raw`$x^2 \div x = x$`, from: String.raw`y' + \frac{3}{x}\,y = \frac{x^2}{x}`, to: String.raw`y' + \T{p-1}{\frac3x}\,y = x`, why: String.raw`So $p(x) = 3/x$.` },
            { kind: 'calculus', label: 'Integrating factor', from: String.raw`\mu = e^{\int \T{p-1}{\frac3x}\,\mathrm d x}`, to: String.raw`\mu = e^{\T{p-1}{3\ln x}}`, why: String.raw`An antiderivative of $3/x$ is $3\ln x$.` },
            { kind: 'result', label: String.raw`$e^{3\ln x} = x^3$`, to: String.raw`\mu = x^3`, why: String.raw`$e^{3\ln x} = \big(e^{\ln x}\big)^3 = x^3$.` },
          ] },
        ] },
        { label: '(b)', prompt: String.raw`Enter the solution $y(x)$.`, kind: 'expression', variable: 'x', answer: 'x.^2/5 + 4./(5*x.^3)', solution: [
          { type: 'text', html: String.raw`<p>We multiply the standard form by $\mu = x^3$, integrate, and use $y(1) = 1$ to find $C$.</p>` },
          { type: 'derive', colors: { mu: 1, C: 2 }, steps: [
            { kind: 'both', label: String.raw`Both sides $\times\, x^3$`, from: String.raw`y' + \frac3x\,y = x`, to: String.raw`\T{mu-1}{x^3}\,y' + \T{mu-2}{x^3}\cdot\frac3x\,y = \T{mu-3}{x^3}\,x`,
              why: String.raw`We multiply every term on both sides by the integrating factor.` },
            { kind: 'factor', label: 'The left side is a derivative', to: String.raw`\big(\T{mu-1}{x^3}\,y\big)' = \T{mu-3}{x^4}`, map: { 'mu-2': ['mu-1'] },
              why: String.raw`By the product rule $(x^3 y)' = x^3 y' + 3x^2 y$, exactly our left side. On the right, $x^3\cdot x = x^4$.` },
            { kind: 'calculus', label: 'Integrate both sides', to: String.raw`\T{mu-1}{x^3}\,y = \frac{x^5}{5} + \T{C-1}{C}`, why: String.raw`Integrating a derivative gives back the function; $\int x^4\,\mathrm d x = \frac{x^5}{5}$.` },
            { kind: 'both', label: String.raw`Both sides $\div\, x^3$`, to: String.raw`y = \frac{x^2}{5} + \frac{\T{C-1}{C}}{\T{mu-1}{x^3}}`, arrows: { 'mu-1': '÷ x³ on both sides' },
              why: String.raw`Dividing every term by $x^3$: $\frac{x^5}{5x^3} = \frac{x^2}{5}$.` },
            { kind: 'sub', label: String.raw`Initial condition $y(1) = 1$`, from: String.raw`\T{y-1}{y} = \frac{\T{x-1}{x^2}}{5} + \frac{C}{\T{x-2}{x^3}}\qquad\qquad x = \T{o-1}{1},\ y = \T{w-1}{1}`, to: String.raw`\T{w-1}{1} = \frac{\T{o-1}{1}}{5} + \frac{C}{\T{o-2}{1}}`,
              map: { 'o-1': ['o-1', 'o-2'] }, arrows: { 'o-1': 'x = 1', 'w-1': 'y = 1' }, why: String.raw`We put $x = 1$ and $y = 1$ in.` },
            { kind: 'calc', label: String.raw`$C/1 = C$`, from: String.raw`1 = \frac15 + \frac{C}{1}`, to: String.raw`1 = \T{f-1}{\frac15} + \T{C-2}{C}`, why: String.raw`Dividing by $1$ changes nothing.` },
            { kind: 'both', label: String.raw`Both sides $-\tfrac15$`, to: String.raw`1 \T{f-1}{- \frac15} = \T{C-2}{C}`, arrows: { 'f-1': '−1/5 on both sides' },
              why: String.raw`Subtracting $\frac15$ cancels it on the right; it appears as $-\frac15$ on the left. So $C = \frac45$.` },
            { kind: 'result', label: String.raw`Put $C = \tfrac45$ back`, from: String.raw`y = \frac{x^2}{5} + \frac{\T{C-3}{C}}{x^3}\qquad\qquad C = \T{g-1}{\tfrac45}`, to: String.raw`y = \frac{x^2}{5} + \frac{\T{g-1}{4}}{5x^3}`, arrows: { 'g-1': 'C = 4/5' },
              why: String.raw`$\frac{4/5}{x^3} = \frac{4}{5x^3}$.` },
          ] },
        ] },
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
        { label: '(c)', prompt: String.raw`Solve the IVP with $y(0) = 1$ by separation and compute $y(1)$.`, kind: 'numeric', answer: '8', solution: [
          { type: 'text', html: String.raw`<p>We separate the variables (for $y \ne 0$), integrate, fix $C$ with $y(0) = 1$, solve for $y$ and evaluate at $x = 1$.</p>` },
          { type: 'derive', colors: { dx: 1, y: 2, C: 3 }, steps: [
            { kind: 'both', label: String.raw`Both sides $\times\,\mathrm d x$`, from: String.raw`\frac{\mathrm d y}{\T{dx-1}{\mathrm d x}} = 3\,y^{2/3}`, to: String.raw`\mathrm d y = 3\,y^{2/3}\,\T{dx-1}{\mathrm d x}`, arrows: { 'dx-1': '× dx on both sides' },
              why: String.raw`Multiplying both sides by $\mathrm d x$ moves it to the right.` },
            { kind: 'both', label: String.raw`Both sides $\div\, y^{2/3}$ (for $y \ne 0$)`, from: String.raw`\mathrm d y = 3\,\T{y-1}{y^{2/3}}\,\T{dx-1}{\mathrm d x}`, to: String.raw`\T{y-1}{y^{-2/3}}\,\mathrm d y = 3\,\T{dx-1}{\mathrm d x}`, arrows: { 'y-1': '÷ y^(2/3) on both sides' },
              why: String.raw`Dividing by $y^{2/3}$ puts all $y$ on the left; $1/y^{2/3} = y^{-2/3}$. Allowed only for $y \ne 0$.` },
            { kind: 'calculus', label: 'Integrate both sides', from: String.raw`y^{-2/3}\,\mathrm d y = 3\,\mathrm d x`, to: String.raw`3y^{1/3} = 3x + \T{C-1}{C}`, why: String.raw`Power rule: $\int y^{-2/3}\,\mathrm d y = \frac{y^{1/3}}{1/3} = 3y^{1/3}$.` },
            { kind: 'sub', label: String.raw`Initial condition $y(0) = 1$`, from: String.raw`3\,\T{y-2}{y^{1/3}} = 3\,\T{x-1}{x} + C\qquad\qquad x = \T{z-1}{0},\ y = \T{o-1}{1}`, to: String.raw`3\cdot\T{o-1}{1^{1/3}} = 3\cdot\T{z-1}{0} + C`, arrows: { 'z-1': 'x = 0', 'o-1': 'y = 1' },
              why: String.raw`We put $x = 0$ and $y = 1$ in.` },
            { kind: 'calc', label: String.raw`$3\cdot 1 = 0 + C$`, from: String.raw`3\cdot 1 = 0 + C`, to: String.raw`\T{C-2}{C} = 3`, why: String.raw`$1^{1/3} = 1$.` },
            { kind: 'sub', label: String.raw`Put $C = 3$ back`, from: String.raw`3y^{1/3} = 3x + \T{C-3}{C}\qquad\qquad C = \T{t-1}{3}`, to: String.raw`3y^{1/3} = 3x + \T{t-1}{3}`, arrows: { 't-1': 'C = 3' }, why: String.raw`The solution through $(0, 1)$.` },
            { kind: 'both', label: String.raw`Both sides $\div\, 3$`, to: String.raw`y^{1/3} = x + \T{t-1}{1}`, why: String.raw`Every term has a factor $3$.` },
            { kind: 'both', label: 'Cube both sides', to: String.raw`y = (x + \T{t-1}{1})^3`, why: String.raw`$\big(y^{1/3}\big)^3 = y$. This holds near $x = 0$.` },
            { kind: 'result', label: String.raw`Evaluate at $x = 1$`, from: String.raw`y(1) = (1 + 1)^3`, to: String.raw`y(1) = 2^3 = 8`,
              why: String.raw`(Away from $y = 0$ the theorem applies, so this solution is unique there.)` },
          ] },
        ] },
      ],
    },
  ],
};
