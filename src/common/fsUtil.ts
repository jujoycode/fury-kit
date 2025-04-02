import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'

export function getCurrentDirectory() {
  return process.cwd()
}

export async function createDirectory(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

export async function createFile(filePath: string, content: string) {
  await writeFile(filePath, content, { encoding: 'utf-8' });
}

export function combinePath(...paths: string[]): string {
  return paths.join('/');
}