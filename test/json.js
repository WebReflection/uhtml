import { html, svg } from '../src/json/index.js';

const assert = (ok, message) => {
  if (!ok) throw new Error(message);
};

function Rect(props) {
  console.log(props.children[1]);
  return svg`<rect x=${props.a} y=${props.b} />`;
}

const render = (where, what) => {
  where(String(typeof what === 'function' ? what() : what));
};

render(console.log, html`<div><template><p test=${'ok'} />${'value'}</></div>`);

render(console.log, html`
  <div hidden>
    <p class=${'test'}>Hello</p>
    <hr />
    <svg>
      <rect hidden />
    </svg>
    ${'World'}
    <rect />
  </div>
`);

render(console.log, html`
  <${Rect} a="1" b=${2} ?c=${false} ?d=${true}>
    <p>Component</p>
  </>
`);

render(console.log, html`
  <!doctype html>
  <texatea prop="value" />
  <style> test </style>
  <script> ${'test'} </script>
  <p />
`);


render(console.log, html`
  <!-- comment -->
  <p />
  <table><td /></>
  <table><tr class=${'test'} /></>
  <p />
`);

render(console.log, html`<hr><br>`);
render(console.log, html`<a ...${'props'} /> b`);

