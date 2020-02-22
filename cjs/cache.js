'use strict';
const cache = new WeakMap;
exports.cache = cache;

const cacheInfo = () => ({sub: [], stack: [], wire: null});
exports.cacheInfo = cacheInfo;

const setCache = where => {
  const info = cacheInfo();
  cache.set(where, info);
  return info;
};
exports.setCache = setCache;
