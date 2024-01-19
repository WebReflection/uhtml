import { DOMParser } from '../dom.js';
import init from '../init.js';

const assert = (real, expected, message = `expected ${expected} got ${real}`) => {
  if (!Object.is(real, expected))
    throw new Error(message);
};

if (typeof document === 'undefined') {
  globalThis.document = (new DOMParser).parseFromString('...', 'text/html');
  globalThis.HTMLElement = document.createElement('e').constructor;
  globalThis.DocumentFragment = document.createDocumentFragment().constructor;
}

Object.defineProperty(
  HTMLElement.prototype,
  'getOnly',
  { get() { return 'OK' },
});

const node = new Proxy(new Map, {
  get(map, content) {
    let node = map.get(content);
    if (!node) map.set(content, (node = document.createTextNode(content)));
    return node;
  }
});

const { render, html, htmlFor } = init(document);

const empty = () => html``;

const fragment = () => html`<p>br</p><br />`;

const holeyFragment = b => html`a${b}c`;

const sameFragment = b => htmlFor(document)`a${b}c`;

render(document.body, empty());
assert(
  document.body.childNodes.length,
  1
);

render(document.body, html`${empty()}`);
assert(
  document.body.childNodes.length,
  3
);

render(document.body, html`a`);
assert(
  document.body.childNodes.length,
  1
);
assert(
  document.body.outerHTML,
  '<body>a</body>'
);

render(document.body, html`<span />`);
assert(
  document.body.childNodes.length,
  1
);
assert(
  document.body.outerHTML,
  '<body><span></span></body>'
);

render(document.body, html`${'a'}`);
assert(
  document.body.childNodes.length,
  3
);
assert(
  document.body.outerHTML,
  '<body><!--<>-->a<!--</>--></body>'
);

render(document.body, fragment());
assert(
  document.body.childNodes.length,
  4
);
assert(
  document.body.outerHTML,
  '<body><!--<>--><p>br</p><br><!--</>--></body>'
);

render(document.body, holeyFragment('b'));
assert(
  document.body.childNodes.length,
  5
);
assert(
  document.body.outerHTML,
  '<body><!--<>-->abc<!--</>--></body>'
);

render(document.body, holeyFragment('z'));
assert(
  document.body.childNodes.length,
  5
);
assert(
  document.body.outerHTML,
  '<body><!--<>-->azc<!--</>--></body>'
);

render(document.body, sameFragment('b'));
assert(
  document.body.childNodes.length,
  5
);
assert(
  document.body.outerHTML,
  '<body><!--<>-->abc<!--</>--></body>'
);

const div = document.body.appendChild(document.createElement('div'));

render(div, sameFragment('z'));
assert(
  document.body.childNodes.length,
  1
);
assert(
  document.body.outerHTML,
  '<body><div><!--<>-->azc<!--</>--></div></body>'
);


render(document.body, html`<span>a</span><span>b</span>`);
assert(
  document.body.childNodes.length,
  4
);
assert(
  document.body.outerHTML,
  '<body><!--<>--><span>a</span><span>b</span><!--</>--></body>'
);

const spans = (a, b) => html`<span>${a}</span><span>${b}</span>`;

render(document.body, spans('a', 'c'));
assert(
  document.body.childNodes.length,
  4
);
assert(
  document.body.outerHTML,
  '<body><!--<>--><span>a</span><span>c</span><!--</>--></body>'
);

render(document.body, spans('a', 'b'));
assert(
  document.body.childNodes.length,
  4
);
assert(
  document.body.outerHTML,
  '<body><!--<>--><span>a</span><span>b</span><!--</>--></body>'
);

const holeArray = list => html`${list}`;

render(document.body, holeArray([]));
assert(
  document.body.childNodes.length,
  3
);
assert(
  document.body.outerHTML,
  '<body><!--<>--><!--[0]--><!--</>--></body>'
);

render(document.body, holeArray([node.a]));
assert(
  document.body.childNodes.length,
  4
);
assert(
  document.body.outerHTML,
  '<body><!--<>-->a<!--[1]--><!--</>--></body>'
);

render(document.body, holeArray([node.a, node.b, node.c, node.d]));
assert(
  document.body.childNodes.length,
  7
);
assert(
  document.body.outerHTML,
  '<body><!--<>-->abcd<!--[4]--><!--</>--></body>'
);

render(document.body, holeArray([node.a, node.b]));
assert(
  document.body.childNodes.length,
  5
);
assert(
  document.body.outerHTML,
  '<body><!--<>-->ab<!--[2]--><!--</>--></body>'
);

import('../node.js').then(({ render, html }) => {
  render(document.head, html`<style>${'body{font-family:sans-serif;}'}</style>`);
  assert(
    document.head.outerHTML,
    '<head><style>body{font-family:sans-serif;}</style></head>'
  );
});
