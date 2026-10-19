// LaTeX and MATLAB quick reference page.

export const REFERENCE = [
  { type: 'text', html: String.raw`<p>Everything you need to write homework and exam answers in the MATLAB Live Editor. Equations: <b>Ctrl+Shift+L</b> (LaTeX editor) or Ctrl+Shift+E (graphical editor). Toggle text/code: <b>Alt+Enter</b>. Run a section: <b>Ctrl+Enter</b>.</p>` },
  { type: 'table', head: ['You type (LaTeX)', 'You get'], rows: [
    [String.raw`<code>\frac{n}{d}</code>`, String.raw`$\frac{n}{d}$`],
    [String.raw`<code>x^{2n}</code>, <code>a_{k+1}</code>`, String.raw`$x^{2n}$, $a_{k+1}$`],
    [String.raw`<code>\sqrt{x}</code>, <code>\sqrt[3]{x}</code>`, String.raw`$\sqrt{x}$, $\sqrt[3]{x}$`],
    [String.raw`<code>\sin x</code>, <code>\cos</code>, <code>\tan</code>, <code>\ln</code>, <code>\log</code>, <code>e^{-x^2}</code>`, String.raw`$\sin x,\ \cos,\ \tan,\ \ln,\ \log,\ e^{-x^2}$`],
    [String.raw`<code>\sin^{-1} x</code> or <code>\arcsin x</code>`, String.raw`$\sin^{-1} x$, $\arcsin x$`],
    [String.raw`<code>\int_a^b f(x)\,\mathrm d x</code>`, String.raw`$\int_a^b f(x)\,\mathrm d x$`],
    [String.raw`<code>\Big[ F(x) \Big]_a^b</code>`, String.raw`$\Big[ F(x) \Big]_a^b$`],
    [String.raw`<code>\lim_{x \to a} f(x)</code>`, String.raw`$\lim_{x \to a} f(x)$`],
    [String.raw`<code>\sum_{n=1}^{\infty} a_n</code>`, String.raw`$\sum_{n=1}^{\infty} a_n$`],
    [String.raw`<code>\frac{\mathrm d y}{\mathrm d x}</code>, <code>y'</code>, <code>y''</code>`, String.raw`$\frac{\mathrm d y}{\mathrm d x}$, $y'$, $y''$`],
    [String.raw`<code>\left( \frac{a}{b} \right)</code>`, String.raw`$\left( \frac{a}{b} \right)$`],
    [String.raw`<code>\cdot</code>, <code>\times</code>, <code>\pm</code>, <code>\approx</code>, <code>\le</code>, <code>\ge</code>, <code>\ne</code>`, String.raw`$\cdot\ \times\ \pm\ \approx\ \le\ \ge\ \ne$`],
    [String.raw`<code>\alpha \beta \gamma \pi \theta \omega \varepsilon</code>`, String.raw`$\alpha\ \beta\ \gamma\ \pi\ \theta\ \omega\ \varepsilon$`],
    [String.raw`<code>\infty</code>, <code>\to</code>, <code>\Rightarrow</code>, <code>\in</code>, <code>\mathbb{R}</code>`, String.raw`$\infty,\ \to,\ \Rightarrow,\ \in,\ \mathbb{R}$`],
    [String.raw`<code>\mathrm{Si}(x)</code>, <code>\mathrm{erf}(x)</code>`, String.raw`$\mathrm{Si}(x)$, $\mathrm{erf}(x)$`],
    [String.raw`<code>|x|</code>, <code>\left| x \right|</code>`, String.raw`$|x|$, $\left| x \right|$`],
    [String.raw`<code>f(x)=\begin{cases} -x &amp; x&lt;0 \\ x &amp; x \ge 0 \end{cases}</code>`, String.raw`$f(x)=\begin{cases} -x & x<0 \\ x & x \ge 0 \end{cases}$`],
    [String.raw`<code>\,</code> (small space before d<i>x</i>), <code>\quad</code>`, String.raw`$f(x)\,\mathrm dx$`],
  ] },
  { type: 'callout', kind: 'matlab', title: 'MATLAB essentials', html: String.raw`<ul>
<li><code>f = @(x) x.^2 .* exp(-x);</code> — anonymous function. Use <b>element-wise</b> <code>.*  ./  .^</code> so it works on vectors.</li>
<li><code>fplot(f, [0 5])</code>, <code>plot(x, y)</code>, <code>hold on</code>, <code>grid on</code>, <code>xlim([a b])</code>, <code>legend(...)</code>, <code>title(...)</code></li>
<li><code>integral(f, a, b)</code> — numerical integral (also with <code>Inf</code>); <code>trapz(x, y)</code> — trapezoid rule on data</li>
<li><code>fzero(f, x0)</code> — a root near <code>x0</code>; <code>roots([1 -6 11 -6])</code> — all roots of a polynomial</li>
<li><code>[t, y] = ode45(@(t,y) -2*y, [0 5], 1);</code> — numerical ODE solution; systems use column vectors <code>[y(2); -y(1)]</code></li>
<li><code>[X, Y] = meshgrid(xs, ys); quiver(X, Y, U, V)</code> — slope / direction fields</li>
<li><code>n = 1:20; S = cumsum(1./n.^2);</code> — partial sums of a series</li>
<li><code>fprintf('I = %.6f\n', I)</code>, <code>format long</code></li>
<li>No <code>syms</code>: the Symbolic Math Toolbox is not allowed in homework or exams.</li>
</ul>` },
  { type: 'code', caption: 'A typical "check by computer" block from a homework solution:', code: `% Check the hand computation of the integral numerically
f = @(x) 6 ./ (3*x - 2).^2;
I = integral(f, 1, 4)
fprintf('Exact value 9/5 = %.6f\\n', 9/5)` },
];
