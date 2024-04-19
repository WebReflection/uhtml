import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import fg from 'fast-glob';

const dir = fileURLToPath(new URL('..', import.meta.url));

const dts = await fg(resolve(dir, 'types/**/*.d.ts'));

// Create MTS and CTS files
for (let f of dts) {
  copyFileSync(f, f.replace(/\.d\.ts$/, '.d.mts'));
  copyFileSync(f, f.replace(/\.d\.ts$/, '.d.cts'));
}

console.log(`Copied \x1b[1m${dts.length} files\x1b[0m from \`*.d.ts\` to \`*.d.[cm]ts\``);
