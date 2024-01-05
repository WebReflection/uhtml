export * from '@webreflection/signal';
export { Hole, html, svg, htmlFor, svgFor, attr } from '../reactive.js';

import { effect } from '@webreflection/signal';
import { reactive } from '../reactive.js';
export const render = reactive(effect);
