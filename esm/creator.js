import { PersistentFragment } from './persistent-fragment.js';
import { abc, detail } from './literals.js';
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
    const { a: fragment, b: entries, c: direct } = parse(template, values);
    const root = fragment.cloneNode(true);
    let details = empty;
    if (entries !== empty) {
      details = [];
      for (let current, prev, i = 0; i < entries.length; i++) {
        const { a: path, b: update, c: name } = entries[i];
        const node = path === prev ? current : (current = find(root, (prev = path)));
        details[i] = detail(
          update,
          node,
          name,
          update === array ? [] : (update === hole ? cache() : null)
        );
      }
    }
    return abc(
      template,
      direct ? root.firstChild : new PersistentFragment(root),
      details,
    );
  }
);
