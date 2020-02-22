import {isArray, slice} from './array.js';
import {getNode, noChildNodes, removeAttributeNode} from './node.js';
import {quickdiff} from './quickdiff.js';

const get = (item, i) => item.nodeType === 11 ?
  (
    (1 / i) < 0 ?
      (i ? item.remove() : item.lastChild) :
      (i ? item.valueOf() : item.firstChild)
  ) :
  item
;

const handleAnything = (node, childNodes) => {
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
          childNodes = quickdiff(
            node.parentNode,
            childNodes,
            [text],
            get,
            node
          );
        }
        break;
      case 'object':
      case 'undefined':
        if (newValue == null) {
          childNodes = quickdiff(node.parentNode, childNodes, [], get, node);
          break;
        }
      default:
        oldValue = newValue;
        if (isArray(newValue)) {
          if (newValue.length === 0)
            childNodes = quickdiff(node.parentNode, childNodes, [], get, node);
          else {
            switch (typeof newValue[0]) {
              case 'string':
              case 'number':
              case 'boolean':
                anyContent(String(newValue));
                break;
              default:
                childNodes = quickdiff(
                  node.parentNode,
                  childNodes,
                  newValue,
                  get,
                  node
                );
                break;
            }
          }
        }
        else if ('ELEMENT_NODE' in newValue) {
          childNodes = quickdiff(
            node.parentNode,
            childNodes,
            newValue.nodeType === 11 ?
              slice.call(newValue.childNodes) :
              [newValue],
            get,
            node
          );
        }
        break;
    }
  };
  return anyContent;
};

const handleAttribute = (node, attribute, name, isSVG) => {
  // hooks and ref
  if (name === 'ref')
    return ref => { ref.current = node; };

  // direct setters
  if (name.slice(0, 1) === '.') {
    removeAttributeNode(node, attribute);
    return isSVG ?
      value => {
        try { node[name] = value; }
        catch (nope) { node.setAttribute(name, value); }
      } :
      value => { node[name] = value; };
  }

  let oldValue;

  // events
  if (name.slice(0, 2) === 'on') {
    removeAttributeNode(node, attribute);
    let type = name.slice(2);
    if (name.toLowerCase() in node)
      type = type.toLowerCase();
    return newValue => {
      if (oldValue !== newValue) {
        if (oldValue)
          node.removeEventListener(type, oldValue, false);
        oldValue = newValue;
        if (newValue)
          node.addEventListener(type, newValue, false);
      }
    };
  }

  // all other cases
  let noOwner = false;
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;
      if (oldValue == null) {
        if (!noOwner) {
          removeAttributeNode(node, attribute);
          noOwner = true;
        }
      }
      else {
        attribute.value = newValue;
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

export function handlers({type, path, name}) {
  const node = path.reduce(getNode, this);
  return type === 'attr' ?
    handleAttribute(
      node,
      node.getAttributeNode(name),
      name,
      type === 'svg'
    ) :
    (noChildNodes(name) ?
      handleText(node) :
      handleAnything(node, []));
};
