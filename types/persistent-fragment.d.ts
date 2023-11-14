export function diffFragment(node: Node, operation: 1 | 0 | -0 | -1): Node;
/** @extends {DocumentFragment} */
export class PersistentFragment extends DocumentFragment {
    constructor(fragment: any);
    get firstChild(): any;
    get lastChild(): any;
    get parentNode(): any;
    remove(): void;
    replaceWith(node: any): void;
    valueOf(): this;
    #private;
}
