//@ts-check

import DEBUG from '../debug.js';

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
 * @param {TemplateStringsArray | string[]} template
 * @param {unknown[]} values
 * @returns
 */
const set = (xml, twm, template, values) => {
  const parsed = parse(template, values, xml);
  //@ts-ignore
  parsed.push(isKeyed() ? new Keyed : null);
  //@ts-ignore
  if (DEBUG) parsed.push(template);
  //@ts-ignore
  parsed[0] = fragment(parsed[0].toString(), xml);
  twm.set(template, parsed);
  return parsed;
};

/**
 * @param {boolean} xml
 * @param {WeakMap<TemplateStringsArray | string[], [any, any[], Keyed?]>} twm
 * @returns
 */
const create = (xml, twm = new WeakMap) =>
  /**
   * @param {TemplateStringsArray | string[]} template
   * @param {unknown[]} values
   * @returns {Node | HTMLElement | SVGSVGElement | Hole}
   */
  (template, ...values) => {
    const hole = new Hole(
      twm.get(template) ?? set(xml, twm, template, values),
      values,
    );
    return getDirect() ? hole.valueOf(true) : hole;
  }
;

export const html = create(false);
export const svg = create(true);

const rendered = new WeakMap;

/**
 * @param {Container} where
 * @param {Function | Node | Container} what
 * @returns
 */
export const render = (where, what) => {
  const known = rendered.get(where);
  if (typeof what === 'function') {
    setDirect(false);
    let hole = what();
    if (known?.t !== hole.t) {
      where.replaceChildren(hole.valueOf(false));
      rendered.set(where, hole);
    }
    else known.update(hole);
  }
  else {
    setDirect(true);
    rendered.delete(where);
    where.replaceChildren(what instanceof Hole ? dom(what) : diffFragment(what, 1));
  }
  return where;
};
