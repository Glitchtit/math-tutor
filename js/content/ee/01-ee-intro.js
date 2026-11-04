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
      id: 'derive-demo',
      title: 'DEMO: derive block (temporary)',
      blocks: [
        { type: 'widget', name: 'converter', config: { topology: 'boost', D: 0.6 } },
        { type: 'widget', name: 'pefig', config: { fig: 'buckOn', caption: 'Buck on-state' } },
        { type: 'reveal', prompt: 'Draw the buck waveforms over two periods ($D=0.4$).', checklist: ['$v_L$ is a rectangle', '$i_L$ is a triangle around $I_L$'], blocks: [{ type: 'widget', name: 'pefig', config: { fig: 'wfBuck' } }] },
        { type: 'blanks', items: [{ html: 'If $R_1/R_3=R_2/R_4$ the bridge is [[]].', answers: ['balanced'] }, { html: 'A bridge with 4 nodes needs [[]] KCL equations.', answers: [{ num: 3 }] }] },
        { type: 'examquiz', questions: [{ q: 'AC to DC is a', choices: ['Inverter', 'Rectifier'], answer: 1, explain: 'Rectifier.' }, { q: 'DC to AC is an', choices: ['Inverter', 'Rectifier'], answer: 0, explain: 'Inverter.' }] },
        { type: 'figure', svg: '<svg viewBox="0 0 200 60"><path class="sch" d="M10 30 H190"/><text class="sch-t" x="90" y="22">wire</text></svg>', caption: 'Static figure' },
        { type: 'derive', symbolic: true, title: 'Boost converter: from volt-second balance to the gain', colors: { Vs: 1, Vo: 2, D: 3, omd: 4, Ts: 5 }, steps: [
          { kind: 'both', label: String.raw`Both sides $\div T_s$`, from: String.raw`\T{Vs-1}{V_s}\,\T{D-1}{D}\,\T{Ts-1}{T_s}+(\T{Vs-2}{V_s}-\T{Vo-1}{V_o})\,\T{omd-1}{(1-D)}\,\T{Ts-2}{T_s}=0`,
            to: String.raw`\T{Vs-1}{V_s}\,\T{D-1}{D}+(\T{Vs-2}{V_s}-\T{Vo-1}{V_o})\,\T{omd-1}{(1-D)}=0`,
            why: String.raw`Every term on the left has a factor $T_s$. Dividing both sides by $T_s$ removes it ($\frac{T_s}{T_s}=1$), and $0\div T_s$ is still $0$.` },
          { kind: 'expand', label: String.raw`Multiply $(1-D)$ into the bracket`, to: String.raw`\T{Vs-1}{V_s}\,\T{D-1}{D}+\T{Vs-2}{V_s}\,\T{omd-1}{(1-D)}-\T{Vo-1}{V_o}\,\T{omd-2}{(1-D)}=0`,
            map: { 'omd-1': ['omd-1', 'omd-2'] }, arrows: { 'omd-1': '× each term in the bracket' },
            why: String.raw`$(1-D)$ multiplies everything inside the bracket: one copy goes to $V_s$, one to $V_o$. The minus in front of $V_o$ stays with it.` },
          { kind: 'expand', label: String.raw`Multiply $V_s$ into $(1-D)$`, from: String.raw`\T{Vs-1}{V_s}\,\T{D-1}{D}+\T{Vs-2}{V_s}\,\T{omd-1}{(\T{one-1}{1}-\T{D-2}{D})}-\T{Vo-1}{V_o}\,\T{omd-2}{(1-D)}=0`,
            to: String.raw`\T{Vs-1}{V_s}\,\T{D-1}{D}+\T{Vs-2}{V_s}-\T{Vs-3}{V_s}\,\T{D-2}{D}-\T{Vo-1}{V_o}\,\T{omd-2}{(1-D)}=0`,
            map: { 'Vs-2': ['Vs-2', 'Vs-3'] }, arrows: { 'Vs-2': '× 1 and × D', 'D-2': '' },
            why: String.raw`$V_s\cdot 1 = V_s$ (the 1 changes nothing, so it is crossed out) and $V_s\cdot(-D) = -V_sD$.` },
          { kind: 'cancel', label: String.raw`$+V_sD - V_sD = 0$`, to: String.raw`\T{Vs-2}{V_s}-\T{Vo-1}{V_o}\,\T{omd-2}{(1-D)}=0`,
            why: String.raw`$+V_sD$ and $-V_sD$ are the same size with opposite signs, so together they are $0$.` },
          { kind: 'both', label: String.raw`Both sides $+\,V_o(1-D)$`, to: String.raw`\T{Vs-2}{V_s}=\T{Vo-1}{V_o}\,\T{omd-2}{(1-D)}`, arrows: { 'Vo-1': '+Vo(1−D) on both sides', 'omd-2': '' },
            why: String.raw`Adding $V_o(1-D)$ to both sides cancels it on the left and makes it appear on the right with a $+$. That is why "moving a term across the $=$" flips its sign.` },
          { kind: 'result', label: String.raw`Both sides $\div V_s(1-D)$`, to: String.raw`\frac{\T{Vo-1}{V_o}}{\T{Vs-2}{V_s}}=\frac{1}{\T{omd-2}{1-D}}`, arrows: { 'Vs-2': '÷Vs', 'Vo-1': 'swap sides', 'omd-2': '÷(1−D)' },
            why: String.raw`Divide both sides by $V_s$ to get the ratio, and by $(1-D)$ to free it on the right. Since $1-D<1$, the output is always higher than the input.` },
        ] },
        { type: 'derive', title: 'With numbers: what duty cycle gives 30 V from 12 V?', given: String.raw`\T{Vs-0}{V_s}=12\text{ V},\quad \T{Vo-0}{V_o}=30\text{ V}`, colors: { Vs: 1, Vo: 2, D: 3, omd: 4, n: 8 }, steps: [
          { kind: 'sub', label: 'Put the given values into the formula', from: String.raw`\frac{\T{Vo-x}{V_o}}{\T{Vs-x}{V_s}}=\frac{1}{1-D}\qquad\qquad V_s=\T{Vs-1}{12},\quad V_o=\T{Vo-1}{30}`,
            to: String.raw`\frac{\T{Vo-1}{30}}{\T{Vs-1}{12}}=\frac{1}{1-D}`, arrows: { 'Vs-1': 'Vs = 12 V', 'Vo-1': 'Vo = 30 V' },
            why: String.raw`Each number keeps the colour of the symbol it replaces. Both are volts, so the units cancel in the ratio.` },
          { kind: 'calc', label: String.raw`$30\div 12$`, from: String.raw`\T{n-r}{\frac{30}{12}}=\frac{1}{\T{omd-1}{1-D}}`, to: String.raw`\T{n-r}{2.5}=\frac{1}{\T{omd-1}{1-D}}`, arrows: { 'n-r': '30 ÷ 12' },
            why: String.raw`The converter must step the voltage up 2.5 times.` },
          { kind: 'both', label: String.raw`Both sides $\times (1-D)$`, to: String.raw`\T{n-r}{2.5}\,\T{omd-1}{(1-D)}=\T{n-1}{1}`, arrows: { 'omd-1': '× (1−D) on both sides' },
            why: String.raw`$D$ is stuck in a denominator. Multiplying both sides by $(1-D)$ cancels it on the right.` },
          { kind: 'both', label: String.raw`Both sides $\div 2.5$`, to: String.raw`\T{omd-1}{1-D}=\frac{\T{n-1}{1}}{\T{n-r}{2.5}}`, arrows: { 'n-r': '÷ 2.5 on both sides', 'omd-1': '' },
            why: String.raw`Now the bracket stands alone.` },
          { kind: 'calc', label: String.raw`$1\div 2.5$`, from: String.raw`1-D=\T{n-q}{\frac{1}{2.5}}`, to: String.raw`1-D=\T{n-q}{0.4}`, arrows: { 'n-q': '1 ÷ 2.5' }, why: String.raw`$1\div 2.5=0.4$.` },
          { kind: 'both', label: String.raw`Both sides $+D-0.4$`, from: String.raw`\T{n-o}{1}-\T{D-1}{D}=\T{n-q}{0.4}`, to: String.raw`\T{D-1}{D}=\T{n-o}{1}-\T{n-q}{0.4}=0.6`, arrows: { 'D-1': 'swap sides', 'n-q': 'crosses the =, sign flips' },
            why: String.raw`The switch must be on <b>60 %</b> of each period.` },
          { kind: 'check', label: 'Put the answer back in', from: String.raw`V_o=\frac{\T{Vs-x}{V_s}}{1-\T{D-x}{D}}\qquad\qquad V_s=\T{Vs-1}{12},\quad D=\T{D-1}{0.6}`,
            to: String.raw`V_o=\frac{\T{Vs-1}{12}}{1-\T{D-1}{0.6}}=\frac{12}{0.4}=30\text{ V}\ \checkmark`, arrows: { 'Vs-1': '', 'D-1': '' },
            why: String.raw`It gives the 30 V we asked for, so $D=0.6$ is right.` },
        ] },
      ],
    },
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
