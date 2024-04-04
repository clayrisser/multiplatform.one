import { seedDb } from '@multiplatform.one/prisma-scripts';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default async function seed() {
  await seedDb({}, []);
}
