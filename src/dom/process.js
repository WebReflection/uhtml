import DEBUG from '../debug.js';

import {
  Comment,
  DocumentType,
  Text,
  Fragment,
  Element,
  Component,
} from './ish.js';

import parser from '../parser/index.js';
import { isKeyed, fragment, update, pdt } from './update.js';

const parse = parser({
  Comment,
  DocumentType,
  Text,
  Fragment,
  Element,
  Component,
  update,
});

export default (xml, cache, template, values) => {
  if (DEBUG) console.time(`parsing ${values.length} holes`);
  const [domish, updates] = parse(template, values, xml);
  if (DEBUG) {
    console.timeEnd(`parsing ${values.length} holes`);
    console.time('creating fragment');
  }
  const parsed = pdt(fragment(domish.toString(), xml), updates, isKeyed());
  if (DEBUG) console.timeEnd('creating fragment');
  cache.set(template, parsed);
  return parsed;
};
