#!/usr/bin/env node

import 'reflect-metadata';
import CliApplication from './app/cli-application.js';
import HelpCommand from './app/commands/help-сommand.js';
import ImportCommand from './app/commands/import-сommand.js';
import VersionCommand from './app/commands/version-сommand.js';
import GenerateCommand from './app/commands/generate-command.js';

const app = new CliApplication([
  new HelpCommand(),
  new ImportCommand(),
  new VersionCommand(),
  new GenerateCommand()
]);

app.ProcessCommands(process.argv);
