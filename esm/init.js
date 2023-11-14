
// ⚠️ WARNING - THIS FILE IS AN ARTIFACT - DO NOT EDIT

/**
 * @param {Document} document
 * @returns {import("./keyed.js")}
 */
export default document => (function (exports) {
  'use strict';

  const { constructor: DocumentFragment } = document.createDocumentFragment();

  const { isArray } = Array;

  const empty = [];

  const newRange = () => document.createRange();

  /**
   * Set the `key` `value` pair to the *Map* or *WeakMap* and returns the `value`
   * @template T
   * @param {Map | WeakMap} map
   * @param {any} key
   * @param {T} value
   * @returns {T}
   */
  const set = (map, key, value) => {
    map.set(key, value);
    return value;
  };

  /** @typedef {import("domconstants/constants").ATTRIBUTE_NODE} ATTRIBUTE_NODE */
  /** @typedef {import("domconstants/constants").TEXT_NODE} TEXT_NODE */
  /** @typedef {import("domconstants/constants").COMMENT_NODE} COMMENT_NODE */
  /** @typedef {ATTRIBUTE_NODE | TEXT_NODE | COMMENT_NODE} Type */

  /** @typedef {import("./persistent-fragment.js").PersistentFragment} PersistentFragment */
  /** @typedef {import("./rabbit.js").Hole} Hole */

  /** @typedef {Node | Element | PersistentFragment} Target */
  /** @typedef {null | undefined | string | number | boolean | Hole} Value */
  /** @typedef {null | undefined | string | number | boolean | Node | Element | PersistentFragment} DOMValue */

  /**
   * @typedef {Object} Entry
   * @property {Type} type
   * @property {number[]} path
   * @property {function} update
   * @property {string} name
   */

  /**
   * @param {PersistentFragment} c content retrieved from the template
   * @param {Entry[]} e entries per each hole in the template
   * @param {number} l the length of content childNodes
   * @returns
   */
  const cel = (c, e, l) => ({ c, e, l });

  /**
   * @typedef {Object} HoleDetails
   * @property {null | Node | PersistentFragment} n the current live node, if any and not the `t` one
   */

  /** @type {() => HoleDetails} */
  const comment = () => ({ n: null });

  /**
   * @typedef {Object} Detail
   * @property {any} v the current value of the interpolation / hole
   * @property {function} u the callback to update the value
   * @property {Node} t the target comment node or element
   * @property {string} n the name of the attribute, if any
   */

  /**
   * @param {any} v the current value of the interpolation / hole
   * @param {function} u the callback to update the value
   * @param {Node} t the target comment node or element
   * @param {string} n the name of the attribute, if any
   * @returns {Detail}
   */
  const detail = (v, u, t, n) => ({ v, u, t, n });

  /**
   * @param {Type} t the operation type
   * @param {number[]} p the path to retrieve the node
   * @param {function} u the update function
   * @param {string} n the attribute name, if any
   * @returns {Entry}
   */
  const entry = (t, p, u, n = '') => ({ t, p, u, n });

  /**
   * @typedef {Object} Cache
   * @property {Cache[]} s the stack of caches per each interpolation / hole
   * @property {null | TemplateStringsArray} t the cached template
   * @property {null | Node | PersistentFragment} n the node returned when parsing the template
   * @property {Detail[]} d the list of updates to perform
   */

  /**
   * @param {Cache[]} s the cache stack
   * @returns {Cache}
   */
  const cache$1 = s => ({ s, t: null, n: null, d: empty});

  /**
   * @typedef {Object} Parsed
   * @property {Node | PersistentFragment} n the returned node after parsing the template
   * @property {Detail[]} d the list of details to update the node
   */

  /**
   * @param {Node | PersistentFragment} n the returned node after parsing the template
   * @param {Detail[]} d the list of details to update the node
   * @returns {Parsed}
   */
  const parsed = (n, d) => ({ n, d });

  const ATTRIBUTE_NODE = 2;
  const TEXT_NODE = 3;
  const COMMENT_NODE = 8;
  const DOCUMENT_FRAGMENT_NODE = 11;

  /*! (c) Andrea Giammarchi - ISC */
  const {setPrototypeOf} = Object;

  /**
   * @param {Function} Class any base class to extend without passing through it via super() call.
   * @returns {Function} an extensible class for the passed one.
   * @example
   *  // creating this very same module utility
   *  import custom from 'custom-function/factory';
   *  const CustomFunction = custom(Function);
   *  class MyFunction extends CustomFunction {}
   *  const mf = new MyFunction(() => {});
   */
  var custom = Class => {
    function Custom(target) {
      return setPrototypeOf(target, new.target.prototype);
    }
    Custom.prototype = Class.prototype;
    return Custom;
  };

  let range$1;
  /**
   * @param {Node | Element} firstChild
   * @param {Node | Element} lastChild
   * @param {boolean} preserve
   * @returns
   */
  var drop = (firstChild, lastChild, preserve) => {
    if (!range$1) range$1 = newRange();
    if (preserve)
      range$1.setStartAfter(firstChild);
    else
      range$1.setStartBefore(firstChild);
    range$1.setEndAfter(lastChild);
    range$1.deleteContents();
    return firstChild;
  };

  /**
   * @param {PersistentFragment} fragment
   * @returns {Node | Element}
   */
  const remove = ({firstChild, lastChild}, preserve) => drop(firstChild, lastChild, preserve);

  let checkType = false;

  /**
   * @param {Node} node
   * @param {1 | 0 | -0 | -1} operation
   * @returns {Node}
   */
  const diffFragment = /* c8 ignore start */(node, operation) => (
    checkType && node.nodeType === DOCUMENT_FRAGMENT_NODE ?
      ((1 / operation) < 0 ?
        (operation ? remove(node, true) : node.lastChild) :
        (operation ? node.valueOf() : node.firstChild)) :
      node
  );

  /** @extends {DocumentFragment} */
  class PersistentFragment extends custom(DocumentFragment) {
    #nodes;
    #length;
    constructor(fragment) {
      const _nodes = [...fragment.childNodes];
      super(fragment);
      this.#nodes = _nodes;
      this.#length = _nodes.length;
      checkType = true;
    }
    get firstChild() { /* c8 ignore stop */return this.#nodes[0]; }
    get lastChild() { return this.#nodes.at(-1); }
    get parentNode() { return this.#nodes[0].parentNode; }
    remove() {
      remove(this, false);
    }
    /* c8 ignore start */
    replaceWith(node) {
      remove(this, true).replaceWith(node);
    }
    /* c8 ignore stop */
    valueOf() {
      if (this.childNodes.length !== this.#length)
        this.append(...this.#nodes);
      return this;
    }
  }

  /**
   * @param {DocumentFragment} content
   * @param {number[]} path
   * @returns {Element}
   */
  const find = (content, path) => path.reduceRight(childNodesIndex, content);
  const childNodesIndex = (node, i) => node.childNodes[i];

  /** @param {(template: TemplateStringsArray, values: any[]) => import("./parser.js").Resolved} parse */
  var create = parse => (
    /** @param {(template: TemplateStringsArray, values: any[]) => import("./literals.js").Parsed} parse */
    (template, values) => {
      const { c: content, e: entries, l: length } = parse(template, values);
      const root = content.cloneNode(true);
      // reverse loop to avoid missing paths while populating
      // TODO: is it even worth to pre-populate nodes? see rabbit.js too
      let current, prev, i = entries.length, details = i ? entries.slice(0) : empty;
      while (i--) {
        const { t: type, p: path, u: update, n: name } = entries[i];
        const node = path === prev ? current : (current = find(root, (prev = path)));
        const callback = type === COMMENT_NODE ? update() : update;
        details[i] = detail(callback(node, values[i], name, empty), callback, node, name);
      }
      return parsed(
        length === 1 ? root.firstChild : new PersistentFragment(root),
        details
      );
    }
  );

  const TEXT_ELEMENTS = /^(?:plaintext|script|style|textarea|title|xmp)$/i;
  const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

  /*! (c) Andrea Giammarchi - ISC */

  const elements = /<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g;
  const attributes = /([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g;
  const holes = /[\x01\x02]/g;

  // \x01 Node.ELEMENT_NODE
  // \x02 Node.ATTRIBUTE_NODE

  /**
   * Given a template, find holes as both nodes and attributes and
   * return a string with holes as either comment nodes or named attributes.
   * @param {string[]} template a template literal tag array
   * @param {string} prefix prefix to use per each comment/attribute
   * @param {boolean} xml enforces self-closing tags
   * @returns {string} X/HTML with prefixed comments or attributes
   */
  var parser$1 = (template, prefix, xml) => {
    let i = 0;
    return template
      .join('\x01')
      .trim()
      .replace(
        elements,
        (_, name, attrs, selfClosing) => `<${
          name
        }${
          attrs.replace(attributes, '\x02=$2$1').trimEnd()
        }${
          selfClosing ? (
            (xml || VOID_ELEMENTS.test(name)) ? ' /' : `></${name}`
          ) : ''
        }>`
      )
      .replace(
        holes,
        hole => hole === '\x01' ? `<!--${prefix + i++}-->` : (prefix + i++)
      )
    ;
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
  var udomdiff = /* c8 ignore start */(parentNode, a, b, get, before) => {
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
    /* c8 ignore stop */return b;
  };

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const aria = (element, value) => {
    for (const key in value) {
      const $ = value[key];
      const name = key === 'role' ? key : `aria-${key}`;
      if ($ == null) element.removeAttribute(name);
      else element.setAttribute(name, $);
    }
    return value;
  };

  let listeners;

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const at = (element, value, name) => {
    name = name.slice(1);
    if (!listeners) listeners = new WeakMap;
    const known = listeners.get(element) || set(listeners, element, {});
    let current = known[name];
    if (current && current[0]) element.removeEventListener(name, ...current);
    current = isArray(value) ? value : [value, false];
    known[name] = current;
    if (current[0]) element.addEventListener(name, ...current);
    return value;
  };

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const className = (element, value) => direct(element, value, 'className');

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const data = (element, value) => {
    const { dataset } = element;
    for (const key in value) {
      if (value[key] == null) delete dataset[key];
      else dataset[key] = value[key];
    }
    return value;
  };

  /**
   * @template T
   * @param {Element | CSSStyleDeclaration} ref
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const direct = (ref, value, name) => (ref[name] = value);

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const dot = (element, value, name) => direct(element, value, name.slice(1));

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const ref = (element, value) => {
    if (typeof value === 'function') value(element);
    else value.current = element;
    return value;
  };

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const regular = (element, value, name) => {
    if (value == null) element.removeAttribute(name);
    else element.setAttribute(name, value);
    return value;
  };

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const style = (element, value) => direct(element.style, value, 'cssText');

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @param {string} name
   * @returns {T}
   */
  const toggle = (element, value, name) => {
    element.toggleAttribute(name.slice(1), value);
    return value;
  };

  /**
   * @param {Node} node
   * @param {Node[]} value
   * @param {string} _
   * @param {Node[]} prev
   * @returns {Node[]}
   */
  const array = (node, value, _, prev) => {
    if (value.length)
      return udomdiff(node.parentNode, prev, value, diffFragment, node);
    if (prev.length)
      drop(prev[0], prev.at(-1), false);
    return empty;
  };

  const attr = new Map([
    ['aria', aria],
    ['class', className],
    ['data', data],
    ['ref', ref],
    ['style', style],
  ]);

  /**
   * @param {HTMLElement | SVGElement} element
   * @param {string} name
   * @param {boolean} svg
   * @returns
   */
  const attribute = (element, name, svg) => {
    switch (name[0]) {
      case '.': return dot;
      case '?': return toggle;
      case '@': return at;
      default: return (
        /* c8 ignore start */ svg || ('ownerSVGElement' in element) /* c8 ignore stop */ ?
          (name === 'ref' ? ref : regular) :
          (attr.get(name) || (name in element ? direct : regular))
      );
    }
  };

  /**
   * @template T
   * @param {Element} element
   * @param {T} value
   * @returns {T}
   */
  const text = (element, value) => {
    element.textContent = value == null ? '' : value;
    return value;
  };

  /**
   * @template T
   * @this {import("./literals.js").HoleDetails}
   * @param {Node} node
   * @param {T} value
   * @returns {T}
   */
  function hole(node, value) {
    const n = this.n || (this.n = node);
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean': {
        if (n !== node) n.replaceWith((this.n = node));
        this.n.data = value;
        break;
      }
      case 'object':
      case 'undefined': {
        if (value == null) (this.n = node).data = '';
        else this.n = value.valueOf();
        n.replaceWith(this.n);
        break;
      }
    }
    return value;
  }

  let template = document.createElement('template'), svg$1, range;

  /**
   * @param {string} text
   * @param {boolean} xml
   * @returns {DocumentFragment}
   */
  var createContent = (text, xml) => {
    if (xml) {
      if (!svg$1) {
        svg$1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        range = newRange();
        range.selectNodeContents(svg$1);
      }
      return range.createContextualFragment(text);
    }
    template.innerHTML = text;
    const { content } = template;
    template = template.cloneNode(false);
    return content;
  };

  /** @typedef {import("./literals.js").Entry} Entry */

  /**
   * @typedef {Object} Resolved
   * @property {DocumentFragment} content
   * @property {Entry[]} entries
   * @property {function[]} updates
   * @property {number} length
   */

  /**
   * @param {Element} node
   * @returns {number[]}
   */
  const createPath = node => {
    const path = [];
    let parentNode;
    while ((parentNode = node.parentNode)) {
      path.push(path.indexOf.call(parentNode.childNodes, node));
      node = parentNode;
    }
    return path;
  };

  const boundComment = () => hole.bind(comment());
  const arrayComment = () => array;

  /**
   * @param {TemplateStringsArray} template
   * @param {boolean} xml
   * @returns {Resolved}
   */
  const resolve = (template, values, xml) => {
    const content = createContent(parser$1(template, prefix, xml), xml);
    const { length } = template;
    let asArray = false, entries = empty;
    if (length > 1) {
      const tw = document.createTreeWalker(content, 1 | 128);
      const replace = [];
      let i = 0, search = `${prefix}${i++}`;
      entries = [];
      while (i < length) {
        const node = tw.nextNode();
        if (node.nodeType === COMMENT_NODE) {
          if (node.data === search) {
            let update = isArray(values[i - 1]) ? arrayComment : boundComment;
            if (update === boundComment) replace.push(node);
            else asArray = true;
            entries.push(entry(COMMENT_NODE, createPath(node), update));
            search = `${prefix}${i++}`;
          }
        }
        else {
          let path;
          while (node.hasAttribute(search)) {
            if (!path) path = createPath(node);
            const name = node.getAttribute(search);
            entries.push(entry(ATTRIBUTE_NODE, path, attribute(node, name, xml), name));
            node.removeAttribute(search);
            search = `${prefix}${i++}`;
          }
          if (
            TEXT_ELEMENTS.test(node.localName) &&
            node.textContent.trim() === `<!--${search}-->`
          ) {
            entries.push(entry(TEXT_NODE, path || createPath(node), text));
            search = `${prefix}${i++}`;
          }
        }
      }
      for (i = 0; i < replace.length; i++)
        replace[i].replaceWith(document.createTextNode(''));
    }
    const l = content.childNodes.length;
    return set(cache, template, cel(content, entries, l === 1 && asArray ? 0 : l));
  };

  /** @type {WeakMap<TemplateStringsArray, Resolved>} */
  const cache = new WeakMap;
  const prefix = 'isµ';

  /**
   * @param {boolean} xml
   * @returns {(template: TemplateStringsArray, values: any[]) => Resolved}
   */
  var parser = xml => (template, values) => cache.get(template) || resolve(template, values, xml);

  const parseHTML = create(parser(false));
  const parseSVG = create(parser(true));

  /**
   * @param {import("./literals.js").Cache} cache
   * @param {Hole} hole
   * @returns {Node}
   */
  const unroll = (cache, { s: svg, t: template, v: values }) => {
    if (values.length && cache.s === empty) cache.s = [];
    const length = unrollValues(cache, values);
    if (cache.t !== template) {
      const { n: node, d: details } = (svg ? parseSVG : parseHTML)(template, values);
      cache.t = template;
      cache.n = node;
      cache.d = details;
    }
    else {
      const { d: details } = cache;
      for (let i = 0; i < length; i++) {
        const value = values[i];
        const detail = details[i];
        const { v: previous } = detail;
        if (value !== previous) {
          const { u: update, t: target, n: name } = detail;
          detail.v = update(target, value, name, previous);
        }
      }
    }
    return cache.n;
  };

  /**
   * @param {Cache} cache
   * @param {any[]} values
   * @returns {number}
   */
  const unrollValues = ({ s: stack }, values) => {
    const { length } = values;
    for (let i = 0; i < length; i++) {
      const hole = values[i];
      if (hole instanceof Hole)
        values[i] = unroll(stack[i] || (stack[i] = cache$1(empty)), hole);
      else if (isArray(hole))
        unrollValues(stack[i] || (stack[i] = cache$1([])), hole);
      else
        stack[i] = null;
    }
    if (length < stack.length) stack.splice(length);
    return length;
  };

  /**
   * Holds all details needed to render the content on a render.
   * @constructor
   * @param {boolean} svg The content type.
   * @param {TemplateStringsArray} template The template literals used to the define the content.
   * @param {any[]} values Zero, one, or more interpolated values to render.
   */
  class Hole {
    constructor(svg, template, values) {
      this.s = svg;
      this.t = template;
      this.v = values;
    }
  }

  /*! (c) Andrea Giammarchi - MIT */


  /** @typedef {import("./literals.js").Value} Value */

  const tag = svg => (template, ...values) => new Hole(svg, template, values);

  /** @type {(template: TemplateStringsArray, ...values:Value[]) => Hole} A tag to render HTML content. */
  const html = tag(false);

  /** @type {(template: TemplateStringsArray, ...values:Value[]) => Hole} A tag to render SVG content. */
  const svg = tag(true);

  /** @type {WeakMap<Element | DocumentFragment, import("./literals.js").Cache>} */
  const known = new WeakMap;

  /**
   * Render with smart updates within a generic container.
   * @template T
   * @param {T} where the DOM node where to render content
   * @param {() => Hole | Hole} what the hole to render
   * @returns
   */
  var renderKeyed = (where, what) => {
    const info = known.get(where) || set(known, where, cache$1(empty));
    const hole = typeof what === 'function' ? what() : what;
    const { n } = info;
    const node = hole instanceof Hole ? unroll(info, hole) : hole;
    if (n !== node)
      where.replaceChildren((info.n = node));
    return where;
  };

  /** @typedef {import("./literals.js").Cache} Cache */
  /** @typedef {import("./literals.js").Target} Target */
  /** @typedef {import("./literals.js").Value} Value */

  /** @typedef {(ref:Object, key:string | number) => Tag} Bound */

  /**
   * @callback Tag
   * @param {TemplateStringsArray} template
   * @param  {...Value} values
   * @returns {Target}
   */

  const keyed = new WeakMap;
  const createRef = svg => /** @type {Bound} */ (ref, key) => {
    /** @type {Tag} */
    function tag(template, ...values) {
      return unroll(this, new Hole(svg, template, values));
    }

    const memo = keyed.get(ref) || set(keyed, ref, new Map);
    return memo.get(key) || set(memo, key, tag.bind(cache$1(empty)));
  };

  /** @type {Bound} Returns a bound tag to render HTML content. */
  const htmlFor = createRef(false);

  /** @type {Bound} Returns a bound tag to render SVG content. */
  const svgFor = createRef(true);

  exports.Hole = Hole;
  exports.attr = attr;
  exports.html = html;
  exports.htmlFor = htmlFor;
  exports.render = renderKeyed;
  exports.svg = svg;
  exports.svgFor = svgFor;

  return exports;

})({});
