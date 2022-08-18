import {ModuleKind, ScriptTarget} from 'typescript';
import {generateDocumentation} from './index';

describe('test', () => {
  it('should generate markdown for exported arrow function', () => {
    generateDocumentation({
      fileNames: ['./src/mock.ts'],
      options: {
        target: ScriptTarget.ES2020,
        module: ModuleKind.CommonJS
      }
    });
  });
});

export {};
