import init from '../esm/init-ssr.js';

const { document, render, svg } = init();

render(document.body, svg`<svg><path d="" /></svg>`);

if (document.body.innerHTML !== '<svg><path d="" /></svg>')
  throw new Error('Invalid SVG expectations');
