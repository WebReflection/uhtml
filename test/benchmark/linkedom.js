const benchmark = require('./index.js');
const { DOMParser } = require('linkedom');
const dp = new DOMParser;

benchmark('linkedom', html => dp.parseFromString(html, 'text/html'));
