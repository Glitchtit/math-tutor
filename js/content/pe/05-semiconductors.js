// Power Electronics — Lecture 3: Power semiconductors. Ported from docs/superpowers/pe1-artifact.html.

export default {
  id: 'pe-l3',
  number: 6,
  part: 'pe-devices',
  title: 'Lecture 3: Power semiconductors',
  summary: 'Doping, the PN junction, Schottky and PIN diodes, BJT, SCR, MOSFET, IGBT, their comparison, and wide-bandgap SiC/GaN.',
  intro: String.raw`<p>Doping, the PN junction, Schottky and PIN diodes, BJT, SCR, MOSFET, IGBT, their comparison, and wide-bandgap SiC/GaN.</p>`,
  lessons: [
    {
      id: 'doping',
      title: 'Silicon and doping',
      blocks: [
        { type: 'text', html: String.raw`<p>A switch can be mechanical (button), electromechanical (relay) or electrical (MOSFET). In power electronics, switches make rectifiers, active rectifiers, DC supplies and variable-frequency drives.</p>` },
        { type: 'text', html: String.raw`<ul>
<li>A semiconductor conducts between a conductor and an insulator. Its conductivity changes with doping, applied voltage or temperature. Examples: Si, Ge, GaAs.</li>
<li>Silicon: most used; second most abundant element after oxygen; 4 valence electrons forming covalent bonds in a diamond-like crystal.</li>
<li><strong>Group-3 dopant</strong> (B, Ga, In, Al) → adds <strong>holes</strong> → <strong>P-type</strong>.</li>
<li><strong>Group-5 dopant</strong> (P, As, Sb) → adds <strong>free electrons</strong> → <strong>N-type</strong>.</li>
<li>Holes (P) and free electrons (N) are the <em>mobile charge carriers</em>.</li>
</ul>` },
        { type: 'callout', kind: 'key', title: 'Memory aid', html: String.raw`<p>Silicon has 4. Group 3 brings one too few (a hole, Positive gap); group 5 one too many (an extra electron, Negative).</p>` },
        { type: 'callout', kind: 'def', title: 'Conventional current vs electron flow', html: String.raw`<p><strong>Conventional current</strong> flows + → − (Franklin, positive carriers). <strong>Electron flow</strong> is − → + (J.J. Thomson, 1897). Circuit diagrams use conventional current. In semiconductors both holes (+) and electrons (−) carry current.</p>` },
        { type: 'quiz', question: 'Doping silicon with phosphorus (group 5) produces', choices: ['P-type, majority holes', 'N-type, majority electrons', 'Intrinsic silicon', 'P-type, majority electrons'], answer: 1,
          explain: 'Group 5 (P, As, Sb) has one more valence electron than Si → extra free electrons → N-type. Group 3 (B, Ga, In, Al) → holes → P-type.' },
      ],
    },
    {
      id: 'pn-junction',
      title: 'The PN junction diode',
      blocks: [
        { type: 'text', html: String.raw`<p><strong>PN junction diode</strong> (Russell Ohl, Bell Labs, 1939; commercial ~1947). What happens in each bias state:</p>` },
        { type: 'table', head: ['Bias', 'What happens'], rows: [
          ['Zero', 'Holes diffuse P → N, electrons N → P. This leaves negative charge on the P side and positive on the N side: the <strong>depletion layer</strong>. Its electric field stops further diffusion and forms the <strong>potential barrier</strong>. Width depends on doping levels.'],
          ['Forward (+ to P)', 'No current until the applied voltage exceeds the barrier (the <strong>knee voltage</strong>: Si 0.7 V, Ge 0.3 V). Then the depletion layer shrinks to nearly zero and current flows A → K.'],
          ['Reverse (+ to N)', 'Barrier grows; diode insulates. A small <strong>reverse leakage</strong> current flows from minority carriers (Si &lt; 20 µA, Ge &lt; 50 µA). At the <strong>breakdown voltage</strong> (around 20–30 V for common diodes) <strong>avalanche breakdown</strong> lets large reverse current flow.'],
        ] },
        { type: 'quiz', question: 'Knee voltage of a silicon PN diode', choices: ['0.3 V', '0.5 V', '0.7 V', '1.2 V'], answer: 2, explain: 'Si 0.7 V, Ge 0.3 V.' },
        { type: 'quiz', question: 'The depletion layer in an unbiased PN junction forms because', choices: ['Carriers diffuse across the junction, leaving fixed charges whose field stops further diffusion', 'The metal contact repels electrons', 'Avalanche breakdown occurs', 'The gate oxide charges up'], answer: 0,
          explain: 'Holes diffuse P → N and electrons N → P; the uncovered ions create a field and potential barrier.' },
      ],
    },
    {
      id: 'schottky-pin',
      title: 'Schottky and PIN diodes',
      blocks: [
        { type: 'text', html: String.raw`<p><strong>Schottky</strong> (theory: Walter Schottky 1938; commercial 1960s): P-type replaced by a metal (Al, W, Mo, Pt, Cr) forming a metal–semiconductor junction. The <strong>Schottky barrier</strong> is much smaller, because there is no P-type: only electrons are majority carriers.</p>
<p><strong>PIN</strong> (Jun-ichi Nishizawa 1950; commercial ~1952): p+ (heavy), n− (lightly doped "intrinsic", wide), n+ (heavy). Zero bias: two depletion layers. Forward: carriers injected into the intrinsic layer, low-resistance switch. Reverse: depletion regions widen and merge into one large layer, high-resistance switch. The intrinsic layer acts as a voltage-controlled resistor.</p>` },
        { type: 'table', head: ['Property (vs PN)', 'Schottky', 'PIN'], rows: [
          ['Switching speed', 'Faster', '—'],
          ['Forward voltage drop', 'Lower', 'Higher'],
          ['On-state resistance', 'Lower', 'Higher'],
          ['Reverse breakdown voltage', 'Lower', 'Higher'],
          ['Reverse leakage current', 'Higher', 'Lower'],
        ] },
        { type: 'callout', kind: 'key', title: 'Pattern', html: String.raw`<p>Schottky and PIN are mirror images. Schottky trades blocking capability for speed and low loss (low-voltage, high-frequency). PIN trades conduction loss for blocking capability (high voltage).</p>` },
        { type: 'quiz', question: 'Compared with a PN diode, a Schottky diode has', choices: ['Higher forward drop and lower leakage', 'Higher breakdown voltage', 'Slower switching', 'Lower forward drop but higher reverse leakage'], answer: 3,
          explain: 'Schottky: faster, lower drop, lower on-resistance, lower breakdown, higher leakage. Metal–N junction, majority carriers only.' },
        { type: 'quiz', question: 'The main benefit of the lightly doped intrinsic layer in a PIN diode is', choices: ['Lower forward voltage drop', 'Higher reverse breakdown voltage', 'Faster switching than Schottky', 'Higher leakage current'], answer: 1,
          explain: 'Under reverse bias the two depletion regions merge into one wide layer: high breakdown, low leakage. Cost: higher on-resistance and forward drop.' },
      ],
    },
    {
      id: 'transistors',
      title: 'Transistors: BJT, SCR, MOSFET, IGBT',
      blocks: [
        { type: 'table', head: ['Device', 'Origin', 'Structure / terminals', 'Control'], rows: [
          ['BJT', 'Shockley, Bell Labs, 1948', 'NPN or PNP; emitter, base, collector. NPN: electrons majority; PNP: holes. Arrow shows current direction.', 'Small base current controls large C–E current (current-controlled)'],
          ['SCR (thyristor)', 'GE, 1956', 'PNPN, 3 junctions J1–J3; anode (heavily doped P), cathode, gate (on the P layer near the cathode)', 'Gate current pulse turns on; latches; turned off only by reverse-biasing A–K'],
          ['MOSFET', 'Atalla &amp; Kahng, Bell Labs, 1959', 'Gate, drain, source, body (body tied to source → 3 terminals). Gate insulated by SiO₂. N-channel: n+ D/S in p substrate. P-channel: the reverse.', 'Gate–source voltage (voltage-controlled)'],
          ['IGBT', 'Baliga, GE, 1977', 'Four layers (NPNP) with MOS gate; gate, emitter, collector. Combines MOSFET, BJT and SCR.', 'Gate–emitter voltage'],
        ] },
        { type: 'callout', kind: 'warn', title: 'Date conflicts between L1 and L3', html: String.raw`<p>SCR 1957 vs 1956, MOSFET 1960 vs 1959, IGBT 1982 vs 1977 (the L1 timeline gives the first year, this L3 table the second). If an exam question asks a year, check whether the options contain only one of the two; if both appear, the question is probably from the lecture on that topic (L3 for devices).</p>` },
        { type: 'text', html: String.raw`<p><strong>BJT on</strong>: base–emitter junction forward biased, collector–base reverse biased. Carriers are injected from emitter into the base; the base is thin, so they cross into the collector. <strong>Off</strong>: base–emitter reverse biased, no current.</p>
<p><strong>SCR modes</strong>:</p>
<ul>
<li><em>Forward blocking</em> (anode +): outer junctions J1, J3 forward biased, <strong>middle J2 reverse biased</strong> → blocks. No gate current, stays off.</li>
<li><em>Reverse blocking</em> (anode −): J1, J3 reverse biased, J2 forward → blocks. Gate signal does not help; stays off.</li>
<li><em>Forward conduction</em>: a sufficient gate–cathode current pulse injects holes, the middle depletion layer breaks down, device conducts. The outer layers then keep supplying carriers regardless of the gate: <strong>latched on</strong>. Turn-off requires reverse bias across A–K.</li>
</ul>
<p><strong>MOSFET</strong>: gate–oxide–body forms a capacitor. Off: non-positive $V_{GS}$, junctions blocked by depletion layers. On: positive $V_{GS}$ repels holes under the oxide and draws electrons in from n+ regions, creating an <strong>inversion n layer</strong> (the channel). Drain–source voltage then drives electrons through all-n path; majority carriers only, no diffusion current. Modes: <em>enhancement</em> = normally open (off at $V_{GS}=0$); <em>depletion</em> = normally closed.</p>
<p><strong>IGBT</strong>: positive $V_{GE}$ creates the N channel (MOSFET mechanism). That electron current drives hole injection from the outer p+ layer into the n− drift layer, which removes the inner depletion layer (BJT mechanism) and gives a hole current path too. Result: MOS-easy gate drive with bipolar-low conduction loss at high current.</p>` },
        { type: 'quiz', question: 'In SCR forward blocking mode (anode positive, no gate current)', choices: ['All three junctions are reverse biased', 'J1 and J3 reverse, J2 forward', 'J1 and J3 forward, J2 reverse', 'Only J1 is reverse biased'], answer: 2,
          explain: 'The middle junction J2 blocks the forward voltage. In reverse blocking it is the other way round.' },
        { type: 'quiz', question: 'Once an SCR is latched on, it turns off when', choices: ['The anode–cathode voltage is reversed', 'The gate current is removed', 'A negative gate pulse is applied', String.raw`$V_{GS}$ drops below threshold`], answer: 0,
          explain: 'After latching, the gate has lost control; the outer layers keep supplying carriers. Reverse bias across A–K is needed.' },
      ],
    },
    {
      id: 'comparison-wbg',
      title: 'MOSFET vs BJT vs IGBT, and wide bandgap',
      blocks: [
        { type: 'text', html: String.raw`<p><strong>MOSFET vs BJT (slide 29).</strong> MOSFET advantages: faster switching; higher input impedance (less switching/drive loss); no built-in forward voltage drop (no potential barrier in the channel); smaller (higher power density). Disadvantages: higher on-state resistance (conduction loss), lower current rating, more expensive. Uses: SMPS, consumer and automotive electronics, high-efficiency fast switching.</p>` },
        { type: 'table', head: ['Parameter', 'BJT', 'MOSFET', 'IGBT'], rows: [
          ['Switching speed', 'Slow (µs)', 'Fast (ns)', 'Medium-fast'],
          ['On-state resistance', 'Low', 'Medium', 'Low'],
          ['Switching loss', 'High', 'Low', 'Low'],
          ['Breakdown voltage', 'High (&lt; 1 kV)', 'High (&lt; 1 kV)', 'Very high (&gt; 1 kV)'],
          ['Current rating', 'High (&lt; 500 A)', 'Low (&lt; 200 A)', 'Very high (&gt; 500 A)'],
          ['Unit cost', 'Low', 'Medium', 'High'],
        ] },
        { type: 'text', html: String.raw`<p>IGBT uses: high-power SMPS, high-power consumer and automotive electronics, EV charging, motor control.</p>` },
        { type: 'text', html: String.raw`<p><strong>Wide bandgap (WBG)</strong></p>
<ul>
<li>Bandgap 2–3× that of silicon. Materials: GaN, SiC. Benefits: higher temperature and voltage tolerance, higher efficiency, more compact.</li>
<li><strong>SiC MOSFET</strong>: same MOS structure as Si-MOSFET on a SiC substrate; the drift layer is much thinner and more heavily doped → lower on-resistance.</li>
<li><strong>GaN</strong>: no doped regions. A heterojunction of AlGaN and GaN; because the bandgaps differ, electrons accumulate at the interface forming a <strong>2DEG</strong> (two-dimensional electron gas), a nanometre-thin channel with very high electron mobility. Usually GaN-on-Si or GaN-on-SiC substrates for cost and thermal reasons.</li>
<li>Trend: SiC MOSFETs and GaN devices are replacing Si transistors; MOSFET and IGBT remain the most used so far.</li>
</ul>` },
        { type: 'quiz', question: 'For a 1.2 kV, 600 A motor-drive switch, the table points to', choices: ['IGBT', 'MOSFET', 'BJT', 'Schottky diode'], answer: 0,
          explain: 'IGBT: breakdown &gt; 1 kV, current &gt; 500 A, low on-resistance.' },
        { type: 'quiz', question: 'Conduction in a GaN device happens in', choices: ['A heavily doped p+ region', 'An inversion layer under SiO₂', 'A 2DEG at the AlGaN/GaN heterojunction', 'The depletion layer'], answer: 2,
          explain: 'GaN has no doped regions; the bandgap difference accumulates electrons at the interface into a very high-mobility 2D electron gas.' },
      ],
    },
  ],
  matlab: [],
  assignments: [],
};
