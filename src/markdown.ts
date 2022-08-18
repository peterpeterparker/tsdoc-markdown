import type {DocEntry} from './docs';

const docEntryToMarkdown = ({name}: DocEntry): string => {
  const md: string[] = [];
  md.push(`# ${name}`);

  return md.join('\n');
};

export const documentationToMarkdown = (entries: DocEntry[]): string =>
  entries.reduce((acc: string, entry: DocEntry) => `${acc}\n${docEntryToMarkdown(entry)}`, '');
