import {writeFileSync} from 'fs';
import {ModuleKind, ScriptTarget} from 'typescript';
import {generateDocumentation, type DocEntry} from './docs';

export {DocEntry, generateDocumentation};

const entries: DocEntry[] = generateDocumentation({
  fileNames: process.argv.slice(2),
  options: {
    target: ScriptTarget.ES2020,
    module: ModuleKind.CommonJS
  }
});

writeFileSync('classes.json', JSON.stringify(entries, undefined, 2));
