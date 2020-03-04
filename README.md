# µhtml

![snow flake](./uhtml-head.jpg)

<sup>**Social Media Photo by [Andrii Ganzevych](https://unsplash.com/@odya_kun) on [Unsplash](https://unsplash.com/)**</sup>

_micro html_ is a _~2.5K_ [lighterhtml](https://github.com/WebReflection/lighterhtml#readme) subset to build declarative and reactive UI via template literals tags.



### How To Use µhtml

Install the module via `npm i uhtml` and consume it as such:

```js
// as ECMAScript standard module
import {render, html, svg} from 'uhtml';

// const {render, html, svg} = require('uhtml');
render(document.body, html`<h1>Hello 👋 µhtml</h1>`);
```

Alternatively you can use a CDN such as _unpkg_, as shown in [this demo](https://codepen.io/WebReflection/pen/bGdBjjL?editors=0010).
```html
<script src="https://unpkg.com/uhtml">/* global uhtml */</script>
<!-- or -->
<script type="module">
import {render, html, svg} from 'https://unpkg.com/uhtml?module';
</script>
```



### API Summary & Compatibility

This module works in IE11, Edge, and every other Desktop to Mobile browser, including KaiOS.

The module exports the following functionalities:

  * a `render(where, what)` function to populate the `where` DOM node with `what` content, which can be a DOM node, or the returning value of `html` and `svg` tags. The `render` function returns the `where` DOM node itself.
  * a `html` template literal [tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates), to produce any sort of _HTML_ content
  * a `svg` template literal [tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates), to produce any sort of _SVG_ content
  * both `html` and `svg` implements a `.for(reference[, id])` template tag function for _keyed_ weak relationships within the node
  * both `html` and `svg` implements a `.node` template tag function for one-off HTML or SVG creation

<hr>



## API Documentation

Most information about _µhtml_ are written in the [documentation file](./DOCUMENTATION.md), but following you can read most essential details.

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

Beside nodes where the content will be inevitably just text, like it is for `style` or `textarea`, as example, every other interpolation can contain primitives, as strings, numbers, or even booleans, or the returned value of `html` or `svg`, plus regular DOM nodes.

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

The second `what` argument of the `render(where, what)` signature can be either a function, which returning value will be used to populate the content, the result of `html` or `svg` tags, or a DOM node, so that it is possible to render within a render.


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

<details>
  <summary><strong>About keyed renders</strong></summary>
  <div>

_µhtml_ `html` and `svg` tags implement exact same API offered by _lighterhtml_.

This means that both `html.for(reference[, id])` and `svg.for(reference[, id])` will weakly relate the node with the reference, and an optional unique id, instead of using its internal auto-referenced algorithm.

```js
render(document.body, html`
  <ul>
    ${items.map(item => html.for(item)`
      <li>Keyed row with content: ${item.text}</li>
    `)}
  </ul>
`);
```

  </div>
</details>

<details>
  <summary><strong>About Custom Elements</strong></summary>
  <div>

Custom Elements are either brought you, in a simplified manner, via [µce](https://github.com/WebReflection/uce#readme) (_micro custom elements_), which is a 3K library based on _µhtml_, or via vanilla JS, as demoed in [WebComponents.dev](https://webcomponents.dev/edit/dP0G85PrChRv7CsAvGXb).

  </div>
</details>

<hr>



### µhtml vs [lighterhtml](https://github.com/WebReflection/lighterhtml#readme)

You could read an [exhaustive summary of features differences](https://gist.github.com/WebReflection/761052d6dae7c8207d2fcba7cdede295#dom-engines-features-comparison), but the first thing to keep in mind, is that _lighterhtml_ is at pair with _uhtml_ features, but not vice-versa, meaning if you need anything more, you can always switch to _lighterhtml_ later on, and without changing a single line of code.

Following a list of other points to consider when choosing _µhtml_ instead of _lighterhtml_ (or vice-versa).

<details>
  <summary><strong>Differently from <em>lighterhtml</em></strong></summary>
  <div>

  * there are **no sparse attributes**, each attribute *must* have a single interpolated value: `attribute=${value}` is OK, `attribute="${a}${b}"` is not, and `attribute="some ${'partial'}"` is not allowed neither.
  * the interpolations are simple: primitive, or array of primitives, and nodes, or array of nodes.
  * the `style` attribute is not special at all: if you want to pass objects there, please transform these as you prefer.
  * the _domdiff_ has been replaced with [udomdiff](https://github.com/WebReflection/udomdiff#readme), with a new blazing fast and super small diffing algorithm written from scratch
  * the `template` argument is not normalized. If you target browsers with issue with such argument, please be sure you transpile your code with latest _Babel_ before shipping to production
  * no _domtagger_ whatsoever, you can't change the current behavior of the library in any way

  </div>
</details>

<details>
  <summary><strong>Similarly or better than <em>lighterhtml</em></strong></summary>
  <div>

  * _uhtml_ should *not* suffer any of the IE11/Edge issues, or invalid SVG attributes warnings, as the parsing is done differently 🎉
  * nested `html` and `svg` are allowed like in _lighterhtml_. The version `0` of this library didn't allow that, hence it was more "_surprise prone_". _uhtml_ in that sense is more like a drop-in replacement for _lighterhtml_, and vice-versa
  * keyed results via `htmlfor(...)` or `svg.for(...)`, as well as one-off node creation, via `html.node` or `svg.node` are the same found in _lighterhtml_
  * the `ref=${...}` attribute works same as _lighterhtml_, enabling hooks, or _React_ style, out of the box
  * the `.property=${...}` *direct setter* is still available
  * self closing nodes are also supported, go wild with `<custom-elements />` or even `<span />`
  * the wire parsing logic has been simplified even more, resulting in slightly [better bootstrap and update performance](https://github.com/krausest/js-framework-benchmark/pull/698)
  * it's half of _lighterhtml_ production size, mostly because ...
  * there are no 3rd parts dependencies, except for `@ungap/create-content`, needed for IE11, but removable via [@ungap/degap](https://github.com/ungap/degap#readme), same way I've done it [here](./rollup/new.config.js), or [babel-plugin-remove-ungap](https://github.com/cfware/babel-plugin-remove-ungap#readme). The compressed final size difference is just _~0.2K_ though.

  </div>
</details>

<details>
  <summary><strong>µhtml library goals</strong></summary>
  <div>

  * be an essential/ideal companion for [wickedElements](https://github.com/WebReflection/wicked-elements#readme), [hookedElements](https://github.com/WebReflection/hooked-elements#readme), or any third part that would like a _lighterhtml_ like API, without the extra weight
  * keep it as simple as possible, but not simpler
  * see if there is room for improvements in _lighterhtml_ whenever _uhtml_ simplifications allow to be ported there

  </div>
</details>
