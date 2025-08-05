//@ts-check

import DEBUG from '../debug.js';
import errors from '../errors.js';

import {
  ATTRIBUTE,
  COMMENT,
  COMPONENT,
  ELEMENT,
  TEXT,
  TEXT_ELEMENTS,
  VOID_ELEMENTS,
  Comment as DOMComment,
  DocumentType as DOMDocumentType,
  Text as DOMText,
  Fragment as DOMFragment,
  Element as DOMElement,
  Component as DOMComponent,
  append, prop, children,
} from '../dom/ish.js';

const NUL = '\x00';
const DOUBLE_QUOTED_NUL = `"${NUL}"`;
const SINGLE_QUOTED_NUL = `'${NUL}'`;
const NEXT = /\x00|<[^><\s]+/g;
const ATTRS = /([^\s/>=]+)(?:=(\x00|(?:(['"])[\s\S]*?\3)))?/g;

// // YAGNI: NUL char in the wild is a shenanigan
// // usage: template.map(safe).join(NUL).trim()
// const NUL_RE = /\x00/g;
// const safe = s => s.replace(NUL_RE, '&#0;');

/** @typedef {import('../dom/ish.js').Node} Node */
/** @typedef {import('../dom/ish.js').Element} Element */
/** @typedef {import('../dom/ish.js').Component} Component */
/** @typedef {(node: import('../dom/ish.js').Node, type: typeof ATTRIBUTE | typeof TEXT | typeof COMMENT | typeof COMPONENT, path: number[], name: string, hint: unknown) => unknown} update */
/** @typedef {Element | Component} Container */

/** @type {update} */
const defaultUpdate = (_, type, path, name, hint) => [type, path, name];

/**
 * @param {Node} node
 * @returns {number[]}
 */
const path = node => {
  const insideout = [];
  while (node.parent) {
    switch (node.type) {
      /* c8 ignore start */
      case COMPONENT:
      // fallthrough
      /* c8 ignore stop */
      case ELEMENT: {
        if (/** @type {Container} */(node).name === 'template') insideout.push(-1);
        break;
      }
    }
    insideout.push(node.parent.children.indexOf(node));
    node = node.parent;
  }
  return insideout;
};

/**
 * @param {Node} node
 * @param {Set<Node>} ignore
 * @returns {Node}
 */
const parent = (node, ignore) => {
  do { node = node.parent } while (ignore.has(node));
  return node;
};

export default ({
  Comment = DOMComment,
  DocumentType = DOMDocumentType,
  Text = DOMText,
  Fragment = DOMFragment,
  Element = DOMElement,
  Component = DOMComponent,
  update = defaultUpdate,
}) =>
/**
 * Parse a template string into a crawable JS literal tree and provide a list of updates.
 * @param {TemplateStringsArray|string[]} template
 * @param {unknown[]} holes
 * @param {boolean} xml
 * @returns {[Node, unknown[]]}
 */
(template, holes, xml) => {
  if (DEBUG && template.some(chunk => chunk.includes(NUL))) throw errors.invalid_nul(template);
  const content = template.join(NUL).trim();
  if (DEBUG && content.replace(/(\S+)=(['"])([\S\s]+?)\2/g, (...a) => /^[^\x00]+\x00|\x00[^\x00]+$/.test(a[3]) ? (xml = a[1]) : a[0]) !== content) throw errors.invalid_attribute(template, xml);
  const ignore = new Set;
  const values = [];
  let node = new Fragment, pos = 0, skip = 0, hole = 0, resolvedPath = children;
  for (const match of content.matchAll(NEXT)) {
    // already handled via attributes or text content nodes
    if (0 < skip) {
      skip--;
      continue;
    }

    const chunk = match[0];
    const index = match.index;

    // prepend previous content, if any
    if (pos < index)
      append(node, new Text(content.slice(pos, index)));

    // holes
    if (chunk === NUL) {
      if (node.name === 'table') {
        node = append(node, new Element('tbody', xml));
        ignore.add(node);
      }
      const comment = append(node, new Comment('◦'));
      values.push(update(comment, COMMENT, path(comment), '', holes[hole++]));
      pos = index + 1;
    }
    // comments or doctype
    else if (chunk.startsWith('<!')) {
      const i = content.indexOf('>', index + 2);

      if (DEBUG && i < 0) throw errors.invalid_content(template);

      if (content.slice(i - 2, i + 1) === '-->') {
        if (DEBUG && (i - index) < 6) throw errors.invalid_comment(template);
        const data = content.slice(index + 4, i - 2);
        if (data[0] === '!') append(node, new Comment(data.slice(1).replace(/!$/, '')));
      }
      else {
        if (DEBUG && !content.slice(index + 2, i).toLowerCase().startsWith('doctype')) throw errors.invalid_doctype(template, content.slice(index + 2, i));
        append(node, new DocumentType(content.slice(index + 2, i)));
      }
      pos = i + 1;
    }
    // closing tag </> or </name>
    else if (chunk.startsWith('</')) {
      const i = content.indexOf('>', index + 2);
      if (DEBUG && i < 0) throw errors.invalid_closing(template);
      if (xml && node.name === 'svg') xml = false;
      node = /** @type {Container} */(parent(node, ignore));
      if (DEBUG && !node) throw errors.invalid_layout(template);
      pos = i + 1;
    }
    // opening tag <name> or <name />
    else {
      const i = index + chunk.length;
      const j = content.indexOf('>', i);
      const name = chunk.slice(1);

      if (DEBUG && j < 0) throw errors.unclosed_element(template, name);

      let tag = name;
      // <${Component} ... />
      if (name === NUL) {
        tag = 'template';
        node = append(node, new Component);
        resolvedPath = path(node).slice(1);
        //@ts-ignore
        values.push(update(node, COMPONENT, resolvedPath, '', holes[hole++]));
      }
      // any other element
      else {
        if (!xml) {
          tag = tag.toLowerCase();
          // patch automatic elements insertion with <table>
          // or path will fail once live on the DOM
          if (node.name === 'table' && (tag === 'tr' || tag === 'td')) {
            node = append(node, new Element('tbody', xml));
            ignore.add(node);
          }
          if (node.name === 'tbody' && tag === 'td') {
            node = append(node, new Element('tr', xml));
            ignore.add(node);
          }
        }
        node = append(node, new Element(tag, xml ? tag !== 'svg' : false));
        resolvedPath = children;
      }

      // attributes
      if (i < j) {
        let dot = false;
        for (const [_, name, value] of content.slice(i, j).matchAll(ATTRS)) {
          if (value === NUL || value === DOUBLE_QUOTED_NUL || value === SINGLE_QUOTED_NUL || (dot = name.endsWith(NUL))) {
            const p = resolvedPath === children ? (resolvedPath = path(node)) : resolvedPath;
            //@ts-ignore
            values.push(update(node, ATTRIBUTE, p, dot ? name.slice(0, -1) : name, holes[hole++]));
            dot = false;
            skip++;
          }
          else prop(node, name, value ? value.slice(1, -1) : true);
        }
        resolvedPath = children;
      }

      pos = j + 1;

      // to handle self-closing tags
      const closed = 0 < j && content[j - 1] === '/';

      if (xml) {
        if (closed) {
          node = node.parent;
          /* c8 ignore start unable to reproduce, still worth a guard */
          if (DEBUG && !node) throw errors.invalid_layout(template);
          /* c8 ignore stop */
        }
      }
      else if (closed || VOID_ELEMENTS.has(tag)) {
        // void elements are never td or tr
        node = closed ? parent(node, ignore) : node.parent;
        
        /* c8 ignore start unable to reproduce, still worth a guard */
        if (DEBUG && !node) throw errors.invalid_layout();
        /* c8 ignore stop */
      }
      // <svg> switches to xml mode
      else if (tag === 'svg') xml = true;
      // text content / data elements content handling
      else if (TEXT_ELEMENTS.has(tag)) {
        const index = content.indexOf(`</${name}>`, pos);
        if (DEBUG && index < 0) throw errors.unclosed(template, tag);
        const value = content.slice(pos, index);
        // interpolation as text
        if (value.trim() === NUL) {
          skip++;
          values.push(update(node, TEXT, path(node), '', holes[hole++]));
        }
        else if (DEBUG && value.includes(NUL)) throw errors.text(template, tag, value);
        else append(node, new Text(value));
        // text elements are never td or tr
        node = node.parent;
        /* c8 ignore start unable to reproduce, still worth a guard */
        if (DEBUG && !node) throw errors.invalid_layout(template);
        /* c8 ignore stop */
        pos = index + name.length + 3;
        // ignore the closing tag regardless of the content
        skip++;
        continue;
      }
    }
  }

  if (pos < content.length)
    append(node, new Text(content.slice(pos)));

  /* c8 ignore start */
  if (DEBUG && hole < holes.length) throw errors.invalid_template(template);
  /* c8 ignore stop */

  return [node, values];
};
