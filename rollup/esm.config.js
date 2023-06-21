import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: './esm/index.js',
  plugins: [
    nodeResolve(),
    terser()
  ],
  output: {
    esModule: false,
    file: './esm.js',
    format: 'module'
  }
};
