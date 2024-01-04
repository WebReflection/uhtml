import Document from '../../esm/dom/document.js';

const document = new Document;

const fragment = document.createDocumentFragment();
const [a, c] = [
  document.createElement('a'),
  document.createElement('c'),
];

console.assert(fragment.childNodes.length === 0);
console.assert(fragment.firstChild === null);
console.assert(fragment.firstElementChild === null);
console.assert(fragment.lastChild === null);
console.assert(fragment.lastElementChild === null);

fragment.append(a, 'b', c);

console.assert(fragment.children.length === 2);
console.assert(fragment.firstChild === a);
console.assert(fragment.firstElementChild === a);
console.assert(fragment.lastChild === c);
console.assert(fragment.lastElementChild === c);

console.assert(fragment.childElementCount === 2);

fragment.prepend(c);
console.assert(fragment.firstChild === c);
fragment.replaceChildren(a);
console.assert(fragment.contains(a));
console.assert(a.parentNode === fragment);
console.assert(!fragment.contains(c));
fragment.insertBefore(c, a);
console.assert(a.parentNode === fragment);
console.assert(c.parentNode === fragment);
console.assert(fragment.firstChild === c);
fragment.removeChild(c);
console.assert(a.parentNode === fragment);
fragment.insertBefore(c);
console.assert(fragment.lastChild === c);
fragment.removeChild(c);
console.assert(a.parentNode === fragment);
console.assert(c.parentNode === null);
console.assert(fragment.replaceChild(c, a) === a);
console.assert(a.parentNode === null);
console.assert(c.parentNode === fragment);
console.assert(fragment.toString() === '<c></c>');
c.append(a);
console.assert(fragment.toString() === '<c><a></a></c>');
console.assert(fragment.contains(a));
