import { defineConfig } from 'tsup';

export default defineConfig({
  bundle: true,
  clean: true,
  dts: true,
  entry: ['src/**/*.ts?(x)'],
  entryPoints: ['src/index.ts'],
  format: ['cjs', 'esm'],
  minify: false,
  outDir: 'lib',
  publicDir: './public',
  skipNodeModulesBundle: true,
  splitting: true,
  target: 'es5',
});
