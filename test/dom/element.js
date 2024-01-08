import Document from '../../esm/dom/document.js';

const document = new Document;

const element = document.createElement('element');
const text = document.createTextNode('text');

console.assert(element.localName === 'element');
console.assert(element.nodeName === 'ELEMENT');
console.assert(element.tagName === 'ELEMENT');
console.assert(element.innerHTML === '');
console.assert(element.outerHTML === '<element></element>');
console.assert(element.previousSibling == null);
console.assert(element.previousElementSibling == null);
console.assert(element.nextSibling == null);
console.assert(element.nextElementSibling == null);

console.assert(element.getAttributeNames().length === 0);
console.assert(!element.hasAttribute('style'));
console.assert(element.style.cssText === '');
element.style.cssText = 'margin: 0;';
console.assert(element.hasAttribute('style'));
console.assert(element.style.cssText === 'margin: 0;');
element.removeAttribute('style');

const br = document.createElement('br');
console.assert(br.outerHTML === '<br>');

document.body.append(element, text, br);
console.assert(element.previousSibling == null);
console.assert(br.previousSibling == text);
console.assert(br.previousElementSibling == element);
console.assert(element.nextElementSibling == br);
console.assert(element.nextSibling == text);
console.assert(br.nextSibling == null);
console.assert(JSON.stringify(element.getAttributeNames()) === '[]');
console.assert(!element.hasAttributes());
console.assert(!element.hasAttribute('id'));
console.assert(element.id === '');
element.id = 'element';
console.assert(element.hasAttributes());
console.assert(element.hasAttribute('id'));
console.assert(element.id === 'element');
console.assert(element.className === '');
element.className = 'element';
console.assert(element.className === 'element');
console.assert(document.getElementsByClassName('element').length === 1);
console.assert(element.toString() === '<element id="element" class="element"></element>');
console.assert(document.getElementById('element') === element);
console.assert(JSON.stringify(element.getAttributeNames()) === '["id","class"]');
br.id = 'br';
console.assert(br.toString() === '<br id="br">');

const cloneBR = br.cloneNode();
console.assert(cloneBR.toString() === '<br id="br">');

element.replaceWith(text);
console.assert(document.body.toString() === '<body>text<br id="br"></body>');
console.assert(br.previousElementSibling === null);
br.after(element);
console.assert(document.body.toString() === '<body>text<br id="br"><element id="element" class="element"></element></body>');
br.after(text);
console.assert(document.body.toString() === '<body><br id="br">text<element id="element" class="element"></element></body>');

console.assert(document.body.cloneNode(true).toString() === document.body.toString());

br.before(element);
console.assert(document.body.toString() === '<body><element id="element" class="element"></element><br id="br">text</body>');
console.assert(br.nextElementSibling === null);
br.before(text);
console.assert(document.body.toString() === '<body><element id="element" class="element"></element>text<br id="br"></body>');

br.removeAttribute('class');
br.removeAttribute('id');
console.assert(br.outerHTML === '<br>');

br.toggleAttribute('hidden');
console.assert(br.outerHTML === '<br hidden>');
const hidden = br.getAttributeNode('hidden');
br.setAttribute('hidden', '');
console.assert(br.getAttributeNode('hidden') === hidden);
br.setAttributeNode(hidden);
console.assert(br.getAttributeNode('hidden') === hidden);
br.toggleAttribute('hidden');
console.assert(br.outerHTML === '<br>');
br.toggleAttribute('hidden', false);
console.assert(br.outerHTML === '<br>');
br.toggleAttribute('hidden', true);
console.assert(br.outerHTML === '<br hidden>');
br.toggleAttribute('hidden', true);
console.assert(br.outerHTML === '<br hidden>');
br.removeAttributeNode(br.attributes.hidden);
console.assert(br.outerHTML === '<br>');
console.assert(br.getAttributeNode('hidden') === null);

const { dataset } = br;
delete dataset.testMe;
console.assert(!('testMe' in dataset));
dataset.testMe = 1;
console.assert('testMe' in dataset);
console.assert(dataset.testMe === '1');
console.assert(br.outerHTML === '<br data-test-me="1">');
console.assert(Reflect.ownKeys(dataset).join('') === 'testMe');
delete dataset.testMe;
console.assert(br.outerHTML === '<br>');

const { classList } = br;
console.assert(classList.length === 0);
console.assert(classList.value === '');
console.assert(!classList.contains('a'));
classList.add('a');
console.assert(classList.length === 1);
console.assert(classList.value === 'a');
console.assert(classList.contains('a'));
classList.add('b');
console.assert(classList.length === 2);
console.assert(classList.value === 'a b');
classList.remove('a');
console.assert(classList.length === 1);
console.assert(classList.value === 'b');
console.assert(!classList.contains('a'));
console.assert(classList.contains('b'));
classList.replace('b', 'a');
console.assert(classList.length === 1);
console.assert(classList.value === 'a');
console.assert(!classList.contains('b'));
console.assert(classList.contains('a'));
classList.replace('c', 'b');
console.assert(classList.length === 1);
console.assert(classList.value === 'a');
console.assert(classList.contains('a'));
classList.toggle('b');
console.assert(classList.length === 2);
console.assert(classList.value === 'a b');
console.assert(br.outerHTML === '<br class="a b">');
classList.toggle('b');
console.assert(classList.length === 1);
console.assert(classList.value === 'a');
classList.toggle('a', true);
console.assert(classList.length === 1);
console.assert(classList.value === 'a');
console.assert(br.outerHTML === '<br class="a">');

console.assert([...classList.keys()].join(',') === '0');
console.assert([...classList.values()].join(',') === 'a');
console.assert([...classList.entries()].join(',') === '0,a');
let each = [];
classList.forEach(value => {
  each.push(value);
});
console.assert(each.join(',') === 'a');

const template = document.createElement('template');
template.append('a', 'b');
const { content } = template;
console.assert(content.childNodes.length === 2);
console.assert(content.childNodes[0] !== template.childNodes[0]);

const div = document.createElement('div');
div.innerHTML = `
  Some text
  <!-- some comment -->
  <p is="custom-element">some node</p>
  <![CDATA[ < > & ]]>
  <svg><rect /></svg>
`;
console.assert(div.outerHTML === `
<div>
  Some text
  <!-- some comment -->
  <p is="custom-element">some node</p>
  
  <svg><rect /></svg>
</div>
`.trim());
console.assert(div.childNodes.every(node => node.parentNode === div));
console.assert(div.textContent.trim() === `Some text
  
  some node`);

div.textContent = 'OK';
console.assert(div.outerHTML === `<div>OK</div>`);

div.append('', '!', document.createElement('br'));
console.assert(div.childNodes.length === 4);
div.normalize();
console.assert(div.childNodes.length === 2);
console.assert(div.outerHTML === `<div>OK!<br></div>`);
