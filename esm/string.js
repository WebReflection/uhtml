const empty = '';
export const trimStart = empty.trimStart || function () {
  return this.replace(/^[ \f\n\r\t]+/, empty);
};
export const trimEnd = empty.trimEnd || function () {
  return this.replace(/[ \f\n\r\t]+$/, empty);
};
