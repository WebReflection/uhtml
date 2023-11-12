import { newRange } from './utils.js';

let range;
/**
 * @param {Node | Element} firstChild
 * @param {Node | Element} lastChild
 * @param {boolean} preserve
 * @returns
 */
export default (firstChild, lastChild, preserve) => {
  if (!range) range = newRange();
  if (preserve)
    range.setStartAfter(firstChild);
  else
    range.setStartBefore(firstChild);
  range.setEndAfter(lastChild);
  range.deleteContents();
  return firstChild;
};
