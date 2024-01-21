const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const init = join(__dirname, '..', 'esm', 'init-ssr.js');
const uhtml = readFileSync(init).toString();

const content = [
  'const document = content ? new DOMParser().parseFromString(content, ...rest) : new Document;',
  'const { constructor: DocumentFragment } = document.createDocumentFragment();',
  'document[__chunks__] = true;',
];

writeFileSync(init, `
// ⚠️ WARNING - THIS FILE IS AN ARTIFACT - DO NOT EDIT

import Document from './dom/document.js';
import DOMParser from './dom/dom-parser.js';
import { __chunks__ } from './dom/symbols.js';

/**
 * @param {Document} document
 * @returns {import("./keyed.js")}
 */
export default (content, ...rest) => ${
  // tested via integration
  uhtml
    .replace(/const create(HTML|SVG) = create\(parse\((false|true), false\)\)/g, 'const create$1 = create(parse($2, true))')
    .replace(`svg || ('ownerSVGElement' in element)`, `/* c8 ignore start */ svg || ('ownerSVGElement' in element) /* c8 ignore stop */`)
    .replace(/diffFragment = \(([\S\s]+?)return /, 'diffFragment = /* c8 ignore start */($1/* c8 ignore stop */return ')
    .replace(/udomdiff = \(([\S\s]+?)return /, 'udomdiff = /* c8 ignore start */($1/* c8 ignore stop */return ')
    .replace(/^(\s+)replaceWith\(([^}]+?)\}/m, '$1/* c8 ignore start */\n$1replaceWith($2}\n$1/* c8 ignore stop */')
    .replace(/^(\s+)(["'])use strict\2;/m, (_, tab, quote) => `${tab}${quote}use strict${quote};\n\n${tab}${content.join(`\n${tab}`)}`)
    .replace(/^(\s+)(return exports;)/m, '$1exports.document = document;\n$1$2')
    .replace(/^[^(]+/, '')
}`);
