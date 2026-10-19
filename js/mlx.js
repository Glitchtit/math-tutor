// Convert between the app's Live Script model and MATLAB .mlx files.
// Block model: { type: 'title'|'heading'|'heading2'|'text'|'equation'|'code', content: string }
// Text blocks use $...$ for inline equations, **bold** and `monospace`.

import { makeZip, readZip } from './zip.js';

const xmlEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MC = 'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"';

function runs(text) {
  // split into equations, bold, code and plain runs
  const out = [];
  const re = /\$([^$]+)\$|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(`<w:r><w:t>${xmlEsc(text.slice(last, m.index))}</w:t></w:r>`);
    if (m[1] !== undefined) out.push(`<w:customXml w:element="equation"><w:customXmlPr><w:attr w:name="displayStyle" w:val="false"/></w:customXmlPr><w:r><w:t>${xmlEsc(m[1])}</w:t></w:r></w:customXml>`);
    else if (m[2] !== undefined) out.push(`<w:r><w:rPr><w:b/></w:rPr><w:t>${xmlEsc(m[2])}</w:t></w:r>`);
    else out.push(`<w:r><w:rPr><w:rFonts w:cs="monospace"/></w:rPr><w:t>${xmlEsc(m[3])}</w:t></w:r>`);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(`<w:r><w:t>${xmlEsc(text.slice(last))}</w:t></w:r>`);
  if (!out.length) out.push('<w:r><w:t></w:t></w:r>');
  return out.join('');
}

let bm = 0;
const bookmarkId = () => (0x10000000 + (++bm * 2654435761 % 0xEFFFFFFF)).toString(16).toUpperCase().slice(0, 8);

function paragraph(block) {
  const textP = (body) => `<w:p><w:pPr><w:pStyle w:val="text"/><w:jc w:val="left"/></w:pPr>${body}</w:p>`;
  switch (block.type) {
    case 'title': {
      const id = 'T_' + bookmarkId();
      return `<w:p><w:pPr><w:pStyle w:val="title"/><w:jc w:val="left"/></w:pPr><w:bookmarkStart w:name="MW_${id}" w:id="${id}"/><w:r><w:t>${xmlEsc(block.content)}</w:t></w:r><w:bookmarkEnd w:id="${id}"/></w:p>`;
    }
    case 'heading': {
      const id = 'H_' + bookmarkId();
      return `<w:p><w:pPr><w:pStyle w:val="heading"/><w:jc w:val="left"/></w:pPr><w:bookmarkStart w:name="MW_${id}" w:id="${id}"/><w:r><w:t>${xmlEsc(block.content)}</w:t></w:r><w:bookmarkEnd w:id="${id}"/></w:p>`;
    }
    case 'heading2':
      return `<w:p><mc:AlternateContent ${MC}><mc:Choice Requires="R2018b"><w:pPr><w:pStyle w:val="heading2"/><w:jc w:val="left"/></w:pPr></mc:Choice><mc:Fallback><w:pPr><w:pStyle w:val="heading"/><w:jc w:val="left"/></w:pPr></mc:Fallback></mc:AlternateContent><w:r><w:t>${xmlEsc(block.content)}</w:t></w:r></w:p>`;
    case 'equation':
      return textP(`<w:customXml w:element="equation"><w:customXmlPr><w:attr w:name="displayStyle" w:val="true"/></w:customXmlPr><w:r><w:t>${xmlEsc(block.content)}</w:t></w:r></w:customXml>`);
    case 'code':
      return `<w:p><w:pPr><w:pStyle w:val="code"/></w:pPr><w:r><w:t><![CDATA[${String(block.content).replace(/]]>/g, ']]]]><![CDATA[>')}]]></w:t></w:r></w:p>`;
    default:
      // one paragraph per line; "- " lines become plain paragraphs with a bullet
      return String(block.content).split('\n').map((line) => textP(runs(line))).join('');
  }
}

export function docToMlxBlob(doc) {
  const body = doc.blocks.map(paragraph).join('');
  const documentXml = `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}</w:body></w:document>`;
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const uuid = (crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0'));
  const files = [
    { name: '[Content_Types].xml', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n  <Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>\n  <Default ContentType="application/vnd.mathworks.matlab.code.document+xml" Extension="xml"/>\n  <Override ContentType="text/xml" PartName="/matlab/output.xml"/>\n  <Override ContentType="application/vnd.openxmlformats-package.core-properties+xml" PartName="/metadata/coreProperties.xml"/>\n  <Override ContentType="application/vnd.mathworks.package.coreProperties+xml" PartName="/metadata/mwcoreProperties.xml"/>\n  <Override ContentType="application/vnd.mathworks.package.corePropertiesExtension+xml" PartName="/metadata/mwcorePropertiesExtension.xml"/>\n  <Override ContentType="application/vnd.mathworks.package.corePropertiesReleaseInfo+xml" PartName="/metadata/mwcorePropertiesReleaseInfo.xml"/>\n</Types>` },
    { name: '_rels/.rels', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n  <Relationship Id="rId1" Target="matlab/document.xml" Type="http://schemas.mathworks.com/matlab/code/2013/relationships/document"/>\n  <Relationship Id="rId2" Target="matlab/output.xml" Type="http://schemas.mathworks.com/matlab/code/2013/relationships/output"/>\n  <Relationship Id="rId3" Target="metadata/mwcoreProperties.xml" Type="http://schemas.mathworks.com/package/2012/relationships/coreProperties"/>\n  <Relationship Id="rId4" Target="metadata/mwcorePropertiesExtension.xml" Type="http://schemas.mathworks.com/package/2014/relationships/corePropertiesExtension"/>\n  <Relationship Id="rId5" Target="metadata/mwcorePropertiesReleaseInfo.xml" Type="http://schemas.mathworks.com/package/2019/relationships/corePropertiesReleaseInfo"/>\n  <Relationship Id="rId6" Target="metadata/coreProperties.xml" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties"/>\n</Relationships>` },
    { name: 'matlab/document.xml', data: documentXml },
    { name: 'matlab/output.xml', data: '<?xml version="1.0" encoding="UTF-8"?><embeddedOutputs><metaData><evaluationState>manual</evaluationState><layoutState>code</layoutState><outputStatus>ready</outputStatus></metaData><outputArray type="array"/><regionArray type="array"/></embeddedOutputs>' },
    { name: 'metadata/coreProperties.xml', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>\n<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>\n  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>\n</cp:coreProperties>` },
    { name: 'metadata/mwcoreProperties.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>\n<mwcoreProperties xmlns="http://schemas.mathworks.com/package/2012/coreProperties">\n  <contentType>application/vnd.mathworks.matlab.code</contentType>\n  <contentTypeFriendlyName>MATLAB Code</contentTypeFriendlyName>\n  <matlabRelease>R2022b</matlabRelease>\n</mwcoreProperties>' },
    { name: 'metadata/mwcorePropertiesExtension.xml', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>\n<mwcoreProperties xmlns="http://schemas.mathworks.com/package/2014/corePropertiesExtension">\n  <uuid>${uuid}</uuid>\n</mwcoreProperties>` },
    { name: 'metadata/mwcorePropertiesReleaseInfo.xml', data: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Version information for MathWorks R2022b Release -->\n<MathWorks_version_info>\n  <version>9.13.0.2126072</version>\n  <release>R2022b</release>\n  <description>Update 3</description>\n  <date>Nov 17 2022</date>\n  <checksum>1398112652</checksum>\n</MathWorks_version_info>' },
  ];
  return makeZip(files);
}

// ------------------------------------------------------------------ import

export async function mlxToDoc(arrayBuffer) {
  const files = await readZip(arrayBuffer);
  const raw = files['matlab/document.xml'];
  if (!raw) throw new Error('This file has no matlab/document.xml — is it a Live Script?');
  const xml = new TextDecoder().decode(raw);
  return documentXmlToDoc(xml);
}

export function documentXmlToDoc(xml) {
  const dom = new DOMParser().parseFromString(xml, 'application/xml');
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const paras = Array.from(dom.getElementsByTagNameNS(W, 'p'));
  const blocks = [];
  let title = 'Live Script';
  for (const p of paras) {
    // skip table of contents entries and section breaks
    const styleEl = p.getElementsByTagNameNS(W, 'pStyle')[0];
    let style = styleEl ? styleEl.getAttributeNS(W, 'val') || styleEl.getAttribute('w:val') : 'text';
    if (p.getElementsByTagNameNS(W, 'pStyle').length > 1) {
      // AlternateContent: prefer the Choice style
      style = p.getElementsByTagNameNS(W, 'pStyle')[0].getAttribute('w:val');
    }
    if (/^TOC/.test(style)) continue;
    if (style === 'code') {
      const t = Array.from(p.getElementsByTagNameNS(W, 't')).map((n) => n.textContent).join('');
      blocks.push({ type: 'code', content: t });
      continue;
    }
    // build text with inline equations
    let text = '';
    let displayEq = null;
    const walk = (node) => {
      for (const ch of Array.from(node.childNodes)) {
        if (ch.nodeType !== 1) continue;
        const ln = ch.localName;
        if (ln === 'customXml' && ch.getAttribute('w:element') === 'equation') {
          const attr = Array.from(ch.getElementsByTagNameNS(W, 'attr')).find((a) => a.getAttribute('w:name') === 'displayStyle');
          const latex = Array.from(ch.getElementsByTagNameNS(W, 't')).map((n) => n.textContent).join('');
          if (attr && attr.getAttribute('w:val') === 'true') displayEq = latex;
          else text += `$${latex.replace(/\s*\n\s*/g, ' ')}$`;
          continue;
        }
        if (ln === 'r') {
          const t = Array.from(ch.getElementsByTagNameNS(W, 't')).map((n) => n.textContent).join('');
          const bold = ch.getElementsByTagNameNS(W, 'b').length > 0;
          const mono = Array.from(ch.getElementsByTagNameNS(W, 'rFonts')).some((f) => /mono/i.test(f.getAttribute('w:cs') || ''));
          text += bold && t.trim() ? `**${t}**` : mono && t.trim() ? '`' + t + '`' : t;
          continue;
        }
        if (ln === 'hyperlink' || ln === 'sdt' || ln === 'sdtContent' || ln === 'AlternateContent' || ln === 'Choice') walk(ch);
        if (ln === 'drawing' || ln === 'pict') text += ' [image] ';
      }
    };
    walk(p);
    if (style === 'title') { title = text.trim() || title; blocks.push({ type: 'title', content: text.trim() }); continue; }
    if (style === 'heading' || style === 'heading2') { blocks.push({ type: style, content: text.trim() }); continue; }
    if (displayEq !== null && !text.trim()) { blocks.push({ type: 'equation', content: displayEq }); continue; }
    if (displayEq !== null) text += ` $${displayEq}$`;
    if (!text.trim()) continue;
    // merge consecutive text paragraphs into one block (separated by newlines)
    const prev = blocks[blocks.length - 1];
    if (prev && prev.type === 'text' && style === 'ListParagraph') prev.content += '\n- ' + text;
    else blocks.push({ type: 'text', content: style === 'ListParagraph' ? '- ' + text : text });
  }
  return { title, blocks };
}
