const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const init = join(__dirname, '..', 'esm', 'init.js');
const uhtml = readFileSync(init).toString();

writeFileSync(init, `
// ⚠️ WARNING - THIS FILE IS AN ARTIFACT - DO NOT EDIT
/**
 * @param {Document} document
 * @returns {import("./keyed.js")}
 */
export default document => ${
  // tested via integration
  uhtml
    .replace(`svg || ('ownerSVGElement' in element)`, `/* c8 ignore start */ svg || ('ownerSVGElement' in element) /* c8 ignore stop */`)
    .replace(/diffFragment = \(([\S\s]+?)return /, 'diffFragment = /* c8 ignore start */($1/* c8 ignore stop */return ')
    .replace(/udomdiff = \(([\S\s]+?)return /, 'udomdiff = /* c8 ignore start */($1/* c8 ignore stop */return ')
    .replace(/^(\s+)replaceWith\(([^}]+?)\}/m, '$1/* c8 ignore start */\n$1replaceWith($2}\n$1/* c8 ignore stop */')
    .replace(/^(\s+)(["'])use strict\2;/m, '$1$2use strict$2;\n\n$1const { constructor: DocumentFragment } = document.createDocumentFragment();')
    .replace(/^[^(]+/, '')
}`);
