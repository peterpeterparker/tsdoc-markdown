import type {JSDocTagInfo, SymbolDisplayPart} from 'typescript';
import type {JsDocsMetadata, Params} from '../types';

const jsDocsToSymbolDisplayParts = ({
  jsDocs = [],
  tagInfoName
}: {
  jsDocs?: JSDocTagInfo[];
  tagInfoName: 'returns' | 'param' | 'see';
}): SymbolDisplayPart[][] => {
  const tags = jsDocs.filter(({name}: JSDocTagInfo) => name === tagInfoName);
  const texts = tags.map(({text}) => text);

  return texts.reduce<SymbolDisplayPart[][]>((acc, values) => {
    if (values === undefined) {
      return acc;
    }

    return [...acc, values];
  }, []);
};

const jsDocsToReturnType = (jsDocs?: JSDocTagInfo[]): string => {
  const returns = jsDocsToSymbolDisplayParts({jsDocs, tagInfoName: 'returns'});
  return returns.map((parts) => parts.map(({text}) => text).join('')).join(' ');
};

const jsDocsToReferences = (jsDocs?: JSDocTagInfo[]): string[] => {
  const sees = jsDocsToSymbolDisplayParts({jsDocs, tagInfoName: 'see'});

  return sees
    .map((texts) =>
      texts
        // Filter TypeScript unstripped comment asterix
        .filter(({text}) => text !== '*')
        .reduce((acc, {text}) => `${acc}${text}`, '')
    )
    .map((value) => value.trim());
};

export const jsDocsToParams = (jsDocs?: JSDocTagInfo[]): Params[] => {
  const params = jsDocsToSymbolDisplayParts({jsDocs, tagInfoName: 'param'});

  const toParam = (parts: SymbolDisplayPart[]): Params | undefined => {
    if (parts.find(({kind, text}) => kind === 'parameterName' && text !== '') === undefined) {
      return undefined;
    }

    const name = parts.find(({kind}) => kind === 'parameterName')?.text ?? '';
    const documentation = parts.find(({kind}) => kind === 'text')?.text ?? '';

    return {name, documentation};
  };

  return params.map(toParam).filter((param) => param !== undefined) as Params[];
};

const jsDocsToExamples = (jsDocs: JSDocTagInfo[]): string[] => {
  const examples: JSDocTagInfo[] = jsDocs.filter(({name}: JSDocTagInfo) => name === 'example');
  const texts = examples
    .map(({text}) => text)
    .filter(Boolean)
    .flat(1) as SymbolDisplayPart[];
  return texts.map(({text}) => text).filter(Boolean);
};

export const jsDocsMetadata = (jsDocs?: JSDocTagInfo[]): JsDocsMetadata => ({
  returnType: jsDocsToReturnType(jsDocs),
  references: jsDocsToReferences(jsDocs),
  examples: [...jsDocsToExamples(jsDocs ?? [])]
});
