/*! (c) Andrea Giammarchi - MIT */
import { Hole, unroll } from './rabbit.js';
import { attr } from './handler.js';
import { cache } from './literals.js';
import { empty } from './utils.js';

/** @typedef {import("./literals.js").DOMValue} DOMValue */
/** @typedef {import("./literals.js").Target} Target */

const tag = svg => (template, ...values) => unroll(
  cache(empty),
  new Hole(svg, template, values)
);

/** @type {(template: TemplateStringsArray, ...values:DOMValue[]) => Target} A tag to render HTML content. */
const html = tag(false);

/** @type {(template: TemplateStringsArray, ...values:DOMValue[]) => Target} A tag to render SVG content. */
const svg = tag(true);

/**
 * Render directly within a generic container.
 * @template T
 * @param {T} where the DOM node where to render content
 * @param {(() => Target) | Target} what the node to render
 * @returns
 */
const render = (where, what) => {
  where.replaceChildren(
    (typeof what === 'function' ? what() : what).valueOf()
  );
  return where;
};

export { render, html, svg, attr };
