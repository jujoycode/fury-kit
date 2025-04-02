#!/usr/bin/env node

import { Command } from "commander"
import { CommandFactory } from "#factories/CommandFactory.js"
import { isNodeInstalled } from "#common/systemUtil.js"
import { BaseError, NodeNotInstalledError } from "#errors"

async function main() {
  try {
    if (!isNodeInstalled()) {
      throw new NodeNotInstalledError()
    }

    const program = new Command()
      .name("fury")
      .version("1.0.0")
      .description("Fury is a tool that helps developers in a variety of tasks.")
      .option("-g, --git", "Git command")

    const command = new CommandFactory(program.opts()).getCommand()
    await command.safeExecute()
  } catch (error) {
    if (error instanceof BaseError) {
      console.error({ code: error.code, message: error.message, cause: error.cause })
    } else console.error('Unknown error', error)

    process.exit(1)
  }
}

main()
