
import { createWriteStream, WriteStream } from "node:fs";
import path from "node:path";
import { Transform } from "stream";

const MAX_FILE_SIZE = 8 * 1024; // 8KB

const createNewOutputFile = (fileName: string, outputIndex: number): WriteStream => {
	const baseFileName = path.parse(fileName).name;
  const outputFilePath = `output/${baseFileName}_${outputIndex}.json`;
  const writeStream = createWriteStream(outputFilePath);
  return writeStream;
};

const finalizeWrite = (writeStream: NodeJS.WritableStream, data: string): void => {
	writeStream.write(data);
  writeStream.write(']');
  writeStream.end();
};

/** 
* Transform Stream to write data to given filename and logic to breakdown data if more than 8 kb
*
* @param {string} fileName - Filename to write json string
* 
*/
export function write (fileName: string): Transform {
	const writeTransform = new Transform({
		writableObjectMode: true,
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		transform(chunk: Buffer[], _encoding: string, callback: (error?: Error, data?: unknown) => void) {
			try {
				let outputIndex = 0;
				let writeStream = createNewOutputFile(fileName, outputIndex);
				let dataToWrite = `[${JSON.stringify(chunk[0])}`;
				for (let index = 1; index< chunk.length; index++) {
					const tempChunk = JSON.stringify(chunk[index]);
					if ((dataToWrite.length + tempChunk.length) < MAX_FILE_SIZE ) {
						dataToWrite += `,${tempChunk}`;
					} else {
						outputIndex += 1
						finalizeWrite(writeStream, dataToWrite);
						writeStream = createNewOutputFile(fileName, outputIndex);
						dataToWrite = `[${tempChunk}`;
					}
				}
				finalizeWrite(writeStream, dataToWrite);
				callback();
			} catch (err) {
				callback(err);
			}
		},
	});
	return writeTransform;
}