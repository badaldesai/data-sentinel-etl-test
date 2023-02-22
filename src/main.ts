import { existsSync, mkdirSync } from 'fs';
import { unzip } from './unzip';

/** 
* Main function to run the ETL
*
* @returns {Promise<void>}
*/

export async function run(): Promise<void> {
  if (!process.argv[2]) {
    console.error('Please provide zip file');
    throw new Error();
  }
  const zipFilePath = process.argv[2];
  if(!existsSync('output')) {
    mkdirSync('output');
  }
  await unzip(zipFilePath);
}

run().catch(() => {
  console.error('Error running the ETL');
  process.exitCode = 1;
});
