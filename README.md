# uHTML

A micro HTML/SVG render

  * no diffing whatsoever, it's just a faster, and smarter `innerHTML` equivalent
  * nodes with a `name="..."` attribute are collected once
  * no repeated render, per each node, when same template literal is used
  * a perfect tiny companion for [wickedElements](https://github.com/WebReflection/wicked-elements#readme) or [hookedElements](https://github.com/WebReflection/hooked-elements#readme)

The key of _uhtml_ is size and simplicity: nothing is transformed, transpiled, or mapped, you have full freedom to define layouts and enrich these later on.

```js
import {render, html} from 'uhtml';
const {render, html} = require('uhtml');
// https://unpkg.com/uhtml
```

## API and Features in a Nutshell
```js
import {render, html, svg} from 'uhtml';

const {title, kind} = render(
  document.body,
  html`
    <h1 name="title">Hello uHTML!</h1>
    <p>
      Welcome to this <span name="kind"></span> adventure!
    </p>
  `
);

// every name in the template results into an element
title.style.textDecoration = 'underline';
kind.textContent = 'new';
```
