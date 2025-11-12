// TODO align with the new parser/updates expectations

import DEBUG from '../debug.js';
import errors from '../errors.js';
import { assign } from '../utils.js';
import set from './process.js';
import props from '../dom/props.js';
import { set as setRefs } from '../dom/ref.js';

import {
  fromJSON,
  replaceWith,
  remove,
  children,
} from '../dom/ish.js';

import resolve from './resolve.js';
import { ARRAY, COMMENT, COMPONENT, KEY, REF } from '../constants.js';

const create = ({ p: json, d: updates }, values) => {
  if (DEBUG && values.length) console.time(`mapping ${values.length} updates`);
  const root = fromJSON(json);
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
        const result = value(assign({}, node.props, { children: node.children }, obj), {});
        if (result) replaceWith(node, result);
        else remove(node);
      }
      else update(obj, value);
    }
    else if (type !== KEY) {
      // if (DEBUG && (type & ARRAY) && !isArray(value)) throw errors.invalid_interpolation(templates.get(fragment), value);
      if (type === REF) (refs ??= []).push(node);
      const prev = type === COMMENT ? node : (type & ARRAY ? children : null);
      update(node, value, prev);
    }
    if (type & COMMENT) remove(node);
  }

  if (refs) setRefs(refs);

  if (DEBUG && values.length) console.timeEnd(`mapping ${values.length} updates`);
  return root.children.length === 1 ? root.children[0] : root;
};

const tag = (xml, cache = new WeakMap) =>
  /**
   * @param {TemplateStringsArray | string[]} template
   * @param {unknown[]} values
   * @returns {import("../dom/ish.js").Node}
   */
  (template, ...values) => create(
    cache.get(template) ?? set(xml, cache, template, values),
    values,
  );
;

export const html = tag(false);
export const svg = tag(true);

export const render = (where, what) => {
  const content = (typeof what === 'function' ? what() : what).toString();
  if (!where.write) return where(content);
  where.write(content);
  return where;
};

export { unsafe } from '../utils.js';
