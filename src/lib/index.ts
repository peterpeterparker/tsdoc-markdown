import {writeFileSync, existsSync, readFileSync} from 'fs';
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

  if (existsSync(outputFile)) {
    const fileContent = readFileSync(outputFile, 'utf-8');

    const regex = /<!-- TSDOC_START -->([^]*?)<!-- TSDOC_END -->/gm;
    const replace = `<!-- TSDOC_START -->\n\n${markdown}\n<!-- TSDOC_END -->`
    writeFileSync(outputFile, fileContent.replace(regex, replace), 'utf-8');

    return;
  }

  writeFileSync(outputFile, markdown, 'utf-8');
};
