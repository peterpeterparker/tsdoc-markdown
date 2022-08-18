import type {DocEntry} from './docs';

const docEntryToMarkdown = ({
  name,
  documentation,
  type,
  constructors,
  parameters,
  methods,
  returnType,
  jsDocs
}: DocEntry): string => {
  const md: string[] = [];
  md.push(`# ${name}\n`);
  md.push(`docs: ${documentation}\n`);
  md.push(`type: ${type}\n`);
  md.push(`constructors: ${constructors}\n`);
  md.push(`parameters: ${parameters}\n`);
  md.push(`methods: ${methods}\n`);
  md.push(`returnType: ${returnType}\n`);
  md.push(`jsDocs: ${JSON.stringify(jsDocs)}\n`);

  return md.join('\n');
};

/**
 * | Part       | Description                             |
 * | ---------- | --------------------------------------- |
 * | `"button"` | The part attribute to access the button |
 */

const classesToMarkdown = (entry: DocEntry): string => {
  const {name, documentation, methods} = entry;

  const markdown: string[] = [`# ${name}\n`];
  markdown.push(`${documentation}\n`);

  // TODO: constructor

  markdown.push(`${functionsToMarkdown(methods ?? [])}\n`);

  return markdown.join('\n');
};

const functionsToMarkdown = (entries: DocEntry[]): string => {
  type Row = Required<Pick<DocEntry, 'name' | 'type' | 'documentation'>> & {
    params: {name: string; documentation: string}[];
  };

  const rows: Row[] = entries.map(({name, type, documentation, parameters}: DocEntry) => ({
    name,
    type: type ?? '',
    documentation: documentation ?? '',
    params: (parameters ?? []).map(({name, documentation}: DocEntry) => ({
      name,
      documentation: documentation ?? ''
    }))
  }));

  const rowToMarkdown = ({name, documentation, type, params}: Row): string => {
    const markdown: string[] = [`# ${name}\n`];
    markdown.push(`${documentation}\n`);

    markdown.push('| Name | Type |');
    markdown.push('| ---------- | ---------- |');
    markdown.push(`| \`${name}\` | \`${type}\` |\n`);

    if (params.length) {
      markdown.push('Parameters:');
      markdown.push(...params.map(({name, documentation}) => `* \`${name}\`: ${documentation}`));
    }

    return markdown.join('\n');
  };

  return rows.map(rowToMarkdown).join('\n');
};

export const documentationToMarkdown = (entries: DocEntry[]): string => {
  const functions: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'function');
  const classes: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'class');
  const consts: DocEntry[] = entries.filter(({doc_type}: DocEntry) => doc_type === 'const');

  const markdown: string[] = [];

  if (functions.length) {
    markdown.push(`# Functions\n`);
    markdown.push(`${functionsToMarkdown(functions)}\n`);
  }

  if (consts.length) {
    markdown.push(`# Constants\n`);
    markdown.push(`${functionsToMarkdown(consts)}\n`);
  }

  markdown.push(classes.map((entry: DocEntry) => classesToMarkdown(entry)).join('\n'));

  return markdown.join('\n');
};
