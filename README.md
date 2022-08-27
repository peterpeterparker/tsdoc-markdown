# tsdoc-to-markdown

Generates markdown API documentation from TypeScript source code. Useful for injecting API docs into project README files.

<!-- TSDOC_START -->

## Functions

- [buildDocumentation](#builddocumentation)
- [documentationToMarkdown](#documentationtomarkdown)
- [generateDocumentation](#generatedocumentation)

### buildDocumentation

Build the documentation entries for the selected sources.

| Function | Type |
| ---------- | ---------- |
| `buildDocumentation` | `({ inputFiles, options }: { inputFiles: string[]; options?: CompilerOptions; }) => DocEntry[]` |

Parameters:

* `params.inputFiles`: The list of files to scan and for which the documentation should be build.
* `params.options`: Optional compiler options to generate the docs


### documentationToMarkdown

Convert the documentation entries to an opinionated Markdown format.

| Function | Type |
| ---------- | ---------- |
| `documentationToMarkdown` | `(entries: DocEntry[]) => string` |

Parameters:

* `entries`: The entries of the documentation (global functions and classes).


### generateDocumentation

Generate documentation and write output to a file.
If the file exists, it will try to insert the docs between <!-- TSDOC_START --> and <!-- TSDOC_END --> comments.
If these does not exist, the output file will be overwritten.

| Function | Type |
| ---------- | ---------- |
| `generateDocumentation` | `({ inputFiles, outputFile }: { inputFiles: string[]; outputFile: string; }) => void` |

Parameters:

* `params.inputFiles`: The list of files to scan for documentation. Absolute or relative path.
* `params.outputFile`: The file to output the documentation in Markdown.




<!-- TSDOC_END -->

## Useful Resources

- [Using the TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [TypeScript AST Viewer](https://ts-ast-viewer.com/#)
- List of [TypeScript node kind](https://github.com/microsoft/TypeScript/blob/main/lib/typescript.d.ts)

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)
