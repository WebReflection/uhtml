export const cache = new WeakMap;

export const createCache = () => ({stack: [], entry: null, wire: null});

export const setCache = where => {
  const info = createCache();
  cache.set(where, info);
  return info;
};
