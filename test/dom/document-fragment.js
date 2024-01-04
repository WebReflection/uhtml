import Document from '../../esm/dom/document.js';

const document = new Document;

const f1 = document.createDocumentFragment();
const f2 = document.createDocumentFragment();

console.assert(f1.nodeType === 11, 'nodeType');
console.assert(f1.nodeName === '#document-fragment', 'nodeName');

f1.append('b', 'c');
console.assert(f1.childNodes.length === 2, 'childNodes');
console.assert(f1.firstChild.parentNode === f1, 'parentNode');

f2.append(f1, 'd');
console.assert(f1.childNodes.length === 0, 'childNodes');
console.assert(f2.childNodes.length === 3, 'childNodes');
console.assert(f2.firstChild.parentNode === f2, 'parentNode');

f2.prepend('a');

document.body.append(f2);
console.assert(f2.childNodes.length === 0, 'childNodes');
console.assert(document.body.firstChild.parentNode === document.body, 'parentNode');

console.assert(document.body.toString() === '<body>abcd</body>');

f1.append(...document.body.childNodes);
console.assert(f1.firstChild.parentNode === f1, 'parentNode');
console.assert(document.body.childNodes.length === 0, 'childNodes');

console.assert(f1.toString() === 'abcd');

const f3 = f1.cloneNode();
console.assert(f3.toString() === '');
const f4 = f1.cloneNode(true);
console.assert(f4.firstChild !== f1.firstChild);
console.assert(f4.toString() === f1.toString());
console.assert(f4.firstChild.parentNode === f4);
console.assert(f1.firstChild.parentNode === f1);
