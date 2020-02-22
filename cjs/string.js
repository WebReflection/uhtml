'use strict';
const empty = '';
const trimStart = empty.trimStart || (str => str.replace(/^[ \f\n\r\t]+/, empty));
exports.trimStart = trimStart;
const trimEnd = empty.trimEnd || (str => str.replace(/[ \f\n\r\t]+$/, empty));
exports.trimEnd = trimEnd;
