const { from } = Array;
const { iterator } = Symbol;

const asString = (_, i) => String(i);
const isIndex = ({ size }, name) => /^\d+$/.test(name) && name < size;

const namedNodeMapHandler = {
  get: (map, name) => {
    if (name === 'length') return map.size;
    if (name === iterator) return yieldAttributes.bind(map.values());
    return map.get(name) || (
      isIndex(map, name) ?
        [...map.values()][name] :
        void 0
    );
  },

  has: (map, name) => (
    name === 'length' ||
    name === iterator ||
    map.has(name) ||
    isIndex(map, name)
  ),

  ownKeys: map => [
    ...from({ length: map.size }, asString),
    ...map.keys(),
  ],
};

function* yieldAttributes() {
  for (const attribute of this)
    yield attribute;
}

export default attributes => new Proxy(attributes, namedNodeMapHandler);
