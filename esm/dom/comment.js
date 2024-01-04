import { COMMENT_NODE } from 'domconstants/constants';

import CharacterData from './character-data.js';
import { ownerDocument, value } from './symbols.js';

export default class Comment extends CharacterData {
  constructor(data = '', owner = null) {
    super(COMMENT_NODE, '#comment', data, owner);
  }

  cloneNode() {
    return new Comment(this[value], this[ownerDocument]);
  }

  toString() {
    return `<!--${this[value]}-->`;
  }
}
