import dotenv from 'dotenv';
import execa, { ExecaError } from 'execa';
import ora from 'ora';
import path from 'path';

const { argv, env } = process;
const prismaPath = path.resolve(process.cwd(), argv[2] || '');
dotenv.config({ path: path.resolve(prismaPath, '.env') });

export default async function main(spinner = ora()) {
  spinner.start('waiting for postgres');
  try {
    await waitForPostgres();
  } catch (err) {
    return spinner.fail(err.message);
  }
  spinner.succeed('postgres ready');
}

export async function waitForPostgres(interval = 1000) {
  if (!env.POSTGRES_URL) throw new Error('$POSTGRES_URL not set');
  for (;;) {
    try {
      if (
        (
          await execa('psql', [env.POSTGRES_URL, '-c', '\\l'], {
            stdio: 'pipe'
          })
        ).exitCode === 0
      ) {
        break;
      }
    } catch (err) {
      const execaErr: ExecaError = err;
      if (typeof execaErr.exitCode !== 'number') throw err;
    }
    await new Promise((r) => setTimeout(r, interval));
  }
}
