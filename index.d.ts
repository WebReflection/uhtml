export type TemplateFunction<T> = (
  template: TemplateStringsArray,
  ...values: any[]
) => T;

export interface Tag<T> extends TemplateFunction<Hole> {
  for(object: object, id?: string): TemplateFunction<T>;
  node: TemplateFunction<T>;
}

export type Renderable = Hole | HTMLElement | SVGElement;

export declare const html: Tag<HTMLElement>;
export declare const svg: Tag<SVGElement>;
export declare function render<T extends Node>(
  node: T,
  renderer: (() => Renderable) | Renderable,
): T;

/**
 * Used for internal purposes, should be created using
 * the `html` or `svg` template tags.
 */
export class Hole {
  constructor(type: string, template: TemplateStringsArray, values: any[]);
  readonly type: string;
  readonly template: TemplateStringsArray;
  readonly values: readonly any[];
}
