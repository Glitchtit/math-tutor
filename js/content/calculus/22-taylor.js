// Module 22: Taylor polynomials and Taylor series — the last module of the course, ending with
// a capstone on sequences, series, power series and Taylor remainders.
// Written to the hand-holding standard (see CONTENT.md): every assignment type is first worked
// step by step, then practised in a guided exercise with new numbers. The two review lessons at
// the end re-teach the sequence and series types that the capstone uses.

export default {
  id: 'taylor',
  number: 22,
  part: 'series',
  hw: 'HW6',
  title: 'Taylor polynomials and Taylor series',
  summary: 'Taylor polynomials P_n (derivative table, coefficients f^(k)(a)/k!), trig functions such as tan and sec at a ≠ 0, the standard Maclaurin series (e^x, sin, cos, ln(1+x), arctan, binomial) and how to build new series from them, limits with series, the Lagrange remainder |R_n(x)| ≤ M|x − a|^(n+1)/(n+1)! with M bounding the (n+1)-th derivative between a and x, how many terms a given accuracy needs, the alternating-series bound as an alternative, and series for integrals such as erf. Ends with review lessons and a capstone covering the whole series part.',
  intro: String.raw`<p>The tangent line is the best degree-1 approximation of a function near a point. Taylor polynomials continue the idea: match the value and the first $n$ derivatives at $x = a$. Their limit, the Taylor series, connects every function of the course to the power series of the previous module — and the remainder estimate tells you, with a proof, how many terms you need.</p><p>Each lesson adds one idea, shows it fully worked, and lets you do the same type step by step before the assignments.</p>`,
  lessons: [
    {
      id: 'taylor-polynomials',
      title: 'Taylor polynomials',
      blocks: [
        { type: 'text', html: String.raw`<p>Raise the degree $n$: the Taylor polynomials $P_n$ of $e^x$ at $a = 0$ hug the graph on a longer and longer stretch. At $x = 1.5$ (purple line) the readout shows the error shrinking.</p>` },
        { type: 'widget', name: 'taylor', config: {
          title: 'Taylor polynomials of e^x at a = 0',
          f: 'exp(x)', coef: '1./gamma(k + 1)', a: 0, nmax: 12, n: 2, at: 1.5,
          xlim: [-3, 3], ylim: [-1, 12],
        } },
        { type: 'callout', kind: 'def', title: 'Taylor polynomial', html: String.raw`<p>The Taylor polynomial of degree $n$ of $f$ at $x = a$ is</p>$$P_n(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(x-a)^k = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \cdots + \frac{f^{(n)}(a)}{n!}(x-a)^n .$$<p>Here $f^{(k)}$ is the $k$-th derivative ($f^{(0)} = f$), $k! = 1\cdot 2\cdots k$ with $0! = 1$, and $\frac{f^{(k)}(a)}{k!}$ is the $k$-th <b>coefficient</b>. $P_n$ is the unique polynomial of degree $\le n$ with $P_n^{(k)}(a) = f^{(k)}(a)$ for $k = 0, \dots, n$. For $a = 0$ it is called a <b>Maclaurin</b> polynomial. Letting $n \to \infty$ gives the <b>Taylor series</b>.</p>` },
        { type: 'callout', kind: 'key', title: 'The recipe', html: String.raw`<ol><li>Write down $f, f', f'', f''', \dots$ up to $f^{(n)}$, computing each derivative from the previous one.</li><li>Evaluate each at $x = a$.</li><li>Divide by $k!$ to get the coefficients.</li><li>Assemble $P_n$, keeping the powers $(x - a)^k$ unexpanded.</li></ol>` },
        { type: 'refresher', title: 'power rule with fractional and negative exponents', html: String.raw`<ul><li>$(x^r)' = r\,x^{r-1}$: bring the exponent down in front, then subtract $1$ from it. Works for every real $r$.</li><li>$\sqrt x = x^{1/2}$ and $\frac1x = x^{-1}$.</li><li>$4^{1/2} = 2$, $4^{-1/2} = \frac12$, $4^{-3/2} = \frac{1}{4^{3/2}} = \frac{1}{8}$, $4^{-5/2} = \frac{1}{32}$ (take the square root first, then the power).</li></ul>` },
        { type: 'derive', title: String.raw`Example: $P_3$ of $f(x) = \sqrt x$ at $a = 4$`, steps: [
          { kind: 'start', label: 'Root as a power', from: String.raw`f(x)=\sqrt x`, to: String.raw`f(x)=x^{1/2}`, why: 'Write the root as a power so the power rule applies.' },
          { kind: 'calculus', label: 'Power rule', from: String.raw`f(x)=x^{\T{e-1}{1/2}}`, to: String.raw`f'(x)=\T{e-1}{\tfrac12}\,x^{-1/2}`, arrows: { 'e-1': 'comes down' }, why: String.raw`Power rule: exponent $\frac12$ comes down, new exponent $\frac12 - 1 = -\frac12$.` },
          { kind: 'calculus', label: 'Power rule again', from: String.raw`f'(x)=\tfrac12\,x^{\T{e-2}{-1/2}}`, to: String.raw`f''(x)=\tfrac12\cdot\left(\T{e-2}{-\tfrac12}\right)x^{-3/2}`, arrows: { 'e-2': 'comes down' }, why: String.raw`Differentiate $f'$: exponent $-\frac12$ comes down, new exponent $-\frac12 - 1 = -\frac32$.` },
          { kind: 'calc', label: String.raw`$\frac12\cdot\left(-\frac12\right) = -\frac14$`, to: String.raw`f''(x)=-\tfrac14\,x^{-3/2}`, why: 'Multiply the two numbers in front.' },
          { kind: 'calculus', label: 'Power rule again', from: String.raw`f''(x)=-\tfrac14\,x^{\T{e-3}{-3/2}}`, to: String.raw`f'''(x)=-\tfrac14\cdot\left(\T{e-3}{-\tfrac32}\right)x^{-5/2}`, arrows: { 'e-3': 'comes down' }, why: String.raw`Differentiate $f''$: exponent $-\frac32$ comes down, new exponent $-\frac52$.` },
          { kind: 'calc', label: String.raw`$-\frac14\cdot\left(-\frac32\right) = \frac38$`, to: String.raw`f'''(x)=\tfrac38\,x^{-5/2}`, why: 'Two minus signs give plus.' },
          { kind: 'sub', label: String.raw`Put $x = 4$ into $f$ and $f'$`, from: String.raw`f(x)=x^{1/2},\qquad f'(x)=\tfrac12\,x^{-1/2}`, to: String.raw`f(4)=2,\qquad f'(4)=\tfrac12\cdot\tfrac12=\tfrac14`, why: String.raw`$4^{1/2} = 2$ and $4^{-1/2} = \frac12$ (refresher).` },
          { kind: 'sub', label: String.raw`Put $x = 4$ into $f''$ and $f'''$`, from: String.raw`f''(x)=-\tfrac14\,x^{-3/2},\qquad f'''(x)=\tfrac38\,x^{-5/2}`, to: String.raw`f''(4)=-\tfrac14\cdot\tfrac18=-\tfrac1{32},\qquad f'''(4)=\tfrac38\cdot\tfrac1{32}=\tfrac{3}{256}`, why: String.raw`$4^{-3/2} = \frac18$ and $4^{-5/2} = \frac1{32}$.` },
          { kind: 'calc', label: String.raw`$c_0$ and $c_1$`, from: String.raw`c_k=\frac{f^{(k)}(4)}{k!}`, to: String.raw`c_0=\frac{2}{0!}=2,\qquad c_1=\frac{1/4}{1!}=\frac14`, why: String.raw`Coefficients $c_k = \frac{f^{(k)}(4)}{k!}$; $0! = 1! = 1$.` },
          { kind: 'calc', label: String.raw`$c_2$ and $c_3$`, to: String.raw`c_2=\frac{-1/32}{2!}=-\frac1{64},\qquad c_3=\frac{3/256}{3!}=\frac{3}{1536}=\frac{1}{512}`, why: String.raw`$2! = 2$ and $3! = 6$.` },
          { kind: 'sub', label: 'Assemble', from: String.raw`P_3(x)=\T{c-0}{c_0}+\T{c-1}{c_1}(x-4)+\T{c-2}{c_2}(x-4)^2+\T{c-3}{c_3}(x-4)^3`, to: String.raw`P_3(x)=\T{c-0}{2}+\T{c-1}{\frac{1}{4}}(x-4)+\left(\T{c-2}{-\frac{1}{64}}\right)(x-4)^2+\T{c-3}{\frac{1}{512}}(x-4)^3`, why: String.raw`Assemble $\sum c_k (x-4)^k$.` },
          { kind: 'result', label: 'Tidy up the signs', from: String.raw`P_3(x)=2+\frac{1}{4}(x-4)+\left(-\frac{1}{64}\right)(x-4)^2+\frac{1}{512}(x-4)^3`, to: String.raw`P_3(x)=2+\frac{x-4}{4}-\frac{(x-4)^2}{64}+\frac{(x-4)^3}{512}`, why: String.raw`Adding $-\frac1{64}(x-4)^2$ is subtracting $\frac{(x-4)^2}{64}$. Keep the powers of $(x-4)$ unexpanded.` },
        ] },
        { type: 'guided', title: String.raw`$P_3$ of $f(x) = \dfrac1x$ at $a = 2$`, problem: String.raw`Find the Taylor polynomial $P_3$ of $f(x) = \frac1x = x^{-1}$ at $a = 2$, following the recipe.`, steps: [
          { prompt: String.raw`$f'(x) = -x^{-2}$. Type $f''(x)$.`, ask: { kind: 'expression', answer: '2./x.^3', variable: 'x', domain: [1, 3], label: "f''(x) =" }, hint: String.raw`Power rule on $-x^{-2}$: the exponent $-2$ comes down.`, reveal: String.raw`$f''(x) = (-1)(-2)x^{-3} = 2x^{-3}$, and then $f'''(x) = -6x^{-4}$.` },
          { prompt: String.raw`Evaluate $f'''(2) = -6\cdot 2^{-4}$.`, ask: { kind: 'numeric', answer: '-3/8' }, hint: String.raw`$2^{-4} = \frac{1}{16}$.`, reveal: String.raw`$f'''(2) = -\frac{6}{16} = -\frac38$. Also $f(2) = \frac12$, $f'(2) = -\frac14$, $f''(2) = \frac{2}{8} = \frac14$.` },
          { prompt: String.raw`The coefficient $c_2 = \frac{f''(2)}{2!}$:`, ask: { kind: 'numeric', answer: '1/8' }, hint: String.raw`$\frac{1/4}{2}$.`, reveal: String.raw`$c_2 = \frac18$.` },
          { prompt: String.raw`The coefficient $c_3 = \frac{f'''(2)}{3!}$:`, ask: { kind: 'numeric', answer: '-1/16' }, hint: String.raw`$\frac{-3/8}{6}$.`, reveal: String.raw`$c_3 = -\frac{3}{48} = -\frac{1}{16}$.` },
          { prompt: String.raw`Type $P_3(x)$ in powers of <code>(x-2)</code>.`, ask: { kind: 'expression', answer: '1/2 - (x-2)/4 + (x-2).^2/8 - (x-2).^3/16', variable: 'x', domain: [1.5, 2.5], label: 'P3(x) =' }, hint: String.raw`$c_0 = \frac12$, $c_1 = -\frac14$, $c_2 = \frac18$, $c_3 = -\frac1{16}$.`, reveal: String.raw`$P_3(x) = \frac12 - \frac{x-2}{4} + \frac{(x-2)^2}{8} - \frac{(x-2)^3}{16}$.` },
        ] },
        { type: 'callout', kind: 'exam', html: String.raw`<p>Keep powers of $(x - a)$ — do not expand them. A table with columns $k$, $f^{(k)}(x)$, $f^{(k)}(a)$, $f^{(k)}(a)/k!$ is the clearest way to present the computation.</p>` },
        { type: 'quiz', question: String.raw`If $P_2(x) = 3 - 2(x-1) + 5(x-1)^2$ is the Taylor polynomial of $f$ at $1$, then $f''(1) = $`, choices: [String.raw`$5$`, String.raw`$10$`, String.raw`$5/2$`, String.raw`$-2$`], answer: 1, explain: String.raw`The coefficient of $(x-1)^2$ is $f''(1)/2! = 5$, so $f''(1) = 10$.` },
      ],
    },
    {
      id: 'remainder',
      title: 'The Lagrange remainder',
      blocks: [
        { type: 'text', html: String.raw`<p>How good is $P_n(x)$? For $\ln(1+x)$ at $x = 0.5$ the error shrinks by a factor of about $2$ per degree; past the radius ($x > 1$) it grows instead. The remainder theorem turns this picture into a guaranteed bound.</p>` },
        { type: 'widget', name: 'taylor', config: {
          title: 'Taylor polynomials of ln(1 + x) at a = 0; error at x = 0.5',
          f: 'log(1 + x)', coef: '(k > 0).*cos((k-1)*pi)./(k + (k==0))', a: 0, nmax: 20, n: 3, R: 1, Rtex: '1', at: 0.5,
          xlim: [-1, 2.5], ylim: [-3, 2],
        } },
        { type: 'callout', kind: 'thm', title: "Taylor's theorem with the Lagrange remainder", html: String.raw`<p>If $f^{(n+1)}$ exists on an interval containing $a$ and $x$, then $f(x) = P_n(x) + R_n(x)$ with</p>$$R_n(x) = \frac{f^{(n+1)}(\xi)}{(n+1)!}(x - a)^{n+1}$$<p>for some (unknown) number $\xi$ between $a$ and $x$. Consequently, if $|f^{(n+1)}(t)| \le M$ for all $t$ <b>between $a$ and $x$</b>,</p>$$|R_n(x)| \le \frac{M\,|x-a|^{n+1}}{(n+1)!}.$$<p>Note the derivative: for $P_n$ we need the <b>next</b> one, $f^{(n+1)}$.</p>` },
        { type: 'refresher', title: 'bounding a function on an interval', html: String.raw`<ul><li>If $g$ is <b>increasing</b> on $[p, q]$, its largest value is $g(q)$; if <b>decreasing</b>, it is $g(p)$. So for a monotone function, check the endpoints.</li><li>$e^t$ is increasing: on $[0, 0.3]$, $e^t \le e^{0.3}$.</li><li>$|\sin t| \le 1$ and $|\cos t| \le 1$ for every $t$ — a valid (if crude) $M$.</li><li>Any number that is at least the true maximum is a valid $M$; a smaller valid $M$ gives a sharper bound.</li></ul>` },
        { type: 'derive', title: String.raw`Example 1: $e^{0.3} \approx P_3(0.3)$ for $f(x) = e^x$, $a = 0$; bound the error`, steps: [
          { kind: 'calculus', label: 'Every derivative', from: String.raw`f(x)=e^x`, to: String.raw`f^{(k)}(x)=e^x,\qquad f^{(k)}(0)=e^0=1`, why: String.raw`$e^x$ is its own derivative, and $e^0 = 1$.` },
          { kind: 'sub', label: String.raw`Coefficients $\frac{1}{k!}$`, from: String.raw`P_3(x)=\sum_{k=0}^{3}\frac{f^{(k)}(0)}{k!}x^k`, to: String.raw`P_3(x)=1+x+\frac{x^2}{2}+\frac{x^3}{6}`, why: String.raw`Coefficients $\frac{1}{k!}$ for $k = 0, 1, 2, 3$: $\frac{1}{0!} = \frac{1}{1!} = 1$, $\frac{1}{2!} = \frac12$, $\frac{1}{3!} = \frac16$.` },
          { kind: 'sub', label: String.raw`Put $x = 0.3$`, from: String.raw`P_3(x)=1+\T{x-1}{x}+\frac{\T{x-2}{x}^2}{2}+\frac{\T{x-3}{x}^3}{6}`, to: String.raw`P_3(0.3)=1+\T{x-1}{0.3}+\frac{\T{x-2}{0.3}^2}{2}+\frac{\T{x-3}{0.3}^3}{6}`, why: 'Replace every $x$ by $0.3$.' },
          { kind: 'calc', label: 'Add', to: String.raw`P_3(0.3)=1+0.3+0.045+0.0045=1.3495`, why: String.raw`$\frac{0.09}{2} = 0.045$ and $\frac{0.027}{6} = 0.0045$.` },
        ] },
        { type: 'derive', symbolic: true, title: String.raw`Example 1 (continued): the Lagrange bound for $e^x$, $n = 3$, $a = 0$, as a formula in $x$`, colors: { M: 1, x: 2 }, steps: [
          { kind: 'sub', label: String.raw`Put $n = 3$, $a = 0$ into the bound`, from: String.raw`|R_n(x)|\le\frac{M\,|x-\T{a-1}{a}|^{\T{n-1}{n+1}}}{(\T{n-2}{n+1})!}`, to: String.raw`|R_3(x)|\le\frac{M\,|x-\T{a-1}{0}|^{\T{n-1}{4}}}{(\T{n-2}{4})!}`, why: String.raw`Lagrange formula with $n = 3$: we need the 4th derivative, and $(n+1)! = 4!$.` },
          { kind: 'calc', label: String.raw`$4! = 24$`, to: String.raw`|R_3(x)|\le\frac{M\,|x|^{4}}{24}`, why: String.raw`$4! = 1\cdot2\cdot3\cdot4 = 24$ and $x - 0 = x$.` },
          { kind: 'sub', label: String.raw`$M$ for $0 < x$`, from: String.raw`|R_3(x)|\le\frac{\T{M-1}{M}\,|x|^{4}}{24}`, to: String.raw`|R_3(x)|\le\frac{\T{M-1}{e^{x}}\,x^{4}}{24}\qquad(x>0)`, why: String.raw`$|f^{(4)}(t)| = e^t$ is increasing, so on $[0, x]$ its maximum is at the right end $t = x$: $M = e^x$.` },
        ] },
        { type: 'derive', title: String.raw`With numbers: $x = 0.3$`, given: String.raw`\T{x-0}{x}=0.3`, colors: { M: 1, x: 2 }, steps: [
          { kind: 'sub', label: String.raw`Put $x = 0.3$ into the bound`, from: String.raw`|R_3(x)|\le\frac{e^{\T{x-a}{x}}\,\T{x-b}{x}^{4}}{24}\qquad\qquad x=\T{x-1}{0.3}`, to: String.raw`|R_3(0.3)|\le\frac{e^{\T{x-1}{0.3}}\cdot\T{x-2}{0.3}^{4}}{24}`, map: { 'x-1': ['x-1', 'x-2'] }, arrows: { 'x-1': 'x = 0.3' }, why: String.raw`Plug $M = e^{0.3}$, $|x - a| = 0.3$ and $(n+1)! = 24$ into the bound.` },
          { kind: 'calc', label: String.raw`$0.3^4 = 0.0081$`, to: String.raw`|R_3(0.3)|\le\frac{e^{0.3}\cdot 0.0081}{24}`, why: String.raw`$0.3^2 = 0.09$ and $0.09^2 = 0.0081$.` },
          { kind: 'calc', label: String.raw`$e^{0.3} \approx 1.3499$`, to: String.raw`|R_3(0.3)|\le\frac{1.3499\cdot 0.0081}{24}\approx 4.56\cdot10^{-4}`, why: String.raw`$e^{0.3} \approx 1.3499$.` },
          { kind: 'check', label: 'Compare with the true error', from: String.raw`e^{0.3}-P_3(0.3)`, to: String.raw`1.34986-1.3495\approx 3.6\cdot10^{-4}\le 4.56\cdot10^{-4}\ \checkmark`, why: 'The true error is below the bound, as it must be.' },
        ] },
        { type: 'guided', title: String.raw`Bound $|R_2(0.4)|$ for $f(x) = e^x$, $a = 0$`, problem: String.raw`$e^{0.4} \approx P_2(0.4) = 1 + 0.4 + \frac{0.4^2}{2} = 1.48$. Bound the error with the Lagrange remainder.`, steps: [
          { prompt: String.raw`For $P_2$, which derivative appears in $R_2$? (Give its order.)`, ask: { kind: 'numeric', answer: '3' }, hint: String.raw`$R_n$ uses $f^{(n+1)}$.`, reveal: String.raw`The 3rd derivative: $R_2(0.4) = \frac{f'''(\xi)}{3!}(0.4)^3$.` },
          { prompt: String.raw`$|f'''(t)| = e^t$ on $[0, 0.4]$. The best $M$ is`, ask: { kind: 'choice', choices: [String.raw`$e^{0} = 1$`, String.raw`$e^{0.4}$`, String.raw`$e^{0.2}$`], answer: 1 }, hint: String.raw`$e^t$ is increasing: where is its maximum on $[0, 0.4]$?`, reveal: String.raw`$M = e^{0.4}$, at the right end.` },
          { prompt: String.raw`The bound $\frac{M\cdot 0.4^3}{3!}$:`, ask: { kind: 'numeric', answer: 'exp(0.4)*0.4^3/6', tol: 1e-4 }, hint: String.raw`$0.4^3 = 0.064$ and $3! = 6$.`, reveal: String.raw`$\frac{e^{0.4}\cdot 0.064}{6} \approx 0.0159$. (True error $\approx 0.0118$.)` },
        ] },
        { type: 'derive', title: String.raw`Example 2: $\cos(0.3) \approx 1 - \frac{0.3^2}{2}$; bound the error with $M = 1$`, steps: [
          { kind: 'sub', label: 'Coefficients at $a = 0$', from: String.raw`\cos 0=1,\quad(\cos)'(0)=-\sin 0=0,\quad(\cos)''(0)=-\cos 0=-1`, to: String.raw`P_2(x)=1+0\cdot x-\frac{1}{2}x^2=1-\frac{x^2}{2}`, why: String.raw`The coefficients are $\frac{1}{0!}$, $\frac{0}{1!}$, $\frac{-1}{2!}$, i.e. $1, 0, -\frac12$.` },
          { kind: 'calc', label: String.raw`$P_3 = P_2$`, from: String.raw`(\cos)'''(0)=\sin 0=0`, to: String.raw`P_3(x)=P_2(x)=1-\frac{x^2}{2}`, why: String.raw`The $x^3$ coefficient is $0$. So we may use the better remainder $R_3$.` },
          { kind: 'sub', label: String.raw`Put $x = 0.3$`, from: String.raw`P_2(x)=1-\frac{\T{x-1}{x}^2}{2}`, to: String.raw`P_2(0.3)=1-\frac{\T{x-1}{0.3}^2}{2}=1-0.045=0.955`, why: String.raw`$\frac{0.09}{2} = 0.045$.` },
          { kind: 'sub', label: String.raw`Lagrange with $n = 3$`, from: String.raw`R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}x^{n+1}`, to: String.raw`R_3(0.3)=\frac{f^{(4)}(\xi)}{4!}(0.3)^4,\qquad f^{(4)}=\cos`, why: 'Lagrange with $n = 3$; the 4th derivative of cosine is cosine again.' },
          { kind: 'result', label: 'Choose $M$', from: String.raw`|f^{(4)}(t)|=|\cos t|`, to: String.raw`|f^{(4)}(t)|=|\cos t|\le 1=M`, why: 'Cosine never exceeds 1 in size.' },
          { kind: 'sub', label: 'Plug in', from: String.raw`|R_3(0.3)|\le\frac{\T{M-1}{M}\cdot 0.3^4}{4!}`, to: String.raw`|R_3(0.3)|\le\frac{\T{M-1}{1}\cdot 0.0081}{24}=3.375\cdot10^{-4}`, why: String.raw`$0.3^4 = 0.0081$ and $4! = 24$. (True error $3.36\cdot10^{-4}$.)` },
        ] },
        { type: 'guided', title: String.raw`$\sin(0.4) \approx 0.4 - \frac{0.4^3}{6}$`, problem: String.raw`For $\sin x$ at $a = 0$, $P_3(x) = x - \frac{x^3}{6}$ and $P_4 = P_3$ (the $x^4$ coefficient is $0$). Bound the error of $\sin(0.4) \approx P_3(0.4)$ using $R_4$.`, steps: [
          { prompt: String.raw`$R_4$ uses $f^{(5)}$. For $f = \sin$, $f^{(5)} = \cos$. Which $M$ works for all $t$?`, ask: { kind: 'numeric', answer: '1' }, hint: String.raw`$|\cos t| \le \dots$`, reveal: String.raw`$M = 1$.` },
          { prompt: String.raw`The bound $\frac{M\cdot 0.4^5}{5!}$:`, ask: { kind: 'numeric', answer: '0.4^5/120', tol: 1e-6 }, hint: String.raw`$0.4^5 = 0.01024$, $5! = 120$.`, reveal: String.raw`$\frac{0.01024}{120} \approx 8.53\cdot10^{-5}$.` },
          { prompt: String.raw`And $P_3(0.4)$ itself (6 decimals):`, ask: { kind: 'numeric', answer: '0.4 - 0.4^3/6', tol: 1e-6 }, hint: String.raw`$\frac{0.064}{6}$.`, reveal: String.raw`$0.4 - 0.010667 = 0.389333$. ($\sin 0.4 = 0.389418$.)` },
        ] },
        { type: 'quiz', question: String.raw`To bound $|R_3(x)|$ for $f(x) = e^{x}$, $a = 0$, $x = -0.4$, a valid $M$ is`, choices: [String.raw`$e^{-0.4}$`, String.raw`$1$`, String.raw`$e^{0.4}$ but not $1$`, String.raw`$0$`], answer: 1, explain: String.raw`$|f^{(4)}(t)| = e^t$ for $t \in [-0.4, 0]$ is at most $e^0 = 1$. $e^{-0.4}$ is the minimum, not the maximum. ($e^{0.4}$ would also be valid, just cruder.)` },
      ],
    },
    {
      id: 'remainder-n',
      title: 'How many terms for a given accuracy?',
      blocks: [
        { type: 'text', html: String.raw`<p>Turn the Lagrange bound around: which degree $n$ makes $\frac{M|x-a|^{n+1}}{(n+1)!}$ smaller than a tolerance? Factorials grow so fast that a short table of $(n+1)!$ answers it.</p>` },
        { type: 'refresher', title: 'a table of factorials', html: String.raw`<p>$5! = 120,\ 6! = 720,\ 7! = 5040,\ 8! = 40320,\ 9! = 362880,\ 10! = 3628800$. Each is the previous one times the next integer.</p>` },
        { type: 'derive', title: String.raw`Example: smallest $n$ with guaranteed $|e - P_n(1)| < 10^{-4}$, using $M = 3$`, steps: [
          { kind: 'sub', label: String.raw`Put $a = 0$, $x = 1$`, from: String.raw`|R_n(x)|\le\frac{M\,|x-a|^{n+1}}{(n+1)!}`, to: String.raw`|R_n(1)|\le\frac{M\cdot 1^{n+1}}{(n+1)!}`, why: String.raw`Lagrange bound for $e^x$ at $a = 0$, $x = 1$.` },
          { kind: 'sub', label: String.raw`$M = 3$`, from: String.raw`|R_n(1)|\le\frac{\T{M-1}{M}\cdot 1^{n+1}}{(n+1)!}`, to: String.raw`|R_n(1)|\le\frac{\T{M-1}{3}\cdot 1^{n+1}}{(n+1)!}`, why: String.raw`$|f^{(n+1)}(t)| = e^t \le e^1 < 3$ on $[0, 1]$ ($e^t$ is increasing, $e \approx 2.718$).` },
          { kind: 'start', label: 'Bound below the tolerance', from: String.raw`|R_n(1)|\le\frac{3\cdot 1^{n+1}}{(n+1)!}`, to: String.raw`\frac{3}{(n+1)!}<10^{-4}`, why: String.raw`$1^{n+1} = 1$; the bound must be below the tolerance.` },
          { kind: 'both', label: String.raw`Both sides $\times (n+1)!$`, from: String.raw`\frac{3}{\T{f-1}{(n+1)!}}<10^{-4}`, to: String.raw`3<10^{-4}\,\T{f-1}{(n+1)!}`, arrows: { 'f-1': '× (n+1)! on both sides' }, why: String.raw`$(n+1)!$ is positive, so multiplying both sides by it keeps the direction of $<$.` },
          { kind: 'both', label: String.raw`Both sides $\times 10^4$`, from: String.raw`3<\T{p-1}{10^{-4}}\,(n+1)!`, to: String.raw`3\cdot 10^{4}<(n+1)!`, why: String.raw`$10^{-4}\cdot 10^4 = 1$, so the $10^{-4}$ disappears on the right and $10^4$ appears on the left.` },
          { kind: 'calc', label: String.raw`$3\cdot 10^4 = 30000$`, to: String.raw`(n+1)!>30000`, why: 'Read the inequality from right to left.' },
          { kind: 'calc', label: 'Factorial table', from: String.raw`(n+1)!>30000`, to: String.raw`7!=5040<30000,\qquad 8!=40320>30000`, why: String.raw`$7!$ is too small; $8!$ is the first factorial above $30000$.` },
          { kind: 'result', label: String.raw`$n = 8 - 1$`, from: String.raw`n+1=\T{k-1}{8}`, to: String.raw`n=\T{k-1}{8}-1=7`, arrows: { 'k-1': '' }, why: String.raw`So $P_7(1)$ is guaranteed to be within $10^{-4}$ of $e$.` },
        ] },
        { type: 'guided', title: String.raw`Smallest $n$ with guaranteed $|e - P_n(1)| < 10^{-5}$`, problem: String.raw`Using $M = 3$ again, find the smallest $n$ for which the Lagrange bound guarantees $|e - P_n(1)| < 10^{-5}$.`, steps: [
          { prompt: String.raw`The condition $\frac{3}{(n+1)!} < 10^{-5}$ means $(n+1)! > c$. What is $c$?`, ask: { kind: 'numeric', answer: '300000' }, hint: String.raw`Multiply both sides by $(n+1)!$ and by $10^5$.`, reveal: String.raw`$(n+1)! > 3\cdot10^5 = 300000$.` },
          { prompt: String.raw`What is the smallest $k$ with $k! > 300000$?`, ask: { kind: 'numeric', answer: '9' }, hint: String.raw`$8! = 40320$, $9! = 362880$.`, reveal: String.raw`$k = 9$.` },
          { prompt: String.raw`So $n = \;?$`, ask: { kind: 'numeric', answer: '8' }, hint: String.raw`$k = n + 1$.`, reveal: String.raw`$n = 8$.` },
        ] },
      ],
    },
    {
      id: 'remainder-shifted',
      title: 'Remainders at a ≠ 0: √4.2 and ∛8.3',
      blocks: [
        { type: 'text', html: String.raw`<p>Away from $a = 0$ nothing changes in the method, but the interval for $\xi$ is now $[a, x]$ (or $[x, a]$), and the bound $M$ must be found on <b>that</b> interval — not on a symmetric interval around $a$. If the derivative is monotone, look at the two endpoints only.</p>` },
        { type: 'derive', title: String.raw`Example: approximate $\sqrt{4.2}$ with $P_2$ at $a = 4$ and bound the error`, steps: [
          { kind: 'start', label: 'Drop the cubic term of $P_3$', from: String.raw`P_3(x)=2+\frac{x-4}{4}-\frac{(x-4)^2}{64}+\T{d-1}{\frac{(x-4)^3}{512}}`, to: String.raw`P_2(x)=2+\frac{x-4}{4}-\frac{(x-4)^2}{64}`, why: 'From the first lesson: $P_2$ is the first three terms of $P_3$.' },
          { kind: 'sub', label: String.raw`Put $x - 4 = 0.2$`, from: String.raw`P_2(x)=2+\frac{\T{h-1}{x-4}}{4}-\frac{(\T{h-2}{x-4})^2}{64}`, to: String.raw`P_2(4.2)=2+\frac{\T{h-1}{0.2}}{4}-\frac{\T{h-2}{0.2}^2}{64}`, why: String.raw`$x - 4 = 4.2 - 4 = 0.2$.` },
          { kind: 'calc', label: String.raw`$\frac{0.2}{4}$ and $0.2^2$`, to: String.raw`P_2(4.2)=2+0.05-\frac{0.04}{64}`, why: String.raw`$\frac{0.2}{4} = 0.05$ and $0.2^2 = 0.04$.` },
          { kind: 'calc', label: 'Add', to: String.raw`P_2(4.2)=2+0.05-0.000625=2.049375`, why: String.raw`$\frac{0.04}{64} = 0.000625$.` },
          { kind: 'sub', label: String.raw`Lagrange with $n = 2$`, from: String.raw`R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}`, to: String.raw`R_2(4.2)=\frac{f'''(\xi)}{3!}(0.2)^3,\qquad\xi\in(4,\ 4.2)`, why: String.raw`Lagrange with $n = 2$: the 3rd derivative, between $a = 4$ and $x = 4.2$.` },
          { kind: 'result', label: String.raw`$f'''$ is decreasing`, from: String.raw`f'''(t)=\frac38\,t^{-5/2}=\frac{3}{8\,t^{5/2}}`, to: String.raw`f'''\ \text{is decreasing for}\ t>0`, why: 'A negative power of $t$ gets smaller as $t$ grows.' },
          { kind: 'calc', label: 'Largest at the left end', from: String.raw`M=f'''(4)=\frac38\cdot 4^{-5/2}`, to: String.raw`M=\frac38\cdot\frac{1}{32}=\frac{3}{256}`, why: String.raw`A decreasing function is largest at the left end of $[4, 4.2]$; $4^{-5/2} = \frac{1}{32}$.` },
          { kind: 'sub', label: 'Plug into the Lagrange bound', from: String.raw`|R_2(4.2)|\le\frac{\T{M-1}{M}\cdot 0.2^3}{3!}`, to: String.raw`|R_2(4.2)|\le\T{M-1}{\frac{3}{256}}\cdot\frac{0.008}{6}\approx 1.56\cdot10^{-5}`, why: String.raw`$0.2^3 = 0.008$ and $3! = 6$.` },
          { kind: 'result', label: 'Sign of the remainder', from: String.raw`f'''(\xi)>0,\qquad(0.2)^3>0`, to: String.raw`R_2(4.2)>0`, why: 'The sign of the remainder is the sign of the product.' },
          { kind: 'check', label: 'The interval', from: String.raw`P_2(4.2)<\sqrt{4.2}\le P_2(4.2)+1.56\cdot10^{-5}`, to: String.raw`2.049375<\sqrt{4.2}<2.049391,\qquad\sqrt{4.2}=2.0493901\ldots\ \checkmark`, why: String.raw`$P_2$ underestimates by at most $1.56\cdot10^{-5}$.` },
        ] },
        { type: 'guided', title: String.raw`Approximate $\sqrt[3]{8.3}$ with $P_2$ at $a = 8$`, problem: String.raw`For $f(x) = x^{1/3}$: $f' = \frac13 x^{-2/3}$, $f'' = -\frac29 x^{-5/3}$, $f''' = \frac{10}{27}x^{-8/3}$. Approximate $\sqrt[3]{8.3}$ with $P_2$ at $a = 8$ and bound the error. ($8^{1/3} = 2$, so $8^{-2/3} = \frac14$, $8^{-5/3} = \frac{1}{32}$, $8^{-8/3} = \frac{1}{256}$.)`, steps: [
          { prompt: String.raw`$f'(8) = \frac13\cdot\frac14$. What is the coefficient $c_1$?`, ask: { kind: 'numeric', answer: '1/12' }, hint: String.raw`$c_1 = \frac{f'(8)}{1!}$.`, reveal: String.raw`$c_1 = \frac{1}{12}$.` },
          { prompt: String.raw`$f''(8) = -\frac29\cdot\frac{1}{32} = -\frac{1}{144}$. What is $c_2 = \frac{f''(8)}{2!}$?`, ask: { kind: 'numeric', answer: '-1/288' }, hint: 'Divide by 2.', reveal: String.raw`$c_2 = -\frac{1}{288}$, so $P_2(x) = 2 + \frac{x-8}{12} - \frac{(x-8)^2}{288}$.` },
          { prompt: String.raw`$P_2(8.3) = \;?$ (7 decimals)`, ask: { kind: 'numeric', answer: '2 + 0.3/12 - 0.09/288', tol: 1e-7 }, hint: String.raw`$x - 8 = 0.3$: $\frac{0.3}{12} = 0.025$, $\frac{0.09}{288} = 0.0003125$.`, reveal: String.raw`$P_2(8.3) = 2.0246875$.` },
          { prompt: String.raw`$f'''(t) = \frac{10}{27}t^{-8/3}$ is decreasing, so on $[8, 8.3]$ the bound is $M = f'''(8)$. Compute $M$.`, ask: { kind: 'numeric', answer: '10/(27*256)', tol: 1e-6 }, hint: String.raw`$\frac{10}{27}\cdot\frac{1}{256}$.`, reveal: String.raw`$M = \frac{10}{6912} = \frac{5}{3456} \approx 0.001447$.` },
          { prompt: String.raw`The Lagrange bound $\frac{M\cdot 0.3^3}{3!}$:`, ask: { kind: 'numeric', answer: '5/3456*0.027/6', tol: 1e-4 }, hint: String.raw`$0.3^3 = 0.027$, $3! = 6$.`, reveal: String.raw`$|R_2(8.3)| \le 6.5\cdot10^{-6}$. ($\sqrt[3]{8.3} = 2.0246939$; the true error $6.4\cdot10^{-6}$ is just below the bound.)` },
        ] },
        { type: 'callout', kind: 'key', title: 'Finding M', html: String.raw`<ul><li>Write down $f^{(n+1)}(t)$ explicitly and find its largest absolute value on the closed interval between $a$ and $x$ — monotonicity is often enough; otherwise check critical points (or <code>fminbnd</code>/a grid in MATLAB as support).</li><li>Any valid upper bound works ($|\sin| \le 1$, $e^{0.5} < 2$), but a cruder $M$ gives a weaker estimate.</li><li>The interval is between $a$ and $x$ — not a symmetric interval around $a$.</li></ul>` },
      ],
    },
    {
      id: 'taylor-trig',
      title: 'Taylor polynomials of tan and sec at a ≠ 0',
      blocks: [
        { type: 'text', html: String.raw`<p>For $\tan x$ and $\sec x$ the derivatives quickly become long, so organise the work: compute each derivative from the previous one, simplify with $\sec^2 x = 1 + \tan^2 x$ when useful, and only then substitute exact values at $a$.</p>` },
        { type: 'refresher', title: 'derivatives of tan and sec, and exact values', html: String.raw`<ul><li>$\sec x = \dfrac{1}{\cos x}$. $\quad(\tan x)' = \sec^2 x$, $\quad(\sec x)' = \sec x\tan x$.</li><li>Chain rule: $(\sec^2 x)' = 2\sec x\cdot(\sec x\tan x) = 2\sec^2 x\tan x$.</li><li>Product rule: $(uv)' = u'v + uv'$.</li><li>Exact values: at $\frac\pi4$: $\cos = \frac{\sqrt2}{2}$, $\sec = \sqrt 2$, $\tan = 1$. At $\frac\pi3$: $\cos = \frac12$, $\sec = 2$, $\tan = \sqrt3$. At $\frac\pi6$: $\sec = \frac{2}{\sqrt3}$, $\tan = \frac{1}{\sqrt3}$.</li><li>On $\left(0, \frac\pi2\right)$, $\sec t$ and $\tan t$ are positive and increasing, so any sum or product of positive increasing factors is increasing there too.</li></ul>` },
        { type: 'derive', title: String.raw`Example: $f(x) = \tan x$ at $a = \frac\pi4$: $P_3$, then $P_2\!\left(\frac\pi4 - 0.1\right)$ with an error bound`, steps: [
          { kind: 'calculus', label: 'Derivative of tan', from: String.raw`f(x)=\tan x`, to: String.raw`f'(x)=\sec^2 x`, why: 'Derivative of tan (refresher).' },
          { kind: 'calculus', label: 'Chain rule', from: String.raw`f'(x)=(\sec x)^2`, to: String.raw`f''(x)=2\sec x\cdot\sec x\tan x=2\sec^2 x\tan x`, why: String.raw`Chain rule on $\sec^2 x = (\sec x)^2$: outer square gives $2\sec x$, inner derivative $\sec x\tan x$.` },
          { kind: 'calculus', label: 'Product rule', from: String.raw`f''(x)=\T{u-1}{2\sec^2 x}\cdot\T{v-1}{\tan x}`, to: String.raw`f'''(x)=\T{u-1}{(2\sec^2 x)'}\,\T{v-1}{\tan x}+2\sec^2 x\,(\tan x)'`, why: String.raw`Product rule $(uv)' = u'v + uv'$ with $u = 2\sec^2 x$ and $v = \tan x$.` },
          { kind: 'sub', label: String.raw`Put in $u'$ and $v'$`, to: String.raw`f'''(x)=4\sec^2 x\tan x\cdot\tan x+2\sec^2 x\cdot\sec^2 x`, why: String.raw`$u' = 4\sec^2 x\tan x$ (twice the previous line) and $v' = \sec^2 x$.` },
          { kind: 'calc', label: 'Collect powers', to: String.raw`f'''(x)=4\sec^2 x\tan^2 x+2\sec^4 x`, why: String.raw`$\tan x\cdot\tan x = \tan^2 x$ and $\sec^2 x\cdot\sec^2 x = \sec^4 x$.` },
          { kind: 'calc', label: String.raw`Values at $\frac\pi4$`, from: String.raw`\sec\tfrac\pi4=\sqrt2,\qquad\tan\tfrac\pi4=1`, to: String.raw`\sec^2\tfrac\pi4=2,\qquad\sec^4\tfrac\pi4=4,\qquad\tan\tfrac\pi4=1`, why: String.raw`$\sec\frac\pi4 = \sqrt2$, so $\sec^2\frac\pi4 = 2$ and $\sec^4\frac\pi4 = 4$.` },
          { kind: 'sub', label: String.raw`Evaluate $f, f', f''$ at $a$`, from: String.raw`f=\tan x,\quad f'=\sec^2 x,\quad f''=2\sec^2 x\tan x`, to: String.raw`f(a)=1,\quad f'(a)=2,\quad f''(a)=2\cdot2\cdot1=4`, why: String.raw`Substitute $\sec^2 = 2$ and $\tan = 1$ into each line.` },
          { kind: 'sub', label: String.raw`Evaluate $f'''$ at $a$`, from: String.raw`f'''=4\sec^2 x\tan^2 x+2\sec^4 x`, to: String.raw`f'''(a)=4\cdot2\cdot1+2\cdot4=16`, why: String.raw`Substitute $\sec^2 = 2$, $\sec^4 = 4$, $\tan = 1$.` },
          { kind: 'calc', label: String.raw`Divide by $k!$`, from: String.raw`c_k=\frac{f^{(k)}(a)}{k!}`, to: String.raw`c_0=1,\quad c_1=2,\quad c_2=\tfrac42=2,\quad c_3=\tfrac{16}{6}=\tfrac83`, why: String.raw`Divide by $0!, 1!, 2!, 3!$ $= 1, 1, 2, 6$.` },
          { kind: 'result', label: 'Assemble', to: String.raw`P_3(x)=1+2\left(x-\tfrac\pi4\right)+2\left(x-\tfrac\pi4\right)^2+\tfrac83\left(x-\tfrac\pi4\right)^3`, why: 'Assemble; $P_2$ is the same without the last term.' },
          { kind: 'sub', label: String.raw`Put $x - a = -0.1$ into $P_2$`, from: String.raw`P_2(x)=1+2\,\T{h-1}{\left(x-\tfrac\pi4\right)}+2\,\T{h-2}{\left(x-\tfrac\pi4\right)}^2`, to: String.raw`P_2\!\left(\tfrac\pi4-0.1\right)=1+2\,\T{h-1}{(-0.1)}+2\,\T{h-2}{(-0.1)}^2`, why: String.raw`$x - a = \left(\frac\pi4 - 0.1\right) - \frac\pi4 = -0.1$.` },
          { kind: 'calc', label: 'Add', to: String.raw`P_2\!\left(\tfrac\pi4-0.1\right)=1-0.2+0.02=0.82`, why: String.raw`$(-0.1)^2 = 0.01$.` },
          { kind: 'sub', label: String.raw`Lagrange with $n = 2$`, from: String.raw`R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}`, to: String.raw`R_2=\frac{f'''(\xi)}{3!}(-0.1)^3,\qquad\xi\in\left(\tfrac\pi4-0.1,\ \tfrac\pi4\right)`, why: 'Lagrange with $n = 2$: the third derivative, on the interval between $x$ and $a$.' },
          { kind: 'result', label: 'Choose $M$', from: String.raw`f'''=4\sec^2\tan^2+2\sec^4\ \text{is increasing on}\ \left(0,\tfrac\pi2\right)`, to: String.raw`M=f'''\!\left(\tfrac\pi4\right)=16`, why: String.raw`Sums and products of positive increasing factors increase (refresher). The interval lies left of $\frac\pi4$, so the maximum is at the right end $\frac\pi4$.` },
          { kind: 'sub', label: 'Plug into the Lagrange bound', from: String.raw`|R_2|\le\frac{\T{M-1}{M}\cdot 0.1^3}{3!}`, to: String.raw`|R_2|\le\frac{\T{M-1}{16}\cdot 0.001}{6}=\frac{0.016}{6}\approx 0.00267`, why: String.raw`$0.1^3 = 0.001$ and $3! = 6$.` },
          { kind: 'result', label: 'Sign of the remainder', from: String.raw`f'''(\xi)>0,\qquad(-0.1)^3<0`, to: String.raw`R_2<0:\qquad 0.8173\le\tan\left(\tfrac\pi4-0.1\right)<0.82`, why: String.raw`So $P_2$ overestimates. (True value $0.81763$.)` },
        ] },
        { type: 'guided', title: String.raw`$f(x) = \sec x$ at $a = \frac\pi4$`, problem: String.raw`Let $f(x) = \sec x$, $a = \frac\pi4$. Use $f' = \sec x\tan x$, $f'' = 2\sec^3 x - \sec x$ and $f''' = \sec x\tan x\,(6\sec^2 x - 1)$. Find $P_2$, the value $P_2\!\left(\frac\pi4 - 0.1\right)$ and the Lagrange bound.`, steps: [
          { prompt: String.raw`$f'\!\left(\frac\pi4\right) = \sec\frac\pi4\tan\frac\pi4 = \;?$`, ask: { kind: 'numeric', answer: 'sqrt(2)' }, hint: String.raw`$\sec\frac\pi4 = \sqrt2$, $\tan\frac\pi4 = 1$.`, reveal: String.raw`$f'(a) = \sqrt2$, and $f(a) = \sqrt2$.` },
          { prompt: String.raw`$f''\!\left(\frac\pi4\right) = 2(\sqrt2)^3 - \sqrt2 = \;?$`, ask: { kind: 'numeric', answer: '3*sqrt(2)' }, hint: String.raw`$(\sqrt2)^3 = 2\sqrt2$.`, reveal: String.raw`$4\sqrt2 - \sqrt2 = 3\sqrt2$, so $c_2 = \frac{3\sqrt2}{2}$.` },
          { prompt: String.raw`Type $P_2(x)$ in powers of <code>(x-pi/4)</code>.`, ask: { kind: 'expression', answer: 'sqrt(2) + sqrt(2)*(x-pi/4) + 3*sqrt(2)/2*(x-pi/4).^2', variable: 'x', domain: [0.6, 1], label: 'P2(x) =' }, hint: String.raw`Coefficients $\sqrt2$, $\sqrt2$, $\frac{3\sqrt2}{2}$.`, reveal: String.raw`$P_2(x) = \sqrt2 + \sqrt2\left(x - \frac\pi4\right) + \frac{3\sqrt2}{2}\left(x - \frac\pi4\right)^2$.` },
          { prompt: String.raw`$P_2\!\left(\frac\pi4 - 0.1\right) = \;?$`, ask: { kind: 'numeric', answer: '0.915*sqrt(2)', tol: 1e-6 }, hint: String.raw`$\sqrt2\left(1 - 0.1 + 1.5\cdot 0.01\right)$.`, reveal: String.raw`$0.915\sqrt2 \approx 1.294005$.` },
          { prompt: String.raw`$f'''$ is increasing on $\left(0, \frac\pi2\right)$, so $M = f'''\!\left(\frac\pi4\right) = \sqrt2\cdot 1\cdot(6\cdot 2 - 1) = 11\sqrt2$. Compute the bound $\frac{M\cdot 0.1^3}{3!}$.`, ask: { kind: 'numeric', answer: '11*sqrt(2)*0.001/6', tol: 1e-4 }, hint: String.raw`$\frac{11\sqrt2\cdot 0.001}{6}$.`, reveal: String.raw`$|R_2| \le 0.00259$. (True: $\sec\left(\frac\pi4 - 0.1\right) - P_2 \approx -0.00229$, negative and within the bound.)` },
        ] },
      ],
    },
    {
      id: 'maclaurin',
      title: 'The standard Maclaurin series and new series from old',
      blocks: [
        { type: 'text', html: String.raw`<p>The sine series contains only odd powers. Each new term corrects the previous polynomial by a little, and since the radius of convergence is infinite, the polynomials eventually follow the sine for any distance you like.</p>` },
        { type: 'widget', name: 'taylor', config: {
          title: 'sin x = x − x³/3! + x⁵/5! − ⋯',
          f: 'sin(x)', coef: 'sin(k*pi/2)./gamma(k + 1)', a: 0, nmax: 25, n: 3,
          xlim: [-10, 10], ylim: [-3, 3],
        } },
        { type: 'table', head: ['Function', 'Maclaurin series', 'Converges for'], rows: [
          [String.raw`$e^x$`, String.raw`$\sum_{n=0}^{\infty} \dfrac{x^n}{n!} = 1 + x + \dfrac{x^2}{2!} + \cdots$`, String.raw`all $x$`],
          [String.raw`$\sin x$`, String.raw`$\sum_{n=0}^{\infty} \dfrac{(-1)^n x^{2n+1}}{(2n+1)!} = x - \dfrac{x^3}{3!} + \cdots$`, String.raw`all $x$`],
          [String.raw`$\cos x$`, String.raw`$\sum_{n=0}^{\infty} \dfrac{(-1)^n x^{2n}}{(2n)!} = 1 - \dfrac{x^2}{2!} + \cdots$`, String.raw`all $x$`],
          [String.raw`$\ln(1+x)$`, String.raw`$\sum_{n=1}^{\infty} \dfrac{(-1)^{n+1} x^n}{n} = x - \dfrac{x^2}{2} + \cdots$`, String.raw`$-1 < x \le 1$`],
          [String.raw`$\arctan x$`, String.raw`$\sum_{n=0}^{\infty} \dfrac{(-1)^n x^{2n+1}}{2n+1} = x - \dfrac{x^3}{3} + \cdots$`, String.raw`$-1 \le x \le 1$`],
          [String.raw`$(1+x)^k$`, String.raw`$\sum_{n=0}^{\infty} \binom{k}{n} x^n$, $\;\binom{k}{n} = \dfrac{k(k-1)\cdots(k-n+1)}{n!}$`, String.raw`$|x| < 1$`],
        ] },
        { type: 'callout', kind: 'key', title: 'Build new series from old ones', html: String.raw`<p>Substitute ($e^{-x^2}$: replace $x$ by $-x^2$), multiply by powers of $x$, add, differentiate or integrate — never differentiate $e^{-x^2}$ ten times by hand. The Taylor series is unique, so any correct manipulation gives <i>the</i> Taylor series, and the coefficient $c_n$ of $x^n$ satisfies $c_n = \frac{f^{(n)}(0)}{n!}$, i.e. $f^{(n)}(0) = n!\,c_n$.</p>` },
        { type: 'refresher', title: 'substituting into a series', html: String.raw`<ul><li>Replace every $x$ by the new expression, in brackets: $\cos(2x) = \sum \frac{(-1)^n (2x)^{2n}}{(2n)!}$.</li><li>Then use power rules: $(2x)^{2n} = 2^{2n}x^{2n} = 4^n x^{2n}$; $(-3x^2)^n = (-3)^n x^{2n}$.</li><li>Multiplying by $x^m$ adds $m$ to every exponent: $x\cdot x^{2n} = x^{2n+1}$.</li><li>To find the coefficient of $x^p$: solve "exponent $= p$" for $n$, then put that $n$ into the coefficient.</li></ul>` },
        { type: 'derive', title: String.raw`Example: Maclaurin series of $x\cos(2x)$, its coefficient of $x^7$, and $f^{(7)}(0)$`, steps: [
          { kind: 'sub', label: String.raw`Substitute $u = 2x$`, from: String.raw`\cos u=\sum_{n=0}^\infty\frac{(-1)^n u^{2n}}{(2n)!}\qquad\qquad u=\T{u-1}{2x}`, to: String.raw`\cos \T{u-1}{2x}=\sum_{n=0}^\infty\frac{(-1)^n\,\T{u-2}{(2x)}^{2n}}{(2n)!}`, map: { 'u-1': ['u-1', 'u-2'] }, arrows: { 'u-1': 'u = 2x' }, why: String.raw`The cosine series from the table, with the letter $u$; replace every $u$ by $2x$, in brackets. Valid for all $x$.` },
          { kind: 'expand', label: String.raw`$(2x)^{2n} = 4^n x^{2n}$`, from: String.raw`\cos 2x=\sum_{n=0}^\infty\frac{(-1)^n\,\T{p-1}{(2x)^{2n}}}{(2n)!}`, to: String.raw`\cos 2x=\sum_{n=0}^\infty\frac{(-1)^n\,\T{p-1}{4^n x^{2n}}}{(2n)!}`, why: String.raw`$(2x)^{2n} = 2^{2n}x^{2n}$ and $2^{2n} = (2^2)^n = 4^n$.` },
          { kind: 'expand', label: String.raw`Multiply by $x$`, from: String.raw`x\cos 2x=\T{x-1}{x}\cdot\sum_{n=0}^\infty\frac{(-1)^n 4^n x^{2n}}{(2n)!}`, to: String.raw`x\cos 2x=\sum_{n=0}^\infty\frac{(-1)^n 4^n x^{2n+\T{x-1}{1}}}{(2n)!}`, arrows: { 'x-1': 'into every term' }, why: String.raw`Multiplying each term by $x$ adds $1$ to every exponent.` },
          { kind: 'calc', label: 'First terms', to: String.raw`x\cos 2x=x-2x^3+\frac{2}{3}x^5-\cdots`, why: String.raw`Check $n = 1$: $\frac{-4}{2} = -2$; $n = 2$: $\frac{16}{24} = \frac23$.` },
          { kind: 'calc', label: String.raw`Which $n$ gives $x^7$?`, from: String.raw`2n+1=7`, to: String.raw`n=3`, why: String.raw`Set the exponent equal to $7$: subtract $1$ and divide by $2$.` },
          { kind: 'sub', label: String.raw`Put $n = 3$ into the coefficient`, from: String.raw`c_7=\frac{(-1)^{\T{n-1}{n}}\,4^{\T{n-2}{n}}}{(2\T{n-3}{n})!}`, to: String.raw`c_7=\frac{(-1)^{\T{n-1}{3}}\,4^{\T{n-2}{3}}}{(2\cdot\T{n-3}{3})!}=\frac{-64}{6!}`, why: String.raw`$(-1)^3 = -1$, $4^3 = 64$, $2\cdot 3 = 6$.` },
          { kind: 'calc', label: String.raw`$6! = 720$`, to: String.raw`c_7=\frac{-64}{720}=-\frac{4}{45}`, why: String.raw`$6! = 720$; divide top and bottom by $16$.` },
          { kind: 'both', label: String.raw`Both sides $\times 7!$`, from: String.raw`c_7=\frac{f^{(7)}(0)}{\T{f-1}{7!}}`, to: String.raw`\T{f-1}{7!}\cdot c_7=f^{(7)}(0)`, arrows: { 'f-1': '× 7! on both sides' }, why: String.raw`$c_7 = \frac{f^{(7)}(0)}{7!}$, solved for the derivative: multiplying both sides by $7!$ cancels it on the right.` },
          { kind: 'calc', label: String.raw`$7! = 5040$`, to: String.raw`f^{(7)}(0)=5040\cdot\left(-\frac4{45}\right)=-448`, why: String.raw`$5040 \div 45 = 112$ and $112\cdot 4 = 448$.` },
        ] },
        { type: 'guided', title: String.raw`The coefficient of $x^6$ in $x^2 e^{-3x^2}$`, problem: String.raw`Find the coefficient of $x^6$ in the Maclaurin series of $x^2 e^{-3x^2}$.`, steps: [
          { prompt: String.raw`Substitute $u = -3x^2$ into $e^u = \sum \frac{u^n}{n!}$ and multiply by $x^2$. The $n$-th term is $\frac{(-3)^n x^{p}}{n!}$. Type the exponent $p$ in terms of <code>n</code>.`, ask: { kind: 'expression', answer: '2*n+2', variable: 'n', domain: [0, 5], label: 'p =' }, hint: String.raw`$(x^2)^n = x^{2n}$, then multiply by $x^2$.`, reveal: String.raw`$p = 2n + 2$: $\;x^2e^{-3x^2} = \sum \frac{(-3)^n x^{2n+2}}{n!}$.` },
          { prompt: String.raw`Which $n$ gives $x^6$?`, ask: { kind: 'numeric', answer: '2' }, hint: String.raw`$2n + 2 = 6$.`, reveal: String.raw`$n = 2$.` },
          { prompt: 'The coefficient:', ask: { kind: 'numeric', answer: '9/2' }, hint: String.raw`$\frac{(-3)^2}{2!}$.`, reveal: String.raw`$\frac{9}{2}$.` },
        ] },
        { type: 'guided', title: String.raw`$f^{(9)}(0)$ for $f(x) = x^2\sin x$`, problem: String.raw`Find $f^{(9)}(0)$ for $f(x) = x^2 \sin x$ without differentiating nine times.`, steps: [
          { prompt: String.raw`$x^2\sin x = \sum_{n=0}^\infty \frac{(-1)^n x^{2n+3}}{(2n+1)!}$. Which $n$ gives $x^9$?`, ask: { kind: 'numeric', answer: '3' }, hint: String.raw`$2n + 3 = 9$.`, reveal: String.raw`$n = 3$.` },
          { prompt: String.raw`The coefficient $c_9$:`, ask: { kind: 'numeric', answer: '-1/5040', tol: 1e-6 }, hint: String.raw`$\frac{(-1)^3}{7!}$ and $7! = 5040$.`, reveal: String.raw`$c_9 = -\frac{1}{5040}$.` },
          { prompt: String.raw`$f^{(9)}(0) = 9!\cdot c_9 = \;?$`, ask: { kind: 'numeric', answer: '-72' }, hint: String.raw`$\frac{9!}{7!} = 9\cdot 8$.`, reveal: String.raw`$f^{(9)}(0) = -\frac{9!}{7!} = -72$.` },
        ] },
      ],
    },
    {
      id: 'binomial',
      title: 'The binomial series',
      blocks: [
        { type: 'text', html: String.raw`<p>$(1 + x)^k$ for a <b>non-integer</b> $k$ (a root, or a negative power) is not a polynomial, but it has a series whose coefficients are computed exactly like the binomial coefficients of school algebra.</p>` },
        { type: 'refresher', title: String.raw`binomial coefficients $\binom{k}{n}$ with fractions`, html: String.raw`<p>$\displaystyle\binom{k}{n} = \frac{k(k-1)(k-2)\cdots(k-n+1)}{n!}$: $n$ factors on top, each one less than the previous, divided by $n!$. Also $\binom{k}{0} = 1$ and $\binom{k}{1} = k$. With $k = \frac12$ the factors are $\frac12, -\frac12, -\frac32, \dots$.</p>` },
        { type: 'derive', title: String.raw`Example: the binomial series of $\sqrt{1+x}$ up to $x^3$`, steps: [
          { kind: 'start', label: 'Root as a power', from: String.raw`\sqrt{1+x}`, to: String.raw`(1+x)^{1/2},\qquad k=\tfrac12`, why: 'Write the root as a power.' },
          { kind: 'calc', label: String.raw`$\binom{k}{1} = k$`, from: String.raw`\binom{1/2}{1}=k`, to: String.raw`\binom{1/2}{1}=\frac12`, why: String.raw`$\binom{k}{1} = k$.` },
          { kind: 'sub', label: String.raw`Put $k = \frac12$ into $\binom{k}{2}$`, from: String.raw`\binom{k}{2}=\frac{\T{k-1}{k}\,(\T{k-2}{k}-1)}{2!}`, to: String.raw`\binom{1/2}{2}=\frac{\T{k-1}{\frac12}\cdot\left(\T{k-2}{\frac12}-1\right)}{2!}`, why: String.raw`Two factors on top: $k = \frac12$ and $k - 1$.` },
          { kind: 'calc', label: 'Multiply and divide', to: String.raw`\binom{1/2}{2}=\frac{\frac12\cdot\left(-\frac12\right)}{2}=\frac{-\frac14}{2}=-\frac18`, why: String.raw`$\frac12 - 1 = -\frac12$; divide by $2! = 2$.` },
          { kind: 'sub', label: String.raw`Put $k = \frac12$ into $\binom{k}{3}$`, from: String.raw`\binom{k}{3}=\frac{k\,(k-1)(k-2)}{3!}`, to: String.raw`\binom{1/2}{3}=\frac{\frac12\cdot\left(-\frac12\right)\cdot\left(-\frac32\right)}{3!}`, why: String.raw`Three factors: $\frac12$, $-\frac12$, $-\frac32$.` },
          { kind: 'calc', label: 'Multiply and divide', to: String.raw`\binom{1/2}{3}=\frac{\frac38}{6}=\frac{1}{16}`, why: String.raw`Their product is $+\frac38$ (two minus signs); divide by $3! = 6$.` },
          { kind: 'result', label: 'Assemble', from: String.raw`\sqrt{1+x}=\sum_{n=0}^\infty\binom{1/2}{n}x^n`, to: String.raw`\sqrt{1+x}=1+\frac{x}{2}-\frac{x^2}{8}+\frac{x^3}{16}-\cdots\qquad(|x|<1)`, why: String.raw`Assemble $\sum \binom{1/2}{n} x^n$ with $\binom{1/2}{0} = 1$.` },
        ] },
        { type: 'guided', title: String.raw`The binomial series of $\dfrac{1}{\sqrt{1+x}}$`, problem: String.raw`Find the coefficients of $x^2$ and $x^3$ in the series of $\frac{1}{\sqrt{1+x}} = (1+x)^{-1/2}$.`, steps: [
          { prompt: String.raw`What is $k$?`, ask: { kind: 'numeric', answer: '-1/2' }, hint: String.raw`$\frac{1}{\sqrt{y}} = y^{-1/2}$.`, reveal: String.raw`$k = -\frac12$; the factors are $-\frac12, -\frac32, -\frac52, \dots$` },
          { prompt: String.raw`$\binom{-1/2}{2} = \frac{(-\frac12)(-\frac32)}{2!} = \;?$`, ask: { kind: 'numeric', answer: '3/8' }, hint: String.raw`The product on top is $\frac34$.`, reveal: String.raw`$\frac{3/4}{2} = \frac38$.` },
          { prompt: String.raw`$\binom{-1/2}{3} = \frac{(-\frac12)(-\frac32)(-\frac52)}{3!} = \;?$`, ask: { kind: 'numeric', answer: '-5/16' }, hint: String.raw`The product on top is $-\frac{15}{8}$.`, reveal: String.raw`$\frac{-15/8}{6} = -\frac{15}{48} = -\frac{5}{16}$. So $\frac{1}{\sqrt{1+x}} = 1 - \frac x2 + \frac38 x^2 - \frac{5}{16}x^3 + \cdots$` },
        ] },
      ],
    },
    {
      id: 'series-limits',
      title: 'Limits with series',
      blocks: [
        { type: 'text', html: String.raw`<p>Limits of the form $\frac00$ at $x = 0$ are often quickest with series: replace each function by the first few terms of its Maclaurin series, cancel, divide by the power of $x$ in the denominator, and let $x \to 0$.</p>` },
        { type: 'derive', title: String.raw`Example: $\displaystyle\lim_{x\to0} \frac{e^{x} - 1 - x}{x^2}$`, steps: [
          { kind: 'sub', label: 'Replace $e^x$ by its series', from: String.raw`\frac{\T{e-1}{e^x}-1-x}{x^2}`, to: String.raw`\frac{e^x-1-x}{x^2}=\frac{\T{e-1}{\left(1+x+\frac{x^2}{2}+\frac{x^3}{6}+\cdots\right)}-1-x}{x^2}`, why: 'The exponential series.' },
          { kind: 'cancel', label: String.raw`$1 - 1 = 0$ and $x - x = 0$`, from: String.raw`\frac{e^x-1-x}{x^2}=\frac{\T{o-1}{1}+\T{y-1}{x}+\frac{x^2}{2}+\frac{x^3}{6}+\cdots-\T{o-2}{1}-\T{y-2}{x}}{x^2}`, to: String.raw`\frac{e^x-1-x}{x^2}=\frac{\frac{x^2}{2}+\frac{x^3}{6}+\cdots}{x^2}`, why: String.raw`The terms $1$ and $x$ cancel.` },
          { kind: 'calc', label: String.raw`Divide every term by $x^2$`, to: String.raw`\frac{e^x-1-x}{x^2}=\frac12+\frac{x}{6}+\cdots`, why: String.raw`$\frac{x^2/2}{x^2} = \frac12$ and $\frac{x^3/6}{x^2} = \frac{x}{6}$.` },
          { kind: 'calc', label: String.raw`Let $x\to 0$`, to: String.raw`\frac{e^x-1-x}{x^2}=\frac12+\frac{x}{6}+\cdots\ \to\ \frac12`, why: 'All terms with a power of $x$ tend to 0.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{x\to0} \frac{x - \arctan x}{x^3}$`, problem: String.raw`Use $\arctan x = x - \frac{x^3}{3} + \frac{x^5}{5} - \cdots$ to find $\lim_{x\to0} \frac{x - \arctan x}{x^3}$.`, steps: [
          { prompt: String.raw`Write $\arctan x$ by its series. What happens to the term $x$ in $x - \arctan x$?`, show: String.raw`$x - \left(x - \frac{x^3}{3} + \frac{x^5}{5} - \cdots\right)$: the two $x$ terms cancel, and every remaining sign flips.`, why: 'Cancelling the lowest power is what removes the 0/0 problem.' },
          { prompt: String.raw`$x - \arctan x = c\,x^3 - \frac{x^5}{5} + \cdots$. What is $c$?`, ask: { kind: 'numeric', answer: '1/3' }, hint: String.raw`$x - \left(x - \frac{x^3}{3} + \dots\right)$: the $x$ cancels and the sign of the next term flips.`, reveal: String.raw`$x - \arctan x = \frac{x^3}{3} - \frac{x^5}{5} + \cdots$` },
          { prompt: String.raw`Divide by $x^3$ and let $x \to 0$. The limit is`, ask: { kind: 'numeric', answer: '1/3' }, hint: String.raw`$\frac13 - \frac{x^2}{5} + \cdots$`, reveal: String.raw`$\frac13$.` },
        ] },
        { type: 'quiz', question: String.raw`Using series, $\displaystyle\lim_{x\to0} \frac{1 - \cos x}{x^2} = $`, choices: [String.raw`$0$`, String.raw`$\tfrac12$`, String.raw`$1$`, String.raw`$\infty$`], answer: 1, explain: String.raw`$1 - \cos x = \frac{x^2}{2} - \frac{x^4}{24} + \cdots$, so the quotient is $\frac12 - \frac{x^2}{24} + \cdots \to \frac12$.` },
      ],
    },
    {
      id: 'alternating-taylor',
      title: 'The alternating-series bound for Taylor approximations',
      blocks: [
        { type: 'callout', kind: 'thm', title: 'The alternating-series alternative', html: String.raw`<p>If, at the given $x$, the Taylor series is alternating with terms that decrease in size to $0$ (for example $\sin x$, $\cos x$, $\arctan x$, $\ln(1+x)$ at $0 < x \le 1$, $e^{-x}$ at $x > 0$, $\mathrm{erf}$), then $|R_n| \le$ the size of the first omitted term, and the remainder has the sign of that term. Check the decreasing condition before you use it.</p>` },
        { type: 'refresher', title: 'the sign of the remainder', html: String.raw`<p>If the first omitted term is <b>positive</b>, the true value is <b>larger</b> than the approximation (the approximation is too small). If it is negative, the approximation is too large.</p>` },
        { type: 'derive', title: String.raw`Example: $\sin(0.5) \approx 0.5 - \frac{0.5^3}{6}$ — error and sign`, steps: [
          { kind: 'sub', label: String.raw`Put $x = 0.5$ into the sine series`, from: String.raw`\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots`, to: String.raw`\sin 0.5=0.5-\frac{0.5^3}{3!}+\frac{0.5^5}{5!}-\cdots`, why: 'The sine series at $x = 0.5$.' },
          { kind: 'result', label: 'Check the conditions', from: String.raw`b_n=\frac{0.5^{2n+1}}{(2n+1)!}`, to: String.raw`b_n>0,\quad\text{decreasing},\quad b_n\to 0`, why: String.raw`The numerator shrinks and the denominator grows with $n$; so the alternating series test applies.` },
          { kind: 'calc', label: 'First omitted term', from: String.raw`\text{first omitted term}=+\frac{0.5^5}{5!}`, to: String.raw`+\frac{0.03125}{120}\approx 2.60\cdot10^{-4}`, why: 'We used the terms $n = 0, 1$; the next one has a plus sign.' },
          { kind: 'result', label: 'Bound and sign', to: String.raw`|\text{error}|\le 2.60\cdot10^{-4},\quad\text{and the approximation is too small}`, why: String.raw`Alternating series bound; the omitted term is positive, so $\sin 0.5 > 0.479167$.` },
          { kind: 'calc', label: 'The interval', from: String.raw`0.5-\frac{0.125}{6}=0.479167`, to: String.raw`0.479167<\sin 0.5<0.479167+0.000260=0.479427`, why: String.raw`Add the bound to the approximation. (True: $0.479426$.)` },
        ] },
        { type: 'guided', title: String.raw`$\ln(1.2) \approx 0.2 - \frac{0.2^2}{2}$`, problem: String.raw`$\ln(1.2) = \ln(1 + 0.2) \approx 0.2 - \frac{0.2^2}{2} = 0.18$. Bound the error and decide whether the approximation is too small or too large.`, steps: [
          { prompt: String.raw`<b>Conditions.</b> Is the alternating series bound allowed at $x = 0.2$?`, show: String.raw`$b_n = \frac{0.2^n}{n} > 0$; it decreases because $0.2^n$ shrinks while $n$ grows; and $b_n \to 0$. Yes.`, why: 'Always check the conditions before using the bound.' },
          { prompt: String.raw`The series is $0.2 - \frac{0.2^2}{2} + \frac{0.2^3}{3} - \cdots$ with $b_n = \frac{0.2^n}{n}$ decreasing to $0$. What is the size of the first omitted term?`, ask: { kind: 'numeric', answer: '0.2^3/3', tol: 1e-6 }, hint: String.raw`It is the $n = 3$ term.`, reveal: String.raw`$\frac{0.008}{3} \approx 0.002667$.` },
          { prompt: 'The approximation $0.18$ is', ask: { kind: 'choice', choices: ['too small', 'too large'], answer: 0 }, hint: String.raw`The first omitted term $+\frac{0.2^3}{3}$ is positive.`, reveal: String.raw`Too small: $0.18 < \ln 1.2 < 0.182667$. (True: $0.182322$.)` },
        ] },
      ],
    },
    {
      id: 'erf-integrals',
      title: 'Series for integrals: the error function',
      blocks: [
        { type: 'text', html: String.raw`<p>$e^{-t^2}$ has no elementary antiderivative, but its series can be integrated term by term. The result defines the <b>error function</b>, used for the normal distribution and heat conduction:</p>$$\mathrm{erf}(x) = \frac{2}{\sqrt\pi}\int_0^x e^{-t^2}\,\mathrm d t = \frac{2}{\sqrt\pi}\sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{n!\,(2n+1)} .$$` },
        { type: 'widget', name: 'taylor', config: {
          title: 'Partial sums of the erf series',
          f: 'erf(x)', coef: 'mod(k,2).*2/sqrt(pi).*cos((k-1)*pi/2)./(gamma((k+1)/2).*(k + (k==0)))', a: 0, nmax: 25, n: 5, at: 1,
          xlim: [-3.5, 3.5], ylim: [-1.6, 1.6],
        } },
        { type: 'derive', title: String.raw`Example: $\mathrm{erf}(0.5)$ from three terms, with an error bound`, steps: [
          { kind: 'sub', label: String.raw`Substitute $u = -t^2$`, from: String.raw`e^{u}=\sum_{n=0}^\infty\frac{u^n}{n!}\qquad\qquad u=\T{u-1}{-t^2}`, to: String.raw`e^{-t^2}=\sum_{n=0}^\infty\frac{\T{u-1}{(-t^2)}^n}{n!}`, arrows: { 'u-1': 'u = −t²' }, why: String.raw`Substitute $-t^2$ into the exponential series. Valid for all $t$ (radius $\infty$).` },
          { kind: 'expand', label: String.raw`$(-t^2)^n = (-1)^n t^{2n}$`, from: String.raw`e^{-t^2}=\sum_{n=0}^\infty\frac{(-t^2)^n}{n!}`, to: String.raw`e^{-t^2}=\sum_{n=0}^\infty\frac{(-1)^n t^{2n}}{n!}`, why: String.raw`A power of a product is the product of the powers, and $(t^2)^n = t^{2n}$.` },
          { kind: 'calculus', label: 'Integrate term by term', from: String.raw`\int_0^x e^{-t^2}\,\mathrm d t=\sum_{n=0}^\infty\frac{(-1)^n}{n!}\T{i-1}{\int_0^x t^{2n}\,\mathrm d t}`, to: String.raw`\int_0^x e^{-t^2}\,\mathrm d t=\sum_{n=0}^\infty\frac{(-1)^n}{n!}\cdot\T{i-1}{\frac{x^{2n+1}}{2n+1}}`, why: String.raw`$\int_0^x t^{2n}\,\mathrm d t = \frac{x^{2n+1}}{2n+1}$. Integration keeps $R = \infty$.` },
          { kind: 'sub', label: String.raw`Multiply by $\frac{2}{\sqrt\pi}$`, from: String.raw`\mathrm{erf}(x)=\frac{2}{\sqrt\pi}\int_0^x e^{-t^2}\,\mathrm d t`, to: String.raw`\mathrm{erf}(x)=\frac{2}{\sqrt\pi}\sum_{n=0}^\infty\frac{(-1)^n x^{2n+1}}{n!\,(2n+1)}`, why: String.raw`Put the series of the integral into the definition of $\mathrm{erf}$.` },
          { kind: 'sub', label: String.raw`Three terms at $x = 0.5$`, to: String.raw`\mathrm{erf}(0.5)\approx\frac{2}{\sqrt\pi}\left(0.5-\frac{0.5^3}{3}+\frac{0.5^5}{10}\right)`, why: String.raw`Terms $n = 0, 1, 2$: denominators $0!\cdot1 = 1$, $1!\cdot 3 = 3$, $2!\cdot5 = 10$.` },
          { kind: 'calc', label: 'Evaluate', to: String.raw`\mathrm{erf}(0.5)\approx\frac{2}{\sqrt\pi}\cdot 0.461458\approx 0.520700`, why: String.raw`$0.5 - 0.041667 + 0.003125 = 0.461458$, and $\frac{2}{\sqrt\pi} \approx 1.128379$.` },
          { kind: 'result', label: 'Check the conditions', from: String.raw`b_n=\frac{2}{\sqrt\pi}\,\frac{0.5^{2n+1}}{n!\,(2n+1)}`, to: String.raw`\frac{b_{n+1}}{b_n}=\frac{0.25\,(2n+1)}{(n+1)(2n+3)}<1,\qquad b_n\to 0`, why: String.raw`$b_n$ is positive and decreasing, and the numerator power shrinks to 0. So the alternating series test applies.` },
          { kind: 'calc', label: String.raw`First omitted term ($n = 3$)`, from: String.raw`(-1)^3\,\frac{2}{\sqrt\pi}\cdot\frac{0.5^7}{3!\cdot 7}`, to: String.raw`\approx -2.1\cdot 10^{-4}`, why: String.raw`$(-1)^3 = -1$: negative, so the approximation is too large by at most $2.1\cdot10^{-4}$.` },
          { kind: 'result', label: 'The interval', to: String.raw`0.520490<\mathrm{erf}(0.5)<0.520700`, why: String.raw`Subtract the bound. (MATLAB: <code>erf(0.5)</code> $= 0.520500$.)` },
        ] },
        { type: 'guided', title: String.raw`$S(x) = \displaystyle\int_0^x \sin(t^2)\,\mathrm d t$ at $x = 1$`, problem: String.raw`Find the Maclaurin series of $S(x) = \int_0^x \sin(t^2)\,\mathrm d t$, the sum of its first three nonzero terms at $x = 1$, and an interval for $S(1)$.`, steps: [
          { prompt: String.raw`$\sin(t^2) = \sum \frac{(-1)^n t^{4n+2}}{(2n+1)!}$, so $S(x) = \sum \frac{(-1)^n x^{4n+3}}{(2n+1)!\,(4n+3)}$. What is the coefficient of $x^7$?`, ask: { kind: 'numeric', answer: '-1/42' }, hint: String.raw`$4n + 3 = 7$ gives $n = 1$: $\frac{(-1)^1}{3!\cdot 7}$.`, reveal: String.raw`$-\frac{1}{6\cdot 7} = -\frac{1}{42}$.` },
          { prompt: String.raw`The radius of convergence:`, ask: { kind: 'choice', choices: [String.raw`$1$`, String.raw`$\infty$`], answer: 1 }, hint: 'The sine series converges for every argument.', reveal: String.raw`$R = \infty$.` },
          { prompt: String.raw`$S_3 = \frac13 - \frac{1}{42} + \frac{1}{5!\cdot 11}$ at $x = 1$ (7 decimals):`, ask: { kind: 'numeric', answer: '1/3 - 1/42 + 1/1320', tol: 1e-7 }, hint: String.raw`$5!\cdot 11 = 1320$.`, reveal: String.raw`$S_3 \approx 0.3102814$.` },
          { prompt: String.raw`The first omitted term has size $\frac{1}{7!\cdot 15}$. Give it.`, ask: { kind: 'numeric', answer: '1/75600', tol: 1e-6 }, hint: String.raw`$7! = 5040$.`, reveal: String.raw`$\frac{1}{75600} \approx 1.32\cdot10^{-5}$; its sign is $(-1)^3 = -$.` },
          { prompt: String.raw`So $S(1)$ lies in`, ask: { kind: 'choice', choices: [String.raw`$\left[S_3 - \frac{1}{75600},\ S_3\right]$`, String.raw`$\left[S_3,\ S_3 + \frac{1}{75600}\right]$`], answer: 0 }, hint: 'The remainder has the sign of the first omitted term.', reveal: String.raw`$0.3102682 \le S(1) \le 0.3102814$. (<code>integral</code> gives $0.3102683$.)` },
        ] },
        { type: 'quiz', question: String.raw`The Maclaurin series of $\displaystyle\int_0^x e^{-t^3}\,\mathrm d t$ starts with`, choices: [String.raw`$x - \dfrac{x^4}{4} + \dfrac{x^7}{14} - \cdots$`, String.raw`$x - x^3 + \dfrac{x^6}{2} - \cdots$`, String.raw`$x - \dfrac{x^4}{4} + \dfrac{x^7}{7} - \cdots$`, String.raw`$1 - \dfrac{x^3}{3} + \cdots$`], answer: 0, explain: String.raw`$e^{-t^3} = 1 - t^3 + \frac{t^6}{2} - \cdots$; integrating gives $x - \frac{x^4}{4} + \frac{x^7}{7\cdot 2} - \cdots$.` },
      ],
    },
    {
      id: 'review-sequences',
      title: 'Review for the capstone: limits of sequences',
      blocks: [
        { type: 'text', html: String.raw`<p>Two sequence types from module 18 come back in the capstone: limits of the form $1^\infty$, and recursively defined sequences. Here they are once more, fully worked.</p>` },
        { type: 'refresher', title: String.raw`$1^\infty$ limits: take the logarithm`, html: String.raw`<p>If $a_n = (\text{base})^n$ with base $\to 1$, take $\ln$: $\ln a_n = n\ln(\text{base})$, a "$\infty\cdot 0$" form. Rewrite it as a quotient $\frac{\ln(\text{base})}{1/n}$ (a $\frac00$ form), use L'Hôpital with $x$ in place of $n$, and finally $a_n = e^{\ln a_n} \to e^{L}$.</p><p>Also $\ln\frac{p}{q} = \ln p - \ln q$, and $(\ln(x + c))' = \frac{1}{x+c}$.</p>` },
        { type: 'derive', title: String.raw`Example 1: $\displaystyle\lim_{n\to\infty}\left(\frac{n+1}{n+3}\right)^n$`, steps: [
          { kind: 'both', label: String.raw`$\ln$ of both sides`, from: String.raw`a_n=\left(\frac{n+1}{n+3}\right)^{\T{n-1}{n}}`, to: String.raw`\ln a_n=\T{n-1}{n}\,\ln\frac{n+1}{n+3}`, arrows: { 'n-1': 'the exponent comes down' }, why: String.raw`The base tends to 1 and the exponent to $\infty$: take $\ln$; $\ln(b^n) = n\ln b$.` },
          { kind: 'factor', label: 'Write as a quotient', to: String.raw`\ln a_n=\frac{\ln(n+1)-\ln(n+3)}{\T{n-1}{1/n}}`, arrows: { 'n-1': 'n = 1/(1/n)' }, why: String.raw`$\ln\frac{p}{q} = \ln p - \ln q$, and multiplying by $n$ is dividing by $\frac1n$.` },
          { kind: 'sub', label: String.raw`Replace $n$ by $x$`, from: String.raw`\frac{\ln(\T{x-1}{n}+1)-\ln(\T{x-2}{n}+3)}{1/\T{x-3}{n}}`, to: String.raw`\frac{\ln(\T{x-1}{x}+1)-\ln(\T{x-2}{x}+3)}{1/\T{x-3}{x}}\ \to\ \frac00`, why: String.raw`Replace $n$ by $x$ so we can differentiate; $\ln\frac{x+1}{x+3} \to \ln 1 = 0$ and $\frac1x \to 0$.` },
          { kind: 'calculus', label: 'Differentiate the numerator', from: String.raw`\big(\ln(x+1)-\ln(x+3)\big)'`, to: String.raw`\frac{1}{x+1}-\frac{1}{x+3}`, why: 'Differentiate each logarithm (refresher).' },
          { kind: 'calc', label: 'Common denominator', to: String.raw`\frac{(x+3)-(x+1)}{(x+1)(x+3)}=\frac{2}{(x+1)(x+3)}`, why: String.raw`Multiply each fraction by the other denominator; $(x+3) - (x+1) = 2$.` },
          { kind: 'calculus', label: 'Differentiate the denominator', from: String.raw`\left(\frac1x\right)'`, to: String.raw`-\frac{1}{x^2}`, why: String.raw`Power rule on $x^{-1}$.` },
          { kind: 'calc', label: String.raw`L'Hôpital: divide the derivatives`, from: String.raw`\frac{\frac{2}{(x+1)(x+3)}}{\T{d-1}{-\frac{1}{x^2}}}`, to: String.raw`\frac{2}{(x+1)(x+3)}\cdot\T{d-1}{(-x^2)}=-\frac{2x^2}{(x+1)(x+3)}`, arrows: { 'd-1': 'flip, then multiply' }, why: String.raw`Dividing by $-\frac1{x^2}$ is multiplying by $-x^2$.` },
          { kind: 'factor', label: String.raw`Divide top and bottom by $x^2$`, from: String.raw`\frac{2}{(x+1)(x+3)}\cdot(-x^2)=-\frac{2x^2}{(x+1)(x+3)}`, to: String.raw`-\frac{2}{(1+1/x)(1+3/x)}\ \to\ -2`, why: String.raw`$\frac{(x+1)(x+3)}{x^2} = \left(1 + \frac1x\right)\left(1 + \frac3x\right) \to 1$.` },
          { kind: 'result', label: 'Exponentiate', from: String.raw`\ln a_n\to -2`, to: String.raw`a_n=e^{\ln a_n}\to e^{-2}`, why: 'The exponential is continuous.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\lim_{n\to\infty}\left(\frac{2n+1}{2n-1}\right)^n$`, problem: String.raw`Find $\lim_{n\to\infty}\left(\frac{2n+1}{2n-1}\right)^n$ by the same steps.`, steps: [
          { prompt: String.raw`$\ln a_n = \frac{\ln(2x+1) - \ln(2x-1)}{1/x}$. The derivative of the numerator is $\frac{2}{2x+1} - \frac{2}{2x-1} = \frac{c}{4x^2 - 1}$. What is $c$?`, ask: { kind: 'numeric', answer: '-4' }, hint: String.raw`Common denominator $(2x+1)(2x-1) = 4x^2 - 1$; numerator $2(2x-1) - 2(2x+1)$.`, reveal: String.raw`$2(2x - 1) - 2(2x + 1) = -4$.` },
          { prompt: String.raw`Divide by $-\frac{1}{x^2}$: $\frac{4x^2}{4x^2 - 1}$. Its limit $L$ is`, ask: { kind: 'numeric', answer: '1' }, hint: String.raw`Divide by $x^2$.`, reveal: String.raw`$L = 1$.` },
          { prompt: String.raw`So $\lim a_n = \;?$`, ask: { kind: 'numeric', answer: 'exp(1)', tol: 1e-6 }, hint: String.raw`$a_n \to e^{L}$.`, reveal: String.raw`$e^1 = e$.` },
        ] },
        { type: 'refresher', title: 'monotone and bounded sequences', html: String.raw`<p><b>Monotone convergence theorem:</b> an increasing sequence that is bounded above converges. For $a_{n+1} = g(a_n)$ the recipe is: (1) show a bound by induction, (2) show $a_{n+1} - a_n > 0$, (3) the limit $L$ satisfies $L = g(L)$ — solve, and keep the root allowed by the bounds.</p>` },
        { type: 'steps', title: String.raw`Example 2: $a_1 = 1.5$, $a_{n+1} = 3 - \dfrac{2}{a_n}$`, steps: [
          { do: String.raw`Claim: $1.5 \le a_n < 2$ for all $n$`, why: String.raw`Guess from the first terms: $a_1 = 1.5$, $a_2 = 3 - \frac43 \approx 1.667$, $a_3 = 1.8$.` },
          { do: String.raw`If $1.5 \le a_n < 2$, then $1 < \dfrac{2}{a_n} \le \dfrac43$`, why: String.raw`Dividing 2 by a number in $[1.5, 2)$ gives a number in $(1, \frac43]$.` },
          { do: String.raw`$\Rightarrow\; \tfrac53 \le a_{n+1} = 3 - \dfrac{2}{a_n} < 2$`, why: String.raw`Subtracting from 3 flips the order. And $\frac53 \ge 1.5$, so the claim holds for $n+1$ (induction).` },
        ] },
        { type: 'derive', title: String.raw`Example 2 (continued): increasing, and the limit`, steps: [
          { kind: 'calc', label: String.raw`Common denominator $a_n$`, from: String.raw`a_{n+1}-a_n=3-\frac{2}{a_n}-a_n`, to: String.raw`a_{n+1}-a_n=\frac{3a_n-2-a_n^2}{a_n}`, why: String.raw`$3 = \frac{3a_n}{a_n}$ and $a_n = \frac{a_n^2}{a_n}$.` },
          { kind: 'factor', label: 'Take a minus sign out', to: String.raw`a_{n+1}-a_n=-\frac{a_n^2-3a_n+2}{a_n}`, why: 'Changing every sign in the numerator and putting a minus in front changes nothing.' },
          { kind: 'factor', label: 'Factor the quadratic', to: String.raw`a_{n+1}-a_n=-\frac{(a_n-1)(a_n-2)}{a_n}`, why: String.raw`$a^2 - 3a + 2 = (a-1)(a-2)$: two numbers with product $2$ and sum $-3$.` },
          { kind: 'result', label: 'Sign', to: String.raw`a_{n+1}-a_n>0\quad\text{for}\ 1.5\le a_n<2`, why: String.raw`$a_n - 1 > 0$, $a_n - 2 < 0$, $a_n > 0$: the fraction is negative, and the minus sign makes it positive. So the sequence increases.` },
          { kind: 'result', label: 'Monotone convergence', from: String.raw`\text{increasing and bounded above}`, to: String.raw`a_n\to L\ \text{for some}\ L`, why: 'Monotone convergence theorem.' },
          { kind: 'sub', label: String.raw`Let $n\to\infty$ in the recursion`, from: String.raw`\T{a-1}{a_{n+1}}=3-\frac{2}{\T{a-2}{a_n}}`, to: String.raw`\T{a-1}{L}=3-\frac{2}{\T{a-2}{L}}`, why: String.raw`Both $a_{n+1}$ and $a_n$ tend to $L$.` },
          { kind: 'both', label: String.raw`Both sides $\times L$`, from: String.raw`L=3-\frac{2}{L}`, to: String.raw`L^2=3L-2`, why: String.raw`$L \ne 0$ (all terms are $\ge 1.5$); multiplying by $L$ clears the fraction.` },
          { kind: 'both', label: String.raw`Both sides $-3L+2$`, to: String.raw`L^2-3L+2=0`, why: 'Collect everything on the left, so the right side is 0.' },
          { kind: 'factor', label: 'Factor', to: String.raw`(L-1)(L-2)=0\iff L=1\ \text{or}\ L=2`, why: 'A product is zero when one factor is zero.' },
          { kind: 'result', label: 'Choose the root', to: String.raw`L=2`, why: String.raw`All terms are $\ge 1.5$, so the limit is $\ge 1.5$: $L = 1$ is impossible.` },
        ] },
        { type: 'guided', title: String.raw`$a_1 = 3$, $a_{n+1} = 6 - \dfrac{8}{a_n}$`, problem: String.raw`Show that the sequence converges and find its limit. (One can show as above that $3 \le a_n < 4$ and that $a_{n+1} - a_n = -\frac{(a_n - 2)(a_n - 4)}{a_n} > 0$.)`, steps: [
          { prompt: String.raw`What is $a_2$?`, ask: { kind: 'numeric', answer: '10/3' }, hint: String.raw`$6 - \frac83$.`, reveal: String.raw`$a_2 = \frac{10}{3} \approx 3.333$: the sequence increases.` },
          { prompt: String.raw`The equation $L = 6 - \frac8L$ becomes $L^2 - 6L + 8 = 0$. Its larger root is`, ask: { kind: 'numeric', answer: '4' }, hint: String.raw`$L^2 - 6L + 8 = (L - 2)(L - 4)$.`, reveal: String.raw`Roots $2$ and $4$.` },
          { prompt: String.raw`Which is the limit?`, ask: { kind: 'choice', choices: ['2', '4'], answer: 1 }, hint: String.raw`All terms are $\ge 3$.`, reveal: String.raw`$L = 4$ (the limit cannot be below the lower bound 3).` },
        ] },
      ],
    },
    {
      id: 'review-sums',
      title: 'Review for the capstone: geometric and telescoping sums',
      blocks: [
        { type: 'text', html: String.raw`<p>Only two kinds of series can be summed exactly by hand: geometric and telescoping (module 19). One example and one guided exercise of each.</p>` },
        { type: 'refresher', title: 'geometric series starting at n = 1', html: String.raw`<p>$\displaystyle\sum_{n=1}^\infty r^n = r + r^2 + \cdots = \frac{r}{1 - r}$ for $|r| < 1$ (first term over one minus the ratio). Also $\dfrac{a^n}{b^n} = \left(\dfrac ab\right)^n$ and $\sum (u_n + v_n) = \sum u_n + \sum v_n$ when both converge.</p>` },
        { type: 'derive', title: String.raw`Example 1: $\displaystyle\sum_{n=1}^\infty \frac{3^n + 4^n}{12^n}$`, steps: [
          { kind: 'factor', label: 'Split the fraction', from: String.raw`\frac{3^n+4^n}{12^n}`, to: String.raw`\frac{3^n}{12^n}+\frac{4^n}{12^n}`, why: 'A sum over a common denominator splits into two fractions.' },
          { kind: 'factor', label: 'One power each', to: String.raw`\left(\frac{3}{12}\right)^n+\left(\frac{4}{12}\right)^n`, why: String.raw`$\frac{a^n}{b^n} = \left(\frac ab\right)^n$.` },
          { kind: 'calc', label: 'Simplify the ratios', to: String.raw`\left(\frac14\right)^n+\left(\frac13\right)^n`, why: String.raw`$\frac{3}{12} = \frac14$ and $\frac{4}{12} = \frac13$.` },
          { kind: 'sub', label: String.raw`Geometric with $r = \frac14$`, from: String.raw`\sum_{n=1}^\infty r^n=\frac{\T{r-1}{r}}{1-\T{r-2}{r}}\qquad\qquad r=\tfrac14`, to: String.raw`\sum_{n=1}^\infty\left(\frac14\right)^n=\frac{\T{r-1}{1/4}}{1-\T{r-2}{1/4}}=\frac{1/4}{3/4}=\frac13`, why: String.raw`Geometric, $r = \frac14$, $|r| < 1$.` },
          { kind: 'sub', label: String.raw`Geometric with $r = \frac13$`, from: String.raw`\sum_{n=1}^\infty r^n=\frac{\T{r-1}{r}}{1-\T{r-2}{r}}\qquad\qquad r=\tfrac13`, to: String.raw`\sum_{n=1}^\infty\left(\frac13\right)^n=\frac{\T{r-1}{1/3}}{1-\T{r-2}{1/3}}=\frac{1/3}{2/3}=\frac12`, why: String.raw`Geometric, $r = \frac13$.` },
          { kind: 'calc', label: 'Add', from: String.raw`\frac13+\frac12`, to: String.raw`\frac13+\frac12=\frac26+\frac36=\frac56`, why: 'Both series converge, so they may be added.' },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{1 + 2^n}{5^n}$`, problem: String.raw`Find $\sum_{n=1}^\infty \frac{1 + 2^n}{5^n}$.`, steps: [
          { prompt: String.raw`$\sum \left(\frac15\right)^n = \;?$`, ask: { kind: 'numeric', answer: '1/4' }, hint: String.raw`$\frac{r}{1-r}$ with $r = \frac15$.`, reveal: String.raw`$\frac{1/5}{4/5} = \frac14$.` },
          { prompt: String.raw`$\sum \left(\frac25\right)^n = \;?$`, ask: { kind: 'numeric', answer: '2/3' }, hint: String.raw`$\frac{2/5}{3/5}$.`, reveal: String.raw`$\frac23$.` },
          { prompt: 'The sum:', ask: { kind: 'numeric', answer: '11/12' }, hint: String.raw`$\frac14 + \frac23$.`, reveal: String.raw`$\frac{3}{12} + \frac{8}{12} = \frac{11}{12}$.` },
        ] },
        { type: 'refresher', title: 'partial fractions by cover-up', html: String.raw`<p>$\dfrac{1}{(pn + q)(pn + s)} = \dfrac{A}{pn + q} + \dfrac{B}{pn + s}$. Multiply out: $1 = A(pn + s) + B(pn + q)$. Choose $n$ so that one bracket is zero to find $A$ and $B$ one at a time.</p>` },
        { type: 'derive', title: String.raw`Example 2: $\displaystyle\sum_{n=1}^\infty \frac{1}{(n+2)(n+3)}$`, steps: [
          { kind: 'both', label: String.raw`Both sides $\times (n+2)(n+3)$`, from: String.raw`\frac{1}{(n+2)(n+3)}=\frac{A}{n+2}+\frac{B}{n+3}`, to: String.raw`1=A(n+3)+B(n+2)`, why: 'Partial fractions: multiply both sides by the denominator; each fraction loses its own bracket.' },
          { kind: 'sub', label: String.raw`$n = -2$`, from: String.raw`1=A(\T{n-1}{n}+3)+B(\T{n-2}{n}+2)\qquad n=-2`, to: String.raw`1=A(\T{n-1}{-2}+3)+B(\T{n-2}{-2}+2)=A\ \Rightarrow\ A=1`, why: 'This choice makes the $B$ bracket zero.' },
          { kind: 'sub', label: String.raw`$n = -3$`, from: String.raw`1=A(\T{n-1}{n}+3)+B(\T{n-2}{n}+2)\qquad n=-3`, to: String.raw`1=A(\T{n-1}{-3}+3)+B(\T{n-2}{-3}+2)=-B\ \Rightarrow\ B=-1`, why: 'This choice makes the $A$ bracket zero.' },
          { kind: 'expand', label: 'Write the partial sum out', from: String.raw`S_N=\sum_{n=1}^{N}\left(\frac{1}{n+2}-\frac{1}{n+3}\right)`, to: String.raw`S_N=\left(\tfrac13-\T{c-1}{\tfrac14}\right)+\left(\T{c-2}{\tfrac14}-\T{d-1}{\tfrac15}\right)+\left(\T{d-2}{\tfrac15}-\cdots\right)+\cdots+\left(\T{e-1}{\cdots}-\tfrac{1}{N+3}\right)`, why: 'Write the partial sum out: neighbouring terms cancel (telescoping).' },
          { kind: 'cancel', label: 'Neighbours cancel', to: String.raw`S_N=\frac13-\frac{1}{N+3}`, why: String.raw`Each $-\frac1k$ cancels the $+\frac1k$ of the next bracket. Only the first and the last piece survive.` },
          { kind: 'calc', label: String.raw`Let $N\to\infty$`, to: String.raw`\sum_{n=1}^\infty\frac{1}{(n+2)(n+3)}=\lim_{N\to\infty}S_N=\frac13`, why: String.raw`$\frac{1}{N+3} \to 0$.` },
        ] },
        { type: 'guided', title: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{1}{(3n-1)(3n+2)}$`, problem: String.raw`Find $\sum_{n=1}^\infty \frac{1}{(3n-1)(3n+2)}$.`, steps: [
          { prompt: String.raw`$1 = A(3n + 2) + B(3n - 1)$. Put $n = \frac13$ to find $A$.`, ask: { kind: 'numeric', answer: '1/3' }, hint: String.raw`At $n = \frac13$: $3n - 1 = 0$ and $3n + 2 = 3$.`, reveal: String.raw`$1 = 3A$, $A = \frac13$; similarly $B = -\frac13$.` },
          { prompt: String.raw`$S_N = \frac13\left[\left(\frac12 - \frac15\right) + \left(\frac15 - \frac18\right) + \cdots + \left(\frac{1}{3N-1} - \frac{1}{3N+2}\right)\right]$. After cancelling, $S_N = \frac13\left(\frac12 - \frac{1}{3N+2}\right)$. The sum is`, ask: { kind: 'numeric', answer: '1/6' }, hint: String.raw`Let $N \to \infty$.`, reveal: String.raw`$\frac13\cdot\frac12 = \frac16$.` },
          { prompt: String.raw`Check numerically: what is $S_1$?`, ask: { kind: 'numeric', answer: '1/10' }, hint: String.raw`$S_1$ is just the first term, $\frac{1}{2\cdot 5}$.`, reveal: String.raw`$S_1 = \frac{1}{10}$, and the formula gives $\frac13\left(\frac12 - \frac15\right) = \frac{1}{10}$ ✓.` },
        ] },
      ],
    },
  ],
  matlab: [
    {
      id: 'taylor-numerics',
      title: 'Taylor polynomials in MATLAB',
      blocks: [
        { type: 'text', html: String.raw`<p>Two ways to evaluate $P_n$: an <b>explicit sum</b> over $k$ with <code>factorial</code>, or <code>polyval</code>. <code>polyval(p, t)</code> wants the coefficients in <b>descending</b> order, so flip the Taylor coefficients with <code>fliplr</code> and evaluate at $t = x - a$.</p>` },
        { type: 'code', caption: 'P_3 of sqrt(x) at a = 4: coefficients, polyval, and the error f − P_3.', editable: true, code: String.raw`a = 4;
c = [2, 1/4, -1/64, 1/512];        % c_0 ... c_3
f = @(x) sqrt(x);
P3 = @(x) polyval(fliplr(c), x - a);
x = linspace(0.5, 9, 400);
plot(x, f(x) - P3(x))
grid on
title('f(x) - P_3(x)')
fprintf('P3(4.2) = %.8f, sqrt(4.2) = %.8f\n', P3(4.2), sqrt(4.2))` },
        { type: 'code', caption: 'Maclaurin polynomials of e^x as explicit sums: the error at x = 1 against the bound 3/(n+1)!.', editable: true, code: String.raw`x = 1;
for n = 2:2:10
    k = 0:n;
    Pn = sum(x.^k ./ factorial(k));
    fprintf('n = %2d: error %.3e, bound %.3e\n', n, exp(x) - Pn, 3/factorial(n+1))
end` },
        { type: 'text', html: String.raw`<p>To <b>support</b> a hand-derived bound $M$ for $|f^{(n+1)}|$, evaluate the derivative on a fine grid between $a$ and $x$ and take <code>max(abs(...))</code>, or maximise with <code>fminbnd</code> applied to $-|f^{(n+1)}|$. The derivative itself must be computed by hand (no <code>syms</code>).</p>` },
        { type: 'code', editable: true, code: String.raw`% f(x) = ln x, a = 1, x = 1.3, n = 3: we need |f''''(t)| = 6/t^4 on [1, 1.3]
f4 = @(t) -6 ./ t.^4;
t = linspace(1, 1.3, 1001);
M = max(abs(f4(t)))
[tmax, negM] = fminbnd(@(t) -abs(f4(t)), 1, 1.3)` },
        { type: 'matlab', prompt: String.raw`Compute $P_6(0.5)$ for $\cos x$ at $a = 0$, i.e. $\sum_{k=0}^{3} \frac{(-1)^k\,0.5^{2k}}{(2k)!}$, with <code>factorial</code>, and store it in <code>P</code>. Also store the error <code>err = cos(0.5) - P</code>.`, starter: `k = 0:3;\nP = 0;     % replace by the sum\nerr = 0;   % replace`, solution: `k = 0:3;\nP = sum((-1).^k .* 0.5.^(2*k) ./ factorial(2*k));\nerr = cos(0.5) - P;`, checks: [{ var: 'P', value: '1 - 0.5^2/2 + 0.5^4/24 - 0.5^6/720', tol: 1e-12 }, { var: 'err', value: 'cos(0.5) - (1 - 0.5^2/2 + 0.5^4/24 - 0.5^6/720)', tol: 1e-12 }, { uses: 'factorial' }] },
        { type: 'matlab', prompt: String.raw`For $f(x) = e^{-x^2}$ one finds $f'''(x) = (12x - 8x^3)e^{-x^2}$. Estimate $M = \max_{0 \le x \le 1} |f'''(x)|$ on a grid of 10001 points and store it in <code>M</code>.`, starter: `f3 = @(x) (12*x - 8*x.^3) .* exp(-x.^2);\nx = linspace(0, 1, 10001);\nM = 0;   % replace`, solution: `f3 = @(x) (12*x - 8*x.^3) .* exp(-x.^2);\nx = linspace(0, 1, 10001);\nM = max(abs(f3(x)));`, checks: [{ var: 'M', value: 3.9035661, tol: 1e-5 }, { uses: 'max' }] },
        { type: 'matlab', prompt: String.raw`Evaluate the first six terms ($n = 0, \dots, 5$) of the erf series at $x = 0.8$, store the result in <code>S</code>, and compare with MATLAB's <code>erf(0.8)</code> in <code>err = abs(erf(0.8) - S)</code>.`, starter: `x = 0.8;\nn = 0:5;\nS = 0;     % replace by 2/sqrt(pi) times the sum\nerr = 0;   % replace`, solution: `x = 0.8;\nn = 0:5;\nS = 2/sqrt(pi) * sum((-1).^n .* x.^(2*n+1) ./ (factorial(n) .* (2*n+1)));\nerr = abs(erf(0.8) - S);`, checks: [{ var: 'S', value: 'erf(0.8)', tol: 1e-5 }, { var: 'err', value: 0, tol: 1e-5 }] },
      ],
    },
    {
      id: 'remainder-writeup',
      title: 'Writing up a remainder estimate',
      blocks: [
        { type: 'text', html: String.raw`<p>A remainder estimate in a homework answer states the theorem, names the interval for $\xi$, derives $M$ with a reason (monotonicity or a bound on each factor), and only then substitutes numbers. A numerical comparison with the true error closes the answer.</p>` },
        { type: 'livescript', caption: 'Model answer: ln(1.3) with P_3 of ln x at a = 1', blocks: [
          { type: 'heading', content: 'Problem (Attempted)' },
          { type: 'text', content: String.raw`We approximate $\ln 1.3$ with the Taylor polynomial $P_3$ of $f(x) = \ln x$ at $a = 1$. The derivatives are $f'(x) = x^{-1}$, $f''(x) = -x^{-2}$, $f'''(x) = 2x^{-3}$ and $f^{(4)}(x) = -6x^{-4}$, so at $a = 1$:` },
          { type: 'equation', content: String.raw`P_3(x) = (x-1) - \frac{(x-1)^2}{2} + \frac{(x-1)^3}{3}, \qquad P_3(1.3) = 0.3 - 0.045 + 0.009 = 0.264 .` },
          { type: 'text', content: String.raw`By Taylor's theorem $R_3(1.3) = \frac{f^{(4)}(\xi)}{4!}(0.3)^4$ for some $\xi \in (1, 1.3)$. Since $|f^{(4)}(t)| = 6/t^4$ is decreasing, its maximum on $[1, 1.3]$ is $M = 6$ at $t = 1$. Hence` },
          { type: 'equation', content: String.raw`|R_3(1.3)| \le \frac{6\cdot 0.3^4}{4!} = 0.002025 .` },
          { type: 'text', content: String.raw`Since $f^{(4)}(\xi) < 0$, the remainder is negative, so $0.261975 \le \ln 1.3 < 0.264$. We compare with MATLAB:` },
          { type: 'code', content: String.raw`P3 = 0.3 - 0.3^2/2 + 0.3^3/3;
fprintf('P3 = %.6f, ln(1.3) = %.6f, error = %.6f, bound = %.6f\n', P3, log(1.3), log(1.3) - P3, 6*0.3^4/24)` },
        ] },
        { type: 'latex', prompt: 'Type the Lagrange remainder bound:', target: String.raw`|R_n(x)| \le \frac{M |x-a|^{n+1}}{(n+1)!}` },
        { type: 'latex', prompt: 'Type the series of the error function:', target: String.raw`\mathrm{erf}(x) = \frac{2}{\sqrt{\pi}} \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{n!\,(2n+1)}` },
      ],
    },
  ],
  assignIntro: String.raw`<p>Every problem below is the same type as a worked example and a guided exercise you have already done — the links above each problem take you back to them. If you get stuck, use the hints one at a time, then the step-by-step walkthrough.</p>`,
  assignments: [
    {
      id: 'a2',
      title: 'Working with Maclaurin series',
      difficulty: 'core',
      examples: ['maclaurin', 'binomial', 'series-limits'],
      statement: String.raw`<p>Use the standard series; do not differentiate repeatedly.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`The coefficient of $x^6$ in the Maclaurin series of $x^2 e^{-2x^2}$.`, kind: 'numeric', answer: '2',
          hints: [String.raw`Same as the guided exercise $x^2 e^{-3x^2}$.`, String.raw`Substitute $-2x^2$ into $e^u = \sum\frac{u^n}{n!}$, then multiply by $x^2$.`, String.raw`$x^2e^{-2x^2} = \sum \frac{(-2)^n x^{2n+2}}{n!}$; solve $2n + 2 = 6$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Substitute $-2x^2$ into the exponential series, multiply by $x^2$, and pick the term with $x^6$.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`Substitute $u = -2x^2$`, from: String.raw`e^u=\sum_{n=0}^\infty\frac{u^n}{n!}\qquad\qquad u=\T{u-1}{-2x^2}`, to: String.raw`e^{-2x^2}=\sum_{n=0}^\infty\frac{\T{u-1}{(-2x^2)}^n}{n!}`, arrows: { 'u-1': 'u = −2x²' }, why: String.raw`Substitute $u = -2x^2$, in brackets.` },
              { kind: 'expand', label: String.raw`$(-2x^2)^n = (-2)^n x^{2n}$`, from: String.raw`e^{-2x^2}=\sum_{n=0}^\infty\frac{(-2x^2)^n}{n!}`, to: String.raw`e^{-2x^2}=\sum_{n=0}^\infty\frac{(-2)^n x^{2n}}{n!}`, why: String.raw`A power of a product is the product of the powers; $(x^2)^n = x^{2n}$.` },
              { kind: 'expand', label: String.raw`Multiply by $x^2$`, from: String.raw`x^2e^{-2x^2}=\T{x-1}{x^2}\sum_{n=0}^\infty\frac{(-2)^n x^{2n}}{n!}`, to: String.raw`x^2e^{-2x^2}=\sum_{n=0}^\infty\frac{(-2)^n x^{2n+\T{x-1}{2}}}{n!}`, arrows: { 'x-1': 'into every term' }, why: String.raw`Multiply by $x^2$: add 2 to every exponent.` },
              { kind: 'calc', label: String.raw`Which $n$ gives $x^6$?`, from: String.raw`2n+2=6`, to: String.raw`n=2`, why: 'The term with $x^6$: subtract 2, divide by 2.' },
              { kind: 'sub', label: String.raw`Put $n = 2$ into the coefficient`, from: String.raw`\frac{(-2)^{\T{n-1}{n}}}{\T{n-2}{n}!}`, to: String.raw`\frac{(-2)^{\T{n-1}{2}}}{\T{n-2}{2}!}=\frac42=2`, why: String.raw`$(-2)^2 = 4$ and $2! = 2$.` },
            ] },
          ] },
        { label: '(b)', prompt: String.raw`The coefficient of $x^5$ in the series of $\sin(3x)$.`, kind: 'numeric', answer: '81/40',
          hints: [String.raw`Substitute $3x$ into the sine series, as $2x$ was substituted into the cosine series in the example.`, String.raw`$\sin(3x) = \sum \frac{(-1)^n (3x)^{2n+1}}{(2n+1)!}$; $x^5$ needs $2n + 1 = 5$.`, String.raw`$n = 2$: $\frac{(+1)\,3^5}{5!}$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Substitute $3x$ into the sine series and pick the term with $x^5$.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`Substitute $u = 3x$`, from: String.raw`\sin u=\sum_{n=0}^\infty\frac{(-1)^n u^{2n+1}}{(2n+1)!}\qquad\qquad u=\T{u-1}{3x}`, to: String.raw`\sin(3x)=\sum_{n=0}^\infty\frac{(-1)^n\,\T{u-1}{(3x)}^{2n+1}}{(2n+1)!}`, arrows: { 'u-1': 'u = 3x' }, why: String.raw`Substitute $u = 3x$, in brackets.` },
              { kind: 'expand', label: String.raw`$(3x)^{2n+1} = 3^{2n+1}x^{2n+1}$`, from: String.raw`\sin(3x)=\sum_{n=0}^\infty\frac{(-1)^n\,(3x)^{2n+1}}{(2n+1)!}`, to: String.raw`\sin(3x)=\sum_{n=0}^\infty\frac{(-1)^n 3^{2n+1}x^{2n+1}}{(2n+1)!}`, why: 'A power of a product is the product of the powers.' },
              { kind: 'calc', label: String.raw`Which $n$ gives $x^5$?`, from: String.raw`2n+1=5`, to: String.raw`n=2`, why: 'The term with $x^5$.' },
              { kind: 'sub', label: String.raw`Put $n = 2$ into the coefficient`, from: String.raw`\frac{(-1)^n\,3^{2n+1}}{(2n+1)!}\qquad n=2`, to: String.raw`\frac{(-1)^2\,3^5}{5!}=\frac{243}{120}`, why: String.raw`$3^5 = 243$, $5! = 120$.` },
              { kind: 'cancel', label: 'Cancel the common factor 3', from: String.raw`\frac{\T{t-1}{3}\cdot 81}{\T{t-2}{3}\cdot 40}`, to: String.raw`\frac{81}{40}`, why: String.raw`$243 = 3\cdot 81$ and $120 = 3\cdot 40$.` },
            ] },
          ] },
        { label: '(c)', prompt: String.raw`The coefficient of $x^2$ in the binomial series of $\sqrt[3]{1+x}$.`, kind: 'numeric', answer: '-1/9',
          hints: [String.raw`Same as the binomial example with $k = \frac13$ instead of $\frac12$.`, String.raw`$\binom{k}{2} = \frac{k(k-1)}{2!}$.`, String.raw`$\frac{\frac13\cdot\left(-\frac23\right)}{2}$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Write the root as a power and use $\binom{k}{2} = \frac{k(k-1)}{2!}$, as in the binomial example.</p>` },
            { type: 'derive', steps: [
              { kind: 'start', label: 'Root as a power', from: String.raw`\sqrt[3]{1+x}`, to: String.raw`(1+x)^{1/3},\qquad k=\tfrac13`, why: 'Write the root as a power.' },
              { kind: 'sub', label: String.raw`Put $k = \frac13$`, from: String.raw`\binom{k}{2}=\frac{\T{k-1}{k}\,(\T{k-2}{k}-1)}{2!}`, to: String.raw`\binom{1/3}{2}=\frac{\T{k-1}{\frac13}\left(\T{k-2}{\frac13}-1\right)}{2!}`, why: 'Two factors on top, divided by $2!$.' },
              { kind: 'calc', label: String.raw`$\frac13 - 1 = -\frac23$`, to: String.raw`\binom{1/3}{2}=\frac{\frac13\cdot\left(-\frac23\right)}{2}`, why: String.raw`$\frac13 - \frac33 = -\frac23$, and $2! = 2$.` },
              { kind: 'calc', label: 'Multiply and divide', to: String.raw`\binom{1/3}{2}=\frac{-\frac29}{2}=-\frac19`, why: String.raw`$\frac13\cdot\left(-\frac23\right) = -\frac29$; halving gives $-\frac19$.` },
            ] },
          ] },
        { label: '(d)', prompt: String.raw`$f^{(10)}(0)$ for $f(x) = x^2\cos x$.`, kind: 'numeric', answer: '90',
          hints: [String.raw`Same as the guided exercise $f^{(9)}(0)$ for $x^2\sin x$.`, String.raw`$x^2\cos x = \sum \frac{(-1)^n x^{2n+2}}{(2n)!}$; find the coefficient $c_{10}$.`, String.raw`$n = 4$: $c_{10} = \frac{1}{8!}$; then $f^{(10)}(0) = 10!\,c_{10}$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Multiply the cosine series by $x^2$, find the coefficient of $x^{10}$, then use $c_{10} = \frac{f^{(10)}(0)}{10!}$.</p>` },
            { type: 'derive', steps: [
              { kind: 'expand', label: String.raw`Multiply by $x^2$`, from: String.raw`x^2\cos x=\T{x-1}{x^2}\sum_{n=0}^\infty\frac{(-1)^n x^{2n}}{(2n)!}`, to: String.raw`x^2\cos x=\sum_{n=0}^\infty\frac{(-1)^n x^{2n+\T{x-1}{2}}}{(2n)!}`, arrows: { 'x-1': 'into every term' }, why: String.raw`Multiply the cosine series by $x^2$: add 2 to every exponent.` },
              { kind: 'calc', label: String.raw`Which $n$ gives $x^{10}$?`, from: String.raw`2n+2=10`, to: String.raw`n=4`, why: 'The term with $x^{10}$.' },
              { kind: 'sub', label: String.raw`Put $n = 4$`, from: String.raw`c_{10}=\frac{(-1)^n}{(2n)!}\qquad n=4`, to: String.raw`c_{10}=\frac{(-1)^4}{8!}=\frac{1}{8!}`, why: String.raw`$(-1)^4 = 1$ and $2\cdot 4 = 8$.` },
              { kind: 'both', label: String.raw`Both sides $\times 10!$`, from: String.raw`\frac{f^{(10)}(0)}{\T{f-1}{10!}}=\frac{1}{8!}`, to: String.raw`f^{(10)}(0)=\T{f-1}{10!}\cdot\frac{1}{8!}`, arrows: { 'f-1': '× 10! on both sides' }, why: String.raw`$c_{10} = \frac{f^{(10)}(0)}{10!}$; multiplying both sides by $10!$ frees the derivative.` },
              { kind: 'expand', label: String.raw`$10! = 8!\cdot 9\cdot 10$`, from: String.raw`f^{(10)}(0)=\frac{10!}{8!}`, to: String.raw`f^{(10)}(0)=\frac{\T{g-1}{8!}\cdot 9\cdot 10}{\T{g-2}{8!}}`, why: 'The bigger factorial is the smaller one times the missing factors.' },
              { kind: 'cancel', label: String.raw`Cancel $8!$`, to: String.raw`f^{(10)}(0)=9\cdot 10=90`, why: String.raw`$\frac{10!}{8!} = 10\cdot 9$.` },
            ] },
          ] },
        { label: '(e)', prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\sin x - x}{x^3}$`, kind: 'numeric', answer: '-1/6',
          hints: ['Same type as the examples in "Limits with series".', String.raw`Write $\sin x = x - \frac{x^3}{6} + \frac{x^5}{120} - \cdots$.`, String.raw`$\sin x - x = -\frac{x^3}{6} + \frac{x^5}{120} - \cdots$; divide by $x^3$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Replace $\sin x$ by its series, cancel, divide by $x^3$.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`Replace $\sin x$ by its series`, from: String.raw`\frac{\T{s-1}{\sin x}-x}{x^3}`, to: String.raw`\frac{\sin x-x}{x^3}=\frac{\T{s-1}{\left(x-\frac{x^3}{6}+\frac{x^5}{120}-\cdots\right)}-x}{x^3}`, why: 'The sine series.' },
              { kind: 'cancel', label: String.raw`$x - x = 0$`, from: String.raw`\frac{\sin x-x}{x^3}=\frac{\T{y-1}{x}-\frac{x^3}{6}+\frac{x^5}{120}-\cdots-\T{y-2}{x}}{x^3}`, to: String.raw`\frac{\sin x-x}{x^3}=\frac{-\frac{x^3}{6}+\frac{x^5}{120}-\cdots}{x^3}`, why: String.raw`The $x$ cancels.` },
              { kind: 'calc', label: String.raw`Divide every term by $x^3$`, to: String.raw`\frac{\sin x-x}{x^3}=-\frac16+\frac{x^2}{120}-\cdots`, why: String.raw`Divide every term by $x^3$.` },
              { kind: 'calc', label: String.raw`Let $x\to 0$`, to: String.raw`\frac{\sin x-x}{x^3}=-\frac16+\frac{x^2}{120}-\cdots\ \to\ -\frac16`, why: String.raw`The terms with powers of $x$ vanish as $x \to 0$.` },
            ] },
          ] },
      ],
    },
    {
      id: 'a3',
      title: 'How accurate is P_n?',
      difficulty: 'core',
      examples: ['remainder', 'remainder-n', 'alternating-taylor'],
      statement: String.raw`<p>Remainder estimates for Maclaurin polynomials.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`Lagrange bound for $|R_4(0.5)|$ when $f(x) = e^x$, using $M = e^{0.5}$.`, kind: 'numeric', answer: 'exp(0.5)*0.5^5/120', tol: 1e-6,
          hints: [String.raw`Same as Example 1 and the guided exercise in "The Lagrange remainder".`, String.raw`For $R_4$ you need $f^{(5)}$ and $(n+1)! = 5!$.`, String.raw`$|R_4(0.5)| \le \frac{e^{0.5}\cdot 0.5^5}{5!}$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Lagrange with $n = 4$: the fifth derivative, $M$ at the right end, then plug in.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`Lagrange with $n = 4$`, from: String.raw`R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}x^{n+1}\qquad n=4,\ x=0.5`, to: String.raw`R_4(0.5)=\frac{f^{(5)}(\xi)}{5!}(0.5)^5,\qquad\xi\in(0,\ 0.5)`, why: 'Lagrange formula with $n = 4$.' },
              { kind: 'result', label: 'Choose $M$', from: String.raw`|f^{(5)}(t)|=e^t\ \text{on}\ [0,\ 0.5]`, to: String.raw`|f^{(5)}(t)|\le e^{0.5}=M`, why: String.raw`$e^t$ is increasing, so its maximum is at the right end.` },
              { kind: 'sub', label: 'Plug in', from: String.raw`|R_4(0.5)|\le\frac{\T{M-1}{M}\cdot 0.5^5}{5!}`, to: String.raw`|R_4(0.5)|\le\frac{\T{M-1}{e^{0.5}}\cdot 0.03125}{120}`, why: String.raw`$0.5^5 = 0.03125$, $5! = 120$.` },
              { kind: 'calc', label: String.raw`$e^{0.5} \approx 1.6487$`, to: String.raw`|R_4(0.5)|\le\frac{1.6487\cdot 0.03125}{120}\approx 4.29\cdot10^{-4}`, why: String.raw`$e^{0.5} \approx 1.6487$.` },
            ] },
          ] },
        { label: '(b)', prompt: String.raw`Using $M = 3$ (since $e^t < 3$ on $[0, 1]$), the smallest $n$ for which the Lagrange bound guarantees $|e - P_n(1)| < 10^{-6}$.`, kind: 'numeric', answer: '9', tol: 1e-9,
          hints: [String.raw`Same as the example in "How many terms", with $10^{-6}$.`, String.raw`You need $\frac{3}{(n+1)!} < 10^{-6}$, i.e. $(n+1)! > 3\,000\,000$.`, String.raw`$9! = 362880$, $10! = 3628800$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Bound below the tolerance, clear the fraction, then a factorial table.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`$M = 3$, $|x - a| = 1$`, from: String.raw`|R_n(1)|\le\frac{\T{M-1}{M}\cdot 1^{n+1}}{(n+1)!}`, to: String.raw`|R_n(1)|\le\frac{\T{M-1}{3}}{(n+1)!}`, why: 'Lagrange bound with $M = 3$ and $|x - a| = 1$; $1^{n+1} = 1$.' },
              { kind: 'start', label: 'Bound below the tolerance', from: String.raw`|R_n(1)|\le\frac{3}{(n+1)!}`, to: String.raw`\frac{3}{(n+1)!}<10^{-6}`, why: 'The bound must be below the tolerance.' },
              { kind: 'both', label: String.raw`Both sides $\times (n+1)!$`, from: String.raw`\frac{3}{\T{f-1}{(n+1)!}}<10^{-6}`, to: String.raw`3<10^{-6}\,\T{f-1}{(n+1)!}`, arrows: { 'f-1': '× (n+1)! on both sides' }, why: String.raw`$(n+1)!$ is positive, so the inequality keeps its direction.` },
              { kind: 'both', label: String.raw`Both sides $\times 10^6$`, from: String.raw`3<\T{p-1}{10^{-6}}\,(n+1)!`, to: String.raw`3\cdot 10^6<(n+1)!`, why: String.raw`$10^{-6}\cdot 10^6 = 1$.` },
              { kind: 'calc', label: 'Factorial table', from: String.raw`(n+1)!>3\,000\,000`, to: String.raw`9!=362880<3\cdot10^6,\qquad 10!=3628800>3\cdot10^6`, why: String.raw`$9!$ is too small; $10!$ is the first factorial above $3\cdot10^6$.` },
              { kind: 'result', label: String.raw`$n = 10 - 1$`, from: String.raw`n+1=\T{k-1}{10}`, to: String.raw`n=\T{k-1}{10}-1=9`, arrows: { 'k-1': '' }, why: 'Solve for $n$.' },
            ] },
          ] },
        { label: '(c)', prompt: String.raw`$\cos(0.2) \approx 1 - \frac{0.2^2}{2} = 0.98$. Since $P_2 = P_3$ for cosine, the error is $|R_3(0.2)|$. Give the Lagrange bound with $M = 1$.`, kind: 'numeric', answer: '0.2^4/24', tol: 1e-7,
          hints: [String.raw`Same as Example 2 in "The Lagrange remainder" ($\cos 0.3$).`, String.raw`$R_3$ uses $f^{(4)} = \cos$, and $|\cos t| \le 1$.`, String.raw`$\frac{1\cdot 0.2^4}{4!}$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Lagrange with $n = 3$, $M = 1$, then plug in.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`Lagrange with $n = 3$`, from: String.raw`R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}x^{n+1}\qquad n=3,\ x=0.2`, to: String.raw`R_3(0.2)=\frac{f^{(4)}(\xi)}{4!}(0.2)^4,\qquad f^{(4)}=\cos`, why: 'Lagrange with $n = 3$.' },
              { kind: 'result', label: 'Choose $M$', from: String.raw`|f^{(4)}(\xi)|=|\cos\xi|`, to: String.raw`|\cos\xi|\le 1=M`, why: 'Cosine is at most 1 in size.' },
              { kind: 'sub', label: 'Plug in', from: String.raw`|R_3(0.2)|\le\frac{\T{M-1}{M}\cdot 0.2^4}{4!}`, to: String.raw`|R_3(0.2)|\le\frac{\T{M-1}{1}\cdot 0.0016}{24}\approx 6.67\cdot10^{-5}`, why: String.raw`$0.2^4 = 0.0016$, $4! = 24$. (The same as the first omitted term of the alternating series.)` },
            ] },
          ] },
        { label: '(d)', prompt: String.raw`$\arctan(0.2) \approx 0.2 - \frac{0.2^3}{3}$. Which statement is justified?`, kind: 'choice', choices: [String.raw`The error is at most $\frac{0.2^5}{5}$ and the approximation is too small.`, String.raw`The error is at most $\frac{0.2^5}{5}$ and the approximation is too large.`, String.raw`The error is at most $\frac{0.2^3}{3}$; its sign is unknown.`, String.raw`No bound is possible since $\arctan$ has radius $1$.`], answer: 0,
          hints: [String.raw`Same as the guided exercise $\ln(1.2)$ in "The alternating-series bound".`, String.raw`The first omitted term is $+\frac{0.2^5}{5}$. What does its sign say?`],
          solution: String.raw`At $x = 0.2$ the series alternates with $b_n = \frac{0.2^{2n+1}}{2n+1}$ decreasing to $0$. The first omitted term $+\frac{0.2^5}{5}$ is positive, so the remainder is positive: the approximation is too small by at most $6.4\cdot10^{-5}$.` },
      ],
    },
    {
      id: 'a1',
      title: 'Taylor polynomials of sec x and a remainder estimate',
      difficulty: 'challenge',
      hw: 'HW6-style',
      examples: ['taylor-trig', 'taylor-polynomials', 'remainder-shifted'],
      statement: String.raw`<p>Let $f(x) = \sec x = \dfrac{1}{\cos x}$ and $a = \dfrac{\pi}{3}$. You may use $f' = \sec x\tan x$, $f'' = 2\sec^3 x - \sec x$ and $f''' = \sec x\tan x\,(6\sec^2 x - 1)$. Enter polynomials in MATLAB syntax in powers of <code>(x-pi/3)</code>.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$P_1(x)$`, kind: 'expression', variable: 'x', answer: '2 + 2*sqrt(3)*(x-pi/3)', domain: [0.9, 1.2],
          hints: [String.raw`Same as the guided exercise $\sec x$ at $\frac\pi4$, now at $\frac\pi3$.`, String.raw`$\sec\frac\pi3 = 2$ and $\tan\frac\pi3 = \sqrt3$.`, String.raw`$f(a) = 2$, $f'(a) = 2\sqrt3$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Exact values at $\frac\pi3$, then $c_0 = f(a)$ and $c_1 = f'(a)$.</p>` },
            { type: 'derive', steps: [
              { kind: 'calc', label: 'Exact values', from: String.raw`\cos\tfrac\pi3=\tfrac12`, to: String.raw`\sec\tfrac\pi3=\frac{1}{1/2}=2,\qquad\tan\tfrac\pi3=\sqrt3`, why: 'Exact values (refresher).' },
              { kind: 'sub', label: String.raw`Evaluate $f$ and $f' = \sec\tan$`, from: String.raw`f=\sec x,\qquad f'=\T{s-1}{\sec x}\,\T{t-1}{\tan x}`, to: String.raw`f(a)=2,\qquad f'(a)=\T{s-1}{2}\cdot\T{t-1}{\sqrt3}=2\sqrt3`, why: String.raw`Put $\sec a = 2$ and $\tan a = \sqrt 3$ in.` },
              { kind: 'sub', label: 'Assemble', from: String.raw`P_1(x)=\T{c-0}{f(a)}+\T{c-1}{f'(a)}\left(x-\tfrac\pi3\right)`, to: String.raw`P_1(x)=\T{c-0}{2}+\T{c-1}{2\sqrt3}\left(x-\tfrac\pi3\right)`, why: String.raw`$c_0 = f(a)$, $c_1 = \frac{f'(a)}{1!}$.` },
            ] },
          ] },
        { label: '(b)', prompt: String.raw`$P_2(x)$`, kind: 'expression', variable: 'x', answer: '2 + 2*sqrt(3)*(x-pi/3) + 7*(x-pi/3).^2', domain: [0.9, 1.2],
          hints: [String.raw`Add the term $\frac{f''(a)}{2!}\left(x - \frac\pi3\right)^2$ to $P_1$.`, String.raw`$f''(a) = 2\sec^3 a - \sec a$ with $\sec a = 2$.`, String.raw`$f''(a) = 2\cdot 8 - 2 = 14$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Evaluate $f''$ at $a$, divide by $2!$, add the new term to $P_1$.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`Put $\sec a = 2$`, from: String.raw`f''(a)=2\,\T{s-1}{\sec^3 a}-\T{s-2}{\sec a}`, to: String.raw`f''(a)=2\cdot\T{s-1}{2^3}-\T{s-2}{2}`, why: String.raw`Substitute $\sec a = 2$.` },
              { kind: 'calc', label: String.raw`$2\cdot 8 - 2$`, to: String.raw`f''(a)=16-2=14`, why: String.raw`$2^3 = 8$.` },
              { kind: 'calc', label: String.raw`Divide by $2!$`, from: String.raw`c_2=\frac{f''(a)}{2!}`, to: String.raw`c_2=\frac{14}{2}=7`, why: 'Divide by $2! = 2$.' },
              { kind: 'result', label: 'Add the new term', from: String.raw`P_2=P_1+c_2\left(x-\tfrac\pi3\right)^2`, to: String.raw`P_2(x)=2+2\sqrt3\left(x-\tfrac\pi3\right)+7\left(x-\tfrac\pi3\right)^2`, why: String.raw`$P_1$ plus the new term.` },
            ] },
          ] },
        { label: '(c)', prompt: String.raw`$P_3(x)$`, kind: 'expression', variable: 'x', answer: '2 + 2*sqrt(3)*(x-pi/3) + 7*(x-pi/3).^2 + 23*sqrt(3)/3*(x-pi/3).^3', domain: [0.9, 1.2],
          hints: [String.raw`Add $\frac{f'''(a)}{3!}\left(x - \frac\pi3\right)^3$.`, String.raw`$f'''(a) = \sec a\tan a\,(6\sec^2 a - 1)$ with $\sec a = 2$, $\tan a = \sqrt 3$.`, String.raw`$f'''(a) = 2\sqrt3\,(24 - 1) = 46\sqrt3$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Evaluate $f'''$ at $a$, divide by $3!$, add the new term to $P_2$.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: 'Put in the exact values', from: String.raw`f'''(a)=\T{s-1}{\sec a}\,\T{t-1}{\tan a}\,(6\,\T{q-1}{\sec^2 a}-1)`, to: String.raw`f'''(a)=\T{s-1}{2}\cdot\T{t-1}{\sqrt3}\cdot(6\cdot\T{q-1}{4}-1)`, why: String.raw`Substitute $\sec a = 2$ ($\sec^2 a = 4$) and $\tan a = \sqrt3$.` },
              { kind: 'calc', label: String.raw`$6\cdot 4 - 1 = 23$`, to: String.raw`f'''(a)=2\sqrt3\cdot 23=46\sqrt3`, why: 'Multiply.' },
              { kind: 'calc', label: String.raw`Divide by $3!$`, from: String.raw`c_3=\frac{46\sqrt3}{3!}`, to: String.raw`c_3=\frac{46\sqrt3}{6}`, why: String.raw`$3! = 6$.` },
              { kind: 'cancel', label: 'Cancel 2', from: String.raw`c_3=\frac{\T{t-1}{2}\cdot 23\sqrt3}{\T{t-2}{2}\cdot 3}`, to: String.raw`c_3=\frac{23\sqrt3}{3}`, why: String.raw`$46 = 2\cdot 23$ and $6 = 2\cdot 3$.` },
              { kind: 'result', label: 'Add the new term', from: String.raw`P_3=P_2+c_3\left(x-\tfrac\pi3\right)^3`, to: String.raw`P_3(x)=P_2(x)+\frac{23\sqrt3}{3}\left(x-\tfrac\pi3\right)^3`, why: 'Add the new term.' },
            ] },
          ] },
        { label: '(d)', prompt: String.raw`$P_2\!\left(\frac\pi3 - 0.1\right)$`, kind: 'numeric', answer: '2 - 0.2*sqrt(3) + 0.07', tol: 1e-6,
          hints: [String.raw`Put $x - \frac\pi3 = -0.1$ into $P_2$.`, String.raw`$2 + 2\sqrt3\cdot(-0.1) + 7\cdot(-0.1)^2$.`, String.raw`$= 2 - 0.2\sqrt3 + 0.07$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Put $x - \frac\pi3 = -0.1$ into $P_2$.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`Put $x - \frac\pi3 = -0.1$`, from: String.raw`P_2(x)=2+2\sqrt3\,\T{h-1}{\left(x-\tfrac\pi3\right)}+7\,\T{h-2}{\left(x-\tfrac\pi3\right)}^2`, to: String.raw`P_2=2+2\sqrt3\,\T{h-1}{(-0.1)}+7\,\T{h-2}{(-0.1)}^2`, why: String.raw`At $x = \frac\pi3 - 0.1$, $x - \frac\pi3 = -0.1$.` },
              { kind: 'calc', label: String.raw`$(-0.1)^2 = 0.01$`, to: String.raw`P_2=2-0.2\sqrt3+7\cdot 0.01`, why: String.raw`$2\cdot(-0.1) = -0.2$ and $(-0.1)^2 = 0.01$.` },
              { kind: 'calc', label: 'Add', to: String.raw`P_2=2.07-0.2\sqrt3\approx 2.07-0.346410=1.723590`, why: String.raw`$0.2\sqrt3 \approx 0.346410$.` },
            ] },
          ] },
        { label: '(e)', prompt: String.raw`The Lagrange bound for $\left|R_2\!\left(\frac\pi3 - 0.1\right)\right|$, with $M$ the maximum of $|f'''|$ on $\left[\frac\pi3 - 0.1, \frac\pi3\right]$.`, kind: 'numeric', answer: '46*sqrt(3)*0.1^3/6', tol: 1e-4,
          hints: [String.raw`Same as the last steps of the $\tan x$ example in "Taylor polynomials of tan and sec".`, String.raw`On $\left(0, \frac\pi2\right)$, $f''' = \sec\tan(6\sec^2 - 1)$ is a product of positive increasing factors. Where is it largest on the interval?`, String.raw`$M = f'''\left(\frac\pi3\right) = 46\sqrt3$; bound $\frac{M\cdot 0.1^3}{3!}$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Lagrange with $n = 2$; $M$ at the right end, because $f'''$ is increasing.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`Lagrange with $n = 2$`, from: String.raw`R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}`, to: String.raw`R_2=\frac{f'''(\xi)}{3!}(-0.1)^3,\qquad\xi\in\left(\tfrac\pi3-0.1,\ \tfrac\pi3\right)`, why: 'Lagrange with $n = 2$.' },
              { kind: 'result', label: 'Choose $M$', from: String.raw`\sec t,\ \tan t,\ 6\sec^2 t-1\ \text{positive and increasing on}\ \left(0,\tfrac\pi2\right)`, to: String.raw`M=f'''\!\left(\tfrac\pi3\right)=46\sqrt3\approx 79.67`, why: String.raw`$\cos t$ decreases from 1 to 0 there, so $\sec t = 1/\cos t$ increases; $\tan t$ increases. An increasing function is largest at the right end of the interval.` },
              { kind: 'sub', label: 'Plug in', from: String.raw`|R_2|\le\frac{\T{M-1}{M}\cdot 0.1^3}{3!}`, to: String.raw`|R_2|\le\frac{\T{M-1}{46\sqrt3}\cdot 0.001}{6}\approx 0.01328`, why: String.raw`$0.1^3 = 0.001$, $3! = 6$.` },
            ] },
          ] },
        { label: '(f)', prompt: String.raw`Write the full solution as a Live Script: derivative table, $P_1$–$P_3$, the remainder estimate with a justified $M$, and a MATLAB comparison with the true error.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 1 (Attempted)' },
        { type: 'text', content: String.raw`We compute the derivatives of $f(x) = \sec x$ and evaluate them at $a = \frac\pi3$, where $\sec a = 2$ and $\tan a = \sqrt3$:` },
        { type: 'equation', content: String.raw`f(a) = 2,\quad f'(a) = \sec a\tan a = 2\sqrt3,\quad f''(a) = 2\sec^3 a - \sec a = 14,\quad f'''(a) = \sec a\tan a\,(6\sec^2 a - 1) = 46\sqrt3 .` },
        { type: 'text', content: 'Dividing by $k!$ gives the Taylor polynomials:' },
        { type: 'equation', content: String.raw`P_1(x) = 2 + 2\sqrt3\left(x - \tfrac\pi3\right), \quad P_2(x) = P_1(x) + 7\left(x - \tfrac\pi3\right)^2, \quad P_3(x) = P_2(x) + \frac{23\sqrt3}{3}\left(x - \tfrac\pi3\right)^3 .` },
        { type: 'text', content: String.raw`At $x = \frac\pi3 - 0.1$ we get $P_2(x) = 2 - 0.2\sqrt3 + 0.07 \approx 1.723590$. By Taylor's theorem $R_2(x) = \frac{f'''(\xi)}{3!}(-0.1)^3$ for some $\xi \in \left(\frac\pi3 - 0.1, \frac\pi3\right)$. On $(0, \frac\pi2)$ the functions $\sec t$, $\tan t$ and $6\sec^2 t - 1$ are positive and increasing, so $f'''$ is increasing there and its maximum on the interval is $M = f'''(\frac\pi3) = 46\sqrt3$. Hence` },
        { type: 'equation', content: String.raw`\left|R_2\left(\tfrac\pi3 - 0.1\right)\right| \le \frac{46\sqrt3\cdot 0.1^3}{3!} \approx 0.01328 .` },
        { type: 'text', content: String.raw`Since $f'''(\xi) > 0$ and $(-0.1)^3 < 0$, the remainder is negative: $P_2$ overestimates. We compare with the true values:` },
        { type: 'code', content: String.raw`a = pi/3;  x = a - 0.1;  h = x - a;
P2 = 2 + 2*sqrt(3)*h + 7*h^2;
P3 = P2 + 23*sqrt(3)/3*h^3;
f3 = @(t) sec(t).*tan(t).*(6*sec(t).^2 - 1);
M = max(f3(linspace(x, a, 1001)));
fprintf('sec(x) = %.6f, P2 = %.6f, R2 = %.6f, bound = %.6f\n', sec(x), P2, sec(x) - P2, M*0.1^3/6)
fprintf('P3 = %.6f, R3 = %.6f\n', P3, sec(x) - P3)` },
      ],
    },
    {
      id: 'a4',
      title: 'Capstone I — sequences and series',
      difficulty: 'exam',
      examples: ['review-sequences', 'review-sums', 'alternating/ratio-factorial', 'alternating/root-test'],
      statement: String.raw`<p>Exam-style review of the series part. Verify the pre-conditions of every test you use.</p>`,
      parts: [
        { label: '(a)', prompt: String.raw`$\displaystyle\lim_{n\to\infty}\left(\frac{3n-1}{3n+2}\right)^n$`, kind: 'numeric', answer: 'exp(-1)', tol: 1e-6,
          hints: [String.raw`A $1^\infty$ form: same as Example 1 in "Review: limits of sequences".`, String.raw`$\ln a_n = \frac{\ln(3x-1) - \ln(3x+2)}{1/x}$; use L'Hôpital.`, String.raw`Numerator$'$ $= \frac{3}{3x-1} - \frac{3}{3x+2} = \frac{9}{(3x-1)(3x+2)}$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Take the logarithm, write it as a $\frac00$ quotient, use L'Hôpital, exponentiate.</p>` },
            { type: 'derive', steps: [
              { kind: 'both', label: String.raw`$\ln$ of both sides`, from: String.raw`a_n=\left(\frac{3n-1}{3n+2}\right)^{\T{n-1}{n}}`, to: String.raw`\ln a_n=\T{n-1}{n}\,\ln\frac{3n-1}{3n+2}`, arrows: { 'n-1': 'the exponent comes down' }, why: 'Take the logarithm; $\\ln(b^n) = n\\ln b$.' },
              { kind: 'factor', label: 'Write as a quotient', to: String.raw`\ln a_n=\frac{\ln(3n-1)-\ln(3n+2)}{\T{n-1}{1/n}}`, arrows: { 'n-1': 'n = 1/(1/n)' }, why: String.raw`$\ln\frac pq = \ln p - \ln q$; multiplying by $n$ is dividing by $\frac1n$.` },
              { kind: 'sub', label: String.raw`Replace $n$ by $x$`, to: String.raw`\frac{\ln(3x-1)-\ln(3x+2)}{1/x}\ \to\ \frac00`, why: 'Replace $n$ by $x$ to differentiate; top and bottom both tend to 0.' },
              { kind: 'calculus', label: 'Differentiate the numerator', from: String.raw`\big(\ln(3x-1)-\ln(3x+2)\big)'`, to: String.raw`\frac{3}{3x-1}-\frac{3}{3x+2}`, why: 'Chain rule for each logarithm.' },
              { kind: 'calc', label: 'Common denominator', to: String.raw`\frac{3(3x+2)-3(3x-1)}{(3x-1)(3x+2)}=\frac{9}{(3x-1)(3x+2)}`, why: String.raw`$9x + 6 - 9x + 3 = 9$.` },
              { kind: 'calculus', label: 'Differentiate the denominator', from: String.raw`\left(\frac1x\right)'`, to: String.raw`-\frac{1}{x^2}`, why: String.raw`Derivative of $x^{-1}$.` },
              { kind: 'calc', label: String.raw`L'Hôpital: divide the derivatives`, from: String.raw`\frac{\frac{9}{(3x-1)(3x+2)}}{\T{d-1}{-\frac{1}{x^2}}}`, to: String.raw`\frac{9}{(3x-1)(3x+2)}\cdot\T{d-1}{(-x^2)}=-\frac{9x^2}{(3x-1)(3x+2)}`, arrows: { 'd-1': 'flip, then multiply' }, why: String.raw`Dividing by $-\frac1{x^2}$ is multiplying by $-x^2$.` },
              { kind: 'factor', label: String.raw`Divide by $x^2$`, from: String.raw`\frac{9}{(3x-1)(3x+2)}\cdot(-x^2)=-\frac{9x^2}{(3x-1)(3x+2)}`, to: String.raw`-\frac{9}{(3-1/x)(3+2/x)}\ \to\ -\frac99=-1`, why: 'Divide numerator and denominator by $x^2$ to take the limit.' },
              { kind: 'result', label: 'Exponentiate', from: String.raw`\ln a_n\to -1`, to: String.raw`a_n\to e^{-1}`, why: 'Exponentiate.' },
            ] },
          ] },
        { label: '(b)', prompt: String.raw`$a_1 = 2$, $a_{n+1} = 4 - \dfrac{3}{a_n}$. Find $\lim a_n$.`, kind: 'numeric', answer: '3',
          hints: [String.raw`Same type as Example 2 in "Review: limits of sequences".`, String.raw`Show $2 \le a_n < 3$ and that the sequence increases; then solve $L = 4 - \frac3L$.`, String.raw`$L^2 - 4L + 3 = (L-1)(L-3) = 0$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Bound by induction, show the sequence increases, then solve $L = 4 - \frac3L$.</p>` },
            { type: 'derive', steps: [
              { kind: 'result', label: 'Induction step, part 1', from: String.raw`2\le a_n<3`, to: String.raw`1<\frac{3}{a_n}\le\frac32`, why: String.raw`Dividing 3 by a number in $[2, 3)$ gives a number in $\left(1, \frac32\right]$.` },
              { kind: 'result', label: 'Induction step, part 2', to: String.raw`\frac52\le a_{n+1}=4-\frac{3}{a_n}<3`, why: String.raw`Subtracting from 4 flips the order. $a_1 = 2$ starts the induction, so $2 \le a_n < 3$ for all $n$.` },
              { kind: 'calc', label: String.raw`Common denominator $a_n$`, from: String.raw`a_{n+1}-a_n=4-\frac{3}{a_n}-a_n`, to: String.raw`a_{n+1}-a_n=\frac{4a_n-3-a_n^2}{a_n}`, why: String.raw`$4 = \frac{4a_n}{a_n}$ and $a_n = \frac{a_n^2}{a_n}$.` },
              { kind: 'factor', label: 'Factor', to: String.raw`a_{n+1}-a_n=-\frac{(a_n-1)(a_n-3)}{a_n}>0`, why: String.raw`$a^2 - 4a + 3 = (a-1)(a-3)$; for $2 \le a_n < 3$ the fraction is negative, so the difference is positive.` },
              { kind: 'result', label: 'Monotone convergence', from: String.raw`\text{increasing and bounded above}`, to: String.raw`a_n\to L`, why: 'Monotone convergence theorem.' },
              { kind: 'sub', label: String.raw`Let $n\to\infty$ in the recursion`, from: String.raw`a_{n+1}=4-\frac{3}{a_n}`, to: String.raw`L=4-\frac{3}{L}`, why: String.raw`Both $a_{n+1}$ and $a_n$ tend to $L$.` },
              { kind: 'both', label: String.raw`Both sides $\times L$`, from: String.raw`L=4-\frac{3}{L}`, to: String.raw`L^2=4L-3`, why: 'Clear the fraction ($L \\ge 2$, so $L \\ne 0$).' },
              { kind: 'both', label: String.raw`Both sides $-4L+3$`, to: String.raw`L^2-4L+3=0`, why: 'Collect everything on the left.' },
              { kind: 'factor', label: 'Factor', to: String.raw`(L-1)(L-3)=0\iff L\in\{1,\ 3\}`, why: 'A product is zero when one factor is zero.' },
              { kind: 'result', label: 'Choose the root', to: String.raw`L=3`, why: String.raw`All terms are $\ge 2$, so $L \ge 2$.` },
            ] },
          ] },
        { label: '(c)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{2^n + 3^n}{6^n}$`, kind: 'numeric', answer: '3/2',
          hints: [String.raw`Same as Example 1 in "Review: geometric and telescoping sums".`, String.raw`Split into $\left(\frac{2}{6}\right)^n + \left(\frac36\right)^n$.`, String.raw`$\sum_{n\ge1} r^n = \frac{r}{1-r}$ with $r = \frac13$ and $r = \frac12$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Split into two geometric series and sum each from $n = 1$.</p>` },
            { type: 'derive', steps: [
              { kind: 'factor', label: 'Split the fraction', from: String.raw`\frac{2^n+3^n}{6^n}`, to: String.raw`\frac{2^n}{6^n}+\frac{3^n}{6^n}`, why: 'Split into two fractions.' },
              { kind: 'factor', label: 'One power each', to: String.raw`\left(\frac13\right)^n+\left(\frac12\right)^n`, why: String.raw`$\frac{a^n}{b^n} = \left(\frac ab\right)^n$, $\frac26 = \frac13$, $\frac36 = \frac12$.` },
              { kind: 'sub', label: String.raw`Geometric with $r = \frac13$`, from: String.raw`\sum_{n=1}^\infty r^n=\frac{r}{1-r}\qquad r=\tfrac13`, to: String.raw`\sum_{n=1}^\infty\left(\tfrac13\right)^n=\frac{1/3}{2/3}=\frac12`, why: 'Geometric from $n = 1$.' },
              { kind: 'sub', label: String.raw`Geometric with $r = \frac12$`, from: String.raw`\sum_{n=1}^\infty r^n=\frac{r}{1-r}\qquad r=\tfrac12`, to: String.raw`\sum_{n=1}^\infty\left(\tfrac12\right)^n=\frac{1/2}{1/2}=1`, why: 'Geometric from $n = 1$.' },
              { kind: 'calc', label: 'Add', from: String.raw`\frac12+1`, to: String.raw`\frac12+1=\frac32`, why: 'Add the two convergent sums.' },
            ] },
          ] },
        { label: '(d)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \frac{1}{4n^2 - 1}$`, kind: 'numeric', answer: '1/2',
          hints: [String.raw`Factor: $4n^2 - 1 = (2n-1)(2n+1)$; then it is the telescoping type of Example 2.`, String.raw`$\frac{1}{(2n-1)(2n+1)} = \frac12\left(\frac{1}{2n-1} - \frac{1}{2n+1}\right)$.`, String.raw`$S_N = \frac12\left(1 - \frac{1}{2N+1}\right)$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Factor, split into partial fractions, telescope.</p>` },
            { type: 'derive', steps: [
              { kind: 'factor', label: 'Difference of squares', from: String.raw`4n^2-1`, to: String.raw`(2n-1)(2n+1)`, why: String.raw`$a^2 - b^2 = (a-b)(a+b)$ with $a = 2n$, $b = 1$.` },
              { kind: 'both', label: 'Both sides × the denominator', from: String.raw`\frac{1}{(2n-1)(2n+1)}=\frac{A}{2n-1}+\frac{B}{2n+1}`, to: String.raw`1=A(2n+1)+B(2n-1)`, why: 'Partial fractions: multiply both sides by $(2n-1)(2n+1)$.' },
              { kind: 'sub', label: String.raw`$n = \frac12$`, from: String.raw`1=A(2n+1)+B(2n-1)\qquad n=\tfrac12`, to: String.raw`1=2A\ \Rightarrow\ A=\tfrac12`, why: 'Cover-up: this makes the $B$ bracket zero.' },
              { kind: 'sub', label: String.raw`$n = -\frac12$`, from: String.raw`1=A(2n+1)+B(2n-1)\qquad n=-\tfrac12`, to: String.raw`1=-2B\ \Rightarrow\ B=-\tfrac12`, why: 'Cover-up: this makes the $A$ bracket zero.' },
              { kind: 'expand', label: 'Write the partial sum out', from: String.raw`S_N=\frac12\sum_{n=1}^N\left(\frac{1}{2n-1}-\frac{1}{2n+1}\right)`, to: String.raw`S_N=\frac12\left[\left(1-\T{c-1}{\tfrac13}\right)+\left(\T{c-2}{\tfrac13}-\T{d-1}{\tfrac15}\right)+\cdots+\left(\T{e-1}{\cdots}-\tfrac{1}{2N+1}\right)\right]`, why: 'Write the partial sum out.' },
              { kind: 'cancel', label: 'Neighbours cancel', to: String.raw`S_N=\frac12\left(1-\frac{1}{2N+1}\right)`, why: 'Telescoping: each negative piece cancels the positive piece of the next bracket.' },
              { kind: 'calc', label: String.raw`Let $N\to\infty$`, to: String.raw`S_N=\frac12\left(1-\frac{1}{2N+1}\right)\ \to\ \frac12`, why: String.raw`$\frac{1}{2N+1} \to 0$.` },
            ] },
          ] },
        { label: '(e)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty (-1)^n\frac{(n!)^2}{(2n)!}$ is`, kind: 'choice', choices: ['absolutely convergent', 'conditionally convergent', 'divergent'], answer: 0,
          hints: [String.raw`Factorials: ratio test (module 20, "The ratio test with factorials").`, String.raw`$\left|\frac{a_{n+1}}{a_n}\right| = \frac{(n+1)^2}{(2n+2)(2n+1)}$.`, String.raw`$= \frac{n+1}{2(2n+1)} \to \frac14$.`],
          solution: String.raw`Ratio test: $\frac{(n+1)^2}{(2n+2)(2n+1)} \to \frac14 < 1$, so the series converges absolutely.` },
        { label: '(f)', prompt: String.raw`$\displaystyle\sum_{n=1}^\infty \left(\frac{n+1}{n}\right)^{n^2}$ is`, kind: 'choice', choices: ['convergent by the root test', 'divergent by the root test', 'the root test is inconclusive', 'convergent by comparison with a geometric series'], answer: 1,
          hints: [String.raw`The exponent is $n^2$: root test, as in Example 2 of "The root test" (module 20).`, String.raw`$\sqrt[n]{a_n} = \left(1 + \frac1n\right)^{n}$. What is its limit?`],
          solution: String.raw`$\sqrt[n]{a_n} = \left(1 + \frac1n\right)^n \to e > 1$: divergent by the root test.` },
      ],
    },
    {
      id: 'a5',
      title: 'Capstone II — power series and Taylor remainders',
      difficulty: 'exam',
      hw: 'HW6-style',
      examples: ['erf-integrals', 'power-series/interval'],
      statement: String.raw`<p>(i) Consider $\displaystyle\sum_{n=1}^\infty \frac{(x-1)^n}{n\,4^n}$. (ii) Let $\displaystyle F(x) = \int_0^x \cos(t^2)\,\mathrm d t$.</p>`,
      parts: [
        { label: '(a)', prompt: '(i) The interval of convergence:', kind: 'choice', choices: [String.raw`$(-3, 5)$`, String.raw`$[-3, 5)$`, String.raw`$(-3, 5]$`, String.raw`$[-3, 5]$`], answer: 1,
          hints: [String.raw`Same as the example in "Interval of convergence" (power series module).`, String.raw`Ratio test: $|x - 1| < 4$. Then test $x = 5$ and $x = -3$.`, String.raw`$x = 5$: $\sum\frac1n$; $x = -3$: $\sum\frac{(-1)^n}{n}$.`],
          solution: String.raw`Ratio test: $|x - 1| < 4$. At $x = 5$: harmonic series, divergent. At $x = -3$: $\sum\frac{(-1)^n}{n}$, convergent by the alternating series test.` },
        { label: '(b)', prompt: String.raw`(ii) The coefficient of $x^9$ in the Maclaurin series of $F$.`, kind: 'numeric', answer: '1/216', tol: 1e-9,
          hints: [String.raw`Same steps as the guided exercise $\int_0^x \sin(t^2)\,\mathrm d t$.`, String.raw`$\cos(t^2) = \sum \frac{(-1)^n t^{4n}}{(2n)!}$; integrate term by term.`, String.raw`$F(x) = \sum \frac{(-1)^n x^{4n+1}}{(2n)!\,(4n+1)}$; $x^9$ needs $n = 2$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Substitute $t^2$ into the cosine series, integrate term by term, pick the term with $x^9$.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`Substitute $u = t^2$`, from: String.raw`\cos u=\sum_{n=0}^\infty\frac{(-1)^n u^{2n}}{(2n)!}\qquad\qquad u=\T{u-1}{t^2}`, to: String.raw`\cos(t^2)=\sum_{n=0}^\infty\frac{(-1)^n\,\T{u-1}{(t^2)}^{2n}}{(2n)!}`, arrows: { 'u-1': 'u = t²' }, why: String.raw`Substitute $u = t^2$ into the cosine series.` },
              { kind: 'expand', label: String.raw`$(t^2)^{2n} = t^{4n}$`, from: String.raw`\cos(t^2)=\sum_{n=0}^\infty\frac{(-1)^n\,(t^2)^{2n}}{(2n)!}`, to: String.raw`\cos(t^2)=\sum_{n=0}^\infty\frac{(-1)^n t^{4n}}{(2n)!}`, why: 'Multiply the exponents.' },
              { kind: 'calculus', label: 'Integrate term by term', from: String.raw`F(x)=\sum_{n=0}^\infty\frac{(-1)^n}{(2n)!}\T{i-1}{\int_0^x t^{4n}\,\mathrm d t}`, to: String.raw`F(x)=\sum_{n=0}^\infty\frac{(-1)^n}{(2n)!}\cdot\T{i-1}{\frac{x^{4n+1}}{4n+1}}`, why: String.raw`$\int_0^x t^{4n}\,\mathrm d t = \frac{x^{4n+1}}{4n+1}$.` },
              { kind: 'calc', label: String.raw`Which $n$ gives $x^9$?`, from: String.raw`4n+1=9`, to: String.raw`n=2`, why: 'The term with $x^9$.' },
              { kind: 'sub', label: String.raw`Put $n = 2$`, from: String.raw`\frac{(-1)^n}{(2n)!\,(4n+1)}\qquad n=2`, to: String.raw`\frac{(-1)^2}{4!\cdot 9}=\frac{1}{24\cdot 9}=\frac{1}{216}`, why: String.raw`$4! = 24$, $24\cdot 9 = 216$.` },
            ] },
          ] },
        { label: '(c)', prompt: '(ii) The radius of convergence of the series of $F$:', kind: 'choice', choices: [String.raw`$1$`, String.raw`$\sqrt[4]{2}$`, String.raw`$\pi$`, String.raw`$\infty$`], answer: 3,
          hints: ['For which arguments does the cosine series converge?', 'Integration term by term does not change the radius.'],
          solution: String.raw`The cosine series converges for all arguments, and integration keeps $R = \infty$.` },
        { label: '(d)', prompt: String.raw`(ii) The partial sum of the first three nonzero terms at $x = 1$.`, kind: 'numeric', answer: '1 - 1/10 + 1/216', tol: 1e-7,
          hints: [String.raw`Put $x = 1$ into the terms $n = 0, 1, 2$.`, String.raw`The denominators are $0!\cdot 1$, $2!\cdot 5$, $4!\cdot 9$.`, String.raw`$1 - \frac{1}{10} + \frac{1}{216}$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Put $x = 1$ into the terms $n = 0, 1, 2$ and add.</p>` },
            { type: 'derive', steps: [
              { kind: 'sub', label: String.raw`Terms $n = 0, 1, 2$ at $x = 1$`, from: String.raw`\frac{(-1)^n x^{4n+1}}{(2n)!\,(4n+1)}\qquad x=1`, to: String.raw`S_3=\frac{1}{0!\cdot 1}-\frac{1}{2!\cdot 5}+\frac{1}{4!\cdot 9}`, why: 'The first term and the next two with their signs.' },
              { kind: 'calc', label: 'Denominators', to: String.raw`S_3=1-\frac{1}{10}+\frac{1}{216}`, why: String.raw`$2!\cdot 5 = 10$, $4!\cdot 9 = 216$.` },
              { kind: 'calc', label: 'Add', to: String.raw`S_3=1-0.1+0.0046296=0.9046296`, why: 'Add.' },
            ] },
          ] },
        { label: '(e)', prompt: String.raw`(ii) The alternating-series bound for the error of (d).`, kind: 'numeric', answer: '1/9360', tol: 1e-8,
          hints: ['The bound is the size of the first omitted term.', String.raw`The first omitted term is $n = 3$: $\frac{1}{6!\cdot 13}$.`, String.raw`$6! = 720$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>Check the conditions; the bound is the size of the first omitted term.</p>` },
            { type: 'derive', steps: [
              { kind: 'result', label: 'Check the conditions', from: String.raw`b_n=\frac{1}{(2n)!\,(4n+1)}`, to: String.raw`b_n>0,\quad\text{decreasing},\quad b_n\to 0`, why: String.raw`Both $(2n)!$ and $4n + 1$ increase: alternating series test.` },
              { kind: 'sub', label: String.raw`First omitted term, $n = 3$`, from: String.raw`|F(1)-S_3|\le b_3,\qquad b_n=\frac{1}{(2n)!\,(4n+1)}`, to: String.raw`|F(1)-S_3|\le\frac{1}{6!\cdot 13}`, why: String.raw`$2\cdot 3 = 6$ and $4\cdot 3 + 1 = 13$.` },
              { kind: 'calc', label: 'Multiply', to: String.raw`|F(1)-S_3|\le\frac{1}{720\cdot 13}=\frac{1}{9360}\approx 1.068\cdot10^{-4}`, why: String.raw`$6! = 720$.` },
            ] },
          ] },
        { label: '(f)', prompt: String.raw`(ii) The lower endpoint of the resulting interval for $F(1)$.`, kind: 'numeric', answer: '1 - 1/10 + 1/216 - 1/9360', tol: 1e-7,
          hints: ['Which sign does the first omitted term have?', String.raw`$(-1)^3 = -1$: the remainder is negative, so $F(1) < S_3$.`, String.raw`Lower endpoint $= S_3 - \frac{1}{9360}$.`],
          walkthrough: [
            { type: 'text', html: String.raw`<p>The sign of the first omitted term decides which side of $S_3$ the sum lies on.</p>` },
            { type: 'derive', steps: [
              { kind: 'calc', label: 'Sign of the first omitted term', from: String.raw`(-1)^3\,b_3`, to: String.raw`-b_3<0`, why: String.raw`$n = 3$ is odd.` },
              { kind: 'result', label: 'The interval', to: String.raw`S_3-b_3\le F(1)<S_3`, why: 'The remainder has the sign of the first omitted term.' },
              { kind: 'sub', label: 'Put in the numbers', to: String.raw`0.9046296-0.0001068=0.9045228\le F(1)<0.9046296`, why: 'Subtract.' },
            ] },
          ] },
        { label: '(g)', prompt: String.raw`Write (ii) as a Live Script: derive the series, its radius, $S_3$ at $x = 1$, verify the conditions of the alternating series test, give the interval for $F(1)$ and check it with <code>integral</code>.`, kind: 'writeup' },
      ],
      writeup: true,
      solution: [
        { type: 'heading', content: 'Problem 5 (Attempted)' },
        { type: 'text', content: String.raw`We substitute $t^2$ into the Maclaurin series of the cosine, which converges for every real argument:` },
        { type: 'equation', content: String.raw`\cos(t^2) = \sum_{n=0}^{\infty} \frac{(-1)^n t^{4n}}{(2n)!}, \qquad t \in \mathbb R .` },
        { type: 'text', content: 'Integrating term by term from $0$ to $x$ (allowed inside the interval of convergence, which is all of $\\mathbb R$) gives' },
        { type: 'equation', content: String.raw`F(x) = \sum_{n=0}^{\infty} \frac{(-1)^n x^{4n+1}}{(2n)!\,(4n+1)} = x - \frac{x^5}{10} + \frac{x^9}{216} - \frac{x^{13}}{9360} + \cdots,` },
        { type: 'text', content: String.raw`with radius of convergence $R = \infty$ (integration does not change the radius). At $x = 1$ the series is $\sum (-1)^n b_n$ with $b_n = \frac{1}{(2n)!\,(4n+1)}$. We check the alternating series test: $b_n > 0$; $b_{n+1} < b_n$ because both $(2n)!$ and $4n+1$ increase with $n$; and $b_n \to 0$. Therefore $|R| \le b_3$ for the partial sum of the first three terms:` },
        { type: 'equation', content: String.raw`S_3 = 1 - \frac{1}{10} + \frac{1}{216} \approx 0.9046296, \qquad |F(1) - S_3| \le \frac{1}{6!\cdot 13} = \frac{1}{9360} \approx 1.07\cdot 10^{-4}.` },
        { type: 'text', content: String.raw`The first omitted term $-b_3$ is negative, so the remainder is negative and $0.9045228 \le F(1) < 0.9046296$. We verify with numerical integration:` },
        { type: 'code', content: String.raw`S3 = 1 - 1/10 + 1/216;
b3 = 1/(factorial(6)*13);
F1 = integral(@(t) cos(t.^2), 0, 1);
fprintf('[%.7f, %.7f], integral = %.7f\n', S3 - b3, S3, F1)` },
      ],
    },
  ],
};
