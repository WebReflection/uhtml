import type { Renderable } from "./index";

export declare function render<T extends Node>(
  node: T,
  renderer: (() => Renderable) | Renderable,
): Promise<T>;

export type { TemplateFunction, Tag, Renderable, html, svg, Hole } from "./index";