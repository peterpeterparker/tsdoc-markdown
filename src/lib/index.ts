import {writeFileSync} from 'fs';
import {ModuleKind, ScriptTarget} from 'typescript';
import {buildDocumentation} from './docs';
import {documentationToMarkdown} from './markdown';
import type {DocEntry, DocEntryConstructor, DocEntryType} from './types';

export {buildDocumentation};
export {documentationToMarkdown};
export type {DocEntry, DocEntryConstructor, DocEntryType};

export const generateDocumentation = () => {
  const entries: DocEntry[] = buildDocumentation({
    fileNames: process.argv.slice(2),
    options: {
      target: ScriptTarget.ES2020,
      module: ModuleKind.CommonJS
    }
  });

  const markdown: string = documentationToMarkdown(entries);

  writeFileSync('docs.md', markdown, 'utf-8');
};
