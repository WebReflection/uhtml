import { PersistentFragment } from './persistent-fragment.js';
import { abc, cache, detail } from './literals.js';
import { empty, find, set } from './utils.js';
import { array, hole } from './handler.js';
import { parse } from './parser.js';
import {
  Hole,
  render as _render,
  html, svg,
  htmlFor, svgFor,
  attr
} from './keyed.js';

const parseHTML = parse(false, true);
const parseSVG = parse(true, true);

const hydrate = (fragment, {s, t, v}) => {
  const { b: entries, c: direct } = (s ? parseSVG : parseHTML)(t, v);
  const { length } = entries;
  if (length !== v.length) return noHydration;
  let root = fragment, details = length ? [] : empty;
  if (!direct) {
    if (
      fragment.firstChild?.data !== '<>' ||
      fragment.lastChild?.data !== '</>'
    ) return noHydration;
    root = PersistentFragment.adopt(fragment);
  }
  for (let current, prev, i = 0; i < length; i++) {
    const { a: path, b: update, c: name } = entries[i];
    // TODO: node should be adjusted if it's array or hole
    //       * if it's array, no way caching it as current helps
    //       * if it's a hole or attribute/text thing, current helps
    let node = path === prev ? current : (current = find(root, (prev = path)));
    details[i] = detail(
      update,
      node,
      name,
      // TODO: find and resolve the array via the next `<!--[i]-->`
      // TODO: resolve the cache via the surrounding hole
      update === array ? [] : (update === hole ? cache() : null)
    );
  }
  return abc(t, root, details);
};

const known = new WeakMap;
const noHydration = cache();

const render = (where, what) => {
  const hole = typeof what === 'function' ? what() : what;
  if (hole instanceof Hole) {
    const info = known.get(where) || set(known, where, hydrate(where, hole));
    if (info.a === hole.t) {
      hole.toDOM(info);
      return where;
    }
  }
  return _render(where, hole);
};

const { document } = globalThis;

export { Hole, document, render, html, svg, htmlFor, svgFor, attr };
