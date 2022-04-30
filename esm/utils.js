const {isArray, prototype} = Array;
const {indexOf} = prototype;

export {isArray, indexOf};

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

export {createTextNode, createTreeWalker, importNode};

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

export const createContent = (text, svg) => svg ?
                              createSVG(text) : createHTML(text);
