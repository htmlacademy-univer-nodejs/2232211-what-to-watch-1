import { ICommand } from './command.interface.js';
import { readFileSync } from 'fs';
import * as chalk from 'chalk';

export default class VersionCommand implements ICommand {
  public readonly commandName = '--version';

  execute(): void {
    const contentPageJSON = readFileSync('../package.json', 'utf-8');
    const content = JSON.parse(contentPageJSON);
    console.log(`${chalk.green('Version:')} ${content.version}`);
  }
}
