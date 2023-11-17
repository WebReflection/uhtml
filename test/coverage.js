const {DOMParser, HTMLElement} = require('linkedom');

const document = (new DOMParser).parseFromString('...', 'text/html');
const { prototype } = document.createRange().constructor;

// TODO: fix LinkeDOM SVG story
prototype.selectNodeContents = prototype.selectNode;

const { render, html, svg, htmlFor } = require('../cjs/init.js')(document);

const htmlNode = (template, ...values) => htmlFor({})(template, ...values);

const {Event} = document.defaultView;

const {body} = document;

const elementA = htmlNode`<div>foo</div>`;
const elementB = htmlNode`
  <div>bar</div>
`;

console.assert(elementA instanceof HTMLElement, 'elementA not instanceof HTMLElement');
console.assert(elementB instanceof HTMLElement, 'elementB not instanceof HTMLElement');

const fragment = () => html`<p>1</p><p>2</p>`;
const variousContent = content => html`${content}`;

render(body, html`this is a test`);
render(body, html`this is a ${
  [1, 2].map(n => html`${n}`)
} test`);
render(body, html`this is a ${
  [1, 2].map(n => svg`${n}`)
} test`);

(function twice(i) {
  render(body, html`this is a ${
    (i ? [1, 2, 3] : [1, 2]).map(n => svg`${n}`)
  } test`);
  if (i--) twice(i);
}(1));

render(body, html`this is a ${'test'}`);
render(body, html`this is a ${true}`);
render(body, html`this is a ${1} ${2} ${3}`);
render(body, html`this is a ${1}`);

let div = document.createElement('div');
render(div, htmlNode`this is a test`);
render(div, htmlFor(body)`this is a test`);
render(div, htmlFor(body, 1)`this is a test`);
render(div, () => htmlFor(body)`this is a test`);
render(div, () => htmlFor(body, 1)`this is a test`);
(function twice(i) {
  render(div, () => htmlFor(body)`this is a test`);
  render(div, () => htmlFor(body, 1)`this is a test`);
  if (i--) twice(i);
}(1));

let clicked = false;
render(div, html`<div test="${123}" @click=${() => { clicked = true; }} .disabled=${true} .contentEditable=${false} null=${null} />`);
div.firstElementChild.dispatchEvent(new Event('click'));
console.assert(clicked, '@click worked');

clicked = false;
render(div, html`<div test="${123}" onclick=${() => { clicked = true; }} .disabled=${true} .contentEditable=${false} null=${null} />`);
div.firstElementChild.dispatchEvent(new Event('click'));
console.assert(clicked, 'onclick worked');

const textArea = content => html`<textarea>${content}</textarea>`;
const style = content => html`<style>${content}</style>`;
render(document.createElement('div'), textArea('test'));
render(document.createElement('div'), textArea(null));
render(document.createElement('div'), style('test'));
render(document.createElement('div'), style(void 0));

const sameWire = content => html`<div>${content}</div>`;
render(div, sameWire([fragment()]));
render(div, sameWire([]));
render(div, sameWire([fragment()]));

render(div, html`<style>${'text only'}</style>`);
render(div, html`<br />`);

render(div, variousContent([
  html`<p />`,
  html`<p />`
]));
render(div, variousContent([
  html`<p />`,
  html`<p />`,
  html`<p />`
]));
render(div, variousContent([
  html`<p />`
]));

render(div, html`<style>${html`text only`}</style>`);

const oneHoleContent = content => html`${content}`;
render(div, oneHoleContent(html`OK`));
render(div, oneHoleContent('text'));
console.assert(div.textContent === 'text');
render(div, oneHoleContent(null));
console.assert(div.textContent === '');
render(div, oneHoleContent(void 0));
console.assert(div.textContent === '');

const reference = {};
render(div, html`<div ref=${reference}>test</div>`);
console.assert(reference.hasOwnProperty('current'));

const fnReference = node => { fnReference.node = node; };
render(div, html`<div ref=${fnReference}>test</div>`);
console.assert(fnReference.node === div.firstElementChild);

const withHandler = handler => html`<div onclick=${handler} />`;
render(div, withHandler(Object));
render(div, withHandler(Object));
render(div, withHandler(String));
render(div, withHandler(null));
render(div, withHandler([Object, false]));

const withAttribute = value => html`<div test=${value} />`;
render(div, withAttribute(null));
render(div, withAttribute('test'));
render(div, withAttribute('test'));
render(div, withAttribute(null));
render(div, withAttribute('test'));

const withText = value => html`<textarea>${value}</textarea>`;
render(div, withText('test'));
render(div, withText('test'));
render(div, withText(null));
render(div, withText('test'));

render(div, html`${document.createDocumentFragment()}`);

const wire1 = html`<p /><p />`;
const wire2 = html`<div /><div />`;
const wire = what => html`${what}`;
render(div, wire([wire1, fragment(), wire2]));
render(div, wire([wire2, fragment(), wire1]));

render(div, html`<two /><holes />`);
render(div, html`<one />`);

try {
  render(div, html`<p test="is ${'really'} broken" ${"isn't it"}></p>`);
  console.assert(false, 'broken template is not breaking');
} catch (OK) {}

const otherWire = (className, text, content) => html`<div class=${className} style=${text}>${content}</div>`;
render(div, otherWire('some', 'border:1px solid black', 'test'));
console.assert(div.firstElementChild.className === 'some', 'semiDirect set');
render(div, otherWire(null, null, 'test'));
console.assert(!div.firstElementChild.hasAttribute('class'), 'semiDirect null');
render(div, otherWire('other', '', 'test'));
console.assert(div.firstElementChild.className === 'other', 'semiDirect set again');
render(div, otherWire(document.createElement('p')));

const sameAttribute = value => html`<div test=${value} />`;
render(body, sameAttribute(1));
render(body, sameAttribute(null));
render(body, sameAttribute(null));
render(body, sameAttribute(2));
render(body, sameAttribute(3));

render(body, html`<p><!--nope--></p><p>${'hole'}</p>`);
render(body, html`<h1>${{no: "op"}}</h1>`);
render(body, html`<h1>test</h1>`);
render(body, html`<h2>test</h2><h3>test</h3>`);
render(body, html`${fragment()}`);
render(body, html`${fragment()}`);
render(body, html`${[fragment()]}`);
render(body, html`<h1 data-test="${123}">${'content'}</h1>`);
render(body, html`<div test="${123}" onclick=${() => {}} .disabled=${true} .contentEditable=${false} null=${null} />`);
render(body, variousContent([
  html`<p />`,
  html`<p />`
]));
render(body, variousContent([
  html`<p />`,
  html`<p />`,
  html`<p />`
]));
render(body, variousContent([
  html`<p />`
]));

render(body, html`<div aria=${{role: 'button', labelledBy: 'id'}} />`);
console.assert(body.firstElementChild.getAttribute('role') === 'button', 'aria=${role}');
console.assert(body.firstElementChild.getAttribute('aria-labelledBy') === 'id', 'aria=${labelledBy}');
render(body, html`<div aria=${{role: 'button', labelledBy: null}} />`);

render(body, html`<div data=${{labelledBy: 'id'}} />`);
console.assert(body.firstElementChild.dataset.labelledBy === 'id', '.dataset=${...}');
render(body, html`<div data=${{labelledBy: null}} />`);

render(body, html`<div ?thing=${1} />`);
console.assert(body.firstElementChild.getAttribute('thing') === '', '?thing=${truthy}');

render(body, html`<div ?thing=${0} />`);
console.assert(!body.firstElementChild.hasAttribute('thing'), '?thing=${falsy}');

const handler = () => {};
const withComplexHandler = handler => html`<div @click=${handler} />`;
render(body, withComplexHandler(handler));
render(body, withComplexHandler(() => {}));
render(body, withComplexHandler(null));
render(body, withComplexHandler(void 0));
render(body, withComplexHandler([handler, { once: true }]));
render(body, withComplexHandler([() => {}, { once: true }]));
render(body, withComplexHandler([null, { once: true }]));
render(body, withComplexHandler([void 0, { once: true }]));

const uhtml = require('../cjs/init.js')(document);
uhtml.render(body, uhtml.html`<last test=${123}>${456}</last>`);
