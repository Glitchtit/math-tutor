import test from 'node:test';
import assert from 'node:assert/strict';
import { Matlab } from '../js/matlab/interp.js';

function run(code) {
  const m = new Matlab();
  const r = m.run(code);
  const text = r.outputs.filter((o) => o.type === 'text').map((o) => o.text).join('');
  const errors = r.outputs.filter((o) => o.type === 'error').map((o) => o.text);
  const warnings = r.outputs.filter((o) => o.type === 'warning').map((o) => o.text);
  const figures = r.outputs.filter((o) => o.type === 'figure');
  return { m, text, errors, warnings, figures, ok: r.ok };
}
const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} vs ${b}`);
const num = (m, name) => m.getVar(name).re[0];

test('arithmetic and display', () => {
  const r = run('x = 2 + 3*4\ny = 2^-1;\nz = -2^2');
  assert.deepEqual(r.errors, []);
  assert.match(r.text, /x = 14/);
  assert.match(r.text, /z = -4/);
  near(num(r.m, 'y'), 0.5);
});

test('vectors, ranges, elementwise ops and end', () => {
  const r = run('v = [1 2 3];\nw = v.^2;\na = w(end);\nb = sum(1:100);\nc = [1 -2];\nd = [1 - 2];\nM = [1 2; 3 4];\ne = M(2,end);\nt = v\';');
  assert.deepEqual(r.errors, []);
  assert.equal(num(r.m, 'a'), 9);
  assert.equal(num(r.m, 'b'), 5050);
  assert.equal(r.m.getVar('c').n, 2);
  assert.equal(r.m.getVar('d').n, 1);
  assert.equal(num(r.m, 'e'), 4);
  assert.equal(r.m.getVar('t').r, 3);
});

test('matrix power error teaches .^', () => {
  const r = run('x = [1 2 3];\ny = x^2;');
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /POWER \(\.\^\)/);
});

test('anonymous functions capture by value', () => {
  const r = run('a = 2;\nf = @(x) a*x.^2;\na = 100;\ny = f(3);');
  assert.deepEqual(r.errors, []);
  assert.equal(num(r.m, 'y'), 18);
});

test('integral of HW0-style integrals', () => {
  const r = run('I1 = integral(@(x) 6./(3*x-2).^2, 1, 4);\nI2 = integral(@(x) abs(4*x-1), -3, 3);\nI3 = integral(@(x) log(x)./sqrt(x), 0, 1);\nI4 = integral(@(x) 1./(1+x.^2), -Inf, Inf);');
  assert.deepEqual(r.errors, []);
  near(num(r.m, 'I1'), 9 / 5);
  near(num(r.m, 'I2'), 145 / 4);
  near(num(r.m, 'I3'), -4, 1e-5);
  near(num(r.m, 'I4'), Math.PI);
});

test('integral requires vectorised integrand', () => {
  const r = run('I = integral(@(x) x^2, 0, 1);');
  assert.equal(r.errors.length, 1);
});

test('fzero, roots, fminbnd', () => {
  const r = run('z = fzero(@(x) cos(x) - x, 1);\np = roots([1 -6 11 -6]);\n[xm, fm] = fminbnd(@(x) (x-2).^2 + 1, 0, 5);');
  assert.deepEqual(r.errors, []);
  near(num(r.m, 'z'), 0.7390851332);
  const p = Array.from(r.m.getVar('p').re).sort();
  near(p[0], 1); near(p[1], 2); near(p[2], 3);
  near(num(r.m, 'xm'), 2, 1e-6);
});

test('complex roots display', () => {
  const r = run('r = roots([1 0 1])');
  assert.deepEqual(r.errors, []);
  assert.match(r.text, /i/);
});

test('ode45 scalar and system', () => {
  const r = run('[t, y] = ode45(@(t,y) -2*y, [0 1], 1);\nyend = y(end);\n[t2, Y] = ode45(@(t,y) [y(2); -y(1)], [0 pi], [0; 1]);\ns = Y(end, 1);');
  assert.deepEqual(r.errors, []);
  near(num(r.m, 'yend'), Math.exp(-2), 3e-3);
  near(num(r.m, 's'), 0, 1e-3);
});

test('ode45 rejects row vector output for systems', () => {
  const r = run('[t, Y] = ode45(@(t,y) [y(2), -y(1)], [0 1], [0; 1]);');
  assert.equal(r.errors.length, 1);
});

test('plots produce figures, fplot warns when not vectorised', () => {
  const r = run('f = @(x) x^2;\nfplot(f, [-1 1])\ngrid on\ntitle("parabola")');
  assert.deepEqual(r.errors, []);
  assert.equal(r.figures.length, 1);
  assert.equal(r.warnings.length, 1);
  assert.equal(r.figures[0].figure.title, 'parabola');
  assert.ok(r.figures[0].figure.grid);
});

test('HW3 slope field code runs', () => {
  const r = run(`[x,y] = meshgrid(0.01:0.5:6,0.01:0.5:5);
dy = 1./(x.*y);
dx = 1;
L = sqrt((dx/(x(1,end)-x(1,1)))^2+(dy/(y(end,1)-y(1,1))).^2);
q = quiver(x,y,dx./L,dy./L,0.5);
q.ShowArrowHead = 'off';
q.Marker = '.';`);
  assert.deepEqual(r.errors, []);
  assert.equal(r.figures.length, 1);
  const s = r.figures[0].figure.series[0];
  assert.equal(s.type, 'quiver');
  assert.equal(s.arrows, false);
  assert.equal(s.marker, '.');
});

test('HW2 plot code with legend runs', () => {
  const r = run(`lower = 0.01;
step = 0.001;
upper = 3;
xx = lower : step : upper;
integrand4 = @(x) log(x) ./ sqrt(x);
p4 = plot(xx, integrand4(xx));
p4.LineWidth = 3;
legend("$y(x) = \\ln(x) / \\sqrt{x}$", "Interpreter", "latex");
ylim([-3 1])`);
  assert.deepEqual(r.errors, []);
  assert.equal(r.figures[0].figure.series[0].width, 3);
  assert.ok(r.figures[0].figure.legendLatex);
});

test('control flow, functions, fprintf', () => {
  const r = run(`S = 0;
for n = 1:10
  if mod(n, 2) == 0
    continue
  end
  S = S + n;
end
k = 0;
while true
  k = k + 1;
  if k >= 5, break; end
end
fprintf('S = %d, k = %d\\n', S, k);
y = sq(4);
function out = sq(x)
  out = x^2;
end`);
  assert.deepEqual(r.errors, []);
  assert.match(r.text, /S = 25, k = 5/);
  assert.equal(num(r.m, 'y'), 16);
});

test('syms is rejected with a course message', () => {
  const r = run('syms x');
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /Symbolic/);
});

test('trapz and series partial sums', () => {
  const r = run('x = linspace(0, pi, 5);\nT = trapz(x, sin(x));\nn = 1:3;\nS3 = sum(n.*exp(-n.^2));');
  assert.deepEqual(r.errors, []);
  near(num(r.m, 'T'), 1.8961188979, 1e-8);
  near(num(r.m, 'S3'), 0.3679 + 2 * Math.exp(-4) + 3 * Math.exp(-9), 1e-3);
});

test('evalNumber and makeFunction for answer checking', () => {
  const m = new Matlab();
  near(m.evalNumber('24*sqrt(3)/5'), 24 * Math.sqrt(3) / 5);
  const f = m.makeFunction('-exp(-x^2)/2');
  near(f(1), -Math.exp(-1) / 2);
});

test('struct and string handling', () => {
  const r = run('s.a = 1;\ns.b = "hi";\nc = [\'x = \' num2str(pi)];\ndisp(c)');
  assert.deepEqual(r.errors, []);
  assert.match(r.text, /x = 3\.1416/);
});

test('linear solve for partial fractions', () => {
  const r = run('A = [1 1; 1 -1];\nb = [1; 3];\nc = A\\b;');
  assert.deepEqual(r.errors, []);
  near(r.m.getVar('c').re[0], 2);
  near(r.m.getVar('c').re[1], -1);
});
