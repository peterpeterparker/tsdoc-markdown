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

  it('should skip internal entries', () => {
    const doc = buildDocumentation({
      inputFiles: ['./src/test/mock_internal.ts'],
      options: {
        types: true,
        skipInternal: true
      }
    });

    expect(doc.length).toBe(3);
    expect(doc.map((e) => e.name)).toEqual(['visibleConst', 'VisibleClass', 'MixedEnum']);

    const visibleClass = doc.find((e) => e.name === 'VisibleClass');
    expect(visibleClass?.constructors).toEqual([]);
    expect(visibleClass?.methods?.map((m) => m.name)).toEqual(['visibleMethod']);

    const mixedEnum = doc.find((e) => e.name === 'MixedEnum');
    expect(mixedEnum?.properties?.map((p) => p.name)).toEqual(['VISIBLE']);
  });

  it('should include internal entries by default', () => {
    const doc = buildDocumentation({
      inputFiles: ['./src/test/mock_internal.ts'],
      options: {
        types: true
      }
    });

    expect(doc.map((e) => e.name)).toContain('internalConst');
    expect(doc.map((e) => e.name)).toContain('InternalClass');
    expect(doc.map((e) => e.name)).toContain('InternalInterface');
    expect(doc.map((e) => e.name)).toContain('InternalType');

    const visibleClass = doc.find((e) => e.name === 'VisibleClass');
    expect(visibleClass?.constructors?.length).toBeGreaterThan(0);
    expect(visibleClass?.methods?.map((m) => m.name)).toContain('internalMethod');

    const mixedEnum = doc.find((e) => e.name === 'MixedEnum');
    expect(mixedEnum?.properties?.map((p) => p.name)).toContain('INTERNAL');
  });
});
