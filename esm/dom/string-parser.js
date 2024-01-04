import * as HTMLParser2 from 'htmlparser2';

import { SVG_NAMESPACE } from '../utils.js';

import Comment from './comment.js';
import Text from './text.js';

import { localName, ownerDocument, parentNode } from './symbols.js';
import { getNodes, isSVG } from './utils.js';

const { Parser } = HTMLParser2;
const { entries } = Object;

export const setAttributes = (child, attributes) => {
  for (const [name, value] of entries(attributes))
      child.setAttribute(name, value);
};

export const setChild = (parent, child) => {
  child[parentNode] = parent;
  getNodes(parent).push(child);
  return child;
};

export class Node {
  constructor(node, svg) {
    this.D = node[ownerDocument];
    this.n = node;
    this.s = svg;
    this.d = true;
  }

  onopentag(name, attributes) {
    const { D: document, n: node, s: svg } = this;
    const asSVG = svg || isSVG(name);
    this.n = setChild(
      node,
      asSVG ?
        document.createElementNS(SVG_NAMESPACE, name) :
        document.createElement(name)
    );
    if (asSVG) this.s = true;
    setAttributes(this.n, attributes);
  }

  onclosetag() {
    const { n: node, s: svg } = this;
    this.n = node[parentNode];
    if (svg && isSVG(this.n[localName]))
      this.s = false;
  }

  oncomment(text) {
    const { D: document, n: node } = this;
    node.appendChild(new Comment(text, document));
  }

  ontext(text) {
    const { D: document, n: node, d: data } = this;
    if (data) node.appendChild(new Text(text, document));
  }

  oncdatastart() { this.d = false }
  oncdataend() { this.d = true }
}

export const parse = (handler, xmlMode, text) => {
  const content = new Parser(handler, {
    lowerCaseAttributeNames: false,
    decodeEntities: true,
    recognizeCDATA: true,
    xmlMode
  });
  content.write(text);
  content.end();
};

export const parseString = (node, xmlMode, text) => {
  parse(new Node(node, xmlMode), xmlMode, text);
  return node;
};
