
import { Prompts } from "#libs/prompts.js"
import type { Command } from "#interfaces/commands.interface.js"

export abstract class BaseCommand implements Command {
  protected prompts = Prompts

  constructor() { }

  /**
   * execute
   * @desc 커맨드 실행
   */
  abstract execute(): void | Promise<void>;

  /**
   * undo
   * @desc 커맨드 실행 취소
   */
  abstract undo(): void | Promise<void>;

  /**
   * safeExecute
   * @desc 커맨드 실패 시 롤백 수행
   */
  public async safeExecute(): Promise<void> {
    try {
      await this.execute()
    } catch (error) {
      await this.undo()
      throw error
    }
  }
}
