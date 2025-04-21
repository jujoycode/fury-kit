#!/usr/bin/env node

import pc from 'picocolors'
import { Command } from 'commander'
import { Prompts } from '#libs/prompts.js'
import { isNodeInstalled } from '#common/systemUtil.js'
import { CommandFactory } from '#factories/command/CommandFactory.js'
import { BaseError, NodeNotInstalledError } from '#errors/index.js'

async function main() {
  try {
    if (!isNodeInstalled()) {
      throw new NodeNotInstalledError()
    }

    const program = new Command()
      .name('fury')
      .version('1.0.0')
      .description('Fury is a tool that helps developers in a variety of tasks.')
      .option('-g, --git', 'Git command')

    program.parse(process.argv)

    const command = new CommandFactory(program.opts()).getCommand()
    await command.safeExecute()
  } catch (error) {
    const errorMessage =
      error instanceof BaseError
        ? `\n${pc.bgRed(pc.white(' FAILED WITH '))} ${pc.red(`[${error.code}]`)} ${pc.bold(error.message)}\n`
        : `\n${pc.bgRed(pc.white(' UNEXPECTED ERROR '))} ${error}\n`

    Prompts.log.error(errorMessage)
  }
}

main()
