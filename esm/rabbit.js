import { array, hole, text } from './handler.js';
import { cache as newCache } from './literals.js';
import { empty } from './utils.js';
import create from './creator.js';
import parser from './parser.js';

const parseHTML = create(parser(false));
const parseSVG = create(parser(true));

const createCache = ({ u }) => (
  u === array ?
    newCache([]) : (
      u === hole ?
        newCache(empty) :
        null
  )
);

/**
 * @param {import("./literals.js").Cache} cache
 * @param {Hole} hole
 * @returns {Node}
 */
export const unroll = (cache, { s, t, v }) => {
  let i = 0, { d: details, s: stack } = cache;
  if (cache.t !== t) {
    const { n, d } = (s ? parseSVG : parseHTML)(t, v);
    cache.t = t;
    cache.n = n;
    cache.d = (details = d);
    if (v.length) cache.s = (stack = d.map(createCache));
  }
  for (; i < details.length; i++) {
    const value = v[i];
    const detail = details[i];
    const { v: previous, u: update, t: target, n: name } = detail;
    switch (update) {
      case array:
        detail.v = array(
          target,
          unrollValues(stack[i], value),
          previous
        );
        break;
      case hole:
        const current = value instanceof Hole ?
          unroll(stack[i], value) :
          value
        ;
        if (current !== previous)
          detail.v = hole.call(detail, target, current);
        break;
      default:
        if (value !== previous)
          detail.v = update(target, value, name, previous);
        break;
    }
  }
  return cache.n;
};

/**
 * @param {Cache} cache
 * @param {any[]} values
 * @returns {number}
 */
const unrollValues = ({ s: stack }, values) => {
  let i = 0, { length } = values;
  if (length < stack.length) stack.splice(length);
  for (; i < length; i++) {
    const value = values[i];
    const asHole = value instanceof Hole;
    const cache = stack[i] || (stack[i] = asHole ? newCache(empty) : null);
    if (asHole) values[i] = unroll(cache, value);
  }
  return values;
};

/**
 * Holds all details needed to render the content on a render.
 * @constructor
 * @param {boolean} svg The content type.
 * @param {TemplateStringsArray} template The template literals used to the define the content.
 * @param {any[]} values Zero, one, or more interpolated values to render.
 */
export class Hole {
  constructor(svg, template, values) {
    this.s = svg;
    this.t = template;
    this.v = values;
  }
};
