//@ts-nocheck

import {
  ELEMENT,
  Node,
  Comment,
  DocumentType,
  Text,
  Fragment,
  Element,
  Component,
  fromJSON,
  props,
} from '../dom/ish.js';

import {
  COMPONENT,
  DOTS,
  KEY,
  HOLE,
  update,
} from './update.js';

import parser from '../parser/index.js';
import resolve from '../json/resolve.js';
import { assign } from '../utils.js';

const textParser = parser({
  Comment,
  DocumentType,
  Text,
  Fragment,
  Element,
  Component,
  update,
});

const { stringify, parse } = JSON;
const isNode = node => node instanceof Node;
const get = node => node.props === props ? (node.props = props) : node.props;

export default (jsx, jsxs = jsx) => {
  const twm = new WeakMap;
  const cache = (template, values) => {
    const parsed = textParser(template, values, true);
    parsed[0] = parse(stringify(parsed[0]));
    twm.set(template, parsed);
    return parsed;
  };

  const getProps = (node) => {
    const { children } = node;
    if (children.length) get(node).children = children.map(getValue);
    return get(node);
  };

  const getValue = node => {
    if (isNode(node)) {
      return node.type === ELEMENT ?
        getInvoke(node)(node.name, getProps(node)) :
        node.toString()
      ;
    }
    return node;
  };

  const getInvoke = ({ children }) => (jsx === jsxs || children.every(isNode)) ? jsx : jsxs;

  return (template, ...values) => {
    const [json, updates] = twm.get(template) || cache(template, values);
    // TODO: this could be mapped once so that every consecutive call
    // will simply loop over values and updates[length](values[length])
    // before returning the list or arguments to pass to jsx or jsxs
    // this way it'd be way faster on repeated invokes, if needed/desired
    const root = fromJSON(json);
    let length = values.length, args, prev, node;
    while (length--) {
      const [path, type] = updates[length];
      const value = values[length];
      if (prev !== path) {
        node = resolve(root, path);
        prev = path;
        args = [node.name, getProps(node)];
      }
      if (type === COMPONENT) {
        args[0] = value;
        const { children } = node.parent;
        children[children.indexOf(node)] = getInvoke(node)(...args);
      }
      else if (type === KEY) args.push(value);
      else if (type === DOTS) assign(get(node), value);
      else if (type === HOLE) {
        const { children } = node.parent;
        children[children.indexOf(node)] = value;
      }
      else get(node)[type] = value;
    }
    return getValue(root.children[0]);
  };
};
