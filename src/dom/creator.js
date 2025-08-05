// @ts-check

/**
 * @param {Document} document
 * @returns
 */
export default (document = /** @type {Document} */(globalThis.document)) => {
  let tpl = document.createElement('template'), range;
  /**
   * @param {string} content
   * @param {boolean} [xml=false]
   * @returns {DocumentFragment}
   */
  return (content, xml = false) => {
    if (xml) {
      if (!range) {
        range = document.createRange();
        range.selectNodeContents(
          document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        );
      }
      return range.createContextualFragment(content);
    }
    tpl.innerHTML = content;
    const fragment = tpl.content;
    tpl = /** @type {HTMLTemplateElement} */(tpl.cloneNode(false));
    return fragment;
  };
};
