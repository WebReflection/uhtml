/* c8 ignore start */
const asTemplate = template => (template?.raw || template)?.join?.(',') || 'unknown';
/* c8 ignore stop */

var errors = {
  text: (template, tag, value) => new SyntaxError(`Mixed text and interpolations found in text only <${tag}> element ${JSON.stringify(String(value))} in template ${asTemplate(template)}`),
  unclosed: (template, tag) => new SyntaxError(`The text only <${tag}> element requires explicit </${tag}> closing tag in template ${asTemplate(template)}`),
  unclosed_element: (template, tag) => new SyntaxError(`Unclosed element <${tag}> found in template ${asTemplate(template)}`),
  invalid_content: template => new SyntaxError(`Invalid content "<!" found in template: ${asTemplate(template)}`),
  invalid_closing: template => new SyntaxError(`Invalid closing tag: </... found in template: ${asTemplate(template)}`),
  invalid_nul: template => new SyntaxError(`Invalid content: NUL char \\x00 found in template: ${asTemplate(template)}`),
  invalid_comment: template => new SyntaxError(`Invalid comment: no closing --> found in template ${asTemplate(template)}`),
  invalid_layout: template => new SyntaxError(`Too many closing tags found in template ${asTemplate(template)}`),
  invalid_doctype: (template, value) => new SyntaxError(`Invalid doctype: ${value} found in template ${asTemplate(template)}`),

  // DOM ONLY
  /* c8 ignore start */
  invalid_template: template => new SyntaxError(`Invalid template - the amount of values does not match the amount of updates: ${asTemplate(template)}`),
  invalid_path: (template, path) => new SyntaxError(`Invalid path - unreachable node at the path [${path.join(', ')}] found in template ${asTemplate(template)}`),
  invalid_attribute: (template, kind) => new SyntaxError(`Invalid ${kind} attribute in template definition\n${asTemplate(template)}`),
  invalid_interpolation: (template, value) => new SyntaxError(`Invalid interpolation - expected hole or array: ${String(value)} found in template ${asTemplate(template)}`),
  invalid_hole: value => new SyntaxError(`Invalid interpolation - expected hole: ${String(value)}`),
  invalid_key: value => new SyntaxError(`Invalid key attribute or position in template: ${String(value)}`),
  invalid_ref: template => new SyntaxError(`Invalid ref attribute or position in template: ${asTemplate(template)}`),
  invalid_array: value => new SyntaxError(`Invalid array - expected html/svg but found something else: ${String(value)}`),
  invalid_component: value => new SyntaxError(`Invalid component: ${String(value)}`),
};

const { freeze} = Object;
/* c8 ignore stop */

// this is an essential ad-hoc DOM facade


const ELEMENT = 1;
const ATTRIBUTE = 2;
const TEXT = 3;
const COMMENT = 8;
const DOCUMENT_TYPE = 10;
const FRAGMENT = 11;
const COMPONENT = 42;

const TEXT_ELEMENTS = new Set([
  'plaintext',
  'script',
  'style',
  'textarea',
  'title',
  'xmp',
]);

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const props = freeze({});
const children = freeze([]);

const append = (node, child) => {
  if (node.children === children) node.children = [];
  node.children.push(child);
  child.parent = node;
  return child;
};

const prop = (node, name, value) => {
  if (node.props === props) node.props = {};
  node.props[name] = value;
};

const addJSON = (value, comp, json) => {
  if (value !== comp) json.push(value);
};

class Node {
  constructor(type) {
    this.type = type;
    this.parent = null;
  }

  toJSON() {
    //@ts-ignore
    return [this.type, this.data];
  }
}

class Comment extends Node {
  constructor(data) {
    super(COMMENT);
    this.data = data;
  }

  toString() {
    return `<!--${this.data}-->`;
  }
}

class DocumentType extends Node {
  constructor(data) {
    super(DOCUMENT_TYPE);
    this.data = data;
  }

  toString() {
    return `<!${this.data}>`;
  }
}

class Text extends Node {
  constructor(data) {
    super(TEXT);
    this.data = data;
  }

  toString() {
    return this.data;
  }
}

class Component extends Node {
  constructor() {
    super(COMPONENT);
    this.name = 'template';
    this.props = props;
    this.children = children;
  }

  toJSON() {
    const json = [COMPONENT];
    addJSON(this.props, props, json);
    addJSON(this.children, children, json);
    return json;
  }

  toString() {
    let attrs = '';
    for (const key in this.props) {
      const value = this.props[key];
      if (value != null) {
        /* c8 ignore start */
        if (typeof value === 'boolean') {
          if (value) attrs += ` ${key}`;
        }
        else attrs += ` ${key}="${value}"`;
        /* c8 ignore stop */
      }
    }
    return `<template${attrs}>${this.children.join('')}</template>`;
  }
}

class Element extends Node {
  constructor(name, xml = false) {
    super(ELEMENT);
    this.name = name;
    this.xml = xml;
    this.props = props;
    this.children = children;
  }

  toJSON() {
    const json = [ELEMENT, this.name, +this.xml];
    addJSON(this.props, props, json);
    addJSON(this.children, children, json);
    return json;
  }

  toString() {
    const { xml, name, props, children } = this;
    const { length } = children;
    let html = `<${name}`;
    for (const key in props) {
      const value = props[key];
      if (value != null) {
        if (typeof value === 'boolean') {
          if (value) html += xml ? ` ${key}=""` : ` ${key}`;
        }
        else html += ` ${key}="${value}"`;
      }
    }
    if (length) {
      html += '>';
      for (let text = !xml && TEXT_ELEMENTS.has(name), i = 0; i < length; i++)
        html += text ? children[i].data : children[i];
      html += `</${name}>`;
    }
    else if (xml) html += ' />';
    else html += VOID_ELEMENTS.has(name) ? '>' : `></${name}>`;
    return html;
  }
}

class Fragment extends Node {
  constructor() {
    super(FRAGMENT);
    this.name = '#fragment';
    this.children = children;
  }

  toJSON() {
    const json = [FRAGMENT];
    addJSON(this.children, children, json);
    return json;
  }

  toString() {
    return this.children.join('');
  }
}

//@ts-check


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
  do { node = node.parent; } while (ignore.has(node));
  return node;
};

var index = ({
  Comment: Comment$1 = Comment,
  DocumentType: DocumentType$1 = DocumentType,
  Text: Text$1 = Text,
  Fragment: Fragment$1 = Fragment,
  Element: Element$1 = Element,
  Component: Component$1 = Component,
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
  if (template.some(chunk => chunk.includes(NUL))) throw errors.invalid_nul(template);
  const content = template.join(NUL).trim();
  if (content.replace(/(\S+)=(['"])([\S\s]+?)\2/g, (...a) => /^[^\x00]+\x00|\x00[^\x00]+$/.test(a[3]) ? (xml = a[1]) : a[0]) !== content) throw errors.invalid_attribute(template, xml);
  const ignore = new Set;
  const values = [];
  let node = new Fragment$1, pos = 0, skip = 0, hole = 0, resolvedPath = children;
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
      append(node, new Text$1(content.slice(pos, index)));

    // holes
    if (chunk === NUL) {
      if (node.name === 'table') {
        node = append(node, new Element$1('tbody', xml));
        ignore.add(node);
      }
      const comment = append(node, new Comment$1('◦'));
      values.push(update(comment, COMMENT, path(comment), '', holes[hole++]));
      pos = index + 1;
    }
    // comments or doctype
    else if (chunk.startsWith('<!')) {
      const i = content.indexOf('>', index + 2);

      if (i < 0) throw errors.invalid_content(template);

      if (content.slice(i - 2, i + 1) === '-->') {
        if ((i - index) < 6) throw errors.invalid_comment(template);
        const data = content.slice(index + 4, i - 2);
        if (data[0] === '!') append(node, new Comment$1(data.slice(1).replace(/!$/, '')));
      }
      else {
        if (!content.slice(index + 2, i).toLowerCase().startsWith('doctype')) throw errors.invalid_doctype(template, content.slice(index + 2, i));
        append(node, new DocumentType$1(content.slice(index + 2, i)));
      }
      pos = i + 1;
    }
    // closing tag </> or </name>
    else if (chunk.startsWith('</')) {
      const i = content.indexOf('>', index + 2);
      if (i < 0) throw errors.invalid_closing(template);
      if (xml && node.name === 'svg') xml = false;
      node = /** @type {Container} */(parent(node, ignore));
      if (!node) throw errors.invalid_layout(template);
      pos = i + 1;
    }
    // opening tag <name> or <name />
    else {
      const i = index + chunk.length;
      const j = content.indexOf('>', i);
      const name = chunk.slice(1);

      if (j < 0) throw errors.unclosed_element(template, name);

      let tag = name;
      // <${Component} ... />
      if (name === NUL) {
        tag = 'template';
        node = append(node, new Component$1);
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
            node = append(node, new Element$1('tbody', xml));
            ignore.add(node);
          }
          if (node.name === 'tbody' && tag === 'td') {
            node = append(node, new Element$1('tr', xml));
            ignore.add(node);
          }
        }
        node = append(node, new Element$1(tag, xml ? tag !== 'svg' : false));
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
          if (!node) throw errors.invalid_layout(template);
          /* c8 ignore stop */
        }
      }
      else if (closed || VOID_ELEMENTS.has(tag)) {
        // void elements are never td or tr
        node = closed ? parent(node, ignore) : node.parent;
        
        /* c8 ignore start unable to reproduce, still worth a guard */
        if (!node) throw errors.invalid_layout();
        /* c8 ignore stop */
      }
      // <svg> switches to xml mode
      else if (tag === 'svg') xml = true;
      // text content / data elements content handling
      else if (TEXT_ELEMENTS.has(tag)) {
        const index = content.indexOf(`</${name}>`, pos);
        if (index < 0) throw errors.unclosed(template, tag);
        const value = content.slice(pos, index);
        // interpolation as text
        if (value.trim() === NUL) {
          skip++;
          values.push(update(node, TEXT, path(node), '', holes[hole++]));
        }
        else if (value.includes(NUL)) throw errors.text(template, tag, value);
        else append(node, new Text$1(value));
        // text elements are never td or tr
        node = node.parent;
        /* c8 ignore start unable to reproduce, still worth a guard */
        if (!node) throw errors.invalid_layout(template);
        /* c8 ignore stop */
        pos = index + name.length + 3;
        // ignore the closing tag regardless of the content
        skip++;
        continue;
      }
    }
  }

  if (pos < content.length)
    append(node, new Text$1(content.slice(pos)));

  /* c8 ignore start */
  if (hole < holes.length) throw errors.invalid_template(template);
  /* c8 ignore stop */

  return [node, values];
};

export { index as default };
