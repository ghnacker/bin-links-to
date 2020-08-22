import * as path from 'path';
import * as glob from 'glob';
import * as yargs from 'yargs';

import { binLinksTo } from './bin-links-to';

const argv = yargs
  .usage('Usage: $0 [-d] [-b <bin, ...>] [-t <dir, ...>]')
  .option('b', {
    alias: 'bin',
    describe: 'bin package names',
    type: 'array',
  })
  .option('d', {
    alias: 'dev',
    describe: 'bin packages from devDependencies',
    default: true,
    type: 'boolean',
  })
  .option('t', {
    alias: 'to',
    describe: 'target package directories',
    type: 'array',
  })
  .argv;

let deps = (argv.bin || []) as string[];
if (argv.dev) {
  const cwd = process.cwd();
  const pkg = require(path.join(cwd, 'package.json'));
  deps = deps.concat(Object.keys(pkg.devDependencies || {}));
}
const bins = deps.map(p => 'node_modules/' + p);

const targets = argv._.concat((argv.to || []) as string[])
  .map(f => glob.sync(f, { nonull: true }))
  .reduce((t, g) => t.concat(g), []);

binLinksTo(bins, targets)
  .catch(e => { console.warn(e.message); process.exit(1); });
