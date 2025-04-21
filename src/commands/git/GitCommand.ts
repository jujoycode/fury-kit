import { BaseCommand } from '#commands/BaseCommand.js'
import { GitCommandFactory } from '#factories/command/GitCommandFactory.js'
import type { GitCommandType } from '#interfaces/commands.interface.js'

export class GitCommand extends BaseCommand {
  constructor() {
    super()
  }

  /**
   * execute
   * @desc Git 명령어 실행
   */
  public async execute() {
    console.clear()
    this.prompts.start()

    const command = await this.prompts.choice<GitCommandType>({
      message: 'Select the action you want:',
      options: [
        { label: 'Init', value: 'init' },
        { label: 'Commit & Push', value: 'push' },
        { label: 'Pull', value: 'pull' },
        { label: 'Diff', value: 'diff' },
        // Merge
        // Managing Branches
      ],
    })

    const gitCommand = new GitCommandFactory(command).getGitCommand()
    await gitCommand.safeExecute()
  }

  /**
   * undo
   * @desc Git 명령어 실행 취소
   */
  public async undo() {
    return false
  }

  /**
   * isRollbackable
   * @desc Git 명령어 롤백 가능 여부
   */
  public isRollbackable() {
    return true
  }
}
