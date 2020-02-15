var uhtml = (function (exports) {
  'use strict';

  /*! (c) Andrea Giammarchi - ISC */
  var createContent = function (document) {

    var FRAGMENT = 'fragment';
    var TEMPLATE = 'template';
    var HAS_CONTENT = 'content' in create(TEMPLATE);
    var createHTML = HAS_CONTENT ? function (html) {
      var template = create(TEMPLATE);
      template.innerHTML = html;
      return template.content;
    } : function (html) {
      var content = create(FRAGMENT);
      var template = create(TEMPLATE);
      var childNodes = null;

      if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
        var selector = RegExp.$1;
        template.innerHTML = '<table>' + html + '</table>';
        childNodes = template.querySelectorAll(selector);
      } else {
        template.innerHTML = html;
        childNodes = template.childNodes;
      }

      append(content, childNodes);
      return content;
    };
    return function createContent(markup, type) {
      return (type === 'svg' ? createSVG : createHTML)(markup);
    };

    function append(root, childNodes) {
      var length = childNodes.length;

      while (length--) {
        root.appendChild(childNodes[0]);
      }
    }

    function create(element) {
      return element === FRAGMENT ? document.createDocumentFragment() : document.createElementNS('http://www.w3.org/1999/xhtml', element);
    } // it could use createElementNS when hasNode is there
    // but this fallback is equally fast and easier to maintain
    // it is also battle tested already in all IE


    function createSVG(svg) {
      var content = create(FRAGMENT);
      var template = create('div');
      template.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>';
      append(content, template.firstChild.childNodes);
      return content;
    }
  }(document);

  /*! (c) Andrea Giammarchi - ISC */
  var importNode = function (document, appendChild, cloneNode, createTextNode, importNode) {
    var _native = importNode in document; // IE 11 has problems with cloning templates:
    // it "forgets" empty childNodes. This feature-detects that.


    var fragment = document.createDocumentFragment();
    fragment[appendChild](document[createTextNode]('g'));
    fragment[appendChild](document[createTextNode](''));
    var content = _native ? document[importNode](fragment, true) : fragment[cloneNode](true);
    return content.childNodes.length < 2 ? function importNode(node, deep) {
      var clone = node[cloneNode]();

      for (var childNodes = node.childNodes || [], length = childNodes.length, i = 0; deep && i < length; i++) {
        clone[appendChild](importNode(childNodes[i], deep));
      }

      return clone;
    } : _native ? document[importNode] : function (node, deep) {
      return node[cloneNode](!!deep);
    };
  }(document, 'appendChild', 'cloneNode', 'createTextNode', 'importNode');

  var create = Object.create;
  var forEach = [].forEach;
  var content = new WeakMap();
  var fragment = new WeakMap();
  var nope = {
    what: null
  };
  var render = function render(where, what) {
    var info = content.get(where) || nope;

    if (info.what !== what) {
      where.textContent = '';
      where.appendChild(importNode.call(where.ownerDocument, what, true));
      var names = create(null);
      forEach.call(where.querySelectorAll('[name]'), attach, names);
      content.set(where, info = {
        what: what,
        names: names
      });
    }

    return info.names;
  };
  function html(template) {
    return fragment.get(template) || parse.apply('html', arguments);
  }
  function svg(template) {
    return fragment.get(template) || parse.apply('svg', arguments);
  }

  function attach(element) {
    this[element.getAttribute('name')] = element;
  }

  function parse(template) {
    var markup = [template[0]];

    for (var i = 1, length = arguments.length; i < length; i++) {
      markup.push(arguments[i], template[i]);
    }

    var content = createContent(markup.join(''), '' + this);
    fragment.set(template, content);
    return content;
  }

  exports.html = html;
  exports.render = render;
  exports.svg = svg;

  return exports;

}({}));
