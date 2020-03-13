import createContent from '@ungap/create-content';
import {indexOf} from 'uarray';

// from a generic path, retrieves the exact targeted node
export const reducePath = (node, i) => node.childNodes[i];

// from a fragment container, create an array of indexes
// related to its child nodes, so that it's possible
// to retrieve later on exact node via reducePath
export const createPath = node => {
  const path = [];
  let {parentNode} = node;
  while (parentNode) {
    path.unshift(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
    parentNode = node.parentNode;
  }
  return path;
};

const {createTreeWalker, importNode} = document;
export {createTreeWalker, importNode};

// this "hack" tells the library if the browser is IE11 or old Edge
const IE = importNode.length != 1;

export const createFragment = IE ?
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

// IE11 and old Edge have a different createTreeWalker signature that
// has been deprecated in other browsers. This export is needed only
// to guarantee the TreeWalker doesn't show warnings and, ultimately, works
export const createWalker = IE ?
  /* istanbul ignore next */
  fragment => createTreeWalker.call(document, fragment, 1 | 128, null, false) :
  fragment => createTreeWalker.call(document, fragment, 1 | 128);
