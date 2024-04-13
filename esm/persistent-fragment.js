import { DOCUMENT_FRAGMENT_NODE } from 'domconstants/constants';
import custom from 'custom-function/factory';
import drop from './range.js';
import { empty } from './utils.js';

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

const comment = value => document.createComment(value);

/** @extends {DocumentFragment} */
export class PersistentFragment extends custom(DocumentFragment) {
  #firstChild = comment('<>');
  #lastChild = comment('</>');
  #nodes = empty;
  constructor(fragment) {
    super(fragment);
    this.replaceChildren(...[
      this.#firstChild,
      ...fragment.childNodes,
      this.#lastChild,
    ]);
    checkType = true;
  }
  get firstChild() { return this.#firstChild; }
  get lastChild() { return this.#lastChild; }
  get parentNode() { return this.#firstChild.parentNode; }
  remove() {
    remove(this, false);
  }
  replaceWith(node) {
    remove(this, true).replaceWith(node);
  }
  valueOf() {
    const { parentNode } = this;
    if (parentNode === this) {
      if (this.#nodes === empty)
        this.#nodes = [...this.childNodes];
    }
    else {
      /* c8 ignore start */
      // there are cases where a fragment might be just appended
      // out of the box without valueOf() invoke (first render).
      // When these are moved around and lose their parent and,
      // such parent is not the fragment itself, it's possible there
      // where changes or mutations in there to take care about.
      // This is a render-only specific issue but it's tested and
      // it's worth fixing to me to have more consistent fragments.
      if (parentNode) {
        let { firstChild, lastChild } = this;
        this.#nodes = [firstChild];
        while (firstChild !== lastChild)
          this.#nodes.push((firstChild = firstChild.nextSibling));
      }
      /* c8 ignore stop */
      this.replaceChildren(...this.#nodes);
    }
    return this;
  }
}
