export type DOMValue = import("./literals.js").DOMValue;
export type Target = import("./literals.js").Target;
import render from './render-node.js';
/** @type {(template: TemplateStringsArray, ...values:DOMValue[]) => Target} A tag to render HTML content. */
export const html: (template: TemplateStringsArray, ...values: DOMValue[]) => Target;
/** @type {(template: TemplateStringsArray, ...values:DOMValue[]) => Target} A tag to render SVG content. */
export const svg: (template: TemplateStringsArray, ...values: DOMValue[]) => Target;
import { attr } from './handler.js';
export { render, attr };
