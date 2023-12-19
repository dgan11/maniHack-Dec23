module.exports = {
  extends: [
    './.base.eslintrc.js',
    'plugin:storybook/recommended',
    '@manifoldxyz/eslint-config/react',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      // reference ./tsconfig.json for import path resolution
      // to support absolute imports like '@/...'
      typescript: {
        alwaysTryTypes: true, // Try to resolve types under `<root>@types` directory even if it doesn't contain any source code
        project: './tsconfig.json' // Path to your tsconfig.json
      },
    },
    tailwindcss: {
      callees: ['classnames', 'clsx', 'ctl', 'classes'],
    },
  },
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.js', '*.md', '*.css', '*.scss'],
  overrides: [
    {
      files: ['tests/**'],
      plugins: ['vitest'],
      extends: ['plugin:vitest/recommended'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
  rules: {
    // turn on errors for relative path imports
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../*'],
            caseSensitive: true,
            message: 'Please use @ syntax for imports not relative paths',
          },
        ],
      },
    ],
    // turn off eslint sort keys
    'sort-keys': 'off',
    'sort-keys-fix/sort-keys-fix': 'off',
  },
};
