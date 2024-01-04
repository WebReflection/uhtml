import Document from '../../esm/dom/document.js';

const document = new Document;

const text = document.createTextNode('&');
console.assert(text.nodeName === '#text');
console.assert(text.toString() === '&amp;');
console.assert(text.textContent === '&');
document.createElement('textarea').appendChild(text);
text.textContent = 'ok';
console.assert(text.textContent === 'ok');
text.textContent = '&';
console.assert(text.textContent === '&');
console.assert(text.toString() === '&');
