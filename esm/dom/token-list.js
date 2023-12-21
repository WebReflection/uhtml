import { empty } from '../utils.js';

const { entries, keys, values } = Object;
const { forEach } = empty;

const classes = element => {
  const { className } = element;
  return className ? className.split(/\s+/) : [];
};

const update = (element, tokens) => {
  element.className = [...tokens].join(' ');
};

const tokenListHandler = {
  get(element, name) {
    switch(name) {
      case 'length': return classes(element).length;
      case 'value': return element.className;
      case 'add': return add.bind(element);
      case 'contains': return contains.bind(element);
      case 'entries': return entries.bind(null, classes(element));
      case 'forEach': return forEach.bind(classes(element));
      case 'keys': return keys.bind(null, classes(element));
      case 'remove': return remove.bind(element);
      case 'replace': return replace.bind(element);
      case 'toggle': return toggle.bind(element);
      case 'values': return values.bind(null, classes(element));
    }
  }
};

export default element => new Proxy(element, tokenListHandler);

function add(...tokens) {
  update(this, new Set(classes(this).concat(tokens)));
}

function contains(token) {
  return classes(this).includes(token);
}

function remove(...tokens) {
  const previous = new Set(classes(this));
  for (const token of tokens) previous.delete(token);
  update(this, previous);
}

function replace(oldToken, newToken) {
  const tokens = new Set(classes(this));
  if (tokens.has(oldToken)) {
    tokens.delete(oldToken);
    tokens.add(newToken);
    return !update(this, tokens);
  }
  return false;
}

function toggle(token, force) {
  const tokens = new Set(classes(this));
  if (tokens.has(token)) {
    if (force) return true;
    tokens.delete(token);
    update(this, tokens);
  }
  else if (force || arguments.length === 1) {
    tokens.add(token);
    return !update(this, tokens);
  }
  return false;
}
