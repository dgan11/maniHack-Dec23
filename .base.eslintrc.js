const paddingBetwenFunctionAndStatement = ['function', 'block-like', 'return', 'var', 'let', 'const', 'break', 'continue'];

const paddingRules = [];

// automatically add padding rules for all statement types swapping prev and next
paddingBetwenFunctionAndStatement.forEach((statementType) => {
  paddingRules.push({
    blankLine: 'always',
    prev: statementType,
    next: 'function',
  });
  if (statementType === 'function') {
    return;
  }
  paddingRules.push({
    blankLine: 'always',
    prev: 'function',
    next: statementType,
  });
});

module.exports = {
  root: true,
  extends: ['airbnb-typescript/base', 'airbnb-typescript', '@manifoldxyz'],
  parserOptions: {
    project: './tsconfig.json',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      parser: '@typescript-eslint/parser',
    },
    {
      files: ['**/tests/**'],
      plugins: ['vitest'],
      extends: ['plugin:vitest/recommended'],
      rules: {
        'vitest/consistent-test-filename': 'off',
        'vitest/no-conditional-expect': 'error',
      },
    },
  ],
  rules: {
    // more TS specific overrides
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',

    // react specifics
    'react/jsx-filename-extension': 'off',

    // import rules
    'import/no-extraneous-dependencies': ['error', { peerDependencies: true }],

    // padding after function declarations -- remove once this is an option in prettier
    'padding-line-between-statements': 'off',
    '@typescript-eslint/padding-line-between-statements': ['error', ...paddingRules],
  },
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.js', '*.md', '*.css', '*.scss'],
};
