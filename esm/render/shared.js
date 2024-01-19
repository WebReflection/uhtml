import { Hole } from '../rabbit.js';
import { cache } from '../literals.js';
import { set } from '../utils.js';

/** @type {WeakMap<Element | DocumentFragment, import("../literals.js").Cache>} */
const known = new WeakMap;

/**
  * Render with smart updates within a generic container.
  * @template T
  * @param {T} where the DOM node where to render content
  * @param {(() => Hole) | Hole} what the hole to render
  * @returns
  */
export default (where, what, check) => {
  const info = known.get(where) || set(known, where, cache());
  const { b } = info;
  const hole = (check && typeof what === 'function') ? what() : what;
  const node = hole instanceof Hole ? hole.toDOM(info) : hole;
  if (b !== node)
    where.replaceChildren((info.b = node).valueOf());
  return where;
};
