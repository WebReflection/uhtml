import { empty } from './utils.js';

/** @typedef {import("./persistent-fragment.js").PersistentFragment} PersistentFragment */
/** @typedef {import("./rabbit.js").Hole} Hole */

/** @typedef {unknown} Value */
/** @typedef {Node | Element | PersistentFragment} Target */
/** @typedef {null | undefined | string | number | boolean | Node | Element | PersistentFragment} DOMValue */

/**
 * @param {DocumentFragment} f content retrieved from the template
 * @param {Entry[]} e entries per each hole in the template
 * @param {boolean} d direct node to handle
 * @returns
 */
export const cel = (f, e, d) => ({ f, e, d });

/**
 * @typedef {Object} Detail
 * @property {any} v the current value of the interpolation / hole
 * @property {function} u the callback to update the value
 * @property {Node} t the target comment node or element
 * @property {string | null} n the attribute name, if any, or `null`
 */

/**
 * @param {any} v the current value of the interpolation / hole
 * @param {function} u the callback to update the value
 * @param {Node} t the target comment node or element
 * @param {string | null} n the attribute name, if any, or `null`
 * @param {Cache | null} c the cache value for this detail
 * @returns {Detail}
 */
export const detail = (v, u, t, n, c) => ({ v, u, t, n, c });

/**
 * @typedef {Object} Entry
 * @property {number[]} p the path to retrieve the node
 * @property {function} u the update function
 * @property {string | null} n the attribute name, if any, or `null`
 */

/**
 * @param {number[]} p the path to retrieve the node
 * @param {function} u the update function
 * @param {string | null} n the attribute name, if any, or `null`
 * @returns {Entry}
 */
export const entry = (p, u, n) => ({ p, u, n });

/**
 * @typedef {Object} Cache
 * @property {null | TemplateStringsArray} t the cached template
 * @property {null | Node | PersistentFragment} n the node returned when parsing the template
 * @property {Detail[]} d the list of updates to perform
 * @property {Cache[]} s the stack of caches per each interpolation / hole
 */

/**
 * @returns {Cache}
 */
export const cache = () => resolved(null, null, empty, empty);

/**
 * @property {null | TemplateStringsArray} t the cached template
 * @property {null | Node | PersistentFragment} n the node returned when parsing the template
 * @property {Detail[]} d the list of updates to perform
 * @property {Cache[]} s the stack of caches per each interpolation / hole
 * @returns {Cache}
 */
export const resolved = (t, n, d, s) => ({ t, n, d, s });

/**
 * @typedef {Object} Parsed
 * @property {Node | PersistentFragment} n the returned node after parsing the template
 * @property {Detail[]} d the list of details to update the node
 */
