import { childNodes, ownerDocument, ownerElement, parentNode } from './symbols.js';
import { setParentNode } from './utils.js';
import { parseString } from './string-parser.js';

const start = Symbol('start');
const end = Symbol('end');

export default class Range {
  constructor() {
    this[ownerElement] = null;
    this[start] = null;
    this[end] = null;
  }

  setStartAfter(node) {
    this[start] = node.nextSibling;
  }

  setStartBefore(node) {
    this[start] = node;
  }

  setEndAfter(node) {
    this[end] = node;
  }

  deleteContents() {
    const { [start]: s, [end]: e } = this;
    const { [childNodes]: nodes } = s[parentNode];
    const si = nodes.indexOf(s);
    this[start] = null;
    this[end] = null;
    nodes.splice(si, nodes.indexOf(e) + 1 - si).forEach(setParentNode, null);
  }

  selectNodeContents(node) {
    this[ownerElement] = node;
  }

  createContextualFragment(text) {
    const { [ownerElement]: context } = this;
    return parseString(
      context[ownerDocument].createDocumentFragment(),
      'ownerSVGElement' in context,
      text
    );
  }
}
