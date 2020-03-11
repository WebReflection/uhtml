'use strict';
const createContent = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@ungap/create-content'));

const {indexOf, slice} = require('./array.js');

// same as hyperhtml-wire
const wireType = 111;
exports.wireType = wireType;

const getNode = (node, i) => node.childNodes[i];
exports.getNode = getNode;

const getPath = node => {
  const path = [];
  let {parentNode} = node;
  while (parentNode) {
    path.unshift(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
    parentNode = node.parentNode;
  }
  return path;
};
exports.getPath = getPath;

const getWire = content => {
  const {childNodes} = content;
  const {length} = childNodes;
  if (length === 1)
    return childNodes[0];
  const nodes = slice.call(childNodes, 0);
  const firstChild = nodes[0];
  const lastChild = nodes[length - 1];
  return {
    ELEMENT_NODE: 1,
    nodeType: wireType,
    firstChild,
    lastChild,
    remove() {
      const range = document.createRange();
      range.setStartAfter(firstChild);
      range.setEndAfter(lastChild);
      range.deleteContents();
      return firstChild;
    },
    valueOf() {
      // In basicHTML fragments can be appended
      // without their childNodes being automatically removed.
      // This makes the following check fail each time,
      // but it's also not really a use case for basicHTML,
      // as fragments are not moved around or anything.
      // However, in all browsers, once the fragment is live
      // and not just created, this is always true.
      /* istanbul ignore next */
      if (childNodes.length !== length) {
        let i = 0;
        while (i < length)
          content.appendChild(nodes[i++]);
      }
      return content;
    }
  };
};
exports.getWire = getWire;

const {createTreeWalker, importNode} = document;
exports.createTreeWalker = createTreeWalker;
exports.importNode = importNode;

// basicHTML would never have a false case,
// unless forced, but it has no value for this coverage.
// IE11 and old Edge are passing live tests so we're good.
const IE = importNode.length != 1;

const createFragment = IE ?
  /* istanbul ignore next */
  (text, type) => importNode.call(
    document,
    createContent(text, type),
    true
  ) :
  createContent;
exports.createFragment = createFragment;

// to support IE10 and IE9 I could pass a callback instead
// with an `acceptNode` mode that's the callback itself
// function acceptNode() { return 1; } acceptNode.acceptNode = acceptNode;
// however, I really don't care anymore about IE10 and IE9, as these would
// require also a WeakMap polyfill, and have no reason to exist whatsoever.
const createWalker = IE ?
  /* istanbul ignore next */
  fragment => createTreeWalker.call(document, fragment, 1 | 128, null, false) :
  fragment => createTreeWalker.call(document, fragment, 1 | 128);
exports.createWalker = createWalker;
