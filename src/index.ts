import {writeFileSync} from 'fs';
import {
  ArrowFunction,
  CompilerOptions,
  createProgram,
  Declaration,
  displayPartsToString,
  forEachChild,
  FunctionDeclaration,
  getCombinedModifierFlags,
  isArrowFunction,
  isClassDeclaration, isConstructorTypeNode,
  isFunctionDeclaration,
  isMethodDeclaration,
  isModuleDeclaration,
  JSDocTagInfo,
  ModifierFlags,
  ModuleKind,
  Node,
  ScriptTarget,
  Signature,
  Symbol,
  SyntaxKind,
  TypeChecker,
  VariableDeclaration
} from 'typescript';

// Originated from:
// https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API

interface DocEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
  jsDocs?: JSDocTagInfo[];
}

/** Serialize a symbol into a json object */
const serializeSymbol = ({checker, symbol}: {checker: TypeChecker; symbol: Symbol}): DocEntry => {
  return {
    name: symbol.getName(),
    documentation: displayPartsToString(symbol.getDocumentationComment(checker)),
    type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)),
    jsDocs: symbol.getJsDocTags()
  };
};

/** Serialize a class symbol information */
const serializeClass = ({checker, symbol}: {checker: TypeChecker; symbol: Symbol}): DocEntry => {
  const details = serializeSymbol({checker, symbol});

  // Get the construct signatures
  const constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
  details.constructors = constructorType
    .getConstructSignatures()
    .map((signature: Signature) => serializeSignature({checker, signature}));
  return details;
};

/** True if this is visible outside this file, false otherwise */
const isNodeExported = (node: Node): boolean => {
  return (
    (getCombinedModifierFlags(node as Declaration) & ModifierFlags.Export) !== 0 ||
    (!!node.parent && node.parent.kind === SyntaxKind.SourceFile)
  );
};

/** Serialize a signature (call or construct) */
const serializeSignature = ({
  checker,
  signature
}: {
  checker: TypeChecker;
  signature: Signature;
}): {parameters?: DocEntry[]; returnType?: string; documentation?: string} => {
  return {
    parameters: signature.parameters.map((symbol: Symbol) => serializeSymbol({checker, symbol})),
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: displayPartsToString(signature.getDocumentationComment(checker))
  };
};

/** visit nodes finding exported classes */
const visit = ({checker, node}: {checker: TypeChecker; node: Node}): DocEntry[] => {
  const entries: DocEntry[] = [];

  // Only consider exported nodes
  // if (!isNodeExported(node)) {
  //     return;
  // }

  // List of node.kind e.g. 236 => https://github.com/microsoft/TypeScript/blob/main/lib/typescript.d.ts

  // https://stackoverflow.com/a/73338964/5404186
  function findDescendantArrowFunction(node: Node): Node | undefined {
    if (isArrowFunction(node)) {
      return node;
    } else {
      return forEachChild(node, findDescendantArrowFunction);
    }
  }

  const arrowFunc = findDescendantArrowFunction(node);

  // isFunctionDeclaration
  // export function something () {}

  const visitChild = (node: Node) => {
    const docEntries: DocEntry[] = visit({node, checker});
    entries.push(...docEntries);
  };

  if (isClassDeclaration(node) && node.name) {
    // This is a top level class, get its symbol
    const symbol = checker.getSymbolAtLocation(node.name);
    if (symbol) {
      entries.push(serializeClass({checker: checker, symbol}));
    }
    // No need to walk any further, class expressions/inner declarations
    // cannot be exported
    forEachChild(node, visitChild);
  } else if (isModuleDeclaration(node)) {
    // This is a namespace, visit its children
    forEachChild(node, visitChild);
  } else if (isMethodDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation(node.name);

    if (symbol) {
      const details = serializeSymbol({checker: checker, symbol});
      entries.push(details);
    }
  } else if (arrowFunc !== undefined) {
    const symbol = checker.getSymbolAtLocation(
      ((arrowFunc as ArrowFunction).parent as VariableDeclaration).name
    );

    if (symbol) {
      const details = serializeSymbol({checker: checker, symbol});
      entries.push(details);
    }
  } else if (isFunctionDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation((node as FunctionDeclaration).name ?? node);

    if (symbol) {
      const details = serializeSymbol({checker: checker, symbol});
      entries.push(details);
    }
  }

  return entries;
};

export const generateDocumentation = ({
  fileNames,
  options
}: {
  fileNames: string[];
  options: CompilerOptions;
}) => {
  // Build a program using the set of root file names in fileNames
  const program = createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();

  const sourceFiles = program.getSourceFiles().filter(({isDeclarationFile}) => !isDeclarationFile);

  const output: DocEntry[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of sourceFiles) {
    // Walk the tree to search for classes
    forEachChild(sourceFile, (node: Node) => {
      const entries: DocEntry[] = visit({checker, node});
      output.push(...entries);
    });
  }

  // print out the doc
  writeFileSync('classes.json', JSON.stringify(output, undefined, 4));
};

generateDocumentation({
  fileNames: process.argv.slice(2),
  options: {
    target: ScriptTarget.ES2020,
    module: ModuleKind.CommonJS
  }
});
