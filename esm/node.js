import createContent from '@ungap/create-content';

import {defineProperties} from './object.js';
import {indexOf, slice} from './array.js';

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

export const getWire = fragment => {
  const {childNodes} = fragment;
  const {length} = childNodes;
  if (length === 1)
    return childNodes[0];
  const nodes = slice.call(childNodes, 0);
  return defineProperties(fragment, {
    firstChild: {value: nodes[0]},
    lastChild: {value: nodes[length - 1]},
    remove: {
      value() {
        const range = document.createRange();
        range.setStartBefore(nodes[1]);
        range.setEndAfter(nodes[length - 1]);
        range.deleteContents();
        return nodes[0];
      }
    },
    valueOf: {
      value() {
        if (childNodes.length !== length) {
          const range = document.createRange();
          range.setStartBefore(nodes[0]);
          range.setEndAfter(nodes[length - 1]);
          fragment.appendChild(range.extractContents());
        }
        return fragment;
      }
    }
  });
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
