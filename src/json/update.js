import {
  ATTRIBUTE as TEMPLATE_ATTRIBUTE,
  COMMENT as TEMPLATE_COMMENT,
  TEXT as TEMPLATE_TEXT,
  COMPONENT as TEMPLATE_COMPONENT,
  Node, Text, Fragment,
  props, children,
} from '../dom/ish.js';

import { isArray, keys } from '../utils.js';

const get = node => {
  if (node.props === props) node.props = {};
  return node.props;
};

const set = (props, name, value) => {
  if (value == null) delete props[name];
  else props[name] = value;
};

export const ARIA = 0;
const aria =  (node, values) => {
  const props = get(node);
  for (const key in values) {
    const name = key === 'role' ? key : `aria-${key}`;
    const value = values[key];
    set(props, name, value);
  }
  if (keys(props).length === 0) node.props = props;
};

export const ATTRIBUTE = 1;
const attribute = name => (node, value) => {
  const props = get(node);
  set(props, name, value);
  if (keys(props).length === 0) node.props = props;
};

export const COMMENT = 2;
export const comment = (node, value) => {
  const { children } = node.parent;
  const i = children.indexOf(node);
  if (isArray(value)) {
    const fragment = new Fragment;
    fragment.children = value;
    value = fragment;
  }
  else if (!(value instanceof Node)) value = new Text(value == null ? '' : value);
  children[i] = value;
};

export const COMPONENT = 3;
const component = (node, value) => [node, value];

export const DATA = 4;
const data = (node, values) => {
  const props = get(node);
  for (const key in values) {
    const name = `data-${key}`;
    const value = values[key];
    set(props, name, value);
  }
  if (keys(props).length === 0) node.props = props;
};

export const DIRECT = 5;
const direct = name => (node, value) => {
  const props = get(node);
  set(props, name, value);
  if (keys(props).length === 0) node.props = props;
};

export const DOTS = 6;
const dots = isComponent => (node, value) => {
  if (isComponent) {
    // TODO: assign props to component parameter
  }
  else {
    // TODO: assign(node, value) ???
  }
};

export const EVENT = 7;
const event = at => (node, value) => {
  const props = get(node);
  if (value == null) delete props[at];
  else props[at] = value;
};

export const KEY = 8;

export const TEXT = 9;
const text = (node, value) => {
  if (value == null) node.children = children;
  else node.children = [new Text(value)];
};

export const TOGGLE = 10;
const toggle = name => (node, value) => {
  const props = get(node);
  if (!value) {
    delete props[name];
    if (keys(props).length === 0) node.props = props;
  }
  else props[name] = !!value;
};

export const update = (node, type, path, name) => {
  switch (type) {
    case TEMPLATE_COMPONENT: {
      return [path, component, COMPONENT];
    }
    case TEMPLATE_COMMENT: {
      return [path, comment, COMMENT];
    }
    case TEMPLATE_ATTRIBUTE: {
      switch (name.at(0)) {
        case '@': return [path, event(Symbol(name)), EVENT];
        case '?': return [path, toggle(name.slice(1)), TOGGLE];
        case '.': return name === '...' ?
          [path, dots(node.type === TEMPLATE_COMPONENT), DOTS] :
          [path, direct(name.slice(1)), DIRECT]
        ;
        case 'a': if (name === 'aria') return [path, aria, ARIA];
        case 'd': if (name === 'data') return [path, data, DATA];
        case 'k': if (name === 'key') return [path, Object, KEY];
        default: return [path, attribute(name), ATTRIBUTE];
      }
    }
    case TEMPLATE_TEXT: return [path, text, TEXT];
  }
};
