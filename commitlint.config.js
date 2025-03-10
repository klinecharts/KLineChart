export default {
  extends: ['@commitlint/config-conventional'],
  roles: {
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
        'release'
      ]
    ],
    'subject-case': [0]
  }
}
