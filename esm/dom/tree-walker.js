import { COMMENT_NODE, ELEMENT_NODE } from 'domconstants/constants';

import { childNodes, nodeType } from './symbols.js';

const asType = (accept, type) => (
  (type === ELEMENT_NODE && (accept & 0x1)) ?
    ELEMENT_NODE :
  (type === COMMENT_NODE && (accept & 0x80)) ?
    COMMENT_NODE : 0
);

export default class TreeWalker {
  constructor(parent, accept) {
    this[childNodes] = walk(parent, accept);
  }
  nextNode() {
    const { value, done } = this[childNodes].next();
    return done ? null : value;
  }
}

function* walk(parent, accept) {
  for (const node of parent[childNodes]) {
    switch (asType(accept, node[nodeType])) {
      case ELEMENT_NODE:
        yield node;
        yield* walk(node, accept);
        break;
      case COMMENT_NODE:
        yield node;
        break;
    }
  }
}
