const refs = new WeakMap;

export const set = list => {
  for (let node, value, type, i = 0; i < list.length; i++) {
    node = list[i];
    value = refs.get(node);
    type = typeof value;
    if (type === 'function') value(node);
    else if (type === 'object' && value) value.current = node;
  }
};

export const ref = (node, curr) => {
  refs.set(node, curr);
  return curr;
};
