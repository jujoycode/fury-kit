import { BaseError } from "#errors";

export class CommandExecutionFailedError extends BaseError {
  constructor(message: string) {
    super(40004, `command execution failed: ${message}`)
  }
}