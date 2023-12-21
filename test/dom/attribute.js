import Attribute from '../../esm/dom/attribute.js';
import Document from '../../esm/dom/document.js';

const document = new Document;

const a = new Attribute('a');
const b = new Attribute('b', 2);

console.assert(a.name === 'a');
console.assert(a.localName === 'a');
console.assert(a.nodeName === 'a');
console.assert(a.value === '');
console.assert(a.nodeValue === '');
console.assert(a.toString() === 'a');
a.value = 1;
console.assert(a.value === '1');
console.assert(a.nodeValue === '1');
console.assert(a.toString() === 'a="1"');

console.assert(b.value === '2');

const element = document.createElement('test');
element.setAttribute('c', 3);
console.assert(element.getAttributeNode('c').ownerElement === element);


console.assert(a.ownerElement == null);
element.setAttributeNode(a);
console.assert(a.ownerElement == element);
