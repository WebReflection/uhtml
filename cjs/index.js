'use strict';
const createContent = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@ungap/create-content'));
const importNode = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@ungap/import-node'));

const {create} = Object;
const {forEach} = [];

const content = new WeakMap;
const fragment = new WeakMap;
const nope = {what: null};

const render = (where, what) => {
  let info = content.get(where) || nope;
  if (info.what !== what) {
    where.textContent = '';
    where.appendChild(importNode.call(where.ownerDocument, what, true));
    const names = create(null);
    forEach.call(where.querySelectorAll('[name]'), attach, names);
    content.set(where, info = {what, names});
  }
  return info.names;
};
exports.render = render;

function html(template) {
  return fragment.get(template) || parse.apply('html', arguments);
}
exports.html = html;

function svg(template) {
  return fragment.get(template) || parse.apply('svg', arguments);
}
exports.svg = svg;

function attach(element) {
  this[element.getAttribute('name')] = element;
}

function parse(template) {
  const markup = [template[0]];
  for (let i = 1, {length} = arguments; i < length; i++)
    markup.push(arguments[i], template[i]);
  const content = createContent(markup.join(''), '' + this);
  fragment.set(template, content);
  return content;
}
