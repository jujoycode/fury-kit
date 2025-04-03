import { GitInitCommand } from "#commands/git/GitInitCommand.js"
import { GitDiffCommand } from "#commands/git/GitDiffCommand.js"
import { GitPullCommand } from "#commands/git/GitPullCommand.js"
import { GitPushCommand } from "#commands/git/GitPushCommand.js"
import { InvalidCommandError } from "#errors/index.js"
import type { GitCommandType } from "#interfaces/commands.interface.js"

export class GitCommandFactory {
  private gitCommand: GitCommandType

  constructor(gitCommand: GitCommandType) {
    this.gitCommand = gitCommand
  }

  public getGitCommand() {
    switch (this.gitCommand) {
      case "init": {
        return new GitInitCommand()
      }
      case "diff": {
        return new GitDiffCommand()
      }
      case "pull": {
        return new GitPullCommand()
      }
      case "push": {
        return new GitPushCommand()
      }

      default: {
        throw new InvalidCommandError()
      }
    }
  }
}
