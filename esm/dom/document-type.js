import { DOCUMENT_TYPE_NODE } from 'domconstants/constants';

import Node from './node.js';
import { nodeName } from './symbols.js';

export default class DocumentType extends Node {
  constructor(name, owner = null) {
    super(DOCUMENT_TYPE_NODE, owner)[nodeName] = name;
  }

  get nodeName() {
    return this[nodeName];
  }

  get name() {
    return this[nodeName];
  }

  toString() {
    const { [nodeName]: value } = this;
    return value ? `<!DOCTYPE ${value}>` : '';
  }
}
