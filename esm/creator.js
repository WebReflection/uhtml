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
    let current, prev, details = entries === empty ? empty : [];
    for (let i = 0; i < entries.length; i++) {
      const { p: path, u: update, n: name } = entries[i];
      const node = path === prev ? current : (current = find(root, (prev = path)));
      details[i] = detail(empty, update, node, name);
    }
    return parsed(
      length === 1 ? root.firstChild : new PersistentFragment(root),
      details
    );
  }
);
