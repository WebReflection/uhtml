export * from '@preact/signals-core';
export { Hole, html, svg, htmlFor, svgFor, attr } from '../reactive.js';

import { effect } from '@preact/signals-core';
import { reactive } from '../reactive.js';
export const render = reactive(effect);
