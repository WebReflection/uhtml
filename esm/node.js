import createContent from '@ungap/create-content';

import {indexOf, slice} from './array.js';

// same as hyperhtml-wire
export const wireType = 111;

export const getNode = (node, i) => node.childNodes[i];

export const getPath = node => {
  const path = [];
  let {parentNode} = node;
  while (parentNode) {
    path.unshift(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
    parentNode = node.parentNode;
  }
  return path;
};

export const getWire = content => {
  const {childNodes} = content;
  const {length} = childNodes;
  if (length === 1)
    return childNodes[0];
  const firstChild = childNodes[0];
  const lastChild = childNodes[length - 1];
  return {
    ELEMENT_NODE: 1,
    nodeType: wireType,
    childNodes: slice.call(childNodes, 0),
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
      if (childNodes.length !== length) {
        const range = document.createRange();
        range.setStartBefore(firstChild);
        range.setEndAfter(lastChild);
        content.appendChild(range.extractContents());
      }
      return content;
    }
  };
};

const {createTreeWalker, importNode} = document;
export {createTreeWalker, importNode};

const IE = importNode.length != 1;

export const createFragment = IE ?
  (text, type) => importNode.call(
    document,
    createContent(text, type),
    true
  ) :
  createContent;

// to support IE10 and IE9 I could pass a callback instead
// with an `acceptNode` mode that's the callback itself
// function acceptNode() { return 1; } acceptNode.acceptNode = acceptNode;
// however, I really don't care about IE10 and IE9, as these would require
// also a WeakMap polyfill, and have no reason to exist.
export const createWalker = IE ?
  fragment => createTreeWalker.call(document, fragment, 1 | 128, null, false) :
  fragment => createTreeWalker.call(document, fragment, 1 | 128);
