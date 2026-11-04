// Power Electronics — Lecture 1: Fundamentals of power electronics. Ported from docs/superpowers/pe1-artifact.html.

export default {
  id: 'pe-l1',
  number: 2,
  part: 'pe-basics',
  title: 'Lecture 1: Fundamentals of power electronics',
  summary: 'What power electronics is, sources and loads, the four conversion schemes, converter components, history and applications.',
  intro: String.raw`<p>What power electronics is, sources and loads, the four conversion schemes, converter components, history and applications.</p>`,
  lessons: [
    {
      id: 'what-is-pe',
      title: 'What power electronics is; sources and loads',
      blocks: [
        { type: 'callout', kind: 'def', title: 'Power electronics', html: String.raw`<p>Power electronics is the application of electronic circuits to convert, control and manage the flow of electrical power from one form or level to another. Power converters do the conversion. Heat losses are unavoidable but can be reduced.</p>` },
        { type: 'text', html: String.raw`<p>A converter can change three things: the <b>system</b> (AC ↔ DC), the <b>voltage level</b> (LV ↔ HV) and the <b>frequency</b> (LF ↔ HF).</p>
<h3>Sources and loads</h3>
<ul>
<li><b>DC sources</b>: one current direction, constant voltage. PV, fuel cells, batteries.</li>
<li><b>AC sources</b>: current periodically reverses. Synchronous generators, constant 50 Hz or 60 Hz.</li>
<li><b>DC loads</b>: most consumer electronics (phone charger 3–6 V DC, laptop charger 12 V DC).</li>
<li><b>AC loads</b>: electric motors, which require AC of <em>variable frequency</em> (fan, refrigerator: 220–240 V 50 Hz EU, 110–120 V 60 Hz US).</li>
</ul>
<p>The motivating problems: run a DC load from AC, and rotate an AC motor from DC. Both are solved by power electronic converters.</p>` },
        { type: 'quiz', question: 'Which three things can a power converter change?',
          choices: ['Power, energy and charge', 'System (AC/DC), voltage level and frequency', 'Resistance, capacitance and inductance', 'Only the voltage level'], answer: 1,
          explain: 'System (AC ↔ DC), voltage level (LV ↔ HV) and frequency (LF ↔ HF).' },
        { type: 'quiz', question: 'Electric motors, as AC loads, require',
          choices: ['DC at a constant voltage', 'AC of fixed 50 Hz only', 'AC of variable frequency', 'A battery'], answer: 2,
          explain: 'L1: AC loads such as motors require AC of variable frequency.' },
      ],
    },
    {
      id: 'conversion',
      title: 'The four conversion schemes and their applications',
      blocks: [
        { type: 'table',
          head: ['Conversion', 'Converter name', 'Example in L1'],
          rows: [
            ['AC → DC', 'Rectifier', 'Laptop charger'],
            ['DC → AC', 'Inverter', 'PV system, active power filter, STATCOM'],
            ['DC → DC', 'DC-DC converter (buck, boost, buck-boost)', 'Computer power supply'],
            ['AC → AC', 'Cycloconverter (or rectifier + inverter)', 'Industrial motor drive'],
          ] },
        { type: 'text', html: String.raw`<h3>Power range and applications</h3><p>Converters span µW to MW: µW–mW (small electronics), 20–150 W (chargers, PCs), 1–500 kW (drives, EV), above 1000 MW (HVDC transmission).</p>` },
        { type: 'table',
          head: ['Application', 'Conversion'],
          rows: [
            ['Laptop charger', 'AC → DC'],
            ['Computer power supply (internal rails)', 'DC → DC'],
            ['Industrial motor drive', 'AC → AC'],
            ['EV drivetrain', 'DC → AC / DC'],
            ['EV charger / charging station', 'AC / DC → DC'],
            ['Wind power system', 'AC → AC / DC'],
            ['PV power system', 'DC → AC / DC'],
            ['FACTS: SVC, STATCOM, active power filter', 'DC → AC; dynamic reactive power compensation, harmonic filtering'],
          ] },
        { type: 'quiz', question: 'A converter that turns AC into DC is called',
          choices: ['Inverter', 'Rectifier', 'Cycloconverter', 'Chopper'], answer: 1,
          explain: 'Rectifier: AC → DC. Inverter: DC → AC. Cycloconverter: AC → AC.' },
        { type: 'quiz', question: 'An industrial variable-speed motor drive fed from the grid is classed in L1 as',
          choices: ['AC → DC', 'DC → DC', 'AC → AC', 'DC → AC'], answer: 2,
          explain: 'Fixed-frequency grid AC in, variable-frequency AC out to the motor.' },
      ],
    },
    {
      id: 'components',
      title: 'Converter components',
      blocks: [
        { type: 'text', html: String.raw`<p><b>Active</b>: transistor (controlled switch). <b>Passive</b>: diode, resistor, capacitor, inductor, transformer. Transistor and diode are the <em>semiconductor devices</em>.</p>` },
        { type: 'callout', kind: 'warn', title: 'The diode is passive', html: String.raw`<p>The diode is a semiconductor yet counted as passive, because it cannot be commanded on or off.</p>` },
        { type: 'quiz', question: 'Which is the active component of a power converter?',
          choices: ['Diode', 'Inductor', 'Transformer', 'Transistor'], answer: 3,
          explain: 'Only the transistor can be commanded on/off independently. The diode is a semiconductor but passive.' },
      ],
    },
    {
      id: 'history',
      title: 'History',
      blocks: [
        { type: 'text', html: String.raw`<p>Driving forces: defence and military (major influence), industrial electrification and grids, semiconductor revolution (critical breakthrough), transportation electrification, renewables and efficiency, consumer electronics (growing importance).</p>` },
        { type: 'table',
          head: ['Year', 'Milestone'],
          rows: [
            ['1880s', 'War of currents. Edison: DC distribution and lighting, high losses over distance. Tesla and Westinghouse: polyphase AC, transformers, efficient long-distance transmission.'],
            ['1902', 'Mercury arc rectifier, Peter Cooper Hewitt (NY). First high-power AC→DC converter; electrolysis, traction, manufacturing.'],
            ['1926', 'Thyratron vacuum tube, Irving Langmuir (GE). AC↔DC; traction and lighting control; radio, TV, first computers.'],
            ['1947', 'Point-contact transistor, Bardeen, Brattain, Shockley (Bell Labs). Germanium: poor thermal stability, slow, expensive.'],
            ['1957', 'SCR, Gordon Hall (GE). Beginning of modern power electronics; AC motors displace DC motors in traction. <b>(L3 says 1956.)</b>'],
            ['1960', 'MOSFET, Atalla and Kahng (Bell Labs). Rise of SMPS and microcontrollers. <b>(L3 says 1959.)</b>'],
            ['1982', 'IGBT, B. Jayant Baliga. <b>(L3 says 1977, GE.)</b>'],
            ['2010–', 'Wide bandgap (WBG): GaN and SiC. Better thermal stability, speed, efficiency; miniaturisation; DSP and renewable interfaces.'],
          ] },
        { type: 'callout', kind: 'exam', title: 'Date conflicts between L1 and L3', html: String.raw`<p>SCR 1957 vs 1956, MOSFET 1960 vs 1959, IGBT 1982 vs 1977. If an exam question asks a year, check whether the options contain only one of the two; if both appear, the question is probably from the lecture on that topic (L3 for devices), so go with the L3 year.</p>` },
        { type: 'quiz', question: 'The first high-power AC → DC converter (1902) was the',
          choices: ['Mercury arc rectifier', 'Thyratron', 'SCR', 'Point-contact transistor'], answer: 0,
          explain: 'Peter Cooper Hewitt, 1902. The thyratron came in 1926, the SCR in 1956/57.' },
      ],
    },
  ],
  matlab: [],
  assignments: [],
};
