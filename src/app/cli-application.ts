import { ICommand } from './commands/command.interface.js';

type ParsedCommands = Record<string, string[]>;

export default class CliApplication {
  private readonly defaultCommand = '--help';
  private readonly commands: Record<string, ICommand>;

  constructor(commands: ICommand[]) {
    this.commands = {};

    commands.reduce((acc, command) => {
      acc[command.commandName] = command;
      return acc;
    }, this.commands);
  }

  public ProcessCommands(args: string[]): void {
    const parsedCommands = this.ParseCommands(args);
    Object.keys(parsedCommands)
      .forEach((commandName) => {
        const parsedArgs = parsedCommands[commandName] ?? [];
        this.getCommand(commandName).execute(...parsedArgs);
      });
  }

  private ParseCommands(args: string[]): ParsedCommands {
    const commands: ParsedCommands = {};
    let currentCommand = '';
    return args.reduce((acc, item) => {
      item = item.trim();
      if (item.startsWith('--')) {
        acc[item] = [];
        currentCommand = item;
      } else if (currentCommand && item) {
        acc[currentCommand].push(item);
      }
      return acc;
    }, commands);
  }

  private getCommand(commandName: string): ICommand {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }
}
