import {createPragma} from 'jsx2tag';

import {html} from './index.js';

const createElement = createPragma(html);
self.React = {
  createElement,
  Fragment: createElement
};

export * from './index.js';
