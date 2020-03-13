export const createCache = () => ({
  stack: [],    // each template gets a stack for each interpolation "hole"

  entry: null,  // each entry contains details, such as:
                //  * the template that is representing
                //  * the type of node it represents (html or svg)
                //  * the content fragment with all nodes
                //  * the list of updates per each node (template holes)
                //  * the "wired" node or fragment that will get updates
                // if the template or type are different from the previous one
                // the entry gets re-created each time

  wire: null    // each rendered node represent some wired content and
                // this reference to the latest one. If different, the node
                // will be cleaned up and the new "wire" will be appended
});

// this helper simplifies wm.get(key) || wm.set(key, value).get(key) operation
// enabling wm.get(key) || setCache(wm, key, value); to boost performance too
export const setCache = (cache, key, value) => {
  cache.set(key, value);
  return value;
};
