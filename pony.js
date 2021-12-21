import {readFileSync, writeFileSync} from 'fs';

const dropIE = s => s.replace(/^import\s+.+/mg, '').replace(/^export\s+/mg, '');

const createContent = readFileSync('./node_modules/@webreflection/create-content/esm/index.js').toString();
const uwire = readFileSync('./node_modules/@webreflection/uwire/esm/index.js').toString();
const uhandlers = readFileSync('./node_modules/uhandlers/esm/index.js').toString();

const init = readFileSync('./esm/init.js').toString();
const handlers = readFileSync('./esm/handlers.js').toString();
const rabbit = readFileSync('./esm/rabbit.js').toString();
const index = readFileSync('./esm/index.js').toString();

const outcome = [
  createContent.replace(/^export\s+.*/mg, '').replace(/ svg\b/g, ' root').replace(/\bcreate\b/g, 'createContent'),
  dropIE(uwire),
  dropIE(uhandlers),
  dropIE(handlers),
  dropIE(rabbit),
  dropIE(index).replace(/\bcache\b/g, '_cache').replace(/^\{/m, 'return {')
];

writeFileSync(
  './esm/init.js',
  init.replace(
    /\/\*\*start\*\*\/[\s\S]*?\/\*\*end\*\*\//,
    `/**start**/\n${outcome.join('\n')}\n/**end**/`
  )
);
