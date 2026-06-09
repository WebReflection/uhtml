import DEBUG from '../debug.js';

const tree = DEBUG ?
  ((node, i) => node?.children?.[i]) :
  ((node, i) => node.children[i])
;

export default (root, path) => path.reduceRight(tree, root);
