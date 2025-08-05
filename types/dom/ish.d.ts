export const ELEMENT: 1;
export const ATTRIBUTE: 2;
export const TEXT: 3;
export const COMMENT: 8;
export const DOCUMENT_TYPE: 10;
export const FRAGMENT: 11;
export const COMPONENT: 42;
export const TEXT_ELEMENTS: Set<string>;
export const VOID_ELEMENTS: Set<string>;
export const props: Readonly<{}>;
export const children: readonly any[];
export function append(node: any, child: any): any;
export function prop(node: any, name: any, value: any): void;
export function fromJSON(json: any): any;
export class Node {
    constructor(type: any);
    type: any;
    parent: any;
    toJSON(): any[];
}
export class Comment extends Node {
    data: any;
}
export class DocumentType extends Node {
    data: any;
}
export class Text extends Node {
    data: any;
    toString(): any;
}
export class Component extends Node {
    constructor();
    name: string;
    props: Readonly<{}>;
    children: readonly any[];
    toJSON(): number[];
}
export class Element extends Node {
    constructor(name: any, xml?: boolean);
    name: any;
    xml: boolean;
    props: Readonly<{}>;
    children: readonly any[];
}
export class Fragment extends Node {
    constructor();
    name: string;
    children: readonly any[];
    toJSON(): number[];
}
