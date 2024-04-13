import { array, hole } from './handler.js';
import { cache } from './literals.js';
import create from './creator.js';
import parser from './parser.js';

const createHTML = create(parser(false));
const createSVG = create(parser(true));

/**
 * @param {import("./literals.js").Cache} info
 * @param {Hole} hole
 * @returns {Node}
 */
const unroll = (info, { s, t, v }) => {
  if (info.a !== t) {
    const { b, c } = (s ? createSVG : createHTML)(t, v);
    info.a = t;
    info.b = b;
    info.c = c;
  }
  for (let { c } = info, i = 0; i < c.length; i++) {
    const value = v[i];
    const detail = c[i];
    switch (detail.u) {
      case array:
        detail.v = array(
          detail.t,
          unrollValues(detail.c, value),
          detail.v
        );
        break;
      case hole:
        const current = value instanceof Hole ?
          unroll(detail.c || (detail.c = cache()), value) :
          (detail.c = null, value)
        ;
        if (current !== detail.v)
          detail.v = hole(detail, current);
        break;
      default:
        if (value !== detail.v)
          detail.v = detail.u(detail.t, value, detail.n, detail.v);
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
