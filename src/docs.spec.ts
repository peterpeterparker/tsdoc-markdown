import {readFileSync} from 'fs';
import {ModuleKind, ScriptTarget} from 'typescript';
import {generateDocumentation} from './docs';

describe('test', () => {
  it('should generate markdown for mock', () => {
    const doc = generateDocumentation({
      fileNames: ['./src/mock.ts'],
      options: {
        target: ScriptTarget.ES2020,
        module: ModuleKind.CommonJS
      }
    });

    const expectedDoc = readFileSync('./src/mock.json', 'utf8');
    expect(doc).toEqual(JSON.parse(expectedDoc));
  });
});
