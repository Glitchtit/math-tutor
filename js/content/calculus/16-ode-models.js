// Module 16: Modelling with first-order ODEs

export default {
  id: 'ode-models',
  number: 16,
  part: 'odes',
  hw: 'HW3–HW4',
  title: 'Modelling with first-order ODEs',
  summary: 'Exponential growth and decay, Newton\'s law of cooling, mixing tanks (rate in minus rate out), RL circuits with time constant L/R, the logistic equation P\' = kP(M − P) solved by partial fractions, equilibria and stability, harvesting; ode45 against analytic solutions and fzero for threshold times.',
  intro: String.raw`<p>A model turns a sentence about rates — <i>"the temperature difference decreases at a rate proportional to itself"</i>, <i>"salt leaves with the outflow"</i>, <i>"growth slows as the food runs out"</i> — into a differential equation. The work is always the same: name the unknown and its units, write <b>rate of change = rate in − rate out</b>, solve, and answer the question asked (a value, a time, a long-run limit). This module covers the standard first-order models of HW3 and HW4.</p>`,
  lessons: [
    {
      id: 'growth-cooling',
      title: 'Exponential change and Newton cooling',
      blocks: [
        { type: 'text', html: String.raw`<p>A cup of coffee at $90\,^\circ\mathrm C$ cools in a room at temperature $T_a$. Newton's law of cooling says the temperature changes at a rate proportional to the difference: $T' = k(T_a - T)$ with $k > 0$. Change the room temperature and the cooling constant; the faint thick curve is the exact solution, the thin one is computed numerically.</p>` },
        { type: 'widget', name: 'ode', config: {
          title: "Newton cooling: T' = k (Ta − T), T(0) = 90",
          F: 'k*(Ta - y)', params: { k: { min: 0.02, max: 0.5, value: 0.07, label: '$k$ (1/min)' }, Ta: { min: 0, max: 35, value: 20, label: String.raw`$T_a$ (°C)` } },
          y0: 90, tspan: [0, 40], ylim: [0, 100], exact: 'Ta + (90 - Ta)*exp(-k*t)', hlines: ['Ta'],
          readout: String.raw`$T(t) = T_a + (90 - T_a)e^{-kt}$. Time to reach $40\,°$C: $\frac1k\ln\frac{90 - T_a}{40 - T_a} = {{log((90-Ta)/(40-Ta))/k}}$ min.`,
        } },
        { type: 'callout', kind: 'def', title: 'Proportional change', html: String.raw`<p>$y' = ky$ has the solution $y = y_0 e^{kt}$: growth for $k > 0$ (doubling time $\ln 2/k$), decay for $k < 0$ (half-life $\ln 2/|k|$).</p><p>Newton's law $T' = k(T_a - T)$ is the same equation for the difference $u = T - T_a$: $u' = -ku$, so
$$T(t) = T_a + (T_0 - T_a)\,e^{-kt} .$$
Two measurements determine $k$; the model then predicts every other time.</p>` },
        { type: 'steps', title: 'Example: the coffee reads 70 °C after 5 min in a 20 °C room. When is it 40 °C?', steps: [
          String.raw`We write the solution with $T_0 = 90$ and $T_a = 20$: $T(t) = 20 + 70e^{-kt}$.`,
          String.raw`We find $k$ from $T(5) = 70$: $70e^{-5k} = 50$, so $k = \frac15\ln\frac75 \approx 0.0673\ \mathrm{min}^{-1}$.`,
          String.raw`We solve $T(t) = 40$: $70e^{-kt} = 20$, so
$$t = \frac{1}{k}\ln\frac{7}{2} = \frac{5\ln 3.5}{\ln 1.4} \approx 18.6\ \mathrm{min}.$$`,
        ] },
        { type: 'quiz', question: 'A radioactive tracer has a half-life of 8 days. What fraction remains after 24 days?', choices: ['1/3', '1/6', '1/8', String.raw`$e^{-3}$`], answer: 2, explain: String.raw`24 days are three half-lives: $(1/2)^3 = 1/8$. In formulas, $y = y_0 e^{-kt}$ with $k = \ln 2/8$ gives $e^{-3\ln 2} = 1/8$.` },
      ],
    },
    {
      id: 'mixing',
      title: 'Mixing and tank problems',
      blocks: [
        { type: 'text', html: String.raw`<p>A $1000\ \mathrm L$ tank initially holds $20\ \mathrm{kg}$ of dissolved salt. Brine of concentration $c_{in}$ flows in at rate $r$ and the well-stirred mixture flows out at the same rate. Move the sliders: the salt amount relaxes exponentially to the level $1000\,c_{in}$ with time constant $V/r$.</p>` },
        { type: 'widget', name: 'ode', config: {
          title: "Salt in a 1000 L tank: x' = r c_in − r x / 1000",
          F: 'r*cin - r*y/1000', params: { r: { min: 2, max: 50, value: 10, label: '$r$ (L/min)' }, cin: { min: 0, max: 0.1, value: 0, step: 0.005, label: String.raw`$c_{in}$ (kg/L)` } },
          y0: 20, tspan: [0, 600], ylim: [0, 105], hlines: ['1000*cin'],
          readout: String.raw`Time constant $V/r = {{1000/r}}$ min; long-run amount $V c_{in} = {{1000*cin}}$ kg.`,
        } },
        { type: 'callout', kind: 'key', title: 'The balance law', html: String.raw`<p>Let $x(t)$ be the <b>amount</b> of substance (kg, mg, …) — not the concentration. Then
$$\frac{\mathrm d x}{\mathrm d t} = \underbrace{r_{in}\,c_{in}}_{\text{rate in}} - \underbrace{r_{out}\,\frac{x(t)}{V(t)}}_{\text{rate out}}, \qquad V(t) = V_0 + (r_{in} - r_{out})\,t .$$
The outflow carries the tank's current concentration $x/V$. Check the units: $(\mathrm{L/min})\cdot(\mathrm{kg/L}) = \mathrm{kg/min}$. The concentration is $c(t) = x(t)/V(t)$; if $V$ is constant you may equally well write the equation for $c$ directly.</p>` },
        { type: 'steps', title: 'Example: flushing a 1000 L tank (20 kg of salt) with pure water at 10 L/min', steps: [
          String.raw`We set up the balance: nothing enters ($c_{in} = 0$) and the volume stays $1000\ \mathrm L$, so
$$x' = -10\cdot\frac{x}{1000} = -\frac{x}{100}, \qquad x(0) = 20 .$$`,
          String.raw`This is exponential decay: $x(t) = 20e^{-t/100}$ (kg, $t$ in min). The time constant is $V/r = 100\ \mathrm{min}$.`,
          String.raw`We find when $5\ \mathrm{kg}$ remain: $e^{-t/100} = \tfrac14$, so $t = 100\ln 4 \approx 139\ \mathrm{min}$.`,
        ] },
        { type: 'steps', title: 'Example with changing volume: 100 L holding 10 kg; brine 0.2 kg/L in at 3 L/min, out at 2 L/min', steps: [
          String.raw`The volume grows: $V(t) = 100 + t$. The balance law gives a <b>linear</b> equation:
$$x' = 3\cdot 0.2 - 2\,\frac{x}{100+t} \quad\Longleftrightarrow\quad x' + \frac{2}{100+t}\,x = 0.6 .$$`,
          String.raw`The integrating factor is $\mu = e^{2\ln(100+t)} = (100+t)^2$, so $\big((100+t)^2 x\big)' = 0.6\,(100+t)^2$.`,
          String.raw`We integrate: $(100+t)^2 x = 0.2\,(100+t)^3 + C$. From $x(0) = 10$: $10^5 = 2\cdot10^5 + C$, so $C = -10^5$ and
$$x(t) = 0.2\,(100+t) - \frac{10^5}{(100+t)^2}\ \ \mathrm{kg}.$$`,
          String.raw`As $t$ grows the concentration $x/V \to 0.2\ \mathrm{kg/L}$, the inflow concentration — as it must.`,
        ] },
        { type: 'quiz', question: String.raw`A lake of volume $V$ is flushed with clean water at rate $r$ (in = out). The pollutant concentration halves in 30 days. If the flushing rate is doubled, the halving time becomes …`, choices: ['60 days', '30 days', '15 days', String.raw`$30/\sqrt2$ days`], answer: 2, explain: String.raw`$c(t) = c_0e^{-rt/V}$, halving time $V\ln 2/r$. Doubling $r$ halves it.` },
      ],
    },
    {
      id: 'rl-circuits',
      title: 'RL circuits',
      blocks: [
        { type: 'text', html: String.raw`<p>A battery of voltage $E$ is switched on in a series circuit with resistance $R$ and inductance $L$. Kirchhoff's voltage law (the voltage drops $L\,I'$ and $RI$ add up to $E$) gives a linear first-order equation. The current does not jump: it rises to $E/R$ with time constant $\tau = L/R$.</p>` },
        { type: 'widget', name: 'ode', config: {
          title: "RL circuit: L I' + R I = E, I(0) = 0",
          F: '(E - R*y)/L', params: { L: { min: 0.1, max: 5, value: 1, label: '$L$ (H)' }, R: { min: 2, max: 20, value: 5, label: String.raw`$R$ (Ω)` }, E: { min: 1, max: 24, value: 12, label: '$E$ (V)' } },
          y0: 0, tspan: [0, 3], ylim: [0, 12.5], exact: 'E/R*(1 - exp(-R*t/L))', hlines: ['E/R'],
          readout: String.raw`$\tau = L/R = {{L/R}}$ s, steady state $E/R = {{E/R}}$ A. After $\tau$ the current has reached $1 - e^{-1} \approx 63\,\%$ of it; after $5\tau$, more than $99\,\%$.`,
        } },
        { type: 'callout', kind: 'thm', title: 'RL circuit with constant source', html: String.raw`<p>$L\,\dfrac{\mathrm d I}{\mathrm d t} + R\,I = E,\ I(0) = I_0$ has the solution
$$I(t) = \frac{E}{R} + \Big(I_0 - \frac{E}{R}\Big)e^{-Rt/L}, \qquad \lim_{t\to\infty} I(t) = \frac{E}{R} .$$
The steady state is Ohm's law ($I' = 0$); the transient decays with time constant $\tau = L/R$. For a time-varying source $E(t)$ use the integrating factor $e^{Rt/L}$.</p>` },
        { type: 'steps', title: String.raw`Example: $L = 2\ \mathrm H$, $R = 10\ \Omega$, $E = 12\ \mathrm V$, $I(0) = 0$`, steps: [
          String.raw`We divide by $L$ to get standard form: $I' + 5I = 6$. The integrating factor is $e^{5t}$.`,
          String.raw`We integrate $(Ie^{5t})' = 6e^{5t}$: $Ie^{5t} = \tfrac65 e^{5t} + C$, so $I = \tfrac65 + Ce^{-5t}$.`,
          String.raw`From $I(0) = 0$: $C = -\tfrac65$, so $I(t) = 1.2\,\big(1 - e^{-5t}\big)\ \mathrm A$. The time constant is $\tau = 0.2\ \mathrm s$ and $\lim_{t\to\infty} I = 1.2\ \mathrm A = E/R$.`,
        ] },
        { type: 'quiz', question: String.raw`A current $I_0$ flows in an RL circuit when the source is removed ($E = 0$). How long until the current has dropped to $I_0/2$?`, choices: [String.raw`$L/R$`, String.raw`$(L/R)\ln 2$`, String.raw`$(R/L)\ln 2$`, String.raw`$2L/R$`], answer: 1, explain: String.raw`$I = I_0e^{-Rt/L} = I_0/2$ gives $t = (L/R)\ln 2 \approx 0.69\,\tau$.` },
      ],
    },
    {
      id: 'logistic',
      title: 'Logistic growth, equilibria and harvesting',
      blocks: [
        { type: 'text', html: String.raw`<p>Unlimited exponential growth is unrealistic: food and space are finite. If the per-capita growth rate $P'/P$ decreases linearly to zero at the <b>carrying capacity</b> $M$, we get the logistic equation $P' = kP(M - P)$. The slope field shows the S-shaped solutions; the dashed lines are the equilibria $P = 0$ and $P = M$.</p>` },
        { type: 'widget', name: 'ode', config: {
          title: "Logistic equation P' = k P (M − P), P(0) = 50",
          F: 'k*y.*(M - y)', params: { k: { min: 0.0002, max: 0.003, value: 0.001, step: 0.0001, label: '$k$' }, M: { min: 200, max: 1000, value: 500, label: '$M$' } },
          y0: 50, tspan: [0, 30], ylim: [0, 1050], slopeField: true, hlines: ['M', 0],
          exact: 'M./(1 + (M - 50)/50*exp(-k*M*t))',
          readout: String.raw`Initial relative growth rate $kM = {{k*M}}$. Fastest growth at $P = M/2$, reached at $t = \ln\big((M-50)/50\big)/(kM) = {{log((M-50)/50)/(k*M)}}$.`,
        } },
        { type: 'steps', title: String.raw`Solving $P' = kP(M - P)$, $P(0) = P_0$, by partial fractions`, steps: [
          String.raw`We separate the variables (for $P \ne 0, M$): $\dfrac{\mathrm d P}{P(M-P)} = k\,\mathrm d t$.`,
          String.raw`We decompose into partial fractions: $\dfrac{1}{P(M-P)} = \dfrac1M\Big(\dfrac1P + \dfrac{1}{M-P}\Big)$.`,
          String.raw`We integrate: $\dfrac1M\big(\ln|P| - \ln|M-P|\big) = kt + C$, i.e. $\ln\Big|\dfrac{P}{M-P}\Big| = kMt + MC$, so $\dfrac{P}{M-P} = Be^{kMt}$ with $B = \dfrac{P_0}{M - P_0}$.`,
          String.raw`We solve for $P$:
$$P(t) = \frac{M}{1 + A e^{-kMt}}, \qquad A = \frac{M - P_0}{P_0} .$$
As $t\to\infty$, $P \to M$ for every $P_0 > 0$.`,
          String.raw`Example: $P' = 0.0001\,P(2000 - P)$, $P(0) = 100$. Then $kM = 0.2$, $A = 19$ and $P = \dfrac{2000}{1 + 19e^{-0.2t}}$. The population reaches $1000$ when $19e^{-0.2t} = 1$, i.e. $t = 5\ln 19 \approx 14.7$.`,
        ] },
        { type: 'callout', kind: 'def', title: 'Equilibria and stability (autonomous equations)', html: String.raw`<p>For $P' = f(P)$, every zero $P^*$ of $f$ is an <b>equilibrium</b> (constant solution). It is <b>stable</b> if nearby solutions move towards it — $f$ changes sign from $+$ to $-$ at $P^*$ (sufficient: $f'(P^*) < 0$) — and <b>unstable</b> if they move away ($f'(P^*) > 0$). For the logistic $f(P) = kP(M-P)$: $P = 0$ is unstable and $P = M$ is stable.</p>` },
        { type: 'text', html: String.raw`<p><b>Harvesting.</b> Removing $h$ individuals per unit time gives $P' = kP(M - P) - h$. The equilibria solve the quadratic $kP^2 - kMP + h = 0$. Move $h$: the two equilibria approach each other and disappear at the critical harvest $h = kM^2/4$; beyond it every population collapses.</p>` },
        { type: 'widget', name: 'ode', config: {
          title: "Harvesting: P' = 0.0001 P (600 − P) − h",
          F: '0.0001*y.*(600 - y) - h', params: { h: { min: 0, max: 12, value: 5, step: 0.1, label: '$h$' }, P0: { min: 0, max: 700, value: 150, label: '$P(0)$' } },
          y0: 'P0', tspan: [0, 100], ylim: [-50, 700], slopeField: true,
          hlines: ['300 - sqrt(90000 - 10000*h)', '300 + sqrt(90000 - 10000*h)'],
          readout: String.raw`Equilibria $300 \pm \sqrt{90000 - 10^4 h}$ (dashed) — they exist while $h \le kM^2/4 = 9$. Start between them and the population recovers; start below the lower one and it dies out.`,
        } },
        { type: 'steps', title: String.raw`Example: equilibria of $P' = 0.0001\,P(600 - P) - 5$`, steps: [
          String.raw`We set $P' = 0$ and multiply by $-10^4$: $P^2 - 600P + 50000 = 0$.`,
          String.raw`The quadratic formula gives $P = 300 \pm \sqrt{90000 - 50000} = 300 \pm 200$, i.e. $P = 100$ and $P = 500$.`,
          String.raw`Sign of $f(P) = -10^{-4}(P - 100)(P - 500)$: negative below $100$, positive between, negative above $500$. So $P = 500$ is stable, $P = 100$ is unstable (a threshold: below it the population goes extinct).`,
        ] },
        { type: 'quiz', question: String.raw`For $P' = P(P - 2)(4 - P)$, which equilibria are stable?`, choices: ['0 and 4', 'only 2', '0 and 2', 'only 4'], answer: 0, explain: String.raw`$f(P) = P(P-2)(4-P)$: for $P$ slightly below 0, $f > 0$; between 0 and 2, $f < 0$; between 2 and 4, $f > 0$; above 4, $f < 0$. Arrows point towards 0 and 4, away from 2.` },
      ],
    },
  ],
  matlab: [
    {
      id: 'models-live-editor',
      title: 'Units, and ode45 against the formula',
      blocks: [
        { type: 'text', html: String.raw`<p>Model answers carry units. In the LaTeX editor, upright units are written with <code>\mathrm{...}</code>, separated from the number by a thin space <code>\,</code>. A Greek micro is <code>\mu</code>.</p>` },
        { type: 'table', head: ['You type', 'You get'], rows: [
          [String.raw`<code>r = 1000\,\mathrm{L/h}</code>`, String.raw`$r = 1000\,\mathrm{L/h}$`],
          [String.raw`<code>c_0 = 0.2\,\mu\mathrm{g/L}</code>`, String.raw`$c_0 = 0.2\,\mu\mathrm{g/L}$`],
          [String.raw`<code>V = 400\,\mathrm{m}^3</code>`, String.raw`$V = 400\,\mathrm{m}^3$`],
          [String.raw`<code>T_a = 20\,^\circ\mathrm{C}</code>`, String.raw`$T_a = 20\,^\circ\mathrm{C}$`],
          [String.raw`<code>R = 8\,\Omega</code>, <code>\tau = L/R = 0.5\,\mathrm{s}</code>`, String.raw`$R = 8\,\Omega$, $\tau = L/R = 0.5\,\mathrm{s}$`],
        ] },
        { type: 'latex', prompt: 'Type this flow rate:', target: String.raw`r = 2000\,\mathrm{L/h}` },
        { type: 'latex', prompt: 'Type this concentration:', target: String.raw`c(t) = 0.5\,e^{-t/200}\,\mu\mathrm{g/L}` },
        { type: 'text', html: String.raw`<p>A strong homework answer plots the analytic solution and an <code>ode45</code> solution <b>in the same figure</b>: if the markers sit on the curve, both the algebra and the model are probably right.</p>` },
        { type: 'livescript', caption: 'Model check for the flushing example (1000 L, 10 L/min, 20 kg)', blocks: [
          { type: 'text', content: 'We compare the analytic solution $x(t) = 20e^{-t/100}\\,\\mathrm{kg}$ with a numerical solution of $x\' = -x/100$, and mark the time $t = 100\\ln 4\\,\\mathrm{min}$ at which $5\\,\\mathrm{kg}$ remain.' },
          { type: 'code', content: "V = 1000;  r = 10;              % L, L/min\nxa = @(t) 20*exp(-r*t/V);        % analytic, kg\n[t, x] = ode45(@(t,x) -r*x/V, [0 400], 20);\nplot(t, x, 'o'), hold on\nfplot(xa, [0 400], 'LineWidth', 1.5)\nxline(100*log(4)), yline(5)\nhold off, grid on\nxlabel('t (min)'), ylabel('x (kg)')\nlegend('ode45', 'analytic')" },
        ] },
        { type: 'matlab', prompt: String.raw`Newton cooling: $T' = k(20 - T)$, $T(0) = 90$ with $k = \frac15\ln\frac75$. Solve with <code>ode45</code> on $[0, 30]$, store $T(30)$ in <code>T30</code>, and plot the numerical solution together with the formula $T = 20 + 70e^{-kt}$.`, starter: `k = log(7/5)/5;\n[t, T] = ode45(@(t,T) 0*T, [0 30], 90);   % replace 0*T by the right-hand side\nT30 = 0;   % replace 0 by the last value\nplot(t, T, 'o'), hold on\n% add the formula with fplot\nhold off`, solution: `k = log(7/5)/5;\n[t, T] = ode45(@(t,T) k*(20 - T), [0 30], 90);\nT30 = T(end);\nplot(t, T, 'o'), hold on\nfplot(@(t) 20 + 70*exp(-k*t), [0 30])\nhold off`, checks: [{ var: 'T30', value: '20 + 70*exp(-6*log(7/5))', tol: 1e-3 }, { figure: true }, { uses: 'ode45' }, { uses: 'fplot' }] },
      ],
    },
    {
      id: 'threshold-times',
      title: 'Threshold times with fzero',
      blocks: [
        { type: 'text', html: String.raw`<p>"When does the concentration fall below …?" is a root-finding problem: solve $y(t) - y_{\text{target}} = 0$. With a formula, hand it to <code>fzero</code> with a bracket $[a, b]$ on which the sign changes. Without a formula, ask <code>ode45</code> for a solution structure and evaluate it with <code>deval</code> inside <code>fzero</code>.</p>` },
        { type: 'code', caption: 'Logistic example: when does P reach 1000?', editable: true, code: `P = @(t) 2000 ./ (1 + 19*exp(-0.2*t));
t1 = fzero(@(t) P(t) - 1000, [0 30])
exact = 5*log(19)

opts = odeset('RelTol', 1e-8, 'AbsTol', 1e-8);
sol = ode45(@(t,P) 1e-4*P.*(2000 - P), [0 30], 100, opts);
t2 = fzero(@(t) deval(sol, t) - 1000, [0 30])` },
        { type: 'callout', kind: 'matlab', html: String.raw`<p><code>deval</code> interpolates between the solver's steps, so tighten the tolerances with <code>odeset</code> when the crossing time must be accurate. Always state the time with units and a sensible number of digits, e.g. $t \approx 14.7$ years.</p>` },
        { type: 'matlab', prompt: String.raw`In the RL circuit $4I' + 8I = 24$, $I(0) = 0$, the current is $I(t) = 3(1 - e^{-2t})$. Use <code>fzero</code> to find the time <code>t95</code> at which the current reaches $95\,\%$ of its final value $3\ \mathrm A$.`, starter: `I = @(t) 3*(1 - exp(-2*t));\nt95 = 0   % replace 0 by fzero(@(t) ..., [0 5])`, solution: `I = @(t) 3*(1 - exp(-2*t));\nt95 = fzero(@(t) I(t) - 0.95*3, [0 5])`, checks: [{ var: 't95', value: 'log(20)/2', tol: 1e-6 }, { uses: 'fzero' }] },
        { type: 'matlab', prompt: String.raw`The harvested population $P' = 5\cdot10^{-5}P(800 - P) - 6$, $P(0) = 150$, dies out. Solve it with <code>ode45</code> (tight tolerances, keep the structure <code>sol</code>) on $[0, 80]$ and find the extinction time <code>tE</code> with <code>fzero</code> and <code>deval</code>. (By hand: $50\ln 3$.)`, starter: `opts = odeset('RelTol', 1e-8, 'AbsTol', 1e-8);\nsol = ode45(@(t,P) 0*P, [0 80], 150, opts);   % replace 0*P\ntE = 0   % replace 0 by fzero(@(t) deval(sol, t), [10 70])`, solution: `opts = odeset('RelTol', 1e-8, 'AbsTol', 1e-8);\nsol = ode45(@(t,P) 5e-5*P.*(800 - P) - 6, [0 80], 150, opts);\ntE = fzero(@(t) deval(sol, t), [10 70])`, checks: [{ var: 'tE', value: '50*log(3)', tol: 1e-3 }, { uses: 'fzero' }, { uses: 'deval' }] },
      ],
    },
  ],
  assignments: [
    {
      id: 'a1',
      title: 'Cooling a casting',
      difficulty: 'core',
      statement: String.raw`<p>A metal part at $150\,^\circ\mathrm C$ is left in air at $25\,^\circ\mathrm C$. After $10\ \mathrm{min}$ it is at $100\,^\circ\mathrm C$. Assume Newton's law of cooling.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Find the cooling constant $k$ (1/min).`, kind: 'numeric', answer: 'log(5/3)/10', solution: String.raw`$T = 25 + 125e^{-kt}$; $125e^{-10k} = 75$ gives $k = \frac{1}{10}\ln\frac53 \approx 0.0511\ \mathrm{min}^{-1}$.` },
        { label: '(b)', prompt: String.raw`Find the temperature after $30\ \mathrm{min}$ (°C).`, kind: 'numeric', answer: '52', solution: String.raw`$e^{-30k} = (3/5)^3 = 0.216$, so $T = 25 + 125\cdot0.216 = 52\,^\circ\mathrm C$.` },
        { label: '(c)', prompt: String.raw`When is the part at $30\,^\circ\mathrm C$ (min)?`, kind: 'numeric', answer: '10*log(25)/log(5/3)', solution: String.raw`$125e^{-kt} = 5$ gives $t = \frac{\ln 25}{k} = \frac{10\ln 25}{\ln(5/3)} \approx 63.0\ \mathrm{min}$.` },
      ],
    },
    {
      id: 'a2',
      title: 'Flushing a settling basin',
      difficulty: 'challenge',
      hw: 'HW3-style',
      statement: String.raw`<p>A rectangular settling basin is $20\ \mathrm m$ long, $10\ \mathrm m$ wide and $2\ \mathrm m$ deep, and full. It contains a dissolved contaminant at concentration $5\ \mathrm{mg/L}$. To clean it, clean water is pumped in at $2000\ \mathrm{L/h}$ while the well-mixed water flows out at the same rate.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`What is the volume of the basin in litres?`, kind: 'numeric', answer: '400000', solution: String.raw`$V = 20\cdot10\cdot2 = 400\ \mathrm m^3 = 400\,000\ \mathrm L$.` },
        { label: '(b)', prompt: String.raw`Find the time constant $V/r$ of the concentration decay (hours).`, kind: 'numeric', answer: '200', solution: String.raw`$400\,000 / 2000 = 200\ \mathrm h$, and $c(t) = 5e^{-t/200}\ \mathrm{mg/L}$.` },
        { label: '(c)', prompt: String.raw`How long (hours) until the concentration is $1\ \mathrm{mg/L}$?`, kind: 'numeric', answer: '200*log(5)', solution: String.raw`$5e^{-t/200} = 1$ gives $t = 200\ln 5 \approx 322\ \mathrm h$ (about 13.4 days).` },
        { label: '(d)', prompt: 'If the pumping rate were doubled, the time in (c) would …', kind: 'choice', choices: ['stay the same', 'be halved', String.raw`decrease by $\ln 2$ hours`, 'be doubled'], answer: 1, solution: String.raw`The time is $\frac{V}{r}\ln 5$, inversely proportional to $r$.` },
        { label: '(e)', prompt: String.raw`Write a Live Script solution: the balance law with units, the solution, the time in (c), and a figure with the analytic solution and an <code>ode45</code> solution, plus an <code>fzero</code> check of the time.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 2 (Attempted)' },
        { type: 'text', content: 'We denote by $x(t)$ the amount of contaminant (mg) in the basin at time $t$ (h). The volume is constant:' },
        { type: 'equation', content: String.raw`V = 20\,\mathrm{m}\cdot 10\,\mathrm{m}\cdot 2\,\mathrm{m} = 400\,\mathrm{m}^3 = 4\cdot 10^5\,\mathrm{L}, \qquad r = 2000\,\mathrm{L/h}.` },
        { type: 'text', content: 'Clean water brings no contaminant in, and the outflow carries the concentration $x/V$. The balance law (rate in minus rate out) gives' },
        { type: 'equation', content: String.raw`\frac{\mathrm d x}{\mathrm d t} = 0 - r\,\frac{x}{V} = -\frac{x}{200\,\mathrm{h}} .` },
        { type: 'text', content: 'Dividing by the constant $V$, the concentration $c = x/V$ satisfies the same equation, $c\' = -c/200$, with $c(0) = 5\\,\\mathrm{mg/L}$. Its solution is' },
        { type: 'equation', content: String.raw`c(t) = 5\,e^{-t/200}\,\mathrm{mg/L}.` },
        { type: 'text', content: 'We solve $c(t) = 1\\,\\mathrm{mg/L}$ for $t$:' },
        { type: 'equation', content: String.raw`e^{-t/200} = \frac15 \quad\Longrightarrow\quad t = 200\ln 5\,\mathrm{h} \approx 321.9\,\mathrm{h} \approx 13.4\ \text{days}.` },
        { type: 'text', content: 'We check the formula against `ode45` and the time with `fzero`:' },
        { type: 'code', content: "V = 4e5;  r = 2000;                 % L, L/h\nca = @(t) 5*exp(-r*t/V);            % mg/L\n[t, c] = ode45(@(t,c) -r*c/V, [0 600], 5);\nplot(t, c, 'o'), hold on\nfplot(ca, [0 600], 'LineWidth', 1.5)\nyline(1), hold off, grid on\nxlabel('t (h)'), ylabel('c (mg/L)')\nlegend('ode45', 'analytic')\nT = fzero(@(t) ca(t) - 1, [0 600])\nfprintf('200 ln 5 = %.4f h\\n', 200*log(5))" },
      ],
    },
    {
      id: 'a3',
      title: 'An RL circuit',
      difficulty: 'core',
      hw: 'HW3-style',
      statement: String.raw`<p>A series circuit has $L = 4\ \mathrm H$ and $R = 8\ \Omega$; the current satisfies $L\,I' + R\,I = E(t)$ with $I(0) = 0$.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`For a constant source $E = 24\ \mathrm V$, find $I(t)$ (in A, $t$ in s).`, kind: 'expression', variable: 't', answer: '3*(1 - exp(-2*t))', solution: String.raw`$I' + 2I = 6$; $\mu = e^{2t}$; $I = 3 + Ce^{-2t}$ and $I(0) = 0$ gives $C = -3$.` },
        { label: '(b)', prompt: String.raw`Find $\lim_{t\to\infty} I(t)$.`, kind: 'numeric', answer: '3', solution: String.raw`$E/R = 24/8 = 3\ \mathrm A$.` },
        { label: '(c)', prompt: String.raw`When does the current reach $95\,\%$ of its limit (s)?`, kind: 'numeric', answer: 'log(20)/2', solution: String.raw`$1 - e^{-2t} = 0.95$ gives $e^{-2t} = 0.05$, $t = \frac12\ln 20 \approx 1.50\ \mathrm s$ (three time constants).` },
        { label: '(d)', prompt: String.raw`Now the source decays: $E(t) = 20e^{-t}\ \mathrm V$. Find $I(t)$.`, kind: 'expression', variable: 't', answer: '5*(exp(-t) - exp(-2*t))', hint: String.raw`Standard form $I' + 2I = 5e^{-t}$, integrating factor $e^{2t}$.`, solution: String.raw`$(Ie^{2t})' = 5e^{t}$, so $Ie^{2t} = 5e^t + C$ and $I = 5e^{-t} + Ce^{-2t}$. $I(0) = 0$ gives $C = -5$.` },
        { label: '(e)', prompt: String.raw`For the source in (d), find the maximum current (A).`, kind: 'numeric', answer: '5/4', solution: String.raw`$I' = 5(-e^{-t} + 2e^{-2t}) = 0$ when $e^{t} = 2$, i.e. $t = \ln 2$. Then $I = 5(\frac12 - \frac14) = \frac54\ \mathrm A$.` },
      ],
    },
    {
      id: 'a4',
      title: 'Logistic spread of a rumour',
      difficulty: 'challenge',
      hw: 'HW4-style',
      statement: String.raw`<p>In a town of $6000$ people a rumour spreads at a rate proportional to the product of the number $P$ who have heard it and the number $6000 - P$ who have not: $P' = kP(6000 - P)$. Initially $100$ people know; after $2$ days, $600$ do.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Write $P(t) = \dfrac{6000}{1 + Ae^{-kMt}}$. Find $kM$ (1/day).`, kind: 'numeric', answer: 'log(59/9)/2', hint: String.raw`$A = (M - P_0)/P_0 = 59$. Use $P(2) = 600$.`, solution: String.raw`$600 = \frac{6000}{1 + 59e^{-2kM}}$ gives $59e^{-2kM} = 9$, so $kM = \frac12\ln\frac{59}{9} \approx 0.940$.` },
        { label: '(b)', prompt: 'When has half of the town heard the rumour (days)?', kind: 'numeric', answer: '2*log(59)/log(59/9)', solution: String.raw`$P = 3000$ when $59e^{-kMt} = 1$: $t = \frac{\ln 59}{kM} = \frac{2\ln 59}{\ln(59/9)} \approx 4.34$ days.` },
        { label: '(c)', prompt: 'How many people have heard it after 5 days?', kind: 'numeric', answer: '6000/(1 + 59*(9/59)^2.5)', tol: 1e-3, solution: String.raw`$e^{-5kM} = (9/59)^{5/2}$, so $P(5) = \frac{6000}{1 + 59(9/59)^{2.5}} \approx 3906$.` },
        { label: '(d)', prompt: 'Classify the equilibria of the model.', kind: 'choice', choices: ['0 stable, 6000 unstable', '0 unstable, 6000 stable', 'both stable', 'both unstable'], answer: 1, solution: String.raw`$f(P) = kP(6000 - P) > 0$ on $(0, 6000)$: solutions move away from $0$ and towards $6000$.` },
      ],
    },
    {
      id: 'a5',
      title: 'Harvesting a fish stock',
      difficulty: 'exam',
      hw: 'HW4-style',
      statement: String.raw`<p>A fish stock follows $P' = kP(M - P) - h$ with $M = 800$, $k = 5\cdot10^{-5}$ (per fish per year) and a harvest of $h = 6$ fish per year.</p>`,
      parts: [
        { label: '(a)', prompt: 'Find the smaller equilibrium.', kind: 'numeric', answer: '200', solution: String.raw`$kP^2 - kMP + h = 0 \iff P^2 - 800P + 120000 = 0$, so $P = 400 \pm 200$.` },
        { label: '(b)', prompt: 'Find the larger equilibrium.', kind: 'numeric', answer: '600' },
        { label: '(c)', prompt: 'Which statement is correct?', kind: 'choice', choices: ['200 is stable, 600 unstable', '200 is unstable, 600 stable', 'both are stable', 'both are unstable'], answer: 1, solution: String.raw`$f(P) = -k(P-200)(P-600)$ is negative below 200, positive between, negative above 600.` },
        { label: '(d)', prompt: String.raw`What is the largest harvest rate $h$ for which an equilibrium still exists?`, kind: 'numeric', answer: '8', solution: String.raw`The discriminant $M^2 - 4h/k \ge 0$ gives $h \le kM^2/4 = 5\cdot10^{-5}\cdot 640000/4 = 8$ fish per year.` },
        { label: '(e)', prompt: String.raw`With $P(0) = 150$ the stock dies out. Solve the IVP by partial fractions and find the time (years) at which $P = 0$.`, kind: 'numeric', answer: '50*log(3)', hint: String.raw`$\frac{1}{(P-200)(P-600)} = \frac{1}{400}\Big(\frac{1}{P-600} - \frac{1}{P-200}\Big)$.`, solution: String.raw`$\frac{1}{400}\ln\Big|\frac{P-600}{P-200}\Big| = -kt + C$, so $\frac{P-600}{P-200} = 9e^{-0.02t}$ (the value at $t = 0$ is $\frac{-450}{-50} = 9$). $P = 0$ gives $3 = 9e^{-0.02t}$, $t = 50\ln 3 \approx 54.9$ years.` },
        { label: '(f)', prompt: String.raw`Write a Live Script solution of (a)–(e): a slope field of the equation on $[0, 100]\times[0, 800]$, the solutions for $P(0) = 150$ and $P(0) = 300$ with <code>ode45</code>, and an <code>fzero</code> check of the extinction time.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: 'We find the equilibria by setting $P\' = 0$ and dividing by $-k$:' },
        { type: 'equation', content: String.raw`P^2 - 800P + \frac{6}{5\cdot 10^{-5}} = P^2 - 800P + 120000 = 0 \quad\Longrightarrow\quad P = 400 \pm \sqrt{160000 - 120000} = 400 \pm 200 .` },
        { type: 'text', content: 'So the equilibria are $P = 200$ and $P = 600$, and $P\' = -k(P - 200)(P - 600)$. The sign of $P\'$ is negative for $P < 200$, positive for $200 < P < 600$ and negative for $P > 600$: $600$ is stable and $200$ is unstable. An equilibrium exists while the discriminant $M^2 - 4h/k \\ge 0$, i.e. $h \\le kM^2/4 = 8$.' },
        { type: 'text', content: 'For $P(0) = 150$ we separate the variables and use partial fractions:' },
        { type: 'equation', content: String.raw`\int \frac{\mathrm d P}{(P-200)(P-600)} = \frac{1}{400}\int\Big(\frac{1}{P-600} - \frac{1}{P-200}\Big)\mathrm d P = \frac{1}{400}\ln\Big|\frac{P-600}{P-200}\Big| = -kt + C .` },
        { type: 'text', content: 'Since $400k = 0.02$ and the quotient equals $9$ at $t = 0$,' },
        { type: 'equation', content: String.raw`\frac{P-600}{P-200} = 9e^{-0.02t} .` },
        { type: 'text', content: 'The stock is extinct when $P = 0$, i.e. when the left side equals $3$:' },
        { type: 'equation', content: String.raw`9e^{-0.02t} = 3 \quad\Longrightarrow\quad t = 50\ln 3 \approx 54.9\ \text{years}.` },
        { type: 'text', content: 'We draw the slope field with both solutions and check the extinction time numerically.' },
        { type: 'code', content: "k = 5e-5;  M = 800;  h = 6;\nF = @(t,P) k*P.*(M - P) - h;\n[t,P] = meshgrid(0:5:100, 0:40:800);\ndP = F(t, P);\ndt = 1;\nL = sqrt((dt/(t(1,end)-t(1,1)))^2+(dP/(P(end,1)-P(1,1))).^2);\nq = quiver(t,P,dt./L,dP./L,0.5);\nq.ShowArrowHead = 'off';\nq.Marker = '.';\nhold on\nopts = odeset('RelTol', 1e-8, 'AbsTol', 1e-8);\nsol1 = ode45(F, [0 60], 150, opts);\n[t2, P2] = ode45(F, [0 100], 300, opts);\nplot(sol1.x, sol1.y, 'LineWidth', 2)\nplot(t2, P2, 'LineWidth', 2)\nyline(200), yline(600)\nhold off\nxlim([0 100]), ylim([0 800])\nxlabel('t (years)'), ylabel('P')\ntE = fzero(@(t) deval(sol1, t), [10 60])\nfprintf('50 ln 3 = %.4f\\n', 50*log(3))" },
      ],
    },
  ],
};
