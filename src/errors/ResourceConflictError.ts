import { BaseError } from "#errors/BaseError.js"

export class ResourceConflictError extends BaseError {
  constructor(message: string) {
    super(40003, `${message} resource conflict`)
  }
}
