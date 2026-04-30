module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // Allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'chore',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'revert',
      ],
    ],

    // Subject must not be empty
    'subject-empty': [2, 'never'],

    // Subject must not end with period
    'subject-full-stop': [2, 'never', '.'],

    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
  },
};
