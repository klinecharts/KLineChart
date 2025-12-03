export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'impr',
        'chore',
        'test',
        'revert',
        'ci',
        'opt',
        'release',
        'wip'
      ]
    ],
    'subject-case': [0]
  }
}
