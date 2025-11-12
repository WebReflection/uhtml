import DEBUG from '../debug.js';
import errors from '../errors.js';

import {
  ATTRIBUTE as TEMPLATE_ATTRIBUTE,
  COMMENT as TEMPLATE_COMMENT,
  COMPONENT as TEMPLATE_COMPONENT,
  DATA as TEMPLATE_DATA,
  TEXT as TEMPLATE_TEXT,
} from './ish.js';

import { Unsafe, assign, entries, pdt, reduce, isArray } from '../utils.js';
import { PersistentFragment, diffFragment } from './persistent-fragment.js';
import { ref } from './ref.js';
import creator from './creator.js';
import diff from './diff.js';

import {
  ARIA,
  ATTRIBUTE,
  COMMENT,
  COMPONENT,
  DATA,
  DIRECT,
  DOTS,
  EVENT,
  KEY,
  TEXT,
  TOGGLE,
  UNSAFE,
  REF,
  COMPONENT_DIRECT,
  COMPONENT_DOTS,
  COMPONENT_PROP,
  EVENT_ARRAY,
  COMMENT_ARRAY,
} from '../constants.js';

export const fragment = creator(document);

const aria = (node, curr, prev) => {
  if (prev !== curr) {
    for (const [key, value] of entries(curr))
      attribute.call(key === 'role' ? key : `aria-${key.toLowerCase()}`, node, value);
  }
  return curr;
};

const commentArray = (node, curr, prev) => diff(
  prev,
  curr,
  diffFragment,
  node
);

const commentHole = (node, curr, prev) => {
  const current = typeof curr === 'object' ? (curr ?? node) : getText(node, curr);
  if (current !== prev)
    prev.replaceWith(diffFragment(current, 1));
  return current;
};

const data = ({ dataset }, curr) => {
  for (const [key, value] of entries(curr)) {
    if (value == null) delete dataset[key];
    else dataset[key] = value;
  }
  return curr;
};

const dots = (node, curr) => {
  for (const [name, value] of entries(curr))
    attribute.call(name, node, value);
  return curr;
};

const [
  attributeFor,
  directFor,
  eventArrayFor,
  eventFor,
  toggleFor,
] = [
  attribute,
  direct,
  eventArray,
  event,
  toggle,
].map(
  fn => createFor.bind(fn, new Map)
);

const [
  unsafeSVG,
  unsafeHTML,
] = [
  unsafe,
  unsafe,
].map(
  (fn, i) => fn.bind([new WeakMap, !i])
);

const getTextWM = new WeakMap;
const getText = (node, text) => {
  let dom = getTextWM.get(node);
  if (dom) dom.data = text;
  else getTextWM.set(node, (dom = document.createTextNode(text)));
  return dom;
};

let k = false;
export const isKeyed = () => {
  const wasKeyed = k;
  k = false;
  return wasKeyed;
};

export const update = (node, type, path, name, hint) => {
  switch (type) {
    case TEMPLATE_COMPONENT: return pdt(path, hint, COMPONENT);
    case TEMPLATE_COMMENT: {
      if (isArray(hint)) return pdt(path, commentArray, COMMENT_ARRAY);
      if (hint instanceof Unsafe) return pdt(path, node.xml ? unsafeSVG : unsafeHTML, UNSAFE);
      return pdt(path, commentHole, COMMENT);
    }
    case TEMPLATE_TEXT: return pdt(path, directFor('textContent'), TEXT);
    case TEMPLATE_ATTRIBUTE: {
      const isComponent = node.type === TEMPLATE_COMPONENT;
      switch (name.at(0)) {
        case '@': {
          if (DEBUG && isComponent) throw errors.invalid_attribute([], name);
          const array = isArray(hint);
          const cb = array ? eventArrayFor : eventFor;
          return pdt(path, cb(name.slice(1)), array ? EVENT_ARRAY : EVENT);
        }
        case '?':
          if (DEBUG && isComponent) throw errors.invalid_attribute([], name);
          return pdt(path, toggleFor(name.slice(1)), TOGGLE);
        case '.': {
          return name === '...' ?
            pdt(path, isComponent ? assign : dots, isComponent ? COMPONENT_DOTS : DOTS) :
            pdt(path, directFor(name.slice(1)), isComponent ? COMPONENT_DIRECT : DIRECT)
          ;
        }
        default: {
          if (isComponent) return pdt(path, directFor(name), COMPONENT_PROP);
          if (name === 'aria') return pdt(path, aria, ARIA);
          if (name === 'data' && !/^object$/i.test(node.name)) return pdt(path, data, DATA);
          if (name === 'key') {
            if (DEBUG && 1 < path.length) throw errors.invalid_key(hint);
            return pdt(path, (k = true), KEY);
          };
          if (name === 'ref') return pdt(path, ref, REF);
          if (name.startsWith('on')) return pdt(path, directFor(name.toLowerCase()), DIRECT);
          return pdt(path, attributeFor(name), ATTRIBUTE);
        }
      }
    }
    case TEMPLATE_DATA: return pdt(path, directFor('data'), TEXT);
  }
};

function createFor(map, name) {
  let cb = map.get(name);
  if (!cb) map.set(name, (cb = this.bind(name)));
  return cb;
}

function attribute(node, curr) {
  'use strict';
  if (curr == null) node.removeAttribute(this);
  else node.setAttribute(this, curr);
  return curr;
}

function direct(ref, curr) {
  'use strict';
  ref[this] = curr;
  return curr;
}

function eventArray(node, curr, prev) {
  'use strict';
  if (prev.length) node.removeEventListener(this, ...prev);
  if (curr) node.addEventListener(this, ...curr);
  return curr;
}

function event(node, curr, prev) {
  'use strict';
  if (prev) node.removeEventListener(this, prev);
  if (curr) node.addEventListener(this, curr);
  return curr;
}

function toggle(node, curr) {
  'use strict';
  node.toggleAttribute(this, !!curr);
  return curr;
}

function unsafe(node, curr) {
  const [wm, xml] = this;
  const f = fragment(curr, xml);
  const u = reduce(f);
  const n = u === f ? PersistentFragment(u) : u;
  (wm.get(node) ?? node).replaceWith(n);
  wm.set(node, n);
  return curr;
}
