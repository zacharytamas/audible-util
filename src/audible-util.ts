// tslint:disable-next-line:no-var-requires
const config = require('../config.json');
import { FFMPEGUtil } from './ffmpeg';
// tslint:disable-next-line:no-submodule-imports
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

const HOME_DIRECTORY = os.homedir();
const DOWNLOADS_DIRECTORY = path.join(HOME_DIRECTORY, 'Downloads');

(async () => {
  console.log('Discovering AAX files in Downloads folder...');

  const aaxFiles = (await fs.readdir(DOWNLOADS_DIRECTORY)).filter(filename =>
    filename.endsWith('.aax')
  );

  if (aaxFiles.length === 0) {
    console.error('Found no AAX files!');
    return;
  }

  console.log('Found the following AAX files:');
  aaxFiles.forEach(file => console.log(`  ${file}`));

  console.log('\nBeginning now...');

  for (const file of aaxFiles) {
    const { destination } = await FFMPEGUtil.removeDRM({
      destinationDir: config.destinationDir || '.',
      source: path.join(DOWNLOADS_DIRECTORY, file)
    });

    await FFMPEGUtil.splitByChapter({
      source: destination
    });

    // TODO have it clean up after itself and delete the remnants (old AAX
    // file and the interim MP4)
  }
})();
