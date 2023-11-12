import { newRange } from './utils.js';

let template = document.createElement('template'), svg, range;

/**
 * @param {string} text
 * @param {boolean} xml
 * @returns {DocumentFragment}
 */
export default (text, xml) => {
  if (xml) {
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      range = newRange();
      range.selectNodeContents(svg);
    }
    return range.createContextualFragment(text);
  }
  template.innerHTML = text;
  const { content } = template;
  template = template.cloneNode(false);
  return content;
};
