const benchmark = require('./index.js');
const { DOMParser } = require('linkedom/cached');
const dp = new DOMParser;

benchmark('linkedom cached', html => dp.parseFromString(html, 'text/html'));
