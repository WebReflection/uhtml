import { gPD, set, newRange } from '../../esm/utils.js';
import Document from '../../esm/dom/document.js';

globalThis.document = new Document;

const map = new Map;
console.assert(set(map, 'key', 'value') === 'value');

console.assert(JSON.stringify(gPD({}, 'hasOwnProperty')) === '{"writable":true,"enumerable":false,"configurable":true}');

// TODO
newRange();
