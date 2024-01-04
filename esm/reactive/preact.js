import { effect } from '@preact/signals-core';
export * from '@preact/signals-core';

import { Hole, reactive, html, svg, htmlFor, svgFor, attr } from '../reactive.js';

const render = reactive(effect);

export { Hole, render, html, svg, htmlFor, svgFor, attr };
