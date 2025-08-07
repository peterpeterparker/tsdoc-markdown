import {readFileSync} from 'node:fs';
import {buildDocumentation} from '../lib/docs';

describe('docs', () => {
  it('should generate json for mock', () => {
    const doc = buildDocumentation({
      inputFiles: ['./src/test/mock.ts'],
      options: {
        types: true
      }
    });

    const expectedDoc = readFileSync('./src/test/mock.json', 'utf8');
    expect(doc).toEqual(JSON.parse(expectedDoc));
  });

  it('should generate json with links to source code', () => {
    const doc = buildDocumentation({
      inputFiles: ['./src/test/mock.ts'],
      options: {
        repo: {
          url: 'https://github.com/peterpeterparker/tsdoc-markdown/'
        }
      }
    });

    const expectedDoc = readFileSync('./src/test/mock.json', 'utf8');
    expect(doc[0]).toEqual({
      ...JSON.parse(expectedDoc)[0],
      url: 'https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L6'
    });
  });
});
