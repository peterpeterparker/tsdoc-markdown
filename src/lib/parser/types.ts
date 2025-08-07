import type {DocEntry} from '../types';

export interface Params {
  name: string;
  documentation: string;
}

export interface JsDocsMetadata {
  examples: string[];
  returnType?: string;
  references?: string[];
}

export type Row = Required<Pick<DocEntry, 'name' | 'type' | 'documentation'>> &
  Pick<DocEntry, 'url'> & {
    params: Params[];
  } & JsDocsMetadata;
