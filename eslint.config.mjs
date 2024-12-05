import {FlatCompat} from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// eslint-disable-next-line no-redeclare
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-redeclare
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: [
      '**/dist/',
      '**/jest.config.js',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/mock.ts',
      'bin/index.js'
    ]
  },
  {languageOptions: {globals: globals.node}},
  ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        project: ['./tsconfig.eslint.json']
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error'
    }
  }
];
