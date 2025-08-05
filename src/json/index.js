import DEBUG from '../debug.js';
import errors from '../errors.js';
import { assign } from '../utils.js';

import {
  Comment,
  DocumentType,
  Text,
  Fragment,
  Element,
  Component,
  fromJSON,
} from '../dom/ish.js';

import parser from '../parser/index.js';
import resolve from './resolve.js';
import { COMPONENT, KEY, comment, update } from './update.js';

const textParser = parser({
  Comment,
  DocumentType,
  Text,
  Fragment,
  Element,
  Component,
  update,
});

const { parse, stringify } = JSON;

const create = xml => {
  const twm = new WeakMap;
  const cache = (template, values) => {
    const parsed = textParser(template, values, xml);
    parsed[0] = parse(stringify(parsed[0]));
    twm.set(template, parsed);
    return parsed;
  };
  return (template, ...values) => {
    const [json, updates] = twm.get(template) || cache(template, values);
    const root = fromJSON(json);
    const length = values.length;
    if (length === updates.length) {
      const components = [];
      for (let node, prev, i = 0; i < length; i++) {
        const [path, update, type] = updates[i];
        const value = values[i];
        if (prev !== path) {
          node = resolve(root, path);
          prev = path;
          if (DEBUG && !node) throw errors.invalid_path(path);
        }
        if (type === KEY) continue;
        if (type === COMPONENT) components.push(update(node, value));
        else update(node, value);
      }
      for (const [node, Component] of components) {
        const props = assign({ children: node.children }, node.props);
        comment(node, Component(props));
      }
    }
    else if (DEBUG) throw errors.invalid_template();
    return root;
  };
};

export const html = create(false);
export const svg = create(true);
