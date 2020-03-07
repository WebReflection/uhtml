'use strict';
const {cache, cacheInfo, setCache} = require('./cache.js');
const {Hole, retrieve} = require('./rabbit.js');

const {create, defineProperties} = Object;

const util = type => {
  const cache = new WeakMap;
  const fixed = info => (template, ...values) => retrieve(
    info,
    new Hole(type, template, values)
  );
  return defineProperties(
    (template, ...values) => new Hole(type, template, values),
    {
      for: {value(ref, id) {
        const memo = cache.get(ref) || cache.set(ref, create(null)).get(ref);
        return memo[id] || (memo[id] = fixed(cacheInfo()));
      }},
      node: {value: (template, ...values) => retrieve(
        cacheInfo(),
        new Hole(type, template, values)
      )}
    }
  );
};

const html = util('html');
exports.html = html;

const svg = util('svg');
exports.svg = svg;

const render = (where, what) => {
  const hole = typeof what === 'function' ? what() : what;
  const info = cache.get(where) || setCache(where);
  const wire = hole instanceof Hole ? retrieve(info, hole) : hole;
  if (wire !== info.wire) {
    info.wire = wire;
    where.textContent = '';
    where.appendChild(wire.valueOf());
  }
  return where;
};
exports.render = render;
