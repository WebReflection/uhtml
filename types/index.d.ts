export type Value = import("./literals.js").Value;
import { Hole } from './rabbit.js';
import render from './render-hole.js';
/** @type {(template: TemplateStringsArray, ...values:Value[]) => Hole} A tag to render HTML content. */
export const html: (template: TemplateStringsArray, ...values: Value[]) => Hole;
/** @type {(template: TemplateStringsArray, ...values:Value[]) => Hole} A tag to render SVG content. */
export const svg: (template: TemplateStringsArray, ...values: Value[]) => Hole;
import { attr } from './handler.js';
export { Hole, render, attr };
