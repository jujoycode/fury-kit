import { BaseCommand } from '#commands/BaseCommand.js'

export class GitPushCommand extends BaseCommand {
  constructor() {
    super()
  }

  /**
   * execute
   * @desc Git 명령어 실행
   */
  public async execute() {}

  /**
   * undo
   * @desc Git 명령어 실행 취소
   */
  public async undo() {
    return true
  }

  /**
   * isRollbackable
   * @desc Git 명령어 롤백 가능 여부
   */
  public isRollbackable() {
    return true
  }
}
