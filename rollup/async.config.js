import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default {
  input: './esm/async.js',
  plugins: [
    nodeResolve(),
    terser()
  ],
  output: {
    esModule: false,
    exports: 'named',
    file: './async.js',
    format: 'iife',
    name: 'uhtml'
  }
};
