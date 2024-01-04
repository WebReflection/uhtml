import { DOCUMENT_FRAGMENT_NODE } from 'domconstants/constants';

import Parent from './parent.js';

import { cloned } from './utils.js';
import { childNodes, nodeName, ownerDocument } from './symbols.js';

export default class DocumentFragment extends Parent {
  constructor(owner = null) {
    super(DOCUMENT_FRAGMENT_NODE, owner)[nodeName] = '#document-fragment';
  }

  get nodeName() {
    return this[nodeName];
  }

  cloneNode(deep = false) {
    const fragment = new DocumentFragment(this[ownerDocument]);
    const { [childNodes]: nodes } = this;
    if (deep && nodes.length)
      fragment[childNodes] = nodes.map(cloned, fragment);
    return fragment;
  }

  toString() {
    return this[childNodes].join('');
  }
}
