import { BaseError } from "#errors"

export class NodeNotInstalledError extends BaseError {
  constructor() {
    super(60001, "Not installed Node.js")
  }
}
