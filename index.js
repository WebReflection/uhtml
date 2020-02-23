var uhtml = (function (exports) {
  'use strict';

  var cache = new WeakMap();
  var cacheInfo = function cacheInfo() {
    return {
      sub: [],
      stack: [],
      wire: null
    };
  };
  var setCache = function setCache(where) {
    var info = cacheInfo();
    cache.set(where, info);
    return info;
  };

  

  var isArray = Array.isArray;
  var _ref = [],
      indexOf = _ref.indexOf,
      slice = _ref.slice;

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

  var getNode = function getNode(node, i) {
    return node.childNodes[i];
  };
  var getPath = function getPath(node) {
    var path = [];
    var _node = node,
        parentNode = _node.parentNode;

    while (parentNode) {
      path.unshift(indexOf.call(parentNode.childNodes, node));
      node = parentNode;
      parentNode = node.parentNode;
    }

    return path;
  };
  var defineProperties = Object.defineProperties;
  var getWire = function getWire(fragment) {
    var childNodes = fragment.childNodes;
    var length = childNodes.length;
    if (length === 1) return childNodes[0];
    var nodes = slice.call(childNodes, 0);
    return defineProperties(fragment, {
      remove: {
        value: function value() {
          var range = document.createRange();
          range.setStartBefore(nodes[1]);
          range.setEndAfter(nodes[length - 1]);
          range.deleteContents();
          return nodes[0];
        }
      },
      valueOf: {
        value: function value() {
          if (childNodes.length !== length) {
            var range = document.createRange();
            range.setStartBefore(nodes[0]);
            range.setEndAfter(nodes[length - 1]);
            fragment.appendChild(range.extractContents());
          }

          return fragment;
        }
      }
    });
  };
  var _document = document,
      createTreeWalker = _document.createTreeWalker,
      importNode = _document.importNode;
  var IE = !importNode.length;
  var createFragment = IE ? function (text, type) {
    return importNode.call(document, createContent(text, type), true);
  } : createContent; // to support IE10 and IE9 I could pass a callback instead
  // with an `acceptNode` mode that's the callback itself
  // function acceptNode() { return 1; } acceptNode.acceptNode = acceptNode;
  // however, I really don't care about IE10 and IE9, as these would require
  // also a WeakMap polyfill, and have no reason to exist.

  var createWalker = IE ? function (fragment) {
    return createTreeWalker.call(document, fragment, 1 | 128, null, false);
  } : function (fragment) {
    return createTreeWalker.call(document, fragment, 1 | 128);
  };

  var append = function append(get, parent, children, start, end, before) {
    var isSelect = 'selectedIndex' in parent;
    var noSelection = isSelect;

    while (start < end) {
      var child = get(children[start], 1);
      parent.insertBefore(child, before);

      if (isSelect && noSelection && child.selected) {
        noSelection = !noSelection;
        var selectedIndex = parent.selectedIndex;
        parent.selectedIndex = selectedIndex < 0 ? start : indexOf.call(parent.querySelectorAll('option'), child);
      }

      start++;
    }
  };

  var drop = function drop(node) {
    return (node.remove || dropChild).call(node);
  };

  var index = function index(moreNodes, moreStart, moreEnd, lessNodes, lessStart, lessEnd) {
    var length = lessEnd - lessStart;
    if (length < 1) return -1;

    while (moreEnd - moreStart >= length) {
      var m = moreStart;
      var l = lessStart;

      while (m < moreEnd && l < lessEnd && moreNodes[m] === lessNodes[l]) {
        m++;
        l++;
      }

      if (l === lessEnd) return moreStart;
      moreStart = m + 1;
    }

    return -1;
  };

  var next = function next(get, list, i, length, before) {
    return i < length ? get(list[i], 0) : 0 < i ? get(list[i - 1], -0).nextSibling : before;
  };

  var remove = function remove(get, children, start, end) {
    while (start < end) {
      drop(get(children[start++], -1));
    }
  };

  var quickdiff = function quickdiff(parentNode, currentNodes, futureNodes, get, before) {
    var currentLength = currentNodes.length;
    var currentEnd = currentLength;
    var currentStart = 0;
    var futureEnd = futureNodes.length;
    var futureStart = 0;

    while (currentStart < currentEnd && futureStart < futureEnd && currentNodes[currentStart] === futureNodes[futureStart]) {
      currentStart++;
      futureStart++;
    }

    while (currentStart < currentEnd && futureStart < futureEnd && currentNodes[currentEnd - 1] === futureNodes[futureEnd - 1]) {
      currentEnd--;
      futureEnd--;
    }

    var currentSame = currentStart === currentEnd;
    var futureSame = futureStart === futureEnd;
    if (currentSame && futureSame) return futureNodes;

    if (currentSame && futureStart < futureEnd) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, next(get, currentNodes, currentStart, currentLength, before));
      return futureNodes;
    }

    if (futureSame && currentStart < currentEnd) {
      remove(get, currentNodes, currentStart, currentEnd);
      return futureNodes;
    }

    var currentChanges = currentEnd - currentStart;
    var futureChanges = futureEnd - futureStart;
    var i = -1;

    if (currentChanges < futureChanges) {
      i = index(futureNodes, futureStart, futureEnd, currentNodes, currentStart, currentEnd);

      if (-1 < i) {
        append(get, parentNode, futureNodes, futureStart, i, get(currentNodes[currentStart], 0));
        append(get, parentNode, futureNodes, i + currentChanges, futureEnd, next(get, currentNodes, currentEnd, currentLength, before));
        return futureNodes;
      }
    } else if (futureChanges < currentChanges) {
      i = index(currentNodes, currentStart, currentEnd, futureNodes, futureStart, futureEnd);

      if (-1 < i) {
        remove(get, currentNodes, currentStart, i);
        remove(get, currentNodes, i + futureChanges, currentEnd);
        return futureNodes;
      }
    }

    if (currentChanges < 2 || futureChanges < 2) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, get(currentNodes[currentStart], 0));
      remove(get, currentNodes, currentStart, currentEnd);
      return futureNodes;
    } // bail out replacing all


    remove(get, currentNodes, 0, currentLength);
    append(get, parentNode, futureNodes, 0, futureNodes.length, before);
    return futureNodes;
  };

  function dropChild() {
    var parentNode = this.parentNode;
    if (parentNode) parentNode.removeChild(this);
  }

  var get = function get(item, i) {
    return item.nodeType === 11 ? 1 / i < 0 ? i ? item.remove() : item.lastChild : i ? item.valueOf() : item.firstChild : item;
  };

  var handleAnything = function handleAnything(node, childNodes) {
    var oldValue;
    var text = document.createTextNode('');

    var anyContent = function anyContent(newValue) {
      switch (typeof(newValue)) {
        case 'string':
        case 'number':
        case 'boolean':
          if (oldValue !== newValue) {
            oldValue = newValue;
            text.textContent = newValue;
            childNodes = quickdiff(node.parentNode, childNodes, [text], get, node);
          }

          break;

        case 'object':
        case 'undefined':
          if (newValue == null) {
            childNodes = quickdiff(node.parentNode, childNodes, [], get, node);
            break;
          }

        default:
          oldValue = newValue;

          if (isArray(newValue)) {
            if (newValue.length === 0) childNodes = quickdiff(node.parentNode, childNodes, [], get, node);else {
              switch (typeof(newValue[0])) {
                case 'string':
                case 'number':
                case 'boolean':
                  anyContent(String(newValue));
                  break;

                default:
                  childNodes = quickdiff(node.parentNode, childNodes, newValue, get, node);
                  break;
              }
            }
          } else if ('ELEMENT_NODE' in newValue) {
            childNodes = quickdiff(node.parentNode, childNodes, newValue.nodeType === 11 ? slice.call(newValue.childNodes) : [newValue], get, node);
          }

          break;
      }
    };

    return anyContent;
  };

  var handleAttribute = function handleAttribute(node, name) {
    // hooks and ref
    if (name === 'ref') return function (ref) {
      ref.current = node;
    }; // direct setters

    if (name.slice(0, 1) === '.') {
      var setter = name.slice(1);
      return function (value) {
        node[setter] = value;
      };
    }

    var oldValue; // events

    if (name.slice(0, 2) === 'on') {
      var type = name.slice(2);
      if (name.toLowerCase() in node) type = type.toLowerCase();
      return function (newValue) {
        if (oldValue !== newValue) {
          if (oldValue) node.removeEventListener(type, oldValue, false);
          oldValue = newValue;
          if (newValue) node.addEventListener(type, newValue, false);
        }
      };
    } // all other cases


    var noOwner = true;
    var attribute = node.ownerDocument.createAttribute(name);
    return function (newValue) {
      if (oldValue !== newValue) {
        oldValue = newValue;

        if (oldValue == null) {
          if (!noOwner) {
            node.removeAttributeNode(attribute);
            noOwner = true;
          }
        } else {
          attribute.value = newValue;

          if (noOwner) {
            node.setAttributeNode(attribute);
            noOwner = false;
          }
        }
      }
    };
  };

  var handleText = function handleText(node) {
    var oldValue;
    return function (newValue) {
      if (oldValue !== newValue) {
        oldValue = newValue;
        node.textContent = newValue == null ? '' : newValue;
      }
    };
  };

  function handlers(options) {
    var type = options.type,
        path = options.path;
    var node = path.reduce(getNode, this);
    if (type === 'node') return handleAnything(node, []);
    if (type === 'attr') return handleAttribute(node, options.name);
    return handleText(node);
  }

  var empty = '';
  var trimStart = empty.trimStart || function () {
    return this.replace(/^[ \f\n\r\t]+/, empty);
  };
  var trimEnd = empty.trimEnd || function () {
    return this.replace(/[ \f\n\r\t]+$/, empty);
  };

  var prefix = 'isµ';
  var attr = /([^ \f\n\r\t\\>"'=]+)\s*=\s*(['"]?)$/;
  var templates = new WeakMap();

  var createEntry = function createEntry(type, template) {
    var _mapUpdates = mapUpdates(type, template),
        wire = _mapUpdates.wire,
        updates = _mapUpdates.updates;

    return {
      type: type,
      template: template,
      wire: wire,
      updates: updates
    };
  };

  var instrument = function instrument(template) {
    var text = [];

    var _loop = function _loop(i, length) {
      var chunk = i < 1 ? trimStart.call(template[i]) : template[i];
      if (attr.test(chunk) && isNode(template, i + 1)) text.push(chunk.replace(attr, function (_, $1, $2) {
        return "".concat(prefix).concat(i, "=").concat($2 ? $2 : '"').concat($1).concat($2 ? '' : '"');
      }));else {
        if (i + 1 < length) text.push(chunk, "<!--".concat(prefix).concat(i, "-->"));else text.push(trimEnd.call(chunk));
      }
    };

    for (var i = 0, length = template.length; i < length; i++) {
      _loop(i, length);
    }

    return text.join('').replace(/<([A-Za-z]+[A-Za-z0-9:._-]*)([^>]*?)(\/>)/g, unvoid);
  }; // TODO: I am not sure this is really necessary
  //       I might rather set an extra DON'T rule
  //       Let's play it safe for the time being.


  var isNode = function isNode(template, i) {
    while (i--) {
      var chunk = template[i];
      if (/<[A-Za-z][^>]+$/.test(chunk)) return true;
      if (/>[^<>]*$/.test(chunk)) return false;
    }

    return false;
  };

  var mapTemplate = function mapTemplate(type, template) {
    var text = instrument(template);
    var content = createFragment(text, type);
    var tw = createWalker(content);
    var nodes = [];
    var length = template.length - 1;
    var i = 0;
    var search = "".concat(prefix).concat(i);

    while (i < length) {
      var node = tw.nextNode();
      if (!node) throw "bad template: ".concat(text);

      if (node.nodeType === 8) {
        if (node.textContent === search) {
          nodes.push({
            type: 'node',
            path: getPath(node)
          });
          search = "".concat(prefix).concat(++i);
        }
      } else {
        while (node.hasAttribute(search)) {
          nodes.push({
            type: 'attr',
            path: getPath(node),
            name: node.getAttribute(search) // svg: type === 'svg'

          });
          node.removeAttribute(search);
          search = "".concat(prefix).concat(++i);
        }

        if (/^(?:style|textarea)$/i.test(node.tagName) && trimStart.call(trimEnd.call(node.textContent)) === "<!--".concat(search, "-->")) {
          nodes.push({
            type: 'text',
            path: getPath(node)
          });
          search = "".concat(prefix).concat(++i);
        }
      }
    }

    return {
      content: content,
      nodes: nodes
    };
  };

  var mapUpdates = function mapUpdates(type, template) {
    var _ref = templates.get(template) || setTemplate(type, template),
        content = _ref.content,
        nodes = _ref.nodes;

    var fragment = importNode.call(document, content, true);
    var updates = nodes.map(handlers, fragment);
    return {
      wire: getWire(fragment),
      updates: updates
    };
  };

  var retrieve = function retrieve(info, hole) {
    var sub = info.sub,
        stack = info.stack;
    var counter = {
      a: 0,
      aLength: sub.length,
      i: 0,
      iLength: stack.length
    };
    var wire = unroll(info, hole, counter);
    var a = counter.a,
        i = counter.i,
        aLength = counter.aLength,
        iLength = counter.iLength;
    if (a < aLength) sub.splice(a);
    if (i < iLength) stack.splice(i);
    return wire;
  };

  var setTemplate = function setTemplate(type, template) {
    var result = mapTemplate(type, template);
    templates.set(template, result);
    return result;
  };

  var unroll = function unroll(info, hole, counter) {
    var stack = info.stack;
    var i = counter.i,
        iLength = counter.iLength;
    var type = hole.type,
        template = hole.template,
        values = hole.values;
    var unknown = i === iLength;
    if (unknown) counter.iLength = stack.push(createEntry(type, template));
    counter.i++;
    unrollArray(info, values, counter);
    var entry = stack[i];
    if (!unknown && (entry.template !== template || entry.type !== type)) stack[i] = entry = createEntry(type, template);
    var _entry = entry,
        wire = _entry.wire,
        updates = _entry.updates;

    for (var _i = 0, length = updates.length; _i < length; _i++) {
      updates[_i](values[_i]);
    }

    return wire;
  };

  var unrollArray = function unrollArray(info, values, counter) {
    for (var i = 0, length = values.length; i < length; i++) {
      var hole = values[i];

      if (typeof(hole) === 'object' && hole) {
        if (hole instanceof Hole) values[i] = unroll(info, hole, counter);else if (isArray(hole)) {
          for (var _i2 = 0, _length = hole.length; _i2 < _length; _i2++) {
            var inner = hole[_i2];

            if (typeof(inner) === 'object' && inner && inner instanceof Hole) {
              var sub = info.sub;
              var a = counter.a,
                  aLength = counter.aLength;
              if (a === aLength) counter.aLength = sub.push(cacheInfo());
              counter.a++;
              hole[_i2] = retrieve(sub[a], inner);
            }
          }
        }
      }
    }
  };

  var unvoid = function unvoid(_, name, extra) {
    return /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i.test(name) ? _ : "<".concat(name).concat(extra, "></").concat(name, ">");
  };
  /**
   * Holds all necessary details needed to render the content further on. 
   * @constructor
   * @param {string} type The hole type, either `html` or `svg`.
   * @param {Array} template The template literals used to the define the content.
   * @param {Array} values Zero, one, or more interpolated values to render.
   */


  function Hole(type, template, values) {
    this.type = type;
    this.template = template;
    this.values = values;
  }

  /**
   * Used as template literal function tag, creates once the specified HTML content and it populates it via interpolations.
   * @param {Array} template The template literal with the HTML content to render.
   * @param  {...any} values Any interpolated value to use within the template.
   * @returns {Hole} An instance of Hole that will be normalized as DOM content once rendered.
   */

  var html = function html(template) {
    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    return new Hole('html', template, values);
  };
  /**
   * Used as template literal function tag, creates once the specified SVG content and it populates it via interpolations.
   * @param {Array} template The template literal with the SVG content to render.
   * @param  {...any} values Any interpolated value to use within the template.
   * @returns {Hole} An instance of Hole that will be normalized as DOM content once rendered.
   */

  var svg = function svg(template) {
    for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      values[_key2 - 1] = arguments[_key2];
    }

    return new Hole('svg', template, values);
  };
  /**
   * Render some content within the passed DOM node.
   * @param {Element} where The DOM node where to render some content.
   * @param {Element | Function | Hole} what A DOM node, a html/svg Hole, or a a function that returns previous values once invoked.
   * @returns {Element} The same DOM node where the content was rendered.
   */

  var render = function render(where, what) {
    var hole = typeof what === 'function' ? what() : what;
    var info = cache.get(where) || setCache(where);
    var wire = hole instanceof Hole ? retrieve(info, hole) : hole;

    if (wire !== info.wire) {
      info.wire = wire;
      where.textContent = '';
      where.appendChild(wire.valueOf());
    }

    return where;
  };

  exports.html = html;
  exports.render = render;
  exports.svg = svg;

  return exports;

}({}));
