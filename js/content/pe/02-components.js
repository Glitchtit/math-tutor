// Power Electronics — Lecture 2.1: Laws and circuit components. Ported from docs/superpowers/pe1-artifact.html.

export default {
  id: 'pe-l2-components',
  number: 3,
  part: 'pe-basics',
  title: 'Lecture 2.1: Laws and circuit components',
  summary: 'Quantities, Ohm, power, series and parallel resistors, the voltage divider, capacitor, inductor, diode and the transistor as a switch.',
  intro: String.raw`<p>Quantities, Ohm, power, series and parallel resistors, the voltage divider, capacitor, inductor, diode and the transistor as a switch.</p>`,
  lessons: [
    // ------------------------------------------------------------------ quantities and laws
    {
      id: 'quantities-laws',
      title: 'Quantities and laws',
      blocks: [
        { type: 'text', html: String.raw`<p>Circuit components control, convert or condition energy. Circuit analysis examines voltage, current and power. Tools: Ohm, Kirchhoff, (Fourier). Purpose: modelling and performance evaluation (losses, dynamics, resonance).</p>
<h3>Quantities</h3>
<ul>
<li><b>Current</b> $i=\dfrac{dq}{dt}$ [A]: how much charge passes per second (a rate, toolkit M6). 1 A = 1 C/s.</li>
<li><b>Voltage</b> $v=v_1-v_2$ [V]: potential difference between two points, how hard charges are pushed.</li>
<li><b>Power</b> $P=VI$ [W]: rate of energy transfer. 1 W = 1 J/s.</li>
</ul>
<h3>Laws</h3>` },
        { type: 'table',
          head: ['Law', 'Who / when', 'Statement'],
          rows: [
            ['Ohm', 'Georg Simon Ohm, 1827', String.raw`Current in a conductor is proportional to the voltage across it: $V=IR$`],
            ['Faraday', 'Michael Faraday, 1831', String.raw`1st: an EMF is induced in an $N$-turn coil when the linked flux changes. 2nd: its magnitude is proportional to the rate of change of flux. $e=-N\,d\Phi/dt$`],
            ['Lenz', 'Heinrich Lenz, 1834', 'The induced EMF opposes the change in flux. Lenz gives the <em>direction</em> (the minus sign)'],
            ['Kirchhoff', 'Gustav Robert Kirchhoff, 1845', 'KCL: algebraic sum of currents at a junction is zero. KVL: around any closed loop, sum of EMFs = sum of voltage drops'],
          ] },
        { type: 'quiz', question: 'Lenz\'s law determines',
          choices: ['The magnitude of the induced EMF', 'The relation between charge and voltage', 'The direction of the induced EMF (it opposes the change in flux)', 'The sum of currents at a node'], answer: 2,
          explain: 'Faraday\'s second law gives the magnitude; Lenz gives the direction, the minus sign.' },
      ],
    },

    // ------------------------------------------------------------------ resistors
    {
      id: 'resistors',
      title: 'Resistor power, series and parallel',
      blocks: [
        { type: 'text', html: String.raw`<h3>Resistor power</h3>` },
        { type: 'derive', symbolic: true, title: String.raw`Resistor power: $P=I^2R=V^2/R$`, colors: { V: 1, IR: 1, I: 2, VR: 3 },
          steps: [
            { kind: 'start', label: 'Two known relations',
              from: String.raw`P=\T{V-1}{V}\,I\qquad\qquad \T{V-2}{V}=\T{IR-1}{IR}`,
              to: String.raw`P=\T{V-1}{V}\,I\qquad\qquad \T{V-2}{V}=\T{IR-1}{IR}`,
              why: String.raw`Definition of power, and Ohm's law. $V$ is coloured because we will swap it out.` },
            { kind: 'sub', label: String.raw`Put $IR$ in place of $V$`, to: String.raw`P=\T{IR-1}{(IR)}\,I`, arrows: { 'IR-1': 'replaces V' },
              why: String.raw`Ohm's law says $V$ and $IR$ are equal, so $IR$ can stand where $V$ stood.` },
            { kind: 'calc', label: 'Reorder the factors', from: String.raw`P=(\T{I-1}{I}R)\,\T{I-2}{I}`, to: String.raw`P=\T{I-1}{I}\cdot\T{I-2}{I}\cdot R`, arrows: { 'I-2': 'order does not matter' },
              why: 'Order of multiplication does not matter, so the two currents can sit next to each other.' },
            { kind: 'calc', label: String.raw`$I\cdot I=I^2$`, to: String.raw`P=\T{I-1}{I^2}R`, map: { 'I-2': ['I-1'] },
              why: String.raw`$I\cdot I$ is written $I^2$.` },
            { kind: 'result', label: String.raw`Or swap $I$ instead, using $I=V/R$`,
              from: String.raw`P=V\cdot\T{I-3}{I}\qquad \T{I-4}{I}=\T{VR-1}{\frac{V}{R}}`,
              to: String.raw`P=V\cdot\T{VR-1}{\frac{V}{R}}=\frac{V^2}{R}`, arrows: { 'VR-1': 'replaces I' },
              why: String.raw`So $P=I^2R=\frac{V^2}{R}$. All of this power becomes heat in the resistor.` },
          ] },
        { type: 'derive', title: String.raw`With numbers: 2 A through 5 Ω`,
          given: String.raw`\T{I-0}{I}=2\text{ A},\quad \T{R-0}{R}=5\ \Omega`, colors: { I: 2, R: 4, V: 1, n: 8 },
          steps: [
            { kind: 'sub', label: 'Put the given values into the formula',
              from: String.raw`P=\T{I-x}{I}^{2}\,\T{R-x}{R}\qquad I=\T{I-1}{2},\ R=\T{R-1}{5}`,
              to: String.raw`P=\T{I-1}{2}^{2}\cdot\T{R-1}{5}`, arrows: { 'I-1': 'I = 2 A', 'R-1': 'R = 5 Ω' },
              why: 'Each number keeps the colour of the symbol it replaces.' },
            { kind: 'calc', label: String.raw`$2^2\cdot5$`, from: String.raw`P=\T{n-1}{2^{2}\cdot5}`, to: String.raw`P=\T{n-1}{20}\text{ W}`, why: String.raw`$4\cdot5=20$; A² times Ω gives W.` },
            { kind: 'check', label: String.raw`Check with the other form $V^2/R$`,
              from: String.raw`\frac{V^2}{R}\qquad V=IR=\T{V-1}{10}\text{ V},\ R=\T{R-1}{5}`,
              to: String.raw`\frac{\T{V-1}{10}^{2}}{\T{R-1}{5}}=\frac{100}{5}=20\text{ W}\ \checkmark`, arrows: { 'V-1': '' },
              why: String.raw`$V=2\cdot5=10$ V. Both forms give 20 W, as they must.` },
          ] },

        { type: 'text', html: String.raw`<h3>Series and parallel resistors</h3>` },
        { type: 'figure', caption: String.raw`Series: one path, so the <b>same current</b> in both. Voltages add.`,
          svg: String.raw`<svg viewBox="0 0 300 120" role="img" aria-label="Two resistors in series: the same current I flows through both; their voltages add.">
  <path class="sch" d="M20 50 H60 l5 -10 l10 20 l10 -20 l10 20 l10 -20 l5 10 H160 l5 -10 l10 20 l10 -20 l10 20 l10 -20 l5 10 H280"/>
  <text class="svgtxt-i" x="80" y="30">R1</text><text class="svgtxt-i" x="180" y="30">R2</text>
  <path class="sg" style="stroke-width:2;fill:none" d="M28 62 H52"/><polygon class="fg" points="52,58 60,62 52,66"/><text class="cg" x="30" y="80" style="font-family:var(--f-mono);font-size:13px">I</text>
  <text class="ca" x="60" y="95" style="font-family:var(--f-mono);font-size:13px">+ I·R1 −</text>
  <text class="cb" x="160" y="95" style="font-family:var(--f-mono);font-size:13px">+ I·R2 −</text>
</svg>` },
        { type: 'derive', symbolic: true, title: 'Series resistance', colors: { A: 1, B: 2, I: 3, Rs: 4 },
          steps: [
            { kind: 'start', label: 'Series: KVL adds the two drops',
              from: String.raw`V=\T{A-1}{I\,R_1}+\T{B-1}{I\,R_2}`, to: String.raw`V=\T{A-1}{I\,R_1}+\T{B-1}{I\,R_2}`,
              why: String.raw`Same $I$ through both resistors (picture above), and each drop is $I$ times its resistance.` },
            { kind: 'factor', label: String.raw`Factor out the common $I$`, from: String.raw`V=\T{I-1}{I}\,R_1+\T{I-2}{I}\,R_2`, to: String.raw`V=\T{I-1}{I}\,(R_1+R_2)`,
              map: { 'I-2': ['I-1'] }, arrows: { 'I-2': 'pull out' },
              why: String.raw`Both terms contain $I$ (toolkit M4).` },
            { kind: 'result', label: String.raw`Compare with Ohm's law $V=I\cdot R$`, from: String.raw`V=I\,\T{Rs-1}{(R_1+R_2)}`, to: String.raw`R_s=\T{Rs-1}{R_1+R_2}`, arrows: { 'Rs-1': 'plays the role of R' },
              why: 'The bracket plays the role of $R$: the pair behaves like one resistor of that size.' },
          ] },
        { type: 'derive', title: String.raw`With numbers: 4 Ω and 6 Ω on 20 V`,
          given: String.raw`\T{Ra-0}{R_1}=4\ \Omega,\quad \T{Rb-0}{R_2}=6\ \Omega,\quad V=20\text{ V}`, colors: { Ra: 1, Rb: 2, n: 8 },
          steps: [
            { kind: 'sub', label: 'Put the given values into the formula',
              from: String.raw`R_s=\T{Ra-x}{R_1}+\T{Rb-x}{R_2}\qquad R_1=\T{Ra-1}{4},\ R_2=\T{Rb-1}{6}`,
              to: String.raw`R_s=\T{Ra-1}{4}+\T{Rb-1}{6}`, arrows: { 'Ra-1': 'R1 = 4 Ω', 'Rb-1': 'R2 = 6 Ω' },
              why: 'Each number keeps the colour of the symbol it replaces.' },
            { kind: 'calc', label: String.raw`$4+6$`, from: String.raw`R_s=\T{n-1}{4+6}`, to: String.raw`R_s=\T{n-1}{10}\ \Omega`, why: 'Series resistances simply add.' },
            { kind: 'check', label: 'Check with KVL', from: String.raw`I=\frac{V}{R_s}=\frac{20}{10}=2\text{ A}`, to: String.raw`I\,R_1+I\,R_2=2\cdot4+2\cdot6=8+12=20\text{ V}=V\ \checkmark`,
              why: 'With 2 A flowing, the two drops add back up to the 20 V supply.' },
          ] },
        { type: 'figure', caption: String.raw`Parallel: both connect between the same two nodes, so the <b>same voltage</b> across both. Currents add.`,
          svg: String.raw`<svg viewBox="0 0 300 140" role="img" aria-label="Two resistors in parallel: the same voltage V across both; their currents add.">
  <path class="sch" d="M20 70 H70 M70 30 V110 M70 30 H110 l5 -10 l10 20 l10 -20 l10 20 l10 -20 l5 10 H230 M70 110 H110 l5 -10 l10 20 l10 -20 l10 20 l10 -20 l5 10 H230 M230 30 V110 M230 70 H280"/>
  <text class="svgtxt-i" x="128" y="14">R1</text><text class="svgtxt-i" x="128" y="136">R2</text>
  <text class="ca" x="88" y="52" style="font-family:var(--f-mono);font-size:12px">I1 = V/R1</text>
  <text class="cb" x="88" y="96" style="font-family:var(--f-mono);font-size:12px">I2 = V/R2</text>
  <text class="cg" x="22" y="62" style="font-family:var(--f-mono);font-size:12px">I</text>
</svg>` },
        { type: 'derive', symbolic: true, title: 'Parallel resistance: product over sum', colors: { I: 5, A: 1, B: 2, V: 3, F: 4 },
          steps: [
            { kind: 'start', label: 'Parallel: KCL adds the two branch currents',
              from: String.raw`\T{I-1}{I}=\T{A-1}{\frac{V}{R_1}}+\T{B-1}{\frac{V}{R_2}}`, to: String.raw`\T{I-1}{I}=\T{A-1}{\frac{V}{R_1}}+\T{B-1}{\frac{V}{R_2}}`,
              why: String.raw`Same $V$ across both (picture above); each branch obeys Ohm's law.` },
            { kind: 'factor', label: String.raw`Factor out the common $V$`, from: String.raw`\T{I-1}{I}=\frac{\T{V-1}{V}}{R_1}+\frac{\T{V-2}{V}}{R_2}`, to: String.raw`\T{I-1}{I}=\T{V-1}{V}\left(\frac1{R_1}+\frac1{R_2}\right)`,
              map: { 'V-2': ['V-1'] }, arrows: { 'V-2': 'pull out' },
              why: String.raw`$\frac{V}{R_1}=V\cdot\frac1{R_1}$, so both terms contain the factor $V$.` },
            { kind: 'expand', label: String.raw`Common denominator: multiply by $\frac{R_2}{R_2}$ and $\frac{R_1}{R_1}$`,
              from: String.raw`\frac1{R_1}+\frac1{R_2}`, to: String.raw`\frac1{R_1}\cdot\T{m-1}{\frac{R_2}{R_2}}+\frac1{R_2}\cdot\T{m-2}{\frac{R_1}{R_1}}`,
              why: String.raw`Now just the bracket. Multiplying by $\frac{R_2}{R_2}$ is multiplying by 1, so the value is unchanged. Numbers: $\frac12+\frac13=\frac36+\frac26$.` },
            { kind: 'calc', label: 'Multiply the fractions', to: String.raw`\frac{\T{m-1}{R_2}}{R_1\T{m-3}{R_2}}+\frac{\T{m-2}{R_1}}{\T{m-4}{R_1}R_2}`,
              map: { 'm-1': ['m-1', 'm-3'], 'm-2': ['m-2', 'm-4'] },
              why: String.raw`Top times top, bottom times bottom. Both fractions now have $R_1R_2$ underneath.` },
            { kind: 'calc', label: 'Add over the common denominator', from: String.raw`\frac{\T{a-1}{R_2}}{R_1R_2}+\frac{\T{b-1}{R_1}}{R_1R_2}`, to: String.raw`\frac{\T{b-1}{R_1}+\T{a-1}{R_2}}{R_1R_2}`,
              why: String.raw`Same denominator, so add the tops. Numbers: $\frac36+\frac26=\frac56$.` },
            { kind: 'sub', label: 'Put the bracket back into the current',
              from: String.raw`\T{I-1}{I}=V\,\T{k-1}{\left(\frac1{R_1}+\frac1{R_2}\right)}\qquad \T{k-2}{\frac1{R_1}+\frac1{R_2}}=\T{F-1}{\frac{R_1+R_2}{R_1R_2}}`,
              to: String.raw`\T{I-1}{I}=V\cdot\T{F-1}{\frac{R_1+R_2}{R_1R_2}}`, arrows: { 'F-1': 'same value, new shape' },
              why: 'The bracket and the single fraction are equal, so one can replace the other.' },
            { kind: 'sub', label: String.raw`Ohm's law $R_p=V/I$: put in the current`,
              from: String.raw`R_p=\frac{V}{\T{I-2}{I}}\qquad \T{I-1}{I}=\T{F-1}{V\cdot\frac{R_1+R_2}{R_1R_2}}`,
              to: String.raw`R_p=\frac{V}{\T{F-1}{V\cdot\frac{R_1+R_2}{R_1R_2}}}`, arrows: { 'F-1': 'replaces I' },
              why: String.raw`The resistance of the pair is the voltage across it divided by the total current into it.` },
            { kind: 'cancel', label: String.raw`$V$ cancels top and bottom`, from: String.raw`R_p=\frac{\T{c-1}{V}}{\T{c-2}{V}\cdot\frac{R_1+R_2}{R_1R_2}}`, to: String.raw`R_p=\frac{1}{\frac{R_1+R_2}{R_1R_2}}`,
              why: String.raw`$V$ is a factor on top and underneath: $\frac VV=1$, which leaves a 1 on top.` },
            { kind: 'result', label: '1 divided by a fraction = the fraction flipped', from: String.raw`R_p=\frac{1}{\T{F-1}{\frac{R_1+R_2}{R_1R_2}}}`, to: String.raw`R_p=\T{F-1}{\frac{R_1R_2}{R_1+R_2}}`, arrows: { 'F-1': 'flip' },
              why: String.raw`"Product over sum". Always smaller than the smaller resistor. Numbers: $\frac{1}{5/6}=\frac65$.` },
          ] },
        { type: 'derive', title: String.raw`With numbers: 2 Ω and 3 Ω in parallel`,
          given: String.raw`\T{Ra-0}{R_1}=2\ \Omega,\quad \T{Rb-0}{R_2}=3\ \Omega`, colors: { Ra: 1, Rb: 2, n: 8 },
          steps: [
            { kind: 'sub', label: 'Put the given values into the formula',
              from: String.raw`R_p=\frac{\T{Ra-x}{R_1}\,\T{Rb-x}{R_2}}{\T{Ra-y}{R_1}+\T{Rb-y}{R_2}}\qquad R_1=\T{Ra-1}{2},\ R_2=\T{Rb-1}{3}`,
              to: String.raw`R_p=\frac{\T{Ra-1}{2}\cdot\T{Rb-1}{3}}{\T{Ra-2}{2}+\T{Rb-2}{3}}`,
              map: { 'Ra-1': ['Ra-1', 'Ra-2'], 'Rb-1': ['Rb-1', 'Rb-2'] }, arrows: { 'Ra-1': 'R1 = 2 Ω', 'Rb-1': 'R2 = 3 Ω' },
              why: 'Each value goes into two places: once in the product on top, once in the sum underneath.' },
            { kind: 'calc', label: String.raw`$2\cdot3$ and $2+3$`, from: String.raw`R_p=\frac{\T{n-1}{2\cdot3}}{\T{n-2}{2+3}}`, to: String.raw`R_p=\frac{\T{n-1}{6}}{\T{n-2}{5}}=1.2\ \Omega`,
              why: String.raw`$1.2\ \Omega$ is smaller than the smaller resistor (2 Ω), as it must be.` },
            { kind: 'check', label: String.raw`Check with $\frac1{R_p}=\frac1{R_1}+\frac1{R_2}$`,
              from: String.raw`\frac1{R_1}+\frac1{R_2}\qquad R_1=\T{Ra-1}{2},\ R_2=\T{Rb-1}{3}`,
              to: String.raw`\frac1{\T{Ra-1}{2}}+\frac1{\T{Rb-1}{3}}=\frac36+\frac26=\frac56,\qquad \frac{1}{5/6}=\frac65=1.2\ \Omega\ \checkmark`, arrows: { 'Ra-1': '', 'Rb-1': '' },
              why: 'The bracket form from the derivation gives the same answer.' },
          ] },
        { type: 'quiz', question: String.raw`Two resistors of 10 Ω and 40 Ω are in parallel. Which value can $R_p$ be?`,
          choices: ['50 Ω', '25 Ω', '8 Ω', '40 Ω'], answer: 2,
          explain: String.raw`Product over sum: $\frac{10\cdot40}{50}=8$ Ω, smaller than the smaller resistor.` },
      ],
    },

    // ------------------------------------------------------------------ voltage divider
    {
      id: 'divider',
      title: 'Voltage divider (slide example: 24 V → 5 V?)',
      blocks: [
        { type: 'derive', symbolic: true, title: 'Voltage divider', colors: { I: 1, F: 1, Vi: 2, Rb: 3 },
          steps: [
            { kind: 'start', label: 'Series current from Ohm\'s law on the total',
              from: String.raw`\T{I-1}{I}=\frac{V_{in}}{R_1+R_2}`, to: String.raw`\T{I-1}{I}=\frac{V_{in}}{R_1+R_2}`,
              why: String.raw`No load connected, so $R_1$ and $R_2$ are in series and the total resistance is $R_1+R_2$.` },
            { kind: 'sub', label: String.raw`Put $I$ into $V_{out}=I\,R_2$`,
              from: String.raw`V_{out}=\T{I-2}{I}\,R_2\qquad \T{I-1}{I}=\T{F-1}{\frac{V_{in}}{R_1+R_2}}`,
              to: String.raw`V_{out}=\T{F-1}{\frac{V_{in}}{R_1+R_2}}\cdot R_2`, arrows: { 'F-1': 'replaces I' },
              why: String.raw`The output is the voltage across $R_2$, which by Ohm's law is $I\,R_2$.` },
            { kind: 'result', label: 'Swap the factors', from: String.raw`V_{out}=\frac{\T{Vi-1}{V_{in}}}{R_1+R_2}\cdot \T{Rb-1}{R_2}`, to: String.raw`V_{out}=\frac{\T{Rb-1}{R_2}}{R_1+R_2}\,\T{Vi-1}{V_{in}}`,
              arrows: { 'Rb-1': 'onto the top', 'Vi-1': 'out in front' },
              why: String.raw`Order of multiplication does not matter. Written like this, each resistor takes a share of $V_{in}$ proportional to its size.` },
          ] },
        { type: 'derive', title: 'With numbers: the slide example',
          given: String.raw`\T{Vi-0}{V_{in}}=24\text{ V},\quad \T{Ra-0}{R_1}=4.7\ \Omega,\quad \T{Rb-0}{R_2}=1.2\ \Omega`, colors: { Vi: 2, Rb: 3, Ra: 4, n: 8 },
          steps: [
            { kind: 'sub', label: 'Put the given values into the formula',
              from: String.raw`V_{out}=\frac{\T{Rb-x}{R_2}}{\T{Ra-x}{R_1}+\T{Rb-y}{R_2}}\,\T{Vi-x}{V_{in}}\qquad R_1=\T{Ra-1}{4.7},\ R_2=\T{Rb-1}{1.2},\ V_{in}=\T{Vi-1}{24}`,
              to: String.raw`V_{out}=\frac{\T{Rb-1}{1.2}}{\T{Ra-1}{4.7}+\T{Rb-2}{1.2}}\cdot\T{Vi-1}{24}`,
              map: { 'Rb-1': ['Rb-1', 'Rb-2'] }, arrows: { 'Ra-1': 'R1', 'Rb-1': 'R2 (twice)', 'Vi-1': 'Vin' },
              why: String.raw`$R_2$ appears twice, on top and in the sum underneath.` },
            { kind: 'calc', label: String.raw`$4.7+1.2$`, from: String.raw`V_{out}=\frac{1.2}{\T{n-1}{4.7+1.2}}\cdot24`, to: String.raw`V_{out}=\frac{1.2}{\T{n-1}{5.9}}\cdot24`, why: String.raw`Total resistance 5.9 Ω.` },
            { kind: 'calc', label: String.raw`$1.2\div5.9$, then $\times 24$`, from: String.raw`V_{out}=\T{n-2}{\frac{1.2}{5.9}}\cdot24`, to: String.raw`V_{out}=\T{n-2}{0.2034}\cdot24=4.88\text{ V}`,
              why: 'The slide rounds to 4.9 V.' },
            { kind: 'calc', label: 'Check the cost', from: String.raw`I=\frac{V_{in}}{R_1+R_2}`, to: String.raw`I=\frac{24}{5.9}=4.07\text{ A},\qquad P=24\cdot4.07=97.6\text{ W}`,
              why: String.raw`The divider burns about 98 W as heat with nothing connected, and $V_{out}$ sags when a load is attached. That is why power electronics uses switching converters instead.` },
            { kind: 'check', label: String.raw`Put the current back: $V_{out}=I\,R_2$`, from: String.raw`V_{out}=I\,R_2`, to: String.raw`V_{out}=4.07\cdot1.2=4.88\text{ V}\ \checkmark`,
              why: 'The same 4.88 V, found the other way.' },
          ] },
        { type: 'quiz', question: 'Why is a resistive voltage divider not used to make 5 V from 24 V for a real load?',
          choices: ['It cannot produce a voltage below the input', 'It dissipates large power as heat and the output changes with load', 'It only works with AC', 'Ohm\'s law does not apply'], answer: 1,
          explain: 'The L2 example (4.7 Ω / 1.2 Ω) burns about 98 W with no load connected.' },
      ],
    },

    // ------------------------------------------------------------------ capacitor and inductor
    {
      id: 'c-and-l',
      title: 'Capacitor and inductor',
      blocks: [
        { type: 'text', html: String.raw`<h3>Capacitor</h3><p>Stores energy in an <b>electric field</b> between two plates separated by a dielectric (insulator full of dipoles that align with the field). Unit farad [F]. Blocks DC, passes AC.</p>` },
        { type: 'derive', symbolic: true, title: String.raw`Capacitor law: $i=C\,dv/dt$`, colors: { q: 1, dq: 1, i: 2, C: 3 },
          steps: [
            { kind: 'start', label: 'Definition of capacitance', from: String.raw`\T{q-1}{q}=C\,v`, to: String.raw`\T{q-1}{q}=C\,v`,
              why: String.raw`Charge stored is proportional to voltage; $C$ is the fixed constant of proportionality.` },
            { kind: 'calculus', label: 'Differentiate both sides', to: String.raw`\frac{d\T{q-1}{q}}{dt}=\frac{d}{dt}(C\,v)`,
              why: 'Same operation on both sides (M1). We want current, and current is the rate of change of charge.' },
            { kind: 'sub', label: String.raw`$\frac{dq}{dt}=i$ (definition of current)`,
              from: String.raw`\T{dq-1}{\frac{dq}{dt}}=\frac{d}{dt}(C\,v)\qquad \T{dq-2}{\frac{dq}{dt}}=\T{i-1}{i}`,
              to: String.raw`\T{i-1}{i}=\frac{d}{dt}(C\,v)`, arrows: { 'i-1': String.raw`replaces dq/dt` },
              why: 'Current is defined as charge per second, so the left side is the current.' },
            { kind: 'result', label: String.raw`Constant factor rule (M6): $C$ comes out`, from: String.raw`\T{i-1}{i}=\frac{d}{dt}(\T{C-1}{C}\,v)`, to: String.raw`\T{i-1}{i}=\T{C-1}{C}\,\frac{dv}{dt}`, arrows: { 'C-1': 'constant comes out' },
              why: String.raw`Capacitor current is proportional to how fast its voltage changes. Steady DC voltage → slope 0 → $i=0$: <b>capacitor blocks DC</b>. A sudden jump in voltage would need infinite current, so <b>capacitor voltage cannot jump</b>.` },
          ] },
        { type: 'derive', title: 'With numbers: 10 µF, voltage rising 5 V per ms',
          given: String.raw`\T{C-0}{C}=10\ \mu\text{F},\quad \T{s-0}{\frac{dv}{dt}}=5000\text{ V/s}`, colors: { C: 3, s: 4, n: 8 },
          steps: [
            { kind: 'sub', label: 'Put the given values into the formula',
              from: String.raw`i=\T{C-x}{C}\,\T{s-x}{\frac{dv}{dt}}\qquad C=\T{C-1}{10\cdot10^{-6}},\ \frac{dv}{dt}=\T{s-1}{5000}`,
              to: String.raw`i=\T{C-1}{10\cdot10^{-6}}\cdot\T{s-1}{5000}`, arrows: { 'C-1': 'C = 10 µF', 's-1': 'slope' },
              why: String.raw`Convert the prefix first: µ $=10^{-6}$. 5 V per ms is $5/10^{-3}=5000$ V/s.` },
            { kind: 'calc', label: String.raw`$10\cdot10^{-6}\cdot5000$`, from: String.raw`i=\T{n-1}{10\cdot10^{-6}\cdot5000}`, to: String.raw`i=\T{n-1}{0.05}\text{ A}=50\text{ mA}`, why: String.raw`$5\cdot10^{4}\cdot10^{-5}=0.05$.` },
            { kind: 'check', label: 'Solve back for the slope', from: String.raw`\frac{dv}{dt}=\frac{i}{C}`, to: String.raw`\frac{0.05}{10\cdot10^{-6}}=5000\text{ V/s}\ \checkmark`,
              why: String.raw`Dividing both sides of $i=C\frac{dv}{dt}$ by $C$ gives back the slope we started with.` },
          ] },
        { type: 'text', html: String.raw`<p>Same law solved for $v$ (÷ $C$, then integrate both sides): $v=\frac1C\int i\,dt$, the form on the L4 recap slide.</p><h3>Inductor</h3><p>Stores energy in a <b>magnetic field</b>. Unit henry [H]. Blocks AC, passes DC.</p>` },
        { type: 'derive', symbolic: true, title: String.raw`Inductor law: $v=L\,di/dt$`, colors: { phi: 1, Li: 1, L: 3 },
          steps: [
            { kind: 'start', label: 'Definition of inductance', from: String.raw`\T{phi-1}{\varphi_B}=\T{Li-1}{L\,i}`, to: String.raw`\T{phi-1}{\varphi_B}=\T{Li-1}{L\,i}`,
              why: 'Flux (linkage) is proportional to current.' },
            { kind: 'sub', label: String.raw`Put it into Faraday's law $v=\frac{d\varphi_B}{dt}$`,
              from: String.raw`v=\frac{d\T{phi-2}{\varphi_B}}{dt}\qquad \T{phi-1}{\varphi_B}=\T{Li-1}{L\,i}`,
              to: String.raw`v=\frac{d}{dt}(\T{Li-1}{L\,i})`, arrows: { 'Li-1': String.raw`replaces φB` },
              why: String.raw`The Lenz minus sign is absorbed by drawing $v$ as a drop in the direction of $i$: physically the voltage opposes the change in current.` },
            { kind: 'result', label: String.raw`$L$ is constant, so it comes out`, from: String.raw`v=\frac{d}{dt}(\T{L-1}{L}\,i)`, to: String.raw`v=\T{L-1}{L}\,\frac{di}{dt}`, arrows: { 'L-1': 'constant comes out' },
              why: String.raw`Steady DC current → $v=0$: <b>inductor is a short to DC</b>. A sudden jump in current would need infinite voltage, so <b>inductor current cannot jump</b>. That is why a buck converter needs a diode to carry the inductor current when the switch opens.` },
          ] },
        { type: 'derive', title: 'With numbers: 2 mH, current rising 1 A per ms',
          given: String.raw`\T{L-0}{L}=2\text{ mH},\quad \T{s-0}{\frac{di}{dt}}=1000\text{ A/s}`, colors: { L: 3, s: 4, n: 8 },
          steps: [
            { kind: 'sub', label: 'Put the given values into the formula',
              from: String.raw`v=\T{L-x}{L}\,\T{s-x}{\frac{di}{dt}}\qquad L=\T{L-1}{2\cdot10^{-3}},\ \frac{di}{dt}=\T{s-1}{1000}`,
              to: String.raw`v=\T{L-1}{2\cdot10^{-3}}\cdot\T{s-1}{1000}`, arrows: { 'L-1': 'L = 2 mH', 's-1': 'slope' },
              why: String.raw`m $=10^{-3}$. 1 A per ms is $1/10^{-3}=1000$ A/s.` },
            { kind: 'calc', label: String.raw`$2\cdot10^{-3}\cdot1000$`, from: String.raw`v=\T{n-1}{2\cdot10^{-3}\cdot1000}`, to: String.raw`v=\T{n-1}{2}\text{ V}`, why: String.raw`$10^{-3}\cdot10^{3}=1$.` },
            { kind: 'check', label: 'Solve back for the slope', from: String.raw`\frac{di}{dt}=\frac{v}{L}`, to: String.raw`\frac{2}{2\cdot10^{-3}}=1000\text{ A/s}\ \checkmark`,
              why: String.raw`Dividing both sides of $v=L\frac{di}{dt}$ by $L$ gives back the slope we started with.` },
          ] },
        { type: 'callout', kind: 'key', title: 'Mirror image', html: String.raw`<p>Capacitor: $i=C\,\frac{dv}{dt}$, voltage cannot jump, blocks DC. Inductor: $v=L\,\frac{di}{dt}$, current cannot jump, blocks AC. Swap $v\leftrightarrow i$ and $C\leftrightarrow L$ to go from one to the other.</p>` },
        { type: 'callout', kind: 'note', title: 'Beyond the slides', html: String.raw`<p><b>Why "blocks AC / DC".</b> Reactances: $X_C=\dfrac{1}{2\pi fC}$ (infinite at $f=0$, so DC is blocked) and $X_L=2\pi fL$ (zero at $f=0$, large at high $f$). Stored energy: $W_C=\tfrac12CV^2$, $W_L=\tfrac12LI^2$.</p>` },
        { type: 'derive', title: 'With numbers: stored energy',
          given: String.raw`\T{C-0}{C}=100\ \mu\text{F},\ \T{V-0}{V}=10\text{ V};\qquad \T{L-0}{L}=2\text{ mH},\ \T{I-0}{I}=3\text{ A}`, colors: { C: 3, V: 1, L: 4, I: 2, n: 8 },
          steps: [
            { kind: 'sub', label: 'Capacitor: put in the values',
              from: String.raw`W_C=\tfrac12\,\T{C-x}{C}\,\T{V-x}{V}^{2}\qquad C=\T{C-1}{100\cdot10^{-6}},\ V=\T{V-1}{10}`,
              to: String.raw`W_C=\tfrac12\cdot\T{C-1}{100\cdot10^{-6}}\cdot\T{V-1}{10}^{2}`, arrows: { 'C-1': 'C', 'V-1': 'V' },
              why: String.raw`µ $=10^{-6}$.` },
            { kind: 'calc', label: String.raw`$0.5\cdot10^{-4}\cdot100$`, from: String.raw`W_C=\T{n-1}{\tfrac12\cdot10^{-4}\cdot100}`, to: String.raw`W_C=\T{n-1}{5\cdot10^{-3}}\text{ J}=5\text{ mJ}`, why: String.raw`$10^{-4}\cdot100=10^{-2}$, half of that is $5\cdot10^{-3}$.` },
            { kind: 'sub', label: 'Inductor: put in the values',
              from: String.raw`W_L=\tfrac12\,\T{L-x}{L}\,\T{I-x}{I}^{2}\qquad L=\T{L-1}{2\cdot10^{-3}},\ I=\T{I-1}{3}`,
              to: String.raw`W_L=\tfrac12\cdot\T{L-1}{2\cdot10^{-3}}\cdot\T{I-1}{3}^{2}`, arrows: { 'L-1': 'L', 'I-1': 'I' },
              why: String.raw`m $=10^{-3}$.` },
            { kind: 'result', label: String.raw`$10^{-3}\cdot9$`, from: String.raw`W_L=\T{n-2}{\tfrac12\cdot2\cdot10^{-3}\cdot9}`, to: String.raw`W_L=\T{n-2}{9\cdot10^{-3}}\text{ J}=9\text{ mJ}`, why: String.raw`$\tfrac12\cdot2=1$, so $W_L=9\cdot10^{-3}$ J.` },
          ] },
        { type: 'quiz', question: 'A capacitor in DC steady state behaves as',
          choices: ['An open circuit', 'A short circuit', 'A resistor equal to 1/C', 'A voltage source of zero'], answer: 0,
          explain: String.raw`$i=C\,dv/dt$ and $dv/dt=0$ → $i=0$. The inductor is the opposite: a short to DC.` },
      ],
    },

    // ------------------------------------------------------------------ diode and transistor
    {
      id: 'diode-transistor',
      title: 'Diode and transistor as a switch',
      blocks: [
        { type: 'text', html: String.raw`<h3>Diode</h3><p>Two terminals: anode (A) and cathode (K). Conducts A → K only. <b>Forward bias</b> $V_A > V_K$: conducts. <b>Reverse bias</b> $V_A < V_K$: blocks. Ideal diode: zero drop when on, zero current when off (full reverse voltage across it). Practical diode: needs about 0.7 V (Si) before conducting and leaks a little in reverse. Example: half-wave rectifier, which passes only the positive half-cycles of an AC input to the load.</p>
<h3>Transistor (MOSFET as switch)</h3><p>Terminals gate (G), drain (D), source (S). Switching signal applied <em>between gate and source</em>. $V_{GS} > V_{th}$ (threshold): on, current flows D → S. $V_{GS}=0$: off. Unlike a diode, the switching command is independent of the circuit voltages, so the transistor is <em>active</em>. Often drawn as a generic switch.</p>
<p><b>Half-bridge (half-wave) inverter:</b> two switches in series across a DC supply. S1 on / S2 off connects the output to one rail, S1 off / S2 on to the other, producing a square-wave AC output.</p>` },
        { type: 'callout', kind: 'warn', title: 'Half-bridge', html: '<p>Never turn both switches on at once: that shorts the supply.</p>' },
        { type: 'text', html: String.raw`<p><b>Power rating vs switching frequency</b> (slide 26): thyristors/GTOs cover the highest power at low frequency (HVDC, traction), IGBTs the middle (kVA to MVA, around 1–20 kHz: drives, UPS, welding), MOSFETs the highest frequency at lower power (SMPS, 100 kHz and up).</p>` },
        { type: 'quiz', question: 'An enhancement-mode N-channel MOSFET conducts when',
          choices: ['Base current is injected', String.raw`$V_{GS} > V_{th}$`, String.raw`$V_{GS}=0$`, 'The drain is reverse biased'], answer: 1,
          explain: 'Positive gate–source voltage above threshold forms the inversion n-channel. Enhancement mode = normally open.' },
        { type: 'quiz', question: 'Which device covers the highest switching frequency (at lower power), e.g. SMPS at 100 kHz and up?',
          choices: ['Thyristor / GTO', 'IGBT', 'MOSFET', 'Diode'], answer: 2,
          explain: 'Slide 26: thyristors/GTOs highest power at low frequency, IGBTs the middle, MOSFETs the highest frequency.' },
      ],
    },
  ],
  matlab: [],
  assignments: [],
};
