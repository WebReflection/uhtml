import {nodeResolve} from '@rollup/plugin-node-resolve';

export default [
  {
    plugins: [nodeResolve()],
    input: './esm/init-ssr.js_',
    output: {
      esModule: true,
      file: './esm/init-ssr.js',
    },
  },
];
