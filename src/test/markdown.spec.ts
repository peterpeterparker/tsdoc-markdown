import {readFileSync} from 'fs';
import {ModuleKind, ScriptTarget} from 'typescript';
import {documentationToMarkdown} from '../lib';
import {buildDocumentation} from '../lib/docs';

describe('markdown', () => {
  it('should generate markdown for mock', () => {
    const doc = buildDocumentation({
      inputFiles: ['./src/test/mock.ts'],
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
