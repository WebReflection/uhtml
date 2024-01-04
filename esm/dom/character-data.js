import Node from './node.js';
import { nodeName, value } from './symbols.js';

export default class CharacterData extends Node {
  constructor(type, name, data, owner) {
    super(type, owner)[nodeName] = name;
    this.data = data;
  }

  get data() {
    return this[value];
  }
  set data(any) {
    this[value] = String(any);
  }

  get nodeName() {
    return this[nodeName];
  }

  get textContent() {
    return this.data;
  }

  set textContent(data) {
    this.data = data;
  }
}
