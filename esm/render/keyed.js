import render from './shared.js';

/** @typedef {import("../rabbit.js").Hole} Hole */

/**
  * Render with smart updates within a generic container.
  * @template T
  * @param {T} where the DOM node where to render content
  * @param {(() => Hole) | Hole} what the hole to render
  * @returns
  */
export default (where, what) => render(where, what, true);
