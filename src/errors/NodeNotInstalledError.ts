import { BaseError } from "#errors/BaseError.js"

export class NodeNotInstalledError extends BaseError {
  constructor() {
    super(60001, "Not installed Node.js")
  }
}
