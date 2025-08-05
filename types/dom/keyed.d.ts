export const keyed: WeakMap<WeakKey, any>;
export class Keyed extends Map<any, any> {
    constructor();
    get(key: any): any;
    /**
     * @param {any} key
     * @param {Node} node
     * @param {import('./rabbit.js').Hole} hole
     */
    set(key: any, node: Node, hole: import("./rabbit.js").Hole): void;
}
