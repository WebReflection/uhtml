# What Is µhtml And How Does It Work

![snow flake](./uhtml-head.jpg)

A _getting started_ guide with most common questions and answers, covered by live examples.

- - -



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

This part is extremely technical and likely irrelevant for a getting started page, but if you are curious to understand what happens behind the scene,you can find all steps in here.

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
    * le the browser engine parse the final layout through the native [Content Template element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) and traverse it in search of all comments and attributes that are only related to _µhtml_
    * per each crawled node, using and `index` that goes from _zero_ to the length of passed values, as these are those to map and update in the future:
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

I also understand this list of steps might be "_a bit_" overwhelming, but these describe pretty much everything that happens in both [rabbit.js](./esm/rabbit.js) and [rabbit.js](./esm/handlers.js) files, where _rabbit.js_ also takes care of the whole "_execution stack dance_", which enables nested rendered, with smart diff, and through the [µdomdiff](https://github.com/WebReflection/udomdiff#readme) module.

It's also worth mentioning I've been fine-tuning all these steps since the beginning of 2017, so maybe it was unnecessary to describe them all, but "_the nitty-gritty_" at least is now written down somewhere 😅

</details>
