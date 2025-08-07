import type {JSDocTagInfo} from 'typescript';
import type {
  DocEntry,
  DocEntryConstructor,
  MarkdownEmoji,
  MarkdownHeadingLevel,
  MarkdownOptions
} from '../types';
import {jsDocsMetadata, jsDocsToParams} from './jdocs/mapper';
import {emojiTitle, metadataToMarkdown} from './render';
import type {Params, Row} from './types';

const toParams = (parameters?: DocEntry[]): Params[] =>
  (parameters ?? []).map(({name, documentation}: DocEntry) => ({
    name,
    documentation: documentation ?? ''
  }));

const inlineDocParam = (documentation: string | undefined): string =>
  documentation !== undefined && documentation !== '' ? `: ${documentation}` : '';

const inlineParams = (params: Params[]): string[] =>
  params.map(({name, documentation}) => `* \`${name}\`${inlineDocParam(documentation)}`);

const reduceStatic = (values: DocEntry[]): [DocEntry[], DocEntry[]] =>
  values.reduce<[DocEntry[], DocEntry[]]>(
    ([i, s], value) => [
      [...i, ...(value.isStatic !== true ? [value] : [])],
      [...s, ...(value.isStatic === true ? [value] : [])]
    ],
    [[], []]
  );

const classesToMarkdown = ({
  entry,
  headingLevel,
  emoji
}: {
  entry: DocEntry;
} & Required<Pick<MarkdownOptions, 'headingLevel'>> &
  Omit<MarkdownOptions, 'headingLevel'>): string => {
  const {name, url, documentation, methods, properties, constructors, jsDocs} = entry;

  const markdown: string[] = [`${headingLevel}${emojiTitle({emoji, key: 'classes'})} ${name}\n`];

  if (documentation !== undefined && documentation !== '') {
    markdown.push(`${documentation}\n`);
  }

  const metadata = metadataToMarkdown({
    ...jsDocsMetadata(jsDocs),
    url,
    emoji
  });

  markdown.push(...metadata);

  const publicConstructors: DocEntryConstructor[] = (constructors ?? []).filter(
    ({visibility}) => visibility === 'public'
  );

  if (publicConstructors.length > 0) {
    markdown.push(`${headingLevel}# Constructors\n`);

    markdown.push(
      ...publicConstructors.map(({parameters, documentation, visibility}) => {
        const docs: string[] = [`\`${visibility}\`${inlineDocParam(documentation)}\n`];

        if ((parameters?.length ?? 0) > 0) {
          docs.push(`Parameters:\n`);
          docs.push(...inlineParams(toParams(parameters)));
        }

        return docs.join('\n');
      })
    );

    markdown.push('\n');
  }

  const methodsToMarkdown = ({
    methods,
    titlePrefix
  }: {
    methods: DocEntry[];
    titlePrefix?: string;
  }): void => {
    if ((methods?.length ?? 0) === 0) {
      return;
    }

    markdown.push(`${headingLevel}# ${titlePrefix ?? ''}Methods\n`);
    markdown.push(`${tableOfContent({entries: methods, emoji})}\n`);

    // Explicitly do not pass repo to generate the source code link afterwards for the all block
    markdown.push(
      toMarkdown({
        entries: methods ?? [],
        headingLevel: `${headingLevel}#`,
        docType: 'Method',
        emoji
      })
    );
  };

  const [instanceMethods, staticMethods] = reduceStatic(methods ?? []);

  methodsToMarkdown({methods: staticMethods, titlePrefix: 'Static '});
  methodsToMarkdown({methods: instanceMethods});

  const propertiesToMarkdown = ({
    properties,
    titlePrefix
  }: {
    properties: DocEntry[];
    titlePrefix?: string;
  }): void => {
    if ((properties?.length ?? 0) === 0) {
      return;
    }

    markdown.push(`${headingLevel}# ${titlePrefix ?? ''}Properties\n`);
    markdown.push(`${tableOfContent({entries: properties ?? [], emoji})}\n`);

    // Explicitly do not pass repo to generate the source code link afterwards for the all block
    markdown.push(
      toMarkdown({
        entries: properties ?? [],
        headingLevel: `${headingLevel}#`,
        docType: 'Property',
        emoji
      })
    );
  };

  const [instanceProperties, staticProperties] = reduceStatic(properties ?? []);

  propertiesToMarkdown({properties: staticProperties, titlePrefix: 'Static '});
  propertiesToMarkdown({properties: instanceProperties});

  return markdown.join('\n');
};

const interfacesToMarkdown = ({
  entry,
  headingLevel,
  emoji
}: {
  entry: DocEntry;
} & Required<Pick<MarkdownOptions, 'headingLevel'>> &
  Omit<MarkdownOptions, 'headingLevel'> &
  Pick<MarkdownOptions, 'emoji'>): string => {
  const {name, documentation} = entry;

  const markdown: string[] = [
    `${headingLevel}# ${emoji === undefined || emoji === null ? '' : ':gear: '}${name}\n`
  ];

  if (documentation !== undefined) {
    markdown.push(`${documentation}\n`);
  }

  markdown.push(`| Property | Type | Description |`);
  markdown.push('| ---------- | ---------- | ---------- |');

  (entry.properties ?? []).forEach(({name, type, documentation, jsDocs}) => {
    const jsDocsDescription = (jsDocs ?? []).map(
      ({name, text}: JSDocTagInfo) =>
        `${name}${text !== undefined ? `: ${text.map(({text}) => text).join('')}` : ''}`
    );

    markdown.push(
      `| \`${name}\` | \`${parseType(type ?? '')}\` | ${documentation !== undefined && documentation !== '' ? parseType(documentation).replace(/\r?\n|\r/g, '') : ''}${jsDocsDescription.length > 0 ? ` ${parseType(jsDocsDescription.join(''))}` : ''} |`
    );
  });

  markdown.push('\n');

  return markdown.join('\n');
};

// Avoid issue if the Markdown table gets formatted with Prettier
const parseType = (type: string): string =>
  type
    .split('\n')
    .map((line) => line.trim())
    .join(' ')
    .replace(/ \| /g, ' or ')
    .replace(/ & /g, ' and ');

const toMarkdown = ({
  entries,
  headingLevel,
  docType,
  emoji
}: {
  entries: DocEntry[];
  headingLevel: MarkdownHeadingLevel | '####';
  docType: 'Constant' | 'Function' | 'Method' | 'Property' | 'Type' | 'Enum';
} & Pick<MarkdownOptions, 'emoji'>): string => {
  const rows: Row[] = entries.map(
    ({name, type, documentation, parameters, jsDocs, url}: DocEntry) => ({
      name,
      type: type ?? '',
      documentation: documentation ?? '',
      params: [...toParams(parameters), ...jsDocsToParams(jsDocs)],
      ...jsDocsMetadata(jsDocs),
      url
    })
  );

  const rowToMarkdown = ({
    name,
    documentation,
    type,
    params,
    returnType,
    references,
    examples,
    url
  }: Row): string => {
    const markdown: string[] = [
      `${headingLevel}# ${emoji === undefined || emoji === null ? '' : ':gear: '}${name}\n`
    ];

    if (documentation.length) {
      markdown.push(`${documentation}\n`);
    }

    markdown.push(`| ${type === 'Type' ? 'Type alias' : docType} | Type |`);
    markdown.push('| ---------- | ---------- |');
    markdown.push(
      `| \`${name}\` | ${type !== undefined && type !== '' ? `\`${parseType(type)}\`` : ''} |\n`
    );

    if (params.length) {
      markdown.push('Parameters:\n');
      markdown.push(...inlineParams(params));
      markdown.push('\n');
    }

    const metadata = metadataToMarkdown({
      returnType,
      references,
      examples,
      url,
      emoji
    });

    markdown.push(...metadata);

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

const DEFAULT_EMOJI: MarkdownEmoji = {
  classes: 'factory',
  functions: 'toolbox',
  constants: 'wrench',
  enum: 'nut_and_bolt',
  entry: 'gear',
  link: 'link',
  interfaces: 'tropical_drink',
  types: 'cocktail'
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
    userEmoji === null ? undefined : (userEmoji ?? DEFAULT_EMOJI);

  const functions: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'function');
  const classes: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'class');
  const constants: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'const');
  const enums: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'enum');
  const types: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'type');
  const interfaces: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'interface');

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

  if (enums.length) {
    markdown.push(`${headingLevel}${emojiTitle({emoji, key: 'enum'})} Enum\n`);
    markdown.push(`${tableOfContent({entries: enums, emoji})}\n`);
    markdown.push(
      enums.map((entry: DocEntry) => interfacesToMarkdown({entry, headingLevel, emoji})).join('\n')
    );
  }

  if (interfaces.length) {
    markdown.push(`${headingLevel}${emojiTitle({emoji, key: 'interfaces'})} Interfaces\n`);
    markdown.push(`${tableOfContent({entries: interfaces, emoji})}\n`);

    markdown.push(
      interfaces
        .map((entry: DocEntry) => interfacesToMarkdown({entry, headingLevel, emoji}))
        .join('\n')
    );
  }

  if (types.length) {
    markdown.push(`${headingLevel}${emojiTitle({emoji, key: 'types'})} Types\n`);
    markdown.push(`${tableOfContent({entries: types, emoji})}\n`);
    markdown.push(`${toMarkdown({entries: types, headingLevel, emoji, docType: 'Type'})}\n`);
  }

  return markdown.join('\n');
};
