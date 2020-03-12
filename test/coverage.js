import {render, html, svg} from './instrumented/index.js';

const {body} = document;

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
render(body, html`this is a ${1}`);

let div = document.createElement('div');
render(div, html.node`this is a test`);
render(div, html.for(body)`this is a test`);
render(div, html.for(body, 1)`this is a test`);
render(div, () => html.for(body)`this is a test`);
render(div, () => html.for(body, 1)`this is a test`);
(function twice(i) {
  render(div, () => html.for(body)`this is a test`);
  render(div, () => html.for(body, 1)`this is a test`);
  if (i--) twice(i);
}(1));

render(div, html`<div test="${123}" onclick=${() => {}} .disabled=${true} .contentEditable=${false} null=${null} />`);

render(document.createElement('div'), html`<textarea>${'test'}</textarea>`);
render(document.createElement('div'), html`<style>${'test'}</style>`);

const sameWire = content => html`<div>${content}</div>`;
render(div, sameWire([fragment()]));
render(div, sameWire([]));
render(div, sameWire([fragment()]));

render(div, html`<style>${'text only'}</style>`);

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
render(div, variousContent('text'));
render(div, variousContent(null));
render(div, variousContent(void 0));
render(div, variousContent([true]));
render(div, variousContent([1]));
render(div, variousContent(['one']));

const reference = {};
render(div, html`<div ref=${reference}>test</div>`);
console.assert(reference.hasOwnProperty('current'));

const withHandler = handler => html`<div onClick=${handler} />`;
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

render(div, sameWire('test'));
render(div, sameWire('test'));
render(div, sameWire(document.createElement('p')));

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

// udomdiff tests for get(node, how)
// https://github.com/WebReflection/udomdiff/blob/master/test/test.js
const createList = (...args) => html`<div>${args}</div>`;
const testDiff = (a, b, c, d, e, f, g, h, i, j, k) => {
  render(body, createList());
  render(body, createList(b, c, d));
  render(body, createList(a, b, c, d));
  render(body, createList(d, c, b, a));
  render(body, createList(a, b, c, d));
  render(body, createList(a, b, c, d, e, f));
  render(body, createList(a, b, c, g, h, i, d, e, f));
  render(body, createList(a, b, c, g, h, i, d, e));
  render(body, createList(c, g, h, i, d, e));
  render(body, createList(c, g, d, e));
  render(body, createList());
  render(body, createList(a, b, c, d, e, f));
  render(body, createList(a, b, g, i, d, e, f));
  render(body, createList(a, b, c, d, e, f));
  render(body, createList(j, g, a, b, c, d, e, f, h, i));
  render(body, createList(a, b, c, d, e, f));
  render(body, createList(a, g, c, d, h, i));
  render(body, createList(i, g, a, d, h, c));
  render(body, createList(c, h, d, a, g, i));
  render(body, createList(d, f, g));
  render(body, createList(a, b, c, d, f, g));
  render(body, createList(a, b, c, d, e, f, g));
  render(body, createList(g, f, e, d, c, b, a));
  render(body, createList(f, d, b, a, e, g));
  render(body, createList(a, b, c, d, e, f));
  render(body, createList(a, b, c, d, e, f, h, i, j));
  render(body, createList(a, b, c, d, e, h, f, i, j));
  render(body, createList(a, b, i, d, e, h, f, c, j));
  render(body, createList(a, b, c, d, e, f, h, i, j));
  render(body, createList(a, b, c, d, e, f, g, h, i, j, k));
  render(body, createList(g, h, i));
  render(body, createList(a, b, c, d));
  render(body, createList(b, c, a, d));
  render(body, createList(a, b, c, d, e));
  render(body, createList(d, a, b, c, f));
  render(body, createList(a, d, e));
  render(body, createList(d, f));
  render(body, createList(b, d, c, k));
  render(body, createList(c, k, b, d));
  render(body, createList());
  render(body, createList(a, b, c, d));
  render(body, createList(a, b, d, e, c));
  render(body, createList(a, b, c));
  render(body, createList(c, a, b));
  render(body, createList());
};

testDiff(
  html`<p>a</p>`,
  html`<p>b</p>`,
  html`<p>c</p>`,
  html`<p>d</p>`,
  html`<p>e</p>`,
  html`<p>f</p>`,
  html`<p>g</p>`,
  html`<p>h</p>`,
  html`<p>i</p>`,
  html`<p>j</p>`,
  html`<p>k</p>`
);

testDiff(
  html`<p>a</p><p>a</p>`,
  html`<p>b</p><p>b</p>`,
  html`<p>c</p><p>c</p>`,
  html`<p>d</p><p>d</p>`,
  html`<p>e</p><p>e</p>`,
  html`<p>f</p><p>f</p>`,
  html`<p>g</p><p>g</p>`,
  html`<p>h</p><p>h</p>`,
  html`<p>i</p><p>i</p>`,
  html`<p>j</p><p>j</p>`,
  html`<p>k</p><p>k</p>`
);
