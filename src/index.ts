import {writeFileSync} from 'fs';
import {ModuleKind, ScriptTarget} from 'typescript';
import {generateDocumentation, type DocEntry} from './docs';
import {documentationToMarkdown} from './markdown';

export {DocEntry, generateDocumentation};

const entries: DocEntry[] = generateDocumentation({
  fileNames: process.argv.slice(2),
  options: {
    target: ScriptTarget.ES2020,
    module: ModuleKind.CommonJS
  }
});

const markdown: string = documentationToMarkdown(entries);

writeFileSync('docs.md', markdown, 'utf-8');
