import { ATTRIBUTE_NODE, TEXT_NODE, COMMENT_NODE } from 'domconstants/constants';
import { TEXT_ELEMENTS } from 'domconstants/re';
import parser from '@webreflection/uparser';

import { empty, isArray, set } from './utils.js';
import { cel, comment, entry } from './literals.js';

import { array, attribute, text, hole } from './handler.js';
import createContent from './create-content.js';

/** @typedef {import("./literals.js").Entry} Entry */

/**
 * @typedef {Object} Resolved
 * @property {DocumentFragment} content
 * @property {Entry[]} entries
 * @property {function[]} updates
 * @property {number} length
 */

/**
 * @param {Element} node
 * @returns {number[]}
 */
const createPath = node => {
  const path = [];
  let parentNode;
  while ((parentNode = node.parentNode)) {
    path.push(path.indexOf.call(parentNode.childNodes, node));
    node = parentNode;
  }
  return path;
};

const boundComment = () => hole.bind(comment());
const arrayComment = () => array;

/**
 * @param {TemplateStringsArray} template
 * @param {boolean} xml
 * @returns {Resolved}
 */
const resolve = (template, values, xml) => {
  const content = createContent(parser(template, prefix, xml), xml);
  let entries = empty;
  const { length } = template;
  if (length > 1) {
    const tw = document.createTreeWalker(content, 1 | 128);
    const replace = [];
    let i = 0, search = `${prefix}${i++}`;
    entries = [];
    while (i < length) {
      const node = tw.nextNode();
      if (node.nodeType === COMMENT_NODE) {
        if (node.data === search) {
          let update = isArray(values[i - 1]) ? arrayComment : boundComment;
          if (update === boundComment) replace.push(node);
          entries.push(entry(COMMENT_NODE, createPath(node), update));
          search = `${prefix}${i++}`;
        }
      }
      else {
        let path;
        while (node.hasAttribute(search)) {
          if (!path) path = createPath(node);
          const name = node.getAttribute(search);
          entries.push(entry(ATTRIBUTE_NODE, path, attribute(node, name, xml), name));
          node.removeAttribute(search);
          search = `${prefix}${i++}`;
        }
        if (
          TEXT_ELEMENTS.test(node.localName) &&
          node.textContent.trim() === `<!--${search}-->`
        ) {
          entries.push(entry(TEXT_NODE, path || createPath(node), text));
          search = `${prefix}${i++}`;
        }
      }
    }
    for (i = 0; i < replace.length; i++)
      replace[i].replaceWith(document.createTextNode(''));
  }
  return set(cache, template, cel(content, entries, content.childNodes.length));
};

/** @type {WeakMap<TemplateStringsArray, Resolved>} */
const cache = new WeakMap;
const prefix = 'isµ';

/**
 * @param {boolean} xml
 * @returns {(template: TemplateStringsArray, values: any[]) => Resolved}
 */
export default xml => (template, values) => cache.get(template) || resolve(template, values, xml);
