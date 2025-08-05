export function escape(es: any): any;
export class Unsafe {
    constructor(data: any);
    valueOf(): any;
    toString(): string;
    #private;
}
export function unsafe(data: any): Unsafe;
export function createComment(value: any): Comment;
export const assign: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
export const defineProperties: <T>(o: T, properties: PropertyDescriptorMap & ThisType<any>) => T;
export const entries: {
    <T>(o: {
        [s: string]: T;
    } | ArrayLike<T>): [string, T][];
    (o: {}): [string, any][];
};
export const freeze: {
    <T extends Function>(f: T): T;
    <T extends {
        [idx: string]: U | null | undefined | object;
    }, U extends string | bigint | number | boolean | symbol>(o: T): Readonly<T>;
    <T>(o: T): Readonly<T>;
};
export const isArray: (arg: any) => arg is any[];
export const keys: {
    (o: object): string[];
    (o: {}): string[];
};
