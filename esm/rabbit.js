import { array, hole } from './handler.js';
import { cache } from './literals.js';
import create from './creator.js';
import parser from './parser.js';

const { assign } = Object;

const parseHTML = create(parser(false));
const parseSVG = create(parser(true));

/**
 * @param {import("./literals.js").Cache} info
 * @param {Hole} hole
 * @returns {Node}
 */
const unroll = (info, { s, t, v }) => {
  if (info.a !== t)
    assign(info, (s ? parseSVG : parseHTML)(t, v));
  for (let { c } = info, i = 0; i < c.length; i++) {
    const value = v[i];
    const detail = c[i];
    const { v: previous, u: update, t: target, n: name } = detail;
    switch (update) {
      case array:
        detail.v = array(
          target,
          unrollValues(detail.c, value),
          previous
        );
        break;
      case hole:
        const current = value instanceof Hole ?
          unroll(detail.c || (detail.c = cache()), value) :
          (detail.c = null, value)
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
  return info.b;
};

/**
 * @param {Cache} cache
 * @param {any[]} values
 * @returns {number}
 */
const unrollValues = (stack, values) => {
  let i = 0, { length } = values;
  if (length < stack.length) stack.splice(length);
  for (; i < length; i++) {
    const value = values[i];
    if (value instanceof Hole)
      values[i] = unroll(stack[i] || (stack[i] = cache()), value);
    else stack[i] = null;
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
  toDOM(info = cache()) {
    return unroll(info, this);
  }
};
