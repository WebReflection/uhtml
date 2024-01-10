import { empty } from './utils.js';

/** @typedef {import("./persistent-fragment.js").PersistentFragment} PersistentFragment */
/** @typedef {import("./rabbit.js").Hole} Hole */

/** @typedef {unknown} Value */
/** @typedef {Node | Element | PersistentFragment} Target */
/** @typedef {null | undefined | string | number | boolean | Node | Element | PersistentFragment} DOMValue */

/**
 * @typedef {Object} Entry
 * @property {number[]} path
 * @property {function} update
 * @property {string} name
 */

/**
 * @param {PersistentFragment} c content retrieved from the template
 * @param {Entry[]} e entries per each hole in the template
 * @param {number} l the length of content childNodes
 * @returns
 */
export const cel = (c, e, l) => ({ c, e, l });

/**
 * @typedef {Object} Detail
 * @property {any} v the current value of the interpolation / hole
 * @property {function} u the callback to update the value
 * @property {Node} t the target comment node or element
 * @property {string} n the name of the attribute, if any
 */

/**
 * @param {any} v the current value of the interpolation / hole
 * @param {function} u the callback to update the value
 * @param {Node} t the target comment node or element
 * @param {string} n the name of the attribute, if any
 * @returns {Detail}
 */
export const detail = (v, u, t, n) => ({ v, u, t, n });

/**
 * @param {number[]} p the path to retrieve the node
 * @param {function} u the update function
 * @param {string} n the attribute name, if any
 * @returns {Entry}
 */
export const entry = (p, u, n = '') => ({ p, u, n });

/**
 * @typedef {Object} Cache
 * @property {Cache[]} s the stack of caches per each interpolation / hole
 * @property {null | TemplateStringsArray} t the cached template
 * @property {null | Node | PersistentFragment} n the node returned when parsing the template
 * @property {Detail[]} d the list of updates to perform
 */

/**
 * @param {Cache[]} s the cache stack
 * @returns {Cache}
 */
export const cache = s => ({ s, t: null, n: null, d: empty});

/**
 * @typedef {Object} Parsed
 * @property {Node | PersistentFragment} n the returned node after parsing the template
 * @property {Detail[]} d the list of details to update the node
 */

/**
 * @param {Node | PersistentFragment} n the returned node after parsing the template
 * @param {Detail[]} d the list of details to update the node
 * @returns {Parsed}
 */
export const parsed = (n, d) => ({ n, d });
