import {indexOf, slice} from './array.js';
import {trimStart, trimEnd} from './string.js';

const edgeCases = 'textarea,style';

export const findNode = (content, selector) => {
  const search = `<${selector}></${selector}>`;
  const nodes = content.querySelectorAll(edgeCases);
  for (let i = 0, {length} = nodes; i < length; i++) {
    if (trimStart.call(trimEnd.call(nodes[i].textContent)) === search)
      return nodes[i];
  }
  throw new Error(`${edgeCases} bad content`);
};

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

const {defineProperties} = Object;
export const getWire = fragment => {
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

export const noChildNodes = name => /^(?:style|textarea)$/i.test(name);

export const isVoid = name => /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i.test(name);

export const removeAttributeNode = (node, attribute) => {
  node.removeAttributeNode(attribute);
};
