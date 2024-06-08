/*
 * File: /vite.config.ts
 * Project: keycloakify-starter
 * File Created: 08-06-2024 10:54:54
 * Author: Joseph Garrone
 * -----
 * Copyright (c) 2020 Joseph Garrone
 */

import commonjs from 'vite-plugin-commonjs';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { keycloakify } from 'keycloakify/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    commonjs(),
    keycloakify({
      themeName: 'keycloakify-starter',
      extraThemeProperties: [`MY_ENV_VARIABLE=\${env.MY_ENV_VARIABLE:}`],
      postBuild: async (keycloakifyBuildOptions) => {
        const fs = await import('fs/promises');
        const path = await import('path');
        await fs.writeFile(
          path.join(keycloakifyBuildOptions.keycloakifyBuildDirPath, 'foo.txt'),
          Buffer.from(
            [
              'This file was created by the postBuild hook of the keycloakify vite plugin',
              '',
              'Resolved keycloakifyBuildOptions:',
              '',
              JSON.stringify(keycloakifyBuildOptions, null, 2),
              '',
            ].join('\n'),
            'utf8',
          ),
        );
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
});
