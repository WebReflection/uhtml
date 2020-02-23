import {cacheInfo} from './cache.js';
import {handlers} from './handlers.js';
import {isArray} from './array.js';
import {trimStart, trimEnd} from './string.js';
import {
  createFragment, createWalker,
  getPath, getWire,
  importNode
} from './node.js';

const prefix = 'no-';
const attr = /([^ \f\n\r\t\\>"'=]+)\s*=\s*(['"]?)$/;
const templates = new WeakMap;

const createEntry = (type, template) => {
  const {wire, updates} = mapUpdates(type, template);
  return {type, template, wire, updates};
};

const instrument = template => {
  const text = [];
  for (let i = 0, {length} = template; i < length; i++) {
    const chunk = i < 1 ? trimStart.call(template[i]) : template[i];
    if (attr.test(chunk))
      text.push(chunk.replace(attr, (_, $1, $2) =>
        `${prefix}${i}=${$2 ? $2 : '"'}${$1}${$2 ? '' : '"'}`));
    else {
      if ((i + 1) < length)
        text.push(chunk, `<!--${prefix}${i}-->`);
      else
        text.push(trimEnd.call(chunk));
    }
  }
  return text.join('').replace(
    /<([A-Za-z]+[A-Za-z0-9:._-]*)([^>]*?)(\/>)/g,
    unvoid
  );
};

const mapTemplate = (type, template) => {
  const text = instrument(template);
  const content = createFragment(text, type);
  const tw = createWalker(content);
  const nodes = [];
  const length = template.length - 1;
  let i = 0;
  let search = `${prefix}${i}`;
  while (i < length) {
    const node = tw.nextNode();
    if (!node)
      throw `bad template: ${text}`;
    if (node.nodeType === 8) {
      if (node.textContent === search) {
        nodes.push({type: 'node', path: getPath(node)});
        search = `${prefix}${++i}`;
      }
    }
    else {
      while (node.hasAttribute(search)) {
        nodes.push({
          type: 'attr',
          path: getPath(node),
          name: node.getAttribute(search),
          // svg: type === 'svg'
        });
        node.removeAttribute(search);
        search = `${prefix}${++i}`;
      }
      if (
        /^(?:style|textarea)$/i.test(node.tagName) &&
        trimStart.call(trimEnd.call(node.textContent)) === `<!--${search}-->`
      ){
        nodes.push({type: 'text', path: getPath(node)});
        search = `${prefix}${++i}`;
      }
    }
  }
  return {content, nodes};
};

const mapUpdates = (type, template) => {
  const {content, nodes} = templates.get(template) || setTemplate(type, template);
  const fragment = importNode.call(document, content, true);
  const updates = nodes.map(handlers, fragment);
  return {wire: getWire(fragment), updates};
};

export const retrieve = (info, hole) => {
  const {sub, stack} = info;
  const counter = {
    a: 0, aLength: sub.length,
    i: 0, iLength: stack.length
  };
  const wire = unroll(info, hole, counter);
  const {a, i, aLength, iLength} = counter;
  if (a < aLength)
    sub.splice(a);
  if (i < iLength)
    stack.splice(i);
  return wire;
};

const setTemplate = (type, template) => {
  const result = mapTemplate(type, template);
  templates.set(template, result);
  return result;
};

const unroll = (info, hole, counter) => {
  const {stack} = info;
  const {i, iLength} = counter;
  const {type, template, values} = hole;
  const unknown = i === iLength;
  if (unknown)
    counter.iLength = stack.push(createEntry(type, template));
  counter.i++;
  unrollArray(info, values, counter);
  let entry = stack[i];
  if (!unknown && (entry.template !== template || entry.type !== type))
    stack[i] = (entry = createEntry(type, template));
  const {wire, updates} = entry;
  for (let i = 0, {length} = updates; i < length; i++)
    updates[i](values[i]);
  return wire;
};

const unrollArray = (info, values, counter) => {
  for (let i = 0, {length} = values; i < length; i++) {
    const hole = values[i];
    if (typeof hole === 'object' && hole) {
      if (hole instanceof Hole)
        values[i] = unroll(info, hole, counter);
      else if (isArray(hole)) {
        for (let i = 0, {length} = hole; i < length; i++) {
          const inner = hole[i];
          if (typeof inner === 'object' && inner && inner instanceof Hole) {
            const {sub} = info;
            const {a, aLength} = counter;
            if (a === aLength)
              counter.aLength = sub.push(cacheInfo());
            counter.a++;
            hole[i] = retrieve(sub[a], inner);
          }
        }
      }
    }
  }
};

const unvoid = (_, name, extra) =>
  /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i.test(name) ?
    _ : `<${name}${extra}></${name}>`;


/**
 * Holds all necessary details needed to render the content further on. 
 * @constructor
 * @param {string} type The hole type, either `html` or `svg`.
 * @param {Array} template The template literals used to the define the content.
 * @param {Array} values Zero, one, or more interpolated values to render.
 */
export function Hole(type, template, values) {
  this.type = type;
  this.template = template;
  this.values = values;
};
