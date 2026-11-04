// Electrical engineering course — orientation module. Assignment-driven modules will be added
// when the course assignments are available (see CONTENT.md).

export default {
  id: 'ee-intro',
  number: 1,
  part: 'ee-dc',
  title: 'Orientation: the mathematics of circuits',
  summary: 'How the calculus modules map onto circuit analysis: Ohm and Kirchhoff, RC/RL transients as first-order ODEs, AC signals as rotating phasors.',
  intro: String.raw`<p>This course will be built around your electrical engineering assignments, which are added as they arrive. Until then, this orientation module shows how the tools from the calculus course carry over: Kirchhoff's laws give algebraic and differential equations, capacitor and inductor transients are the first- and second-order ODEs of modules 15–17, and AC analysis replaces those ODEs by complex-number algebra with phasors.</p>
<p><b>Planned outline:</b> charge, current, voltage and power · Ohm's law, KVL, KCL · series/parallel networks, voltage and current dividers · node and mesh analysis (linear systems, <code>A\b</code> in MATLAB) · Thévenin and Norton equivalents · capacitors and inductors · RC and RL step response · RLC circuits · sinusoids and phasors · impedance · AC power.</p>`,
  lessons: [
    {
      id: 'kirchhoff',
      title: 'Ohm and Kirchhoff in one picture',
      blocks: [
        { type: 'text', html: String.raw`<p>Three laws cover resistive circuits:</p><ul><li><b>Ohm:</b> $v = R\,i$ across a resistor.</li><li><b>KVL:</b> the voltages around any closed loop sum to zero, $\sum_k v_k = 0$.</li><li><b>KCL:</b> the currents leaving any node sum to zero, $\sum_k i_k = 0$.</li></ul><p>For a source $E$ in series with $R_1$ and $R_2$, KVL and Ohm's law give the current and the <b>voltage divider</b>:</p>` },
        { type: 'derive', symbolic: true, title: 'The voltage divider from KVL and Ohm', colors: { E: 1, i: 2, Ra: 3, Rb: 4 }, steps: [
          { kind: 'start', label: 'KVL around the loop, Ohm for each resistor', from: String.raw`E = v_1 + v_2`, to: String.raw`\T{E-1}{E} = \T{Ra-1}{R_1}\,\T{i-1}{i} + \T{Rb-1}{R_2}\,\T{i-2}{i}`, why: String.raw`The source voltage equals the sum of the drops (KVL); each drop is $v = Ri$ with the same current $i$, because the resistors are in series.` },
          { kind: 'factor', label: String.raw`Take out the common factor $i$`, to: String.raw`\T{E-1}{E} = (\T{Ra-1}{R_1} + \T{Rb-1}{R_2})\,\T{i-1}{i}`, map: { 'i-2': 'i-1' }, arrows: { 'i-2': 'common factor' }, why: String.raw`Distributive law backwards.` },
          { kind: 'both', label: String.raw`Both sides $\div (R_1 + R_2)$`, to: String.raw`\T{i-1}{i} = \dfrac{\T{E-1}{E}}{\T{Ra-1}{R_1} + \T{Rb-1}{R_2}}`, arrows: { 'Ra-1': '÷ (R₁+R₂)', 'E-1': 'swap sides' }, why: String.raw`Dividing both sides by the total resistance leaves $i$ alone.` },
          { kind: 'sub', label: String.raw`Ohm for $R_2$: $v_2 = R_2\,i$`, from: String.raw`v_2 = \T{Rb-2}{R_2}\,\T{i-1}{i}\qquad i = \T{i-3}{\dfrac{E}{R_1 + R_2}}`, to: String.raw`v_2 = \T{Rb-2}{R_2}\cdot\T{i-3}{\dfrac{E}{R_1 + R_2}}`, arrows: { 'i-3': 'insert i' }, why: String.raw`The current we just found flows through $R_2$.` },
          { kind: 'result', label: 'The voltage divider', to: String.raw`v_2 = \dfrac{\T{Rb-2}{R_2}}{R_1 + R_2}\,E`, why: String.raw`$R_2$ gets the fraction $\frac{R_2}{R_1 + R_2}$ of the source voltage: the larger resistor takes the larger share.` },
        ] },
        { type: 'derive', title: String.raw`With numbers: $E = 9$ V, $R_1 = 1\,\mathrm{k\Omega}$, $R_2 = 2\,\mathrm{k\Omega}$`, given: String.raw`\T{E-0}{E} = 9\text{ V},\quad \T{Ra-0}{R_1} = 1\,\mathrm{k\Omega},\quad \T{Rb-0}{R_2} = 2\,\mathrm{k\Omega}`, colors: { E: 1, i: 2, Ra: 3, Rb: 4 }, steps: [
          { kind: 'sub', label: 'Put the values into the current formula', from: String.raw`i = \dfrac{\T{E-x}{E}}{\T{Ra-x}{R_1} + \T{Rb-x}{R_2}}\qquad E = \T{E-1}{9},\ R_1 = \T{Ra-1}{1000},\ R_2 = \T{Rb-1}{2000}`, to: String.raw`i = \dfrac{\T{E-1}{9}}{\T{Ra-1}{1000} + \T{Rb-1}{2000}}`, arrows: { 'E-1': 'E = 9 V', 'Ra-1': 'R₁', 'Rb-1': 'R₂' },
            why: String.raw`Use base units: $1\,\mathrm{k\Omega} = 1000\ \Omega$, so the current comes out in amperes.` },
          { kind: 'calc', label: String.raw`$9 \div 3000$`, to: String.raw`i = \dfrac{9}{3000} = 0.003\text{ A} = 3\text{ mA}`, why: String.raw`Total resistance $3\,\mathrm{k\Omega}$.` },
          { kind: 'sub', label: 'Divider formula', from: String.raw`v_2 = \dfrac{\T{Rb-x}{R_2}}{\T{Ra-x}{R_1} + \T{Rb-y}{R_2}}\,\T{E-x}{E}`, to: String.raw`v_2 = \dfrac{\T{Rb-1}{2}}{\T{Ra-1}{1} + \T{Rb-2}{2}}\cdot\T{E-1}{9} = \dfrac23\cdot 9 = 6\text{ V}`, why: String.raw`The units $\mathrm{k\Omega}$ cancel in the ratio, so we can use $1$ and $2$ directly.` },
          { kind: 'check', label: 'KVL: the drops add up to the source', from: String.raw`v_1 + v_2 = E`, to: String.raw`R_1 i + v_2 = 1000\cdot 0.003 + 6 = 3 + 6 = 9\text{ V}\ \checkmark`, why: String.raw`$R_1$ takes $3$ V and $R_2$ takes $6$ V: together the full $9$ V.` },
        ] },
        { type: 'widget', name: 'plot', config: {
          title: 'Voltage divider: output voltage as R2 varies',
          functions: [{ expr: 'E*x./(R1+x)', label: '$v_2(R_2)$' }],
          params: { E: { min: 1, max: 24, value: 12, label: '$E$ (V)' }, R1: { min: 10, max: 1000, value: 220, label: '$R_1$ (Ω)' } },
          xlim: [0, 2000], ylim: [0, 25],
          readout: 'At $R_2 = R_1$ the output is exactly half the source: $v_2 = {{E/2}}$ V.',
          xlabel: 'R₂ (Ω)', ylabel: 'v₂ (V)',
        } },
        { type: 'callout', kind: 'matlab', html: String.raw`<p>Larger networks give linear systems. Node analysis of a circuit with unknown node voltages produces $G\mathbf{v} = \mathbf{i}$, solved in MATLAB with <code>v = G \ i</code>.</p>` },
        { type: 'code', caption: 'Two-node circuit: solve the node equations', code: `% Conductance matrix (siemens) and source currents (amperes)
G = [1/100 + 1/220, -1/220;
     -1/220, 1/220 + 1/330];
i = [0.05; 0];
v = G \\ i      % node voltages in volts` },
        { type: 'quiz', question: String.raw`A 12 V source drives $R_1 = 1\,\mathrm{k\Omega}$ and $R_2 = 2\,\mathrm{k\Omega}$ in series. What is the voltage across $R_2$?`, choices: ['4 V', '6 V', '8 V', '12 V'], answer: 2, explain: String.raw`$v_2 = \frac{2}{1+2}\cdot 12 = 8$ V.` },
      ],
    },
    {
      id: 'rc-transient',
      title: 'Capacitor charging is a first-order ODE',
      blocks: [
        { type: 'text', html: String.raw`<p>A capacitor obeys $i = C\,\dfrac{\mathrm d v}{\mathrm d t}$. In a series RC circuit with source $E$, KVL gives</p>$$RC\,\frac{\mathrm d v}{\mathrm d t} + v = E, \qquad v(0) = 0,$$<p>a separable first-order ODE (module 15). The product $\tau = RC$ is the <b>time constant</b>: after $\tau$ the capacitor has reached $1 - e^{-1} \approx 63\%$ of $E$.</p>` },
        { type: 'derive', symbolic: true, title: String.raw`Solving $RC\,v' + v = E$, $v(0) = 0$`, colors: { RC: 1, v: 2, A: 3 }, steps: [
          { kind: 'both', label: String.raw`Both sides $-v$, then $\div RC$`, from: String.raw`\T{RC-1}{RC}\,\dfrac{\mathrm d v}{\mathrm d t} \T{v-1}{+ v} = E`, to: String.raw`\dfrac{\mathrm d v}{\mathrm d t} = \dfrac{E \T{v-1}{- v}}{\T{RC-1}{RC}}`, arrows: { 'v-1': '−v on both sides', 'RC-1': '÷ RC' },
            why: String.raw`Subtracting $v$ on both sides moves it to the right with a minus sign; dividing by $RC$ leaves the derivative alone.` },
          { kind: 'both', label: String.raw`Separate: both sides $\times \frac{\mathrm d t}{E - v}$`, to: String.raw`\dfrac{\mathrm d v}{E \T{v-1}{- v}} = \dfrac{\mathrm d t}{\T{RC-1}{RC}}`, why: String.raw`All $v$ on the left, all $t$ on the right (allowed while $v \ne E$).` },
          { kind: 'calculus', label: 'Integrate both sides', to: String.raw`-\ln|E - v| = \dfrac{t}{\T{RC-1}{RC}} + K`, why: String.raw`$\int \frac{\mathrm d v}{E - v} = -\ln|E - v|$ (chain rule: the inside $E - v$ has derivative $-1$).` },
          { kind: 'both', label: String.raw`Both sides $\times(-1)$, then $e^{(\ )}$ of both sides`, to: String.raw`E - v = \T{A-1}{A}\,e^{-t/\T{RC-1}{RC}}`, why: String.raw`$e^{\ln|E-v|} = |E - v|$; the constant $\pm e^{-K}$ is renamed $A$.` },
          { kind: 'sub', label: String.raw`Initial condition $v(0) = 0$`, from: String.raw`E - \T{v-2}{v(0)} = \T{A-1}{A}\,e^{0}\qquad v(0) = \T{v-3}{0}`, to: String.raw`E - \T{v-3}{0} = \T{A-1}{A}\ \Rightarrow\ A = E`, arrows: { 'v-3': 'v(0) = 0' }, why: String.raw`$e^0 = 1$.` },
          { kind: 'result', label: String.raw`Put $A = E$ back, then solve for $v$`, from: String.raw`E - v = \T{A-1}{A}\,e^{-t/RC}`, to: String.raw`v(t) = E - \T{A-1}{E}\,e^{-t/RC} = E\left(1 - e^{-t/RC}\right)`, why: String.raw`Both sides $+v - Ee^{-t/RC}$, then factor out $E$. As $t \to \infty$, $v \to E$.` },
        ] },
        { type: 'derive', title: String.raw`With numbers: $E = 5$ V, $R = 1\,\mathrm{k\Omega}$, $C = 2$ mF, at $t = 2$ s`, given: String.raw`\T{E-0}{E} = 5\text{ V},\quad R = 1\,\mathrm{k\Omega},\quad C = 2\text{ mF},\quad \T{t-0}{t} = 2\text{ s}`, colors: { RC: 1, E: 4, t: 5 }, steps: [
          { kind: 'calc', label: 'Time constant', from: String.raw`\tau = RC`, to: String.raw`\T{RC-1}{\tau} = 1000\cdot 0.002 = 2\text{ s}`, why: String.raw`$\Omega\cdot\mathrm F = \mathrm s$.` },
          { kind: 'sub', label: 'Put the values into the solution', from: String.raw`v(t) = \T{E-x}{E}\left(1 - e^{-\T{t-x}{t}/\T{RC-x}{RC}}\right)\qquad E = \T{E-1}{5},\ t = \T{t-1}{2},\ RC = \T{RC-1}{2}`, to: String.raw`v(2) = \T{E-1}{5}\left(1 - e^{-\T{t-1}{2}/\T{RC-1}{2}}\right)`, arrows: { 'E-1': 'E = 5 V', 't-1': 't = 2 s', 'RC-1': 'τ = 2 s' },
            why: String.raw`Each number keeps the colour of its symbol. Here $t = \tau$.` },
          { kind: 'calc', label: String.raw`$e^{-1} \approx 0.3679$`, to: String.raw`v(2) = 5\,(1 - 0.3679) \approx 3.16\text{ V}`, why: String.raw`$63\,\%$ of $5$ V, as expected after one time constant.` },
          { kind: 'check', label: String.raw`Put it back into $RC\,v' + v = E$ at $t = 2$`, from: String.raw`RC\,v'(t) + v(t)\qquad v'(t) = \dfrac{E}{RC}\,e^{-t/RC}`, to: String.raw`2\cdot\dfrac52\,e^{-1} + 3.161 \approx 1.839 + 3.161 = 5.000\text{ V}\ \checkmark`, why: String.raw`The left side equals $E = 5$ V, so the solution satisfies the circuit equation.` },
        ] },
        { type: 'widget', name: 'ode', config: {
          title: 'RC step response',
          F: '(E - y)./(R*C)',
          params: { E: { min: 1, max: 12, value: 5, label: '$E$ (V)' }, R: { min: 0.1, max: 5, value: 1, label: '$R$ (kΩ)' }, C: { min: 0.1, max: 5, value: 1, label: '$C$ (mF)' } },
          y0: 0, tspan: [0, 10], ylim: [0, 13],
          exact: 'E*(1-exp(-t./(R*C)))',
          readout: 'Time constant $\\tau = RC = {{R*C}}$ s; voltage at $t = 10$ s: {{yEnd}} V.',
        } },
        { type: 'quiz', question: String.raw`With $R = 2\,\mathrm{k\Omega}$ and $C = 500\,\mu\mathrm F$, what is the time constant?`, choices: ['0.1 s', '1 s', '10 s', '1000 s'], answer: 1, explain: String.raw`$\tau = RC = 2000 \cdot 500\cdot 10^{-6} = 1$ s.` },
      ],
    },
    {
      id: 'phasors',
      title: 'AC signals as rotating phasors',
      blocks: [
        { type: 'text', html: String.raw`<p>A sinusoid $v(t) = V_m\cos(\omega t + \varphi)$ is the real part of the rotating complex number $V_m e^{j(\omega t+\varphi)}$. Dropping the common factor $e^{j\omega t}$ leaves the <b>phasor</b> $\mathbf V = V_m\angle\varphi$. Sinusoids of the same frequency add like their phasors, and differentiation becomes multiplication by $j\omega$ — which is why AC analysis needs no ODEs at all.</p>` },
        { type: 'widget', name: 'phasor', config: { title: 'Two phasors and their sum', phasors: [{ amp: 1, phase: 0, label: 'V_1' }, { amp: 0.8, phase: 60, label: 'V_2' }], omega: 2 * Math.PI, showSum: true } },
        { type: 'code', caption: 'Phasor arithmetic in MATLAB uses complex numbers (j is the imaginary unit):', code: `V1 = 1*exp(1j*0);
V2 = 0.8*exp(1j*60*pi/180);
V = V1 + V2;
amplitude = abs(V)
phase_deg = angle(V)*180/pi` },
      ],
    },
  ],
  matlab: [],
  assignments: [],
  assignIntro: String.raw`<p>Assignments for the electrical engineering course will be added when the course material is delivered. Meanwhile, use the AI tutor's practice generator (it knows this course's scope) or the calculus ODE modules 15–17.</p>`,
};
