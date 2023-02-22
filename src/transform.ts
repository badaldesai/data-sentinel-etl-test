import { Transform } from "stream";

interface RawData {
  ts: number;
  u: string;
  e: object[];
}

export interface TransformData {
  timestamp: number;
  url_object: {
    domain: string;
    path: string;
    query_object?: object;
    hash?: string;
  }
  ec: object;
}

/** 
* Transform Data from raw string from chunk to Each JSON object.
*
* @param {string} rawData - stringify JSON for raw data
* @returns {TransformData[]} - Array of Transform data
*/
export function transformData(rawData: string): TransformData[] {
  const jsonObject: RawData = JSON.parse(rawData);
  const url = new URL(jsonObject.u);
  let query_object;
  if (url.searchParams) {
    query_object = {};
    for (const [key, value] of url.searchParams) {
      query_object[key] = value;
    }
  }
  const transformArray: TransformData[] = [];
  jsonObject.e.forEach((event) => {
    transformArray.push({
      timestamp: jsonObject.ts,
      url_object: {
        domain: url.hostname,
        path: url.pathname,
        query_object: query_object,
        hash: url.hash,
      },
      ec: event
    });
  });
  return transformArray;
}

/** 
* Transform Stream to convert raw data to json array.
*
* @param {string} rawData - stringify JSON for raw data
* @returns Transform Stream with transformed data
*/
export function transform (): Transform | null {
  const jsonTransform = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    transform(chunk: Buffer, _encoding: string, callback: (error?: Error, data?: unknown) => void) {
      const jsonString = chunk.toString();
      try {
        const tData = transformData(jsonString);
        callback(null, tData);
      } catch (err) {
        callback(err);
      }
    },
  });
  return jsonTransform;
}