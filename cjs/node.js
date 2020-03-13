'use strict';
const createContent = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@ungap/create-content'));
const {indexOf} = require('uarray');

// from a generic path, retrieves the exact targeted node
const reducePath = (node, i) => node.childNodes[i];
exports.reducePath = reducePath;

// from a fragment container, create an array of indexes
// related to its child nodes, so that it's possible
// to retrieve later on exact node via reducePath
const createPath = node => {
  const path = [];
  let {parentNode} = node;
  while (parentNode) {
    path.unshift(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
    parentNode = node.parentNode;
  }
  return path;
};
exports.createPath = createPath;

const {createTreeWalker, importNode} = document;
exports.createTreeWalker = createTreeWalker;
exports.importNode = importNode;

// this "hack" tells the library if the browser is IE11 or old Edge
const IE = importNode.length != 1;

const createFragment = IE ?
  // basicHTML would never have a false case,
  // unless forced, but it has no value for this coverage.
  // IE11 and old Edge are passing live tests so we're good.
  /* istanbul ignore next */
  (text, type) => importNode.call(
    document,
    createContent(text, type),
    true
  ) :
  createContent;
exports.createFragment = createFragment;

// IE11 and old Edge have a different createTreeWalker signature that
// has been deprecated in other browsers. This export is needed only
// to guarantee the TreeWalker doesn't show warnings and, ultimately, works
const createWalker = IE ?
  /* istanbul ignore next */
  fragment => createTreeWalker.call(document, fragment, 1 | 128, null, false) :
  fragment => createTreeWalker.call(document, fragment, 1 | 128);
exports.createWalker = createWalker;
