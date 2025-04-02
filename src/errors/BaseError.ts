export class BaseError extends Error {
  public code: number
  public message: string
  public cause?: Error

  constructor(code: number, message: string, cause?: Error) {
    super(message)
    Object.setPrototypeOf(this, this.constructor.prototype)

    this.name = this.constructor.name
    this.code = code
    this.message = message
    this.cause = cause

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
