//@ts-check

import DEBUG from '../debug.js';
import errors from '../errors.js';

import resolve from './resolve.js';
import { children } from './ish.js';
import { effect } from './signals.js';
import { isArray } from '../utils.js';
import { PersistentFragment, diffFragment, nodes } from './persistent-fragment.js';
import { ARRAY, COMMENT, COMPONENT, EVENT, KEY, REF, SIGNAL, HOLE, ref } from './update.js';

import { _get as getDirect, _set as setDirect } from './direct.js';
import { Signal, _get as getSignal, _set as setSignal } from './signals.js';

/**
 * @param {Hole} hole
 * @returns
 */
export const dom = hole => diffFragment(hole.n ? hole.update(hole) : hole.valueOf(false), 1);

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
  setSignal((value, options) => i < length ? signals[i++] : (signals[i++] = signal(value, options)));
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
    //@ts-ignore
    hole.n.replaceWith(dom(value));
    hole = value;
  }
  return hole;
};

const notifyRefs = (refs, template) => {
  for (const node of refs) {
    const value = node[ref];
    switch (typeof value) {
      case 'object': {
        if (value instanceof Signal)
          value.value = node;
        else {
          //@ts-ignore
          if (DEBUG && !value) throw errors.invalid_ref(template);
          value.current = node;
        }
        break;
      }
      case 'function': {
        value(node);
        break;
      }
      //@ts-ignore
      default: if (DEBUG) throw errors.invalid_ref(template);
    }
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
    this.c = children;
    /** @type {Node?} */
    this.n = null;
    /** @type {number} */
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
    //@ts-ignore
    if (DEBUG && length !== updates.length) throw errors.invalid_interpolation(this.t[3], values);
    if (0 < length) {
      changes = updates.slice(0);
      while (length--) {
        //@ts-ignore
        const [path, update, type] = updates[length];
        const value = values[length];
        if (prev !== path) {
          node = resolve(root, path);
          prev = path;
          //@ts-ignore
          if (DEBUG && !node) throw errors.invalid_path(this.t[3], path);
        }
        if (type & COMPONENT) {
          const obj = node[props] || (node[props] = {});
          if (type === COMPONENT) {
            for (const { name, value } of node.attributes) obj[name] ??= value;
            obj.children ??= [...node.content.childNodes];
            //@ts-ignore
            let signals = [], bootstrap = true, entry, hole;
            effect(() => {
              if (bootstrap) {
                bootstrap = false;
                //@ts-ignore
                hole = component(value, obj, signals);
                //@ts-ignore
                if (!signals.length) signals = children;
                if (hole) node.replaceWith(dom(hole));
                else node.remove();
                //@ts-ignore
                changes[length] = (entry = [type, hole, obj]);
              }
              else {
                //@ts-ignore
                const result = component(value, obj, signals);
                if (hole) {
                  if (DEBUG && !(result instanceof Hole)) throw errors.invalid_component(value);
                  if (getHole(hole, /** @type {Hole} */(result)) === result) entry[2] = (hole = result);
                }
              }
            });
          }
          else {
            update(obj, value);
            //@ts-ignore
            changes[length] = [type, update, obj];
          }
        }
        else {
          let t = type, commit = true, isComment = type & COMMENT;
          //@ts-ignore
          if (DEBUG && (type & ARRAY) && !isArray(value)) throw errors.invalid_interpolation(this.t[3], value);
          if (!direct && isComment && !(type & SIGNAL)) {
            if (type & ARRAY) {
              commit = false;
              //@ts-ignore
              if (value.length) {
                //@ts-ignore
                const isHole = value[0] instanceof Hole;
                if (isHole) t |= HOLE;
                //@ts-ignore
                node.before(...(node[nodes] = isHole ? value.map(dom) : value));
              }
            }
            else if (value instanceof Hole) {
              t |= HOLE;
              commit = false;
              //@ts-ignore
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
          //@ts-ignore
          changes[length] = [t, update, value, node];
          if (direct && isComment) node.remove();
        }
      }
      //@ts-ignore
      if (refs) notifyRefs(refs, DEBUG && this.t[3]);
    }

    const { childNodes } = root;
    const size = childNodes.length;
    const n = size === 1 ? childNodes[0] : (size ? PersistentFragment(root) : root);
    if (!direct) {
      //@ts-ignore
      this.v = children;
      this.c = changes;
      this.n = n;
      if (-1 < this.k) {
        //@ts-ignore
        keys.set(changes[this.k][2], n, this);
      }
    }
    return n;
  }

  /**
   * @param {Hole} hole
   * @returns {Node}
   */
  update(hole) {
    const key = this.k;
    const changes = this.c;
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
          //@ts-ignore
          const result = value(prev, global);
          if (update) {
            if (DEBUG && !(result instanceof Hole)) throw errors.invalid_component(value);
            if (getHole(update, /** @type {Hole} */(result)) === result) entry[2] = result;
          }
        }
        else update(prev, value);
      }
      else {
        let change = value, isComment = type & COMMENT, isSignal = type & SIGNAL, isHole = type & HOLE;
        if (type & ARRAY) {
          if (DEBUG && !isArray(value)) throw errors.invalid_interpolation([], value);
          if (isComment) {
            //@ts-ignore
            const l = value.length;
            const h = prev.length;
            // TODO: a smarter differ that does not require 2 loops
            //@ts-ignore
            if (l && (isHole || (value[0] instanceof Hole && (entry[0] |= HOLE)))) {
              //@ts-ignore
              if (DEBUG && h && !(prev[0] instanceof Hole)) throw errors.invalid_interpolation([], value[0]);
              change = [];
              //@ts-ignore
              for (let c, p, j = 0, i = 0; i < l; i++) {
                //@ts-ignore
                c = value[i];
                //@ts-ignore
                change[i] = j < h && (p = prev[j++]).t === c.t ? (value[i] = p).update(c) : dom(c);
              }
            }
          }
          //@ts-ignore
          else if ((type & EVENT) && (value[0] === prev[0])) continue;
        }
        else if (isHole && !isSignal) {
          if (DEBUG && !(value instanceof Hole)) throw errors.invalid_interpolation([], value);
          value = getHole(prev, /** @type {Hole} */(value));
          //@ts-ignore
          change = value.n;
        }
        if (isSignal || value !== prev) {
          entry[2] = value;
          update(entry[3], change);
        }
      }
    }
    return /** @type {Node} */(this.n);
  }
}
