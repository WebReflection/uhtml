'use strict';
const {isArray, prototype} = Array;
const {indexOf} = prototype;

exports.isArray = isArray;
exports.indexOf = indexOf;

const {
  createDocumentFragment,
  createElement,
  createElementNS,
  createTextNode,
  createTreeWalker,
  importNode
} = new Proxy(document, {
  get: (target, method) => target[method].bind(target)
});

exports.createTextNode = createTextNode;
exports.createTreeWalker = createTreeWalker;
exports.importNode = importNode;

const createHTML = html => {
  const template = createElement('template');
  template.innerHTML = html;
  return template.content;
};

let xml;
const createSVG = svg => {
  if (!xml) xml = createElementNS('http://www.w3.org/2000/svg', 'svg');
  xml.innerHTML = svg;
  const content = createDocumentFragment();
  content.append(...xml.childNodes);
  return content;
};

const createContent = (text, svg) => svg ?
                              createSVG(text) : createHTML(text);
exports.createContent = createContent;
