'use strict';
const createCache = () => ({
  stack: [],
  entry: null,
  wire: null
});
exports.createCache = createCache;

const setCache = (cache, key, value) => {
  cache.set(key, value);
  return value;
};
exports.setCache = setCache;
