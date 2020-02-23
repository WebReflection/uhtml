# µhtml v1

<sup>**Social Media Photo by [Andrii Ganzevych](https://unsplash.com/@odya_kun) on [Unsplash](https://unsplash.com/)**</sup>

A _~2.5K_ HTML/SVG render based on parts of [lighterhtml](https://github.com/WebReflection/lighterhtml#readme) and [domdiff](https://github.com/WebReflection/domdiff#readme), without any extra cruft.


## How To Use µhtml

Install the module via `npm i uhtml` and consume it as such:

```js
// as ECMAScript standard module
import {render, html, svg} from 'uhtml';

// or as CommonJS module
// const {render, html, svg} = require('uhtml');

render(document.body, html`<h1>Hello 👋 µHTML</h1>`);
```

Alternatively you can use a CDN such as _unpkg_:
```html
<script src="https://unpkg.com/uhtml"></script>
<script>
  const {render, html, svg} = uhtml;
</script>
```

**[Live Demo](https://codepen.io/WebReflection/pen/bGdBjjL?editors=0010)**


## API Usage

Following a detailed information about _µhtml_ usage and constrains.

<details>
  <summary><strong>About Attributes</strong></summary>
  <div>

Any element can have one or more attribute, either interpolated or not.

```js
render(document.body, html`
  <div id="main"
        class=${`content ${extra}`}
        data-fancy=${fancy}>
    <p contenteditable=${editable}
        onclick=${listener}
        class="${['container', 'user'].join(' ')}">
      Hello ${user.name}, feel free to edit this content.
    </p>
  </div>
`);
```

These are the rules to follow for attributes:

  * interpolated attributes don't require the usage of quotes, but these work either ways. `name=${value}` is OK, and so is `name="${value}"` or even `name='${value}'`
  * you cannot have sparse attribute interpolations: always use one interpolation to define each attribute that needs one, but never write things like `style="top:${x};left${y}"` as the parser will simply breaks with an error _bad template_. Use template literals within interpolations, if you want to obtain exact same result: ``style=${`top:${x};left${y}`}``
  * if the passed value is `null` or `undefined`, the attribute will be removed. If the value is something else, it will be set as is as value. If the attribute was previously removed, the same attribute will be placed back again. If the value is the same as it was before, nothing happens
  * if the attribute name starts with `on`, as example, `onclick=${...}`, it will be set as listener. If the listener changes, the previous one will be automatically removed
  * if the attribute starts with a `.` dot, as in `.setter=${value}`, the value will be passed directly to the element per each update. If such value is a known setter, either native elements or defined via Custom Elements, the setter will be invoked per each update, even if the value is the same
  * if the attribute name is `ref`, as in `ref=${object}`, the `object.current` property will be assigned to the node, once this is rendered, and per each update

  </div>
</details>

<details>
  <summary><strong>About HTML/SVG Content</strong></summary>
  <div>

It is possible to place interpolations within any kind of node, and together with text or other nodes too.

```js
render(document.body, html`
  <table>
    ${lines.map((text, i) => html`
      <tr><td>Row ${i} with text: ${text}</td></tr>
    `)}
  </table>
`);
```

There are only two exceptional nodes that do not allow sparse content within themselves: the `style` element, and the `textarea` one.

```js
// DON'T DO THIS
render(document.body, html`
  <style>
    body { font-size: ${fontSize}; }
  </style>
  <textarea>
    Write here ${user.name}
  </textarea>
`);

// DO THIS INSTEAD
render(document.body, html`
  <style>
  ${`
    body { font-size: ${fontSize}; }
  `}
  </style>
  <textarea>
  ${`
    Write here ${user.name}
  `}
  </textarea>
`);
```

Beside nodes where the content will be inevitable just text, like it is for `style` or `textarea`, as example, every other interpolation can contain primitives, as strings, numbers, or even booleans, or the returned value of `html` or `svg`, plus regular DOM nodes.

The only special case are _Array_ of either primitives, or returned values from `html` or `svg`.


```js
render(document.body, html`
  <ul>
    <li>This is ${'primitive'}</li>
    <li>This is joined as primitives: ${[1, 2, 3]}</li>
    ${lines.map((text, i) => html`
      <li>Row ${i} with content: ${text}</li>
    `)}
  </ul>
`);
```

  </div>
</details>

<details>
  <summary><strong>About Rendering Content</strong></summary>
  <div>

Since each interpolation accepts DOM nodes too, it is possible to render within a render.


```js
const Button = selector => {
  const button = document.querySelector(selector);
  return count => render(button, html`Clicks: ${count}`);
};

const Clicker = selector => {
  const button = Button(selector);
  return function update(count) {
    return render(document.body, html`
      <div onclick=${() => update(++count)}>
        Click again:
        ${button(count)}
      </div>
    `);
  };
}

const clicker = Clicker('#btn-clicker');
clicker(0);
```

  </div>
</details>


## API & Compatibility

This module works in IE11, Edge, and every other Desktop to Mobile browser.

The module exports the following functionalities:

  * a `render(where, what)` function to populate the `where` DOM node with `what` content, which can be a DOM node, or the returning value of `html` and `svg` tags. The `render` function returns the `where` DOM node itself.
  * a `html` template literal [tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates), to produce any sort of _HTML_ content
  * a `svg` template literal [tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates), to produce any sort of _SVG_ content


<hr>


### µhtml vs lighterhtml

Following a list of points to consider when choosing _µhtml_ instead of _lighterhtml_ (or vice-versa).


#### Differently from lighterhtml

  * there are **no sparse attributes**, each attribute *must* have a single interpolated value: `attribute=${value}` is OK, `attribute="${a}${b}"` is not, and `attribute="some ${'partial'}"` is not allowed neither.
  * there are no keyed helpers: no `html.for(...)` and no `html.node`. Use the `render(...)`, `html` or `svg`, and don't worry about keys
  * the interpolations are simple: primitive, or array of primitives, and nodes, or array of nodes.
  * the `style` attribute is not special at all: if you want to pass objects there, please transform these as you prefer.
  * the _domdiff_ rip-off has been simplified to bail out sooner than the original module, performing extremely well for a reduced, but common, set of use cases: prepend, append, remove one to many, and replace one with many. Unless you keep shuffling all nodes in a list all the time, you won't likely notice any real-world difference.
  * the `template` argument is not normalized. If you target browsers with issue with such argument, please be sure you transpile your code with latest _Babel_ before shipping to production
  * no _domtagger_ whatsoever, you can't change the current behavior of the library in any way


#### Similarly or better than lighterhtml

  * nested `html` and `svg` are allowed like in _lighterhtml_. `v0` didn't allow that, hence it was more "_surprise prone_". _uhtml_ in that sense is more like a drop-in replacement for _lighterhtml_, and vice-versa
  * the `ref=${...}` attribute works same as _lighterhtml_, enabling hooks, or _React_ style, out of the box
  * the `.property=${...}` *direct setter* is still available, although _uhtml_ should *not* suffer any of the IE11/Edge issues, as the parsing is done differently 🎉
  * self closing nodes are also supported, go wild with `<custom-elements />` or even `<span />`
  * the wire parsing logic has been simplified even more, resulting in slightly [better bootstrap and update performance](https://github.com/krausest/js-framework-benchmark/pull/698)
  * it's half of _lighterhtml_ production size, mostly because ...
  * there are no 3rd parts dependencies, except for `@ungap/create-content`, needed for IE11, but removable via [@ungap/degap](https://github.com/ungap/degap#readme), same way I've done it [here](./rollup/new.config.js), or [babel-plugin-remove-ungap](https://github.com/cfware/babel-plugin-remove-ungap#readme). The compressed final size difference is just _~0.2K_ though.


### µhtml goals

  * be an essential/ideal companion for [wickedElements](https://github.com/WebReflection/wicked-elements#readme), [hookedElements](https://github.com/WebReflection/hooked-elements#readme), or any third part that would like a _lighterhtml_ like API, without the extra weight
  * keep it as simple as possible, but not simpler
  * see if there is room for improvements in _lighterhtml_ whenever _uhtml_ simplifications allow to be ported there


### Where is v0 ?

The previous attempt to make it essential resulted ... well, too essential, but it's still [usable](./V0.md) via `npm i uhtml@0`.
