import { COMMENT_NODE } from 'domconstants/constants';

import { PersistentFragment } from './persistent-fragment.js';
import { detail, parsed } from './literals.js';
import { empty } from './utils.js';

/**
 * @param {DocumentFragment} content
 * @param {number[]} path
 * @returns {Element}
 */
const find = (content, path) => path.reduceRight(childNodesIndex, content);
const childNodesIndex = (node, i) => node.childNodes[i];

/** @param {(template: TemplateStringsArray, values: any[]) => import("./parser.js").Resolved} parse */
export default parse => (
  /** @param {(template: TemplateStringsArray, values: any[]) => import("./literals.js").Parsed} parse */
  (template, values) => {
    const { c: content, e: entries, l: length } = parse(template, values);
    const root = content.cloneNode(true);
    // reverse loop to avoid missing paths while populating
    // TODO: is it even worth to pre-populate nodes? see rabbit.js too
    let current, prev, i = entries.length, details = i ? entries.slice(0) : empty;
    while (i--) {
      const { t: type, p: path, u: update, n: name } = entries[i];
      const node = path === prev ? current : (current = find(root, (prev = path)));
      const callback = type === COMMENT_NODE ? update() : update;
      details[i] = detail(callback(node, values[i], name, empty), callback, node, name);
    }
    return parsed(
      length === 1 ? root.firstChild : new PersistentFragment(root),
      details
    );
  }
);
