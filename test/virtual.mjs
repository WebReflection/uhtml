const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

const mapped = new WeakMap;

const asArray = data => /^\[(\d+)\]$/.test(data) ? +RegExp.$1 : -1;

const faker = ({ tagName }) => ({ tagName, childNodes: [] });

const skipArray = (node, many) => {
  return many;
};

// in a hole there could be:
//  * a fragment
//  * a hole
//  * an element
//  * a dom node
const skipHole = (fake, node) => {
  let first = true, level = 0;
  fake.unshift(node);
  while ((node = node.previousSibling)) {
    if (node.nodeType === COMMENT_NODE) {
      const { data } = node;
      if (data === '{') {
        if (!level--) {
          fake.unshift(node);
          return;
        }
      }
      else if (data === '}') {
        if (!level++ && first) {
          // hole in a hole
        }
      }
      else if (first && data === '</>') {
        // fragment in hole
      }
    }
    // element or text in hole
    else if (first) fake.unshift(node);
    first = false;
  }
};

const virtual = (parent, asFragment) => {
  let ref = mapped.get(parent);
  if (!ref) {
    mapped.set(parent, (ref = faker(parent)));
    const { childNodes: fake } = ref;
    const { childNodes: live } = parent;
    for (let { length } = live; length--;) {
      let node = live[length];
      switch (node.nodeType) {
        case ELEMENT_NODE:
          fake.unshift(virtual(node, false));
          break;
        case COMMENT_NODE: {
          const { data } = node;
          if (data === '}') {
            skipHole(fake, node);
            length -= 2;
          }
          else if (data === '</>') {

          }
          else {
            fake.unshift(node);
            const many = asArray(data);
            if (-1 < many)
              length -= skipArray(node, many);
          }
          break;
        }
        case TEXT_NODE:
          if (asFragment && !node.data.trim()) break;
          fake.unshift(node);
      }
      asFragment = false;
    }
  }
  return ref;
};


import init from '../esm/init-ssr.js';

const { document, render, html } = init();

const reveal = ({ tagName, childNodes }, level = 0) => {
  const out = [];
  out.push('\n', '  '.repeat(level), `<${tagName}>`);
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    switch (node.nodeType) {
      case COMMENT_NODE:
        if (!i) out.push('\n', '  '.repeat(level + 1));
        out.push(`<!--${node.data}-->`);
        break;
      case TEXT_NODE:
        if (!i) out.push('\n', '  '.repeat(level + 1));
        out.push(node.data);
        break;
      default:
        out.push(reveal(node, level + 1));
        break;
    }
  }
  out.push('\n', '  '.repeat(level), `</${tagName}>`);
  return out.join('');
};

render(document.body, html`<div>a${[html`b`]}c${[html`d`, html`e`]}f</div>`);
console.log(document.body.toString());

console.debug(virtual(document.body, false).childNodes[0]);
console.log(reveal(virtual(document.body, false)));
