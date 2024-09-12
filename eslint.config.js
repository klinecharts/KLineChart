import config from 'eslint-config-love'
import progress from 'eslint-plugin-file-progress'

export default [
  {
    ...config,
    files: ['src/**/*.js', 'src/**/*.ts'],
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
      "file-progress/activate": 1,
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/class-methods-use-this": "off",
      "@typescript-eslint/max-params": "off"
    }
  }
]
