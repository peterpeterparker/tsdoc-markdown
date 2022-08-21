#!/usr/bin/env node
const {generateDocumentation} = require('../dist/index.cjs.js');

const help = process.argv.find((arg) => arg.indexOf('--help') > -1);

if (help !== undefined) {
    console.log('Mandatory parameters:');
    console.log('--src=<list of files> (comma separated if multiple)');

    console.log('\nOptions:');
    console.log('--dest=<destination file> (default README.md)');
    return;
}

const inputFiles =
    process.argv.find((arg) => arg.indexOf('--src=') > -1)?.replace('--src=', '')?.split(',');
const outputFile =
    process.argv.find((arg) => arg.indexOf('--dest=') > -1)?.replace('--dest=', '') ?? 'README.md';

if (!inputFiles || inputFiles === '') {
    throw new Error('No source file(s) provided.');
}

generateDocumentation({inputFiles, outputFile});
