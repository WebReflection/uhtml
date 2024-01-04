/*! (c) Andrea Giammarchi - MIT */
import { Hole } from './rabbit.js';
import { attr } from './handler.js';

import render from './render/hole.js';

/** @typedef {import("./literals.js").Value} Value */

const tag = svg => (template, ...values) => new Hole(svg, template, values);

/** @type {(template: TemplateStringsArray, ...values:Value[]) => Hole} A tag to render HTML content. */
const html = tag(false);

/** @type {(template: TemplateStringsArray, ...values:Value[]) => Hole} A tag to render SVG content. */
const svg = tag(true);

export { Hole, render, html, svg, attr };
