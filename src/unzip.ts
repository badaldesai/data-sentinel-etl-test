import yauzl from 'yauzl';
import zlib from 'node:zlib';
import { transform } from './transform';
import { write } from './write';
import { ReadStream } from 'node:fs';
import path from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openReadStream = (zipfile: any, entry: any): Promise<ReadStream> => {
  return new Promise((resolve, reject) => {
    zipfile.openReadStream(entry, (err, readStream) => {
      if (err) {
        return reject(err);
      }
      return resolve(readStream);
    });
  });
};

/** 
* Unzip main input file and pipe them to unzip each gz file and trasform and write to json files
*
* @param {string} zipFilePath - Path of the zip file.
*/
export async function unzip(zipFilePath: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        console.error('Error unzipping file', err);
        return reject(err);
      }

      zipfile.readEntry();
      zipfile.on('entry', async (entry) => {
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
          return;
        }
        const fileName = path.parse(entry.fileName).name;
        const readStream = await openReadStream(zipfile, entry);
        readStream.pipe(zlib.createGunzip()).pipe(transform()).pipe(write(`output/${fileName}`))
        readStream.on('end', () => {
          zipfile.readEntry();
        });
      });

      zipfile.on('end', () => resolve());
      zipfile.on('error', reject);
    });
  });
}