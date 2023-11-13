import { cache } from './literals.js';
import { empty, isArray } from './utils.js';
import create from './creator.js';
import parser from './parser.js';

const parseHTML = create(parser(false));
const parseSVG = create(parser(true));

/**
 * @param {import("./literals.js").Cache} cache
 * @param {Hole} hole
 * @returns {Node}
 */
export const unroll = (cache, { s: svg, t: template, v: values }) => {
  if (values.length && cache.s === empty) cache.s = [];
  unrollValues(cache, values);
  if (cache.t !== template) {
    const { n: node, d: details } = (svg ? parseSVG : parseHTML)(template, values);
    cache.t = template;
    cache.n = node;
    cache.d = details;
  }
  else {
    const { d: details } = cache;
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      const value = values[i];
      const { v: previous } = detail;
      if (value !== previous) {
        const { u: update, t: target, n: name } = detail;
        detail.v = update(target, value, name, previous);
      }
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
  const { length } = values;
  for (let i = 0; i < length; i++) {
    const hole = values[i];
    if (hole instanceof Hole)
      values[i] = unroll(stack[i] || (stack[i] = cache(empty)), hole);
    else if (isArray(hole))
      unrollValues(stack[i] || (stack[i] = cache([])), hole);
    else
      stack[i] = null;
  }
  if (length < stack.length) stack.splice(length);
  return length;
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
