export const cache = new WeakMap;

export const cacheInfo = () => ({sub: [], stack: [], wire: null});

export const setCache = where => {
  const info = cacheInfo();
  cache.set(where, info);
  return info;
};
