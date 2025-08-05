let direct = true;

/** @param {boolean} value */
export const _set = value => {
  direct = value;
};

/** @returns {boolean} */
export const _get = () => direct;
