export * from '@webreflection/signal';
export { Hole, html, svg, htmlFor, svgFor, detach, attr } from '../reactive.js';

import { effect } from '@webreflection/signal';
import { attach } from '../reactive.js';
export const render = attach(effect);
