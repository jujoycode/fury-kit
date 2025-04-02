import { execa } from "execa"
import { BaseError, CommandExecutionFailedError } from "#errors"
import type { CommandParams, ExecutionResult } from "#interfaces/libs.interface.js"

export class Executor {
  private static instance: Executor

  private constructor() { }

  public static getInstance(): Executor {
    if (!Executor.instance) {
      Executor.instance = new Executor()
    }

    return Executor.instance
  }

  /**
   * executeCommand
   * @desc Shell 명령어 실행
   */
  public async executeCommand({ command, args, options }: CommandParams): Promise<ExecutionResult> {
    try {
      const result = await execa(command, args, options)

      return {
        success: true,
        stdout: result.stdout,
        stderr: result.stderr
      }
    } catch (error) {
      return {
        success: false,
        error: new CommandExecutionFailedError(error instanceof BaseError ? error.message : "Unknown error")
      }
    }
  }
}