'use strict';
const asyncTag = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('async-tag'));
const umap = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('umap'));

const {render: $render, html: $html, svg: $svg} = require('./index.js');

const {defineProperties} = Object;

const tag = original => {
  const wrap = umap(new WeakMap);
  return defineProperties(
    asyncTag(original),
    {
      for: {
        value(ref, id) {
          const tag = original.for(ref, id);
          return wrap.get(tag) || wrap.set(tag, asyncTag(tag));
        }
      },
      node: {
        value: asyncTag(original.node)
      }
    }
  );
};

const html = tag($html);
exports.html = html;
const svg = tag($svg);
exports.svg = svg;

const render = (where, what) => {
  const hole = typeof what === 'function' ? what() : what;
  return Promise.resolve(hole).then(what => $render(where, what));
};
exports.render = render;

(m => {
  exports.Hole = m.Hole;
})(require('./index.js'));
