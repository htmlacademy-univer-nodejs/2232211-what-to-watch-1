#!/usr/bin/env node

import CLIApplication from './app/CLIApplication.js';
import HelpCommand from './app/commands/helpCommand.js';
import ImportCommand from './app/commands/importCommand.js';
import VersionCommand from './app/commands/versionCommand.js';

const app = new CLIApplication([
  new HelpCommand(),
  new ImportCommand(),
  new VersionCommand()
]);

app.ProcessCommands(process.argv);
