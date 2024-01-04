import { DOCUMENT_FRAGMENT_NODE } from 'domconstants/constants';

import { nodeType, childNodes } from './symbols.js';

export const push = (array, nodes) => {
  array.push(...nodes.flatMap(withoutFragments));
};

export const splice = (array, start, drop, nodes) => {
  array.splice(start, drop, ...nodes.flatMap(withoutFragments));
};

export const unshift = (array, nodes) => {
  array.unshift(...nodes.flatMap(withoutFragments));
};

const withoutFragments = node => (
  node[nodeType] === DOCUMENT_FRAGMENT_NODE ?
    node[childNodes].splice(0) : node
);
