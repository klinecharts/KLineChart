import config from 'eslint-config-love'

export default [
  {
    ...config,
    files: ['src/**/*.js', 'src/**/*.ts'],
  },
  {
    ignores: [
      'eslint.config.js',
      'scripts/**/*',
      'dist/**/*',
      'docs/**/*',
      'index.js'
    ]
  },
  {
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/class-methods-use-this": "off",
      "@typescript-eslint/max-params": "off"
    }
  }
]
