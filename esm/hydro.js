import { COMMENT_NODE, TEXT_NODE } from 'domconstants/constants';
import { abc, cache, detail } from './literals.js';
import { empty, find, set } from './utils.js';
import { array, hole } from './handler.js';
import { parse } from './parser.js';
import {
  Hole,
  render as _render,
  html, svg,
  htmlFor, svgFor,
  attr
} from './keyed.js';

const parseHTML = parse(false, true);
const parseSVG = parse(true, true);

const parent = () => ({ childNodes: [] });

const skip = (node, data) => {

};

const reMap = (parentNode, { childNodes }) => {
  for (let first = true, { length } = childNodes; length--;) {
    let node = childNodes[length];
    switch (node.nodeType) {
      case COMMENT_NODE:
        if (node.data === '</>') {
          let nested = 0;
          while (node = node.previousSibling) {
            length--;
            if (node.nodeType === COMMENT_NODE) {
              if (node.data === '</>') nested++;
              else if (node.data === '<>') {
                if (!nested--) break;
              }
            }
            else
              parentNode.childNodes.unshift(node);
          }
        }
        else if (/\[(\d+)\]/.test(node.data)) {
          let many = +RegExp.$1;
          parentNode.childNodes.unshift(node);
          while (many--) {
            node = node.previousSibling;
            if (node.nodeType === COMMENT_NODE && node.data === '}') {
              node = skip(node, '{');
            }
          }
        }
        break;
      case TEXT_NODE:
        // ignore browser artifacts on closing fragments
        if (first && !node.data.trim()) break;
      default:
        parentNode.childNodes.unshift(node);
        break;
    }
    first = false;
  }
  return parentNode;
};

const hydrate = (root, {s, t, v}) => {
  debugger;
  const { b: entries, c: direct } = (s ? parseSVG : parseHTML)(t, v);
  const { length } = entries;
  // let's assume hydro is used on purpose with valid templates
  // to use entries meaningfully re-map the container.
  // This is complicated yet possible.
  //  * fragments are allowed only top-level
  //    * nested fragments will likely be wrapped in holes
  //  * arrays can point at either fragments, DOM nodes, or holes
  //    * arrays can't be path-addressed if not for the comment itself
  //    * ideally their previous content should be pre-populated with nodes, holes and fragments
  //  * it is possible that the whole dance is inside-out so that nested normalized content
  //    can be then addressed (as already live) by the outer content
  const fake = reMap(parent(), root, direct);
  const details = length ? [] : empty;
  for (let current, prev, i = 0; i < length; i++) {
    const { a: path, b: update, c: name } = entries[i];
    // adjust the length of the first path node
    if (!direct) path[path.length - 1]++;
    // TODO: node should be adjusted if it's array or hole
    //       * if it's array, no way caching it as current helps
    //       * if it's a hole or attribute/text thing, current helps
    let node = path === prev ? current : (current = find(root, (prev = path)));
    if (!direct) path[path.length - 1]--;
    details[i] = detail(
      update,
      node,
      name,
      // TODO: find and resolve the array via the next `<!--[i]-->`
      // TODO: resolve the cache via the surrounding hole
      update === array ? [] : (update === hole ? cache() : null)
    );
  }
  return abc(t, root, details);
};

const known = new WeakMap;

const render = (where, what) => {
  const hole = typeof what === 'function' ? what() : what;
  if (hole instanceof Hole) {
    const info = known.get(where) || set(known, where, hydrate(where, hole));
    if (info.a === hole.t) {
      hole.toDOM(info);
      return where;
    }
  }
  return _render(where, hole);
};

const { document } = globalThis;

export { Hole, document, render, html, svg, htmlFor, svgFor, attr };
