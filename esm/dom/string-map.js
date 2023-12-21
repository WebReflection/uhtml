const key = name => `data-${name.replace(/[A-Z]/g, U => `-${U.toLowerCase()}`)}`;
const prop = name => name.slice(5).replace(/-([a-z])/g, (_, $1) => $1.toUpperCase());
const byData = name => name.startsWith('data-');

const stringMapHandler = {
  deleteProperty(element, name) {
    name = key(name);
    if (element.hasAttribute(name))
      element.removeAttribute(name);
    return true;
  },

  get(element, name) {
    return element.getAttribute(key(name));
  },

  has(element, name) {
    return element.hasAttribute(key(name));
  },

  ownKeys(element) {
    return element.getAttributeNames().filter(byData).map(prop);
  },

  set(element, name, value) {
    element.setAttribute(key(name), value);
    return true;
  },
};

export default element => new Proxy(element, stringMapHandler);
