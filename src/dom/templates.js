import DEBUG from '../debug.js';

export default DEBUG ? new WeakMap : null;
