export type PackageManager = 'npm' | 'yarn' | 'pnpm'
export type Framework = 'nodejs'
export type Language = 'javascript' | 'typescript' | 'typescript-swc'

export interface ProjectOption {
  projectName: string
  packageManager: PackageManager
  framework: Framework
  language: Language
  projectOptions: string[]
  additionalDependencies: string[]
  additionalDevDependencies: string[]
  installDependencies: boolean
}

export interface PackageJson {
  name: string
  version: string
  description: string
  type: 'module' | 'commonjs'
  exports: string
  scripts: Record<string, string>
  keywords: string[]
  engines: Record<'node', string>
  author: string
  license: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}
