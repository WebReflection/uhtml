declare function _default<T>(where: T, what: (() => Hole) | Hole): T;
export default _default;
export type Hole = import("../rabbit.js").Hole;
