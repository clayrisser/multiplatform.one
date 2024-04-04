import { defineConfig } from 'tsup';
import transpileModules from './transpileModules';

export default defineConfig({
  bundle: true,
  clean: true,
  dts: false,
  entry: ['**/*.ts?(x)', '!tsup.config.ts', '!main', '!prisma', '!generated/gql'],
  entryPoints: ['main.ts'],
  format: ['cjs'],
  minify: false,
  noExternal: transpileModules,
  outDir: 'dist',
  sourcemap: true,
  publicDir: './public',
  skipNodeModulesBundle: true,
  splitting: true,
  target: 'es2022',
});
