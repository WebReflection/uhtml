import { nodeResolve } from '@rollup/plugin-node-resolve';
import files from './files.js';

const target = 'dev';
const plugins = [nodeResolve()];

export default files(target, plugins);
