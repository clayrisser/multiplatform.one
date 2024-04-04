import { defineConfig } from 'tsup';

export default defineConfig({
  bundle: false,
  clean: true,
  dts: false,
  entry: ['seed.ts'],
  format: ['cjs'],
  minify: false,
  outDir: 'dist',
  shims: true,
  skipNodeModulesBundle: true,
  splitting: true,
  target: 'es6',
});
