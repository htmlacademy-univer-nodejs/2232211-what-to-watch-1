export interface ICommand {
  readonly commandName: string;

  execute(...params: string[]): void;
}
