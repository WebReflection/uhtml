/* c8 ignore start */
const asTemplate = template => (template?.raw || template)?.join?.(',') || 'unknown';
/* c8 ignore stop */

export default {
  text: (template, tag, value) => new SyntaxError(`Mixed text and interpolations found in text only <${tag}> element ${JSON.stringify(String(value))} in template ${asTemplate(template)}`),
  unclosed: (template, tag) => new SyntaxError(`The text only <${tag}> element requires explicit </${tag}> closing tag in template ${asTemplate(template)}`),
  unclosed_element: (template, tag) => new SyntaxError(`Unclosed element <${tag}> found in template ${asTemplate(template)}`),
  invalid_content: template => new SyntaxError(`Invalid content "<!" found in template: ${asTemplate(template)}`),
  invalid_closing: template => new SyntaxError(`Invalid closing tag: </... found in template: ${asTemplate(template)}`),
  invalid_nul: template => new SyntaxError(`Invalid content: NUL char \\x00 found in template: ${asTemplate(template)}`),
  invalid_comment: template => new SyntaxError(`Invalid comment: no closing --> found in template ${asTemplate(template)}`),
  invalid_layout: template => new SyntaxError(`Too many closing tags found in template ${asTemplate(template)}`),
  invalid_doctype: (template, value) => new SyntaxError(`Invalid doctype: ${value} found in template ${asTemplate(template)}`),

  // DOM ONLY
  /* c8 ignore start */
  invalid_template: template => new SyntaxError(`Invalid template - the amount of values does not match the amount of updates: ${asTemplate(template)}`),
  invalid_path: (template, path) => new SyntaxError(`Invalid path - unreachable node at the path [${path.join(', ')}] found in template ${asTemplate(template)}`),
  invalid_attribute: (template, kind) => new SyntaxError(`Invalid ${kind} attribute in template definition\n${asTemplate(template)}`),
  invalid_interpolation: (template, value) => new SyntaxError(`Invalid interpolation - expected hole or array: ${String(value)} found in template ${asTemplate(template)}`),
  invalid_hole: value => new SyntaxError(`Invalid interpolation - expected hole: ${String(value)}`),
  invalid_key: value => new SyntaxError(`Invalid key attribute or position in template: ${String(value)}`),
  invalid_array: value => new SyntaxError(`Invalid array - expected html/svg but found something else: ${String(value)}`),
  invalid_component: value => new SyntaxError(`Invalid component: ${String(value)}`),
};
