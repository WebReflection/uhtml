import {createCache, setCache} from './cache.js';
import {Hole, unroll} from './rabbit.js';

const {create, defineProperties} = Object;
const cache = new WeakMap;

const tag = type => {
  const keyed = new WeakMap;
  const fixed = cache => (template, ...values) => unroll(
    cache,
    {type, template, values}
  );
  return defineProperties(
    (template, ...values) => new Hole(type, template, values),
    {
      for: {
        value(ref, id) {
          const memo = keyed.get(ref) || setCache(keyed, ref, create(null));
          return memo[id] || (memo[id] = fixed(createCache()));
        }
      },
      node: {
        value: (template, ...values) => unroll(
          createCache(),
          {type, template, values}
        ).valueOf()
      }
    }
  );
};

export const html = tag('html');

export const svg = tag('svg');

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
