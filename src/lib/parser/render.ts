import type {DocEntry, MarkdownEmoji, MarkdownOptions} from '../types';
import {inlineReferences} from './jdocs/render';
import type {JsDocsMetadata} from './types';

export const emojiTitle = ({
  emoji,
  key
}: {
  key: keyof MarkdownEmoji;
} & Pick<MarkdownOptions, 'emoji'>): string =>
  emoji === undefined || emoji === null ? '' : ` :${emoji[key]}:`;

const sourceCodeLink = ({
  url,
  emoji
}: Pick<MarkdownOptions, 'emoji'> & Required<Pick<DocEntry, 'url'>>): string =>
  `[${emojiTitle({emoji, key: 'link'}).trim()}${emoji !== null && emoji !== undefined ? ' ' : ''}Source](${url})\n`;

export const metadataToMarkdown = ({
  returnType,
  references,
  examples,
  url,
  emoji
}: JsDocsMetadata &
  Pick<DocEntry, 'url'> & {emoji: MarkdownEmoji | null | undefined}): string[] => {
  const markdown: string[] = [];

  if (returnType !== undefined && returnType !== '') {
    markdown.push(`Returns:\n`);
    markdown.push(`${returnType}\n`);
  }

  if (references?.length) {
    markdown.push(`References:\n`);
    markdown.push(...inlineReferences(references));
    markdown.push('\n');
  }

  if (examples.length) {
    markdown.push('Examples:\n');
    markdown.push(...examples);
    markdown.push('\n');
  }

  if (url !== undefined) {
    markdown.push(sourceCodeLink({emoji, url}));
  }

  return markdown;
};
