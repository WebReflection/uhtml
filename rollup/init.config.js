import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const plugins = [
  nodeResolve(),
].concat(
  process.env.NO_MIN ? [] : [terser()]
);

export default {
  plugins,
  input: './esm/init.js',
  output: {
    esModule: true,
    file: './init.js',
  },
};
