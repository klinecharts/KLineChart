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
        'chore',
        'test',
        'revert',
        'ci',
        'release'
      ]
    ],
    'subject-case': [0]
  }
};
