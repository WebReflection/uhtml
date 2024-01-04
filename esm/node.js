/*! (c) Andrea Giammarchi - MIT */
import { attr } from './handler.js';

import create from './creator.js';
import parser from './parser.js';
import render from './render/node.js';

/** @typedef {import("./literals.js").DOMValue} DOMValue */
/** @typedef {import("./literals.js").Target} Target */

const tag = svg => {
  const parse = create(parser(svg));
  return (template, ...values) => parse(template, values).n;
};

/** @type {(template: TemplateStringsArray, ...values:DOMValue[]) => Target} A tag to render HTML content. */
const html = tag(false);

/** @type {(template: TemplateStringsArray, ...values:DOMValue[]) => Target} A tag to render SVG content. */
const svg = tag(true);

export { render, html, svg, attr };
