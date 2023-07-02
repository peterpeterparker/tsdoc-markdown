# tsdoc-markdown

Generates markdown documentation from TypeScript source code. Useful for generating docs from code and injecting automatically the outcome into project README files.

## Installation

Install the library in your project from [npm](https://www.npmjs.com/package/tsdoc-markdown):

```bash
npm install -D tsdoc-markdown
```

## GitHub Actions

A GitHub Actions workflow that generates the documentation for pull requests using this library is available in [tsdoc.yml](/.github/workflows/tsdoc.yml).

## Usage

This tool is shipped with a NodeJS [bin](/bin/index.js) script that can be executed with the shortcut `tsdoc`.

e.g. generating the documentation for a source file `./src/index.ts`:

```bash
tsdoc --src=src/index.ts
```

The `--src` parameter accepts a comma separated list of paths and wildcards as well.

e.g.

```bash
tsdoc --src=src/lib/*
tsdoc --src=src/lib/index.ts,src/lib/docs.ts
```

> Note: the library exports per default only the documentation of the pattern you provide. It does not explore the TypeScript tree. If you wish to do so, either provide a PR to the Cli to support the option `explore` or create your own script for your project 😉

The Markdown documentation is parsed per default in a `./README.md` that finds place where you started the command line.
The output file will be over write unless you specify a `TSDOC_START` and `TSDOC_END` tag (as HTML comment). In such case, the documentation will be parsed within these two tags.

Specifying another output file is also supported with the parameter `--dest`.

To generate links to the documented source code, you can also provide the `--repo` parameter, which corresponds to the URL of your repository on GitHub.

Using above script is of course optional. You can also develop your own JavaScript script and use one of the functions here under.

e.g.

```javascript
#!/usr/bin/env node

const {generateDocumentation} = require('tsdoc-markdown');

// Generate documentation for a list of files
const nnsInputFiles = [
  './packages/nns/src/account_identifier.ts',
  './packages/nns/src/genesis_token.canister.ts',
  './packages/nns/src/governance.canister.ts',
  './packages/nns/src/icp.ts'
];

generateDocumentation({
  inputFiles: nnsInputFiles,
  outputFile: './packages/nns/README.md'
});

// Start from a single file and explore the TypeScript tree

const utilsInputFiles = ['./packages/utils/src/index.ts'];

generateDocumentation({
  inputFiles: utilsInputFiles,
  outputFile: './packages/utils/YOLO.md',
  buildOptions: {explore: true}
});
```

<br/>

_Note: Chapter "Functions" is auto-generated with `tsdoc-markdown`._

<!-- TSDOC_START -->

## :toolbox: Functions

- [buildDocumentation](#gear-builddocumentation)
- [documentationToMarkdown](#gear-documentationtomarkdown)
- [generateDocumentation](#gear-generatedocumentation)

### :gear: buildDocumentation

Build the documentation entries for the selected sources.

| Function             | Type                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------- |
| `buildDocumentation` | `({ inputFiles, options }: { inputFiles: string[]; options?: BuildOptions; }) => DocEntry[]` |

Parameters:

- `params.inputFiles`: The list of files to scan and for which the documentation should be build.
- `params.options`: Optional compiler options to generate the docs

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/lib/docs.ts#L212)

### :gear: documentationToMarkdown

Convert the documentation entries to an opinionated Markdown format.

| Function                  | Type                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `documentationToMarkdown` | `({ entries, options }: { entries: DocEntry[]; options?: MarkdownOptions; }) => string` |

Parameters:

- `params.entries`: The entries of the documentation (functions, constants and classes).
- `params.options`: Optional configuration to render the Markdown content. See `types.ts` for details.

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main//home/runner/work/tsdoc-markdown/tsdoc-markdown/src/lib/markdown.ts#L221)

### :gear: generateDocumentation

Generate documentation and write output to a file.
If the file exists, it will try to insert the docs between <!-- TSDOC_START --> and <!-- TSDOC_END --> comments.
If these does not exist, the output file will be overwritten.

| Function                | Type                                                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `generateDocumentation` | `({ inputFiles, outputFile, markdownOptions, buildOptions }: { inputFiles: string[]; outputFile: string; markdownOptions?: MarkdownOptions; buildOptions?: BuildOptions; }) => void` |

Parameters:

- `params.inputFiles`: The list of files to scan for documentation. Absolute or relative path.
- `params.outputFile`: The file to output the documentation in Markdown.
- `params.markdownOptions`: Optional settings passed to the Markdown parser. See `MarkdownOptions` for details.
- `params.buildOptions`: Options to construct the documentation tree. See `BuildOptions` for details.

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/lib/index.ts#L27)

<!-- TSDOC_END -->

## Useful Resources

- [Using the TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [TypeScript AST Viewer](https://ts-ast-viewer.com/#)
- List of [TypeScript node kind](https://github.com/microsoft/TypeScript/blob/main/lib/typescript.d.ts)

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)
