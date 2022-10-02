import { ICommand } from './command.interface.js';
import * as chalk from 'chalk';

export default class HelpCommand implements ICommand {
  readonly commandName = '--help';

  execute(): void {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js ${chalk.green('--<command>')} ${chalk.grey('[arguments]')}
        Команды:
            ${chalk.green('--version:')}                  # выводит номер версии
            ${chalk.green('--help:')}                     # печатает этот текст
            ${chalk.green('--import <path>:')}            # импортирует данные из TSV
        `);
  }

}
