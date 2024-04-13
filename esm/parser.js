import { COMMENT_NODE, ELEMENT_NODE } from 'domconstants/constants';
import { TEXT_ELEMENTS } from 'domconstants/re';
import parser from '@webreflection/uparser';

import { empty, isArray, set } from './utils.js';
import { abc } from './literals.js';

import { array, attribute, hole, text, removeAttribute } from './handler.js';
import createContent from './create-content.js';

/** @typedef {import("./literals.js").Entry} Entry */

/**
 * @typedef {Object} Resolved
 * @param {DocumentFragment} f content retrieved from the template
 * @param {Entry[]} e entries per each hole in the template
 * @param {boolean} d direct node to handle
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

const textNode = () => document.createTextNode('');

const prefix = 'isµ';

/**
 * @param {TemplateStringsArray} template
 * @param {boolean} xml
 * @returns {Resolved}
 */
const resolve = (template, values, xml, holed) => {
  let entries = empty, markup = parser(template, prefix, xml);
  if (holed) markup = markup.replace(
    new RegExp(`<!--${prefix}\\d+-->`, 'g'),
    '<!--{-->$&<!--}-->'
  );
  const content = createContent(markup, xml);
  const { length } = template;
  if (length > 1) {
    const replace = [];
    const tw = document.createTreeWalker(content, 1 | 128);
    let i = 0, search = `${prefix}${i++}`;
    entries = [];
    while (i < length) {
      let node = tw.nextNode();
      // these are holes or arrays
      if (node.nodeType === COMMENT_NODE) {
        if (node.data === search) {
          // ⚠️ once array, always array!
          const update = isArray(values[i - 1]) ? array : hole;
          if (update === hole) replace.push(node);
          else if (holed) {
            // ⚠️ this operation works only with uhtml/dom
            //    it would bail out native TreeWalker
            const { previousSibling, nextSibling } = node;
            previousSibling.data = '[]';
            nextSibling.remove();
          }
          entries.push(abc(createPath(node), update, null));
          search = `${prefix}${i++}`;
        }
        // ⚠️ this operation works only with uhtml/dom
        else if (holed && node.data === '#') node.remove();
      }
      else {
        let path;
        // these are attributes
        while (node.hasAttribute(search)) {
          if (!path) path = createPath(node);
          const name = node.getAttribute(search);
          entries.push(abc(path, attribute(node, name, xml), name));
          removeAttribute(node, search);
          search = `${prefix}${i++}`;
        }
        // these are special text-only nodes
        if (
          !xml &&
          TEXT_ELEMENTS.test(node.localName) &&
          node.textContent.trim() === `<!--${search}-->`
        ) {
          entries.push(abc(path || createPath(node), text, null));
          search = `${prefix}${i++}`;
        }
      }
    }
    // can't replace holes on the fly or the tree walker fails
    for (i = 0; i < replace.length; i++)
      replace[i].replaceWith(textNode());
  }

  // need to decide if there should be a persistent fragment
  const { childNodes } = content;
  let { length: len } = childNodes;

  // html`` or svg`` to signal an empty content
  // these nodes can be passed directly as never mutated
  if (len < 1) {
    len = 1;
    content.appendChild(textNode());
  }
  // html`${'b'}` or svg`${[]}` cases
  else if (
    len === 1 &&
    // ignore html`static` or svg`static` because
    // these nodes can be passed directly as never mutated
    length !== 1 &&
    childNodes[0].nodeType !== ELEMENT_NODE
  ) {
    // use a persistent fragment for these cases too
    len = 0;
  }

  return abc(content, entries, len === 1);
};

/**
 * @param {boolean} xml
 * @param {boolean} holed
 * @returns {(template: TemplateStringsArray, values: any[]) => Resolved}
 */
export const parse = (xml, holed) => {
  /** @type {WeakMap<TemplateStringsArray, Resolved>} */
  const cache = new WeakMap;
  return (template, values) => (
    cache.get(template) ||
    set(cache, template, resolve(template, values, xml, holed))
  );
};
