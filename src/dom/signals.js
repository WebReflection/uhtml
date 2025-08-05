import { Signal, signal as _signal, computed, effect, untracked, startBatch, endBatch } from '@webreflection/alien-signals';

const batch = fn => {
  startBatch();
  try { return fn() }
  finally { endBatch() }
};

let $ = _signal;

export function signal() {
  return $.apply(null, arguments);
}

export const _get = () => $;
export const _set = fn => { $ = fn };

export { Signal, computed, effect, untracked, batch };
