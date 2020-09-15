import dotenv from 'dotenv';
import execa from 'execa';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

dotenv.config();
const { env, argv } = process;
const prismaPath = path.resolve(process.cwd(), argv[2] || 'prisma');

(async () => {
  const postgresUrl = env.POSTGRES_URL
    ? env.POSTGRES_URL
    : `postgresql://${env.POSTGRES_USERNAME || 'postgres'}:${
        env.POSTGRES_PASSWORD
      }@${env.POSTGRES_HOST}:${env.POSTGRES_PORT || '5432'}/${
        env.POSTGRES_DATABASE || 'postgres'
      }?sslmode=${env.POSTGRES_SSLMODE || 'prefer'}`;
  const prisma = path.resolve(
    (await pkgDir(require.resolve('@prisma/cli'))) ||
      path.resolve(process.cwd(), 'node_modules/@prisma/cli'),
    'build/index.js'
  );
  await fs.writeFile(
    path.resolve(prismaPath, '.env'),
    `# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------
POSTGRES_URL=${postgresUrl}
`
  );
  await execa('node', [prisma, 'generate'], { stdio: 'inherit' });
})();
