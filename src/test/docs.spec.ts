import {readFileSync} from 'fs';
import {ModuleKind, ScriptTarget} from 'typescript';
import {buildDocumentation} from '../lib/docs';
import {documentationToMarkdown} from '../lib';

describe('test', () => {
  it('should generate json for mock', () => {
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

  it('should generate markdown for mock', () => {
    const doc = buildDocumentation({
      fileNames: ['./src/test/mock.ts'],
      options: {
        target: ScriptTarget.ES2020,
        module: ModuleKind.CommonJS
      }
    });

    const markdown: string = documentationToMarkdown(doc);

    const expectedDoc = readFileSync('./src/test/mock.md', 'utf8');
    expect(markdown).toEqual(expectedDoc);
  });
});
