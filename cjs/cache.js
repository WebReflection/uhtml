'use strict';
const cache = new WeakMap;
exports.cache = cache;

const createCache = () => ({stack: [], entry: null, wire: null});
exports.createCache = createCache;

const setCache = where => {
  const info = createCache();
  cache.set(where, info);
  return info;
};
exports.setCache = setCache;
