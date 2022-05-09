self.uhtml = (function (exports) {
  'use strict';

  class MapSet extends Map {
    set(key, value) {
      super.set(key, value);
      return value;
    }
  }

  class WeakMapSet extends WeakMap {
    set(key, value) {
      super.set(key, value);
      return value;
    }
  }

  /*! (c) Andrea Giammarchi - ISC */
  const empty = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
  const elements = /<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/?)>/g;
  const attributes = /([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g;
  const holes = /[\x01\x02]/g;

  // \x01 Node.ELEMENT_NODE
  // \x02 Node.ATTRIBUTE_NODE

  /**
   * Given a template, find holes as both nodes and attributes and
   * return a string with holes as either comment nodes or named attributes.
   * @param {string[]} template a template literal tag array
   * @param {string} prefix prefix to use per each comment/attribute
   * @param {boolean} svg enforces self-closing tags
   * @returns {string} X/HTML with prefixed comments or attributes
   */
  var instrument = (template, prefix, svg) => {
    let i = 0;
    return template
            .join('\x01')
            .trim()
            .replace(
              elements,
              (_, name, attrs, selfClosing) => {
                let ml = name + attrs.replace(attributes, '\x02=$2$1').trimEnd();
                if (selfClosing.length)
                  ml += (svg || empty.test(name)) ? ' /' : ('></' + name);
                return '<' + ml + '>';
              }
            )
            .replace(
              holes,
              hole => hole === '\x01' ?
                ('<!--' + prefix + i++ + '-->') :
                (prefix + i++)
            );
  };

  const ELEMENT_NODE = 1;
  const nodeType = 111;

  const remove = ({firstChild, lastChild}) => {
    const range = document.createRange();
    range.setStartAfter(firstChild);
    range.setEndAfter(lastChild);
    range.deleteContents();
    return firstChild;
  };

  const diffable = (node, operation) => node.nodeType === nodeType ?
    ((1 / operation) < 0 ?
      (operation ? remove(node) : node.lastChild) :
      (operation ? node.valueOf() : node.firstChild)) :
    node
  ;

  const persistent = fragment => {
    const {firstChild, lastChild} = fragment;
    if (firstChild === lastChild)
      return lastChild || fragment;
    const {childNodes} = fragment;
    const nodes = [...childNodes];
    return {
      ELEMENT_NODE,
      nodeType,
      firstChild,
      lastChild,
      valueOf() {
        if (childNodes.length !== nodes.length)
          fragment.append(...nodes);
        return fragment;
      }
    };
  };

  const {isArray: isArray$1} = Array;

  const aria = node => values => {
    for (const key in values) {
      const name = key === 'role' ? key : `aria-${key}`;
      const value = values[key];
      if (value == null)
        node.removeAttribute(name);
      else
        node.setAttribute(name, value);
    }
  };

  const attribute = (node, name) => {
    let oldValue, orphan = true;
    const attributeNode = document.createAttributeNS(null, name);
    return newValue => {
      if (oldValue !== newValue) {
        oldValue = newValue;
        if (oldValue == null) {
          if (!orphan) {
            node.removeAttributeNode(attributeNode);
            orphan = true;
          }
        }
        else {
          const value = newValue;
          if (value == null) {
            if (!orphan)
              node.removeAttributeNode(attributeNode);
              orphan = true;
          }
          else {
            attributeNode.value = value;
            if (orphan) {
              node.setAttributeNodeNS(attributeNode);
              orphan = false;
            }
          }
        }
      }
    };
  };

  const boolean = (node, key, oldValue) => newValue => {
    if (oldValue !== !!newValue) {
      // when IE won't be around anymore ...
      // node.toggleAttribute(key, oldValue = !!newValue);
      if ((oldValue = !!newValue))
        node.setAttribute(key, '');
      else
        node.removeAttribute(key);
    }
  };

  const data = ({dataset}) => values => {
    for (const key in values) {
      const value = values[key];
      if (value == null)
        delete dataset[key];
      else
        dataset[key] = value;
    }
  };

  const event = (node, name) => {
    let oldValue, lower, type = name.slice(2);
    if (!(name in node) && (lower = name.toLowerCase()) in node)
      type = lower.slice(2);
    return newValue => {
      const info = isArray$1(newValue) ? newValue : [newValue, false];
      if (oldValue !== info[0]) {
        if (oldValue)
          node.removeEventListener(type, oldValue, info[1]);
        if (oldValue = info[0])
          node.addEventListener(type, oldValue, info[1]);
      }
    };
  };

  const ref = node => {
    let oldValue;
    return value => {
      if (oldValue !== value) {
        oldValue = value;
        if (typeof value === 'function')
          value(node);
        else
          value.current = node;
      }
    };
  };

  const setter = (node, key) => key === 'dataset' ?
    data(node) :
    value => {
      node[key] = value;
    };

  const text = node => {
    let oldValue;
    return newValue => {
      if (oldValue != newValue) {
        oldValue = newValue;
        node.textContent = newValue == null ? '' : newValue;
      }
    };
  };

  /**
   * ISC License
   *
   * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */

  /**
   * @param {Node} parentNode The container where children live
   * @param {Node[]} a The list of current/live children
   * @param {Node[]} b The list of future children
   * @param {(entry: Node, action: number) => Node} get
   * The callback invoked per each entry related DOM operation.
   * @param {Node} [before] The optional node used as anchor to insert before.
   * @returns {Node[]} The same list of future children.
   */
  var udomdiff = (parentNode, a, b, get, before) => {
    const bLength = b.length;
    let aEnd = a.length;
    let bEnd = bLength;
    let aStart = 0;
    let bStart = 0;
    let map = null;
    while (aStart < aEnd || bStart < bEnd) {
      // append head, tail, or nodes in between: fast path
      if (aEnd === aStart) {
        // we could be in a situation where the rest of nodes that
        // need to be added are not at the end, and in such case
        // the node to `insertBefore`, if the index is more than 0
        // must be retrieved, otherwise it's gonna be the first item.
        const node = bEnd < bLength ?
          (bStart ?
            (get(b[bStart - 1], -0).nextSibling) :
            get(b[bEnd - bStart], 0)) :
          before;
        while (bStart < bEnd)
          parentNode.insertBefore(get(b[bStart++], 1), node);
      }
      // remove head or tail: fast path
      else if (bEnd === bStart) {
        while (aStart < aEnd) {
          // remove the node only if it's unknown or not live
          if (!map || !map.has(a[aStart]))
            parentNode.removeChild(get(a[aStart], -1));
          aStart++;
        }
      }
      // same node: fast path
      else if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
      }
      // same tail: fast path
      else if (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      // The once here single last swap "fast path" has been removed in v1.1.0
      // https://github.com/WebReflection/udomdiff/blob/single-final-swap/esm/index.js#L69-L85
      // reverse swap: also fast path
      else if (
        a[aStart] === b[bEnd - 1] &&
        b[bStart] === a[aEnd - 1]
      ) {
        // this is a "shrink" operation that could happen in these cases:
        // [1, 2, 3, 4, 5]
        // [1, 4, 3, 2, 5]
        // or asymmetric too
        // [1, 2, 3, 4, 5]
        // [1, 2, 3, 5, 6, 4]
        const node = get(a[--aEnd], -1).nextSibling;
        parentNode.insertBefore(
          get(b[bStart++], 1),
          get(a[aStart++], -1).nextSibling
        );
        parentNode.insertBefore(get(b[--bEnd], 1), node);
        // mark the future index as identical (yeah, it's dirty, but cheap 👍)
        // The main reason to do this, is that when a[aEnd] will be reached,
        // the loop will likely be on the fast path, as identical to b[bEnd].
        // In the best case scenario, the next loop will skip the tail,
        // but in the worst one, this node will be considered as already
        // processed, bailing out pretty quickly from the map index check
        a[aEnd] = b[bEnd];
      }
      // map based fallback, "slow" path
      else {
        // the map requires an O(bEnd - bStart) operation once
        // to store all future nodes indexes for later purposes.
        // In the worst case scenario, this is a full O(N) cost,
        // and such scenario happens at least when all nodes are different,
        // but also if both first and last items of the lists are different
        if (!map) {
          map = new Map;
          let i = bStart;
          while (i < bEnd)
            map.set(b[i], i++);
        }
        // if it's a future node, hence it needs some handling
        if (map.has(a[aStart])) {
          // grab the index of such node, 'cause it might have been processed
          const index = map.get(a[aStart]);
          // if it's not already processed, look on demand for the next LCS
          if (bStart < index && index < bEnd) {
            let i = aStart;
            // counts the amount of nodes that are the same in the future
            let sequence = 1;
            while (++i < aEnd && i < bEnd && map.get(a[i]) === (index + sequence))
              sequence++;
            // effort decision here: if the sequence is longer than replaces
            // needed to reach such sequence, which would brings again this loop
            // to the fast path, prepend the difference before a sequence,
            // and move only the future list index forward, so that aStart
            // and bStart will be aligned again, hence on the fast path.
            // An example considering aStart and bStart are both 0:
            // a: [1, 2, 3, 4]
            // b: [7, 1, 2, 3, 6]
            // this would place 7 before 1 and, from that time on, 1, 2, and 3
            // will be processed at zero cost
            if (sequence > (index - bStart)) {
              const node = get(a[aStart], 0);
              while (bStart < index)
                parentNode.insertBefore(get(b[bStart++], 1), node);
            }
            // if the effort wasn't good enough, fallback to a replace,
            // moving both source and target indexes forward, hoping that some
            // similar node will be found later on, to go back to the fast path
            else {
              parentNode.replaceChild(
                get(b[bStart++], 1),
                get(a[aStart++], -1)
              );
            }
          }
          // otherwise move the source forward, 'cause there's nothing to do
          else
            aStart++;
        }
        // this node has no meaning in the future list, so it's more than safe
        // to remove it, and check the next live node out instead, meaning
        // that only the live list index should be forwarded
        else
          parentNode.removeChild(get(a[aStart++], -1));
      }
    }
    return b;
  };

  const {isArray, prototype} = Array;
  const {indexOf} = prototype;

  const {
    createDocumentFragment,
    createElement,
    createElementNS,
    createTextNode,
    createTreeWalker,
    importNode
  } = new Proxy(document, {
    get: (target, method) => target[method].bind(target)
  });

  const createHTML = html => {
    const template = createElement('template');
    template.innerHTML = html;
    return template.content;
  };

  let xml;
  const createSVG = svg => {
    if (!xml) xml = createElementNS('http://www.w3.org/2000/svg', 'svg');
    xml.innerHTML = svg;
    const content = createDocumentFragment();
    content.append(...xml.childNodes);
    return content;
  };

  const createContent = (text, svg) => svg ?
                                createSVG(text) : createHTML(text);

  // from a generic path, retrieves the exact targeted node
  const reducePath = ({childNodes}, i) => childNodes[i];

  // this helper avoid code bloat around handleAnything() callback
  const diff = (comment, oldNodes, newNodes) => udomdiff(
    comment.parentNode,
    // TODO: there is a possible edge case where a node has been
    //       removed manually, or it was a keyed one, attached
    //       to a shared reference between renders.
    //       In this case udomdiff might fail at removing such node
    //       as its parent won't be the expected one.
    //       The best way to avoid this issue is to filter oldNodes
    //       in search of those not live, or not in the current parent
    //       anymore, but this would require both a change to uwire,
    //       exposing a parentNode from the firstChild, as example,
    //       but also a filter per each diff that should exclude nodes
    //       that are not in there, penalizing performance quite a lot.
    //       As this has been also a potential issue with domdiff,
    //       and both lighterhtml and hyperHTML might fail with this
    //       very specific edge case, I might as well document this possible
    //       "diffing shenanigan" and call it a day.
    oldNodes,
    newNodes,
    diffable,
    comment
  );

  // if an interpolation represents a comment, the whole
  // diffing will be related to such comment.
  // This helper is in charge of understanding how the new
  // content for such interpolation/hole should be updated
  const handleAnything = comment => {
    let oldValue, text, nodes = [];
    const anyContent = newValue => {
      switch (typeof newValue) {
        // primitives are handled as text content
        case 'string':
        case 'number':
        case 'boolean':
          if (oldValue !== newValue) {
            oldValue = newValue;
            if (!text)
              text = createTextNode('');
            text.data = newValue;
            nodes = diff(comment, nodes, [text]);
          }
          break;
        // null, and undefined are used to cleanup previous content
        case 'object':
        case 'undefined':
          if (newValue == null) {
            if (oldValue != newValue) {
              oldValue = newValue;
              nodes = diff(comment, nodes, []);
            }
            break;
          }
          // arrays and nodes have a special treatment
          if (isArray(newValue)) {
            oldValue = newValue;
            // arrays can be used to cleanup, if empty
            if (newValue.length === 0)
              nodes = diff(comment, nodes, []);
            // or diffed, if these contains nodes or "wires"
            else if (typeof newValue[0] === 'object')
              nodes = diff(comment, nodes, newValue);
            // in all other cases the content is stringified as is
            else
              anyContent(String(newValue));
            break;
          }
          // if the new value is a DOM node, or a wire, and it's
          // different from the one already live, then it's diffed.
          // if the node is a fragment, it's appended once via its childNodes
          // There is no `else` here, meaning if the content
          // is not expected one, nothing happens, as easy as that.
          if (oldValue !== newValue && 'ELEMENT_NODE' in newValue) {
            oldValue = newValue;
            nodes = diff(
              comment,
              nodes,
              newValue.nodeType === 11 ?
                [...newValue.childNodes] :
                [newValue]
            );
          }
          break;
        case 'function':
          anyContent(newValue(comment));
          break;
      }
    };
    return anyContent;
  };

  // attributes can be:
  //  * ref=${...}      for hooks and other purposes
  //  * aria=${...}     for aria attributes
  //  * ?boolean=${...} for boolean attributes
  //  * .dataset=${...} for dataset related attributes
  //  * .setter=${...}  for Custom Elements setters or nodes with setters
  //                    such as buttons, details, options, select, etc
  //  * @event=${...}   to explicitly handle event listeners
  //  * onevent=${...}  to automatically handle event listeners
  //  * generic=${...}  to handle an attribute just like an attribute
  const handleAttribute = (node, name/*, svg*/) => {
    switch (name[0]) {
      case '?': return boolean(node, name.slice(1), false);
      case '.': return setter(node, name.slice(1));
      case '@': return event(node, 'on' + name.slice(1));
      case 'o': if (name[1] === 'n') return event(node, name);
    }

    switch (name) {
      case 'ref': return ref(node);
      case 'aria': return aria(node);
    }

    return attribute(node, name/*, svg*/);
  };

  // each mapped update carries the update type and its path
  // the type is either node, attribute, or text, while
  // the path is how to retrieve the related node to update.
  // In the attribute case, the attribute name is also carried along.
  function handlers(options) {
    const {type, path} = options;
    const node = path.reduceRight(reducePath, this);
    return type === 'node' ?
      handleAnything(node) :
      (type === 'attr' ?
        handleAttribute(node, options.name/*, options.svg*/) :
        text(node));
  }

  // from a fragment container, create an array of indexes
  // related to its child nodes, so that it's possible
  // to retrieve later on exact node via reducePath
  const createPath = node => {
    const path = [];
    let {parentNode} = node;
    while (parentNode) {
      path.push(indexOf.call(parentNode.childNodes, node));
      node = parentNode;
      ({parentNode} = node);
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
  const cache$1 = new WeakMapSet;

  // a RegExp that helps checking nodes that cannot contain comments
  const textOnly = /^(?:textarea|script|style|title|plaintext|xmp)$/;

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

  // the entry stored in the rendered node cache, and per each "hole"
  const createEntry = (type, template) => {
    const {content, updates} = mapUpdates(type, template);
    return {type, template, content, updates, wire: null};
  };

  // a template is instrumented to be able to retrieve where updates are needed.
  // Each unique template becomes a fragment, cloned once per each other
  // operation based on the same template, i.e. data => html`<p>${data}</p>`
  const mapTemplate = (type, template) => {
    const svg = type === 'svg';
    const text = instrument(template, prefix, svg);
    const content = createContent(text, svg);
    // once instrumented and reproduced as fragment, it's crawled
    // to find out where each update is in the fragment tree
    const tw = createTreeWalker(content, 1 | 128);
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
            name: node.getAttribute(search)
          });
          node.removeAttribute(search);
          search = `${prefix}${++i}`;
        }
        // if the node was a style, textarea, or others, check its content
        // and if it is <!--isµX--> then update tex-only this node
        if (
          textOnly.test(node.localName) &&
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
      cache$1.get(template) ||
      cache$1.set(template, mapTemplate(type, template))
    );
    // clone deeply the fragment
    const fragment = importNode(content, true);
    // and relate an update handler per each node that needs one
    const updates = nodes.map(handlers, fragment);
    // return the fragment and all updates to use within its nodes
    return {content: fragment, updates};
  };

  // as html and svg can be nested calls, but no parent node is known
  // until rendered somewhere, the unroll operation is needed to
  // discover what to do with each interpolation, which will result
  // into an update operation.
  const unroll = (info, {type, template, values}) => {
    // interpolations can contain holes and arrays, so these need
    // to be recursively discovered
    const length = unrollValues(info, values);
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
  const unrollValues = ({stack}, values) => {
    const {length} = values;
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
        unrollValues(stack[i] || (stack[i] = createCache()), hole);
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
    return length;
  };

  /**
   * Holds all details wrappers needed to render the content further on.
   * @constructor
   * @param {string} type The hole type, either `html` or `svg`.
   * @param {string[]} template The template literals used to the define the content.
   * @param {Array} values Zero, one, or more interpolated values to render.
   */
  class Hole {
    constructor(type, template, values) {
      this.type = type;
      this.template = template;
      this.values = values;
    }
  }

  // both `html` and `svg` template literal tags are polluted
  // with a `for(ref[, id])` and a `node` tag too
  const tag = type => {
    // both `html` and `svg` tags have their own cache
    const keyed = new WeakMapSet;
    // keyed operations always re-use the same cache and unroll
    // the template and its interpolations right away
    const fixed = cache => (template, ...values) => unroll(
      cache,
      {type, template, values}
    );
    return Object.assign(
      // non keyed operations are recognized as instance of Hole
      // during the "unroll", recursively resolved and updated
      (template, ...values) => new Hole(type, template, values),
      {
        // keyed operations need a reference object, usually the parent node
        // which is showing keyed results, and optionally a unique id per each
        // related node, handy with JSON results and mutable list of objects
        // that usually carry a unique identifier
        for(ref, id) {
          const memo = keyed.get(ref) || keyed.set(ref, new MapSet);
          return memo.get(id) || memo.set(id, fixed(createCache()));
        },
        // it is possible to create one-off content out of the box via node tag
        // this might return the single created node, or a fragment with all
        // nodes present at the root level and, of course, their child nodes
        node: (template, ...values) => unroll(createCache(), new Hole(type, template, values)).valueOf()
      }
    );
  };

  // each rendered node gets its own cache
  const cache = new WeakMapSet;

  // rendering means understanding what `html` or `svg` tags returned
  // and it relates a specific node to its own unique cache.
  // Each time the content to render changes, the node is cleaned up
  // and the new new content is appended, and if such content is a Hole
  // then it's "unrolled" to resolve all its inner nodes.
  const render = (where, what) => {
    const hole = typeof what === 'function' ? what() : what;
    const info = cache.get(where) || cache.set(where, createCache());
    const wire = hole instanceof Hole ? unroll(info, hole) : hole;
    if (wire !== info.wire) {
      info.wire = wire;
      // valueOf() simply returns the node itself, but in case it was a "wire"
      // it will eventually re-append all nodes to its fragment so that such
      // fragment can be re-appended many times in a meaningful way
      // (wires are basically persistent fragments facades with special behavior)
      where.replaceChildren(wire.valueOf());
    }
    return where;
  };

  const html = tag('html');
  const svg = tag('svg');

  exports.Hole = Hole;
  exports.html = html;
  exports.render = render;
  exports.svg = svg;

  return exports;

})({});
