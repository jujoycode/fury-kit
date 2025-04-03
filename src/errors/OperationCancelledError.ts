import { BaseError } from "#errors/BaseError.js"

/**
 * OperationCancelledError
 * @desc 사용자가 작업을 취소했을 때 발생하는 에러
 */
export class OperationCancelledError extends BaseError {
  constructor() {
    super(20001, 'Operation cancelled')

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OperationCancelledError)
    }
  }
}
