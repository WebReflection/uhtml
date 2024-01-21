import init from '../esm/init-ssr.js';

function App(state) {
  return html`
    <h1>${state.title}</h1>
    <div>
      <ul>${[]}</ul>
      <input autofocus>
      <button onclick=${() => {
        state.count++;
        this.update(state);
      }}>
        Clicked ${state.count} times
      </button>
    </div>
  `;
}

const component = (target, Callback) => {
  const effect = {
    target,
    update(...args) {
      render(target, Callback.apply(effect, args));
    }
  };
  return Callback.bind(effect);
};

const state = { title: 'Hello Hydro', count: 0 };

const { document, render, html } = init(`
  <!doctype html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <title>${state.title}</title>
      <script type="module">${['',
        /* add / to delay */`await new Promise($ => setTimeout($, 2000));`,
        `import { render, html } from '../hydro.js';`,
        App,
        `const component = ${component};`,
        `const state = ${JSON.stringify(state, null, '  ')};`,
        `const { body } = document;`,
        `const Body = component(body, App);`,
        `render(body, Body(state));`,
      ].join('\n').replace(/^/gm, ' '.repeat(8))}
      </script>
    </head>
  </html>
`);

const { body } = document;

const Body = component(body, App);

render(body, Body(state));

console.log(document.toString());
