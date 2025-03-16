import love from 'eslint-config-love';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['dist', '**/mock.ts', 'bin/index.js', 'jest.config.js', '**/*.spec.ts']
  },
  {
    ...love,
    files: ['**/*.js', '**/*.ts']
  },
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },

      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: ['tsconfig.json']
      }
    }
  },

  {
    rules: {
      '@typescript-eslint/naming-convention': 'off',
      complexity: 'off'
    }
  }
];
