export const createCache = () => ({
  stack: [],
  entry: null,
  wire: null
});

export const setCache = (cache, key, value) => {
  cache.set(key, value);
  return value;
};
