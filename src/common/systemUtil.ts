import { execSync } from 'child_process'

/**
 * Node.js 버전을 가져옵니다
 * @returns 설치된 Node.js 버전 문자열 또는 null(설치되지 않은 경우)
 */
function getNodeVersion(): string | null {
  try {
    const version = execSync('node -v').toString().trim()
    return version
  } catch (error) {
    return null
  }
}

/**
 * 특정 패키지 매니저의 버전을 가져옵니다
 * @param manager 확인할 패키지 매니저 ('npm', 'yarn', 'pnpm')
 * @returns 설치된 패키지 매니저 버전 문자열 또는 null(설치되지 않은 경우)
 */
function getPackageManagerVersion(manager: 'npm' | 'yarn' | 'pnpm'): string | null {
  try {
    const version = execSync(`${manager} -v`).toString().trim()
    return version
  } catch (error) {
    return null
  }
}

/**
 * Node.js가 설치되어 있는지 확인합니다
 * @returns 설치 여부
 */
export function isNodeInstalled(): boolean {
  return getNodeVersion() !== null
}

/**
 * 특정 패키지 매니저가 설치되어 있는지 확인합니다
 * @param manager 확인할 패키지 매니저 ('npm', 'yarn', 'pnpm')
 * @returns 설치 여부
 */
export function isPackageManagerInstalled(manager: 'npm' | 'yarn' | 'pnpm'): boolean {
  return getPackageManagerVersion(manager) !== null
}
