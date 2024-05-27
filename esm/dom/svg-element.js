import { ELEMENT_NODE } from 'domconstants/constants';
import { escape } from 'html-escaper';

import Attribute from './attribute.js';
import Element from './element.js';

import { cloned, isSVG } from './utils.js';

import {
  attributes,
  name, value,
  localName,
  childNodes,
  ownerDocument,
  parentNode,
} from './symbols.js';

export default class SVGElement extends Element {
  constructor(name, owner = null) {
    super(ELEMENT_NODE, owner)[localName] = name;
  }

  get ownerSVGElement() {
    let { [parentNode]: parent } = this;
    while (parent && !isSVG(parent[localName]))
      parent = parent[parentNode];
    return parent;
  }

  cloneNode(deep = false) {
    const svg = new SVGElement(this[localName], this[ownerDocument]);
    const { [attributes]: attrs, [childNodes]: nodes } = this;
    if (attrs) {
      const map = (svg[attributes] = new Map);
      for (const { [name]: key, [value]: val } of this[attributes].values())
        map.set(key, new Attribute(key, val, svg));
    }
    if (deep && nodes.length)
      svg[childNodes] = nodes.map(cloned, svg);
    return svg;
  }

  toString() {
    const { [localName]: name, [childNodes]: nodes, [attributes]: attrs } = this;
    const svg = ['<', name];
    if (attrs?.size) {
      for (const { name, value } of attrs.values())
        svg.push(' ', name, '="', escape(value), '"');
    }
    if (nodes.length || isSVG(name))
      svg.push('>', ...nodes, '</', name, '>');
    else
      svg.push(' />');
    return svg.join('');
  }
}
