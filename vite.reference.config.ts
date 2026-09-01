/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['reference/src/test/**/*.test.ts'],
  },
});

