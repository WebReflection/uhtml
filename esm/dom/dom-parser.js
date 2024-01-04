import Document from './document.js';
import Element from './element.js';
import SVGElement from './element.js';
import { Node, parse, setAttributes, setChild } from './string-parser.js';
import { documentElement, nodeName, ownerDocument } from './symbols.js';

import { isSVG } from './utils.js';

class Root extends Node {
  constructor(svg) {
    const document = new Document(svg ? '' : 'html');
    const node = svg ? new SVGElement('svg', document) : document.body;
    if (svg) document[documentElement] = node;
    super(node, svg);
  }

  onprocessinginstruction(name, data) {
    const { D: document } = this;
    switch (name) {
      case '!doctype':
      case '!DOCTYPE':
        document.doctype[nodeName] = data.slice(name.length).trim();
        break;
    }
  }

  onopentag(name, attributes) {
    const { D: document, n: node, s: svg } = this;
    let child;
    if (svg || isSVG(name)) {
      switch (name) {
        case 'svg':
        case 'SVG':
          child = document.documentElement;
          break;
        default:
          child = setChild(node, new SVGElement('svg', document));
          break;
      }
      this.s = true;
    }
    else {
      switch (name) {
        case 'html':
        case 'HTML':
          child = document.documentElement;
          break;
        case 'head':
        case 'HEAD':
          child = document.head;
          break;
        case 'body':
        case 'BODY':
          child = document.body;
          break;
        default:
          child = setChild(node, new Element(name, document));
          break;
      }
    }
    setAttributes(this.n = child, attributes);
  }
}

const parseDocument = (xmlMode, text) => {
  const handler = new Root(xmlMode);
  const { D: document } = handler;
  parse(handler, xmlMode, text);
  if (xmlMode) document[ownerDocument] = null;
  return document;
};

export default class DOMParser {
  parseFromString(text, mimeType = 'text/html') {
    const html = mimeType === 'text/html';
    if (html && text === '...') text = '';
    return parseDocument(!html, text);
  }
}
