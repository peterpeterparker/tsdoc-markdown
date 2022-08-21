import esbuild from 'esbuild';
import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'fs';
import {join} from 'path';

// Peer dependencies
const listPeerDependencies = (packageJson) => {
  const json = readFileSync(packageJson, 'utf8');
  const {peerDependencies} = JSON.parse(json);
  return peerDependencies ?? {};
};

const peerDependencies = listPeerDependencies(join(process.cwd(), 'package.json'));

// Input folder
const rootDir = join(process.cwd(), 'src', 'lib');
// Output folder
const dist = join(process.cwd(), 'dist');

/**
 * Create dist folder if not exists yet
 */
const createDistFolder = () => {
  if (!existsSync(dist)) {
    mkdirSync(dist);
  }
};

const buildEsmCjs = () => {
  const entryPoints = readdirSync(rootDir)
    .filter(
      (file) =>
        !file.includes('test') &&
        !file.includes('spec') &&
        !file.includes('mock') &&
        statSync(join(rootDir, file)).isFile()
    )
    .map((file) => `${rootDir}/${file}`);

  // esm output bundles with code splitting
  esbuild
    .build({
      entryPoints,
      outdir: 'dist/esm',
      bundle: true,
      sourcemap: true,
      minify: true,
      splitting: true,
      format: 'esm',
      platform: 'node',
      banner: {
        js: "import { createRequire } from 'module';import path from 'path';import {fileURLToPath} from 'url';const __filename = fileURLToPath(import.meta.url);const __dirname = path.dirname(__filename);const require = createRequire(import.meta.url);"
      },
      outExtension: {
        '.js': '.mjs'
      },
      target: ['node16'],
      external: [...Object.keys(peerDependencies)]
    })
    .catch(() => process.exit(1));

  // cjs output bundle
  esbuild
    .build({
      entryPoints: [join(rootDir, 'index.ts')],
      outfile: 'dist/cjs/index.cjs.js',
      bundle: true,
      sourcemap: true,
      minify: true,
      platform: 'node',
      target: ['node16'],
      external: [...Object.keys(peerDependencies)]
    })
    .catch(() => process.exit(1));
};

// Add some entries to bundle
const writeEntries = () => {
  // an entry file for cjs at the root of the bundle
  writeFileSync(join(dist, 'index.mjs'), "export * from './esm/index.mjs';");

  // an entry file for esm at the root of the bundle
  writeFileSync(join(dist, 'index.cjs.js'), "module.exports = require('./cjs/index.cjs.js');");
};

createDistFolder();
buildEsmCjs();
writeEntries();
