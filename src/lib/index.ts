import {writeFileSync} from 'fs';
import {buildDocumentation} from './docs';
import {documentationToMarkdown} from './markdown';
import type {DocEntry, DocEntryConstructor, DocEntryType} from './types';

export {buildDocumentation};
export {documentationToMarkdown};
export type {DocEntry, DocEntryConstructor, DocEntryType};

/**
 * Generate documentation and write output to a file.
 *
 * @param {Object} params
 * @param params.inputFiles The list of files to scan for documentation. Absolute or relative path.
 * @param params.outputFile The file to output the documentation in Markdown.
 */
export const generateDocumentation = ({
  inputFiles,
  outputFile
}: {
  inputFiles: string[];
  outputFile: string;
}) => {
  const entries: DocEntry[] = buildDocumentation({
    inputFiles: inputFiles
  });

  const markdown: string = documentationToMarkdown(entries);

  writeFileSync(outputFile, markdown, 'utf-8');
};
