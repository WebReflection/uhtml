import { cache } from './literals.js';
import { Hole, unroll } from './rabbit.js';
import { empty, set } from './utils.js';
import { html, svg } from './index.js';
import { attr } from './handler.js';
import render from './render-keyed.js';

/** @typedef {import("./literals.js").Cache} Cache */
/** @typedef {import("./literals.js").Target} Target */
/** @typedef {import("./literals.js").Value} Value */

/** @typedef {(ref:Object, key:string | number) => Tag} Bound */

/**
 * @callback Tag
 * @param {TemplateStringsArray} template
 * @param  {...Value} values
 * @returns {Target}
 */

const keyed = new WeakMap;
const createRef = svg => /** @type {Bound} */ (ref, key) => {
  /** @type {Tag} */
  function tag(template, ...values) {
    return unroll(this, new Hole(svg, template, values));
  }

  const memo = keyed.get(ref) || set(keyed, ref, new Map);
  return memo.get(key) || set(memo, key, tag.bind(cache(empty)));
};

/** @type {Bound} Returns a bound tag to render HTML content. */
const htmlFor = createRef(false);

/** @type {Bound} Returns a bound tag to render SVG content. */
const svgFor = createRef(true);

export { Hole, render, html, svg, htmlFor, svgFor, attr };
