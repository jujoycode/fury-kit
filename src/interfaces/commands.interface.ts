export interface Command {
  execute(): void | Promise<void>
  undo(): boolean | Promise<boolean>
  safeExecute(): void | Promise<void>
}

export interface CommandType {
  createProject?: boolean
  git?: boolean
}
