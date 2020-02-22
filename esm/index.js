import {cache, setCache} from './cache.js';
import {Hole, retrieve} from './rabbit.js';

export const html = (template, ...values) => new Hole('html', template, values);
export const svg = (template, ...values) => new Hole('svg', template, values);

export const render = (where, what) => {
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
