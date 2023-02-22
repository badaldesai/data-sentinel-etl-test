import { unzip } from '../src/unzip';
import { existsSync, mkdirSync } from 'fs';

describe('run', () => {
  let consoleErrorMock;
  jest.mock('../src/unzip');
  jest.mock('fs');
  unzip as jest.MockedFunction<(path: string) => Promise<void>>;
  existsSync as jest.MockedFunction<(path: string) => boolean>;
  mkdirSync as unknown as jest.MockedFunction<(path: string) => void>;

  beforeAll(() => {
    jest.resetModules();
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
  });
  afterEach(() => {
    process.argv[2] = undefined;
    consoleErrorMock.mockRestore();
  });
  it('should throw an error when no command line arguments are provided', async () => {
    process.argv[2] = undefined;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { run } = require('../src/main');

    await expect(run()).rejects.toThrow();
    expect(consoleErrorMock).toHaveBeenCalledWith('Please provide zip file');
  });

  it('should run the module', async () => {
    process.argv[2] = 'input.zip';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { run } = require('../src/main')

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    await expect(run()).resolves.not.toThrow();
    expect(consoleErrorMock).toHaveBeenCalledTimes(0);
  });
});
