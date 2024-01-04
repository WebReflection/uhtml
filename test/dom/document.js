import Document from '../../esm/dom/document.js';

const document = new Document;

const { documentElement, body, head } = document;

const attribute = document.createAttribute('lang');
attribute.value = 'en';
documentElement.setAttributeNode(attribute);

const ce = document.createElement('a', { is: 'a-link' });
body.appendChild(ce);

console.assert(document.toString() === '<!DOCTYPE html><html lang="en"><head></head><body><a is="a-link"></a></body></html>');
console.assert(head === documentElement.firstElementChild);
console.assert(document.getElementsByTagName('html').length === 1);

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
console.assert('ownerSVGElement' in svg);
console.assert('ownerSVGElement' in svg.cloneNode());
console.assert(svg.ownerSVGElement === null);
console.assert(svg.toString() === '<svg></svg>');

const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
svg.append(rect);
console.assert(rect.ownerSVGElement === svg);
console.assert(svg.toString() === '<svg><rect /></svg>');
rect.setAttribute('x', 1);
console.assert(svg.toString() === '<svg><rect x="1" /></svg>');
console.assert('ownerSVGElement' in svg.cloneNode(true));

const inner = rect.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));
console.assert(inner.ownerSVGElement === svg);

const tree = document.createElement('div');
let tree0, tree1, tree2;
tree.append(
  tree0 = document.createElement('div'),
  tree2 = document.createComment('2'),
  document.createTextNode('')
);
tree0.append(
  tree1 = document.createComment('1')
);

const tw = document.createTreeWalker(tree, 1 | 128);

console.assert(tw.nextNode() === tree0);
console.assert(tw.nextNode() === tree1);
console.assert(tw.nextNode() === tree2);
console.assert(tw.nextNode() == null);
