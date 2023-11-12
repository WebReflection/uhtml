const { isArray } = Array;
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
