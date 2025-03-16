import love from 'eslint-config-love';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['dist']
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
        project: ['./tsconfig.eslint.json']
      }
    }
  },

  {
    rules: {
      '@typescript-eslint/naming-convention': 'off'
    }
  }
];
