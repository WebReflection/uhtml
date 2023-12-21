import Document from '../../esm/dom/document.js';

const document = new Document;

const element = document.createElement('p');
const { attributes } = element;

console.assert(attributes.length === 0);

element.setAttribute('a', 1);
console.assert(attributes.length === 1);
console.assert(attributes[0] === element.getAttributeNode('a'));
console.assert(attributes.a === element.getAttributeNode('a'));

const attrs = [...attributes];
console.assert(attrs.length === 1);
console.assert(attrs[0] === element.getAttributeNode('a'));

console.assert(JSON.stringify(Reflect.ownKeys(attributes)) === '["0","a"]');
console.assert(attributes.b === void 0);
console.assert(attributes[1] === void 0);

console.assert('a' in attributes);
console.assert(!('b' in attributes));
console.assert(!(1 in attributes));
