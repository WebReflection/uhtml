import createContent from '@ungap/create-content';
import importNode from '@ungap/import-node';

const {create} = Object;
const {forEach} = [];

const content = new WeakMap;
const fragment = new WeakMap;
const nope = {what: null};

export const render = (where, what) => {
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

export function html(template) {
  return fragment.get(template) || parse.apply('html', arguments);
};

export function svg(template) {
  return fragment.get(template) || parse.apply('svg', arguments);
};

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
