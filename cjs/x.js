'use strict';
const {createPragma} = require('jsx2tag');
const {html} = require('./index.js');

const createElement = createPragma(html);
self.React = {
  createElement,
  Fragment: createElement
};

(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('jsx2tag'));
(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('./index.js'));
