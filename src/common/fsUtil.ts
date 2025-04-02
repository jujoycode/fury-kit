import { existsSync } from 'fs'
import { mkdir, rm, writeFile } from 'fs/promises'

/**
 * getCurrentDirectory
 * @desc 현재 디렉토리 반환
 */
export function getCurrentDirectory() {
  return process.cwd()
}

/**
 * createDirectory
 * @desc 디렉토리 생성
 */
export async function createDirectory(dir: string) {
  if (!(checkExists(dir))) {
    await mkdir(dir, { recursive: true });
  }
}

/**
 * createFile
 * @desc 파일 생성
 */
export async function createFile(filePath: string, content: string) {
  await writeFile(filePath, content, { encoding: 'utf-8' });
}

/**
 * combinePath
 * @desc 경로 결합 (개수 무제한)
 */
export function combinePath(...paths: string[]): string {
  return paths.join('/');
}

/**
 * checkExists
 * @desc 파일 존재 여부 확인
 */
export function checkExists(path: string) {
  return existsSync(path)
}

/**
 * deleteDirectory
 * @desc 디렉토리 | 파일 삭제 (재귀적)
 */
export async function deleteDirectory(path: string) {
  if (checkExists(path)) {
    await rm(path, { recursive: true })
  }
}