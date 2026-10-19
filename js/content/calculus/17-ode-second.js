// Module 17: Second-order linear ODEs

export default {
  id: 'ode-second',
  number: 17,
  part: 'odes',
  hw: 'HW4',
  title: 'Second-order linear ODEs',
  summary: 'Homogeneous constant-coefficient equations via the characteristic equation (distinct, repeated and complex roots); the mass–spring–dashpot with under-, critical and overdamping and its maximum displacement; undetermined coefficients for polynomial, exponential and sinusoidal forcing; transient and steady state; series RLC circuits; ode45 on the first-order system [y; v]. Ends with a capstone set.',
  intro: String.raw`<p>Newton's second law and Kirchhoff's voltage law both produce equations with a <b>second</b> derivative: acceleration in mechanics, the derivative of current in circuits. With constant coefficients, $a y'' + b y' + c y = f(t)$ can be solved completely by algebra: an exponential guess turns the homogeneous equation into a quadratic, and a guess shaped like the forcing gives a particular solution. The same mathematics describes a car suspension, a building in an earthquake and a radio tuner.</p>`,
  lessons: [
    {
      id: 'characteristic',
      title: 'The characteristic equation',
      blocks: [
        { type: 'text', html: String.raw`<p>Solutions of $y'' + b y' + c y = 0$ with $y(0) = 1$, $y'(0) = 0$ look completely different depending on $b$ and $c$: they decay smoothly, overshoot once, or oscillate inside a shrinking envelope. Watch the sign of the discriminant $b^2 - 4c$ as you move the sliders.</p>` },
        { type: 'widget', name: 'ode', config: {
          title: "y'' + b y' + c y = 0, y(0) = 1, y'(0) = 0",
          F2: '-(b*v + c*y)', params: { b: { min: 0, max: 6, value: 1, label: '$b$' }, c: { min: 0.5, max: 10, value: 4, label: '$c$' } },
          y0: 1, v0: 0, tspan: [0, 10], ylim: [-1.2, 1.2], hlines: [0],
          readout: String.raw`Discriminant $b^2 - 4c = {{b^2 - 4*c}}$: positive → two real roots (no oscillation), zero → repeated root, negative → complex roots $-\frac b2 \pm i\,{{sqrt(abs(c - b^2/4))}}$ (oscillation).`,
        } },
        { type: 'text', html: String.raw`<p>Try $y = e^{rt}$ in $a y'' + b y' + c y = 0$. Since $y' = re^{rt}$ and $y'' = r^2e^{rt}$, the equation becomes $(ar^2 + br + c)\,e^{rt} = 0$. So $e^{rt}$ is a solution exactly when $r$ solves the <b>characteristic equation</b> $ar^2 + br + c = 0$.</p>` },
        { type: 'table', head: ['Roots of $ar^2 + br + c = 0$', 'General solution'], rows: [
          [String.raw`real, distinct $r_1 \ne r_2$ ($b^2 > 4ac$)`, String.raw`$y = C_1 e^{r_1 t} + C_2 e^{r_2 t}$`],
          [String.raw`repeated $r$ ($b^2 = 4ac$)`, String.raw`$y = (C_1 + C_2 t)\,e^{r t}$`],
          [String.raw`complex $\alpha \pm i\beta$ ($b^2 < 4ac$)`, String.raw`$y = e^{\alpha t}\big(C_1\cos\beta t + C_2\sin\beta t\big)$`],
        ] },
        { type: 'callout', kind: 'key', html: String.raw`<p>A second-order linear equation has a two-parameter family of solutions; the two initial conditions $y(0)$ and $y'(0)$ fix $C_1$ and $C_2$ through a $2\times 2$ linear system. In the complex case Euler's formula $e^{(\alpha + i\beta)t} = e^{\alpha t}(\cos\beta t + i\sin\beta t)$ explains where cosine and sine come from.</p>` },
        { type: 'steps', title: String.raw`Example: $y'' - y' - 6y = 0$, $y(0) = 1$, $y'(0) = 8$`, steps: [
          String.raw`The characteristic equation is $r^2 - r - 6 = (r - 3)(r + 2) = 0$, so $r = 3$ and $r = -2$.`,
          String.raw`The general solution is $y = C_1e^{3t} + C_2e^{-2t}$, with $y' = 3C_1e^{3t} - 2C_2e^{-2t}$.`,
          String.raw`The initial conditions give $C_1 + C_2 = 1$ and $3C_1 - 2C_2 = 8$. Adding twice the first equation to the second: $5C_1 = 10$, so $C_1 = 2$, $C_2 = -1$.`,
          String.raw`Hence $y = 2e^{3t} - e^{-2t}$.`,
        ] },
        { type: 'steps', title: String.raw`Example: $y'' + 4y' + 13y = 0$, $y(0) = 2$, $y'(0) = -1$`, steps: [
          String.raw`The characteristic equation $r^2 + 4r + 13 = 0$ has $r = \frac{-4 \pm \sqrt{16 - 52}}{2} = -2 \pm 3i$.`,
          String.raw`The general solution is $y = e^{-2t}(C_1\cos 3t + C_2\sin 3t)$.`,
          String.raw`$y(0) = C_1 = 2$. Differentiating, $y'(0) = -2C_1 + 3C_2 = -1$, so $C_2 = 1$.`,
          String.raw`Hence $y = e^{-2t}(2\cos 3t + \sin 3t)$: an oscillation with angular frequency $3$ inside the envelope $\pm\sqrt5\,e^{-2t}$.`,
        ] },
        { type: 'quiz', question: String.raw`The general solution of $y'' + 6y' + 9y = 0$ is …`, choices: [String.raw`$C_1e^{3t} + C_2e^{-3t}$`, String.raw`$(C_1 + C_2t)e^{-3t}$`, String.raw`$C_1\cos 3t + C_2\sin 3t$`, String.raw`$C_1e^{-3t} + C_2e^{-3t}$`], answer: 1, explain: String.raw`$r^2 + 6r + 9 = (r+3)^2$: repeated root $-3$. The last option has only one independent function, so it cannot satisfy two arbitrary initial conditions.` },
      ],
    },
    {
      id: 'spring',
      title: 'The mass–spring–dashpot',
      blocks: [
        { type: 'text', html: String.raw`<p>A mass $m$ on a spring of stiffness $k$ with a damper (dashpot) of coefficient $c$: the spring pulls back with force $-kx$, the damper resists motion with $-cx'$. Newton's law gives $m x'' + c x' + k x = 0$. Press Play and change the damping.</p>` },
        { type: 'widget', name: 'spring', config: { m: 1, c: 1, k: 4, x0: 1, v0: 0, T: 20 } },
        { type: 'callout', kind: 'def', title: 'Damping regimes', html: String.raw`<p>The characteristic equation $mr^2 + cr + k = 0$ has discriminant $c^2 - 4mk$.</p><ul><li>$c^2 < 4mk$: <b>underdamped</b> — oscillation with frequency $\omega_d = \sqrt{4mk - c^2}/(2m)$ and decaying amplitude.</li><li>$c^2 = 4mk$: <b>critically damped</b> — fastest return without oscillation.</li><li>$c^2 > 4mk$: <b>overdamped</b> — slow return, no oscillation (at most one crossing of equilibrium).</li><li>$c = 0$: undamped simple harmonic motion with $\omega_0 = \sqrt{k/m}$.</li></ul>` },
        { type: 'steps', title: String.raw`Example: $m = 1$, $c = 6$, $k = 8$, $x(0) = 0$, $x'(0) = 4$ — find the maximum displacement`, steps: [
          String.raw`The characteristic equation $r^2 + 6r + 8 = (r+2)(r+4) = 0$ has roots $-2$ and $-4$; $c^2 = 36 > 32 = 4mk$, so the system is overdamped.`,
          String.raw`The general solution is $x = C_1e^{-2t} + C_2e^{-4t}$. From $x(0) = 0$: $C_2 = -C_1$. From $x'(0) = -2C_1 - 4C_2 = 2C_1 = 4$: $C_1 = 2$. So $x(t) = 2\big(e^{-2t} - e^{-4t}\big)$.`,
          String.raw`The mass moves out and returns; the maximum is where the velocity vanishes: $x'(t) = -4e^{-2t} + 8e^{-4t} = 0 \iff e^{2t} = 2 \iff t = \tfrac12\ln 2 \approx 0.347$.`,
          String.raw`At that time $e^{-2t} = \tfrac12$ and $e^{-4t} = \tfrac14$, so $x_{\max} = 2\big(\tfrac12 - \tfrac14\big) = \tfrac12$. (It is a maximum: $x' > 0$ before and $x' < 0$ after.)`,
        ] },
        { type: 'callout', kind: 'exam', html: String.raw`<p>"Maximum displacement" means: solve $x'(t) = 0$, then evaluate $x$ there — and say why it is a maximum. A plot or <code>max</code> of an <code>ode45</code> solution is a check, not the answer.</p>` },
        { type: 'quiz', question: String.raw`$m = 2$, $c = 4$, $k = 2$. The motion is …`, choices: ['underdamped', 'critically damped', 'overdamped', 'undamped'], answer: 1, explain: String.raw`$c^2 = 16 = 4mk$. The characteristic equation $2r^2 + 4r + 2 = 2(r+1)^2$ has the repeated root $-1$.` },
        { type: 'quiz', question: String.raw`Increasing the damping $c$ of an <b>underdamped</b> spring (keeping $m$, $k$ fixed) makes the oscillation …`, choices: ['faster', 'slower, with faster decay', 'unchanged in frequency', 'grow'], answer: 1, explain: String.raw`$\omega_d = \sqrt{4mk - c^2}/(2m)$ decreases and the envelope $e^{-ct/(2m)}$ decays faster.` },
      ],
    },
    {
      id: 'undetermined',
      title: 'Forced equations: undetermined coefficients',
      blocks: [
        { type: 'text', html: String.raw`<p>Push the spring periodically: $x'' + c x' + 4x = \cos\omega t$, starting at rest. After a transient, the motion settles to an oscillation at the <b>driving</b> frequency $\omega$. Its amplitude is largest when $\omega$ is near the natural frequency $\sqrt{k/m} = 2$ — <b>resonance</b> — and the peak is sharper for small damping.</p>` },
        { type: 'widget', name: 'ode', config: {
          title: "Forced oscillator x'' + c x' + 4x = cos(ωt), x(0) = x'(0) = 0",
          F2: 'cos(w*t) - c*v - 4*y', params: { w: { min: 0.2, max: 4, value: 1, label: String.raw`$\omega$` }, c: { min: 0.1, max: 3, value: 0.5, label: '$c$' } },
          y0: 0, v0: 0, tspan: [0, 40], ylim: [-2.5, 2.5], hlines: [0],
          readout: String.raw`Steady-state amplitude $\dfrac{1}{\sqrt{(4-\omega^2)^2 + (c\omega)^2}} = {{1/sqrt((4 - w^2)^2 + (c*w)^2)}}$.`,
        } },
        { type: 'callout', kind: 'thm', title: 'Structure of the solution', html: String.raw`<p>The general solution of $ay'' + by' + cy = f(t)$ is
$$y = y_h + y_p ,$$
where $y_h$ is the general solution of the homogeneous equation ($f = 0$) and $y_p$ is <b>any one</b> particular solution. Apply the initial conditions to the <b>sum</b>, never to $y_h$ alone.</p>` },
        { type: 'table', head: ['Forcing $f(t)$', 'Guess for $y_p$'], rows: [
          [String.raw`polynomial of degree $n$`, String.raw`$A_nt^n + \dots + A_1t + A_0$`],
          [String.raw`$Ke^{\lambda t}$`, String.raw`$Ae^{\lambda t}$`],
          [String.raw`$K\cos\omega t$ or $K\sin\omega t$`, String.raw`$A\cos\omega t + B\sin\omega t$ (both terms!)`],
          [String.raw`products such as $te^{\lambda t}$, $e^{\lambda t}\cos\omega t$`, String.raw`products of the corresponding guesses`],
        ] },
        { type: 'callout', kind: 'warn', title: 'The modification rule', html: String.raw`<p>If a term of the guess already solves the homogeneous equation, multiply the guess by $t$ (by $t^2$ if that is still a homogeneous solution). Example: for $y'' - y' - 2y = e^{2t}$ the root $r = 2$ makes $Ae^{2t}$ useless; use $Ate^{2t}$.</p>` },
        { type: 'steps', title: String.raw`Example (polynomial forcing): $y'' + 3y' + 2y = 4t$`, steps: [
          String.raw`The forcing is a first-degree polynomial, so we guess $y_p = At + B$, with $y_p' = A$ and $y_p'' = 0$.`,
          String.raw`Substituting: $0 + 3A + 2(At + B) = 2At + (3A + 2B) = 4t$.`,
          String.raw`Comparing coefficients: $2A = 4$ and $3A + 2B = 0$, so $A = 2$, $B = -3$, and $y_p = 2t - 3$.`,
          String.raw`With $r^2 + 3r + 2 = (r+1)(r+2)$, the general solution is $y = C_1e^{-t} + C_2e^{-2t} + 2t - 3$.`,
        ] },
        { type: 'steps', title: String.raw`Example (sinusoidal forcing): $x'' + 2x' + 5x = 10\cos t$, $x(0) = x'(0) = 0$`, steps: [
          String.raw`We guess $x_p = A\cos t + B\sin t$. Then $x_p' = -A\sin t + B\cos t$ and $x_p'' = -A\cos t - B\sin t$.`,
          String.raw`Substituting and collecting: $(4A + 2B)\cos t + (4B - 2A)\sin t = 10\cos t$, so $4A + 2B = 10$ and $4B - 2A = 0$. Hence $A = 2$, $B = 1$: $x_p = 2\cos t + \sin t$, a steady oscillation of amplitude $\sqrt5$.`,
          String.raw`The homogeneous roots are $-1 \pm 2i$, so $x = 2\cos t + \sin t + e^{-t}(C_1\cos 2t + C_2\sin 2t)$.`,
          String.raw`$x(0) = 2 + C_1 = 0$ gives $C_1 = -2$; $x'(0) = 1 - C_1 + 2C_2 = 0$ gives $C_2 = -\tfrac32$. So
$$x(t) = \underbrace{2\cos t + \sin t}_{\text{steady state}} \;\underbrace{-\,e^{-t}\big(2\cos 2t + \tfrac32\sin 2t\big)}_{\text{transient}\ \to\ 0}.$$`,
        ] },
        { type: 'quiz', question: String.raw`A particular solution of $y'' - y = e^{2t}$ is …`, choices: [String.raw`$e^{2t}$`, String.raw`$\tfrac13 e^{2t}$`, String.raw`$\tfrac15 e^{2t}$`, String.raw`$te^{2t}$`], answer: 1, explain: String.raw`$y_p = Ae^{2t}$ gives $4A - A = 1$, $A = \frac13$. No modification is needed because the homogeneous roots are $\pm 1$.` },
        { type: 'quiz', question: String.raw`Which guess is correct for $y'' + 9y = \sin 3t$?`, choices: [String.raw`$A\sin 3t$`, String.raw`$A\cos 3t + B\sin 3t$`, String.raw`$t(A\cos 3t + B\sin 3t)$`, String.raw`$At\sin 3t$`], answer: 2, explain: String.raw`$\cos 3t$ and $\sin 3t$ solve the homogeneous equation ($r = \pm 3i$): undamped resonance, so multiply by $t$. The response grows linearly in time.` },
      ],
    },
    {
      id: 'rlc',
      title: 'Series RLC circuits',
      blocks: [
        { type: 'text', html: String.raw`<p>In a series circuit with resistor $R$, inductor $L$, capacitor $C$ and source $E(t)$, the voltage drops $L\,Q''$, $R\,Q'$ and $Q/C$ add up to $E(t)$, where $Q$ is the charge on the capacitor and $I = Q'$ the current. A 12 V battery charges the capacitor ($L = 1\ \mathrm H$, $C = 0.002\ \mathrm F$); vary $R$ and watch the overshoot disappear at critical damping $R = 2\sqrt{L/C} \approx 44.7\ \Omega$.</p>` },
        { type: 'widget', name: 'ode', config: {
          title: "Q'' + R Q' + 500 Q = 12, Q(0) = Q'(0) = 0",
          F2: '12 - R*v - 500*y', params: { R: { min: 2, max: 80, value: 20, label: String.raw`$R$ (Ω)` } },
          y0: 0, v0: 0, tspan: [0, 1], ylim: [0, 0.05], hlines: [0.024],
          readout: String.raw`Final charge $CE = 0.024$ C. Discriminant $R^2 - 4L/C = {{R^2 - 2000}}$; peak charge {{yMax}} C.`,
        } },
        { type: 'table', head: ['Mechanical', 'Electrical'], rows: [
          [String.raw`$m x'' + c x' + k x = F(t)$`, String.raw`$L Q'' + R Q' + \frac1C Q = E(t)$`],
          [String.raw`displacement $x$, velocity $x'$`, String.raw`charge $Q$, current $I = Q'$`],
          [String.raw`mass $m$, damping $c$, stiffness $k$`, String.raw`inductance $L$, resistance $R$, elastance $1/C$`],
          [String.raw`critical damping $c^2 = 4mk$`, String.raw`critical resistance $R^2 = 4L/C$`],
        ] },
        { type: 'steps', title: String.raw`Example: $L = 1\ \mathrm H$, $R = 20\ \Omega$, $C = 0.002\ \mathrm F$, $E = 12\ \mathrm V$, $Q(0) = Q'(0) = 0$`, steps: [
          String.raw`The equation is $Q'' + 20Q' + 500Q = 12$. The characteristic roots are $r = -10 \pm \sqrt{100 - 500} = -10 \pm 20i$ (underdamped).`,
          String.raw`For constant forcing we guess a constant: $500\,Q_p = 12$, so $Q_p = 0.024\ \mathrm C$ (the capacitor's final charge $CE$).`,
          String.raw`The general solution is $Q = 0.024 + e^{-10t}(C_1\cos 20t + C_2\sin 20t)$. $Q(0) = 0$ gives $C_1 = -0.024$; $Q'(0) = -10C_1 + 20C_2 = 0$ gives $C_2 = -0.012$.`,
          String.raw`Hence $Q(t) = 0.024 - e^{-10t}\big(0.024\cos 20t + 0.012\sin 20t\big)\ \mathrm C$; the current $I = Q'$ dies out and the charge overshoots before settling.`,
        ] },
        { type: 'callout', kind: 'key', title: 'Transient and steady state', html: String.raw`<p>With $R > 0$ every homogeneous solution decays, so for periodic forcing the solution becomes the particular solution $y_p$: the <b>steady-state</b> (periodic) response. The decaying part $y_h$ is the <b>transient</b>. The steady state does not depend on the initial conditions. The <b>steady-state current</b> is $I_p = Q_p'$.</p>` },
        { type: 'quiz', question: String.raw`$L = 0.5\ \mathrm H$, $C = 0.02\ \mathrm F$. For which resistance is the circuit critically damped?`, choices: [String.raw`$5\ \Omega$`, String.raw`$10\ \Omega$`, String.raw`$20\ \Omega$`, String.raw`$100\ \Omega$`], answer: 1, explain: String.raw`$R^2 = 4L/C = 4\cdot0.5/0.02 = 100$, so $R = 10\ \Omega$.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'roots-and-systems',
      title: 'Characteristic roots and ode45 for systems',
      blocks: [
        { type: 'text', html: String.raw`<p>The characteristic polynomial $ar^2 + br + c$ is the vector <code>[a b c]</code> for <code>roots</code>. Complex roots come out as <code>-2.0000 + 3.0000i</code>; read off $\alpha$ with <code>real</code> and $\beta$ with <code>imag</code>.</p>` },
        { type: 'code', caption: "Classify y'' + 4y' + 13y = 0 and 2x'' + 7x' + 3x = 0", editable: true, code: `r1 = roots([1 4 13])
alpha = real(r1(1)), beta = abs(imag(r1(1)))
r2 = roots([2 7 3])` },
        { type: 'matlab', prompt: String.raw`Store the roots of the characteristic equation of $2y'' + 3y' + 5y = 0$ in <code>r</code>, and the decay rate $\alpha$ (the real part, a negative number) in <code>alpha</code>.`, starter: `r = 0      % replace 0 by roots([...])\nalpha = 0  % replace 0 by the real part of a root`, solution: `r = roots([2 3 5])\nalpha = real(r(1))`, checks: [{ var: 'r', size: 2 }, { var: 'alpha', value: -0.75 }, { uses: 'roots' }] },
        { type: 'text', html: String.raw`<p><code>ode45</code> only solves <b>first-order systems</b>. A second-order equation becomes one by introducing the velocity as a second unknown: with $y_1 = y$ and $y_2 = y'$,
$$y'' = F(t, y, y') \quad\Longleftrightarrow\quad \begin{cases} y_1' = y_2 \\ y_2' = F(t, y_1, y_2) \end{cases}$$
In MATLAB the state is a <b>column</b> vector <code>y = [y(1); y(2)]</code> and the right-hand side must return a column vector (note the semicolon). The initial value is <code>[y0; v0]</code>. The output <code>y</code> has one column per unknown: <code>y(:,1)</code> is the position, <code>y(:,2)</code> the velocity.</p>` },
        { type: 'code', caption: "x'' + 6x' + 8x = 0, x(0) = 0, x'(0) = 4: numerical maximum vs the exact 1/2 at t = ln(2)/2", editable: true, code: `m = 1;  c = 6;  k = 8;
F = @(t,y) [y(2); -(c*y(2) + k*y(1))/m];
t = linspace(0, 3, 301);
[t, y] = ode45(F, t, [0; 4]);
plot(t, y(:,1)), grid on
xlabel('t'), ylabel('x(t)')
[xmax, i] = max(y(:,1));
fprintf('sampled max %.5f at t = %.3f\\n', xmax, t(i))
fprintf('exact   max %.5f at t = %.3f\\n', 1/2, log(2)/2)` },
        { type: 'callout', kind: 'matlab', title: 'Why the sampled maximum is slightly off', html: String.raw`<p><code>max</code> only sees the sample points, so it underestimates the true maximum unless a sample hits it. Refine the time grid, or — better — find the zero of the velocity: <code>fzero</code> on the exact $x'(t)$. The exact computation is the answer; the numerical maximum is the check.</p>` },
        { type: 'matlab', prompt: String.raw`Solve $x'' + 6x' + 8x = 0$, $x(0) = 0$, $x'(0) = 4$ with <code>ode45</code> on the grid <code>linspace(0, 3, 301)</code> and store the sampled maximum displacement in <code>xmax</code>.`, starter: `F = @(t,y) [y(2); 0];   % replace 0 by the acceleration\n[t, y] = ode45(F, linspace(0, 3, 301), [0; 4]);\nxmax = 0   % replace 0 by the maximum of the first column`, solution: `F = @(t,y) [y(2); -6*y(2) - 8*y(1)];\n[t, y] = ode45(F, linspace(0, 3, 301), [0; 4]);\nxmax = max(y(:,1))`, checks: [{ var: 'xmax', value: 0.5, tol: 1e-3 }, { uses: 'ode45' }], hint: String.raw`$x'' = -6x' - 8x$, i.e. <code>-6*y(2) - 8*y(1)</code>. Use <code>y(:,1)</code> for the positions.` },
      ],
    },
    {
      id: 'forced-ode45',
      title: 'Forced oscillations: ode45 against undetermined coefficients',
      blocks: [
        { type: 'text', html: String.raw`<p>For a forced problem, plot three curves together: the <code>ode45</code> solution, the exact solution from undetermined coefficients, and the steady state $y_p$. The first two must coincide; the third must catch up once the transient has died out.</p>` },
        { type: 'code', caption: "x'' + 2x' + 5x = 10 cos t, x(0) = x'(0) = 0", editable: true, code: `F  = @(t,y) [y(2); 10*cos(t) - 2*y(2) - 5*y(1)];
opts = odeset('RelTol', 1e-8, 'AbsTol', 1e-10);
[t, y] = ode45(F, [0 12], [0; 0], opts);
xe = @(t) 2*cos(t) + sin(t) - exp(-t).*(2*cos(2*t) + 1.5*sin(2*t));
xp = @(t) 2*cos(t) + sin(t);
plot(t, y(:,1), 'o'), hold on
fplot(xe, [0 12], 'LineWidth', 1.5)
fplot(xp, [0 12], '--')
hold off, grid on
legend('ode45', 'exact', 'steady state')
err = max(abs(y(:,1) - xe(t)))` },
        { type: 'matlab', prompt: String.raw`Solve $x'' + 2x' + 5x = 10\cos t$, $x(0) = x'(0) = 0$ with <code>ode45</code> on $[0, 10]$ (use <code>odeset('RelTol', 1e-8, 'AbsTol', 1e-10)</code>) and store $x(10)$ in <code>x10</code>. It should match the formula from the lesson.`, starter: `opts = odeset('RelTol', 1e-8, 'AbsTol', 1e-10);\nF = @(t,y) [y(2); 0];   % replace 0 by the acceleration\n[t, y] = ode45(F, [0 10], [0; 0], opts);\nx10 = 0   % replace 0 by the last position`, solution: `opts = odeset('RelTol', 1e-8, 'AbsTol', 1e-10);\nF = @(t,y) [y(2); 10*cos(t) - 2*y(2) - 5*y(1)];\n[t, y] = ode45(F, [0 10], [0; 0], opts);\nx10 = y(end, 1)`, checks: [{ var: 'x10', value: '2*cos(10) + sin(10) - exp(-10)*(2*cos(20) + 1.5*sin(20))', tol: 1e-5 }, { uses: 'ode45' }] },
        { type: 'livescript', caption: 'Model: maximum displacement, exact and numerical (overdamped spring m = 1, c = 6, k = 8)', blocks: [
          { type: 'text', content: 'The maximum occurs where the velocity $x\'(t) = -4e^{-2t} + 8e^{-4t}$ vanishes. We solve this with `fzero` as a check of the hand result $t = \\frac12\\ln 2$, $x_{\\max} = \\frac12$:' },
          { type: 'code', content: "x  = @(t) 2*(exp(-2*t) - exp(-4*t));\ndx = @(t) -4*exp(-2*t) + 8*exp(-4*t);\ntm = fzero(dx, [0.1 1])\nxmax = x(tm)" },
        ] },
        { type: 'latex', prompt: 'Type the RLC equation:', target: String.raw`L Q'' + R Q' + \frac{1}{C} Q = E(t)`, accept: [String.raw`LQ'' + RQ' + \frac{1}{C}Q = E(t)`] },
        { type: 'latex', prompt: 'Type this first-order system:', target: String.raw`y_1' = y_2, \quad y_2' = -\frac{c}{m} y_2 - \frac{k}{m} y_1` },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Homogeneous initial value problems',
      difficulty: 'core',
      statement: String.raw`<p>Solve each IVP. Enter $y(t)$ in MATLAB syntax.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$y'' + 5y' + 6y = 0$, $y(0) = 2$, $y'(0) = -5$`, kind: 'expression', variable: 't', answer: 'exp(-2*t) + exp(-3*t)', solution: String.raw`$r = -2, -3$. $C_1 + C_2 = 2$ and $-2C_1 - 3C_2 = -5$ give $C_1 = C_2 = 1$.` },
        { label: '(b)', prompt: String.raw`$y'' - 4y' + 4y = 0$, $y(0) = 1$, $y'(0) = 0$`, kind: 'expression', variable: 't', answer: '(1 - 2*t).*exp(2*t)', solution: String.raw`Repeated root $r = 2$: $y = (C_1 + C_2t)e^{2t}$. $C_1 = 1$, and $y'(0) = 2C_1 + C_2 = 0$ gives $C_2 = -2$.` },
        { label: '(c)', prompt: String.raw`$y'' + 2y' + 10y = 0$, $y(0) = 0$, $y'(0) = 6$`, kind: 'expression', variable: 't', answer: '2*exp(-t).*sin(3*t)', solution: String.raw`$r = -1 \pm 3i$: $y = e^{-t}(C_1\cos 3t + C_2\sin 3t)$. $C_1 = 0$ and $3C_2 = 6$.` },
        { label: '(d)', prompt: String.raw`For which value of $c$ is $y'' + c\,y' + 16y = 0$ critically damped ($c > 0$)?`, kind: 'numeric', answer: '8', solution: String.raw`$c^2 = 4\cdot16 = 64$, so $c = 8$.` },
      ],
    },
    {
      id: 'a2',
      title: 'Maximum displacement of a damped spring',
      difficulty: 'challenge',
      hw: 'HW4-style',
      statement: String.raw`<p>A mass–spring–dashpot system has $m = 2$, $c = 7$, $k = 3$ (SI units). The mass starts at equilibrium, $x(0) = 0$, with velocity $x'(0) = 5$.</p>`,
      parts: [
        { label: '(a)', prompt: 'Classify the damping.', kind: 'choice', choices: ['underdamped', 'critically damped', 'overdamped'], answer: 2, solution: String.raw`$c^2 = 49 > 24 = 4mk$.` },
        { label: '(b)', prompt: String.raw`Find $x(t)$.`, kind: 'expression', variable: 't', answer: '2*(exp(-t/2) - exp(-3*t))', solution: String.raw`$2r^2 + 7r + 3 = (2r+1)(r+3)$, roots $-\frac12, -3$. $x(0) = 0$ gives $C_2 = -C_1$; $x'(0) = -\frac12C_1 + 3C_1 = 5$ gives $C_1 = 2$.` },
        { label: '(c)', prompt: 'At what time is the displacement largest?', kind: 'numeric', answer: '2/5*log(6)', solution: String.raw`$x'(t) = -e^{-t/2} + 6e^{-3t} = 0 \iff e^{5t/2} = 6 \iff t = \frac25\ln 6 \approx 0.717$.` },
        { label: '(d)', prompt: 'Find the maximum displacement.', kind: 'numeric', answer: '5/3*6^(-1/5)', solution: String.raw`$e^{-t/2} = 6^{-1/5}$ and $e^{-3t} = 6^{-6/5}$, so $x_{\max} = 2\cdot6^{-1/5}(1 - \frac16) = \frac53\,6^{-1/5} \approx 1.165$.` },
      ],
    },
    {
      id: 'a3',
      title: 'Particular solutions',
      difficulty: 'core',
      statement: String.raw`<p>Find a particular solution $y_p(t)$ by undetermined coefficients.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$y'' + 4y = 8t^2$`, kind: 'expression', variable: 't', answer: '2*t.^2 - 1', solution: String.raw`$y_p = At^2 + Bt + C$: $2A + 4At^2 + 4Bt + 4C = 8t^2$ gives $A = 2$, $B = 0$, $C = -1$.` },
        { label: '(b)', prompt: String.raw`$y'' - 3y' + 2y = 6e^{-t}$`, kind: 'expression', variable: 't', answer: 'exp(-t)', solution: String.raw`$y_p = Ae^{-t}$: $A(1 + 3 + 2) = 6$, $A = 1$.` },
        { label: '(c)', prompt: String.raw`$y'' + 2y' + 2y = 5\sin t$`, kind: 'expression', variable: 't', answer: '-2*cos(t) + sin(t)', solution: String.raw`$y_p = A\cos t + B\sin t$: $\cos t$: $A + 2B = 0$; $\sin t$: $B - 2A = 5$. So $B = 1$, $A = -2$.` },
        { label: '(d)', prompt: String.raw`$y'' - y' - 2y = 3e^{2t}$. Which form must the guess have?`, kind: 'choice', choices: [String.raw`$Ae^{2t}$`, String.raw`$Ate^{2t}$`, String.raw`$At^2e^{2t}$`, String.raw`$(At + B)e^{-t}$`], answer: 1, solution: String.raw`$r^2 - r - 2 = (r-2)(r+1)$: $e^{2t}$ is a homogeneous solution, so multiply by $t$ once.` },
        { label: '(e)', prompt: String.raw`Find $y_p$ for (d).`, kind: 'expression', variable: 't', answer: 't.*exp(2*t)', solution: String.raw`$y_p = Ate^{2t}$, $y_p' = Ae^{2t}(1 + 2t)$, $y_p'' = Ae^{2t}(4 + 4t)$. Then $y_p'' - y_p' - 2y_p = 3Ae^{2t} = 3e^{2t}$, so $A = 1$.` },
      ],
    },
    {
      id: 'a4',
      title: 'A forced spring from rest',
      difficulty: 'exam',
      statement: String.raw`<p>Consider $x'' + 4x' + 8x = 20\cos 2t$, $x(0) = 0$, $x'(0) = 0$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`With $x_p = A\cos 2t + B\sin 2t$, find $A$.`, kind: 'numeric', answer: '1', solution: String.raw`Substituting: $(4A + 8B)\cos 2t + (4B - 8A)\sin 2t = 20\cos 2t$. So $B = 2A$ and $20A = 20$.` },
        { label: '(b)', prompt: String.raw`Find $B$.`, kind: 'numeric', answer: '2', solution: String.raw`$B = 2A = 2$.` },
        { label: '(c)', prompt: String.raw`Amplitude of the steady-state oscillation.`, kind: 'numeric', answer: 'sqrt(5)', solution: String.raw`$\sqrt{A^2 + B^2} = \sqrt5$.` },
        { label: '(d)', prompt: String.raw`Find $x(t)$.`, kind: 'expression', variable: 't', answer: 'cos(2*t) + 2*sin(2*t) - exp(-2*t).*(cos(2*t) + 3*sin(2*t))', hint: String.raw`Homogeneous roots $-2 \pm 2i$. Apply the initial conditions to $x_h + x_p$.`, solution: String.raw`$x = \cos 2t + 2\sin 2t + e^{-2t}(C_1\cos 2t + C_2\sin 2t)$. $x(0) = 1 + C_1 = 0$; $x'(0) = 4 - 2C_1 + 2C_2 = 0$, so $C_1 = -1$, $C_2 = -3$.` },
        { label: '(e)', prompt: 'Which part of the solution remains after a long time?', kind: 'choice', choices: [String.raw`$e^{-2t}(\cos 2t + 3\sin 2t)$`, String.raw`$\cos 2t + 2\sin 2t$`, 'nothing: $x \\to 0$', 'the whole solution grows'], answer: 1, solution: String.raw`The homogeneous part decays like $e^{-2t}$; the steady state $\cos 2t + 2\sin 2t$ remains.` },
      ],
    },
    {
      id: 'a5',
      title: 'Capstone — a driven RLC circuit (HW4 style)',
      difficulty: 'exam',
      hw: 'HW4-style',
      statement: String.raw`<p>A series RLC circuit has $L = 0.5\ \mathrm H$, $R = 10\ \Omega$, $C = 0.01\ \mathrm F$ and source $E(t) = 50\cos 10t\ \mathrm V$. The capacitor is uncharged and no current flows at $t = 0$: $Q(0) = Q'(0) = 0$. This set combines the whole part: the model equation, the characteristic equation, undetermined coefficients, initial conditions, the steady state, and an <code>ode45</code> check on a first-order system.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`After dividing by $L$ the equation reads $Q'' + 20Q' + \beta Q = 100\cos 10t$. Find $\beta$.`, kind: 'numeric', answer: '200', solution: String.raw`$\frac{1}{LC} = \frac{1}{0.5\cdot0.01} = 200$.` },
        { label: '(b)', prompt: 'The circuit is …', kind: 'choice', choices: ['underdamped', 'critically damped', 'overdamped'], answer: 0, solution: String.raw`$r^2 + 20r + 200 = 0$ gives $r = -10 \pm 10i$ (equivalently $R^2 = 100 < 4L/C = 200$).` },
        { label: '(c)', prompt: String.raw`Find the steady-state charge $Q_p(t)$.`, kind: 'expression', variable: 't', answer: '0.2*cos(10*t) + 0.4*sin(10*t)', solution: String.raw`$Q_p = A\cos 10t + B\sin 10t$: $\cos$: $100A + 200B = 100$; $\sin$: $100B - 200A = 0$. So $B = 2A$, $A = \frac15$, $B = \frac25$.` },
        { label: '(d)', prompt: 'Find the amplitude of the steady-state current (A).', kind: 'numeric', answer: '2*sqrt(5)', solution: String.raw`$I_p = Q_p' = -2\sin 10t + 4\cos 10t$, amplitude $\sqrt{4 + 16} = 2\sqrt5 \approx 4.47\ \mathrm A$.` },
        { label: '(e)', prompt: String.raw`Find $Q(t)$.`, kind: 'expression', variable: 't', answer: '0.2*cos(10*t) + 0.4*sin(10*t) - exp(-10*t).*(0.2*cos(10*t) + 0.6*sin(10*t))', solution: String.raw`$Q = Q_p + e^{-10t}(C_1\cos 10t + C_2\sin 10t)$. $Q(0) = 0.2 + C_1 = 0$ gives $C_1 = -0.2$; $Q'(0) = 4 - 10C_1 + 10C_2 = 0$ gives $C_2 = -0.6$.` },
        { label: '(f)', prompt: String.raw`Which anonymous function is correct for <code>ode45</code> with state <code>y = [Q; Q']</code>?`, kind: 'choice', choices: [
          String.raw`<code>@(t,y) [y(2), 100*cos(10*t) - 20*y(2) - 200*y(1)]</code>`,
          String.raw`<code>@(t,y) [y(2); 100*cos(10*t) - 20*y(2) - 200*y(1)]</code>`,
          String.raw`<code>@(t,y) [y(1); 100*cos(10*t) - 20*y(1) - 200*y(2)]</code>`,
          String.raw`<code>@(y,t) [y(2); 100*cos(10*t) - 20*y(2) - 200*y(1)]</code>`,
        ], answer: 1, solution: String.raw`The first component of the derivative is $Q' = y_2$, the second $Q'' = 100\cos 10t - 20Q' - 200Q$; the output must be a column (semicolon) and the arguments are <code>(t, y)</code> in that order.` },
        { label: '(g)', prompt: String.raw`Write the full Live Script solution with an <code>ode45</code> check: plot $Q(t)$ from the formula and from <code>ode45</code> on $[0, 1.5]$ together with the steady state $Q_p$.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: 'By Kirchhoff\'s voltage law the charge satisfies $LQ\'\' + RQ\' + \\frac1C Q = E(t)$. With $L = 0.5\\,\\mathrm{H}$, $R = 10\\,\\Omega$, $C = 0.01\\,\\mathrm{F}$ and dividing by $L$:' },
        { type: 'equation', content: String.raw`Q'' + 20\,Q' + 200\,Q = 100\cos 10t, \qquad Q(0) = Q'(0) = 0 .` },
        { type: 'text', content: 'We solve the homogeneous equation first. The characteristic equation $r^2 + 20r + 200 = 0$ has the roots $r = -10 \\pm 10i$, so the circuit is underdamped and' },
        { type: 'equation', content: String.raw`Q_h = e^{-10t}\big(C_1\cos 10t + C_2\sin 10t\big).` },
        { type: 'text', content: 'For the particular solution we guess $Q_p = A\\cos 10t + B\\sin 10t$ (no modification is needed, since $\\pm 10i$ are not characteristic roots). Substituting and comparing the coefficients of $\\cos 10t$ and $\\sin 10t$:' },
        { type: 'equation', content: String.raw`100A + 200B = 100, \qquad -200A + 100B = 0 \quad\Longrightarrow\quad A = \frac15,\ B = \frac25 .` },
        { type: 'text', content: 'The steady-state charge and current are therefore' },
        { type: 'equation', content: String.raw`Q_p = 0.2\cos 10t + 0.4\sin 10t\,\mathrm{C}, \qquad I_p = Q_p' = 4\cos 10t - 2\sin 10t\,\mathrm{A},` },
        { type: 'text', content: 'and the steady-state current has amplitude $\\sqrt{4^2 + 2^2} = 2\\sqrt5 \\approx 4.47\\,\\mathrm{A}$. We apply the initial conditions to $Q = Q_h + Q_p$: $Q(0) = C_1 + 0.2 = 0$ and $Q\'(0) = -10C_1 + 10C_2 + 4 = 0$, so $C_1 = -0.2$ and $C_2 = -0.6$:' },
        { type: 'equation', content: String.raw`Q(t) = 0.2\cos 10t + 0.4\sin 10t - e^{-10t}\big(0.2\cos 10t + 0.6\sin 10t\big)\,\mathrm{C}.` },
        { type: 'text', content: 'We check the result with `ode45`, rewriting the equation as a first-order system for $y = [Q;\\ Q\']$:' },
        { type: 'code', content: "F = @(t,y) [y(2); 100*cos(10*t) - 20*y(2) - 200*y(1)];\nopts = odeset('RelTol', 1e-8, 'AbsTol', 1e-10);\n[t, y] = ode45(F, [0 1.5], [0; 0], opts);\nQ  = @(t) 0.2*cos(10*t) + 0.4*sin(10*t) - exp(-10*t).*(0.2*cos(10*t) + 0.6*sin(10*t));\nQp = @(t) 0.2*cos(10*t) + 0.4*sin(10*t);\nplot(t, y(:,1), 'o'), hold on\nfplot(Q, [0 1.5], 'LineWidth', 1.5)\nfplot(Qp, [0 1.5], '--')\nhold off, grid on\nxlabel('t (s)'), ylabel('Q (C)')\nlegend('ode45', 'exact', 'steady state')\nmaxError = max(abs(y(:,1) - Q(t)))" },
        { type: 'text', content: 'The numerical and exact solutions agree to solver accuracy, and after about $0.5\\,\\mathrm{s}$ (five time constants $1/10\\,\\mathrm{s}$) the transient has died out.' },
      ],
    },
  ],
};
