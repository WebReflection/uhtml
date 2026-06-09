import DEBUG from '../debug.js';
import errors from '../errors.js';
import { reduce } from '../utils.js';
import resolve from './resolve.js';
import set from './process.js';
import props from './props.js';
// import templates from './templates.js';
// import { isArray } from '../utils.js';
import { children } from './ish.js';
import { set as setRefs } from './ref.js';

import {
  ARRAY,
  COMMENT,
  COMPONENT,
  KEY,
  REF,
} from '../constants.js';

/** @typedef {globalThis.Element | globalThis.HTMLElement | globalThis.SVGSVGElement | globalThis.DocumentFragment} Container */

const create = ({ p: fragment, d: updates }, values) => {
  if (DEBUG && values.length) console.time(`mapping ${values.length} updates`);
  const root = document.importNode(fragment, true);
  let length = values.length;
  let node, prev, refs;
  // if (DEBUG && length !== updates.length) throw errors.invalid_interpolation(templates.get(fragment), values);
  while (length--) {
    const { p: path, d: update, t: type } = updates[length];
    const value = values[length];
    if (prev !== path) {
      node = resolve(root, path);
      prev = path;
      // if (DEBUG && !node) throw errors.invalid_path(templates.get(fragment), path);
    }

    if (type & COMPONENT) {
      const obj = props(node);
      if (type === COMPONENT) {
        if (DEBUG && typeof value !== 'function') throw errors.invalid_component(value);
        for (const { name, value } of node.attributes) obj[name] ??= value;
        obj.children ??= [...node.content.childNodes];
        const result = value(obj, {});
        if (result) node.replaceWith(result);
        else node.remove();
      }
      else update(obj, value);
    }
    else if (type !== KEY) {
      // if (DEBUG && (type & ARRAY) && !isArray(value)) throw errors.invalid_interpolation(templates.get(fragment), value);
      if (type === REF) (refs ??= []).push(node);
      const prev = type === COMMENT ? node : (type & ARRAY ? children : null);
      update(node, value, prev);
    }
    if (type & COMMENT) node.remove();
  }

  if (refs) setRefs(refs);

  if (DEBUG && values.length) console.timeEnd(`mapping ${values.length} updates`);
  return reduce(root);
};

const tag = (xml, cache = new WeakMap) =>
  /**
   * @param {TemplateStringsArray | string[]} template
   * @param {unknown[]} values
   * @returns {Container | Node}
   */
  (template, ...values) => create(
    cache.get(template) ?? set(xml, cache, template, values),
    values,
  );
;

export const html = tag(false);
export const svg = tag(true);

/**
 * @param {Container} where
 * @param {Function | Container | Node} what
 * @returns
 */
export const render = (where, what) => {
  const node = typeof what === 'function' ? what() : what;
  where.replaceChildren(node);
  // where.normalize(); can be performed, arbitrarily, after
  return where;
};

export { unsafe } from '../utils.js';
