// "Compare two methods" items: the same problem solved two correct ways, then: which is better here, and why?
// { id, module, title, problem: html, methods: [{ name, steps: [{ do, why }] }], question: html, choices: [html], answer: index, explain: html }

const Q = 'Both methods give the same answer. Which way is better here, and why?';

export default [
  {
    id: 'cmp-quotient-vs-simplify', module: 'derivatives', title: 'Quotient rule or simplify first?',
    problem: String.raw`<p>Differentiate $f(x) = \frac{x^3 + 2x}{x}$.</p>`,
    methods: [
      {
        name: 'Quotient rule',
        steps: [
          { do: String.raw`$u = x^3 + 2x,\; u' = 3x^2 + 2, \quad v = x,\; v' = 1$`, why: 'Name top and bottom and differentiate each (power rule).' },
          { do: String.raw`$f'(x) = \frac{(3x^2 + 2)\cdot x - (x^3 + 2x)\cdot 1}{x^2}$`, why: String.raw`Quotient rule: $\frac{u'v - uv'}{v^2}$.` },
          { do: String.raw`$= \frac{3x^3 + 2x - x^3 - 2x}{x^2}$`, why: 'Multiply out the top; the minus sign changes both signs in the second bracket.' },
          { do: String.raw`$= \frac{2x^3}{x^2}$`, why: String.raw`$3x^3 - x^3 = 2x^3$ and $2x - 2x = 0$.` },
          { do: String.raw`$= 2x$`, why: 'Cancel two x from top and bottom.' },
        ],
      },
      {
        name: 'Simplify first, then power rule',
        steps: [
          { do: String.raw`$\frac{x^3 + 2x}{x} = \frac{x^3}{x} + \frac{2x}{x}$`, why: 'Split the fraction: each term on top is divided by x.' },
          { do: String.raw`$= x^2 + 2 \quad (x \neq 0)$`, why: 'Cancel one x in each term.' },
          { do: String.raw`$f'(x) = 2x + 0 = 2x$`, why: 'Power rule; the constant 2 has derivative 0.' },
        ],
      },
    ],
    question: Q,
    choices: [
      'The quotient rule, because a fraction must always be differentiated with the quotient rule.',
      'Simplify first: dividing by a single x turns it into a polynomial, so there is far less algebra and fewer places to make a sign mistake.',
      'They are equally good: both take the same amount of work.',
      'Simplify first, because the quotient rule gives the wrong answer here.',
    ],
    answer: 1,
    explain: String.raw`<p>The quotient rule is correct, but here it creates a big top that then collapses again. Dividing by $x$ first gives $x^2 + 2$, which the power rule handles in one line. Always look for a quick simplification before reaching for a rule.</p>`,
  },
  {
    id: 'cmp-usub-vs-expand', module: 'substitution', title: 'u-substitution or expand the bracket?',
    problem: String.raw`<p>Find $\int 2x(x^2 + 1)^2\,dx$.</p>`,
    methods: [
      {
        name: 'u-substitution',
        steps: [
          { do: String.raw`$u = x^2 + 1, \quad du = 2x\,dx$`, why: 'The inside of the bracket has derivative 2x, which is sitting right outside it.' },
          { do: String.raw`$\int 2x(x^2 + 1)^2\,dx = \int u^2\,du$`, why: String.raw`Replace $(x^2+1)$ by $u$ and $2x\,dx$ by $du$.` },
          { do: String.raw`$= \frac{u^3}{3} + C$`, why: 'Power rule backwards.' },
          { do: String.raw`$= \frac{(x^2 + 1)^3}{3} + C$`, why: 'Put u back.' },
        ],
      },
      {
        name: 'Expand, then power rule',
        steps: [
          { do: String.raw`$(x^2 + 1)^2 = x^4 + 2x^2 + 1$`, why: String.raw`$(a + b)^2 = a^2 + 2ab + b^2$ with $a = x^2$, $b = 1$.` },
          { do: String.raw`$2x(x^4 + 2x^2 + 1) = 2x^5 + 4x^3 + 2x$`, why: 'Multiply each term by 2x.' },
          { do: String.raw`$\int (2x^5 + 4x^3 + 2x)\,dx = \frac{2x^6}{6} + \frac{4x^4}{4} + \frac{2x^2}{2} + C$`, why: 'Power rule backwards on each term.' },
          { do: String.raw`$= \frac{x^6}{3} + x^4 + x^2 + C$`, why: String.raw`Simplify. (It differs from $\frac{(x^2+1)^3}{3}$ only by the constant $\frac{1}{3}$, which the $+C$ absorbs.)` },
        ],
      },
    ],
    question: Q,
    choices: [
      'u-substitution: the derivative of the bracket is already outside it, so it is one short step, and it would still be short if the power were 10 instead of 2.',
      'Expanding, because u-substitution only works for definite integrals.',
      'Expanding: it is always safer to multiply everything out.',
      'Neither works; you need integration by parts.',
    ],
    answer: 0,
    explain: String.raw`<p>Expanding is fine for a square, but grows quickly: $(x^2 + 1)^{10}$ would have 11 terms. Whenever the derivative of an inside function is sitting outside it (here $2x$ next to $x^2 + 1$), u-substitution is the clean route.</p>`,
  },
  {
    id: 'cmp-implicit-vs-solve', module: 'derivatives', title: 'Implicit differentiation or solve for y first?',
    problem: String.raw`<p>The circle $x^2 + y^2 = 25$ passes through $(3, 4)$. Find the slope $\frac{dy}{dx}$ there.</p>`,
    methods: [
      {
        name: 'Implicit differentiation',
        steps: [
          { do: String.raw`$2x + 2y\frac{dy}{dx} = 0$`, why: String.raw`Differentiate both sides with respect to x; $y$ depends on x, so $\frac{d}{dx}y^2 = 2y\frac{dy}{dx}$ (chain rule). The derivative of 25 is 0.` },
          { do: String.raw`$\frac{dy}{dx} = \frac{-2x}{2y} = -\frac{x}{y}$`, why: 'Move 2x to the other side and divide by 2y.' },
          { do: String.raw`$\frac{dy}{dx} = -\frac{3}{4}$`, why: 'Put in x = 3, y = 4.' },
        ],
      },
      {
        name: 'Solve for y, then differentiate',
        steps: [
          { do: String.raw`$y = \sqrt{25 - x^2}$`, why: 'Solve for y; take the positive root because the point (3, 4) has y > 0.' },
          { do: String.raw`$\frac{dy}{dx} = \frac{1}{2\sqrt{25 - x^2}}\cdot (-2x)$`, why: String.raw`Chain rule: outer $\sqrt{u}$ has derivative $\frac{1}{2\sqrt{u}}$, inner $25 - x^2$ has derivative $-2x$.` },
          { do: String.raw`$= -\frac{x}{\sqrt{25 - x^2}}$`, why: 'Cancel the 2.' },
          { do: String.raw`$= -\frac{3}{\sqrt{25 - 9}} = -\frac{3}{\sqrt{16}} = -\frac{3}{4}$`, why: 'Put in x = 3.' },
        ],
      },
    ],
    question: Q,
    choices: [
      'Solving for y, because implicit differentiation is only an approximation.',
      'Solving for y, because it uses fewer steps.',
      'Implicit differentiation: no square root, no choosing between the + and − root, and the answer comes out in terms of the point you already know.',
      'They are equally good for every curve.',
    ],
    answer: 2,
    explain: String.raw`<p>Solving for y forces a square root and a choice of sign (the bottom half of the circle needs the minus root). Implicit differentiation skips that and gives $-\frac{x}{y}$, valid everywhere on the circle. For many curves (like $x^3 + y^3 = 6xy$) solving for y is not even possible.</p>`,
  },
  {
    id: 'cmp-lhopital-vs-factor', module: 'derivative-apps', title: "L'Hôpital or factoring?",
    problem: String.raw`<p>Find $\displaystyle\lim_{x \to 2} \frac{x^2 - 4}{x - 2}$.</p>`,
    methods: [
      {
        name: 'Factor and cancel',
        steps: [
          { do: String.raw`$\frac{2^2 - 4}{2 - 2} = \frac{0}{0}$`, why: 'Substituting gives 0/0, so simplify first.' },
          { do: String.raw`$\frac{x^2 - 4}{x - 2} = \frac{(x - 2)(x + 2)}{x - 2}$`, why: String.raw`Difference of squares: $a^2 - b^2 = (a - b)(a + b)$.` },
          { do: String.raw`$= x + 2$`, why: String.raw`Cancel $(x - 2)$, allowed because $x \neq 2$ in the limit.` },
          { do: String.raw`$\lim_{x\to 2}(x + 2) = 2 + 2 = 4$`, why: 'Now substitute.' },
        ],
      },
      {
        name: "L'Hôpital's rule",
        steps: [
          { do: String.raw`$\frac{2^2 - 4}{2 - 2} = \frac{0}{0}$`, why: "0/0, so L'Hôpital's rule may be used." },
          { do: String.raw`$\lim_{x\to 2}\frac{2x}{1}$`, why: 'Differentiate top and bottom separately: (x² − 4)′ = 2x, (x − 2)′ = 1.' },
          { do: String.raw`$= \frac{2\cdot 2}{1} = 4$`, why: 'Substitute x = 2.' },
        ],
      },
    ],
    question: Q,
    choices: [
      "L'Hôpital, because factoring is not allowed inside a limit.",
      "Factoring, because L'Hôpital gives the wrong answer for polynomials.",
      "L'Hôpital, because it always uses fewer steps for every limit.",
      "Factoring is the better habit here: it needs only algebra, shows why the limit exists (a hidden common factor), and keeps L'Hôpital for limits that cannot be factored, like sin(x)/x. L'Hôpital is also correct and quick.",
    ],
    answer: 3,
    explain: String.raw`<p>Both are correct and short. When the top factors easily, factoring is the more basic tool: no derivatives, and you see the cancelled factor. Save L'Hôpital for 0/0 limits with $e^x$, $\sin x$, $\ln x$ and the like, where there is nothing to factor.</p>`,
  },
  {
    id: 'cmp-pf-vs-sub', module: 'inverse-sub', title: 'Partial fractions or a substitution?',
    problem: String.raw`<p>Find $\int \frac{2x}{x^2 - 1}\,dx$ for $x > 1$.</p>`,
    methods: [
      {
        name: 'Substitution',
        steps: [
          { do: String.raw`$u = x^2 - 1, \quad du = 2x\,dx$`, why: 'The top, 2x, is exactly the derivative of the bottom.' },
          { do: String.raw`$\int \frac{2x}{x^2 - 1}\,dx = \int \frac{1}{u}\,du$`, why: String.raw`Replace the bottom by $u$ and $2x\,dx$ by $du$.` },
          { do: String.raw`$= \ln|u| + C = \ln|x^2 - 1| + C$`, why: String.raw`$\int \frac{1}{u}\,du = \ln|u|$; put u back.` },
        ],
      },
      {
        name: 'Partial fractions',
        steps: [
          { do: String.raw`$\frac{2x}{(x - 1)(x + 1)} = \frac{A}{x - 1} + \frac{B}{x + 1}$`, why: String.raw`Factor the bottom ($x^2 - 1 = (x-1)(x+1)$) and split into two simple fractions.` },
          { do: String.raw`$2x = A(x + 1) + B(x - 1)$`, why: String.raw`Multiply both sides by $(x - 1)(x + 1)$.` },
          { do: String.raw`$x = 1:\; 2 = 2A \Rightarrow A = 1; \quad x = -1:\; -2 = -2B \Rightarrow B = 1$`, why: 'Choose x values that make one bracket zero.' },
          { do: String.raw`$\int\left(\frac{1}{x - 1} + \frac{1}{x + 1}\right)dx = \ln|x - 1| + \ln|x + 1| + C$`, why: String.raw`Each piece integrates to a logarithm.` },
          { do: String.raw`$= \ln|x^2 - 1| + C$`, why: String.raw`Log rule: $\ln a + \ln b = \ln(ab)$, and $(x-1)(x+1) = x^2 - 1$.` },
        ],
      },
    ],
    question: Q,
    choices: [
      'Substitution: the top is exactly the derivative of the bottom, so it is a one-line logarithm with no unknowns A and B to find.',
      'Partial fractions, because a substitution cannot be used on a fraction.',
      'Partial fractions, because it gives a more accurate answer.',
      'Substitution, because partial fractions only works when the top is a number.',
    ],
    answer: 0,
    explain: String.raw`<p>Before splitting a fraction, check whether the top is (a multiple of) the derivative of the bottom. If it is, $\int \frac{f'(x)}{f(x)}\,dx = \ln|f(x)| + C$ immediately. Partial fractions is the tool when it is not, e.g. $\int \frac{1}{x^2 - 1}\,dx$.</p>`,
  },
  {
    id: 'cmp-geometric-formula-vs-partial', module: 'series', title: 'Formula or partial sums?',
    problem: String.raw`<p>Find $\displaystyle\sum_{n=0}^{\infty} \left(\frac{1}{2}\right)^n = 1 + \frac{1}{2} + \frac{1}{4} + \cdots$.</p>`,
    methods: [
      {
        name: 'Partial sums and a limit',
        steps: [
          { do: String.raw`$S_N = 1 + \frac{1}{2} + \cdots + \left(\frac{1}{2}\right)^N$`, why: 'The N-th partial sum adds the first N + 1 terms.' },
          { do: String.raw`$S_N = \frac{1 - \left(\frac{1}{2}\right)^{N+1}}{1 - \frac{1}{2}}$`, why: String.raw`Finite geometric sum: $1 + r + \cdots + r^N = \frac{1 - r^{N+1}}{1 - r}$.` },
          { do: String.raw`$= 2\left(1 - \left(\tfrac{1}{2}\right)^{N+1}\right) = 2 - \left(\tfrac{1}{2}\right)^{N}$`, why: String.raw`Dividing by $\frac{1}{2}$ is multiplying by 2; $2\cdot\left(\frac{1}{2}\right)^{N+1} = \left(\frac{1}{2}\right)^{N}$.` },
          { do: String.raw`$\lim_{N\to\infty} S_N = 2 - 0 = 2$`, why: String.raw`$\left(\frac{1}{2}\right)^N \to 0$ as N grows.` },
        ],
      },
      {
        name: 'Geometric series formula',
        steps: [
          { do: String.raw`$\text{first term} = 1, \quad r = \frac{1}{2}, \quad |r| < 1$`, why: 'Each term is half the previous one; |r| < 1 so the series converges.' },
          { do: String.raw`$S = \frac{1}{1 - \frac{1}{2}} = \frac{1}{\frac{1}{2}} = 2$`, why: String.raw`Geometric series formula $\frac{\text{first term}}{1 - r}$.` },
        ],
      },
    ],
    question: Q,
    choices: [
      'Partial sums, because the formula only gives an approximate value.',
      'Partial sums, because the formula needs the series to start at n = 1.',
      'The formula: once you have checked |r| < 1 it gives the sum in one line. The partial-sum limit is exactly how the formula is proved, so redoing it each time repeats work.',
      'The formula, because it also works when |r| ≥ 1.',
    ],
    answer: 2,
    explain: String.raw`<p>The partial-sum route is the definition of an infinite sum and is worth seeing once. The formula $\frac{\text{first term}}{1 - r}$ packages that limit, so use it, but only after checking $|r| < 1$: for $|r| \ge 1$ the series diverges.</p>`,
  },
];
