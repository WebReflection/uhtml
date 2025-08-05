//@ts-check

import { createComment, defineProperties } from '../utils.js';
import { children } from './ish.js';

let checkType = false, range;

/**
 * @param {DocumentFragment} fragment
 * @returns {Node | Element}
 */
const drop = ({ firstChild, lastChild }) => {
  const r = range || (range = document.createRange());
  r.setStartAfter(firstChild);
  r.setEndAfter(lastChild);
  r.deleteContents();
  //@ts-ignore
  return firstChild;
};

/**
 * @param {Node} node
 * @param {1 | 0 | -0 | -1} operation
 * @returns {Node}
 */
export const diffFragment = (node, operation) => (
  checkType && node.nodeType === 11 ?
    ((1 / operation) < 0 ?
      //@ts-ignore
      (operation ? drop(node) : node.lastChild) :
      //@ts-ignore
      (operation ? node.valueOf() : node.firstChild)) :
    node
);

export const nodes = Symbol('nodes');

const parentNode = { get() { return this.firstChild.parentNode } };
//@ts-ignore
const replaceWith = { value(node) { drop(this).replaceWith(node) } };
//@ts-ignore
const remove = { value() { drop(this).remove() } };
const valueOf = {
  value() {
    const { parentNode } = this;
    if (parentNode === this) {
      if (this[nodes] === children)
        this[nodes] = [...this.childNodes];
    }
    else {
      // TODO: verify fragments in lists don't call this twice
      if (parentNode) {
        let { firstChild, lastChild } = this;
        this[nodes] = [firstChild];
        while (firstChild !== lastChild)
          this[nodes].push((firstChild = firstChild.nextSibling));
      }
      this.replaceChildren(...this[nodes]);
    }
    return this;
  }
};

/**
 * @param {DocumentFragment} fragment
 * @returns {DocumentFragment}
 */
export function PersistentFragment(fragment) {
  const firstChild = createComment('<>'), lastChild = createComment('</>');
  //@ts-ignore
  fragment.replaceChildren(firstChild, ...fragment.childNodes, lastChild);
  checkType = true;
  return defineProperties(fragment, {
    [nodes]: { writable: true, value: children },
    firstChild: { value: firstChild },
    lastChild: { value: lastChild },
    parentNode,
    valueOf,
    replaceWith,
    remove,
  });
}

PersistentFragment.prototype = DocumentFragment.prototype;
