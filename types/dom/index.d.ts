/**
 * @param {TemplateStringsArray | string[]} template
 * @param {unknown[]} values
 * @returns {Node | HTMLElement | SVGSVGElement | Hole}
 */
export function html(template: TemplateStringsArray | string[], ...values: unknown[]): Node | HTMLElement | SVGSVGElement | Hole;
/**
 * @param {TemplateStringsArray | string[]} template
 * @param {unknown[]} values
 * @returns {Node | HTMLElement | SVGSVGElement | Hole}
 */
export function svg(template: TemplateStringsArray | string[], ...values: unknown[]): Node | HTMLElement | SVGSVGElement | Hole;
export function render(where: Container, what: Function | Node | Container): Container;
export type Container = globalThis.Element | globalThis.HTMLElement | globalThis.SVGSVGElement | globalThis.DocumentFragment;
import { Hole } from './rabbit.js';
import { fragment } from './update.js';
import { unsafe } from '../utils.js';
export { Hole, fragment, unsafe };
