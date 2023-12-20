/** @typedef {import("../literals.js").Target} Target */

/**
 * Render directly within a generic container.
 * @template T
 * @param {T} where the DOM node where to render content
 * @param {(() => Target) | Target} what the node to render
 * @returns
 */
export default (where, what) => {
  where.replaceChildren(typeof what === 'function' ? what() : what);
  return where;
};
