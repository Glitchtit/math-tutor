// Module 15: First-order differential equations

export default {
  id: 'ode-first',
  number: 15,
  part: 'odes',
  hw: 'HW3',
  title: 'First-order differential equations',
  summary: 'What an ODE and a solution are; slope fields and Euler\'s method; separable equations (explicit and implicit solutions, initial conditions); linear equations with an integrating factor; existence and uniqueness; slope fields with meshgrid + quiver and numerical solutions with ode45.',
  intro: String.raw`<p>A <b>differential equation</b> relates an unknown function to its derivatives. It is the natural language of change: the rate at which a tank drains, a capacitor charges or a population grows depends on the current state. This module shows a first-order equation $y' = F(x, y)$ three ways — as a field of slopes you can follow with your finger, as a step-by-step numerical recipe, and as a formula obtained by separating variables or with an integrating factor — and how to do all three in MATLAB.</p><p>Each lesson adds one idea. The two solution methods always follow a fixed list of moves: <b>separable</b> — separate, integrate both sides, one constant, solve for $y$, initial condition; <b>linear</b> — standard form, $p(x)$, integrating factor, multiply, recognise the product, integrate, solve for $y$, initial condition.</p>`,
  lessons: [
    {
      id: 'slope-fields',
      title: 'ODEs, solutions and slope fields',
      blocks: [
        { type: 'text', html: String.raw`<p>The equation $y' = x - y$ prescribes, at every point $(x, y)$ of the plane, the slope that a solution curve passing through that point must have. For example at $(2, 0)$ the slope must be $2 - 0 = 2$. Drawing a short segment with that slope at many points gives the <b>slope field</b>. Click anywhere to start a solution curve there: it follows the segments like a leaf on a stream.</p>` },
        { type: 'widget', name: 'slopefield', config: {
          title: "Slope field of y' = x − y",
          F: 'x - y', initial: [[0, 1], [0, -2], [-2, 3]],
          xlim: [-3, 4], ylim: [-4, 4],
          hint: String.raw`Click to add solution curves. Every curve approaches the line $y = x - 1$ (itself a solution) as $x$ grows.`,
        } },
        { type: 'callout', kind: 'def', title: 'Vocabulary', html: String.raw`<ul><li>An <b>ordinary differential equation</b> (ODE) involves an unknown function $y(x)$ of one variable and its derivatives $y', y'', y''', \dots$. Its <b>order</b> is the highest derivative that appears.</li><li>A <b>solution</b> on an interval $I$ is a differentiable function that satisfies the equation at every $x \in I$.</li><li>The <b>general solution</b> contains arbitrary constants (one per order). An <b>initial value problem</b> (IVP) adds a condition $y(x_0) = y_0$ that selects one curve.</li><li>The equation is <b>linear</b> if $y, y', y'', \dots$ appear only to the first power, are not multiplied with each other, and are multiplied only by functions of $x$: e.g. $y' + p(x)y = q(x)$. Anything like $y^2$, $y\,y'$, $(y')^4$, $\sin y$, $e^y$ makes it <b>nonlinear</b>.</li></ul>` },
        { type: 'steps', title: 'Worked example: order and linearity of two equations', steps: [
          { do: String.raw`(1) $\; y'' + x^2 y' - 5y = \sin x$: the derivatives present are $y''$, $y'$, $y$`, why: 'List every derivative of the unknown y that appears.' },
          { do: String.raw`Highest: $y''$ $\;\Rightarrow\;$ order $2$`, why: 'The order is the highest derivative, not the highest power.' },
          { do: String.raw`Coefficients $1$, $x^2$, $-5$ depend only on $x$; no $y^2$, no $y\,y'$ $\;\Rightarrow\;$ linear`, why: String.raw`Each of $y'', y', y$ appears to the first power, multiplied by a function of $x$. The right side $\sin x$ contains no $y$, which is allowed.` },
          { do: String.raw`(2) $\; y' + y^2 = x$: highest derivative $y'$ $\;\Rightarrow\;$ order $1$`, why: 'Only the first derivative appears.' },
          { do: String.raw`$y^2$ is a power of the unknown $\;\Rightarrow\;$ nonlinear`, why: 'A single nonlinear term is enough.' },
        ] },
        { type: 'guided', title: 'Order and linearity', problem: String.raw`Classify $\;y''' - 4y'' + \cos(x)\,y = e^x\;$ and $\;y\,y' = x$.`, steps: [
          { prompt: String.raw`What is the order of $y''' - 4y'' + \cos(x)\,y = e^x$?`, ask: { kind: 'numeric', answer: '3' }, hint: 'Which is the highest derivative of y?', reveal: String.raw`The highest derivative is $y'''$: order $3$.` },
          { prompt: 'Is it linear?', ask: { kind: 'choice', choices: ['yes', 'no'], answer: 0 }, hint: String.raw`Look at each term: is $y$ or a derivative raised to a power or multiplied by another one? $\cos(x)$ only depends on $x$.`, reveal: String.raw`Yes: coefficients $1, -4, \cos x$ depend only on $x$, and $e^x$ contains no $y$.` },
          { prompt: String.raw`Is $y\,y' = x$ linear?`, ask: { kind: 'choice', choices: ['yes', 'no'], answer: 1 }, hint: String.raw`The unknown $y$ multiplies its own derivative.`, reveal: String.raw`No: the product $y\,y'$ makes it nonlinear (order 1).` },
        ] },
        { type: 'quiz', question: String.raw`What is the order of $y''' + x\,(y')^4 = \sin y$, and is it linear?`, choices: ['order 3, linear', 'order 3, nonlinear', 'order 4, nonlinear', 'order 4, linear'], answer: 1, explain: String.raw`The highest derivative is $y'''$ (order 3). The power $(y')^4$ and $\sin y$ make it nonlinear; the exponent 4 is not the order.` },
      ],
    },
    {
      id: 'verify-solutions',
      title: 'Checking a solution and using an initial condition',
      blocks: [
        { type: 'text', html: String.raw`<p>To check that a formula solves an ODE, you do not need to know how it was found: compute both sides of the equation with the formula and compare. The arbitrary constant $C$ is then fixed by the initial condition.</p>` },
        { type: 'derive', title: String.raw`Worked example: check that $y = x - 1 + Ce^{-x}$ solves $y' = x - y$, then solve the IVP $y(0) = 1$`, steps: [
          { kind: 'calculus', label: 'Left side: differentiate', from: String.raw`y = x - 1 + Ce^{-x}`, to: String.raw`y' = \T{L-1}{1 - Ce^{-x}}`,
            why: String.raw`Differentiate term by term: $(x)' = 1$, $(-1)' = 0$, $(Ce^{-x})' = -Ce^{-x}$ (chain rule).` },
          { kind: 'sub', label: 'Right side: put the formula in for $y$', from: String.raw`x - \T{y-1}{y}\qquad y = \T{y-2}{x - 1 + Ce^{-x}}`, to: String.raw`x - (\T{y-2}{x - 1 + Ce^{-x}})`, arrows: { 'y-2': 'replaces y' },
            why: 'Put the same formula into the right-hand side, in brackets.' },
          { kind: 'expand', label: 'Remove the bracket', to: String.raw`\T{x-1}{x} - \T{x-2}{x} + 1 - Ce^{-x}`,
            why: 'The minus sign in front of the bracket changes every sign inside.' },
          { kind: 'cancel', label: String.raw`$x - x = 0$`, to: String.raw`\T{R-1}{1 - Ce^{-x}}`,
            why: String.raw`$x$ and $-x$ cancel.` },
          { kind: 'check', label: 'Compare both sides', from: String.raw`y' = \T{L-1}{1 - Ce^{-x}}\qquad x - y = \T{R-1}{1 - Ce^{-x}}`, to: String.raw`y' = x - y\ \checkmark\quad\text{for every } x \text{ and every } C`,
            why: String.raw`Both sides equal $1 - Ce^{-x}$, so every member of the family is a solution. $C = 0$ gives the straight line $y = x - 1$ seen in the slope field.` },
          { kind: 'sub', label: String.raw`Initial condition: $x = 0$, $y = 1$`, from: String.raw`y = x - 1 + Ce^{-x}\qquad x = \T{x-1}{0},\ y = \T{y-1}{1}`, to: String.raw`\T{y-1}{1} = \T{x-1}{0} - 1 + Ce^{0}`, arrows: { 'x-1': 'x = 0', 'y-1': 'y = 1' },
            why: String.raw`Put $x = 0$ into the formula; the condition says $y(0)$ must equal $1$.` },
          { kind: 'calc', label: String.raw`$e^0 = 1$`, to: String.raw`1 = C - \T{o-1}{1}`,
            why: String.raw`$0 - 1 + C\cdot 1 = C - 1$.` },
          { kind: 'both', label: String.raw`Both sides $+1$`, to: String.raw`C = 2`, arrows: {},
            why: String.raw`Adding $1$ to both sides removes the $-1$ on the right: $1 + 1 = C$.` },
          { kind: 'result', label: 'Put the constant back', from: String.raw`y = x - 1 + \T{C-1}{C}e^{-x}`, to: String.raw`y = x - 1 + \T{C-1}{2}e^{-x}`,
            why: 'Put the constant back into the general solution.' },
        ] },
        { type: 'guided', title: String.raw`$y = Ce^{2x} - 1$ and $y' = 2y + 2$`, problem: String.raw`The family $y = Ce^{2x} - 1$ solves $y' = 2y + 2$. Find the solution with $y(0) = 4$ and compute $y(1)$.`, steps: [
          { prompt: '<b>Check.</b> Compare both sides:', show: String.raw`$y' = 2Ce^{2x}$ and $2y + 2 = 2(Ce^{2x} - 1) + 2 = 2Ce^{2x}$ ✓`, why: 'Both sides agree, so the family solves the equation.' },
          { prompt: String.raw`Put $x = 0$ into the formula: $y(0) = C + a$. What is $a$?`, ask: { kind: 'numeric', answer: '-1' }, hint: String.raw`$e^0 = 1$.`, reveal: String.raw`$y(0) = C\cdot 1 - 1 = C - 1$.` },
          { prompt: String.raw`Solve $C - 1 = 4$. What is $C$?`, ask: { kind: 'numeric', answer: '5' }, hint: String.raw`Add $1$ to both sides.`, reveal: String.raw`$C = 5$, so $y = 5e^{2x} - 1$.` },
          { prompt: String.raw`Compute $y(1)$ (MATLAB: <code>exp(2)</code>):`, ask: { kind: 'numeric', answer: '5*exp(2) - 1' }, hint: String.raw`$5e^{2\cdot 1} - 1$.`, reveal: String.raw`$y(1) = 5e^2 - 1 \approx 35.95$.` },
        ] },
        { type: 'quiz', question: String.raw`Which function solves $y' = 2y$, $y(0) = 3$?`, choices: [String.raw`$y = 3 + 2x$`, String.raw`$y = 3e^{2x}$`, String.raw`$y = e^{2x} + 2$`, String.raw`$y = 2e^{3x}$`], answer: 1, explain: String.raw`$(3e^{2x})' = 6e^{2x} = 2\cdot 3e^{2x}$ and $3e^0 = 3$. The third option satisfies the initial condition but $y' = 2e^{2x} \ne 2y$.` },
      ],
    },
    {
      id: 'equilibria',
      title: 'Equilibria: constant solutions and stability',
      blocks: [
        { type: 'callout', kind: 'def', title: 'Equilibrium', html: String.raw`<p>If $F$ depends only on $y$ (an <b>autonomous</b> equation $y' = F(y)$), the segments of the slope field are the same along every horizontal line. A number $y^*$ with $F(y^*) = 0$ gives a constant solution $y = y^*$, an <b>equilibrium</b> (slope $0$, so the solution never moves). It is <b>stable</b> if nearby solutions move towards it and <b>unstable</b> if they move away. You find out by checking the <b>sign</b> of $F$ just above and just below $y^*$: positive means $y$ increases, negative means $y$ decreases.</p>` },
        { type: 'widget', name: 'slopefield', config: {
          title: "y' = 8 − 2y: every solution approaches 4",
          F: '8 - 2*y', initial: [[0, 7], [0, 1], [0, 4]],
          xlim: [-1, 4], ylim: [-1, 8],
          hint: String.raw`Above $y = 4$ the segments point down, below it they point up. Click to add curves.`,
        } },
        { type: 'derive', title: String.raw`Worked example: the equilibrium of $y' = 8 - 2y$`, steps: [
          { kind: 'start', label: String.raw`Slope zero: $y' = 0$`, from: String.raw`y' = 8 - 2y`, to: String.raw`0 = 8 - \T{y-1}{2y}`,
            why: 'An equilibrium is a constant solution, so its slope y′ is zero.' },
          { kind: 'both', label: String.raw`Both sides $+2y$`, to: String.raw`\T{y-1}{2y} = 8`, arrows: { 'y-1': '+2y on both sides' },
            why: String.raw`Adding $2y$ to both sides cancels $-2y$ on the right and makes $+2y$ appear on the left.` },
          { kind: 'both', label: String.raw`Both sides $\div 2$`, to: String.raw`y^* = 4`,
            why: String.raw`$8 \div 2 = 4$.` },
          { kind: 'sub', label: String.raw`Test above: $y = 5$`, from: String.raw`y' = 8 - 2\T{y-1}{y}\qquad y = \T{y-2}{5}`, to: String.raw`y' = 8 - 2\cdot\T{y-2}{5} = -2 < 0`, arrows: { 'y-2': 'y = 5' },
            why: 'Test a number just above 4: the slope is negative, so solutions above 4 decrease — towards 4.' },
          { kind: 'sub', label: String.raw`Test below: $y = 3$`, from: String.raw`y' = 8 - 2\T{y-1}{y}\qquad y = \T{y-2}{3}`, to: String.raw`y' = 8 - 2\cdot\T{y-2}{3} = 2 > 0`, arrows: { 'y-2': 'y = 3' },
            why: 'Test a number just below: positive slope, so solutions below 4 increase — towards 4.' },
          { kind: 'result', label: 'Stable', to: String.raw`y^* = 4\ \text{is stable: every solution} \to 4\ \text{as } x \to \infty`,
            why: String.raw`Arrows point towards 4 from both sides. (The general solution $y = 4 + Ce^{-2x}$ confirms it: $Ce^{-2x} \to 0$.)` },
        ] },
        { type: 'guided', title: String.raw`The equilibrium of $y' = 3y - 6$`, problem: String.raw`Find the equilibrium of $y' = 3y - 6$ and decide whether it is stable.`, steps: [
          { prompt: 'Set the slope to zero. The equilibrium is $y^* = $', ask: { kind: 'numeric', answer: '2' }, hint: String.raw`Solve $3y - 6 = 0$.`, reveal: String.raw`$3y = 6$, $y^* = 2$.` },
          { prompt: String.raw`Test just above: the slope at $y = 3$ is`, ask: { kind: 'numeric', answer: '3' }, hint: String.raw`$3\cdot 3 - 6$.`, reveal: String.raw`$y' = 3 > 0$: solutions above $2$ increase, i.e. move away from $2$. (At $y = 1$: $y' = -3$, solutions below move down, also away.)` },
          { prompt: 'So the equilibrium is …', ask: { kind: 'choice', choices: ['stable', 'unstable'], answer: 1 }, hint: 'Do nearby solutions move towards it or away?', reveal: 'Unstable: solutions move away on both sides.' },
        ] },
        { type: 'callout', kind: 'key', html: String.raw`<p>Reading a slope field: where $F(x, y) = 0$ the segments are horizontal (the <b>nullcline</b>; for $y' = x - y$ it is the line $y = x$). For autonomous equations the nullclines are horizontal lines — the equilibria.</p>` },
      ],
    },
    {
      id: 'euler',
      title: "Euler's method by hand",
      blocks: [
        { type: 'text', html: String.raw`<p>Following the slope field with finite steps is <b>Euler's method</b>: from the current point, walk a step $h$ along the tangent line, then read the new slope. Increase the number of steps $n$ and watch the polygon approach the exact solution of $y' = x + y$, $y(0) = 1$.</p>` },
        { type: 'widget', name: 'euler', config: {
          title: "Euler's method for y' = x + y, y(0) = 1",
          F: 'x + y', x0: 0, y0: 1, xEnd: 1, exact: '2*exp(x) - x - 1',
          xlim: [-0.1, 1.1], ylim: [0.5, 4],
        } },
        { type: 'callout', kind: 'def', title: "Euler's method", html: String.raw`<p>For $y' = F(x, y)$, $y(x_0) = y_0$ and step $h$:
$$x_{n+1} = x_n + h, \qquad y_{n+1} = y_n + h\,F(x_n, y_n).$$
In words: <b>new $y$ = old $y$ + step × slope at the old point</b>. Each step is two small calculations: the slope, then the new $y$. To reach $x = 1$ from $x = 0$ with step $h$ you need $1/h$ steps.</p>` },
        { type: 'steps', title: String.raw`Worked example: two Euler steps for $y' = x + y$, $y(0) = 1$, $h = 0.5$`, steps: [
          { do: String.raw`$F(x, y) = x + y,\quad x_0 = 0,\ y_0 = 1,\ h = 0.5$`, why: String.raw`Write down the slope function and the starting point. Two steps of $0.5$ reach $x = 1$.` },
          { do: String.raw`$F(x_0, y_0) = F(0, 1) = 0 + 1 = 1$`, why: 'Step 1a: the slope at the current point.' },
          { do: String.raw`$y_1 = 1 + 0.5\cdot 1 = 1.5,\quad x_1 = 0.5$`, why: 'Step 1b: old y + step × slope.' },
          { do: String.raw`$F(x_1, y_1) = F(0.5, 1.5) = 0.5 + 1.5 = 2$`, why: 'Step 2a: the slope at the NEW point.' },
          { do: String.raw`$y_2 = 1.5 + 0.5\cdot 2 = 2.5,\quad x_2 = 1$`, why: 'Step 2b.' },
          { do: String.raw`$y(1) \approx 2.5$`, why: String.raw`We have reached $x = 1$. (The exact value is $2e - 2 \approx 3.437$; next lesson looks at the error.)` },
        ] },
        { type: 'guided', title: String.raw`Two Euler steps for $y' = xy + 2$, $y(0) = 1$, $h = 0.5$`, problem: String.raw`Approximate $y(1)$ for $y' = xy + 2$, $y(0) = 1$, with $h = 0.5$.`, steps: [
          { prompt: String.raw`Step 1a: the slope $F(0, 1) = 0\cdot 1 + 2$ is`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`Put $x = 0$, $y = 1$ into $xy + 2$.`, reveal: String.raw`$F(0, 1) = 2$.` },
          { prompt: String.raw`Step 1b: $y_1 = y_0 + h\cdot F = ?$`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`$1 + 0.5\cdot 2$.`, reveal: String.raw`$y_1 = 2$ at $x_1 = 0.5$.` },
          { prompt: String.raw`Step 2a: the slope at the new point, $F(0.5, 2)$:`, ask: { kind: 'numeric', answer: '3' }, hint: String.raw`$0.5\cdot 2 + 2$.`, reveal: String.raw`$F(0.5, 2) = 3$.` },
          { prompt: String.raw`Step 2b: $y_2 \approx y(1) = ?$`, ask: { kind: 'numeric', answer: '3.5' }, hint: String.raw`$2 + 0.5\cdot 3$.`, reveal: String.raw`$y_2 = 3.5$.` },
        ], finale: 'Always: slope at the old point, then old y + h × slope, then move x by h.' },
      ],
    },
    {
      id: 'euler-error',
      title: "Euler's method: smaller steps and the error",
      blocks: [
        { type: 'callout', kind: 'key', title: 'How accurate is Euler?', html: String.raw`<p>The error at a fixed end point is roughly proportional to $h$ (a <b>first-order</b> method): <b>halving $h$ roughly halves the error</b>. The error is <i>true value − approximation</i>. MATLAB's <code>ode45</code> is a fifth-order method with adaptive step size, far more accurate.</p>` },
        { type: 'steps', title: String.raw`Worked example: $y' = x + y$, $y(0) = 1$ with $h = 0.25$ (four steps), and the error`, steps: [
          { do: String.raw`$y_1 = 1 + 0.25\,(0 + 1) = 1.25$`, why: String.raw`Slope at $(0, 1)$ is $1$; $x_1 = 0.25$.` },
          { do: String.raw`$y_2 = 1.25 + 0.25\,(0.25 + 1.25) = 1.25 + 0.375 = 1.625$`, why: String.raw`Slope at $(0.25, 1.25)$ is $1.5$; $x_2 = 0.5$.` },
          { do: String.raw`$y_3 = 1.625 + 0.25\,(0.5 + 1.625) = 1.625 + 0.53125 = 2.15625$`, why: String.raw`Slope at $(0.5, 1.625)$ is $2.125$; $x_3 = 0.75$.` },
          { do: String.raw`$y_4 = 2.15625 + 0.25\,(0.75 + 2.15625) = 2.15625 + 0.7265625 = 2.8828125$`, why: String.raw`Slope at $(0.75, 2.15625)$ is $2.90625$; $x_4 = 1$.` },
          { do: String.raw`True value $y(1) = 2e - 2 \approx 3.4366$`, why: String.raw`From the exact solution $y = 2e^x - x - 1$ (check: $y' = 2e^x - 1 = x + y$).` },
          { do: String.raw`Errors: $h = 0.5$: $3.4366 - 2.5 = 0.9366$; $\;h = 0.25$: $3.4366 - 2.8828 = 0.5537$`, why: 'Error = true value − Euler value, for the previous lesson’s result and this one.' },
          { do: String.raw`Ratio $0.9366 / 0.5537 \approx 1.7 \approx 2$`, why: 'Halving h roughly halved the error, as expected for a first-order method.' },
        ] },
        { type: 'guided', title: String.raw`$y' = xy + 2$, $y(0) = 1$ with $h = 0.25$`, problem: String.raw`Repeat the guided exercise of the previous lesson with $h = 0.25$ (four steps). The true value is $y(1) \approx 4.4701$.`, steps: [
          { prompt: String.raw`$y_1 = 1 + 0.25\cdot F(0, 1) = ?$`, ask: { kind: 'numeric', answer: '1.5' }, hint: String.raw`$F(0, 1) = 2$.`, reveal: String.raw`$y_1 = 1 + 0.25\cdot 2 = 1.5$ at $x_1 = 0.25$.` },
          { prompt: String.raw`$y_2 = 1.5 + 0.25\cdot F(0.25, 1.5) = ?$`, ask: { kind: 'numeric', answer: '2.09375', tol: 1e-6 }, hint: String.raw`$F(0.25, 1.5) = 0.375 + 2 = 2.375$.`, reveal: String.raw`$y_2 = 1.5 + 0.59375 = 2.09375$ at $x_2 = 0.5$.` },
          { prompt: String.raw`Two more steps the same way:`, show: String.raw`$y_3 = 2.09375 + 0.25\,(0.5\cdot 2.09375 + 2) = 2.85546875$, $\quad y_4 = 2.85546875 + 0.25\,(0.75\cdot 2.85546875 + 2) \approx 3.89087$` },
          { prompt: String.raw`With $h = 0.5$ we got $3.5$ (error $\approx 0.970$); with $h = 0.25$, $3.8909$ (error $\approx 0.579$). The error shrank by a factor of about …`, ask: { kind: 'choice', choices: ['1', '2', '4', '16'], answer: 1 }, hint: String.raw`$0.970 / 0.579$.`, reveal: String.raw`About $1.7$, i.e. roughly $2$ — halving $h$ about halves the error.` },
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
        { type: 'callout', kind: 'def', title: 'Separable equation', html: String.raw`<p>An equation of the form $\dfrac{\mathrm d y}{\mathrm d x} = g(x)\,h(y)$ — the right side <b>factors</b> into a function of $x$ times a function of $y$. Where $h(y) \ne 0$:
$$\int \frac{\mathrm d y}{h(y)} = \int g(x)\,\mathrm d x + C .$$
The five moves: <b>(1)</b> separate, <b>(2)</b> integrate both sides, <b>(3)</b> one constant $C$, <b>(4)</b> solve for $y$, <b>(5)</b> initial condition. Every zero $y = y^*$ of $h$ gives a <b>constant solution</b> that division by $h(y)$ loses.</p>` },
        { type: 'refresher', title: String.raw`getting $y$ out of $\ln|y| = \dots$`, html: String.raw`<p>To free $y$ from inside $\ln$, raise $e$ to both sides; then use $e^{a+b} = e^a e^b$.</p>`, steps: [
          { do: String.raw`$\ln|y| = -x^2 + C_1$`, why: 'The typical result of integrating dy/y.' },
          { do: String.raw`$|y| = e^{-x^2 + C_1} = e^{C_1}\,e^{-x^2}$`, why: String.raw`$e^{\ln|y|} = |y|$, and the exponent rule splits the sum.` },
          { do: String.raw`$y = \pm e^{C_1}\,e^{-x^2} = C e^{-x^2}$`, why: String.raw`Removing the absolute value gives $\pm$. The number $\pm e^{C_1}$ is just some constant: call it $C$.` },
        ] },
        { type: 'derive', title: String.raw`Worked example: $y' = -2xy$, $y(0) = 3$`, steps: [
          { kind: 'factor', label: String.raw`Check: $g(x)\cdot h(y)$`, from: String.raw`\frac{\mathrm d y}{\mathrm d x} = -2xy`, to: String.raw`\frac{\mathrm d y}{\mathrm d x} = (-2x)\cdot \T{y-1}{y}`,
            why: String.raw`It is separable: $g(x) = -2x$ times $h(y) = y$.` },
          { kind: 'both', label: String.raw`Move 1a: both sides $\div y$ ($y \ne 0$)`, to: String.raw`\frac{1}{\T{y-1}{y}}\,\frac{\mathrm d y}{\mathrm d x} = -2x`, arrows: { 'y-1': '÷ y on both sides' },
            why: String.raw`Dividing both sides by $y$ cancels it on the right and puts $\frac1y$ on the left: now only $y$ is on the left.` },
          { kind: 'both', label: String.raw`Move 1b: both sides $\times\,\mathrm d x$`, from: String.raw`\frac{1}{y}\,\frac{\mathrm d y}{\T{dx-1}{\mathrm d x}} = -2x`, to: String.raw`\frac{\mathrm d y}{y} = -2x\,\T{dx-1}{\mathrm d x}`, arrows: { 'dx-1': '× dx on both sides' },
            why: String.raw`Multiplying both sides by $\mathrm d x$ cancels it under $\mathrm d y$ and puts it next to the $x$ terms. Only $y$ on the left, only $x$ on the right.` },
          { kind: 'calculus', label: 'Move 2: integrate both sides', to: String.raw`\int\frac{\mathrm d y}{y} = \int -2x\,\mathrm d x`,
            why: 'Doing the same thing to both sides keeps them equal.' },
          { kind: 'calculus', label: 'Move 3: one constant', to: String.raw`\ln|y| = -x^2 + C_1`,
            why: String.raw`Two constants (one per side) combine into one, $C_1$, written on the $x$ side.` },
          { kind: 'both', label: String.raw`Move 4a: $e^{(\cdot)}$ of both sides`, to: String.raw`|y| = e^{-x^2 + C_1}`,
            why: String.raw`$e^{\ln|y|} = |y|$ (refresher). Applying the same function to both sides keeps them equal.` },
          { kind: 'calc', label: String.raw`$e^{a+b} = e^a e^b$`, to: String.raw`|y| = \T{k-1}{e^{C_1}}\,e^{-x^2}`,
            why: 'The exponent rule splits the sum.' },
          { kind: 'calc', label: 'Remove the absolute value', to: String.raw`y = \T{k-1}{\pm e^{C_1}}\,e^{-x^2}`,
            why: String.raw`$|y| = a$ means $y = \pm a$.` },
          { kind: 'sub', label: String.raw`Call the constant $C$`, to: String.raw`y = \T{k-1}{C}\,e^{-x^2}`,
            why: String.raw`$\pm e^{C_1}$ is just some constant: call it $C$. $C = 0$ gives the lost solution $y = 0$, so the formula contains all solutions.` },
          { kind: 'sub', label: String.raw`Move 5: $x = 0$, $y = 3$`, from: String.raw`y = C e^{-x^2}\qquad x = \T{x-1}{0},\ y = \T{y-1}{3}`, to: String.raw`\T{y-1}{3} = C e^{-\T{x-1}{0}^2} = C`, arrows: { 'x-1': 'x = 0', 'y-1': 'y = 3' },
            why: String.raw`$e^0 = 1$.` },
          { kind: 'result', label: 'The solution of the IVP', from: String.raw`y = \T{C-1}{C}\,e^{-x^2}`, to: String.raw`y = \T{C-1}{3}\,e^{-x^2}`,
            why: 'Put the constant back.' },
        ] },
        { type: 'guided', title: String.raw`$y' = 3x^2 y$, $y(0) = 2$`, problem: String.raw`Solve $y' = 3x^2 y$, $y(0) = 2$.`, steps: [
          { prompt: '<b>Move 1.</b> Separate:', show: String.raw`$\dfrac{\mathrm d y}{y} = 3x^2\,\mathrm d x$` },
          { prompt: String.raw`<b>Moves 2–3.</b> The left side integrates to $\ln|y|$. What is $\int 3x^2\,\mathrm d x$ (without the constant)?`, ask: { kind: 'expression', variable: 'x', answer: 'x.^3', upToConstant: true, label: '∫ 3x² dx =' }, hint: 'Power rule.', reveal: String.raw`$\ln|y| = x^3 + C_1$.` },
          { prompt: String.raw`<b>Move 4</b> gives $y = Ce^{x^3}$. <b>Move 5:</b> what is $C$?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`Put $x = 0$: $e^0 = 1$.`, reveal: String.raw`$2 = Ce^0$, so $C = 2$ and $y = 2e^{x^3}$.` },
          { prompt: String.raw`Compute $y(1)$:`, ask: { kind: 'numeric', answer: '2*exp(1)' }, hint: String.raw`$2e^{1^3}$.`, reveal: String.raw`$y(1) = 2e \approx 5.437$.` },
        ] },
        { type: 'callout', kind: 'warn', html: String.raw`<p>Keep the constant in the right place. From $\ln|y| = x^2 + C$ we get $y = Ae^{x^2}$, <b>not</b> $y = e^{x^2} + C$. Introduce $C$ at the moment you integrate, and carry it through every later step.</p>` },
        { type: 'quiz', question: String.raw`Which equation is <b>not</b> separable?`, choices: [String.raw`$y' = e^{x+y}$`, String.raw`$y' = x y^2 + x$`, String.raw`$y' = \sin(xy)$`, String.raw`$x y' = y \ln x$`], answer: 2, explain: String.raw`$e^{x+y} = e^x e^y$, $xy^2 + x = x(y^2+1)$ and $y' = y\ln x/x$ all factor as $g(x)h(y)$; $\sin(xy)$ does not.` },
      ],
    },
    {
      id: 'separable-roots',
      title: 'Separable equations with a square root: sign, limit and interval',
      blocks: [
        { type: 'text', html: String.raw`<p>When the $y$ side is $y\,\mathrm d y$, integrating gives $\frac{y^2}{2}$, and move 4 needs a square root. Three extra questions then come up: which <b>sign</b> of the root, what happens as $x \to \infty$, and on which <b>interval</b> the solution exists (the expression under the root must stay positive).</p>` },
        { type: 'refresher', title: String.raw`square roots and inequalities with $e^{-kx}$`, html: String.raw`<ul><li>$y^2 = A$ has two solutions $y = \pm\sqrt A$. The initial value decides: if $y(x_0) > 0$, take $+$.</li><li>To solve $e^{-2x} < 2$: take $\ln$ of both sides ($\ln$ is increasing, so $<$ stays $<$): $-2x < \ln 2$. Then divide by $-2$, which <b>flips</b> the sign: $x > -\frac{\ln 2}{2}$.</li><li>As $x \to \infty$, $e^{-2x} \to 0$.</li></ul>` },
        { type: 'derive', title: String.raw`Worked example: $e^{2x}\,y\,y' = 1$, $y(0) = 1$`, steps: [
          { kind: 'both', label: String.raw`Both sides $\div e^{2x}$`, from: String.raw`\T{e-1}{e^{2x}}\,y\,\frac{\mathrm d y}{\mathrm d x} = 1`, to: String.raw`y\,\frac{\mathrm d y}{\mathrm d x} = \frac{1}{\T{e-1}{e^{2x}}} = e^{-2x}`, arrows: { 'e-1': '÷ e^{2x} on both sides' },
            why: String.raw`Dividing both sides by $e^{2x}$ moves it to the right as $\frac{1}{e^{2x}} = e^{-2x}$.` },
          { kind: 'both', label: String.raw`Move 1: both sides $\times\,\mathrm d x$`, from: String.raw`y\,\frac{\mathrm d y}{\T{dx-1}{\mathrm d x}} = e^{-2x}`, to: String.raw`y\,\mathrm d y = e^{-2x}\,\T{dx-1}{\mathrm d x}`, arrows: { 'dx-1': '× dx on both sides' },
            why: String.raw`The $y$'s are already on the left; multiplying by $\mathrm d x$ separates the variables.` },
          { kind: 'calculus', label: 'Moves 2–3: integrate both sides, one constant', to: String.raw`\frac{y^2}{2} = -\frac12 e^{-2x} + C`,
            why: String.raw`$\int y\,\mathrm d y = \frac{y^2}{2}$ and $\int e^{-2x}\,\mathrm d x = -\frac12 e^{-2x}$.` },
          { kind: 'sub', label: String.raw`Move 5 first: $x = 0$, $y = 1$`, from: String.raw`\frac{y^2}{2} = -\frac12 e^{-2x} + C\qquad x = \T{x-1}{0},\ y = \T{y-1}{1}`, to: String.raw`\frac{\T{y-1}{1}^2}{2} = -\frac12 e^{\T{x-1}{0}} + C`, arrows: { 'x-1': 'x = 0', 'y-1': 'y = 1' },
            why: 'The initial condition can be used before solving for y.' },
          { kind: 'calc', label: String.raw`$e^0 = 1$`, to: String.raw`\frac12 = -\T{h-1}{\frac12} + C`,
            why: String.raw`$1^2 = 1$ and $e^0 = 1$.` },
          { kind: 'both', label: String.raw`Both sides $+\frac12$`, to: String.raw`C = 1`,
            why: String.raw`$\frac12 + \frac12 = 1$.` },
          { kind: 'both', label: String.raw`Both sides $\times 2$`, from: String.raw`\frac{y^2}{\T{t-1}{2}} = -\frac12 e^{-2x} + 1`, to: String.raw`y^2 = 2 - e^{-2x}`, arrows: {},
            why: String.raw`Multiply every term by $2$: $2\cdot\big(-\frac12\big) = -1$ and $2\cdot 1 = 2$.` },
          { kind: 'both', label: String.raw`Move 4: square root of both sides`, to: String.raw`y = +\sqrt{2 - e^{-2x}}`,
            why: String.raw`$y^2 = A$ gives $y = \pm\sqrt A$; $y(0) = 1 > 0$ picks the $+$ sign.` },
          { kind: 'sub', label: String.raw`Evaluate at $x = 1$`, from: String.raw`y = \sqrt{2 - e^{-2\T{x-1}{x}}}\qquad x = \T{x-2}{1}`, to: String.raw`y(1) = \sqrt{2 - e^{-2\cdot\T{x-2}{1}}} \approx 1.3655`, arrows: { 'x-2': 'x = 1' },
            why: String.raw`Put $x = 1$.` },
          { kind: 'cancel', label: String.raw`Let $x\to\infty$: $e^{-2x}\to 0$`, from: String.raw`\lim_{x\to\infty}\sqrt{2 - \T{a-1}{e^{-2x}}}`, to: String.raw`\lim_{x\to\infty} y = \sqrt 2`,
            why: String.raw`$e^{-2x} = 1/e^{2x} \to 0$, so that term vanishes and the root of $2$ is left.` },
          { kind: 'start', label: 'Interval: the root needs a positive argument', from: String.raw`2 - \T{e-1}{e^{-2x}} > 0`, to: String.raw`\T{e-1}{e^{-2x}} < 2`, arrows: { 'e-1': '+e^{−2x} on both sides' },
            why: String.raw`Add $e^{-2x}$ to both sides. At the end point the solution reaches $y = 0$, where $y' = e^{-2x}/y$ is undefined.` },
          { kind: 'both', label: String.raw`$\ln$ of both sides`, to: String.raw`-2x < \ln 2`,
            why: String.raw`$\ln$ is increasing, so $<$ stays $<$ (refresher).` },
          { kind: 'both', label: String.raw`Both sides $\div(-2)$: the sign flips`, to: String.raw`x > -\tfrac{\ln 2}{2}`,
            why: String.raw`Dividing by a negative number flips the inequality. So the solution lives on $\big(-\frac{\ln 2}{2}, \infty\big)$.` },
        ] },
        { type: 'guided', title: String.raw`$y\,y' = 2e^{-2x}$, $y(0) = 3$`, problem: String.raw`Solve $y\,y' = 2e^{-2x}$, $y(0) = 3$; find the limit as $x\to\infty$ and the left end of the interval of existence.`, steps: [
          { prompt: String.raw`Separate: $y\,\mathrm d y = 2e^{-2x}\,\mathrm d x$. Integrate the right side (no constant):`, ask: { kind: 'expression', variable: 'x', answer: '-exp(-2*x)', upToConstant: true, label: '∫ 2e^(−2x) dx =' }, hint: String.raw`$\int e^{-2x}\,\mathrm d x = -\frac12 e^{-2x}$; multiply by $2$.`, reveal: String.raw`$\dfrac{y^2}{2} = -e^{-2x} + C$.` },
          { prompt: String.raw`Initial condition: $\frac{9}{2} = -1 + C$. What is $C$?`, ask: { kind: 'numeric', answer: '11/2' }, hint: String.raw`Add $1$ to $\frac92$.`, reveal: String.raw`$C = \frac{11}{2}$, so $y^2 = 11 - 2e^{-2x}$.` },
          { prompt: String.raw`Solve for $y$ (which sign?):`, ask: { kind: 'expression', variable: 'x', answer: 'sqrt(11 - 2*exp(-2*x))', label: 'y(x) =' }, hint: String.raw`$y(0) = 3 > 0$.`, reveal: String.raw`$y = \sqrt{11 - 2e^{-2x}}$.` },
          { prompt: String.raw`$\displaystyle\lim_{x\to\infty} y(x) = ?$`, ask: { kind: 'numeric', answer: 'sqrt(11)' }, hint: String.raw`$e^{-2x} \to 0$.`, reveal: String.raw`$\sqrt{11} \approx 3.317$.` },
          { prompt: String.raw`The solution exists for $x > x_*$. Solve $11 - 2e^{-2x} = 0$ for $x_*$:`, ask: { kind: 'numeric', answer: '-log(11/2)/2' }, hint: String.raw`$e^{-2x} = \frac{11}{2}$, then take $\ln$ and divide by $-2$.`, reveal: String.raw`$-2x_* = \ln\frac{11}{2}$, so $x_* = -\frac12\ln\frac{11}{2} \approx -0.852$.` },
        ] },
        { type: 'derive', title: String.raw`When you cannot solve for $y$: $y' = \dfrac{x^2}{1+y^2}$, $y(0) = 1$`, steps: [
          { kind: 'both', label: String.raw`Move 1a: both sides $\times(1 + y^2)$`, from: String.raw`\frac{\mathrm d y}{\mathrm d x} = \frac{x^2}{\T{h-1}{1+y^2}}`, to: String.raw`(\T{h-1}{1+y^2})\,\frac{\mathrm d y}{\mathrm d x} = x^2`, arrows: { 'h-1': '× (1+y²) on both sides' },
            why: String.raw`Multiplying both sides by $(1 + y^2)$ cancels it on the right. Here $1 + y^2$ is never $0$, so no solutions are lost.` },
          { kind: 'both', label: String.raw`Move 1b: both sides $\times\,\mathrm d x$`, from: String.raw`(1+y^2)\,\frac{\mathrm d y}{\T{dx-1}{\mathrm d x}} = x^2`, to: String.raw`(1 + y^2)\,\mathrm d y = x^2\,\T{dx-1}{\mathrm d x}`, arrows: { 'dx-1': '× dx on both sides' },
            why: 'Only y on the left, only x on the right.' },
          { kind: 'calculus', label: 'Moves 2–3: integrate both sides, one constant', to: String.raw`y + \frac{y^3}{3} = \frac{x^3}{3} + C`,
            why: 'Power rule on each side.' },
          { kind: 'sub', label: String.raw`Move 5: $x = 0$, $y = 1$`, from: String.raw`y + \frac{y^3}{3} = \frac{x^3}{3} + C\qquad x = \T{x-1}{0},\ y = \T{y-1}{1}`, to: String.raw`\T{y-1}{1} + \frac{1}{3} = \T{x-1}{0} + C`, arrows: { 'x-1': 'x = 0', 'y-1': 'y = 1' },
            why: String.raw`$1^3 = 1$ and $0^3 = 0$.` },
          { kind: 'calc', label: String.raw`$1 + \frac13 = \frac43$`, to: String.raw`C = \tfrac43`,
            why: 'Read off C.' },
          { kind: 'both', label: String.raw`Both sides $\times 3$`, from: String.raw`y + \frac{y^3}{3} = \frac{x^3}{3} + \frac43`, to: String.raw`3y + y^3 = x^3 + 4`,
            why: String.raw`Multiply every term by $3$. This <b>implicit</b> solution is an acceptable answer: solving a cubic for $y$ is possible but unhelpful.` },
          { kind: 'sub', label: String.raw`$y(1)$: put $x = 1$`, from: String.raw`3y + y^3 = \T{x-1}{x}^3 + 4\qquad x = \T{x-2}{1}`, to: String.raw`3y + y^3 = \T{x-2}{1}^3 + 4 = 5\quad\Rightarrow\quad y \approx 1.154`, arrows: { 'x-2': 'x = 1' },
            why: String.raw`Solve numerically. MATLAB: <code>fzero(@(y) 3*y + y.^3 - 5, 1)</code>.` },
        ] },
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
        { type: 'refresher', title: 'the product rule, read backwards', html: String.raw`<p>$(\mu y)' = \mu' y + \mu y'$. If $\mu = e^{x^2}$, then $\mu' = 2x e^{x^2}$ (chain rule), so
$$\big(e^{x^2}y\big)' = e^{x^2}y' + 2x e^{x^2}y = e^{x^2}\big(y' + 2xy\big).$$
That is the whole trick: multiplying $y' + 2xy$ by $e^{x^2}$ turns it into the derivative of one product.</p>` },
        { type: 'callout', kind: 'thm', title: 'Integrating factor', html: String.raw`<p>The eight moves: <b>(1)</b> write the equation in <b>standard form</b> $y' + p(x)\,y = q(x)$ (the coefficient of $y'$ must be $1$); <b>(2)</b> read off $p(x)$; <b>(3)</b> compute
$$\mu(x) = e^{\int p(x)\,\mathrm d x}$$
(any antiderivative of $p$, no constant needed); <b>(4)</b> multiply the equation by $\mu$; <b>(5)</b> recognise the left side as $(\mu y)'$; <b>(6)</b> integrate both sides, $\mu y = \int \mu q\,\mathrm d x + C$; <b>(7)</b> divide by $\mu$; <b>(8)</b> use the initial condition.</p>` },
        { type: 'derive', title: String.raw`Worked example: $y' + 2xy = x$, $y(0) = 2$`, steps: [
          { kind: 'calculus', label: String.raw`Moves 1–3: $p(x) = 2x$, $\mu = e^{\int p\,\mathrm d x}$`, from: String.raw`y' + \T{p-1}{2x}\,y = x\qquad \mu = e^{\int \T{p-2}{2x}\,\mathrm d x}`, to: String.raw`\mu = e^{\T{p-2}{x^2}}`,
            why: String.raw`Already in standard form (the coefficient of $y'$ is $1$). $p$ multiplies $y$, so $p(x) = 2x$; $q(x) = x$ is the right side. $\int 2x\,\mathrm d x = x^2$; the constant is not needed.` },
          { kind: 'both', label: String.raw`Move 4: both sides $\times e^{x^2}$`, from: String.raw`y' + 2x\,y = x`, to: String.raw`\T{m-1}{e^{x^2}}y' + 2x\,\T{m-2}{e^{x^2}}y = x\,\T{m-3}{e^{x^2}}`,
            why: String.raw`Multiply every term on both sides by $e^{x^2}$.` },
          { kind: 'factor', label: 'Move 5: the product rule backwards', to: String.raw`\big(\T{m-1}{e^{x^2}}y\big)' = x\,\T{m-3}{e^{x^2}}`,
            why: String.raw`$\big(e^{x^2}y\big)' = e^{x^2}y' + 2xe^{x^2}y$ (refresher), which is exactly the left side.` },
          { kind: 'calculus', label: 'Move 6: integrate both sides', to: String.raw`\T{m-1}{e^{x^2}}y = \int x e^{x^2}\,\mathrm d x`,
            why: 'Integrating a derivative gives back the function.' },
          { kind: 'calculus', label: String.raw`$u = x^2$ on the right`, to: String.raw`\T{m-1}{e^{x^2}}y = \tfrac12 e^{x^2} + C`,
            why: String.raw`Substitute $u = x^2$, $x\,\mathrm d x = \frac12\mathrm d u$: $\int \frac12 e^u\,\mathrm d u = \frac12 e^u$. One constant.` },
          { kind: 'both', label: String.raw`Move 7: both sides $\div e^{x^2}$`, to: String.raw`y = \tfrac12 + C\,\T{m-1}{e^{-x^2}}`, arrows: { 'm-1': '÷ e^{x²} on both sides' },
            why: String.raw`Divide every term by $e^{x^2}$: $\frac{e^{x^2}}{e^{x^2}} = 1$ and $\frac{C}{e^{x^2}} = Ce^{-x^2}$.` },
          { kind: 'sub', label: String.raw`Move 8: $x = 0$, $y = 2$`, from: String.raw`y = \tfrac12 + Ce^{-x^2}\qquad x = \T{x-1}{0},\ y = \T{y-1}{2}`, to: String.raw`\T{y-1}{2} = \tfrac12 + Ce^{-\T{x-1}{0}^2} = \tfrac12 + C`, arrows: { 'x-1': 'x = 0', 'y-1': 'y = 2' },
            why: String.raw`$e^0 = 1$.` },
          { kind: 'both', label: String.raw`Both sides $-\frac12$`, to: String.raw`C = \tfrac32`,
            why: String.raw`$2 - \frac12 = \frac32$.` },
          { kind: 'result', label: 'The solution', from: String.raw`y = \tfrac12 + \T{C-1}{C}e^{-x^2}`, to: String.raw`y = \tfrac12 + \T{C-1}{\tfrac32}e^{-x^2}`,
            why: '(This equation happens to be separable too: y′ = x(1 − 2y).)' },
        ] },
        { type: 'guided', title: String.raw`$y' + 3y = 6$, $y(0) = 0$`, problem: String.raw`Solve $y' + 3y = 6$, $y(0) = 0$ with an integrating factor.`, steps: [
          { prompt: String.raw`Moves 1–3: $p(x) = 3$. The integrating factor $\mu = e^{\int 3\,\mathrm d x}$ is`, ask: { kind: 'expression', variable: 'x', answer: 'exp(3*x)', label: 'μ(x) =' }, hint: String.raw`$\int 3\,\mathrm d x = 3x$.`, reveal: String.raw`$\mu = e^{3x}$.` },
          { prompt: String.raw`Moves 4–5 give $\big(e^{3x}y\big)' = 6e^{3x}$. Move 6: integrate the right side (no constant):`, ask: { kind: 'expression', variable: 'x', answer: '2*exp(3*x)', upToConstant: true, label: '∫ 6e^(3x) dx =' }, hint: String.raw`$\int e^{3x}\,\mathrm d x = \frac13 e^{3x}$.`, reveal: String.raw`$e^{3x}y = 2e^{3x} + C$, so (move 7) $y = 2 + Ce^{-3x}$.` },
          { prompt: String.raw`Move 8: $y(0) = 0$ gives $C = $`, ask: { kind: 'numeric', answer: '-2' }, hint: String.raw`$0 = 2 + C$.`, reveal: String.raw`$C = -2$.` },
          { prompt: 'The solution:', ask: { kind: 'expression', variable: 'x', answer: '2 - 2*exp(-3*x)', label: 'y(x) =' }, hint: 'Put C back into y = 2 + Ce^(−3x).', reveal: String.raw`$y = 2 - 2e^{-3x} = 2\big(1 - e^{-3x}\big)$.` },
        ] },
      ],
    },
    {
      id: 'linear-divide',
      title: 'Linear equations: divide first, and where the solution lives',
      blocks: [
        { type: 'text', html: String.raw`<p>Many linear equations arrive as $a(x)\,y' + b(x)\,y = c(x)$. Move 1 is then essential: <b>divide by $a(x)$</b>, otherwise the integrating factor comes out wrong. With $a(x) = x$ the integrating factor turns out to be a power of $x$.</p>` },
        { type: 'refresher', title: String.raw`$e^{k\ln x} = x^k$`, html: String.raw`<p>For $x > 0$: $\int \frac{k}{x}\,\mathrm d x = k\ln x$, and $e^{k\ln x} = e^{\ln(x^k)} = x^k$ (log rule $k\ln x = \ln x^k$, then $e^{\ln b} = b$). Examples: $e^{-\ln x} = x^{-1} = \frac1x$, $\;e^{2\ln x} = x^2$, $\;e^{3\ln x} = x^3$.</p>` },
        { type: 'derive', title: String.raw`Worked example: $x y' - y = x^3$, $y(1) = 0$, for $x > 0$`, steps: [
          { kind: 'both', label: String.raw`Move 1: every term $\div x$`, from: String.raw`\T{x-1}{x}\,y' - y = x^3`, to: String.raw`y' - \frac{1}{\T{x-1}{x}}\,y = x^2`, arrows: { 'x-1': '÷ x on both sides' },
            why: String.raw`Divide every term by $x$ (allowed since $x > 0$): $\frac{x^3}{x} = x^2$. Now the coefficient of $y'$ is $1$.` },
          { kind: 'calculus', label: String.raw`Moves 2–3: $p(x) = -\frac1x$`, from: String.raw`\mu = e^{\int p\,\mathrm d x} = e^{\int -\frac1x\,\mathrm d x}`, to: String.raw`\mu = e^{-\ln x}`,
            why: String.raw`$p$ includes its minus sign; $q(x) = x^2$. $\int\frac1x\,\mathrm d x = \ln x$ for $x > 0$.` },
          { kind: 'calc', label: String.raw`$e^{-\ln x} = x^{-1}$`, to: String.raw`\mu = \frac1x`,
            why: String.raw`The refresher rule with $k = -1$.` },
          { kind: 'both', label: String.raw`Moves 4–5: both sides $\times\frac1x$`, from: String.raw`y' - \frac{1}{x}\,y = x^2`, to: String.raw`\Big(\frac{y}{x}\Big)' = \frac1x\cdot x^2 = x`,
            why: String.raw`Multiply by $\mu = \frac1x$; the left side becomes $(\mu y)' = (y/x)'$ by the product rule read backwards.` },
          { kind: 'calculus', label: 'Move 6: integrate both sides', to: String.raw`\frac{y}{\T{x-1}{x}} = \frac{x^2}{2} + C`,
            why: 'One constant, on the right.' },
          { kind: 'both', label: String.raw`Move 7: both sides $\times x$`, to: String.raw`y = \frac{x^3}{2} + C\,\T{x-1}{x}`, arrows: { 'x-1': '× x on both sides' },
            why: String.raw`Dividing by $\mu = \frac1x$ is multiplying by $x$; every term on the right gets the factor $x$.` },
          { kind: 'sub', label: String.raw`Move 8: $x = 1$, $y = 0$`, from: String.raw`y = \frac{x^3}{2} + Cx\qquad x = \T{x-1}{1},\ y = \T{y-1}{0}`, to: String.raw`\T{y-1}{0} = \frac{\T{x-1}{1}^3}{2} + C\cdot\T{x-2}{1}`, map: { 'x-1': ['x-1', 'x-2'] }, arrows: { 'x-1': 'x = 1', 'y-1': 'y = 0' },
            why: 'Put in the initial values.' },
          { kind: 'both', label: String.raw`Both sides $-\frac12$`, to: String.raw`C = -\tfrac12`,
            why: String.raw`$0 = \frac12 + C$, so subtracting $\frac12$ from both sides leaves $C$.` },
          { kind: 'result', label: 'The solution of the IVP', from: String.raw`y = \frac{x^3}{2} + \T{C-1}{C}x`, to: String.raw`y = \frac{x^3}{2} \T{C-1}{- \frac12}x = \frac{x^3 - x}{2}`,
            why: 'Put C back and write it as one fraction.' },
        ] },
        { type: 'callout', kind: 'thm', title: 'Where does the solution live? (linear equations)', html: String.raw`<p>For a <b>linear</b> equation in standard form $y' + p(x)y = q(x)$ with $p$ and $q$ continuous on an interval $I$ that contains $x_0$, the IVP has exactly one solution, and it exists on <b>all of $I$</b>. So: write the standard form, find where $p$ and $q$ are undefined (e.g. $x = 0$ for $\frac1x$), and take the largest interval around $x_0$ that avoids those points. In the example $p = -\frac1x$ is continuous on $(0, \infty)$, which contains $x_0 = 1$.</p>` },
        { type: 'guided', title: String.raw`$x y' + 2y = 4x^2$, $y(1) = 2$`, problem: String.raw`Solve $x y' + 2y = 4x^2$, $y(1) = 2$ for $x > 0$.`, steps: [
          { prompt: String.raw`Move 1: divide by $x$. Which is $p(x)$?`, ask: { kind: 'choice', choices: [String.raw`$2$`, String.raw`$\dfrac{2}{x}$`, String.raw`$2x$`, String.raw`$4x$`], answer: 1 }, hint: String.raw`$\frac{2y}{x} = \frac2x\cdot y$.`, reveal: String.raw`$y' + \frac{2}{x}y = 4x$: $p = \frac2x$, $q = 4x$.` },
          { prompt: String.raw`The integrating factor $\mu = e^{\int 2/x\,\mathrm d x}$:`, ask: { kind: 'expression', variable: 'x', answer: 'x.^2', label: 'μ(x) =' }, hint: String.raw`$e^{2\ln x} = x^2$ (refresher).`, reveal: String.raw`$\mu = x^2$, and $\big(x^2y\big)' = x^2\cdot 4x = 4x^3$.` },
          { prompt: String.raw`Integrate: $x^2 y = x^4 + C$. Use $y(1) = 2$ and type the solution $y(x)$:`, ask: { kind: 'expression', variable: 'x', answer: 'x.^2 + 1./x.^2', label: 'y(x) =' }, hint: String.raw`$1\cdot 2 = 1 + C$ gives $C = 1$; then divide by $x^2$.`, reveal: String.raw`$y = x^2 + \dfrac{1}{x^2}$.` },
          { prompt: String.raw`Compute $y(2)$:`, ask: { kind: 'numeric', answer: '17/4' }, hint: String.raw`$4 + \frac14$.`, reveal: String.raw`$y(2) = \frac{17}{4}$.` },
          { prompt: 'On which interval is the solution guaranteed to exist?', ask: { kind: 'choice', choices: [String.raw`$\mathbb R$`, String.raw`$(0, \infty)$`, String.raw`$(1, \infty)$`], answer: 1 }, hint: String.raw`Where are $p = \frac2x$ and $q = 4x$ continuous, and which piece contains $x_0 = 1$?`, reveal: String.raw`$(0, \infty)$ — and indeed $\frac{1}{x^2}$ blows up at $x = 0$.` },
        ] },
        { type: 'quiz', question: String.raw`What is the integrating factor for $x^2 y' + 4x y = e^x$ ($x > 0$)?`, choices: [String.raw`$e^{4x}$`, String.raw`$x^4$`, String.raw`$e^{2x^2}$`, String.raw`$x^2$`], answer: 1, explain: String.raw`Standard form: $y' + \frac{4}{x}y = \frac{e^x}{x^2}$, so $\mu = e^{4\ln x} = x^4$. Forgetting to divide by $x^2$ first leads to the wrong factor $e^{2x^2}$.` },
      ],
    },
    {
      id: 'uniqueness',
      title: 'Existence and uniqueness for nonlinear equations',
      blocks: [
        { type: 'callout', kind: 'thm', title: 'Existence and uniqueness', html: String.raw`<p>Consider $y' = F(x, y)$, $y(x_0) = y_0$.</p><ul><li>If $F$ is continuous near $(x_0, y_0)$, a solution <b>exists</b> on some interval around $x_0$.</li><li>If moreover $\dfrac{\partial F}{\partial y}$ (the derivative of $F$ with respect to $y$, treating $x$ as a constant) is continuous near $(x_0, y_0)$, the solution is <b>unique</b>.</li></ul><p>When $\partial F/\partial y$ blows up, two different solutions may pass through the same point.</p>` },
        { type: 'refresher', title: 'odd roots and their powers', html: String.raw`<p>$y^{4/5} = \big(\sqrt[5]{y}\big)^4$. A fifth root is defined for negative numbers ($\sqrt[5]{-32} = -2$), and the 4th power makes the result $\ge 0$. Derivative: $\frac{\mathrm d}{\mathrm d y}y^{4/5} = \frac45 y^{-1/5} = \frac{4}{5\sqrt[5]{y}}$, which is undefined at $y = 0$.</p>` },
        { type: 'steps', title: String.raw`Worked example: $y' = 5y^{4/5}$ — two solutions through $(0, 0)$`, steps: [
          { do: String.raw`$F(x, y) = 5y^{4/5}$ is continuous everywhere`, why: 'The fifth root is defined for every real y (refresher), so existence is guaranteed for every initial point.' },
          { do: String.raw`$\dfrac{\partial F}{\partial y} = 5\cdot\tfrac45 y^{-1/5} = \dfrac{4}{\sqrt[5]{y}}$`, why: 'Power rule in y.' },
          { do: String.raw`At $y = 0$ this is undefined (it blows up)`, why: 'Dividing by the fifth root of a number near 0. So for y(0) = 0 the theorem does not promise uniqueness.' },
          { do: String.raw`$y = 0$ solves $y(0) = 0$`, why: String.raw`$y' = 0$ and $5\cdot 0^{4/5} = 0$.` },
          { do: String.raw`$y = x^5$ also solves it: $y' = 5x^4$ and $5(x^5)^{4/5} = 5x^4$`, why: String.raw`$(x^5)^{4/5} = x^4$, and $0^5 = 0$. Two different solutions through $(0, 0)$: uniqueness really fails.` },
        ] },
        { type: 'derive', title: String.raw`With $y(0) = 1$ instead: separate and solve`, steps: [
          { kind: 'both', label: String.raw`Move 1a: both sides $\div y^{4/5}$`, from: String.raw`\frac{\mathrm d y}{\mathrm d x} = 5\,\T{y-1}{y^{4/5}}`, to: String.raw`\T{y-1}{y^{-4/5}}\,\frac{\mathrm d y}{\mathrm d x} = 5`, arrows: { 'y-1': '÷ y^{4/5} on both sides' },
            why: String.raw`Away from $y = 0$ the theorem applies and we may divide by $y^{4/5}$; $\frac{1}{y^{4/5}} = y^{-4/5}$.` },
          { kind: 'both', label: String.raw`Move 1b: both sides $\times\,\mathrm d x$`, from: String.raw`y^{-4/5}\,\frac{\mathrm d y}{\T{dx-1}{\mathrm d x}} = 5`, to: String.raw`y^{-4/5}\,\mathrm d y = 5\,\T{dx-1}{\mathrm d x}`, arrows: { 'dx-1': '× dx on both sides' },
            why: 'Only y on the left, only x on the right.' },
          { kind: 'calculus', label: 'Moves 2–3: integrate both sides', to: String.raw`5y^{1/5} = 5x + C`,
            why: String.raw`$\int y^{-4/5}\,\mathrm d y = \frac{y^{1/5}}{1/5} = 5y^{1/5}$; one constant.` },
          { kind: 'sub', label: String.raw`Move 5: $x = 0$, $y = 1$`, from: String.raw`5y^{1/5} = 5x + C\qquad x = \T{x-1}{0},\ y = \T{y-1}{1}`, to: String.raw`5\cdot\T{y-1}{1} = 5\cdot\T{x-1}{0} + C\quad\Rightarrow\quad C = 5`, arrows: { 'x-1': 'x = 0', 'y-1': 'y = 1' },
            why: String.raw`$1^{1/5} = 1$.` },
          { kind: 'both', label: String.raw`Both sides $\div 5$`, from: String.raw`5y^{1/5} = 5x + 5`, to: String.raw`y^{1/5} = x + 1`,
            why: 'Every term has the factor 5.' },
          { kind: 'both', label: 'Move 4: both sides to the 5th power', to: String.raw`y = (x+1)^5`,
            why: String.raw`$\big(y^{1/5}\big)^5 = y$.` },
          { kind: 'sub', label: String.raw`Evaluate at $x = 1$`, from: String.raw`y = (\T{x-1}{x}+1)^5\qquad x = \T{x-2}{1}`, to: String.raw`y(1) = (\T{x-2}{1}+1)^5 = 2^5 = 32`, arrows: { 'x-2': 'x = 1' },
            why: 'Put x = 1.' },
        ] },
        { type: 'guided', title: String.raw`$y' = 7y^{6/7}$`, problem: String.raw`Consider $y' = 7y^{6/7}$ (with $y^{6/7} = (\sqrt[7]{y})^6 \ge 0$).`, steps: [
          { prompt: String.raw`Is uniqueness guaranteed for $y(0) = 0$?`, ask: { kind: 'choice', choices: [String.raw`yes, $F$ is continuous`, String.raw`no: $\partial F/\partial y = 6y^{-1/7}$ blows up at $y = 0$`], answer: 1 }, hint: String.raw`Differentiate $7y^{6/7}$ with respect to $y$.`, reveal: String.raw`$\partial F/\partial y = 7\cdot\frac67 y^{-1/7} = 6y^{-1/7}$, undefined at $0$: no guarantee.` },
          { prompt: String.raw`Besides $y = 0$, which function solves $y(0) = 0$?`, ask: { kind: 'choice', choices: [String.raw`$y = x^6$`, String.raw`$y = x^7$`, String.raw`$y = 7x$`], answer: 1 }, hint: String.raw`Try $y = x^7$: $y' = 7x^6$ and $(x^7)^{6/7} = x^6$.`, reveal: String.raw`$y = x^7$ — a second solution through $(0, 0)$.` },
          { prompt: String.raw`Now take $y(0) = 1$. Separating gives $7y^{1/7} = 7x + C$, so $C = 7$ and $y = (x+1)^7$. Compute $y(1)$:`, ask: { kind: 'numeric', answer: '128' }, hint: String.raw`$2^7$.`, reveal: String.raw`$y(1) = 2^7 = 128$.` },
        ] },
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
  assignIntro: String.raw`<p>Every problem below is the same type as a worked example and a guided exercise in the lessons — the links above each problem take you back to them. If you get stuck, open the hints one at a time, then "Walk me through it".</p>`,
  assignments: [
    {
      id: 'a1',
      title: 'Solutions and equilibria',
      difficulty: 'core',
      examples: ['slope-fields', 'verify-solutions', 'equilibria'],
      statement: String.raw`<p>Basic vocabulary and checks.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`What is the order of $\;y''' + y\,y' = \sin x$?`, kind: 'numeric', answer: '3',
          hints: ['List every derivative of y that appears.', 'The order is the highest derivative (not the highest power).', String.raw`The derivatives are $y'''$ and $y'$.`],
          walkthrough: [
            { do: String.raw`Derivatives present: $y'''$, $y'$ (and $y$)`, why: 'List them.' },
            { do: String.raw`Highest: $y'''$`, why: 'Three primes.' },
            { do: 'Order 3', why: String.raw`(It is nonlinear because of $y\,y'$, but that does not affect the order.)` },
          ] },
        { label: '(b)', prompt: String.raw`$y = Ce^{-3x} + 2$ solves $y' = 6 - 3y$. Find $C$ for the initial condition $y(0) = 5$.`, kind: 'numeric', answer: '3',
          hints: ['Same type as the guided exercise with y = Ce^(2x) − 1.', String.raw`Put $x = 0$ into the formula and set it equal to $5$.`, String.raw`$y(0) = Ce^0 + 2 = C + 2$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>First check the family, then use the initial condition to find $C$.</p>` },
            { type: 'derive', steps: [
              { kind: 'calculus', label: 'Left side: differentiate', from: String.raw`y = Ce^{-3x} + 2`, to: String.raw`y' = \T{L-1}{-3Ce^{-3x}}`, why: String.raw`$(Ce^{-3x})' = -3Ce^{-3x}$ (chain rule) and $(2)' = 0$.` },
              { kind: 'sub', label: 'Right side: put the formula in', from: String.raw`6 - 3\T{y-1}{y}\qquad y = \T{y-2}{Ce^{-3x} + 2}`, to: String.raw`6 - 3(\T{y-2}{Ce^{-3x} + 2})`, arrows: { 'y-2': 'replaces y' }, why: 'In brackets.' },
              { kind: 'expand', label: 'Multiply out', to: String.raw`\T{s-1}{6} - 3Ce^{-3x} - \T{s-2}{6}`, why: String.raw`$-3\cdot 2 = -6$.` },
              { kind: 'cancel', label: String.raw`$6 - 6 = 0$`, to: String.raw`\T{L-1}{-3Ce^{-3x}}`, why: 'Both sides agree, so the family solves the equation.' },
              { kind: 'sub', label: String.raw`Initial condition: $x = 0$, $y = 5$`, from: String.raw`y = Ce^{-3x} + 2\qquad x = \T{x-1}{0},\ y = \T{y-1}{5}`, to: String.raw`\T{y-1}{5} = Ce^{\T{x-1}{0}} + 2 = C + 2`, arrows: { 'x-1': 'x = 0', 'y-1': 'y = 5' }, why: String.raw`$e^0 = 1$.` },
              { kind: 'both', label: String.raw`Both sides $-2$`, to: String.raw`C = 3`, why: String.raw`$5 - 2 = 3$.` },
            ] },
          ] },
        { label: '(c)', prompt: String.raw`What is the equilibrium (constant) solution of $y' = 6 - 3y$, and what do other solutions do as $x \to \infty$?`, kind: 'choice', choices: [String.raw`$y = 2$; all solutions approach it`, String.raw`$y = 2$; all solutions move away from it`, String.raw`$y = 6$; all solutions approach it`, String.raw`$y = 0$; all solutions approach it`], answer: 0,
          hints: [String.raw`Same type as the worked example $y' = 8 - 2y$: set the slope to zero.`, String.raw`$6 - 3y = 0$ gives $y = 2$. Now test the sign of $6 - 3y$ at $y = 3$ and $y = 1$.`],
          solution: String.raw`$6 - 3y = 0$ at $y = 2$. Since $Ce^{-3x} \to 0$, every solution tends to 2 (a stable equilibrium): above 2 the slope is negative, below 2 positive.` },
        { label: '(d)', prompt: 'Which equation is linear in $y$?', kind: 'choice', choices: [String.raw`$y' = y^2 + x$`, String.raw`$y' + x^2 y = \sin x$`, String.raw`$y\,y' = x$`, String.raw`$y' = \sin y$`], answer: 1,
          hints: ['Look for powers of y, products of y with y′, or functions such as sin applied to y.', String.raw`$y^2$, $y\,y'$ and $\sin y$ are all nonlinear. Which equation has none of them?`],
          solution: String.raw`Only $y' + x^2 y = \sin x$ has $y$ and $y'$ to the first power with coefficients depending on $x$ alone.` },
      ],
    },
    {
      id: 'a2',
      title: "Euler's method by hand",
      difficulty: 'core',
      examples: ['euler', 'euler-error'],
      statement: String.raw`<p>Consider $y' = xy + 1$, $y(0) = 1$. Approximate $y(1)$ with Euler's method.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Use $h = 0.5$ (two steps).`, kind: 'numeric', answer: '2.375', tol: 1e-6,
          hints: [String.raw`Same as the guided exercise for $y' = xy + 2$, with $+1$ instead of $+2$.`, 'Each step: slope at the old point, then new y = old y + h × slope.', String.raw`First slope: $F(0, 1) = 0\cdot 1 + 1 = 1$, so $y_1 = 1 + 0.5\cdot 1$.`],
          walkthrough: [
            { do: String.raw`$F(0, 1) = 0 + 1 = 1$`, why: 'Slope at the start.' },
            { do: String.raw`$y_1 = 1 + 0.5\cdot 1 = 1.5,\ x_1 = 0.5$`, why: 'First step.' },
            { do: String.raw`$F(0.5, 1.5) = 0.75 + 1 = 1.75$`, why: 'Slope at the new point.' },
            { do: String.raw`$y_2 = 1.5 + 0.5\cdot 1.75 = 1.5 + 0.875 = 2.375$`, why: String.raw`Second step reaches $x = 1$.` },
          ] },
        { label: '(b)', prompt: String.raw`Use $h = 0.25$ (four steps). Give at least four decimals.`, kind: 'numeric', answer: '2.6551513671875', tol: 1e-5,
          hints: [String.raw`Same as the guided exercise with $h = 0.25$.`, 'Four steps; keep all decimals until the end.', String.raw`$y_1 = 1 + 0.25\cdot 1 = 1.25$; next slope $F(0.25, 1.25) = 0.3125 + 1$.`],
          walkthrough: [
            { do: String.raw`$y_1 = 1 + 0.25\,(0\cdot 1 + 1) = 1.25$`, why: String.raw`$x_1 = 0.25$.` },
            { do: String.raw`$y_2 = 1.25 + 0.25\,(0.25\cdot 1.25 + 1) = 1.25 + 0.328125 = 1.578125$`, why: String.raw`Slope $1.3125$; $x_2 = 0.5$.` },
            { do: String.raw`$y_3 = 1.578125 + 0.25\,(0.5\cdot 1.578125 + 1) = 1.578125 + 0.447265625 = 2.025390625$`, why: String.raw`Slope $1.7890625$; $x_3 = 0.75$.` },
            { do: String.raw`$y_4 = 2.025390625 + 0.25\,(0.75\cdot 2.025390625 + 1) \approx 2.025391 + 0.629761 = 2.655151$`, why: String.raw`Slope $\approx 2.519043$; $x_4 = 1$.` },
          ] },
        { label: '(c)', prompt: String.raw`The true value is $y(1) \approx 3.0594$. By roughly what factor did the error shrink from (a) to (b)?`, kind: 'choice', choices: ['about 1 (no improvement)', 'about 2', 'about 4', 'about 16'], answer: 1,
          hints: ['Error = true value − Euler value. Compute both errors.', String.raw`$3.0594 - 2.375 \approx 0.68$ and $3.0594 - 2.655 \approx 0.40$. Divide.`],
          solution: String.raw`Errors $3.0594 - 2.375 \approx 0.68$ and $3.0594 - 2.655 \approx 0.40$: a factor of about $1.7$, i.e. roughly $2$, as expected for a first-order method when $h$ is halved.` },
      ],
    },
    {
      id: 'a3',
      title: 'A separable IVP with a slope field',
      difficulty: 'core',
      hw: 'HW3-style',
      examples: ['separable', 'separable-roots'],
      statement: String.raw`<p>Consider the initial value problem $\;e^{x}\,y\,y' = 1,\quad y(0) = 2.$</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Solve the IVP. Enter $y(x)$.`, kind: 'expression', variable: 'x', answer: 'sqrt(6 - 2*exp(-x))',
          hints: [String.raw`Same type as the worked example $e^{2x}y\,y' = 1$: divide by $e^x$ first.`, String.raw`Separate: $y\,\mathrm d y = e^{-x}\,\mathrm d x$, integrate both sides, use $y(0) = 2$, then take the root with the right sign.`, String.raw`$\frac{y^2}{2} = -e^{-x} + C$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Divide by $e^x$, separate with "both sides" operations, integrate, use $y(0) = 2$, then take the root.</p>` },
            { type: 'derive', steps: [
              { kind: 'both', label: String.raw`Both sides $\div e^{x}$`, from: String.raw`\T{e-1}{e^{x}}\,y\,\frac{\mathrm d y}{\mathrm d x} = 1`, to: String.raw`y\,\frac{\mathrm d y}{\mathrm d x} = \frac{1}{\T{e-1}{e^{x}}} = e^{-x}`, arrows: { 'e-1': '÷ e^x on both sides' }, why: String.raw`$\frac{1}{e^x} = e^{-x}$.` },
              { kind: 'both', label: String.raw`Move 1: both sides $\times\,\mathrm d x$`, from: String.raw`y\,\frac{\mathrm d y}{\T{dx-1}{\mathrm d x}} = e^{-x}`, to: String.raw`y\,\mathrm d y = e^{-x}\,\T{dx-1}{\mathrm d x}`, arrows: { 'dx-1': '× dx on both sides' }, why: 'Separate the variables.' },
              { kind: 'calculus', label: 'Moves 2–3: integrate both sides', to: String.raw`\frac{y^2}{2} = -e^{-x} + C`, why: String.raw`$\int e^{-x}\,\mathrm d x = -e^{-x}$; one constant.` },
              { kind: 'sub', label: String.raw`Move 5: $x = 0$, $y = 2$`, from: String.raw`\frac{y^2}{2} = -e^{-x} + C\qquad x = \T{x-1}{0},\ y = \T{y-1}{2}`, to: String.raw`\frac{\T{y-1}{2}^2}{2} = -e^{\T{x-1}{0}} + C`, arrows: { 'x-1': 'x = 0', 'y-1': 'y = 2' }, why: 'Put in the initial values.' },
              { kind: 'calc', label: String.raw`$\frac42 = 2$, $e^0 = 1$`, to: String.raw`2 = -1 + C`, why: 'Simplify.' },
              { kind: 'both', label: String.raw`Both sides $+1$`, to: String.raw`C = 3`, why: String.raw`$2 + 1 = 3$.` },
              { kind: 'both', label: String.raw`Both sides $\times 2$`, from: String.raw`\frac{y^2}{2} = -e^{-x} + 3`, to: String.raw`y^2 = 6 - 2e^{-x}`, why: 'Multiply every term by 2.' },
              { kind: 'both', label: 'Move 4: square root of both sides', to: String.raw`y = \sqrt{6 - 2e^{-x}}`, why: String.raw`$y(0) = 2 > 0$ picks the $+$ root.` },
            ] },
          ] },
        { label: '(b)', prompt: String.raw`Compute $y(1)$.`, kind: 'numeric', answer: 'sqrt(6 - 2*exp(-1))',
          hints: ['Put x = 1 into your answer to (a).', String.raw`$e^{-1} = 1/e \approx 0.3679$.`, String.raw`$y(1) = \sqrt{6 - 2e^{-1}}$.`],
          walkthrough: [
            { do: String.raw`$y(1) = \sqrt{6 - 2e^{-1}}$`, why: 'Substitute x = 1.' },
            { do: String.raw`$= \sqrt{6 - 0.7358}$`, why: String.raw`$2/e \approx 0.7358$.` },
            { do: String.raw`$\approx 2.2944$`, why: String.raw`$\sqrt{5.2642}$.` },
          ] },
        { label: '(c)', prompt: String.raw`Compute $\lim_{x\to\infty} y(x)$.`, kind: 'numeric', answer: 'sqrt(6)',
          hints: [String.raw`What does $e^{-x}$ do as $x \to \infty$?`, String.raw`$e^{-x} \to 0$; the root is continuous, so put $0$ in its place.`, String.raw`$\sqrt{6 - 2\cdot 0}$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Take the limit inside the root: the exponential term vanishes.</p>` },
            { type: 'derive', steps: [
              { kind: 'start', label: 'The solution from (a)', from: String.raw`y = \sqrt{6 - 2e^{-x}}`, to: String.raw`\lim_{x\to\infty} y = \lim_{x\to\infty}\sqrt{6 - \T{a-1}{2e^{-x}}}`, why: 'The root is continuous, so we can take the limit of what is inside.' },
              { kind: 'cancel', label: String.raw`Let $x\to\infty$: $e^{-x}\to 0$`, to: String.raw`\lim_{x\to\infty} y = \sqrt 6 \approx 2.449`, why: String.raw`$e^{-x} = 1/e^x \to 0$, so $2e^{-x}$ vanishes.` },
            ] },
          ] },
        { label: '(d)', prompt: String.raw`The solution exists on an interval $(x_*, \infty)$. Find the left end point $x_*$.`, kind: 'numeric', answer: '-log(3)',
          hints: ['Where does the expression under the root vanish? There y = 0 and y′ = e^(−x)/y blows up.', String.raw`Solve $6 - 2e^{-x} = 0$, i.e. $e^{-x} = 3$.`, String.raw`Take $\ln$: $-x = \ln 3$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>The root needs a positive argument ($y = 0$ is not allowed either). Solve the inequality one operation at a time.</p>` },
            { type: 'derive', steps: [
              { kind: 'both', label: String.raw`Both sides $+2e^{-x}$`, from: String.raw`6 - \T{e-1}{2e^{-x}} > 0`, to: String.raw`6 > \T{e-1}{2e^{-x}}`, arrows: { 'e-1': '+2e^{−x} on both sides' }, why: 'Adding the same number to both sides keeps the inequality.' },
              { kind: 'both', label: String.raw`Both sides $\div 2$`, to: String.raw`e^{-x} < 3`, why: String.raw`Dividing by a positive number keeps the direction; read it right to left.` },
              { kind: 'both', label: String.raw`$\ln$ of both sides`, to: String.raw`-x < \ln 3`, why: String.raw`$\ln$ is increasing, so $<$ stays.` },
              { kind: 'both', label: String.raw`Both sides $\times(-1)$: the sign flips`, to: String.raw`x > -\ln 3`, why: 'Multiplying by a negative number flips the inequality.' },
              { kind: 'result', label: 'The left end point', to: String.raw`x_* = -\ln 3 \approx -1.099`, why: 'The solution lives on (−ln 3, ∞).' },
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
      examples: ['linear', 'linear-divide'],
      statement: String.raw`<p>Consider $\;x\,y' + 3y = x^2,\quad y(1) = 1$, for $x > 0$.</p>`,
      parts: [
        { label: '(a)', prompt: 'Which integrating factor do you use?', kind: 'choice', choices: [String.raw`$e^{3x}$`, String.raw`$x^3$`, String.raw`$e^{3x^2/2}$`, String.raw`$3\ln x$`], answer: 1,
          hints: [String.raw`Same type as the guided exercise $x y' + 2y = 4x^2$: divide by $x$ first.`, String.raw`Standard form $y' + \frac3x y = x$, so $p = \frac3x$ and $\mu = e^{3\ln x}$.`, String.raw`$e^{3\ln x} = x^3$.`],
          solution: String.raw`Standard form $y' + \frac3x y = x$, so $\mu = e^{\int 3/x\,\mathrm d x} = e^{3\ln x} = x^3$.` },
        { label: '(b)', prompt: String.raw`Enter the solution $y(x)$.`, kind: 'expression', variable: 'x', answer: 'x.^2/5 + 4./(5*x.^3)',
          hints: [String.raw`Multiply the standard form by $\mu = x^3$: the left side becomes $(x^3 y)'$.`, String.raw`$(x^3 y)' = x^3\cdot x = x^4$; integrate and use $y(1) = 1$.`, String.raw`$x^3 y = \frac{x^5}{5} + C$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>The eight moves: divide by $x$, find $\mu$, multiply, recognise $(\mu y)'$, integrate, divide by $\mu$, initial condition.</p>` },
            { type: 'derive', steps: [
              { kind: 'both', label: String.raw`Move 1: every term $\div x$`, from: String.raw`\T{x-1}{x}\,y' + 3y = x^2`, to: String.raw`y' + \frac{3}{\T{x-1}{x}}\,y = x`, arrows: { 'x-1': '÷ x on both sides' }, why: String.raw`Standard form: the coefficient of $y'$ must be $1$.` },
              { kind: 'calculus', label: String.raw`Moves 2–3: $p = \frac3x$`, from: String.raw`\mu = e^{\int \frac3x\,\mathrm d x}`, to: String.raw`\mu = e^{3\ln x} = x^3`, why: String.raw`$\int\frac3x\,\mathrm d x = 3\ln x$ and $e^{3\ln x} = x^3$.` },
              { kind: 'both', label: String.raw`Moves 4–5: both sides $\times x^3$`, from: String.raw`y' + \frac{3}{x}\,y = x`, to: String.raw`(x^3 y)' = x^3\cdot x = x^4`, why: String.raw`$x^3y' + 3x^2y = (x^3y)'$ by the product rule.` },
              { kind: 'calculus', label: 'Move 6: integrate both sides', to: String.raw`\T{m-1}{x^3}\,y = \frac{x^5}{5} + C`, why: 'One constant.' },
              { kind: 'both', label: String.raw`Move 7: both sides $\div x^3$`, to: String.raw`y = \frac{x^2}{5} + \frac{C}{\T{m-1}{x^3}}`, arrows: { 'm-1': '÷ x³ on both sides' }, why: String.raw`$\frac{x^5}{x^3} = x^2$.` },
              { kind: 'sub', label: String.raw`Move 8: $x = 1$, $y = 1$`, from: String.raw`y = \frac{x^2}{5} + \frac{C}{x^3}\qquad x = \T{x-1}{1},\ y = \T{y-1}{1}`, to: String.raw`\T{y-1}{1} = \frac{1}{5} + C`, arrows: { 'y-1': 'y = 1' }, why: String.raw`With $x = 1$: $1^2 = 1^3 = 1$.` },
              { kind: 'both', label: String.raw`Both sides $-\frac15$`, to: String.raw`C = \tfrac45`, why: String.raw`$1 - \frac15 = \frac45$.` },
              { kind: 'result', label: 'The solution', from: String.raw`y = \frac{x^2}{5} + \frac{\T{C-1}{C}}{x^3}`, to: String.raw`y = \frac{x^2}{5} + \frac{\T{C-1}{4}}{5x^3}`, why: String.raw`$\frac{4/5}{x^3} = \frac{4}{5x^3}$.` },
            ] },
          ] },
        { label: '(c)', prompt: String.raw`Compute $y(2)$ exactly.`, kind: 'numeric', answer: '9/10',
          hints: ['Put x = 2 into the answer to (b).', String.raw`$\frac{4}{5} + \frac{4}{5\cdot 8}$.`, String.raw`$\frac{4}{40} = \frac{1}{10}$.`],
          walkthrough: [
            { do: String.raw`$y(2) = \dfrac{4}{5} + \dfrac{4}{5\cdot 8}$`, why: String.raw`$2^2 = 4$, $2^3 = 8$.` },
            { do: String.raw`$= 0.8 + 0.1$`, why: 'Compute each fraction.' },
            { do: String.raw`$= 0.9$`, why: String.raw`An <code>ode45</code> check: <code>[x,y] = ode45(@(x,y) x - 3*y./x, [1 2], 1); y(end)</code>.` },
          ] },
        { label: '(d)', prompt: 'On which interval is the solution guaranteed to exist and be unique?', kind: 'choice', choices: [String.raw`$\mathbb R$`, String.raw`$(0, \infty)$`, String.raw`$[1, \infty)$`, String.raw`$(-\infty, 0)$`], answer: 1,
          hints: ['Use the standard form and the theorem for linear equations.', String.raw`$p = \frac3x$ and $q = x$ are continuous except at $x = 0$; which piece contains $x_0 = 1$?`],
          solution: String.raw`$p(x) = 3/x$ and $q(x) = x$ are continuous on $(0, \infty)$, which contains $x_0 = 1$. (Indeed $y$ blows up at $x = 0$.)` },
      ],
    },
    {
      id: 'a5',
      title: 'When uniqueness fails',
      difficulty: 'challenge',
      examples: ['uniqueness'],
      statement: String.raw`<p>Consider $y' = 3y^{2/3}$, where $y^{2/3} = \big(\sqrt[3]{y}\big)^2 \ge 0$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Does the existence and uniqueness theorem guarantee a unique solution with $y(0) = 0$?`, kind: 'choice', choices: [String.raw`Yes: $F$ is continuous`, String.raw`No: $\partial F/\partial y = 2y^{-1/3}$ is not continuous at $y = 0$`, 'No: $F$ is not continuous at $y = 0$'], answer: 1,
          hints: [String.raw`Same type as the worked example $y' = 5y^{4/5}$: check $F$ and $\partial F/\partial y$.`, String.raw`$\partial F/\partial y = 3\cdot\frac23 y^{-1/3}$. What happens at $y = 0$?`],
          solution: String.raw`$F(y) = 3y^{2/3}$ is continuous, which gives existence, but $\partial F/\partial y = 2y^{-1/3}$ is unbounded near $y = 0$, so uniqueness is not guaranteed.` },
        { label: '(b)', prompt: String.raw`Which functions solve the IVP $y(0) = 0$?`, kind: 'choice', choices: [String.raw`only $y = 0$`, String.raw`only $y = x^3$`, String.raw`both $y = 0$ and $y = x^3$`, 'neither'], answer: 2,
          hints: ['Check each candidate by computing both sides.', String.raw`For $y = x^3$: $y' = 3x^2$ and $3(x^3)^{2/3} = 3x^2$.`],
          solution: String.raw`$y = x^3$: $y' = 3x^2 = 3(x^3)^{2/3}$. And $y = 0$ trivially. Two solutions through the same point.` },
        { label: '(c)', prompt: String.raw`Solve the IVP with $y(0) = 1$ by separation and compute $y(1)$.`, kind: 'numeric', answer: '8',
          hints: [String.raw`Same steps as the worked example with $y(0) = 1$.`, String.raw`Separate: $y^{-2/3}\,\mathrm d y = 3\,\mathrm d x$.`, String.raw`$\int y^{-2/3}\,\mathrm d y = 3y^{1/3}$, so $3y^{1/3} = 3x + C$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Near $y = 1$ we have $y \ne 0$, so we may separate.</p>` },
            { type: 'derive', steps: [
              { kind: 'both', label: String.raw`Move 1a: both sides $\div y^{2/3}$`, from: String.raw`\frac{\mathrm d y}{\mathrm d x} = 3\,\T{y-1}{y^{2/3}}`, to: String.raw`\T{y-1}{y^{-2/3}}\,\frac{\mathrm d y}{\mathrm d x} = 3`, arrows: { 'y-1': '÷ y^{2/3} on both sides' }, why: 'Move 1 (y ≠ 0 near y = 1).' },
              { kind: 'both', label: String.raw`Move 1b: both sides $\times\,\mathrm d x$`, from: String.raw`y^{-2/3}\,\frac{\mathrm d y}{\T{dx-1}{\mathrm d x}} = 3`, to: String.raw`y^{-2/3}\,\mathrm d y = 3\,\T{dx-1}{\mathrm d x}`, arrows: { 'dx-1': '× dx on both sides' }, why: 'Separated.' },
              { kind: 'calculus', label: 'Moves 2–3: integrate both sides', to: String.raw`3y^{1/3} = 3x + C`, why: String.raw`New exponent $\frac13$, divide by $\frac13$.` },
              { kind: 'sub', label: String.raw`Move 5: $x = 0$, $y = 1$`, from: String.raw`3y^{1/3} = 3x + C\qquad x = \T{x-1}{0},\ y = \T{y-1}{1}`, to: String.raw`3\cdot\T{y-1}{1} = 3\cdot\T{x-1}{0} + C\quad\Rightarrow\quad C = 3`, arrows: { 'x-1': 'x = 0', 'y-1': 'y = 1' }, why: 'Put in the initial values.' },
              { kind: 'both', label: String.raw`Both sides $\div 3$`, from: String.raw`3y^{1/3} = 3x + 3`, to: String.raw`y^{1/3} = x + 1`, why: 'Every term has the factor 3.' },
              { kind: 'both', label: 'Cube both sides', to: String.raw`y = (x+1)^3`, why: String.raw`$\big(y^{1/3}\big)^3 = y$.` },
              { kind: 'calc', label: String.raw`$x = 1$`, to: String.raw`y(1) = 2^3 = 8`, why: '(Away from y = 0 the theorem applies, so this solution is unique there.)' },
            ] },
          ] },
      ],
    },
  ],
};
