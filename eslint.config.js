import { FlatCompat } from '@eslint/eslintrc'
import love from 'eslint-config-love'
import progress from 'eslint-plugin-file-progress'

export default [
  ...new FlatCompat().extends('eslint-config-standard'),
  {
    ...love,
    files: ['src/**/*.js', 'src/**/*.ts']
  },
  {
    plugins: {
      'file-progress': progress
    },
    ignores: [
      'eslint.config.js',
      'scripts/**/*',
      'dist/**/*',
      'docs/**/*',
      'index.js'
    ],
    rules: {
      'file-progress/activate': 1,
      complexity: 'off',
      'promise/avoid-new': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/class-methods-use-this': 'off',
      '@typescript-eslint/max-params': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/prefer-destructuring': 'off'
    }
  }
]
