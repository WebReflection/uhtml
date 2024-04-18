import { copyFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import fg from "fast-glob"

const dir = fileURLToPath(new URL("..", import.meta.url))

const dts = await fg(resolve(dir, "types/**/*.d.ts"))

// Create MTS and CTS files
const dmts = dts.map(f => copyFileSync(f, f.replace(/\.d\.ts$/, ".d.mts")))
const dcts = dts.map(f => copyFileSync(f, f.replace(/\.d\.ts$/, ".d.cts")))

console.log(`Copied ${dmts.length} files from \`*.d.ts\` to \`*.d.mts\``)
console.log(`Copied ${dcts.length} files from \`*.d.ts\` to \`*.d.cts\``)