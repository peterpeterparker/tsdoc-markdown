import {readFileSync} from 'fs';
import {ModuleKind, ScriptTarget} from 'typescript';
import {buildDocumentation} from '../lib/docs';

describe('test', () => {
  it('should generate markdown for mock', () => {
    const doc = buildDocumentation({
      fileNames: ['./src/test/mock.ts'],
      options: {
        target: ScriptTarget.ES2020,
        module: ModuleKind.CommonJS
      }
    });

    const expectedDoc = readFileSync('./src/test/mock.json', 'utf8');
    expect(doc).toEqual(JSON.parse(expectedDoc));
  });
});
