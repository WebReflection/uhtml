import { ELEMENT_NODE, TEXT_NODE } from 'domconstants/constants';

import { empty } from '../utils.js';

import { asElement, getNodes, changeParentNode, setParentNode, withNewParent } from './utils.js';
import { childNodes, localName, nodeType, ownerDocument, parentNode } from './symbols.js';
import { push, splice, unshift } from './array.js';
import { _target, _currentTarget, _stoppedPropagation, _stoppedImmediatePropagation } from './event.js';

import Node from './node.js';
import Text from './text.js';

const listeners = new WeakMap;
const listeners0 = new WeakMap;

const level0 = {
  get(self, name) {
    return listeners0.get(self)?.get(name) || null;
  },
  set(self, name, value) {
    let known = listeners0.get(self);
    if (!known) listeners0.set(self, (known = new Map));
    if (value == null)
      known.delete(name);
    else
      known.set(name, value);
  }
};

/** @typedef {Function?} DOMLevel0Listener */

export default class Parent extends Node {
  constructor(type, owner) {
    super(type, owner)[childNodes] = empty;
  }

  /** @type {Node[]} */
  get childNodes() {
    return this[childNodes] === empty ? [] : this[childNodes];
  }

  /** @type {import("./element.js").default[]} */
  get children() {
    return this[childNodes].filter(asElement);
  }

  /** @type {Node?} */
  get firstChild() {
    return this[childNodes].at(0) || null;
  }

  /** @type {import("./element.js").default?} */
  get firstElementChild() {
    return this[childNodes].find(asElement) || null;
  }

  /** @type {Node?} */
  get lastChild() {
    return this[childNodes].at(-1) || null;
  }

  /** @type {import("./element.js").default?} */
  get lastElementChild() {
    return this[childNodes].findLast(asElement) || null;
  }

  /** @type {number} */
  get childElementCount() {
    return this.children.length;
  }

  // DOM Level 0
  /* c8 ignore start */
  /** @type {DOMLevel0Listener} */
  get onabort() { return level0.get(this, 'onabort'); }
  set onabort(value) { level0.set(this, 'onabort', value); }

  /** @type {DOMLevel0Listener} */
  get onblur() { return level0.get(this, 'onblur'); }
  set onblur(value) { level0.set(this, 'onblur', value); }

  /** @type {DOMLevel0Listener} */
  get oncancel() { return level0.get(this, 'oncancel'); }
  set oncancel(value) { level0.set(this, 'oncancel', value); }

  /** @type {DOMLevel0Listener} */
  get oncanplay() { return level0.get(this, 'oncanplay'); }
  set oncanplay(value) { level0.set(this, 'oncanplay', value); }

  /** @type {DOMLevel0Listener} */
  get oncanplaythrough() { return level0.get(this, 'oncanplaythrough'); }
  set oncanplaythrough(value) { level0.set(this, 'oncanplaythrough', value); }

  /** @type {DOMLevel0Listener} */
  get onchange() { return level0.get(this, 'onchange'); }
  set onchange(value) { level0.set(this, 'onchange', value); }

  /** @type {DOMLevel0Listener} */
  get onclick() { return level0.get(this, 'onclick'); }
  set onclick(value) { level0.set(this, 'onclick', value); }

  /** @type {DOMLevel0Listener} */
  get onclose() { return level0.get(this, 'onclose'); }
  set onclose(value) { level0.set(this, 'onclose', value); }

  /** @type {DOMLevel0Listener} */
  get oncontextmenu() { return level0.get(this, 'oncontextmenu'); }
  set oncontextmenu(value) { level0.set(this, 'oncontextmenu', value); }

  /** @type {DOMLevel0Listener} */
  get oncuechange() { return level0.get(this, 'oncuechange'); }
  set oncuechange(value) { level0.set(this, 'oncuechange', value); }

  /** @type {DOMLevel0Listener} */
  get ondblclick() { return level0.get(this, 'ondblclick'); }
  set ondblclick(value) { level0.set(this, 'ondblclick', value); }

  /** @type {DOMLevel0Listener} */
  get ondrag() { return level0.get(this, 'ondrag'); }
  set ondrag(value) { level0.set(this, 'ondrag', value); }

  /** @type {DOMLevel0Listener} */
  get ondragend() { return level0.get(this, 'ondragend'); }
  set ondragend(value) { level0.set(this, 'ondragend', value); }

  /** @type {DOMLevel0Listener} */
  get ondragenter() { return level0.get(this, 'ondragenter'); }
  set ondragenter(value) { level0.set(this, 'ondragenter', value); }

  /** @type {DOMLevel0Listener} */
  get ondragleave() { return level0.get(this, 'ondragleave'); }
  set ondragleave(value) { level0.set(this, 'ondragleave', value); }

  /** @type {DOMLevel0Listener} */
  get ondragover() { return level0.get(this, 'ondragover'); }
  set ondragover(value) { level0.set(this, 'ondragover', value); }

  /** @type {DOMLevel0Listener} */
  get ondragstart() { return level0.get(this, 'ondragstart'); }
  set ondragstart(value) { level0.set(this, 'ondragstart', value); }

  /** @type {DOMLevel0Listener} */
  get ondrop() { return level0.get(this, 'ondrop'); }
  set ondrop(value) { level0.set(this, 'ondrop', value); }

  /** @type {DOMLevel0Listener} */
  get ondurationchange() { return level0.get(this, 'ondurationchange'); }
  set ondurationchange(value) { level0.set(this, 'ondurationchange', value); }

  /** @type {DOMLevel0Listener} */
  get onemptied() { return level0.get(this, 'onemptied'); }
  set onemptied(value) { level0.set(this, 'onemptied', value); }

  /** @type {DOMLevel0Listener} */
  get onended() { return level0.get(this, 'onended'); }
  set onended(value) { level0.set(this, 'onended', value); }

  /** @type {DOMLevel0Listener} */
  get onerror() { return level0.get(this, 'onerror'); }
  set onerror(value) { level0.set(this, 'onerror', value); }

  /** @type {DOMLevel0Listener} */
  get onfocus() { return level0.get(this, 'onfocus'); }
  set onfocus(value) { level0.set(this, 'onfocus', value); }

  /** @type {DOMLevel0Listener} */
  get oninput() { return level0.get(this, 'oninput'); }
  set oninput(value) { level0.set(this, 'oninput', value); }

  /** @type {DOMLevel0Listener} */
  get oninvalid() { return level0.get(this, 'oninvalid'); }
  set oninvalid(value) { level0.set(this, 'oninvalid', value); }

  /** @type {DOMLevel0Listener} */
  get onkeydown() { return level0.get(this, 'onkeydown'); }
  set onkeydown(value) { level0.set(this, 'onkeydown', value); }

  /** @type {DOMLevel0Listener} */
  get onkeypress() { return level0.get(this, 'onkeypress'); }
  set onkeypress(value) { level0.set(this, 'onkeypress', value); }

  /** @type {DOMLevel0Listener} */
  get onkeyup() { return level0.get(this, 'onkeyup'); }
  set onkeyup(value) { level0.set(this, 'onkeyup', value); }

  /** @type {DOMLevel0Listener} */
  get onload() { return level0.get(this, 'onload'); }
  set onload(value) { level0.set(this, 'onload', value); }

  /** @type {DOMLevel0Listener} */
  get onloadeddata() { return level0.get(this, 'onloadeddata'); }
  set onloadeddata(value) { level0.set(this, 'onloadeddata', value); }

  /** @type {DOMLevel0Listener} */
  get onloadedmetadata() { return level0.get(this, 'onloadedmetadata'); }
  set onloadedmetadata(value) { level0.set(this, 'onloadedmetadata', value); }

  /** @type {DOMLevel0Listener} */
  get onloadstart() { return level0.get(this, 'onloadstart'); }
  set onloadstart(value) { level0.set(this, 'onloadstart', value); }

  /** @type {DOMLevel0Listener} */
  get onmousedown() { return level0.get(this, 'onmousedown'); }
  set onmousedown(value) { level0.set(this, 'onmousedown', value); }

  /** @type {DOMLevel0Listener} */
  get onmouseenter() { return level0.get(this, 'onmouseenter'); }
  set onmouseenter(value) { level0.set(this, 'onmouseenter', value); }

  /** @type {DOMLevel0Listener} */
  get onmouseleave() { return level0.get(this, 'onmouseleave'); }
  set onmouseleave(value) { level0.set(this, 'onmouseleave', value); }

  /** @type {DOMLevel0Listener} */
  get onmousemove() { return level0.get(this, 'onmousemove'); }
  set onmousemove(value) { level0.set(this, 'onmousemove', value); }

  /** @type {DOMLevel0Listener} */
  get onmouseout() { return level0.get(this, 'onmouseout'); }
  set onmouseout(value) { level0.set(this, 'onmouseout', value); }

  /** @type {DOMLevel0Listener} */
  get onmouseover() { return level0.get(this, 'onmouseover'); }
  set onmouseover(value) { level0.set(this, 'onmouseover', value); }

  /** @type {DOMLevel0Listener} */
  get onmouseup() { return level0.get(this, 'onmouseup'); }
  set onmouseup(value) { level0.set(this, 'onmouseup', value); }

  /** @type {DOMLevel0Listener} */
  get onmousewheel() { return level0.get(this, 'onmousewheel'); }
  set onmousewheel(value) { level0.set(this, 'onmousewheel', value); }

  /** @type {DOMLevel0Listener} */
  get onpause() { return level0.get(this, 'onpause'); }
  set onpause(value) { level0.set(this, 'onpause', value); }

  /** @type {DOMLevel0Listener} */
  get onplay() { return level0.get(this, 'onplay'); }
  set onplay(value) { level0.set(this, 'onplay', value); }

  /** @type {DOMLevel0Listener} */
  get onplaying() { return level0.get(this, 'onplaying'); }
  set onplaying(value) { level0.set(this, 'onplaying', value); }

  /** @type {DOMLevel0Listener} */
  get onprogress() { return level0.get(this, 'onprogress'); }
  set onprogress(value) { level0.set(this, 'onprogress', value); }

  /** @type {DOMLevel0Listener} */
  get onratechange() { return level0.get(this, 'onratechange'); }
  set onratechange(value) { level0.set(this, 'onratechange', value); }

  /** @type {DOMLevel0Listener} */
  get onreset() { return level0.get(this, 'onreset'); }
  set onreset(value) { level0.set(this, 'onreset', value); }

  /** @type {DOMLevel0Listener} */
  get onresize() { return level0.get(this, 'onresize'); }
  set onresize(value) { level0.set(this, 'onresize', value); }

  /** @type {DOMLevel0Listener} */
  get onscroll() { return level0.get(this, 'onscroll'); }
  set onscroll(value) { level0.set(this, 'onscroll', value); }

  /** @type {DOMLevel0Listener} */
  get onseeked() { return level0.get(this, 'onseeked'); }
  set onseeked(value) { level0.set(this, 'onseeked', value); }

  /** @type {DOMLevel0Listener} */
  get onseeking() { return level0.get(this, 'onseeking'); }
  set onseeking(value) { level0.set(this, 'onseeking', value); }

  /** @type {DOMLevel0Listener} */
  get onselect() { return level0.get(this, 'onselect'); }
  set onselect(value) { level0.set(this, 'onselect', value); }

  /** @type {DOMLevel0Listener} */
  get onshow() { return level0.get(this, 'onshow'); }
  set onshow(value) { level0.set(this, 'onshow', value); }

  /** @type {DOMLevel0Listener} */
  get onstalled() { return level0.get(this, 'onstalled'); }
  set onstalled(value) { level0.set(this, 'onstalled', value); }

  /** @type {DOMLevel0Listener} */
  get onsubmit() { return level0.get(this, 'onsubmit'); }
  set onsubmit(value) { level0.set(this, 'onsubmit', value); }

  /** @type {DOMLevel0Listener} */
  get onsuspend() { return level0.get(this, 'onsuspend'); }
  set onsuspend(value) { level0.set(this, 'onsuspend', value); }

  /** @type {DOMLevel0Listener} */
  get ontimeupdate() { return level0.get(this, 'ontimeupdate'); }
  set ontimeupdate(value) { level0.set(this, 'ontimeupdate', value); }

  /** @type {DOMLevel0Listener} */
  get ontoggle() { return level0.get(this, 'ontoggle'); }
  set ontoggle(value) { level0.set(this, 'ontoggle', value); }

  /** @type {DOMLevel0Listener} */
  get onvolumechange() { return level0.get(this, 'onvolumechange'); }
  set onvolumechange(value) { level0.set(this, 'onvolumechange', value); }

  /** @type {DOMLevel0Listener} */
  get onwaiting() { return level0.get(this, 'onwaiting'); }
  set onwaiting(value) { level0.set(this, 'onwaiting', value); }

  /** @type {DOMLevel0Listener} */
  get onauxclick() { return level0.get(this, 'onauxclick'); }
  set onauxclick(value) { level0.set(this, 'onauxclick', value); }

  /** @type {DOMLevel0Listener} */
  get ongotpointercapture() { return level0.get(this, 'ongotpointercapture'); }
  set ongotpointercapture(value) { level0.set(this, 'ongotpointercapture', value); }

  /** @type {DOMLevel0Listener} */
  get onlostpointercapture() { return level0.get(this, 'onlostpointercapture'); }
  set onlostpointercapture(value) { level0.set(this, 'onlostpointercapture', value); }

  /** @type {DOMLevel0Listener} */
  get onpointercancel() { return level0.get(this, 'onpointercancel'); }
  set onpointercancel(value) { level0.set(this, 'onpointercancel', value); }

  /** @type {DOMLevel0Listener} */
  get onpointerdown() { return level0.get(this, 'onpointerdown'); }
  set onpointerdown(value) { level0.set(this, 'onpointerdown', value); }

  /** @type {DOMLevel0Listener} */
  get onpointerenter() { return level0.get(this, 'onpointerenter'); }
  set onpointerenter(value) { level0.set(this, 'onpointerenter', value); }

  /** @type {DOMLevel0Listener} */
  get onpointerleave() { return level0.get(this, 'onpointerleave'); }
  set onpointerleave(value) { level0.set(this, 'onpointerleave', value); }

  /** @type {DOMLevel0Listener} */
  get onpointermove() { return level0.get(this, 'onpointermove'); }
  set onpointermove(value) { level0.set(this, 'onpointermove', value); }

  /** @type {DOMLevel0Listener} */
  get onpointerout() { return level0.get(this, 'onpointerout'); }
  set onpointerout(value) { level0.set(this, 'onpointerout', value); }

  /** @type {DOMLevel0Listener} */
  get onpointerover() { return level0.get(this, 'onpointerover'); }
  set onpointerover(value) { level0.set(this, 'onpointerover', value); }

  /** @type {DOMLevel0Listener} */
  get onpointerup() { return level0.get(this, 'onpointerup'); }
  set onpointerup(value) { level0.set(this, 'onpointerup', value); }
  /* c8 ignore stop */

  /**
   * @param  {...Node[]} values
   */
  prepend(...values) {
    unshift(getNodes(this), values.map(withParent, this));
  }

  /**
   * @param  {...Node[]} values
   */
  append(...values) {
    push(getNodes(this), values.map(withParent, this));
  }

  /**
   * @param  {...Node[]} values
   */
  replaceChildren(...values) {
    const nodes = getNodes(this);
    nodes.splice(0).forEach(setParentNode, null);
    push(nodes, values.map(withParent, this));
  }

  /**
   * @param  {Node} node
   * @returns {Node}
   */
  appendChild(node) {
    push(getNodes(this), [changeParentNode(node, this)]);
    return node;
  }
  /**
   * @param  {Node} node
   * @returns {boolean}
   */
  contains(node) {
    let { [parentNode]: parent } = node;
    while (parent && parent !== this)
      parent = parent[parentNode];
    return parent === this;
  }

  /**
   * @param {Node} node
   * @param {Node?} pin
   * @returns {Node} the inserted `node`
   */
  insertBefore(node, pin) {
    const nodes = getNodes(this);
    changeParentNode(node, this);
    if (pin)
      splice(nodes, nodes.indexOf(pin), 0, [node]);
    else
      push(nodes, [node]);
    return node;
  }

  /**
   * @param {Node} node
   */
  removeChild(node) {
    node.remove();
  }

  /**
   * @param {Node} node
   * @param {Node} replaced
   * @returns {Node} the `replaced` node
   */
  replaceChild(node, replaced) {
    const i = getNodes(this).indexOf(replaced);
    splice(this[childNodes], i, 1, [changeParentNode(node, this)]);
    replaced[parentNode] = null;
    return replaced;
  }

  addEventListener(type, listener, options) {
    let entries = listeners.get(this);
    if (!entries) listeners.set(this, (entries = new Map));
    let map = entries.get(type);
    if (!map) entries.set(type, (map = new Map));
    map.set(listener, options);
  }

  removeEventListener(type, listener) {
    const entries = listeners.get(this);
    if (entries) {
      const map = entries.get(type);
      if (map) {
        map.delete(listener);
        if (!map.size)
          entries.delete(type);
      }
    }
  }

  /**
   * @param {import("./event.js").default} event
   */
  dispatchEvent(event) {
    if (!event[_target]) event[_target] = this;
    event[_currentTarget] = this;
    const { type } = event;
    this[`on${type}`]?.(event);
    if (!event[_stoppedImmediatePropagation]) {
      const entries = listeners.get(this);
      if (entries) {
        const list = entries.get(type);
        if (list) {
          for (const [listener, options] of list) {
            if (typeof listener === 'function')
              listener.call(this, event);
            else
              listener.handleEvent(event);
            if (options?.once)
              this.removeEventListener(type, listener);
            if (event[_stoppedImmediatePropagation])
              break;
          }
        }
      }
    }
    if (event.bubbles && !event[_stoppedPropagation])
      this[parentNode]?.dispatchEvent(event);
  }

  // basic DOM extra utilities
  /**
   * @param {string} tagName
   * @returns {import("./element.js").default[]}
   */
  getElementsByTagName(tagName) {
    return getElementsByTagName(this, new RegExp(`^${tagName}$`, 'i'));
  }

  /**
   * @param {string} className
   * @returns {import("./element.js").default[]}
   */
  getElementsByClassName(className) {
    return getElementsByClassName(this, new RegExp(`\\b${className}\\b`));
  }

  normalize() {
    const { [childNodes]: nodes } = this;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      switch (node[nodeType]) {
        case ELEMENT_NODE:
          node.normalize();
          break;
        case TEXT_NODE: {
          const { data } = node;
          let drop = false;
          if (!data) drop = true;
          else if (i > 0 && nodes[i - 1][nodeType] === TEXT_NODE) {
            drop = true;
            nodes[i - 1].data += data;
          }
          if (drop) {
            node[parentNode] = null;
            nodes.splice(i--, 1);
          }
          break;
        }
      }
    }
  }
}

function withParent(node) {
  'use strict';
  return changeParentNode(
    typeof node === 'string' ?
      new Text(node, this[ownerDocument]) :
      node,
    this,
  );
}

const getElementsByTagName = ({ [childNodes]: nodes }, re) => {
  const elements = [];
  for (const node of nodes) {
    if (node[nodeType] === ELEMENT_NODE) {
      if (re.test(node[localName]))
        elements.push(node);
      elements.push(...getElementsByTagName(node, re));
    }
  }
  return elements;
};


const getElementsByClassName = ({ [childNodes]: nodes }, re) => {
  const elements = [];
  for (const node of nodes) {
    if (node[nodeType] === ELEMENT_NODE) {
      if (re.test(node.className))
        elements.push(node);
      elements.push(...getElementsByClassName(node, re));
    }
  }
  return elements;
};
