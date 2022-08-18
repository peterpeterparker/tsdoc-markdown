import esbuild from 'esbuild';
import {existsSync, mkdirSync, readdirSync, statSync, writeFileSync} from 'fs';
import {join} from 'path';

const dist = join(process.cwd(), 'dist');

const createDistFolder = () => {
  if (!existsSync(dist)) {
    mkdirSync(dist);
  }
};

const buildEsmCjs = () => {
  const entryPoints = readdirSync(join(process.cwd(), 'src'))
    .filter(
      (file) =>
        !file.includes('test') &&
        !file.includes('spec') &&
        statSync(join(process.cwd(), 'src', file)).isFile()
    )
    .map((file) => `src/${file}`);

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
      target: ['node16']
    })
    .catch(() => process.exit(1));

  // cjs output bundle
  esbuild
    .build({
      entryPoints: ['src/index.ts'],
      outfile: 'dist/cjs/index.cjs.js',
      bundle: true,
      sourcemap: true,
      minify: true,
      platform: 'node',
      target: ['node16']
    })
    .catch(() => process.exit(1));
};

const writeEntries = () => {
  // an entry file for cjs at the root of the bundle
  writeFileSync(join(dist, 'index.mjs'), "export * from './esm/index.mjs';");

  // an entry file for esm at the root of the bundle
  writeFileSync(join(dist, 'index.cjs.js'), "module.exports = require('./cjs/index.cjs.js');");
};

createDistFolder();
buildEsmCjs();
writeEntries();
