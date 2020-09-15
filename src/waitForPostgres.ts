import dotenv from 'dotenv';
import execa from 'execa';
import ora from 'ora';
import path from 'path';

const { argv } = process;
const prismaPath = path.resolve(process.cwd(), argv[2] || 'prisma');
dotenv.config({ path: path.resolve(prismaPath, '.env') });
const spinner = ora();

(async () => {
  spinner.start('waiting for postgres');
  const waitForPostgres = path.resolve(
    __dirname,
    '../scripts/wait-for-postgres.sh'
  );
  await execa('sh', ['-c', waitForPostgres], { stdio: 'inherit' });
  spinner.succeed('postgres ready');
})();
