import { BaseError } from "#errors"

export class InvalidCommandError extends BaseError {
  constructor() {
    super(10001, "Invalid command")
  }
}
