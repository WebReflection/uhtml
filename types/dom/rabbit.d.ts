export function dom(hole: Hole): Node;
export class Hole {
    /**
     * @param {[DocumentFragment, unknown[], import('./keyed.js').Keyed?]} template
     * @param {unknown[]} values
     */
    constructor(template: [DocumentFragment, unknown[], import("./keyed.js").Keyed?], values: unknown[]);
    t: [DocumentFragment, unknown[], import("./keyed.js").Keyed?];
    v: unknown[];
    c: readonly any[];
    /** @type {Node?} */
    n: Node | null;
    /** @type {number} */
    k: number;
    /**
     * @param {boolean} [direct]
     * @returns {Node}
     */
    valueOf(direct?: boolean): Node;
    /**
     * @param {Hole} hole
     * @returns {Node}
     */
    update(hole: Hole): Node;
}
