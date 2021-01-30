'use strict';
const createContent = (m => m.__esModule ? /* c8 ignore next */ m.default : /* c8 ignore next */ m)(require('@ungap/create-content'));
const {indexOf} = require('uarray');

// from a generic path, retrieves the exact targeted node
const reducePath = ({childNodes}, i) => childNodes[i];
exports.reducePath = reducePath;

// from a fragment container, create an array of indexes
// related to its child nodes, so that it's possible
// to retrieve later on exact node via reducePath
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
exports.createPath = createPath;

const {createTreeWalker, importNode} = document;
exports.createTreeWalker = createTreeWalker;
exports.importNode = importNode;

// this "hack" tells the library if the browser is IE11 or old Edge
const isImportNodeLengthWrong = importNode.length != 1;

// IE11 and old Edge discard empty nodes when cloning, potentially
// resulting in broken paths to find updates. The workaround here
// is to import once, upfront, the fragment that will be cloned
// later on, so that paths are retrieved from one already parsed,
// hence without missing child nodes once re-cloned.
const createFragment = isImportNodeLengthWrong ?
  (text, type, normalize) => importNode.call(
    document,
    createContent(text, type, normalize),
    true
  ) :
  createContent;
exports.createFragment = createFragment;

// IE11 and old Edge have a different createTreeWalker signature that
// has been deprecated in other browsers. This export is needed only
// to guarantee the TreeWalker doesn't show warnings and, ultimately, works
const createWalker = isImportNodeLengthWrong ?
  fragment => createTreeWalker.call(document, fragment, 1 | 128, null, false) :
  fragment => createTreeWalker.call(document, fragment, 1 | 128);
exports.createWalker = createWalker;
