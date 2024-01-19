import { empty } from './utils.js';

/** @typedef {import("./persistent-fragment.js").PersistentFragment} PersistentFragment */
/** @typedef {import("./rabbit.js").Hole} Hole */

/** @typedef {unknown} Value */
/** @typedef {Node | Element | PersistentFragment} Target */
/** @typedef {null | undefined | string | number | boolean | Node | Element | PersistentFragment} DOMValue */
/** @typedef {Hole | Node} ArrayValue */

export const abc = (a, b, c) => ({ a, b, c });

export const bc = (b, c) => ({ b, c });

/**
 * @typedef {Object} Detail
 * @property {any} v the current value of the interpolation / hole
 * @property {function} u the callback to update the value
 * @property {Node} t the target comment node or element
 * @property {string | null | Node} n the attribute name, if any, or `null`
 * @property {Cache | ArrayValue[] | null} c the cache value for this detail
 */

/**
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
 * @property {null | TemplateStringsArray} a the cached template
 * @property {null | Node | PersistentFragment} b the node returned when parsing the template
 * @property {Detail[]} c the list of updates to perform
 */

/**
 * @returns {Cache}
 */
export const cache = () => abc(null, null, empty);
