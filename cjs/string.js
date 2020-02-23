'use strict';
const empty = '';
const trimStart = empty.trimStart || function () {
  return this.replace(/^[ \f\n\r\t]+/, empty);
};
exports.trimStart = trimStart;
const trimEnd = empty.trimEnd || function () {
  return this.replace(/[ \f\n\r\t]+$/, empty);
};
exports.trimEnd = trimEnd;
