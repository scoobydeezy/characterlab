import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const repositoryRoot = process.cwd();
const activeRoot = path.resolve(repositoryRoot, 'src');
const referenceRoot = path.resolve(repositoryRoot, 'reference');
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts']);

function sourceFiles(directory) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...sourceFiles(fullPath));
    else if (sourceExtensions.has(path.extname(entry.name))) result.push(fullPath);
  }
  return result;
}

function moduleSpecifier(node) {
  if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
    return node.moduleSpecifier.text;
  }
  if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference) && node.moduleReference.expression && ts.isStringLiteralLike(node.moduleReference.expression)) {
    return node.moduleReference.expression.text;
  }
  if (ts.isCallExpression(node) && node.arguments.length === 1 && ts.isStringLiteralLike(node.arguments[0])) {
    if (node.expression.kind === ts.SyntaxKind.ImportKeyword) return node.arguments[0].text;
    if (ts.isIdentifier(node.expression) && node.expression.text === 'require') return node.arguments[0].text;
  }
  return undefined;
}

function resolvesIntoReference(importingFile, specifier) {
  if (specifier === 'reference' || specifier.startsWith('reference/') || specifier.startsWith('@reference/')) return true;
  if (!specifier.startsWith('.')) return false;
  const resolved = path.resolve(path.dirname(importingFile), specifier);
  return resolved === referenceRoot || resolved.startsWith(`${referenceRoot}${path.sep}`);
}

const violations = [];
for (const file of sourceFiles(activeRoot)) {
  const text = fs.readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  function inspect(node) {
    const specifier = moduleSpecifier(node);
    if (specifier && resolvesIntoReference(file, specifier)) {
      const position = source.getLineAndCharacterOfPosition(node.getStart(source));
      violations.push(`${path.relative(repositoryRoot, file)}:${position.line + 1}: forbidden import '${specifier}'`);
    }
    ts.forEachChild(node, inspect);
  }
  inspect(source);
}

if (violations.length > 0) {
  console.error('Active source may not import from reference/:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log('Reference boundary check passed.');
}
