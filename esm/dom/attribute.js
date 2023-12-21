import { ATTRIBUTE_NODE } from 'domconstants/constants';

import { escape } from 'html-escaper';

import Node from './node.js';

import { name, value, ownerElement, ownerDocument } from './symbols.js';

/** @typedef {Attribute} Attribute */

export default class Attribute extends Node {
  constructor(nodeName, nodeValue = '', owner = null) {
    super(ATTRIBUTE_NODE, owner?.[ownerDocument]);
    this[ownerElement] = owner;
    this[name] = nodeName;
    this.value = nodeValue;
  }

  /** @type {import("./element.js").default?} */
  get ownerElement() {
    return this[ownerElement];
  }

  /** @type {string} */
  get name() {
    return this[name];
  }

  /** @type {string} */
  get localName() {
    return this[name];
  }

  /** @type {string} */
  get nodeName() {
    return this[name];
  }

  /** @type {string} */
  get value() {
    return this[value];
  }
  set value(any) {
    this[value] = String(any);
  }

  /** @type {string} */
  get nodeValue() {
    return this[value];
  }

  toString() {
    const { [name]: key, [value]: val } = this;
    return val === '' ? key : `${key}="${escape(val)}"`;
  }
}
