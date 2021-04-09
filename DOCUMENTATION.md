# What Is µhtml <sup><sub>(micro html)</sub></sup> And How Does It Work

![snow flake](./uhtml-head.jpg)

A _getting started_ guide with most common questions and answers, covered by live examples.

- - -


### A Brief Introduction

While _µhtml_, on the surface, is a library that resemble some naive usage of [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML), it's actually far away from being an `innerHTML` replacement, as it's capable of handling events listeners, special and normal attributes, plus various kind of content, that will be properly parsed, normalized, and repeatedly updated at light speed, without trashing the previous content like `innerHTML` would do per each operation.

```js
render(element, html`
  <h1 onclick=${() => console.log('🎉')}>
    Welcome to <em>µhtml</em> 👋
  </h1>
`);
```

As summary: _µhtml_ is the tiniest declarative UI library of the Web, it's safe by default, and it's based on standard JS templates literals features.



## Use Cases

Every time you use "_vanilla JS_" to deal with the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model), you inevitably end up repeating over and over quite verbose code, and always to obtain the same result.

Following a classic `<button>` element with a click handler and some state:

```js
const buttonState = {disabled: false, text: 'Click Me'};
const {disabled, text} = buttonState;
const {log} = console;

const button = document.createElement('button');
button.className = "clickable";
button.disabled = disabled;
button.textContent = text;
button.addEventListener('click', () => log('clicked'));

document.body.appendChild(button);
```

If this code looks familiar to you, it is highly possible your files contain most common helpers all over the place, such as `const create = name => document.createElement(name)` or similar.

All those micro utilities are cool and tiny, but the question is: "_can they be declarative too?_"

Following an example to obtain exact same result via _µhtml_, also [live on codepen](https://codepen.io/WebReflection/pen/jOPLBMm?editors=0010):

```js
import {render, html} from '//unpkg.com/uhtml?module';

const buttonState = {disabled: false, text: 'Click Me'};
const {disabled, text} = buttonState;
const {log} = console;

render(document.body, html`
  <button class="clickable"
    onclick=${() => log('clicked')}
    .disabled=${disabled}
  >
    ${text}
  </button>
`);
```

As you can see, with _µhtml_ you can declare UI in a similar way you would do with writing regular _HTML_, but with few extra essential features that makes it create DOM elements fun again:

  * event listeners are automatically handled, so that passing even a new function each time is ok, as the previous one, if different, is always removed. No more duplicated listeners by accident 🎉
  * attributes with a special meaning in the JS world, like `disabled`, which can be directly accessed as _getters_ or _setters_, like we did before via `button.disabled = value`, instead of using a non semantic `button.setAttribute("disabled", "")` to set it disabled, and `button.removeAttribute("disabled")` to enabled it back, can be prefixed with a `.`, as it's done in `.disabled=${value}`
  * any other regular attribute can be used too, abstracting away the tedious `el.setAttribute(...)` dance, with the ability to remove attributes by simply passing `null` or `undefined` instead of an actual value, so that you could write `disabled=${value || null}` if using the `.` prefix is not your cup of tea
  * attributes that start with `on...` will be set as listeners right away, removing any previous listener if different from the one passed along. In this case, the `onclick=${() => ...}` arrow function would be a new listener to re-add each time
  * the content is always safe to pass as _interpolation_ value, and there's no way to inject _HTML_ by accident

Bear in mind, the content can also be another `html` chunk, repeatable in lists too, as the following example, also [live in codepen](https://codepen.io/WebReflection/pen/vYOJxpE?editors=0010) shows:

```js
const items = [
  {text: 'Web Development'},
  {text: 'Is Soo Cool'},
];

render(document.body, html`
  <ul>
    ${items.map(
      ({text}, i) => html`<li class=${'item' + i}>${text}</li>`
    )}
  </ul>
`);
```

As simple as it looks, you might wonder what kind of _magic_ is involved behind the scene, but the good news is that ...


#### It's 100% JavaScript Standard: No Tooling Needed 🦄

The only real _magic_ in _µhtml_ is provided by an ECMAScript 2015 feature, known as [Tagged Templates Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates).

When you prefix any template literal string with a function, without needing to invoke such function, the JavaScript engine executes these simple, but extremely useful, steps:

```js
const tag = (template, ...values) => {
  // ℹ the function is invoked with these arguments
  // a *unique* array of strings around interpolations
  console.log(`Template: ${template}`);
  // and all the interpolations values a part
  console.log(`Values: ${values}`);
}

// ⚠ it's tag`...`, not tag()`...`
tag`This is a ${'template literals'} tagged ${'test'}`;

// Template: "This is a ", " tagged ", ""
// Values: "template literals", "test"
```

The *unique* part of the equation means that any template literal is always the same array, as long as it comes from the same scope, and the very same part of the script, example:

```js
const set = new WeakSet;
const tag = template => {
  if (set.has(template))
    console.log('known template');
  else {
    set.add(template);
    console.log('new template');
  }
};

const scoped = () => tag`test`;

tag`test`;  // new template
tag`test`;  // new template
scoped();   // new template
scoped();   // known template
scoped();   // known template
tag`test`;  // new template
```

This is the fundamental concept that enables _µhtml_ to be smart about never parsing more than once the exact same template, and it perfectly suits the "_components as callback_" pattern too:

```js
// an essential Button component example
const Button = (text, className) => html`
  <button class=${className}>${text}</button>
`;

// render as many buttons as needed
render(document.body, html`
  Let's put some button live:
  ${Button('first', 'first')} <br>
  ${Button('second', '')}     <br>
  ${Button('third', 'last')}
`);
```


#### How Does The Parsing Work ?

This part is extremely technical and likely irrelevant for a getting started page, but if you are curious to understand what happens behind the scene, you can find all steps in here.

<details>
  <summary><strong>Internal Parsing Steps</strong></summary>

Taking the essential `Button(text, className)` component example, this is how _µhtml_ operates:

  * if the `<button class=${...}>${...}</button>` template is unknown:
    * loop over all template's chunks and perform these checks:
      * if the end of the chunk is `name="`, or `name='`, or `name=`, and there is an opened `<element ...` before:
        * substitute the attribute name with a custom `µhtml${index}="${name}"`
      * if the chunk wasn't an attribute, and the `index` of the loop is not the last one:
        * append an `<!--µhtml${index}-->` comment to the layout
      * otherwise append the chunk as is, it's the closing part
    * normalize all self-closing, [not void](https://developer.mozilla.org/en-US/docs/Glossary/empty_element), elements, so that the resulting joined layout contains `<span></span>` or `<custom-element></custom-element>` instead of `<span />` or `<custom-element />`, which is another handy _µhtml_ feature 😉
    * let the browser engine parse the final layout through the native [Content Template element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) and traverse it in search of all comments and attributes that are only related to _µhtml_
    * per each crawled node, using an `index` that goes from _zero_ to the length of passed values, as these are those to map and update in the future:
      * if the node is a _comment_, and its text content is exactly `µhtml${index}`, map recursively the position of that node to retrieve it later on, and move the `index` forward
      * if the node is not a comment:
        * while the node has an attribute named `µhtml${index}`, map the attribute value, which is the original name, and map the node to retrieve it later on, then move the `index` forward
      * if the node is a `style` or a `textarea`, and it contains `<!--µhtml${index}-->`, 'cause these elements cannot have comments in their content, map the node and flag it as "_text content only_", then move the `index` forward
      * if there are no more nodes to crawl, and the `index` haven't reached the loop `length`, throw an error passing the _template_, as something definitively went wrong
    * at this point we have a unique _template_ reference, and a list of nodes to retrieve and manipulate, every time new values are passed along. Per each information, assign to each mapped node the operation to perform whenever new values are passed around: handle _content_, _attributes_, or _text_ only.
    * weakly reference all these information with the _template_, and keep following these steps
  * retrieve the details previously stored regarding this _template_
  * verify in which part of the rendering stack we are, and relate that stack to the current set of details
  * if the stack is not already known:
    * clone the fragment related to this template
    * retrieve all nodes via the paths previously stored
    * map each update operation to that path
    * relate these information with the current execution stack to avoid repeating this next time, keep going with the next step
  * per each update available for this part of the stack, pass each interpolated value along, so that _content_, _attributes_, or _text content_ previously mapped, can decide what to do with the new value
  * if the new value is the same as it was before, do nothing, otherwise update the attribute, text content, or generic content of the node, using in this latter case `<!--µhtml${index}-->` comment node reference, to keep updates confined _before_ that portion of the tree 

As result, each `Button(text, className)` component will simply invoke just two callbacks, where the first one will update its `class` attribute, while the second one will update its `textContent` value, and in both cases, only if different from the previous call.

This might not look super useful for "_one-off_" created elements, but it's a performance game changer when the UI is frequently updated, as in lists, news feeds, chats, games, etc.

I also understand this list of steps might be "_a bit_" overwhelming, but these describe pretty much everything that happens in the [rabbit.js](./esm/rabbit.js) file, which also takes care of the whole "_execution stack dance_", which enables nested rendered, with smart diff, and through the [µdomdiff](https://github.com/WebReflection/udomdiff#readme) module.

It's also worth mentioning I've been fine-tuning all these steps since the beginning of 2017, so maybe it was unnecessary to describe them all, but "_the nitty-gritty_" at least is now written down somewhere 😅

</details>



## API In Details

The module itself exports these three functions: `render`, `html`, and `svg`.


### The `render(where, what)` Utility

This function purpose is to update the content of the _where_ DOM node, which could be a custom element, or any other node that can contain other nodes.

```js
render(
  // where to render
  document.querySelector('#container'),
  // what to render
  html`content` || svg`content` || Node || callback
);

// Custom Element basic example
class MyComponent extends HTMLElement {
  connectedCallback() {
    // render content, it could also be
    // a Shadow root node
    render(this, html`My CE Content`);
  }
}
```

If the value of _what_ is just a DOM node, and it's different from the one rendered before, it will clear the container and append it.

If the value of _what_ is a callback, it will invoke it and use its result as content. Such result can be a _Node_, or the returning value of `html` or `svg` tags.


### The `html` and `svg` Tags

As the name would suggest, `html` is the tag to use when _HTML_ content is meant to be created, while `svg` should be used to created valid _SVG_ nodes.

Beside this essential difference, both tags work in the exact same way, and both tags provide extra tags, such as `.node` and `.for(ref[, id])`.


#### The `.node` Tag

Both `html.node` and `svg.node` tags create a fresh new version of that specified content and return it.

```js
// use node to generate new DOM content
const div = html.node`<div />`;

// the div is 100% a node
div.textContent = 'some µhtml content';
document.body.appendChild(div);
```

It is also possible to create multiple sibling nodes at once:

```js
const fragment = html.node`
  <span>first</span>
  <span>second</span>
  <span>third</span>
`;

document.body.appendChild(fragment);
```

The only special feature of fragments created via `html.node` or `svg.node`, is that these will always return `fragment.firstChild` and `fragment.lastChild` nodes, even after being appended live, where native regular fragments would instead lose all their children.

_µhtml_ fragments have also two special methods: `valueOf()`, that allow you to move all nodes initially assigned to the fragment somewhere else, or `remove()`, which would remove all nodes initially assigned in one shot.

```js
// using the previous code example, then ...

document.body.removeChild(fragment.remove());

setTimeout(() => document.body.appendChild(fragment.valueOf()));
```

It is not super important to understand how to use fragments by hand, but these features are essential for the _µhtml_ DOM diffing engine called _[µdomdiff](https://github.com/WebReflection/udomdiff#readme)_, which is capable of updating, removing, or moving fragments around as needed.



#### The `.for(ref[, id])` Tag

If you are familiar with the _keyed_ and _non-keyed_ rendering concepts, this method allows just that: you can reference a specific node, and its optional id, to any object. By default, _µhtml_ uses a rendering stack to provide automatically, to each interpolation, and "_always same index_" during updates.

```js
// non-keyed rendered view
const update = (items) => {
  render(
    document.querySelector('.list-items'),
    html`
    <ul>
      ${items.map(
        ({id, name}) =>
          html`<li data-id=${id}>${name}</li>`
      )}
    </ul>`
  );
};

const items = [
  {id: 1, name: 'Article X'},
  {id: 2, name: 'Article Y'},
  {id: 3, name: 'Article Z'},
];

update(items);
```

While most of the time it's OK to use _non-keyed_ renders, there could be side effects when, instead of simple nodes, you have Custom Elements in the list, or you have special mutation observers somehow attached to the inner nodes.

In these cases, whenever the list changes, nodes that were previously there will simply be updated with new content, attributes, and the rest, but if the Custom Element had an `attributeChangedCallback`, as example, that does something expensive, such as fetching new data, as example, this callback will be inevitably called multiple times every time an article changes position in the list, or the list is sorted, it shrinks, or it expands.

But fear not, it is possible to relate a specific node through the tag returned by `.for(...)`:


```js
// *keyed* rendered view
const update = (items) => {
  const ref = document.querySelector('.list-items');
  render(ref, html`
    <ul>
      ${items.map(
        ({id, name}) =>
          html.for(ref, id)`<li data-id=${id}>${name}</li>`
      )}
    </ul>`
  );
};

const items = [
  {id: 1, name: 'Article X'},
  {id: 2, name: 'Article Y'},
  {id: 3, name: 'Article Z'},
];

update(items);
```

With latest example, [live in codepen](https://codepen.io/WebReflection/pen/NWqvmJg?editors=0010), you can follow nodes moving around without ever changing any of their attributes or content, and this is how, and why, _keyed_ renders can be very important.

## API: Attributes

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
  * you cannot have sparse attribute interpolations: always use one interpolation to define each attribute that needs one, but never write things like `style="top:${x};left:${y}"` as the parser will simply break with the error _bad template_. Use template literals within interpolations, if you want to obtain exact same result: ``style=${`top:${x};left:${y}`}``
  * if the passed value is `null` or `undefined`, the attribute will be removed. If the value is something else, it will be set as is as value. If the attribute was previously removed, the same attribute will be placed back again. If the value is the same as it was before, nothing happens
  * if the attribute name starts with `on`, as example, `onclick=${...}`, it will be set as listener. If the listener changes, the previous one will be automatically removed. If the listener is an `Array` like `[listener, {once:true}]`, the second entry of the array would be used as listener's options.
  * if the attribute starts with a `.` dot, as in `.setter=${value}`, the value will be passed directly to the element per each update. If such value is a known setter, either native elements or defined via Custom Elements, the setter will be invoked per each update, even if the value is the same
  * **new**: if the attribute starts with a `?` question mark, as in `?hidden=${value}`, the value will be toggled, accordingly with its *truthy*, or *falsy*, value.
  * if the attribute name is `ref`, as in `ref=${object}`, the `object.current` property will be assigned to the node, once this is rendered, and per each update. If a callback is passed instead, the callback will receive the node right away, same way [React ref](https://reactjs.org/docs/refs-and-the-dom.html) does.
  * if the attribute name is `aria`, as in `aria=${object}`, aria attributes are applied to the node, including the `role` one.
  * if the attribute name is `.dataset`, as in `.dataset=${object}`, the `node.dataset` gets populated with all values.


Following an example of both `aria` and `.dataset` cases:

```js
// the aria special case
html`<div aria=${{labelledBy: 'id', role: 'button'}} />`;
//=> <div aria-labelledby="id" role="button"></div>

// the data special case
html`<div .dataset=${{key: 'value', otherKey: 'otherValue'}} />`;
//=> <div data-key="value" data-other-key="otherValue"></div>
```

## API: HTML/SVG Content

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

The only special case are _Array_ of either primitives, or returned values from `html` or `svg`, and since *2.5* _Function_, invoked and resolved after invoke.


```js
render(document.body, html`
  <ul>
    <li>This is ${'primitive'}</li>
    <li>This is joined as primitives: ${[1, 2, 3]}</li>
    <li>This is a callback: ${utility}</li>
    ${lines.map((text, i) => html`
      <li>Row ${i} with content: ${text}</li>
    `)}
  </ul>
`);
```

## API: Rendering

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
