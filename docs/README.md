[![Downloads](https://img.shields.io/npm/dm/uhtml.svg)](https://www.npmjs.com/package/uhtml) [![build status](https://github.com/WebReflection/uhtml/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/uhtml/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uhtml/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/uhtml?branch=main) [![CSP strict](https://webreflection.github.io/csp/strict.svg)](https://webreflection.github.io/csp/#-csp-strict)

![snow flake](./uhtml-head.jpg)

*[uhtml](https://github.com/WebReflection/uhtml)* (micro *µ* html) is one of the smallest, fastest, memory consumption friendly, yet zero-tools based, library to safely help creating or manipulating DOM content.

It is entirely Web standards based and it adds just the minimal amount of *spices* to the templates literals it's able to understand and optimized for either repeated updates or one-off operations.

This page describes, without going into too many details, all the features delivered via this module which is roughly 2.5K once minified and compressed, or even bundled within your project.

### Content

  * All *µhtml* features [in a nutshell](https://webreflection.github.io/uhtml/#in-a-nutshell)
  * Some [Frequently Asked Question](https://webreflection.github.io/uhtml/#faq)

- - -

## In a nutshell

The following code is an abstract representation of all features delivered by *uhtml* and it's explained in details preserving the same order.

You can skip to details directly via the following links:

  * [render](./#render) - to reveal tags content
  * [tag](./#tag) - to create content
  * [boolean](./#boolean) - to toggle attributes
  * [attribute](./#attribute) - to assign attributes
  * [direct](./#direct) - to assign properties
  * [listener](./#listener) - to add listeners
  * [list](./#list) - to grow or shrink a list of nodes
  * [self closing](./#self-closing) - to simplify life
  * [hole](./#hole) - to represent generic content
  * [reactivity](./#reactivity) - to understand *uhtml/reactive*

```
   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ render
   ┃                    ┏━━━━━━━━━━━━━━━━━━━ tag
render(document.body, html`
  <div class=${className} ?hidden=${!show}>
         ┃                    ┗━━━━━━━━━━━━━ boolean
         ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ attribute
    <ul @click=${sort} .sort=${order}>
           ┃             ┗━━━━━━━━━━━━━━━━━━ direct
           ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ listener
      ${[...listItems]}
        ┗━━━━━━┳━━━━━┛
               ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━ list
    </ul>
    <my-element /> ━━━━━━━━━━━━━━━━━━━━━━━━━ self closing
    <p>
      ${show ? `${order} results` : null}
       ┗━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┛
                      ┗━━━━━━━━━━━━━━━━━━━━━ hole
    </p>
  </div>
`);
```

- - -

### render

<details open>
  <summary><small>details</small></summary>
  <div markdown=1>

To reveal template literal tags within a specific element we need a helper which goal is to understand if the
content to render was already known but also, in case it's a *hole*, to orchestrate a "*smart dance*" to render such content.

The `render` exported helper is a function that, given a node *where* to render such content, returns that very
same node with the content in the right place, content returned by the *tag* used to render.

```js
import { render, html } from 'uhtml';

const whom = 'World';

// direct rendering
render(document.body, html`Hello ${whom}!`);

// using a function (implicitly invoked by render)
render(document.body, () => html`Hello ${whom}!`);

/** results into
<body>
  Hello World!
<body>
 */
```

  </div>
</details>


### tag

<details open>
  <summary><small>details</small></summary>
  <div markdown=1>

A template literal tag can be either the `html` or the `svg` one, both directly exported from this module:

```js
import { html, svg } from 'uhtml';

html`<button />`;
svg`<circle />`;
```

Used directly from both default and `uhtml/keyed` variant, the returning value will not be a DOM Node, rather a *Hole* representation of that node once rendered,
unless the import was from `uhtml/node`, which instead creates once DOM nodes hence it could be used with any library or framework able to handle these.

The `uhtml/keyed` export though also allows to create tags related to a specific key, where the key is a `ref` / `key` pair and it guarantees the resulting node will always be the same,
given the same *ref* and the same *id*.

```js
import { htmlFor, svgFor } from 'uhtml/keyed';

const Button = key => {
  const html = htmlFor(Button, key);
  return html`<button />`;
};

const Circle = key => {
  const svg = svgFor(Circle, key);
  return svg`<circle />`;
};

Button('unique-id') === Button('unique-id');
Circle('unique-id') === Circle('unique-id');
```

In *keyed* cases, the result will always be the same node and not a *Hole*.

```js
import { htmlFor } from 'uhtml/keyed';

const Button = key => {
  const html = htmlFor(Button, key);
  return html`<button />`;
};

document.body.append(Button(0));
```

#### Keyed or not ?

To some extend, *uhtml* is *keyed by default*, meaning that given the same template all elements in that template
will always be created or referenced once in the stack.

In most common use cases then, using a *keyed* approach might just be overkill, unless you rely on the fact a node must be the same
whenever its attributes or content changes, as opposite of being the previous node with updated values within it.

The use cases that best represent this need are:

  * a list items or table rows that somehow are referenced elsewhere for other purposes and could be sorted or swapped and their identity should be preserved
  * same node moved elsewhere under some condition, with some expensive computed state attached to it

There are really not many other edge cases to prefer *keyed* over non keyed, but whenever you feel like *keyed* would be better, `uhtml/keyed` will provide
that extra feature, without compromising too much performance or bundle size (it's just ~0.1K increase and very little extra logic involved).

  </div>
</details>


### boolean

<details open>
  <summary><small>details</small></summary>
  <div markdown=1>

Fully inspired by *lit*, boolean attributes are simply a **toggle** indirection to either have, or not, such attribute.

```js
import { render, html } from 'uhtml';

render(document.body, html`
  <div ?hidden=${false}>I am visible</div>
  <div ?hidden=${true}>I am invisible</div>
`);

/** results into
<body>
  <div>I am visible</div>
  <div hidden>I am invisible</div>
<body>
 */
```

  </div>
</details>


### attribute

<details open>
  <summary><small>details</small></summary>
  <div markdown=1>

Every attribute that doesn't have a specialized syntax prefix, such as `?`, `@` or `.`, is handled in the following way and only if different from its previous value:

  * if the exported `attr` *Map* knows the attribute, a callback related to it will be used to update
    * `aria` attribute accepts and handle an object literal with `role` and other *aria* attributes
    * `class` attribute handles a direct `element.className` assignment or remove the attribute if the value is either `null` or `undefined`
    * `data` attribute accepts and handle an object literal with `dataset` names to directly set to the node
    * `ref` attribute handles *React* like *ref* property by updating the `ref.current` value to the current node, or invoking `ref(element)` when it's a callback
    * `style` attribute handles a direct `element.style.cssText` assignment or remove the attribute if the value is either `null` or `undefined`
    * it is possible to augment the `attr` *Map* with any custom attribute name that doesn't have an already known prefix and it's not part of the already known list (although one could override known attributes too). In this case, `attr.set("my-attr", (element, newValue, name, oldValue) => newValue)` is the expected signature to augment attributes in the wild, as the stack retains only the current value and it will invoke the callback only if the new value is different.
  * if the attribute is unknown in the `attr` map, a `name in element` check is performed once (per template, not per element) and if that's `true`, a *direct* assignment will be used to update the value, unless the value is either `null` or `undefined`, in which case the attribute is removed if it's *not a listener*, otherwise it drops the listener:
    * `"onclick" in element`, like any other native listener, will directly assign the callback via `element[name] = value`, when `value` is different, providing a way to simplify events handling in the wild
    * `"value" in input`, like any other understood accessor for the currently related node, will directly use `input[name] = value`, when `value` is different
    * `"hidden" in element`, as defined by standard, will also directly set `element[name] = value`, when `value` is different, somehow overlapping with the *boolean* feature
    * any other `"accessor" in element` will simply follow the exact same rule and use the direct `element[name] = value`, when `value` is different
  * in all other cases the attribute is set via `element.setAttribute(name, value)` and removed via `element.removeAttribute(name)` when `value` is either `null` or `undefined`

  </div>
</details>


### direct

<details open>
  <summary><small>details</small></summary>
  <div markdown=1>

A direct attribute is simply passed along to the element, no matter its name or special standard behavior.

```js
import { render, html } from 'uhtml';

const state = {
  some: 'special state'
};

render(document.body, html`
  <div id='direct' .state=${state}>content</div>
`);

document.querySelector('#direct').state === state;
// true
```

If the name is already a special standard accessor, this will be set with the current value, whenever it's different from the previous one, so that *direct* syntax *could* be also used to set `.hidden` or `.value`, for input or textarea, but that's just explicit, as these accessors would work regardless that way, without needing special syntax hints and as already explained in the *attribute* section.

  </div>
</details>


### listener

<details open>
  <summary><small>details</small></summary>
  <div markdown=1>

As already explained in the *attribute* section, common listeners can be already attached via `onclick=${callback}` and everything would work already as expected, with also less moving parts behind the scene ... but what if the listener is a custom event name or it requires options such as `{ once: true }` ?

This is where `@click=${[handler, { once: true }]}` helps, so that `addEventListener`, and `removeEventListener` when the listener changes, are used instead of direct `on*=${callback}` assignment.

```js
import { render, html } from 'uhtml';

const handler = {
  handleEvent(event) {
    console.log(event.type);
  }
};

render(document.body, html`
  <div @custom:type=${handler}, @click=${[handler, { once: true }]}>
    content
  </div>
`);

const div = document.querySelector('div');

div.dispatchEvent(new Event('custom:type'));
// logs "custom:type"

div.click();
// logs "click"

div.click();
// nothing, as it was once
```

**Please note** that even if options such as `{ once: true }` are used, if the handler / listener is different each time the listener itself will be added, as for logic sake that's indeed a different listener.

  </div>
</details>


### list

<details open>
  <summary><small>details</small></summary>
  <div markdown=1>

Most of the time, the template defines just static parts of the content and this is not likely to grow or shrink over time *but*, when that's the case or desired, it is possible to use an *array* to delimit an area that over time could grow or shrink.

`<ul>`, `<ol>`, `<tr>` and whatnot, are all valid use cases to use a list placeholder and not some unique node, together with `<article>` and literally any other use case that might render or not multiple nodes in the very same place after updates.


```js
import { render, html } from 'uhtml';

render(document.querySelector('#todos'), html`
  <ul>
    ${databaseResults.map(value => html`<li>${value}</li>`)}
  </ul>
`);
```

Please note that whenever a specific placeholder in the template might shrink in the future, it is always possible to still use an array to represent a single content:

```js
html`
  <div>
    ${items.length ? items : [
      html`...loading content`
      // still valid hole content
      // or a direct DOM node to render
    ]}
  </div>
`
```

**Please also note** that an *array* is always expected to contain a *hole* or an actual DOM Node.

  </div>
</details>


### self closing

<details open>
  <summary><small>details</small></summary>
  <div markdown=1>

Fully inspired by *XHTML* first and *JSX* after, any element that self closes won't result into surprises so that *custom-elements* as well as any other standard node that doesn't have nodes in it works out of the box.

```js
import { render, html } from 'uhtml';

render(document.body, html`
  <my-element />
  <my-other-element />
`);

/** results into
<body>
  <my-element></my-element>
  <my-other-element></my-other-element>
<body>
 */
```

Please note this is an *optional* feature, not a mandatory one: you don't need to self-close standard void elements such as `<br>`, `<link>` or others, but you can self-close even these if consistency in templates is what you are after.

  </div>
</details>


### hole

<details open>
  <summary><small>details</small></summary>
  <div markdown=1>

Technically speaking, in the template literal tags world all values part of the template are called *interpolations*.

```js
const tag = (template, interpolations) => {
  console.log(template.join());
  // logs "this is , and this is ,"
  console.log(interpolations);
  // logs [1, 2]
};

tag`this is ${1} and this is ${2}`;
```

Mostly because the name *Interpolation* is both verbose and boring plus it doesn't really describe the value *kind* within a DOM context, in *uhtml* the chosen name for "*yet unknown content to be rendered*" values is *hole*.

By current TypeScript definition, a *hole* can be either:

  * a `string`, a `boolean` or a `number` to show as it is on the rendered node
  * `null` or `undefined` to signal that *hole* has currently no content whatsoever
  * an actual `instanceof Hole` exported class, which is what `html` or `svg` tags return once invoked
  * an *array* that contains a list of instances of *Hole* or DOM nodes to deal with

  </div>
</details>


### reactivity

<details open>
  <summary><strong>reactivity</strong></summary>
  <div markdown=1>

The [uhtml/reactive](https://cdn.jsdelivr.net/npm/uhtml/reactive.js) export is meant to bring signals to the features *uhtml* can easily handle.

Signals are a primitive used to automatically react to changes, as opposite of remembering to deal manually with re-renders invokes which is all good but not ideal in terms of DX.

To bring your own *signals* based library all you need is to provide an `effect` function which *MUST* return a way to dispose the signal, or bad things might happen if multiple `render(sameNode, () => ...)` are executed, as signals need to *unsubscribe* from the effect when this effect is not needed anymore.

A few libraries out there handily provide out of the box such feature and [@preact/signal-core](https://www.npmjs.com/package/@preact/signals-core) is one of these, also one of the fastest and most battle-tested.

In this example, I am choosing to use [Preact Signals](https://preactjs.com/guide/v10/signals/) to showcase how simple it is to have your own reactive *uhtml*:

```js
import { effect, signal } from '@preact/signals-core';
import { reactive, html} from 'uhtml/reactive';

// create the reactive render function
const render = reactive(effect);

// create signals or computed or ...
const count = signal(0);

// render in the body passing a () => html`...` callback
render(document.body, () => html`
  <button onclick=${() => { count.value++ }}>
    Clicks: ${count.value}
  </button>
`);
```

You can see the result [live on CodePen](https://codepen.io/WebReflection/pen/RwdrYXZ?editors=0010) to play around with. You click the button, the counter increments, that's it.

### pre bundled exports

To simplify everyone life, I've pre-bundled some signals based library and published these in npm:

  * **[uhtml/preactive](https://cdn.jsdelivr.net/npm/uhtml/preactive.js)** already contains `@preact/signals-core` and it's probably the most bullet proof, or battle tested, solution
  * **[uhtml/signal](https://cdn.jsdelivr.net/npm/uhtml/signal.js)** already contains `@webreflection/signal` and it's surely the smallest bundle out there, with a total size of 3.3KB. The exports are very similar to the *Preact* one so either options are a drop-in replacement. Start small with this to experiment and feel free to switch to *preactive* any time later on

### constraints

The *reactive* version of *uhtml* is a drop-in replacement for anything you've done to date and a 1:1 API with other variants, but if signals are meant to be used within a template then the `render` function needs to have a lazy invoke of its content because otherwise signals don't get a chance to subscribe to it.

```js
// ⚠️ DOES NOT CREATE AN EFFECT
render(target, html`${signal.value}`)

// ✔ CREATE AN EFFECT 👍
render(target, () => html`${signal.value}`)
```

The refactoring is going to take this much `() =>` time to make signals available to any of your renders and that's pretty much the end of the story.

Please note that components that are meant to be rendered within other components, and not stand-alone, passing a non callback as second argument might be even desired so that only the outer top-most render would react to changes.

### about the effect callback

Not really a caveat or constrain, rather a *MUST* have, the `effect` function should return a way to dispose (erase subscriptions, cancel reactions to that effect) the effect.

This module is written well enough to deal with memory leaks and garbage collector all over, but if an effect cannot be dismissed somehow, this module won't work because it expects to be able to drop a previously used effect.

The reason is simple: if your are rendering again, for whatever reason, the same container, previous effects can't suddenly re-invoke the previous render callback and its content, or big FOUC and other issues can easily happen unintentionally.

In few words, if your *signals* library of choice doesn't return, within the `effect` function, a way to dispose it, you are in charge of wrapping such library in a way that the single `effect` callback passed to `reactive(effect)` returns a utility to dispose such effect.

If such utility doesn't exist, I suggest you to change the *signals* based library you are using, as it's clearly a memory and error prone leak solution unless it already handles everything internally but it doesn't give any easy option to consumers.

In other cases, I think you can provide good guards around most common libraries out there:

#### SolidJS

```js
import { createRenderEffect, createRoot, createSignal } from 'solid-js';
import { reactive, html} from 'uhtml/reactive';

const render = reactive(
  callback => createRoot(
    dispose => {
      createRenderEffect(callback);
      return dispose;
    }
  )
);

const [count, update] = createSignal(0);

render(document.body, () => html`
  <button onclick=${() => { update(count() + 1) }}>
    Clicks: ${count()}
  </button>
`);
```

This demo is also [live on CodePen](https://codepen.io/WebReflection/pen/QWoyZre?editors=0010).

  </div>
</details>

- - -

## F.A.Q.

<details>
  <summary><strong>what problem does <em>uhtml</em> solve ?</strong></summary>
  <div markdown=1>

Beside the no tooling needed and standard based approach, so that you can trust this module will last for a very long time out there and very little changes will require your attention in the future, this is a honest list of things this library helps you with daily DOM based tasks:

  * **safety**: unless you explicitly want to inject unsafe content, all attributes or nodes content handled by this library is XSS safe by design.
  * **hassle-free**: you don't need to think about *SVG* vs *HTML* attributes and creation gotchas, you just need either `html` or `svg` primitives and all expectations would be automatically met. For any other operation with both attributes or content, you also don't need to think much about intended operations and results on the live page.
  * **minimalism**: instead of repeating boring procedural *JS* operations, you can focus on logic and use this modules' template features to ultimately ship less code.
  * **performance**: with its battle tested diffing logic that has been working just fine for years, you can be sure atomic updates per each attribute, node, or list of nodes, will be likely faster than any home-made solution you've created to date. On top of that, this module is able to scale to dozen thousand nodes without issues, whenever that's even needed.
  * **memory**: while having ad-hoc and fine-tuned operations to perform DOM updates might be still an option you can hook into as well, this module uses all possible tricks to reduce the amount of needed RAM to the minimum, hence suitable from old *Desktop* to either legacy or modern *Mobile* phones, as well as *IoT* related browsers with memory constraints.
  * **tool friendly**: you don't need any tool to write this module but it ill work great with any other tool you need daily, making an opt-in, rather than a lock-in, hence helping migrating from a legacy application to a blazing fast one with minimal bandwidth required.

  </div>
</details>

<details>
  <summary><strong>what makes a node unique ?</strong></summary>
  <div markdown=1>

The *tag* in template literals *tags* primitives makes a node unique. This means that anywhere in your code there is a *tag* with a literal attached, that resulting node will be known, pre-parsed, cache-able, hence unique, in the whole rendering stack.

```js
// a tag receives a unique template + ...values
// were values are known as tag's interpolations
const tag = (template, ...values) => template;

// a literal string passed as tag is always unique and
// indeed in this case the two literals are different!
tag`a` === tag`a`; // this is false, despite the literal content

// in real-world code though, tags are used via callbacks
const a = () => tag`a`;

// so now this assertion would be true instead
a() === a(); // true!
```

If you are following this logic so far, you might as well realize that anything returning a tag also works well:

```js
// invokes the tag with always the same template
// despite one of its interpolations has a different value
[1, 2, 3].map(
  index => tag`index ${index}`
);
```

To dig a little further about tags and application usage, this example speaks thousand words!

```js
import { render, html } from 'uhtml';

const App = (results) => {
  return html`
    <h1>With ${results.length} results:</h1>
    <ul onclick=${({target}) => load(target.closest('li').id)}>
      ${results.map(item => html`
        <li id=${item.id}>${item.description}</li>
      `)}
    </ul>
  `;
};

const be = await fetch('./db.php?list=options');

render(document.body, App(await be.json()));
```

This example asks for some result and produces the page content based on such results, replacing the whole *body* with the requested list of options for that space.

With this code the *App* returns a known template that can be reused with ease, among sub-templates for any `<li>` in the list that also benefits from this library performance and weak cache system.

  </div>
</details>

<details>
  <summary><strong>how is this better than <code>innerHTML</code> ?</strong></summary>
  <div markdown=1>

With template literals tags what you see is not a string, rather a template with related values as interpolations that can be parsed and/or manipulated.

Interpolations are never "*trashed*" as part of the *HTML* or *SVG* template content neither, there is a standard *TreeWalker* that finds "*holes*" in the template and associates specialized operations per each hole kind: attribute, generic content or a list.

All operation that can also be inferred will be inferred only the first time the template is encountered and a map of updates per targeting node or attributes will be reused every other time.

```js
let i = 0;
const callback = () => { console.log(i++); };
const content = '<unsafe>content</unsafe>';

const vanilla = target => {
  target.innerHTML = `
    <div onclick=${/* failing */ callback}>
      ${/* unsafe */ content}
    </div>
  `;
};

const uhtml = target => {
  render(target, html`
    <div onclick=${/* working */ callback}>
      ${/* safe */ content}
    </div>
  `);
};

// it fails expectations and intents
vanilla(document.body);

// it trashes the previous DOM every time
vanilla(document.body);
vanilla(document.body);

// VS

// it works as expected
uhtml(document.body);

// it doesn't change anything on the body
// and it never trashes the previous content
uhtml(document.body);
uhtml(document.body);
```

  </div>
</details>

<details>
  <summary><strong>can <em>HTML</em> content be highlighted like in <em>JSX</em> ?</strong></summary>
  <div markdown=1>

There are various VSCode/ium solutions to template literals highlights and these are just a few examples:

  * [htmx-literals](https://marketplace.visualstudio.com/items?itemName=lehwark.htmx-literals)
  * [literally-html](https://marketplace.visualstudio.com/items?itemName=webreflection.literally-html)
  * [leet-html](https://marketplace.visualstudio.com/items?itemName=EldarGerfanov.leet-html)
  * [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)

Some of these might work with *SVG* content too but I don't feel like recommending any particular one over others: just try then and chose one 😉

  </div>
</details>

<details>
  <summary><strong>what are custom attributes ?</strong></summary>
  <div markdown=1>

All module variants export an `attr` *Map* that contains special attribute cases for `aria`, `class`, `data`, `ref` and `style`.

Due different nature of possible content, where *SVG* elements don't have `className` or other special accessors like *HTML* elements do, it is currently only possible to define custom attributes for *HTML* nodes.

```js
import { render, html, attr } from 'uhtml';

if (!attr.has('custom')) {
  attr.add('custom', (element, newValue, name, oldValue) => {
    console.log(element);   // the div
    console.log(newValue);  // 1
    console.log(name);      // "custom"
    console.log(oldValue);  // any previous value or undefined

    // do something with the element and the "custom" attribute
    element.setAttribute(name, newValue);

    // return the value to retain for future updates
    // in case the newValue is different from the oldValue
    return newValue;
  });
}

const update = i => {
  render(document.body, html`
    <div custom=${i} />
  `);
};

update(1);

// this does nothing as 1 === 1
update(1);

// this passes 2 as newValue and 1 as oldValue
update(2);
```

  </div>
</details>

<details>
  <summary><strong>does this work with signals ?</strong></summary>
  <div markdown=1>

Absolutely! If a render is within an *effect* or a *computed* function and any of the signals changes after some event, everything just works as expected.

```js
import { effect, signal } from 'https://unpkg.com/usignal';
import { render, html } from 'https://unpkg.com/uhtml';

const count = signal(0);

effect(() => {
  render(document.body, html`
    <button onclick=${() => { count.value++ }}>
      ${count.value}
    </button>
  `);
});
```

  </div>
</details>

<details>
  <summary><strong>how to render unsafe content ?</strong></summary>
  <div markdown=1>

This question came up more than once and it's about fetching some data from a server, where such data contains valid HTML content to show directly on the page.

As template literal tags are nothing more than functions, it is always possible to somehow bypass the need for a unique template and use an *array* instead.

```js
import { render, html, svg } from 'uhtml';

const htmlUnsafe = str => html([str]);
const svgUnsafe = str => svg([str]);

render(document.body, htmlUnsafe('<h1>Hello HTML</h1>'));

/** results into
<body>
  <h1>Hello HTML</h1>
<body>
 */
```

  </div>
</details>
