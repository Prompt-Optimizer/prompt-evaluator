// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments';
import promisePlugin from 'eslint-plugin-promise';
import prettierPlugin from 'eslint-plugin-prettier';
import securityPlugin from 'eslint-plugin-security';
import complexityPlugin from 'eslint-plugin-complexity';
import jestPlugin from 'eslint-plugin-jest';

export default tseslint.config(
    {
      ignores: ['eslint.config.mjs'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        sourceType: 'commonjs',
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: './tsconfig.json',
            extensions: ['.ts', '.tsx'],
          },
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
      },
    },
    {
      plugins: {
        '@typescript-eslint': tsPlugin,
        import: importPlugin,
        'unused-imports': unusedImportsPlugin,
        'eslint-comments': eslintCommentsPlugin,
        promise: promisePlugin,
        prettier: prettierPlugin,
        security: securityPlugin,
        complexity: complexityPlugin,
        jest: jestPlugin,
      },
      rules: {
        // TypeScript rules
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/prefer-as-const': 'error',

        // Code style
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        'no-multiple-empty-lines': ['error', {max: 1}],
        'eol-last': ['error', 'always'],
        'no-console': 'warn',
        'no-debugger': 'error',
        eqeqeq: ['error', 'always'],
        'no-var': 'error',
        'prefer-const': 'error',

        // Promises
        'promise/always-return': 'error',
        'promise/no-return-wrap': 'error',
        'promise/param-names': 'error',
        'promise/no-nesting': 'warn',

        // Import rules
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'import/no-unresolved': [
          'error',
          {
            ignore: ['^\\..*'],
          },
        ],
        'import/no-cycle': 'error',

        // Security rules
        'security/detect-object-injection': 'warn',
        'security/detect-non-literal-regexp': 'warn',
        'security/detect-unsafe-regex': 'error',
        'security/detect-buffer-noassert': 'error',
        'security/detect-child-process': 'warn',
        'security/detect-eval-with-expression': 'error',
        'security/detect-no-csrf-before-method-override': 'error',
        'security/detect-pseudoRandomBytes': 'error',

        // Complexity rules
        complexity: ['error', 10],
        'max-depth': ['error', 4],
        'max-lines': ['error', 300],
        'max-lines-per-function': ['error', 60],
        'max-params': ['error', 4],

        'prettier/prettier': 'error',

        // off
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
    // Jest configuration for test files
    {
      files: ['**/*.spec.ts', '**/*.test.ts', '**/test/**/*.ts'],
      plugins: {
        jest: jestPlugin,
      },
      rules: {
        'jest/expect-expect': 'warn',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/prefer-to-be': 'error',
        'jest/prefer-to-have-length': 'error',
        'jest/valid-expect': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-test-return-statement': 'warn',
        'jest/prefer-expect-assertions': 'warn',

        // Allow unsafe operations in tests
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
      },
    },
);
