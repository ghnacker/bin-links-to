import { resolve } from 'path';

const binLinks = require('@ghnacker/bin-links');
export const readPackageJson = require('read-package-json-fast');

type Paths = string | string[];
const toPathList = (p: Paths) => (typeof p === 'string' ? [p] : p);

export const binLinksTo = async (from: Paths, to: Paths) => {
  const promises = [];
  const tops = toPathList(to);
  for (const path of toPathList(from)) {
    const pkg = await readPackageJson(resolve(path, 'package.json'));
    for (const top of tops) {
      promises.push(binLinks({ path, top, pkg }));
    }
  }
  return Promise.all(promises);
};
