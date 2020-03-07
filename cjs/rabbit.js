'use strict';
const instrument = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uparser'));
const {cacheInfo} = require('./cache.js');
const {handlers} = require('./handlers.js');
const {isArray} = require('./array.js');
const {
  createFragment, createWalker, getPath, getWire, importNode
} = require('./node.js');

const prefix = 'isµ';
const templates = new WeakMap;

const createEntry = (type, template) => {
  const {content, updates} = mapUpdates(type, template);
  return {type, template, content, updates, wire: null};
};

const mapTemplate = (type, template) => {
  const text = instrument(template, prefix);
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
        node.textContent.trim() === `<!--${search}-->`
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
  return {content: fragment, updates};
};

const retrieve = (info, hole) => {
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
exports.retrieve = retrieve;

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
  const {content, updates, wire} = entry;
  for (let i = 0, {length} = updates; i < length; i++)
    updates[i](values[i]);
  return wire || (entry.wire = getWire(content));
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

/**
 * Holds all necessary details needed to render the content further on. 
 * @constructor
 * @param {string} type The hole type, either `html` or `svg`.
 * @param {string[]} template The template literals used to the define the content.
 * @param {Array} values Zero, one, or more interpolated values to render.
 */
function Hole(type, template, values) {
  this.type = type;
  this.template = template;
  this.values = values;
}
exports.Hole = Hole;
