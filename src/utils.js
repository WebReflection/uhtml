const { isArray } = Array;
const { assign, defineProperties, entries, freeze, keys } = Object;

export { assign, defineProperties, entries, freeze, isArray, keys };

/* c8 ignore start */
const { replace } = '';
const ca = /[&<>"']/g;
const pe = c => {
  switch (c) {
    case '&': return '&amp;';
    case '<': return '&lt;';
    case '>': return '&gt;';
    case '"': return '&quot;';
    default: return '&#39;';
  }
};

export const escape = es => replace.call(es, ca, pe);

export class Unsafe {
  #data;

  constructor(data) {
    this.#data = data;
  }

  valueOf() {
    return this.#data;
  }

  toString() {
    return String(this.#data);
  }
}

export const reduce = node => {
  const { childNodes } = node;
  return childNodes.length === 1 ? childNodes[0] : node;
};

export const unsafe = (template, ...values) => new Unsafe(
  typeof template === 'string' ?
    template :
    [template[0], ...values.map((v, i) => v + template[i + 1])].join('')
);

export const createComment = value => document.createComment(value);
/* c8 ignore stop */
