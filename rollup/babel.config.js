import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import includePaths from 'rollup-plugin-includepaths';
export default {
  input: './esm/index.js',
  plugins: [
    includePaths({
      include: {},
    }),
    resolve({module: true}),
    babel({presets: ['@babel/preset-env']})
  ],
  context: 'null',
  moduleContext: 'null',
  output: {
    exports: 'named',
    file: './index.js',
    format: 'iife',
    name: 'uhtml'
  }
};
