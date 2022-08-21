import {resolve} from 'path';
import type {
  ArrowFunction,
  CompilerOptions,
  Declaration,
  FunctionDeclaration,
  Node,
  Signature,
  Symbol as TypeScriptSymbol,
  TypeChecker,
  VariableDeclaration,
  VariableStatement
} from 'typescript';
import {
  createProgram,
  displayPartsToString,
  forEachChild,
  getCombinedModifierFlags,
  isArrowFunction,
  isClassDeclaration,
  isFunctionDeclaration,
  isMethodDeclaration,
  isModuleDeclaration,
  isVariableStatement,
  ModifierFlags,
  NodeFlags,
  SyntaxKind
} from 'typescript';
import type {DocEntry, DocEntryConstructor, DocEntryType} from './types';

/** Serialize a symbol into a json object */
const serializeSymbol = ({
  checker,
  symbol,
  doc_type
}: {
  checker: TypeChecker;
  symbol: TypeScriptSymbol;
  doc_type?: DocEntryType;
}): DocEntry => {
  return {
    name: symbol.getName(),
    documentation: displayPartsToString(symbol.getDocumentationComment(checker)),
    type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)),
    jsDocs: symbol.getJsDocTags(),
    ...(doc_type && {doc_type})
  };
};

/** Serialize a class symbol information */
const serializeClass = ({
  checker,
  symbol
}: {
  checker: TypeChecker;
  symbol: TypeScriptSymbol;
}): DocEntry => {
  const details = serializeSymbol({checker, symbol, doc_type: 'class'});

  // Get the construct signatures
  const constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);

  details.constructors = constructorType
    .getConstructSignatures()
    .map((signature: Signature) => serializeSignature({checker, signature}));
  return details;
};

/** True if this is visible outside this file, false otherwise */
const isNodeExportedOrPublic = (node: Node): boolean => {
  const flags = getCombinedModifierFlags(node as Declaration);
  return (flags & ModifierFlags.Export) !== 0 || (flags & ModifierFlags.Public) !== 0;
};

/** Serialize a signature (call or construct) */
const serializeSignature = ({
  checker,
  signature
}: {
  checker: TypeChecker;
  signature: Signature;
}): DocEntryConstructor => {
  return {
    parameters: signature.parameters.map((symbol: TypeScriptSymbol) =>
      serializeSymbol({checker, symbol})
    ),
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: displayPartsToString(signature.getDocumentationComment(checker)),
    visibility:
      signature.declaration?.modifiers?.[0].kind === SyntaxKind.PrivateKeyword
        ? 'private'
        : 'public'
  };
};

// https://stackoverflow.com/a/73338964/5404186
const findDescendantArrowFunction = (node: Node): Node | undefined => {
  if (isArrowFunction(node)) {
    return node;
  }

  return forEachChild(node, findDescendantArrowFunction);
};

/** visit nodes finding exported classes */
const visit = ({checker, node}: {checker: TypeChecker; node: Node}): DocEntry[] => {
  // // Only consider exported nodes
  if (!isNodeExportedOrPublic(node)) {
    return [];
  }

  const entries: DocEntry[] = [];

  const addDocEntry = ({
    symbol,
    doc_type
  }: {
    symbol: TypeScriptSymbol | undefined;
    doc_type: DocEntryType;
  }) => {
    if (!symbol) {
      return;
    }

    const details = serializeSymbol({checker, symbol, doc_type});
    entries.push(details);
  };

  if (isClassDeclaration(node) && node.name) {
    // This is a top level class, get its symbol
    const symbol = checker.getSymbolAtLocation(node.name);

    if (symbol) {
      const classEntry: DocEntry = {
        ...serializeClass({checker, symbol}),
        methods: []
      };

      const visitChild = (node: Node) => {
        const docEntries: DocEntry[] = visit({node, checker});
        classEntry.methods?.push(...docEntries);
      };

      forEachChild(node, visitChild);

      entries.push(classEntry);
    }
  } else if (isModuleDeclaration(node)) {
    const visitChild = (node: Node) => {
      const docEntries: DocEntry[] = visit({node, checker});
      entries.push(...docEntries);
    };

    // This is a namespace, visit its children
    forEachChild(node, visitChild);
  } else if (isMethodDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation(node.name);
    addDocEntry({symbol, doc_type: 'method'});
  } else if (isFunctionDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation((node as FunctionDeclaration).name ?? node);
    addDocEntry({symbol, doc_type: 'function'});
  } else {
    const arrowFunc: Node | undefined = findDescendantArrowFunction(node);

    if (arrowFunc !== undefined) {
      const symbol = checker.getSymbolAtLocation(
        ((arrowFunc as ArrowFunction).parent as VariableDeclaration).name
      );
      addDocEntry({symbol, doc_type: 'function'});
    } else if (isVariableStatement(node)) {
      const {
        declarationList: {declarations, flags}
      } = node as VariableStatement;

      // https://stackoverflow.com/a/69801125/5404186
      const isConst = (flags & NodeFlags.Const) !== 0;

      if (isConst) {
        // TODO: not sure what's the proper casting, VariableDeclaration does not contain Symbol but the test entity effectively does
        const symbol = (declarations[0] as unknown as {symbol: TypeScriptSymbol}).symbol;
        addDocEntry({symbol, doc_type: 'const'});
      }
    }
  }

  return entries;
};

export const buildDocumentation = ({
  fileNames,
  options
}: {
  fileNames: string[];
  options: CompilerOptions;
}): DocEntry[] => {
  // Build a program using the set of root file names in fileNames
  const program = createProgram(fileNames, options);

  const filenamesFullPaths: string[] = fileNames.map((fileName: string) => resolve(fileName));

  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();

  // Visit only the files specified by the developers - no deep visit
  const sourceFiles = program
    .getSourceFiles()
    .filter(
      ({isDeclarationFile, fileName}) =>
        !isDeclarationFile && filenamesFullPaths.includes(resolve(fileName))
    );

  const result: DocEntry[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of sourceFiles) {
    // Walk the tree to search for classes
    forEachChild(sourceFile, (node: Node) => {
      const entries: DocEntry[] = visit({checker, node});
      result.push(...entries.map((entry: DocEntry) => ({...entry, fileName: sourceFile.fileName})));
    });
  }

  return result;
};
