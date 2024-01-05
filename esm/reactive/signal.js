import { effect } from '@webreflection/signal';
export * from '@webreflection/signal';

import { reactive } from '../reactive.js';
export { Hole, html, svg, htmlFor, svgFor, attr } from '../reactive.js';
export const render = reactive(effect);
