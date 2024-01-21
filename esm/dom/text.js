import { TEXT_NODE } from 'domconstants/constants';
import { TEXT_ELEMENTS } from 'domconstants/re';
import { escape } from 'html-escaper';

import CharacterData from './character-data.js';
import { parentNode, localName, ownerDocument, value, __chunks__ } from './symbols.js';

export default class Text extends CharacterData {
  constructor(data = '', owner = null) {
    super(TEXT_NODE, '#text', data, owner);
  }

  cloneNode() {
    return new Text(this[value], this[ownerDocument]);
  }

  toString() {
    const { [parentNode]: parent, [value]: data } = this;
    return parent && TEXT_ELEMENTS.test(parent[localName]) ?
            data :
            (this[ownerDocument]?.[__chunks__] && this.previousSibling?.nodeType === TEXT_NODE ?
              `<!--#-->${escape(data)}` :
              escape(data)
            );
  }
}
