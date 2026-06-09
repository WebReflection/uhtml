export const ARRAY = 1 << 0;
export const ARIA = 1 << 1;
export const ATTRIBUTE = 1 << 2;
export const COMMENT = 1 << 3;
export const COMPONENT = 1 << 4;
export const DATA = 1 << 5;
export const DIRECT = 1 << 6;
export const DOTS = 1 << 7;
export const EVENT = 1 << 8;
export const KEY = 1 << 9;
export const PROP = 1 << 10;
export const TEXT = 1 << 11;
export const TOGGLE = 1 << 12;
export const UNSAFE = 1 << 13;
export const REF = 1 << 14;

// COMPONENT flags
export const COMPONENT_DIRECT = COMPONENT | DIRECT;
export const COMPONENT_DOTS = COMPONENT | DOTS;
export const COMPONENT_PROP = COMPONENT | PROP;

// ARRAY flags
export const EVENT_ARRAY = EVENT | ARRAY;
export const COMMENT_ARRAY = COMMENT | ARRAY;
