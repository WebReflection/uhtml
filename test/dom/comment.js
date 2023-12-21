import Document from '../../esm/dom/document.js';

const document = new Document;

const comment = document.createComment('test');
console.assert(!comment.childNodes.length);
console.assert(comment.nodeName === '#comment');
console.assert(comment.toString() === '<!--test-->');
console.assert(comment.textContent === 'test');
comment.textContent = 'ok';
console.assert(comment.textContent === 'ok');

const clone = comment.cloneNode();
console.assert(clone.nodeName === '#comment');
console.assert(clone.toString() === '<!--ok-->');