import type {JSDocTagInfo, SymbolDisplayPart} from 'typescript';
import type {DocEntry} from './docs';

type Params = {name: string; documentation: string};

type Row = Required<Pick<DocEntry, 'name' | 'type' | 'documentation'>> & {
  params: Params[];
};

const toParams = (parameters?: DocEntry[]): Params[] =>
  (parameters ?? []).map(({name, documentation}: DocEntry) => ({
    name,
    documentation: documentation ?? ''
  }));

const inlineParams = (params: Params[]): string[] =>
  params.map(({name, documentation}) => `* \`${name}\`: ${documentation}`);

const classesToMarkdown = (entry: DocEntry): string => {
  const {name, documentation, methods, constructors} = entry;

  const markdown: string[] = [`# ${name}\n`];
  markdown.push(`${documentation}\n`);

  if (constructors?.length) {
    markdown.push(`## Constructors\n`);

    markdown.push(...constructors.map(({parameters, documentation, visibility}) => {
      const docs: string[] = [`\`${visibility}\`: ${documentation ?? ''}\n`];

      if (parameters?.length) {
        docs.push(`Parameters:\n`);
        docs.push(...inlineParams(toParams(parameters)));
      }

      return docs.join('\n');
    }));

    markdown.push('\n');
  }

  markdown.push(`${toMarkdown(methods ?? [])}\n`);

  return markdown.join('\n');
};

const toMarkdown = (entries: DocEntry[]): string => {
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
      if (parts.find(({kind}) => kind === 'parameterName') === undefined) {
        return undefined;
      }

      const name = parts.find(({kind}) => kind === 'parameterName')?.text ?? '';
      const documentation = parts.find(({kind}) => kind === 'text')?.text ?? '';

      return {name, documentation};
    };

    return parts.map(toParam).filter((param) => param !== undefined) as Params[];
  };

  const rows: Row[] = entries.map(({name, type, documentation, parameters, jsDocs}: DocEntry) => ({
    name,
    type: type ?? '',
    documentation: documentation ?? '',
    params: [...toParams(parameters), ...jsDocsToParams(jsDocs ?? [])]
  }));

  const rowToMarkdown = ({name, documentation, type, params}: Row): string => {
    const markdown: string[] = [`## ${name}\n`];

    if (documentation.length) {
      markdown.push(`${documentation}\n`);
    }

    markdown.push('| Name | Type |');
    markdown.push('| ---------- | ---------- |');
    markdown.push(`| \`${name}\` | \`${type}\` |\n`);

    if (params.length) {
      markdown.push('Parameters:\n');
      markdown.push(...inlineParams(params));
      markdown.push('\n');
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
    markdown.push(`${toMarkdown(functions)}\n`);
  }

  if (consts.length) {
    markdown.push(`# Constants\n`);
    markdown.push(`${toMarkdown(consts)}\n`);
  }

  markdown.push(classes.map((entry: DocEntry) => classesToMarkdown(entry)).join('\n'));

  return markdown.join('\n');
};
