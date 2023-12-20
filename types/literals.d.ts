export function cel(c: PersistentFragment, e: Entry[], l: number): {
    c: import("./persistent-fragment.js").PersistentFragment;
    e: Entry[];
    l: number;
};
/**
 * @typedef {Object} HoleDetails
 * @property {null | Node | PersistentFragment} n the current live node, if any and not the `t` one
 */
/** @type {() => HoleDetails} */
export const comment: () => HoleDetails;
export function detail(v: any, u: Function, t: Node, n: string): Detail;
export function entry(t: Type, p: number[], u: Function, n?: string): Entry;
export function cache(s: Cache[]): Cache;
export function parsed(n: Node | PersistentFragment, d: Detail[]): Parsed;
export type ATTRIBUTE_NODE = 2;
export type TEXT_NODE = 3;
export type COMMENT_NODE = 8;
export type Type = ATTRIBUTE_NODE | TEXT_NODE | COMMENT_NODE;
export type PersistentFragment = import("./persistent-fragment.js").PersistentFragment;
export type Hole = import("./rabbit.js").Hole;
export type Value = unknown;
export type Target = Node | Element | PersistentFragment;
export type DOMValue = null | undefined | string | number | boolean | Node | Element | PersistentFragment;
export type Entry = {
    type: Type;
    path: number[];
    update: Function;
    name: string;
};
export type HoleDetails = {
    /**
     * the current live node, if any and not the `t` one
     */
    n: null | Node | PersistentFragment;
};
export type Detail = {
    /**
     * the current value of the interpolation / hole
     */
    v: any;
    /**
     * the callback to update the value
     */
    u: Function;
    /**
     * the target comment node or element
     */
    t: Node;
    /**
     * the name of the attribute, if any
     */
    n: string;
};
export type Cache = {
    /**
     * the stack of caches per each interpolation / hole
     */
    s: Cache[];
    /**
     * the cached template
     */
    t: null | TemplateStringsArray;
    /**
     * the node returned when parsing the template
     */
    n: null | Node | PersistentFragment;
    /**
     * the list of updates to perform
     */
    d: Detail[];
};
export type Parsed = {
    /**
     * the returned node after parsing the template
     */
    n: Node | PersistentFragment;
    /**
     * the list of details to update the node
     */
    d: Detail[];
};
