// tslint:disable-next-line:no-var-requires
const config = require('../config.json');
import { spawn } from 'child_process';
import * as path from 'path';

interface IRemoveDRMParams {
  /** Path to source Audible file. */
  source: string;
  /** Path to the folder to place the output. */
  destinationDir: string;
  debug?: boolean;
}

interface ISpawnWithPromiseParams {
  program: string;
  options?: string[];
  debug?: boolean;
}

interface ISplitByChapterParams {
  /** Path to source de-drm'd file. */
  source: string;
  debug?: boolean;
}

const spawnWithPromise = (params: ISpawnWithPromiseParams) => {
  const { program, options, debug = false } = params;

  return new Promise((resolve, reject) => {
    const process = spawn(program, options);

    if (debug) {
      process.stdout.on('data', data => console.info(data.toString()));
      process.stderr.on('data', data => console.error(data.toString()));
    }

    process.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Exited with signal ${signal}`);
      }
    });
  });
};

export class FFMPEGUtil {
  static async removeDRM(params: IRemoveDRMParams) {
    const { source, destinationDir, debug } = params;

    console.log(`\nRemoving DRM from ${source}...`);

    const fileName = path.basename(source, '.aax').split('_')[0];
    const destination = path.join(destinationDir, `${fileName}.m4a`);

    try {
      await spawnWithPromise({
        debug,
        options: [
          `-activation_bytes`,
          config.activationBytes,
          '-vn',
          `-i`,
          source,
          '-c:a',
          'copy',
          destination
        ],
        program: 'ffmpeg'
      });
    } catch (e) {
      console.error(`There was a problem...`, e);
      return null;
    }

    console.log(`Successfully removed DRM!`);
    console.log(`The output file is at ${destination}`);

    return { destination };
  }

  static async splitByChapter(params: ISplitByChapterParams) {
    const { source, debug } = params;

    console.log(`Splitting into chapters`);

    await spawnWithPromise({
      debug,
      options: ['-f', source],
      program: './src/split.py'
    });

    console.log('Split!');
  }
}
