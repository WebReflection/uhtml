import DEBUG from '../debug.js';
import errors from '../errors.js';

import {
  ATTRIBUTE as TEMPLATE_ATTRIBUTE,
  COMMENT as TEMPLATE_COMMENT,
  COMPONENT as TEMPLATE_COMPONENT,
  TEXT as TEMPLATE_TEXT,
  children,
} from './ish.js';

import { Signal } from './signals.js';
import { Unsafe, assign, entries, isArray } from '../utils.js';
import { PersistentFragment, diffFragment, nodes } from './persistent-fragment.js';
import creator from './creator.js';
import domdiff from './diff.js';

export const ARRAY = 1 << 0;
export const ARIA = 1 << 1;
export const ATTRIBUTE = 1 << 2;
export const COMMENT = 1 << 3;
export const COMPONENT = 1 << 4;
export const DATA = 1 << 5;
export const DIRECT = 1 << 6;
export const DOTS = 1 << 7;
export const EVENT = 1 << 8;
export const KEY = 1 << 9;
export const PROP = 1 << 10;
export const TEXT = 1 << 11;
export const TOGGLE = 1 << 12;
export const UNSAFE = 1 << 13;
export const REF = 1 << 14;

// COMPONENT flags
const COMPONENT_DIRECT = COMPONENT | DIRECT;
const COMPONENT_DOTS = COMPONENT | DOTS;
const COMPONENT_PROP = COMPONENT | PROP;
const EVENT_ARRAY = EVENT | ARRAY;
const COMMENT_ARRAY = COMMENT | ARRAY;

export const fragment = creator(document);
export const ref = Symbol('ref');

const aria = (node, values) => {
  for (const [key, value] of entries(values)) {
    const name = key === 'role' ? key : `aria-${key.toLowerCase()}`;
    if (value == null) node.removeAttribute(name);
    else node.setAttribute(name, value);
  }
};

const attribute = name => (node, value) => {
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
};

const comment_array = (node, value) => {
  node[nodes] = domdiff(
    node[nodes] || children,
    value,
    diffFragment,
    node
  );
};

const comment_hole = (node, value) => {
  const current = value == null ? node : (typeof value === 'object' ? value : document.createTextNode(value));
  (node[nodes] || node).replaceWith(diffFragment(current, 1));
  node[nodes] = current;
};

const comment_unsafe = xml => (node, value) => {
  comment_hole(node, PersistentFragment(fragment(value, xml)));
};

const comment_signal = (node, value) => {
  comment_hole(node, value instanceof Signal ? value.value : value);
};

const data = ({ dataset }, values) => {
  for (const [key, value] of entries(values)) {
    if (value == null) delete dataset[key];
    else dataset[key] = value;
  }
};

/** @type {Map<string|Symbol, Function>} */
const directRefs = new Map;

/**
 * @param {string|Symbol} name
 * @returns {Function}
 */
const directFor = name => {
  let fn = directRefs.get(name);
  if (!fn) directRefs.set(name, (fn = direct(name)));
  return fn;
};

const direct = name => (node, value) => {
  node[name] = value;
};

const dots = (node, values) => {
  const xml = 'ownerSVGElement' in node;
  for (const [name, value] of entries(values))
    attribute(name)(node, value);
};

const event = (type, at, array) => array ?
  ((node, value) => {
    const prev = node[at];
    if (prev?.length) node.removeEventListener(type, ...prev);
    if (value) node.addEventListener(type, ...value);
    node[at] = value;
  }) :
  ((node, value) => {
    const prev = node[at];
    if (prev) node.removeEventListener(type, prev);
    if (value) node.addEventListener(type, value);
    node[at] = value;
  })
;

const toggle = name => (node, value) => {
  node.toggleAttribute(name, !!value);
};

let k = false;
export const isKeyed = () => {
  const wasKeyed = k;
  k = false;
  return wasKeyed;
};

export const update = (node, type, path, name, hint) => {
  switch (type) {
    case TEMPLATE_COMPONENT: return [path, hint, COMPONENT];
    case TEMPLATE_COMMENT: {
      if (isArray(hint)) return [path, comment_array, COMMENT_ARRAY];
      return hint instanceof Unsafe ?
        [path, comment_unsafe(node.xml), UNSAFE] :
        [path, hint instanceof Signal ? comment_signal : comment_hole, COMMENT]
      ;
    }
    case TEMPLATE_TEXT: return [path, directFor('textContent'), TEXT];
    case TEMPLATE_ATTRIBUTE: {
      const isComponent = node.type === TEMPLATE_COMPONENT;
      switch (name.at(0)) {
        case '@': {
          if (DEBUG && isComponent) throw errors.invalid_attribute([], name);
          const array = isArray(hint);
          return [path, event(name.slice(1), Symbol(name), array), array ? EVENT_ARRAY : EVENT];
        }
        case '?':
          if (DEBUG && isComponent) throw errors.invalid_attribute([], name);
          return [path, toggle(name.slice(1)), TOGGLE];
        case '.': {
          return name === '...' ?
            [path, isComponent ? assign : dots, isComponent ? COMPONENT_DOTS : DOTS] :
            [path, direct(name.slice(1)), isComponent ? COMPONENT_DIRECT : DIRECT]
          ;
        }
        default: {
          if (isComponent) return [path, direct(name), COMPONENT_PROP];
          if (name === 'aria') return [path, aria, ARIA];
          if (name === 'data' && !/^object$/i.test(node.name)) return [path, data, DATA];
          if (name === 'key') {
            if (DEBUG && 1 < path.length) throw errors.invalid_key(hint);
            return [path, (k = true), KEY];
          };
          if (name === 'ref') return [path, directFor(ref), REF];
          if (name.startsWith('on')) return [path, directFor(name.toLowerCase()), DIRECT];
          return [path, attribute(name), ATTRIBUTE];
        }
      }
    }
  }
};
