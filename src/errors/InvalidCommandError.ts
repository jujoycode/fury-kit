import { BaseError } from '#errors/BaseError.js'

export class InvalidCommandError extends BaseError {
  constructor() {
    super(10001, 'Invalid command')
  }
}
