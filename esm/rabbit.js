import { array, hole } from './handler.js';
import { cache as newCache } from './literals.js';
import { empty } from './utils.js';
import create from './creator.js';
import parser from './parser.js';

const { assign } = Object;

const parseHTML = create(parser(false));
const parseSVG = create(parser(true));

/**
 * @param {import("./literals.js").Cache} cache
 * @param {Hole} hole
 * @returns {Node}
 */
const unroll = (cache, { s, t, v }) => {
  if (cache.t !== t)
    assign(cache, (s ? parseSVG : parseHTML)(t, v));
  for (let { d, s } = cache, i = 0; i < d.length; i++) {
    const value = v[i];
    const detail = d[i];
    const { v: previous, u: update, t: target, n: name } = detail;
    switch (update) {
      case array:
        detail.v = array(
          target,
          unrollValues(s[i], value),
          previous
        );
        break;
      case hole:
        const current = value instanceof Hole ?
          unroll(s[i] || (s[i] = newCache(empty)), value) :
          (s[i] = null, value)
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
  toDOM(cache = newCache(empty)) {
    return unroll(cache, this);
  }
};
