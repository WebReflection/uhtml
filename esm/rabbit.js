import umap from 'umap';
import instrument from 'uparser';
import {indexOf, isArray} from 'uarray';
import {persistent} from 'uwire';

import {handlers} from './handlers.js';
import {createFragment, createWalker} from './node.js';

// from a fragment container, create an array of indexes
// related to its child nodes, so that it's possible
// to retrieve later on exact node via reducePath
const createPath = node => {
  const path = [];
  let {parentNode} = node;
  while (parentNode) {
    path.push(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
    parentNode = node.parentNode;
  }
  return path;
};

// the prefix is used to identify either comments, attributes, or nodes
// that contain the related unique id. In the attribute cases
// isµX="attribute-name" will be used to map current X update to that
// attribute name, while comments will be like <!--isµX-->, to map
// the update to that specific comment node, hence its parent.
// style and textarea will have <!--isµX--> text content, and are handled
// directly through text-only updates.
const prefix = 'isµ';

// Template Literals are unique per scope and static, meaning a template
// should be parsed once, and once only, as it will always represent the same
// content, within the exact same amount of updates each time.
// This cache relates each template to its unique content and updates.
const cache = umap(new WeakMap);

// a RegExp that helps checking nodes that cannot contain comments
const textOnly = /^(?:plaintext|script|style|textarea|title|xmp)$/i;

export const createCache = () => ({
  stack: [],    // each template gets a stack for each interpolation "hole"

  entry: null,  // each entry contains details, such as:
                //  * the template that is representing
                //  * the type of node it represents (html or svg)
                //  * the content fragment with all nodes
                //  * the list of updates per each node (template holes)
                //  * the "wired" node or fragment that will get updates
                // if the template or type are different from the previous one
                // the entry gets re-created each time

  wire: null    // each rendered node represent some wired content and
                // this reference to the latest one. If different, the node
                // will be cleaned up and the new "wire" will be appended
});

// the entry stored in the rendered node cache, and per each "hole"
const createEntry = (type, template) => {
  const {content, updates} = mapUpdates(type, template);
  return {type, template, content, updates, wire: null};
};

// a template is instrumented to be able to retrieve where updates are needed.
// Each unique template becomes a fragment, cloned once per each other
// operation based on the same template, i.e. data => html`<p>${data}</p>`
const mapTemplate = (type, template) => {
  const text = instrument(template, prefix, type === 'svg');
  const content = createFragment(text, type);
  // once instrumented and reproduced as fragment, it's crawled
  // to find out where each update is in the fragment tree
  const tw = createWalker(content);
  const nodes = [];
  const length = template.length - 1;
  let i = 0;
  // updates are searched via unique names, linearly increased across the tree
  // <div isµ0="attr" isµ1="other"><!--isµ2--><style><!--isµ3--</style></div>
  let search = `${prefix}${i}`;
  while (i < length) {
    const node = tw.nextNode();
    // if not all updates are bound but there's nothing else to crawl
    // it means that there is something wrong with the template.
    if (!node)
      throw `bad template: ${text}`;
    // if the current node is a comment, and it contains isµX
    // it means the update should take care of any content
    if (node.nodeType === 8) {
      // The only comments to be considered are those
      // which content is exactly the same as the searched one.
      if (node.data === search) {
        nodes.push({type: 'node', path: createPath(node)});
        search = `${prefix}${++i}`;
      }
    }
    else {
      // if the node is not a comment, loop through all its attributes
      // named isµX and relate attribute updates to this node and the
      // attribute name, retrieved through node.getAttribute("isµX")
      // the isµX attribute will be removed as irrelevant for the layout
      // let svg = -1;
      while (node.hasAttribute(search)) {
        nodes.push({
          type: 'attr',
          path: createPath(node),
          name: node.getAttribute(search),
          //svg: svg < 0 ? (svg = ('ownerSVGElement' in node ? 1 : 0)) : svg
        });
        node.removeAttribute(search);
        search = `${prefix}${++i}`;
      }
      // if the node was a style, textarea, or others, check its content
      // and if it is <!--isµX--> then update tex-only this node
      if (
        textOnly.test(node.tagName) &&
        node.textContent.trim() === `<!--${search}-->`
      ){
        node.textContent = '';
        nodes.push({type: 'text', path: createPath(node)});
        search = `${prefix}${++i}`;
      }
    }
  }
  // once all nodes to update, or their attributes, are known, the content
  // will be cloned in the future to represent the template, and all updates
  // related to such content retrieved right away without needing to re-crawl
  // the exact same template, and its content, more than once.
  return {content, nodes};
};

// if a template is unknown, perform the previous mapping, otherwise grab
// its details such as the fragment with all nodes, and updates info.
const mapUpdates = (type, template) => {
  const {content, nodes} = (
    cache.get(template) ||
    cache.set(template, mapTemplate(type, template))
  );
  // clone deeply the fragment
  const fragment = document.importNode(content, true);
  // and relate an update handler per each node that needs one
  const updates = nodes.map(handlers, fragment);
  // return the fragment and all updates to use within its nodes
  return {content: fragment, updates};
};

// as html and svg can be nested calls, but no parent node is known
// until rendered somewhere, the unroll operation is needed to
// discover what to do with each interpolation, which will result
// into an update operation.
export const unroll = (info, {type, template, values}) => {
  const {length} = values;
  // interpolations can contain holes and arrays, so these need
  // to be recursively discovered
  unrollValues(info, values, length);
  let {entry} = info;
  // if the cache entry is either null or different from the template
  // and the type this unroll should resolve, create a new entry
  // assigning a new content fragment and the list of updates.
  if (!entry || (entry.template !== template || entry.type !== type))
    info.entry = (entry = createEntry(type, template));
  const {content, updates, wire} = entry;
  // even if the fragment and its nodes is not live yet,
  // it is already possible to update via interpolations values.
  for (let i = 0; i < length; i++)
    updates[i](values[i]);
  // if the entry was new, or representing a different template or type,
  // create a new persistent entity to use during diffing.
  // This is simply a DOM node, when the template has a single container,
  // as in `<p></p>`, or a "wire" in `<p></p><p></p>` and similar cases.
  return wire || (entry.wire = persistent(content));
};

// the stack retains, per each interpolation value, the cache
// related to each interpolation value, or null, if the render
// was conditional and the value is not special (Array or Hole)
const unrollValues = ({stack}, values, length) => {
  for (let i = 0; i < length; i++) {
    const hole = values[i];
    // each Hole gets unrolled and re-assigned as value
    // so that domdiff will deal with a node/wire, not with a hole
    if (hole instanceof Hole)
      values[i] = unroll(
        stack[i] || (stack[i] = createCache()),
        hole
      );
    // arrays are recursively resolved so that each entry will contain
    // also a DOM node or a wire, hence it can be diffed if/when needed
    else if (isArray(hole))
      unrollValues(
        stack[i] || (stack[i] = createCache()),
        hole,
        hole.length
      );
    // if the value is nothing special, the stack doesn't need to retain data
    // this is useful also to cleanup previously retained data, if the value
    // was a Hole, or an Array, but not anymore, i.e.:
    // const update = content => html`<div>${content}</div>`;
    // update(listOfItems); update(null); update(html`hole`)
    else
      stack[i] = null;
  }
  if (length < stack.length)
    stack.splice(length);
};

/**
 * Holds all details wrappers needed to render the content further on.
 * @constructor
 * @param {string} type The hole type, either `html` or `svg`.
 * @param {string[]} template The template literals used to the define the content.
 * @param {Array} values Zero, one, or more interpolated values to render.
 */
export function Hole(type, template, values) {
  this.type = type;
  this.template = template;
  this.values = values;
};
