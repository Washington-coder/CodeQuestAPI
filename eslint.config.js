import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['build', 'dist', 'node_modules'],
  },

  js.configs.recommended,

  // Regras do TypeScript com checagem de tipos (necessário para regras
  // como no-floating-promises, essenciais em handlers async do Fastify)
  ...tseslint.configs.recommendedTypeChecked,

  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      'prettier/prettier': 'error',
      camelcase: 'off',

      // Boas práticas gerais
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-return-await': 'off', // substituída pela versão typescript abaixo

      // Essenciais em apps Fastify (rotas/hooks assíncronos)
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-shadow': 'error',
      'no-shadow': 'off',
    },
  },

  {
    // Arquivos de configuração em JS puro não precisam de type-checking
    files: ['*.config.js', '*.config.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
)
