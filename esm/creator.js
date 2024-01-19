import { PersistentFragment } from './persistent-fragment.js';
import { detail, resolved } from './literals.js';
import { array, hole } from './handler.js';
import { empty } from './utils.js';
import { cache } from './literals.js';

/**
 * @param {DocumentFragment} content
 * @param {number[]} path
 * @returns {Element}
 */
const find = (content, path) => path.reduceRight(childNodesIndex, content);
const childNodesIndex = (node, i) => node.childNodes[i];

/** @param {(template: TemplateStringsArray, values: any[]) => import("./parser.js").Resolved} parse */
export default parse => (
  /** @param {(template: TemplateStringsArray, values: any[]) => import("./literals.js").Cache} parse */
  (template, values) => {
    const { f: fragment, e: entries, d: direct } = parse(template, values);
    const root = fragment.cloneNode(true);
    let details = empty, stack = empty;
    if (entries !== empty) {
      details = [];
      stack = [];
      for (let current, prev, i = 0; i < entries.length; i++) {
        const { p: path, u: update, n: name } = entries[i];
        const node = path === prev ? current : (current = find(root, (prev = path)));
        details[i] = detail(empty, update, node, name);
        stack[i] = update === array ? [] : (update === hole ? cache() : null);
      }
    }
    return resolved(
      template,
      direct ? root.firstChild : new PersistentFragment(root),
      details,
      stack,
    );
  }
);
