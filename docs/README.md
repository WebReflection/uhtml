![snow flake](./uhtml-head.jpg)

*[uhtml](https://github.com/WebReflection/uhtml)* (micro *µ* html) is one of the smallest, fastest, memory consumption friendly, yet zero-tools based, library to safely help creating or manipulating DOM content.

It is entirely Web standards based and it adds just the minimal amount of *spices* to the templates literals it's able to understand and optimized for either repeated updates or one-off operations.

This page describes, without going into too many details, all the features delivered via this module which is roughly 2.5K once minified and compressed, or even bundled within your project.

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

The `render` exported helper is a function that, given a place *where* to render such content, returns that very
same place with all nodes in the right place, nodes returned by the *tag* used to render or, for convenience, after
invoking the callback that will return *tags* returned content to render.

```js
import { render, html } from 'uhtml';

const whom = 'World';

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
    * `class` attribute handles a direct `element.className` assignment
    * `data` attribute accepts and handle an object literal with `dataset` names to directly set to the node
    * `ref` attribute handles *React* like *ref* property by updating the `ref.current` value to the current node, or invoking `ref(element)` when it's a callback
    * `style` attribute handles a direct `element.style.cssText` assignment
    * it is possible to augment the `attr` *Map* with any custom attribute name that doesn't have an already known prefix and it's not part of the already known list (although one could override known attributes too). In this case, `attr.set("my-attr", (element, newValue, name, oldValue) => newValue)` is the expected signature to augment attributes in the wild, as the stack retains only the current value and it will invoke the callback only if the new value is different.
  * if the attribute is unknown in the `attr` map, a `name in element` check is performed once (per template, not per element) and if that's `true`, a *direct* assignment will be used to update the value
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

const handler = {
  handleEvent(event) {
    console.log(event.type);
  }
};

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

The *tag* in template literals *tags* primitives make a node unique. This means that anywhere in your code there is a *tag* with a literal attached, that resulting node will be known, pre-parsed, cache-able, hence unique, in the whole rendering stack.

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

Some of these might work with *SVG* content too but I don't feel like recommending anyone over others in particular: just try then and chose one.

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
update(1);
```

  </div>
</details>
