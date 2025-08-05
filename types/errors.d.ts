declare namespace _default {
    function text(template: any, tag: any, value: any): SyntaxError;
    function unclosed(template: any, tag: any): SyntaxError;
    function unclosed_element(template: any, tag: any): SyntaxError;
    function invalid_content(template: any): SyntaxError;
    function invalid_closing(template: any): SyntaxError;
    function invalid_nul(template: any): SyntaxError;
    function invalid_comment(template: any): SyntaxError;
    function invalid_layout(template: any): SyntaxError;
    function invalid_doctype(template: any, value: any): SyntaxError;
    function invalid_template(template: any): SyntaxError;
    function invalid_path(template: any, path: any): SyntaxError;
    function invalid_attribute(template: any, kind: any): SyntaxError;
    function invalid_interpolation(template: any, value: any): SyntaxError;
    function invalid_hole(value: any): SyntaxError;
    function invalid_key(value: any): SyntaxError;
    function invalid_ref(template: any): SyntaxError;
    function invalid_array(value: any): SyntaxError;
    function invalid_component(value: any): SyntaxError;
}
export default _default;
