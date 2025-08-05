# uhtml

[![Downloads](https://img.shields.io/npm/dm/uhtml.svg)](https://www.npmjs.com/package/uhtml) [![build status](https://github.com/WebReflection/uhtml/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/uhtml/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uhtml/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/uhtml?branch=main) [![CSP strict](https://webreflection.github.io/csp/strict.svg)](https://webreflection.github.io/csp/#-csp-strict)

![snow flake](./uhtml-head.jpg)

<sup>**Social Media Photo by [Andrii Ganzevych](https://unsplash.com/@odya_kun) on [Unsplash](https://unsplash.com/)**</sup>


A minimalistic library to create fast and reactive Web pages.

```html
<!doctype html>
<script type="module">
  import { html } from 'https://esm.run/uhtml';

  document.body.prepend(
    html`<h1>Hello DOM !</h2>`
  );
</script>
```

*uhtml* (micro *µ* html) offers the following features without needing specialized tools:

  * *JSX* inspired syntax through template literal `html` and `svg` tags
  * *React* like components with *Preact* like *signals*
  * compatible with native custom elements and other Web standards out of the box
  * simplified accessibility via `aria` attribute and easy *dataset* handling via `data`
  * developers enhanced mode runtime debugging sessions

```js
import { html, signal } from 'https://esm.run/uhtml';

function Counter() {
  const count = signal(0);

  return html`
    <button onClick=${() => count.value++}>
      Clicked ${count.value} times
    </button>
  `;
}

document.body.append(
  html`<${Counter} />`
);
```

- - -

## Syntax

If you are familiar with *JSX* you will find *uhtml* syntax very similar:

  * self closing tags, such as `<p />`
  * self closing elements, such as `<custom-element>...</>`
  * object spread operation via `<${Component} ...=${{any: 'prop'}} />`
  * `key` attribute to ensure *same DOM node* within a list of nodes
  * `ref` attribute to retrieve the element via effects or by any other mean

The main difference between *uhtml* and *JSX* is that *fragments* do **not** require `<>...</>` around:

```js
// uhtml fragment example
html`
  <div>first element</div>
  <p> ... </p>
  <div>last element</div>
`
```

### Special Attributes

On top of *JSX* like features, there are other attributes with a special meaning:

  * `aria` attribute to simplify *a11y*, such as `<button aria=${{role: 'button', labelledBy: 'id'}} />`
  * `data` attribute to simplify *dataset* handling, such as `<div data=${{any: 'data'}} />`
  * `@event` attribute for generic events handling, accepting an array when *options* are meant to be passed, such as `<button @click=${[event => {}, { once: true }]} />`
  * `on...` prefixed direct events, such as `<button onclick=${listener} />`
  * `.direct` properties access, such as `<input .value=${content} />`, `<button .textContent=${value} />` or `<div .className=${value} />`
  * `?toggle` boolean attributes, such as `<div ?hidden=${isHidden} />`

All other attributes will be handled via standard `setAttribute` or `removeAttribute` when the passed value is either `null` or `undefined`.

### Special Elements

Elements that contain *data* such as `<script>` or `<style>`, or those that contains text such as `<textarea>` require *explicit closing tag* to avoid having in between templates able to break the layout.

This is nothing new to learn, it's just how the Web works, so that one cannot have `</script>` within a `<script>` tag content and the same applies in here.

In *debugging* mode, an error telling you which template is malformed will be triggered in these cases.

### About Comments

Useful for developers but never really relevant for end users, *comments* are ignored by default in *uhtml* except for those flagged as "*very important*".

The syntax to preserve a comment in the layout is `<!--! important !-->`. Every other comment will not be part of the rendered tree.

```js
html`
  <!--! this is here to stay !-->
  <!--// this will go -->
  <!-- also this -->
`
```

The result will be a clear `<!-- this is here to stay -->` comment in the layout without starting and closing `!`.

#### Other Comments

There are two kind of "*logical comments*" in *uhtml*, intended to help its own functionality:

  * `<!--◦-->` *holes*, used to *pin* in the DOM tree where changes need to happen.
  * `<!--<>-->` and `<!--</>-->` persistent *fragments* delimeters

The *hole* type might disappear once replaced with different content while persistent fragments delimeters are needed to confine and/or retrieve back fragments' content.

Neither type will affect performance or change layout behavior.

- - -

## Exports

```js
import {
  // DOM manipulation
  render, html, svg, unsafe,
  // Preact like signals, based on alien-signals library
  signal, computed, effect, untracked, batch,
  // extras
  Hole, fragment,
} from 'https://esm.run/uhtml';
```

**In details**

  * `render(where:Element, what:Function|Hole|Node)` to orchestrate one-off or repeated content rendering, providing a scoped *effect* when a *function* is passed along, such as `render(document.body, () => App(data))`. This is the suggested way to enrich any element content with complex reactivity in it.
  * `html` and `svg` [template literal tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) to create either *HTML* or *SVG* content.
  * `unsafe(content:string)` to inject any content, even *HTML* or *SVG*, anywhere within a node: `<div>${unsafe('<em>value</em>')}</div>`
  * `signal`, `computed`, `effect`, `untracked` and `batch` utilities with [Preact signals](https://github.com/preactjs/signals/blob/main/packages/core/README.md) inspired API, fueled by [alien-signals](https://github.com/stackblitz/alien-signals#readme)
  * `Hole` class used internally to resolve `html` and `svg` tags' template and interpolations. This is exported mainly to simplify *TypeScript* relaed signatures.
  * `fragment(content:string, svg?:boolean)` extra utility, used internally to create either *HTML* or *SVG* elements from a string. This is merely a simplification of a manually created `<template>` element, its `template.innerHTML = content` operation and retrieval of its `template.content` reference, use it if ever needed but remember it has no special meaning or logic attached, it's literally just standard DOM fragment creation out of a string.

- - -

## Loading from a CDN

The easiest way to start using *uhtml* is via *CDN* and here a few exported variants:

```js
// implicit production version
import { render, html } from 'https://esm.run/uhtml';
// https://cdn.jsdelivr.net/npm/uhtml/dist/prod/dom.js

// explicit production version
import { render, html } from 'https://esm.run/uhtml/prod';
// https://cdn.jsdelivr.net/npm/uhtml/dist/prod/dom.js

// explicit developer/debugging version
import { render, html } from 'https://esm.run/uhtml/dev';
import { render, html } from 'https://esm.run/uhtml/debug';
// https://cdn.jsdelivr.net/npm/uhtml/dist/dev/dom.js

// automatic prod/dev version on ?dev or ?debug
import { render, html } from 'https://esm.run/uhtml/cdn';
// https://cdn.jsdelivr.net/npm/uhtml/dist/prod/cdn.js
```

Using `https://esm.run/uhtml/cdn` or the fully qualified `https://cdn.jsdelivr.net/npm/uhtml/dist/prod/cdn.js` URL provides an automatic switch to *debug* mode if the current page location contains `?dev` or `?debug` or `?debug=1` query string parameter plus it guarantees the library will not be imported again if other scripts use a different *CDN* that points at the same file in a different location.

This makes it easy to switch to *dev* mode by changing the location from `https://example.com` to `https://example.com?debug`.

Last, but not least, it is not recommended to bundle directly *uhtml* in your project because components portability becomes compromised, as example, if each component bundles within itself *uhtml*.

### Import Map

Another way to grant *CDN* and components portability is to use an import map and exclude *uhtml* from your bundler.

```html
<!-- defined on each page -->
<script type="importmap">
{
  "imports": {
    "uhtml": "https://cdn.jsdelivr.net/npm/uhtml/dist/prod/cdn.js"
  }
}
</script>
<!-- your library code -->
<script type="module">
import { html } from 'uhtml';

document.body.append(
  html`Import Maps are Awesome!`
);
</script>
```

- - -

## Extra Tools

Minification is still recommended for production use cases and not only for *JS*, also for the templates and their content.

The [rollup-plugin-minify-template-literals](https://www.npmjs.com/package/rollup-plugin-minify-template-literals) is a wonderful example of a plugin that does not complain about *uhtml* syntax and minifies to its best *uhtml* templates in both *vite* and *rollup*.

This is a *rollup* configuration example:

```js
import terser from "@rollup/plugin-terser";
import templateMinifier from "rollup-plugin-minify-template-literals";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/your-component.js",
  plugins: [
    templateMinifier({
      options: {
        minifyOptions: {
          // allow only explicit <!--! comments !-->
          ignoreCustomComments: [/^!/],
          keepClosingSlash: true,
          caseSensitive: true,
        },
      },
    }),
    nodeResolve(),
    terser(),
  ],
  output: {
    esModule: true,
    file: "dist/your-component.js",
  },
};
```

- - -

## About SSR and hydration

The current *pareser* is already environment agnostic, it runs on the client like it does in the server without needing dependencies at all.

However, the current *SSR* story is still a **work in progress** but it's planned to land sooner than later.
