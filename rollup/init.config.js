import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: './esm/init.js',
  plugins: [
    nodeResolve(),
    terser()
  ],
  output: {
    esModule: false,
    file: './init.js',
    format: 'module'
  }
};
