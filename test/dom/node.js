import Document from '../../esm/dom/document.js';

const document = new Document;

const [a, b] = [
  document.createElement('a'),
  document.createElement('b'),
];

a.append(b);

console.assert(!b.isConnected);
document.body.append(a);
console.assert(b.isConnected);

console.assert(b.parentElement === a);
console.assert(a.parentElement === document.body);
console.assert(document.body.parentElement === document.documentElement);
console.assert(document.documentElement.parentElement === null);
