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
    plugins: [nodeResolve()],
    input: './esm/ssr.js',
    output: {
      esModule: false,
      file: './esm/init-ssr.js',
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
    input: './esm/reactive.js',
    output: {
      esModule: true,
      file: './reactive.js',
    },
  },
  {
    plugins,
    input: './esm/reactive/preact.js',
    output: {
      esModule: true,
      file: './preactive.js',
    },
  },
  {
    plugins,
    input: './esm/reactive/signal.js',
    output: {
      esModule: true,
      file: './signal.js',
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
