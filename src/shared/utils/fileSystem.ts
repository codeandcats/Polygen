import * as fs from 'fs-extra';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

export async function mkdir(dirPath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    mkdirp(dirPath, err => err ? reject(err) : resolve());
  });
}

export async function fileExists(fileName: string): Promise<boolean> {
  try {
    const stat = await fs.stat(fileName);
    return stat.isFile();
  } catch {
    return false;
  }
}
