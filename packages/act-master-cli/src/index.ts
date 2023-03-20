import { generateActionList } from './commands/generate-action-list';
import { helpCommand } from './commands/help';
import { initConfig } from './commands/init-config';

const command = process.argv[2];

const run = async () => {
  if (command === 'init') {
    await initConfig();
    return;
  }

  if (command === 'generate' || command === 'g') {
    await generateActionList();
    return;
  }

  helpCommand();
};

run();
