import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const plugins = [
  nodeResolve(),
].concat(
  process.env.NO_MIN ? [] : [terser()]
);

export default [
  {
    plugins: [nodeResolve()],
    input: './esm/keyed.js',
    output: {
      esModule: false,
      file: './esm/init.js',
      format: 'iife',
      name: 'uhtml',
    },
  },
  {
    plugins,
    input: './esm/index.js',
    output: {
      esModule: true,
      file: './index.js',
    },
  },
  {
    plugins,
    input: './esm/keyed.js',
    output: {
      esModule: true,
      file: './keyed.js',
    },
  },
  {
    plugins,
    input: './esm/node.js',
    output: {
      esModule: true,
      file: './node.js',
    },
  },
  {
    plugins,
    input: './esm/dom/index.js',
    output: {
      esModule: true,
      file: './dom.js',
    },
  },
];
