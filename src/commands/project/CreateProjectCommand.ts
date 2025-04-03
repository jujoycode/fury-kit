import pc from "picocolors"
import { isEmpty } from "es-toolkit/compat"
import { deleteDirectory } from "#common/fsUtil.js"
import { BaseCommand } from "#commands/BaseCommand.js"
import { ProjectCreatorFactory } from "#factories/ProjectCreatorFactory.js"
import { ResourceConflictError, type BaseError } from "#errors/index.js"
import type { ProjectOption, PackageManager, Framework, Language } from "#interfaces/project.interface.js"
export class CreateProjectCommand extends BaseCommand {
  private projectOption = {} as ProjectOption

  constructor() {
    super()
  }

  public async execute() {
    console.clear()
    this.prompts.start()

    // 1. 프로젝트 정보 수집
    await this.getInfomation()

    // 2. 프로젝트 생성
    const projectCreator = new ProjectCreatorFactory(this.projectOption).getCreator()
    await projectCreator.createProject()
  }

  public async undo() {
    // * 이번 실행에서 디렉토리를 생성했는지 검증 후 삭제
    try {
      await deleteDirectory(this.projectOption.projectName)
    } catch (error) {
      return false
    }

    return true
  }

  public isRollbackable(error?: Error | BaseError) {
    if (error instanceof ResourceConflictError) {
      return false
    }

    return true
  }

  /**
   * getInfomation
   * @desc 프로젝트 정보 수집
   */
  private async getInfomation() {
    this.projectOption = await this.prompts.group<ProjectOption>({
      // 1. 프로젝트명
      projectName: () =>
        this.prompts.ask({
          message: "What is the name of your project?",
          initialValue: "toy-project",
          validate: (value) => {
            if (value.length === 0) {
              return "Project name is required"
            }

            return ""
          },
        }),

      // 2. Package Manager
      packageManager: () =>
        this.prompts.choice({
          message: "What is the package manager of your project?",
          initialValue: 'pnpm',
          options: [
            {
              label: pc.redBright("npm"),
              value: "npm",
            },
            {
              label: pc.blueBright("yarn"),
              value: "yarn",
            },
            {
              label: pc.yellowBright("pnpm"),
              value: "pnpm",
              hint: 'recommended',
            },
          ],
        }) as Promise<PackageManager>,

      // 3. Framework
      framework: () =>
        this.prompts.choice({
          message: "What is the framework of your project?",
          options: [
            {
              label: pc.greenBright("Node"),
              value: "nodejs",
            },
            // {
            //   label: pc.blueBright("React"),
            //   value: "react",
            // },
            // {
            //   label: pc.green("Vue"),
            //   value: "vue",
            // },
          ],
        }) as Promise<Framework>,

      // 4. 대상 언어
      language: () =>
        this.prompts.choice({
          message: "What is your preferred language?",
          initialValue: 'typescript-swc',
          options: [
            {
              label: pc.yellow("JavaScript"),
              value: "javascript",
            },
            {
              label: pc.blue("TypeScript"),
              value: "typescript",
            },
            {
              label: pc.blue("TypeScript + SWC"),
              value: "typescript-swc",
              hint: 'recommended',
            },
          ],
        }) as Promise<Language>,

      // 5. 옵션 기능
      projectOptions: () =>
        this.prompts.multiChoice({
          message: "Do you have any options for the project?",
          required: false,
          options: [
            {
              label: "ESLint",
              value: "eslint",
            },
            {
              label: "Prettier",
              value: "prettier",
            },
          ],
        }) as Promise<string[]>,

      // 6.1 추가 의존성 기입
      additionalDependencies: () =>
        this.prompts
          .ask({
            message: "Is there any additional dependence of the project? (write comma separated)",
            placeholder: "ex) es-toolkit, ...",
          })
          .then((value) => (isEmpty(value) ? [] : value.split(",").map((dep) => dep.trim()))),

      // 6.2 추가 개발 의존성 기입
      additionalDevDependencies: () =>
        this.prompts
          .ask({
            message: "Is there any additional development dependence of the project? (write comma separated)",
            placeholder: "ex) webpack, ...",
          })
          .then((value) => (isEmpty(value) ? [] : value.split(",").map((dep) => dep.trim()))),

      // 7. 의존성 설치 여부
      installDependencies: () =>
        this.prompts.accept({
          message: "Do you want to install dependencies? (Installed with the latest version)",
        }),
    })
  }
}
