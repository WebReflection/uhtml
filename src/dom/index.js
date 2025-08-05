//@ts-check

import DEBUG from '../debug.js';

//@ts-ignore
import { effectScope } from '@webreflection/alien-signals';
export { signal, computed, effect, untracked, batch } from './signals.js';

import {
  Comment,
  DocumentType,
  Text,
  Fragment,
  Element,
  Component,
} from './ish.js';

import parser from '../parser/index.js';
import { Hole, dom } from './rabbit.js';
import { Keyed } from './keyed.js';
import { isKeyed, fragment, update } from './update.js';
import { diffFragment } from './persistent-fragment.js';

import { _get as getDirect, _set as setDirect } from './direct.js';

import { unsafe } from '../utils.js';
export { Hole, fragment, unsafe };

/** @typedef {globalThis.Element | globalThis.HTMLElement | globalThis.SVGSVGElement | globalThis.DocumentFragment} Container */

const parse = parser({
  Comment,
  DocumentType,
  Text,
  Fragment,
  Element,
  Component,
  update,
});

/**
 * @param {boolean} xml
 * @param {WeakMap<TemplateStringsArray | string[], [any, any[], Keyed?]>} twm
 * @returns
 */
const create = (xml, twm = new WeakMap) =>
  /**
   * @param {TemplateStringsArray | string[]} template
   * @param {unknown[]} values
   * @returns {Hole}
   */
  (template, ...values) => {
    let parsed = twm.get(template);
    if (!parsed) {
      parsed = parse(template, values, xml);
      parsed.push(isKeyed() ? new Keyed : null);
      if (DEBUG) parsed.push(template);
      parsed[0] = fragment(parsed[0].toString(), xml);
      twm.set(template, parsed);
    }
    return new Hole(parsed, values);
  };

const htmlHole = create(false);
const svgHole = create(true);

const rendered = new WeakMap;

/**
 * @param {TemplateStringsArray | string[]} template
 * @param {any[]} values
 * @returns {Node | HTMLElement | Hole}
 */
export function html(template, ...values) {
  const hole = htmlHole.apply(null, arguments);
  return getDirect() ? hole.valueOf(true) : hole;
}

/**
 * @param {TemplateStringsArray | string[]} template
 * @param {any[]} values
 * @returns {Node | SVGSVGElement | Hole}
 */
export function svg(template, ...values) {
  const hole = svgHole.apply(null, arguments);
  return getDirect() ? hole.valueOf(true) : hole;
}

/**
 * @param {Container} where
 * @param {Function | Node | Container} what
 * @returns
 */
export const render = (where, what) => {
  const known = rendered.get(where);
  if (known) known[0]();
  if (typeof what === 'function') {
    setDirect(false);
    let hole;
    const scope = effectScope(() => { hole = what() });
    //@ts-ignore
    if (!known || known[1].t !== hole.t) {
      //@ts-ignore
      const d = hole.valueOf(false);
      where.replaceChildren(d);
    }
    else known[1].update(hole);
    rendered.set(where, [scope, hole]);
  }
  else {
    setDirect(true);
    rendered.delete(where);
    where.replaceChildren(what instanceof Hole ? dom(what) : diffFragment(what, 1));
  }
  return where;
};
