# tsdoc-markdown

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Generates markdown documentation from TypeScript source code. Useful for generating docs from code and injecting automatically the outcome into project README files.

## :1234: Table of contents

- [:1234: Table of contents](#1234-table-of-contents)
- [:arrow\_down: Installation](#arrow_down-installation)
- [:electric\_plug: GitHub Actions](#electric_plug-github-actions)
- [:zap: Usage](#zap-usage)
- [:construction: Limitations](#construction-limitations)
- [:toolbox: Functions](#toolbox-functions)
  - [:gear: buildDocumentation](#gear-builddocumentation)
  - [:gear: documentationToMarkdown](#gear-documentationtomarkdown)
  - [:gear: generateDocumentation](#gear-generatedocumentation)
- [:books: Useful Resources](#books-useful-resources)
- [:sparkles: Contributors](#sparkles-contributors)
- [:page\_facing\_up: License](#page_facing_up-license)

## :arrow_down: Installation

Install the library in your project from [npm](https://www.npmjs.com/package/tsdoc-markdown):

```bash
npm install -D tsdoc-markdown
```

## :electric_plug: GitHub Actions

A GitHub Actions workflow that generates the documentation for pull requests using this library is available in [tsdoc.yml](/.github/workflows/tsdoc.yml).

## :zap: Usage

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
  buildOptions: {
    explore: true,
    repo: {
      url: 'https://github.com/peterpeterparker/tsdoc-markdown'
    }
  }
});
```

## :construction: Limitations

This library generates Markdown documentation from TypeScript source code for `Functions`, `Constants` and `Classes`. However, it currently does not generate documentation for `Interfaces` and `Types`.

The library is designed to focus on documenting what developers consume, keeping the documentation compact. It serves as an entry point for getting started easily and accessing the code for more advanced features.

If you would like the library to also document Interfaces and Types, pull requests are greatly appreciated (see feature request [#6](https://github.com/peterpeterparker/tsdoc-markdown/issues/6)).

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

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/lib/docs.ts#L257)

### :gear: documentationToMarkdown

Convert the documentation entries to an opinionated Markdown format.

| Function                  | Type                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `documentationToMarkdown` | `({ entries, options }: { entries: DocEntry[]; options?: MarkdownOptions; }) => string` |

Parameters:

- `params.entries`: The entries of the documentation (functions, constants and classes).
- `params.options`: Optional configuration to render the Markdown content. See `types.ts` for details.

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/lib/markdown.ts#L212)

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

## :books: Useful Resources

- [Using the TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [TypeScript AST Viewer](https://ts-ast-viewer.com/#)
- List of [TypeScript node kind](https://github.com/microsoft/TypeScript/blob/main/lib/typescript.d.ts)

## :sparkles: Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://daviddalbusco.com/"><img src="https://avatars.githubusercontent.com/u/16886711?v=4?s=48" width="48px;" alt="David Dal Busco"/><br /><sub><b>David Dal Busco</b></sub></a><br /><a href="https://github.com/David Dal Busco/tsdoc-markdown/commits?author=peterpeterparker" title="Code">💻</a> <a href="https://github.com/David Dal Busco/tsdoc-markdown/commits?author=peterpeterparker" title="Documentation">📖</a> <a href="#example-peterpeterparker" title="Examples">💡</a> <a href="#ideas-peterpeterparker" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-peterpeterparker" title="Maintenance">🚧</a> <a href="#projectManagement-peterpeterparker" title="Project Management">📆</a> <a href="#research-peterpeterparker" title="Research">🔬</a> <a href="https://github.com/David Dal Busco/tsdoc-markdown/pulls?q=is%3Apr+reviewed-by%3Apeterpeterparker" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/David Dal Busco/tsdoc-markdown/commits?author=peterpeterparker" title="Tests">⚠️</a> <a href="#tool-peterpeterparker" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## :page_facing_up: License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)
