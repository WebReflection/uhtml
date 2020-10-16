'use strict';
const {isArray} = require('uarray');
const {persistent} = require('uwire');

const mapUpdates = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('./updates.js'));

const createCache = () => ({
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
exports.createCache = createCache;

// the entry stored in the rendered node cache, and per each "hole"
const createEntry = (type, template) => {
  const {content, updates} = mapUpdates(type, template);
  return {type, template, content, updates, wire: null};
};

// as html and svg can be nested calls, but no parent node is known
// until rendered somewhere, the unroll operation is needed to
// discover what to do with each interpolation, which will result
// into an update operation.
const unroll = (info, {type, template, values}) => {
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
exports.unroll = unroll;

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
function Hole(type, template, values) {
  this.type = type;
  this.template = template;
  this.values = values;
}
exports.Hole = Hole;
