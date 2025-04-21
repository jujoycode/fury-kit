import { Prompts } from '#libs/prompts.js'
import type { BaseError } from '#errors/index.js'
import type { Command } from '#interfaces/commands.interface.js'
export abstract class BaseCommand implements Command {
  protected prompts = Prompts

  constructor() {}

  /**
   * execute
   * @desc 커맨드 실행
   */
  abstract execute(): void | Promise<void>

  /**
   * undo
   * @desc 커맨드 실행 취소
   */
  abstract undo(): boolean | Promise<boolean>

  /**
   * isRollbackable
   * @desc 롤백 가능 여부
   */
  abstract isRollbackable(error?: Error | BaseError): boolean

  /**
   * safeExecute
   * @desc 커맨드 실패 시 롤백 수행
   */
  public async safeExecute(): Promise<void> {
    try {
      await this.execute()
    } catch (error) {
      this.prompts.log.warn('⚠️  An error occurred while executing the command')

      if (this.isRollbackable(error as Error | BaseError)) {
        this.prompts.log.info('🔄 Starting rollback process...')

        try {
          const isSuccess = await this.undo()

          if (isSuccess) {
            this.prompts.log.success('✅ Rollback completed successfully')
          } else {
            this.prompts.log.error('❌ Rollback process failed')
          }
        } catch (rollbackError) {
          this.prompts.log.error('❌ New error occurred during rollback')
          if (rollbackError instanceof Error) {
            this.prompts.log.error(`Rollback error: ${rollbackError.message}`)
          }
        }
      }

      throw error
    }
  }
}
