const { isArray } = Array;
const { getPrototypeOf, getOwnPropertyDescriptor } = Object;

export { isArray };

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

export const gPD = (ref, prop) => {
  let desc;
  do { desc = getOwnPropertyDescriptor(ref, prop); }
  while(!desc && (ref = getPrototypeOf(ref)));
  return desc;
};
