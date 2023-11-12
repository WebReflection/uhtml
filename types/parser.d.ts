declare function _default(xml: boolean): (template: TemplateStringsArray, values: any[]) => Resolved;
export default _default;
export type Entry = import("./literals.js").Entry;
export type Resolved = {
    content: DocumentFragment;
    entries: Entry[];
    updates: Function[];
    length: number;
};
