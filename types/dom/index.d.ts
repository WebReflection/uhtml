/**
 * @param {TemplateStringsArray | string[]} template
 * @param {any[]} values
 * @returns {Node | HTMLElement | Hole}
 */
export function html(template: TemplateStringsArray | string[], ...values: any[]): Node | HTMLElement | Hole;
/**
 * @param {TemplateStringsArray | string[]} template
 * @param {any[]} values
 * @returns {Node | SVGSVGElement | Hole}
 */
export function svg(template: TemplateStringsArray | string[], ...values: any[]): Node | SVGSVGElement | Hole;
export function render(where: Container, what: Function | Node | Container): Container;
export type Container = globalThis.Element | globalThis.HTMLElement | globalThis.SVGSVGElement | globalThis.DocumentFragment;
import { Hole } from './rabbit.js';
import { fragment } from './update.js';
import { unsafe } from '../utils.js';
export { Hole, fragment, unsafe };
export { signal, computed, effect, untracked, batch } from "./signals.js";
