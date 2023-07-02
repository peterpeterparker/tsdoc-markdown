import {readFileSync} from 'fs';
import {documentationToMarkdown} from '../lib';
import {buildDocumentation} from '../lib/docs';

describe('markdown', () => {
  it('should generate markdown for mock', () => {
    const doc = buildDocumentation({
      inputFiles: ['./src/test/mock.ts']
    });

    const markdown: string = documentationToMarkdown({
      entries: doc,
      options: {
        repo: {
          url: 'https://github.com/peterpeterparker/tsdoc-markdown'
        }
      }
    });

    const expectedDoc = readFileSync('./src/test/mock.md', 'utf8');

    expect(markdown).toEqual(expectedDoc);
  });

  it.each([35, 86, 114])('should generate a markdown link to line %s', (line) => {
    const doc = buildDocumentation({
      inputFiles: ['./src/test/mock.ts']
    });

    const markdown: string = documentationToMarkdown({
      entries: doc,
      options: {
        repo: {
          url: 'https://github.com/peterpeterparker/tsdoc-markdown/'
        }
      }
    });

    expect(markdown).toContain(
      `[Source :link:](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L${line})`
    );
  });
});
