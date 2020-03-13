'use strict';
const {createCache, setCache} = require('./cache.js');
const {Hole, unroll} = require('./rabbit.js');

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

const html = util('html');
exports.html = html;

const svg = util('svg');
exports.svg = svg;

const render = (where, what) => {
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
exports.render = render;
