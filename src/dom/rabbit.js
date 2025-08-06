//@ts-nocheck

import DEBUG from '../debug.js';
import errors from '../errors.js';

import resolve from './resolve.js';
import { children } from './ish.js';
import { effect } from './signals.js';
import { isArray } from '../utils.js';
import { PersistentFragment, diffFragment, nodes } from './persistent-fragment.js';
import { ARRAY, COMMENT, COMPONENT, EVENT, KEY, REF, SIGNAL, ref } from './update.js';

import { _get as getDirect, _set as setDirect } from './direct.js';
import { Signal, _get as getSignal, _set as setSignal } from './signals.js';

/**
 * @param {Hole} hole
 * @returns
 */
export const dom = hole => diffFragment(hole.n ? hole.update(hole) : hole.valueOf(false), 1);

const holed = (prev, current) => {
  const changes = [], h = prev.length, l = current.length;
  for (let c, p, j = 0, i = 0; i < l; i++) {
    c = current[i];
    changes[i] = j < h && (p = prev[j++]).t === c.t ? (current[i] = p).update(c) : c.valueOf(false);
  }
  return changes;
};

/**
 * @param {Hole} hole
 * @param {unknown} value
 * @returns {Node}
 */
const keyed = (hole, value) => /** @type {import('./keyed.js').Keyed} */(hole.t[2]).get(value)?.update(hole) ?? hole.valueOf(false);

/**
 * 
 * @param {Function} Component
 * @param {Object} obj
 * @param {unknown[]} signals
 * @returns {Hole}
 */
const component = (Component, obj, signals) => {
  const signal = getSignal();
  const length = signals.length;
  let i = 0;
  setSignal(/** @param {unknown} value */ value => i < length ? signals[i++] : (signals[i++] = signal(value)));
  const wasDirect = getDirect();
  if (wasDirect) setDirect(!wasDirect);
  try { return Component(obj, global); }
  finally {
    if (wasDirect) setDirect(wasDirect);
    setSignal(signal);
  }
};

/**
 * @param {Hole} hole
 * @param {Hole} value
 * @returns {Hole}
 */
const getHole = (hole, value) => {
  if (hole.t === value.t) {
    hole.update(value);
  }
  else {
    hole.n.replaceWith(dom(value));
    hole = value;
  }
  return hole;
};

const createEffect = (node, value, obj) => {
  let signals = [], entry = [COMPONENT, null, obj], bootstrap = true, hole;
  effect(() => {
    if (bootstrap) {
      bootstrap = false;
      hole = component(value, obj, signals);
      if (!signals.length) signals = children;
      if (hole) {
        node.replaceWith(dom(hole));
        entry[1] = hole;
      }
      else node.remove();
    }
    else {
      const result = component(value, obj, signals);
      if (hole) {
        if (DEBUG && !(result instanceof Hole)) throw errors.invalid_component(value);
        if (getHole(hole, /** @type {Hole} */(result)) === result) entry[2] = (hole = result);
      }
    }
  });
  return entry;
};

const updateRefs = refs => {
  for (const node of refs) {
    const value = node[ref];
    if (typeof value === 'function')
      value(node);
    else if (value instanceof Signal)
      value.value = node;
    else if (value)
      value.current = node;
  }
};

const props = Symbol();
const global = {};

export class Hole {
  /**
   * @param {[DocumentFragment, unknown[], import('./keyed.js').Keyed?]} template
   * @param {unknown[]} values
   */
  constructor(template, values) {
    this.t = template;
    this.v = values;
    this.n = null;
    this.k = -1;
  }

  /**
   * @param {boolean} [direct]
   * @returns {Node}
   */
  valueOf(direct = getDirect()) {
    const [fragment, updates, keys] = this.t;
    const root = document.importNode(fragment, true);
    const values = this.v;
    let length = values.length;
    let changes = children;
    let node, prev, refs;
    if (DEBUG && length !== updates.length) throw errors.invalid_interpolation(this.t[3], values);
    if (0 < length) {
      changes = updates.slice(0);
      while (length--) {
        const [path, update, type] = updates[length];
        const value = values[length];
        if (prev !== path) {
          node = resolve(root, path);
          prev = path;
          if (DEBUG && !node) throw errors.invalid_path(this.t[3], path);
        }
        if (type & COMPONENT) {
          const obj = node[props] || (node[props] = {});
          if (type === COMPONENT) {
            for (const { name, value } of node.attributes) obj[name] ??= value;
            obj.children ??= [...node.content.childNodes];
            changes[length] = createEffect(node, value, obj);
          }
          else {
            update(obj, value);
            changes[length] = [type, update, obj];
          }
        }
        else {
          let commit = true;
          if (DEBUG && (type & ARRAY) && !isArray(value)) throw errors.invalid_interpolation(this.t[3], value);
          if (!direct && (type & COMMENT) && !(type & SIGNAL)) {
            if (type & ARRAY) {
              commit = false;
              if (value.length)
                update(node, value[0] instanceof Hole ? holed(children, value) : value);
            }
            else if (value instanceof Hole) {
              commit = false;
              update(node, dom(value));
            }
          }
          if (commit) {
            if (type === KEY) {
              if (DEBUG && !keys) throw errors.invalid_key(value);
              this.k = length;
            }
            else {
              if (type === REF) (refs ??= new Set).add(node);
              update(node, value);
            }
          }
          changes[length] = [type, update, value, node];
          if (direct && (type & COMMENT)) node.remove();
        }
      }
      if (refs) updateRefs(refs);
    }

    const { childNodes } = root;
    const size = childNodes.length;
    const n = size === 1 ? childNodes[0] : (size ? PersistentFragment(root) : root);
    this.v = changes;
    this.n = n;
    if (-1 < this.k) keys.set(changes[this.k][2], n, this);
    return n;
  }

  /**
   * @param {Hole} hole
   * @returns {Node}
   */
  update(hole) {
    const key = this.k;
    const changes = this.v;
    const values = hole.v;

    if (-1 < key && changes[key][2] !== values[key])
      return keyed(hole, values[key]);

    let { length } = changes;
    while (length--) {
      const entry = changes[length];
      const [type, update, prev] = entry;
      if (type === KEY) continue;
      let value = values[length];
      if (type & COMPONENT) {
        if (type === COMPONENT) {
          if (DEBUG && typeof value !== 'function') throw errors.invalid_component(value);
          const result = value(prev, global);
          if (update) {
            if (DEBUG && !(result instanceof Hole)) throw errors.invalid_component(value);
            if (getHole(update, /** @type {Hole} */(result)) === result) entry[2] = result;
          }
        }
        else update(prev, value);
      }
      else {
        let change = value;
        if (type & ARRAY) {
          if (DEBUG && !isArray(value)) throw errors.invalid_interpolation([], value);
          if (type & COMMENT) {
            // TODO: a smarter differ that does not require 2 loops
            if (value.length) {
              if (value[0] instanceof Hole) {
                if (DEBUG && prev.length && !(prev[0] instanceof Hole)) throw errors.invalid_interpolation([], value[0]);
                change = holed(prev, value);
              }
            }
          }
          else if ((type & EVENT) && (value[0] === prev[0])) continue;
        }
        else if (type & COMMENT) {
          if (type & SIGNAL) {
            if (value === prev) {
              update(entry[3], change);
              continue;
            }
          }
          else if (prev instanceof Hole) {
            if (DEBUG && !(value instanceof Hole)) throw errors.invalid_interpolation([], value);
            value = getHole(prev, /** @type {Hole} */(value));
            change = value.n;
          }
        }
        if (value !== prev) {
          entry[2] = value;
          update(entry[3], change);
        }
      }
    }
    return /** @type {Node} */(this.n);
  }
}
