import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import files from './files.js';

const target = 'prod';
const plugins = [nodeResolve()].concat(process.env.NO_MIN ? [] : [terser()]);

export default files(target, plugins);
