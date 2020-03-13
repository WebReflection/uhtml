import {createCache, setCache} from './cache.js';
import {Hole, unroll} from './rabbit.js';

const {create, defineProperties} = Object;
const cache = new WeakMap;

const util = type => {
  const keyed = new WeakMap;
  const fixed = i => (t, ...v) => unroll(i, {type, template: t, values: v});
  return defineProperties((t, ...v) => new Hole(type, t, v), {
    for: {value(ref, id) {
      const memo = keyed.get(ref) || setCache(keyed, ref, create(null));
      return memo[id] || (memo[id] = fixed(createCache()));
    }},
    node: {value:
      (t, ...v) => unroll(createCache(), {type, template: t, values: v})
    }
  });
};

export const html = util('html');

export const svg = util('svg');

export const render = (where, what) => {
  const hole = typeof what === 'function' ? what() : what;
  const info = cache.get(where) || setCache(cache, where, createCache());
  const wire = hole instanceof Hole ? unroll(info, hole) : hole;
  if (wire !== info.wire) {
    info.wire = wire;
    where.textContent = '';
    where.appendChild(wire.valueOf());
  }
  return where;
};
