import { create, drop } from 'gc-hook';

import render from './shared.js';

/** @typedef {import("../rabbit.js").Hole} Hole */

/** @type {WeakMap<Element | DocumentFragment, Function>} */
const effects = new WeakMap;

/**
 * @param {Function} dispose
 * @returns {void}
 */
const onGC = dispose => dispose();

export default effect => {
  /**
   * Render with smart updates within a generic container.
   * If the `what` is a function, it automatically create
   * an effect for the render function.
   * @template T
   * @param {T} where the DOM node where to render content
   * @param {(() => Hole) | Hole} what the hole to render
   * @returns {T}
   */
  return (where, what) => {
    let dispose = effects.get(where);
    if (dispose) {
      drop(dispose);
      dispose();
    }
    if (typeof what === 'function') {
      const wr = new WeakRef(where);
      dispose = effect(() => { render(wr.deref(), what().valueOf(), false) });
      effects.set(where, dispose);
      return create(dispose, onGC, { return: where });
    }
    else {
      effects.delete(where);
      return render(where, what.valueOf(), false);
    }
  };
};
