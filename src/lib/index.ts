import {writeFileSync} from 'fs';
import {ModuleKind, ScriptTarget} from 'typescript';
import {buildDocumentation} from './docs';
import {documentationToMarkdown} from './markdown';
import type {DocEntry, DocEntryConstructor, DocEntryType} from './types';

export {buildDocumentation};
export {documentationToMarkdown};
export type {DocEntry, DocEntryConstructor, DocEntryType};

export const generateDocumentation = () => {
  const inputFilenames: string[] = process.argv.slice(2)[0]?.split(',');
  const outputFilename: string = process.argv.slice(2)[1] ?? 'README.md';

  if (!inputFilenames) {
    throw new Error('No source file(s) provided.');
  }

  const entries: DocEntry[] = buildDocumentation({
    filenames: inputFilenames,
    options: {
      target: ScriptTarget.ES2020,
      module: ModuleKind.CommonJS
    }
  });

  const markdown: string = documentationToMarkdown(entries);

  writeFileSync(outputFilename, markdown, 'utf-8');
};
