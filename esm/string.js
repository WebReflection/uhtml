const empty = '';
export const trimStart = empty.trimStart || (str => str.replace(/^[ \f\n\r\t]+/, empty));
export const trimEnd = empty.trimEnd || (str => str.replace(/[ \f\n\r\t]+$/, empty));
