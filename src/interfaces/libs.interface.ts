import type { Options, Result } from "execa"

export interface ExecutionResult {
  success: boolean
  stdout?: Result<Options>['stdout']
  stderr?: Result<Options>['stderr']
  error?: Error
}

export interface CommandParams {
  command: string
  args?: string[]
  options?: Options
}
