export function unroll(cache: import("./literals.js").Cache, { s: stack, t: template, v: values }: Hole): Node;
/**
 * Holds all details needed to render the content on a render.
 * @constructor
 * @param {boolean} svg The content type.
 * @param {TemplateStringsArray} template The template literals used to the define the content.
 * @param {any[]} values Zero, one, or more interpolated values to render.
 */
export class Hole {
    constructor(svg: any, template: any, values: any);
    s: any;
    t: any;
    v: any;
}
