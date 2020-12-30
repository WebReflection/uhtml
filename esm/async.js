import asyncTag from 'async-tag';
import umap from 'umap';

import {render as $render, html as $html, svg as $svg} from './index.js';

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

export const html = tag($html);
export const svg = tag($svg);

export const render = (where, what) => {
  const hole = typeof what === 'function' ? what() : what;
  return Promise.resolve(hole).then(what => $render(where, what));
};

export {Hole} from './index.js';
