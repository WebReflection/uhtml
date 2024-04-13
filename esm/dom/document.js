import { DOCUMENT_NODE } from 'domconstants/constants';

import { setParentNode } from './utils.js';

import { childNodes, documentElement, nodeName, ownerDocument, __chunks__ } from './symbols.js';

import Attribute from './attribute.js';
import Comment from './comment.js';
import DocumentFragment from './document-fragment.js';
import DocumentType from './document-type.js';
import Element from './element.js';
import Event from './event.js';
import SVGElement from './svg-element.js';
import Parent from './parent.js';
import Range from './range.js';
import Text from './text.js';
import TreeWalker from './tree-walker.js';

const doctype = Symbol('doctype');
const head = Symbol('head');
const body = Symbol('body');

const defaultView = Object.create(globalThis, {
  Event: { value: Event },
});

/** @typedef {import("./attribute.js").Attribute} Attribute */

export default class Document extends Parent {
  constructor(type = 'html') {
    super(DOCUMENT_NODE, null)[nodeName] = '#document';
    this[documentElement] = null;
    this[doctype] = null;
    this[head] = null;
    this[body] = null;
    this[__chunks__] = false;
    if (type === 'html') {
      const html = (this[documentElement] = new Element(type, this));
      this[childNodes] = [
        (this[doctype] = new DocumentType(type, this)),
        html
      ].map(setParentNode, this)
      html[childNodes] = [
        (this[head] = new Element('head', this)),
        (this[body] = new Element('body', this)),
      ].map(setParentNode, html);
    }
  }

  /** @type {globalThis} */
  get defaultView() {
    return defaultView;
  }

  /** @type {import("./document-type.js").default?} */
  get doctype() {
    return this[doctype];
  }

  /** @type {import("./element.js").default?} */
  get documentElement() {
    return this[documentElement];
  }

  /** @type {import("./element.js").default?} */
  get head() {
    return this[head];
  }

  /** @type {import("./element.js").default?} */
  get body() {
    return this[body];
  }

  /** @type {Attribute} */
  createAttribute(name) {
    const attribute = new Attribute(name);
    attribute[ownerDocument] = this;
    return attribute;
  }

  /** @type {import("./comment.js").default} */
  createComment(data) {
    return new Comment(data, this);
  }

  /** @type {import("./document-fragment.js").default} */
  createDocumentFragment() {
    return new DocumentFragment(this);
  }

  /** @type {import("./element.js").default} */
  createElement(name, options = null) {
    const element = new Element(name, this);
    if (options?.is) element.setAttribute('is', options.is);
    return element;
  }

  /** @type {import("./svg-element.js").default} */
  createElementNS(_, name) {
    return new SVGElement(name, this);
  }

  /** @type {globalThis.Range} */
  createRange() {
    return new Range;
  }

  /** @type {import("./text.js").default} */
  createTextNode(data) {
    return new Text(data, this);
  }

  /** @type {globalThis.TreeWalker} */
  createTreeWalker(parent, accept) {
    return new TreeWalker(parent, accept);
  }

  /**
   * Same as `document.importNode`
   * @template T
   * @param {T} externalNode
   * @param {boolean} deep
   * @returns {T}
   */
  importNode(externalNode, deep = false) {
    return externalNode.cloneNode(deep);
  }

  toString() {
    return this[childNodes].join('');
  }
}
