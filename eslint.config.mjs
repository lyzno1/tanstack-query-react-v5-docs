import antfu from '@antfu/eslint-config'

export default antfu(
  {
    astro: true,
    lessOpinionated: true,
    markdown: false,
    stylistic: false,
    toml: false,
    yaml: false,
    ignores: [
      '.agents/**',
      '.astro/**',
      '.claude/**',
      'dist/**',
      'src/content/docs/**',
      'upstream/**',
    ],
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
    },
  },
  {
    files: ['scripts/*.test.mjs'],
    rules: {
      // Maintenance scripts use Node's built-in runner, without a browser test stack.
      'test/no-import-node-test': 'off',
    },
  },
)
