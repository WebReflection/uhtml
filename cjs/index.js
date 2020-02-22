'use strict';
const {cache, setCache} = require('./cache.js');
const {Hole, retrieve} = require('./rabbit.js');

const html = (template, ...values) => new Hole('html', template, values);
exports.html = html;
const svg = (template, ...values) => new Hole('svg', template, values);
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
