import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import includePaths from 'rollup-plugin-includepaths';

export default {
  input: './esm/async.js',
  plugins: [
    includePaths({
      include: {
        '@ungap/create-content': 'node_modules/@ungap/degap/create-content.js'
      },
    }),
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
