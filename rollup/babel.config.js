import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: './esm/index.js',
  plugins: [
    nodeResolve(),
  ],
  
  output: {
    esModule: false,
    exports: 'named',
    file: './index.js',
    format: 'iife',
    name: 'uhtml'
  }
};
