import {
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
} from 'domconstants/constants';

import { childNodes, nodeType, ownerDocument, parentNode } from './symbols.js';
import { changeParentNode, withNewParent } from './utils.js';
import { splice } from './array.js';

/** @typedef {string | Node} Child */

export default class Node {
  static {
    this.ELEMENT_NODE           = ELEMENT_NODE;
    this.ATTRIBUTE_NODE         = ATTRIBUTE_NODE;
    this.TEXT_NODE              = TEXT_NODE;
    this.COMMENT_NODE           = COMMENT_NODE;
    this.DOCUMENT_NODE          = DOCUMENT_NODE;
    this.DOCUMENT_FRAGMENT_NODE = DOCUMENT_FRAGMENT_NODE;
  }

  constructor(type, owner) {
    this[parentNode] = null;
    this[nodeType] = type;
    this[ownerDocument] = owner;
  }

  /** @type {import("./parent.js").default?} */
  get parentNode() {
    return this[parentNode];
  }

  /** @type {ELEMENT_NODE | ATTRIBUTE_NODE | TEXT_NODE | COMMENT_NODE | DOCUMENT_NODE | DOCUMENT_FRAGMENT_NODE} */
  get nodeType() {
    return this[nodeType];
  }

  /** @type {import("./document.js").default?} */
  get ownerDocument() {
    return this[ownerDocument];
  }

  /** @type {boolean} */
  get isConnected() {
    let { [parentNode]: parent, [ownerDocument]: owner } = this;
    while (parent && parent !== owner)
      parent = parent[parentNode];
    return parent === owner;
  }

  /** @type {import("./element.js").default?} */
  get parentElement() {
    const { [parentNode]: parent } = this;
    return parent?.[nodeType] === ELEMENT_NODE ? parent : null;
  }

  /** @type {Node?} */
  get previousSibling() {
    const nodes = this[parentNode]?.[childNodes];
    if (nodes) {
      const i = nodes.indexOf(this);
      if (i > 0) return nodes[i - 1];
    }
    return null;
  }

  /** @type {import("./element.js").default?} */
  get previousElementSibling() {
    const nodes = this[parentNode]?.[childNodes];
    if (nodes) {
      let i = nodes.indexOf(this);
      while (i-- && nodes[i][nodeType] !== ELEMENT_NODE);
      return i < 0 ? null : nodes[i];
    }
    return null;
  }

  /** @type {Node?} */
  get nextSibling() {
    const nodes = this[parentNode]?.[childNodes];
    return nodes && nodes.at(nodes.indexOf(this) + 1) || null;
  }

  /** @type {import("./element.js").default?} */
  get nextElementSibling() {
    const nodes = this[parentNode]?.[childNodes];
    if (nodes) {
      let i = nodes.indexOf(this);
      while (++i < nodes.length && nodes[i][nodeType] !== ELEMENT_NODE);
      return i < nodes.length ? nodes[i] : null;
    }
    return null;
  }

  /** @type {Node[]} */
  get childNodes() {
    return [];
  }

  remove() {
    changeParentNode(this, null);
  }

  /**
   * @param  {...Child} values
   */
  replaceWith(...values) {
    const { [parentNode]: parent } = this;
    if (parent) {
      const { [childNodes]: nodes } = parent;
      splice(nodes, nodes.indexOf(this), 1, values.map(withNewParent, parent));
      this[parentNode] = null;
    }
  }
}
