import { Hole, html, svg, htmlFor, svgFor, attr } from './keyed.js';

import { attach, detach } from './render/reactive.js';

export { Hole, attach, detach, html, svg, htmlFor, svgFor, attr };

// TODO: mostly backward compatibility ... should this change?
export { attach as reactive };
