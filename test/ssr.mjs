import init from '../esm/init-ssr.js';

const { document, render, html } = init(`
  <!doctype html>
  <head>
    <title>${'Hello SSR'}</title>
  </head>
  <div id="test"></div>
`.trim()
);

render(document.getElementById('test'), html`
  <h1>
    !!! ${'Hello SSR'} !!!
  </h1>
`);

console.log(document.toString());
