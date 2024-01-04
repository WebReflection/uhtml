import Document from '../../esm/dom/document.js';
import DocumentType from '../../esm/dom/document-type.js';

const document = new Document;

let { doctype } = document;
console.assert(doctype.toString() === '<!DOCTYPE html>');
console.assert(doctype.nodeName === 'html');
console.assert(doctype.name === 'html');
console.assert(doctype.ownerDocument === document);

doctype = new DocumentType('');
console.assert(doctype.ownerDocument === null);
console.assert(doctype.toString() === '');