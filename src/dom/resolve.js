import DEBUG from '../debug.js';

const tree = DEBUG ?
  ((node, i) => node?.childNodes?.[i]) :
  ((node, i) => node.childNodes[i])
;

export default (root, path) => path.reduceRight(tree, root);
