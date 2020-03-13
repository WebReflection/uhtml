'use strict';
const instrument = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uparser'));
const {isArray} = require('uarray');
const {persistent} = require('uwire');

const {createCache, setCache} = require('./cache.js');
const {handlers} = require('./handlers.js');
const {createFragment, createPath, createWalker, importNode} = require('./node.js');

const prefix = 'isµ';
const cache = new WeakMap;

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
      // The only comments to be considered are those
      // which content is exactly the same as the searched one.
      /* istanbul ignore else */
      if (node.textContent === search) {
        nodes.push({type: 'node', path: createPath(node)});
        search = `${prefix}${++i}`;
      }
    }
    else {
      while (node.hasAttribute(search)) {
        nodes.push({
          type: 'attr',
          path: createPath(node),
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
        nodes.push({type: 'text', path: createPath(node)});
        search = `${prefix}${++i}`;
      }
    }
  }
  return {content, nodes};
};

const mapUpdates = (type, template) => {
  const {content, nodes} = (
    cache.get(template) ||
    setCache(cache, template, mapTemplate(type, template))
  );
  const fragment = importNode.call(document, content, true);
  const updates = nodes.map(handlers, fragment);
  return {content: fragment, updates};
};

const unroll = (info, {type, template, values}) => {
  const {length} = values;
  unrollValues(info, values, length);
  let {entry} = info;
  if (!entry || (entry.template !== template || entry.type !== type))
    info.entry = (entry = createEntry(type, template));
  const {content, updates, wire} = entry;
  for (let i = 0; i < length; i++)
    updates[i](values[i]);
  return wire || (entry.wire = persistent(content));
};
exports.unroll = unroll;

const unrollValues = ({stack}, values, length) => {
  for (let i = 0; i < length; i++) {
    const hole = values[i];
    if (hole instanceof Hole)
      values[i] = unroll(
        stack[i] || (stack[i] = createCache()),
        hole
      );
    else if (isArray(hole))
      unrollValues(
        stack[i] || (stack[i] = createCache()),
        hole,
        hole.length
      );
    else
      stack[i] = null;
  }
  if (length < stack.length)
    stack.splice(length);
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
