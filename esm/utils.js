const { isArray } = Array;
const { getPrototypeOf, getOwnPropertyDescriptor } = Object;

export { isArray };

export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export const empty = [];

export const newRange = () => document.createRange();

/**
 * Set the `key` `value` pair to the *Map* or *WeakMap* and returns the `value`
 * @template T
 * @param {Map | WeakMap} map
 * @param {any} key
 * @param {T} value
 * @returns {T}
 */
export const set = (map, key, value) => {
  map.set(key, value);
  return value;
};

/**
 * Return a descriptor, if any, for the referenced *Element*
 * @param {Element} ref
 * @param {string} prop
 * @returns 
 */
export const gPD = (ref, prop) => {
  let desc;
  do { desc = getOwnPropertyDescriptor(ref, prop); }
  while(!desc && (ref = getPrototypeOf(ref)));
  return desc;
};
