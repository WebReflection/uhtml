import udomdiff from 'udomdiff';
import { empty, isArray, set } from './utils.js';
import { diffFragment } from './persistent-fragment.js';
import drop from './range.js';

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const aria = (element, value) => {
  for (const key in value) {
    const $ = value[key];
    const name = key === 'role' ? key : `aria-${key}`;
    if ($ == null) element.removeAttribute(name);
    else element.setAttribute(name, $);
  }
  return value;
};

let listeners;

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const at = (element, value, name) => {
  name = name.slice(1);
  if (!listeners) listeners = new WeakMap;
  const known = listeners.get(element) || set(listeners, element, {});
  let current = known[name];
  if (current && current[0]) element.removeEventListener(...current);
  current = isArray(value) ? value : [value, false];
  known[name] = current;
  if (current[0]) element.addEventListener(...current);
  return value;
};

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const className = (element, value) => direct(element, value, 'className');

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const data = (element, value) => {
  const { dataset } = element;
  for (const key in value) {
    if (value[key] == null) delete dataset[key];
    else dataset[key] = value[key];
  }
  return value;
};

/**
 * @template T
 * @param {Element | CSSStyleDeclaration} ref
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const direct = (ref, value, name) => (ref[name] = value);

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const dot = (element, value, name) => direct(element, value, name.slice(1));

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const ref = (element, value) => {
  if (typeof value === 'function') value(element);
  else value.current = element;
  return value;
};

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const regular = (element, value, name) => {
  if (value == null) element.removeAttribute(name);
  else element.setAttribute(name, value);
  return value;
};

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const style = (element, value) => direct(element.style, value, 'cssText');

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const toggle = (element, value, name) => {
  element.toggleAttribute(name.slice(1), value);
  return value;
};

/**
 * @template T
 * @param {Node} node
 * @param {T} value
 * @param {string} _
 * @param {Node[]} prev
 * @returns {T}
 */
export const array = (node, value, _, prev) => {
  if (value.length)
    return udomdiff(node.parentNode, prev, value, diffFragment, node);
  else if (prev.length)
    drop(prev[0], prev.at(-1), false);
  return empty;
};

/**
 * @param {Element} element
 * @param {string} name
 * @returns
 */
export const attribute = (element, name) => {
  switch (name[0]) {
    case '.': return dot;
    case '?': return toggle;
    case '@': return at;
    default: {
      switch (name) {
        case 'aria': return aria;
        case 'class': return className;
        case 'data': return data;
        case 'ref': return ref;
        case 'style': return style;
        default: return name in element ? direct : regular;
      }
    }
  }
};

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
export const text = (element, value) => {
  element.texContent = value == null ? '' : value;
  return value;
};

/**
 * @template T
 * @this {import("./literals.js").HoleDetails}
 * @param {Node} node
 * @param {T} value
 * @returns {T}
 */
export function hole(node, value) {
  const n = this.n || (this.n = node);
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean': {
      if (n !== node) n.replaceWith((this.n = node));
      this.n.data = value;
      break;
    }
    case 'object':
    case 'undefined': {
      n.replaceWith((this.n = value == null ? node : value.valueOf()));
      break;
    }
  }
  return value;
};
