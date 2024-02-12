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

let remove = true;

/**
 * @param {Function} effect the reactive `effect` callback provided by a 3rd party library.
 * @returns 
 */
export const attach = effect => {
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
    remove = typeof what !== 'function';
    detach(where);

    if (remove) return render(where, what, false);
    remove = true;

    const wr = new WeakRef(where);
    const dispose = effect(() => { render(wr.deref(), what(), false) });
    effects.set(where, dispose);
    return create(dispose, onGC, { return: where });
  };
};

/**
 * Allow manual cleanup of subscribed signals.
 * @param {Element} where a reference container previously used to render signals.
 */
export const detach = where => {
  const dispose = effects.get(where);
  if (dispose) {
    if (remove) effects.delete(where);
    drop(dispose);
    dispose();
  }
};
