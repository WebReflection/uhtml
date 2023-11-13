import { cache } from './literals.js';
import { Hole, unroll } from './rabbit.js';
import { empty, set } from './utils.js';

/** @type {WeakMap<Element | DocumentFragment, import("./literals.js").Cache>} */
const known = new WeakMap;

/**
 * Render with smart updates within a generic container.
 * @template T
 * @param {T} where the DOM node where to render content
 * @param {() => Hole | Hole} what the hole to render
 * @returns
 */
export default (where, what) => {
  const info = known.get(where) || set(known, where, cache(empty));
  const hole = typeof what === 'function' ? what() : what;
  const { n } = info;
  const node = hole instanceof Hole ? unroll(info, hole) : hole;
  if (n !== node)
    where.replaceChildren((info.n = node));
  return where;
};
