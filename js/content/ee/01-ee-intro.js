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
        { type: 'text', html: String.raw`<p>Three laws cover resistive circuits:</p><ul><li><b>Ohm:</b> $v = R\,i$ across a resistor.</li><li><b>KVL:</b> the voltages around any closed loop sum to zero, $\sum_k v_k = 0$.</li><li><b>KCL:</b> the currents leaving any node sum to zero, $\sum_k i_k = 0$.</li></ul><p>For a source $E$ in series with $R_1$ and $R_2$, KVL gives $E = R_1 i + R_2 i$, so $i = E/(R_1+R_2)$ and the voltage divider $v_2 = \dfrac{R_2}{R_1+R_2}E$.</p>` },
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
        { type: 'text', html: String.raw`<p>A capacitor obeys $i = C\,\dfrac{\mathrm d v}{\mathrm d t}$. In a series RC circuit with source $E$, KVL gives</p>$$RC\,\frac{\mathrm d v}{\mathrm d t} + v = E, \qquad v(0) = 0,$$<p>a linear first-order ODE (module 15) with solution $v(t) = E\left(1 - e^{-t/(RC)}\right)$. The product $\tau = RC$ is the <b>time constant</b>: after $\tau$ the capacitor has reached $1 - e^{-1} \approx 63\%$ of $E$.</p>` },
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
