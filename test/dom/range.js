import Document from '../../esm/dom/document.js';

const document = new Document;

const p = document.createElement('p');
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const range = document.createRange();

p.append('a', 'b', 'c', 'd', 'e');

let node = p.childNodes[1];

range.setStartBefore(node);
range.setEndAfter(node);
range.deleteContents();

console.assert(p.toString() === '<p>acde</p>');
console.assert(node.parentNode === null);

range.setStartAfter(p.childNodes[0]);
range.setEndAfter(p.childNodes[2]);
range.deleteContents();
console.assert(p.toString() === '<p>ae</p>');

range.selectNodeContents(svg);

const fragment = range.createContextualFragment(
  '<g><rect /></g>'
);

console.assert(fragment.toString() === '<g><rect /></g>');
