export const keyed = new WeakMap;

//@ts-ignore
export class Keyed extends Map {
  constructor() {
    //@ts-ignore
    super()._ = new FinalizationRegistry(key => this.delete(key));
  }

  get(key) {
    const node = super.get(key)?.deref();
    return node && keyed.get(node);
  }

  /**
   * @param {any} key
   * @param {Node} node
   * @param {import('./rabbit.js').Hole} hole
   */
  //@ts-ignore
  set(key, node, hole) {
    keyed.set(node, hole);
    //@ts-ignore
    this._.register(node, key);
    super.set(key, new WeakRef(node));
  }
}
