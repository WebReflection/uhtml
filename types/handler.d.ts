/**
 * @template T
 * @this {import("./literals.js").HoleDetails}
 * @param {Node} node
 * @param {T} value
 * @returns {T}
 */
export function hole<T>(this: import("./literals.js").HoleDetails, node: Node, value: T): T;
export class hole<T> {
    /**
     * @template T
     * @this {import("./literals.js").HoleDetails}
     * @param {Node} node
     * @param {T} value
     * @returns {T}
     */
    constructor(this: import("./literals.js").HoleDetails, node: Node, value: T);
    n: Object;
}
export function array(node: Node, value: Node[], _: string, prev: Node[]): Node[];
export const attr: Map<string, <T>(element: Element, value: T) => T>;
export function attribute(element: HTMLElement | SVGElement, name: string, svg: boolean): <T>(element: Element, value: T, name: string) => T;
export function text<T>(element: Element, value: T): T;
