import {existsSync, readFileSync, writeFileSync} from 'fs';
import {buildDocumentation} from './docs';
import {documentationToMarkdown} from './markdown';
import type {
  BuildOptions,
  DocEntry,
  DocEntryConstructor,
  DocEntryType,
  MarkdownOptions
} from './types';

export {buildDocumentation};
export {documentationToMarkdown};
export type {DocEntry, DocEntryConstructor, DocEntryType};

/**
 * Generate documentation and write output to a file.
 * If the file exists, it will try to insert the docs between <!-- TSDOC_START --> and <!-- TSDOC_END --> comments.
 * If these does not exist, the output file will be overwritten.
 *
 * @param {inputFiles: string[]; outputFile: string; markdownOptions?: MarkdownOptions; buildOptions?: BuildOptions;} params
 * @param params.inputFiles The list of files to scan for documentation. Absolute or relative path.
 * @param params.outputFile The file to output the documentation in Markdown.
 * @param params.markdownOptions Optional settings passed to the Markdown parser. See `MarkdownOptions` for details.
 * @param params.buildOptions Options to construct the documentation tree. See `BuildOptions` for details.
 */
export const generateDocumentation = ({
  inputFiles,
  outputFile,
  markdownOptions,
  buildOptions
}: {
  inputFiles: string[];
  outputFile: string;
  markdownOptions?: MarkdownOptions;
  buildOptions?: BuildOptions;
}) => {
  const entries: DocEntry[] = buildDocumentation({
    inputFiles: inputFiles,
    options: buildOptions
  });

  const markdown: string = documentationToMarkdown({entries, options: markdownOptions});

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
