# µHTML v1

<sup>**Social Media Photo by [Andrii Ganzevych](https://unsplash.com/@odya_kun) on [Unsplash](https://unsplash.com/)**</sup>

A _~2.5K_ HTML/SVG render based on parts of [lighterhtml](https://github.com/WebReflection/lighterhtml#readme) and [domdiff](https://github.com/WebReflection/domdiff#readme), without any extra cruft.

```js
import {render, html, svg} from 'uhtml';
// const {render, html, svg} = require('uhtml');
// <script src="https://unpkg.com/uhtml"></script>

render(document.body, html`<h1>Hello 👋 µHTML</h1>`);
```

**[Live Demo](https://codepen.io/WebReflection/pen/bGdBjjL?editors=0010)**


#### Where is v0 ?

The previous attempt to make it essential resulted ... well, too essential, but it's still [usable](./V0.md) via `npm i uhtml@0`.


## Differently from `lighterhtml`

  * there are **no sparse attributes**, each attribute *must* have a single interpolated value: `attribute=${value}` is OK, `attribute="${a}${b}"` is not.
  * the parser is `RegExp` based: smaller, faster, but not as robust as the DOM based one used in _lighterhtml_
  * there are no keyed helpers: no `html.for(...)` and no `html.node`. Use the `render(...)` and just `html` or `svg`
  * the interpolations are simple: primitive, or array of primitives, and nodes, or array of nodes.
  * the `style` attribute is not special at all, if you want to pass objects there, please transform these as you prefer.
  * the _domdiff_ rip-off has been simplified to bail out sooner than the original module, performing extremely well for a reduced, but common, set of use cases: prepend, append, remove one to many, and replace one with many. Unless you keep shuffling all nodes in a list all the time, you won't likely notice any real-world difference.
  * this is not as battle tested as _lighterhtml_, but I'm planning to reproduce most demoes and see if it's robust enough, as most code was a cleanup after copy and paste.
  * the `template` argument is not normalized. If you target browsers with issue with such argument, please be sure you transpile with latest _Babel_ your code
  * no _domtagger_ whatsoever, you can't change the current behavior of the library in any way


## Similarly or better than `lighterhtml`

  * nested `html` and `svg` are allowed like in _lighterhtml_. `v0` didn't allow that, hence it was more "_surprise prone_". _uhtml_ in that sense is more like a drop-in replacement
  * the `ref=${...}` attribute works same as _lighterhtml_, enabling hooks, or _React_ style, out of the box
  * the `.attribute=${...}` is still available, although _uhtml_ should *not* suffer any of the IE11/Edge issues, as the parsing is done differently
  * self closing nodes are also supported, go wild with `<custom-elements />` or even `<span />`
  * the wire parsing logic has been simplified even more, likely resulting in better bootstrap and update performance (which is also *not* an issue in _lighterhtml_)
  * it's half of _lighterhtml_ production size, mostly because ...
  * there are no 3rd parts dependencies, except `@ungap/create-content` and `@ungap/import-node`, both removable via [@ungap/degap](https://github.com/ungap/degap#readme), same way I've done it [here](./rollup/new.config.js), or [babel-plugin-remove-ungap](https://github.com/cfware/babel-plugin-remove-ungap#readme). The compressed final size difference is just _~0.5K_ though.

## Goals of this module

  * be an essential/ideal companion for [wickedElements](https://github.com/WebReflection/wicked-elements#readme) and [hookedElements](https://github.com/WebReflection/hooked-elements#readme).
  * keep it as simple as possible, but not simpler
  * see if there is room for improvements in _lighterhtml_ whenever _uhtml_ simplifications allow to be ported there
