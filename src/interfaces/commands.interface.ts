export interface Command {
  execute(): void | Promise<void>
  undo(): void | Promise<void>
  safeExecute(): void | Promise<void>
}

export interface CommandType {
  createProject?: boolean
  git?: boolean
}
