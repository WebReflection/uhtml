import DEBUG from '../debug.js';

const tree = DEBUG ?
  ((node, i) => i < 0 ? node : node?.children?.[i]) :
  ((node, i) => i < 0 ? node : node.children[i])
;

export default (root, path) => path.reduceRight(tree, root);
