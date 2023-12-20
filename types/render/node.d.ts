declare function _default<T>(where: T, what: (() => Target) | Target): T;
export default _default;
export type Target = import("../literals.js").Target;
