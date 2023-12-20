export type Cache = import("./literals.js").Cache;
export type Target = import("./literals.js").Target;
export type Value = import("./literals.js").Value;
export type Bound = (ref: any, key: string | number) => Tag;
export type Tag = (template: TemplateStringsArray, ...values: Value[]) => Target;
import { Hole } from './rabbit.js';
import render from './render/keyed.js';
import { html } from './index.js';
import { svg } from './index.js';
/** @type {Bound} Returns a bound tag to render HTML content. */
export const htmlFor: Bound;
/** @type {Bound} Returns a bound tag to render SVG content. */
export const svgFor: Bound;
import { attr } from './handler.js';
export { Hole, render, html, svg, attr };
