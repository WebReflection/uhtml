require('basichtml').init();

let {render, html, svg} = require('../cjs');

render(document.createElement('div'), html`this is a test`);
render(document.createElement('div'), html`this is a ${
  [1, 2].map(n => html`${n}`)
} test`);
render(document.createElement('div'), html`this is a ${
  [1, 2].map(n => svg`${n}`)
} test`);

delete require.cache[require.resolve('../cjs')];
const {importNode} = document;

document.importNode = function () {
  return importNode.apply(this, arguments);
};

const uhtml = require('../cjs');
render = uhtml.render;
html = uhtml.html;
svg = uhtml.svg;

(function twice(i) {
  render(document.createElement('div'), html`this is a ${
    (i ? [1, 2, 3] : [1, 2]).map(n => svg`${n}`)
  } test`);
  if (i--) twice(i);
}(1));

render(document.createElement('div'), html`this is a ${'test'}`);
render(document.createElement('div'), html`this is a ${true}`);
render(document.createElement('div'), html`this is a ${1}`);

let div = document.createElement('div');
render(div, html.node`this is a test`);
render(div, html.for(global)`this is a test`);
render(div, html.for(global, 1)`this is a test`);
render(div, () => html.for(global)`this is a test`);
render(div, () => html.for(global, 1)`this is a test`);
(function twice(i) {
  render(div, () => html.for(global)`this is a test`);
  render(div, () => html.for(global, 1)`this is a test`);
  if (i--) twice(i);
}(1));

render(div, html`<div test="${123}" onclick=${() => {}} .disabled=${true} .contentEditable=${false} null=${null} />`);

render(document.createElement('div'), html`<textarea>${'test'}</textarea>`);
render(document.createElement('div'), html`<style>${'test'}</style>`);

const fragment = () => html`<p>1</p><p>2</p>`;

const sameWire = content => html`<div>${content}</div>`;
render(div, sameWire([fragment()]));
render(div, sameWire([]));
render(div, sameWire([fragment()]));

render(div, html`<style>${'text only'}</style>`);

const variousContent = content => html`${content}`;
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
