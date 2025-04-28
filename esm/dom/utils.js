import { DOCUMENT_FRAGMENT_NODE, ELEMENT_NODE } from 'domconstants/constants';

import { childNodes, nodeType, parentNode } from './symbols.js';

import { empty } from '../utils.js';


/**
 * @param {{ [k in typeof nodeType]: number }}
 * @returns {boolean}
 */
export const asElement = ({ [nodeType]: type }) => type === ELEMENT_NODE;

export const changeParentNode = (node, parent) => {
  if (node[nodeType] === DOCUMENT_FRAGMENT_NODE)
    node[childNodes].forEach(setParentNode, parent);
  else {
    if (node[parentNode]) {
      const { [childNodes]: nodes } = node[parentNode];
      nodes.splice(nodes.indexOf(node), 1);
    }
    node[parentNode] = parent;
  }
  return node;
};

export const getNodes = element => (
  element[childNodes] === empty ?
    (element[childNodes] = []) :
    element[childNodes]
);

export const isSVG = name => (name === 'svg' || name === 'SVG');

export function cloned(node) {
  return setParentNode.call(this, node.cloneNode(true));
}

export function setParentNode(node) {
  'use strict';
  node[parentNode] = this;
  return node;
};

export function withNewParent(node) {
  return changeParentNode(node, this);
}
