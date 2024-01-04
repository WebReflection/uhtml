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
  /* c8 ignore start */
  if (preserve)
    range.setStartAfter(firstChild);
  else
    range.setStartBefore(firstChild);
  /* c8 ignore stop */
  range.setEndAfter(lastChild);
  range.deleteContents();
  return firstChild;
};
