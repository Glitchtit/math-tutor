// Lexer and parser for the MATLAB subset used in the course.
// Produces a plain-object AST consumed by interp.js.

export class MatlabError extends Error {
  constructor(msg, line) {
    super(msg);
    this.line = line;
  }
}

const KEYWORDS = new Set(['if', 'elseif', 'else', 'end', 'for', 'while', 'break', 'continue',
  'return', 'function', 'switch', 'case', 'otherwise']);

// Words that MATLAB users type in "command syntax" (grid on, hold off, ...).
const COMMAND_WORDS = new Set(['grid', 'hold', 'box', 'format', 'axis', 'close', 'clc', 'clear',
  'clf', 'figure', 'syms', 'warning', 'more', 'disp']);

export function tokenize(src) {
  const toks = [];
  let i = 0, line = 1;
  const brackets = []; // stack of '[' '{' '('
  const n = src.length;
  const push = (type, value, extra = {}) => { toks.push({ type, value, line, ...extra }); toks.ws = false; };
  const prev = () => toks[toks.length - 1];
  const prevEndsValue = () => {
    const p = prev();
    if (!p) return false;
    return p.type === 'num' || p.type === 'id' || p.type === 'str' ||
      (p.type === 'op' && [')', ']', '}', "'", ".'"].includes(p.value)) ||
      (p.type === 'kw' && p.value === 'end' && brackets.length > 0);
  };
  const inMatrix = () => brackets.length > 0 && brackets[brackets.length - 1] !== '(';

  while (i < n) {
    let ch = src[i];
    // line continuation
    if (ch === '.' && src.startsWith('...', i)) {
      while (i < n && src[i] !== '\n') i++;
      i++; line++;
      continue;
    }
    if (ch === '%') {
      // block comment %{ ... %}
      if (src.startsWith('%{', i) && /^%\{\s*$/.test(src.slice(i, src.indexOf('\n', i) === -1 ? n : src.indexOf('\n', i)))) {
        const end = src.indexOf('%}', i);
        const stop = end === -1 ? n : end + 2;
        line += (src.slice(i, stop).match(/\n/g) || []).length;
        i = stop;
        continue;
      }
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    if (ch === ' ' || ch === '\t' || ch === '\r') {
      let j = i;
      while (j < n && (src[j] === ' ' || src[j] === '\t' || src[j] === '\r')) j++;
      // inside [] or {} whitespace may separate elements
      if (inMatrix() && prevEndsValue()) {
        const nx = src[j];
        const nx2 = src[j + 1];
        let sep = false;
        if (nx !== undefined && nx !== ',' && nx !== ';' && nx !== ']' && nx !== '}' && nx !== '\n' && nx !== '%') {
          if (nx === '+' || nx === '-') {
            // "[1 -2]" -> two elements, "[1 - 2]" -> one
            sep = nx2 !== ' ' && nx2 !== '\t' && nx2 !== '=';
          } else if (nx === "'") {
            sep = true; // string literal start
          } else if (/[A-Za-z0-9_.(\[{@~"]/.test(nx)) {
            if (nx === '.' && !/[0-9]/.test(nx2 || '')) sep = false; // .* ./ etc
            else sep = true;
          }
          if ((nx === '=' && nx2 === '=') || nx === '<' || nx === '>' || nx === '*' || nx === '/' || nx === '^' || nx === '|' || nx === '&' || nx === ':' || nx === '\\') sep = false;
          if (nx === '~' && nx2 === '=') sep = false;
        }
        if (sep) push('op', ',', { implicit: true });
      }
      toks.ws = true;
      i = j;
      continue;
    }
    if (ch === '\n') {
      if (inMatrix()) push('op', ';', { implicit: true });
      else push('nl', '\n');
      i++; line++;
      continue;
    }
    // numbers
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1] || ''))) {
      const m = /^(\d+(?:\.(?![*\/^\\'])\d*)?|\.\d+)([eE][+-]?\d+)?/.exec(src.slice(i));
      let text = m[0];
      i += text.length;
      let imag = false;
      if ((src[i] === 'i' || src[i] === 'j') && !/[A-Za-z0-9_]/.test(src[i + 1] || '')) { imag = true; i++; }
      push('num', parseFloat(text), { imag });
      continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      i = j;
      if (KEYWORDS.has(word)) push('kw', word);
      else push('id', word);
      continue;
    }
    if (ch === '"') {
      let j = i + 1, s = '';
      while (j < n) {
        if (src[j] === '"' && src[j + 1] === '"') { s += '"'; j += 2; continue; }
        if (src[j] === '"') break;
        if (src[j] === '\n') throw new MatlabError('String is not terminated properly.', line);
        s += src[j++];
      }
      if (j >= n) throw new MatlabError('String is not terminated properly.', line);
      push('str', s, { dq: true });
      i = j + 1;
      continue;
    }
    if (ch === "'") {
      // transpose or char literal
      const p = prev();
      const hadWs = toks.length && toks.ws;
      const transpose = prevEndsValue() && !(inMatrix() && hadWs);
      if (transpose) { push('op', "'"); i++; toks.ws = false; continue; }
      let j = i + 1, s = '';
      while (j < n) {
        if (src[j] === "'" && src[j + 1] === "'") { s += "'"; j += 2; continue; }
        if (src[j] === "'") break;
        if (src[j] === '\n') throw new MatlabError('Character vector is not terminated properly.', line);
        s += src[j++];
      }
      if (j >= n) throw new MatlabError('Character vector is not terminated properly.', line);
      push('str', s, { dq: false });
      i = j + 1;
      toks.ws = false;
      void p;
      continue;
    }
    const three = src.slice(i, i + 3);
    const two = src.slice(i, i + 2);
    let op = null;
    if (['.^\'', ].includes(three)) op = three;
    else if (['==', '~=', '<=', '>=', '&&', '||', '.*', './', '.^', ".'", '.\\'].includes(two)) op = two;
    else if ('+-*/\\^<>=&|~!,;:()[]{}@.'.includes(ch)) op = ch;
    if (op === '!') op = '~';
    if (!op) throw new MatlabError(`Invalid text character. Check for unsupported symbol "${ch}".`, line);
    if (op === '(' || op === '[' || op === '{') brackets.push(op);
    if (op === ')' || op === ']' || op === '}') brackets.pop();
    // a ';' or ',' at a matrix row end followed by newline: avoid double row separators
    push('op', op);
    i += op.length;
    toks.ws = false;
    continue;
  }
  push('eof', null);
  return toks;
}

// ---------------------------------------------------------------- parser

export function parse(src) {
  const p = new Parser(tokenize(src), src);
  return p.parseProgram();
}

export function parseExpression(src) {
  const p = new Parser(tokenize(src), src);
  const e = p.parseExpr();
  p.skipNewlines();
  if (p.peek().type !== 'eof') throw new MatlabError(`Unexpected "${p.peek().value}" in expression.`, p.peek().line);
  return e;
}

class Parser {
  constructor(toks, src) {
    this.t = toks;
    this.i = 0;
    this.src = src;
    this.endDepth = 0; // > 0 when inside an index expression where `end` is a value
  }
  peek(k = 0) { return this.t[this.i + k]; }
  next() { return this.t[this.i++]; }
  isOp(v, k = 0) { const t = this.peek(k); return t.type === 'op' && t.value === v; }
  isKw(v) { const t = this.peek(); return t.type === 'kw' && t.value === v; }
  expectOp(v) {
    const t = this.next();
    if (t.type !== 'op' || t.value !== v) {
      throw new MatlabError(`Invalid expression. Expected "${v}" but found "${t.value ?? 'end of input'}".`, t.line);
    }
    return t;
  }
  skipNewlines() {
    while (this.peek().type === 'nl' || this.isOp(';') || this.isOp(',')) this.next();
  }

  parseProgram() {
    const body = [];
    const functions = {};
    this.skipNewlines();
    while (this.peek().type !== 'eof') {
      if (this.isKw('function')) {
        const f = this.parseFunction();
        functions[f.name] = f;
      } else {
        body.push(this.parseStatement());
      }
      this.skipNewlines();
    }
    return { type: 'program', body, functions };
  }

  parseBlock(terminators) {
    const body = [];
    this.skipNewlines();
    while (true) {
      const t = this.peek();
      if (t.type === 'eof') throw new MatlabError(`Missing "end" to close a block.`, t.line);
      if (t.type === 'kw' && terminators.includes(t.value)) break;
      body.push(this.parseStatement());
      this.skipNewlines();
    }
    return body;
  }

  parseFunction() {
    const line = this.next().line; // function
    let outs = [];
    let name;
    // forms: function name(args) | function out = name(args) | function [a,b] = name(args)
    if (this.isOp('[')) {
      this.next();
      while (!this.isOp(']')) {
        const t = this.next();
        if (t.type === 'id') outs.push(t.value);
      }
      this.next();
      this.expectOp('=');
      name = this.next().value;
    } else {
      const first = this.next().value;
      if (this.isOp('=')) { this.next(); outs = [first]; name = this.next().value; } else name = first;
    }
    const params = [];
    if (this.isOp('(')) {
      this.next();
      while (!this.isOp(')')) {
        const t = this.next();
        if (t.type === 'id') params.push(t.value);
        else if (t.type === 'op' && t.value === '~') params.push('~');
      }
      this.next();
    }
    const body = this.parseBlock(['end', 'function']);
    if (this.isKw('end')) this.next();
    return { type: 'function', name, params, outs, body, line };
  }

  endOfStatement() {
    // returns true if output should be printed
    const t = this.peek();
    if (t.type === 'op' && t.value === ';') { this.next(); return false; }
    if (t.type === 'op' && t.value === ',') { this.next(); return true; }
    if (t.type === 'nl') { this.next(); return true; }
    if (t.type === 'eof') return true;
    if (t.type === 'kw' && ['end', 'else', 'elseif', 'case', 'otherwise'].includes(t.value)) return true;
    throw new MatlabError(`Invalid expression near "${t.value}". Check for missing operators or mismatched delimiters.`, t.line);
  }

  parseStatement() {
    const t = this.peek();
    const line = t.line;
    if (t.type === 'kw') {
      switch (t.value) {
        case 'if': return this.parseIf();
        case 'for': return this.parseFor();
        case 'while': return this.parseWhile();
        case 'switch': return this.parseSwitch();
        case 'break': this.next(); this.endOfStatement(); return { type: 'break', line };
        case 'continue': this.next(); this.endOfStatement(); return { type: 'continue', line };
        case 'return': this.next(); this.endOfStatement(); return { type: 'return', line };
        case 'function': throw new MatlabError('Function definitions must be placed at the end of the script.', line);
        default: throw new MatlabError(`Illegal use of reserved keyword "${t.value}".`, line);
      }
    }
    // command syntax: grid on, hold off, format long, syms x y
    if (t.type === 'id' && COMMAND_WORDS.has(t.value)) {
      const nx = this.peek(1);
      const isCommand = nx.type === 'nl' || nx.type === 'eof' || (nx.type === 'op' && (nx.value === ';' || nx.value === ',')) ||
        (nx.type === 'id' && nx.line === t.line && !(this.peek(2).type === 'op' && ['=', '('].includes(this.peek(2).value) && false));
      if (isCommand && !(nx.type === 'op' && nx.value === '(')) {
        this.next();
        const args = [];
        while (this.peek().type === 'id' || this.peek().type === 'num') args.push({ type: 'str', value: String(this.next().value) });
        const print = this.endOfStatement();
        return { type: 'expr', expr: { type: 'index', obj: { type: 'id', name: t.value, line }, args, brace: false }, print, line, command: true };
      }
    }
    // multiple assignment [a, b] = ...
    if (this.isOp('[')) {
      let depth = 0, k = 0;
      for (; ; k++) {
        const tk = this.peek(k);
        if (tk.type === 'eof' || tk.type === 'nl') { k = -1; break; }
        if (tk.type === 'op' && (tk.value === '[' || tk.value === '(' || tk.value === '{')) depth++;
        if (tk.type === 'op' && (tk.value === ']' || tk.value === ')' || tk.value === '}')) { depth--; if (depth === 0) break; }
      }
      if (k > 0 && this.isOp('=', k + 1)) {
        this.next();
        const targets = [];
        while (!this.isOp(']')) {
          if (this.isOp(',')) { this.next(); continue; }
          if (this.isOp('~')) { this.next(); targets.push(null); continue; }
          targets.push(this.parsePostfix());
        }
        this.next();
        this.expectOp('=');
        const expr = this.parseExpr();
        const print = this.endOfStatement();
        return { type: 'multiassign', targets, expr, print, line };
      }
    }
    // assignment?
    if (t.type === 'id') {
      const save = this.i;
      let lhs = null;
      try { lhs = this.parsePostfix(true); } catch { lhs = null; }
      if (lhs && this.isOp('=')) {
        this.next();
        let expr;
        if (this.isOp('[') && this.isOp(']', 1) && lhs.type === 'index') { this.next(); this.next(); expr = { type: 'empty' }; } else expr = this.parseExpr();
        const print = this.endOfStatement();
        return { type: 'assign', target: lhs, expr, print, line };
      }
      this.i = save;
    }
    const expr = this.parseExpr();
    const print = this.endOfStatement();
    return { type: 'expr', expr, print, line };
  }

  parseIf() {
    const line = this.next().line;
    const clauses = [];
    let cond = this.parseExpr();
    let body = this.parseBlock(['elseif', 'else', 'end']);
    clauses.push({ cond, body });
    let elseBody = null;
    while (true) {
      if (this.isKw('elseif')) { this.next(); cond = this.parseExpr(); body = this.parseBlock(['elseif', 'else', 'end']); clauses.push({ cond, body }); continue; }
      if (this.isKw('else')) { this.next(); elseBody = this.parseBlock(['end']); continue; }
      break;
    }
    this.next(); // end
    return { type: 'if', clauses, elseBody, line };
  }

  parseFor() {
    const line = this.next().line;
    const paren = this.isOp('(');
    if (paren) this.next();
    const v = this.next();
    if (v.type !== 'id') throw new MatlabError('Invalid for loop variable.', line);
    this.expectOp('=');
    const range = this.parseExpr();
    if (paren) this.expectOp(')');
    const body = this.parseBlock(['end']);
    this.next();
    return { type: 'for', varName: v.value, range, body, line };
  }

  parseWhile() {
    const line = this.next().line;
    const cond = this.parseExpr();
    const body = this.parseBlock(['end']);
    this.next();
    return { type: 'while', cond, body, line };
  }

  parseSwitch() {
    const line = this.next().line;
    const subject = this.parseExpr();
    this.skipNewlines();
    const cases = [];
    let otherwise = null;
    while (!this.isKw('end')) {
      if (this.isKw('case')) { this.next(); const val = this.parseExpr(); const body = this.parseBlock(['case', 'otherwise', 'end']); cases.push({ val, body }); continue; }
      if (this.isKw('otherwise')) { this.next(); otherwise = this.parseBlock(['end']); continue; }
      throw new MatlabError('Invalid switch statement.', line);
    }
    this.next();
    return { type: 'switch', subject, cases, otherwise, line };
  }

  // ---- expressions (precedence climbing)
  parseExpr() { return this.parseOrOr(); }
  parseOrOr() {
    let l = this.parseAndAnd();
    while (this.isOp('||')) { this.next(); l = { type: 'bin', op: '||', l, r: this.parseAndAnd() }; }
    return l;
  }
  parseAndAnd() {
    let l = this.parseOr();
    while (this.isOp('&&')) { this.next(); l = { type: 'bin', op: '&&', l, r: this.parseOr() }; }
    return l;
  }
  parseOr() {
    let l = this.parseAnd();
    while (this.isOp('|')) { this.next(); l = { type: 'bin', op: '|', l, r: this.parseAnd() }; }
    return l;
  }
  parseAnd() {
    let l = this.parseCmp();
    while (this.isOp('&')) { this.next(); l = { type: 'bin', op: '&', l, r: this.parseCmp() }; }
    return l;
  }
  parseCmp() {
    let l = this.parseRange();
    while (['==', '~=', '<', '<=', '>', '>='].some((o) => this.isOp(o))) {
      const op = this.next().value;
      l = { type: 'bin', op, l, r: this.parseRange() };
    }
    return l;
  }
  parseRange() {
    // a bare ':' inside an index is handled by parseArgs
    const a = this.parseAdd();
    if (!this.isOp(':')) return a;
    this.next();
    const b = this.parseAdd();
    if (this.isOp(':')) {
      this.next();
      const c = this.parseAdd();
      return { type: 'range', start: a, step: b, stop: c };
    }
    return { type: 'range', start: a, step: null, stop: b };
  }
  parseAdd() {
    let l = this.parseMul();
    while (this.isOp('+') || this.isOp('-')) {
      const op = this.next().value;
      l = { type: 'bin', op, l, r: this.parseMul() };
    }
    return l;
  }
  parseMul() {
    let l = this.parseUnary();
    while (['*', '/', '.*', './', '\\', '.\\'].some((o) => this.isOp(o))) {
      const op = this.next().value;
      l = { type: 'bin', op, l, r: this.parseUnary() };
    }
    return l;
  }
  parseUnary() {
    if (this.isOp('-') || this.isOp('+') || this.isOp('~')) {
      const op = this.next().value;
      const operand = this.parseUnary();
      return { type: 'unary', op, operand };
    }
    return this.parsePower();
  }
  parsePower() {
    let base = this.parsePostfix();
    while (this.isOp('^') || this.isOp('.^')) {
      const op = this.next().value;
      // exponent may carry a unary sign: 2^-1
      let exp;
      if (this.isOp('-') || this.isOp('+') || this.isOp('~')) {
        const u = this.next().value;
        exp = { type: 'unary', op: u, operand: this.parsePostfix() };
      } else exp = this.parsePostfix();
      base = { type: 'bin', op, l: base, r: exp };
    }
    return base;
  }

  parsePostfix(lvalueOnly = false) {
    let e = this.parsePrimary(lvalueOnly);
    while (true) {
      if (this.isOp('(')) {
        this.next();
        const args = this.parseArgs(')');
        e = { type: 'index', obj: e, args, brace: false };
        continue;
      }
      if (this.isOp('{')) {
        this.next();
        const args = this.parseArgs('}');
        e = { type: 'index', obj: e, args, brace: true };
        continue;
      }
      if (this.isOp('.') && this.peek(1).type === 'id') {
        this.next();
        e = { type: 'field', obj: e, name: this.next().value };
        continue;
      }
      if (!lvalueOnly && (this.isOp("'") || this.isOp(".'"))) {
        this.next();
        e = { type: 'transpose', operand: e };
        continue;
      }
      break;
    }
    return e;
  }

  parseArgs(close) {
    const args = [];
    this.endDepth++;
    while (this.peek().type === 'nl') this.next();
    if (this.isOp(close)) { this.next(); this.endDepth--; return args; }
    while (true) {
      while (this.isOp(';') && this.peek().implicit) this.next();
      if (this.isOp(':') && (this.isOp(',', 1) || this.isOp(close, 1))) { this.next(); args.push({ type: 'colon' }); } else args.push(this.parseExpr());
      while (this.isOp(';') && this.peek().implicit) this.next();
      if (this.isOp(',')) { this.next(); continue; }
      if (this.isOp(close)) { this.next(); break; }
      const t = this.peek();
      throw new MatlabError(`Invalid expression. When calling a function or indexing a variable, use parentheses. Otherwise, check for mismatched delimiters near "${t.value ?? 'end of line'}".`, t.line);
    }
    this.endDepth--;
    return args;
  }

  parsePrimary(lvalueOnly = false) {
    const t = this.next();
    if (t.type === 'id') return { type: 'id', name: t.value, line: t.line };
    if (lvalueOnly) throw new MatlabError('not an lvalue', t.line);
    if (t.type === 'num') return { type: 'num', value: t.value, imag: t.imag };
    if (t.type === 'str') return { type: 'str', value: t.value, dq: t.dq };
    if (t.type === 'kw' && t.value === 'end' && this.endDepth > 0) return { type: 'end' };
    if (t.type === 'op') {
      if (t.value === '(') {
        const save = this.endDepth;
        const e = this.parseExpr();
        this.endDepth = save;
        this.expectOp(')');
        return { type: 'paren', expr: e };
      }
      if (t.value === '[' || t.value === '{') {
        const close = t.value === '[' ? ']' : '}';
        const rows = [];
        let row = [];
        const saveEnd = this.endDepth;
        this.endDepth = 0;
        while (true) {
          const k = this.peek();
          if (k.type === 'op' && k.value === close) { this.next(); break; }
          if (k.type === 'eof') throw new MatlabError(`Missing "${close}".`, t.line);
          if (k.type === 'op' && k.value === ';') { this.next(); if (row.length) rows.push(row); row = []; continue; }
          if (k.type === 'op' && k.value === ',') { this.next(); continue; }
          if (k.type === 'nl') { this.next(); continue; }
          row.push(this.parseExpr());
        }
        if (row.length) rows.push(row);
        this.endDepth = saveEnd;
        return { type: t.value === '[' ? 'matrix' : 'cell', rows };
      }
      if (t.value === '@') {
        if (this.isOp('(')) {
          this.next();
          const params = [];
          while (!this.isOp(')')) {
            const p = this.next();
            if (p.type === 'id') params.push(p.value);
            else if (p.type === 'op' && p.value === '~') params.push('~');
            else if (!(p.type === 'op' && p.value === ',')) throw new MatlabError('Invalid anonymous function parameter list.', p.line);
          }
          this.next();
          const save = this.endDepth;
          this.endDepth = 0;
          const body = this.parseExpr();
          this.endDepth = save;
          return { type: 'lambda', params, body };
        }
        const nm = this.next();
        if (nm.type !== 'id') throw new MatlabError('Invalid function handle.', nm.line);
        return { type: 'fhandle', name: nm.value };
      }
    }
    throw new MatlabError(`Invalid expression near "${t.value ?? 'end of input'}". Check for missing or extra characters.`, t.line);
  }
}
