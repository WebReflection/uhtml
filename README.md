# <em>µ</em>html

[![Downloads](https://img.shields.io/npm/dm/uhtml.svg)](https://www.npmjs.com/package/uhtml) [![build status](https://github.com/WebReflection/uhtml/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/uhtml/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uhtml/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/uhtml?branch=main) [![CSP strict](https://webreflection.github.io/csp/strict.svg)](https://webreflection.github.io/csp/#-csp-strict)

![snow flake](./uhtml-head.jpg)

<sup>**Social Media Photo by [Andrii Ganzevych](https://unsplash.com/@odya_kun) on [Unsplash](https://unsplash.com/)**</sup>

_micro html_ is a _~2.5K_ [lighterhtml](https://github.com/WebReflection/lighterhtml#readme) subset to build declarative and reactive UI via template literals tags.

### 📣 Community Announcement

Please ask questions in the [dedicated discussions repository](https://github.com/WebReflection/discussions), to help the community around this project grow ♥

---

### V3.0 Update

  * removed IE and legacy Edge compatibility
  * simplified template parsing
  * cleaned up dependencies 

### V2.8 Update

  * added *µhandlers* [foreign](https://github.com/WebReflection/uhandlers#api) export to enable arbitrary attributes handling!

```js
import {html, foreign} from 'uhtml';

const handler = (node, name, value) => {
  // P, any, {data: 123}
  console.log(node, name, value);
  // return null/undefined to remove it
  return value.data;
};

html`<p any=${foreign(handler, {data: 123})}>foreign</p>`;
```

### V2.5 Update

  * an interpolated value, within a *DOM* element, can now be a `function`, enabling a world of *µhtml* extending possibilities, including [intents](https://github.com/WebReflection/uhtml-intents#readme), hence aligning the behavior with both *lighterhtml* and *hyperHTML*. That is: `<el>${callback}</el>`! The `callback` will be invoked with the *comment* pin/placeholder as unique argument, where its `parentNode` would be the element containing such comment, if needed, and its returned value will be passed along the same mechanism that resolves already all other cases.

### V2.4 Update

  * a new `?attribute=${value}` prefix, with a question mark, has landed, after [this long debate](https://github.com/WebReflection/discussions/discussions/13), and based to the fact *µhtml* never wants to be ambiguous. However, the mighty [lit-html](https://terodox.tech/lit-html-part-2/) put an end to the debate, disambiguating through a `?` question mark prefix, which explicits developers intents, and works well across browsers. So that's it: whenever you expect an attribute to be in, or out, use `?name=${value}` and win the day 🥳

### V2.2 Update

  * the `new.js` file has been renamed as `es.js` to align with other modules of mine that follow the same pattern.
  * this module now exports its very same utilities via `uhtml/async`, in order to automatically resolve asynchronous values passed along the template. Please note this means that exported `render`, `html`, and `svg` tags, are all asynchronous, hence these all return a promise.
  * the `async.js` file is now published too, compatible with ES2015+ browsers (no `async` / `await` used)

---

## How To

**Example**
```js
import {render, html, svg} from 'uhtml/async';

render(document.body, html`a${Promise.resolve('b')}c`);
```


### How To Use µhtml

Install the module via `npm i uhtml` and consume it as such:

```js
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

- - -

## API Documentation

Most information about _µhtml_ are written in the [documentation file](./DOCUMENTATION.md), but following you can read most essential details.

<details>
  <summary><strong>API Summary</strong></summary>
  <div>

The module exports the following functionalities:

  * a `render(where, what)` function to populate the `where` DOM node with `what` content, which can be a DOM node, or the returning value of `html` and `svg` tags. The `render` function returns the `where` DOM node itself.
  * a `html` template literal [tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates), to produce any sort of _HTML_ content.
  * a `svg` template literal [tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates), to produce any sort of _SVG_ content.
  * both `html` and `svg` implements a `.for(reference[, id])` template tag function for _keyed_ weak relationships within the node. Please don't overuse this feature, as 90% of the time is not necessary, and it could make the rendering slower than it should. Also, consider the `ref` attribute, in case a reference to the current node is needed at any time.
  * both `html` and `svg` implements a `.node` template tag function for *one-off* HTML or SVG creation. Please don't use `html.node` one off nodes within `render(...)` calls, as this utility exists to help creating fragments or nodes that should be *manually* added to the DOM, and *not* through `render` calls.

  </div>
</details>

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
        @click=${listener}
        onclick=${listener}
        class="${['container', 'user'].join(' ')}">
      Hello ${user.name}, feel free to edit this content.
    </p>
  </div>
`);
```

These are the rules to follow for attributes:

  * interpolated attributes don't require the usage of quotes, but these work either ways. `name=${value}` is OK, and so is `name="${value}"` or even `name='${value}'`
  * you cannot have sparse attribute interpolations: always use one interpolation to define each attribute that needs one, but never write things like `style="top:${x};left${y}"` as the parser will simply break with the error _bad template_. Use template literals within interpolations, if you want to obtain exact same result: ``style=${`top:${x};left${y}`}``
  * if the passed value is `null` or `undefined`, the attribute will be removed. If the value is something else, it will be set as is as value. If the attribute was previously removed, the same attribute will be placed back again. If the value is the same as it was before, nothing happens
  * if the attribute name starts with `on` or `@`, as example, `onclick=${...}` or `@click=${...}`, it will be set as listener. If the listener changes, the previous one will be automatically removed. If the listener is an `Array` like `[listener, {once:true}]`, the second entry of the array would be used as listener's options.
  * if the attribute starts with a `.` dot, as in `.setter=${value}`, the value will be passed directly to the element per each update. If such value is a known setter, either native elements or defined via Custom Elements, the setter will be invoked per each update, even if the value is the same
  * **new**: if the attribute starts with a `?` question mark, as in `?hidden=${value}`, the value will be toggled, accordingly with its *truthy*, or *falsy*, value.
  * if the attribute name is `ref`, as in `ref=${object}`, the `object.current` property will be assigned to the node, once this is rendered, and per each update. If a callback is passed instead, the callback will receive the node right away, same way [React ref](https://reactjs.org/docs/refs-and-the-dom.html) does. Please note that *conditional renders will not cleanup the reference*, if this is not assigned to the new node.
  * if the attribute name is `aria`, as in `aria=${object}`, aria attributes are applied to the node, including the `role` one.
  * if the attribute name is `.dataset`, as in `.dataset=${object}`, the `node.dataset` gets populated with all values.


Following an example of both `aria` and `data` cases:

```js
// the aria special case
html`<div aria=${{labelledBy: 'id', role: 'button'}} />`;
//=> <div aria-labelledby="id" role="button"></div>

// the data special case
html`<div .dataset=${{key: 'value', otherKey: 'otherValue'}} />`;
//=> <div data-key="value" data-other-key="otherValue"></div>
```

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

There are only few exceptional nodes that do not allow sparse content within themselves:

  * `<plaintext>${content}</plaintext>`, *deprecated*, yet it cannot contain comments
  * `<script>${content}</script>`, it can contain comments, but only whole text can be replaced
  * `<style>${content}</style>`, it cannot contain comments
  * `<textarea>${content}</textarea>`, same as above
  * `<title>${content}</title>`, same as above
  * `<xmp>${content}</xmp>`, same as above

Following an example on how to populate these nodes (wrong + right way):

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
  <summary><strong>About data purity</strong></summary>
  <div>

In more than one occasion [developers got bitten](https://github.com/WebReflection/uhtml/issues/41) by the fact _µhtml_ can produce some cryptic error when `null`, or empty content, is provided as interpolation/hole.

The problem is pretty simple:

  * don't loop / pass data that should *not* be render
  * sanitize data upfront instead of expecting this library to magically understand where, and how, such data should not be rendered

A basic example would be the following:

```js
const dirtyData = [
  {name: 'first'},
  null,
  {name: 'second'}
];

render(document.body, html`
  <ul>
    ${dirtyData.map(item => {
      // ⚠ this should not happen in the first place!
      if (!item)
        return null;
      return html`<li>${item.name}</li>`;
    })}
  </ul>
`);
```

There are at least two workarounds to consider:

  * use `data.filter(item => validate(item)).map(...)`
  * returns an actual node:

```js
  if (!item)
    return html`<!--ignore-->`;
```

Between these two workarounds, I believe the cleanest one is the former: sanitize data upfront!

The benefits are:

  * there are no unnecessary nodes in the DOM
  * there are no weird cases to consider
  * the mapping is pure, data in, node out

  </div>
</details>

<details>
  <summary><strong>About Custom Elements</strong></summary>
  <div>

Custom Elements are either brought you, in a simplified manner, via [µce](https://github.com/WebReflection/uce#readme) (_micro custom elements_), which is a 3K library based on _µhtml_, or via vanilla JS, as demoed in [WebComponents.dev](https://webcomponents.dev/edit/dP0G85PrChRv7CsAvGXb).

  </div>
</details>

<details>
  <summary><strong>Compatibility</strong></summary>
  <div>

This module works in IE11, Edge, and every other Desktop to Mobile browser, including KaiOS.

  </div>
</details>

- - -



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
  * both `aria=${object}`, and  `ref=${...}` special attributes work same as _lighterhtml_
  * the `.dataset=${object}` helper work the same as _lighterhtml_
  * the `.property=${...}` *direct setter* is still available
  * self closing nodes are also supported, go wild with `<custom-elements />` or even `<span />`
  * the wire parsing logic has been simplified even more, resulting in slightly [better bootstrap and update performance](https://github.com/krausest/js-framework-benchmark/pull/698)
  * it's half of _lighterhtml_ production size, mostly because ...
  * there are no 3rd parts dependencies, except for [µparser](https://github.com/WebReflection/uparser#readme), [µdomdiff](https://github.com/WebReflection/udomdiff#readme), and for `@ungap/create-content`, needed only for IE11, but removable via [@ungap/degap](https://github.com/ungap/degap#readme), same way I've done it [here](./rollup/new.config.js), or [babel-plugin-remove-ungap](https://github.com/cfware/babel-plugin-remove-ungap#readme). The compressed final size difference is just around _~0.2K_ though.

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

### V2 Breaking Change

The recently introduced `data` helper [could conflict](https://github.com/WebReflection/uhtml/issues/14) with some node such as `<object>`, hence it has been replaced by the `.dataset` utility. Since `element.dataset = object` is an invalid operation, the sugar to simplify `data-` attributes is now never ambiguous and future-proof: `<element .dataset=${...} />` it is.

