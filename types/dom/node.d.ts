/**
 * @param {TemplateStringsArray | string[]} template
 * @param {unknown[]} values
 * @returns {Container | Node}
 */
export function html(template: TemplateStringsArray | string[], ...values: unknown[]): Container | Node;
/**
 * @param {TemplateStringsArray | string[]} template
 * @param {unknown[]} values
 * @returns {Container | Node}
 */
export function svg(template: TemplateStringsArray | string[], ...values: unknown[]): Container | Node;
export function render(where: Container, what: Function | Container | Node): Container;
export { unsafe } from "../utils.js";
export type Container = globalThis.Element | globalThis.HTMLElement | globalThis.SVGSVGElement | globalThis.DocumentFragment;
