# <em>µ</em>html

[![Downloads](https://img.shields.io/npm/dm/uhtml.svg)](https://www.npmjs.com/package/uhtml) [![build status](https://github.com/WebReflection/uhtml/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/uhtml/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uhtml/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/uhtml?branch=main) [![CSP strict](https://webreflection.github.io/csp/strict.svg)](https://webreflection.github.io/csp/#-csp-strict)

![snow flake](./docs/uhtml-head.jpg)

<sup>**Social Media Photo by [Andrii Ganzevych](https://unsplash.com/@odya_kun) on [Unsplash](https://unsplash.com/)**</sup>

*uhtml* (micro *µ* html) is one of the smallest, fastest, memory consumption friendly, yet zero-tools based, library to safely help creating or manipulating DOM content.

### 📣 uhtml v4 is out

**[Documentation](https://webreflection.github.io/uhtml/)**

**[Release Notes](https://github.com/WebReflection/uhtml/pull/86)**

- - -

### Exports

  * **uhtml** as default `{ Hole, render, html, svg, attr }` with smart auto-keyed nodes - read [keyed or not ?](https://webreflection.github.io/uhtml/#keyed-or-not-) paragraph to know more
  * **uhtml/keyed** with extras `{ Hole, render, html, svg, htmlFor, svgFor, attr }`, providing keyed utilities - read [keyed or not ?](https://webreflection.github.io/uhtml/#keyed-or-not-) paragraph to know more
  * **uhtml/node** with *same default* exports but it's for *one-off* nodes creation only so that no cache or updates are available and it's just an easy way to hook *uhtml* into your existing project for DOM creation (not manipulation!)
  * **uhtml/init** which returns a `document => uhtml/keyed` utility that can be bootstrapped with `uhtml/dom`, [LinkeDOM](https://github.com/WebReflection/linkedom), [JSDOM](https://github.com/jsdom/jsdom) for either *SSR* or *Workers* support
  * **uhtml/dom** which returns a specialized *uhtml* compliant DOM environment that can be passed to the `uhtml/init` export to have 100% same-thing running on both client or Web Worker / Server. This entry exports `{ Document, DOMParser }` where the former can be used to create a new *document* while the latter one can parse well formed HTML or SVG content and return the document out of the box.
  * **uhtml/reactive** which allows usage of symbols within the optionally *keyed* render function. The only difference with other exports, beside exporting a `reactive` field instead of `render`, so that `const render = reactive(effect)` creates a reactive render per each library, is that the `render(where, () => what)`, with a function as second argument is mandatory when the rendered stuff has signals in it, otherwise these can't side-effect properly.
  * **uhtml/preactive** is an already bundled `uhtml/reactive` with `@preact/signals-core` in it, so that its `render` exported function, among all other *preact* related exports, is already working.

### uhtml/init example

```js
import init from 'uhtml/init';
import { Document } from 'uhtml/dom';

const document = new Document;

const {
  Hole,
  render,
  html, svg,
  htmlFor, svgFor,
  attr
} = init(document);
```

### uhtml/preactive example

```js
import { render, html, signal } from 'uhtml/preactive';

const count = signal(0);

render(document.body, () => html`
  <button onclick=${() => { count.value++ }}>
    Clicks: ${count.value}
  </button>
`);
```