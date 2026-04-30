const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,

  // ================= BASE RULES =================
  {
    settings: {
      // ✅ THIS FIXES "@/..." IMPORTS
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      'no-console': 'off',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      eqeqeq: ['error', 'always'],
      'no-unused-vars': 'off',
      'no-var': 'error',

      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],

      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          semi: true,
          printWidth: 80,
          tabWidth: 2,
          endOfLine: 'auto',
        },
      ],
    },
  },

  // ================= TYPESCRIPT FILES =================
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  // ================= TEST + JS FILES =================
  {
    files: ['**/*.test.js', '**/*.test.ts', '**/jest.setup.js', '**/*.js'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
    languageOptions: {
      globals: {
        jest: 'readonly',
      },
    },
  },

  {
    ignores: ['dist/*', 'node_modules/*'],
  },
]);
