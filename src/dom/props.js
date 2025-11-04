const props = new WeakMap;

export default node => {
  let obj = props.get(node);
  if (!obj) props.set(node, (obj = {}));
  return obj;
};
