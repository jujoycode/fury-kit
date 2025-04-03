import { Prompts } from '#libs/prompts.js';
import { Executor } from '#libs/executor.js';
import { createFile, combinePath } from '#common/fsUtil.js'
import type { ProjectOption } from "#interfaces/project.interface.js";
import type { CommandParams } from "#interfaces/libs.interface.js";

export abstract class BaseProjectCreatorFactory {
  protected prompts = Prompts
  protected executor = Executor.getInstance()

  constructor(protected readonly projectOption: ProjectOption) { }

  protected abstract prepareProject(): Promise<void>
  protected abstract createProjectStructure(): Promise<void>
  protected abstract configureProject(): Promise<void>

  /**
   * createProject
   * @desc 프로젝트 생성
   */
  public async createProject(): Promise<void> {
    await this.prepareProject()
    await this.createProjectStructure()
    await this.configureProject()
    await this.finalizeProject()
  }

  /**
 * getBaseInstallCommand
 * @desc 기본 패키지 설치 명령어 반환
 */
  protected getBaseInstallCommand(): CommandParams {
    switch (this.projectOption.packageManager) {
      case 'npm': return { command: 'npm', args: ['install'] }
      case 'yarn': return { command: 'yarn', args: [] }
      case 'pnpm': return { command: 'pnpm', args: ['install'] }
    }
  }

  /**
   * getInstallCommand
   * @desc 패키지 설치 명령어 반환
   */
  protected getInstallCommand(dependencies: string[]): string {
    const { packageManager, projectName } = this.projectOption;
    const deps = dependencies.join(' ');

    switch (packageManager) {
      case 'npm': return `cd ${projectName} && npm install ${deps} `
      case 'yarn': return `cd ${projectName} && yarn add ${deps} `
      case 'pnpm': return `cd ${projectName} && pnpm add ${deps} `
    }
  }

  /**
   * finalizeProject
   * @desc 프로젝트 최종 설정
   */
  protected async finalizeProject(): Promise<void> {
    const { projectName } = this.projectOption;
    const spinner = this.prompts.spinner();
    spinner.start('Finalizing project');

    try {
      // .gitignore 생성
      const gitignoreContent = `node_modules /\n.DS_Store\ndist /\n.env\n`;
      createFile(combinePath(projectName, '.gitignore'), gitignoreContent);

      // README.md 생성
      const readmeContent = ``;
      createFile(combinePath(projectName, 'README.md'), readmeContent);

      if (this.projectOption.installDependencies) {
        // 패키지 설치
        const { command, args } = this.getBaseInstallCommand()
        const commandResult = await this.executor.executeCommand({ command, args, options: { cwd: this.projectOption.projectName } })

        if (!commandResult.success) {
          this.prompts.log.error('Failed to install dependencies')
          throw commandResult.error
        }
      }

      spinner.stop('🙌 Project finalized\n');

      this.prompts.log.info(
        `🎉  Successfully created project \x1b[33m${this.projectOption.projectName}\x1b[0m.`
      )
      this.prompts.log.info(
        `👉  Get started with the following commands:\n    $ \x1b[33mcd\x1b[0m ${this.projectOption.projectName}\n    $ code .`
      )

      this.prompts.end('Happy coding! 🚀')
    } catch (error) {
      spinner.stop(`❌ Failed to finalize project`);
      throw error;
    }
  }
}