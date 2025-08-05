import {
  Comment,
  DocumentType,
  Text,
  Fragment,
  Element,
  Component,
  fromJSON,
} from '../src/dom/ish.js';

import parser from '../src/parser/index.js';
// import { update } from '../src/dom/update.js';

const parse = parser({
  Comment,
  DocumentType,
  Text,
  Fragment,
  Element,
  Component,
  //update,
});

const parseHTML = template => parse(template, false);

const assert = (ok, message) => {
  if (!ok) throw new Error(message);
};

const html = (template, ...values) => {
  const [node, updates] = parseHTML(template);
  // for (let i = 0; i < updates.length; i++) {
  //   const [path, update, type] = updates[i];
  //   update(path.reduce(tree, node), values[i]);
  // }
  const stringified = JSON.stringify(node);
  assert(JSON.stringify(fromJSON(JSON.parse(stringified))) === stringified, [
    '',
    stringified,
    JSON.stringify(fromJSON(JSON.parse(stringified))),
  ].join('\n'));
  return node.toString();
};

console.log(html`<div><template><p test=${'ok'} />${'value'}</></div>`);
console.log(html`<table>${[]}</table>`);

console.log(html`
  <div hidden>
    <!--/* comment */-->
    <p class=${'test'}>Hello</p>
    <hr />
    <svg>
      <!--! important comment !-->
      <rect hidden />
    </svg>
    ${'World'}
    <rect />
    <!--/* comment */-->
    <!--// comment -->
    <!--# comment -->
    <!--; comment ;-->
  </div>
`);

console.log(html`
  <${Object} a="1" b=${2} ?c=${false} ?d=${true}>
    <p>Component</p>
  </>
`);

console.log(html`
  <!doctype html>
  <texatea prop="value" />
  <style> test </style>
  <script> ${'test'} </script>
  <p />
`);


console.log(html`
  <!-- comment -->
  <p />
  <table><td /></>
  <table><tr class=${'test'} /></>
  <p />
`);

console.log(html`<hr><br>`);
console.log(html`<a ...${'props'} /> b`);


// EXPECTED ERRORS
try {
  html`\x00`;
}
catch ({ message }) {
  assert(message === 'Invalid content: NUL char \\x00 found in template: \\x00', message);
}

try {
  html`<p test="a ${'b'} c" />`;
}
catch ({ message }) {
  assert(message.startsWith('Invalid test attribute in template definition'), message);
}

try {
  html`<p `;
}
catch ({ message }) {
  assert(message === 'Unclosed element <p> found in template <p ', message);
}

try {
  html`<!-- `;
}
catch ({ message }) {
  assert(message === 'Invalid content "<!" found in template: <!-- ', message);
}

try {
  html`<!--->`;
}
catch ({ message }) {
  assert(message === 'Invalid comment: no closing --> found in template <!--->', message);
}

try {
  html`<!loltype gotcha>`;
}
catch ({ message }) {
  assert(message === 'Invalid doctype: loltype gotcha found in template <!loltype gotcha>', message);
}

try {
  html`<p></`;
}
catch ({ message }) {
  assert(message === 'Invalid closing tag: </... found in template: <p></', message);
}

try {
  html`<div></div></div>`;
}
catch ({ message }) {
  assert(message === 'Too many closing tags found in template <div></div></div>', message);
}

try {
  html`<textarea></>`;
}
catch ({ message }) {
  assert(message === 'The text only <textarea> element requires explicit </textarea> closing tag in template <textarea></>', message);
}

try {
  html`<textarea>a ${'b'} c</textarea>`;
}
catch ({ message }) {
  assert(message === 'Mixed text and interpolations found in text only <textarea> element "a \\u0000 c" in template <textarea>a , c</textarea>', message);
}
