import { NodeProjectCreator } from "#creators/NodeProjectCreator.js";
import type { ProjectOption } from "#interfaces/project.interface.js";
import type { BaseProjectCreatorFactory } from "#factories/BaseProjectCreatorFactory.js";

export class ProjectCreatorFactory {
  constructor(protected readonly projectOption: ProjectOption) { }

  public getCreator(): BaseProjectCreatorFactory {
    switch (this.projectOption.framework) {
      case "nodejs": {
        return new NodeProjectCreator(this.projectOption)
      }
    }
  }
}
