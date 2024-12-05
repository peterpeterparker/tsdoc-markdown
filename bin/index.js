#!/usr/bin/env node
const {generateDocumentation} = require('../dist/index.cjs.js');
const {readdirSync, statSync} = require('fs');
const {join, dirname} = require('path');

const help = process.argv.find((arg) => arg.indexOf('--help') > -1);

if (help !== undefined) {
  console.log('Mandatory parameters:');
  console.log('--src=<list of files> (comma separated if multiple or wild card)');

  console.log('\nOptions:');
  console.log('--dest=<destination file> (default README.md)');
  console.log('--repo=<GitHub repo URL>');
  console.log('--types');
  console.log('--noemoji');
  return;
}

const listFolderInputs = (dir) =>
  readdirSync(dir)
    .filter((file) => file.includes('ts') && statSync(join(dir, file)).isFile())
    .map((file) => `${dir}/${file}`);

const listInputs = () =>
  process.argv
    .find((arg) => arg.indexOf('--src=') > -1)
    ?.replace('--src=', '')
    ?.split(',')
    .reduce(
      (acc, file) => [...acc, ...(file.endsWith('*') ? listFolderInputs(dirname(file)) : [file])],
      []
    );

const inputFiles = listInputs();

const outputFile =
  process.argv.find((arg) => arg.indexOf('--dest=') > -1)?.replace('--dest=', '') ?? 'README.md';

const repoUrl = process.argv.find((arg) => arg.indexOf('--repo=') > -1)?.replace('--repo=', '');

const types = process.argv.find((arg) => arg.indexOf('--types') > -1) !== undefined;

const noEmoji = process.argv.find((arg) => arg.indexOf('--noemoji') > -1) !== undefined;

if (!inputFiles || inputFiles.length === 0) {
  throw new Error('No source file(s) provided.');
}

generateDocumentation({
  inputFiles,
  outputFile,
  buildOptions: {
    ...(repoUrl !== undefined && {
      repo: {
        url: repoUrl
      }
    }),
    ...(types && {types})
  },
  markdownOptions: {
    ...(noEmoji && {
      emoji: null
    })
  }
});
