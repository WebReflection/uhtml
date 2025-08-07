import {
  ATTRIBUTE as TEMPLATE_ATTRIBUTE,
  COMMENT as TEMPLATE_COMMENT,
  COMPONENT as TEMPLATE_COMPONENT,
} from '../dom/ish.js';

export const COMPONENT = 1;
export const DOTS = 3;
export const KEY = 4;
export const HOLE = 5;

export const update = (_, type, path, name) => {
  switch (type) {
    case TEMPLATE_COMMENT: return [path, HOLE];
    case TEMPLATE_COMPONENT: return [path, COMPONENT];
    case TEMPLATE_ATTRIBUTE: {
      switch (name) {
        case 'key': return [path, KEY];
        case '...': return [path, DOTS];
        default: return [path, name];
      }
    }
  }
};
