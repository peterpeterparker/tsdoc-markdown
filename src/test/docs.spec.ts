import {readFileSync} from 'fs';
import {buildDocumentation} from '../lib/docs';

describe('docs', () => {
  it('should generate json for mock', () => {
    const doc = buildDocumentation({
      inputFiles: ['./src/test/mock.ts']
    });

    const expectedDoc = readFileSync('./src/test/mock.json', 'utf8');
    expect(doc).toEqual(JSON.parse(expectedDoc));
  });
});
