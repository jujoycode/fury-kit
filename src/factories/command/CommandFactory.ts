import { isEmpty } from "es-toolkit/compat"
import { InvalidCommandError } from "#errors/index.js"
import { CreateProjectCommand } from "#commands/project/CreateProjectCommand.js"
import { GitCommand } from "#commands/git/GitCommand.js"
import type { Command, CommandType } from "#interfaces/commands.interface.js"

// * Command 생성을 해주는 Factory, 인자로 받은 값을 통해 커맨드 생성 및 Client 역할을 해주는 클래스

export class CommandFactory {
  private commandType: CommandType

  constructor(commandType: CommandType) {
    if (isEmpty(commandType)) {
      commandType = { createProject: true }
    }

    this.commandType = commandType
  }

  public getCommand(): Command {
    switch (true) {
      case this.commandType.createProject: {
        return new CreateProjectCommand()
      }
      case this.commandType.git: {
        return new GitCommand()
      }

      default: {
        throw new InvalidCommandError()
      }
    }
  }
}
