import {existsSync, readFileSync, writeFileSync} from 'fs';
import {buildDocumentation} from './docs';
import {documentationToMarkdown} from './markdown';
import type {DocEntry, DocEntryConstructor, DocEntryType} from './types';

export {buildDocumentation};
export {documentationToMarkdown};
export type {DocEntry, DocEntryConstructor, DocEntryType};

/**
 * Generate documentation and write output to a file.
 * If the file exists, it will try to insert the docs between <!-- TSDOC_START --> and <!-- TSDOC_END --> comments.
 * If these does not exist, the output file will be overwritten.
 *
 * @param {inputFiles: string[]; outputFile: string;} params
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

    const regex = /(<!-- TSDOC_START -->)[\s\S]*?(<!-- TSDOC_END -->)$/gm;

    if (!fileContent.match(regex)) {
      writeFileSync(outputFile, markdown, 'utf-8');
      return;
    }

    const replace = `<!-- TSDOC_START -->\n\n${markdown}\n<!-- TSDOC_END -->`;

    writeFileSync(outputFile, fileContent.replace(regex, replace), 'utf-8');

    return;
  }

  writeFileSync(outputFile, markdown, 'utf-8');
};
