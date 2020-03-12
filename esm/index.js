import {cache, createCache, setCache} from './cache.js';
import {Hole, unroll} from './rabbit.js';

const {create, defineProperties} = Object;

const util = type => {
  const cache = new WeakMap;
  const fixed = info => (template, ...values) => unroll(
    info,
    new Hole(type, template, values)
  );
  return defineProperties(
    (template, ...values) => new Hole(type, template, values),
    {
      for: {value(ref, id) {
        const memo = cache.get(ref) || cache.set(ref, create(null)).get(ref);
        return memo[id] || (memo[id] = fixed(createCache()));
      }},
      node: {value: (template, ...values) => unroll(
        createCache(),
        new Hole(type, template, values)
      )}
    }
  );
};

export const html = util('html');

export const svg = util('svg');

export const render = (where, what) => {
  const hole = typeof what === 'function' ? what() : what;
  const info = cache.get(where) || setCache(where);
  const wire = hole instanceof Hole ? unroll(info, hole) : hole;
  if (wire !== info.wire) {
    info.wire = wire;
    where.textContent = '';
    where.appendChild(wire.valueOf());
  }
  return where;
};
