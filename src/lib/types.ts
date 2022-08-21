import type {JSDocTagInfo} from 'typescript';

export type DocEntryType = 'function' | 'method' | 'class' | 'const';

export type DocEntryConstructor = Pick<DocEntry, 'parameters' | 'returnType' | 'documentation'> & {
  visibility: 'private' | 'public';
};

export interface DocEntry {
  name: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: DocEntryConstructor[];
  parameters?: DocEntry[];
  methods?: DocEntry[];
  returnType?: string;
  jsDocs?: JSDocTagInfo[];
  doc_type?: DocEntryType;
}
