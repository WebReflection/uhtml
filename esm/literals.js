import { empty } from './utils.js';

/** @typedef {import("./persistent-fragment.js").PersistentFragment} PersistentFragment */
/** @typedef {import("./rabbit.js").Hole} Hole */

/** @typedef {unknown} Value */
/** @typedef {Node | Element | PersistentFragment} Target */
/** @typedef {null | undefined | string | number | boolean | Node | Element | PersistentFragment} DOMValue */

export const abc = (a, b, c) => ({ a, b, c });

/**
 * @typedef {Object} Detail
 * @property {any} v the current value of the interpolation / hole
 * @property {function} u the callback to update the value
 * @property {Node} t the target comment node or element
 * @property {string | null} n the attribute name, if any, or `null`
 * @param {Cache | Hole[] | Node[] | null} c the cache value for this detail
 */

/**
 * @param {function} u the callback to update the value
 * @param {Node} t the target comment node or element
 * @param {string | null} n the attribute name, if any, or `null`
 * @param {Cache | null} c the cache value for this detail
 * @returns {Detail}
 */
export const detail = (u, t, n, c) => ({ v: empty, u, t, n, c });

/**
 * @typedef {Object} Entry
 * @property {number[]} a the path to retrieve the node
 * @property {function} b the update function
 * @property {string | null} c the attribute name, if any, or `null`
 */

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
export const cache = () => abc(null, null, empty);

/**
 * @typedef {Object} Parsed
 * @property {Node | PersistentFragment} n the returned node after parsing the template
 * @property {Detail[]} d the list of details to update the node
 */
