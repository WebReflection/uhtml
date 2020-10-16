'use strict';
const createContent = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@ungap/create-content'));
const {indexOf, slice} = require('uarray');
const umap = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('umap'));

const {handlers} = require('./handlers.js');

const {ANY_TYPE} = XPathResult;

const {importNode} = document;
const IE = importNode.length != 1;
const createFragment = IE ?
  (text, type) => importNode.call(
    document,
    createContent(text, type),
    true
  ) :
  createContent;

const uid = 'isµ';
const xpath = (new XPathEvaluator).createExpression(
  `//*/@*[.="${uid}"]|//*/comment()[.="${uid}"]|//style[contains(text(),"<!--${uid}-->")]|//textarea[contains(text(),"<!--${uid}-->")]`,
  null
);

const attr = /([^\s\\>"'=]+)\s*=\s*(['"]?)$/;
const empty = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
const node = /<[a-z][^>]+$/i;
const notNode = />[^<>]*$/;
const selfClosing = /<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/>)/ig;
const trimEnd = /\s+$/;
const regular = (original, name, extra) => empty.test(name) ?
                  original : `<${name}${extra.replace(trimEnd,'')}></${name}>`;

const createPath = node => {
  const path = [];
  let {parentNode} = node;
  while (parentNode) {
    path.push(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
    parentNode = node.parentNode;
  }
  return path;
};

const isNode = (template, i) => (
  0 < i-- && (
  node.test(template[i]) || (
    !notNode.test(template[i]) && isNode(template, i)
  ))
);

// TODO: it looks like XPath `|` operator doesn't work as expected
//       as it crawls the three one rule per time, so that results
//       are never really ordered
const getXPath = child => {
  const query = xpath.evaluate(child, ANY_TYPE, null);
  const result = [];
  let node;
  while (node = query.iterateNext())
    result.push(node);
  return result;
};

const mapTemplate = (type, template) => {
  const content = createFragment(parse(template, type === 'svg'), type);
  const nodes = [];
  for (let {childNodes} = content, i = 0, {length} = childNodes; i < length; i++) {
    const child = childNodes[i];
    if (child.nodeType === 8)
      nodes.push({type: 'node', path: createPath(child)});
    else {
      getXPath(child).forEach(node => {
        const {nodeType} = node;
        console.log(nodeType, node, node.parentElement);
        if (nodeType === 8)
          nodes.push({type: 'node', path: createPath(node)});
        else if (nodeType === 1)
          nodes.push({type: 'text', path: createPath(node)});
        else {
          const {name, ownerElement} = node;
          nodes.push({type: 'attr', path: createPath(ownerElement), name});
          ownerElement.removeAttribute(name);
        }
      });
    }
  }
  return {content, nodes};
};

const parse = (template, svg) => {
  const text = [];
  const {length} = template;
  for (let i = 1; i < length; i++) {
    const chunk = template[i - 1];
    text.push(attr.test(chunk) && isNode(template, i) ?
      chunk.replace(
        attr,
        (_, $1, $2) => `${$1}=${$2 || '"'}${uid}${$2 ? '' : '"'}`
      ) :
      `${chunk}<!--${uid}-->`
    );
  }
  text.push(template[length - 1]);
  const output = text.join('').trim();
  return svg ? output : output.replace(selfClosing, regular);
};

const cache = umap(new WeakMap);
Object.defineProperty(exports, '__esModule', {value: true}).default = (type, template) => {
  const {content, nodes} = cache.get(template) ||
                            cache.set(template, mapTemplate(type, template));
  const fragment = importNode.call(document, content, true);
  return {content: fragment, updates: nodes.map(handlers, fragment)};
};
