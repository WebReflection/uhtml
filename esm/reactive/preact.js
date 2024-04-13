export * from '@preact/signals-core';
export { Hole, html, svg, htmlFor, svgFor, detach, attr } from '../reactive.js';

import { effect } from '@preact/signals-core';
import { attach } from '../reactive.js';
export const render = attach(effect);
