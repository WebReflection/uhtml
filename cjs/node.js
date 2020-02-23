'use strict';
const {indexOf, slice} = require('./array.js');

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

const {defineProperties} = Object;
const getWire = fragment => {
  const {childNodes} = fragment;
  const {length} = childNodes;
  if (length === 1)
    return childNodes[0];
  const nodes = slice.call(childNodes, 0);
  return defineProperties(fragment, {
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
exports.getWire = getWire;
