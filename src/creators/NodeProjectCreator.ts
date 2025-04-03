import pc from "picocolors"
import { NpmUtil } from "#common/npmUtil.js"
import { createDirectory, createFile, combinePath, checkExists } from "#common/fsUtil.js"
import { BaseProjectCreatorFactory } from "#factories/project/BaseProjectCreatorFactory.js"
import { BaseError, CommandExecutionFailedError, ResourceConflictError } from "#errors/index.js"
import type { ProjectOption, PackageJson } from "#interfaces/project.interface.js"

import swcConfig from '#templates/swc-config.json' with { type: 'json' }
import tsConfig from '#templates/ts-config.json' with { type: 'json' }
import eslintConfig from '#templates/eslint-config.json' with { type: 'json' }
import prettierConfig from '#templates/prettier-config.json' with { type: 'json' }

/**
 * NodeProjectCreator
 * @desc Node.js 프로젝트 생성을 위한 Creator
 */
export class NodeProjectCreator extends BaseProjectCreatorFactory {
  constructor(projectOption: ProjectOption) {
    super(projectOption)
  }

  /**
   * prepareProject
   * @desc 
   */
  protected async prepareProject(): Promise<void> {
    const { projectName } = this.projectOption
    const spinner = this.prompts.spinner()

    spinner.start("Preparing Node.js project")

    if (checkExists(projectName)) {
      spinner.stop()
      throw new ResourceConflictError(`directory(${pc.yellow(projectName)})`)
    }

    try {
      createDirectory(projectName)

      const packageJson = await this.createPackageJson()
      createFile(combinePath(projectName, "package.json"), JSON.stringify(packageJson, null, 2))

      spinner.stop("🎨 Node.js project prepared")
    } catch (error) {
      spinner.stop(`❌ Failed to prepare project: ${error}`)
      throw new CommandExecutionFailedError(error instanceof BaseError ? error.message : "Unknown error")
    }
  }

  /**
   * createProjectStructure
   * @desc 
   */
  protected async createProjectStructure(): Promise<void> {
    const { projectName, language } = this.projectOption
    const spinner = this.prompts.spinner()

    spinner.start("Creating project structure")

    try {
      // src 디렉토리 생성
      const srcDir = combinePath(projectName, "src",)
      await createDirectory(srcDir)

      // index 파일 생성
      await createFile(combinePath(srcDir, language.includes("typescript") ? "index.ts" : "index.js"), `console.log('Hello, World!');\n`)

      spinner.stop("🍻 Project structure created")
    } catch (error) {
      spinner.stop(`❌ Failed to create project structure: ${error}`)
      throw error
    }
  }

  /**
   * configureProject
   * @desc 
   */
  protected async configureProject(): Promise<void> {
    const { projectName, language, projectOptions } = this.projectOption
    const spinner = this.prompts.spinner()

    spinner.start("Configuring project")

    try {
      const configFiles = [
        { condition: language.includes("typescript"), path: "tsconfig.json", content: tsConfig },
        { condition: language.includes("swc"), path: ".swcrc", content: swcConfig },
        { condition: projectOptions.includes("eslint"), path: ".eslintrc.json", content: eslintConfig },
        { condition: projectOptions.includes("prettier"), path: ".prettierrc", content: prettierConfig }
      ]

      for (const { condition, path, content } of configFiles) {
        if (condition) {
          createFile(combinePath(projectName, path), JSON.stringify(content, null, 2))
        }
      }

      spinner.stop("🔨 Project configured")
    } catch (error) {
      spinner.stop(`❌ Failed to configure project: ${error}`)
      throw error
    }
  }

  /**
   * createPackageJson
   * @desc package.json 내용 생성
   */
  private async createPackageJson(): Promise<PackageJson> {
    const { projectName, language, additionalDependencies, additionalDevDependencies } = this.projectOption

    if (language.includes("typescript")) {
      additionalDevDependencies.push("typescript", 'ts-node', "@types/node")
    }

    if (language.includes("swc")) {
      additionalDevDependencies.push("@swc/core", "@swc/cli")
    }

    const scripts: Record<string, string> = language.includes("typescript")
      ? language.includes("swc")
        ? { build: "tsc", dev: "node --loader ts-node/esm src/index.ts" }
        : { build: "tsc", dev: "ts-node src/index.ts" }
      : { dev: "node src/index.js" }

    return {
      name: projectName,
      version: "0.0.1",
      description: "A Node.js project",
      type: "module",
      exports: './dist/index.js',
      scripts,
      keywords: [],
      engines: { node: ">=20.0.0" },
      author: "",
      license: "ISC",
      dependencies: await NpmUtil.getPackageVersion(additionalDependencies),
      devDependencies: await NpmUtil.getPackageVersion(additionalDevDependencies),
    }
  }
} 
