import { defineConfig } from 'vite'
import tsConfigTest from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigTest()],
  test: {
    globals: true,
    coverage: {
      exclude: ['src/main'],
    },
  },
})
