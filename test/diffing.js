import {render, html} from './instrumented/index.js';

const {body} = document;

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
