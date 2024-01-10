import { ELEMENT_NODE, TEXT_NODE } from 'domconstants/constants';
import { VOID_ELEMENTS } from 'domconstants/re';

import Attribute from './attribute.js';
import DocumentFragment from './document-fragment.js';
import Parent from './parent.js';

import namedNodeMap from './named-node-map.js';
import stringMap from './string-map.js';
import tokenList from './token-list.js';

import { parseString } from './string-parser.js';
import { cloned, setParentNode, withNewParent } from './utils.js';

import { attributes, name, value, localName, childNodes, nodeType, ownerDocument, ownerElement, parentNode } from './symbols.js';

const getAttributes = element => (
  element[attributes] || (element[attributes] = new Map)
);

/** @typedef {import("./attribute.js").Attribute} Attribute */

export default class Element extends Parent {
  constructor(name, owner = null) {
    super(ELEMENT_NODE, owner)[localName] = name;
    this[attributes] = null;
  }

  /** @type {globalThis.NamedNodeMap} */
  get attributes() {
    return namedNodeMap(getAttributes(this));
  }

  /** @type {globalThis.DOMStringMap} */
  get dataset() {
    return stringMap(this);
  }

  /** @type {globalThis.DOMTokenList} */
  get classList() {
    return tokenList(this);
  }

  /** @type {import("./document-fragment.js").default} */
  get content() {
    const fragment = new DocumentFragment(this[ownerDocument]);
    const { [childNodes]: nodes } = this;
    if (nodes.length)
      fragment[childNodes] = nodes.map(cloned, fragment);
    return fragment;
  }

  /** @type {string} */
  get localName() {
    return this[localName];
  }

  /** @type {string} */
  get nodeName() {
    return this[localName].toUpperCase();
  }

  /** @type {string} */
  get tagName() {
    return this[localName].toUpperCase();
  }

  /** @type {string} */
  get outerHTML() {
    return this.toString();
  }

  // TODO: this is way too simple but it should work for uhtml
  /** @type {{cssText: string}} */
  get style() {
    const self = this;
    return {
      get cssText() {
        return self.getAttribute('style') || '';
      },
      set cssText(value) {
        self.setAttribute('style', value);
      }
    };
  }

  /** @type {string} */
  get innerHTML() {
    return this[childNodes].join('');
  }
  set innerHTML(text) {
    const fragment = parseString(
      this[ownerDocument].createDocumentFragment(),
      'ownerSVGElement' in this,
      text
    );
    this[childNodes] = fragment[childNodes].map(setParentNode, this);
  }

  /** @type {string} */
  get textContent() {
    const data = [];
    for (const node of this[childNodes]) {
      switch (node[nodeType]) {
        case TEXT_NODE:
          data.push(node.data);
          break;
        case ELEMENT_NODE:
          data.push(node.textContent);
          break;
      }
    }
    return data.join('');
  }
  set textContent(data) {
    this[childNodes].forEach(setParentNode, null);
    const text = this[ownerDocument].createTextNode(data);
    this[childNodes] = [setParentNode.call(this, text)];
  }

  /** @type {string} */
  get id() {
    return this.getAttribute('id') || '';
  }
  set id(value) {
    this.setAttribute('id', value);
  }

  /** @type {string} */
  get className() {
    return this.getAttribute('class') || '';
  }
  set className(value) {
    this.setAttribute('class', value);
  }

  cloneNode(deep = false) {
    const element = new Element(this[localName], this[ownerDocument]);
    const { [attributes]: attrs, [childNodes]: nodes } = this;
    if (attrs) {
      const map = (element[attributes] = new Map);
      for (const { [name]: key, [value]: val } of this[attributes].values())
        map.set(key, new Attribute(key, val, element));
    }
    if (deep && nodes.length)
      element[childNodes] = nodes.map(cloned, element);
    return element;
  }

  /**
   * @param {string} name 
   * @returns {string?}
   */
  getAttribute(name) {
    const attribute = this[attributes]?.get(name);
    return attribute ? attribute.value : null;
  }

  /**
   * @param {string} name 
   * @returns {Attribute?}
   */
  getAttributeNode(name) {
    return this[attributes]?.get(name) || null
  }

  /**
   * @returns {string[]}
   */
  getAttributeNames() {
    const { [attributes]: attrs } = this;
    return attrs ? [...attrs.keys()] : [];
  }

  /**
   * @param {string} name
   * @returns {boolean}
   */
  hasAttribute(name) {
    return !!this[attributes]?.has(name);
  }

  /**
   * @returns {boolean}
   */
  hasAttributes() {
    return !!this[attributes]?.size;
  }

  /**
   * @param {string} name
   */
  removeAttribute(name) {
    const attribute = this[attributes]?.get(name);
    if (attribute) {
      attribute[ownerElement] = null;
      this[attributes].delete(name);
    }
  }

  /**
   * @param {Attribute} attribute
   */
  removeAttributeNode(attribute) {
    this[attributes]?.delete(attribute[name]);
    attribute[ownerElement] = null;
  }

  /**
   * @param {string} name
   * @param {string} value
   */
  setAttribute(name, value) {
    const attributes = getAttributes(this);
    const attribute = attributes.get(name);
    if (attribute)
      attribute.value = value;
    else {
      const attribute = new Attribute(name, value, this);
      attributes.set(name, attribute);
    }
  }

  /**
   * @param {Attribute} attribute
   */
  setAttributeNode(attribute) {
    attribute[ownerElement]?.removeAttributeNode(attribute);
    attribute[ownerElement] = this;
    getAttributes(this).set(attribute[name], attribute);
  }

  /**
   * @param {string} name
   * @param {boolean?} force
   * @returns {boolean}
   */
  toggleAttribute(name, ...rest) {
    if (this.hasAttribute(name)) {
      if (!rest.at(0)) {
        this.removeAttribute(name);
        return false;
      }
      return true;
    }
    else if (rest.length < 1 || rest.at(0)) {
      this.setAttribute(name, '');
      return true;
    }
    return false;
  }

  toString() {
    const { [localName]: name, [childNodes]: nodes, [attributes]: attrs } = this;
    const html = ['<', name];
    if (attrs?.size) {
      for (const attribute of attrs.values())
        html.push(' ', attribute);
    }
    html.push('>', ...nodes);
    if (!VOID_ELEMENTS.test(name))
      html.push('</', name, '>');
    return html.join('');
  }
}
