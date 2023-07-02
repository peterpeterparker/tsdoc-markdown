import type {JSDocTagInfo, SymbolDisplayPart} from 'typescript';
import type {
  DocEntry,
  DocEntryConstructor,
  MarkdownEmoji,
  MarkdownHeadingLevel,
  MarkdownOptions
} from './types';

type Params = {name: string; documentation: string};

type Row = Required<Pick<DocEntry, 'name' | 'type' | 'documentation'>> &
  Pick<DocEntry, 'url'> & {
    params: Params[];
  };

const toParams = (parameters?: DocEntry[]): Params[] =>
  (parameters ?? []).map(({name, documentation}: DocEntry) => ({
    name,
    documentation: documentation ?? ''
  }));

const inlineDocParam = (documentation: string | undefined): string =>
  documentation !== undefined && documentation !== '' ? `: ${documentation}` : '';

const inlineParams = (params: Params[]): string[] =>
  params.map(({name, documentation}) => `* \`${name}\`${inlineDocParam(documentation)}`);

const classesToMarkdown = ({
  entry,
  headingLevel,
  emoji
}: {
  entry: DocEntry;
} & Required<Pick<MarkdownOptions, 'headingLevel'>> &
  Omit<MarkdownOptions, 'headingLevel'>): string => {
  const {name, url, documentation, methods, constructors} = entry;

  const markdown: string[] = [`${headingLevel}${emojiTitle({emoji, key: 'classes'})} ${name}\n`];
  documentation !== undefined && documentation !== '' && markdown.push(`${documentation}\n`);

  const publicConstructors: DocEntryConstructor[] = (constructors ?? []).filter(
    ({visibility}) => visibility === 'public'
  );

  if (publicConstructors?.length) {
    markdown.push(`${headingLevel}# Constructors\n`);

    markdown.push(
      ...publicConstructors.map(({parameters, documentation, visibility}) => {
        const docs: string[] = [`\`${visibility}\`${inlineDocParam(documentation)}\n`];

        if (parameters?.length) {
          docs.push(`Parameters:\n`);
          docs.push(...inlineParams(toParams(parameters)));
        }

        return docs.join('\n');
      })
    );

    markdown.push('\n');
  }

  if (!methods || methods.length === 0) {
    return markdown.join('\n');
  }

  markdown.push(`${headingLevel}# Methods\n`);
  markdown.push(`${tableOfContent({entries: methods ?? [], emoji})}\n`);

  // Explicitly do not pass repo to generate the source code link afterwards for the all block
  markdown.push(
    `${toMarkdown({
      entries: methods ?? [],
      headingLevel: `${headingLevel}#`,
      docType: 'Method'
    })}\n`
  );

  if (url !== undefined) {
    markdown.push(sourceCodeLink({emoji, url}));
  }

  return markdown.join('\n');
};

const sourceCodeLink = ({
  url,
  emoji
}: Pick<MarkdownOptions, 'emoji'> & Required<Pick<DocEntry, 'url'>>): string =>
  `[${emojiTitle({emoji, key: 'link'}).trim()} Source](${url})\n`;

const toMarkdown = ({
  entries,
  headingLevel,
  docType,
  emoji
}: {
  entries: DocEntry[];
  headingLevel: MarkdownHeadingLevel | '####';
  docType: 'Constant' | 'Function' | 'Method';
} & Pick<MarkdownOptions, 'emoji'>): string => {
  const jsDocsToParams = (jsDocs: JSDocTagInfo[]): Params[] => {
    const params: JSDocTagInfo[] = jsDocs.filter(({name}: JSDocTagInfo) => name === 'param');
    const texts: (SymbolDisplayPart[] | undefined)[] = params.map(({text}) => text);

    const parts: SymbolDisplayPart[][] = texts.reduce(
      (acc: SymbolDisplayPart[][], values: SymbolDisplayPart[] | undefined) => {
        if (values === undefined) {
          return acc;
        }

        return [...acc, values];
      },
      []
    );

    const toParam = (parts: SymbolDisplayPart[]): Params | undefined => {
      if (parts.find(({kind, text}) => kind === 'parameterName' && text !== '') === undefined) {
        return undefined;
      }

      const name = parts.find(({kind}) => kind === 'parameterName')?.text ?? '';
      const documentation = parts.find(({kind}) => kind === 'text')?.text ?? '';

      return {name, documentation};
    };

    return parts.map(toParam).filter((param) => param !== undefined) as Params[];
  };

  const rows: Row[] = entries.map(
    ({name, type, documentation, parameters, jsDocs, url}: DocEntry) => ({
      name,
      type: type ?? '',
      documentation: documentation ?? '',
      params: [...toParams(parameters), ...jsDocsToParams(jsDocs ?? [])],
      url
    })
  );

  // Avoid issue if the Markdown table gets formatted with Prettier
  const parseType = (type: string): string => type.replace(/ \| /, ' or ').replace(/ & /, ' and ');

  const rowToMarkdown = ({name, documentation, type, params, url}: Row): string => {
    const markdown: string[] = [`${headingLevel}# :gear: ${name}\n`];

    if (documentation.length) {
      markdown.push(`${documentation}\n`);
    }

    markdown.push(`| ${docType} | Type |`);
    markdown.push('| ---------- | ---------- |');
    markdown.push(`| \`${name}\` | \`${parseType(type)}\` |\n`);

    if (params.length) {
      markdown.push('Parameters:\n');
      markdown.push(...inlineParams(params));
      markdown.push('\n');
    }

    if (url !== undefined) {
      markdown.push(sourceCodeLink({emoji, url}));
    }

    return markdown.join('\n');
  };

  return rows.map(rowToMarkdown).join('\n');
};

const tableOfContent = ({
  entries,
  emoji
}: {
  entries: DocEntry[];
} & Pick<MarkdownOptions, 'emoji'>): string =>
  entries
    .map(
      ({name}) =>
        `- [${name}](#${emoji === undefined || emoji === null ? '' : `${emoji.entry}-`}${name
          .toLowerCase()
          .replace(/ /g, '-')})`
    )
    .join('\n');

const emojiTitle = ({
  emoji,
  key
}: {
  key: keyof MarkdownEmoji;
} & Pick<MarkdownOptions, 'emoji'>): string =>
  emoji === undefined || emoji === null ? '' : ` :${emoji[key]}:`;

const DEFAULT_EMOJI: MarkdownEmoji = {
  classes: 'factory',
  functions: 'toolbox',
  constants: 'wrench',
  entry: 'gear',
  link: 'link'
};

/**
 * Convert the documentation entries to an opinionated Markdown format.
 *
 * @param {entries: DocEntry[]; options: MarkdownOptions;} params
 * @param params.entries The entries of the documentation (functions, constants and classes).
 * @param params.options Optional configuration to render the Markdown content. See `types.ts` for details.
 */
export const documentationToMarkdown = ({
  entries,
  options
}: {
  entries: DocEntry[];
  options?: MarkdownOptions;
}): string => {
  const {headingLevel: userHeadingLevel, emoji: userEmoji} = options ?? {
    headingLevel: '##',
    emoji: DEFAULT_EMOJI
  };

  const headingLevel = userHeadingLevel ?? '##';

  const emoji: MarkdownEmoji | undefined =
    userEmoji === null ? undefined : userEmoji ?? DEFAULT_EMOJI;

  const functions: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'function');
  const classes: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'class');
  const constants: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'const');

  const markdown: string[] = [];

  if (functions.length) {
    markdown.push(`${headingLevel}${emojiTitle({emoji, key: 'functions'})} Functions\n`);
    markdown.push(`${tableOfContent({entries: functions, emoji})}\n`);
    markdown.push(
      `${toMarkdown({entries: functions, headingLevel, emoji, docType: 'Function'})}\n`
    );
  }

  if (constants.length) {
    markdown.push(`${headingLevel}${emojiTitle({emoji, key: 'constants'})} Constants\n`);
    markdown.push(`${tableOfContent({entries: constants, emoji})}\n`);
    markdown.push(
      `${toMarkdown({entries: constants, headingLevel, emoji, docType: 'Constant'})}\n`
    );
  }

  markdown.push(
    classes.map((entry: DocEntry) => classesToMarkdown({entry, headingLevel, emoji})).join('\n')
  );

  return markdown.join('\n');
};
