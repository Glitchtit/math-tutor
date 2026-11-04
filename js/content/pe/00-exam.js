// Power Electronics — Exam format and math toolkit. Ported from docs/superpowers/pe1-artifact.html.

export default {
  id: 'pe-exam',
  number: 1,
  part: 'pe-prep',
  title: 'Exam format and math toolkit',
  summary: 'How Mini Exam 1 works (negative marking, provided formula sheet, drawing tasks), how to read the step-by-step math, the formula sheet, and the algebra/calculus toolkit M1–M9.',
  intro: String.raw`<p>How Mini Exam 1 works (negative marking, provided formula sheet, drawing tasks), how to read the step-by-step math, the formula sheet, and the algebra/calculus toolkit M1–M9.</p>`,
  lessons: [
    // ------------------------------------------------------------------ exam format
    {
      id: 'format',
      title: 'What is in the exam, and how to play it',
      blocks: [
        { type: 'text', html: String.raw`<p>Mini Exam 1 covers lectures 1–4. Course info: fill in the blanks and multiple choice with negative marking, drawing circuits and waveforms, some theory and calculation; formula sheet provided.</p>` },
        { type: 'table',
          head: ['Part (course info)', 'What it means for preparation', 'Practise here'],
          rows: [
            [String.raw`Fill in the blanks <b>(negative marking)</b>`, String.raw`Exact terms matter: rectifier, depletion layer, threshold voltage, volt-second balance. Know the numbers: 0.7 V, 63.2 %, 2–3× bandgap.`, 'Exam practice: fill in the blanks'],
            [String.raw`Multiple choice <b>(negative marking)</b>`, String.raw`Comparison tables (Schottky vs PIN, BJT vs MOSFET vs IGBT), SCR modes, conversion types, history.`, 'Exam practice: quiz (with penalty setting)'],
            ['Drawing circuit diagrams and waveforms', String.raw`Buck and boost circuits, their on/off equivalent circuits, and the $v_L$, $i_L$, $i_C$ waveforms. Also RC/RL curves, diode IV curve, half-wave rectifier, half-bridge inverter, device symbols.`, 'Exam practice: drawing practice'],
            ['Some theory and calculation', String.raw`Explain mechanisms in 2–4 sentences. Calculations: buck/boost ratios, $D$, currents, power check, $T_s$, $\tau$, KCL/KVL.`, 'Exam practice: theory questions, worked problems'],
            ['Formula sheet provided', String.raw`You do not need to memorise formulas. You need to know <em>which</em> one applies, how to rearrange it (toolkit M1–M5), and the conditions behind it (steady state, small ripple, ideal components).`, 'Math toolkit (this module)'],
          ] },
        { type: 'text', html: String.raw`<h3>Negative marking: when to guess</h3><p>The penalty per wrong answer is not stated on the slide; check Moodle or ask. Here is the expected gain from guessing on a 4-option question, in units of one correct answer, when you guess at random among the options you could not rule out:</p>` },
        { type: 'table',
          head: ['Options left after ruling some out', 'Chance right', 'Penalty −0.25', 'Penalty −0.33', 'Penalty −0.5', 'Penalty −1'],
          rows: [
            ['4 (no idea)', '25 %', '+0.06', '0.00', '−0.13', '−0.50'],
            ['3 (one ruled out)', '33 %', '+0.17', '+0.11', '0.00', '−0.33'],
            ['2 (two ruled out)', '50 %', '+0.38', '+0.33', '+0.25', '0.00'],
          ] },
        { type: 'text', html: String.raw`<p>How it is calculated: expected gain $=$ P(right) $\times 1\ -$ P(wrong) $\times$ penalty. Example: 3 options left at −0.5.</p>` },
        { type: 'derive', title: 'Expected gain: 3 options left, penalty −0.5',
          given: String.raw`\T{Pr-0}{P_{\text{right}}}=\tfrac13,\quad \T{Pw-0}{P_{\text{wrong}}}=\tfrac23,\quad \T{p-0}{p}=0.5`,
          colors: { Pr: 1, Pw: 2, p: 3 },
          steps: [
            { kind: 'sub', label: 'Put the chances and the penalty into the formula',
              from: String.raw`E=\T{Pr-x}{P_{\text{right}}}\cdot 1-\T{Pw-x}{P_{\text{wrong}}}\cdot\T{p-x}{p}\qquad P_{\text{right}}=\T{Pr-1}{\tfrac13},\ P_{\text{wrong}}=\T{Pw-1}{\tfrac23},\ p=\T{p-1}{0.5}`,
              to: String.raw`E=\T{Pr-1}{\tfrac13}\cdot 1-\T{Pw-1}{\tfrac23}\cdot\T{p-1}{0.5}`,
              arrows: { 'Pr-1': '1 of 3 is right', 'Pw-1': '2 of 3 are wrong', 'p-1': 'penalty' },
              why: String.raw`With 3 options left and a random pick, one of three is right ($\tfrac13$) and two of three are wrong ($\tfrac23$).` },
            { kind: 'calc', label: String.raw`$\tfrac13\cdot1$ and $\tfrac23\cdot0.5$`,
              from: String.raw`E=\T{a-1}{\tfrac13\cdot 1}-\T{b-1}{\tfrac23\cdot 0.5}`,
              to: String.raw`E=\T{a-1}{0.33}-\T{b-1}{0.33}`,
              why: String.raw`$\tfrac23\cdot0.5=\tfrac13$, so both pieces are the same size.` },
            { kind: 'result', label: String.raw`$0.33-0.33=0$`, to: String.raw`E=0`,
              why: String.raw`Guessing here neither gains nor loses on average: it breaks even.` },
          ] },
        { type: 'callout', kind: 'exam', title: 'Rule of thumb', html: String.raw`<p>Leave it blank if you truly have no idea. Guess once you can rule out at least one option, unless the penalty is −1 (then only with two ruled out, and even that only breaks even). For fill-in blanks there is no option list, so leave it blank unless you are fairly sure of the term.</p>` },
        { type: 'callout', kind: 'exam', title: 'Using the formula sheet well', html: String.raw`<ul>
<li>Before the exam, go through the formula sheet (lesson 3 of this module) and say for each line when it applies and what each symbol is. Your real sheet will look different but contain the same physics.</li>
<li>In a calculation, write the formula in symbols, rearrange in symbols, then insert numbers with units. Partial credit usually follows the written steps.</li>
<li>Convert prefixes first: k $=10^3$, m $=10^{-3}$, µ $=10^{-6}$, n $=10^{-9}$.</li>
<li>Finish with a check: power in = power out for ideal converters; $V_o < V_s$ for buck, $V_o > V_s$ for boost; $0\le D\le1$.</li>
</ul>` },
        { type: 'quiz', question: 'The penalty is −0.33 and you can rule out one of four options. What is the expected gain of guessing among the three left?',
          choices: ['−0.13', '0.00', '+0.11', '+0.33'], answer: 2,
          explain: String.raw`$\tfrac13\cdot1-\tfrac23\cdot0.33=0.33-0.22=+0.11$. Guessing pays a little.` },
        { type: 'quiz', question: 'The penalty is −1 and you have no idea (all four options left). What should you do?',
          choices: ['Guess: the expected gain is +0.06', 'Leave it blank: the expected gain of guessing is −0.50', 'Guess: it breaks even', 'It makes no difference'], answer: 1,
          explain: String.raw`$\tfrac14\cdot1-\tfrac34\cdot1=-0.50$. Blank scores 0, which is better.` },
      ],
    },

    // ------------------------------------------------------------------ how to read
    {
      id: 'reading',
      title: 'How to read the math',
      blocks: [
        { type: 'text', html: String.raw`<p>Every derivation is a list of small steps. Each step changes <em>one</em> thing. Three aids tell you what changed: a chip naming the kind of move, colours that follow each term from line to line, and a short "why" under each step.</p><h3>1. The chip says what kind of move it is</h3>` },
        { type: 'table',
          head: ['Chip', 'What it means'],
          rows: [
            ['Start', 'An equation we take from a law or a picture. Nothing is changed yet.'],
            ['Substitute', 'Swap a symbol for something it equals. Like replacing a word with its definition.'],
            ['Both sides', 'Do the same operation to the left and right side (add, subtract, multiply, divide). The equation stays true.'],
            ['Expand / Factor', 'Multiply out a bracket, or pull a common piece back into a bracket. Same value, different shape.'],
            ['Cancel', String.raw`Remove things that add up to zero ($+x-x$) or divide to one ($\frac{x}{x}$).`],
            ['Calculus', 'Take a derivative (slope) or an integral (area). The toolkit lesson explains both with drawings.'],
            ['Calc, Check, Result', 'Plain arithmetic; putting an answer back in to confirm it; the finished formula.'],
          ] },
        { type: 'text', html: String.raw`<h3>2. Colour follows a term from line to line</h3><p>If a term is coloured, look for the same colour in the next line: that is where it went or what it became. Crossed-out terms are cancelled. Arrows show terms that change place. Example:</p>` },
        { type: 'derive', title: 'Reading example: swapping out one term', colors: { vR: 1, Ri: 1 },
          steps: [
            { kind: 'start', label: 'Two known relations',
              from: String.raw`V_s=\T{vR-1}{v_R}+v_C\qquad\text{and we know}\qquad \T{vR-2}{v_R}=\T{Ri-1}{R\,i}`,
              to: String.raw`V_s=\T{vR-1}{v_R}+v_C\qquad\text{and we know}\qquad \T{vR-2}{v_R}=\T{Ri-1}{R\,i}`,
              why: 'The coloured piece is the one about to be swapped.' },
            { kind: 'sub', label: String.raw`Put $R\,i$ where $v_R$ was`,
              to: String.raw`V_s=\T{Ri-1}{R\,i}+v_C`, arrows: { 'Ri-1': String.raw`replaces v_R` },
              why: 'The coloured piece is the replacement. Everything else is copied unchanged.' },
          ] },
        { type: 'text', html: String.raw`<h3>3. Symbols and what they mean</h3>` },
        { type: 'table',
          head: ['Symbol', 'Meaning', 'Read it as'],
          rows: [
            [String.raw`$v,\ i$ (lowercase)`, String.raw`A value that changes with time, $v(t)$`, '"v at time t"'],
            [String.raw`$V,\ I$ (uppercase)`, 'A constant or average value', '"the DC value"'],
            [String.raw`$V_s,\ V_o$`, 'Source (input) voltage, output voltage', '"V source", "V out"'],
            [String.raw`$v_L,\ i_L$`, 'Voltage across / current through the inductor', 'subscript names the component'],
            [String.raw`$v_C,\ i_C$`, 'Voltage across / current through the capacitor', ''],
            [String.raw`$v_{L,on},\ v_{L,off}$`, 'Inductor voltage while the switch is on / off', ''],
            [String.raw`$D$`, 'Duty cycle, fraction of time the switch is on (0 to 1)', String.raw`$D=0.4$ means on 40 % of the time`],
            [String.raw`$T_s,\ f_s$`, String.raw`Switching period and frequency, $f_s=1/T_s$`, ''],
            [String.raw`$\tau$`, 'Time constant (tau)', '"how slow the circuit is"'],
            [String.raw`$\Delta x$`, String.raw`A change in $x$: end value minus start value`, '"delta x"'],
            [String.raw`$\dfrac{dx}{dt}$`, String.raw`Rate of change of $x$: slope of the $x$-vs-time graph`, '"dx by dt"'],
            [String.raw`$\displaystyle\int_a^b x\,dt$`, String.raw`Area under the $x$-vs-time graph from $a$ to $b$`, '"integral from a to b"'],
            [String.raw`$\approx,\ \Rightarrow$`, 'Approximately equal; "therefore / which gives"', ''],
          ] },
        { type: 'quiz', question: 'In a derivation step, a term is drawn crossed out. What happened to it?',
          choices: ['It moved to the other side', 'It was cancelled (it added to zero or divided to one)', 'It was substituted by a number', 'It is a typo'], answer: 1,
          explain: 'Crossed-out terms are cancelled. Terms that move keep their colour and get an arrow.' },
        { type: 'quiz', question: String.raw`What does a lowercase $i$ (as opposed to $I$) usually mean?`,
          choices: ['A constant (DC) current', 'A current that changes with time, $i(t)$', 'The imaginary unit', 'An input current'], answer: 1,
          explain: 'Lowercase = value that changes with time; uppercase = constant or average value.' },
      ],
    },

    // ------------------------------------------------------------------ formula sheet
    {
      id: 'sheet',
      title: 'The formula sheet',
      blocks: [
        { type: 'text', html: String.raw`<p>Summary of every formula in L1–L4. Your real exam sheet will look different, but contain the same physics. For each line, be able to say when it applies and what every symbol is.</p>` },
        { type: 'table',
          head: ['Topic', 'Formulas'],
          rows: [
            ['Current, voltage, power', String.raw`$i=\dfrac{dq}{dt}$, $v=v_1-v_2$, $P=VI$`],
            ['Ohm / resistor power', String.raw`$V=IR$, $P=I^2R=\dfrac{V^2}{R}$`],
            ['Series / parallel R', String.raw`$R_s=R_1+R_2$, $R_p=\dfrac{R_1R_2}{R_1+R_2}$`],
            ['Voltage divider', String.raw`$V_{out}=\dfrac{R_2}{R_1+R_2}V_{in}$`],
            ['Faraday + Lenz', String.raw`$e=-N\dfrac{d\Phi}{dt}$ (minus sign = Lenz: opposes the change)`],
            ['KCL / KVL', String.raw`$\sum i_k=0$ at a node, $\sum v_k=0$ around a loop`],
            ['Capacitor', String.raw`$q=Cv$, $i=C\dfrac{dv}{dt}$, $v=\dfrac1C\int i\,dt$`],
            ['Inductor', String.raw`$\varphi=Li$, $v=L\dfrac{di}{dt}$`],
            ['RC charging', String.raw`$i=\dfrac{V_s}{R}e^{-t/\tau}$, $v_C=V_s(1-e^{-t/\tau})$, $\tau=RC$`],
            ['RL charging', String.raw`$i=\dfrac{V_s}{R}(1-e^{-t/\tau})$, $v_L=V_se^{-t/\tau}$, $\tau=\dfrac LR$`],
            ['Switching', String.raw`$f_s=\dfrac1{T_s}$, $t_{on}=DT_s$, $t_{off}=(1-D)T_s$, $0\le D\le1$`],
            ['Average value', String.raw`$V_o=\dfrac1{T_s}\int_0^{T_s}v_o(t)\,dt$`],
            ['Volt-second balance', String.raw`$\int_0^{T_s}v_L\,dt=0$ in steady state`],
            ['Amp-second balance', String.raw`$\int_0^{T_s}i_C\,dt=0$ in steady state`],
            ['Buck', String.raw`$V_o=DV_s$, $I_o=I_L$`],
            ['Boost', String.raw`$V_o=\dfrac{V_s}{1-D}$, $I_o=I_L(1-D)$`],
          ] },
        { type: 'callout', kind: 'key', title: 'Numbers to memorise', html: String.raw`<p>Si knee 0.7 V, Ge knee 0.3 V; reverse leakage Si &lt; 20 µA, Ge &lt; 50 µA; typical breakdown of common diodes 20–30 V; mains 230 V 50 Hz (EU), 110–120 V 60 Hz (US); practical converter ripple 1–3 %; WBG bandgap 2–3× silicon.</p>` },
        { type: 'quiz', question: 'Volt-second balance, $\\int_0^{T_s}v_L\\,dt=0$, may be used when',
          choices: ['The converter is starting up', 'The converter is in steady state', 'The switch is always on', 'The inductor is ideal and $D=0.5$'], answer: 1,
          explain: 'The sheet states it: "in steady state". The same condition holds for amp-second balance.' },
      ],
    },

    // ------------------------------------------------------------------ toolkit M1–M5
    {
      id: 'toolkit-algebra',
      title: 'Math toolkit M1–M5: rearranging equations',
      blocks: [
        { type: 'text', html: String.raw`<p>All derivations in L1–L4 use only the moves in this toolkit. Each move is shown first with plain numbers, then with the circuit symbols the course uses. If a step in a derivation confuses you, find its chip here.</p><h3>M1. An equation is a balance</h3>` },
        { type: 'figure', caption: String.raw`The "=" sign is the pivot. Any operation done to both sides keeps it level. Doing it to only one side breaks the equation: that is the only rule.`,
          svg: String.raw`<svg viewBox="0 0 520 170" role="img" aria-label="A balance scale with 2x + 3 on the left pan and 11 on the right. Removing 3 from both pans keeps it level.">
  <path class="sch" d="M130 150 H230 M180 150 V40 M70 40 H290"/>
  <path class="sch" d="M70 40 L45 95 M70 40 L95 95 M290 40 L265 95 M290 40 L315 95"/>
  <path class="sch" d="M35 95 H105 a35 12 0 0 1 -70 0 M255 95 H325 a35 12 0 0 1 -70 0"/>
  <text class="svgtxt-i" x="44" y="88" style="font-size:15px">2x + 3</text>
  <text class="svgtxt-i" x="280" y="88" style="font-size:15px">11</text>
  <text class="svgtxt" x="20" y="130">left side</text><text class="svgtxt" x="262" y="130">right side</text>
  <text class="svgtxt-i" x="360" y="50">Take 3 off BOTH pans:</text>
  <text class="svgtxt-i" x="360" y="75">2x + 3 − 3 = 11 − 3</text>
  <text class="svgtxt-i" x="360" y="100">2x = 8</text>
  <text class="svgtxt-i" x="360" y="125">Halve BOTH pans:</text>
  <text class="svgtxt-i" x="360" y="150">x = 4</text>
</svg>` },
        { type: 'derive', title: 'M1 with numbers: − both sides, ÷ both sides, × both sides', colors: { m: 1, d: 2, f: 3 },
          steps: [
            { kind: 'both', label: String.raw`Both sides $-3$`, from: String.raw`2x+3=11`, to: String.raw`2x+3\T{m-1}{-3}=11\T{m-2}{-3}`,
              why: 'Take 3 off both pans. The same operation on both sides keeps the balance level.' },
            { kind: 'cancel', label: String.raw`$+3-3=0$`, from: String.raw`2x+\T{c-1}{3}\T{m-1}{-3}=\T{n-1}{11-3}`, to: String.raw`2x=\T{n-1}{11-3}`,
              why: String.raw`On the left, $+3$ and $-3$ add up to zero.` },
            { kind: 'calc', label: String.raw`$11-3$`, to: String.raw`2x=\T{n-1}{8}`, why: String.raw`$11-3=8$.` },
            { kind: 'both', label: String.raw`Both sides $\div 2$`, from: String.raw`\T{two-1}{2}x=8`, to: String.raw`\frac{\T{two-1}{2}x}{\T{d-1}{2}}=\frac{8}{\T{d-2}{2}}`,
              why: 'Halve both pans. Dividing both sides by the same (non-zero) number keeps them equal.' },
            { kind: 'cancel', label: String.raw`$\frac22=1$`, to: String.raw`x=\frac{8}{\T{d-2}{2}}`, why: String.raw`On the left, $2$ on top and $2$ underneath divide to $1$.` },
            { kind: 'calc', label: String.raw`$8\div2$`, from: String.raw`x=\T{q-1}{\frac{8}{2}}`, to: String.raw`x=\T{q-1}{4}`, why: String.raw`$8\div2=4$.` },
            { kind: 'both', label: String.raw`New equation $\frac{x}{5}=3$: both sides $\times 5$`, from: String.raw`\frac{x}{5}=3`, to: String.raw`\frac{x}{5}\cdot\T{f-1}{5}=3\cdot\T{f-2}{5}`,
              why: String.raw`$x$ is divided by 5. Multiplying both sides by 5 undoes that.` },
            { kind: 'cancel', label: String.raw`$\frac{5}{5}=1$`, from: String.raw`\frac{x}{\T{c-2}{5}}\cdot\T{f-1}{5}=3\cdot\T{f-2}{5}`, to: String.raw`x=3\cdot\T{f-2}{5}`,
              why: String.raw`On the left, the 5 underneath and the 5 we multiplied by divide to 1.` },
            { kind: 'result', label: String.raw`$3\cdot5$`, from: String.raw`x=\T{q-2}{3\cdot5}`, to: String.raw`x=\T{q-2}{15}`, why: String.raw`$3\cdot5=15$.` },
          ] },
        { type: 'text', html: String.raw`<p>Now the same moves with circuit symbols. Each one is followed by the same equation with numbers, so you can see the symbols are only placeholders.</p>` },
        { type: 'derive', symbolic: true, title: String.raw`M1 with symbols (RC derivation): − both sides`, colors: { Vs: 1, vC: 2, i: 3, R: 4 },
          steps: [
            { kind: 'both', label: String.raw`Both sides $-v_C$`,
              from: String.raw`\T{Vs-1}{V_s}=\T{R-1}{R}\,\T{i-1}{i}+\T{vC-1}{v_C}`,
              to: String.raw`\T{Vs-1}{V_s}\T{vC-2}{-v_C}=\T{R-1}{R}\,\T{i-1}{i}+\T{vC-1}{v_C}\T{vC-3}{-v_C}`,
              why: String.raw`Subtract $v_C$ on both pans. The equation stays true.` },
            { kind: 'cancel', label: String.raw`$+v_C-v_C=0$`, to: String.raw`\T{Vs-1}{V_s}\T{vC-2}{-v_C}=\T{R-1}{R}\,\T{i-1}{i}`,
              why: String.raw`On the right, $+v_C$ and $-v_C$ add up to zero. Net effect: $v_C$ "moved across" and its sign flipped, because we subtracted it on both sides.` },
            { kind: 'both', label: String.raw`Both sides $\div R$`, to: String.raw`\frac{\T{Vs-1}{V_s}\T{vC-2}{-v_C}}{\T{R-1}{R}}=\T{i-1}{i}`, arrows: { 'R-1': '÷ R on both sides' },
              why: String.raw`On the right, $\frac{R\,i}{R}=i$. On the left, the whole of $V_s-v_C$ is divided by $R$.` },
            { kind: 'result', label: 'Read it from right to left', to: String.raw`\T{i-1}{i}=\frac{\T{Vs-1}{V_s}-\T{vC-2}{v_C}}{\T{R-1}{R}}`, arrows: { 'i-1': 'swap sides' },
              why: String.raw`$a=b$ is the same statement as $b=a$. The current is the voltage left over for the resistor, divided by $R$.` },
          ] },
        { type: 'derive', title: 'With numbers: the balance from the picture',
          given: String.raw`\T{Vs-0}{V_s}=11\text{ V},\quad \T{vC-0}{v_C}=3\text{ V},\quad \T{R-0}{R}=2\ \Omega`, colors: { Vs: 1, vC: 2, i: 3, R: 4, n: 8 },
          steps: [
            { kind: 'sub', label: 'Put the given values into the equation',
              from: String.raw`\T{Vs-x}{V_s}=\T{R-x}{R}\,i+\T{vC-x}{v_C}\qquad V_s=\T{Vs-1}{11},\ R=\T{R-1}{2},\ v_C=\T{vC-1}{3}`,
              to: String.raw`\T{Vs-1}{11}=\T{R-1}{2}\,i+\T{vC-1}{3}`, arrows: { 'Vs-1': 'Vs = 11 V', 'R-1': 'R = 2 Ω', 'vC-1': 'vC = 3 V' },
              why: String.raw`This is exactly $2x+3=11$ from the balance, with $x$ called $i$.` },
            { kind: 'both', label: String.raw`Both sides $-3$`, to: String.raw`\T{Vs-1}{11}\T{vC-1}{-3}=\T{R-1}{2}\,i`, arrows: { 'vC-1': '−3 on both sides' },
              why: String.raw`Subtracting 3 on both sides cancels the $+3$ on the right and puts $-3$ on the left.` },
            { kind: 'calc', label: String.raw`$11-3$`, from: String.raw`\T{n-1}{11-3}=2\,i`, to: String.raw`\T{n-1}{8}=2\,i`, why: String.raw`$11-3=8$ volts left for the resistor.` },
            { kind: 'both', label: String.raw`Both sides $\div 2$`, from: String.raw`8=\T{R-1}{2}\,i`, to: String.raw`\frac{8}{\T{R-1}{2}}=i`, arrows: { 'R-1': '÷ 2 on both sides' },
              why: String.raw`$\frac{2\,i}{2}=i$.` },
            { kind: 'calc', label: String.raw`$8\div 2$`, from: String.raw`\T{n-2}{\frac{8}{2}}=i`, to: String.raw`i=\T{n-2}{4}\text{ A}`, why: String.raw`Volts divided by ohms gives amperes.` },
            { kind: 'check', label: 'Put the answer back in',
              from: String.raw`\T{R-x}{R}\,\T{i-x}{i}+\T{vC-x}{v_C}\qquad R=\T{R-1}{2},\ i=\T{i-1}{4},\ v_C=\T{vC-1}{3}`,
              to: String.raw`\T{R-1}{2}\cdot\T{i-1}{4}+\T{vC-1}{3}=11\text{ V}=V_s\ \checkmark`, arrows: { 'i-1': '' },
              why: String.raw`It gives back $V_s=11$ V, so $i=4$ A is right.` },
          ] },
        { type: 'derive', symbolic: true, title: String.raw`M1 with symbols (boost converter): ÷ both sides`, colors: { Vs: 1, Vo: 2, omd: 4 },
          steps: [
            { kind: 'both', label: String.raw`Both sides $\div(1-D)$`,
              from: String.raw`\T{Vo-1}{V_o}\,\T{omd-1}{(1-D)}=\T{Vs-1}{V_s}`,
              to: String.raw`\frac{\T{Vo-1}{V_o}\,\T{omd-1}{(1-D)}}{\T{omd-2}{(1-D)}}=\frac{\T{Vs-1}{V_s}}{\T{omd-3}{(1-D)}}`,
              why: String.raw`$V_o$ is multiplied by $(1-D)$. Dividing both sides by $(1-D)$ undoes that.` },
            { kind: 'cancel', label: String.raw`$\frac{1-D}{1-D}=1$`, to: String.raw`\T{Vo-1}{V_o}=\frac{\T{Vs-1}{V_s}}{\T{omd-3}{1-D}}`,
              why: String.raw`On the left, the same factor on top and underneath divides to 1. "Move a factor to the other side and it goes underneath" is just this.` },
          ] },
        { type: 'derive', title: 'With numbers: 12 V in, D = 0.6',
          given: String.raw`\T{Vs-0}{V_s}=12\text{ V},\quad \T{D-0}{D}=0.6`, colors: { Vs: 1, Vo: 2, D: 3, n: 8 },
          steps: [
            { kind: 'sub', label: 'Put the given values into the equation',
              from: String.raw`V_o(1-\T{D-x}{D})=\T{Vs-x}{V_s}\qquad D=\T{D-1}{0.6},\ V_s=\T{Vs-1}{12}`,
              to: String.raw`V_o(1-\T{D-1}{0.6})=\T{Vs-1}{12}`, arrows: { 'D-1': 'D = 0.6', 'Vs-1': 'Vs = 12 V' },
              why: 'Each number keeps the colour of the symbol it replaces.' },
            { kind: 'calc', label: String.raw`$1-0.6$`, from: String.raw`V_o\,\T{n-1}{(1-0.6)}=12`, to: String.raw`V_o\cdot\T{n-1}{0.4}=12`, why: String.raw`$1-0.6=0.4$.` },
            { kind: 'both', label: String.raw`Both sides $\div 0.4$`, to: String.raw`V_o=\frac{12}{\T{n-1}{0.4}}`, arrows: { 'n-1': '÷ 0.4 on both sides' },
              why: String.raw`$\frac{V_o\cdot0.4}{0.4}=V_o$.` },
            { kind: 'calc', label: String.raw`$12\div0.4$`, from: String.raw`V_o=\T{q-1}{\frac{12}{0.4}}`, to: String.raw`V_o=\T{q-1}{30}\text{ V}`, why: String.raw`$12\div0.4=30$.` },
            { kind: 'check', label: 'Put the answer back in',
              from: String.raw`V_o(1-D)\qquad V_o=\T{Vo-1}{30},\ D=\T{D-1}{0.6}`,
              to: String.raw`\T{Vo-1}{30}\cdot(1-\T{D-1}{0.6})=30\cdot0.4=12\text{ V}=V_s\ \checkmark`, arrows: { 'Vo-1': '' },
              why: 'It gives back the 12 V input, so 30 V is right.' },
          ] },
        { type: 'derive', symbolic: true, title: String.raw`M1 with symbols (buck converter): × both sides`, colors: { Vs: 1, Vo: 2, D: 3 },
          steps: [
            { kind: 'both', label: String.raw`Both sides $\times V_s$`,
              from: String.raw`\frac{\T{Vo-1}{V_o}}{\T{Vs-1}{V_s}}=\T{D-1}{D}`,
              to: String.raw`\frac{\T{Vo-1}{V_o}}{\T{Vs-1}{V_s}}\cdot\T{Vs-2}{V_s}=\T{D-1}{D}\cdot\T{Vs-3}{V_s}`,
              why: String.raw`$V_o$ is divided by $V_s$. Multiplying both sides by $V_s$ undoes that.` },
            { kind: 'cancel', label: String.raw`$\frac{V_s}{V_s}=1$`, to: String.raw`\T{Vo-1}{V_o}=\T{D-1}{D}\,\T{Vs-3}{V_s}`,
              why: String.raw`On the left, $V_s$ underneath and the $V_s$ we multiplied by divide to 1.` },
          ] },
        { type: 'derive', title: 'With numbers: 24 V in, D = 0.5',
          given: String.raw`\T{Vs-0}{V_s}=24\text{ V},\quad \T{D-0}{D}=0.5`, colors: { Vs: 1, Vo: 2, D: 3, n: 8 },
          steps: [
            { kind: 'sub', label: 'Put the given values into the formula',
              from: String.raw`V_o=\T{D-x}{D}\,\T{Vs-x}{V_s}\qquad D=\T{D-1}{0.5},\ V_s=\T{Vs-1}{24}`,
              to: String.raw`V_o=\T{D-1}{0.5}\cdot\T{Vs-1}{24}`, arrows: { 'D-1': 'D = 0.5', 'Vs-1': 'Vs = 24 V' },
              why: 'Each number keeps the colour of the symbol it replaces.' },
            { kind: 'calc', label: String.raw`$0.5\cdot24$`, from: String.raw`V_o=\T{n-1}{0.5\cdot24}`, to: String.raw`V_o=\T{n-1}{12}\text{ V}`, why: 'Half the input voltage.' },
            { kind: 'check', label: 'Put the answer back in',
              from: String.raw`\frac{V_o}{V_s}\qquad V_o=\T{Vo-1}{12},\ V_s=\T{Vs-1}{24}`,
              to: String.raw`\frac{\T{Vo-1}{12}}{\T{Vs-1}{24}}=0.5=D\ \checkmark`, arrows: { 'Vo-1': '', 'Vs-1': '' },
              why: 'The ratio equals the duty cycle, as the starting equation says.' },
          ] },
        { type: 'callout', kind: 'key', title: 'The shortcut, explained', html: String.raw`<p>"Move a term to the other side and flip its sign" is just subtracting (or adding) it on both sides. "Move a factor to the other side and it goes underneath" is just dividing both sides by it.</p>` },

        // M2
        { type: 'text', html: String.raw`<h3>M2. Substitution: swap a symbol for something equal to it</h3><p>If two things are equal, one can stand in for the other anywhere. You take a <em>known relation</em> from somewhere (a component law, an earlier step) and plug its right-hand side into the hole left by its left-hand side.</p>` },
        { type: 'derive', title: String.raw`M2 with numbers: known $a=3$`, colors: { a: 1, t: 1 },
          steps: [
            { kind: 'sub', label: String.raw`Put $3$ where $a$ was`, from: String.raw`y=2\T{a-1}{a}+1\qquad\text{known: }\T{a-2}{a}=\T{t-1}{3}`, to: String.raw`y=2\cdot\T{t-1}{3}+1`, arrows: { 't-1': 'a = 3' },
              why: String.raw`$a$ and $3$ are equal, so $3$ can stand where $a$ stood.` },
            { kind: 'calc', label: String.raw`$2\cdot3+1$`, from: String.raw`y=\T{n-1}{2\cdot3+1}`, to: String.raw`y=\T{n-1}{7}`, why: String.raw`$6+1=7$.` },
          ] },
        { type: 'derive', title: 'M2 with symbols: the capacitor law into the RC loop', colors: { i: 1, Cd: 1 },
          steps: [
            { kind: 'sub', label: String.raw`Put $C\frac{dv_C}{dt}$ where $i$ was`,
              from: String.raw`V_s=R\,\T{i-1}{i}+v_C\qquad\text{known (capacitor law): }\T{i-2}{i}=\T{Cd-1}{C\dfrac{dv_C}{dt}}`,
              to: String.raw`V_s=R\,\T{Cd-1}{C\dfrac{dv_C}{dt}}+v_C`, arrows: { 'Cd-1': 'capacitor law' },
              why: String.raw`Before, there were two unknowns ($i$ and $v_C$). After the swap only $v_C$ is left, so the equation can be solved (lesson on RC charging).` },
          ] },
        { type: 'callout', kind: 'key', title: 'Why we do it', html: String.raw`<p>Each substitution removes one unknown. The goal is always an equation with only one unknown left, which can then be solved.</p>` },

        // M3
        { type: 'text', html: String.raw`<h3>M3. Expanding brackets, and the minus sign</h3>` },
        { type: 'figure', caption: String.raw`Expanding a bracket: the factor outside multiplies <em>every</em> term inside. The big rectangle's area equals the two pieces added.`,
          svg: String.raw`<svg viewBox="0 0 520 150" role="img" aria-label="Area model: a rectangle of height a and width b plus c splits into two rectangles of area a times b and a times c.">
  <rect x="40" y="30" width="180" height="80" class="fa" fill-opacity="0.15" stroke="none"/>
  <rect x="220" y="30" width="110" height="80" class="fg" fill-opacity="0.15" stroke="none"/>
  <path class="sch" d="M40 30 H330 V110 H40 Z M220 30 V110"/>
  <text class="svgtxt-i" x="20" y="75">a</text>
  <text class="svgtxt-i" x="125" y="130">b</text><text class="svgtxt-i" x="270" y="130">c</text>
  <text class="ca" x="110" y="75" style="font-family:var(--f-mono);font-size:15px">a·b</text>
  <text class="cg" x="255" y="75" style="font-family:var(--f-mono);font-size:15px">a·c</text>
  <text class="svgtxt-i" x="350" y="60">a·(b + c)</text>
  <text class="svgtxt-i" x="350" y="85">= a·b + a·c</text>
</svg>` },
        { type: 'derive', title: 'M3 with numbers', colors: { th: 1, mt: 2 },
          steps: [
            { kind: 'expand', label: String.raw`Multiply $3$ into the bracket`, from: String.raw`\T{th-1}{3}(10-2)`, to: String.raw`\T{th-1}{3}\cdot10-\T{th-2}{3}\cdot2`,
              map: { 'th-1': ['th-1', 'th-2'] }, arrows: { 'th-1': '× each term' },
              why: 'The 3 multiplies every term inside the bracket, keeping each sign.' },
            { kind: 'calc', label: String.raw`$3\cdot10$ and $3\cdot2$`, from: String.raw`\T{a-1}{3\cdot10}-\T{b-1}{3\cdot2}`, to: String.raw`\T{a-1}{30}-\T{b-1}{6}=24`, why: String.raw`$30-6=24$.` },
            { kind: 'check', label: 'Do the bracket first instead', from: String.raw`3(10-2)`, to: String.raw`3\cdot8=24\ \checkmark`, why: 'Same answer, so the expansion was right.' },
            { kind: 'expand', label: String.raw`Minus in front: multiply $(-2)$ into the bracket`, from: String.raw`\T{mt-1}{(-2)}(5-1)`, to: String.raw`\T{mt-1}{(-2)}\cdot5+\T{mt-2}{(-2)}\cdot(-1)`,
              map: { 'mt-1': ['mt-1', 'mt-2'] }, arrows: { 'mt-1': '× each term, sign included' },
              why: String.raw`The factor outside is $-2$, sign included. It multiplies both $5$ and $-1$.` },
            { kind: 'calc', label: 'Minus times minus is plus', from: String.raw`\T{a-2}{(-2)\cdot5}+\T{b-2}{(-2)\cdot(-1)}`, to: String.raw`\T{a-2}{-10}+\T{b-2}{2}=-8`,
              why: String.raw`$(-2)\cdot5=-10$ and $(-2)\cdot(-1)=+2$.` },
            { kind: 'check', label: 'Do the bracket first instead', from: String.raw`-2(5-1)`, to: String.raw`-2\cdot4=-8\ \checkmark`, why: 'Same answer.' },
          ] },
        { type: 'derive', title: 'M3 with symbols (buck)', colors: { D: 3, mV: 2 },
          steps: [
            { kind: 'expand', label: String.raw`Multiply $D$ into the bracket`, from: String.raw`\T{D-1}{D}(V_s-V_o)`, to: String.raw`\T{D-1}{D}V_s-\T{D-2}{D}V_o`,
              map: { 'D-1': ['D-1', 'D-2'] }, arrows: { 'D-1': '× each term' },
              why: String.raw`Same move as $3(10-2)$: $D$ multiplies both terms, and the minus stays with $V_o$.` },
            { kind: 'expand', label: String.raw`Minus in front: multiply $(-V_o)$ into the bracket`, from: String.raw`\T{mV-1}{(-V_o)}(1-D)`, to: String.raw`\T{mV-1}{(-V_o)}\cdot1+\T{mV-2}{(-V_o)}\cdot(-D)`,
              map: { 'mV-1': ['mV-1', 'mV-2'] }, arrows: { 'mV-1': '× each term, sign included' },
              why: String.raw`Same move as $-2(5-1)$: the factor outside is $-V_o$, sign included.` },
            { kind: 'calc', label: 'Minus times minus is plus', from: String.raw`\T{a-1}{(-V_o)\cdot1}+\T{b-1}{(-V_o)\cdot(-D)}`, to: String.raw`\T{a-1}{-V_o}+\T{b-1}{DV_o}`,
              why: String.raw`$(-V_o)\cdot1=-V_o$ and $(-V_o)\cdot(-D)=+DV_o$.` },
          ] },
        { type: 'callout', kind: 'warn', title: 'Sign rule', html: String.raw`<p>A minus sign in front of a bracket flips the sign of every term inside: $-(x-y)=-x+y$. Minus times minus is plus. Most mistakes in converter derivations happen exactly here.</p>` },

        // M4
        { type: 'text', html: String.raw`<h3>M4. Factoring: expanding in reverse</h3><p>When the same piece appears in every term, pull it out in front of a bracket. Often what is left inside the bracket simplifies to something trivial like 1.</p>` },
        { type: 'derive', title: 'M4 with numbers', colors: { f: 1 },
          steps: [
            { kind: 'factor', label: String.raw`Pull out the common $4$`, from: String.raw`\T{f-1}{4}\cdot7+\T{f-2}{4}\cdot3`, to: String.raw`\T{f-1}{4}(7+3)`,
              map: { 'f-2': ['f-1'] }, arrows: { 'f-2': 'pull out' },
              why: String.raw`Both terms contain the factor 4. Expanding $4(7+3)$ gives back $4\cdot7+4\cdot3$, so the value is unchanged.` },
            { kind: 'calc', label: String.raw`$7+3$`, from: String.raw`4\,\T{n-1}{(7+3)}`, to: String.raw`4\cdot\T{n-1}{10}=40`, why: String.raw`$4\cdot10=40$.` },
          ] },
        { type: 'derive', title: 'M4 with symbols (buck current)', colors: { k: 1 },
          steps: [
            { kind: 'factor', label: String.raw`Pull out the common $(I_L-I_o)$`, from: String.raw`\T{k-1}{(I_L-I_o)}D+\T{k-2}{(I_L-I_o)}(1-D)`, to: String.raw`\T{k-1}{(I_L-I_o)}\,[D+1-D]`,
              map: { 'k-2': ['k-1'] }, arrows: { 'k-2': 'pull out' },
              why: String.raw`Both terms contain $(I_L-I_o)$. What is left of each term goes inside the new bracket.` },
            { kind: 'cancel', label: String.raw`$+D-D=0$`, from: String.raw`\T{k-1}{(I_L-I_o)}\,[\T{c-1}{D}+1\T{c-2}{-D}]`, to: String.raw`\T{k-1}{(I_L-I_o)}\cdot1`,
              why: String.raw`Inside the bracket $+D$ and $-D$ add to zero, leaving 1.` },
          ] },

        // M5
        { type: 'text', html: String.raw`<h3>M5. Cancelling</h3>` },
        { type: 'derive', title: 'M5 with numbers: opposites, top and bottom, ÷ every term', colors: { c: 1, d: 2 },
          steps: [
            { kind: 'cancel', label: 'Opposites', from: String.raw`5\T{c-1}{+2}\T{c-2}{-2}`, to: String.raw`5`, why: String.raw`$+2-2=0$.` },
            { kind: 'cancel', label: 'Top and bottom', from: String.raw`\frac{3\cdot\T{c-3}{7}}{\T{c-4}{7}\cdot2}`, to: String.raw`\frac32`, why: String.raw`7 is a factor on top and underneath: $\frac77=1$.` },
            { kind: 'expand', label: String.raw`$\div$ every term`, from: String.raw`\frac{6+9}{\T{d-1}{3}}`, to: String.raw`\frac{6}{\T{d-1}{3}}+\frac{9}{\T{d-2}{3}}=2+3`,
              map: { 'd-1': ['d-1', 'd-2'] }, arrows: { 'd-1': '÷ each term' },
              why: String.raw`Dividing a sum divides every term of it. Check: $\frac{15}{3}=5=2+3$.` },
          ] },
        { type: 'derive', title: 'M5 with symbols', colors: { c: 1 },
          steps: [
            { kind: 'cancel', label: 'Opposites (buck)', from: String.raw`DV_s\T{c-1}{-DV_o}-V_o\T{c-2}{+DV_o}`, to: String.raw`DV_s-V_o`, why: String.raw`$-DV_o+DV_o=0$, same as $+2-2$.` },
            { kind: 'cancel', label: 'Top and bottom (RC current)', from: String.raw`\frac{\T{c-3}{C}\,V_s}{R\,\T{c-4}{C}}`, to: String.raw`\frac{V_s}{R}`, why: String.raw`$C$ is a factor on top and underneath: $\frac CC=1$.` },
            { kind: 'cancel', label: String.raw`$\div$ every term (all converters)`, from: String.raw`\frac{a\,\T{c-5}{T_s}+b\,\T{c-6}{T_s}}{\T{c-7}{T_s}}`, to: String.raw`a+b`,
              why: String.raw`Divide each term by $T_s$; in each one $\frac{T_s}{T_s}=1$.` },
          ] },
        { type: 'callout', kind: 'warn', title: 'Only cancel factors', html: String.raw`<p>You may only cancel a <em>factor</em> (something multiplied) from top and bottom, never a term that is added: $\frac{3+7}{7}\neq3$.</p>` },
        { type: 'quiz', question: 'Which cancellation is allowed?',
          choices: [String.raw`$\dfrac{3+7}{7}=3$`, String.raw`$\dfrac{3\cdot7}{7\cdot2}=\dfrac32$`, String.raw`$\dfrac{V_s+R}{R}=V_s$`, String.raw`$\dfrac{a+T_s}{T_s}=a$`], answer: 1,
          explain: String.raw`Only factors cancel. $\frac{3+7}{7}=\frac{10}{7}$, not 3.` },
        { type: 'quiz', question: String.raw`Expand $-V_o(1-D)$.`,
          choices: [String.raw`$-V_o-DV_o$`, String.raw`$-V_o+DV_o$`, String.raw`$V_o-DV_o$`, String.raw`$-V_o+D$`], answer: 1,
          explain: String.raw`$(-V_o)\cdot1=-V_o$ and $(-V_o)\cdot(-D)=+DV_o$: minus times minus is plus.` },
      ],
    },

    // ------------------------------------------------------------------ toolkit M6–M9
    {
      id: 'toolkit-calculus',
      title: 'Math toolkit M6–M9: slopes, areas, averages, exponentials',
      blocks: [
        { type: 'text', html: String.raw`<h3>M6. Derivative = slope = rate of change</h3>` },
        { type: 'figure', caption: String.raw`For a straight line the derivative is exactly rise ÷ run. Example: current rises 2 A in 20 µs, so $\frac{di}{dt}=\frac{2}{20\cdot10^{-6}}=10^5$ A/s.`,
          svg: String.raw`<svg viewBox="0 0 320 190" role="img" aria-label="A straight rising line of current versus time with a right triangle under it: horizontal side delta t, vertical side delta i.">
  <path class="ax" d="M40 165 H300 M40 165 V15"/>
  <text class="svgtxt" x="296" y="182">t</text><text class="svgtxt" x="24" y="22">i</text>
  <path class="sch" d="M50 140 L290 40"/>
  <path class="sa" style="stroke-width:2;fill:none" d="M110 115 H230"/>
  <path class="sb" style="stroke-width:2;fill:none" d="M230 115 V65"/>
  <text class="ca" x="150" y="133" style="font-family:var(--f-mono);font-size:13px">Δt (run)</text>
  <text class="cb" x="238" y="95" style="font-family:var(--f-mono);font-size:13px">Δi (rise)</text>
  <text class="svgtxt-i" x="60" y="40">slope = Δi / Δt</text>
</svg>` },
        { type: 'figure', caption: 'For a curve, the derivative at each instant is the slope of the line touching it there. A flat graph (constant value) has derivative 0.',
          svg: String.raw`<svg viewBox="0 0 320 190" role="img" aria-label="A curve flattening out; steep tangent at the start, flat tangent later.">
  <path class="ax" d="M40 165 H300 M40 165 V15"/>
  <text class="svgtxt" x="296" y="182">t</text><text class="svgtxt" x="24" y="22">v</text>
  <path class="sch" d="M40 165 C 90 60, 150 45, 300 40"/>
  <path class="sa" style="stroke-width:2;fill:none" d="M40 165 L95 60"/>
  <path class="sb" style="stroke-width:2;fill:none" d="M200 42 L300 38"/>
  <text class="ca" x="60" y="120" style="font-family:var(--f-mono);font-size:12px">steep: big dv/dt</text>
  <text class="cb" x="180" y="66" style="font-family:var(--f-mono);font-size:12px">flat: dv/dt ≈ 0</text>
</svg>` },
        { type: 'table',
          head: ['Rule', 'Formula', 'In words'],
          rows: [
            ['Constant', String.raw`$\dfrac{d}{dt}(12)=0$`, 'Something that never changes has zero rate of change.'],
            ['Constant factor', String.raw`$\dfrac{d}{dt}(C\,v)=C\dfrac{dv}{dt}$`, 'A fixed multiplier just comes along for the ride.'],
            ['Sum', String.raw`$\dfrac{d}{dt}(f+g)=\dfrac{df}{dt}+\dfrac{dg}{dt}$`, 'Differentiate each term separately.'],
            ['Exponential', String.raw`$\dfrac{d}{dt}e^{at}=a\,e^{at}$`, String.raw`Bring the number in front of $t$ down as a multiplier. With $a=-\frac1\tau$: $\dfrac{d}{dt}e^{-t/\tau}=-\dfrac1\tau e^{-t/\tau}$.`],
          ] },
        { type: 'text', html: String.raw`<p>Where it appears: $i=C\frac{dv}{dt}$ says "capacitor current is proportional to how fast its voltage changes". $v=L\frac{di}{dt}$ says "inductor voltage is proportional to how fast its current changes". Constant voltage on a capacitor → no current. Constant current in an inductor → no voltage.</p>` },
        { type: 'answer', part: { label: 'Self-check', kind: 'numeric', answer: '2e5', tol: 0.01,
          prompt: String.raw`A current rises at a steady rate by 3 A in 15 µs. What is $\frac{di}{dt}$ in A/s?`,
          hints: [String.raw`The current rises along a straight line, so the derivative is the slope: rise ÷ run.`,
            String.raw`Rise $\Delta i=3$ A, run $\Delta t=15\ \mu\text{s}=15\cdot10^{-6}$ s.`,
            String.raw`$\frac{di}{dt}=\frac{3}{15\cdot10^{-6}}$; first do $3\div15=0.2$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>We divide the rise by the run, with the time converted to seconds, exactly as in the figure above.</p>` },
            { type: 'derive', given: String.raw`\T{di-0}{\Delta i}=3\text{ A},\quad \T{dt-0}{\Delta t}=15\ \mu\text{s}`, colors: { di: 6, dt: 1, n: 8 }, steps: [
              { kind: 'sub', label: 'Put the values into rise ÷ run',
                from: String.raw`\frac{di}{dt}=\frac{\T{di-x}{\Delta i}}{\T{dt-x}{\Delta t}}\qquad \Delta i=\T{di-1}{3},\quad \Delta t=\T{dt-1}{15\cdot10^{-6}}`,
                to: String.raw`\frac{di}{dt}=\frac{\T{di-1}{3}}{\T{dt-1}{15\cdot10^{-6}}}`, arrows: { 'di-1': 'Δi = 3 A', 'dt-1': '15 µs = 15·10⁻⁶ s' },
                why: String.raw`For a straight line the derivative is exactly rise ÷ run. µ means $10^{-6}$, so 15 µs is $15\cdot10^{-6}$ s.` },
              { kind: 'calc', label: String.raw`$3\div15=0.2$`, to: String.raw`\frac{di}{dt}=\T{n-1}{0.2}\cdot10^{6}`,
                why: String.raw`Dividing by $10^{-6}$ is multiplying by $10^{6}$.` },
              { kind: 'calc', label: String.raw`$0.2\cdot10^6$`, to: String.raw`\frac{di}{dt}=2\cdot10^{5}\text{ A/s}`,
                why: String.raw`$0.2=2\cdot10^{-1}$, and $10^{-1}\cdot10^{6}=10^{5}$.` },
              { kind: 'check', label: 'Put the answer back in', from: String.raw`\Delta i=\frac{di}{dt}\,\Delta t`, to: String.raw`2\cdot10^5\cdot15\cdot10^{-6}=30\cdot10^{-1}=3\text{ A}\ \checkmark`,
                why: 'Slope times run gives back the rise.' },
            ] },
          ],
          solution: String.raw`$\frac{di}{dt}=\frac{3}{15\cdot10^{-6}}=2\cdot10^5$ A/s.` } },

        { type: 'text', html: String.raw`<h3>M7. Integral = area under the graph</h3>` },
        { type: 'figure', caption: String.raw`$\displaystyle\int_a^b K\,dt=K\,(b-a)$: a constant over an interval is a rectangle, height × width. This one rule does all the integrals in L4.`,
          svg: String.raw`<svg viewBox="0 0 320 170" role="img" aria-label="A constant value K from time a to time b forms a rectangle; its area is K times b minus a.">
  <path class="ax" d="M40 140 H300 M40 140 V15"/>
  <rect x="90" y="60" width="160" height="80" class="fa" fill-opacity="0.18"/>
  <path class="sch" d="M90 60 H250"/>
  <path class="grid" d="M90 60 V140 M250 60 V140"/>
  <text class="svgtxt" x="86" y="156">a</text><text class="svgtxt" x="246" y="156">b</text><text class="svgtxt" x="296" y="156">t</text>
  <text class="svgtxt-i" x="256" y="64">K</text>
  <text class="ca" x="112" y="104" style="font-family:var(--f-mono);font-size:13px">area = K·(b−a)</text>
</svg>` },
        { type: 'figure', caption: String.raw`Area above the axis counts plus, below counts minus. We can cut the interval where the shape changes and add the pieces: $\int_0^{T_s}=\int_0^{DT_s}+\int_{DT_s}^{T_s}$.`,
          svg: String.raw`<svg viewBox="0 0 320 170" role="img" aria-label="A waveform positive for the first part of the period and negative for the rest: area above the axis counts positive, below counts negative.">
  <path class="ax" d="M30 85 H305 M30 160 V12"/>
  <rect x="40" y="45" width="100" height="40" class="fa" fill-opacity="0.2"/>
  <rect x="140" y="85" width="150" height="27" class="fb" fill-opacity="0.2"/>
  <path class="sch" d="M40 45 H140 V112 H290"/>
  <text class="ca" x="62" y="70" style="font-family:var(--f-mono);font-size:13px">+ area</text>
  <text class="cb" x="190" y="104" style="font-family:var(--f-mono);font-size:13px">− area</text>
  <text class="svgtxt" x="36" y="135">0</text><text class="svgtxt" x="126" y="135">DTs</text><text class="svgtxt" x="280" y="135">Ts</text>
</svg>` },
        { type: 'text', html: '<p>Widths of the two pieces (you need these in every converter derivation):</p>' },
        { type: 'derive', symbolic: true, title: 'Widths of the on- and off-intervals', colors: { Ts: 5, w: 1 },
          steps: [
            { kind: 'calc', label: 'Width 1 (on-time)', from: String.raw`\T{w-1}{DT_s-0}`, to: String.raw`\T{w-1}{DT_s}`,
              why: 'On-time: from 0 to the moment the switch opens. Width = end minus start.' },
            { kind: 'calc', label: String.raw`Width 2 (off-time): write $T_s$ as $T_s\cdot1$`, from: String.raw`T_s-DT_s`, to: String.raw`\T{Ts-1}{T_s}\cdot1-\T{Ts-2}{T_s}\cdot D`,
              why: String.raw`Off-time: the rest of the period, end $T_s$ minus start $DT_s$. Multiplying by 1 changes nothing, but now both terms visibly contain $T_s$.` },
            { kind: 'factor', label: String.raw`Factor out $T_s$`, to: String.raw`\T{Ts-1}{T_s}(1-D)`, map: { 'Ts-2': ['Ts-1'] }, arrows: { 'Ts-2': 'pull out' },
              why: String.raw`Both terms contain $T_s$ (M4). What is left goes inside the bracket.` },
            { kind: 'check', label: 'The two widths add to the period', from: String.raw`DT_s+(1-D)T_s`, to: String.raw`DT_s+T_s-DT_s=T_s\ \checkmark`,
              why: String.raw`Expanding $(1-D)T_s$ and cancelling $+DT_s-DT_s$ leaves the whole period.` },
          ] },
        { type: 'derive', title: String.raw`With numbers: $T_s=10\ \mu$s, $D=0.4$`,
          given: String.raw`\T{Ts-0}{T_s}=10\ \mu\text{s},\quad \T{D-0}{D}=0.4`, colors: { Ts: 5, D: 3, n: 8 },
          steps: [
            { kind: 'sub', label: 'On-time: put in the values',
              from: String.raw`t_{on}=\T{D-x}{D}\,\T{Ts-x}{T_s}\qquad D=\T{D-1}{0.4},\ T_s=\T{Ts-1}{10\ \mu\text{s}}`,
              to: String.raw`t_{on}=\T{D-1}{0.4}\cdot\T{Ts-1}{10\ \mu\text{s}}`, arrows: { 'D-1': 'D = 0.4', 'Ts-1': 'Ts = 10 µs' },
              why: 'Each number keeps the colour of the symbol it replaces.' },
            { kind: 'calc', label: String.raw`$0.4\cdot10$`, from: String.raw`t_{on}=\T{n-1}{0.4\cdot10}\ \mu\text{s}`, to: String.raw`t_{on}=\T{n-1}{4}\ \mu\text{s}`, why: 'The switch is on for 4 µs of each period.' },
            { kind: 'sub', label: 'Off-time: put in the values',
              from: String.raw`t_{off}=\T{Ts-x}{T_s}(1-\T{D-x}{D})\qquad D=\T{D-1}{0.4},\ T_s=\T{Ts-1}{10\ \mu\text{s}}`,
              to: String.raw`t_{off}=\T{Ts-1}{10\ \mu\text{s}}\cdot(1-\T{D-1}{0.4})`, arrows: { 'D-1': '', 'Ts-1': '' },
              why: 'Same values, second formula.' },
            { kind: 'calc', label: String.raw`$10\cdot(1-0.4)$`, from: String.raw`t_{off}=10\cdot\T{n-2}{(1-0.4)}\ \mu\text{s}`, to: String.raw`t_{off}=10\cdot\T{n-2}{0.6}\ \mu\text{s}=6\ \mu\text{s}`, why: String.raw`$1-0.4=0.6$, and $10\cdot0.6=6$.` },
            { kind: 'check', label: 'The widths add to the period', from: String.raw`t_{on}+t_{off}`, to: String.raw`4+6=10\ \mu\text{s}=T_s\ \checkmark`, why: 'On-time plus off-time is the whole period.' },
          ] },
        { type: 'text', html: String.raw`<p>One more fact, used to prove volt-second balance: adding up all the small changes of a quantity gives its total change,</p><p>$$\int_0^{T}\frac{dx}{dt}\,dt=x(T)-x(0)\qquad\text{(end value minus start value)}$$</p>` },

        { type: 'text', html: String.raw`<h3>M8. Average value</h3>` },
        { type: 'figure', caption: String.raw`Average = total area ÷ width. Imagine pouring the shaded blocks out flat across the whole period: they fill up to the dashed line. Here $D=1/3$, so the average is one third of $V_s$.`,
          svg: String.raw`<svg viewBox="0 0 440 160" role="img" aria-label="A pulse train switching between Vs and 0, with a dashed horizontal line at the average D times Vs.">
  <path class="ax" d="M30 130 H420 M30 130 V15"/>
  <g class="fa" fill-opacity="0.18"><rect x="40" y="40" width="40" height="90"/><rect x="160" y="40" width="40" height="90"/><rect x="280" y="40" width="40" height="90"/></g>
  <path class="sch" d="M40 130 V40 H80 V130 H160 V40 H200 V130 H280 V40 H320 V130 H400"/>
  <path class="sa" style="stroke-width:2;stroke-dasharray:6 4;fill:none" d="M40 103 H400"/>
  <text class="svgtxt-i" x="6" y="44">Vs</text><text class="svgtxt" x="16" y="134">0</text>
  <text class="ca" x="325" y="98" style="font-family:var(--f-mono);font-size:13px">average = D·Vs</text>
  <text class="svgtxt" x="45" y="150">DTs</text><text class="svgtxt" x="140" y="150">Ts</text>
</svg>` },
        { type: 'text', html: String.raw`<p>$$\langle f\rangle=\frac{1}{T}\int_0^{T}f(t)\,dt=\frac{\text{area in one period}}{\text{period}}$$</p>` },
        { type: 'answer', part: { label: 'Self-check', kind: 'numeric', answer: '4', tol: 0.01,
          prompt: String.raw`A pulse train switches between $V_s=12$ V and 0 with $D=1/3$, as in the picture. What is its average value in volts?`,
          hints: [String.raw`Average = area in one period ÷ period.`,
            String.raw`The area is one rectangle: height $V_s$, width $DT_s$. So $\langle v\rangle=\frac{V_s\,DT_s}{T_s}$.`,
            String.raw`$T_s$ cancels: $\langle v\rangle=DV_s=\frac13\cdot12$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>We write the area of the one pulse in a period, divide by the period, cancel $T_s$ and put the numbers in.</p>` },
            { type: 'derive', colors: { Vs: 1, D: 3, Ts: 5 }, steps: [
              { kind: 'start', label: 'Average = area ÷ period',
                from: String.raw`\langle v\rangle=\frac{\text{area in one period}}{T_s}`,
                to: String.raw`\langle v\rangle=\frac{\T{Vs-1}{V_s}\cdot\T{D-1}{D}\,\T{Ts-1}{T_s}}{\T{Ts-2}{T_s}}`,
                why: String.raw`In one period there is one rectangle of height $V_s$ and width $DT_s$; the rest of the period is at 0 and adds no area.` },
              { kind: 'cancel', label: String.raw`$T_s\div T_s=1$`, to: String.raw`\langle v\rangle=\T{D-1}{D}\,\T{Vs-1}{V_s}`,
                why: String.raw`The same factor $T_s$ is on top and bottom, so it cancels. The average does not depend on the period.` },
              { kind: 'sub', label: String.raw`$D=\frac13$, $V_s=12$ V`, to: String.raw`\langle v\rangle=\T{D-1}{\tfrac13}\cdot\T{Vs-1}{12}=4\text{ V}`,
                why: String.raw`A third of 12 is 4.` },
              { kind: 'check', label: 'Pour the area out flat', from: String.raw`\langle v\rangle\cdot T_s=V_s\,DT_s`, to: String.raw`4\cdot T_s=12\cdot\tfrac13T_s=4\,T_s\ \checkmark`,
                why: 'The flat rectangle at the average has the same area as the pulse.' },
            ] },
          ],
          solution: String.raw`$\frac{V_s\,DT_s}{T_s}=DV_s=\frac13\cdot12=4$ V.` } },

        { type: 'text', html: String.raw`<h3>M9. Exponentials and logarithms</h3>` },
        { type: 'widget', name: 'pefig', config: { fig: 'expToolkit', caption: String.raw`$e^{-x}$ starts at 1 and falls toward 0; $1-e^{-x}$ is its mirror, rising from 0 toward 1. At $x=1$ they are at 0.368 and 0.632; by $x=5$ the change is 99.3 % complete.` } },
        { type: 'table',
          head: ['Fact', 'Used for'],
          rows: [
            [String.raw`$e^0=1$`, String.raw`Value at $t=0$`],
            [String.raw`$e^{-x}\to0$ as $x$ grows`, String.raw`Final value as $t\to\infty$`],
            [String.raw`$e^{-1}=0.368,\ e^{-2}=0.135,\ e^{-3}=0.050,\ e^{-5}=0.007$`, String.raw`Values at $t=\tau,2\tau,3\tau,5\tau$`],
            [String.raw`$\ln$ undoes $e$: $\ln(e^{x})=x$, and $e^{\ln y}=y$`, String.raw`Getting $t$ out of the exponent, or getting rid of a $\ln$`],
            [String.raw`$\ln a-\ln b=\ln\dfrac ab$, $\ \ln\dfrac1a=-\ln a$`, 'Tidying logarithms'],
            [String.raw`$\displaystyle\int\frac{1}{u}\,du=\ln u$`, 'The integral that creates a logarithm in RC/RL derivations'],
          ] },
        { type: 'derive', title: String.raw`Numbers first: $e^x=5$`, colors: { x: 1, n: 8 },
          steps: [
            { kind: 'both', label: String.raw`Apply $\ln$ to both sides`, from: String.raw`e^{\T{x-1}{x}}=5`, to: String.raw`\ln\left(e^{\T{x-1}{x}}\right)=\ln 5`,
              why: String.raw`Same operation on both sides (M1), so the equation stays true.` },
            { kind: 'cancel', label: String.raw`$\ln(e^x)=x$`, to: String.raw`\T{x-1}{x}=\ln 5`, why: String.raw`$\ln$ undoes $e$, so the $e$ disappears and $x$ comes out of the exponent.` },
            { kind: 'calc', label: String.raw`$\ln 5$`, from: String.raw`x=\T{n-1}{\ln 5}`, to: String.raw`x=\T{n-1}{1.61}`, why: 'Calculator.' },
            { kind: 'check', label: 'Put the answer back in', from: String.raw`e^{x}\qquad x=\T{x-1}{1.61}`, to: String.raw`e^{\T{x-1}{1.61}}=5.0\ \checkmark`, arrows: { 'x-1': '' }, why: String.raw`It gives 5, so $x=1.61$ is right.` },
          ] },
        { type: 'quiz', question: String.raw`What is $\dfrac{d}{dt}e^{-t/\tau}$?`,
          choices: [String.raw`$e^{-t/\tau}$`, String.raw`$-\dfrac1\tau e^{-t/\tau}$`, String.raw`$-\tau e^{-t/\tau}$`, String.raw`$\dfrac{t}{\tau}e^{-t/\tau}$`], answer: 1,
          explain: String.raw`The number in front of $t$ is $a=-\frac1\tau$; bring it down as a multiplier.` },
        { type: 'quiz', question: String.raw`A capacitor holds a constant voltage. What is its current?`,
          choices: ['Zero', String.raw`$C\,v$`, 'Very large', String.raw`$v/C$`], answer: 0,
          explain: String.raw`$i=C\frac{dv}{dt}$ and a constant has slope 0.` },
      ],
    },
  ],
  matlab: [],
  assignments: [],
};
