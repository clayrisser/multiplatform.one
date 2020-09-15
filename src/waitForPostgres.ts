import dotenv from 'dotenv';
import execa from 'execa';
import ora from 'ora';
import path from 'path';

const { argv, env } = process;
const prismaPath = path.resolve(process.cwd(), argv[2] || 'prisma');
dotenv.config({ path: path.resolve(prismaPath, '.env') });
const spinner = ora();

(async () => {
  spinner.start('waiting for postgres');
  await waitForPostgres();
  spinner.succeed('postgres ready');
})();

async function waitForPostgres(interval = 1000) {
  if (!env.POSTGRES_URL) throw new Error('$POSTGRES_URL not set');
  for (;;) {
    if (
      (
        await execa('psql', [env.POSTGRES_URL, '-c', '\\l'], {
          stdio: 'pipe'
        })
      ).exitCode === 0
    ) {
      break;
    }
    await new Promise((r) => setTimeout(r, interval));
  }
}
