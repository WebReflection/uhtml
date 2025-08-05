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

export const unsafe = data => new Unsafe(data);

export const createComment = value => document.createComment(value);
/* c8 ignore stop */
