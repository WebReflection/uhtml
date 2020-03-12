import createContent from '@ungap/create-content';
import {indexOf} from 'uarray';

export const reducePath = (node, i) => node.childNodes[i];

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

// basicHTML would never have a false case,
// unless forced, but it has no value for this coverage.
// IE11 and old Edge are passing live tests so we're good.
const IE = importNode.length != 1;

export const createFragment = IE ?
  /* istanbul ignore next */
  (text, type) => importNode.call(
    document,
    createContent(text, type),
    true
  ) :
  createContent;

// to support IE10 and IE9 I could pass a callback instead
// with an `acceptNode` mode that's the callback itself
// function acceptNode() { return 1; } acceptNode.acceptNode = acceptNode;
// however, I really don't care anymore about IE10 and IE9, as these would
// require also a WeakMap polyfill, and have no reason to exist whatsoever.
export const createWalker = IE ?
  /* istanbul ignore next */
  fragment => createTreeWalker.call(document, fragment, 1 | 128, null, false) :
  fragment => createTreeWalker.call(document, fragment, 1 | 128);
