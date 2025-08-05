import DEBUG from '../debug.js';

const tree = DEBUG ?
  ((node, i) => i < 0 ? node?.content : node?.childNodes?.[i]) :
  ((node, i) => i < 0 ? node.content : node.childNodes[i])
;

export default (root, path) => path.reduceRight(tree, root);
