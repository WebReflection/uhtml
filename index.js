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

  var isArray = Array.isArray;
  var _ref = [],
      indexOf = _ref.indexOf,
      slice$1 = _ref.slice;

  var empty = '';
  var trimStart = empty.trimStart || function (str) {
    return str.replace(/^[ \f\n\r\t]+/, empty);
  };
  var trimEnd = empty.trimEnd || function (str) {
    return str.replace(/[ \f\n\r\t]+$/, empty);
  };

  var edgeCases = 'textarea,style';
  var findNode = function findNode(content, selector) {
    var search = "<".concat(selector, "></").concat(selector, ">");
    var nodes = content.querySelectorAll(edgeCases);

    for (var i = 0, length = nodes.length; i < length; i++) {
      if (trimStart.call(trimEnd.call(nodes[i].textContent)) === search) return nodes[i];
    }

    throw new Error("".concat(edgeCases, " bad content"));
  };
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
    var nodes = slice$1.call(childNodes, 0);
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
  var noChildNodes = function noChildNodes(name) {
    return /^(?:style|textarea)$/i.test(name);
  };
  var isVoid = function isVoid(name) {
    return /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i.test(name);
  };
  var removeAttributeNode = function removeAttributeNode(node, attribute) {
    node.removeAttributeNode(attribute);
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

  var handleAttribute = function handleAttribute(node, attribute, name, isSVG) {
    // hooks and ref
    if (name === 'ref') return function (ref) {
      ref.current = node;
    }; // direct setters

    if (name.slice(0, 1) === '.') {
      removeAttributeNode(node, attribute);
      return isSVG ? function (value) {
        try {
          node[name] = value;
        } catch (nope) {
          node.setAttribute(name, value);
        }
      } : function (value) {
        node[name] = value;
      };
    }

    var oldValue; // events

    if (name.slice(0, 2) === 'on') {
      removeAttributeNode(node, attribute);
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


    var noOwner = false;
    return function (newValue) {
      if (oldValue !== newValue) {
        oldValue = newValue;

        if (oldValue == null) {
          if (!noOwner) {
            removeAttributeNode(node, attribute);
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

  function handlers(_ref) {
    var type = _ref.type,
        path = _ref.path,
        name = _ref.name;
    var node = path.reduce(getNode, this);
    return type === 'attr' ? handleAttribute(node, node.getAttributeNode(name), name, type === 'svg') : noChildNodes(name) ? handleText(node) : handleAnything(node, []);
  }

  var prefix = 'no-';
  var re = /<([A-Za-z]+[A-Za-z0-9:._-]*)([^>]*?)(\/>)/g;
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
    var selectors = [];

    for (var i = 0, length = template.length; i < length; i++) {
      var chunk = i < 1 ? trimStart.call(template[i]) : template[i];

      if (/([^ \f\n\r\t\\>"'=]+)\s*=\s*(['"]?)$/.test(chunk)) {
        var name = RegExp.$1;
        text.push(chunk.replace(/([^ \f\n\r\t\\>"'=]+)\s*=\s*(['"]?)$/, "".concat(prefix, "$1=$2").concat(i)));
        selectors.push("[".concat(prefix).concat(name, "=\"").concat(i, "\"]"));
      } else {
        text.push(chunk);

        if (i + 1 < length) {
          text.push("<".concat(prefix).concat(i, "></").concat(prefix).concat(i, ">"));
          selectors.push(prefix + i);
        }
      }
    } // console.log(trimEnd.call(text.join('')).replace(re, place));


    return {
      text: trimEnd.call(text.join('')).replace(re, place),
      selectors: selectors
    };
  };

  var mapTemplate = function mapTemplate(type, template) {
    var _instrument = instrument(template),
        text = _instrument.text,
        selectors = _instrument.selectors;

    var content = createContent(text, type);
    var nodes = [];

    for (var i = 0, length = selectors.length; i < length; i++) {
      var selector = selectors[i];
      var placeholder = content.querySelector(selector) || findNode(content, selector);
      var ownerDocument = placeholder.ownerDocument;

      if (selector.charAt(0) === '[') {
        var name = selector.slice(1 + prefix.length, selector.indexOf('='));
        placeholder.removeAttribute(prefix + name);
        var attribute = ownerDocument.createAttribute(name);
        placeholder.setAttributeNode(attribute);
        nodes.push({
          type: 'attr',
          path: getPath(placeholder),
          name: name
        });
      } else {
        var tagName = placeholder.tagName;
        nodes.push({
          type: 'node',
          path: getPath(placeholder),
          name: tagName
        });

        if (!noChildNodes(tagName)) {
          var comment = placeholder.ownerDocument.createComment('µ');
          placeholder.parentNode.replaceChild(comment, placeholder);
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

  var place = function place(_, name, extra) {
    return isVoid(name) ? _ : "<".concat(name).concat(extra, "></").concat(name, ">");
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

  function Hole(type, template, values) {
    this.type = type;
    this.template = template;
    this.values = values;
  }

  var html = function html(template) {
    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    return new Hole('html', template, values);
  };
  var svg = function svg(template) {
    for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      values[_key2 - 1] = arguments[_key2];
    }

    return new Hole('svg', template, values);
  };
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
