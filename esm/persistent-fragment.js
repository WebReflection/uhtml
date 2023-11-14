import { DOCUMENT_FRAGMENT_NODE } from 'domconstants/constants';
import custom from 'custom-function/factory';
import drop from './range.js';

/**
 * @param {PersistentFragment} fragment
 * @returns {Node | Element}
 */
const remove = ({firstChild, lastChild}, preserve) => drop(firstChild, lastChild, preserve);

let checkType = false;

/**
 * @param {Node} node
 * @param {1 | 0 | -0 | -1} operation
 * @returns {Node}
 */
export const diffFragment = (node, operation) => (
  checkType && node.nodeType === DOCUMENT_FRAGMENT_NODE ?
    ((1 / operation) < 0 ?
      (operation ? remove(node, true) : node.lastChild) :
      (operation ? node.valueOf() : node.firstChild)) :
    node
);

/** @extends {DocumentFragment} */
export class PersistentFragment extends custom(DocumentFragment) {
  #nodes;
  #length;
  constructor(fragment) {
    const _nodes = [...fragment.childNodes];
    super(fragment);
    this.#nodes = _nodes;
    this.#length = _nodes.length;
    checkType = true;
  }
  get firstChild() { return this.#nodes[0]; }
  get lastChild() { return this.#nodes.at(-1); }
  get parentNode() { return this.#nodes[0].parentNode; }
  remove() {
    remove(this, false);
  }
  replaceWith(node) {
    remove(this, true).replaceWith(node);
  }
  valueOf() {
    if (this.childNodes.length !== this.#length)
      this.append(...this.#nodes);
    return this;
  }
}
