/**
 * @param {TemplateStringsArray | string[]} template
 * @param {unknown[]} values
 * @returns {import("../dom/ish.js").Node}
 */
export function html(template: TemplateStringsArray | string[], ...values: unknown[]): import("../dom/ish.js").Node;
/**
 * @param {TemplateStringsArray | string[]} template
 * @param {unknown[]} values
 * @returns {import("../dom/ish.js").Node}
 */
export function svg(template: TemplateStringsArray | string[], ...values: unknown[]): import("../dom/ish.js").Node;
export function render(where: any, what: any): any;
export { unsafe } from "../utils.js";
