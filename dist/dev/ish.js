const { isArray } = Array;
const { assign, freeze} = Object;
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

const setChildren = (node, json) => {
  node.children = json.map(revive, node);
};

const setJSON = (node, json, index) => {
  switch (json.length) {
    case index: setChildren(node, json[index - 1]);
    case index - 1: {
      const value = json[index - 2];
      if (isArray(value)) setChildren(node, value);
      else node.props = assign({}, value);
    }
  }
  return node;
};

function revive(json) {
  const node = fromJSON(json);
  node.parent = this;
  return node;
}

const fromJSON = json => {
  switch (json[0]) {
    case COMMENT: return new Comment(json[1]);
    case DOCUMENT_TYPE: return new DocumentType(json[1]);
    case TEXT: return new Text(json[1]);
    case COMPONENT: return setJSON(new Component, json, 3);
    case ELEMENT: return setJSON(new Element(json[1], !!json[2]), json, 5);
    case FRAGMENT: {
      const node = new Fragment;
      if (1 < json.length) node.children = json[1].map(revive, node);
      return node;
    }
  }
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

export { ATTRIBUTE, COMMENT, COMPONENT, Comment, Component, DOCUMENT_TYPE, DocumentType, ELEMENT, Element, FRAGMENT, Fragment, Node, TEXT, TEXT_ELEMENTS, Text, VOID_ELEMENTS, append, children, fromJSON, prop, props };
