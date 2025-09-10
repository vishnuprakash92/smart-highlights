import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.{js,ts}', 'tests/**/*.spec.{js,ts}', 'tests/contract/**/*.test.{js,ts}'],
    exclude: ['node_modules/**', '**/tests/e2e/**', '**/tests/e2e/**/**'],
  },
});
