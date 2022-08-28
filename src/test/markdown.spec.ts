import {readFileSync} from 'fs';
import {documentationToMarkdown} from '../lib';
import {buildDocumentation} from '../lib/docs';

describe('markdown', () => {
  it('should generate markdown for mock', () => {
    const doc = buildDocumentation({
      inputFiles: ['./src/test/mock.ts']
    });

    const markdown: string = documentationToMarkdown({entries: doc});

    const expectedDoc = readFileSync('./src/test/mock.md', 'utf8');
    expect(markdown).toEqual(expectedDoc);
  });
});
