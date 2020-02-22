'use strict';
const createContent = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@ungap/create-content'));
const importNode = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@ungap/import-node'));

const {cacheInfo} = require('./cache.js');
const {handlers} = require('./handlers.js');
const {isArray} = require('./array.js');
const {findNode, getPath, getWire, isVoid, noChildNodes} = require('./node.js');
const {trimStart, trimEnd} = require('./string.js');

const prefix = 'no-';
const re = /<([A-Za-z]+[A-Za-z0-9:._-]*)([^>]*?)(\/>)/g;
const templates = new WeakMap;

const createEntry = (type, template) => {
  const {wire, updates} = mapUpdates(type, template);
  return {type, template, wire, updates};
};

const instrument = template => {
  const text = [];
  const selectors = [];
  for (let i = 0, {length} = template; i < length; i++) {
    const chunk = i < 1 ? trimStart.call(template[i]) : template[i];
    if (/([^ \f\n\r\t\\>"'=]+)\s*=\s*(['"]?)$/.test(chunk)) {
      const {$1: name} = RegExp;
      text.push(chunk.replace(/([^ \f\n\r\t\\>"'=]+)\s*=\s*(['"]?)$/, `${prefix}$1=$2${i}`));
      selectors.push(`[${prefix}${name}="${i}"]`);
    }
    else {
      text.push(chunk);
      if ((i + 1) < length) {
        text.push(`<${prefix}${i}></${prefix}${i}>`);
        selectors.push(prefix + i);
      }
    }
  }
  // console.log(trimEnd.call(text.join('')).replace(re, place));
  return {text: trimEnd.call(text.join('')).replace(re, place), selectors};
};

const mapTemplate = (type, template) => {
  const {text, selectors} = instrument(template);
  const content = createContent(text, type);
  const nodes = [];
  for (let i = 0, {length} = selectors; i < length; i++) {
    const selector = selectors[i];
    const placeholder = content.querySelector(selector) ||
                        findNode(content, selector);
    const {ownerDocument} = placeholder;
    if (selector.charAt(0) === '[') {
      const name = selector.slice(1 + prefix.length, selector.indexOf('='));
      placeholder.removeAttribute(prefix + name);
      const attribute = ownerDocument.createAttribute(name);
      placeholder.setAttributeNode(attribute);
      nodes.push({
        type: 'attr',
        path: getPath(placeholder),
        name
      });
    }
    else {
      const {tagName} = placeholder;
      nodes.push({
        type: 'node',
        path: getPath(placeholder),
        name: tagName
      });
      if (!noChildNodes(tagName)) {
        const comment = placeholder.ownerDocument.createComment('µ');
        placeholder.parentNode.replaceChild(comment, placeholder);
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

const place = (_, name, extra) => isVoid(name) ? _ : `<${name}${extra}></${name}>`;

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

function Hole(type, template, values) {
  this.type = type;
  this.template = template;
  this.values = values;
}
exports.Hole = Hole;
