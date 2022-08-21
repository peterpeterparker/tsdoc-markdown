# tsdoc-to-markdown

Generates markdown API documentation from TypeScript source code. Useful for injecting API docs into project README files.

<!-- TSDOC_START -->

# Functions

## buildDocumentation

Build the documentation entries in JSON for the selected sources.

| Name | Type |
| ---------- | ---------- |
| `buildDocumentation` | `({ inputFiles, options }: { inputFiles: string[]; options?: CompilerOptions; }) => DocEntry[]` |

## documentationToMarkdown

Convert the documentation entries to an opinionated Markdown format.

| Name | Type |
| ---------- | ---------- |
| `documentationToMarkdown` | `(entries: DocEntry[]) => string` |

Parameters:

* `entries`: The entries of the documentation (global functions and classes).


## generateDocumentation

Generate documentation and write output to a file.

| Name | Type |
| ---------- | ---------- |
| `generateDocumentation` | `({ inputFiles, outputFile }: { inputFiles: string[]; outputFile: string; }) => void` |



<!-- TSDOC_END -->

## Useful Resources

- [Using the TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [TypeScript AST Viewer](https://ts-ast-viewer.com/#)
- List of [TypeScript node kind](https://github.com/microsoft/TypeScript/blob/main/lib/typescript.d.ts)

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)
