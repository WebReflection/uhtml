'use strict';
const udomdiff = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('udomdiff'));

const {isArray, slice} = require('./array.js');
const {getNode, wireType} = require('./node.js');

// This is tested live with browsers, but somehow
// basicHTML doesn't pass here.
const get = (item, i) => item.nodeType === wireType ?
  ((1 / i) < 0 ?
    /* istanbul ignore next */
    (i ? item.remove() : item.lastChild) :
    /* istanbul ignore next */
    (i ? item.valueOf() : item.firstChild)) :
  item
;

const handleAnything = (comment, nodes) => {
  let oldValue;
  const text = document.createTextNode('');
  const anyContent = newValue => {
    switch (typeof newValue) {
      case 'string':
      case 'number':
      case 'boolean':
        if (oldValue !== newValue) {
          oldValue = newValue;
          text.textContent = newValue;
          nodes = udomdiff(
            comment.parentNode,
            nodes,
            [text],
            get,
            comment
          );
        }
        break;
      case 'object':
      case 'undefined':
        if (newValue == null) {
          nodes = udomdiff(comment.parentNode, nodes, [], get, comment);
          break;
        }
      default:
        oldValue = newValue;
        if (isArray(newValue)) {
          if (newValue.length === 0)
            nodes = udomdiff(comment.parentNode, nodes, [], get, comment);
          else {
            switch (typeof newValue[0]) {
              case 'string':
              case 'number':
              case 'boolean':
                anyContent(String(newValue));
                break;
              default:
                nodes = udomdiff(
                  comment.parentNode,
                  nodes,
                  newValue,
                  get,
                  comment
                );
                break;
            }
          }
        }
        // There is no `else` here, meaning if the content
        // is not expected one, nothing happens, as easy as that.
        /* istanbul ignore else */
        else if ('ELEMENT_NODE' in newValue) {
          nodes = udomdiff(
            comment.parentNode,
            nodes,
            newValue.nodeType === 11 ?
              slice.call(newValue.childNodes) :
              [newValue],
            get,
            comment
          );
        }
        break;
    }
  };
  return anyContent;
};

const handleAttribute = (node, name) => {
  // hooks and ref
  if (name === 'ref')
    return ref => { ref.current = node; };

  // direct setters
  if (name.slice(0, 1) === '.') {
    const setter = name.slice(1);
    return value => { node[setter] = value; }
  }

  let oldValue;

  // events
  if (name.slice(0, 2) === 'on') {
    let type = name.slice(2);
    if (!(name in node) && name.toLowerCase() in node)
      type = type.toLowerCase();
    return newValue => {
      const info = isArray(newValue) ? newValue : [newValue, false];
      if (oldValue !== info[0]) {
        if (oldValue)
          node.removeEventListener(type, oldValue, info[1]);
        if (oldValue = info[0])
          node.addEventListener(type, oldValue, info[1]);
      }
    };
  }

  // all other cases
  let noOwner = true;
  const attribute = document.createAttribute(name);
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;
      if (oldValue == null) {
        if (!noOwner) {
          node.removeAttributeNode(attribute);
          noOwner = true;
        }
      }
      else {
        attribute.value = newValue;
        // There is no else case here.
        // If the attribute has no owner, it's set back.
        /* istanbul ignore else */
        if (noOwner) {
          node.setAttributeNode(attribute);
          noOwner = false;
        }
      }
    }
  };
};

const handleText = node => {
  let oldValue;
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;
      node.textContent = newValue == null ? '' : newValue;
    }
  };
};

function handlers(options) {
  const {type, path} = options;
  const node = path.reduce(getNode, this);
  return type === 'node' ?
    handleAnything(node, []) :
    (type === 'attr' ?
      handleAttribute(node, options.name) :
      handleText(node));
}
exports.handlers = handlers;
