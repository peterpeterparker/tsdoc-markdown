import {relative, resolve} from 'node:path/posix';
import type {
  ArrowFunction,
  CompilerOptions,
  Declaration,
  EnumDeclaration,
  Node,
  Signature,
  SourceFile,
  TypeChecker,
  Symbol as TypeScriptSymbol,
  VariableDeclaration
} from 'typescript';
import {
  ModifierFlags,
  ModuleKind,
  NodeFlags,
  ScriptTarget,
  SyntaxKind,
  createProgram,
  displayPartsToString,
  forEachChild,
  getCombinedModifierFlags,
  isArrowFunction,
  isClassDeclaration,
  isEnumDeclaration,
  isFunctionDeclaration,
  isIdentifier,
  isInterfaceDeclaration,
  isMethodDeclaration,
  isModuleDeclaration,
  isPropertyDeclaration,
  isPropertySignature,
  isTypeAliasDeclaration,
  isVariableDeclaration,
  isVariableStatement
} from 'typescript';
import type {BuildOptions, DocEntry, DocEntryConstructor, DocEntryType} from './types';

/** Serialize a symbol into a json object */
const serializeSymbol = ({
  checker,
  symbol,
  doc_type
}: {
  checker: TypeChecker;
  symbol: TypeScriptSymbol;
  doc_type?: DocEntryType;
}): DocEntry => ({
  name: symbol.getName(),
  documentation: displayPartsToString(symbol.getDocumentationComment(checker)),
  type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)),
  jsDocs: symbol.getJsDocTags(),
  ...(doc_type !== undefined && {doc_type})
});

const serializeEnum = ({
  checker,
  symbol,
  doc_type
}: {
  checker: TypeChecker;
  symbol: TypeScriptSymbol;
  doc_type?: DocEntryType;
}): DocEntry => {
  const {members} = symbol.valueDeclaration as EnumDeclaration;

  const properties: DocEntry[] = members.map((member) => {
    const documentation = displayPartsToString(
      (member as unknown as {symbol: TypeScriptSymbol}).symbol.getDocumentationComment(checker)
    );

    const type = member.initializer?.getText();

    return {
      name: member.name.getText(),
      ...(type !== undefined && {type}),
      ...(documentation !== '' && {documentation})
    };
  });

  return {
    name: symbol.getName(),
    documentation: displayPartsToString(symbol.getDocumentationComment(checker)),
    properties,
    jsDocs: symbol.getJsDocTags(),
    doc_type: doc_type ?? 'enum'
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
    .map((signature: Signature) => serializeSignature({checker, signature}))
    .filter(({documentation}) => documentation !== undefined && documentation !== '');

  return details;
};

/** True if this is visible outside this file, false otherwise */
const isNodeExportedOrPublic = (node: Node): boolean => {
  const flags = getCombinedModifierFlags(node as Declaration);

  // Check for '#' methods or properties
  if (
    (isMethodDeclaration(node) || isPropertyDeclaration(node)) &&
    node.name.kind === SyntaxKind.PrivateIdentifier
  ) {
    return false;
  }

  return (
    (flags & ModifierFlags.Export) !== 0 ||
    (flags & ModifierFlags.Public) !== 0 ||
    (isClassDeclaration(node.parent) && [ModifierFlags.None, ModifierFlags.Static].includes(flags))
  );
};

/**
 * True if node is a method or property and is declaration is static.
 */
const isNodeStatic = (node: Node): boolean | undefined => {
  if (!isMethodDeclaration(node) && !isPropertyDeclaration(node)) {
    return undefined;
  }

  const flags = getCombinedModifierFlags(node as Declaration);
  return (flags & ModifierFlags.Static) !== 0;
};

/** Serialize a signature (call or construct) */
const serializeSignature = ({
  checker,
  signature
}: {
  checker: TypeChecker;
  signature: Signature;
}): DocEntryConstructor => {
  const result: Omit<DocEntryConstructor, 'visibility'> = {
    parameters: signature.parameters.map((symbol: TypeScriptSymbol) =>
      serializeSymbol({checker, symbol})
    ),
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: displayPartsToString(signature.getDocumentationComment(checker))
  };

  if (!(signature.declaration == null) && 'modifiers' in signature.declaration) {
    return {
      ...result,
      visibility:
        signature.declaration.modifiers?.[0].kind === SyntaxKind.PrivateKeyword
          ? 'private'
          : 'public'
    };
  }

  return {
    ...result,
    visibility: 'public'
  };
};

// https://stackoverflow.com/a/73338964/5404186
const findDescendantArrowFunction = (node: Node): Node | undefined => {
  if (isArrowFunction(node)) {
    return node;
  }

  return forEachChild(node, findDescendantArrowFunction);
};

// TODO: there is probably a better way
const isTypeKind = (kind: SyntaxKind): boolean => {
  const typeKinds: SyntaxKind[] = [
    SyntaxKind.TypePredicate,
    SyntaxKind.TypeReference,
    SyntaxKind.FunctionType,
    SyntaxKind.ConstructorType,
    SyntaxKind.TypeQuery,
    SyntaxKind.TypeLiteral,
    SyntaxKind.ArrayType,
    SyntaxKind.TupleType,
    SyntaxKind.OptionalType,
    SyntaxKind.RestType,
    SyntaxKind.UnionType,
    SyntaxKind.IntersectionType,
    SyntaxKind.ConditionalType,
    SyntaxKind.InferType,
    SyntaxKind.ParenthesizedType,
    SyntaxKind.ThisType,
    SyntaxKind.TypeOperator,
    SyntaxKind.IndexedAccessType,
    SyntaxKind.MappedType,
    SyntaxKind.LiteralType,
    SyntaxKind.NamedTupleMember,
    SyntaxKind.TemplateLiteralType,
    // SyntaxKind.TemplateLiteralTypeSpan, // This is more of a structural part of template literal types
    SyntaxKind.ImportType
  ];

  return typeKinds.includes(kind);
};

const getRootParentName = (node: Node): string | undefined => {
  if (!node.parent) {
    return undefined;
  }

  if (isVariableDeclaration(node.parent) && isIdentifier(node.parent.name)) {
    return node.parent.name.text;
  }

  return getRootParentName(node.parent);
};

const isRootOrClassLevelArrowFunction = (node: Node): boolean => {
  const {parent} = node;

  if (!parent) {
    return false;
  }

  if (parent.kind === SyntaxKind.SourceFile) {
    return true;
  }

  if (parent.kind === SyntaxKind.ClassDeclaration) {
    return true;
  }

  if (
    parent.kind === SyntaxKind.FunctionDeclaration ||
    parent.kind === SyntaxKind.FunctionExpression ||
    parent.kind === SyntaxKind.ArrowFunction
  ) {
    return false;
  }

  if (
    parent.kind === SyntaxKind.PropertyAssignment ||
    parent.kind === SyntaxKind.ObjectLiteralExpression
  ) {
    return false;
  }

  return isRootOrClassLevelArrowFunction(parent);
};

/** visit nodes finding exported classes */
const visit = ({
  checker,
  node,
  types,
  ...rest
}: {checker: TypeChecker; node: Node} & Source &
  Required<Pick<BuildOptions, 'types'>>): DocEntry[] => {
  // // Only consider exported nodes
  if (!isNodeExportedOrPublic(node)) {
    return [];
  }

  const entries: DocEntry[] = [];

  const pushEntry = ({details, node}: {details: DocEntry; node: Node}): void => {
    entries.push({
      ...details,
      ...buildSource({
        node,
        ...rest
      })
    });
  };

  const addDocEntry = ({
    symbol,
    doc_type,
    isStatic,
    node
  }: {
    symbol: TypeScriptSymbol | undefined;
    doc_type: DocEntryType;
    node: Node;
  } & Pick<DocEntry, 'isStatic'>): void => {
    if (!symbol) {
      return;
    }

    const details = {
      ...serializeSymbol({checker, symbol, doc_type}),
      isStatic
    };

    pushEntry({node, details});
  };

  if (isClassDeclaration(node) && node.name) {
    // This is a top level class, get its symbol
    const symbol = checker.getSymbolAtLocation(node.name);

    if (symbol) {
      const classEntry: DocEntry = {
        ...serializeClass({checker, symbol}),
        methods: [],
        properties: [],
        jsDocs: symbol.getJsDocTags(),
        ...buildSource({
          node,
          ...rest
        })
      };

      const visitChild = (node: Node): void => {
        const docEntries: DocEntry[] = visit({node, checker, types, ...rest});

        // We do not need to repeat the file name for class members

        const omitFilename = ({fileName: _, ...rest}: DocEntry): Omit<DocEntry, 'fileName'> => rest;

        classEntry.methods?.push(
          ...docEntries
            .filter(({doc_type}) => doc_type === 'method' || doc_type === 'function')
            .map(omitFilename)
        );

        classEntry.properties?.push(
          ...docEntries.filter(({doc_type}) => doc_type === 'property').map(omitFilename)
        );
      };

      forEachChild(node, visitChild);

      entries.push(classEntry);
    }
  } else if (isModuleDeclaration(node)) {
    const visitChild = (node: Node): void => {
      const docEntries: DocEntry[] = visit({node, checker, types, ...rest});
      entries.push(...docEntries);
    };

    // This is a namespace, visit its children
    forEachChild(node, visitChild);
  } else if (isMethodDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation(node.name);
    const isStatic = isNodeStatic(node);
    addDocEntry({symbol, doc_type: 'method', isStatic, node});
  } else if (isFunctionDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation(node.name ?? node);
    addDocEntry({symbol, doc_type: 'function', node});
  } else {
    const arrowFunc: Node | undefined = findDescendantArrowFunction(node);

    const arrowFuncSymbol =
      arrowFunc !== undefined
        ? checker.getSymbolAtLocation(
            ((arrowFunc as ArrowFunction).parent as VariableDeclaration).name
          )
        : undefined;

    if (arrowFunc !== undefined && arrowFuncSymbol !== undefined) {
      const parentName = !isRootOrClassLevelArrowFunction(arrowFunc)
        ? getRootParentName(arrowFunc)
        : undefined;

      const details = serializeSymbol({checker, symbol: arrowFuncSymbol, doc_type: 'function'});
      pushEntry({
        node,
        details: {
          ...details,
          name: parentName !== undefined ? `${parentName}.${details.name}` : details.name
        }
      });
    } else if (isPropertyDeclaration(node)) {
      // We test for the property after the arrow function because a public property of a class can be an arrow function.
      const symbol = checker.getSymbolAtLocation(node.name);
      const isStatic = isNodeStatic(node);
      addDocEntry({symbol, doc_type: 'property', isStatic, node});
    } else if (isVariableStatement(node)) {
      const {
        declarationList: {declarations, flags}
      } = node;

      // https://stackoverflow.com/a/69801125/5404186
      const isConst = (flags & NodeFlags.Const) !== 0;

      if (isConst) {
        // TODO: not sure what's the proper casting, VariableDeclaration does not contain Symbol but the test entity effectively does
        const {symbol} = declarations[0] as unknown as {symbol: TypeScriptSymbol};
        addDocEntry({symbol, doc_type: 'const', node});
      }
    } else if (types && isInterfaceDeclaration(node)) {
      const symbol = checker.getSymbolAtLocation(node.name);

      if (symbol) {
        const members = node.members
          .filter(
            (member) =>
              isPropertySignature(member) && member.name !== undefined && isIdentifier(member.name)
          )
          .map((member) => checker.getSymbolAtLocation(member.name!))
          .filter((symbol) => symbol !== undefined)
          .map((symbol) => serializeSymbol({checker, symbol: symbol!}));

        const interfaceEntry: DocEntry = {
          ...serializeSymbol({checker, doc_type: 'interface', symbol}),
          properties: members,
          ...buildSource({
            node,
            ...rest
          })
        };

        entries.push(interfaceEntry);
      }
    } else if (types && isTypeAliasDeclaration(node)) {
      const symbol = checker.getSymbolAtLocation(node.name);

      if (symbol) {
        const child = node.getChildren().find(({kind}) => isTypeKind(kind));

        const typeEntry: DocEntry = {
          ...serializeSymbol({checker, doc_type: 'type', symbol}),
          ...buildSource({
            node,
            ...rest
          }),
          type: child?.getText().replace(/^"|"$/g, '')
        };

        entries.push(typeEntry);
      }
    } else if (isEnumDeclaration(node)) {
      const symbol = checker.getSymbolAtLocation(node.name)!;
      const details = serializeEnum({checker, symbol});
      pushEntry({node, details});
    }
  }

  return entries;
};

const DEFAULT_COMPILER_OPTIONS: CompilerOptions = {
  target: ScriptTarget.ES2020,
  module: ModuleKind.CommonJS,
  strictNullChecks: true
};

type Source = Pick<BuildOptions, 'repo'> & {sourceFile: SourceFile};

const buildSource = ({
  repo,
  node,
  sourceFile
}: Source & {node: Node}): Pick<DocEntry, 'url' | 'fileName'> => {
  const {fileName} = sourceFile;

  if (repo === undefined) {
    return {fileName};
  }

  const {url: repoUrl, branch} = repo;

  const {line} = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  const filePath = relative(process.cwd(), sourceFile.fileName);

  const url = `${repoUrl.replace(/\/+$/, '')}/tree/${branch ?? 'main'}/${filePath.replace(
    /^\.\.\//,
    ''
  )}#L${line + 1}`;

  return {
    fileName,
    url
  };
};

/**
 * Build the documentation entries for the selected sources.
 *
 * @param {inputFiles: string[]; options?: CompilerOptions;} params
 * @param {string[]} params.inputFiles The list of files to scan and for which the documentation should be build.
 * @param {CompilerOptions} params.options Optional compiler options to generate the docs
 *
 * @returns An array of documentation entries
 */
export const buildDocumentation = ({
  inputFiles,
  options
}: {
  inputFiles: string[];
  options?: BuildOptions;
}): DocEntry[] => {
  const {
    compilerOptions,
    explore: userExplore,
    repo,
    types: userTypes
  } = options ?? {
    explore: false,
    compilerOptions: DEFAULT_COMPILER_OPTIONS,
    types: false
  };

  const explore = userExplore ?? false;
  const types = userTypes ?? false;

  // Build a program using the set of root file names in fileNames
  const program = createProgram(inputFiles, compilerOptions ?? DEFAULT_COMPILER_OPTIONS);

  const programSourceFiles = program.getSourceFiles();

  const filenamesFullPaths: string[] = inputFiles.map((fileName: string) => resolve(fileName));

  // Visit only the files specified by the developers - no deep visit
  const sourceFiles = programSourceFiles.filter(
    ({isDeclarationFile, fileName}) =>
      !isDeclarationFile && (explore || filenamesFullPaths.includes(resolve(fileName)))
  );

  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();

  const result: DocEntry[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of sourceFiles) {
    // Walk the tree to search for classes
    forEachChild(sourceFile, (node: Node) => {
      const entries: DocEntry[] = visit({checker, node, sourceFile, repo, types});
      result.push(...entries);
    });
  }

  return result;
};
